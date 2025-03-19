/**
 *      StreamRoller Copyright 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 *      StreamRoller is an all in one streaming solution designed to give a single
 *      'second monitor' control page and allow easy integration for configuring
 *      content (ie. tweets linked to chat, overlays triggered by messages, hue lights
 *      controlled by donations etc)
 * 
 *      This program is free software: you can redistribute it and/or modify
 *      it under the terms of the GNU Affero General Public License as published
 *      by the Free Software Foundation, either version 3 of the License, or
 *      (at your option) any later version.
 * 
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU Affero General Public License for more details.
 * 
 *      You should have received a copy of the GNU Affero General Public License
 *      along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @extension RandomFact
 * Supplies random facts
 */
// ############################# RANDOMFACT.js ##############################
// Provides random facts and information on request
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 03-April-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
//
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// logger will allow you to log messages in the same format as the system messages
import * as logger from "../../backend/data_center/modules/logger.js";
//var http = require('http');
import https from "https";
// extension helper provides some functions to save you having to write them.
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
// these lines are a fix so that ES6 has access to dirname etc
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

let localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatHandle: null,
    status: { color: "red" }
};
const default_serverConfig = {
    __version__: 0.1,
    extensionname: "randomfact",
    channel: "RANDOMFACT_CHANNEL",
    randomfactenabled: "off",
};

let serverConfig = structuredClone(default_serverConfig)

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Random fact will grab a random phrase or saying for your enjoyment",
    version: "0.2",
    channel: serverConfig.channel,
    // these are messages we can sendout that other extensions might want to use to trigger an action
    triggers:
        [
            {
                name: "RandfactPoster",
                displaytitle: "Random fact received",
                description: "An interesting or amusing random fact was received",
                messagetype: "trigger_RandomFact",
                parameters: { randomFact: "" }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "RandfactRequest",
                displaytitle: "Request Random Fact",
                description: "Requests a random fact",
                messagetype: "action_RequestRandomFact",
                parameters: {}
            }
        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {object:Express} app 
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    localConfig.heartBeatTimeout = heartbeat;
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * @param {String} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Called when websocket connects
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));

    // start our heartbeat timer
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Called when we receive a websocket message
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    //logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "message received ", server_packet);

    if (server_packet.type === "ConfigFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "action_RequestRandomFact")
        {
            sendRandomFact();
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "TriggerAndActions",
                        serverConfig.extensionname,
                        triggersandactions,
                        "",
                        server_packet.from
                    ),
                    "",
                    server_packet.from
                )
            )
        }
        else if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            // set our config values to the ones in message
            serverConfig.randomfactenabled = "off";
            // NOTE: this will ignore new items in the page that we don't currently have in our config
            for (const [key] of Object.entries(serverConfig))
            {
                if (key in extension_packet.data)
                    serverConfig[key] = extension_packet.data[key];
            }
            if (serverConfig.randomfactenabled === "off")
                localConfig.status.color = "red"
            else
                localConfig.status.color = "green"
            // save our data to the server for next time we run
            SaveConfigToServer();
            // broadcast our modal out so anyone showing it can update it
            SendSettingsWidgetSmall("");
        }
        else
        {
            //logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
        }

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        // channel might not exist yet, extension might still be starting up so lets reschedule the join attempt
        setTimeout(() =>
        {
            // resent the register command to see if the extension is up and running yet
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);

    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
        || server_packet.type === "ExtensionMessage"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Send our SettingsWidgetSmall to whoever requested it
 * @param {String} extensionname 
 */
function SendSettingsWidgetSmall (extensionname)
{
    fs.readFile(__dirname + "/randomfactsettingswidgetsmall.html", function (err, fileData)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalString = fileData.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                {
                    modalString = modalString.replaceAll(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
                        "",
                        extensionname,
                        serverConfig.channel
                    ),
                    "",
                    extensionname)
            )
        }
    });
}
// ============================================================================
//                           FUNCTION: sendRandomFact
// ============================================================================
/**
 * sends a random fact to the extension
 * @param {String} from 
 */
function sendRandomFact (delay = 1000, counter = 5)
{
    if (serverConfig.randomfactenabled == "off")
        return;
    var body = "";
    let Buffer = "";
    let fact = "";
    var options = { host: "uselessfacts.jsph.pl", path: "/api/v2/facts/random?language=en", };
    try
    {
        var req = https.get(options, (res) =>
        {
            var bodyChunks = [];
            res.on("data", function (chunk)
            {
                bodyChunks.push(chunk);
            }).on("end", function ()
            {
                body = Buffer.concat(bodyChunks);
                fact = JSON.parse(body).text
                //console.log(JSON.stringify(fact, null, 2))
                if (fact == "")
                {
                    if (counter > 0)
                    {
                        setTimeout(() =>
                        {
                            sendRandomFact(delay + 500, counter - 1)

                        }, delay)
                    }
                    return;
                }
                localConfig.status.color = "green"
                let message = findtriggerByMessageType("trigger_RandomFact")
                message.parameters.randomFact = fact
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "ChannelData",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "trigger_RandomFact",
                            serverConfig.extensionname,
                            message,
                            serverConfig.channel,
                        ),
                        serverConfig.channel,
                    ));
            })
        });
        req.on("error", function (e)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".sendRandomFact", "Error getting quote", e.message);
            localConfig.status.color = "orange"
        });
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".sendRandomFact", "Error getting quote", e.message);
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".sendRandomFact", body);
        localConfig.status.color = "orange"
    }

}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * save our config to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig));
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * Find a trigger via it's name
 * @param {string} messagetype 
 * @returns trigger
 */
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase()) return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends heartbeat messages so other extensions can monitor status
 */
function heartBeatCallback ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { color: localConfig.status.color },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

