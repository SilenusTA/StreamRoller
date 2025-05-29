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
* Summary. Server Code used to routing functions and all server messages
* Messages are routed by type. Either driect to socket, room or broadcast
* all(excluding sender), or broadcast to all(including sender)
* 
* @see   https://github.com/SilenusTA/StreamRoller
* @author Silenus aka twitch.tv/OldDepressedGamer
* @since  29-Jan-2021
*/

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// ============================================================================
import { Buffer } from 'buffer';
import sr_api from "../public/streamroller-message-api.cjs";
import * as cm from "./common.js";
import * as logger from "./logger.js";

const SYSTEM_LOGGING_TAG = "DATA-CENTER";
let EXTENSION_NAME = null;
let monitorSocketSentData = false;
let socketSentSize = 0;


// ============================================================================
//                           FUNCTION: setExtensionName
// ============================================================================
/**
 * loads and sends the config file to the given extension
 * @param {String} extensionname extension name
 */
function setExtensionName (extensionname)
{
    EXTENSION_NAME = extensionname;
}
// ============================================================================
//                           FUNCTION: sendConfig
// ============================================================================
/**
 * loads and sends the config file to the given extension
 * @param {Socket} client_socket socket to send on
 * @param {String} extensionname extension name
 */
function sendConfig (client_socket, extensionname)
{
    let loadedConfig = cm.loadConfig(extensionname);
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendConfig",
        "Sending config file", extensionname, loadedConfig);
    let msg = sr_api.ServerPacket("ConfigFile", EXTENSION_NAME, loadedConfig, "", extensionname);
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
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
function saveConfig (extensionname, configdata)
{
    cm.saveConfig(extensionname, configdata);
}
// ============================================================================
//                           FUNCTION: sendData
// ============================================================================
/**
 * loads and sends the data file to the given extension
 * @param {Socket} client_socket socket to send on
 * @param {String} extensionname extension name
 */
function sendData (client_socket, extensionname)
{
    let loadedData = cm.loadData(extensionname);
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendData",
        "Sending data file", extensionname, loadedData);
    let msg = sr_api.ServerPacket("DataFile", EXTENSION_NAME, loadedData, "", extensionname);
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
    client_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: sendData
// ============================================================================
/**
 * loads and sends the data file to the given extension
 * @param {Socket} client_socket socket to send on
 * @param {String} extensionname extension name
 */
function sendSoftwareVersion (client_socket, extensionname)
{
    let loadedData = cm.loadSoftwareVersion();
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendData",
        "Sending data file", extensionname, loadedData);
    let msg = sr_api.ServerPacket("SoftwareVersion", EXTENSION_NAME, loadedData, "", extensionname);
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
    client_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: saveData
// ============================================================================
/**
 * save the Data file to the server store
 * @param {String} extensionname 
 * @param {Object} data 
 */
