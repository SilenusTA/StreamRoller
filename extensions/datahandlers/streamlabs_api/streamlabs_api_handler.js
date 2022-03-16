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
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs"
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
    StreamLabsSocket: null
};

let serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabled: "off"
};

// ============================================================================
//                           FUNCTION: start
// ============================================================================
function start(host, port, heartbeat)
{
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
//                           FUNCTION: connectToStreamLabs
// ============================================================================
function connectToStreamLabs(creds)
{
    // ########################## SETUP STREAMLABS CONNECTION ###############################
    // The token can be found at streamlabs.com, its a long hex string under settings->API Tokens->socket API token 
    if (!creds.SL_SOCKET_TOKEN)
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.js", "SL_SOCKET_TOKEN not set in environment variable");
    else
    {
        try
        {
            if (localConfig.ENABLE_STREAMLABS_CONNECTION)
            {
                localConfig.StreamLabsSocket = StreamLabsIo("https://sockets.streamlabs.com:443?token=" + creds.SL_SOCKET_TOKEN, { transports: ["websocket"] });
                // handlers
                localConfig.StreamLabsSocket.on("connect", (data) => onStreamLabsConnect(data));
                localConfig.StreamLabsSocket.on("disconnect", (reason) => onStreamLabsDisconnect(reason));
                localConfig.StreamLabsSocket.on("event", (data) => onStreamLabsEvent(data));
            }
            else
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "Streamlabs disabled in config");
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.start", "clientio connection failed:", err);
            throw ("streamlabs_api_handler.js failed to connect to streamlabs");
        }
    }
}
// ########################## STREAMLABS API CONNECTION #######################
// ============================================================================
//                           FUNCTION: onStreamLabsDisconnect
// ============================================================================
function onStreamLabsDisconnect(reason)
{
    localConfig.status.connected = false;
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsDisconnect", reason);
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
    localConfig.status.connected = true;
    // start our heatbeat timer
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsConnect", "streamlabs api socket connected");
}
// ============================================================================
//                           FUNCTION: onStreamLabsEvent
// ============================================================================
// Desription: Handles messaged from the streamlabs api
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onStreamLabsEvent(data)
{
    logger.info(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsEvent", "received message: ", data);
    // Send this data to the channel for this
    if (serverConfig.enabled === "on")
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                data,
                localConfig.OUR_CHANNEL
            ));
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onStreamLabsEvent", "serverConfig is set to off");
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + "streamlabs_api_handler.onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Handles Connect message from the datacenter
// Parameters: reason
// ----------------------------- notes ----------------------------------------
// ============================================================================
function onDataCenterConnect()
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
function onDataCenterMessage(server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        //save our data if the server has no data
        if (server_packet.data != "")
            // check it is our config
            if (server_packet.to === serverConfig.extensionname)
            {
                // we could just assign the values here (ie serverConfig = decoded_packet.message_contents)
                // but if we change/remove an item it would never get removed from the store
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in server_packet.data)
                    {
                        serverConfig[key] = server_packet.data[key];
                    }
            }
        SaveConfigToServer();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
            connectToStreamLabs(server_packet.data);
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty");
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let decoded_packet = server_packet.data;
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
                // SendModal(server_packet.channel);
            }
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
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
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
function heartBeatCallback()
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
//                           EXPORTS: start
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { start };
