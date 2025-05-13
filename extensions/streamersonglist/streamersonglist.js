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
 * @extension StreamerSongList
 * Connects to the StreamerSongList service to allow adding/removing/viewing songList data.
 * Mostly used by music streamers to queue music for viewers.
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// logger will allow you to log messages in the same format as the system messages
import * as logger from "../../backend/data_center/modules/logger.js";
// extension helper provides some functions to save you having to write them.
import * as fs from "fs";
import fetch from 'node-fetch';
import io from 'socket.io-client';
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    ssl_client: null,
    status: {
        connected: false,
    },
    pollSongQueueHandle: null,
    pollSongListHandle: null,
    songlist: [],
    songQueue: [],
    currentsong: "",
    // set to ignore first load messages
    firstload: true,

    // handle to avoid multiple joins on updated credentials
    joinsSSLTimer: 1000,
    joinsSSLHandle: null,

    largeSettingsTimer: 1000,
    largeSettingsHandle: null,

    startupCheckTimer: 500,
    ready: false,
    readinessFlags: {
        ConfigReceived: false,
        CredentialsReceived: false
    },
};
const default_serverConfig = {
    __version__: 0.5,
    extensionname: "streamersonglist",
    channel: "STREAMERSONGLIST_CHANNEL",
    sslURI: "https://api.streamersonglist.com",
    enableStreamerSongList: "off",
    //streamerSongListName: "",
    pollSongQueueTimeout: 180000, // check for updated queue every 3 minutes in case the socket goes down
    pollSongListTimeout: 300000, // check for updated songs every 5 minutes in case the socket goes down
    heartBeatTimeout: 5000,
};
let serverCredentials =
{
    username: "",
    authToken: "",
    userID: "",
    streamerID: "",
}
let serverConfig = structuredClone(default_serverConfig);

