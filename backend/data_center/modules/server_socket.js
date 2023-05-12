/** ######################### SERVER_SOCKET.js #################################
// @file This file handles the server socket. This will consume client
// sockets and handle messages received and sent out
// -------------------------- Creation ----------------------------------------
// @author Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// On connection the client will receive a client id. After initial connection
// the client should join(register)/create a room it wishes to use. Multiple 
// rooms can be created/joined(registered).
// You can then send/monitor the channel for messages as required
// === Rooms ===
// The API expects clients to join a room by registering.
// ie. if an extension is provided for twitch chat it might create a
// room called 'TWITCH_CHAT' and the any client can register
// for messages to that room. Each module will have to specify
// the rooms they create so that users know what to register for
// ............................. usage ........................................
// ------------------------ Import socket.io
//    import DataCenterIo from "socket.io-client";
// ------------------------ setup handlers to receive messages from the system normally three are used
//    DataCenterSocket.on("connect", (data) => onDataCenterConnect(DataCenterSocket));
//    DataCenterSocket.on("disconnect", (reason) => onDataCenterDisconnect(reason));
//    DataCenterSocket.on("message", (data) => onDataCenterMessage(data));
// ------------------------ Connect to the websocket handle
//    DataCenterSocket = DataCenterIo("http://localhost:3000", { transports: ["websocket"] });
// ------------------------ send a message to a room in the data center
//    DataCenterSocket.emit(messagetype, 
//                          {CLIENT_ID, 
//                           SOCKET_NAME, 
//                           CHANNEL_NAME, 
//                           MESSAGE_TYPE,
//                           data
//                          });
// --------------------------- description -------------------------------------
// 1) After the connection a "connect" message should be received. In the handler
//    for this "onDataCenterDisconnect(reason)" above you should either create or
//    register to a room/channel to send and receive messages from.
// 2) All data packets are stringified JSON objects as shown below
// 3) CLIENT_ID is what you get in the first message to the client when connecting
//    and gets received by the onDataCenterConnect(DataCenterSocket)) function
// ....... A NOTE ON MESSAGE TYPES ......
// There are three places where message types come up.
// 1) initial connection, this will be the websoctet type, normally set to
//            { transports: ["websocket"] }
// 2) In emit/receive funcions
//             messagetype ( lower case in emit meessage above in usage section)
//             First parameter in a received message (the .on handlers above)                
//    this is one of the following
//       createchannel, register, message, disconnect,unregister
//    this tells us what type of websocket service you are requesting/recieving. 
//    Once up and running you will only use the 'message' service with a data 
//    message as shown below
// 5) In the data section of a message. This is the one we will mostly use during
//    normal operation (ie not connecting or disconnecting the socket)
//          MESSAGE_TYPE is one of "data" or "info" or "error"
// ....................... data message format .................................
// ============================================================================
*/

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as logger from "./logger.js";
import { Server } from "socket.io";
import * as mh from "./message_handlers.js";
import * as cm from "./common.js";
import * as childprocess from "child_process"
const channels = [];
let extensions = {};
let server_socket = null;
let config = {}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * Starts the server
 * @param {Express} app 
 * @param {Object} server
 * @param {Array} exts 
 */
