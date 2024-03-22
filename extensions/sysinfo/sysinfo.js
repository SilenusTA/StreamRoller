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
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import si from 'systeminformation';
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    OUR_CHANNEL: "SYSINFO_CHANNEL",
    EXTENSION_NAME: "sysinfo",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    MAX_CONNECTION_ATTEMPTS: 5,
    poll_handle_cpu_data: null,
    poll_handle_cpu_temperature: null,
};

const default_serverConfig = {
    __version__: "0.1",
    // data used in the settings modal
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    sysinfo_enabled: "off",
    sysinfo_cpu_data_enabled: "off",
    sysinfo_cpu_data_poll_intervel: "60",//default poll time if enabled
    sysinfo_cpu_temperature_enabled: "off",
    sysinfo_cpu_temperature_poll_intervel: "10",
    sysinfo_gpu_data_enabled: "off",
    sysinfo_gpu_data_poll_intervel: "60",//default poll time if enabled


    sysinfo_restore_defaults: "off",
    // data for the app
    temps_enabled: "off"

};
let serverConfig = structuredClone(default_serverConfig)
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "SysInfo Extension can provide information about the system that StreamRoller is running on",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "sysInfoCPUData",
                displaytitle: "CPU Data",
                description: "Data about the CPU",
                messagetype: "trigger_sysinfoCPUData",
                parameters: {
                    title: "",// this will be auto or a value passed in by an action
                    manufacturer: '',
                    brand: '',
                    vendor: '',
                    family: '',
                    model: '',
                    stepping: '',
                    revision: '',
                    voltage: '',
                    speed: -1,
                    speedMin: -1,
                    speedMax: -1,
                    governor: '',
                    cores: -1,
                    physicalCores: -1,
                    processors: -1,
                    socket: '',
                    flags: '',
                    virtualization: false,
                    cache: { values: '' }
                }
            },
            {
                name: "sysInfoCPUTemperatures",
                displaytitle: "CPU Temperatures",
                description: "CPU Temperatures if available (you may need to run StreamRoller as admin to allow windows to read this)",
                messagetype: "trigger_sysinfoCPUTemperatures",
                parameters: {
                    title: "",// this will be auto or a value passed in by an action
                    main: -1,
                    cores: [],
                    max: -1,
                    socket: [],
                    chipset: -1
                }
            },
            {
                name: "sysInfoGPUData",
                displaytitle: "GPU Data",
                description: "GPU Data",
                messagetype: "trigger_sysInfoGPUData",
                parameters: {
                    title: "",// this will be auto or a value passed in by an action
                    controllers: [],
                    displays: [],
                }
            }
        ],
    actions:
        [
            {
                name: "sysInfoGetCPUData",
                displaytitle: "Get CPU Data",
                description: "Sends out a trigger with the CPU Data",
                messagetype: "action_sysInfoGetCPUData",
                parameters: { title: "" }
            },
            {
                name: "sysInfoGetCPUTemperatures",
                displaytitle: "Get CPU Temperatures",
                description: "Sends out a trigger with the CPU Temperatures",
                messagetype: "action_sysInfoGetCPUTemperatures",
                parameters: { title: "" }
            },
            {
                name: "sysInfoGetGPUData",
                displaytitle: "Get GPU Data",
                description: "Sends out a trigger with the GPU Data",
                messagetype: "action_sysInfoGetGPUData",
                parameters: { title: "" }
            }

        ],
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
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
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
    // do something here when disconnects happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL)
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
    //logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "message received ", server_packet);
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
            UpdateMonitoring();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                if (extension_packet.data.sysinfo_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    serverConfig.sysinfo_enabled = "off";
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;
                }
                SaveConfigToServer();
                SendSettingsWidgetSmall("");
                UpdateMonitoring();
            }
        }
        else if (extension_packet.type === "action_SysInfoDoStuff")
        {
            console.log("action_SysInfoDoStuff called with", extension_packet.data)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        if (server_packet.data == "STREAMLABS_ALERT" && connectionAttempts[0].STREAMLABS_ALERT_ConnectionAttempts++ < localConfig.MAX_CONNECTION_ATTEMPTS)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", localConfig.EXTENSION_NAME, server_packet.data
                    ));
            }, 5000);
        }
    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else if (server_packet.dest_channel === "STREAMLABS_ALERT")
            process_stream_alert(server_packet);
        else
        {
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
        }
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * sends some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} toextension 
 */
