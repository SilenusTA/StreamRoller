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
 * @extension Users
 * Collects data on users.i.e. last seen, a buffer of messages etc. 
 * TBD. needs more work due to size of data and finding a useful reason (from a streamers perspective)
 * Awaiting requests for what it should do before advancing the extension
 */
// ############################# users.js ##############################
// This extension handles users/viewers data. ie a place to store channel points etc
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 09-Mar-2023
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
// these lines are a fix so that ES6 has access to dirname etc
import https from "https";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// how many times we have attempted to connect on failure
let ServerConnectionAttempts = 0;
let millisecondsInDay = 86400000;
const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    MaxServerConnectionAttempts: 20,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
};
const default_serverConfig = {
    __version__: 0.1,
    extensionname: "users",
    channel: "USERS_CHANNEL",
    enableusersextension: "on",
    cleardatausersextension: "off",
    maxuserstokeep: "50",
    maxusersmessagestokeep: "100",
    // how often to update the profile data for a user (default 30 days)
    profiletimeout: "30"
};
let serverConfig = structuredClone(default_serverConfig)
const serverData = { userData: { twitch: {}, youtube: {} } }

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "User interactions",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "UsersNewChatter",
                displaytitle: "First Time Poster",
                description: "Someone has posted in the chat for the first time",
                messagetype: "trigger_NewChatter",
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
/**
 * Starts the extension using the given data.
 * @param {object:Express} app 
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heartbeat passed:", heartbeat);
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "config.DataCenterSocket connection failed:", err);
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
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "TWITCH_CHAT"));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "TWITCH"));
    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)

    // get a main list of twitch users who are bots
    getTwitchBotStatusList()
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
            SendSettingsWidgetSmall(extension_packet.from);
        }
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {

                if (serverConfig.cleardatausersextension == "on")
                    serverData.userData = { twitch: {}, youtube: {} };
                SaveDataToServer();

                serverConfig.enableusersextension = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                    serverConfig[key] = value;
                serverConfig.cleardatausersextension = "off";
                SaveConfigToServer();
                SendSettingsWidgetSmall("");
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
        // add this in to see all messages that are not handled
        /*
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
        */

    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        //serverData.userData = {};
        if (extension_packet.type === "trigger_ChatJoin" || extension_packet.type === "trigger_ChatMessageReceived")
        {
            let platform = extension_packet.data.parameters.platform
            let username = ""
            if (extension_packet.type === "trigger_ChatJoin")
                username = extension_packet.data.parameters.username.toLowerCase()
            else
                username = extension_packet.data.parameters.sender.toLowerCase()
            let timeStamp = Date.now()
            // new platform
            if (serverData.userData[platform] == undefined)
                serverData.userData[platform] = {};
            // new user
            if (serverData.userData[platform][username] == undefined)
            {
                getUserIDData(username)
                serverData.userData[platform][username] = {};
                serverData.userData[platform][username].firstseen = timeStamp;
                serverData.userData[platform][username]
                setTwitchBotStatus(username)
                sendNewUserTrigger(server_packet.data)
            }
            // check if we need to update the users profile data from twitch
            // ignore users with invalid names (chinese chars etc as twitch fails on that call)
            else if (
                !serverData.userData[platform][username].userNameInvalid
                && (serverData.userData[platform][username].lastProfileUpdate == undefined
                    ||
                    (timeStamp - serverData.userData[platform][username].lastProfileUpdate) >
                    (serverConfig.profiletimeout * millisecondsInDay)))
            {
                getUserIDData(username)
                setTwitchBotStatus(username)
            }

            serverData.userData[platform][username].lastseen = timeStamp;
            if (extension_packet.type === "trigger_ChatMessageReceived" && extension_packet.data.parameters.message)
            {
                let message = extension_packet.data.parameters.message
                if (!serverData.userData[platform][username].messages)
                    serverData.userData[platform][username].messages = [];
                serverData.userData[platform][username].messages[timeStamp] = message;

            }
            pruneUsers(platform);
            SaveDataToServer();
            //console.log(JSON.stringify(serverData, null, 2))
        }
        else if (extension_packet.type === "trigger_TwitchUserDetails")
        {
            //serverData.userData = {}
            try
            {
                let platform = "twitch";
                let username = extension_packet.data.parameters.username.toLowerCase()
                let timeStamp = Date.now()
                if (serverData.userData[platform][username] == undefined)
                    serverData.userData[platform][username] = {};

                for (const [key, value] of Object.entries(extension_packet.data.parameters))
                    serverData.userData[platform][username][key] = value;
                serverData.userData[platform][username].lastseen = timeStamp;
                serverData.userData[platform][username].lastProfileUpdate = timeStamp
                pruneUsers(platform);
                SaveDataToServer();
            }
            catch (error)
            {
                logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + " packet trigger_TwitchUserDetails", error.message);
            }
        }
        // add this in to see all messages that are not handled
        /*
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.type, server_packet.channel, extension_packet.type);
    */
    }
    else if (server_packet.type === "UnknownChannel")
    {
        if (ServerConnectionAttempts++ < localConfig.MaxServerConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", serverConfig.extensionname, server_packet.data
                    ));
            }, 5000);
        }
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }

    // ------------------------------------------------ unknown message type received -----------------------------------------------
    // add this in to see all messages that are not handled
    /*
else
    logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".onDataCenterMessage", "Unhandled message type", server_packet.type);
        */
}
// ===========================================================================
//                           FUNCTION: pruneUsers
// ===========================================================================
/**
 * Prune the data to keep data sizes manageable
 * @param {string} platform 
 */
