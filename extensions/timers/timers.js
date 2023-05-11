// ############################# Timers.js ##############################
// This extension creates timers for use in the system.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 12-April-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// Countdown Timers etc
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { clearTimeout } from "timers";
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    DataCenterSocket: null,
};
const serverConfig = {
    extensionname: "timers",
    channel: "TIMERS",
    // default values for timer modal
    TimerName: "StartCountdownTimer",
    TimerMessage: "Starting in",
    Timeout: "600"
};

const timer = {
    name: "Timer",
    message: "message",
    timeleft: 0
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err("[EXTENSION]" + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
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
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
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
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)

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
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "message received ", server_packet);
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            for (const [key, value] of Object.entries(serverConfig))
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let decoded_packet = server_packet.data;
        if (decoded_packet.type === "RequestAdminModalCode")
            // TBD maintain list of all extensions that has requested Modals
            SendAdminModal(decoded_packet.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            if (decoded_packet.data.extensionname === serverConfig.extensionname)
            {
                if (localConfig[decoded_packet.data.TimerName] === undefined)
                    localConfig[decoded_packet.data.TimerName] = {};
                localConfig[decoded_packet.data.TimerName].name = decoded_packet.data.TimerName;
                localConfig[decoded_packet.data.TimerName].message = decoded_packet.data.TimerMessage;
                localConfig[decoded_packet.data.TimerName].timeout = decoded_packet.data.Timeout;
                //serverConfig.checkbox = "off";
                for (const [key, value] of Object.entries(decoded_packet.data))
                    serverConfig[key] = value;

                SaveConfigToServer();
                // send any updated data to all extensions that are using the modal
                SendAdminModal(server_packet.from);

                // check any timers needed
                CheckTimers(decoded_packet.data.TimerName);
            }
        }
        else if (decoded_packet.type === "StartSomeTimerHere")
        {
            // This is an extension message from the API. not currently used as timers are started from the settins modals
            CheckTimers(decoded_packet.data.TimerName);
        }
        else if (decoded_packet.type === "AdminModalCode")
        {
            // ignore these messages
        }
        else
            logger.warn("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
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
        logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn("[EXTENSION]" + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ===========================================================================
//                           FUNCTION: SendAdminModal
// ===========================================================================
/**
 * send some modal code 
 * @param {String} tochannel 
 */
function SendAdminModal (tochannel)
{
    fs.readFile(__dirname + '/timersadminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        tochannel,
                        serverConfig.channel
                    ),
                    "",
                    tochannel
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: CheckTimers
// ============================================================================
function CheckTimers (timername)
{
    if (localConfig[timername].timeout > 0)
    {
        Timer(timername)
    }

    // setup new timer
}
// ============================================================================
//                           FUNCTION: Timer
// ============================================================================
function Timer (timername)
{
    sendTimerData(timername, localConfig[timername].timeout);
    localConfig[timername].timeout = localConfig[timername].timeout - 1;
    // write the file
    clearTimeout(localConfig[timername].Handle);
    if (localConfig[timername].timeout >= 0)
    {
        let minutes = Math.floor(localConfig[timername].timeout / 60);
        let seconds = localConfig[timername].timeout - (minutes * 60);
        fs.writeFileSync(__dirname + "/timerfiles/" + timername + ".txt", localConfig[timername].message + " " + minutes + ":" + seconds.toString().padStart(2, '0'))
        localConfig[timername].Handle = setTimeout(() =>
        {
            Timer(timername)
        },
            1000
        )
    }
    else
        fs.writeFileSync(__dirname + "/timerfiles/" + timername + ".txt", " ")
}
// ============================================================================
//                           FUNCTION: sendTimerData
// ============================================================================
function sendTimerData (timername, timedata)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "Timer",
                serverConfig.extensionname,
                {
                    timername: timername,
                    timerdata: timedata
                },
                serverConfig.channel
            ),
            serverConfig.channel
        ));
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