const SSL_SOCKET_EVENTS = {
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    NEW_SONG: 'new-song',
    RELOAD_SONG_LIST: 'reload-song-list',
    UPDATE_SONG: 'update-song',
    UPDATE_SONGS: 'update-songs',
    DELETE_SONG: 'delete-song',
    UPDATE_QUEUE_LIST: 'queue-update',
    RELOAD_SAVED_QUEUE_LIST: 'reload-saved-queue',
    QUEUE_MESSAGE: 'queue-event',
    NEW_PLAYHISTORY: 'new-playhistory',
    UPDATE_PLAYHISTORY: 'update-playhistory',
    DELETE_PLAYHISTORY: 'delete-playhistory',
    UPDATE_STREAMER: 'update-streamer',
    UPDATE_ATTRIBUTES: 'update-attributes',
};
// events we want to reload songlist or queue on 
const SSL_RELOAD_EVENTS =
    ['queue-event', 'reload-song-list']

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Streamer songlist (SSL) is a tool for streamers to keep track of songs in a queue that viewers requests <a href='https://www.streamersonglist.com/'>SSL Website</a>",
    version: "0.2",
    channel: serverConfig.channel,
    // these are messages we can sendout that other extensions might want to use to trigger an action
    triggers:
        [
            {
                name: "SSLSongAddedToQueue",
                displaytitle: "Song Added To Queue",
                description: "Song was added to queue",
                messagetype: "trigger_SongAddedToQueue",
                parameters: {
                    songName: "",
                    htmlMessage: ""
                }
            }
            ,
            {
                name: "SSLCurrentSongChanged",
                displaytitle: "Current Song Changed",
                description: "Current song changed",
                messagetype: "trigger_CurrentSongChange",
                parameters: {
                    songName: "",
                    htmlMessage: ""
                }
            }

        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "SSLAddSongToQueue",
                displaytitle: "Add Song To Queue",
                description: "Add a song to the queue",
                messagetype: "action_AddSongToQueue",
                parameters: { songName: "" }
            }
            ,
            {
                name: "SSLPlaySong",
                displaytitle: "Mark Song as played",
                description: "Mark a song as played",
                messagetype: "action_MarkSongAsPlayed",
                parameters: { songName: "" }
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
    localConfig.heartBeatTimeout = heartbeat
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
        startupCheck();
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
    // do something here when disconnt happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Description: Received connect message
// Parameters: socket 
// ----------------------------- notes ----------------------------------------
// When we connect to the StreamRoller server the first time (or if we reconnect)
// we will get this function called.
// it is also a good place to create/join channels we wish to use for data
// monitoring/sending on.
// ===========================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, serverConfig.heartBeatTimeout);
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
    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
        if (server_packet.data != "" && server_packet.data.extensionname === serverConfig.extensionname)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Received config");
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            pollSongQueueCallback();
            pollSongListCallback();
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.CredentialsReceived = true;

        if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != "")
        {
            // temp code to change discord token name to newer variable.
            // remove code in future. Added in 0.3.4
            if (server_packet.data.clientId)
            {
                serverCredentials.username = server_packet.data.username;
                serverCredentials.authToken = server_packet.data.clientId;
                serverCredentials.userID = server_packet.data.userId;
                serverCredentials.streamerID = server_packet.data.streamerId;
                DeleteCredentialsOnServer()
                SaveCredentialToServer("username", serverCredentials.username)
                SaveCredentialToServer("authToken", serverCredentials.authToken)
                SaveCredentialToServer("userID", serverCredentials.userID)
                SaveCredentialToServer("streamerID", serverCredentials.streamerID)
            }

            serverCredentials.username = server_packet.data.username;
            serverCredentials.authToken = server_packet.data.authToken;
            serverCredentials.userID = server_packet.data.userID;
            serverCredentials.streamerID = server_packet.data.streamerID;
            if (serverConfig.enableStreamerSongList == "on")
                joinSslServer()
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.streamerSongListName != serverCredentials.username)
                {
                    serverCredentials.username = extension_packet.data.streamerSongListName;
                    SaveCredentialToServer("username", serverCredentials.username)
                    if (extension_packet.data.enableStreamerSongList)
                        serverConfig.enableStreamerSongList = "on"
                    else
                        serverConfig.enableStreamerSongList = "off"
                }
                // if we have enabled/disabled connection
                if (serverConfig.enableStreamerSongList != extension_packet.data.enableStreamerSongList)
                {
                    // TURNING OFF SSL
                    //we are currently enabled so lets stop polling
                    if (serverConfig.enableStreamerSongList == "on")
                    {
                        localConfig.status.connected = false;
                        localConfig.songlist = [];
                        localConfig.songQueue = [];
                        localConfig.currentsong = "";
                        clearTimeout(localConfig.pollSongQueueTimeout);
                        sendSongQueue(extension_packet.from);
                        serverConfig.enableStreamerSongList = "off";
                    }
                    // TURNING ON SSL
                    //currently disabled so lets start
                    else
                    {
                        localConfig.status.connected = true;
                        serverConfig.enableStreamerSongList = "on";
                        pollSongQueueCallback();
                        pollSongListCallback();
                    }
                }

                serverConfig.enableStreamerSongList = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
            }
            if (serverConfig.enableStreamerSongList == "on")
                joinSslServer()
            //update anyone who is showing our code at the moment
            SendSettingsWidgetSmall("");

        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLargeData(extension_packet.data)
        }
        else if (extension_packet.type === "RequestQueue")
        {
            sendSongQueue(extension_packet.from);
        }
        else if (extension_packet.type === "RequestSonglist")
        {
            sendSongList(extension_packet.from);
        }
        else if (extension_packet.type === "action_AddSongToQueue")
        {
            if (extension_packet.data.songName)
                addSongToQueuebyName(extension_packet.data.songName)
            else
                addSongToQueueById(extension_packet.data);
        }
        else if (extension_packet.type === "action_MarkSongAsPlayed")
        {
            markSongAsPlayed(extension_packet.data);
        }
        else if (extension_packet.type === "RemoveSongFromQueue")
        {
            removeSongFromQueue(extension_packet.data);
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            if (serverConfig.enableStreamerSongList == "on")
            {
                sendTriggersAndActions(server_packet.from)
            }
        }
        // add next section back in to monitor all messages received including ones we don't care about
        /*
        else
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
        */
    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        setTimeout(() =>
        {
            // resent the register command to see if the extension is up and running yet
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);

    }
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
//                           FUNCTION: sendTriggersAndActions
// ===========================================================================
/**
 * Sends out triggers and actions out to the given extension name
 * @param {string} from 
 */
