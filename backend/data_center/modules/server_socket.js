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
/** ######################### SERVER_SOCKET.js #################################
// @file This file handles the server socket. This will consume client
// sockets and handle messages received and sent out
// -------------------------- Creation ----------------------------------------
// @author Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
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
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as childprocess from "child_process";
import process from 'node:process';
import { Server } from "socket.io";
import * as cm from "./common.js";
import * as logger from "./logger.js";
import * as mh from "./message_handlers.js";
import * as v8 from 'node:v8';
import { Buffer } from 'buffer';
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import sr_api from "../public/streamroller-message-api.cjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig =
{
    extensionname: "",// set from server
    channel: "datacenter_channel",
    channels: [],
    extensions: {},// all extensions
    connected_extensionlist: [],// extensions with a socket connection
    backend_server: null,
    server_socket: null,
    serverConfig: {},
    monitorHeapStats: false,
    //monitor data over websocket
    monitorSocketReceivedData: false,
    socketReceivedSize: 0,
    monitorDataHandle: 0,
    // these maintain a list of extensions that have requested an extension list
    // it only handles 'connected' extensions and will ignore extensions without 
    // a valid socket connection
    extensionlist_requesters: [],
    extensionlist_requesters_handles: [],
    all_extensionlist_requesters: [],
    all_extensionlist_requesters_handles: [],

    // callback to main server to save the updated server config
    saveServerConfigFunc: null,
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * Starts the server
 * @param {Express} app 
 * @param {Object} server
 * @param {Array} exts 
 */
