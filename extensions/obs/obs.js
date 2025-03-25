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
// ############################# OBS.js ##############################
// OBS extension for controlling OBS and information on OBS
// output channel OBS_CHANNEL
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 22-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// ----------------------------- notes ----------------------------------------
// ============================================================================
/**
 * @extension OBS
 * Connects to Open Broadcasting Software to allow control/events to be processed.
 * <span style="color:red">Note needs triggers and actions updated as a lot of messages are currently
 * not in the trigger/action list</span>
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));
// local config
const localConfig = {
    OUR_CHANNEL: "OBS_CHANNEL",
    EXTENSION_NAME: "obs",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    obsConnection: null,
    obsConnecting: false,
    obsTimeoutHandle: null,
    channelConnectionAttempts: 20,
    OBSAvailableScenes: null,// shorthand scene list 
    sceneList: { current: "", main: [], secondary: [], rest: [] },// full organised list for sending to other extensions
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false, // are we connected to obs
        currentscene: ""
    },
    streamStats: {
        renderSkippedFrames: 0,
        renderTotalFrames: 0,
        outputBytes: 0,
        outputDuration: 0,
        outputCongestion: 0,
        outputSkippedFrames: 0,
        outputTotalFrames: 0

    }
};
//sever config (stuff we want to save over runs)
const default_serverConfig = {
    __version__: 0.2,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enableobs: "off",
    mainsceneselector: "##",
    secondarysceneselector: "**",
    obs_restore_defaults: "off",
    //credentials variable names to use (in credentials modal)
    credentialscount: "3",
    cred1name: "obshost",
    cred1value: "localhost",
    cred2name: "obsport",
    cred2value: "4444",
    cred3name: "obspass",
    cred3value: "",
};
let localCredentials = {};
let serverConfig = structuredClone(default_serverConfig);
/* other options to look to add, not the complete list available (from types.d.ts )

SetVideoSettings
SetStreamServiceSettings
TriggerHotkeyByName
TriggerHotkeyByKeySequence
SetInputVolume
SetInputAudioBalance
SetInputAudioSyncOffset
SetInputAudioMonitorType
SetInputAudioTracks
PressInputPropertiesButton
TriggerMediaInputAction
ToggleOutput
StartOutput
StopOutput
SetOutputSettings
CreateSceneItem
SetSceneItemTransform
SetSceneItemLocked
SetSceneItemIndex
SetSceneItemBlendMode
SetCurrentProgramScene
SetSceneSceneTransitionOverride
SaveSourceScreenshot
SetCurrentSceneTransition
SetCurrentSceneTransitionDuration
SetCurrentSceneTransitionSettings
TriggerStudioModeTransition
SetStudioModeEnabled
CallVendorRequest
GetVideoSettings
*/
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "OBS (Open Broadcaster Software) is a free and open source software for video recording and live streaming",
    // these are messages we can sendout that other extensions might want to use to trigger an action
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "OBSStreamingStarted",
                displaytitle: "Stream Started",
                description: "Stream Started",
                messagetype: "trigger_StreamStarted",
                parameters: {}
            },
            {
                name: "OBSStreamingStopped",
                displaytitle: "Stream Stopped",
                description: "Stream Stopped",
                messagetype: "trigger_StreamStopped",
                parameters: {}
            },
            {
                name: "OBSSceneChanged",
                displaytitle: "Scene Changed",
                description: "Scene was changed",
                messagetype: "trigger_SceneChanged",
                parameters: { sceneName: "" }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "OBSStartStream",
                displaytitle: "StartOBSStream",
                description: "Start Streaming in OBS",
                messagetype: "action_StartStream",
                parameters: {
                    triggerActionRef: "obs",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "OBSStopStream",
                displaytitle: "StopsOBSStream",
                description: "Stop Streaming in OBS",
                messagetype: "action_StopStream",
                parameters: {
                    triggerActionRef: "obs",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "OBSToggleFilter",
                displaytitle: "Toggle Filter",
                description: "Enable/Disable a filter (true/false)",
                messagetype: "action_ToggleFilter",
                parameters: { sourceName: "", filterName: "", filterEnabled: "" }
            },
            {
                name: "OBSChangeScene",
                displaytitle: "Change Scene",
                description: "Switch to the OBS scene provided by sceneName",
                messagetype: "action_ChangeScene",
                parameters: { sceneName: "", enabled: "" }
            },
            {
                name: "OBSEnableSource",
                displaytitle: "Turn a source on or off",
                description: "Turn a source on or off, ie to enable animations, cameraas etc",
                messagetype: "action_EnableSource",
                parameters: { sceneName: "", sourceName: "", enabled: "" }
            },
            {
                name: "OBSToggleMute",
                displaytitle: "Toggle mute on the selected source",
                description: "Toggles mute on the source selected, suggest that mic is put in to it's own scene and imported into all others to make this universal",
                messagetype: "action_ToggleMute",
                parameters: { sourceName: "", enabled: "" }
            },
            {
                name: "OBSSetSceneItemTransform",
                displaytitle: "Set Scene Item Transform",
                description: "Sets the Scene Transform for a given item (note rotation respects the alignment in OBS. It's recommneded to set alightment in OBS to center)",
                messagetype: "action_SetSceneItemTransform",
                parameters: {
                    sceneName: "",
                    sourceName: "",
                    alignment: "",
                    boundsAlignment: "",
                    boundsHeight: "",
                    boundsType: "",
                    boundsWidth: "",
                    cropBottom: "",
                    cropLeft: "",
                    cropRight: "",
                    cropTop: "",
                    height: "",
                    positionX: "",
                    positionY: "",
                    rotation: "",
                    scaleX: "",
                    scaleY: "",
                    sourceHeight: "",
                    sourceWidth: "",
                    width: ""
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
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "connection failed:", err.message);
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
 * Called on connection to the StreamRoller server
 */
function onDataCenterConnect ()
{
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    // Create/Join the channels we need for this
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );

    // clear the previous timeout if we have one
    clearTimeout(localConfig.heartBeatHandle);
    // start our heatbeat timer
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
    try
    {
        if (server_packet.type === "ConfigFile")
        {
            if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
            {
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Received config");
                if (server_packet.data.__version__ != default_serverConfig.__version__)
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                }
                else
                    serverConfig = structuredClone(server_packet.data);
                SaveConfigToServer();
            }
        }
        else if (server_packet.type === "CredentialsFile")
        {
            if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != "")
            {
                localCredentials.cred1value = server_packet.data.obshost;
                localCredentials.cred2value = server_packet.data.obsport;
                localCredentials.cred3value = server_packet.data.obspass;
                if (localConfig.obsConnecting == false && serverConfig.enableobs == "on")
                    connectToObs();
            }
        }
        else if (server_packet.type === "ExtensionMessage")
        {
            let extension_packet = server_packet.data
            if (extension_packet.type === "RequestSettingsWidgetSmallCode")
                SendSettingsWidgetSmall(extension_packet.from);
            else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
                SendSettingsWidgetLarge(extension_packet.from);
            else if (extension_packet.type === "RequestCredentialsModalsCode")
                SendCredentialsModal(extension_packet.from);
            else if (extension_packet.type === "SettingsWidgetSmallData")
            {
                if (extension_packet.to === serverConfig.extensionname)
                {
                    // if we have enabled/disabled obs connection
                    if (serverConfig.enableobs != extension_packet.data.enableobs)
                    {
                        //we are currently enabled so lets disconnect
                        if (serverConfig.enableobs == "on")
                        {
                            serverConfig.enableobs = "off";
                            clearTimeout(localConfig.obsTimeoutHandle)
                            disconnectObs()
                        }
                        //currently disabled so connect to obs
                        else
                        {
                            serverConfig.enableobs = "on";
                            connectToObs();
                        }
                    }

                    serverConfig.enableobs = "off";
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;
                    SaveConfigToServer();
                    if (localConfig.OBSAvailableScenes != null)
                        processOBSSceneList(localConfig.OBSAvailableScenes);
                    sendScenes();
                }
                //update anyone who is showing our code at the moment
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
            else if (extension_packet.type === "SettingsWidgetLargeData")
            {
                if (extension_packet.to === serverConfig.extensionname)
                {
                    // reset to defaults
                    if (extension_packet.data.obs_restore_defaults == "on")
                    {
                        serverConfig = structuredClone(default_serverConfig);
                        // Request our credentials from the server as we are storing them in our serverconfig
                        sr_api.sendMessage(localConfig.DataCenterSocket,
                            sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
                    }
                    else
                    {
                        //copy the data across
                        serverConfig.enableobs = "off";
                        for (const [key, value] of Object.entries(extension_packet.data))
                            serverConfig[key] = value;
                        SaveConfigToServer();

                        if (localConfig.OBSAvailableScenes != null)
                            processOBSSceneList(localConfig.OBSAvailableScenes);
                        sendScenes();

                        // if we have enabled/disabled obs connection
                        if (serverConfig.enableobs != extension_packet.data.enableobs)
                        {
                            //we are currently enabled so lets disconnect
                            if (serverConfig.enableobs == "on")
                            {
                                serverConfig.enableobs = "off";
                                clearTimeout(localConfig.obsTimeoutHandle)
                                disconnectObs()
                            }
                            //currently disabled so connect to obs
                            else
                            {
                                serverConfig.enableobs = "on";
                                connectToObs();
                            }
                        }
                    }
                    //update anyone who is showing our code at the moment
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
            }
            else if (extension_packet.type === "RequestScenes")
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("ExtensionMessage",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "ScenesList",
                            serverConfig.extensionname,
                            localConfig.sceneList,
                            "",
                            server_packet.from
                        ),
                        "",
                        server_packet.from
                    )
                )
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
            else if (extension_packet.type === "action_StartStream")
            {
                if (serverConfig.enableobs == "on")
                    startStream(extension_packet.data);
            }
            else if (extension_packet.type === "action_StopStream")
            {
                if (serverConfig.enableobs == "on")
                    stopStream(extension_packet.data);
            }
            else if (extension_packet.type === "action_EnableSource")
            {
                if (serverConfig.enableobs == "on")
                    enableSource(extension_packet.data);
            }
            else if (extension_packet.type === "action_ChangeScene")
            {
                if (serverConfig.enableobs == "on")
                    changeScene(extension_packet.data);
            }
            else if (extension_packet.type === "action_ToggleMute")
            {
                if (serverConfig.enableobs == "on")
                    ToggleMute(extension_packet.data)
            }
            else if (extension_packet.type === "action_ToggleFilter")
            {
                if (serverConfig.enableobs == "on")
                    activateFilter(extension_packet.data)
            }
            else if (extension_packet.type === "action_SetSceneItemTransform")
            {
                if (serverConfig.enableobs == "on")
                    setSceneItemTransform(extension_packet.data)
            }
            else
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "unhandled ExtensionMessage ", server_packet);
        }
        else if (server_packet.type === "UnknownChannel")
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage UnknownChannel,scheduling rejoin", server_packet);
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", serverConfig.extensionname, server_packet.data
                    ));
            }, 5000);

        }    // we have received data from a channel we are listening to
        else if (server_packet.type === "ChannelData")
        {
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
        )
        {
            //logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage Not handling", server_packet.type);
            // just a blank handler for items we are not using to avoid message from the catchall
        }
        // ------------------------------------------------ unknown message type received -----------------------------------------------
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".onDataCenterMessage", "Unhandled message type", server_packet.data.error);
    } catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Error", error.message);

    }
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} toextension 
 */
