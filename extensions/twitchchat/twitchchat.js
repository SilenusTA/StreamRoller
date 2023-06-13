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
// ############################# TWITCHCHAT.js ##############################
// Simple twitch chat reader so we can display/parse twitch chat/commands
// in other extension
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 06-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// receive twitch chat message
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// using lib: https://github.com/tmijs/docs
// currently restricted to be configured one bot and one user.
// only the user account is monitored for messages.
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "TWITCH_CHAT",
    EXTENSION_NAME: "twitchchat",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    twitchClient: ["bot", "user"],
    usernames: [],
    channelConnectionAttempts: 20,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    saveDataHandle: null,
    logRawMessages: false
};
localConfig.twitchClient["bot"] = {
    connection: null,
    state: {
        readonly: true,
        connected: false,
        emoteonly: false,
        followersonly: -1,
        r9k: false,
        slowmode: false,
        subsonly: false
    }
}
localConfig.twitchClient["user"] = {
    connection: null,
    state: {
        readonly: true,
        connected: false,
        emoteonly: false,
        followersonly: -1,
        r9k: false,
        slowmode: false,
        subsonly: false
    }
}
const default_serverConfig = {
    __version__: 0.1,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabletwitchchat: "on",
    updateUserLists: "off",
    streamername: "OldDepressedGamer",
    chatMessageBufferMaxSize: "300",
    chatMessageBackupTimer: "60",
    twitchchat_restore_defaults: "off",
    //credentials variable names to use (in credentials modal, data doesn't get stored here)
    credentialscount: "4",
    cred1name: "twitchchatbot",
    cred1value: "",
    cred2name: "twitchchatbotoauth",
    cred2value: "",
    cred3name: "twitchchatuser",
    cred3value: "",
    cred4name: "twitchchatuseroauth",
    cred4value: "",
    /// this debug settings will post messages internally only and not to twich
    DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH: "off",
    DEBUG_EXTRA_CHAT_MESSAGE: "off",
    DEBUG_LOG_DATA_TO_FILE: "off"
};
let serverConfig = structuredClone(default_serverConfig)

const serverData =
{
    chatMessageBuffer: [{
        channel: serverConfig.streamername + " (Readonly)",
        message: "Empty chat buffer",
        data: { 'display-name': serverConfig.streamername, emotes: '' }
    }
    ],
}

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "host", host, "port", port, "hoheartbeatst", heartbeat);
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage,
            onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
