// ############################# TWITTER.js ##############################
// Allows posting and reading twitter
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 01-March-2022

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import { TwitterClient } from 'twitter-api-client';
import * as logger from "../../../backend/data_center/modules/logger.js";
import * as sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "TWITTER_CHANNEL",
    EXTENSION_NAME: "twitter",
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
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    twitterenabled: "on"
};
const OverwriteDataCenterConfig = false;

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * 
 * @param {Object} app 
 * @param {String} host 
 * @param {String} port 
 */
function initialise(app, host, port, heartbeat)
{
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
    try
    {
        localConfig.twitterClient = new TwitterClient({
            apiKey: process.env.twitterAPIkey,
            apiSecret: process.env.twitterAPISecret,
            accessToken: process.env.twitterAccessToken,
            accessTokenSecret: process.env.TwitterAccessTokenSecret
        });
        localConfig.status.connected = true;
    }
    catch (e)
    {
        localConfig.status.connected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "twitter connection failed:", e.message);
    }

}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * @param {String} reason 
 */
function onDataCenterDisconnect(reason)
{
    // do something here when disconnt happens if you want to handle them
    logger.log(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Received connect message
// Parameters: socket 
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect(socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    else
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} decoded_data 
 */
function onDataCenterMessage(decoded_data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "message received ", decoded_data);

    if (decoded_data.type === "ConfigFile")
    {
        if (decoded_data.data != "" && decoded_data.to === serverConfig.extensionname)
        {
            for (const [key, value] of Object.entries(serverConfig))
                if (key in decoded_data.data)
                    serverConfig[key] = decoded_data.data[key];

            SaveConfigToServer();

        }
    }
    else if (decoded_data.type === "ExtensionMessage")
    {
        let decoded_packet = JSON.parse(decoded_data.data);
        if (decoded_packet.type === "RequestAdminModalCode")
            SendAdminModal(decoded_packet.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            // check that it was our modal
            if (decoded_packet.data.extensionname === serverConfig.extensionname)
            {
                serverConfig.twitterenabled = "off";
                for (const [key, value] of Object.entries(decoded_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
            }
        }
        else if (decoded_packet.type === "PostTweet")
        {
            // check this was sent to us 
            if (decoded_packet.to === serverConfig.extensionname)
                if (serverConfig.twitterenabled != "off")
                    tweetmessage(decoded_packet.data)
                else
                    console.log("tweeting disabled ", decoded_packet.data)
        } else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverlocalConfig.extensionname + ".onDataCenterMessage",
                "received Unhandled ExtensionMessage : ", decoded_data);
    }
    else if (decoded_data.type === "UnknownChannel")
    {
        if (streamlabsChannelConnectionAttempts++ < localConfig.channelConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", serverConfig.extensionname, decoded_data.data
                    ));
            }, 5000);
        }
    }
    // we have received data from a channel we are listening to
    else if (decoded_data.type === "ChannelData")
        logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", decoded_data.dest_channel);
    else if (decoded_data.type === "InvalidMessage")
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", decoded_data.data.error, decoded_data);
    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel"
        || decoded_data.type === "ExtensionMessage"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.type);
}


// ===========================================================================
//                           FUNCTION: SendAdminModal
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendAdminModal(tochannel)
{
    // read our modal file
    fs.readFile(__dirname + '/twitteradminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
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
                        "AdminModalCode", // message type
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
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function SaveConfigToServer()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}

// ============================================================================
//                           Twitter client code
// ============================================================================
/**
 * tweet a message
 * @param {String} message 
 */
function tweetmessage(message)
{
    serverConfig.twitterClient.tweetsV2.createTweet({ "text": message })
        .then(response =>
        {
            console.log("Tweeted!", response)
        }).catch(err =>
        {
            localConfig.status.connected = false;
            console.error(err)
        })
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback()
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
export { initialise };
