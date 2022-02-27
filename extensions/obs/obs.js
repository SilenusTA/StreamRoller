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
import * as logger from "../../backend/data_center/modules/logger.js";
import * as sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
let streamlabsChannelConnectionAttempts = 0;
// local config
const config = {
    OUR_CHANNEL: "OBS_CHANNEL",
    EXTENSION_NAME: "obs",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    channelConnectionAttempts: 20,
    OBSAvailableScenes: null,
    sceneList: { current: "", main: [], secondary: [], rest: [] },

};
//sever config (stuff we want to save over runs)
const serverConfig = {
    extensionname: config.EXTENSION_NAME,
    channel: config.OUR_CHANNEL,
    obsenable: "on",
    obsscene: "OBS scene to switch to",
    mainsceneselector: "##",
    secondarysceneselector: "**",
    obshost: "localhost",
    obsport: "4445",
    obspass: "pass"

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
function initialise(app, host, port)
{
    try
    {
        config.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "connection failed:", err);
    }
    connectToObs(obs, serverConfig.obshost, serverConfig.obsport, serverConfig.obspass);
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
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Connection message handler
 * @param {Socket} socket 
 */
function onDataCenterConnect(socket)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    else
        sr_api.sendMessage(config.DataCenterSocket,
            sr_api.ServerPacket("SaveConfig", config.EXTENSION_NAME, serverConfig));

    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", config.EXTENSION_NAME, config.OUR_CHANNEL)
    );
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
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", decoded_data);
    //var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        if (decoded_data.data != "" && decoded_data.to === serverConfig.extensionname)
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage Received config");
            for (const [key, value] of Object.entries(serverConfig))
                if (key in decoded_data.data)
                    serverConfig[key] = decoded_data.data[key];
            SaveConfigToServer();
        }
    }
    else if (decoded_data.type === "ExtensionMessage")
    {
        let decoded_packet = JSON.parse(decoded_data.data);
        logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage ExtensionMessage", decoded_packet.type);
        if (decoded_packet.type === "RequestAdminModalCode")
            SendAdminModal(decoded_packet.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            if (decoded_packet.to === serverConfig.extensionname)
            {
                serverConfig.obsenable = "off";
                for (const [key, value] of Object.entries(decoded_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
                // we might have updated our settins so lets send out a new data list (incase we changed the deliminatores for the buttons)
                connectToObs(obs, serverConfig.obshost, serverConfig.obsport, serverConfig.obspass);
                processOBSSceneList(config.OBSAvailableScenes);
                sendScenes();
            }
        }
        else if (decoded_packet.type === "RequestScenes")
        {
            sr_api.sendMessage(config.DataCenterSocket,
                sr_api.ServerPacket
                    ("ExtensionMessage",
                        config.EXTENSION_NAME,
                        sr_api.ExtensionPacket(
                            "SceneList",
                            serverConfig.extensionname,
                            config.sceneList,
                            "",
                            decoded_data.from
                        ),
                        "",
                        decoded_data.from
                    )
            )
        }
        else if (decoded_packet.type === "ChangeScene")
            changeScene(decoded_packet.data);
        else
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "unhandled ExtensionMessage ", decoded_data);
    }
    else if (decoded_data.type === "UnknownChannel")
    {
        logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage UnknownChannel", decoded_data);
        if (streamlabsChannelConnectionAttempts++ < config.channelConnectionAttempts)
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(config.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", config.EXTENSION_NAME, decoded_data.data
                    ));
            }, 5000);
        }
    }    // we have received data from a channel we are listening to
    else if (decoded_data.type === "ChannelData")
    {
        logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", decoded_data.dest_channel);
    }
    else if (decoded_data.type === "InvalidMessage")
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", decoded_data.data.error, decoded_data);
    }
    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel"
    )
    {
        //logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage Not handling", decoded_data.type);
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.data.error);
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
    fs.readFile(__dirname + '/obsadminmodal.html', function (err, filedata)
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
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(config.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    config.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode", // message type
                        config.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        config.OUR_CHANNEL
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
 * savel config file to the server
 */
function SaveConfigToServer()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            config.EXTENSION_NAME,
            serverConfig))
}

// ############################################################################
// ============================================================================
//                             OBS websockets
// ============================================================================
// ############################################################################
import OBSWebSocket from "obs-websocket-js";
const obs = new OBSWebSocket();
// ============================================================================
//                           FUNCTION: onOBSScenes
// ============================================================================
/**
 * connects to the obs server
 */
function connectToObs(obs, host, port, pass)
{
    logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".connectToObs", host, port, pass);
    logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".connectToObs", "implement host:port and pass functionality");
    if (obs !== "undefined")
    {
        //obs.disconnect()
    }
    else
        console.log("skipping disconnet")

    //obs.connect({ address: 'localhost:4445', password: 'pass' })
    obs.connect({ address: serverConfig.obshost + ':' + serverConfig.obsport, password: serverConfig.obspass })
        .then(() =>
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".connectToObs", "OBS Connected");
            OBSRequest("GetCurrentScene", null, function (err, data)
            {
                config.sceneList.current = data.name;
            });
            return obs.send('GetSceneList');
        })
        .then(data =>
        {
            try { processOBSSceneList(data.scenes) }
            catch (err) { logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".connectToObs create scenes list", err); }
        })
        .catch((err) =>
        {
            //Need to setup a reschedule if we have a connection failure
            logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".connectToObs Failed to connect to OBS, scheduling reconnect", err);
            setTimeout(() =>
            {
                connectToObs(obs, host, port, pass);
            }, 10000);
        })


}

