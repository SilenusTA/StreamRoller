/**
 * Summary. Server Code used to routing functions and all server messages
 * Messages are routed by type. Either driect to socket, room or broadcast
 * all(excluding sender), or broadcast to all(including sender)
 * 
 * @link   https://github.com/SilenusTA/StreamRoller
 * @file   common StreamRoller functions
 * @author Silenus aka twitch.tv/OldDepressedGamer
 * @since  29-Jan-2021
 */

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// ============================================================================
import * as logger from "./logger.js";
import * as cm from "./common.js";
import * as sr_api from "../public/streamroller-message-api.cjs";
const SYSTEM_LOGGING_TAG = "DATA-CENTER";
const EXTENSION_NAME = "datacenter";
// ============================================================================
//                           FUNCTION: sendConfig
// ============================================================================
/**
 * loads and sends the config file to the given extension
 * @param {Socket} client_socket socket to send on
 * @param {String} extensionname extension name
 */
function sendConfig(client_socket, extensionname)
{
    let loadedConfig = cm.loadConfig(extensionname);
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendConfig",
        "Sending config file", extensionname, loadedConfig);
    let msg = sr_api.ServerPacket("ConfigFile", EXTENSION_NAME, loadedConfig, "", extensionname);
    client_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: saveConfig
// ============================================================================
/**
 * save the config file to the server store
 * @param {String} extensionname 
 * @param {Object} configdata 
 */
function saveConfig(extensionname, configdata)
{
    cm.saveConfig(extensionname, configdata);
}
// ============================================================================
//                           FUNCTION: sendExtensionList
// ============================================================================
/**
 * Sends the extension list to extension
 * @param {Socket} clientsocket client to send to
 * @param {String} extensionname extension name to send to
 * @param {Object} extensions Extensions to send
 */
function sendExtensionList(clientsocket, extensionname, extensions)
{
    let names = [];
    for (const [key, value] of Object.entries(extensions))
    {
        names.push(key);
    }
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendExtensionList", "sending ExtensionList to " + extensionname);
    let msg = sr_api.ServerPacket("ExtensionList", EXTENSION_NAME, names, "", extensionname);
    clientsocket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: sendChannelList
// ============================================================================
/**
 * Send channellist to extension
 * @param {Socket} clientSocket socket to send to 
 * @param {String} extensionname extension name to send to
 * @param {Array} channels channels
 */
function sendChannelList(socket, extensionname, channels)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendChannelList", "Sending CannelsList to " + extensionname);
    let msg = sr_api.ServerPacket("ChannelList", EXTENSION_NAME, channels, "", extensionname);
    socket.emit("message", msg)
}
// ============================================================================
//                           FUNCTION: createChannel
// ============================================================================
/**
 * Create and join a channel. If channel exists the existing one will be joined else created.
 * A ChannelCreated or ChannelJoined message will be broadcast
 * @param {Socket} server_socket 
 * @param {Socket} client_socket 
 * @param {String} channel_to_create 
 * @param {Array} channels 
 * @param {String} extensionname 
 */
function createChannel(server_socket, client_socket, channel_to_create, channels, extensionname)
{
    if (channels.includes(channel_to_create))
    {
        logger.warn("[" + SYSTEM_LOGGING_TAG + "] message_handlers.createChannel:",
            "Channel " + channel_to_create + " exists. Joining existing channel instead " + extensionname);
        client_socket.join(channel_to_create);
        server_socket.emit("message",
            sr_api.ServerPacket("ChannelJoined", EXTENSION_NAME, channel_to_create, "", extensionname));
    } else
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "] message_handlers.createChannel", "Extension:"
            + extensionname + " created " + channel_to_create);
        // attach socket to channel
        client_socket.join(channel_to_create);
        // add channel to list
        channels.push(channel_to_create);
        server_socket.emit("message",
            sr_api.ServerPacket("ChannelCreated", EXTENSION_NAME, channel_to_create, "", extensionname));
    }
}
// ============================================================================
//                           FUNCTION: joinChannel
// ============================================================================
/**
 * Join a channel. if it doesn't exist an UnknownChannel message is sent back.
 * If it exists it is joined and a ChannelJoined message is broadcast out
 * @param {Socket} server_socket 
 * @param {Socket} client_socket 
 * @param {String} channel_to_join
 * @param {Array} channels 
 * @param {String} extensionname 
 */
function joinChannel(server_socket, client_socket, channel_to_join, channels, extensionname)
{
    if (channels.includes(channel_to_join))
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "] message_handlers.joinChannel", "Extension:"
            + extensionname + " joining " + channel_to_join);
        // attach socket to channel
        client_socket.join(channel_to_join);
        //broadcast out that the extension doing the channel
        server_socket.emit("message",
            sr_api.ServerPacket("ChannelJoined", EXTENSION_NAME, channel_to_join));
    } else
    {
        logger.warn("[" + SYSTEM_LOGGING_TAG + "] message_handlers.joinChannel", "Extension:"
            + extensionname + " joining unknown channel " + channel_to_join);
        client_socket.emit("message",
            sr_api.ServerPacket("UnknownChannel", EXTENSION_NAME, channel_to_join));
    }
}
// ============================================================================
//                           FUNCTION: leaveChannel
// ============================================================================
/**
 * Leave a channel. 
 * @param {Socket} server_socket server socket
 * @param {Socket} client_socket leaving client
 * @param {String} extensionname name of extension
 * @param {String} channel_to_leave channel to leave
 */
