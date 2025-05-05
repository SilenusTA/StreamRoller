/**
 * Copyright (C) 2025 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import WebSocket from "ws";
import * as logger from "../../../backend/data_center/modules/logger.js";

const localConfig =
{
    onMessageCallback: null,
    createDummyChatMessageCallback: null,
    userName: "",
    streamerName: "",
    chatroomId: "",
    channelId: "",
    channelName: "",
    connected: false,
    websocket: null,
    connectToChatScheduleHandle: null,
    connectToChatTimeout: 2000,
    listeners: [
        { event: 'message', handler: handleMessage },
        { event: 'open', handler: handleOpen },
        { event: 'error', handler: handleError },
        { event: 'close', handler: handleClose },
    ],
    reconnectAttempts: 0,
    maxReconnectAttempts: 20,
    maxFailedConnections: 5,
    reconnectionDelay: 10000,
    // debug
    // connection counters
    counters: {},
    DEBUG: false,
    SYSTEM_LOGGING_TAG: "[KICK]"
}
// ============================================================================
//                           FUNCTION: connectChat
// ============================================================================
/**
 * initialise the chat system
 * @param {function} onMessageCallback 
 */
function init (onMessageCallback, createDummyChatMessage)
{
    localConfig.onMessageCallback = onMessageCallback;
    localConfig.createDummyChatMessageCallback = createDummyChatMessage
}
// ============================================================================
//                           FUNCTION: connectChat
// ============================================================================
/**
 * 
 * @param {string} chatroomId // channel to subscribe to
 * @param {string} userName // user logged in name
 * @param {string} streamerName // name for the channel Name we are connecting to (normally the same unless using the app to read/view another channel)
 */
function connectChat (chatroomId, channelId, userName, streamerName)
{
    try
    {
        // save these values off. only the channel Name is used for connections
        // the rest are used for messages back to the chat to inform the user of connections/disconnections etc
        localConfig.chatroomId = chatroomId;
        localConfig.channelId = channelId;
        localConfig.userName = userName;
        localConfig.streamerName = streamerName;
        localConfig.channelName = streamerName;

        file_log("connectChat called for", userName)
        // disconnect if already connected
        if (localConfig.websocket && localConfig.websocket.readyState !== WebSocket.CLOSED)
        {
            localConfig.listeners.forEach(({ event, handler }) =>
            {
                localConfig.websocket.off(event, handler);
            });
            localConfig.websocket.close();
        }

        // Pusher WebSocket URL
        const pusherWsUrl = 'wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false';
        const commonHeaders = {
            'Origin': 'https://kick.com',
            'Cache-Control': 'no-cache',
            'Accept-Language': 'en-GB,en;q=0.9,af-ZA;q=0.8,af;q=0.7,en-US;q=0.6',
            'Pragma': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
            'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
        };
        // create new socket
        localConfig.websocket = new WebSocket(pusherWsUrl, {
            headers: { ...commonHeaders }
        });
        // add event handlers
        localConfig.listeners.forEach(({ event, handler }) =>
        {
            localConfig.websocket.on(event, handler);
        });
    }
    catch (err)
    {
        file_log(localConfig.SYSTEM_LOGGING_TAG + "connectChat Error Received:", err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "connectChat", "Error Received:", err);
        Reconnect();
    }
}
// ============================================================================
//                           FUNCTION: handleOpen
// ============================================================================
/**
 * 
 */
function handleOpen ()
{
    file_log("Connection opened")
    //console.log(`Kick:Connection opened.`);
}
// ============================================================================
//                           FUNCTION: handleMessage
// ============================================================================
/**
 * 
 * @param {object} data 
 */
function handleMessage (data)
{
    try
    {
        const message = JSON.parse(data);
        file_log("handleMessage", message)
        localConfig.connected = true;
        // When connection is established, subscribe to a channel
        if (message.event === 'pusher:connection_established')
        {
            // subscribe to a channel events
            subscribeToChannel(localConfig.chatroomId)

            // delay here as on startup the other extension might not be ready to receive yet
            setTimeout(() =>
            {
                let dummyMessage =
                {
                    "id": "1",
                    "chatroom_id": 1,
                    "channel": localConfig.streamerName,
                    "content": `${localConfig.userName} connected to ${localConfig.channelName} chatroom on Kick`,
                    "type": "system",
                    "created_at": "2025-04-27T07:01:49+00:00",
                    "sender": {
                        "id": 1,
                        "username": "System",
                        "identity": { "color": "Red", "badges": [{ "type": "bot", "text": "bot" }] }
                    }
                };
                localConfig.createDummyChatMessageCallback(dummyMessage)
            }, 5000);
        }
        else if (message.event === 'pusher_internal:subscription_succeeded')
        {
            //            
        }
        else if (message.event === 'App\\Events\\ChatMessageEvent')
            onChatMessage(message)
        else
            console.log("Kick: not handling these messages yet", message)
    }
    catch (err)
    {
        file_log(localConfig.SYSTEM_LOGGING_TAG + "handleMessage Error Received:", err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "handleMessage", "Error Received:", err);
    }
}
// ============================================================================
//                           FUNCTION: handleError
// ============================================================================
/**
 * 
 * @param {object} error 
 */
function handleError (error)
{

    file_log(localConfig.SYSTEM_LOGGING_TAG + "handleError Error Received:", error)
    logger.err(localConfig.SYSTEM_LOGGING_TAG + "Kick:chat:handleError", "Websocket Error Received:", error);
    Reconnect();
}
// ============================================================================
//                           FUNCTION: handleClose
// ============================================================================
/**
 * 
 * @param {string} code 
 * @param {string} reason 
 */