function sendTriggersAndActions (from)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "TriggerAndActions",
                serverConfig.extensionname,
                triggersandactions,
                "",
                from
            ),
            "",
            from
        )
    )
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
{
    // read our modal file
    fs.readFile(__dirname + "/streamersonglistsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            modalstring = modalstring.replace("streamerSongListNametext", serverCredentials.username);
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            // send the modified modal data to the server
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

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * @param {String} to channel to send to or "" to broadcast
 */
function SendSettingsWidgetLarge (to = "")
{
    clearTimeout(localConfig.largeSettingsHandle)
    localConfig.largeSettingsHandle = setTimeout(() =>
    {
        if (serverConfig.enableStreamerSongList == "on")
            SendSettingsWidgetLargeScheduler(to);
        localConfig.largeSettingsHandle = null;
    }, localConfig.largeSettingsTimer);
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLargeScheduler
// ===========================================================================
/**
 * @param {String} to channel to send to or "" to broadcast
 */
function SendSettingsWidgetLargeScheduler (to = "")
{
    // read our modal file
    fs.readFile(__dirname + "/streamersonglistsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLargeScheduler", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            // replace any of our server config variables'text' names in the file
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }
            modalString = modalString.replace("username_StreamerSongListtext", serverCredentials.username);
            modalString = modalString.replace("authToken_StreamerSongListtext", serverCredentials.authToken);
            modalString = modalString.replace("userID_StreamerSongListtext", serverCredentials.userID);
            modalString = modalString.replace("streamerID_StreamerSongListtext", serverCredentials.streamerID);
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        "",
                        to,
                        serverConfig.channel
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: parseSettingsWidgetLargeData
/**
 * parse the received data from a modal submit from the user
 * @param {object} extData // modal data
 */
// ===========================================================================
function parseSettingsWidgetLargeData (extData)
{
    let restartConnection = false;
    // reset to defaults
    if (extData.streamerSongList_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        //default credentials
        SaveCredentialToServer("username", "");
        serverCredentials.username = "";
        SaveCredentialToServer("authToken", "");
        serverCredentials.authToken = "";
        SaveCredentialToServer("userID", "");
        serverCredentials.userID = "";
        SaveCredentialToServer("streamerID", "");
        serverCredentials.streamerID = "";
        restartConnection = true;
    }
    else
    {
        // update credentials if they have changed
        if (extData.username_StreamerSongList != serverCredentials.username)
        {
            restartConnection = true;
            serverCredentials.username = extData.username_StreamerSongList;
            if (serverCredentials.username)
                SaveCredentialToServer("username", serverCredentials.username);
        }
        if (extData.authToken_StreamerSongList != serverCredentials.authToken)
        {
            restartConnection = true;
            serverCredentials.authToken = extData.authToken_StreamerSongList;
            if (serverCredentials.authToken)
                SaveCredentialToServer("authToken", serverCredentials.authToken);
        }
        if (extData.userID_StreamerSongList != serverCredentials.userID)
        {
            restartConnection = true;
            serverCredentials.userID = extData.userID_StreamerSongList;
            if (serverCredentials.userID)
                SaveCredentialToServer("userID", serverCredentials.userID);
        }
        if (extData.streamerID_StreamerSongList != serverCredentials.streamerID)
        {
            restartConnection = true;
            serverCredentials.streamerID = extData.streamerID_StreamerSongList;
            if (serverCredentials.streamerID)
                SaveCredentialToServer("streamerID", serverCredentials.streamerID);
        }

        if (restartConnection)
        {
            // if we have changed some settings that need us to re-log into the server
            if (serverConfig.enableStreamerSongList == "on")
                joinSslServer()
            else
            {
                if (localConfig.ssl_client != null)
                {
                    localConfig.ssl_client.disconnect();
                    localConfig.ssl_client == null;
                }
            }
        }
    }
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall("");
    SendSettingsWidgetLarge("");
    SaveConfigToServer();
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * save config file to the server
 */
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket(
        "SaveConfig",
        serverConfig.extensionname,
        serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveCredentialToServer
// ============================================================================
/**
 * Sends Credential to the server to be saved
 * @param {string} name 
 * @param {string} value 
 */
function SaveCredentialToServer (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredential",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
                CredentialName: name,
                CredentialValue: value,
            },
        ));
}
// ============================================================================
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Delete our credential file from the server
 */
function DeleteCredentialsOnServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "DeleteCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
            },
        ));
}
// ============================================================================
//                      FUNCTION: joinSslServer
//                        Join the Song list server for updates
// ============================================================================
/**
 * Joins the StreamerSongList service using a timer to suppress multiple quick joins
 * These might be called during a credentials file update
 */