function SendSettingsWidgetSmall (toextension)
{
    // read our modal file
    fs.readFile(__dirname + "/obssettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        serverConfig.channel,
                        toextension

                    ),
                    serverConfig.channel,
                    toextension
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendSettingsWidgetLarge (tochannel)
{
    // read our modal file
    fs.readFile(__dirname + "/obssettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
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
                        tochannel,
                        serverConfig.channel
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{
    fs.readFile(__dirname + "/obscredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();

            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        extensionname,
                        serverConfig.channel
                    ),
                    "",
                    extensionname)
            )
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * save config file to the server
 */
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket(
        "SaveConfig",
        serverConfig.extensionname,
        serverConfig))
}
// ############################################################################
// ============================================================================
//                             OBS websockets
// ============================================================================
// ############################################################################
import OBSWebSocket from "obs-websocket-js";
localConfig.obsConnection = new OBSWebSocket();
// ============================================================================
//                           FUNCTION: connectToObs
// ============================================================================
/**
 * connects to the obs server
 */
function connectToObs ()
{
    // check we have connection details.
    if (localCredentials.cred1value != "" && localCredentials.cred2value != "" && localCredentials.cred3value != "" && localCredentials.cred1value != null && localCredentials.cred2value != null && localCredentials.cred3value != null &&
        serverConfig.enableobs == "on" && localConfig.status.connected == false)
    {
        localConfig.obsConnecting = true
        localConfig.obsConnection.connect("ws://" + localCredentials.cred1value + ":" + localCredentials.cred2value, localCredentials.cred3value)
            .then(data =>
            {
                // we are now connected so stop any further scheduling
                localConfig.obsConnecting = false
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs", "OBS Connected (v" + data.obsWebSocketVersion + ")");

                return localConfig.obsConnection.call("GetCurrentProgramScene", null)
                    .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "GetCurrentProgramScene failed", err.message); });

            })
            .then(data =>
            {
                localConfig.sceneList.current = data.currentProgramSceneName;
                return localConfig.obsConnection.call("GetSceneList")
                    .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "GetSceneList failed", err.message); });
            })
            .then(data =>
            {
                try
                {
                    processOBSSceneList(data.scenes);
                    sendScenes();
                }
                catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs create scenes list", err.message); }
            })
            .catch((err) =>
            {
                localConfig.status.connected = false;
                //Need to setup a reschedule if we have a connection failure
                if (serverConfig.enableobs == "on")
                {
                    logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "Failed to connect to OBS, scheduling reconnect", err.message);
                    localConfig.obsConnecting = true
                    clearTimeout(localConfig.obsTimeoutHandle)
                    localConfig.obsTimeoutHandle = setTimeout(() =>
                    {
                        connectToObs();
                    }, 5000);
                }
            })

    }
    else
    {
        localConfig.status.connected = false;
        if (serverConfig.enableobs == "off")
        {
            logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", " Trying to connect while turned off by user");
        }
        else if (localCredentials.cred1value == "" || localCredentials.cred2value == "" || localCredentials.cred3value == ""
            || localCredentials.cred1value == null || localCredentials.cred2value == null || localCredentials.cred3value == null)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "Failed to connect to OBS, missing credentials");
        }
        else
        {
            if (localConfig.status.connected == true)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "Failed to connect to OBS (already connected?)");
            else
            {
                //Need to setup a reschedule if we have a connection failure
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "FAILED: check code logic, shouldn't reach this point");
                localConfig.obsConnecting = true
                clearTimeout(localConfig.obsTimeoutHandle)
                localConfig.obsTimeoutHandle = setTimeout(() =>
                {
                    connectToObs();
                }, 10000);
            }
        }
    }
}
// ============================================================================
//                           FUNCTION: disconnectObs
// ============================================================================
/**
 * disconnect obs
 */
