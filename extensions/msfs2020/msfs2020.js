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
// ############################# msfs2020.js ##############################
// Allows data to be sent/received from Microsoft Flight Sim 2020
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 01-Jul-2023
// ============================================================================
/**
 * @extension MSFS2020
 * Game extension to allow access to control Microsoft Flight simulator and also receive data from on of ten's of thousands of sim variables
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import { MSFS_API, SystemEvents } from 'msfs-simconnect-api-wrapper';
import { SimVars } from "msfs-simconnect-api-wrapper/simvars/index.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "MSFS2020_CHANNEL",
    EXTENSION_NAME: "msfs2020",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    MAX_CONNECTION_ATTEMPTS: 5,
    state: {
        color: "red",
        msfsconnected: false,
        msfsconnecting: false
    },
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    pollMSFSHandle: null,
    msfs_api: new MSFS_API(),
    msfs_api_connected_handle: null,
    //msfs_api_recveventhandler: null,
    //maintain a list of trigger handles for deregistering
    EventCallabackHandles: [],
    previousValue: [], // holds the last value read so we can provide 'onchange' only triggers
    dumpTriggers: false, //autodocs needs to manually parse this so we dump it to file and manually create the readme triggers and actions table
    startupCheckTimer: 500,
    ready: false,
    readinessFlags: {
        ConfigReceived: false,
        DataFileReceived: false,
    },
};

const default_serverConfig = {
    __version__: "0.2.1",
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    msfs2020ennabled: "off",
    msfs2020SimPollInterval: "5",
    msfs2020extension_restore_defaults: "off"
};

let serverConfig = structuredClone(default_serverConfig)

const default_triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Connects to Microsoft Flight Sim 2020 and reads/writes simvars. when connected to MSFS2020 thousands more triggers/options will be available than appear in this default list. <BR> ie you can set a trigger on simvar 'FLAPS HANDLE INDEX' index 0 position 2 to trigger an action when the flaps are set to position 2<BR>Ie you can set an action on the simvar 'GENERAL ENG THROTTLE LEVER POSITION' using index 1 and a value of 50 to set the postition of throttle 1 to 50%. Please feel free to post useful triggers and actions on teh discord server for others to play with<BR><B>DON'T FORGET TO TURN ON MONITORING FOR ANY VARS YOU WANT TO TRIGGER ON (IN THE SETTINGS PAGE)</B>",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "onRequest_PLANE LATITUDE LONGITUDE",
                displaytitle: "Current lat/long (OnRequest)",
                description: "The current lat long in one message with separate variables",
                messagetype: "trigger_onRequest_PLANE LATITUDE LONGITUDE",
                parameters: { lat: "", long: "" }
            }
        ],
    actions:
        [
            {
                name: "PLANE LATITUDE LONGITUDE_get",
                displaytitle: "Get lat/long (Get)",
                description: "Get the current lat long in one message",
                messagetype: "action_PLANE LATITUDE LONGITUDE_get",
                parameters: {}
            }
        ],
}

let triggersandactions = structuredClone(default_triggersandactions)

const default_serverData =
{
    __version__: "0.2",
    SimVars: {},
    EventVars:
        ["AIRCRAFT_LOADED", "CRASHED", "CRASH_RESET", "CUSTOM_MISSION_ACTION_EXECUTED"
            , "FLIGHT_LOADED", "FLIGHT_SAVED", "FLIGHT_PLAN_ACTIVATED", "FLIGHT_PLAN_DEACTIVATED"
            , "OBJECT_ADDED", "OBJECT_REMOVED", "PAUSE", "PAUSE_EX1", "PAUSED", "POSITION_CHANGED"
            , "SIM_START", "SIM_STOP", "UNPAUSED", "VIEW"
        ],
    triggersNamesArray: [] // names of triggers we are monitoring ie. FLAPS_POSITION:1
}
let serverData = structuredClone(default_serverData)
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
    try
    {
        if (typeof (heartbeat) != "undefined")
            localConfig.heartBeatTimeout = heartbeat;
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heartbeat passed:", heartbeat);

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
 * Called when connection is lost to StreamRoller
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Called when server connects
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    clearTimeout(localConfig.heartBeatHandle);
    heartBeatCallback();

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Called when we receive a message from the server
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
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
            pollMSFS();
        }
    }
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.DataFileReceived = true;
        if (server_packet.data != "")
        {
            if (server_packet.data.__version__ != default_serverData.__version__)
            {
                serverData = structuredClone(default_serverData)
                console.log("\x1b[31m" + serverConfig.extensionname + " DataFile Updated", "The data file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            if (server_packet.to === serverConfig.extensionname && server_packet.data != undefined && server_packet.data.SimVars != undefined
                && Object.keys(server_packet.data.SimVars).length > 0)
            {
                // SaveDataToServer();
                serverData = structuredClone(server_packet.data)
                // connect to msfs
                initSimVarsandTriggers();
                pollMSFS();
            }
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === 'RequestSettingsWidgetLargeCode')
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                let reconnect = false
                let disconnect = false
                // check if we are changing to on
                if (serverConfig.msfs2020ennabled == "off" && extension_packet.data.msfs2020ennabled == "on")
                    reconnect = true
                // check if we are changing to off
                else if (serverConfig.msfs2020ennabled == "on" && !extension_packet.data)
                    disconnect = true
                serverConfig.msfs2020ennabled = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
                if (reconnect)
                {
                    initSimVarsandTriggers()
                    pollMSFS()
                    sendTriggersAndActions(server_packet.from)
                }
                else if (disconnect)
                {
                    MSFS2020Disconnect()
                }
                else
                    pollMSFS()
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.demoextension_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    serverData = structuredClone(default_serverData)
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile and Data files Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    let reconnect = false
                    if (serverConfig.msfs2020ennabled == "off" && extension_packet.data.msfs2020ennabled == "on")
                        reconnect = true

                    handleSettingsWidgetLargeData(extension_packet.data)
                    SaveConfigToServer();
                    SaveDataToServer();
                    if (reconnect || (extension_packet.data.msfs2020ennabled == "on" && !localConfig.state.msfsconnected))
                    {
                        initSimVarsandTriggers()
                        pollMSFS()
                        sendTriggersAndActions(server_packet.from)
                    }
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
            }
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            if (extension_packet.to === serverConfig.extensionname)
                sendTriggersAndActions(server_packet.from)
        }
        else if (extension_packet.type.indexOf("action_" == 0))
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (serverConfig.msfs2020ennabled == "on")
                {
                    // test for our home grown versions
                    if (extension_packet.type == "action_PLANE LATITUDE LONGITUDE_get")
                    {
                        performActionGetLatLong(extension_packet)
                    }
                    else
                        performAction(extension_packet)
                }
            }
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
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
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else
        {
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
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
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Parses and sends out our small settings widget to the given extension
 * @param {string} to 
 */
