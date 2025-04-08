
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
 * @extension YouTube
 * YouTube functionality without the google API limits (limited free Tokens) or need for complicated OAUTH for the users requiring a google cloud account with a valid application setup to get the ClientId and ClientSecret needed.
 */
import { Innertube, UniversalCache, YTNodes } from 'youtubei.js';
import { Log } from 'youtubei.js';
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const DEBUG_LOGGING = false
// set logging level for youtube.js : NONE, ERROR, WARNING, INFO, DEBUG
Log.setLevel(Log.Level.NONE);

const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    youtubeAPI: null,
    liveChatAPI: null,
    liveVideoId: null,
    youtubeSchedulerHandle: null,
    youtubeSchedulerTimer: 5000,//run the monitor every 5 seconds when enabled


    credentialsSet: false,
    signedIn: false,
    youtubeBrowserCookieStatus: "Cookie not set",
    startupTimerBufferHandle: null, //have a startup buffer to stop multiple stars (workaround for settings credentials)
    connectedAsUsername: null,
    monitorForLiveSTreamTimeout: 10000,
    monitorForLiveSTreamTimeoutHandle: null,
    // filters for live stream search
    filters: { features: ["live"] }
    //filters: {}
};

const default_serverConfig = {
    __version__: "0.2",
    extensionname: "youtube",
    channel: "YOUTUBE",
    youtubeenabled: "off",
    youtubedebugenabled: "off",
    youtube_restore_defaults: "off",
    enableYouTubeBrowserCookie: "off",
    youtubechatpollrate: 5000,
    youtubechannelname: "OldDepressedGamer",
    host: "http://localhost",
    port: "3000"
};
let serverConfig = structuredClone(default_serverConfig)
let serverCredentials = {};
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "YouTube extension",
    version: "0.1",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Youtube message received",
                displaytitle: "YouTube Chat Message",
                description: "A chat message was received. textMessage field has name and message combined",
                messagetype: "trigger_ChatMessageReceived",
                parameters: {

                    triggerId: "YouTubeChatMessage", //Identifier that users can use to identify this particular trigger message if triggered by an action
                    // streamroller settings
                    type: "trigger_ChatMessageReceived",
                    platform: "Youtube",
                    textMessage: "[username]: [message]",
                    safemessage: "",
                    color: "#FF0000",

                    // youtube message data
                    id: "",
                    message: "",
                    ytmessagetype: "",
                    timestamp: -1,

                    //youtube author data
                    sender: "",
                    senderid: "",

                    senderprofileimageurl: "",
                    senderbadges: "",
                    senderisverified: false,
                    senderischatmoderator: false,
                }
            },
        ],
    actions:
        [
            {
                name: "YouTube post livechat message",
                displaytitle: "Post a Message to youtube live chat",
                description: "Post to youtube live chat if we are connected.",
                messagetype: "action_youtubePostLiveChatMessage",
                parameters: {
                    actionId: "YouTubeChatMessage", //Identifier that users can use to identify any trigger fired by this action
                    message: ""
                }
            }

        ],
}

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {Express} app 
 * @param {String} host 
 * @param {Number} port 
 * @param {Number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    serverConfig.host = host
    serverConfig.port = port
    localConfig.heartBeatTimeout = heartbeat;
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Called when connection to StreamRoller server disconnects
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Called when connection to StreamRoller server starts
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
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
/**
 * Called when a message is received from StreamRoller
 * @param {object} server_packet 
 */
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
                SaveConfigToServer();
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);
            // check if we were previously enabled in setting (on startup this will be off)
            if (previous_enabled != serverConfig.youtubeenabled)
                if (serverConfig.youtubeenabled == "on")
                {
                    //only start if we have already got our credentials
                    if (localConfig.credentialsSet)
                    {
                        stopYoutubeMonitor();
                        if (localConfig.startupTimerBufferHandle)
                            clearTimeout(localConfig.startupTimerBufferHandle)
                        localConfig.startupTimerBufferHandle = setTimeout(
                            startYoutubeMonitor()
                            , 2000
                        )

                    }
                }
                else
                    stopYoutubeMonitor()
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)    
        {
            serverCredentials = server_packet.data
            if (serverCredentials.youtubeCookie && serverCredentials.youtubeCookie != "")
                localConfig.youtubeBrowserCookieStatus = "Cookie Loaded"
            localConfig.credentialsSet = true
            SendSettingsWidgetSmall()
            if (localConfig.startupTimerBufferHandle)
                clearTimeout(localConfig.startupTimerBufferHandle)
            localConfig.startupTimerBufferHandle = setTimeout(() =>
            {
                stopYoutubeMonitor();
                startYoutubeMonitor();
            }, 2000);
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
                    serverCredentials = {};
                    deleteCredentials()
                    console.log("\x1b[31m" + serverConfig.extensionname + " Config/Credentials Files Updated.", "The config files have been Restored to defaults and credentials deleted. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    // have we just changed something that needs a restart
                    if (extension_packet.data.youtubeenabled != serverConfig.youtubeenabled)
                        StatusChanged = true
                    if (extension_packet.data.youtubechatpollrate != serverConfig.youtubechatpollrate)
                        StatusChanged = true
                    if (extension_packet.data.youtubechannelname != serverConfig.youtubechannelname)
                        StatusChanged = true
                    if (extension_packet.data.enableYouTubeBrowserCookie == "on")
                        StatusChanged = true;
                    if (extension_packet.data.youtubeCookie != "")
                    {
                        serverCredentials.youtubeCookie = extension_packet.data.youtubeCookie
                        saveCredentialsToServer()
                    }
                    // default any checkboxes we may have in our settings
                    serverConfig.youtubeenabled = "off";
                    serverConfig.youtubedebugenabled = "off"
                    serverConfig.enableYouTubeBrowserCookie = "off"

                    // update our config
                    for (const [key, value] of Object.entries(extension_packet.data))
                    {
                        serverConfig[key] = value;
                    }
                }
                // check if we need to start/stop or restart the service
                if (StatusChanged)
                {
                    if (serverConfig.youtubeenabled == "on")
                    {
                        if (localConfig.startupTimerBufferHandle)
                            clearTimeout(localConfig.startupTimerBufferHandle)
                        localConfig.startupTimerBufferHandle = setTimeout(() =>
                        {
                            stopYoutubeMonitor();
                            startYoutubeMonitor();
                        }
                            , 2000
                        )
                    }
                    else
                        stopYoutubeMonitor();
                }
                SaveConfigToServer();
                SendSettingsWidgetSmall(extension_packet.from);
            }
        }
        else if (extension_packet.type === "action_youtubePostLiveChatMessage")
            postLiveChatMessages(extension_packet.data)
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
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
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
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
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ============================================================================
//                           FUNCTION: deleteCredentials
// ============================================================================
/**
 * delete the credentials file on the server
 */