function handleClose (code, reason)
{
    file_log("handleClose" + reason, code)

    localConfig.connected = false;
    let dummyMessage =
    {
        "id": "1",
        "chatroom_id": 1,
        "channel": localConfig.streamerName,
        "content": `Connected closed for ${localConfig.userName} connected to ${localConfig.chatroomId} chatroom on Kick for streamer ${localConfig.streamerName}`,
        "type": "system",
        "created_at": "2025-04-27T07:01:49+00:00",
        "sender": {
            "id": 1,
            "username": "System",
            "identity": { "color": "Red", "badges": [{ "type": "bot", "text": "bot" }] }
        }
    };
    localConfig.createDummyChatMessageCallback(dummyMessage)
}

// ============================================================================
//                           FUNCTION: subscribeToChannel
// ============================================================================
function subscribeToChannel ()
{
    try
    {
        file_log("subscribeToChannel")
        // subscribe to chatrooms
        let subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `chatrooms.${localConfig.chatroomId}.v2` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

        // subscribe to for rewards
        subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `chatrooms_${localConfig.chatroomId}` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

        // subscribe to for rewards
        subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `chatrooms_${localConfig.chatroomId}.v1` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

        // subscribe for alerts
        subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `channel.${localConfig.channelId}` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

        // subscribe for alerts
        subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `channel.${localConfig.channelId}.v1` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

        // subscribe for alerts
        subscribeMessage = {
            event: 'pusher:subscribe',
            data: { channel: `channel.${localConfig.channelId}.v2` }
        };
        file_log("subscribeMessage", subscribeMessage)
        localConfig.websocket.send(JSON.stringify(subscribeMessage));

    }
    catch (err)
    {
        file_log(localConfig.SYSTEM_LOGGING_TAG + "subscribeToChannel Error Received:", err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "subscribeToChannel", "failed, retrying.", err);
        setTimeout(subscribeToChannel(localConfig.channelName), 1000)
    }
}
// ============================================================================
//                           FUNCTION: disconnectChat
// ============================================================================
/**
 * Disconnect socket
 */
function disconnectChat ()
{
    file_log("disconnectChat")
    if (localConfig.websocket && localConfig.websocket.readyState !== WebSocket.CLOSED)
    {
        localConfig.listeners.forEach(({ event, handler }) =>
        {
            localConfig.websocket.off(event, handler);
        });
        localConfig.websocket.close();
    }
    localConfig.websocket = null;
}
// ============================================================================
//                           FUNCTION: connected
// ============================================================================
function connected ()
{
    return localConfig.connected
}
// ============================================================================
//                           FUNCTION: onChatMessage
// ============================================================================
/**
 * 
 * @param {object} data 
 */
function onChatMessage (message)
{
    if (typeof (message.data) == "string")
        localConfig.onMessageCallback(JSON.parse(message.data));
    else
        localConfig.onMessageCallback(message.data);
}
// ============================================================================
//                           FUNCTION: Reconnect
// ============================================================================
function Reconnect ()
{
    file_log("Reconnecting chat ",
        {
            channelName: localConfig.channelName,
            reconnectAttempts: localConfig.reconnectAttempts,
            maxFailedConnections: localConfig.maxFailedConnections,
            readyState: localConfig.websocket.readyState,
        })
    if (localConfig.reconnectAttempts >= localConfig.maxFailedConnections)
    {
        file_log(localConfig.SYSTEM_LOGGING_TAG + "Reconnect Error Received:", `Max reconnection attempts reached for ${localConfig.channelName}`)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "Reconnect", `Max reconnection attempts reached for ${localConfig.channelName}`);
        return; // Max retries reached, stop reconnecting
    }

    if (localConfig.websocket && (localConfig.websocket.readyState === WebSocket.CLOSING || localConfig.websocket.readyState === WebSocket.CLOSED))
    {
        localConfig.reconnectAttempts++;
        file_log(localConfig.SYSTEM_LOGGING_TAG + "Reconnect Error Received:", `Attempt #${localConfig.reconnectAttempts} for ${localConfig.channelName}`)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "Reconnect", `Attempt #${localConfig.reconnectAttempts} for ${localConfig.channelName}`);
        setTimeout(() =>
        {
            connectChat(localConfig.chatroomId, localConfig.channelId, localConfig.userName, localConfig.streamerName)
        }, localConfig.reconnectionDelay);
    }
}
// ============================================================================
//                           FUNCTION: file_log
//                       For debug purposes. logs raw message data
// ============================================================================
import fs from 'fs'
let basedir = "chatdata/";
let fileHandle = null;
let startup = true;
async function file_log (userMessage, data = "")
{
    if (!localConfig.DEBUG)
        return
    let message = userMessage
    try
    {

        var filename = "kickChatMessages.js";
        var buffer = "";
        if (!fs.existsSync(basedir))
            fs.mkdirSync(basedir, { recursive: true });

        // check if we already have this handler
        if (!fileHandle)
            fileHandle = await fs.createWriteStream(basedir + "/" + filename, { flags: 'a' });

        if (startup)
        {
            startup = false;
            buffer = "/* ################# startup ######################### */\n"
        }
        buffer += "message='" + message + "'\n"
        if (typeof data != "object")
            buffer += "data='" + data + "'\n"
        else
        {
            if (typeof data.data == "string")
                data.data = JSON.parse(data.data)
            // this will handle the nested objects that are already stringified
            data = JSON.stringify(data)
            buffer += "data=" + data + "\n"
        }

        fileHandle.write(buffer);
        //bad coding but can't end it here (due to async stuff) and it is just debug code (just left as a reminder we have a dangling pointer)
        //fileHandle.end("")

    }
    catch (error)
    {
        console.log("debug file logging crashed", error.message)
    }
}
export { init, connectChat, disconnectChat, connected }