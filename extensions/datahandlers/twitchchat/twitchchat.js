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
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
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
    saveDataHandle: null
};
localConfig.twitchClient["bot"] = {
    connection: null,
    state: {
        readonly: true,
        connected: false
    }
}
localConfig.twitchClient["user"] = {
    connection: null,
    state: {
        readonly: true,
        connected: false
    }
}
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabletwitchchat: "off",
    updateUserList: "off",
    streamername: "OldDepressedGamer",
    chatMessageBufferMaxSize: "300",
    chatMessageBackupTimer: "60",
    //credentials variable names to use (in credentials modal)
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
    DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH: "off"
};

//debug setting to overwrite the stored data with the serverConfig above. 
const OverwriteDataCenterConfig = false;
const serverData =
{
    chatMessageBuffer: [],
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
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    // create our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL));
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
    //console.log(server_packet)
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            serverConfig.enabletwitchchat = "off";
            serverConfig.updateUserList = "off";
            serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH = "off";
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];
            }
        }
        SaveConfigToServer();
        // restart the sceduler in case we changed the values
        SaveChatMessagesToServerScheduler();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
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
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty, connecting readonly");
            // can still connect readonly
            for (const [key, value] of Object.entries(localConfig.usernames))
            {
                if (localConfig.twitchClient[key].state.connected)
                    reconnectChat(key);
                else
                    connectToTwtich(key);
            }
        }
    }
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.data != "")
        {
            // check it is our data
            if (server_packet.to === serverConfig.extensionname)
                serverData.chatMessageBuffer = server_packet.data.chatMessageBuffer;
            SaveDataToServer();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------- PROCESSING ADMIN MODALS -----------------------
        if (extension_packet.type === "RequestAdminModalCode")
            SendAdminModal(server_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        else if (extension_packet.type === "AdminModalData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // need to update these manually as the web page does not send unchecked box values
                serverConfig.enabletwitchchat = "off";
                serverConfig.updateUserList = "off";
                serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH = "off"

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
            }
        }
        else if (extension_packet.type === "SendChatMessage")
        {
            if (serverConfig.DEBUG_ONLY_MIMICK_POSTING_TO_TWITCH === "off")
                sendChatMessage(serverConfig.streamername, extension_packet.data)
            else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "SendChatMessage diverted due to debug message flag");
                extension_packet.data.account = localConfig.usernames.bot.name
                console.log("Not posting to twitch ", extension_packet.data)
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "?" + extension_packet.data.account + "?", "emotes": "" }, extension_packet.data.message)
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
 * Send our AdminModal to the extension
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
                localConfig.OUR_CHANNEL),
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
                    localConfig.OUR_CHANNEL),
                "",
                toExtension
            ));
    }
}
// ===========================================================================
//                           FUNCTION: SendAdminModal
// ===========================================================================
/**
 * Send our AdminModal to the extension
 * @param {String} toExtension 
 */
