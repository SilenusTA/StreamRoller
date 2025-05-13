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
import * as logger from "../../backend/data_center/modules/logger.js";
import * as fs from "fs";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import socketIo from "socket.io-client_2.2.0";

// debugging
//import { file_log } from './filelog.js'
function debug_file_log (message, data)
{
    //file_log(message, data)
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    StreamElementsSocket: null,
    channelId: -1,
    heartBeatTimeout: 5000,
    SEAddress: "https://realtime.streamelements.com",
    SEPort: "3333",
    heartBeatHandle: null,
    startupCheckTimer: 500,
    readinessFlags: {
        ConfigReceived: false,
        CredentialsReceived: false,
    },
    connected: false,
    SEStartupCalled: false,
};

const default_serverConfig = {
    __version__: "0.1",
    extensionname: "streamelements",
    channel: "STREAMELEMENTS",
    streamElementsEnabled: "off",
    streamelements_restore_defaults: "off"
};
let serverConfig = structuredClone(default_serverConfig)

const default_serverCredentials =
{
    ExtensionName: 'streamelements',
    StreamerJWTToken: "",
    BotJWTToken: ""
};
let serverCredentials = structuredClone(default_serverCredentials);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Stream Elements API for receiving alerts etc",
    version: "0.3",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "StreamElementsFollow",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone followed",
                displaytitle_UIDescription: "Someone followed",
                description: "Someone followed on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsFollow",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    timestamp: "",
                    timestamp_UIDescription: "Time of cheer(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user followed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsCheer",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone Cheered",
                displaytitle_UIDescription: "Someone Cheered",
                description: "Someone Cheered on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsCheer",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Amount cheered",
                    message: 0,
                    message_UIDescription: "Cheer message",
                    timestamp: "",
                    timestamp_UIDescription: "Time of cheer(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Cheer on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsRaid",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone Raided",
                displaytitle_UIDescription: "Someone Raided",
                description: "Someone Raided on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsRaid",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    message: "",
                    message_UIDescription: "Message if passed or empty",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Amount Number of raiders",
                    timestamp: "",
                    timestamp_UIDescription: "Time of cheer(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Raided on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsSubscription",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone Subscribed",
                displaytitle_UIDescription: "Someone Subscribed",
                description: "Someone Subscribed on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsSubscription",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    message: "",
                    message_UIDescription: "Message if passed or empty",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Months Subscribed for",
                    gifted: false,
                    gifted_UIDescription: "Was this a gifted sub.",
                    gifter: false,
                    gifter_UIDescription: "User who gifted the sub.",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Subscription(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Subscribed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsCommunityGiftPurchase",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone gifted subs",
                displaytitle_UIDescription: "Someone gifted subs",
                description: "Someone gifted subs on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsCommunityGiftPurchase",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Number of gifted Subs",
                    timestamp: "",
                    timestamp_UIDescription: "Time of gift(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Gifted on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsTip",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone Tip'd",
                displaytitle_UIDescription: "Someone Tip'd",
                description: "Someone Tip'd on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsTip",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    message: "",
                    message_UIDescription: "Message if passed or empty",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Tip amount",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Tip(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Subscribed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsRedemption",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone Redeemed Something",
                displaytitle_UIDescription: "Someone Redeemed",
                description: "Someone Redeemed on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsRedemption",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Redeemed amount",
                    providerId: 0,
                    providerId_UIDescription: "Provider ID",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Redemption(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Redeemed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsChannelPointsRedemption",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone used Channel Points",
                displaytitle_UIDescription: "Channel Points Redeemed",
                description: "Someone Redeemed Channel Points on the platform specified",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsChannelPointsRedemption",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Redeemed amount",
                    quantity: 0,
                    quantity_UIDescription: "Redeemed quantity",
                    redemption: "",
                    redemption_UIDescription: "Redemption Name",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Redemption(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Redeemed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "StreamElementsMerch",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone purchased something",
                displaytitle_UIDescription: "Someone purchased something",
                description: "Someone purchased something on the platform specified, items will contain the 'name price quantity' for that item. Multiple item purchase will have a trigger for each item even if brought in one purchase",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsMerch",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    item: "",
                    item_UIDescription: "Item purchased",
                    totalAmount: 0,
                    totalAmount_UIDescription: "Total Value of items purchased in sale (might be multiple items so multiple triggers for each item)",
                    providerId: 0,
                    providerId_UIDescription: "Id of the provider of the Merch",
                    activityId: 0,
                    activityId_UIDescription: "Id of the activity for this purchase",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Merch(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the message came in on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "charityDonation",
                name_UIDescription: "Stream Elements API for alerts etc",
                displaytitle: "Someone donated to your charity Campaign",
                displaytitle_UIDescription: "Charity Campaign Donation",
                description: "Charity Campaign Donation",
                description_UIDescription: "",
                messagetype: "trigger_StreamElementsCharityDonation",
                messagetype_UIDescription: "",
                parameters: {
                    user: "",
                    user_UIDescription: "the users login name",
                    userDisplayName: "",
                    userDisplayName_UIDescription: "The display name of the user",
                    message: "",
                    message_UIDescription: "Message if passed or empty",
                    avatar: "",
                    avatar_UIDescription: "Users avatar",
                    amount: 0,
                    amount_UIDescription: "Tip amount",
                    providerId: 0,
                    providerId_UIDescription: "Id of the provider of the charity campaign",
                    timestamp: "",
                    timestamp_UIDescription: "Time of Tip(ie 2025-05-12T00:01:13.345Z)",
                    platform: "StreamElements",
                    platform_UIDescription: "Platform the user Subscribed on",
                    triggerActionRef: "StreamElements",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }
        ],
    actions:
        [],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension
 * @param {string} app 
 * @param {string} host 
 * @param {string} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.heartBeatTimeout = heartbeat;
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
        startupCheck();
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
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
        if (server_packet.data != "" && server_packet.data.extensionname === serverConfig.extensionname)
        {
            if (server_packet.data && server_packet.data.extensionname)
            {
                let connectionChanged
                let configSubVersions = 0;
                let defaultSubVersions = default_serverConfig.__version__.split('.');
                if (!server_packet.data.__version__)
                {
                    serverConfig = structuredClone(default_serverConfig);
                    SaveConfigToServer();
                }
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
                    if (serverConfig.streamElementsEnabled != server_packet.data.streamElementsEnabled)
                    {
                        if (server_packet.data.streamElementsEnabled == "on")
                        {
                            connectionChanged = true;
                            if (!localConfig.connected)
                                connectToSE()
                        }
                        else if (server_packet.data.streamElementsEnabled == "off")
                            disconnectFromSE();

                        serverConfig = structuredClone(server_packet.data);
                        SaveConfigToServer();
                    }

                    if (connectionChanged)
                        SendSettingsWidgetSmall();
                    SendSettingsWidgetLarge();
                }
            }
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            localConfig.readinessFlags.CredentialsReceived = true;
            // we have a saved credentials file
            if (server_packet.data != "")
            {
                serverCredentials = structuredClone(server_packet.data);
                SendSettingsWidgetSmall();
                SendSettingsWidgetLarge();
            }
            else
                serverCredentials = structuredClone(default_serverCredentials);
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(server_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                if (extension_packet.data.streamelements_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                    disconnectFromSE();
                }
                else
                {
                    if (serverConfig.streamElementsEnabled == "on"
                        && !extension_packet.data.streamElementsEnabled)
                    {
                        serverConfig.streamElementsEnabled = "off";
                        disconnectFromSE();
                    }
                    else if (serverConfig.streamElementsEnabled == "off"
                        && extension_packet.data.streamElementsEnabled == "on")
                    {
                        serverConfig.streamElementsEnabled = "on"
                        connectToSE();
                    }

                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;
                }
                SaveConfigToServer();
                SendSettingsWidgetSmall(server_packet.from);
            }
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
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * @param {String} [to = ""] 
 * @param {String} [reference = ""] 
 */
function SendSettingsWidgetLarge (to = "", reference = "StreamElements")
{
    fs.readFile(__dirname + '/streamelementsettingswidgetlarge.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
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
            modalString = modalString.replace("StreamerJWTTokentext", serverCredentials.StreamerJWTToken);
            //TBD
            modalString = modalString.replace("BotJWTTokentext", serverCredentials.BotJWTToken);

            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode",
                        serverConfig.extensionname,
                        modalString,
                        serverConfig.channel,
                        to,
                    ),
                    serverConfig.channel,
                    to
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetLarge
// ============================================================================
/**
 * @param {object} data // data from user submitted form
 * @param {String} [reference = ""] 
 */
function parseSettingsWidgetLarge (data, reference = "StreamElements")
{
    try
    {
        if (data.streamelements_restore_defaults == "on")
        {
            serverConfig = structuredClone(default_serverConfig);
            DeleteCredentialsOnServer();
            console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
        }
        else
        {
            let credentialsChanged = false;
            for (const [key, value] of Object.entries(data))
                if (serverConfig[key])
                    serverConfig[key] = value;
            // if we have changed the client ID lets set that
            if (serverCredentials.StreamerJWTToken != data.StreamerJWTToken)
            {
                serverCredentials.StreamerJWTToken = data.StreamerJWTToken;
                credentialsChanged = true;
            }
            if (credentialsChanged)
                SaveCredentialsToServer("parseSettingsWidgetLarge")
        }

        SaveConfigToServer();
        SendSettingsWidgetLarge("");

    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".parseSettingsWidgetLarge", "Error parsing data:", err, err.message);
        return null
    }
}
// ============================================================================
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * @param {String} [reference = ""] 
 */
function DeleteCredentialsOnServer (reference = "StreamElements")
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
//                           FUNCTION: SaveCredentialsToServer
// ============================================================================
/**
 * Sends Credential to the server to be saved
 * @param {String} [reference = ""] 
 */
function SaveCredentialsToServer (reference = "StreamElements")
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            serverConfig.extensionname,
            {
                data: serverCredentials
            },
        ));
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 *
 * @param {String} to 
 */
function SendSettingsWidgetSmall (to = "")
{

    fs.readFile(__dirname + '/streamelementssettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
                        serverConfig.channel,
                        to,
                    ),
                    serverConfig.channel,
                    to
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Provides a heartbeat message to inform other extensions of our status
 */
function heartBeatCallback ()
{
    let color = "red";
    if (serverConfig.streamElementsEnabled === "on")
    {

        if (!localConfig.connected)
            color = "orange"
        else
            color = "green"
    }
    else
        color = "red"
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    color: color
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: disconnectFromSE
// ============================================================================
function disconnectFromSE ()
{
    localConfig.StreamElementsSocket.disconnect()
    localConfig.StreamElementsSocket.destroy()
    localConfig.connected = false;
}
// ============================================================================
//                           FUNCTION: connectToSE
// ============================================================================
function connectToSE ()
{
    if (serverConfig.streamElementsEnabled == "off")
    {
        localConfig.readinessFlags.SEStartup = true;
        return;
    }
    // Future dev note.
    // StreamElements provides both a websocket and socket connection.
    // documentation isn't clear on the differences in what they provide.
    // 1) astro pub/sub websocket (https://docs.streamelements.com/websockets)
    // 2) This one (https://dev.streamelements.com/docs/api-docs/ae133ffaf8c1a-personal-access-using-jwt-secert-token-to-access-the-api)

    // it seems 2 is for personal channel use and 1 is for multi channel use from what I can tell
    // for us it seems 2 is a simpler option for login (JWT token needed rather than Oauth making it easier
    // for the users to authenticate.)
    localConfig.StreamElementsSocket = socketIo(localConfig.SEAddress, {
        transports: ['websocket']
    });
    localConfig.StreamElementsSocket.on('error', (error) =>
    {
        localConfig.connected = false;
        console.log("socket error", error)
    });
    localConfig.StreamElementsSocket.on('connect', onSEConnect);
    localConfig.StreamElementsSocket.on('disconnect', onSEDisconnect);
    localConfig.StreamElementsSocket.on('authenticated', onSEAuthenticated);
    localConfig.StreamElementsSocket.on('unauthorized', onSEUnauthorized);
    localConfig.StreamElementsSocket.on('event:test', onSETestEvent);
    localConfig.StreamElementsSocket.on('event', onSEEvent)
    localConfig.StreamElementsSocket.on('event:update', onSEEventUpdate);
    localConfig.StreamElementsSocket.on('event:reset', onSEEventReset);
}
// ============================================================================
//                           FUNCTION: onSEConnect
// ============================================================================
function onSEConnect ()
{
    localConfig.StreamElementsSocket.emit('authenticate', { method: 'jwt', token: serverCredentials.StreamerJWTToken });
}
// ============================================================================
//                           FUNCTION: onSEDisconnect
// ============================================================================
function onSEDisconnect (reason)
{
    localConfig.connected = false;
    console.log('StreamElements Disconnected from websocket reason:', reason);
    // Reconnect
}
// ============================================================================
//                           FUNCTION: onSEUnauthorized
// ============================================================================
function onSEUnauthorized ()
{
    localConfig.connected = false;
    console.log('StreamElements Unauthorized');
    // Unauthorized
}
// ============================================================================
//                           FUNCTION: onSEAuthenticated
// ============================================================================
function onSEAuthenticated (data)
{
    localConfig.connected = true;
    const { channelId } = data;
    localConfig.channelId = channelId;
}
// ============================================================================
//                           FUNCTION: onSETestEvent
// ============================================================================
function onSETestEvent (data)
{
    debug_file_log("onSETestEvent:Unhandled Event", data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master
}
// ============================================================================
//                           FUNCTION: onSEEvent
// ============================================================================
function onSEEvent (data)
{

    if (data.type == "follow")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsFollow")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        postTrigger(tr);
    }
    else if (data.type == "cheer")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsCheer")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.message = data.data.message;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        postTrigger(tr);
    }
    else if (data.type == "raid")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsRaid")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        if (data.data.message)
            tr.parameters.message = data.data.message;
        postTrigger(tr);
    }
    else if (data.type == "subscriber")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsSubscription")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        if (data.data.message)
            tr.parameters.message = data.data.message;
        if (data.data.gifted)
        {
            tr.parameters.gifted = data.data.gifted;
            tr.parameters.gifter = data.data.sender;
        }
        postTrigger(tr);
    }
    else if (data.type == "communityGiftPurchase")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsCommunityGiftPurchase")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        postTrigger(tr);
    }
    else if (data.type == "tip")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsTip")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        if (data.data.message)
            tr.parameters.message = data.data.message;
        postTrigger(tr);
    }
    else if (data.type == "redemption")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsRedemption")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        tr.parameters.providerId = data.data.providerId;
        postTrigger(tr);
    }
    else if (data.type == "channelPointsRedemption")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsChannelPointsRedemption")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        tr.parameters.redemption = data.data.redemption;
        tr.parameters.quantity = data.data.quantity;
        postTrigger(tr);
    }
    else if (data.type == "merch")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsMerch")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.totalAmount = data.data.amount
        tr.parameters.providerId = data.data.providerId;
        tr.parameters.activityId = data.activityId;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        let start = true;
        data.data.items.forEach(ele =>
        {
            for (var key in ele)
            {
                if (start)
                {
                    start = false;
                    tr.parameters.item = ""
                }
                else
                    tr.parameters.item += " "
                tr.parameters.item += `${ele[key]}`
            }
            postTrigger(tr);
            start = true;
        });
    }
    else if (data.type == "charityCampaignDonation")
    {
        let tr = findTriggerByMessageType("trigger_StreamElementsCharityDonation")
        tr.parameters.user = data.data.username;
        tr.parameters.userDisplayName = data.data.displayName;
        tr.parameters.avatar = data.data.avatar;
        tr.parameters.amount = data.data.amount;
        tr.parameters.providerId = data.data.providerId;
        tr.parameters.timestamp = data.createdAt;
        tr.parameters.platform = data.provider;
        if (data.data.message)
            tr.parameters.message = data.data.message;
        postTrigger(tr);
    }
    else
        debug_file_log("onSEEvent:Unhandled Event", data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master
}
// ============================================================================
//                           FUNCTION: onSEEventUpdate
// ============================================================================
function onSEEventUpdate (data)
{
    debug_file_log("onSEEventUpdate:Unhandled Event", data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master
}
// ============================================================================
//                           FUNCTION: onSEEventReset
// ============================================================================
function onSEEventReset (data)
{
    debug_file_log("onSEEventReset:Unhandled Event", data);
    // Structure as on https://github.com/StreamElements/widgets/blob/master
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * waits for config and credentials files to set ready flag
 */

function startupCheck ()
{
    // if we have received out config and credentials start the server if needed
    if (localConfig.readinessFlags.ConfigReceived
        && localConfig.readinessFlags.CredentialsReceived
        && !localConfig.SEStartupCalled)
    {
        localConfig.SEStartupCalled = true;
        connectToSE();
    }
    // are we ready to start receiving messages from other extensions
    const allReady = Object.values(localConfig.readinessFlags).every(flag => flag);
    if (allReady)
    {
        localConfig.ready = true;
        try
        {
            postStartupActions();
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", "connectToSE Error:", err);
        }
    }
    else
        setTimeout(startupCheck, localConfig.startupCheckTimer);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * At this point we should have any config/credentials loaded
 */
function postStartupActions ()
{
    // Let the server know we are now up and running.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionReady", serverConfig.extensionname));

}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds a trigger from the messagetype
 * @param {string} messagetype 
 * @param {String} [reference = ""] 
 * @returns {object} trigger
 */
function findTriggerByMessageType (messagetype, reference = "Kick")
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return structuredClone(triggersandactions.triggers[i]);
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
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

