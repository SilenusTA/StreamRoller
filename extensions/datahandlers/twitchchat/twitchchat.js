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
import * as logger from "../../../backend/data_center/modules/logger.js";
import * as sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "TWITCH_CHAT",
    EXTENSION_NAME: "twitchchat",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    twitchClient: null,
    channelConnectionAttempts: 20,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false // this is our connection indicator for discord
    },
};
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
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
function initialise(app, host, port, heartbeat)
{
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
function onDataCenterDisconnect(reason)
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
function onDataCenterConnect(socket)
{
    // create our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", localConfig.EXTENSION_NAME));
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
function onDataCenterMessage(decoded_data)
{
    //var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        if (decoded_data.data != "")
        {
            var decoded_packet = decoded_data.data;
            // check it is our config
            serverConfig.enabletwitchchat = "off";
            if (decoded_data.to === serverConfig.extensionname)
            {
                for (const [key, value] of Object.entries(serverConfig))
                {
                    if (key in decoded_packet)
                    {
                        serverConfig[key] = decoded_data.data[key];
                    }
                }
                if (localConfig.status.connected)
                    reconnectChat();
                else
                    connectToTwtich();
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
            console.log(decoded_packet.to, serverConfig.extensionname)
            if (decoded_packet.to === serverConfig.extensionname)
            {
                serverConfig.enabletwitchchat = "off";
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_packet.data)
                    {
                        serverConfig[key] = decoded_packet.data[key];
                    }
                if (localConfig.status.connected)
                    reconnectChat();
                else
                    connectToTwtich();
                SaveConfigToServer();
            }
        }
        else if (decoded_packet.type === "SendChatMessage")
        {
            sendChatMessage(serverConfig.streamername, decoded_packet.data)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", decoded_data);

    }
    // ------------------------------------------------ error message received -----------------------------------------------
    else if (decoded_data.data === "UnknownChannel")
    {
        // if we have enough connection attempts left we should reschedule the connection
        if (streamlabsChannelConnectionAttempts++ < localConfig.channelConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        localConfig.EXTENSION_NAME,
                        decoded_data.channel));
            }, 5000);
        }
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Failed ot connect to channel", decoded_data.data);
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
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
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
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        tochannel,
                        localConfig.OUR_CHANNEL),
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
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig));
}
// ============================================================================
//                     FUNCTION: process_chat_data
// ============================================================================
// Desription: receives twitch chat messages
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
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                data,
                localConfig.OUR_CHANNEL
            ));
    }
}
/**
 * send a message to the twitch channel specified
 * @param {String} channel 
 * @param {String} message 
 */
function sendChatMessage(channel, message)
{
    localConfig.twitchClient.say(channel, message)
        .then(console.log("message sent ", channel, message))
        .catch((e) => { console.log("Twitch.say error", e) })
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
function reconnectChat()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Reconnecting chat " + serverConfig.streamername + ":" + serverConfig.enabletwitchchat);
    try
    {
        var connectedChannels = localConfig.twitchClient.getChannels();
        if (connectedChannels.length == 0)
        {
            joinChatChannel();
        }
        else
        {
            connectedChannels.forEach(element =>
            {
                localConfig.twitchClient.part(element)
                    .then(channel => 
                    {
                        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "left Chat channel " + channel)
                        if (serverConfig.enabletwitchchat === "on")
                        {
                            joinChatChannel();
                        }
                    })
                    .catch((err) => 
                    {
                        localConfig.status.connected = false;
                        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "Leave chat failed", element, err)
                    });
            })
        }
    }
    catch (err)
    {
        localConfig.status.connected = false;
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Changing stream failed", serverConfig.streamername, err);
    }
}

function joinChatChannel()
{
    if (serverConfig.enabletwitchchat === "on")
    {
        localConfig.twitchClient.join(serverConfig.streamername)
            .then(() =>
            {
                localConfig.status.connected = true;
                logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "Chat channel changed to " + serverConfig.streamername)
            }
            )
            .catch((err) =>
            {
                localConfig.status.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "stream join threw an error", err, " sheduling reconnect");
                setTimeout(() =>
                {
                    reconnectChat()
                }, 5000)
            });
    }
}
// ############################# IRC Client Initial Connection #########################################
import * as tmi from "tmi.js";

function connectToTwtich()
{
    if (typeof process.env.twitchchatbot === "undefined" || typeof process.env.twitchchatoauth === "undefined" ||
        process.env.twitchchatbot === "" || process.env.twitchchatoauth === "")
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting readonly")
        localConfig.twitchClient = new tmi.Client({ channels: [serverConfig.streamername] });
        localConfig.twitchClient.connect()
            .then(() =>
            {
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected readonly")
            }
            )

            .catch((err) => 
            {
                localConfig.status.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed", err)
            }
            )

        localConfig.twitchClient.on('message', (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message, self);
        });
    }
    else
    // with Oauth bot connection
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting with OAUTH for ", process.env.twitchchatbot)
        localConfig.twitchClient = new tmi.Client({
            options: { debug: false, messagesLogLevel: "info" },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: process.env.twitchchatbot,//'bot-name',
                password: process.env.twitchchatoauth//'oauth:my-bot-token'
            },
            channels: [serverConfig.streamername]
        });
        localConfig.twitchClient.connect()
            .then((res) =>
            {
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected with OAUTH")
            })
            .catch((err) => 
            {
                localConfig.status.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed", err)
            })

        localConfig.twitchClient.on('message', (channel, tags, message, self) =>
        {

            // don't respond to self
            //if (self) return;
            /*if (message.toLowerCase() === '!hello')
            {
                localConfig.twitchClient.say(channel, `@${tags.username}, heya!`);
            }*/
            process_chat_data(channel, tags, message, self);
        });
    }
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback()
{
    let connected = localConfig.status.connected
    if (serverConfig.enabletwitchchat === "off")
        connected = false;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: connected },
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