function pruneUsers (platform)
{

    let count = 0
    try
    {
        while (Object.keys(serverData.userData[platform]).length > serverConfig.maxuserstokeep)
        {
            // some surge protection. only delete upto 100 at a time
            if (count++ > 100)
                return;

            // prunes message stored
            let currentOldestMessage = 0;
            let oldestMessageId = "";
            let currentOldest = 0;
            let oldestId = "";
            for (const [user, userData] of Object.entries(serverData.userData[platform]))
            {
                //#################
                //find oldest users
                if (user != "botList")
                {
                    //#########################
                    // check number of messages
                    if (userData.messages)
                    {
                        while (Object.entries(userData.messages).length > serverConfig.maxusersmessagestokeep)
                        {
                            for (const [userMessageId, userMessageData] of Object.entries(userData.messages))
                            {
                                if (currentOldestMessage == 0)
                                {
                                    if (userMessageData)
                                        currentOldest = userMessageData.timeStamp;
                                    oldestMessageId = userMessageId
                                }
                                if (userMessageData.timeStamp < currentOldestMessage)
                                {
                                    if (userMessageData)
                                        currentOldestMessage = userMessageData.timeStamp;
                                    oldestMessageId = userMessageId
                                }
                            }
                            // delete the oldest message found
                            if (serverData.userData[platform][user].messages[oldestMessageId])
                                delete serverData.userData[platform][user].messages[oldestMessageId];
                        }
                    }

                    if (currentOldest == 0)
                    {
                        currentOldest = serverData.userData[platform][user].lastseen;
                        oldestId = user
                    }
                    if (serverData.userData[platform][user].lastseen < currentOldest)
                    {
                        currentOldest = serverData.userData[platform][user].lastseen;
                        oldestId = user
                    }
                }
            }
            // delete the oldest user found
            if (serverData.userData[platform][oldestId])
                delete serverData.userData[platform][oldestId];
        }
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".pruneUsers", platform, error.message);
    }
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
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
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
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        serverConfig.channel
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
/**
 * sends trigger_NewChatter message 
 * @param {object} data 
 */
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
        serverConfig.extensionname,
        serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
/**
 * Save our data to the server
 */
function SaveDataToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveData",
            serverConfig.extensionname,
            serverData));
}
// ===========================================================================
//                           FUNCTION: getTwitchBotStatusList
// ===========================================================================
/**
 * Update our know twitch bot list
 */
async function getTwitchBotStatusList ()
{
    try
    {
        let url = "https://api.twitchinsights.net/v1/bots/all";
        let queryResult = ""
        https.get(url, response =>
        {
            response.on("data", (chunk) =>
            {
                queryResult += chunk;
            })
            response.on("end", () =>
            {
                try
                {
                    let BotsData = JSON.parse(queryResult);
                    let Bots = []
                    let i;
                    // Bots[0] is the timestamp of this data
                    Bots.push(Date.now())
                    for (i in BotsData.bots)
                        Bots.push(BotsData.bots[i][0])

                    serverData.userData["twitch"].botList = Bots;
                    SaveDataToServer()

                } catch (error)
                {
                    console.error(error.message);
                }
            })
        })
            .on('error', err =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getTwitchBotStatusList", "ERROR", "Failed http.get for bot list", err, err.message)
            });

    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getTwitchBotStatusList", "ERROR", "Failed to get bot list");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getTwitchBotStatusList", "ERROR", "Error");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: setTwitchBotStatus
// ===========================================================================
/**
 * Update user data based on known bot list
 * @param {string} name 
 */
async function setTwitchBotStatus (name)
{

    if (serverData.userData["twitch"].botList && serverData.userData["twitch"].botList.includes(name))
        serverData.userData["twitch"][name].isBot = true;
    else
        serverData.userData["twitch"][name].isBot = false;
    SaveDataToServer()
}
// ===========================================================================
//                           FUNCTION: getUserIDData
// ===========================================================================
/**
 * sends action_TwitchGetUser to twitch extension to get user data back
 * @param {string} username 
 */
function getUserIDData (username)
{
    // request user data so we can store the twitch id with the username
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "action_TwitchGetUser",
                serverConfig.extensionname,
                { "username": username },
                "",
                "twitch"
            ),
            "",
            "twitch"
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    let colour = 'red'

    //is everything conencted and running
    if (serverConfig.enableusersextension === "on")
        colour = 'green'
    else
        colour = "red"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    color: colour
                },
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