function disconnectObs ()
{
    localConfig.status.connected = false;
    localConfig.obsConnection.disconnect();
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".disconnectObs ", "disconnected from OBS");
}
// ============================================================================
//                FUNCTION: StreamRoller Request Handlers
// ============================================================================
// see the following link for possibly handlers
// https://gist.github.com/lee-brown/70e6014a903dfea9e2dfe7e35fc8ab88
// example
// https://www.npmjs.com/package/@streamdasher/obs-websocket-js
/*
An OBS scene will contain the following
    {
      alignment: 5,
      cx: 1260,
      cy: 709,
      id: 301,
      locked: true,
      muted: false,
      name: 'NS-POPUPS',
      render: true,
      source_cx: 2560,
      source_cy: 1440,
      type: 'scene',
      volume: 1,
      x: 705,
      y: 0
    },
 
Stats message
{
  'average-frame-time': 1.452454,
  'bytes-per-sec': 586327,
  'cpu-usage': 2.049031889024745,
  fps: 30.000000300000007,
  'free-disk-space': 515068.38671875,
  'kbits-per-sec': 4580,
  'memory-usage': 1437.1171875,
  'num-dropped-frames': 0,
  'num-total-frames': 45743,
  'output-skipped-frames': 2,
  'output-total-frames': 91593,
  'preview-only': false,
  recording: false,
  'recording-paused': false,
  'render-missed-frames': 120,
  'render-total-frames': 54921,
  'replay-buffer-active': true,
  strain: 0,
  'stream-timecode': '00:25:24.766',
  streaming: true,
  'total-stream-time': 1524,
  'update-type': 'StreamStatus',
  averageFrameTime: 1.452454,
  bytesPerSec: 586327,
  cpuUsage: 2.049031889024745,
  freeDiskSpace: 515068.38671875,
  kbitsPerSec: 4580,
  memoryUsage: 1437.1171875,
  numDroppedFrames: 0,
  numTotalFrames: 45743,
  outputSkippedFrames: 2,
  outputTotalFrames: 91593,
  previewOnly: false,
  recordingPaused: false,
  renderMissedFrames: 120,
  renderTotalFrames: 54921,
  replayBufferActive: true,
  streamTimecode: '00:25:24.766',
  totalStreamTime: 1524,
  updateType: 'StreamStatus'
}
 
 
*/
// ============================================================================
//                           FUNCTION: processOBSSceneList
// ============================================================================
/**
 * process a new list of scenes from OBS
 * @param {object} scenes 
 */
