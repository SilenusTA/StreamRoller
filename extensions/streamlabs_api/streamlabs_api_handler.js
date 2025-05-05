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
// note this has to be socket.io-client version 2.0.3 to allow support for Streamlabs api.
import * as fs from "fs";
import { dirname } from 'path';
import StreamlabsIo from "socket.io-client_2.0.3";
import { fileURLToPath } from 'url';
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));

let localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false // this is our connection indicator for discord
    },
    DataCenterSocket: null,
    StreamlabsSocket: null,

    settingsSmallSchedulerHandle: null,
    settingsSmallSchedulerTimeout: 1000,

    settingsLargeSchedulerHandle: null,
    settingsLargeSchedulerTimeout: 1000,
};

const default_serverConfig = {
    __version__: 0.2,
    extensionname: "streamlabs_api",
    channel: "STREAMLABS_ALERT",
    enabled: "off",
};
let serverConfig = structuredClone(default_serverConfig)
let serverCredentials = {
    API_Token: null,
}

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Handles streamlabs alerts and data",
    version: "0.2",
    channel: serverConfig.channel,
    // these are messages we can sendout that other extensions might want to use to trigger an action
    triggers:
        [
            //Streamlabs specific items
            {
                name: "StreamlabsDonationAlert",
                displaytitle: "Streamlabs Donation Received",
                description: "A Streamlabs donation was received",
                messagetype: "trigger_StreamlabsDonationReceived",
                parameters: {
                    username: "",
                    amount: "",
                    formatted_amount: "",
                    message: ""
                }
            },
            {
                name: "StreamlabsMerchAlert",
                displaytitle: "Merch Purchase",
                description: "Someone purchased your Merch",
                messagetype: "trigger_MerchPurchaseReceived",
                parameters: {
                    username: "",
                    message: "",
                    product: "",
                    imageHref: ""
                }
            },
            {
                name: "StreamlabsLoyaltyStoreRedemptionAlert",
                displaytitle: "LoyaltyStore Redemption",
                description: "Someone Reddemed something from your LoyaltyStore",
                messagetype: "trigger_StreamlabsLoyaltyStoreRedemptionReceived",
                parameters: {
                    username: "",
                    viewcount: "",
                }
            },
            //Twitch specific alerts
            {
                name: "StreamlabTwitchFollowAlert",
                displaytitle: "Follow on Twitch",
                description: "A Viewer Followed your twitch stream",
                messagetype: "trigger_TwitchFollowReceived",
                parameters: {
                    username: ""
                }
            },
            {
                name: "StreamlabsTwitchSubscriptionAlert",
                displaytitle: "Subscription on Twitch",
                description: "Someone Subscribed to your twitch stream",
                messagetype: "trigger_TwitchSubscriptionReceived",
                parameters: {
                    username: "",
                    type: "",
                    months: "",
                    gifter: "",
                }
            },
            {
                name: "StreamlabsTwitchResubAlert",
                displaytitle: "Resub on Twitch",
                description: "Someone Resubed to your twitch stream",
                messagetype: "trigger_TwitchResubReceived",
                parameters: {
                    username: "",
                    months: "",
                    streak_months: "",
                }
            },
            {
                name: "StreamlabsTwitchHostAlert",
                displaytitle: "Host on Twitch",
                description: "Someone Hosted your stream on twitch",
                messagetype: "trigger_TwitchHostReceived",
                parameters: {
                    username: "",
                    raiders: ""
                }
            },
            {
                name: "StreamlabsTwitchBitsAlert",
                displaytitle: "Bits on Twitch",
                description: "Someone Donated bits on Twitch",
                messagetype: "trigger_TwitchBitsReceived",
                parameters: {
                    username: "",
                    amount: "",
                    message: "",
                }
            },
            {
                name: "StreamlabsTwitchRaidAlert",
                displaytitle: "Raid on Twitch",
                description: "Someone Raided your stream on Twitch",
                messagetype: "trigger_TwitchRaidReceived",
                parameters: {
                    username: "",
                    viewcount: "",
                }
            },
            {
                name: "StreamlabsTwitchCharityDonationAlert",
                displaytitle: "CharityDonation on Twitch",
                description: "Someone donated to charity on your Twitch stream",
                messagetype: "trigger_TwitchCharityDonationReceived",
                parameters: {
                    username: "",
                    amount: "",
                    formatted_amount: "",
                    message: ""
                }
            },
            {
                name: "StreamlabsCharityDonationAlert",
                displaytitle: "CharityDonation on StreamLabs",
                description: "Someone donated to charity on your StreamLabs Charity",
                messagetype: "trigger_CharityDonationReceived",
                parameters: {
                    username: "",
                    twitchDisplayName: "",
                    amount: "",
                    formatted_amount: "",
                    message: "",
                    campaignId: ""
                }
            },
            {
                name: "StreamlabsTwitchSubMysteryAlert",
                displaytitle: "SubMystery gift on Twitch",
                description: "Someone gifted some subs on your Twitch stream",
                messagetype: "trigger_TwitchSubMysteryGiftReceived",
                parameters: {
                    gifter: "",
                    amount: ""
                }
            },
            //Youtube specific alerts
            {
                name: "StreamlabsYouTubeSubscriptionAlert",
                displaytitle: "Subscription on YouTube",
                description: "Someone Subscribed on YouTube",
                messagetype: "trigger_YouTubeSubscriptionReceived",
                parameters: {
                    username: ""
                }
            },
            {
                name: "StreamlabsYouTubeMemberAlert",
                displaytitle: "Member on YouTube",
                description: "A Member joined on YouTube",
                messagetype: "trigger_YouTubeMemberReceived",
                parameters: {
                    username: "",
                    months: "",
                    subplan: "",
                    message: "",
                }
            },
            {
                name: "StreamlabsYouTubeSuperchatAlert",
                displaytitle: "Superchat on YouTube",
                description: "Someone Superchated on YouTube",
                messagetype: "trigger_YouTubeSuperchatReceived",
                parameters: {
                    username: "",
                    amount: "",
                    formatted_amount: "",
                    message: ""
                }
            },
            {
                name: "StreamlabsDataDump",
                displaytitle: "StreamLabs data dump",
                description: "Stream labs data dump, ie subs/month, top10 donators etc etc",
                messagetype: "trigger_StreamlabsDataDump",
                parameters: {
                    data: ""
                }
            },
            {
                name: "StreamlabsDataDumpUnderlying",
                displaytitle: "StreamLabs Underlying data dump",
                description: "Stream labs Underlying data dump, ie subs/month, top10 donators etc etc",
                messagetype: "trigger_StreamlabsDataDumpUnderlying",
                parameters: {
                    data: ""
                }
            },
            //Kick specific alerts
            {
                name: "StreamlabsKickFollowAlert",
                displaytitle: "Follow on Kick",
                description: "A Viewer Followed your Kick stream",
                messagetype: "trigger_KickFollowReceived",
                parameters: {
                    username: ""
                }
            },
            {
                name: "StreamlabsKickSubscriptionAlert",
                displaytitle: "Subscription on Kick",
                description: "Someone Subscribed to your Kick stream",
                messagetype: "trigger_KickSubscriptionReceived",
                parameters: {
                    username: "",
                    type: "",
                    months: "",
                }
            },
        ],
    // these are messages we can receive to perform an action
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function start (host, port, heartbeat)
{
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".start", "host", host, "port", port, "heartbeat", heartbeat);
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);
    // ########################## SETUP DATACENTER CONNECTION ###############################
    try
    {
        //use the helper to setup and register our callbacks
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "localConfig.DataCenterSocket connection failed:", err);
        throw ("streamlabs_api_handler.js failed to connect to data socket");
    }
}
// ########################## STREAMLABS API CONNECTION #######################
// ============================================================================
//                           FUNCTION: connectToStreamlabs
// ============================================================================
/**
 * Connect to the streamlabs API
 */