function leaveChannel(client_socket, extensionname, channel_to_leave)
{
    try
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "] message_handlers.leaveChannel Extension:"
            + extensionname + " leaving " + channel_to_leave);
        client_socket.leave(channel_to_leave);
        server_socket.to(channel_to_leave).emit('ChannelLeft', extensionname);
    } catch (e)
    {
        logger.err("[" + SYSTEM_LOGGING_TAG + "] message_handlers.leaveChannel Extension:"
            + extensionname + " failed to leave channel " + channel_to_leave, e);

    }
}
// ============================================================================
//                           FUNCTION: SetLoggingLevel
// ============================================================================
/**
 * Set the system logging level. new level will be broadcast out
 * @param {Socket} server_socket server socket
 * @param {String} level level to set
 */
function setLoggingLevel(server_socket, level)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.setLoggingLevel",
        "setting logging to " + level);
    logger.setLoggingLevel(level);
    let msg = sr_api.ServerPacket("LoggingLevel",
        EXTENSION_NAME, logger.getLoggingLevel());
    server_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: sendLoggingLevel
// ============================================================================
/**
 * send out the logging level
 * @param {Socket} client_socket socket who asked for the information
 */
function sendLoggingLevel(client_socket)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendLoggingLevel",
        "setting logging to " + level);
    let msg = sr_api.ServerPacket("LoggingLevel",
        EXTENSION_NAME, logger.getLoggingLevel());
    client_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: forwardMessage
// ============================================================================
/**
 * forwards a message on based on the data provided
 * priority is "to","dest_channel" and the broadcast (except sender)
 * @param {Socket} server_socket 
 * @param {Object} data 
 * @param {Array} channels 
 * @param {Object} extensions 
 */
function forwardMessage(client_socket, data, channels, extensions)
{
    let decoded_data = JSON.parse(data);
    // check if we tried to send to an invalid channel or extension name
    // check for a 'to' field but no valid socket registered for it
    //console.log("to ", decoded_data.to);

    // if message provides a destination but we don't a client socket for it
    if (decoded_data.to && !extensions[decoded_data.to].socket)
    {
        logger.warn("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:extension:", decoded_data.to, "doesn't exist");
        client_socket.emit("message",
            sr_api.ServerPacket("UnknownExtension", EXTENSION_NAME, decoded_data.to));
    }
    // send direct to client
    else if (extensions[decoded_data.to] && extensions[decoded_data.to].socket)
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:extension:", decoded_data.type, decoded_data.to, decoded_data.data);
        extensions[decoded_data.to].socket.emit("message", data)
    }//if message provides a channel but we don't have that channel in our list then return an error
    else if (decoded_data.dest_channel && !channels.includes(decoded_data.dest_channel))
    {
        logger.warn("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:channel:", decoded_data.dest_channel, "doesn't exist");
        client_socket.emit("message",
            sr_api.ServerPacket("UnknownChannel", EXTENSION_NAME, decoded_data.dest_channel));
    }
    // send to channel
    else if (decoded_data.dest_channel && channels.includes(decoded_data.dest_channel))
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:channel:", decoded_data.type, decoded_data.dest_channel);
        client_socket.to(decoded_data.dest_channel).emit("message", data);
    }
    else
    {// broadcast (except the sender)
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:BROADCAST(Except sender):", decoded_data);
        client_socket.broadcast.emit("message", data);

    }
}
// ============================================================================
//                           FUNCTION: broadcastMessage
// ============================================================================
/**
 * Broadcast message
 * @param {serverSocket} server_socket 
 * @param {object} data 
 */
function broadcastMessage(server_socket, data)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.broadcastMessage",
        "Destination:BROADCAST(Except sender)", data.type, data.from);
    server_socket.emit("message", data);
}
// ============================================================================
//                           FUNCTION: errorMessage
// ============================================================================
/**
 * Send an error message to the given socket
 * @param {Socket} client_socket 
 * @param {String} error 
 * @param {String} data 
 */
function errorMessage(client_socket, error, data)
{
    logger.err("[" + SYSTEM_LOGGING_TAG + "]message_handlers.errorMessage",
        error);
    client_socket.emit("message",
        sr_api.ServerPacket("InvalidMessage",
            EXTENSION_NAME,
            { error: error, data: data }))
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export
{
    sendConfig,
    saveConfig,
    sendExtensionList,
    sendChannelList,
    createChannel,
    leaveChannel,
    joinChannel,
    setLoggingLevel,
    sendLoggingLevel,
    forwardMessage,
    broadcastMessage,
    errorMessage
}