function joinSslServer ()
{
    clearTimeout(localConfig.joinsSSLHandle)
    localConfig.joinsSSLHandle = setTimeout(() =>
    {
        if (serverConfig.enableStreamerSongList == "on")
            joinSslServerScheduler();
        localConfig.joinsSSLHandle = null;
    }, localConfig.joinsSSLTimer);

}
// ============================================================================
//                      FUNCTION: joinSslServerScheduler
//                     Join the Song list server for updates
// ============================================================================
/**
 * Joins the StreamerSongList service
 */
function joinSslServerScheduler ()
{
    // if we already have a connection lets remove that one (so we can start a new one with any changed data/creds)
    if (localConfig.ssl_client != null)
    {
        localConfig.ssl_client.disconnect();
        localConfig.ssl_client == null;
    }
    localConfig.ssl_client = io(serverConfig.sslURI, {
        transports: ["websocket"],
        reconnection: true,
    });
    localConfig.ssl_client.on('connect', () =>
    {
        // add all our handlers
        for (const [key] of Object.entries(SSL_SOCKET_EVENTS))
        {
            localConfig.ssl_client.on(SSL_SOCKET_EVENTS[key], (msg) =>
            {
                logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "StreamerSonglist socket callback received ", SSL_SOCKET_EVENTS[key]);
                if ("QUEUE_MESSAGE" == key)
                {
                    if (msg.added)
                    {
                        let triggertosend = findtriggerByMessageType("trigger_SongAddedToQueue")
                        triggertosend.parameters.songName = msg.title
                        triggertosend.parameters.htmlMessage = "Song Added to queue: " + msg.title
                        sr_api.sendMessage(localConfig.DataCenterSocket,
                            sr_api.ServerPacket("ChannelData",
                                serverConfig.extensionname,
                                sr_api.ExtensionPacket(
                                    "trigger_SongAddedToQueue",
                                    serverConfig.extensionname,
                                    triggertosend,
                                    serverConfig.channel),
                                serverConfig.channel
                            ),
                        );
                    }
                    fetchSongQueue();

                }
                else if (SSL_RELOAD_EVENTS.includes(SSL_SOCKET_EVENTS[key]) && serverConfig.enableStreamerSongList == "on")
                {
                    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage:ssl_client.on message", "StreamerSonglist socket callback received, updating songs and queue: ", SSL_SOCKET_EVENTS[key]);
                    fetchSongList();
                    fetchSongQueue();
                }
            });
        }

        try
        {
            localConfig.ssl_client.emit("join-room", serverCredentials.streamerID);
        } catch (error)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage:ssl_client.join room", "Failed to join room");
        }
    });

    // perform a fetch of the lists in case we get asked for them later
    fetchSongList()
    fetchSongQueue()
    // start our times if we haven't already
    pollSongQueueCallback();
    pollSongListCallback();
}
// ============================================================================
//                      FUNCTION: sendSongQueue
// ============================================================================
/**
 * Sends the current songQueue to the given extension name
 * @param {string} extensionsname 
 */
function sendSongQueue (extensionsname)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SongQueue",
                    serverConfig.extensionname,
                    localConfig.songQueue,
                    "",
                    extensionsname
                ),
                "",
                extensionsname
            ));
    }
}
// ============================================================================
//                     FUNCTION: outputSongQueue
// ============================================================================
/**
 * Sends the current songQueue out on our channel
 */
function outputSongQueue ()
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SongQueue",
                    serverConfig.extensionname,
                    localConfig.songQueue,
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
}
// ============================================================================
//                           FUNCTION: fetchSongQueue
// ============================================================================
/**
 * Fetches the current song queue from the StreamerSonglist server
 */
