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
import * as logger from '../../../backend/data_center/modules/logger.js';
import sr_api from '../../../backend/data_center/public/streamroller-message-api.cjs';
import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
let streamlabsChannelConnectionAttempts = 0;
// local config
const localConfig = {
    OUR_CHANNEL: 'OBS_CHANNEL',
    EXTENSION_NAME: 'obs',
    SYSTEM_LOGGING_TAG: '[EXTENSION]',
    DataCenterSocket: null,
    obsConnection: null,
    obsConnecting: false,
    channelConnectionAttempts: 20,
    OBSAvailableScenes: null,
    sceneList: { current: '', main: [], secondary: [], rest: [] },
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false, // are we connected to obs
        currentscene: ''
    },
    obshost: 'localhost',
    obsport: '4445',
    obspass: 'pass'
};
//sever config (stuff we want to save over runs)
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    obsenable: 'on',
    mainsceneselector: '##',
    secondarysceneselector: '**',


};
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
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.initialise', 'host', host, 'port', port, 'heartbeat', heartbeat);
    if (typeof (heartbeat) != 'undefined')
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.initialise', 'DataCenterSocket no heatbeat passed:', heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.initialise', 'connection failed:', err);
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterDisconnect', reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect ()
{
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket('RequestConfig', serverConfig.extensionname));
    // Request our credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket('RequestCredentials', serverConfig.extensionname));
    // Create/Join the channels we need for this
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket('CreateChannel', serverConfig.extensionname, serverConfig.channel)
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
    if (server_packet.type === 'ConfigFile')
    {
        if (server_packet.data != '' && server_packet.to === serverConfig.extensionname)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage', 'Received config');
            for (const [key, value] of Object.entries(serverConfig))
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === 'CredentialsFile')
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != '')
            if (localConfig.obsConnecting == false)
            {
                localConfig.obsConnecting = true
                localConfig.obshost = server_packet.data.obshost;
                localConfig.obsport = server_packet.data.obsport;
                localConfig.obspass = server_packet.data.obspass;
                connectToObs(localConfig.obshost, localConfig.obsport, localConfig.obspass);
            }
            else
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage',
                    serverConfig.extensionname + ' CredentialsFile', 'Credential file is empty');
    }
    else if (server_packet.type === 'ExtensionMessage')
    {
        let decoded_packet = server_packet.data
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage ExtensionMessage', decoded_packet.type);
        if (decoded_packet.type === 'RequestSettingsWidgetSmallCode')
            SendSettingsWidgetSmall(decoded_packet.from);
        else if (decoded_packet.type === 'SettingsWidgetSmallData')
        {
            if (decoded_packet.to === serverConfig.extensionname)
            {
                serverConfig.obsenable = 'off';
                for (const [key, value] of Object.entries(decoded_packet.data))
                    serverConfig[key] = value;
                SaveConfigToServer();
                processOBSSceneList(localConfig.OBSAvailableScenes);
                sendScenes();
            }
        }
        else if (decoded_packet.type === 'RequestScenes')
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket
                    ('ExtensionMessage',
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            'SceneList',
                            serverConfig.extensionname,
                            localConfig.sceneList,
                            '',
                            server_packet.from
                        ),
                        '',
                        server_packet.from
                    )
            )
        }
        else if (decoded_packet.type === 'ChangeScene')
            changeScene(decoded_packet.data);
        else if (decoded_packet.type === 'ToggleMute')
            ToggleMute(decoded_packet.data)
        else
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage', 'unhandled ExtensionMessage ', server_packet);
    }
    else if (server_packet.type === 'UnknownChannel')
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage UnknownChannel', server_packet);
        if (streamlabsChannelConnectionAttempts++ < localConfig.channelConnectionAttempts)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage', 'Channel ' + server_packet.data + ' doesn\'t exist, scheduling rejoin');
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        'JoinChannel', serverConfig.extensionname, server_packet.data
                    ));
            }, 5000);
        }
    }    // we have received data from a channel we are listening to
    else if (server_packet.type === 'ChannelData')
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage', 'received message from unhandled channel ', server_packet.dest_channel);
    }
    else if (server_packet.type === 'InvalidMessage')
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage',
            'InvalidMessage ', server_packet.data.error, server_packet);
    }
    else if (server_packet.type === 'ChannelJoined'
        || server_packet.type === 'ChannelCreated'
        || server_packet.type === 'ChannelLeft'
        || server_packet.type === 'LoggingLevel'
    )
    {
        //logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onDataCenterMessage Not handling', server_packet.type);
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            '.onDataCenterMessage', 'Unhandled message type', server_packet.data.error);
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

    fs.readFile(__dirname + '/obssettingswidgetsmall.html', function (err, filedata)
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
                if (value === 'on')
                    modalstring = modalstring.replace(key + 'checked', 'checked');
                // replace text strings
                else if (typeof (value) == 'string')
                    modalstring = modalstring.replace(key + 'text', value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    'ExtensionMessage', // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        'SettingsWidgetSmallCode', // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        '',
                        tochannel,
                        serverConfig.channel
                    ),
                    '',
                    tochannel // in this case we only need the 'to' channel as we will send only to the requester
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
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket(
        'SaveConfig',
        serverConfig.extensionname,
        serverConfig))
}