// Desription: Received disconnect message
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Received connect message
// Parameters: none
// ----------------------------- notes ----------------------------------------
// When we connect to the StreamRoller server the first time (or if we reconnect)
// we will get this function called. we need to store our clientID here.
// it is also a good place to create/join channels we wish to use for data
// monitoring/sending on.
// ===========================================================================
function onDataCenterConnect (socket)
{
    // create our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", localConfig.EXTENSION_NAME));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", localConfig.EXTENSION_NAME));
    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Desription: Received message
// Parameters: data
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);
        }
        SaveConfigToServer();
        // restart the sceduler in case we changed the values
        SaveChatMessagesToServerScheduler();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.to === serverConfig.extensionname)
        {
            // check we have been sent something
            if (server_packet.data != "")
            {
                if (server_packet.data.twitchchatuser && server_packet.data.twitchchatuseroauth)
                {
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    localConfig.usernames.user["oauth"] = server_packet.data.twitchchatuseroauth;
                }
                if (server_packet.data.twitchchatbot && server_packet.data.twitchchatbotoauth)
                {
                    localConfig.usernames.bot = [];
                    localConfig.usernames.bot["name"] = server_packet.data.twitchchatbot;
                    localConfig.usernames.bot["oauth"] = server_packet.data.twitchchatbotoauth;
                }
                // start connection
                if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                {
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            reconnectChat(key);
                        else
                            connectToTwtich(key);
                    }
                }
                else
                {
                    /* Readonly connection */
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    connectToTwtich("user");
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                }
            }
            else // credentials empty so connected with previous credentials if we have them
            {
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                    serverConfig.extensionname + " CredentialsFile", "Credential file is empty, connecting readonly");
                // connect with existing credentials if we have them
                if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                {
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            reconnectChat(key);
                        else
                            connectToTwtich(key);
                    }
                }
                else // connect readonly if no credentials available
                {
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    connectToTwtich("user");
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                }
            }
        }
    }
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.data != "")
        {
            // check it is our data
            if (server_packet.to === serverConfig.extensionname && server_packet.data.chatMessageBuffer.length > 0)
            {
                serverData.chatMessageBuffer = server_packet.data.chatMessageBuffer;
                SaveDataToServer();
            }
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------- PROCESSING SETTINGS WIDGET SMALLS -----------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(server_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(server_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // need to update these manually as the web page does not send unchecked box values
                serverConfig.enabletwitchchat = "off";
                serverConfig.updateUserLists = "off";
                serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH = "off"
                serverConfig.DEBUG_EXTRA_CHAT_MESSAGE = "off";
                serverConfig.DEBUG_LOG_DATA_TO_FILE = "off";

                for (const [key, value] of Object.entries(serverConfig))
                    if (key in extension_packet.data)
                    {
                        serverConfig[key] = extension_packet.data[key];
                    }
                for (const [key, value] of Object.entries(localConfig.usernames))
                {
                    if (localConfig.twitchClient[key].state.connected)
                        reconnectChat(key);
                    else
                        connectToTwtich(key);
                }
                SaveConfigToServer();
                // restart the scheduler in case we changed it
                SaveChatMessagesToServerScheduler();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.twitchchat_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    // restart the scheduler in case we changed it
                    SaveChatMessagesToServerScheduler();
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
                else
                {
                    // need to update these manually as the web page does not send unchecked box values
                    serverConfig.enabletwitchchat = "off";
                    serverConfig.updateUserLists = "off";
                    serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH = "off"
                    serverConfig.DEBUG_EXTRA_CHAT_MESSAGE = "off";
                    serverConfig.DEBUG_LOG_DATA_TO_FILE = "off";

                    for (const [key, value] of Object.entries(serverConfig))
                        if (key in extension_packet.data)
                        {
                            serverConfig[key] = extension_packet.data[key];
                        }
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            reconnectChat(key);
                        else
                            connectToTwtich(key);
                    }
                    SaveConfigToServer();
                    // restart the scheduler in case we changed it
                    SaveChatMessagesToServerScheduler();
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
            }
        }
        else if (extension_packet.type === "SendChatMessage")
        {
            if (serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH === "off")
                sendChatMessage(serverConfig.streamername, extension_packet.data)
            else
            {
                let name = ""
                if (extension_packet.data.account == "bot" || extension_packet.data.account == "user")
                    name = localConfig.usernames[extension_packet.data.account].name
                else
                    name = extension_packet.data.account
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "SendChatMessage diverted due to debug message flag");
                console.log("Not posting to twitch due to debug flag 'on' in settings", extension_packet.data)
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": name, "emotes": "", "message-type": "chat" }, "::::LOCAL_DEBUG:::: " + extension_packet.data.message)
            }
        }
        else if (extension_packet.type === "RequestAccountNames")
        {
            sendAccountNames(server_packet.from)
        }
        else if (extension_packet.type === "RequestChatBuffer")
        {
            sendChatBuffer(server_packet.from)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // ------------------------------------------------ error message received -----------------------------------------------
    else if (server_packet.data === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel",
                    localConfig.EXTENSION_NAME,
                    server_packet.channel));
        }, 5000);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
        || server_packet.type === "ChannelData")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ===========================================================================
//                           FUNCTION: sendChatBuffer
// ===========================================================================
/**
 * Send our chat buffer to the extension
 * @param {String} toExtension 
 */