function deleteCredentials ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("DeleteCredentials",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Saves the configuration to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))

}
// ============================================================================
//                           FUNCTION: saveCredentialsToServer
// ============================================================================
/**
 * 
 */
function saveCredentialsToServer ()
{
    for (var c in serverCredentials)
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "UpdateCredentials",
                serverConfig.extensionname,
                {
                    ExtensionName: serverConfig.extensionname,
                    CredentialName: c,
                    CredentialValue: serverCredentials[c]
                },
            ));
    }
}
// ============================================================================
//                     FUNCTION: startYoutubeMonitor
// ============================================================================
/**
 * Start the Monitor
 */
function startYoutubeMonitor ()
{
    if (serverConfig.youtubeenabled == "on")
    {

        if (localConfig.youtubeSchedulerHandle)
            clearTimeout(localConfig.youtubeSchedulerHandle)
        localConfig.youtubeSchedulerHandle = setTimeout(() =>
        {
            youtubeScheduler();
            // re-call ourselves to check if we are still enabled and set the next scheduled item 
            // could use a setInterval but this feels easier to read and understand to anyone looking
            // at the code
            startYoutubeMonitor()
        }, localConfig.youtubeSchedulerTimer);
    }
}
// ============================================================================
//                     FUNCTION: stopYoutubeMonitor
// ============================================================================
/**
 * Stop monitoring YouTube chat
 */