function SendSettingsWidgetSmall (to)
{
    fs.readFile(__dirname + '/msfs2020settingswidgetsmall.html', function (err, filedata)
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
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        to,
                        serverConfig.channel
                    ),
                    "",
                    to
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
/**
 * Handles user submitted code from our large settings widget/page
 * @param {object} modalcode 
 */
function handleSettingsWidgetLargeData (modalcode)
{
    /////////////////////////////////////////////////
    //              Restore Defaults
    /////////////////////////////////////////////////
    if (modalcode.msfs2020_restore_defaults == "on")
    {
        console.log("MSFS  defaults restored")
        console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
        serverConfig = structuredClone(default_serverConfig);
        serverData = structuredClone(default_serverData)
        return;
    }

    //Clear our previous triggers (we will re-add the ones we have been sent)
    serverData.triggersNamesArray = [];
    /////////////////////////////////////////////////
    //          get serverConfig values
    /////////////////////////////////////////////////
    for (const [key, value] of Object.entries(modalcode))
    {
        if (key in serverConfig)
            serverConfig[key] = value;

    }
    /////////////////////////////////////////////////
    //          get SimVar values
    /////////////////////////////////////////////////
    const varKeys = Object.keys(serverData.SimVars);
    // loop through all our keys as we need to know what has been changed
    for (let i = 0; i < varKeys.length; i++)
    {
        // check if we have been sent one (must be checked/set to "on" to be sent)
        if (varKeys[i] in modalcode)
        {
            if (serverData.SimVars[varKeys[i]].enabled != modalcode[varKeys[i]])
            {
                // it is set to on and ours is off
                serverData.SimVars[varKeys[i]].enabled = "on"
            }
            // else if it is the same do nothing
        }
        else
        {
            // not been sent it so it must be off
            if (serverData.SimVars[varKeys[i]].enabled == "on")
            {
                // we are currently set to on and need to turn off
                serverData.SimVars[varKeys[i]].enabled = "off"
            }

        }
        // have we been sent a value (box checked)
        if (varKeys[i] in modalcode)
        {
            // check for an index number simvar
            if (varKeys[i].indexOf(":index") > 0)
            {
                let txtfieldname = varKeys[i].replace(":index", "") + "_index"
                // check we have a field for the index ()
                addToTriggersArray(varKeys[i], modalcode[txtfieldname])
                serverData.SimVars[varKeys[i]].index = modalcode[txtfieldname]
            }
            else
            {
                // check we have a field for the index ()
                addToTriggersArray(varKeys[i])
                serverData.SimVars[varKeys[i]].index = modalcode[varKeys[i]]
            }
        }
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * Creates and sends our large settings widget html code to the given extension
 * @param {string} to 
 */
function SendSettingsWidgetLarge (to)
{
    let generatedpage = "";
    let first = true
    let readwritestate = ""
    fs.readFile(__dirname + "/msfs2020settingswidgetlarge.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
            //throw err;
        }
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            //////////////////////////////////////////////////
            // mormal replaces(ie enabled and reset checkboxes
            //////////////////////////////////////////////////
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }

            //////////////////////////////////////////////////
            //             Enabled Simvars
            // Done separately so we can delete them easier
            //////////////////////////////////////////////////
            const triggerKeys = Object.keys(serverData.triggersNamesArray);
            first = false;
            generatedpage = ""
            generatedpage += "Polling too many Sim Variables too fast can cause lag in the game. Check the tool tips by hovering mouse over the SimVar name for description</p>"
            generatedpage += "<p>Note: A simvar needs to be monitored to be able to set a trigger on it.</p>"
            generatedpage += "<p> An example trigger might be to position your camera in obs to show your height. To do this you would set the trigger to ... <BR>"
            generatedpage += "<BR>TRIGGER: 'msfs2020', 'trigger_INDICATED ALTITUDE'"
            generatedpage += "<BR>ACTION: 'obs','action_SetSceneItemTransform','SceneName'= 'Camera_feed', 'sourceName' = '#4x3_Cam', 'positionY' = '((%%data%% - 10000) / (0 - 10000)) * (1040-50) + 50'"
            generatedpage += "<BR>In this example my group name that the camera is in is called 'Camera_feed' and the camera source is called '#4x3_Cam'"
            generatedpage += "<BR>I set the positionY of the camera based on the value in the 'data' field of the trigger (altitude from MSFS) but as this is a big range it needs converting to the pixel position in obs"
            generatedpage += "<BR>The equasion set converts an alt range of 0 to 10,000 feet into a pixel position of 50 to 1040 pixels (what I need for my screen res in obs)"
            generatedpage += "<HR><h5>Currently Active Simvars</H5> "
            for (let i = 0; i < triggerKeys.length; i++)
            {
                // every 5 items start a new row but only close out after the first itme
                if (!first && i % 5 == 0)
                    generatedpage += "</tr>"

                if (i % 5 == 0)
                    generatedpage += "<tr>"

                // ''''''''''''''''''''' TD '''''''''''''''''''''''''''''''''
                generatedpage += "<td scope='row'>" + serverData.triggersNamesArray[triggerKeys[i]]

                // Does this variable have an index part
                if (serverData.triggersNamesArray[triggerKeys[i]].indexOf(":index") > 0)
                    generatedpage += ":" + serverData.triggersNamesArray[triggerKeys[i]].index
                //check that we have this value
                if (typeof (serverData.triggersNamesArray[triggerKeys[i]].enabled) == "undefined")
                    serverData.triggersNamesArray[triggerKeys[i]].enabled == "off"
                generatedpage += "</td>"
                first = false;
            }
            if (!first)
                generatedpage += "</tr>"
            modalstring = modalstring.replace("MSFSActiveCode", generatedpage);

            //////////////////////////////////////////////////
            //                  SimVars
            //////////////////////////////////////////////////
            const varKeys = Object.keys(serverData.SimVars);
            first = false;
            generatedpage = ""
            generatedpage += "<h5>Simvars Available</H5><p>Select checkbox to set as a Trigger. Some simvars have "
            generatedpage += "an index (ie GENERAL ENG RPM:index) for these an index number is needed to identify "
            generatedpage += "a specific item (ie which engine rpm). The letters in brackets indicate it the item "
            generatedpage += "is readonly (R) or ReadWrite (RW)</p>"
            for (let i = 0; i < varKeys.length; i++)
            {
                // every 5 items start a new row but only close out after the first itme
                if (!first && i % 5 == 0)
                    generatedpage += "</tr>"

                if (i % 5 == 0)
                    generatedpage += "<tr>"

                // ''''''''''''''''''''' TD '''''''''''''''''''''''''''''''''
                // are we able to set this vaiable
                if (serverData.SimVars[varKeys[i]].settable == true)
                    readwritestate = "(RW)"
                else
                    readwritestate = "(R)"
                generatedpage += "<td scope='row'>" + serverData.SimVars[varKeys[i]].name + " " + readwritestate + " "

                // Does this variable have an index part
                if (serverData.SimVars[varKeys[i]].name.indexOf(":index") > 0)
                {
                    let fieldname = serverData.SimVars[varKeys[i]].name.replace(":index", "") + "_index"
                    generatedpage += "<input type='text' style='width: 30px' name='" + fieldname + "'"
                    generatedpage += " id='" + fieldname + "' value='" + serverData.SimVars[varKeys[i]].index + "'> "
                }

                //check that we have this value
                if (typeof (serverData.SimVars[varKeys[i]].enabled) == "undefined")
                    serverData.SimVars[varKeys[i]].enabled == "off"

                if (serverData.SimVars[varKeys[i]].enabled == "on")
                    generatedpage += " <input class='form-check-input' name='" + serverData.SimVars[varKeys[i]].name + "' type='checkbox' id='" + serverData.SimVars[varKeys[i]].name + "' checked >"
                else
                    generatedpage += " <input class='form-check-input' name='" + serverData.SimVars[varKeys[i]].name + "' type='checkbox' id='" + serverData.SimVars[varKeys[i]].name + "'>"
                generatedpage += "</td>"
                first = false;
            }
            if (!first)
                generatedpage += "</tr>"
            modalstring = modalstring.replace("MSFSSimVarsCode", generatedpage);

            //////////////////////////////////////////////////
            //  Send out the new code
            //////////////////////////////////////////////////
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        to,
                        serverConfig.channel
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))

        }
    });
    // done as we might have added some enabled entries
    SaveDataToServer();
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Saves our config to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
/**
 * Saves our data to the server
 */
function SaveDataToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveData",
            serverConfig.extensionname,
            serverData));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    localConfig.state.msfsconnected = localConfig.msfs_api.connected
    localConfig.state.color = "red"
    if (serverConfig.msfs2020ennabled == "on")
    {
        // if we are not connected and we should be then attempt to reconnect
        if (!localConfig.state.msfsconnected && !localConfig.state.msfsconnecting)
            msfsapiconnect()
        if (localConfig.state.msfsconnected != true)
            localConfig.state.color = "orange"
        else
            localConfig.state.color = "green"
    }

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                localConfig.state
                ,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ############################################################################
//                              MSFS specific code
// ############################################################################


// ============================================================================
//                           FUNCTION: initSimVarsandTriggers
// ============================================================================
/*
    serverData.SimVars['ACCELERATION BODY X']
    simvar example {
        desc: 'Acceleration relative to aircraft X axis, in east/west direction',
        units: 'feet',
        data_type: 4,
        settable: false,
        name: 'ACCELERATION BODY X',
        enabled: 'off'
        }
    */
/**
 * initialises our sim variables dynamically creates triggers and actions based on what is available.
 * Note there can be thousands of possible options created here
 */
function initSimVarsandTriggers ()
{
    if (serverConfig.msfs2020ennabled == "on")
    {
        /// *************** Create our Simvars array *****************************

        // make a clone of the simVars (so we can add extra fields for enabled etc)
        const varKeys = Object.keys(SimVars);
        varKeys.sort();
        for (let i = 0; i < varKeys.length; i++)
        {
            if (typeof serverData.SimVars[varKeys[i]] == "undefined")
                serverData.SimVars[varKeys[i]] = SimVars[varKeys[i]]
            // this creates the enabled variable if it doesn't exist
            if (serverData.SimVars[varKeys[i]].enabled != "on")
                serverData.SimVars[varKeys[i]].enabled = "off"

            if (varKeys[i].indexOf(":index") > 0 && typeof (serverData.SimVars[varKeys[i]].index) == "undefined")
            {
                serverData.SimVars[varKeys[i]].index = "0"
                //(serverData.SimVars[varKeys[i]])
            }

        }
        SaveDataToServer()

        /// *************** Create our triggers and actions *****************************
        // Create triggers and actions
        triggersandactions = {}
        triggersandactions = structuredClone(default_triggersandactions)

        /// *************** Add Event variables *************************
        for (let i = 0; i < serverData.EventVars.length; i++)
        {
            triggersandactions.triggers.push(
                {
                    name: SystemEvents[serverData.EventVars[i]].name,
                    displaytitle: SystemEvents[serverData.EventVars[i]].name,
                    description: SystemEvents[serverData.EventVars[i]].desc,
                    messagetype: "trigger_" + SystemEvents[serverData.EventVars[i]].name,
                    parameters: { data: "" }
                });
            triggersandactions.triggers.push(
                {
                    name: "onChange_" + SystemEvents[serverData.EventVars[i]].name,
                    displaytitle: SystemEvents[serverData.EventVars[i]].name + " (OnChange)",
                    description: SystemEvents[serverData.EventVars[i]].desc,
                    messagetype: "trigger_onChange_" + SystemEvents[serverData.EventVars[i]].name,
                    parameters: { data: "" }
                });
        }

        //// *************** Add SimVars *************************
        for (let i = 0; i < varKeys.length; i++)
        {
            //// *************** If it is writeable add an action to write the variable *************************
            if (serverData.SimVars[varKeys[i]].settable == true)
            {
                if (varKeys[i].indexOf(":index") > 0)
                {
                    triggersandactions.actions.push(
                        {
                            name: serverData.SimVars[varKeys[i]].name,
                            displaytitle: serverData.SimVars[varKeys[i]].name + "(Set)",
                            description: "Set the simvar " + serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units,
                            messagetype: "action_" + serverData.SimVars[varKeys[i]].name,
                            parameters: { index: "0", data: "" }
                        }
                    )
                }
                else
                {
                    triggersandactions.actions.push(
                        {
                            name: serverData.SimVars[varKeys[i]].name,
                            displaytitle: serverData.SimVars[varKeys[i]].name + "(Set)",
                            description: "Set the simvar " + serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units,
                            messagetype: "action_" + serverData.SimVars[varKeys[i]].name,
                            parameters: { data: "" }
                        }
                    )
                }
            }
            //// *************** If readable add an action to read it *************************
            if (varKeys[i].indexOf(":index") > 0)
            {
                triggersandactions.actions.push(
                    {
                        name: serverData.SimVars[varKeys[i]].name + "_get",
                        displaytitle: serverData.SimVars[varKeys[i]].name + "(Get)",
                        description: "Request the value, will be returned in a 'name_(Single) 'trigger" + serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units,
                        messagetype: "action_" + serverData.SimVars[varKeys[i]].name + "_get",
                        parameters: { index: "0" }
                    }
                )
            }
            else
            {
                triggersandactions.actions.push(
                    {
                        name: serverData.SimVars[varKeys[i]].name + "_get",
                        displaytitle: serverData.SimVars[varKeys[i]].name + "(Get)",
                        description: "Request the value, will be returned in a 'name_(Single) 'trigger" + serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units,
                        messagetype: "action_" + serverData.SimVars[varKeys[i]].name + "_get",
                        parameters: {}
                    }
                )
            }
            // triggers with indexes
            let paramdata = {}
            if (varKeys[i].indexOf(":index") > 0)
            {
                paramdata = { index: "0", data: "" }
            }
            else
            {
                paramdata = { data: "" }
            }
            triggersandactions.triggers.push
                (
                    {
                        name: serverData.SimVars[varKeys[i]].name,
                        displaytitle: serverData.SimVars[varKeys[i]].name + " (Poll)",
                        description: serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units + ": settable " + serverData.SimVars[varKeys[i]].settable,
                        messagetype: "trigger_" + serverData.SimVars[varKeys[i]].name,
                        parameters: paramdata
                    }
                )
            // add an onchange trigger (we only send this when data changes)
            triggersandactions.triggers.push
                (
                    {
                        name: "onChange_" + serverData.SimVars[varKeys[i]].name,
                        displaytitle: serverData.SimVars[varKeys[i]].name + " (OnChange)",
                        description: serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units + ": settable " + serverData.SimVars[varKeys[i]].settable,
                        messagetype: "trigger_onChange_" + serverData.SimVars[varKeys[i]].name,
                        parameters: paramdata
                    }
                )
            triggersandactions.triggers.push
                (
                    {
                        name: "onRequest_" + serverData.SimVars[varKeys[i]].name,
                        displaytitle: serverData.SimVars[varKeys[i]].name + " (OnRequest)",
                        description: serverData.SimVars[varKeys[i]].desc + ": Units " + serverData.SimVars[varKeys[i]].units + ": settable " + serverData.SimVars[varKeys[i]].settable,
                        messagetype: "trigger_onRequest_" + serverData.SimVars[varKeys[i]].name,
                        parameters: paramdata
                    }
                )
        }
    }

    /* uncomment to log the data structures if you are interested in the data we get from msfs */
    //file_log("SimVars", serverData.SimVars)
    //file_log("triggersandactions", triggersandactions)
    //file_log("SystemEvents", SystemEvents)

}

