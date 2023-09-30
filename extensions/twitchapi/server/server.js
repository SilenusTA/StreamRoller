/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as logger from "../../../backend/data_center/modules/logger.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { WebSocket } from "ws";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";

// local config for volatile data
const localConfig =
{
    host: "",
    port: "",
    clientId: "",
    nonce: null,
    DataCenterSocket: null,
    PubSubSocket: null,
    pubsubheartbeathandle: null,
    pubsubheartbeatInterval: 1000 * 5, //ms between PING's (must be every 5 minutes or less)
    pubsubreconnectInterval: 1000 * 3, //ms to wait before reconnect
    userData: "",
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false, // are we connected to obs
        color: "red"
    },
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
}
// default server config
const default_serverConfig = {
    __version__: "0.1.1",
    extensionname: "twitchapi",
    channel: "TWITCH_API",
    twitchapienabled: "off",
    twitchapiresetdefaults: "off",
    topicstolistento: [
        "channel-bits-events-v2.",
        "channel-points-channel-v1.",
        "channel-subscribe-events-v1."
    ]
}
let serverConfig = structuredClone(default_serverConfig);

// credentials used to log into twitch
const localCredentials =
{
    twitchOAuthState: "",
    twitchOAuthToken: ""
}
// triggers and actions for this extension
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "TwitchAPI handles messages to and from twitch",
    version: "0.1",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Custom Redemption",
                displaytitle: "Custom Redemption",
                description: "Someone Redeemed a custom channel points reward",
                messagetype: "trigger_TwitchApiCustomRedemption",
                parameters: {
                    type: "",
                    id: "",
                    user: "",
                    date: "",
                    title: "",
                    cost: "",
                    image1x: "",
                    image2x: "",
                    image4x: "",
                    status: "",
                    user_input: ""
                }
            },

        ],
    actions:
        [
            /* {
                 name: "Activate Macro",
                 displaytitle: "Activate Macro",
                 description: "Activate a macro function",
                 messagetype: "action_ActivateMacro",
                 parameters: { name: "" }
             },*/
        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
function start (host, port, nonce, clientId, heartbeat)
{
    localConfig.host = host;
    localConfig.port = port;
    localConfig.nonce = nonce;
    localConfig.clientId = clientId;
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".start", "DataCenterSocket no heatbeat passed:", heartbeat);

    try
    {
        ConnectToDataCenter(localConfig.host, localConfig.port);
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + " server.start", "initialise failed:", err.message);
    }

}
// ============================================================================
//                           FUNCTION: ConnectToDataCenter
// ============================================================================
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
    } catch (err)
    {
        logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", err);
    }
}
function onDataCenterDisconnect (reason)
{
    logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));

    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CONFIG
    // -------------------------------------------------------------------------------------------------
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname
                    + " ConfigFile Updated", "The config file has been Updated to the latest version v"
                    + default_serverConfig.__version__ + ". Your settings may have changed " + "\x1b[0m");
            }
            else
            {
                // update our config
                if (server_packet.data != "")
                    serverConfig = structuredClone(server_packet.data)
            }
            // update server log, mainly here if we have added new default options when a user
            // updates their version of streamroller
            SaveConfigToServer();
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CREDENTIALS
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != ""
            && server_packet.data.twitchOAuthState != "" && server_packet.data.twitchOAuthToken != "")
        {
            localCredentials.twitchOAuthState = server_packet.data.twitchOAuthState;
            localCredentials.twitchOAuthToken = server_packet.data.twitchOAuthToken;
            if (!localConfig.status.connected && serverConfig.twitchapienabled == "on")
                connectTwitchAPI()
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                      ### EXTENSION MESSAGE ###
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR SETTINGS DIALOG
        // -------------------------------------------------------------------------------------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            SendSettingsWidgetSmall(extension_packet.from);
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR CREDENTIALS DIALOG
        // -------------------------------------------------------------------------------------------------

        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        // -------------------------------------------------------------------------------------------------
        //                   SETTINGS DIALOG DATA
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.twitchapiresetdefaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Defaults restored", "The config files have been reset. Your settings may have changed" + "\x1b[0m");
                    SaveConfigToServer();
                }
                else
                {
                    if (serverConfig.twitchapienabled != extension_packet.data.twitchapienabled)
                    {
                        // we have changed our state so
                        //currently on and connected to lets disconnect
                        if (serverConfig.twitchapienabled == "on")
                        {
                            if (localConfig.status.connected)
                                disconnectTwitchAPI();
                        }
                        else
                        {
                            // we have changed state to on.
                            if (localConfig.status.connected)
                                disconnectTwitchAPI();
                            connectTwitchAPI()
                        }
                        handleSettingsWidgetSmallData(extension_packet.data);
                        SaveConfigToServer();
                    }
                }
            }
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -------------------------------------------------------------------------------------------------
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
        else if (extension_packet.type === "TwitchConnected")
        {
            console.log("TwitchConnected", extension_packet.data)
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                           UNKNOWN CHANNEL MESSAGE RECEIVED
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "UnknownChannel")
    {
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        console.log("UnknownChannel", server_packet)

        if (server_packet.data != "" && server_packet.channel != undefined)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        serverConfig.extensionname,
                        server_packet.data
                    ));
            }, 10000);

        }
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "HeartBeat"
        || server_packet.type === "UnknownExtension"
        || server_packet.type === "ChannelJoined"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled message type:", server_packet);
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
function SendSettingsWidgetSmall (tochannel)
{
    fs.readFile(__dirname + "/twitchapisettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
            //throw err;
        }
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();

            // mormal replaces
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        serverConfig.channel
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
function handleSettingsWidgetSmallData (modalcode)
{
    serverConfig.twitchapienabled = "off";
    serverConfig.twitchapiresetdefaults = "off";
    for (const [key, value] of Object.entries(modalcode))
        serverConfig[key] = value;
}
// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{
    fs.readFile(__dirname + "/twitchapicredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        extensionname,
                        serverConfig.channel
                    ),
                    "",
                    extensionname)
            )
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig,
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    localConfig.status.color = "red"
    if (serverConfig.twitchapienabled == "on" && localConfig.status.connected)
        localConfig.status.color = "green"
    else if (serverConfig.twitchapienabled == "on")
        localConfig.status.color = "orange"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                localConfig.status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ===========================================================================
