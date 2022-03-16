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
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
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
        readonly: true,
        connected: false // this is our connection indicator for discord
    },
};
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabletwitchchat: "on",
    streamername: "OldDepressedGamer"
};
const credentials = {};
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
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
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
function onDataCenterMessage(server_packet)
{
    if (server_packet.type === "ConfigFile" && server_packet.data != "")
    {
        var decoded_packet = server_packet.data;
        // check it is our config
        serverConfig.enabletwitchchat = "off";
        if (server_packet.to === serverConfig.extensionname)
        {
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (key in decoded_packet)
                    serverConfig[key] = server_packet.data[key];
            }

        }
        SaveConfigToServer();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            for (const [key, value] of Object.entries(server_packet.data))
                credentials[key] = value;
            // start discord connection
            if (localConfig.status.connected)
                reconnectChat();
            else
                connectToTwtich();
        }
        else
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty, connecting readonly");
            // can still connect readonly
            if (localConfig.status.connected)
                reconnectChat();
            else
                connectToTwtich();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let decoded_packet = server_packet.data;
        // -------------------- PROCESSING ADMIN MODALS -----------------------
        if (decoded_packet.type === "RequestAdminModalCode")
            SendModal(server_packet.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            //console.log(decoded_packet.to, serverConfig.extensionname)
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
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // ------------------------------------------------ error message received -----------------------------------------------
    else if (server_packet.data === "UnknownChannel")
    {
        // if we have enough connection attempts left we should reschedule the connection
        if (streamlabsChannelConnectionAttempts++ < localConfig.channelConnectionAttempts)
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
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Failed ot connect to channel", server_packet.data);
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
function process_chat_data(channel, tags, chatmessage)
{
    // need to define our chat message format
    if (serverConfig.enabletwitchchat === "on")
    {
        let data = {
            channel: channel,
            message: chatmessage,
            data: tags
        };
        if (localConfig.status.readonly)
            data.channel = data.channel + " (Readonly)"

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
        .then(console.log("twitchClient.message sent ", channel, message))
        .catch((e) => { console.log("Twitch.say error", e) })
}
// ############################# IRC Client #########################################
// ============================================================================
//                     FUNCTION: reconnectChat
// ============================================================================
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
// ============================================================================
//                     FUNCTION: joinChatChannel
// ============================================================================
function joinChatChannel()
{
    let chatmessagename = "#" + serverConfig.streamername.toLocaleLowerCase();
    let chatmessagetags = { "display-name": "System" };
    if (serverConfig.enabletwitchchat === "on")
    {
        localConfig.twitchClient.join(serverConfig.streamername)
            .then(() =>
            {
                localConfig.status.connected = true;
                logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "Chat channel changed to " + serverConfig.streamername)
                process_chat_data(chatmessagename, chatmessagetags, "Chat channel changed to " + serverConfig.streamername)

            }
            )
            .catch((err) =>
            {
                localConfig.status.connected = false;
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

function connectToTwtich()
{
    let chatmessagename = "#" + serverConfig.streamername.toLocaleLowerCase();
    let chatmessagetags = { "display-name": "System" };
    if (typeof credentials.twitchchatbot === "undefined" || typeof credentials.twitchchatoauth === "undefined" ||
        credentials.twitchchatbot === "" || credentials.twitchchatoauth === "")
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting readonly")
        localConfig.twitchClient = new tmi.Client({ channels: [serverConfig.streamername] });
        localConfig.twitchClient.connect()
            .then(() =>
            {
                localConfig.status.readonly = true;
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected readonly")
                process_chat_data(chatmessagename, chatmessagetags, "Chat connected readonly: " + serverConfig.streamername)
            }
            )

            .catch((err) => 
            {
                localConfig.status.readonly = true;
                localConfig.status.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed", err)
                process_chat_data(chatmessagename, chatmessagetags, "Failed to join " + serverConfig.streamername)
            }
            )

        localConfig.twitchClient.on('message', (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message);
        });
    }
    else
    // with Oauth bot connection
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Connecting with OAUTH for ", credentials.twitchchatbot)
        localConfig.twitchClient = new tmi.Client({
            options: { debug: false, messagesLogLevel: "info" },
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: credentials.twitchchatbot,//'bot-name',
                password: credentials.twitchchatoauth//'oauth:my-bot-token'
            },
            channels: [serverConfig.streamername]
        });
        localConfig.twitchClient.connect()
            .then((res) =>
            {
                localConfig.status.readonly = false;
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat client connected with OAUTH")
                process_chat_data(chatmessagename, chatmessagetags, "Chat Connected to " + serverConfig.streamername)
            })
            .catch((err) => 
            {
                localConfig.status.readonly = true;
                localConfig.status.connected = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwtich", "Twitch chat connect failed", err);
                process_chat_data(chatmessagename, chatmessagetags, "Chat failed to connect to " + serverConfig.streamername)
            })

        localConfig.twitchClient.on('message', (channel, tags, message, self) =>
        {

            // don't respond to self
            //if (self) return;
            /*if (message.toLowerCase() === '!hello')
            {
                localConfig.twitchClient.say(channel, `@${tags.username}, heya!`);
            }*/
            process_chat_data(channel, tags, message);
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
                {
                    readonly: localConfig.status.readonly,
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
