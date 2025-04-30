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
    channelName: "",
    connected: false,
    websocket: null,
    connectToChatScheduleHandle: null,
    connectToChatTimeout: 2000,
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
 * Start chat
 * @param {string} channelName 
 */
function connectChat (channelName, userName, streamerName = "TBD")
{
    localConfig.channelName = channelName;
    localConfig.userName = userName;
    localConfig.streamerName = streamerName;
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
    localConfig.websocket = new WebSocket(pusherWsUrl, {
        headers: { ...commonHeaders }
    });
    localConfig.websocket.on('open', () =>
    {
        //console.log(`Kick:Connection opened.`);
    });

    localConfig.websocket.on('message', (data) =>
    {
        const message = JSON.parse(data);
        localConfig.connected = true;
        // When connection is established, subscribe to a channel
        if (message.event === 'pusher:connection_established')
        {
            //const socketData = JSON.parse(message.data);
            //console.log(`Kick:Socket established with ID: ${socketData.socket_id}`);

            // Now subscribe to a channel
            subscribeToChannel(localConfig.channelName)
        }
        else if (message.event === 'pusher_internal:subscription_succeeded')
        {
            // delay here as on startup the other extension might not be ready to receive yet
            setTimeout(() =>
            {
                localConfig.createDummyChatMessageCallback(`${localConfig.userName} connected to ${localConfig.userName} chatroom on Kick`)
            }, 5000);

        }
        else if (message.event === 'App\\Events\\ChatMessageEvent')
            onChatMessage(message)
        else
            console.log("Kick: not handling these messages yet", message)
    });

    localConfig.websocket.on('error', (error) =>
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "Kick.connectChat", "Websocket Error Received:", error);
    });

    localConfig.websocket.on('close', (code, reason) =>
    {
        localConfig.connected = false;
        localConfig.createDummyChatMessageCallback(`Connected closed for ${localConfig.userName} chatroom on Kick`)
    });
}
// ============================================================================
//                           FUNCTION: subscribeToChannel
// ============================================================================
function subscribeToChannel (channelName)
{
    const subscribeMessage = {
        event: 'pusher:subscribe',
        data: {
            channel: channelName
        }
    };

    try
    {
        localConfig.websocket.send(JSON.stringify(subscribeMessage));
    }
    catch (err)
    {
        console.log("Subscribe to channel '", channelName, "' failed, retrying", err)
        setTimeout(subscribeToChannel(channelName), 1000)
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
    localConfig.websocket.removeAllListeners();
    localConfig.websocket.close();
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
    localConfig.onMessageCallback(JSON.parse(message.data));
}

export { init, connectChat, disconnectChat, connected }