// ############################################################################
// ============================================================================
//                             OBS websockets
// ============================================================================
// ############################################################################
import OBSWebSocket from 'obs-websocket-js';
localConfig.obsConnection = new OBSWebSocket();
// ============================================================================
//                           FUNCTION: onOBSScenes
// ============================================================================
/**
 * connects to the obs server
 */
function connectToObs (host, port, pass)
{
    localConfig.obsConnecting = true
    if (host != '' && port != '' && pass != '' && host != null && port != null && pass != null)
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.connectToObs', host, port, 'xxxx');
        localConfig.obsConnection.connect({ address: host + ':' + port, password: pass })
            .then(() =>
            {
                // we are now connected so stop any furthur scheduling
                localConfig.obsConnecting = false
                localConfig.status.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.connectToObs', 'OBS Connected');
                OBSRequest('GetCurrentScene', null);
                return localConfig.obsConnection.send('GetSceneList');
            })
            .then(data =>
            {
                try
                {
                    processOBSSceneList(data.scenes);
                    sendScenes();
                }
                catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.connectToObs create scenes list', err); }
            })
            .catch((err) =>
            {
                localConfig.status.connected = false;
                //Need to setup a reschedule if we have a connection failure
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.connectToObs ', 'Failed to connect to OBS, scheduling reconnect', err);
                localConfig.obsConnecting = true
                setTimeout(() =>
                {
                    connectToObs(host, port, pass);
                }, 5000);
            })
    }
    else
    {
        localConfig.status.connected = false;
        //Need to setup a reschedule if we have a connection failure
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.connectToObs ', 'Failed to connect to OBS, missing credentials obshost or obsport');
        localConfig.obsConnecting = true
        setTimeout(() =>
        {
            connectToObs(host, port, pass);
        }, 10000);
    }

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
function OBSRequest (request, data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBSRequest', request, data);
    try { localConfig.obsConnection.sendCallback(request, data, OBSRequestCallback); }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, '.OBSRequest failed', request, data, err);
    }
}
function OBSRequestCallback (err, data)
{
    if (err != null)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, 'OBSRequestCallBack', err.status, err.error);
    }
    if (data != null)
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, 'OBSRequestCallBack', data);
    else
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, 'OBSRequestCallBack null data callback');
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
        logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.processOBSSceneList', scenes);
        localConfig.OBSAvailableScenes = scenes;
        localConfig.sceneList.main = [];
        localConfig.sceneList.secondary = [];
        localConfig.sceneList.rest = [];
        scenes.forEach(scene =>
        {
            if (scene !== 'current')
            {
                if (scene.name.startsWith(serverConfig.mainsceneselector))
                    localConfig.sceneList.main.push({
                        displayName: scene.name.replace(serverConfig.mainsceneselector, ''),
                        sceneName: scene.name,
                        muted: scene.muted
                    }
                    )
                else if (scene.name.startsWith(serverConfig.secondarysceneselector))
                    localConfig.sceneList.secondary.push(
                        {
                            displayName: scene.name.replace(serverConfig.secondarysceneselector, ''),
                            sceneName: scene.name,
                            muted: scene.muted
                        }
                    )
                else
                    localConfig.sceneList.rest.push({ displayName: scene.name, sceneName: scene.name, muted: scene.muted })
            }


        })
    }
    catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.processOBSSceneList', 'Failed ot process scene list', err); }
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.changeScene', ' request come in. changing to ', scene);
    OBSRequest('SetCurrentScene', { 'scene-name': scene })
}

