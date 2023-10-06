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
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as logger from "../../../backend/data_center/modules/logger.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";
//twurple imports
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

// our helper files
import * as eventSubApi from "./eventsub.js";

// local config for volatile data
const localConfig =
{
    host: "",
    port: "",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false, // are we connected to obs
        color: "red"
    },
    SYSTEM_LOGGING_TAG: "[EXTENSION]",

    clientId: "",
    streamerData: "",
    authProvider: "",
    apiClient: null,
}
const default_serverConfig = {
    __version__: "0.1",
    extensionname: "twitch",
    channel: "TWITCH",
    twitchenabled: "off",
    twitchresetdefaults: "off",
    twitchstreamername: ""
}
let serverConfig = structuredClone(default_serverConfig);
const localCredentials =
{
    twitchOAuthState: "",
    twitchOAuthToken: ""
}

// triggers are implemented in eventsub.js
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Twitch handles messages to and from twitch",
    version: "0.1",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "StreamStarted",
                displaytitle: "Stream Started",
                description: "The Stream Started",
                messagetype: "trigger_TwitchStreamStarted",
                parameters: {}
            },
            {
                name: "StreamEnded",
                displaytitle: "Stream Ended",
                description: "The Stream Ended",
                messagetype: "trigger_TwitchStreamEnded",
                parameters: {}
            },
            {
                name: "TitleChanged",
                displaytitle: "TitleChanged",
                description: "The Stream title was changed",
                messagetype: "trigger_TwitchTitleChanged",
                parameters: {
                    title: ""
                }
            },
            {
                name: "CommercialStarted",
                displaytitle: "Commercial started",
                description: "A Commercial was started",
                messagetype: "trigger_TwitchCommercialStarted",
                parameters: {
                    duration: ""
                }
            },
            {
                name: "ModAdded",
                displaytitle: "Mod Added",
                description: "A User was added to the Mod list",
                messagetype: "trigger_TwitchModAdded",
                parameters: {
                    user: ""
                }
            },
            {
                name: "ModRemoved",
                displaytitle: "Mod Removed",
                description: "A User was removed to the Mod list",
                messagetype: "trigger_TwitchModRemoved",
                parameters: {
                    user: ""
                }
            },
            {
                name: "VIPAdded",
                displaytitle: "VIP Added",
                description: "A User was added to the VIP list",
                messagetype: "trigger_TwitchVIPAdded",
                parameters: {
                    user: ""
                }
            },
            {
                name: "VIPRemoved",
                displaytitle: "VIP Removed",
                description: "A User was removed to the VIP list",
                messagetype: "trigger_TwitchVIPRemoved",
                parameters: {
                    user: ""
                }
            },
            {
                name: "GamedIdChanged",
                displaytitle: "Gamed Id Changed",
                description: "The Game Id was changed",
                messagetype: "trigger_TwitchGamedIdChanged",
                parameters: {
                    gameId: ""
                }
            },
            {
                name: "GamedNameChanged",
                displaytitle: "Gamed Name Changed",
                description: "The Game Name was changed",
                messagetype: "trigger_TwitchGamedNameChanged",
                parameters: {
                    name: ""
                }
            },
            {
                name: "StreamIdChanged",
                displaytitle: "Stream Id Changed",
                description: "The stream ID has changed",
                messagetype: "trigger_TwitchStreamIdChanged",
                parameters: {
                    id: ""
                }
            },
            {
                name: "StreamLanguageChanged",
                displaytitle: "Stream language Changed",
                description: "The stream language has changed",
                messagetype: "trigger_TwitchStreamLanguageChanged",
                parameters: {
                    language: ""
                }
            },
            {
                name: "StreamerNameChanged",
                displaytitle: "Streamer name Changed",
                description: "The streamer name has changed",
                messagetype: "trigger_TwitchStreamerNameChanged",
                parameters: {
                    name: ""
                }
            },
            {
                name: "Channel Redemption",
                displaytitle: "Channel Points Redemption",
                description: "A user used channel points for a redemption",
                messagetype: "trigger_TwitchChannelRedemption",
                parameters: {
                    stream: "",
                    message: "",
                    cost: "",
                    id: "",
                    prompt: "",
                    title: "",
                    user: ""
                }
            },
        ],
    actions:
        [
            {
                name: "ChangeTitle",
                displaytitle: "Change Title",
                description: "Change channel title",
                messagetype: "action_TwitchChangeTitle",
                parameters: { title: "" }
            },
            {
                name: "StartCommercial",
                displaytitle: "Start Commercial",
                description: "Start a Commercial for (30, 60, 90, 120, 150, 180) seconds",
                messagetype: "action_TwitchStartCommercial",
                parameters: { duration: "" }
            },
            {
                name: "AddVIP",
                displaytitle: "Add VIP",
                description: "Promote user to VIP",
                messagetype: "action_TwitchAddVIP",
                parameters: { user: "" }
            },
            {
                name: "RemoveVIP",
                displaytitle: "Remove VIP",
                description: "Demote user from VIP",
                messagetype: "action_TwitchRemoveVIP",
                parameters: { user: "" }
            },
            {
                name: "AddMod",
                displaytitle: "Add Mod",
                description: "Promote user to Mod",
                messagetype: "action_TwitchAddMod",
                parameters: { user: "" }
            },
            {
                name: "RemoveMod",
                displaytitle: "Remove Mod",
                description: "Demote user from Mod",
                messagetype: "action_TwitchRemoveMod",
                parameters: { user: "" }
            },
        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
function start (host, port, nonce, clientId, heartbeat)
{
    localConfig.host = host;
    localConfig.port = port;
    localConfig.clientId = clientId;
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".start", "DataCenterSocket no heartbeat passed:", heartbeat);
    try
    {
        ConnectToDataCenter(localConfig.host, localConfig.port);
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + " server.start", "initialise failed:", err.message);
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
        logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));

    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    // -----------------------------------------------------------------------------------
    //                  RECEIVED CONFIG
    // -----------------------------------------------------------------------------------
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
            SaveConfigToServer();
        }
    }
    // -----------------------------------------------------------------------------------
    //                  RECEIVED CREDENTIALS
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != ""
            && server_packet.data.twitchOAuthState != "" && server_packet.data.twitchOAuthToken != "")
        {
            localCredentials.twitchOAuthState = server_packet.data.twitchOAuthState;
            localCredentials.twitchOAuthToken = server_packet.data.twitchOAuthToken;
            localConfig.authProvider = new StaticAuthProvider(localConfig.clientId, localCredentials.twitchOAuthToken);
            if (serverConfig.twitchenabled == "on")
            {
                setTimeout(() =>
                {
                    disconnectTwitch();
                    connectTwitch();
                }, 1000);
            }
        }
    }
    // -----------------------------------------------------------------------------------
    //                      ### EXTENSION MESSAGE ###
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR SETTINGS DIALOG
        // -----------------------------------------------------------------------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            SendSettingsWidgetSmall(extension_packet.from);
        }
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR CREDENTIALS DIALOG
        // -----------------------------------------------------------------------------------

        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        // -----------------------------------------------------------------------------------
        //                   SETTINGS DIALOG DATA
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.twitchresetdefaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Defaults restored", "The config files have been reset. Your settings may have changed" + "\x1b[0m");
                    SaveConfigToServer();
                }
                else
                {
                    handleSettingsWidgetSmallData(extension_packet.data);
                    SaveConfigToServer();

                    if (localConfig.status.connected)
                        disconnectTwitch();
                    connectTwitch()
                }
            }
        }
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -----------------------------------------------------------------------------------
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
        // -----------------------------------------------------------------------------------
        //                   Change title
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchChangeTitle")
        {
            if (extension_packet.data.title != "")
                setStreamTitle(extension_packet.data.title)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to change title with no title provided");
        }
        // -----------------------------------------------------------------------------------
        //                   Start Commercial
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchStartCommercial")
        {
            if (extension_packet.data.duration != "")
                startCommercial(extension_packet.data.duration)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to start a commercial with no duration provided");
        }
        // -----------------------------------------------------------------------------------
        //                   Add VIP
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchAddVIP")
        {
            if (extension_packet.data.user != "")
                addVIP(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to VIP a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   Remove VIP
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchRemoveVIP")
        {
            if (extension_packet.data.user != "")
                removeVIP(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove VIP from a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   Add Mod
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchAddMod")
        {
            if (extension_packet.data.user != "")
                addMod(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to Mod a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   Remove Mod
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchRemoveMod")
        {
            if (extension_packet.data.user != "")
                removeMod(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove Mod from a user with no username provided");
        }
    }
    // -----------------------------------------------------------------------------------
    //                           UNKNOWN CHANNEL MESSAGE RECEIVED
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "UnknownChannel")
    {
        // channel might not exist yet, extension might still be starting up so lets 
        // reschedule the join attempt need to add some sort of flood control here 
        // so we are only attempting to join one at a time
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
            }, 5000);
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
        // just a blank handler for items we are not using to avoid message from the catch all
    }
    // ------------------------ unknown message type received ----------------------------------
    else
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled message type:", server_packet);
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig,
        ));
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
function SendSettingsWidgetSmall (toChannel)
{
    fs.readFile(__dirname + "/twitchsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        }
        else
        {
            let modalstring = filedata.toString();

            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        toChannel,
                        serverConfig.channel
                    ),
                    "",
                    toChannel
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{
    fs.readFile(__dirname + "/twitchcredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();

            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
                        serverConfig.extensionname,
                        modalstring,
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
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
function handleSettingsWidgetSmallData (modalCode)
{
    serverConfig.twitchenabled = "off";
    serverConfig.twitchresetdefaults = "off";
    for (const [key, value] of Object.entries(modalCode))
        serverConfig[key] = value;
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    localConfig.status.color = "red"
    if (serverConfig.twitchenabled == "on" && localConfig.status.connected)
        localConfig.status.color = "green"
    else if (serverConfig.twitchenabled == "on")
        localConfig.status.color = "orange"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                localConfig.status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ===========================================================================
//                           TWITCH PUBSUB
// ===========================================================================

// ===========================================================================
//                           FUNCTION: connectTwitch
// ===========================================================================
async function connectTwitch ()
{
    try
    {
        if (localConfig.authProvider == "")
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Missing authorization, go to http://localhost:3000/twitch/auth to authorise for twitch");
            return;
        }
        if (serverConfig.twitchstreamername == "")
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Missing stream name, please set a stream name to work with in the settings");
            return;
        }
        // setup client
        let auth = localConfig.authProvider
        localConfig.apiClient = new ApiClient({ authProvider: auth });

        // get some data about the streamer (id etc)
        localConfig.streamerData = await localConfig.apiClient.users.getUserByName(serverConfig.twitchstreamername)

        // get the current channel info (needed so we can trigger on changes)
        let channelData = await localConfig.apiClient.channels.getChannelInfoById(localConfig.streamerData.id)

        // Connect to the pub sub event listener
        eventSubApi.init(localConfig, serverConfig, triggersandactions)
        eventSubApi.startEventSub(localConfig.streamerData.id, localConfig.apiClient, channelData)

        //console.log("getCurrentScopesForUser", await localConfig.authProvider.getCurrentScopesForUser())

        // set us to connected at this time
        localConfig.status.connected = true;
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "ERROR", err.message);
        localConfig.status.connected = false;
    }
}
// ===========================================================================
//                           FUNCTION: disconnectTwitch
// ===========================================================================
function disconnectTwitch ()
{
    eventSubApi.stopEventSub()
}
// ===========================================================================
//                           FUNCTION: setStreamTitle
// ===========================================================================
async function setStreamTitle (title)
{
    await localConfig.apiClient.channels.updateChannelInfo(localConfig.streamerData.id, { title: title })
}
// ===========================================================================
//                           FUNCTION: startCommercial
// ===========================================================================
async function startCommercial (length)
{
    try
    {
        let lengths = ["30", "60", "90", "120", "150", "180"]
        if (!lengths.includes(length))
            console.log("Commercial length invalid, must be one of 30, 60, 90, 120, 150, 180")
        else
        {
            await localConfig.apiClient.channels.startChannelCommercial(localConfig.streamerdata.id, length)
            //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
            let trigger = findTriggerByMessageType("trigger_TwitchCommercialStarted");
            trigger.parameters.duration = length;
            sendTrigger(trigger)
        }
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial, is streamer live?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial (try reauthorising by going to  go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: addVIP
// ===========================================================================
async function addVIP (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.channels.addVip(localConfig.streamerData.id, user.id)
        //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
        let trigger = findTriggerByMessageType("trigger_TwitchVIPAdded");
        trigger.parameters.user = username;
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addVIP", "ERROR", "Failed to add VIP?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addVIP", "ERROR", "Failed to add VIP)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeVIP
// ===========================================================================
async function removeVIP (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.channels.removeVip(localConfig.streamerData.id, user.id)
        //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
        let trigger = findTriggerByMessageType("trigger_TwitchVIPRemoved");
        trigger.parameters.user = username;
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeVIP", "ERROR", "Failed to remove VIP?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeVIP", "ERROR", "Failed to remove VIP)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: addMod
// ===========================================================================
async function addMod (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.moderation.addModerator(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addMod", "ERROR", "Failed to add Mod?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addMod", "ERROR", "Failed to add Moderator)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeMod
// ===========================================================================
async function removeMod (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.moderation.removeModerator(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeMod", "ERROR", "Failed to remove Mod?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeMod", "ERROR", "Failed to remove Moderator)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
function sendTrigger (trigger)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                trigger.messagetype,
                serverConfig.extensionname,
                trigger,
                serverConfig.channel,
                ''),
            serverConfig.channel,
            ''
        )
    );
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase().indexOf(messagetype.toLowerCase()) > -1)
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
export { start }