function start (app, server, exts)
{
    extensions = exts;
    cm.initcrypto();
    config = cm.loadConfig('datacenter');
    //setup our server socket on the http server
    try
    {
        // note. can't use the api functions here as we are creating a server socket
        server_socket = new Server(server, {
            transports: ["websocket"],
        });
        logger.log("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.start", "Server is running and waiting for clients");
        // wait for messages
        server_socket.on("connection", (socket) =>
        {
            // call onConnect to store the connection details
            onConnect(socket);
            socket.on("disconnect", (reason) => onDisconnect(socket, reason));
            socket.on("message", (data) => onMessage(socket, data));
        });
    } catch (err)
    {
        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.start", "server startup failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onConnect
// ============================================================================
/**
 * receives connect messages
 * @param {Socket} socket socket received on
 */
function onConnect (socket)
{
    //logger.log("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onConnect", socket.id);
    socket.emit("connected", socket.id);
}
// ============================================================================
//                           FUNCTION: onDisconnect
// ============================================================================
/**
 * receive disconnect messages
 * @param {Socket} socket 
 * @param {string} reason 
 */
function onDisconnect (socket, reason)
{
    logger.info("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onDisconnect", reason, socket.id);
}
// ============================================================================
//                           FUNCTION: onMessage
// ============================================================================
/**
 * receives messages
 * @param {Socket} socket 
 * @param {Object} server_packet 
 */
function onMessage (socket, server_packet)
{
    //console.log(("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", server_packet))
    logger.extra("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", server_packet);
    // make sure we are using the same api version
    if (server_packet.version != config.apiVersion)
    {
        //console.log("onMessage2" ,server_packet)
        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "Version mismatch:", server_packet.version, "!=", config.apiVersion);

        logger.info("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "!!!!!!! Message Sytem API version doesn't match: ", server_packet);
        mh.errorMessage(socket, "Incorrect api version", server_packet);
        return;
    }

    // check that the sender has sent a name and id
    if (!server_packet.type || !server_packet.from || !server_packet.type === "" || !server_packet.from === "")
    {
        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "!!!!!!! Invalid data: ", server_packet);
        mh.errorMessage(socket, "Missing type/from field", server_packet);
        return;
    }
    // add this socket to the extension if it doesn't already exist
    if (typeof (extensions[server_packet.from]) === undefined || !extensions[server_packet.from])
    {
        extensions[server_packet.from] = {};
    }
    if (typeof (extensions[server_packet.from].socket) === undefined || !extensions[server_packet.from].socket)
    {
        logger.log("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "registering new socket for " + server_packet.from);
        extensions[server_packet.from].socket = socket;
    }
    else  
    {
        if (extensions[server_packet.from].socket.id != socket.id)
        {
            logger.warn("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Extension socket changed for " + server_packet.from);
            extensions[server_packet.from].socket = socket;
        }
    }
    // process the clients request
    if (server_packet.type === "RequestConfig")
        mh.sendConfig(socket, server_packet.from);
    else if (server_packet.type === "SaveConfig")
        mh.saveConfig(server_packet.from, server_packet.data);
    else if (server_packet.type === "RequestData")
        mh.sendData(socket, server_packet.from);
    else if (server_packet.type === "SaveData")
        mh.saveData(server_packet.from, server_packet.data);
    else if (server_packet.type === "StopServer")
        process.exit(0);
    else if (server_packet.type == "RestartServer")
    {
        console.log("Restarting...");
        const child = childprocess.exec('start "Streamroller" node backend\\data_center\\server.js 5',
            {
                detached: true,
                stdio: 'ignore'
            })
        child.unref();

        // we have to block here to all the restarted thread to start up
        blockingsleep(1000)
        process.exit();

    }
    else if (server_packet.type === "UpdateCredentials")
    {
        mh.UpdateCredentials(server_packet.data);
        //resend new credentials to extension
        mh.RetrieveCredentials(server_packet.data.ExtensionName, extensions);
    }
    else if (server_packet.type === "RequestCredentials")
        mh.RetrieveCredentials(server_packet.from, extensions);
    else if (server_packet.type === "RequestExtensionsList")
        mh.sendExtensionList(socket, server_packet.from, extensions);
    else if (server_packet.type === "RequestChannelsList")
        mh.sendChannelList(socket, server_packet.from, channels);
    else if (server_packet.type === "CreateChannel")
        mh.createChannel(server_socket, socket, server_packet.data, channels, server_packet.from);
    else if (server_packet.type === "JoinChannel")
        mh.joinChannel(server_socket, socket, server_packet.data, channels, server_packet.from);
    else if (server_packet.type === "LeaveChannel")
        mh.leaveChannel(socket, server_packet.from, server_packet.data);
    else if (server_packet.type === "ExtensionMessage")
    {
        if (server_packet.to === undefined)
            mh.errorMessage(socket, "No extension name specified for ExtensionMessage", server_packet);
        else
            mh.forwardMessage(socket, server_packet, channels, extensions);
    }
    else if (server_packet.type === "ChannelData")
    {
        if (server_packet.dest_channel === undefined)
            mh.errorMessage(socket, "No Channel specified for ChannelData", server_packet);
        else
            mh.forwardMessage(socket, server_packet, channels, extensions);
    }
    else if (server_packet.type === "SetLoggingLevel")
    {
        logger.log("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "logging set to level ", server_packet.data);
        mh.setLoggingLevel(server_socket, server_packet.data);
        config.logginglevel = server_packet.data;
        cm.saveConfig(config.extensionname, config);
    }
    else if (server_packet.type === "RequestLoggingLevel")
        mh.sendLoggingLevel(socket);
    else
        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Unhandled message", server_packet);

}

//if we are restarting the server we need to wait for the old one to exit first.
blockingsleep(1000)
function blockingsleep (time, callback)
{
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time)
    {
        ;
    }
    //callback();
}

// ============================================================================
//                           EXPORTS:
// ============================================================================
export { start };