function processOBSSceneList (scenes)
{
    try
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".processOBSSceneList", scenes);
        localConfig.OBSAvailableScenes = scenes;
        localConfig.sceneList.main = [];
        localConfig.sceneList.secondary = [];
        localConfig.sceneList.rest = [];
        scenes.forEach(scene =>
        {
            // console.log(scene)
            //if (scene.sceneName !== "currentProgramSceneName:")
            // {
            if (scene.sceneName.startsWith(serverConfig.mainsceneselector))
                localConfig.sceneList.main.push({
                    displayName: scene.sceneName.replace(serverConfig.mainsceneselector, ""),
                    sceneName: scene.sceneName
                }
                )
            else if (scene.sceneName.startsWith(serverConfig.secondarysceneselector))
                localConfig.sceneList.secondary.push(
                    {
                        displayName: scene.sceneName.replace(serverConfig.secondarysceneselector, ""),
                        sceneName: scene.sceneName,
                    }
                )
            else
                localConfig.sceneList.rest.push({ displayName: scene.sceneName, sceneName: scene.sceneName, muted: scene.muted })
            // }
        })
        // get the filters for each scene and add to the filters list
        getFilters();
    } catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".processOBSSceneList", "Failed to process scene list", err.message); }
}

// ============================================================================
//                           FUNCTION: startStream
// ============================================================================
/**
 * Starts OBS streaming
 * @param {string} extension_data 
 */
function startStream (extension_data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startStream", " starting Stream ", extension_data.triggerActionRef);
    localConfig.obsConnection.call("StartStream", {})
        .then(() =>
        {
            StreamStarted()
        })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startStream ", "startStream failed", err.message); });

}
// ============================================================================
//                           FUNCTION: stopStream
// ============================================================================
/**
 * Stops  OBS streaming
 * @param {string} scene 
 */
