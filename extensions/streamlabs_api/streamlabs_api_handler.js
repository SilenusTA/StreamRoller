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
// ######################### streamlabs_api_handler.js ################################
// Handles the connection to streamlabs api and puts the messages into the
// twitch alerts channel on the back end
// -------------------------- Creation ----------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// 
// --------------------------- description -------------------------------------
// 
// ----------------------------- notes ----------------------------------------
// TBD. 
// ============================================================================


// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// We have to iport two versions of socket.io due to streamlabs using an older
// version.
// ============================================================================
// note this has to be socket.io-client version 2.0.3 to allow support for Streamlabs api.
import StreamlabsIo from "socket.io-client_2.0.3";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs"
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let localConfig = {
    ENABLE_STREAMLABS_CONNECTION: true, // disables the socket to streamlabs (testing purposes only)
    OUR_CHANNEL: "STREAMLABS_ALERT",
    EXTENSION_NAME: "streamlabs_api",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false // this is our connection indicator for discord
    },
    DataCenterSocket: null,
    StreamlabsSocket: null
};

const default_serverConfig = {
    __version__: 0.2,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabled: "off",
    //credentials variable names to use (in credentials modal)
    credentialscount: "1",
    cred1name: "SL_SOCKET_TOKEN",
    cred1value: "",
};
let serverConfig = structuredClone(default_serverConfig)


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
                name: "StreamlabsTwitchSubMysteryAlert",
                displaytitle: "SubMystery gift on Twitch",
                description: "Someone figted some subs on your Twitch stream",
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
                description: "Stream labs data dump, ie subs/month, top10 donaters etc etc",
                messagetype: "trigger_StreamlabsDataDump",
                parameters: {
                    data: ""
                }
            },
            {
                name: "StreamlabsDataDumpUnderlying",
                displaytitle: "StreamLabs Underlying data dump",
                description: "Stream labs Underlying data dump, ie subs/month, top10 donaters etc etc",
                messagetype: "trigger_StreamlabsDataDumpUnderlying",
                parameters: {
                    data: ""
                }
            }
        ],
    // these are messages we can receive to perform an action
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
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
// ============================================================================
//                           FUNCTION: connectToStreamlabs
// ============================================================================
function connectToStreamlabs (creds)
{
    // ########################## SETUP STREAMLABS CONNECTION ###############################
    // The token can be found at streamlabs.com, its a long hex string under settings->API Tokens->socket API token 
    if (!creds.SL_SOCKET_TOKEN)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.js", "SL_SOCKET_TOKEN not set");
    else
    {
        try
        {
            if (localConfig.ENABLE_STREAMLABS_CONNECTION)
            {
                localConfig.StreamlabsSocket = StreamlabsIo("https://sockets.streamlabs.com:443?token=" + creds.SL_SOCKET_TOKEN, { transports: ["websocket"] });
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
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "connectToStreamlabs", "clientio connection failed:", err);
            throw ("streamlabs_api_handler.js failed to connect to streamlabs");
        }
    }
}
// ########################## STREAMLABS API CONNECTION #######################
// ============================================================================
//                           FUNCTION: onStreamlabsDisconnect
// ============================================================================
function onStreamlabsDisconnect (reason)
{
    localConfig.status.connected = false;
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamlabsDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onStreamlabsConnect
// ============================================================================
// Desription: Handles Connect message from the streamlabs api
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onStreamlabsConnect ()
{
    localConfig.status.connected = true;
    // start our heatbeat timer
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamlabsConnect", "streamlabs api socket connected");
}

// ============================================================================
//                           FUNCTION: onStreamlabsEvent
// ============================================================================
// Desription: Handles messaged from the streamlabs api
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onStreamlabsEvent (data)
{
    logger.info(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamlabsEvent", "received message: ", data);
    // Send this data to the channel for this
    if (serverConfig.enabled === "on")
    {
        // old depreciated system. Will be removed once I update my overlay to use the new trigger system
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                data,
                localConfig.OUR_CHANNEL
            ));
        // send alerts using trigger system
        parseTriggers(data)
    }
}
// ########################## DATACENTER CONNECTION #######################
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
// Desription: Handles Disconnect message from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Handles Connect message from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterConnect ()
{
    //store our Id for futre reference
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterConnect", "Creating our channel");
    //register our channels
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL));
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", localConfig.EXTENSION_NAME));
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
// Desription: Handles messages from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {

        // check it is our config
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
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
            connectToStreamlabs(server_packet.data);
        else
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty make sure to set it on the admin page.");
        }

    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // received a reqest for our admin bootstrap modal code
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        // received data from our settings widget small. A user has requested some settings be changedd
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // lets reset our config checkbox settings (modal will omit ones not checked)
                serverConfig.enabled = "off";
                // set our config values to the ones in message
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in extension_packet.data)
                        serverConfig[key] = extension_packet.data[key];
                // save our data to the server for next time we run
                SaveConfigToServer();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
            }
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
        else
        {
            //logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
        }
    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage",
            "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        //channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        if (server_packet.data === serverConfig.channel)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("CreateChannel",
                        localConfig.EXTENSION_NAME,
                        server_packet.data));
            }, 5000);
        }
        else
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("JoinChannel",
                        localConfig.EXTENSION_NAME,
                        server_packet.data));
            }, 5000);
        }
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
        || server_packet.type === "ChannelData")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ============================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ============================================================================
// Desription: Send the modal code back after setting the defaults according 
// to our server settings
// Parameters: channel to send data to
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SendSettingsWidgetSmall (toextension)
{
    fs.readFile(__dirname + '/streamlabs_apisettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
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
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toextension
                    ),
                    "",
                    toextension
                ));
        }
    });

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

    fs.readFile(__dirname + "/streamlabs_apicredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                {
                    modalstring = modalstring.replace(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                {
                    modalstring = modalstring.replace(key + "text", value);
                }
            }
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
// Desription:save config on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig
        ));
}

// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let connected = localConfig.status.connected
    if (serverConfig.enabled === "off")
        connected = false;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: connected },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: parseTriggers
// ============================================================================
//logger.file_log("./", "streamlabstest", data)
function parseTriggers (data)
{
    let trigger
    // Streamlabs events
    if (data.type === "donation" && data.for === "streamlabs")
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
            trigger.parameters.type = data.message[0].type
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
            trigger.parameters.username = data.message.from;
            trigger.parameters.message = data.message.message;
            trigger.parameters.amount = data.message.amount;
            trigger.parameters.formatted_amount = data.message.formatted_amount;
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
    else
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".parseTriggers", "no tigger setup for streamlabs message type", data.type);
    }
}
// ============================================================================
//                           FUNCTION: outputTrigger
// ============================================================================
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
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { start };