// ============================================================================
//                           FUNCTION: OBSRequest
// ============================================================================
/**
 * Make an OBS request using the data provided
 * @param {String} request request string
 * @param {Object} data extra data for the request
 * @param {Function} callback called back with the data
 */
function OBSRequest(request, data, callback)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBSRequest", request, data);
    try { obs.sendCallback(request, data, callback); }
    catch (err) { logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBSRequest failed", request, data); }
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
function processOBSSceneList(scenes)
{
    try
    {
        logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".processOBSSceneList", scenes);
        config.OBSAvailableScenes = scenes;
        config.sceneList.main = [];
        config.sceneList.secondary = [];
        config.sceneList.rest = [];
        scenes.forEach(scene =>
        {
            if (scene !== "current")
            {
                if (scene.name.startsWith(serverConfig.mainsceneselector))
                    config.sceneList.main.push({
                        displayName: scene.name.replace(serverConfig.mainsceneselector, ""),
                        sceneName: scene.name
                    }
                    )
                else if (scene.name.startsWith(serverConfig.secondarysceneselector))
                    config.sceneList.secondary.push(
                        {
                            displayName: scene.name.replace(serverConfig.secondarysceneselector, ""),
                            sceneName: scene.name
                        }
                    )
                else
                    config.sceneList.rest.push({ displayName: scene.name, sceneName: scene.name })
            }


        })
    }
    catch (err) { logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".processOBSSceneList", "Failed ot process scene list", err); }
}

// ============================================================================
//                           FUNCTION: changeScene
// ============================================================================
/**
 * Change to the scene named in the paramert
 * @param {String} scene 
 */
function changeScene(scene)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".changeScene", " request come in. changing to ", scene);
    OBSRequest('SetCurrentScene', { 'scene-name': scene }, function (data, err) { console.log("OBSRequest SetCurrentScene", data, err); })
}

// ============================================================================
//                           FUNCTION: Callback Handlers
// ============================================================================
obs.on("StreamStatus", data =>
{

    //console.log(data);
    //logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBS StreamStatus received", data)
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            config.EXTENSION_NAME,
            sr_api.ExtensionPacket(
                "OBSStats",
                serverConfig.extensionname,
                data,
                config.OUR_CHANNEL
            ),
            config.OUR_CHANNEL)
    )
});
obs.on("GetVersion", data => { logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBS GetVersion received", data) });
obs.on('error', err => { logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBS error message received", err); });
obs.on('SwitchScenes', data => { onSwitchedScenes(data) });
obs.on('StreamStarted', data => { onStreamStarted(data) });
obs.on('StreamStopped', data => { onStreamStopped(data) });
obs.on('ScenesChanged', data => { onScenesListChanged(data) });
obs.on('CurrentScene', data => { logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBS CurrentScene received", data) });

// ============================================================================
//                           FUNCTION: onScenesChanged
// ============================================================================
function onScenesListChanged(data)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onScenesListChanged", "OBS scenes list has changed");
    processOBSSceneList(data.scenes);
    // send the scenes list on our channel
    sendScenes();
}


// ============================================================================
//                           FUNCTION: onSceneChanged
// ============================================================================
/**
 * handles onSceneChanged callback
 * @param {Scene} scene 
 */
function onSwitchedScenes(scene)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onSwitchedScenes", "OBS scene changed ", scene);
    config.sceneList.current = scene;
    // send the information out on our channel
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "SceneChanged",
                    config.EXTENSION_NAME,
                    scene.sceneName,
                    config.OUR_CHANNEL
                ),
                config.OUR_CHANNEL)
    )

}
// ============================================================================
//                           FUNCTION: onStreamStopped
// ============================================================================
/**
 * Called when the stream is stopped
 * @param {Object} data 
 */
function onStreamStopped(data)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".StreamStopped", data);
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "StreamStopped",
                    config.EXTENSION_NAME,
                    data,
                    config.OUR_CHANNEL),
                config.OUR_CHANNEL
            ));
}
// ============================================================================
//                           FUNCTION: onStreamStarted
// ============================================================================
/**
 * Called when the stream is started
 * @param {Object} data 
 */
function onStreamStarted(data)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".StreamStarted", data);
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "StreamStarted",
                    config.EXTENSION_NAME,
                    data,
                    config.OUR_CHANNEL),
                config.OUR_CHANNEL
            ));
}
// ============================================================================
//                           FUNCTION: onOBSScenes
// ============================================================================
/**
 * Called with a list of scene (triggered by the get scenes call)
 */
function sendScenes()
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".OBSScenes");
    // lets add the deliminatores we currently are using before sending it out
    config.sceneList.mainsceneselector = serverConfig.mainsceneselector;
    config.sceneList.secondarysceneselector = serverConfig.secondarysceneselector;
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "ScenesList",
                    serverConfig.extensionname,
                    config.sceneList,
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
