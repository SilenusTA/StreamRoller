/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    host: "http://localhost",
    port: "3000",
    heartBeatHandle: null,
    heartBeatTimeout: "5000",
    DataCenterSocket: null,
    extensions: [],
    channels: [],
}

// defaults for the serverConfig (our saved persistant data)
const default_serverConfig = {
    __version__: "0.1",
    extensionname: "autopilot",
    channel: "AUTOPILOT",
    displaySettings: {
        selectedGroup: ""
    }
}
let serverConfig = structuredClone(default_serverConfig);

// ============================================================================
//                           FUNCTION: startClient
// ============================================================================
async function startServer (app, host, port, heartbeat)
{
    // setup the express app that will handle client side page requests
    //app.use("/images/", express.static(__dirname + '/public/images'));
    console.log("autopilot:startserver")
    localConfig.host = host;
    localConfig.port = port;
    try
    {
        ConnectToDataCenter(localConfig.host, localConfig.port);
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + "autopilot.startServer", "initialise failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: ConnectToDataCenter
// ============================================================================
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
    } catch (err)
    {
        logger.err(serverConfig.extensionname + "datahandler.initialise", "DataCenterSocket connection failed:", err);
    }
}
function onDataCenterDisconnect (reason)
{
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestConfig",
            serverConfig.extensionname
        ));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    RequestExtList();
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CONFIG
    // -------------------------------------------------------------------------------------------------
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname
                    + " ConfigFile Updated", "The config file has been Updated to the latest version v"
                    + default_serverConfig.__version__ + ". Your settings may have changed " + "\x1b[0m");
            }
            else
            {
                // update our config
                if (server_packet.data != "")
                    serverConfig = structuredClone(server_packet.data)
            }
            // update server log, mainly here if we have added new default options when a user
            // updates their version of streamroller
            SaveConfigToServer();
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                   RECEIVED EXTENSION LIST
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionList")
    {
        localConfig.extensions = server_packet.data
        RequestChList();
        RequestTriggers();
    }
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CHANNEL LIST
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ChannelList")
    {
        localConfig.channels = server_packet.data
        localConfig.channels.forEach(element =>
        {
            if (element != serverConfig.channel)
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        serverConfig.extensionname,
                        element
                    ));
        });
    }
    // -------------------------------------------------------------------------------------------------
    //                      ### EXTENSION MESSAGE ###
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;

        // -------------------------------------------------------------------------------------------------
        //                   RECEIVED trigger and action data
        // -------------------------------------------------------------------------------------------------
        if (extension_packet.type === "TriggerAndActions")
        {
            if (extension_packet.to == serverConfig.extensionname)
                receivedTrigger(extension_packet.data)
        }
        // -------------------------------------------------------------------------------------------------
        //                   RECEIVED Unhandled extension message
        // -------------------------------------------------------------------------------------------------
        else
        {
            //    logger.log(serverConfig.extensionname + ".onDataCenterMessage", "ExtensionMessage not handled ", extension_packet.type, " from ", extension_packet.from);
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                   RECEIVED CHANNEL DATA
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        // -------------------------------------------------------------------------------------------------
        //                           CheckForTrigger (extensions fired a trigger)
        // -------------------------------------------------------------------------------------------------
        if (extension_packet.type.startsWith("trigger_"))
            CheckTriggers(extension_packet)
    }
    // -------------------------------------------------------------------------------------------------
    //                           UNKNOWN CHANNEL MESSAGE RECEIVED
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "UnknownChannel")
    {
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        console.log("UnknownChannel", server_packet)

        if (server_packet.data != "" && server_packet.channel != undefined)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        serverConfig.extensionname,
                        server_packet.data
                    ));
            }, 10000);

        }
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "HeartBeat"
        || server_packet.type === "UnknownExtension"
        || server_packet.type === "ChannelJoined"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled message type:", server_packet);

}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig,
        ));
}

// ============================================================================
//                           FUNCTION: receivedTrigger
// ============================================================================
function receivedTrigger (data)
{
    //console.log("receivedTriggers from", data.extensionname)

}
// ============================================================================
//                           FUNCTION: CheckTriggers
// ============================================================================
function CheckTriggers (data)
{
    //console.log("CheckTriggers", data)
}
// ============================================================================
//                           FUNCTION: RequestExtList
// ============================================================================
function RequestExtList ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestExtensionsList",
            serverConfig.extensionname,
        ));
}
// ============================================================================
//                           FUNCTION: RequestTriggers
// ============================================================================
function RequestTriggers ()
{
    localConfig.extensions.forEach(ext =>
    {
        sr_api.sendMessage(
            localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SendTriggerAndActions",
                    serverConfig.extensionname,
                    "",
                    "",
                    ext
                ),
                "",
                ext
            ));
    }
    )
}
// ============================================================================
//                           FUNCTION: RequestChList
// ============================================================================
function RequestChList ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestChannelsList",
            serverConfig.extensionname,
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let status = false;
    if (serverConfig.autopilotenabled == "on")
        status = true;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: status },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
export { startServer };