function fetchSongQueue ()
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.username}/queue`, {
            headers: { 'Client-ID': serverCredentials.authToken, },
        })
            .then(response =>
            {
                if (!response.ok)
                    throw new Error('Request failed with status ' + response.status);
                return response.json();
            })
            .then(data =>
            {

                localConfig.songQueue = data;
                if (localConfig.songQueue.list.length > 0 && localConfig.currentsong != localConfig.songQueue.list[0].song.title)
                {
                    localConfig.currentsong = localConfig.songQueue.list[0].song.title
                    sendCurrentSongChange("")
                }
                else if (localConfig.songQueue.list.length == 0)
                {

                    localConfig.currentsong = ""
                    sendCurrentSongChange("")
                }

                outputSongQueue();
                localConfig.status.connected = true;
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".fetchSongQueue", "Error getting songs queue. Check Credentials/login details");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".fetchSongQueue", "Error getting songs queue, have you setup credentials?", e.Error);
            });
    }
}
// ============================================================================
//                       FUNCTION: sendSongList
// ============================================================================
/**
 * Sends the full songlist to given extensionextension
 * @param {string} extension 
 */
function sendSongList (extension)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SongList",
                    serverConfig.extensionname,
                    localConfig.songlist,
                    "",
                    extension
                ),
                "",
                extension
            ));
    }
}
// ============================================================================
//                       FUNCTION: sendCurrentSongChange
//                      send songlist to extension
// ============================================================================
/**
 * Sends a trigger_CurrentSongChange message to given extensionextension
 * @param {string} extension 
 */
function sendCurrentSongChange (extension)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        let songtext = ""
        if (localConfig.currentsong != "")
            songtext = "Current song now: " + localConfig.currentsong

        let triggertosend = findtriggerByMessageType("trigger_CurrentSongChange")
        triggertosend.parameters.songName = localConfig.currentsong
        triggertosend.parameters.htmlMessage = songtext
        if (extension != "")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "trigger_CurrentSongChange",
                        serverConfig.extensionname,
                        triggertosend,
                        serverConfig.channel,
                        extension
                    ),
                    serverConfig.channel,
                    extension
                ));
        }
        else
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ChannelData",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "trigger_CurrentSongChange",
                        serverConfig.extensionname,
                        triggertosend,
                        serverConfig.channel
                    ),
                    serverConfig.channel
                ));
        }
    }
}
// ============================================================================
//                           FUNCTION: outputSongList
// ============================================================================
/**
 * Outputs the full songlist on our channel
 */
function outputSongList ()
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SongList",
                    serverConfig.extensionname,
                    localConfig.songlist,
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
}
// ============================================================================
//                           FUNCTION: fetchSongList
// ============================================================================
/**
 * Fetches the full songlist from the StreamerSonglist server
 */
function fetchSongList ()
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.username}/songs`, {
            headers: { 'Client-ID': serverCredentials.authToken, },
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".fetchSongList", "Error getting songs list. Check Credentials/login details. Request failed with status " + response.status)
                    return
                }

                return response.json();
            })
            .then(data =>
            {
                localConfig.songlist = data;
                outputSongList();
                localConfig.status.connected = true;
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".fetchSongList", "Error getting songs list. Check Credentials/login details");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".fetchSongList", "Error getting songs list", e.Error);
            });
    }
}
// ============================================================================
//                           FUNCTION: addSongToQueuebyName
// ============================================================================
/**
 * Adds a song by name to the songlist queue on the server
 * @param {string} songName 
 */
function addSongToQueuebyName (songName)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        let found = false
        localConfig.songlist.items.forEach((song) =>
        {
            if (songName.toLowerCase().indexOf(song.title.toLowerCase()) > -1)
            {
                addSongToQueueById(song.id)
                found = true;
            }
        })
        if (!found)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addSongToQueuebyName", "Unknown Song", songName);
    }
}
// ============================================================================
//                           FUNCTION: addSongToQueue
// ============================================================================
/**
 * Adds a song by id to the songlist queue on the server
 * @param {number} songId 
 */
function addSongToQueueById (songId)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.streamerID}/queue/${songId}/request`, {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + serverCredentials.authToken,
                "origin": "StreamRoller",
                "source": "StreamRoller",
            }
        })
            .then(response =>
            {
                if (!response.ok)
                    throw new Error('Request failed with status ' + response.status);
                return response.json();
            })
            .then(data =>
            {
                fetchSongQueue();
                localConfig.status.connected = true;
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addSongToQueueById", "Error adding song to queue. Check Credentials/login details");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addSongToQueueById", "Error adding song to queue.", e.Error);
            });
    }
}

// ============================================================================
//                           FUNCTION: removeSongFromQueue
// ============================================================================
/**
 * Removes a song queue song using it's queueId
 * @param {number} queueId Queue id of item to remove
 */
function removeSongFromQueue (queueId)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + serverCredentials.authToken,
            "origin": "StreamRoller",
            "queueId": queueId
        };
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.streamerID}/queue/${queueId}`, { method: 'DELETE', headers: headers })
            .then(response =>
            {
                if (!response.ok)
                    throw new Error('Request failed with status ' + response.status, response.statusText);
                return response.json();
            })
            .then(data =>
            {
                fetchSongQueue()
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeSongFromQueue", "Error removing song from queue. Check Credentials/login details");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeSongFromQueue", "Error removing song from queue.", e.Error);

            });
    }
}