// ============================================================================
//                           FUNCTION: msfsapiconnect
// ============================================================================
/**
 * connect to the MSFS2020 api interface
 */
function msfsapiconnect ()
{
    if (serverConfig.msfs2020ennabled == "on")
    {
        localConfig.state.msfsconnecting = true;
        localConfig.msfs_api.connect({ onConnect: (nodeSimconnectHandle) => MSFS2020RegisterSimvars(nodeSimconnectHandle) })
            .catch(err =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".msfsapiconnect", "Connection failed. Reconnecting in", serverConfig.msfs2020SimPollInterval, "seconds");
            })

        /*    no idea how to put a handler in for recvevents :( I'll come back to this later
        console.log(localConfig.msfs_api_recveventhandler)
        if (localConfig.state.connected && localConfig.msfs_api_recveventhandler == null)
            localConfig.msfs_api.on("exception", () =>
            {
                console.log("oops recv received")
            })
            */
    }
}
// ============================================================================
//                           FUNCTION: MSFS2020Disconnect
// ============================================================================
/**
 * disconnect from the MSFS2020 interface and callbacks
 */
function MSFS2020Disconnect ()
{
    clearTimeout(localConfig.pollMSFSHandle)
    localConfig.state.msfsconnected = false
    for (let i = 0; i < serverData.EventVars.length; i++)
    {
        if (localConfig.EventCallabackHandles[serverData.EventVars[i]])
            localConfig.EventCallabackHandles[serverData.EventVars[i]]()
    }
    for (let i = 0; i < serverData.AirportVars.length; i++)
    {

        if (localConfig.EventCallabackHandles[serverData.AirportVars[i]])
            localConfig.EventCallabackHandles[serverData.AirportVars[i]]()
    }
}
// ============================================================================
//                           FUNCTION: MSFS2020RegisterSimvars
// ============================================================================
/**
 * Registers with MSFS2020 for callbacks on simvars
 * @param {object} handle simconnecnt handle
 */
