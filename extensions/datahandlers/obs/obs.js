// ############################# OBS.js ##############################
// OBS extension for controlling OBS and information on OBS
// output channel OBS_CHANNEL
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 22-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
let streamlabsChannelConnectionAttempts = 0;
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
    OBSAvailableScenes: null,
    sceneList: { current: "", main: [], secondary: [], rest: [] },
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
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enableobs: "off",
    mainsceneselector: "##",
    secondarysceneselector: "**",
    //credentials variable names to use (in credentials modal)
    credentialscount: "3",
    cred1name: "obshost",
    cred1value: "localhost",
    cred2name: "obsport",
    cred2value: "4444",
    cred3name: "obspass",
    cred3value: "",
};
const OverwriteDataCenterConfig = false;
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension
 * @param {Object} app 
 * @param {String} host 
 * @param {String} port 
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
function onDataCenterConnect ()
{
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
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
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Received config");
            for (const [key] of Object.entries(serverConfig))
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != "")
        {
            serverConfig.cred1value = server_packet.data.obshost;
            serverConfig.cred2value = server_packet.data.obsport;
            serverConfig.cred3value = server_packet.data.obspass;
            if (localConfig.obsConnecting == false && serverConfig.enableobs == "on")
                connectToObs();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage ExtensionMessage", extension_packet.type);
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
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
                    localConfig.obsConnecting = true
                    connectToObs();
                }
            }
            if (extension_packet.to === serverConfig.extensionname)
            {
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
                    localConfig.obsConnecting = true
                    connectToObs();
                }
            }
            if (extension_packet.to === serverConfig.extensionname)
            {
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
        else if (extension_packet.type === "RequestScenes")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SceneList",
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
        else if (extension_packet.type === "ChangeScene")
            changeScene(extension_packet.data);
        else if (extension_packet.type === "ToggleMute")
            ToggleMute(extension_packet.data)
        else
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "unhandled ExtensionMessage ", server_packet);
    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage UnknownChannel", server_packet);
        if (streamlabsChannelConnectionAttempts++ < localConfig.channelConnectionAttempts)
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
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
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
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
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
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
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
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replace(key + "text", value);
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
 * savel config file to the server
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
    if (serverConfig.cred1value != "" && serverConfig.cred2value != "" && serverConfig.cred3value != "" && serverConfig.cred1value != null && serverConfig.cred2value != null && serverConfig.cred3value != null &&
        serverConfig.enableobs == "on" && localConfig.status.connected == false)
    {
        localConfig.obsConnecting = true
        localConfig.obsConnection.connect("ws://" + serverConfig.cred1value + ":" + serverConfig.cred2value, serverConfig.cred3value)
            .then(data =>
            {
                // we are now connected so stop any furthur scheduling
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
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", "Failed to connect to OBS, scheduling reconnect", err.message);
                localConfig.obsConnecting = true
                clearTimeout(localConfig.obsTimeoutHandle)
                localConfig.obsTimeoutHandle = setTimeout(() =>
                {
                    connectToObs();
                }, 5000);
            })
    }
    else
    {
        localConfig.status.connected = false;
        if (serverConfig.enableobs == "off")
        {
            logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToObs ", " Trying to connect while turned off by user");
        }
        else if (serverConfig.cred1value == "" || serverConfig.cred2value == "" || serverConfig.cred3value == ""
            || serverConfig.cred1value == null || serverConfig.cred2value == null || serverConfig.cred3value == null)
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
 * @param {Scenes} scenes 
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
            if (scene.sceneName !== "currentProgramSceneName:")
            {
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
            }


        })
    } catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".processOBSSceneList", "Failed to process scene list", err.message); }
}

// ============================================================================
//                           FUNCTION: changeScene
// ============================================================================
/**
 * Change to the scene named in the paramert
 * @param {String} scene 
 */
function changeScene (scene)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".changeScene", " request come in. changing to ", scene);
    localConfig.obsConnection.call("SetCurrentProgramScene", { sceneName: scene })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".changeScene ", "SetCurrentProgramScene failed", err.message); });
}

// ============================================================================
//                           FUNCTION: Callback Handlers
// ============================================================================
localConfig.obsConnection.on("StreamStateChanged", data => { onStreamStatus(data); });
localConfig.obsConnection.on("GetVersion", data => { logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".OBS 'GetVersion' received", data) });
localConfig.obsConnection.on("CurrentProgramSceneChanged", data => { onSwitchedScenes(data) });
localConfig.obsConnection.on("SceneListChanged", data => { onScenesListChanged(data) });
localConfig.obsConnection.on("InputMuteStateChanged", data => { onSourceMuteStateChanged(data) });

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
function onStreamStatus (data)
{
    // monitor this so we can check if we have connection for the heartbeat(ie are we still receiving data)
    localConfig.status.connected = true;
    //if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STARTED")
    if (data.outputActive)
    {
        localConfig.streamStats.obslive = true;
        StreamStarted()
    }
    else
    //if (data.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPED")
    {
        localConfig.streamStats.obslive = false;
        StreamStopped()
    }
}
// ============================================================================
//                           FUNCTION: sendStreamStats
// ============================================================================
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
    localConfig.sceneList.current = scene;
    // send the information out on our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "SceneChanged",
                serverConfig.extensionname,
                scene.sceneName,
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
 * @param {Object} data 
 */
function StreamStopped ()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".StreamStopped");
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "StreamStopped",
                serverConfig.extensionname,
                "StreamStopped",
                serverConfig.channel),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: StreamStarted
// ============================================================================
/**
 * Called when the stream is started
 * @param {Object} data 
 */
function StreamStarted ()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".StreamStarted");
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "StreamStarted",
                serverConfig.extensionname,
                "StreamStarted",
                serverConfig.channel),
            serverConfig.channel
        ));
}
// ============================================================================
//                           FUNCTION: onOBSScenes
// ============================================================================
/**
 * Called with a list of scene (triggered by the get scenes call)
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
function ToggleMute (input)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "ToggleMute", input)
    localConfig.obsConnection.call("ToggleInputMute", { inputName: input })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".ToggleMute ", "ToggleInputMute failed", err.message); });
    localConfig.obsConnection.call("GetInputMute", { inputName: input })
        .catch(err => { logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".ToggleMute ", "GetInputMute failed", err.message); });
}
// ============================================================================
//                           FUNCTION: SourceMuteStateChanged
// ============================================================================
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
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    try
    {

        // if we are not currently trying to connect  and we are enabled we need to start the scheduler again
        if (localConfig.status.connected == false && serverConfig.enableobs == "on")
        {

            if (localConfig.obsConnecting == false)
            {
                localConfig.obsConnecting = true;
                connectToObs(serverConfig.cred1value, serverConfig.cred2value, serverConfig.cred3value);
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
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".heartBeatCallback", "GetStats:", err.message);
                    if (err.message === "Not connected")
                        localConfig.status.connected = false;
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
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