function SendSettingsWidgetSmall (toextension)
{
    fs.readFile(__dirname + '/sysinfosettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
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
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toextension,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    toextension
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
            localConfig.EXTENSION_NAME,
            serverConfig))
}

// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function UpdateMonitoring ()
{
    if (serverConfig.sysinfo_cpu__data_enabled == "on")
        getCPUData()
    if (serverConfig.sysinfo_cpu_temperature_enabled == "on")
        getCPUTemperatureScheduler()
    if (serverConfig.sysinfo_gpu_data_enabled == "on")
        getGPUData()
}
// ============================================================================
//                           FUNCTION: getCPUData
// ============================================================================
/**
 * Requests CPU data and sends out a trigger message to the system
 */
function getCPUData ()
{
    si.cpu()
        .then(data => 
        {
            sendTrigger("trigger_sysinfoCPUData", data)
            console.log("##### SysInfo getCPUData ######");
            //console.log(data)
        })
        .catch(error => 
        {
            console.log("##### SysInfo getCPUData Error ######");
            console.error(error)
        });
}

// ============================================================================
//                           FUNCTION: getCPUTemperatureScheduler
// ============================================================================
/**
 * start the poll timer for the CPU temperature
 */
function getCPUTemperatureScheduler ()
{
    console.log("getCPUTemperatureScheduler")
    // if we have a poll timer value, setup the poll timer
    if (localConfig.poll_handle_cpu_temperature > 0)
        clearTimeout(localConfig.poll_handle_cpu_temperature);
    localConfig.poll_handle_cpu_temperature = setTimeout(getCPUTemperature, serverConfig.sysinfo_cpu_temperature_poll_intervel * 1000)

}
// ============================================================================
//                           FUNCTION: getCPUTemperatureScheduler
// ============================================================================
/**
 * Requests CPU Temperature data and sends out a trigger message to the system
 */
function getCPUTemperature (title = "poll")
{
    // for an action use getCPUTemperature(title); where title is from the users action
    try
    {
        si.cpuTemperature()
            .then(data => 
            {
                sendTrigger("trigger_sysinfoCPUTemperatures", data)
                data.title = title;
                console.log("##### SysInfo getCPUTemperature ######");
                console.log(data)
            })
            .catch(error => 
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getCPUTemperature", "failed:", error);
            });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getCPUTemperature", "callback failed:", err.message);
    }
    localConfig.poll_handle_cpu_temperature = setTimeout(getCPUTemperature, serverConfig.sysinfo_cpu_temperature_poll_intervel * 1000)
}
// ============================================================================
//                           FUNCTION: getGPUData
// ============================================================================
/**
 * Requests GPU data and sends out a trigger message to the system
 */
function getGPUData ()
{
    si.graphics()
        .then(data => 
        {
            sendTrigger("trigger_sysInfoGPUData", data)
            console.log("##### SysInfo getGPUData ######");
            //console.log(data)
        })
        .catch(error => 
        {
            console.log("##### SysInfo getGPUData Error ######");
            console.error(error)
        });
}
// ============================================================================
//                           FUNCTION: sendTrigger
// ============================================================================
/**
 * Requests CPU Temperature data and sends out a trigger message to the system
 */
function sendTrigger (trigger_name, trigger_data)
{
    let trigger = findtriggerByMessageType(trigger_name);
    if (trigger)
    {
        trigger.parameters = trigger_data;
        console.log("#### sendTrigger sending ####")
        console.log(JSON.stringify(trigger, null, 2))
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    trigger_name,
                    serverConfig.extensionname,
                    trigger,
                    serverConfig.channel,
                ),
                serverConfig.channel)
        )
    }
    else
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".sendTrigger:", "Failed to retrieve ", trigger_name, " tigger object");
    }
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                                  EXPORTS
// ============================================================================
export { initialise };