function stopYoutubeMonitor ()
{
    try
    {
        if (localConfig.youtubeSchedulerHandle)
            clearTimeout(localConfig.youtubeSchedulerHandle)
        localConfig.youtubeAPI = null;
        localConfig.liveChatAPI = null;
        localConfig.liveVideoId = null;

        SendSettingsWidgetSmall();
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".stopYoutubeMonitor() Error", error.status, error.message, error);
    }
}

// ============================================================================
//                     FUNCTION: youtubeScheduler
// ============================================================================
/**
 * scheduler to monitor for live streams and connection setup
 * will set localConfig vars depending on status (null if no valid data available)
 * 1) Sets/removes localConfig.youtubeAPI 
 * 2) Sets/removes localConfig.liveVideoId
 * 3) Sets/removes localConfig.liveChatAPI
 *
 * Notes
 * info.basic_info.is_live
 *  Only set to true when video is live and 'public' (if unlisted this doesn't get set). 
 *  Once set remains true until stream ends even if set to unlisted
 * info.basic_info.is_live_content
 *  Always set to true if this video was/is from a live recording
 * info.basic_info.is_unlisted
 *  we can't use this to check for an unlisted live stream as the live flag only gets set once
 *  a live stream has been 'public' at some point.
 */
async function youtubeScheduler ()
{
    let settingsUpdateNeeded = false;
    if (serverConfig.youtubeenabled == "on")
    {
        //
        // check for youtubeAPI
        //
        if (!localConfig.youtubeAPI)
        {
            let cookie = ""
            if (serverCredentials && serverCredentials.youtubeCookie && serverCredentials.youtubeCookie != "")
                cookie = serverCredentials.youtubeCookie

            file_log("//youtubeScheduler Getting Innertube handle for localConfig.youtubeAPI");
            localConfig.youtubeAPI = await Innertube.create({ cache: new UniversalCache(false), cookie: cookie })

            if (!localConfig.youtubeAPI)
            {
                file_log("//youtubeScheduler Innertube failed to return handle");
                //no localConfig.youtubeAPI so lets clear the other handles till we get one
                localConfig.liveChatAPI = null;
                localConfig.liveVideoId = null;
                settingsUpdateNeeded = true
            }
        }

        //
        // check for liveVideoId
        //
        if (localConfig.youtubeAPI && !localConfig.liveVideoId)
        {

            file_log("//youtubeScheduler looking for liveVideoId");
            // if we don't have a video we shouldn't have a chatAPI so clear it
            localConfig.liveChatAPI = null;
            let search = await localConfig.youtubeAPI.search(serverConfig.youtubechannelname, localConfig.filters)
            file_log("//youtubeScheduler got video list length = " + search.videos.length)
            if (search.videos && search.videos.length > 0)
            {
                // find the live video. Might be more than one if not using live flag
                for (let index = 0; index < search.videos.length; ++index)
                {
                    let info = await localConfig.youtubeAPI.getInfo(search.videos[index].id)
                    if (info.basic_info.is_live)
                    {
                        file_log("//youtubeScheduler found live video for id " + search.videos[index].id)
                        localConfig.liveVideoId = search.videos[0].id;
                        settingsUpdateNeeded = true; // settings displays a link to the current video so need to update
                        break;
                    }
                }
            }//search.videos && search.videos.length > 0
        }//localConfig.youtubeAPI & !localConfig.liveVideoId

        //
        // check for liveChatAPI
        //
        if (localConfig.youtubeAPI && localConfig.liveVideoId && !localConfig.liveChatAPI)
        {
            file_log("//youtubeScheduler getting liveChatAPI ")
            let info = await localConfig.youtubeAPI.getInfo(localConfig.liveVideoId)
            if (info)
            {
                file_log("//youtubeScheduler found liveChatAPI ")
                localConfig.liveChatAPI = info.getLiveChat()
                // as we have a new liveChatAPI lets setup the handlers
                localConfig.liveChatAPI.on('start', (initial_data) =>
                {
                    file_log("//callback 'start' ");
                    file_log(JSON.stringify(initial_data, null, 2))
                    // filter on live chat rather than TOP_CHAT
                    localConfig.liveChatAPI.applyFilter("LIVE_CHAT");
                    chatStart(initial_data)
                });

                localConfig.liveChatAPI.on('error', (error) =>
                {
                    file_log("//callback 'error' \n" + JSON.stringify(error, null, 2));
                    chatAPIError(error)
                });

                localConfig.liveChatAPI.on('end', () => 
                {
                    file_log("//callback 'end' ");
                    chatEnd()
                });
                localConfig.liveChatAPI.on('chat-update', (action) => chatMessage(action));
                localConfig.liveChatAPI.on('metadata-update', (metadata) => metaUpdate(metadata));
                // need to stop if we are reconnecting to remove callbacks
                if (localConfig.liveChatAPI.running)
                    localConfig.liveChatAPI.stop();
                file_log("// Starting live chat API");
                localConfig.liveChatAPI.start();
            }
        }//!localConfig.liveChatAPI
        if (localConfig.youtubeAPI && localConfig.liveVideoId)
        {
            let info = await localConfig.youtubeAPI.getInfo(localConfig.liveVideoId)
            file_log("info.basic_info.is_live" + info.basic_info.is_live)
            if (!info.basic_info.is_live)
            {
                settingsUpdateNeeded = true
                localConfig.liveVideoId = null;
            }
        }
    }//serverConfig.youtubeenabled == "on"

    // if we change data we display in our settings page we need to send a new one out.
    if (settingsUpdateNeeded)
        SendSettingsWidgetSmall();
}
// ============================================================================
//                     FUNCTION: chatStart
// ============================================================================
/**
 * Called when YouTube connection starts
 * @param {object} initial_data 
 */