function stopStream (extension_data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".stopStream", " stopping Stream ", extension_data.triggerActionRef);
    localConfig.obsConnection.call("StopStream", {})
        .then(() =>
        {
            StreamStarted()
        })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".stopStream ", "stopStream failed", err.message); });
}
// ============================================================================
//                           FUNCTION: changeScene
// ============================================================================
/**
 * Changes OBS to the given scene
 * @param {string} scene 
 */
function changeScene (scene)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".changeScene", " request come in. changing to ", scene);
    localConfig.obsConnection.call("SetCurrentProgramScene", { sceneName: scene })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".changeScene ", "SetCurrentProgramScene failed", err.message); });
}
// ============================================================================
//                           FUNCTION: changeScene
// ============================================================================
/**
 * Enables/unhides a source in OBS
 * @param {object} sourcedata 
 */
function enableSource (sourcedata)
{
    localConfig.obsConnection.call("GetSceneItemId", { sceneName: sourcedata.sceneName, sourceName: sourcedata.sourceName })
        .then(data =>
        {
            localConfig.obsConnection.call("SetSceneItemEnabled",
                {
                    sceneName: sourcedata.sceneName,
                    sceneItemId: data.sceneItemId,
                    sceneItemEnabled: sourcedata.enabled.toLowerCase() == "true"
                })
                .catch(err => 
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".enableSource ", "SetSceneItemEnabled failed", err.message);
                });
        })
        .catch(err =>
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".enableSource", err.message);
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".enableSource", err);
            if (err.message === "Not connected")
                localConfig.status.connected = false;
            return;
        });
}


// ============================================================================
//                           FUNCTION: Callback Handlers
// ============================================================================
localConfig.obsConnection.on("StreamStateChanged", data => { onStreamStatus(data); });
localConfig.obsConnection.on("GetVersion", data => { logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".OBS 'GetVersion' received", data) });
localConfig.obsConnection.on("CurrentProgramSceneChanged", data => { onSwitchedScenes(data) });
localConfig.obsConnection.on("SceneListChanged", data => { onScenesListChanged(data) });
localConfig.obsConnection.on("InputMuteStateChanged", data => { onSourceMuteStateChanged(data) });
localConfig.obsConnection.on("Filters", data => { onSourceMuteStateChanged(data) });
localConfig.obsConnection.on("SourceFilterEnableStateChanged", data => { onFilterChanged(data) })

/*
{
    code left in for example purposes. If you use this be careful of overloading 
    the websockets with the amount of data.
    Normally used for meters
    To use this high volume event turn it on be using 
    either import EventSubscription enum or use
    2047 or ALL and or (|) it with
    65536 for subscribing to InputVolumeMeters
    ie eventSubscriptions: 2047 | 2047
    
    await obs.reidentify({
        eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters
        });
    
       
}*/
localConfig.obsConnection.on('InputVolumeMeters', (data) =>
{
    let index = 1//MIC-B1 with current setup.
    //console.log('InputVolumeMeters callback', data.inputs)
    //console.log('InputVolumeMeters callback', data.inputs[index].inputName);
    console.log('InputVolumeMeters callback', data.inputs[index].inputLevelsMul);
})

// debug, not sure if we want to add these yet
/*
localConfig.obsConnection.on("MediaInputPlaybackStarted", data => { debugtest("MediaInputPlaybackStarted", data) })
localConfig.obsConnection.on("MediaInputPlaybackEnded", data => { debugtest("MediaInputPlaybackEnded", data) })
//localConfig.obsConnection.on("MediaInputActionTriggered", data => { debugtest("MediaInputActionTriggered", data) })
localConfig.obsConnection.on("RecordStateChanged", data => { debugtest("RecordStateChanged", data) })

localConfig.obsConnection.on("ReplayBufferStateChanged", data => { debugtest("ReplayBufferStateChanged", data) })
localConfig.obsConnection.on("SceneItemCreated", data => { debugtest("SceneItemCreated", data) })
localConfig.obsConnection.on("SceneItemRemoved", data => { debugtest("SceneItemRemoved", data) })
localConfig.obsConnection.on("SceneCreated", data => { debugtest("SceneCreated", data) })
localConfig.obsConnection.on("CurrentProgramSceneChanged", data => { debugtest("CurrentProgramSceneChanged", data) })
localConfig.obsConnection.on("CurrentPreviewSceneChanged", data => { debugtest("CurrentPreviewSceneChanged", data) })
localConfig.obsConnection.on("CurrentSceneTransitionChanged", data => { debugtest("CurrentSceneTransitionChanged", data) })
localConfig.obsConnection.on("SceneTransitionStarted", data => { debugtest("MediaInputActionTriggered", data) })
localConfig.obsConnection.on("SceneTransitionEnded", data => { debugtest("SceneTransitionEnded", data) })
localConfig.obsConnection.on("SceneTransitionVideoEnded", data => { debugtest("SceneTransitionVideoEnded", data) })
localConfig.obsConnection.on("StudioModeStateChanged", data => { debugtest("StudioModeStateChanged", data) })
localConfig.obsConnection.on("ScreenshotSaved", data => { debugtest("ScreenshotSaved", data) })
localConfig.obsConnection.on("VendorEvent", data => { debugtest("VendorEvent", data) })
localConfig.obsConnection.on("CustomEvent", data => { debugtest("CustomEvent", data) })


function debugtest (callback, data)
{
    console.log("obs:debugtest ", callback, data)
}
*/
// ============================================================================
//                           FUNCTION: obs error
// ============================================================================
localConfig.obsConnection.on("error", err => 
{
    localConfig.status.connected = false;
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".OBS error message received", err.message);
});