function SendAdminModal (toExtension)
{
    // read our modal file
    fs.readFile(__dirname + "/twitchchatadminmodal.html", function (err, filedata)
    {
        if (err)
            throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toExtension,
                        localConfig.OUR_CHANNEL),
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
            throw err;
        else
        {
            let modalstring = filedata.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                {
                    modalstring = modalstring.replace(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                {
                    modalstring = modalstring.replace(key + "text", value);
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
// ===========================================================================
function process_chat_data (channel, tags, chatmessage)
{
    // need to define our chat message format
    if (serverConfig.enabletwitchchat === "on")
    {
        let data = {
            channel: channel,
            message: chatmessage,
            data: tags
        };
        // set the channel name
        if (localConfig.twitchClient["user"].state.readonly)
            data.channel = data.channel + " (Readonly)"

        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "ChatMessage",
                    localConfig.EXTENSION_NAME,
                    data,
                    localConfig.OUR_CHANNEL
                ),
                localConfig.OUR_CHANNEL
            ));
        // lets store the chat history
        serverData.chatMessageBuffer.push(data);
        //update the user data (ie last seen etc)
        if (serverConfig.updateUserList === "on")
            updateUserList(data)
        // keep the number of chat items down to the size of the buffer.
        while (serverData.chatMessageBuffer.length > serverConfig.chatMessageBufferMaxSize)
            serverData.chatMessageBuffer.shift();
    }
}
/**
 * send a message to the twitch channel specified
 * @param {String} channel 
 * @param {String} data 
 */
function sendChatMessage (channel, data)
{
    let sent = false
    let account = null;
    try
    {
        if (data.account === "bot" || (localConfig.usernames.bot && localConfig.usernames.bot.name == data.account))
            account = "bot"
        else if (data.account === "user" || (localConfig.usernames.user && localConfig.usernames.user.name == data.account))
            account = "user"

        if (account && localConfig.twitchClient[account].connection)
        {
            localConfig.twitchClient[account].connection.say(channel, data.message)
                .then(logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + "twitchClient.message sent ", channel, data.message))
                .catch((e) => { logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + "Twitch.say error", e) })
            sent = true;
        }
        if (!sent)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch.say, couldn't send message. user not available", data.account)
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
        localConfig.twitchClient[account].state.connected = false;
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Changing stream failed", serverConfig.streamername, err);
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
                    reconnectChat()
                }, 5000)
            });
    }
}
// ############################# IRC Client Initial Connection #########################################
import * as tmi from "tmi.js";

function connectToTwtich (account)
{
    // check for readonly user account login (bot doesn't get logged in if no credentials set)
    if (account === "user" && serverConfig.enabletwitchchat == "on" &&
        (typeof localConfig.usernames.user["name"] === "undefined" || typeof localConfig.usernames.user["oauth"] === "undefined" ||
            localConfig.usernames.user["name"] === "" || localConfig.usernames.user["oauth"] === ""))
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting readonly")
        localConfig.twitchClient["account"].connection = new tmi.Client({ channels: [serverConfig.streamername] });
        localConfig.twitchClient[account].connection.connect()
            .then(() =>
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected readonly");
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "" }, "Chat connected readonly: " + serverConfig.streamername);
            }
            )
            .catch((err) => 
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err)
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "" }, "Failed to join " + serverConfig.streamername)
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Connecting with OAUTH for ", localConfig.usernames.bot["name"])
    localConfig.twitchClient[account].connection = new tmi.Client({
        options: { debug: false, messagesLogLevel: "info" },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: localConfig.usernames[account]["name"],//'bot-name',
            password: localConfig.usernames[account]["oauth"]//'oauth:my-bot-token'
        },
        channels: [serverConfig.streamername]
    });


    localConfig.twitchClient[account].connection.connect()
        .then((res) =>
        {
            localConfig.twitchClient[account].state.readonly = false;
            localConfig.twitchClient[account].state.connected = true;
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat client connected with OAUTH")
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "" }, account + ": " + localConfig.usernames[account]["name"] + " connected to " + serverConfig.streamername)
        })
        .catch((err) => 
        {
            localConfig.twitchClient[account].state.readonly = true;
            localConfig.twitchClient[account].state.connected = false;
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err);
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "" }, "Chat failed to connect to " + serverConfig.streamername + " with user: " + localConfig.usernames.bot["name"])
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "" }, "Please check your settings on the admin page.")
        })
    // we don't want to receive message for the bot accounts, the user account login will be used to display chat
    if (account === "user")
    {
        localConfig.twitchClient[account].connection.on("message", (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message);
        });
    }
}
// ============================================================================
//                           FUNCTION: updateUserList
// ============================================================================
function updateUserList (data)
{
    // DEBUG

    sr_api.sendMessage
        (
            localConfig.DataCenterSocket,
            sr_api.ServerPacket
                (
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket
                        (
                            "UpdateUserData",
                            localConfig.EXTENSION_NAME,
                            { username: data.data["display-name"], platform: "twitch" },
                            "",
                            "users"
                        ),
                    "",
                    "users"
                )
        )
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