async function MSFS2020RegisterSimvars (handle)
{
    try
    {
        localConfig.state.msfsconnected = true;
        localConfig.state.msfsconnecting = false;
        localConfig.msfs_api_connected_handle = handle;
        localConfig.EventHandles = []
        for (let i = 0; i < serverData.EventVars.length; i++)
        {
            localConfig.EventCallabackHandles[serverData.EventVars[i]]
                = localConfig.msfs_api.on(SystemEvents[serverData.EventVars[i]], (data) =>
                {
                    let triggertopost = findtriggerByMessageType("trigger_" + SystemEvents[serverData.EventVars[i]].name)
                    triggertopost.parameters.data = data;

                    if (data != localConfig.previousValue[serverData.EventVars[i]])
                    {
                        sr_api.sendMessage(localConfig.DataCenterSocket,
                            sr_api.ServerPacket(
                                "ChannelData",
                                serverConfig.extensionname,
                                sr_api.ExtensionPacket(
                                    "trigger_onChange_" + SystemEvents[serverData.EventVars[i]].name,
                                    serverConfig.extensionname,
                                    triggertopost,//{ index: simvarindex, data: data[simvar] },
                                    serverConfig.channel
                                ),
                                serverConfig.channel
                            ));
                        localConfig.previousValue[serverData.EventVars[i]] = data;
                    }
                    sr_api.sendMessage(localConfig.DataCenterSocket,
                        sr_api.ServerPacket(
                            "ChannelData",
                            serverConfig.extensionname,
                            sr_api.ExtensionPacket(
                                "trigger_" + SystemEvents[serverData.EventVars[i]].name,
                                serverConfig.extensionname,
                                triggertopost,//{ index: simvarindex, data: data[simvar] },
                                serverConfig.channel
                            ),
                            serverConfig.channel
                        ));
                });
        }

        /*
        this is left in as a hint if we decide to add this in future. Airports appear
        to use a different api that quick testing seemed to fail on.

         localConfig.NEARBY_AIRPORTS = await localConfig.msfs_api.get(`NEARBY_AIRPORTS`);
         //console.log(`${localConfig.NEARBY_AIRPORTS.length} nearby airports`);
     
         localConfig.ALL_AIRPORTS = await localConfig.msfs_api.get(`ALL_AIRPORTS`);
         //console.log(`${localConfig.ALL_AIRPORTS.length} total airports on the planet`);
     */
        //const airportData = await localConfig.msfs_api.get(`AIRPORT:CYYJ`);
        //console.log(JSON.stringify(airportData, null, 2));
        //console.log(JSON.stringify(await localConfig.msfs_api.get(`AIRPORT:CYYJ`), null, 2));

        /*
                console.log("AIRPORTS_IN_RANGE", AIRPORTS_IN_RANGE)
                const inRange = localConfig.msfs_api.on(AIRPORTS_IN_RANGE, (data) =>
                {
                    console.log("in range airports:", data);
                    inRange();
                });
        
                /*
                const outOfRange = localConfig.msfs_api.on(SystemEvents.AIRPORTS_OUT_OF_RANGE, (data) =>
                {
                    console.log("outOfRange",data);
                    outOfRange();
                });
                */
        if (localConfig.dumpTriggers)
            dumpTriggersActions()
    }
    catch (err)
    {
        localConfig.state.msfsconnected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".MSFS2020RegisterSimvars", "Error ", err.message);
    }
}
// ============================================================================
//                           FUNCTION: addToTriggersArray
// ============================================================================
function dumpTriggersActions ()
{
    setTimeout(() =>
    {
        file_log("", "", true)
    }, 10000);

}
// ============================================================================
//                           FUNCTION: addToTriggersArray
// ============================================================================
/**
 * Adds a simvar to our known list of names. A simvar may be an array and have an index (ie engines have an index for each engine)
 * others may not have index's
 * @param {string} name 
 * @param {number} [index=0] 
 */