// ============================================================================
//                           FUNCTION: Callback Handlers
// ============================================================================
localConfig.obsConnection.on('StreamStatus', data => { onStreamStatus(data); });
localConfig.obsConnection.on('GetVersion', data => { logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBS \'GetVersion\' received', data) });
localConfig.obsConnection.on('SwitchScenes', data => { onSwitchedScenes(data) });
localConfig.obsConnection.on('StreamStarted', data => { onStreamStarted(data) });
localConfig.obsConnection.on('StreamStopped', data => { onStreamStopped(data) });
localConfig.obsConnection.on('ScenesChanged', data => { onScenesListChanged(data) });
localConfig.obsConnection.on('CurrentScene', data => { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBS \'CurrentScene\' received', data) });
localConfig.obsConnection.on('SourceMuteStateChanged', data => { onSourceMuteStateChanged(data) });

// ============================================================================
//                           FUNCTION: obs error
// ============================================================================
localConfig.obsConnection.on('error', err => 
{
    localConfig.status.connected = false;
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBS error message received', err);
});

// ============================================================================
//                           FUNCTION: onStreamStatus
// ============================================================================
function onStreamStatus (data)
{
    localConfig.status.connected = true;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                'OBSStats',
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel)
    )
}
// ============================================================================
//                           FUNCTION: onScenesChanged
// ============================================================================
function onScenesListChanged (data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onScenesListChanged', 'OBS scenes list has changed');
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
function onSwitchedScenes (scene)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.onSwitchedScenes', 'OBS scene changed ', scene);
    localConfig.sceneList.current = scene;
    // send the information out on our channel
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket
            ('ChannelData',
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    'SceneChanged',
                    serverConfig.extensionname,
                    scene.sceneName,
                    serverConfig.channel
                ),
                serverConfig.channel)
    )

}
// ============================================================================
//                           FUNCTION: onStreamStopped
// ============================================================================
/**
 * Called when the stream is stopped
 * @param {Object} data 
 */
function onStreamStopped (data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.StreamStopped', data);
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket
            ('ChannelData',
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    'StreamStopped',
                    serverConfig.extensionname,
                    data,
                    serverConfig.channel),
                serverConfig.channel
            ));
}
// ============================================================================
//                           FUNCTION: onStreamStarted
// ============================================================================
/**
 * Called when the stream is started
 * @param {Object} data 
 */
function onStreamStarted (data)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.StreamStarted', data);
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket
            ('ChannelData',
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    'StreamStarted',
                    serverConfig.extensionname,
                    data,
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBSScenes');
    // lets add the deliminatores we currently are using before sending it out
    localConfig.sceneList.mainsceneselector = serverConfig.mainsceneselector;
    localConfig.sceneList.secondarysceneselector = serverConfig.secondarysceneselector;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                'ScenesList',
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, 'ToggleMute', input)
    OBSRequest('ToggleMute', { source: input });
    OBSRequest('GetMute', { source: input });
}
// ============================================================================
//                           FUNCTION: SourceMuteStateChanged
// ============================================================================
function onSourceMuteStateChanged (data)
{
    logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + '.OBS \'SourceMuteStateChanged\' received', data)
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                'MuteStatus',
                serverConfig.extensionname,
                {
                    scene: data.sourceName,
                    muted: data.muted
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
    if (localConfig.obsConnection._connected == false)
    {
        localConfig.status.connected = localConfig.obsConnection._connected;
        // if we are not currently trying to connect we need to start the scheduler again
        if (localConfig.obsConnecting == false)
        {
            localConfig.obsConnecting = true;
            connectToObs(localConfig.obshost, localConfig.obs, localConfig.obspass);
        }

    }
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket('ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                'HeartBeat',
                serverConfig.extensionname,
                localConfig.status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