function saveData (extensionname, data)
{
    cm.saveData(extensionname, data);
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
function sendExtensionList (clientsocket, extensionname, extensions)
{
    try
    {
        let names = [];
        for (const [key, value] of Object.entries(extensions))
        {
            names.push(key);
        }
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendExtensionList", "sending ExtensionList to " + extensionname);
        let msg = sr_api.ServerPacket("ExtensionList", EXTENSION_NAME, names, "", extensionname);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        clientsocket.emit("message", msg);
    }
    catch (error)
    {
        if (!clientsocket)
            logger.err("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendExtensionList", "Error: clientsocket null " + clientsocket, "extensionname:", extensionname, "extensions:", extensions);
    }
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
function sendChannelList (socket, extensionname, channels)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendChannelList", "Sending CannelsList to " + extensionname);
    let msg = sr_api.ServerPacket("ChannelList", EXTENSION_NAME, channels, "", extensionname);
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
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
function createChannel (server_socket, client_socket, channel_to_create, channels, extensionname)
{
    var msg;
    if (channels.includes(channel_to_create))
    {
        logger.info("[" + SYSTEM_LOGGING_TAG + "] message_handlers.createChannel:",
            "Channel " + channel_to_create + " exists. Joining existing channel instead " + extensionname);
        client_socket.join(channel_to_create);
        msg = sr_api.ServerPacket("ChannelJoined", EXTENSION_NAME, channel_to_create, "", extensionname);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        server_socket.emit("message", msg);
    } else
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "] message_handlers.createChannel", "Extension:"
            + extensionname + " created " + channel_to_create);
        // attach socket to channel
        client_socket.join(channel_to_create);
        // add channel to list
        channels.push(channel_to_create);
        msg = sr_api.ServerPacket("ChannelCreated", EXTENSION_NAME, channel_to_create, "", extensionname);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        server_socket.emit("message", msg);
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
function joinChannel (server_socket, client_socket, channel_to_join, channels, extensionname)
{
    var msg;
    if (channels.includes(channel_to_join))
    {
        logger.info("[" + SYSTEM_LOGGING_TAG + "] message_handlers.joinChannel", "Extension:"
            + extensionname + " joining " + channel_to_join);
        // attach socket to channel
        client_socket.join(channel_to_join);
        //broadcast out that the extension doing the channel
        msg = sr_api.ServerPacket("ChannelJoined", EXTENSION_NAME, channel_to_join, "", extensionname);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        server_socket.emit("message", msg);
    } else
    {
        logger.warn("[" + SYSTEM_LOGGING_TAG + "] message_handlers.joinChannel", "Extension:"
            + extensionname + " joining unknown channel. extension needs to reschedule. channel:" + channel_to_join);
        msg = sr_api.ServerPacket("UnknownChannel", EXTENSION_NAME, channel_to_join, "", extensionname);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        client_socket.emit("message", msg);
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
function leaveChannel (client_socket, extensionname, channel_to_leave)
{
    try
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "] message_handlers.leaveChannel Extension:"
            + extensionname + " leaving " + channel_to_leave);
        client_socket.leave(channel_to_leave);
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
function setLoggingLevel (server_socket, level)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.setLoggingLevel",
        "setting logging to " + level);
    logger.setLoggingLevel(level);
    let msg = sr_api.ServerPacket("LoggingLevel",
        EXTENSION_NAME, logger.getLoggingLevel());
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
    server_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: sendLoggingLevel
// ============================================================================
/**
 * send out the logging level
 * @param {Socket} client_socket socket who asked for the information
 */
function sendLoggingLevel (client_socket)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.sendLoggingLevel",
        "setting logging to " + logger.getLoggingLevel());
    let msg = sr_api.ServerPacket("LoggingLevel",
        EXTENSION_NAME, logger.getLoggingLevel());
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
    client_socket.emit("message", msg);
}
// ============================================================================
//                           FUNCTION: forwardMessage
// ============================================================================
/**
 * forwards a message on based on the data provided
 * priority is "to","dest_channel" and the broadcast (except sender)
 * @param {Socket} server_socket 
 * @param {Object} server_packet 
 * @param {Array} channels 
 * @param {Object} extensions 
 */
function forwardMessage (client_socket, server_packet, channels, extensions)
{
    var msg;
    // check if we tried to send to an invalid channel or extension name
    // if message provides a destination but we don't a client socket for it
    if (server_packet.to && extensions[server_packet.to] && !extensions[server_packet.to].socket)
    {
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "UnknownExtension:", server_packet.to, " connection doesn't exist (maybe still loading?) from " + server_packet.from);
        msg = sr_api.ServerPacket("UnknownExtension", EXTENSION_NAME, { error: "extensions has no connection", message: server_packet });
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg));
        client_socket.emit("message", msg);
    }
    // send direct to client
    else if (extensions[server_packet.to] && extensions[server_packet.to].socket)
    {
        logger.extra("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:extension:", server_packet.type, server_packet.to, server_packet.data);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(server_packet));
        extensions[server_packet.to].socket.emit("message", server_packet)
    }
    //if message provides a channel but we don't have that channel in our list then return an error
    else if (server_packet.dest_channel && !channels.includes(server_packet.dest_channel))
    {
        logger.extra("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "UnknownChannel:", server_packet.dest_channel, "doesn't exist (is the extension running?) from " + server_packet.from);
        msg = sr_api.ServerPacket("UnknownChannel", EXTENSION_NAME, server_packet.dest_channel);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg));
        client_socket.emit("message", msg);
    }
    // send to channel
    else if (server_packet.dest_channel && channels.includes(server_packet.dest_channel))
    {
        logger.extra("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:channel:", server_packet.type, server_packet.dest_channel);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(server_packet));
        client_socket.to(server_packet.dest_channel).emit("message", server_packet);
    }
    else
    {// broadcast (except the sender)
        logger.info("[" + SYSTEM_LOGGING_TAG + "]message_handlers.forwardMessage",
            "Destination:BROADCAST(Except sender):", server_packet);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(server_packet));
        client_socket.broadcast.emit("message", server_packet);
    }
}
// ============================================================================
//                           FUNCTION: UpdateCredential
// ============================================================================
function UpdateCredential (server_packet)
{
    try
    {
        cm.saveCredentials(server_packet);
    }
    catch (err)
    {
        console.log("Error while updating credentials for", server_packet.from, JSON.stringify(err, null, 2))
    }
}
// ============================================================================
//                           FUNCTION: DeleteCredentials
// ============================================================================
function DeleteCredentials (client_socket, from)
{
    try
    {
        cm.deleteCredentials(from)
        let msg = sr_api.ServerPacket("CredentialsFileDeleted", EXTENSION_NAME, {}, "", from);
        if (monitorSocketSentData)
            socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg))
        client_socket.emit("message", msg);
    }
    catch (err)
    {
        console.log("Error while deleting credentials for", from, JSON.stringify(err, null, 2))
    }
}
// ============================================================================
//                           FUNCTION: RetrieveCredentials
// ============================================================================
function RetrieveCredentials (from, extensions)
{

    try
    {
        let loadedCredentials = cm.loadCredentials(from);
        let msg
        logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.RetrieveCredentials",
            "Sending credential file", from);
        if (loadedCredentials && loadedCredentials.ExtensionName && extensions[loadedCredentials.ExtensionName])
        {
            // create our message packet
            let msg = sr_api.ServerPacket("CredentialsFile", EXTENSION_NAME, loadedCredentials, "", loadedCredentials.ExtensionName);
            if (monitorSocketSentData)
                socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg));
            extensions[loadedCredentials.ExtensionName].socket.emit("message", msg);
        }
        else
        {
            logger.info("[" + SYSTEM_LOGGING_TAG + "]message_handlers.RetrieveCredentials",
                from + " No data Credentials available or ExtensionName not valid in credential file");
            // send an empty message back so the extension can check for missin credentials
            msg = sr_api.ServerPacket("CredentialsFile", EXTENSION_NAME, "", "", from)
            if (monitorSocketSentData)
                socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg));
            extensions[from].socket.emit("message", msg);
        }
    }
    catch (err)
    {
        console.log("Error while retrieving credentials", JSON.stringify(err, null, 2))
    }

}
// ============================================================================
//                           FUNCTION: broadcastMessage
// ============================================================================
/**
 * Broadcast message
 * @param {serverSocket} server_socket 
 * @param {object} server_packet 
 */