function addToTriggersArray (name, index = 0)
{
    if (name.indexOf(":index") > 0)
        name = name.replace(":index", ":" + index)

    // edge case when the user doesn't have this in their datafile
    if (typeof serverData.triggersNamesArray == "undefined")
        serverData.triggersNamesArray = [];

    if (!serverData.triggersNamesArray.includes(name))
        serverData.triggersNamesArray.push(name);

    // make it alphabetical
    serverData.triggersNamesArray.sort();
}

// ============================================================================
//                           FUNCTION: postTriggers
// ============================================================================
/**
 * posts a trigger out when a given symvar fires. Will also post a "changed" trigger
 * if the value was previously different
 * possible message types posted (NAME) is the simvar name and (INDEX) is the 
 * index if an indexed simvar
 * trigger_(NAME)
 * trigger_(NAME):(INDEX)
 * trigger_onChange_(NAME)
 * trigger_onChange_(NAME):(INDEX)
 */
async function postTriggers ()
{
    let index = ""
    let simvarindex = 0
    let name = ""
    let simvar = "";
    let indexToSplit = 0;
    let data = ""
    let messageType = ""
    let onChangeMessageType = ""
    //check if connected
    if (!localConfig.state.msfsconnected)
        return;
    for (index in serverData.triggersNamesArray)
    {
        // check if we have an index (':n' part)
        if (serverData.triggersNamesArray[index].indexOf(":") > 0)
        {
            // the name will have the index attached so we need to split it up
            simvar = serverData.triggersNamesArray[index]
            indexToSplit = simvar.indexOf(':');
            name = simvar.slice(0, indexToSplit);
            simvarindex = simvar.slice(indexToSplit + 1);
            simvar = simvar.replaceAll(" ", "_")
        }
        else
        {
            name = serverData.triggersNamesArray[index]
            simvar = serverData.triggersNamesArray[index]
            simvar = simvar.replaceAll(" ", "_")
        }

        // get the simvar data
        try
        {
            data = await localConfig.msfs_api.get(simvar);
        }
        catch (err)
        {
            console.log("Error during get", err.message)
        }
        // set the message type
        if (simvar.indexOf(":") > 0)
        {
            messageType = "trigger_" + name + ":index"
            onChangeMessageType = "trigger_onChange_" + name + ":index"
        }
        else
        {
            messageType = "trigger_" + name
            onChangeMessageType = "trigger_onChange_" + name
        }

        let triggertopost = findtriggerByMessageType(messageType)
        triggertopost.parameters.index = simvarindex;
        triggertopost.parameters.data = data[simvar];

        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    messageType,
                    serverConfig.extensionname,
                    triggertopost,//{ index: simvarindex, data: data[simvar] },
                    serverConfig.channel
                ),
                serverConfig.channel
            ));
        if (localConfig.previousValue[simvar] != triggertopost.parameters.data)
        {
            let triggertopost = findtriggerByMessageType(onChangeMessageType)
            triggertopost.parameters.index = simvarindex;
            triggertopost.parameters.data = data[simvar];
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ChannelData",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        onChangeMessageType,
                        serverConfig.extensionname,
                        triggertopost,//{ index: simvarindex, data: data[simvar] },
                        serverConfig.channel
                    ),
                    serverConfig.channel
                ));
            localConfig.previousValue[simvar] = triggertopost.parameters.data
        }

    }
}
// ============================================================================
//                        FUNCTION: performActionGetLatLong
// ============================================================================
/**
 * Special simvar just for streamroller :D
 * Creates a simvar containing both lat and long rather
 * than having to create two requests actions and getting two responses back
 * @param {object} data 
 */