// ============================================================================
//                           FUNCTION: onStreamStatus
// ============================================================================
/**
 * Callback from OBS on the status of the stream
 * @param {object} data 
 */
function onStreamStatus (data)
{
    // monitor this so we can check if we have connection for the heartbeat(ie are we still receiving data)
    localConfig.status.connected = true;
    localConfig.streamStats.obslive = data.outputActive;

    if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STARTED")
        StreamStarted()
    else if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPED")
        StreamStopped()
}
// ============================================================================
//                           FUNCTION: sendStreamStats
// ============================================================================
/**
 * Sends out an OBSStats message on our channel containing the status of OBS
 * @param {object} data 
 */
function sendStreamStats (data)
{
    // monitor this so we can check if we have connection for the heartbeat(ie are we still receiving data)
    localConfig.status.connected = true;

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "OBSStats",
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel)
    )
}
// ============================================================================
//                           FUNCTION: onScenesListChanged
// ============================================================================
/**
 * Callback from OBS that scenes have changed
 * @param {object} data 
 */
function onScenesListChanged (data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onScenesListChanged", "OBS scenes list has changed");
    processOBSSceneList(data.scenes);
    // send the scenes list on our channel
    sendScenes();
}
// ============================================================================
//                           FUNCTION: onSwitchedScenes
// ============================================================================
/**
 * handles onSceneChanged callback
 * @param {Scene} scene 
 */
function onSwitchedScenes (scene)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onSwitchedScenes", "OBS scene changed ", scene);
    localConfig.sceneList.current = scene.sceneName;
    // send back the triger with the scnen name added
    let data = findtriggerByMessageType("trigger_SceneChanged")
    data.parameters.sceneName = scene.sceneName;

    // send the information out on our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_SceneChanged",
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel)
    )

}
// ============================================================================
//                           FUNCTION: StreamStopped
// ============================================================================
/**
 * Called when the stream is stopped
 */
function StreamStopped ()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".StreamStopped");
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_StreamStopped",
                serverConfig.extensionname,
                findtriggerByMessageType("trigger_StreamStopped"),
                serverConfig.channel),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: StreamStarted
// ============================================================================
/**
 * Called when the stream is started
 */
function StreamStarted ()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".StreamStarted");
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_StreamStarted",
                serverConfig.extensionname,
                findtriggerByMessageType("trigger_StreamStarted"),
                serverConfig.channel),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: onOBSScenes
// ============================================================================
/**
 * Sends out a scenes list message ScenesList (triggered by the get scenes call)
 */
function sendScenes ()
{
    // lets add the deliminatores we currently are using before sending it out
    localConfig.sceneList.mainsceneselector = serverConfig.mainsceneselector;
    localConfig.sceneList.secondarysceneselector = serverConfig.secondarysceneselector;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "ScenesList",
                serverConfig.extensionname,
                localConfig.sceneList,
                serverConfig.channel
            ),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: ToggleMute
// ============================================================================
/**
 * Toggles OBS mute using a scene containing the microphone that is used in all
 * other scenes needing the mic in them
 * @param {object} data 
 */
function ToggleMute (data)
{
    if (data.enabled == "true" || data.enabled == "false")
    {
        // set mute to true of false
        localConfig.obsConnection.call("SetInputMute", { inputName: data.sourceName, inputMuted: data.enabled.toLowerCase() == "true" })
            .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".SetInputMute ", "SetInputMute failed", err.message); });
    }
    else
    {
        // toggle mute
        localConfig.obsConnection.call("ToggleInputMute", { inputName: data.sourceName })
            .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".ToggleMute ", "ToggleInputMute failed", err.message); });
    }
    localConfig.obsConnection.call("GetInputMute", { inputName: data.sourceName })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".ToggleMute ", "GetInputMute failed", err.message); });
}
// ============================================================================
//                           FUNCTION: SourceMuteStateChanged
// ============================================================================
/**
 * Callback from OBS when the mute option changes
 * @param {object} data 
 */
