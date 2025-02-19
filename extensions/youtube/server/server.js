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
import * as fs from "fs";
import express from "express";
import { OAuth2Client } from 'google-auth-library';
import { google } from "googleapis";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";


const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "YOUTUBE",
    EXTENSION_NAME: "youtube",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    youtubeliveid: null,
    oauth2Client: null,
    youtubeAPI: null,
    lastProcessedMessageId: null,
    skippedBacklog: false,
    ServerCredentialsLoaded: false,
    delayStartYoutubeMonitorHandle: null,
    delaySetupAuthenticatePage: null,
    liveChatId: null,
};

const default_serverConfig = {
    __version__: "0.1",
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    youtubeenabled: "off",
    youtube_restore_defaults: "off",
    youtubechatpollrate: 5000,
    host: "http://localhost",
    port: "3000"
};
let serverConfig = structuredClone(default_serverConfig)
/*
Notes on scopes
https://www.googleapis.com/auth/youtube	Manage your YouTube account
https://www.googleapis.com/auth/youtube.channel-memberships.creator	See a list of your current active channel members, their current level, and when they became a member
https://www.googleapis.com/auth/youtube.force-ssl	See, edit, and permanently delete your YouTube videos, ratings, comments and captions
https://www.googleapis.com/auth/youtube.readonly	View your YouTube account
https://www.googleapis.com/auth/youtube.upload	Manage your YouTube videos
https://www.googleapis.com/auth/youtubepartner	View and manage your assets and associated content on YouTube
https://www.googleapis.com/auth/youtubepartner-channel-audit	View private information of your YouTube channel relevant during the audit process with a YouTube partner
*/
const default_serverCredentials = {
    __version__: "0.1",
    clientId: null,
    clientSecret: null,
    redirectURI: "http://localhost:3000/ytoauth",
    scope: ['https://www.googleapis.com/auth/youtube.force-ssl'],
    token_type: "Bearer",
    refresh_token: null,
    access_token: null,
    expiry_date: null,
}
let serverCredentials = structuredClone(default_serverCredentials);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "YouTube extension",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "YoutubeMessageReceived",
                displaytitle: "YouTube Chat Message",
                description: "A chat message was received. textMessage field has name and message combined",
                messagetype: "trigger_ChatMessageReceived",
                parameters: {
                    // streamroller settings
                    type: "trigger_ChatMessageReceived",
                    platform: "Youtube",
                    textMessage: "[username]: [message]",
                    safemessage: "",
                    color: "#FF0000",
                    channel: "",

                    // youtube message data
                    id: "",
                    message: "",
                    ytmessagetype: "",
                    textmessagedetails: "",
                    publishedat: "",
                    hasdisplaycontent: "",

                    //youtube author data
                    sender: "",
                    senderchannelid: "",

                    senderprofileimageurl: "",
                    senderisverified: false,
                    senderischatowner: false,
                    senderischatsponsor: false,
                    senderischatmoderator: false,
                }
            },
        ],
    actions:
        [
            {
                name: "youtubepostlivechatmessage",
                displaytitle: "Post a Message to youtube live chat",
                description: "Post to youtube live chat if we are connected.",
                messagetype: "action_youtubePostLiveChatMessage",
                parameters: { message: "" }
            }

        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function init (host, port, heartbeat, webapp)
{
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "host", host, "port", port, "heartbeat", heartbeat);
    serverConfig.host = host
    serverConfig.port = port
    localConfig.webApp = webapp

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
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
    setupAuthenticatePage();
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "requesting streamroller services");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            let previous_enabled = serverConfig.youtubeenabled;
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
            // check if we were previously enabled in setting (on startup this will be off)
            if (previous_enabled != serverConfig.youtubeenabled)
                if (serverConfig.youtubeenabled == "on")
                    startYoutubeMonitor()
                else
                    stopYoutubeMonitor()
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            let originalCredentials = serverCredentials
            serverCredentials = { ...serverCredentials, ...server_packet.data }
            // update the redirectURI just in case the user is running on a different port/ip
            serverCredentials.redirectURI = serverConfig.host + ":" + serverConfig.port + "/ytoauth";
            localConfig.ServerCredentialsLoaded = true;
            // missing or changed id/secret?
            if (
                !serverCredentials.clientId
                || !serverCredentials.clientSecret
                || originalCredentials.clientId != serverCredentials.clientId
                || originalCredentials.clientSecret != serverCredentials.clientSecret
            )
            {
                // attempt to create a new oauth2Client client
                createoauth2Client();
            }
            // we have the details but not currently a valid client (first run up) so lets initialize it
            else if (!localConfig.oauth2Client)
            {
                console.log("No oauth2Client. reinitialising")
                createoauth2Client();
            }
            // if something else has changed then update the client credentials to match
            if (originalCredentials != serverCredentials)
            {
                localConfig.oauth2Client.setCredentials(
                    {
                        access_token: serverCredentials.access_token,
                        refresh_token: serverCredentials.refresh_token,
                        scope: serverCredentials.scope,
                        token_type: serverCredentials.token_type,
                        expiry_date: serverCredentials.expiry_date,
                    }
                );
                // need to re-setup the page so we now can get an authorizeUrl using the oauthclient
                clearTimeout(localConfig.delaySetupAuthenticatePage);
                localConfig.delaySetupAuthenticatePage = delayStartFunction(setupAuthenticatePage, 5000, localConfig.delaySetupAuthenticatePage);

                // use the delay function here as a save of the credential file will cause multiple
                // callbacks here, one per line. Need to fix the backend to handle this better.
                stopYoutubeMonitor();
                clearTimeout(localConfig.delayStartYoutubeMonitorHandle);
                localConfig.delayStartYoutubeMonitorHandle = delayStartFunction(startYoutubeMonitor, 5000, localConfig.delayStartYoutubeMonitorHandle);
            }
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                let StatusChanged = false
                // check for restore defaults
                if (extension_packet.data.youtube_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    serverCredentials = structuredClone(default_serverCredentials);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Config Files Updated.", "The config files have been Restored to defaults. Your settings may have changed" + "\x1b[0m");
                    saveCredentialsToServer(serverCredentials);
                }
                else
                {
                    // have we just enabled the extension?
                    if (extension_packet.data.youtubeenabled != serverConfig.youtubeenabled)
                        StatusChanged = true
                    if (extension_packet.data.youtubechatpollrate != serverConfig.youtubechatpollrate)
                    {
                        serverConfig.youtubechatpollrate = extension_packet.data.youtubechatpollrate;
                        StatusChanged = true
                    }

                    // default any checkboxes we may have in our settings
                    serverConfig.youtubeenabled = "off";
                    // update our config
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;
                }
                SaveConfigToServer();
                SendSettingsWidgetSmall("");

                // check if we need to start/stop or restart the service
                if (StatusChanged)
                {
                    if (serverConfig.youtubeenabled == "on")
                        startYoutubeMonitor();
                    else
                        stopYoutubeMonitor();
                }
            }
        }
        else if (extension_packet.type === "RequestCredentialsModalsCode")
        {
            SendCredentialsModal(extension_packet.from);
        }
        else if (extension_packet.type === "action_youtubePostLiveChatMessage")
        {
            postLiveChatMessages(extension_packet.data)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);
        /*
    }*/

    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else
        {
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
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
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
function SendSettingsWidgetSmall (toExtension = "")
{
    // read our modal file
    fs.readFile(__dirname + '/youtubesettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalString = modalString.replace(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
                        "",
                        toExtension,
                        serverConfig.channel,
                    ),
                    "",
                    toExtension
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
    fs.readFile(__dirname + "/youtube_credentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            // first lets update our modal to the current settings
            // credentials we expect to be entered on the page
            modalString = modalString.replaceAll("credentialscounttext", "2");
            //cred1 details
            modalString = modalString.replaceAll("cred1nametext", "clientId");
            modalString = modalString.replaceAll("cred1valuetext", serverCredentials.clientId);
            //cred2 details
            modalString = modalString.replaceAll("cred2nametext", "clientSecret");
            modalString = modalString.replaceAll("cred2valuetext", serverCredentials.clientSecret);

            // This will update things like our server variables if they exist etc etc
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                    modalString = modalString.replaceAll(key + "checked", "checked");
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }

            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
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
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: saveCredentialsToServer
// ============================================================================
function saveCredentialsToServer (credentials)
{
    for (var c in credentials)
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "UpdateCredentials",
                localConfig.EXTENSION_NAME,
                {
                    ExtensionName: localConfig.EXTENSION_NAME,
                    CredentialName: c,
                    CredentialValue: credentials[c]
                },
            ));
    }
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let connected = false;
    let color = "red";

    if (serverConfig.youtubeenabled === "on")
    {
        connected = true;
        if (localConfig.liveChatId)
            color = "green"
        else
            color = "orange"
    }
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    connected: connected,
                    color: color
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                     FUNCTION: postTrigger
// ============================================================================
function postTrigger (data)
{
    let message = sr_api.ServerPacket(
        "ChannelData",
        serverConfig.extensionname,
        sr_api.ExtensionPacket(
            data.messagetype,
            serverConfig.extensionname,
            data,
            serverConfig.channel
        ),
        serverConfig.channel
    )
    sr_api.sendMessage(localConfig.DataCenterSocket,
        message);
}
// ============================================================================
//                     FUNCTION: checkCredentialsValid
// ============================================================================
function checkCredentialsValid ()
{
    if (serverConfig.youtubeenabled == "on")
    {
        if (localConfig.ServerCredentialsLoaded)
        {
            if (!serverCredentials.access_token || serverCredentials.access_token == "" ||
                !serverCredentials.refresh_token || serverCredentials.refresh_token == "" ||
                !serverCredentials.scope || serverCredentials.scope == "" ||
                !serverCredentials.token_type || serverCredentials.token_type == "" ||
                !serverCredentials.expiry_date || serverCredentials.expiry_date == ""
            )
            {
                console.log("checkCredentialsValid():Invalid credentials")
                return false;
            }
            if (!localConfig.oauth2Client)
            {
                console.log("checkCredentialsValid():oauth client error:")
                return false;
            }
            return true;
        }
        else
            console.log("checkCredentialsValid localConfig.ServerCredentialsLoaded is false", localConfig.ServerCredentialsLoaded)
    }
    return false;
}
// ============================================================================
//                     FUNCTION: startYoutubeMonitor
// ============================================================================
function startYoutubeMonitor ()
{
    stopYoutubeMonitor();
    // Set interval to fetch messages every x seconds
    localConfig.messagePollingHandle = setInterval(async () =>
    {
        // only poll if we are enabled.
        if (serverConfig.youtubeenabled == "on")
        {
            // don't try and attach to Youtube until we have loaded our credentials from the server
            if (!localConfig.ServerCredentialsLoaded || !checkCredentialsValid())
            {
                return;
            }
            // check for updated credentials here as we want to make sure we keep our refresh token uptodate
            if (localConfig.oauth2Client.credentials.access_token != serverCredentials.access_token)
            {
                saveCredentialsToServer(
                    {
                        access_token: localConfig.oauth2Client.credentials.access_token,
                        refresh_token: localConfig.oauth2Client.credentials.refresh_token,
                        expiry_date: localConfig.oauth2Client.credentials.expiry_date
                    }
                )
            }

            if (!localConfig.liveChatId)
                await getLiveChatId();
            // check again to see if we managed to open it.
            if (!localConfig.liveChatId)
                return;
            else
            {
                getLiveChatMessages()
                    .then(messages =>
                    {
                        if (messages && messages.length > 0)
                        {
                            if (!localConfig.skippedBacklog)
                                localConfig.lastProcessedMessageId = messages[messages.length - 1].id
                            else
                            {
                                messages.forEach((message) =>
                                {
                                    let triggerToSend = findTriggerByMessageType("trigger_ChatMessageReceived")
                                    triggerToSend.parameters = { ...triggerToSend.parameters, ...message };
                                    triggerToSend.parameters.textMessage = message.sender + ":" + message.message;
                                    // replace the html parts of the string with their escape chhars
                                    let safemessage = sanitiseHTML(message);
                                    // remove non ascii chars
                                    safemessage = safemessage.replace(/[^\x00-\x7F]/g, "");
                                    // remove unicode
                                    safemessage = safemessage.replace(/[\u{0080}-\u{FFFF}]/gu, "");
                                    triggerToSend.parameters.safemessage = message.sender + ":" + message.message;
                                    postTrigger(triggerToSend);

                                });
                            }
                        }

                    })
                    .catch(err =>
                    {

                        console.log("startYoutubeMonitor", JSON.stringify(err, null, 2))
                        handleGaxiosErrors(err);
                        localConfig.liveChatId = null;
                    });
            }
        }
    }, serverConfig.youtubechatpollrate); // Adjust interval if needed
}
// ============================================================================
//                     FUNCTION: stopYoutubeMonitor
// ============================================================================
function stopYoutubeMonitor ()
{
    clearInterval(localConfig.messagePollingHandle);
}
// ============================================================================
//                     FUNCTION: getLiveChatMessages
// ============================================================================
async function getLiveChatMessages ()
{
    try
    {
        let newMessages = [];
        if (!localConfig.liveChatId)
            return newMessages;
        const params = {
            liveChatId: localConfig.liveChatId,
            part: 'snippet,authorDetails',
            auth: localConfig.oauth2Client,
        };
        return localConfig.youtubeAPI.liveChatMessages.list(params)
            .then(res =>
            {
                // stream has ended
                if (res.data.offlineAt)
                {
                    localConfig.liveChatId = null;
                    localConfig.youtubeAPI = null;
                    localConfig.lastProcessedMessageId = null;
                    localConfig.skippedBacklog = false;
                    return newMessages;
                }
                let foundLastProcessedMessage = false;
                // Process the messages and filter out the ones already processed
                // check if we have over a page of comments as our stored id will no longer appear
                if (res.data.items.length > 74)
                    localConfig.lastProcessedMessageId = null;

                // mark that we have parsed the backlog
                if (!localConfig.skippedBacklog && res.data.items.length > 0)
                    localConfig.lastProcessedMessageId = res.data.items[res.data.items.length - 1].id;
                for (const message of res.data.items)
                {
                    // skip processing any messages we have already seen.
                    if (!foundLastProcessedMessage && localConfig.lastProcessedMessageId)
                    {
                        //check if this is the last Processed message 
                        if (message.id === localConfig.lastProcessedMessageId)
                            foundLastProcessedMessage = true;
                        // Already processed this message
                        continue;
                    }
                    newMessages.push({
                        //message data
                        id: message.id, // Track message ID to avoid re-processing
                        message: message.snippet.displayMessage,
                        ytmessagetype: message.snippet.type,
                        textmessagedetails: message.snippet.textMessageDetails.messageText,
                        publishedat: message.snippet.publishedAt,
                        hasdisplaycontent: message.snippet.hasDisplayContent,

                        //sender data
                        sender: message.authorDetails.displayName,
                        senderchannelid: message.authorDetails.channelId,
                        senderprofileimageurl: message.authorDetails.profileImageUrl,
                        senderisverified: message.authorDetails.isVerified,
                        senderischatowner: message.authorDetails.isChatOwner,
                        senderischatsponsor: message.authorDetails.isChatSponsor,
                        senderischatmoderator: message.authorDetails.isChatModerator

                    });
                    localConfig.lastProcessedMessageId = message.id;
                }
                localConfig.skippedBacklog = true;
                return newMessages;
            })
            .catch(err =>
            {

                handleGaxiosErrors(err);
                localConfig.liveChatId = null;

            })
    } catch (error)
    {
        console.error('Error fetching live chat messages:', error);
    }
    return [];
}
//##########################################################################
//###################### postLiveChatMessages ##############################
//##########################################################################
async function postLiveChatMessages (message)
{
    // only poll if we are enabled.
    if (serverConfig.youtubeenabled == "on")
    {
        console.log("Trying to send YouTube Message with extensions turned off")
        return;
    }
    if (!localConfig.liveChatId)
    {
        if (!getLiveChatId())
        {
            return;
        }
    }
    try
    {
        if (localConfig.liveChatId)
        {
            localConfig.youtubeAPI.liveChatMessages.insert({
                auth: localConfig.oauth2Client,
                part: 'snippet',
                requestBody: {
                    snippet: {
                        liveChatId: localConfig.liveChatId,
                        type: 'textMessageEvent',
                        textMessageDetails: {
                            messageText: message.message,
                        },
                    },
                },
            })
                .then(res =>
                {
                    //
                })
                .catch(err =>
                {
                    console.log("postLiveChatMessages():message sent error", JSON.stringify(err, null, 2));
                })
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".getLiveChatId", "Couldn't send message to Youtube as we don't have a valid live id yet id=", localConfig.liveChatId)
        }
    } catch (error)
    {
        console.log('Error sending message:', error.response ? error.response.data : error.message);
        console.log("error", error)
    }
}
// ============================================================================
//                     FUNCTION: getLiveChatId
// ============================================================================
async function getLiveChatId ()
{
    try
    {
        if (!localConfig.youtubeAPI)
        {
            localConfig.youtubeAPI = google.youtube({ version: 'v3', auth: localConfig.oauth2Client })
        }
        if (!checkCredentialsValid())
            return null;
        localConfig.youtubeAPI.liveBroadcasts.list({
            part: 'snippet,status',
            broadcastStatus: "active"
        })
            .then(function (response)
            {
                for (let i = 0; i < response.data.items.length; i++)
                {
                    let liveBroadcast = response.data.items[i];
                    if (liveBroadcast && liveBroadcast.status && liveBroadcast.status.lifeCycleStatus == "live")
                    {
                        localConfig.liveChatId = liveBroadcast.snippet.liveChatId;
                        return localConfig.liveChatId;
                    }
                    else
                    {
                        localConfig.liveChatId = null;
                        return localConfig.liveChatId;
                    }
                }
                return localConfig.liveChatId;
            })
            .catch(error =>
            {
                //console.log('getLiveChatId():error?', JSON.stringify(error.response.data.error, null, 2));
                handleGaxiosErrors(error)
                localConfig.liveChatId = null;
                return null;
            });
    } catch (err)
    {
        console.log("getLiveChatId ERROR:", err, err.message);
        localConfig.liveChatId = null;
        return null;
    }
}
// ###########################################################################
// ######################### handleGaxiosErrors ##########################
// ###########################################################################
function handleGaxiosErrors (error)
{
    //console.log("handleGaxiosErrors called")
    if (error.response)
    {
        if (error.response.data && error.response.data.error)
        {
            if (error.response.data.error == "invalid_grant")
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".setupAuthenticatePage", "Error: Received invalid grant error from GoogleAPI token. One reason for this is if the google API is still unpublished and in testing state. This will cause authorization to be revoked every 7 days meaning you need to reauthorize.");

                console.log("To re-authorize correctly you will need to turn off youtube extension,restart StreamRoller and then re-authorize in the usual way fom the admin page.")
                // Stop the server to avoid constant errors from the timers
                serverConfig.youtubeenabled = "off";
                stopYoutubeMonitor();
                SendSettingsWidgetSmall();
            }
            else
            {
                console.log("received error", error.response.data.error)
                // The request was made and the server responded with a status code
                console.log('Error status:', error.response.status);
                console.log('Error data:', error.response.data);
                console.log('Error headers:', error.response.headers);
            }
        }
        else if (error.response.data.error_description == 'Token has been expired or revoked.')
        {
            console.log("Received error", error.response.data.error_description)
            refreshAccessToken();
            return;
        }

    } else if (error.request)
    {
        // The request was made but no response was received
        console.log('No response received:', error.request);
    } else
    {
        // Something happened in setting up the request
        console.log('Error:', error);
    }
}
// ###########################################################################
// ######################### refreshAccessToken ##########################
// ###########################################################################
async function refreshAccessToken ()
{

    //console.log("refreshAccessToken ()")
    // Initialize the OAuth2Client
    //const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
    localConfig.oauth2Client = new OAuth2Client(serverCredentials.clientId, serverCredentials.clientSecret, serverCredentials.redirectURI);
    localConfig.oauth2Client.forceRefreshOnFailure = true;

    // Set the refresh token
    //oAuth2Client.setCredentials({        refresh_token: REFRESH_TOKEN,    });
    //console.log("setCredentials being called")

    localConfig.oauth2Client.setCredentials({
        refresh_token: serverCredentials.refresh_token
    })

    //console.log("localConfig.oauth2Client", JSON.stringify(localConfig.oauth2Client, null, 2))

    try
    {
        //console.log("calling refresh access token current credentials", serverCredentials)
        let expdate = new Date(serverCredentials.expiry_date)
        let expdateconverted = expdate.toString();

        // Get a new access token
        //const { credentials } = await localConfig.oauth2Client.refreshAccessToken(); // Deprecated but still works
        localConfig.oauth2Client.refreshAccessToken(
            /*function (err, tokens, response)
        {
            console.log("ERR: ", err); // keeps saying invalid_request 400 and nothing more.
            console.log("RESPONSE: ", response); //bunch of stuff here, also where I found the reason for the error
            console.log("TOKENS: ", tokens)
            //console.log('New access token:', credentials);
        }
            */
        ).then((credentials, res) =>
        {
            //console.log("refreshAccessToken.then")
            //console.log("credentials: ", credentials); //bunch of stuff here, also where I found the reason for the error
            //console.log("res: ", res)
            /*console.log("ERR: ", err); // keeps saying invalid_request 400 and nothing more.
            console.log("RESPONSE: ", response); //bunch of stuff here, also where I found the reason for the error
            console.log("TOKENS: ", tokens)*/
        }).catch((err) =>
        {
            console.log("refreshAccessToken.err")
            console.log(err);
        })

        // Alternatively, you can use the getAccessToken() method (non-deprecated)
        //const accessTokenInfo = await localConfig.oauth2Client.getAccessToken();
        //console.log('Access token info:', accessTokenInfo.token);
        //serverCredentials.access_token = credentials.access_token;

        //return credentials.access_token;
    } catch (error)
    {
        //handleGaxiosErrors(error)
        console.error('refreshAccessToken() Erro :', error);
        //throw error;
    }
}
/*
 var oauth2Client = new auth.OAuth2(conf.cliend_id, conf.client_secret, conf.red_url);
    var creds = {access_token: accessToken,  // **I tried without this too**
                refresh_token: refreshToken};
    oauth2Client.setCredentials(creds); // Tried without this too
    oauth2Client.refreshToken_(refreshToken, function(err, tokens, response){
      console.log("ERR: ", err); // keeps saying invalid_request 400 and nothing more.
      console.log("RESPONSE: ", response); //bunch of stuff here, also where I found the reason for the error
      console.log("TOKENS: ", tokens); // NULL
      //  */
