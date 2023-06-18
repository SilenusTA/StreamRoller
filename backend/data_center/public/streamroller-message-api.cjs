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
 * Summary. A common set of functions for use across server and client code. 
 *
 * Description. Various functions to help provide an interface to simplify the coding 
 * required and to avoid having to have multiple functions for client and server 
 *
 * @link   https://github.com/SilenusTA/StreamRoller
 * @file   common StreamRoller functions
 * @author Silenus aka twitch.tv/OldDepressedGamer
 * @since  14-Feb-2022
 */

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
let __api_version__ = "0.2";

// ============================================================================
//                           FUNCTION: ServerPacket
// ============================================================================
/**
 * Creates an string that can be used for StreamRoller server data message packets
 * @param {string} type Type of message being sent
 * @param {string} from Extension name
 * @param {*} data Data to be sent (optional)
 * @param {string} dest_channel Destination Channel name (optional)
 * @param {string} to Extension to be sent to (optional)
 * @param {string} ret_channel return channel (optional)
 * @param {string} version Interface version for debugging purposes only(optional)
 * @return {string} A JSON stringified version of the message object
 */
function ServerPacket (type, from, data, dest_channel, to, ret_channel, version = __api_version__)
{
    //console.log("ServerPacket data:", type, from, typeof (data))
    return {
        type: type,
        from: from,
        dest_channel: dest_channel,
        to: to,
        ret_channel: ret_channel,
        data: data,
        version: version
    };

}
// ============================================================================
//                  FUNCTION: ExtensionPacket
// ============================================================================
/**
 * Creates an string that can be used for StreamRoller server extension message packets
 * @param {string} type Message type
 * @param {string} from Extension name of sender
 * @param {*} data Data of the message (optional)
 * @param {string} dest_channel Destination channel name (optional)
 * @param {string} to Extension name of intended receiver (optional)
 * @param {string} ret_channel Return channel of any response (optional)
 * @param {string} version Interface version for debugging purposes only(optional)
 * @returns {string} A JSON stringified version of the message object
 */
function ExtensionPacket (type, from, data, dest_channel, to, ret_channel, version = __api_version__)
{
    // console.log("ExtensionPacket data:", type, typeof (data), data)
    return {
        type: type,
        from: from,
        dest_channel: dest_channel,
        to: to,
        ret_channel: ret_channel,
        data: data,
        version: version
    };
}
// ============================================================================
//                  FUNCTION: sendMessage
// ============================================================================
/**
 * Send a message on the connection
 * @param {socket} connection The socket connect
 * @param {string} data Data to be sent
 */
function sendMessage (connection, data)
{
    //console.log("sendMessage", data, "end sendMessage")
    try
    {
        connection.emit("message", data);

    } catch (e)
    {
        console.log("streamroller-message-api.sendMessage", "send message failed connection failed:", e.message);
        console.log("streamroller-message-api.sendMessage", "data:", data);

    }
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
// Desription: Sets up the connection to the backend
// Parameters: 
//  onConnect(socket) - callback for connection message
//  onDisconnect(reason) - callback for disconnection message
//  onMessage(data) - callback for messages
// Return
//  * - handler to the connection.
// ----------------------------- notes ----------------------------------------
// 1) connects to the twitch api via streamlabs
// 2) creates the connection to the data server and registers our message handlers
// ============================================================================
/**
 * Sets up a connection to the data center.
 * @param {function(data)} onMessage handler for messages object is the socket
 * @param {function(data)} onConnect handler for connection message.
 * @param {function(reason)} onDisconnect handler for disconnect message.
 * @param {string} host host to listen on (default http://localhost").
 * @param {string} port  port to listen on (default 3000).
 * @returns 
 */
function setupConnection (onMessage, onConnect, onDisconnect, host, port)
{
    var DCSocket = null;
    try
    {
        if (typeof module !== "undefined" && module.exports)
        {
            const SocketIo = require("socket.io-client");
            DCSocket = SocketIo(host + ":" + port,
                { transports: ["websocket"] });
        }
        else
        {
            console.log("connecting to", host + ":" + port);
            // user has imported the package via the <script tag>
            DCSocket = io(host + ":" + port,
                { transports: ["websocket"] });
        }
        // handlers
        DCSocket.on("message", (data) => { onMessage(data) });
        DCSocket.on("connect", () => onConnect());
        DCSocket.on("disconnect", (reason) => onDisconnect(reason));
        return DCSocket;
    } catch (err)
    {
        console.log("streamroller-message-api.setupConnection", "DataCenterSocket connection failed:", err);
        throw "streamroller-message-api failed to create connection";
    }
}

// ============================================================================
//                                  EXPORTS
// ============================================================================
// Either export(ES6) or attach to the exports (CommonJS)
// ---------------------------------------------------------
// Client Usage CommonJS:
// <script src="/streamroller_apis.cjs"></script>
// streamroller_api.ServerPacket("CreateChannel","STREAMROLLER_API");
// ---------------------------------------------------------
// Client Usage ES6:
// import * as streamroller_api from './public/streamroller_apis.cjs';
// streamroller_api.ServerPacket("CreateChannel","STREAMROLLER_API");
// ---------------------------------------------------------
let sr_api = {
    ExtensionPacket,
    ServerPacket,
    setupConnection,
    sendMessage,
    __api_version__
};
if (typeof module !== "undefined" && module.exports)
{
    /** 
     * Streamroller_apis: helper functions for using the Streamroller system 
     * @exports ServerPacket() Create Server data packet
     * @exports ExtensionPacket() Create Extension data packet
     * @exports setupConnection() Create a socket connetion
     * @export sendMessage() send a message on the conection
     */
    module.exports = sr_api;
}
else
{
    /**
     * something or other
    * @module sr_api CJS export comment :D
    */
    let sr_api = {
        ExtensionPacket,
        ServerPacket,
        setupConnection,
        sendMessage,
        __api_version__
    };
}



