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
// // https://github.com/tmijs/docs
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import * as sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { config } from "./config.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
let serverConfig = {
    extensionname: config.EXTENSION_NAME,
    channel: config.OUR_CHANNEL,
    enabletwitchchat: "on",
    streamername: "OldDepressedGamer"
};
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise(app, host, port)
{
    try
    {
        config.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage,
            onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "config.DataCenterSocket connection failed:", err);
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
function onDataCenterDisconnect(reason)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
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
function onDataCenterConnect(socket)
{
    // create our channel
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", config.EXTENSION_NAME, config.OUR_CHANNEL));
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", config.EXTENSION_NAME));
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Desription: Received message
// Parameters: data
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function onDataCenterMessage(data)
{
    var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        let chatSettingsChanged = false;
        if (decoded_data.data != "")
        {
            var decoded_packet = decoded_data.data;
            // check it is our config
            if (decoded_data.to === serverConfig.extensionname)
            {
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_packet)
                    {
                        if (key === "streamername" &&
                            serverConfig[key] != decoded_data.data[key])
                            // if we have changed the streamer name we need to update the chat client 
                            chatSettingsChanged = true;
                        else if (key === "enabletwitchchat" &&
                            serverConfig[key] != decoded_data.data[key])
                            // if we have changed the streamer name we need to update the chat client 
                            chatSettingsChanged = true;
                        // update the key as we have one for this
                        serverConfig[key] = decoded_data.data[key];
                    }
                if (chatSettingsChanged)
                    reconnectChat(serverConfig.streamername, serverConfig.enabletwitchchat);
            }
        }
        SaveConfigToServer();
    }
    else if (decoded_data.type === "ExtensionMessage")
    {
        let decoded_packet = JSON.parse(decoded_data.data);
        // -------------------- PROCESSING ADMIN MODALS -----------------------
        if (decoded_packet.type === "RequestAdminModalCode")
            SendModal(decoded_data.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            if (decoded_packet.to === serverConfig.extensionname)
            {
                // we shall either turn this checkbox on or not get it in the message so we can just turn it off here 
                // and reset it if the user turn it on rather than trying to find out if it doesn't exist in the message
                serverConfig.enabletwitchchat = "off";
                for (const [key, value] of Object.entries(decoded_packet.data))
                {
                    //if streamer name has changed update it
                    if (key === "streamername")
                        serverConfig[key] = value;
                    if (key === "enabletwitchchat")
                        serverConfig[key] = "on";
                }
                // we reconnect chat even if nothing changed as the user might
                // have opened the settings if connection bugged out
                reconnectChat(serverConfig.streamername, serverConfig.enabletwitchchat);
                SaveConfigToServer();
            }
        }
    }
    // ------------------------------------------------ error message received -----------------------------------------------
    else if (decoded_data.data === "UnknownChannel")
    {
        // if we have enough connection attempts left we should reschedule the connection
        if (streamlabsChannelConnectionAttempts++ < config.channelConnectionAttempts)
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(config.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        config.EXTENSION_NAME,
                        decoded_data.channel));
            }, 5000);
        }
        else
            logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "Failed ot connect to channel", decoded_data.data);
    }
    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel"
        || decoded_data.type === "ChannelData")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.type);
}

// ===========================================================================
//                           FUNCTION: SendModal
// ===========================================================================
// Desription: Send the modal code back after setting the defaults according 
// to our server settings
// Parameters: channel to send data to
// ----------------------------- notes ---------------------------------------
// none
// ===========================================================================
function SendModal(tochannel)
{
    // read our modal file
    fs.readFile(__dirname + '/adminmodal.html', function (err, filedata)
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
            sr_api.sendMessage(config.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    config.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
                        config.EXTENSION_NAME,
                        modalstring,
                        "",
                        tochannel,
                        config.OUR_CHANNEL),
                    "",
                    tochannel
                ));
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
// Desription:save config on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SaveConfigToServer()
{
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            config.EXTENSION_NAME,
            serverConfig));
}
// ============================================================================
//                     FUNCTION: process_chat_data
// ============================================================================
// Desription: receives twitch chat messages
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function process_chat_data(channel, tags, chatmessage, self)
{
    // need to define our chat message format
    if (serverConfig.enabletwitchchat === "on")
    {
        let data = {
            channel: channel,
            message: chatmessage,
            data: tags
        };
        sr_api.sendMessage(config.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                config.EXTENSION_NAME,
                data,
                config.OUR_CHANNEL
            ));
    }
}
// ############################# IRC Client #########################################
// ============================================================================
//                     FUNCTION: reconnectChat
// ============================================================================
// Desription: Changes channel/disables chat
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function reconnectChat(streamername, enable)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "Reconnecting chat " + streamername + ":" + enable);
    try
    {
        leaveAllChannels();
        if (enable == "on")
        {
            // need to give client chance to finish up
            setTimeout(() => { joinChatChannel(streamername) }, 1000);
        }
    }
    catch (err)
    {
        logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".reconnectChat", "Changing stream failed", streamername, err);
    }
}

function leaveAllChannels()
{
    // leave the existing channels
    var connectedChannels = client.getChannels();
    connectedChannels.forEach(element =>
    {
        client.part(element)
            .then(channel => logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "left Chat channel " + channel))
            .catch((err) => logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".reconnectChat", "Leave chat failed", element, err));
    })
}
function joinChatChannel(streamername)
{
    client.join(streamername)
        .then(
            logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "Chat channel changed to " + streamername)
        )
        .catch((err) =>
        {
            logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "stream join threw an error", err, " sheduling reconnect");
            setTimeout(() =>
            {
                reconnectChat(streamername, "on")
            }, 5000)
        });
}
// ############################# IRC Client Initial Connection #########################################
import * as tmi from "tmi.js";
const client = new tmi.Client({
    channels: [serverConfig.streamername]
});
client.connect()
    .then(logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "Twitch chat client connected"))
    .catch((err) => logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".enableChat", "Twitch chat connect failed", err))

client.on('message', (channel, tags, message, self) =>
{
    process_chat_data(channel, tags, message, self);
});

// with Oauth bot connection
/*
const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: 'bot-name',
        password: 'oauth:my-bot-token'
    },
    channels: ['my-channel']
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) =>
{
    if (self) return;
    if (message.toLowerCase() === '!hello')
    {
        client.say(channel, `@${tags.username}, heya!`);
    }
});
*/
















// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// will also need additional exports in future (ie reconnect, stop, start etc)
// ============================================================================
export { initialise };