function connectToStreamlabs ()
{
    if (!serverCredentials.API_Token)
    {
        disconnectStreamlabs();
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.js", "Credentials not set");
    }
    else
    {
        try
        {
            if (serverConfig.enabled)
            {
                if (localConfig.StreamlabsSocket)
                    disconnectStreamlabs();
                localConfig.StreamlabsSocket = StreamlabsIo("https://sockets.streamlabs.com:443?token=" + serverCredentials.API_Token, { transports: ["websocket"] });
                // handlers
                localConfig.StreamlabsSocket.on("connect", (data) => onStreamlabsConnect(data));
                localConfig.StreamlabsSocket.on("disconnect", (reason) => onStreamlabsDisconnect(reason));
                localConfig.StreamlabsSocket.on("event", (data) => onStreamlabsEvent(data));
            }
            else
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "Streamlabs disabled in config");
            if (localConfig.StreamlabsSocket == "false")
            {
                console.log("connectToStreamlabs: failed to connect")
            }
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "connectToStreamlabs", "Streamlabs connection failed:", err);
        }
    }
}
// ============================================================================
//                           FUNCTION: connectToStreamlabs
// ============================================================================
/**
 * Connect to the streamlabs API
 */
function disconnectStreamlabs ()
{
    try
    {
        if (localConfig.StreamlabsSocket)
        {
            localConfig.StreamlabsSocket.removeAllListeners()
            localConfig.StreamlabsSocket.disconnect();
            localConfig.StreamlabsSocket = null;
        }
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "disconnectStreamlabs", "Streamlabs disconnect failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onStreamlabsDisconnect
// ============================================================================
/**
 * Called when Streamlabs API socket has disconnected
 * @param {string} reason 
 */
function onStreamlabsDisconnect (reason)
{
    localConfig.status.connected = false;
    localConfig.StreamlabsSocket.destroy();
    localConfig.StreamlabsSocket = null;

    SendSettingsWidgetLarge()
    SendSettingsWidgetSmall()
    if (serverConfig.enabled == "on")
        console.log("Streamlabs disconnected, possible reasons(bad credentials, network interruption, service down)")
    serverConfig.enabled = "off";
    logger.warn(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamlabsDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onStreamlabsConnect
// ============================================================================
/**
 * Call on Streamlabs API connection
 */
function onStreamlabsConnect ()
{
    localConfig.status.connected = true;
    // start our heatbeat timer
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamlabsConnect", "streamlabs api socket connected");
}

// ============================================================================
//                           FUNCTION: onStreamlabsEvent
// ============================================================================
/**
 * Handles messaged from the streamlabs api
 * @param {object} data 
 */
function onStreamlabsEvent (data)
{
    // Send this data to the channel for this
    if (serverConfig.enabled === "on")
    {
        // old depreciated system. Will be removed once I update my overlay to use the new trigger system
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ));
        // send alerts using trigger system
        parseStreamlabsMessage(data)
    }
}
// ########################## DATACENTER CONNECTION #######################
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Handles websocket disconnect message from StreamRoller
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Called on connection to StreamRoller websocket
 */
function onDataCenterConnect ()
{
    //store our Id for futre reference
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterConnect", "Creating our channel");
    //register our channels
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    // clear the previous timeout if we have one
    clearTimeout(localConfig.heartBeatHandle);
    // start our heatbeat timer
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Called when we receive a message from StreamRoller
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {

        // check it is our config
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            // temp code to change discord token name to newer variable.
            // remove code in future. Added in 0.3.4
            if (server_packet.data.SL_SOCKET_TOKEN)
            {
                serverCredentials.API_Token = server_packet.data.SL_SOCKET_TOKEN;
                DeleteCredentialsOnServer()
                SaveCredentialToServer("API_Token", serverCredentials.API_Token)
            }
            else
            {
                serverCredentials.API_Token = server_packet.data.API_Token;
            }
            // end temp

            if (serverConfig.enabled == "on")
                connectToStreamlabs();
            else
                disconnectStreamlabs()
            SendSettingsWidgetLarge();
            SendSettingsWidgetSmall();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // received a reqest for our admin bootstrap modal code
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        // received data from our settings widget small. A user has requested some settings be changedd
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                let enabledChanged = false;
                if (serverConfig.enabled != extension_packet.data.enabled_streamlabs_api_small_settings)
                {
                    enabledChanged = true;
                    if (serverConfig.enabled == "on")
                        serverConfig.enabled = "off"
                    else
                        serverConfig.enabled = "on"
                }

                // get our config values to the ones in message
                // mostly just sets channel and extension name
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in extension_packet.data)
                        serverConfig[key] = extension_packet.data[key];

                // check if we have toggled ourselves on or off
                if (enabledChanged)
                    if (serverConfig.enabled == "on")
                        connectToStreamlabs()
                    else
                        disconnectStreamlabs()

                // save our data to the server for next time we run
                SaveConfigToServer();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLargeData(extension_packet.data)
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
    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        //channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        if (server_packet.data === serverConfig.channel)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("CreateChannel",
                        serverConfig.extensionname,
                        server_packet.data));
            }, 5000);
        }
        else
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("JoinChannel",
                        serverConfig.extensionname,
                        server_packet.data));
            }, 5000);
        }
    }

}