function sendChatBuffer (toExtension)
{
    // send the modified modal data to the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            localConfig.EXTENSION_NAME,
            sr_api.ExtensionPacket(
                "TwitchChatBuffer",
                localConfig.EXTENSION_NAME,
                serverData.chatMessageBuffer,
                "",
                toExtension,
                serverConfig.channel),
            "",
            toExtension
        ));
}
// ===========================================================================
//                           FUNCTION: sendAccountNames
// ===========================================================================
/**
 * @param {String} toExtension 
 */
function sendAccountNames (toExtension)
{
    // TBD create list from available names otherwise we need to supply both names
    let usrlist = {}
    let countusers = 0
    for (const id in localConfig.usernames)
    {
        usrlist[id] = localConfig.usernames[id]["name"];
        countusers++;
    }

    if (countusers > 0)
    {
        // send the modified modal data to the server
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "UserAccountNames",
                    localConfig.EXTENSION_NAME,
                    usrlist,
                    "",
                    toExtension,
                    serverConfig.channel),
                "",
                toExtension
            ));
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Send our SettingsWidgetSmall to the extension
 * @param {String} toExtension 
 */
function SendSettingsWidgetSmall (toExtension)
{

    // read our modal file
    fs.readFile(__dirname + "/twitchchatsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toExtension,
                        serverConfig.channel),
                    "",
                    toExtension
                ));
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * Send our SettingsWidgetLarge to the extension
 * @param {String} toExtension 
 */
function SendSettingsWidgetLarge (toExtension)
{

    // read our modal file
    fs.readFile(__dirname + "/twitchchatsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toExtension,
                        serverConfig.channel),
                    "",
                    toExtension
                ));
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

    fs.readFile(__dirname + "/twitchchatcredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                {
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                {
                    modalstring = modalstring.replaceAll(key + "text", value);
                }
            }
            // send the modal data to the server
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
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig));
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
//                     FUNCTION: SaveChatMessagesToServerScheduler
// ============================================================================
function SaveChatMessagesToServerScheduler ()
{
    SaveDataToServer()
    // clear any previous timeout
    clearTimeout(localConfig.saveDataHandle)
    localConfig.saveDataHandle = setTimeout(SaveChatMessagesToServerScheduler, serverConfig.chatMessageBackupTimer * 1000)

}
// ============================================================================
//                     FUNCTION: process_chat_data
// ============================================================================
// Desription: receives twitch chat messages
// ============================================================================
function process_chat_data (channel, tags, chatmessage)
{
    let data = {
        channel: channel,
        message: chatmessage,
        data: tags
    };
    if (serverConfig.DEBUG_EXTRA_CHAT_MESSAGE === "on")
        console.log("process_chat_data: ", tags["message-type"], " : ", chatmessage)

    if (tags == null)
    {
        if (serverConfig.DEBUG_EXTRA_CHAT_MESSAGE === "on")   
        {
            console.log("############## NULL tags recieved in message ################")
            console.log("process_chat_data", channel, tags, chatmessage)
        }
        return;
    }
    // need to define our chat message format
    if (serverConfig.enabletwitchchat === "on")
    {

        // set the channel name
        data.channel = channel
        if (localConfig.twitchClient["user"].state.readonly)
            data.channel += " [Readonly]"
        if (localConfig.twitchClient["user"].state.emoteonly)
            data.channel += " [Emoteonly]"
        if (localConfig.twitchClient["user"].state.followersonly != -1)
            data.channel += " [Followersonly (" + localConfig.twitchClient["user"].state.followersonly + ")]"
        if (localConfig.twitchClient["user"].state.r9k)
            data.channel += " [r9k]"
        if (localConfig.twitchClient["user"].state.slowmode)
            data.channel += " [Slowmode]"
        if (localConfig.twitchClient["user"].state.subsonly)
            data.channel += " [Subsonly]"

        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "ChatMessage",
                    localConfig.EXTENSION_NAME,
                    data,
                    serverConfig.channel
                ),
                serverConfig.channel
            ));
        // lets store the chat history
        serverData.chatMessageBuffer.push(data);
        // keep the number of chat items down to the size of the buffer.
        while (serverData.chatMessageBuffer.length > serverConfig.chatMessageBufferMaxSize)
            serverData.chatMessageBuffer.shift();
    }
    //update the user data (ie last seen etc)
    if (serverConfig.updateUserLists === "on" && tags["display-name"])
        updateUserList({ username: tags["display-name"], platform: "twitch" })

}

