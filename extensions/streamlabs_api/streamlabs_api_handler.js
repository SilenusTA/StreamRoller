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
// note this has to be socket.io-client version 2.0.3 to allow support for StreamLabs api.
import StreamLabsIo from "socket.io-client_2.0.3";
import * as logger from "../../backend/data_center/modules/logger.js";
import { config } from "./config.js";
import * as sr_api from "../../backend/data_center/public/streamroller-message-api.cjs"
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
let serverConfig = {
    extensionname: config.EXTENSION_NAME,
    channel: config.OUR_CHANNEL,
    enabled: "off"
};

// declare our stream references
let StreamLabsSocket = null;
let DataCenterSocket = null;

// ============================================================================
//                           FUNCTION: start
// ============================================================================
function start(host, port)
{
    // ########################## SETUP STREAMLABS CONNECTION ###############################
    /* add the stream token that your streamlabs chatbot uses here if not using the external file above. 
This can be found at streamlabs.com, its a long hex string under settings->API Tokens->socket API token */
    const SL_SOCKET_TOKEN = process.env.SL_SOCKET_TOKEN;
    if (!process.env.SL_SOCKET_TOKEN)
        logger.warn(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.js", "SL_SOCKET_TOKEN not set in environment variable");

    else
    {
        try
        {
            StreamLabsSocket = StreamLabsIo("https://sockets.streamlabs.com:443?token=" + SL_SOCKET_TOKEN, { transports: ["websocket"] });
            // handlers
            StreamLabsSocket.on("connect", (data) => onStreamLabsConnect(data));
            StreamLabsSocket.on("disconnect", (reason) => onStreamLabsDisconnect(reason));
            StreamLabsSocket.on("event", (data) => onStreamLabsEvent(DataCenterSocket, data));
        } catch (err)
        {
            logger.err(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "clientio connection failed:", err);
            throw ("streamlabs_api_handler.js failed to connect to streamlabs");
        }
    }
    // ########################## SETUP DATACENTER CONNECTION ###############################
    try
    {
        //use the helper to setup and register our callbacks
        DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "DataCenterSocket connection failed:", err);
        throw ("streamlabs_api_handler.js failed to connect to data socket");
    }
}
// ########################## STREAMLABS API CONNECTION #######################
// ============================================================================
//                           FUNCTION: onStreamLabsDisconnect
// ============================================================================
function onStreamLabsDisconnect(reason)
{
    logger.log(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onStreamLabsConnect
// ============================================================================
// Desription: Handles Connect message from the streamlabs api
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onStreamLabsConnect()
{

    logger.log(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsConnect", "streamlabs api socket connected");
}
// ============================================================================
//                           FUNCTION: onStreamLabsEvent
// ============================================================================
// Desription: Handles messaged from the streamlabs api
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onStreamLabsEvent(DataCenterSocket, data)
{
    logger.info(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsEvent", "received message: ", data);
    // Send this data to the channel for this
    if (serverConfig.enabled === "on")
        sr_api.sendMessage(DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                config.EXTENSION_NAME,
                data,
                config.OUR_CHANNEL
            ));
    else
        logger.err(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsEvent", "serverConfig is set to off");
}
// ########################## DATACENTER CONNECTION #######################
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
// Desription: Handles Disconnect message from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterDisconnect(reason)
{
    logger.log(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Handles Connect message from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterConnect(socket)
{
    //store our Id for futre reference
    logger.log(config.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterConnect", "Creating our channel");
    //register our channels
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket(
            "CreateChannel",
            config.EXTENSION_NAME,
            config.OUR_CHANNEL
        ));

    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket(
            "RequestConfig",
            config.EXTENSION_NAME
        ));
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Desription: Handles messages from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterMessage(data)
{
    var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        //save our data if the server has no data
        if (decoded_data.data != "")
            // check it is our config
            if (decoded_data.to === serverConfig.extensionname)
            {
                // we could just assign the values here (ie serverConfig = decoded_packet.message_contents)
                // but if we change/remove an item it would never get removed from the store
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_data.data)
                    {
                        serverConfig[key] = decoded_data.data[key];
                    }
            }
        SaveConfigToServer();
    }
    else if (decoded_data.type === "ExtensionMessage")
    {
        let decoded_packet = JSON.parse(decoded_data.data);
        // received a reqest for our admin bootstrap modal code
        if (decoded_packet.type === "RequestAdminModalCode")
            SendModal(decoded_packet.from);
        // received data from our admin modal. A user has requested some settings be changedd
        else if (decoded_packet.type === "AdminModalData")
        {
            if (decoded_packet.to === serverConfig.extensionname)
            {
                // lets reset our config checkbox settings (modal will omit ones not checked)
                serverConfig.enabled = "off";
                // set our config values to the ones in message
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_packet.data)
                        serverConfig[key] = decoded_packet.data[key];
                // save our data to the server for next time we run
                SaveConfigToServer();
                // currently we have the same data as sent so no need to update the server page at the moment
                // SendModal(decoded_data.channel);
            }
        }

    }
    else if (decoded_data.type === "UnknownChannel")
    {
        logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage",
            "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
        //channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        if (decoded_data.data === serverConfig.channel)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(DataCenterSocket,
                    sr_api.ServerPacket("CreateChannel",
                        config.EXTENSION_NAME,
                        decoded_data.data));
            }, 5000);
        }
        else
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(DataCenterSocket,
                    sr_api.ServerPacket("JoinChannel",
                        config.EXTENSION_NAME,
                        decoded_data.data));
            }, 5000);
        }
    }
    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.type);
}
// ============================================================================
//                           FUNCTION: SendModal
// ============================================================================
// Desription: Send the modal code back after setting the defaults according 
// to our server settings
// Parameters: channel to send data to
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SendModal(toextension)
{
    fs.readFile(__dirname + '/adminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
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
            sr_api.sendMessage(DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    config.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
                        config.EXTENSION_NAME,
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
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
// Desription:save config on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SaveConfigToServer()
{
    console.log("saving config");
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            config.EXTENSION_NAME,
            serverConfig
        ));
}
// ============================================================================
//                           EXPORTS: start
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { start };