// ============================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ============================================================================
/**
 * schedules the sending of the widget code to squish multiple requests down
 * @param {string} to 
 */
function SendSettingsWidgetSmall (to = "")
{

    clearTimeout(localConfig.settingsSmallSchedulerHandle)
    localConfig.settingsSmallSchedulerHandle = setTimeout(() =>
    {
        SendSettingsWidgetSmallScheduler(to)
    }, localConfig.settingsSmallSchedulerTimeout);


}
// ============================================================================
//                           FUNCTION: SendSettingsWidgetSmallScheduler
// ============================================================================

/**
 * Send our settings widget code to the given extension
 * @param {string} to 
 */
function SendSettingsWidgetSmallScheduler (to = "")
{
    let destinationChannel = ""
    if (to == "")
        destinationChannel = serverConfig.channel

    fs.readFile(__dirname + '/streamlabs_apisettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            if (serverConfig.enabled == "on")
                modalstring = modalstring.replace("enabled_streamlabs_api_small_settingschecked", "checked");

            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        destinationChannel,
                        to
                    ),
                    destinationChannel,
                    to
                ));
        }
    });

}
// ============================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ============================================================================
/**
 * schedules the sending of the widget code to squish multiple requests down
 * @param {string} to 
 */
function SendSettingsWidgetLarge (to = "")
{
    clearTimeout(localConfig.settingsLargeSchedulerHandle)
    localConfig.settingsLargeSchedulerHandle = setTimeout(() =>
    {
        SendSettingsWidgetLargeScheduler(to)
    }, localConfig.settingsLargeSchedulerTimeout);
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * @param {String} to channel to send to or "" to broadcast
 */
function SendSettingsWidgetLargeScheduler (to = "")
{
    // read our modal file
    fs.readFile(__dirname + "/streamlabs_apisettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            // replace any of our server config variables'text' names in the file
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }
            modalString = modalString.replace("streamlabs_api_Tokentext", serverCredentials.API_Token);
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        "",
                        to,
                        serverConfig.channel
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: parseSettingsWidgetLargeData
/**
 * parse the received data from a modal submit from the user
 * @param {object} extData // modal data
 */
// ===========================================================================
function parseSettingsWidgetLargeData (extData)
{
    let restartConnection = false;
    // reset to defaults
    if (extData.streamlabs_api_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        //default credentials
        serverCredentials.API_Token = ""
        SaveConfigToServer()
        DeleteCredentialsOnServer()
        disconnectStreamlabs()
        restartConnection = true;
    }
    else
    {
        // update credentials if they have changed
        if (extData.streamlabs_api_Token != serverCredentials.API_Token)
        {
            restartConnection = true;
            serverCredentials.API_Token = extData.streamlabs_api_Token;
            if (serverCredentials.API_Token)
                SaveCredentialToServer("API_Token", serverCredentials.API_Token);
        }

        if (restartConnection)
        {
            // if we have changed some settings that need us to re-log into the server
            if (serverConfig.enableStreamerSongList == "on")
                connectToStreamlabs()
            else
                disconnectStreamlabs()

        }
    }
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall("");
    SendSettingsWidgetLarge("");
    SaveConfigToServer();
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Saves our config to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig
        ));
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
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Delete our credential file from the server
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
//                           FUNCTION: heartBeatCallback
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    let color = "red"
    if (serverConfig.enabled === "on")
        if (localConfig.status.connected)
            color = "green"
        else
            color = "orange"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    connected: localConfig.status.connected,
                    color: color
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: parseStreamlabsMessage
// ============================================================================
/**
 * Parses messages from StreamLabs events
 * @param {object} data 
 */
function parseStreamlabsMessage (data)
{
    let trigger
    // Streamlabs events
    //if (data.type === "donation" && data.for === "streamlabs")
    if (data.type === "donation")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsDonationAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].from;
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.amount = data.message[0].amount;
            trigger.parameters.formatted_amount = data.message[0].formatted_amount;
            outputTrigger(trigger)
        }
    }
    else if (data.type === "loyalty_store_redemption" && data.for === "streamlabs")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsLoyaltyStoreRedemptionReceived")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].from;
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.product = data.message[0].product;
            trigger.parameters.imageHref = data.message[0].imageHref;
            outputTrigger(trigger)
        }
    }
    else if (data.type === "merch" && data.for === "streamlabs")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsMerchAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].from;
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.product = data.message[0].product;
            trigger.parameters.imageHref = data.message[0].imageHref;
            outputTrigger(trigger)
        }
    }
    // Twitch events
    else if (data.type === "follow" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabTwitchFollowAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name;
            outputTrigger(trigger)
        }

    }
    else if (data.type === "subscription" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchSubscriptionAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.gifter = data.message[0].gifter
            trigger.parameters.type = data.type
            trigger.parameters.months = data.message[0].months
            trigger.parameters.message = data.message[0].message
            outputTrigger(trigger)
        }
    }
    else if (data.type === "resub" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchResubAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.months = data.message[0].months
            trigger.parameters.streak_months = data.message[0].streak_months
            trigger.parameters.message = data.message[0].message
            outputTrigger(trigger)
        }
    }
    else if (data.type === "bits" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchBitsAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.amount = data.message[0].amount
            trigger.parameters.message = data.message[0].message
            outputTrigger(trigger)
        }
    }
    else if (data.type == "host" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchHostAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.raiders = data.message[0].raiders
            outputTrigger(trigger)
        }
    }
    else if (data.type == "raid" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchRaidAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.raiders = data.message[0].raiders
            outputTrigger(trigger)
        }
    }
    else if (data.type == "twitchcharitydonation" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchCharityDonationAlert")

        if (trigger)
        {
            trigger.parameters.username = data.message[0].from;
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.amount = data.message[0].amount;
            trigger.parameters.formatted_amount = data.message[0].formattedAmount;
            outputTrigger(trigger)
        }
    }
    else if (data.type == "streamlabscharitydonation" && data.for === "streamlabscharity")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsCharityDonationAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].from;
            trigger.parameters.twitchDisplayName = data.message[0].twitchDisplayName
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.amount = data.message[0].amount;
            trigger.parameters.formatted_amount = data.message[0].formattedAmount;
            trigger.parameters.campaignId = data.message[0].campaignId;
            outputTrigger(trigger)
        }
    }
    else if (data.type == "subMysteryGift" && data.for === "twitch_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsTwitchSubMysteryAlert")
        if (trigger)
        {
            trigger.parameters.gifter = data.message[0].gifter;
            trigger.parameters.amount = data.message[0].amount;
            outputTrigger(trigger)
        }
    }
    // Youtube events
    else if (data.type == "follow" && data.for === "youtube_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsYouTubeSubscriptionAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name;
            outputTrigger(trigger)
        }
    }
    else if (data.type == "subscription" && data.for === "youtube_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsYouTubeMemberAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name;
            trigger.parameters.months = data.message[0].months;
            trigger.parameters.message = data.message[0].message;
            trigger.parameters.subplan = data.message[0].sub_plan;
            outputTrigger(trigger)
        }
    }
    else if (data.type == "superchat" && data.for === "youtube_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsYouTubeSuperchatAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name;
            trigger.parameters.amount = data.message[0].amount;
            trigger.parameters.formatted_amount = data.message[0].displayString;
            trigger.parameters.message = data.message[0].comment;
            outputTrigger(trigger)
        }
    }
    else if (data.type == "streamlabels")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsDataDump")
        if (trigger)
        {
            trigger.parameters.data = data
            outputTrigger(trigger)
        }
    }
    else if (data.type == "streamlabels.underlying")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsDataDumpUnderlying")
        if (trigger)
        {
            trigger.parameters.data = data
            outputTrigger(trigger)
        }
    }
    // Kick events
    else if (data.type === "follow" && data.for === "kick_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsKickFollowAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name;
            outputTrigger(trigger)
        }

    }
    else if (data.type === "subscription" && data.for === "kick_account")
    {
        trigger = triggersandactions.triggers.find(obj => obj.name === "StreamlabsKickSubscriptionAlert")
        if (trigger)
        {
            trigger.parameters.username = data.message[0].name
            trigger.parameters.type = data.type
            trigger.parameters.months = data.message[0].months
            trigger.parameters.message = data.message[0].message
            outputTrigger(trigger)
        }
    }
    else if (data.type === "alertPlaying")
    {
        //console.log("ignoring", data.type, "alert")
    }
    else
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".parseStreamlabsMessage", "no trigger setup yet. TBD. If you see this error please let me know and I'll add the trigger :", data.for, " message type:" + data.type);
        console.log(JSON.stringify(data, null, 2));
    }
}
// ============================================================================
//                           FUNCTION: outputTrigger
// ============================================================================
/**
 * Broadcast trigger on our channel
 * @param {object} data 
 */
function outputTrigger (data)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                data.messagetype,
                serverConfig.extensionname,
                data,
                serverConfig.channel),
            serverConfig.channel
        ),
    );

}
// ============================================================================
//                           EXPORTS: start
// ============================================================================
// Description: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { start, triggersandactions };