function broadcastMessage (server_socket, server_packet)
{
    logger.log("[" + SYSTEM_LOGGING_TAG + "]message_handlers.broadcastMessage",
        "Destination:BROADCAST(Except sender)", server_packet.type, server_packet.from);
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(server_packet));
    server_socket.emit("message", server_packet);
}
// ============================================================================
//                           FUNCTION: errorMessage
// ============================================================================
/**
 * Send an error message to the given socket
 * @param {Socket} client_socket 
 * @param {String} error 
 * @param {Object} data 
 */
function errorMessage (client_socket, error, data)
{
    logger.err("[" + SYSTEM_LOGGING_TAG + "]message_handlers.errorMessage",
        error, data);
    let msg = sr_api.ServerPacket("InvalidMessage",
        EXTENSION_NAME,
        { error: error, data: data });
    if (monitorSocketSentData)
        socketSentSize = socketSentSize + Buffer.byteLength(JSON.stringify(msg));
    client_socket.emit("message", msg)
}
// ============================================================================
//                           FUNCTION: sendDataLoad
// ============================================================================
/**
 * Send an error message to the given socket
 * @param {object} server_socket 
 * @param {int} receivedSize 
 */
function sendDataLoad (server_socket, receivedSize)
{
    //server_socket.emit("message", { "Input": receivedSize, "Output": socketSentSize });
    console.log("Input KB:\t", (receivedSize / 1024).toFixed(2), "   \tOutput KB\t", (socketSentSize / 1024).toFixed(2));
    socketSentSize = 0;
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export
{
    broadcastMessage, createChannel, DeleteCredentials, errorMessage, forwardMessage, joinChannel, leaveChannel, RetrieveCredentials, saveConfig, saveData, sendChannelList, sendConfig, sendData, sendDataLoad, sendExtensionList, sendLoggingLevel, sendSoftwareVersion, setExtensionName, setLoggingLevel, UpdateCredential
};