function performActionGetLatLong (data)
{
    let action = ""
    if (localConfig.msfs_api.connected != true)
        return;
    // Request for data, not a set
    if (data.type == "action_PLANE LATITUDE LONGITUDE_get")
    {
        try
        {
            let onRequestMessageType = "trigger_onRequest_PLANE LATITUDE LONGITUDE"
            localConfig.msfs_api.get("PLANE LATITUDE")
                .then(data =>
                {
                    let triggertopost = findtriggerByMessageType(onRequestMessageType)
                    // returned data doesn't have spaces it has underscores

                    triggertopost.parameters.lat = String(data["PLANE_LATITUDE"] * 180 / Math.PI);
                    localConfig.msfs_api.get("PLANE LONGITUDE")
                        .then(data =>
                        {
                            triggertopost.parameters.long = String(data["PLANE_LONGITUDE"] * 180 / Math.PI);
                            sr_api.sendMessage(localConfig.DataCenterSocket,
                                sr_api.ServerPacket(
                                    "ChannelData",
                                    serverConfig.extensionname,
                                    sr_api.ExtensionPacket(
                                        triggertopost.messagetype,
                                        serverConfig.extensionname,
                                        triggertopost,//{ index: simvarindex, data: data[simvar] },
                                        serverConfig.channel
                                    ),
                                    serverConfig.channel
                                ));
                        }).catch(error => console.log("ERROR:performActionGetLatLong(2): Failed to get simvar", error))
                }).catch(error => console.log("ERROR:performActionGetLatLong(1):Failed to get simvar", error))

        }
        catch (err)
        {
            console.log("ERROR:performActionGetLatLong: Error during get", err.message)
        }

    }
}
// ============================================================================
//                        FUNCTION: performAction
// ============================================================================
/**
 * An action was received to set/change a simvar or retrieve some data
 * A "trigger_onRequest_(simvarname)" will be fired on a request
 * @param {object} data 
 */