function onSourceMuteStateChanged (data)
{
    logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".OBS 'SourceMuteStateChanged' received", data)
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "MuteStatus",
                serverConfig.extensionname,
                {
                    scene: data.inputName,
                    muted: data.inputMuted
                },
                serverConfig.channel),
            serverConfig.channel
        ));
}

// ============================================================================
//                           FUNCTION: getFilters
// ============================================================================
/**
 * Get all the filters for scenes 
 */
async function getFilters ()
{
    if (typeof localConfig.obsConnection.socket != "undefined" && localConfig.obsConnection.socket._socket == null)
    {
        // if resetarting this might get called too soon
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getFilters", "Sockect not ready, rescheduling");
        setTimeout(() =>
        {
            getFilters();
            sendScenes();
        }, 50);
        return
    }

    localConfig.OBSAvailableScenes.forEach((sceneName) =>
    {
        localConfig.obsConnection.call("GetSourceFilterList", { sourceName: sceneName.sceneName })
            .then(data =>
            {
                if (data.filters.length > 0)
                {
                    // lets add this data to our scenes object so other extensions can see it
                    // we have three sections in this array (I know, this is an annoying choice 
                    // but it seemed to makes sense originally )
                    for (const entry in localConfig.sceneList.main) 
                    {
                        if (localConfig.sceneList.main[entry].sceneName === sceneName.sceneName)
                        {
                            localConfig.sceneList.main[entry]["filters"] = data.filters;
                            return;
                        }
                    }
                    for (const entry in localConfig.sceneList.secondary) 
                    {
                        if (localConfig.sceneList.secondary[entry].sceneName === sceneName.sceneName)
                        {
                            localConfig.sceneList.secondary[entry]["filters"] = data.filters;
                            return;
                        }
                    }
                    for (const entry in localConfig.sceneList.rest) 
                    {
                        if (localConfig.sceneList.rest[entry].sceneName === sceneName.sceneName)
                        {
                            localConfig.sceneList.rest[entry]["filters"] = data.filters;
                            return;
                        }
                    }
                }
            })
            .catch(err =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getFilters", "getFilters:", err.message);
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getFilters", "getFilters:", err);
                if (err.message === "Not connected")
                    localConfig.status.connected = false;
                return;
            });
    })
}
// ============================================================================
//                           FUNCTION: activateFilter
// ============================================================================
/**
 * Hide/unhide a filter on an obs sourceName
 * @param {object} data  {sourceName, filterName, filterEnabled}
 */
function activateFilter (data)
{
    /*if (data.filterEnabled === "")
    {
        console.log("activateFilter", findSceneData(data.sceneName))
    }
    */
    // value could be a string and even capitalized. This is typed in by a streamer after all :P
    let isTrueSet = /^true$/i.test(data.filterEnabled)

    localConfig.obsConnection.call("SetSourceFilterEnabled",
        {
            sourceName: data.sourceName,//"#4x3_Cam",
            filterName: data.filterName, //"mycolorCorrection",
            filterEnabled: isTrueSet  // true or false
        }).catch((e) =>
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".activateFilter", "Error:", e.message);
        })
}
// ============================================================================
//                           FUNCTION: setSceneItemTransform
// ============================================================================
/**
 * Change the transform parameters for a given scene
 * @param {object} requestData {
    alignment, boundsAlignment, boundsHeight, 
    boundsType, boundsWidth, cropBottom, cropLeft, cropRight, cropTop, 
    height, positionX, positionY, rotation, scaleX, scaleY, sourceHeight, 
    sourceWidth, width}
 */
function setSceneItemTransform (requestData)
{
    /* example
    sceneItemTransform: {
    alignment: 5, // alignment of 0 is centered
    boundsAlignment: 0,
    boundsHeight: 0,
    boundsType: 'OBS_BOUNDS_NONE',
    boundsWidth: 0,
    cropBottom: 0,
    cropLeft: 0,
    cropRight: 0,
    cropTop: 0,
    height: 264,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    sourceHeight: 264,
    sourceWidth: 640,
    width: 640
  }
 */
    // ******************************************************
    // get the scene id for the source/scene combo sent
    // ******************************************************
    localConfig.obsConnection.call("GetSceneItemId", { sceneName: requestData.sceneName, sourceName: requestData.sourceName })
        .then(scentItemIdData =>
        {
            // ******************************************************
            // get the Transform for the source/scene combo sent
            // ******************************************************
            localConfig.obsConnection.call("GetSceneItemTransform", {
                sceneName: requestData.sceneName,
                sourceName: requestData.sourceName,
                sceneItemId: scentItemIdData.sceneItemId
            }).then(itemTansform =>
            {
                for (const entry in requestData) 
                {
                    if (requestData[entry] && requestData[entry] !== "")
                        itemTansform[entry] = Number(requestData[entry]);
                }
                // ******************************************************
                // Set the user data in the Transform
                // ******************************************************
                localConfig.obsConnection.call("SetSceneItemTransform", {
                    sceneName: requestData.sceneName,
                    sceneItemId: scentItemIdData.sceneItemId,
                    sceneItemTransform: itemTansform
                }).catch(err => 
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "SetSceneItemEnabled.GetSceneItemTransform failed", err.message);
                });
            })
                .catch(err => 
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "SetSceneItemEnabled.SetSceneItemEnabled failed", err.message);
                });
        })
        .catch(err =>
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".setSceneItemTransform.GetSceneItemId", err.message);
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".setSceneItemTransform.GetSceneItemId", err);
            if (err.message === "Not connected")
                localConfig.status.connected = false;
            return;
        });
}