// ============================================================================
//                     FUNCTION: sendChatMessage
// ============================================================================
// Desription: Send message to twitch
// ===========================================================================
function sendChatMessage (channel, data)
{
    let sent = false
    let account = null;
    if (serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH === "on")
    {
        console.log("Sending twitch message suppressed by debug flag", data.message)
        return;
    }
    if (serverConfig.enabletwitchchat == "off")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Trying to send twitch message with twitchchat turned off", data.account, data.message)
        return;
    }
    try
    {
        if (data.account === "bot" || (localConfig.usernames.bot && localConfig.usernames.bot.name == data.account))
            account = "bot"
        else if (data.account === "user" || (localConfig.usernames.user && localConfig.usernames.user.name == data.account))
            account = "user"

        if (account && localConfig.twitchClient[account].connection && localConfig.twitchClient[account].state.connected)
        {
            localConfig.twitchClient[account].connection.say(channel, data.message)
                .then(logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + "message sent ", channel, data.message))
                .catch((e) => { logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + "sendChatMessage error", e) })
            sent = true;
        }
        if (!sent)
        {
            if (account && localConfig.twitchClient[account].state.connected)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, couldn't send message. user not available", data.account)
            else
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, User not connected (have you setup your credentials in the admin page)", data.account)

        }
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch.say error", e.message)
    }
}
// ############################# IRC Client #########################################
// ============================================================================
//                     FUNCTION: reconnectChat
// ============================================================================
function reconnectChat (account)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Reconnecting chat " + serverConfig.streamername + ":" + serverConfig.enabletwitchchat);
    try
    {
        var connectedChannels = localConfig.twitchClient[account].connection.getChannels();
        if (connectedChannels.length == 0)
        {
            joinChatChannel(account);
        }
        else
        {
            connectedChannels.forEach(element =>
            {
                localConfig.twitchClient[account].connection.part(element)
                    .then(channel => 
                    {
                        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "left Chat channel " + channel)
                        if (serverConfig.enabletwitchchat === "on")
                        {
                            joinChatChannel(account);
                        }
                    })
                    .catch((err) => 
                    {
                        localConfig.twitchClient[account].state.connected = false;
                        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "Leave chat failed", element, err)
                    });
            })
        }
    }
    catch (err)
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Changing stream failed", serverConfig.streamername, err);
        localConfig.twitchClient[account].state.connected = false;
    }
}
// ============================================================================
//                     FUNCTION: joinChatChannel
// ============================================================================
function joinChatChannel (account)
{
    let chatmessagename = "#" + serverConfig.streamername.toLocaleLowerCase();
    let chatmessagetags = { "display-name": "System", "emotes": "" };
    if (serverConfig.enabletwitchchat === "on")
    {
        localConfig.twitchClient[account].connection.join(serverConfig.streamername)
            .then(() =>
            {
                localConfig.twitchClient[account].state.connected = true;
                logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "Chat channel changed to " + serverConfig.streamername);
                process_chat_data(chatmessagename, chatmessagetags, "Chat channel changed to " + serverConfig.streamername);
            }
            )
            .catch((err) =>
            {
                localConfig.twitchClient[account].state.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "stream join threw an error", err, " sheduling reconnect");
                process_chat_data(chatmessagename, chatmessagetags, "Failed to join " + serverConfig.streamername)
                setTimeout(() =>
                {
                    reconnectChat(account)
                }, 5000)
            });
    }
}
// ############################# IRC Client Initial Connection  #########################################
// ############################# Initial connection is readonly #########################################
import * as tmi from "tmi.js";