// ============================================================================
//                           FUNCTION: markSongAsPlayed
// ============================================================================
/**
 * Mark a song in the current queue as being played
 * @param {number} queueId 
 */
function markSongAsPlayed (queueId)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.streamerID}/queue/${queueId}/played`, {
            method: 'POST',
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + serverCredentials.authToken,
                "origin": "StreamRoller"
            }
        })
            .then(response =>
            {
                if (!response.ok)
                {
                    throw new Error('Request failed with status ' + response.status);
                }
                return response.json();
            })
            .then(data =>
            {
                fetchSongQueue()
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".markSongAsPlayed", "Error Marking song as played, check credentials/login");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".markSongAsPlayed", "Error Marking song as played", e.Error);
            });
    }
}

// ============================================================================
//                           FUNCTION: saveQueue
// ============================================================================
function saveQueue (queue)
{
    if (serverConfig.enableStreamerSongList == "on")
    {
        fetch(`${serverConfig.sslURI}/v1/streamers/${serverCredentials.streamerID}/queue`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': serverCredentials.authToken,
            },
            body: JSON.stringify(queue),
        })
            .then(response =>
            {
                if (!response.ok)
                    throw new Error('Request failed with status ' + response.status);
            })
            .catch(e =>
            {
                if (e.message.indexOf("status 401") > -1)
                {
                    localConfig.status.connected = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".saveQueue", "Error saving queue. Check Credentials/login details");
                }
                else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".saveQueue", "Error saving queue", e.Error);
            });
    }
}
// ============================================================================
//                           FUNCTION: pollSongQueueCallback
// ============================================================================
/**
 * Callback from the song queue timer
 */
function pollSongQueueCallback ()
{
    if (serverConfig.enableStreamerSongList == "on" && serverCredentials.username != "")
    {
        try
        {
            fetchSongQueue();
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pollSongQueueCallback", "callback failed:", err.message);
        }
    }
    if (localConfig.pollSongQueueHandle)
        clearTimeout(localConfig.pollSongQueueHandle)
    localConfig.pollSongQueueHandle = setTimeout(pollSongQueueCallback, serverConfig.pollSongQueueTimeout)
}
// ============================================================================
//                           FUNCTION: pollSongListCallback
// ============================================================================
/**
 * Timer for polling the songlist
 */
function pollSongListCallback ()
{
    if (serverConfig.enableStreamerSongList == "on" && serverCredentials.username != "" && serverCredentials.authToken != "")
    {
        try
        {
            fetchSongList()
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pollSongListCallback", "callback failed:", err.message);
        }
    }
    if (localConfig.pollSongListHandle)
        clearTimeout(localConfig.pollSongListHandle)
    localConfig.pollSongListHandle = setTimeout(pollSongListCallback, serverConfig.pollSongListTimeout)
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    let color = "red"
    if (serverConfig.enableStreamerSongList == "on")
    {
        if (localConfig.status.connected)
            color = "green"
        else
            color = "orange"
    }
    try
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "HeartBeat",
                    serverConfig.extensionname,
                    {
                        connected: localConfig.status.connected,
                        color: color
                    },
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "callback failed:", err.message);
    }
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, serverConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * Find a trigger by messagetype
 * @param {string} messagetype 
 * @returns trigger
 */
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return structuredClone(triggersandactions.triggers[i]);
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * waits for config and credentials files to set ready flag
 */
function startupCheck ()
{
    const allReady = Object.values(localConfig.readinessFlags).every(flag => flag);
    if (allReady)
    {
        localConfig.ready = true;
        try
        {
            postStartupActions();
            // perform any startup stuff here that requires saved credentials and config
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", "connectToSE Error:", err);
        }
    }
    else
        setTimeout(startupCheck, localConfig.startupCheckTimer);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * At this point we should have any config/credentials loaded
 */
function postStartupActions ()
{
    // Let the server know we are now up and running.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionReady", serverConfig.extensionname));
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

