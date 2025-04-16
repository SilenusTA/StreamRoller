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
 * @extension Twitter
 * Connects to twitter allowing sending of tweets. Initial version, needs expanded 
 * functionality adding when I get time or someone requests it :P
 */

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import { dirname } from "path";
import { TwitterClient } from "twitter-api-client";
import { fileURLToPath } from "url";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    twitterClient: null,
    DataCenterSocket: null,
    channelConnectionAttempts: 20,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false // this is our connection indicator for discord
    },
};
let channelConnectionAttempts = 0;
const default_serverConfig = {
    __version__: 0.2,
    extensionname: "twitter",
    channel: "TWITTER_CHANNEL",
    twitterenabled: "off",
};
let serverConfig = structuredClone(default_serverConfig);
let serverCredentials =
{
    twitterAPIkey: "",
    twitterAPISecret: "",
    twitterAccessToken: "",
    TwitterAccessTokenSecret: ""
}
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Send a tweet",
    version: "0.2",
    channel: serverConfig.channel,
    actions:
        [
            {
                name: "TwitterPostTweet",
                displaytitle: "Post a Tweet",
                description: "Post a message to twtter",
                messagetype: "action_PostTweet",
                parameters: {
                    message: ""
                }
            }
        ],
}

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {object:Express} app 
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "host", host, "port", port, "heartbeat", heartbeat);
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket connection failed:", err);
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
    // do something here when disconnt happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Description: Received connect message
// Parameters: socket 
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
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
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            if (serverConfig.twitterenabled == "on")
                connectToTwitter();
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            serverCredentials = structuredClone(server_packet.data);
            // start twitter connection
            if (serverConfig.twitterenabled == "on")
                connectToTwitter();
            SendSettingsWidgetLarge();
            SendSettingsWidgetSmall();
        }
        else
        {
            if (serverConfig.twitterenabled == "on")
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                    serverConfig.extensionname + " CredentialsFile", "Credential file is empty. Add your details in main settings page to use twitch..");
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            let restart = false;
            // check that it was our modal
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                if (serverConfig.twitterenabled != extension_packet.data.twitterenabled)
                    restart = true;
                serverConfig.twitterenabled = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
                if (restart)
                    connectToTwitter()
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLargeData(extension_packet.data)
        }
        else if (extension_packet.type === "action_PostTweet")
        {
            // check this was sent to us 
            if (extension_packet.to === serverConfig.extensionname)
                if (serverConfig.twitterenabled != "off")
                    tweetmessage(extension_packet.data.message)
                else
                    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "tweeting disabled : ");
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
        if (channelConnectionAttempts++ < localConfig.channelConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", serverConfig.extensionname, server_packet.data
                    ));
            }, 5000);
        }
    }
    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
        logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    else if (server_packet.type === "InvalidMessage")
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Connects to the twitter API
 */
function connectToTwitter ()
{
    try
    {
        if (serverConfig.twitterenabled == "on" && serverCredentials.twitterAPIkey != "")
        {
            localConfig.twitterClient = new TwitterClient({
                apiKey: serverCredentials.twitterAPIkey,
                apiSecret: serverCredentials.twitterAPISecret,
                accessToken: serverCredentials.twitterAccessToken,
                accessTokenSecret: serverCredentials.TwitterAccessTokenSecret
            })
            localConfig.status.connected = true;
        }
        else
        {
            localConfig.twitterClient = null;
            localConfig.status.connected = false;
        }

    }
    catch (e)
    {
        localConfig.status.connected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "twitter connection failed:", e.message);
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
    fs.readFile(__dirname + "/twittersettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        to,
                        serverConfig.channel,
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
 * @param {String} to channel to send to or "" to broadcast
 */
function SendSettingsWidgetLarge (to = "")
{
    // read our modal file
    fs.readFile(__dirname + "/twittersettingswidgetlarge.html", function (err, filedata)
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
            modalString = modalString.replace("twitterAPIkeytext", serverCredentials.twitterAPIkey);
            modalString = modalString.replace("twitterAPISecrettext", serverCredentials.twitterAPISecret);
            modalString = modalString.replace("twitterAccessTokentext", serverCredentials.twitterAccessToken);
            modalString = modalString.replace("TwitterAccessTokenSecrettext", serverCredentials.TwitterAccessTokenSecret);

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
    if (extData.twitter_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        //default credentials
        serverCredentials.twitterAPIkey = "";
        serverCredentials.twitterAPISecret = "";
        serverCredentials.twitterAccessToken = "";
        serverCredentials.TwitterAccessTokenSecret = "";
        SaveConfigToServer();
        DeleteCredentialsOnServer();
        serverConfig.twitterenabled = "off"
        restartConnection = true;
    }
    else
    {
        // update credentials if they have changed
        if (extData.twitterAPIkey != serverCredentials.twitterAPIkey)
        {
            restartConnection = true;
            serverCredentials.twitterAPIkey = extData.twitterAPIkey;
            if (serverCredentials.twitterAPIkey)
                SaveCredentialToServer("twitterAPIkey", serverCredentials.twitterAPIkey);
        }

        if (extData.twitterAPISecret != serverCredentials.twitterAPISecret)
        {
            restartConnection = true;
            serverCredentials.twitterAPISecret = extData.twitterAPISecret;
            if (serverCredentials.twitterAPISecret)
                SaveCredentialToServer("twitterAPISecret", serverCredentials.twitterAPISecret);
        }

        if (extData.twitterAccessToken != serverCredentials.twitterAccessToken)
        {
            restartConnection = true;
            serverCredentials.twitterAccessToken = extData.twitterAccessToken;
            if (serverCredentials.twitterAccessToken)
                SaveCredentialToServer("twitterAccessToken", serverCredentials.twitterAccessToken);
        }

        if (extData.TwitterAccessTokenSecret != serverCredentials.TwitterAccessTokenSecret)
        {
            restartConnection = true;
            serverCredentials.TwitterAccessTokenSecret = extData.TwitterAccessTokenSecret;
            if (serverCredentials.TwitterAccessTokenSecret)
                SaveCredentialToServer("TwitterAccessTokenSecret", serverCredentials.TwitterAccessTokenSecret);
        }

    }
    if (restartConnection)
    {
        // if we have changed some settings that need us to re-log into the server
        if (serverConfig.twitterenabled == "on")
            connectToTwitter()
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
//                           Twitter client code
// ============================================================================
/**
 * tweet a message
 * @param {String} message 
 */
function tweetmessage (message)
{
    try
    {
        localConfig.twitterClient.tweetsV2.createTweet({ "text": message })
            .then(response =>
            {
                logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".tweetmessage", "Tweet sent ", message);
            }).catch(err =>
            {
                localConfig.status.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".tweetmessage", "Failed to tweet message ... ", err.name, err.message);
            })

    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".tweetmessage", "Failed ... ", e);
    }
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    let status = false;
    if (serverConfig.twitterenabled == "on" && localConfig.status.connected)
        status = true;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: status },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

