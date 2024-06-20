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
    poll_handle_gpu_data: null,
    CPUDataTriggerUpdated: false,
    GPUDataTriggerUpdated: false,
    CPUTemperaturesTriggerUpdated: false
};

const default_serverConfig = {
    __version__: "0.1",
    // data used in the settings modal
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    sysinfo_enabled: "off",
    sysinfo_console_log_enabled: "off",
    sysinfo_cpu_data_enabled: "off",
    sysinfo_cpu_data_poll_interval: "60",//default poll time if enabled
    sysinfo_cpu_temperature_enabled: "off",
    sysinfo_cpu_temperature_poll_interval: "10",
    sysinfo_gpu_data_enabled: "off",
    sysinfo_gpu_data_poll_interval: "60",//default poll time if enabled


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
                    reference: "",// this will be auto or a value passed in by an action
                    //fields will be added on the first call (values change for specific hardware)
                }
            },
            {
                name: "sysInfoCPUTemperatures",
                displaytitle: "CPU Temperatures",
                description: "CPU Temperatures if available (you may need to run StreamRoller as admin to allow windows to read this)",
                messagetype: "trigger_sysinfoCPUTemperatures",
                parameters: {
                    reference: "",// this will be auto or a value passed in by an action
                    //fields will be added on the first call (values change for specific hardware)
                }
            },
            {
                name: "sysInfoGPUData",
                displaytitle: "GPU Data",
                description: "GPU Data",
                messagetype: "trigger_sysInfoGPUData",
                parameters: {
                    reference: "",// this will be auto or a value passed in by an action
                    //fields will be added on the first call (values change for specific hardware)/
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
                parameters: { reference: "" }
            },
            {
                name: "sysInfoGetCPUTemperatures",
                displaytitle: "Get CPU Temperatures",
                description: "Sends out a trigger with the CPU Temperatures",
                messagetype: "action_sysInfoGetCPUTemperatures",
                parameters: { reference: "" }
            },
            {
                name: "sysInfoGetGPUData",
                displaytitle: "Get GPU Data",
                description: "Sends out a trigger with the GPU Data",
                messagetype: "action_sysInfoGetGPUData",
                parameters: { reference: "" }
            }

        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    // update our triggers with the systems fields
    getCPUData("initialise");
    getGPUData("initialise");
    getCPUTemperature("initialise");

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
                    serverConfig.sysinfo_console_log_enabled = "off";
                    serverConfig.sysinfo_cpu_data_enabled = "off";
                    serverConfig.sysinfo_cpu_temperature_enabled = "off";
                    serverConfig.sysinfo_gpu_data_enabled = "off";
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;
                }
                SaveConfigToServer();
                SendSettingsWidgetSmall("");
                UpdateMonitoring();
            }
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            sendTriggersAndActions(server_packet.from)
        }
        else if (extension_packet.type === "action_sysInfoGetCPUTemperatures")
        {
            console.log("action_sysInfoGetCPUTemperatures called with", extension_packet.data)
            getCPUTemperature(extension_packet.data.reference)
        }
        else if (extension_packet.type === "action_sysInfoGetCPUData")
        {
            console.log("action_sysInfoGetCPUData called with", extension_packet.data)
            getCPUData(extension_packet.data.reference)
        }
        else if (extension_packet.type === "action_sysInfoGetGPUData")
        {
            console.log("action_sysInfoGetGPUData called with", extension_packet.data)
            getGPUData(extension_packet.data.reference)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
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
//                           FUNCTION: sendTriggersAndActions
// ============================================================================
/**
 * Sends the triggers and actions to the extension or broadcast if extension name is ""
 * @param {string} extension 
 */
function sendTriggersAndActions (extension = "")
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "TriggerAndActions",
                serverConfig.extensionname,
                triggersandactions,
                "",
                extension
            ),
            "",
            extension
        )
    )
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function UpdateMonitoring ()
{
    if (serverConfig.sysinfo_enabled == "on")
    {
        if (serverConfig.sysinfo_cpu_data_enabled == "on")
        {
            // is there any reason to have a poll for this data?
            console.log("CPUData Polling TBD");
            //getCPUData()
        }
        else
            clearTimeout(localConfig.poll_handle_cpu_data);

        if (serverConfig.sysinfo_cpu_temperature_enabled == "on")
            getCPUTemperatureScheduler();
        else
            clearTimeout(localConfig.poll_handle_cpu_temperature);

        if (serverConfig.sysinfo_gpu_data_enabled == "on")
            getGPUDataScheduler();
        else
            clearTimeout(localConfig.poll_handle_gpu_data);
    }
}
// ============================================================================
//                           FUNCTION: getCPUData
// ============================================================================
/**
 * Requests CPU data and sends out a trigger message to the system
  * @param {string} reference 
 */
function getCPUData (reference = "poll")
{
    si.cpu()
        .then(data => 
        {
            // get the data in a format we can use in the triggers (can't access multidimensional arrays)
            let new_data = flattenObject(data);
            // update our triggers if we haven't done so already
            if (!localConfig.CPUDataTriggerUpdated)
            {
                updateTrigger("trigger_sysinfoCPUData", new_data);
                localConfig.CPUDataTriggerUpdated = true;
            }

            // add the users reference or the default if not provided
            new_data.reference = reference;
            if (serverConfig.sysinfo_console_log_enabled == "on")
            {
                console.log("CPU Data:", new_data)
            }
            // send the trigger with the new data
            sendTrigger("trigger_sysinfoCPUData", new_data)
        })
        .catch(error => 
        {
            console.log("##### SysInfo getCPUData Error ######");
            console.error(error)
        });
}