function connectToTwtich (account)
{
    // check for readonly user account login (bot doesn't get logged in if no credentials set)
    if (account === "user" && serverConfig.enabletwitchchat == "on" &&
        (typeof localConfig.usernames.user["name"] === "undefined" || typeof localConfig.usernames.user["oauth"] === "undefined" ||
            localConfig.usernames.user["name"] === "" || localConfig.usernames.user["oauth"] === ""))
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting readonly")
        localConfig.twitchClient[account].connection = new tmi.Client({ channels: [serverConfig.streamername] });
        localConfig.twitchClient[account].connection.connect()
            .then(() =>
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected readonly");
                process_chat_data("#" + serverConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Chat connected readonly: " + serverConfig.streamername);
            }
            )
            .catch((err) => 
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err)
                process_chat_data("#" + serverConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Failed to join " + serverConfig.streamername)
            }
            )

        localConfig.twitchClient[account].connection.on("message", (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message);
        });
    }
    else if (serverConfig.enabletwitchchat == "on")
    // connect with Oauth connection
    {
        chatLogin(account);
    }
    else
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "twitch chat currently set to off")
}
// ============================================================================
//                           FUNCTION: chatLogin
// ============================================================================
function chatLogin (account)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Connecting with OAUTH for ", localConfig.usernames[account]["name"])
    try
    {
        localConfig.twitchClient[account].connection = new tmi.Client({
            options: { debug: false, messagesLogLevel: "info" },
            connection: { reconnect: true, secure: true },
            identity: {
                username: localConfig.usernames[account]["name"],//'bot-name',
                password: localConfig.usernames[account]["oauth"]//'oauth:my-bot-token'
            },
            channels: [serverConfig.streamername]
        })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Failed to get twitch client for" + account + ":", err);
    }

    localConfig.twitchClient[account].connection.connect()
        .then(() =>
        {
            localConfig.twitchClient[account].state.readonly = false;
            localConfig.twitchClient[account].state.connected = true;
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat client connected with OAUTH")
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, account + ": " + localConfig.usernames[account]["name"] + " connected to " + serverConfig.streamername)
        })
        .catch((err) => 
        {
            localConfig.twitchClient[account].state.readonly = true;
            localConfig.twitchClient[account].state.connected = false;
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err);
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Chat failed to connect to " + serverConfig.streamername + " with user: " + localConfig.usernames.bot["name"])
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Please check your settings on the admin page.")
        })

    // #################################################################################################################
    // ############################################# USER ONLY MESSAGES ################################################
    // #################################################################################################################
    // we don't want to receive messages for the bot accounts, the user account login will be used to display chat
    if (account === "user")
    {
        // ############################################# USER DEBUGGING MESSAGES ################################################
        if (serverConfig.DEBUG_LOG_DATA_TO_FILE === "on") 
        {
            // raw_message gives you every type of message in the sustem. use for debugging if you think you are missing messages
            localConfig.twitchClient[account].connection.on("raw_message", (messageCloned, message) => { file_log("raw_message", messageCloned, JSON.stringify(message)); });
            // "chat" and "message" messages appear to be the same
            localConfig.twitchClient[account].connection.on("message", (channel, userstate, message, self) => { file_log("message", userstate, message); });
        }

        localConfig.twitchClient[account].connection.on("action", (channel, userstate, message, self) => { file_log("action", userstate, message); process_chat_data(channel, userstate, message); });
        localConfig.twitchClient[account].connection.on("ban", (channel, username, reason, userstate) => { file_log("ban", userstate, reason); userstate['display-name'] = localConfig.usernames.bot["name"]; userstate["message-type"] = "ban"; process_chat_data(channel, userstate, " Ban: (" + username + ") " + userstate['ban-duration'] + ". " + ((reason) ? reason : "")); });
        localConfig.twitchClient[account].connection.on("chat", (channel, userstate, message, self) => { file_log("chat", userstate, message); process_chat_data(channel, userstate, message); });
        localConfig.twitchClient[account].connection.on("messagedeleted", (channel, username, deletedMessage, userstate) => { file_log("messagedeleted", userstate, deletedMessage); userstate['display-name'] = localConfig.usernames.bot["name"]; process_chat_data(channel, userstate, "Message deleted: (" + username + ") " + deletedMessage); });
        localConfig.twitchClient[account].connection.on("primepaidupgrade", (channel, username, methods, userstate) => { file_log("primepaidupgrade", userstate, methods); process_chat_data(channel, userstate, ""); });
        localConfig.twitchClient[account].connection.on("raided", (channel, username, viewers) => { file_log("raided", username, viewers); process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "raided", "viewers": viewers }, "raided: Raid from " + username + " with " + viewers); });
        localConfig.twitchClient[account].connection.on("redeem", (channel, username, rewardType, tags, message) => { file_log("redeem", tags, message); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "redeem", tags: tags }, message + ""); });
        localConfig.twitchClient[account].connection.on("resub", (channel, username, months, message, userstate, methods) => { file_log("resub", userstate, message); userstate['display-name'] = localConfig.usernames.bot["name"]; process_chat_data(channel, userstate, ((message) ? message : "")); });
        localConfig.twitchClient[account].connection.on("roomstate", (channel, state) =>
        {
            file_log("roomstate", state, channel);
            localConfig.twitchClient["user"].state.emoteonly = state["emote-only"];
            localConfig.twitchClient["user"].state.followersonly = (state['followers-only'] === false) ? 0 : state['followers-only'];
            localConfig.twitchClient["user"].state.r9k = state.r9k;
            localConfig.twitchClient["user"].state.slowmode = state.slow;
            localConfig.twitchClient["user"].state.subsonly = state['subs-only'];
        });
        localConfig.twitchClient[account].connection.on("subscription", (channel, username, methods, message, userstate) => { file_log("subscription", userstate, message); userstate['display-name'] = localConfig.usernames.bot["name"]; process_chat_data(channel, userstate, message); });
        localConfig.twitchClient[account].connection.on("timeout", (channel, username, reason, duration, userstate) => { file_log("timeout", userstate, reason); userstate['display-name'] = localConfig.usernames.bot["name"]; userstate["message-type"] = "timeout"; process_chat_data(channel, userstate, " Timeout: (" + username + ") " + duration + " " + ((reason) ? reason : "")); });

        //////////////////////////////// Anything above here is considered done here, and in liveportal 
        localConfig.twitchClient[account].connection.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => { file_log("submysterygift", userstate, username); userstate['display-name'] = localConfig.usernames.bot["name"]; process_chat_data(channel, userstate, userstate['system-msg']); });

        // still working on these single user ones
        localConfig.twitchClient[account].connection.on("automod", (channel, msgID, message) => { file_log("automod", msgID, message); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "automod" }, "automod:" + msgID + " : " + message); });
        localConfig.twitchClient[account].connection.on("reconnect", () => { process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "reconnect" }, "reconnect: Reconnect"); });
        localConfig.twitchClient[account].connection.on("anongiftpaidupgrade", (channel, username, userstate) => { file_log("anongiftpaidupgrade", userstate, username); process_chat_data(channel, userstate, "anongiftpaidupgrade: " + username); });
        localConfig.twitchClient[account].connection.on("anonsubmysterygift", (channel, numbOfSubs, methods, userstate) => { file_log("anonsubmysterygift", userstate, methods); process_chat_data(channel, userstate, "anonsubmysterygift: " + numbOfSubs); });
        localConfig.twitchClient[account].connection.on("anonsubgift", (channel, streakMonths, recipient, methods, userstate) => { file_log("anonsubgift", userstate, methods); process_chat_data(channel, userstate, "anonsubgift: " + streakMonths + " : " + recipient); });
        localConfig.twitchClient[account].connection.on("cheer", (channel, userstate, message,) => { file_log("cheer", userstate, message); process_chat_data(channel, userstate, "cheer: " + message); });
        localConfig.twitchClient[account].connection.on("mod", (channel, username) => { file_log("mod", username, ""); process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "mod" }, "mod:" + username); });
        localConfig.twitchClient[account].connection.on("mods", (channel, tags, message, self) => { file_log("mods", tags, message); process_chat_data(channel, tags, "mods: " + message); });
        localConfig.twitchClient[account].connection.on("subgift", (channel, username, streakMonths, self, recipient, methods, userstate) => { file_log("subgift", userstate, username + ":" + streakMonths + ":" + recipient); process_chat_data(channel, userstate, "subgift: Subgift from " + username + " for " + recipient + " months " + streakMonths); });
        localConfig.twitchClient[account].connection.on("subscribers", (channel, enabled) => { file_log("subscribers", channel, enabled); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "subscribers" }, "subscribers: " + enabled); });
        localConfig.twitchClient[account].connection.on("vips", (channel, vips) => { file_log("vips", vips, ""); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "vips" }, "vips: VIPS are :" + vips.join(" : ")); });
        localConfig.twitchClient[account].connection.on("clearchat", (channel) => { file_log("cheer", channel, ""); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "clearchat" }, "clearchat: Chat has been cleared"); });
        localConfig.twitchClient[account].connection.on("unhost", (channel, viewers) => { file_log("unhost", viewers, ""); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unhost" }, "unhost: Unhosted for " + viewers + "viewers"); });
        localConfig.twitchClient[account].connection.on("unmod", (channel, username) => { file_log("unmod", username, ""); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unmod" }, "unmod: " + username + " UnModded"); });
        localConfig.twitchClient[account].connection.on("emotesets", (sets, obj) => { file_log("emotesets", sets, obj); process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "emotesets" }, "emotesets: " + sets); });
        localConfig.twitchClient[account].connection.on("followersonly", (channel, enabled, length) => { file_log("followersonly", enabled, length); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "followersonly" }, "followersonly: " + length + " Follower Only mode : " + enabled); });
        localConfig.twitchClient[account].connection.on("giftpaidupgrade", (channel, username, sender, userstate) => { file_log("giftpaidupgrade", userstate, sender + ":" + username); process_chat_data(channel, userstate, "giftpaidupgrade: " + sender + " updradeged " + username + " with a gift paid upgrade"); });
        localConfig.twitchClient[account].connection.on("hosted", (channel, username, viewers, autohost) => { file_log("hosted", username, viewers); process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "hosted" }, "hosted: Hosted " + username + " with " + viewers + " viewers auto:" + autohost); });
        localConfig.twitchClient[account].connection.on("hosting", (channel, target, viewers) => { file_log("hosting", target, viewers); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "hosting" }, "hosting: Hosting " + target + " with " + viewers + "viewers"); });
        localConfig.twitchClient[account].connection.on("emoteonly", (channel, enabled) => { file_log("emoteonly", channel, enabled); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "emoteonly" }, "emoteonly: Chat emote only mode :" + enabled); });
        localConfig.twitchClient[account].connection.on("r9kbeta", (channel, tags, message, self) => { file_log("r9kbeta", tags, message); process_chat_data(channel, tags, "r9kbeta: " + message); });
        localConfig.twitchClient[account].connection.on("slowmode", (channel, enabled, length) => { file_log("slowmode", enabled, length); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "slowmode" }, "slowmode: " + enabled + " enabled for " + length); });

    }
    // #################################################################################################################
    // ####################################### BOT AND USER MESSAGES ###################################################
    // #################################################################################################################
    // get these messages for both accounts (user and bot)
    localConfig.twitchClient[account].connection.on("whisper", (from, userstate, message, self) => { file_log("whisper", userstate, message); process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": from, "emotes": "", "message-type": "whisper" }, "whisper: " + message); });
    localConfig.twitchClient[account].connection.on("notice", (channel, msgid, message) => { file_log("notice", msgid, message); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "notice" }, message); });

    // Still to be tested before adding directly to the code might be single user/multiple registrations or none
    localConfig.twitchClient[account].connection.on("disconnected", (reason) => { process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "disconnected" }, "disconnected: " + reason); });
    localConfig.twitchClient[account].connection.on("serverchange", (channel) => { file_log("serverchange", channel, channel); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "serverchange" }, "serverchange: " + channel); });
    localConfig.twitchClient[account].connection.on("connected", (address, port) => { file_log("connected", address, port); process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connected" }, "connected:" + address + ": " + port); });
    localConfig.twitchClient[account].connection.on("connecting", (address, port) => { file_log("connecting", address, port); process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connecting" }, "connecting: " + address + ":" + port); });
    localConfig.twitchClient[account].connection.on("logon", () => { file_log("logon", "", ""); process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "logon" }, "logon:"); });
    localConfig.twitchClient[account].connection.on("join", (channel, username, self) => { file_log("join", channel, username); updateUserList({ username: username, platform: 'twitch' }) /*process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "join" }, "join: " + channel);*/ });
    localConfig.twitchClient[account].connection.on("part", (channel, username, self) => { file_log("part", channel, username); /*process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "part" }, "part: " + username);*/ });
    localConfig.twitchClient[account].connection.on("ping", () => { file_log("ping", "", "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "ping" }, "ping"); */ });
    localConfig.twitchClient[account].connection.on("pong", (latency) => { file_log("pong", String(latency), "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "pong" }, String(latency));*/ });

}
// ============================================================================
//                           FUNCTION: file_log
//                       For debug purposes. logs raw message data
// ============================================================================
let filestreams = [];
let basedir = "chatdata/";
function file_log (type, tags, message)
{
    //console.log("file_log", type, tags, message)
    if (serverConfig.DEBUG_LOG_DATA_TO_FILE)
    {
        var newfile = false;
        var filename = "__noname__";
        var buffer = "\n//#################################\n";
        // sometimes tags are a string, lets create an object for it to log
        if (typeof tags != "object")
            tags = { tag_converted_to_string: tags }

        if (!fs.existsSync(basedir + type))
        {
            newfile = true;
            fs.mkdirSync(basedir + type, { recursive: true });
        }

        // check if we already have this handler
        if (!filestreams.type)
        {
            if (!tags["message-type"])
            {
                filename = "__" + type;
                tags["message-type"] = filename;
            }
            else
                filename = tags["message-type"];

            filestreams[type] = fs.createWriteStream(basedir + type + "/" + filename + ".js", { flags: 'a' });

        }
        if (newfile)
        {
            buffer += "let " + type + ";\n";
            buffer += "let message='" + message + "'\n"
        }
        else
            buffer += "message='" + message + "'\n"

        buffer += type + "=";
        buffer += JSON.stringify(tags, null, 2);
        buffer += "\n";
        filestreams[type].write(buffer);
        //bad coding but can't end it here (due to async stuff) and it is just debug code (just left as a reminder we have a dangling pointer)
        //filestreams.type.end("")
    }
}
// ============================================================================
//                           FUNCTION: updateUserList
// ============================================================================
function updateUserList (data)
{
    if (serverConfig.updateUserLists == "on")
    {
        sr_api.sendMessage(
            localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "UpdateUserData",
                    localConfig.EXTENSION_NAME, data,
                    "",
                    "users"
                ),
                "",
                "users"
            )
        )
    }
}

// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let connected = localConfig.twitchClient["user"].state.connected && localConfig.twitchClient["bot"].state.connected
    let readonly = localConfig.twitchClient["user"].state.readonly && localConfig.twitchClient["bot"].state.readonly

    if (serverConfig.enabletwitchchat === "off")
        connected = false;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    readonly: readonly,
                    connected: connected
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
export { initialise };