//                           TWITCH PUBSUB
// ===========================================================================

// ===========================================================================
//                           FUNCTION: connectTwitchAPI
// ===========================================================================
function connectTwitchAPI ()
{
    if (localConfig.status.connected)
        disconnectTwitchAPI()
    localConfig.status.connected = false;
    if (localCredentials.twitchOAuthState == "" || localCredentials.twitchOAuthToken == "")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitchAPI ", "No credentials available to conenct to twitch (have you authorized through the admin pages?)");
        return;
    }
    // this avoids the issue of multiple connections when auth is run
    // the config file will be updated twice so we get two hits from it
    clearTimeout(localConfig.pubsubconnecttimer);
    localConfig.pubsubconnecttimer = setTimeout(() =>
    {
        connect();
        getuserdata();
    }, 2000);

}
// ===========================================================================
//                           FUNCTION: disconnectTwitchAPI
// ===========================================================================
function disconnectTwitchAPI ()
{
    twitchapi_removelisteners()
    localConfig.PubSubSocket.off("open", twitchapi_open);
    localConfig.PubSubSocket.off("onerror", twitchapi_error);
    localConfig.PubSubSocket.off("message", twitchapi_message);
    localConfig.PubSubSocket.send("close", "0")
    localConfig.PubSubSocket.off("close", twitchapi_close);
    localConfig.status.connected = false;

}
// ============================================================================
//                           FUNCTION: connect
// ============================================================================
function connect ()
{
    if (!localConfig.status.connected && serverConfig.twitchapienabled == "on")
    {
        try
        {
            localConfig.PubSubSocket = new WebSocket('wss://pubsub-edge.twitch.tv');
            localConfig.PubSubSocket.on("open", twitchapi_open);
            localConfig.PubSubSocket.on("onerror", twitchapi_error);
            localConfig.PubSubSocket.on("message", twitchapi_message);
            localConfig.PubSubSocket.on("close", twitchapi_close);
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connect failed", err.message);
        }
    }
    else
    {
        if (localConfig.status.connected)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connect. Trying to receonnect while already connected");
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connect. Trying to receonnect while extension turned off");
    }
}
// ============================================================================
//                           FUNCTION: twitchapi_open
// ============================================================================
function twitchapi_open ()
{
    localConfig.status.connected = true;
    // start the heartbeat to ping the server and keep it alive
    pubSubHeartbeat();
}
// ============================================================================
//                           FUNCTION: twitchapi_error
// ============================================================================
function twitchapi_error (error)
{
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_close error:", error, "reconnecting");
}
// ============================================================================
//                           FUNCTION: twitchapi_message
// ============================================================================
function twitchapi_message (event)
{
    let data = JSON.parse(event.toString())
    twitchapi_parseMessage(data)
}
// ============================================================================
//                           FUNCTION: twitchapi_message
// ============================================================================
function twitchapi_close (code, reason)
{
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_close error:", code, reason, "reconnecting");
    clearInterval(localConfig.pubsubheartbeathandle);
    setTimeout(connect, localConfig.pubsubreconnectInterval);
}
// ============================================================================
//                           FUNCTION: parseMessage
// ============================================================================
function twitchapi_parseMessage (rawdata)
{
    try
    {
        if (rawdata.type == "MESSAGE")
        {
            let messagedata = JSON.parse(rawdata.data.message)
            if (messagedata.type == "reward-redeemed")
            {
                sendRedeemTrigger(messagedata);
            }
            else
                console.log("messagetype", messagedata.type, "not handled")
        }
        else if (rawdata.type == 'RECONNECT')
        {

            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_parseMessage twitch requested Reconnect");
            setTimeout(connect, localConfig.pubsubreconnectInterval);
        }
        //else
        //   console.log("ignoring ", rawdata.type)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_parseMessage error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: addlisteners
// ============================================================================
function twitchapi_addlisteners ()
{
    if (localConfig.userData != "" && localConfig.status.connected)
    {
        for (let i = 0; i < serverConfig.topicstolistento.length; i++)
        {
            twitchapi_listen(serverConfig.topicstolistento[i] + localConfig.userData[0].id)
        }
    }
    else
    {
        if (!localConfig.status.connected)
        {
            //console.log("twitchapi_addlisteners connection not ready, rescheduling")
            setTimeout(() =>
            {
                twitchapi_addlisteners()
            }, 2000);
        }
        else
            console.log("twitchapi_addlisteners no user data to add listeners with")
    }

}
// ============================================================================
//                           FUNCTION: addlisteners
// ============================================================================
function twitchapi_removelisteners ()
{
    if (localConfig.userData != "")
    {
        for (let i = 0; i < serverConfig.topicstolistento.length; i++)
        {
            twitchapi_unlisten(serverConfig.topicstolistento[i] + localConfig.userData[0].id)
        }
    }
}
// ============================================================================
//                           FUNCTION: twitchapi_listen
// ============================================================================
function twitchapi_listen (topic)
{
    let message = {
        'type': 'LISTEN',
        'nonce': localCredentials.twitchOAuthState,
        'data': {
            'topics': [topic],
            'auth_token': localCredentials.twitchOAuthToken
        }
    }
    try
    {
        localConfig.PubSubSocket.send(JSON.stringify(message));
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_listen error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: twitchapi_unlisten
// ============================================================================
function twitchapi_unlisten (topic)
{
    let message = {
        'type': 'UNLISTEN',
        'nonce': localCredentials.twitchOAuthState,
        'data': {
            'topics': [topic],
            'auth_token': localCredentials.twitchOAuthToken
        }
    }
    try
    {
        localConfig.PubSubSocket.send(JSON.stringify(message));
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".twitchapi_unlisten error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: getuserdata
// ============================================================================
function getuserdata ()
{
    try
    {
        fetch('https://api.twitch.tv/helix/users', {
            method: 'GET',
            headers: new Headers({
                "Accept": "application/json",
                "Client-ID": localConfig.clientId,
                "Authorization": "Bearer " + localCredentials.twitchOAuthToken
            })
        })
            .then(function (response) { return response.json(); })
            .then(function (user)
            {
                if (user && user.data && user.data.length > 0)
                {
                    localConfig.userData = user.data
                    twitchapi_addlisteners()
                }
            });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getuserdata error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: sendRedeemTrigger
// ============================================================================
function sendRedeemTrigger (messagedata)
{
    let data = findtriggerByMessageType("trigger_TwitchApiCustomRedemption")
    data.parameters.type = messagedata.type;
    data.parameters.id = messagedata.data.redemption.reward.id;
    data.parameters.user = messagedata.data.redemption.user.display_name;
    data.parameters.date = messagedata.data.redemption.redeemed_at;
    data.parameters.title = messagedata.data.redemption.reward.title;
    data.parameters.cost = messagedata.data.redemption.reward.cost;
    if (messagedata.data.redemption.reward.image == undefined)
    {
        data.parameters.image1x = messagedata.data.redemption.reward.default_image.url_1x;
        data.parameters.image2x = messagedata.data.redemption.reward.default_image.url_2x;
        data.parameters.image4x = messagedata.data.redemption.reward.default_image.url_4x;
    }
    else
    {
        data.parameters.image1x = messagedata.data.redemption.reward.image.url_1x;
        data.parameters.image2x = messagedata.data.redemption.reward.image.url_2x;
        data.parameters.image4x = messagedata.data.redemption.reward.image.url_4x;
    }
    data.parameters.status = messagedata.data.redemption.status;
    if (messagedata.data.redemption.user_input == undefined)
        data.parameters.user_input = ""
    else
        data.parameters.user_input = messagedata.data.redemption.user_input
    // send the information out on our channel
    try
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "trigger_TwitchApiCustomRedemption",
                    serverConfig.extensionname,
                    data,
                    serverConfig.channel
                ),
                serverConfig.channel)
        )
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".sendRedeemTrigger error:", err.message);
    }
}

// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase().indexOf(messagetype.toLowerCase()) > -1)
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: pubSubHeartbeat
// ============================================================================
function pubSubHeartbeat ()
{
    if (!localConfig.status.connected || serverConfig.twitchapienabled == "off")
        return
    try
    {
        localConfig.PubSubSocket.send(JSON.stringify({ 'type': 'PING' }));
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".pubSubHeartbeat", "Error Pinging Twitch", err.message);
    }
    clearTimeout(localConfig.pubsubheartbeathandle)

    localConfig.pubsubheartbeathandle = setInterval(pubSubHeartbeat, localConfig.pubsubheartbeatInterval);
}
export { start }