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

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================

import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as kickAPI from './kickAPIs.js';
import * as chatService from './chat.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    setClientSecretFn: null,// callback to set the client secret for the server to use when authorizing
};

const default_serverConfig = {
    __version__: "0.1",
    extensionname: "kick",
    channel: "KICK_CHANNEL",
    kickEnabled: "off",
    demotext1: "demo text",
    kick_restore_defaults: "off",
    channelData: null, // only storing this until we can get the official api returning the data. until then we are using a third party API to get the chatroom id so we store it to minimise usage of this api.
};
let serverConfig = structuredClone(default_serverConfig)
const default_serverCredentials =
{
    version: "0.1",
    kickApplicationClientId: "",
    kickApplicationSecret: ""
};
let serverCredentials = structuredClone(default_serverCredentials);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Demo Extension for copying and pasting to get you started faster on writing extensions",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Kick message received",
                displaytitle: "Kick Chat Message",
                description: "A chat message was received. textMessage field has name and message combined",
                messagetype: "trigger_ChatMessageReceived",
                parameters: {

                    triggerId: "KickChatMessage", //Identifier that users can use to identify this particular trigger message if triggered by an action
                    // streamroller settings
                    type: "trigger_ChatMessageReceived",
                    platform: "Kick",
                    textMessage: "[username]: [message]",
                    safemessage: "",
                    color: "#FF0000",

                    // youtube message data
                    id: "",
                    message: "",
                    messagetype: "",
                    timestamp: -1,

                    //youtube author data
                    sender: "",
                    senderid: "",
                    senderbadges: "",
                }
            },
        ],
    actions:
        [
            /*{
                name: "demoextensionDoSomething",
                name_UIDescription: "tooltip",
                displaytitle: "Do your Stuff",
                displaytitle_UIDescription: "tooltip",
                description: "A request for the demo extension to do something useful",
                description_UIDescription: "tooltip",
                messagetype: "action_DemoextensionDoStuff",
                messagetype_UIDescription: "tooltip",
                parameters: { message: "",message_UIDescription: "tooltip" }
            }*/

        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * 
 * @param {string} app 
 * @param {string} host 
 * @param {string} port 
 * @param {number} heartbeat 
 */
function start (host, port, nonce, clientId, heartbeat, setClientSecretFn)
{
    try
    {
        localConfig.nonce = nonce;
        localConfig.heartBeatTimeout = heartbeat;
        localConfig.setClientSecretFn = setClientSecretFn;
        serverCredentials.kickApplicationClientId = clientId;

        // setup callbacks and data for the kick API
        kickAPI.init(updateRefreshToken);
        kickAPI.setCredentials(serverCredentials);

        // setup callbacks and data for the kick chat API
        chatService.init(onChatMessage);

        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);

    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * @param {String} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our Credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout);
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
async function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data && server_packet.data.extensionname
            && server_packet.data.extensionname === serverConfig.extensionname)
        {
            let connectionChanged
            let configSubVersions = 0;
            let defaultSubVersions = default_serverConfig.__version__.split('.');
            // should only be hit on very first run when there is no saved data file
            if (!server_packet.data.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                SaveConfigToServer();
            }
            // split the version numbers as we can merge and save user settings for minor changes
            configSubVersions = server_packet.data.__version__.split('.')
            if (configSubVersions[0] != defaultSubVersions[0])
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                SaveConfigToServer();
                connectionChanged = true;
            }
            else if (configSubVersions[1] != defaultSubVersions[1])
            {
                serverConfig = { ...default_serverConfig, ...server_packet.data };
                serverConfig.__version__ = default_serverConfig.__version__;
                console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
                SaveConfigToServer();
                connectionChanged = true;
            }
            else
            {
                // check if we have turned on the extension
                if (server_packet.multistreamEnabled == "on" && server_packet.multistreamEnabled == "off")
                    connectionChanged = true;
                serverConfig = structuredClone(server_packet.data);
                SaveConfigToServer();
            }
            if (connectionChanged)
                //check for reconnection required, ie extension turned on/off etc
                SendSettingsWidgetSmall();
            SendSettingsWidgetLarge();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // we have a saved credentials file
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            serverCredentials = structuredClone(server_packet.data);
            SendSettingsWidgetSmall();
            SendSettingsWidgetLarge();
        }
        else
        {
            serverCredentials = structuredClone(default_serverCredentials);
        }
        // need to send these back to the webserver level so any web auth calls will have this data
        if (serverCredentials.kickApplicationSecret && serverCredentials.kickApplicationSecret)
            localConfig.setClientSecretFn(
                serverCredentials.kickApplicationClientId,
                serverCredentials.kickApplicationSecret)

        // update the kickAPI credentials
        kickAPI.setCredentials(serverCredentials);

        // test the api
        localConfig.streamer = await kickAPI.getUser()
        // temp fix until the official api returns the chatroom id.
        // should really do this each time after initial dev is done
        // TBD PreRelease - remove if statement before release
        if (serverConfig.channelData == null)
        {
            console.log("getting channel id")
            serverConfig.channelData = await kickAPI.getChannelData(localConfig.streamer.data[0].name)
            SaveConfigToServer()
        }

        localConfig.kickChannel = await kickAPI.getChannel(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`);
        localConfig.kickLiveStream = await kickAPI.getLivestream(localConfig.streamer.data[0].user_id)
        //chatService.connectPusher("chatrooms.6734242.v2")
        chatService.connectChat(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`)

        // dev logging data
        // TBD PreRelease - remove before release
        //console.log("############## Data retrieved #############")
        //console.log("localConfig.kickChannel", JSON.stringify(localConfig.kickChannel, null, 2));
        //console.log("localConfig.kickLiveStream", JSON.stringify(localConfig.kickLiveStream, null, 2));
        //console.log("serverConfig.channelData", JSON.stringify(serverConfig.channelData, null, 2));
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            if (extension_packet.to === serverConfig.extensionname)
                SendSettingsWidgetSmall(extension_packet.from);
        }
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
        {
            if (extension_packet.to === serverConfig.extensionname)
                SendSettingsWidgetLarge();
        }
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
                parseSettingsWidgetSmall(extension_packet.data)
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLarge(extension_packet.data)
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "TriggerAndActions",
                        serverConfig.extensionname,
                        triggersandactions,
                        "",
                        server_packet.from
                    ),
                    "",
                    server_packet.from
                )
            )
        }
        else if (extension_packet.type === "action_DemoextensionDoStuff")
            console.log("action_DemoextensionDoStuff called with", extension_packet.data)
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
    }
    else if (server_packet.type === "UnknownChannel")
    {
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);
    }
    else if (server_packet.type === "ChannelData")
    {
        //not currently monitoring channel data
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * @param {String} [to = ""] // extension name or send to channel if not provided
 */
function SendSettingsWidgetSmall (to = "")
{
    fs.readFile(__dirname + '/kicksettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        serverConfig.channel,
                        to,
                    ),
                    serverConfig.channel,
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * 
 */
function SendSettingsWidgetLarge (to = "")
{
    fs.readFile(__dirname + '/kicksettingswidgetlarge.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }
            modalString = modalString.replace("kickApplicationClientIdtext", serverCredentials.kickApplicationClientId);
            modalString = modalString.replace("kickApplicationSecrettext", serverCredentials.kickApplicationSecret);

            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        serverConfig.channel,
                        to,
                    ),
                    serverConfig.channel,
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetSmall
// ============================================================================
/**
 * 
 * @param {object} data // data from user submitted form
 */
function parseSettingsWidgetSmall (data)
{
    if (data.kick_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
    }
    else
    {
        serverConfig.kickEnabled = "off";
        for (const [key, value] of Object.entries(data))
            serverConfig[key] = value;

    }
    SaveConfigToServer();
    SendSettingsWidgetSmall("");
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetLarge
// ============================================================================
/**
 * @param {object} data // data from user submitted form
 */
function parseSettingsWidgetLarge (data)
{
    if (data.kick_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        DeleteCredentialsOnServer();
        console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
    }
    else
    {
        serverConfig.kickEnabled = "off";
        for (const [key, value] of Object.entries(data))
            if (serverConfig[key])
                serverConfig[key] = value;
        // if we have changed the client ID lets set that
        if (serverCredentials.kickApplicationClientId != data.kickApplicationClientId)
        {
            serverCredentials.kickApplicationClientId = data.kickApplicationClientId;
            kickAPI.setCredentials(serverCredentials);
            SaveCredentialToServer("kickApplicationClientId", serverCredentials.kickApplicationClientId)
        }
        // if we have changed the client ID lets set that
        if (serverCredentials.kickApplicationSecret != data.kickApplicationSecret)
        {
            serverCredentials.kickApplicationSecret = data.kickApplicationSecret;
            kickAPI.setCredentials(serverCredentials);
            SaveCredentialToServer("kickApplicationSecret", serverCredentials.kickApplicationSecret)
        }

    }

    SaveConfigToServer();
    SendSettingsWidgetLarge("");
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Sends Credentials to the server
 */
function DeleteCredentialsOnServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "DeleteCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
            },
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Provides a heartbeat message to inform other extensions of our status
 */
function heartBeatCallback ()
{
    // we can send a color for things like the liveportal page to use to show on the icon.
    let color = "red";
    // local variable to determine if we are in an intermediate state.

    // ie extension turned on but can't connect to a service etc
    // for teh demo we just leave it false so this extension should have an orange icon next to it in liveportal
    let connected = false;

    // determine the color we wish to show for our status
    if (serverConfig.kickEnabled === "on")
    {
        connected = true;
        if (!connected)
            color = "orange"
        else
            color = "green"
    }
    else
        color = "red"

    // send the status message. These should be short but you can add extra data if you wish to provide status for other extension (ie obs bitrate, connection quality etc). if more than a couple of items it is recommended to setup a status message timer to send them out separately
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    connected: connected,
                    color: color
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: SaveCredentialToServer
// ============================================================================
/**
 * Store an updated refresh token
 * @param {string} token 
 */
function updateRefreshToken (token)
{
    // dev need to check this is working. remove once seen working ok
    console.log("update refresh token called", token)
    SaveCredentialToServer("kickAccessToken", token.kickAccessToken)
    SaveCredentialToServer("kickRefreshToken", token.kickRefreshToken)
}

// ============================================================================
//                           FUNCTION: SaveCredentialToServer
// ============================================================================
/**
 * Sends Credential to the server to be saved
 * @param {string} name 
 * @param {string} value 
 */
function SaveCredentialToServer (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
                CredentialName: name,
                CredentialValue: value,
            },
        ));
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds a trigger from the messagetype
 * @param {string} messagetype 
 * @returns {object} trigger
 */
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                     FUNCTION: postTrigger
// ============================================================================
/**
 * Posts a trigger out on our channel
 * @param {object} data 
 */
function postTrigger (data)
{
    let message = sr_api.ServerPacket(
        "ChannelData",
        serverConfig.extensionname,
        sr_api.ExtensionPacket(
            data.messagetype,
            serverConfig.extensionname,
            data,
            serverConfig.channel
        ),
        serverConfig.channel
    )
    sr_api.sendMessage(localConfig.DataCenterSocket,
        message);
}
// #######################################################################
// ######################### sanitiseHTML ################################
// #######################################################################
/**
 * Removes html chars from a string to avoid chat message html injection
 * @param {string} string 
 * @returns {string} the parsed string
 */
function sanitiseHTML (string)
{
    // sanitiser
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return String(string).replace(/[&<>"'`=\/]/g, function (s)
    {
        return entityMap[s];
    });
}
// ============================================================================
//                           FUNCTION: onChatMessage
// ============================================================================
function onChatMessage (message)
{
    /* Emote message
        will need to parse these messages in live portal to insert the relent emotes (broadcaster/mods icons as well)
        postTrigger {
        name: 'Kick message received',
        displaytitle: 'Kick Chat Message',
        description: 'A chat message was received. textMessage field has name and message combined',
        messagetype: 'trigger_ChatMessageReceived',
        parameters: {
            textMessage: 'OldDepressedGamer: [emote:1730756:emojiCheerful]',
            safemessage: '[emote:1730756:emojiCheerful]',
            color: '#DEB2FF',
            id: '9a...eb021fd',
            messagetype: 'message',
            message: '[emote:1730756:emojiCheerful]',
            timestamp: '2025-04-27T07:01:49+00:00',
            sender: 'OldDepressedGamer',
            senderid: 6...95,
            senderbadges: [ [Object] ]
        }
        }
    */

    /* Text message
    sending kick message {
        "id": "9a970...72947eb021fd",
        "chatroom_id": 6734242,
        "content": "[emote:1730756:emojiCheerful]",
        "type": "message",
        "created_at": "2025-04-27T07:01:49+00:00",
        "sender": {
            "id": 688...5,
            "username": "OldDepressedGamer",
            "slug": "olddepressedgamer",
            "identity": {
            "color": "#DEB2FF",
            "badges": [
                {
                "type": "broadcaster",
                "text": "Broadcaster"
                }
            ]
            }
        }
        }
    */
    //console.log("sending kick message", JSON.stringify(message, null, 2))
    try
    {
        let triggerToSend = findTriggerByMessageType("trigger_ChatMessageReceived")
        let safeMessage = sanitiseHTML(message.content);
        safeMessage = safeMessage.replace(/[^\x00-\x7F]/g, "");
        triggerToSend.parameters = {
            textMessage: message.sender.username + ": " + safeMessage,
            safemessage: safeMessage,
            color: message.sender.identity.color,// possibly use color from menu for mods etc

            // youtube message data
            id: message.id,
            messagetype: message.type,
            message: safeMessage,
            timestamp: message.created_at,

            //youtube author data
            sender: message.sender.username,
            senderid: message.sender.id,

            senderbadges: message.sender.identity.badges,
        }
        postTrigger(triggerToSend);

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".SendSettingsWidgetSmall", "failed to load modal", err);
    }
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { start, triggersandactions };