// ============================================================================
//                           FUNCTION: getCPUTemperature
// ============================================================================
/**
 * Requests CPU Temperature data and sends out a trigger message to the system
 */
function getCPUTemperature (reference = "poll")
{
    // for an action use getCPUTemperature(reference); where reference is from the users action
    try
    {
        si.cpuTemperature()
            .then(data => 
            {
                // get the data in a format we can use in the triggers (can't access multidimensional arrays)
                let new_data = flattenObject(data);
                if (!localConfig.CPUTemperaturesTriggerUpdated)
                {
                    updateTrigger("trigger_sysinfoCPUTemperatures", new_data)
                    localConfig.CPUTemperaturesTriggerUpdated = true;
                }

                new_data.reference = reference;
                if (serverConfig.sysinfo_console_log_enabled == "on")
                {
                    console.log("CPU Temperature:", new_data)
                }
                // send the trigger with the new data
                sendTrigger("trigger_sysinfoCPUTemperatures", new_data)
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
    // restart timer if we are poll enabled
    if (serverConfig.sysinfo_cpu_temperature_enabled == "on")
        getCPUTemperatureScheduler();
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
    localConfig.poll_handle_cpu_temperature = setTimeout(getCPUTemperature, serverConfig.sysinfo_cpu_temperature_poll_interval * 1000)
}
// ============================================================================
//                           FUNCTION: getGPUData
// ============================================================================
/**
 * Requests GPU data and sends out a trigger message to the system
 */
function getGPUData (reference = "poll")
{
    si.graphics()
        .then(data => 
        {
            let new_data = flattenObject(data);
            if (!localConfig.GPUDataTriggerUpdated)
            {
                updateTrigger("trigger_sysInfoGPUData", new_data);
                localConfig.GPUDataTriggerUpdated = true;
            }
            new_data.reference = reference;
            if (serverConfig.sysinfo_console_log_enabled == "on")
            {
                console.log("GPU Data:", new_data)
            }
            sendTrigger("trigger_sysInfoGPUData", new_data)
        })
        .catch(error => 
        {
            console.log("##### SysInfo getGPUData Error ######");
            console.error(error)
        });
    // restart timer if we are poll enabled
    if (serverConfig.sysinfo_gpu_data_enabled == "on")
        getGPUDataScheduler();
}
// ============================================================================
//                           FUNCTION: getGPUDataScheduler
// ============================================================================
/**
 * start the poll timer for the GPU Data
 */
function getGPUDataScheduler ()
{
    console.log("getGPUDataScheduler")
    // if we have a poll timer value, setup the poll timer
    if (localConfig.poll_handle_gpu_data > 0)
        clearTimeout(localConfig.poll_handle_gpu_data);
    localConfig.poll_handle_gpu_data = setTimeout(getGPUData, serverConfig.sysinfo_gpu_data_poll_interval * 1000)
}
// ============================================================================
//                           FUNCTION: sendTrigger
// ============================================================================
/**
 * Requests CPU Temperature data and sends out a trigger message to the system
 */
function sendTrigger (trigger_name, trigger_data)
{
    let trigger = findTriggerByMessageType(trigger_name);
    if (trigger)
    {
        trigger.parameters = trigger_data;
        //console.log("#### sendTrigger sending ####")
        //console.log(JSON.stringify(trigger, null, 2))
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
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".sendTrigger:", "Failed to retrieve ", trigger_name);
    }
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: flatten
// ============================================================================
function flatten (data = [])
{
    var ret = [];
    console.log("########## flatten ##########")
    console.log(data)
    //check if we have an Array. if not it is probably an object
    if (Array.isArray(data))
    {
        console.log("array passed")
        for (var i = 0; i < data.length; i++)
        {
            if (Array.isArray(data[i]))
            {
                ret = ret.concat(flatten(data[i]));
            } else
            {
                ret.push(data[i]);
            }
        }
    }
    else if (typeof data === 'object' &&
        !Array.isArray(data) &&
        data !== null
    )
    {
        console.log("got an object");
    }
    else 
    {
        console.log("got a variable");
    }
    return ret;
}
// ============================================================================
//                           FUNCTION: flatten
// ============================================================================
function flattenObject (ob)
{
    var toReturn = {};

    for (var i in ob)
    {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null)
        {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject)
            {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else
        {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}
// ============================================================================
//                           FUNCTION: updateTrigger
// ============================================================================
/**
 * Updates the trigger parameter fields to what we get from the system (as these will be different on each PC)
 * @param {string} trigger 
 * @param {data} ob 
 */
function updateTrigger (trigger, ob)
{
    for (var triggers_i = 0; triggers_i < triggersandactions.triggers.length; triggers_i++)
    {
        // find this trigger
        if (triggersandactions.triggers[triggers_i].messagetype == trigger)
        {
            // add the fields to the trigger
            for (const property in ob)
            {
                triggersandactions.triggers[triggers_i].parameters[property] = ""
            }
        }
    }

    // send out the update so extensions have the new trigger fields
    sendTriggersAndActions("");
    localConfig.CPUDataTriggerUpdated = true
}
// ============================================================================
//                                  EXPORTS
// ============================================================================
export { initialise };