function start (app, server, exts, serverConfig, saveServerConfigFunc)
{
    // save the server config in our temp config
    localConfig.serverConfig = serverConfig;
    //update our extension name to match the server
    localConfig.extensionname = serverConfig.extensionname
    // save teh callback function to save the servers data file
    localConfig.saveServerConfigFunc = saveServerConfigFunc;
    //add ourselves to the list of extensions that the server will load
    // done here so we don't use this in the extensions loading section in the loader
    localConfig.serverConfig.enabledExtensions[localConfig.extensionname] = true;
    //add ourselves to the list of extensions we have connected so we can send
    // those out to the extensions that ask for the list
    localConfig.connected_extensionlist[localConfig.extensionname] = true;
    mh.setExtensionName(serverConfig.extensionname)
    // create our extension array
    exts.forEach((elem, i) =>
    {
        localConfig.extensions[elem] = {};
    });
    localConfig.backend_server = server;
    cm.initcrypto();
    //localConfig.serverConfig = cm.loadConfig(localConfig.extensionname);
    //setup our server socket on the http server
    try
    {
        // note. can't use the api functions here as we are creating a server socket
        localConfig.server_socket = new Server(server, {
            transports: ["websocket"],
            maxHttpBufferSize: 1e8,// 100MB had to increase for flight sim
        });
        logger.log("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.start", "Server is running and waiting for clients");
        if (localConfig.monitorSocketReceivedData)
            dataMonitorScheduler();
        // wait for messages
        localConfig.server_socket.on("connection", (socket) =>
        {
            // call onConnect to store the connection details
            if (localConfig.monitorSocketReceivedData)
            {
                onConnect(socket);
                socket.on("disconnect", (reason) => onDisconnect(socket, reason));
                socket.on("message", (data) => socketReceiveDebug(socket, data));
            }
            else
            {
                onConnect(socket);
                socket.on("disconnect", (reason) => onDisconnect(socket, reason));
                socket.on("message", (data) => onMessage(socket, data));
            }
        });
    } catch (err)
    {
        logger.err("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.start", "server startup failed:", err);
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
    // set the extension as disconnected
    let ext = Object.keys(localConfig.extensions).find((entry) => (localConfig.extensions[entry].socket != undefined && localConfig.extensions[entry].socket.id == socket.id))
    localConfig.connected_extensionlist[ext] = socket.connected
    // the disconnected extension previously was on our requesters list so we need to remove it
    if (localConfig.extensionlist_requesters.includes(ext))
    {
        clearTimeout(localConfig.extensionlist_requesters_handles[ext])
        localConfig.extensionlist_requesters.splice(localConfig.extensionlist_requesters.indexOf(ext), 1)
        // update anyone who has previously reqested an extension list if we have changed it
        updateExtensionsListRequesters()
    }
    logger.info("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onDisconnect", reason, socket);
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
    // make sure we are using the same api version
    if (server_packet.version != localConfig.serverConfig.apiVersion)
    {
        logger.err("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "Version mismatch:", server_packet.version, "!=", localConfig.serverConfig.apiVersion);

        logger.info("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "!!!!!!! Message System API version doesn't match: ", server_packet);
        mh.errorMessage(socket, "Incorrect api version", server_packet);
        return;
    }

    // check that the sender has sent a name and id
    if (!server_packet.type || !server_packet.from || !server_packet.type === "" || !server_packet.from === "")
    {
        console.log(JSON.stringify(server_packet, null, 2))
        logger.err("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage",
            "!!!!!!! Invalid data: ", server_packet);
        mh.errorMessage(socket, "Missing type/from field", server_packet);
        return;
    }
    // add this socket to the extension if it doesn't already exist
    if (typeof (localConfig.extensions[server_packet.from]) === "undefined" || !localConfig.extensions[server_packet.from])
        localConfig.extensions[server_packet.from] = {};
    // check we have a valid socket for this extension, don't need to check if the extension exists as it will have been added above
    if (typeof (localConfig.extensions[server_packet.from].socket) === "undefined" || !localConfig.extensions[server_packet.from].socket)
    {
        logger.log("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "registering new socket for ", server_packet.from);
        localConfig.extensions[server_packet.from].socket = socket;
        localConfig.connected_extensionlist[server_packet.from] = localConfig.extensions[server_packet.from].socket.connected
        // if we add a new extension send the list out to anyone who has requested it so far to update them
        updateExtensionsListRequesters()
    }
    else
    {
        // note that we currently only have one slot per connection. this works for extensions that are only loaded once
        // but for webpage stuff we will need to allow more than one sockect for that extension name
        // we need to append the socket id to the extension name to fix this!!!
        if (localConfig.extensions[server_packet.from].socket.id != socket.id)
        {
            logger.warn("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Extension socket id changed for " + server_packet.from);
            logger.warn("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Data ", server_packet);
            logger.warn("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Previous id " + localConfig.extensions[server_packet.from].socket.id);
            logger.warn("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "New id " + socket.id);
            //update the extensions socket as it has changed
            localConfig.extensions[server_packet.from].socket = socket;

        }
        localConfig.connected_extensionlist[server_packet.from] = localConfig.extensions[server_packet.from].socket.connected
    }
    // process the clients request
    if (server_packet.type === "RequestSoftwareVersion")
        mh.sendSoftwareVersion(socket, server_packet.from);
    else if (server_packet.type === "RequestConfig")
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
        RestartServer();
    else if (server_packet.type === "UpdateCredentials")
    {
        mh.UpdateCredentials(server_packet.data);
        //resend new credentials to extension
        mh.RetrieveCredentials(server_packet.data.ExtensionName, localConfig.extensions);
    }
    else if (server_packet.type === "RequestCredentials")
        mh.RetrieveCredentials(server_packet.from, localConfig.extensions);
    else if (server_packet.type === "DeleteCredentials")
        mh.DeleteCredentials(socket, server_packet.from);
    else if (server_packet.type === "RequestExtensionsList")
    {
        if (!localConfig.extensionlist_requesters.includes(server_packet.from))
            localConfig.extensionlist_requesters.push(server_packet.from)
        localConfig.connected_extensionlist.sort()
        mh.sendExtensionList(socket, server_packet.from, localConfig.connected_extensionlist);
    }
    else if (server_packet.type === "RequestAllExtensionsList")
    {
        if (!localConfig.all_extensionlist_requesters.includes(server_packet.from))
            localConfig.all_extensionlist_requesters.push(server_packet.from)
        mh.sendExtensionList(socket, server_packet.from, localConfig.extensions);
    }
    else if (server_packet.type === "RequestChannelsList")
        mh.sendChannelList(socket, server_packet.from, localConfig.channels);
    else if (server_packet.type === "CreateChannel")
        mh.createChannel(localConfig.server_socket, socket, server_packet.data, localConfig.channels, server_packet.from);
    else if (server_packet.type === "JoinChannel")
        mh.joinChannel(localConfig.server_socket, socket, server_packet.data, localConfig.channels, server_packet.from);
    else if (server_packet.type === "LeaveChannel")
        mh.leaveChannel(socket, server_packet.from, server_packet.data);
    else if (server_packet.type === "ExtensionMessage")
    {
        if (server_packet.to === undefined)
            mh.errorMessage(socket, "No extension name specified for ExtensionMessage", server_packet);
        else if (server_packet.to === localConfig.extensionname
            && server_packet.data.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(server_packet.from);
        else if (server_packet.to === localConfig.extensionname
            && server_packet.data.type === "SettingsWidgetSmallData")
            processSettingsWidgetSmallData(server_packet.data.data);
        else
            mh.forwardMessage(socket, server_packet, localConfig.channels, localConfig.extensions);
    }
    else if (server_packet.type === "ChannelData")
    {
        if (server_packet.dest_channel === undefined)
            mh.errorMessage(socket, "No dest_channel specified for ChannelData", server_packet);
        else
            mh.forwardMessage(socket, server_packet, localConfig.channels, localConfig.extensions);
    }
    else if (server_packet.type === "SetLoggingLevel")
    {
        logger.log("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "logging set to level ", server_packet.data);
        mh.setLoggingLevel(localConfig.server_socket, server_packet.data);
        localConfig.serverConfig.logginglevel = server_packet.data;
        cm.saveConfig(localConfig.serverConfig.extensionname, localConfig.serverConfig);
    }
    else if (server_packet.type === "RequestLoggingLevel")
        mh.sendLoggingLevel(socket);
    else if (server_packet.type === "MonitorHeap")
    {
        // if we are turning it on then start the monitoring process
        if (server_packet.data == 1 && !localConfig.monitorHeapStats)
        {
            localConfig.monitorHeapStats = true;
            heapStatsScheduler()
        }
        else
            localConfig.monitorHeapStats = false;
    }
    else
    {
        logger.err("[" + localConfig.serverConfig.SYSTEM_LOGGING_TAG + "]server_socket.onMessage", "Unhandled message");
        console.log(JSON.stringify(server_packet, null, 2))
    }
}
// ============================================================================
//                      updateExtensionsListRequesters()
// ===========================================================================
function updateExtensionsListRequesters ()
{
    // update users who requested extensions with sockets
    for (let i = 0; i < localConfig.extensionlist_requesters.length; i++)
    {
        // buffer the extensionlist messages using a timer
        clearTimeout(localConfig.extensionlist_requesters_handles[localConfig.extensionlist_requesters[i]])
        localConfig.extensionlist_requesters_handles[localConfig.extensionlist_requesters[i]] = setTimeout(() =>
        {
            // send the connected extension list
            mh.sendExtensionList(localConfig.extensions[localConfig.extensionlist_requesters[i]].socket, localConfig.extensionlist_requesters[i], localConfig.connected_extensionlist);
        }, 2000);
    }
    // update users who have requested the full list (even extensions without sockets)
    for (let i = 0; i < localConfig.all_extensionlist_requesters.length; i++)
    {
        // buffer the extensionlist messages using a timer
        clearTimeout(localConfig.all_extensionlist_requesters_handles[localConfig.all_extensionlist_requesters[i]])
        localConfig.all_extensionlist_requesters_handles[localConfig.all_extensionlist_requesters[i]] = setTimeout(() =>
        {
            // send the connected extension list
            mh.sendExtensionList(localConfig.extensions[localConfig.all_extensionlist_requesters[i]].socket, localConfig.all_extensionlist_requesters[i], localConfig.extensions);
        }, 2000);
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * @param {String} to 
 */
function SendSettingsWidgetSmall (to = "")
{
    // read our modal file
    fs.readFile(__dirname + "/partials/datacentersettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(localConfig))
            {
                if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }

            let checkboxes = "<div class='form-check form-check-inline py-2'>"
            for (var key in localConfig.serverConfig.enabledExtensions)
            {
                checkboxes += createCheckBox(key, key, localConfig.serverConfig.enabledExtensions[key] ? "checked" : "")
                //checkboxes += "<BR>"
            }
            checkboxes += "</div>"
            modalstring = modalstring.replace("datacenterExtensionListCheckboxes", checkboxes)

            sr_api.sendMessage(localConfig.server_socket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    localConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        localConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        to,
                        "",
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                )
            )
        }
    });
}
// ===========================================================================
//                           FUNCTION: processSettingsWidgetSmallData
// ===========================================================================
/**
 * @param {object} data 
 */
function processSettingsWidgetSmallData (data)
{
    let restart = false;
    // set the extension list load settings
    for (var key in localConfig.serverConfig.enabledExtensions)
    {
        if (data[key])
        {
            console.log(key, true)

            if (!localConfig.serverConfig.enabledExtensions[key])
                restart = true;
            localConfig.serverConfig.enabledExtensions[key] = true;
        }
        else
        {
            console.log(key, false)
            if (localConfig.serverConfig.enabledExtensions[key])
                restart = true;
            localConfig.serverConfig.enabledExtensions[key] = false;
        }
    }

    // check if we are changing the an extensions state and restart if needed
    if (restart)
        RestartServer()
    // broadcast our modal out so anyone showing it can update it
    SendSettingsWidgetSmall("");
    localConfig.saveServerConfigFunc(localConfig.serverConfig);
}
// ===========================================================================
//                           FUNCTION: createCheckBox
// ===========================================================================
/**
 * 
 * @param {string} description 
 * @param {string} name 
 * @param {boolean} checked 
 * @returns html code of the checkbox
 */
function createCheckBox (description, name, checked)
{
    let checkedtext = "";
    if (checked)
        checkedtext = "checked";
    return `<input class="form-check-input" name="${name}" type="checkbox" id="${name}" ${checkedtext}>
        <label class="form-check-label" for="${name}">&nbsp;${description}</label><BR>`
}
// ===========================================================================
//                      RestartServer()
// ===========================================================================
function RestartServer ()
{
    console.log("Restarting...");

    const child = childprocess.exec('cmd /k start /MIN "Streamroller" node backend\\data_center\\server.js 5',
        //const child = childprocess.exec('start /MIN "Streamroller" node_modules\\.bin\\node backend\\data_center\\server.js 5',
        {
            detached: true,
            stdio: 'ignore'
        })
    child.unref();
    setTimeout(() =>
    {
        console.log("exiting")
        localConfig.backend_server.close();
        process.exit();
    }, 1000);
}
// ===========================================================================
//                      heapStatsScheduler()
// ===========================================================================


// DEBUG monitoring heap status
function heapStatsScheduler ()
{
    setTimeout(() =>
    {
        dumpHeapStats()
    }
        , 1000);
}
function dumpHeapStats ()
{
    let maxHeap = v8.getHeapStatistics().heap_size_limit;
    let heap = v8.getHeapStatistics();
    let used_heap_size = heap.used_heap_size
    console.log("server Heap usage \t" + ((used_heap_size / maxHeap) * 100).toFixed(2) + "%", heap.number_of_native_contexts, heap.number_of_detached_contexts)
    if (localConfig.monitorHeapStats)
        heapStatsScheduler()
}
//end Debugheap

// ===========================================================================
//                      DataMonitor
// ===========================================================================
function socketReceiveDebug (socket, server_packet)
{
    localConfig.socketReceivedSize = localConfig.socketReceivedSize + Buffer.byteLength(JSON.stringify(server_packet))
    onMessage(socket, server_packet)
}
function dataMonitorScheduler ()
{
    mh.sendDataLoad(localConfig.server_socket, localConfig.socketReceivedSize);
    localConfig.socketReceivedSize = 0;
    if (localConfig.monitorSocketReceivedData)
    {

        clearTimeout(localConfig.monitorDataHandle);
        localConfig.monitorDataHandle = setTimeout(() =>
        {
            dataMonitorScheduler();
        }, "1000");
    }
}
// ============================================================================
//                           EXPORTS:
// ============================================================================
export { start };