function performAction (data)
{
    let action = ""
    // Request for data, not a set
    if (data.type.indexOf("_get") > -1)
    {
        try
        {
            let simvar = data.type.replace("action_", "").replace("_get", "")
            let onRequestMessageType = "trigger_onRequest_" + simvar
            localConfig.msfs_api.get(simvar)
                .then(data =>
                {
                    let triggertopost = findtriggerByMessageType(onRequestMessageType)
                    // returned data doesn't have spaces it has underscores
                    simvar = simvar.replaceAll(" ", "_")
                    triggertopost.parameters.data = data[simvar];
                    sr_api.sendMessage(localConfig.DataCenterSocket,
                        sr_api.ServerPacket(
                            "ChannelData",
                            serverConfig.extensionname,
                            sr_api.ExtensionPacket(
                                triggertopost.messagetype,
                                serverConfig.extensionname,
                                triggertopost,//{ index: simvarindex, data: data[simvar] },
                                serverConfig.channel
                            ),
                            serverConfig.channel
                        ));
                }).catch(error => console.log("ERROR:performAction: Failed to get simvar", error))

        }
        catch (err)
        {
            console.log("ERROR:performAction: Error during get", err.message)
        }

    } else
    {
        try
        {
            action = data.type.replace("action_", "")
            if (action.indexOf(":index") > 0)
                action = action.replace("index", data.data.index)
            localConfig.msfs_api.set(action, data.data.data)
        }
        catch (err)
        {
            console.log("ERROR:performAction ", err.message)
        }
    }
}
// ============================================================================
//                           FUNCTION: pollMSFS
// ============================================================================
/**
 * Poll MSFS for data we are monitoring for
 */
function pollMSFS ()
{
    clearTimeout(localConfig.pollMSFSHandle);
    if (serverConfig.msfs2020ennabled == "on")
        postTriggers();
    localConfig.pollMSFSHandle = setTimeout(pollMSFS, serverConfig.msfs2020SimPollInterval * 1000)
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * Sends a list of our current triggers/actions ot the given extension
 * @param {string} to 
 */
function sendTriggersAndActions (to)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "TriggerAndActions",
                serverConfig.extensionname,
                triggersandactions,
                "",
                to
            ),
            "",
            to
        )

    )
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * Finds a specific trigger from the given name
 * @param {string} messagetype 
 */
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return structuredClone(triggersandactions.triggers[i]);
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: file_log
//              For debug purposes. logs message data to file
// ============================================================================
let filestreams = [];
let basedir = "msfsdata/";
function file_log (type, data, apidoc = false)
{
    try
    {
        if (apidoc)
        {
            let filename = serverConfig.extensionname + "_apidoctriggers.json"
            fs.writeFileSync(filename, JSON.stringify(triggersandactions, null, 2), {
                encoding: "utf8",
                flag: "w+",
            });
        }
        else
        {
            //console.log("file_log", type, tags, message)

            var newfile = false;
            var filename = "__noname__";
            var buffer = "\n//#################################\n";
            // sometimes tags are a string, lets create an object for it to log
            if (typeof tags != "object")
                data = { data: data }
            if (!fs.existsSync(basedir))
            {
                newfile = true;
                fs.mkdirSync(basedir, { recursive: true });
            }

            // check if we already have this handler
            if (!filestreams.type)
            {

                filename = type;
                filestreams[type] = fs.createWriteStream(basedir + filename + ".js", { flags: 'a' });

            }
            if (newfile)
            {
                buffer += "let " + type + ";\n";
                buffer += "let message=" + JSON.stringify(data, null, 2) + "\n"
            }
            else
                buffer += "let message=" + JSON.stringify(data, null, 2) + "\n"

            filestreams[type].write(buffer);
            //bad coding but can't end it here (due to async stuff) and it is just debug code (just left as a reminder we have a dangling pointer)
            filestreams[type].end("")
        }

    }
    catch (error)
    {
        console.log("debug file logging crashed", error.message)
    }
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * waits for config and credentials files to set ready flag
 */
function startupCheck ()
{
    const allReady = Object.values(localConfig.readinessFlags).every(flag => flag);
    if (allReady)
    {
        localConfig.ready = true;
        try
        {
            postStartupActions();
            // perform any startup stuff here that requires saved credentials and config
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
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