function chatStart (initial_data)
{
    if (localConfig.youtubeAPI && localConfig.youtubeAPI.session)
        localConfig.signedIn = localConfig.youtubeAPI.session.logged_in;
    localConfig.connectedAsUsername = initial_data.viewer_name
    SendSettingsWidgetSmall()
}
/**
 * Called on YouTube error
 * @param {object} error 
 */
// ============================================================================
//                     FUNCTION: chatAPIError
// ============================================================================
/**
 * Called when a chatAPIError occurs
 * @param {object} error 
 */
function chatAPIError (error)
{
    if (localConfig.youtubeAPI && localConfig.youtubeAPI.session)
        localConfig.signedIn = localConfig.youtubeAPI.session.logged_in;
    else
        localConfig.signedIn = false

    if (error && error.info && error.info != {})
    {
        console.log("chatAPIError error, possible live stream ended.", error.info)
    }
    else
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".chatAPIError error", error);

        if (error && error.info)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".chatAPIError error.info", error.info);
    }
    stopYoutubeMonitor()

}
// ============================================================================
//                     FUNCTION: metaUpdate
// ============================================================================
/**
 * Called when the metadata is updated for the stream
 * @param {object} metadata 
 */
function metaUpdate (metadata)
{
    file_log("// metaUpdate() metadata.views.is_live = " + metadata.views.is_live);
    if (!metadata.views.is_live)
    {
        localConfig.liveVideoId = null;
    }
    if (localConfig.youtubeAPI && localConfig.youtubeAPI.session)
        localConfig.signedIn = localConfig.youtubeAPI.session.logged_in;
}
// ============================================================================
//                     FUNCTION: chatEnd
// ============================================================================
/**
 * Called on chat end/stream end
 */