// ============================================================================
//                           FUNCTION: onFilterChanged
//                      update our filter list and send out our scenes list
// ============================================================================
/**
 * Callback from OBS that a filter has changed
 * @param {object} data 
 */
function onFilterChanged (data)
{
    // find the filter
    for (const entry in localConfig.sceneList.main) 
    {
        if (localConfig.sceneList.main[entry].sceneName === data.sourceName)
        {
            for (let i = 0; i < localConfig.sceneList.main[entry].filters.length; i++)
            {
                if (localConfig.sceneList.main[entry].filters[i].filterName == data.filterName)
                {
                    localConfig.sceneList.main[entry].filters[i].filterEnabled = data.filterEnabled;
                    sendScenes();
                }
            }
        }
    }
    for (const entry in localConfig.sceneList.secondary) 
    {
        if (localConfig.sceneList.secondary[entry].sceneName === data.sourceName)
        {
            for (let i = 0; i < localConfig.sceneList.secondary[entry].filters.length; i++)
            {
                if (localConfig.sceneList.secondary[entry].filters[i].filterName == data.filterName)
                {
                    localConfig.sceneList.secondary[entry].filters[i].filterEnabled = data.filterEnabled;
                    sendScenes();
                }
            }
        }
    }
    for (const entry in localConfig.sceneList.rest) 
    {
        if (localConfig.sceneList.rest[entry].sceneName === data.sourceName)
        {
            for (let i = 0; i < localConfig.sceneList.rest[entry].filters.length; i++)
            {
                if (localConfig.sceneList.rest[entry].filters[i].filterName == data.filterName)
                {
                    localConfig.sceneList.rest[entry].filters[i].filterEnabled = data.filterEnabled;
                    sendScenes();
                }
            }
        }
    }
    logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".OBS 'onFilterChanged' received", data)
}

// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages allowing other extensions to monitor our status
 */
function heartBeatCallback ()
{
    try
    {
        // if we are not currently trying to connect  and we are enabled we need to start the scheduler again
        if (localConfig.status.connected == false && serverConfig.enableobs == "on")
        {
            if (localConfig.obsConnecting == false)
            {
                connectToObs(localCredentials.cred1value, localCredentials.cred2value, localCredentials.cred3value);
            }
        }
        else if (serverConfig.enableobs == "off")
        {
            logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "OBS turned off, skipping reconnect?");
        }
        else
        {
            localConfig.obsConnection.call("GetStats").then(data =>
            {
                localConfig.streamStats.renderSkippedFrames = data.renderSkippedFrames;
                localConfig.streamStats.renderTotalFrames = data.renderTotalFrames;
            })
                .catch(err =>
                {
                    if (err.message === "Not connected")
                        localConfig.status.connected = false;
                    else
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "GetStats:", err.message);

                });

            localConfig.obsConnection.call("GetOutputStatus", { outputName: "adv_stream" }).then(data =>
            {
                localConfig.streamStats.obslive = data.outputActive;
                localConfig.streamStats.outputBytes = data.outputBytes;
                localConfig.streamStats.totalStreamTime = data.outputDuration;
                localConfig.streamStats.outputCongestion = data.outputCongestion
                localConfig.streamStats.outputSkippedFrames = data.outputSkippedFrames;
                localConfig.streamStats.outputTotalFrames = data.outputTotalFrames;
                sendStreamStats(localConfig.streamStats)
            })
                .catch(err =>
                {
                    if (err.message.startsWith("No output was found"))
                        logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "GetOutputStatus:", "adv_stream not found, is OBS streaming?");
                    else
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "GetOutputStatus:", err.message);
                }
                )
        }
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "HeartBeat",
                    serverConfig.extensionname,
                    localConfig.status,
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "callback failed:", err.message);
    }
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: findSceneData
// ============================================================================
function findSceneData (sceneName)
{
    for (const entry in localConfig.sceneList.main)
        if (localConfig.sceneList.main[entry].sceneName === sceneName)
            return entry
    for (const entry in localConfig.sceneList.secondary)
        if (localConfig.sceneList.secondary[entry].sceneName === sceneName)
            return entry
    for (const entry in localConfig.sceneList.rest)
        if (localConfig.sceneList.rest[entry].sceneName === sceneName)
            return entry

}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * Finds the given trigger object by name
 * @param {string} messagetype 
 * @returns trigger object found or null
 */
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
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

