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
// ############################# users.js ##############################
// This extension handles users/viewers data. ie a place to store channel points etc
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 09-Mar-2023
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// how many times we have attempted to connect on failure
let ServerConnectionAttempts = 0;

const localConfig = {
    OUR_CHANNEL: "USERS_CHANNEL",
    EXTENSION_NAME: "users",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    MaxServerConnectionAttempts: 20
};
const default_serverConfig = {
    __version__: 0.1,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    demovar1: "on",  // example of a checkbox. "on" or "off"
    demotext1: "demo text", // example of a text field
};
let serverConfig = structuredClone(default_serverConfig)
const serverData = { userData: { twitch: {}, youtube: {} } }

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "User interactions",
    // these are messages we can sendout that other extensions might want to use to trigger an action
    // these are messages we can receive to perform an action
    triggers:
        [
            {
                name: "UsersNewChatter",
                displaytitle: "First Time Poster",
                description: "Someone has posted in the chat for the first time",
                messagetype: "trigger_NewChatter",
                channel: serverConfig.channel,
                parameters: {
                    name: "",
                    message: "",
                    platform: ""
                }
            }
        ],
}

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "config.DataCenterSocket connection failed:", err);
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", localConfig.EXTENSION_NAME));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL)

    );

    /*    sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("JoinChannel", localConfig.EXTENSION_NAME, "STREAMLABS_ALERT")
        );
    */
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    //logger.log(localConfig.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "message received ", server_packet);

    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);


        }
    }
    else if (server_packet.type === "DataFile" && server_packet.data != "")
    {
        // check it is our data
        if (server_packet.to === serverConfig.extensionname)
            if (server_packet.data.userData)
                serverData.userData = JSON.parse(JSON.stringify(server_packet.data.userData));
        SaveDataToServer();
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            // adminmodel code not yet updated
            //SendSettingsWidgetSmall(extension_packet.from);

        }
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                serverConfig.demovar1 = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
            }
        }
        else if (extension_packet.type === "UpdateUserData")
        {

            if (server_packet.to === localConfig.EXTENSION_NAME)
            {
                let newuser = false
                // new platform
                if (!serverData.userData[extension_packet.data.platform])
                    serverData.userData[extension_packet.data.platform] = [];
                // new users
                if (!serverData.userData[extension_packet.data.platform][extension_packet.data.name])
                {
                    newuser = true;
                    serverData.userData[extension_packet.data.platform][extension_packet.data.name] = {};
                }
                if (newuser)
                {
                    serverData.userData[extension_packet.data.platform][extension_packet.data.name].firstseen = Date.now()
                    sendNewUserTrigger(extension_packet.data)
                }
                serverData.userData[extension_packet.data.platform][extension_packet.data.name].lastseen = Date.now()
                SaveDataToServer();
            }
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
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    /*    else if (server_packet.type === "ChannelData")
    {
        if (server_packet.dest_channel === "STREAMLABS_ALERT")
            process_streamlabs_alert(server_packet);
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
*/
    else if (server_packet.type === "UnknownChannel")
    {
        if (ServerConnectionAttempts++ < localConfig.MaxServerConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", localConfig.EXTENSION_NAME, server_packet.data
                    ));
            }, 5000);
        }
    }

    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}


// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page 
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
{

    fs.readFile(__dirname + "/userssettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        localConfig.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: sendNewUserTrigger
// ============================================================================
function sendNewUserTrigger (data)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_NewChatter",
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket(
        "SaveConfig",
        localConfig.EXTENSION_NAME,
        serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
// Desription:save data on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SaveDataToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveData",
            localConfig.EXTENSION_NAME,
            serverData));
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
