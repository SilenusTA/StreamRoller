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
}
function init (onMessageCallback)
{
    localConfig.onMessageCallback = onMessageCallback;
}
function connectChat (channelname)
{
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
    const ws = new WebSocket(pusherWsUrl, {
        headers: { ...commonHeaders }
    });

    ws.on('open', () =>
    {
        //console.log(`Kick:Connection opened.`);
    });

    ws.on('message', (data) =>
    {
        const message = JSON.parse(data);

        // When connection is established, subscribe to a channel
        if (message.event === 'pusher:connection_established')
        {
            const socketData = JSON.parse(message.data);
            //console.log(`Kick:Socket established with ID: ${socketData.socket_id}`);

            // Now subscribe to a channel
            const subscribeMessage = {
                event: 'pusher:subscribe',
                data: {
                    channel: channelname
                }
            };

            ws.send(JSON.stringify(subscribeMessage));
            //console.log(`Kick: Sent subscription request to channel: ${channelname}`);
        }
        else if (message.event === 'pusher_internal:subscription_succeeded')
        {
            console.log(`Kick: successfully connected to ${channelname} chat`)
        }
        else if (message.event === 'App\\Events\\ChatMessageEvent')
            onChatMessage(message)
        else
            console.log("Kick: not handling these messages yet", message.event)

    });

    ws.on('error', (error) =>
    {
        console.log(`Kick: Error`, error);
    });

    ws.on('close', (code, reason) =>
    {
        console.log(`Kick: Connection closed. Code: ${code}, Reason: ${reason}`);
    });
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
export { init, connectChat }