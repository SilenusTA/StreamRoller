// ############################# RANDOMFACT.js ##############################
// Provides random facts and information on request
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 03-April-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
//
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// logger will allow you to log messages in the same format as the system messages
import * as logger from "../../backend/data_center/modules/logger.js";
//var http = require('http');
import https from "https"
// extension helper provides some functions to save you having to write them.
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null
};
const serverConfig = {
    extensionname: "randomfact",
    channel: "RANDOMFACT_CHANNEL"
};

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * initialise
 * @param {Object} app 
 * @param {String} host 
 * @param {String} port 
 */
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
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
    // do something here when disconnt happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Received connect message
// Parameters: socket 
// ----------------------------- notes ----------------------------------------
// When we connect to the StreamRoller server the first time (or if we reconnect)
// we will get this function called.
// it is also a good place to create/join channels we wish to use for data
// monitoring/sending on.
// ===========================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    // not using a channel yet. might add one we want to randomly send out facts later. For now we just receive and respond to
    // direct messages
    //sr_api.sendMessage(localConfig.DataCenterSocket,
    //    sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, config.OUR_CHANNEL)
    //);

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "TWITCH_CHAT")
    );

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
    //logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "message received ", server_packet);

    if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestRandomFact")
        {
            requestRandomFact(extension_packet.from);
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        setTimeout(() =>
        {
            // resent the register command to see if the extension is up and running yet
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);

    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        // first we check which channel the message came in on
        if (server_packet.dest_channel === "TWITCH_CHAT")
        {
            if (extension_packet.type === "HeartBeat")
            {

                // ignore these messages
            }
            else if (extension_packet.type === "ChatMessage")
            {
                process_chat_command(extension_packet.data)
            }
            // do something with the data

        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
        || server_packet.type === "ExtensionMessage"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ============================================================================
//                           FUNCTION: process_stream_alert
// ============================================================================
/**
 * Just a function to log data from the streamlabs api messages
 * @param {String} server_packet 
 */
function process_chat_command (data)
{
    if (data.message === "!randomfact")
    {
        var options = { host: 'uselessfacts.jsph.pl', path: '/random.json?language=en', };
        var req = https.get(options, function (res)
        {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            var bodyChunks = [];
            res.on('data', function (chunk)
            {
                bodyChunks.push(chunk);
            }).on('end', function ()
            {
                var body = Buffer.concat(bodyChunks);
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "ExtensionMessage",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "SendChatMessage",
                            serverConfig.extensionname,
                            JSON.parse(body).text,
                            "",
                            "twitchchat"
                        ),
                        "",
                        "twitchchat"
                    ));

            })
        });
        req.on('error', function (e)
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".requestRandomFact", "Error getting quote", e.message);
        });


    }
}
// ============================================================================
//                           FUNCTION: requestRandomFact
// ============================================================================
/**
 * sends a random fact to the extension
 * @param {String} from 
 */
function requestRandomFact (from)
{
    var body = "";
    var options = { host: 'uselessfacts.jsph.pl', path: '/api/v2/facts/random?language=en', };
    try
    {
        var req = https.get(options, function (res)
        {
            console.log("from:", from);
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            var bodyChunks = [];
            res.on('data', function (chunk)
            {
                bodyChunks.push(chunk);
            }).on('end', function ()
            {

                body = Buffer.concat(bodyChunks);

                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "ExtensionMessage",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "RandomFact",
                            serverConfig.extensionname,
                            JSON.parse(body).text,
                            "",
                            from
                        ),
                        "",
                        from
                    ));
            })
            console.log("body:", body)
        });
        req.on('error', function (e)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".requestRandomFact", "Error getting quote", e.message);
        });
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".requestRandomFact", "Error getting quote", e.message);
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".requestRandomFact", body);
    }

}

// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