function chatEnd ()
{
    if (localConfig.youtubeAPI && localConfig.youtubeAPI.session)
        localConfig.signedIn = localConfig.youtubeAPI.session.logged_in;
    localConfig.liveChatAPI = null;
    localConfig.liveVideoId = null;
}
// ============================================================================
//                     FUNCTION: chatMessage
// ============================================================================
/**
 * Called when a chat message is received
 * @param {object} action 
 */
function chatMessage (action)
{
    file_log("//################### chatMessage()  \n" + JSON.stringify(action, null, 2));
    // set our status flags as appropriate

    if (localConfig.youtubeAPI && localConfig.youtubeAPI.session)
        localConfig.signedIn = localConfig.youtubeAPI.session.logged_in;

    if (action.is(YTNodes.AddChatItemAction))
    {
        const item = action.as(YTNodes.AddChatItemAction).item;

        if (!item)
        {
            console.log('Chat Action did not have an item.', action);
            return;
        }
        const hours = new Date(item.hasKey('timestamp') ? item.timestamp : Date.now()).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        switch (item.type)
        {
            case 'LiveChatTextMessage':
                sendChatMessageTrigger(item, hours);
                break;
            case 'LiveChatPaidMessage':
                sendLiveChatPaidMessage(item.as(YTNodes.LiveChatPaidMessage), hours)
                break;
            case 'LiveChatPaidSticker':
                sendLiveChatPaidSticker(item.as(YTNodes.LiveChatPaidSticker), hours)
                break;
            default:
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".chatMessage Item type needs handling", item.type);
                break;
        }
    }

    if (action.is(YTNodes.AddBannerToLiveChatCommand))
    {
        console.info('Message pinned:', action.banner?.contents, ". Needs implementation");
    }

    if (action.is(YTNodes.RemoveBannerForLiveChatCommand))
    {
        console.info(`Message with action id ${action.target_action_id} was unpinned.`, ". Needs implementation");
    }

    if (action.is(YTNodes.RemoveChatItemAction))
    {
        console.warn(`Message with action id ${action.target_item_id} just got deleted!`, ". Needs implementation");
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Processes and send out our small settings widget
 * @param {string?} toExtension optional extension name to send to other wise broadcast the message
 */
function SendSettingsWidgetSmall (toExtension = "")
{
    // read our modal file
    fs.readFile(__dirname + '/youtubesettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
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
            modalString = modalString.replace("youtubeBrowserCookieStatus", "Status: " + localConfig.youtubeBrowserCookieStatus);
            if (localConfig.connectedAsUsername || localConfig.connectedAsUsername != "")
                modalString = modalString.replace("YouTubeConnectedAs", `Connected as '${localConfig.connectedAsUsername || 'Guest'}'`);
            else
                modalString = modalString.replace("YouTubeConnectedAs", "Connected as 'Guest'}");

            //Update live video link
            if (localConfig.liveVideoId)
                modalString = modalString.replace("LiveVideoLinkPlaceholder", "<a href='https://www.youtube.com/watch?v=" + localConfig.liveVideoId + "' target='SRYTVideo'>Live Video Link</a>")
            else
                modalString = modalString.replace("LiveVideoLinkPlaceholder", "No current live video<BR>")

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
//                           FUNCTION: sendLiveChatPaidMessage
// ===========================================================================
/**
 * Processes a Paid chat messages message
 * @param {object} ytmessage 
 * @param {string} time 
 */
function sendLiveChatPaidMessage (ytmessage, time)
{
    console.log("TBD live chat paid message received. Needs implementation");
    console.info(
        `${ytmessage.author?.is_moderator ? '[MOD]' : ''}`,
        `${time} - ${ytmessage.author.name.toString()}:\n` +
        `${ytmessage.message.toString()}\n`,
        `${ytmessage.purchase_amount}\n`
    );

}
// ===========================================================================
//                           FUNCTION: sendLiveChatPaidSticker
// ===========================================================================
/**
 * Processes a Paid chat sticker message
 * @param {object} ytmessage 
 * @param {string} time 
 */
function sendLiveChatPaidSticker (ytmessage, time)
{
    console.log("TBD live chat paid sticker received. Needs implementation");
    console.info(
        `${ytmessage.author?.is_moderator ? '[MOD]' : ''}`,
        `${time} - ${ytmessage.author.name.toString()}:\n` +
        `${ytmessage.purchase_amount}\n`
    );

}
// ===========================================================================
//                           FUNCTION: sendChatMessageTrigger
// ===========================================================================
/**
 * Processes a chat message and sends out the trigger "trigger_ChatMessageReceived"
 * @param {object} ytmessage 
 * @param {string} time 
 */
function sendChatMessageTrigger (ytmessage, time)
{
    try
    {
        let triggerToSend = findTriggerByMessageType("trigger_ChatMessageReceived")
        let safemessage = sanitiseHTML(ytmessage.message);
        safemessage = ytmessage.message.text.replace(/[^\x00-\x7F]/g, "");
        triggerToSend.parameters = {

            textMessage: ytmessage.author.name + ": " + ytmessage.message.text,
            safemessage: safemessage,
            color: "#FF0000",// possibly use color from menu for mods etc

            // youtube message data
            id: ytmessage.id,
            ytmessagetype: ytmessage.type,
            message: ytmessage.message.text,
            //messageruns: ytmessage.message.runs,
            timestamp: ytmessage.timestamp,

            //youtube author data
            sender: ytmessage.author.name,
            senderid: ytmessage.author.id,

            senderprofileimageurl: ytmessage.author.thumbnails[0].url,
            senderbadges: ytmessage.author.badges,
            senderisverified: ytmessage.author.is_verified,
            senderischatmoderator: ytmessage.author.is_moderator,
        }
        postTrigger(triggerToSend);

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".SendSettingsWidgetSmall", "failed to load modal", err);
    }
}
// ============================================================================
//                           FUNCTION: postLiveChatMessages
// ============================================================================
/**
 * TBD: Send a message to youtube chat TBD
 * @param {object} data 
 */
function postLiveChatMessages (data)
{
    if (localConfig.liveChatAPI)
    {
        localConfig.liveChatAPI.sendMessage(data.message)
            .then((commentResponse) =>
            {
                // no need to do anything if it posts ok.
                //console.log("commentResponse", JSON.stringify(commentResponse, null, 2))
            })
            .catch((err) =>
            {
                console.log("Error: postLiveChatMessages()", JSON.stringify(err, null, 2))
            })
    }
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds a trigger from the messagetype
 * @param {string} messagetype 
 * @returns {object} trigger
 */
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
/**
 * Posts a trigger out on our channel
 * @param {object} data 
 */
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
// #######################################################################
// ######################### sanitiseHTML ##########################
// #######################################################################
/**
 * Removes html chars from a string to avoid chat message html injection
 * @param {string} string 
 * @returns {string} the parsed string
 */
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
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Provides a heartbeat message to inform other extensions of our status
 */
function heartBeatCallback ()
{
    let connected = false;
    let color = "red";

    if (serverConfig.youtubeenabled === "on")
    {
        connected = true;
        if (localConfig.liveVideoId && localConfig.signedIn)
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
//                           FUNCTION: file_log
//             For debug purposes. logs performance data
// ============================================================================
function file_log (data, override_debug = false)
{
    if (!DEBUG_LOGGING && !override_debug)
        return;
    try
    {
        //console.log("logging data");
        var filename = __dirname + "/debug_logging.json";

        fs.writeFileSync(filename, data + "\n", {
            encoding: "utf8",
            flag: "a+",
        });
    }
    catch (error)
    {
        console.log("debug file logging error", error.message)
    }
}
export { initialise, triggersandactions };