// ###########################################################################
// ######################### setupAuthenticatePage ##########################
// ###########################################################################
function setupAuthenticatePage ()
{
    try
    {
        // ============================================================================
        //                     FUNCTION: oauth2Client.on('tokens')
        // ============================================================================
        if (localConfig.oauth2Client)
        {
            // we only use one emitter so remove all the previous ones
            localConfig.oauth2Client.removeAllListeners();
            //console.log("Setting up on tokens handler")
            localConfig.oauth2Client.on('tokens', (tokens) =>
            {
                //console.log("on tokens returned", tokens)
                serverCredentials = { ...serverCredentials, ...tokens }//merge the new ones over (might have some 
                saveCredentialsToServer(tokens);
            })
            // get a valid auth url
            serverCredentials.authorizeUrl = localConfig.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: serverCredentials.scope,
                login_hint: "select_account",
                prompt: "consent",
                //forceRefreshOnFailure: true,
            });
        }
        localConfig.webApp.use("/youtube", express.static(__dirname + "/../public"));
        localConfig.webApp.get("/ytoauth", async (req, res) =>
        {

            if (!serverCredentials.clientId)
                res.send("clientID needs setting before authorization can continue")
            else if (!serverCredentials.clientSecret)
                res.send("ClientSecret needs setting before authorization can continue")
            else
            {
                const code = req.query.code;
                if (!code)
                {
                    // first call to page so lets request auth and get a code
                    res.redirect(serverCredentials.authorizeUrl);
                }
                else
                {
                    res.end('You can now close this page.');
                    const { tokens } = await localConfig.oauth2Client.getToken({ code: code, redirect_uri: serverCredentials.redirectURI });
                    // merge/overwrite our credentials
                    //serverCredentials = { ...serverCredentials, ...tokens };
                    // save the credentials for future use
                    saveCredentialsToServer(tokens);
                    localConfig.oauth2Client.setCredentials({
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        scope: tokens.scope,
                        token_type: tokens.token_type,
                        expiry_date: tokens.expiry_date,
                    });
                }
            }
        });
    } catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".setupAuthenticatePage", "Error", error, error.message);
    }
}
// #######################################################################
// ######################### createoauth2Client ##########################
// #######################################################################
function createoauth2Client ()
{
    // remove previous client reference (so garbage collection can happen on it)
    if (localConfig.oauth2Client)
    {
        localConfig.oauth2Client.removeAllListeners();
        localConfig.oauth2Client = null;
    }
    try
    {
        // create a new client using the new id and secret
        localConfig.oauth2Client = new OAuth2Client(
            serverCredentials.clientId,
            serverCredentials.clientSecret,
            serverCredentials.redirectURI,
        );
        if (!localConfig.oauth2Client)
        {
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect.CredentialsFile", "failed to create new google api auth client for api connection");
        }
    }
    catch (error)
    {
        //TBD remove creds from error log here
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect.CredentialsFile", "error on new OAuth2Client(" + serverCredentials.clientId + "," + serverCredentials.redirectURI + ")", error.message, error);
    }
}
// #######################################################################
// ######################### delayStartFunction ##########################
// #######################################################################
function delayStartFunction (func, delay, handle)
{
    // This function is used when we want to delay a startup. Mostly this is useful
    // when we may ended up starting something several times quickly but only want to 
    // start it once. ie if we get multiple config file changes we will get one message per
    // line and not know when it is finished so we can just replace the timed startup
    // for each update (effectively replacing deleting the previous call to startup)
    // This is due to the limitation of the backend when updating files
    clearTimeout(handle);
    handle = setTimeout(func, delay);
    return handle;
}
// #######################################################################
// ######################### sanitiseHTML ##########################
// #######################################################################
function sanitiseHTML (string)
{
    // sanitiser
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return String(string).replace(/[&<>"'`=\/]/g, function (s)
    {
        return entityMap[s];
    });
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { init };