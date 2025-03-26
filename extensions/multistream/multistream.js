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
import axios from 'axios';
import commandExists from 'command-exists';
import * as fs from "fs";
import { spawn, spawnSync } from "node:child_process";
import { dirname } from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";

// Ensure we wait for captured streams to end before calling endCB
var exitError = null;
// Handle process exit
var processExited = false;
var stdoutClosed = true;
var stderrClosed = true;
let stdoutbuffer = []
let stderrbuffer = []

const __dirname = dirname(fileURLToPath(import.meta.url));
// volatile variables
const localConfig = {
    // StreamRoller stuff
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,

    //extensions basics
    multistreamEnabled: "off",
    streamRunning: false,

    // installed version of ffmpeg available/installed/selected
    StreamRollerFfmpegInstalled: false,
    UserFfmpegInstalled: false,
    StreamRollerFfmpeg: false,//use/install ffmpeg in bin dir

    // download options for ffmpeg
    ffmpegDownloadURL: "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl-shared.zip",
    ffmpegFolder: __dirname + "\\bin\\",
    ffmpegDownloadZip: __dirname + "\\bin\\ffmpeg.zip",
    ffmpegExe: __dirname + "\\bin\\ffmpeg.exe",
    ffmpegHandle: null,

    // encoders
    ffmpegEncodersString: null,
    videoEncoders: [],
    audioEncoders: [],
    // stuff to be updated

}

// stream object that wil be used to create new stream objects
const defaultEmptyStream =
{
    enabled: "off",
    name: "multistream",
    URL: "",
    useStreamRollerFFMPEG: false,
    AdditionalURL: "",//goes between URL and StreamKey
    AdditionalParams: "",//goes after StreamKey
    variableBitrate: "off",
    videoEncoder: "",// card dependant, need to check ffmpeg and update as needed
    videoPreset: "",// preset for nvenc
    targetBitrate: "8M",
    resolution: "1664x936",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioChannels: "2", // number of audio channels output (defaults to source)
    audioBitrate: "128k",
    outputFormat: "flv",

    DEBUG_FFMPEG: false,
    DEBUG_FFMPEG_STDERR: false,
    DEBUG_FFMPEG_STDOUT: false,
}
// setup some defaults for twitch/youtube to help users get started etc
const defaultTwitchStream =
{
    enabled: "off",
    name: "Twitch",
    URL: "rtmp://live.twitch.tv/app",
    AdditionalURL: "",
    AdditionalParams: "?bandwidthtest=true",
    variableBitrate: "off",
    videoEncoder: "h264_nvenc",
    videoPreset: "p4",
    targetBitrate: "8M",
    resolution: "1664x936",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioChannels: "",
    audioBitrate: "128k",
    outputFormat: "flv",
}
const defaultYouTubeStream =
{
    enabled: "off",
    name: "Youtube",
    URL: "rtmp://b.rtmp.youtube.com/live2",
    AdditionalURL: "",
    AdditionalParams: "",
    variableBitrate: "off",
    videoEncoder: "h264_nvenc",
    videoPreset: "p4",
    targetBitrate: "8M",
    resolution: "1920x1080",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioChannels: "",
    audioBitrate: "128k",
    outputFormat: "flv",
}

const default_serverConfig = {
    __version__: "0.6",
    extensionname: "multistream",
    channel: "MULTISTREAM",
    streams: [defaultTwitchStream, defaultYouTubeStream, defaultTwitchStream],
    localStreamPort: 1935,
    localStreamURL: "rtmp://localhost:localStreamPort/live/",
    multistream_restore_defaults: "off"
};

let serverConfig = structuredClone(default_serverConfig)

let serverCredentials =
{
    version: "0.1",
    localStreamKey: "f215ee65asdd8864" // for OBS
}

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Multistream Extension for copying and pasting to get you started faster on writing extensions",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "multistreamStreamStarted",
                displaytitle: "A stream was started",
                description: "A Stream has been started to the destination",
                messagetype: "trigger_multistreamStreamStarted",
                parameters: {
                    triggerActionRef: "multistream",
                    triggerActionRef_UIDescription: "Extensionname or User reference that was used to created from this stream, taken action or defaults to multistream",
                    localStreamURI: "",
                    localStreamURI_UIDescription: "The local stream being used",
                }
            },
            {
                name: "multistreamStreamStopped",
                displaytitle: "A stream was stopped",
                description: "A Stream has been stopped",
                messagetype: "trigger_multistreamStreamStopped",
                parameters: {
                    triggerActionRef: "multistream",
                    triggerActionRef_UIDescription: "Extensionname or User reference that was used to created from this stream, taken action or defaults to multistream",
                    localStreamURI: "",
                    localStreamURI_UIDescription: "The local stream that OBS will be outputting to",

                }
            }
        ],
    actions:
        [
            {
                name: "multistreamStartAStream",
                displaytitle: "Start a stream",
                description: "Starts a local Stream Using the current local OBS Stream and forwards it to a remote rtmp server",
                messagetype: "action_multistreamStartStream",
                parameters: {
                    triggerActionRef: "multistream",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible",
                    localStreamURI: "",
                    localStreamURI_UIDescription: "The local stream that OBS will be outputting to",
                    destinationStreamURL: "description of the message parameter",
                    destinationStreamURL_UIDescription: "The remote stream to send to, twitch,YT etc",
                    command: "",
                    command_UIDescription: "The ffmpeg command"
                }
            },
            {
                name: "multistreamStopStream",
                displaytitle: "Stops a stream",
                description: "Stops a named stream from running",
                messagetype: "action_multistreamStopStream",
                parameters: {

                    triggerActionRef: "multistream",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible",
                }
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
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }

    // check if we have a cmd installed ffmpeg
    try
    {
        commandExists("ffmpeg").then((command) =>
        {
            localConfig.UserFfmpegInstalled = true;
        })
            .catch(() => { localConfig.UserFfmpegInstalled = false; })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "error while checking for ffmpeg:", err);
    }

    // check if we have a streamroller installed ffmpeg
    try
    {
        commandExists(localConfig.ffmpegExe).then((command) =>
        {
            localConfig.StreamRollerFfmpegInstalled = true;
        })
            .catch(() =>
            {
                localConfig.StreamRollerFfmpegInstalled = false;
            })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "error while checking for ffmpeg:", err);
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
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
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
        if (server_packet.data && server_packet.data.extensionname
            && server_packet.data.extensionname === serverConfig.extensionname)
        {
            let ffmpegChanged = false;
            let configSubVersions = 0;
            let defaultSubVersions = default_serverConfig.__version__.split('.');
            if (server_packet.data == "")
            {
                serverConfig = structuredClone(default_serverConfig);
                SaveConfigToServer();
                ffmpegChanged = true;
            }
            else
            {
                configSubVersions = server_packet.data.__version__.split('.')
                ffmpegChanged = true;
            }

            if (configSubVersions[0] != defaultSubVersions[0])
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                SaveConfigToServer();
                ffmpegChanged = true;
            }
            else if (configSubVersions[1] != defaultSubVersions[1])
            {
                serverConfig = { ...default_serverConfig, ...server_packet.data };
                serverConfig.__version__ = default_serverConfig.__version__;
                console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
                SaveConfigToServer();
                ffmpegChanged = true;
            }
            else
            {
                if (serverConfig.useStreamRollerFFMPEG != server_packet.useStreamRollerFFMPEG)
                    ffmpegChanged = true;
                serverConfig = structuredClone(server_packet.data);
            }
            SendSettingsWidgetSmall();
            if (ffmpegChanged)
                checkFFMPEGAvailabilities();
            // This will get sent from checkFFMPEGAvailabilities when it has finished getting it's settings update
            if (!ffmpegChanged)
                SendSettingsWidgetLarge();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            serverCredentials = structuredClone(server_packet.data);
            SendSettingsWidgetSmall();
            SendSettingsWidgetLarge();
        }
        else
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty.");
        }
    }
    // This is a message from an extension. the content format will be described by the extension
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;

        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
                parseSettingsWidgetSmall(extension_packet.data)
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLarge(extension_packet.data)
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
        else if (extension_packet.type === "action_multistreamStartStream")
        {
            console.log("action_multistreamStartStream called with", extension_packet.data)

        }
        else if (extension_packet.type === "action_multistreamStopStream")
        {
            console.log("action_multistreamStopStream called with", extension_packet.data)
            stopStream(extension_packet.data.triggerActionRef,
                extension_packet.data.streamName)
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
            // might want to log message to see if we are not handling something we should be
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
        || server_packet.type === "ChannelLeft"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ============================================================================
//                           FUNCTION: parseSettingsWidgetSmall
// ============================================================================
function parseSettingsWidgetSmall (extension_data)
{

    let streamOnOffChanged = false
    // first we need to set any checkbox settings off in this widget (these won't get 
    // returned we can't just assign them as "off" won't get sent back)

    // multistreamEnabled is stored in localConfig as we should never startup StreamRoller with it enabled so it defaults to off on restart
    if (!extension_data.multistreamEnabled)
    {
        if (localConfig.multistreamEnabled == "on")
            streamOnOffChanged = true;
        localConfig.multistreamEnabled = "off"

    }
    else
    {
        // have have turned the extension on
        if (localConfig.multistreamEnabled == "off")
            streamOnOffChanged = true
        localConfig.multistreamEnabled = "on"
    }
    // turn them off here/ they will be turned back on if checkboxes are set in the ui
    serverConfig.streams.forEach((stream, i) =>
    {
        stream.enabled = "off";
    })

    // check data received
    for (const [key, value] of Object.entries(extension_data))
    {
        // attempt to get an id value
        // take the last 2 chars, remove the underscore if there is one.
        // this limits us to 100 streams (as will _99 will work with this method)
        var streamId = key.substring(key.length - 2).replace("_", "")
        if (serverConfig.streams[streamId])
        {
            var variableName = key.replace("multistream_", "").replace("_" + streamId, "")
            if (serverConfig.streams[streamId][variableName])
                serverConfig.streams[streamId][variableName] = value
        }
        else
        {
            if (serverConfig[key])
                serverConfig[key] = value;
        }

        //serverConfig[key.replace("multistream_", "")] = value;
    }
    SaveConfigToServer();
    if (streamOnOffChanged)
        if (localConfig.multistreamEnabled == "on")
            startStream("multistream")
        else
            stopStream()
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall("");
    SendSettingsWidgetLarge("");
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetLarge
// ============================================================================

function parseSettingsWidgetLarge (extension_data)
{
    let credsChanged = false;
    let ffmpegChanged = false;
    // reset to defaults
    if (extension_data.multistream_restore_defaults == "on")
        serverConfig = structuredClone(default_serverConfig);
    else
    {
        //first check credentials
        serverConfig.streams.forEach((stream, i) =>
        {
            stream.enabled = "off";
            stream.variableBitrate = "off";
            if (extension_data[`multistreamStream${i}StreamKey`] != serverCredentials[`multistreamStream${i}StreamKey`])
            {
                serverCredentials[`multistreamStream${i}StreamKey`] = extension_data[`multistreamStream${i}StreamKey`];
                credsChanged = true;
            }
            if (extension_data[`useStreamRollerFFMPEG`] != serverConfig.useStreamRollerFFMPEG)
                ffmpegChanged = true;
        })

        if (credsChanged)
            saveCredentialsToServer()
        if (ffmpegChanged)
            checkFFMPEGAvailabilities();
        // check the stream key values
        for (const [key, value] of Object.entries(extension_data))
        {
            // attempt to get an id value
            // take the last 2 chars, remove the underscore if there is one.
            // this limits us to 100 streams (as will _99 will work with this method)
            var streamId = key.substring(key.length - 2).replace("_", "")
            if (serverConfig.streams[streamId])
            {
                var variableName = key.replace("multistream_", "").replace("_" + streamId, "")
                // need to use undefined here as if it is an empty string it will return false for most normal checks
                if (typeof serverConfig.streams[streamId][variableName] !== 'undefined')
                    serverConfig.streams[streamId][variableName] = value
            }
            else
            {
                if (serverConfig[key])
                    serverConfig[key] = value;
            }
        }
        serverConfig.useStreamRollerFFMPEG = (extension_data.multistreamffmpegpicker == "1");
        if (extension_data["multistream_DEBUG_FFMPEG"] == "on")
            serverConfig.DEBUG_FFMPEG = true;
        else
            serverConfig.DEBUG_FFMPEG = false;

        if (extension_data["multistream_DEBUG_FFMPEG_STDERR"] == "on")
            serverConfig.DEBUG_FFMPEG_STDERR = true;
        else
            serverConfig.DEBUG_FFMPEG_STDERR = false;

        if (extension_data["multistream_DEBUG_FFMPEG_STDOUT"] == "on")
            serverConfig.DEBUG_FFMPEG_STDOUT = true;
        else
            serverConfig.DEBUG_FFMPEG_STDOUT = false;

        // if we want to use our installed version but don't have it then call the download function
        if (serverConfig.useStreamRollerFFMPEG && !localConfig.StreamRollerFfmpegInstalled)
            downloadFFMPEG()

        SaveConfigToServer();
    }
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall("");
    // if changed we will update our Availabilities and this will send this out anyway
    if (!ffmpegChanged)
        SendSettingsWidgetLarge("");

}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} toExtension 
 */
function SendSettingsWidgetSmall (toExtension = "")
{
    fs.readFile(__dirname + '/multistreamsettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            // replace our serverConfig variables in the code
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }

            // update credential boxes
            if (localConfig.multistreamEnabled == "on")
                modalString = modalString.replace("multistreamEnabledchecked", "checked");
            let streamsHtml = "<h4>Streams<h4>"
            streamsHtml = "<BR>Setup streams in the large settings page. Select here to enable/disable those streams"
            serverConfig.streams.forEach((stream, i) =>
            {
                streamsHtml += "<HR>";
                streamsHtml += `<h4>${i}:${stream.name}</h4>`;
                // stream enabled
                streamsHtml += createCheckBox("Enabled/Disabled", `multistream_enabled_${i}`, stream.enabled == "on");
                streamsHtml += "<BR>";
                streamsHtml += "<h4>Settings</H4>"
                for (const [key, value] of Object.entries(stream))
                {
                    streamsHtml += `${key} = ${value}, `;
                }
            })
            modalString = modalString.replace("multistreamStreamHTML", streamsHtml);

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
                        "",
                        toExtension,
                        serverConfig.channel
                    ),
                    "",
                    toExtension
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * @param {String} toExtension 
 */
function SendSettingsWidgetLarge (toExtension = "")
{
    let streamsHtml = ""
    // read our modal file
    fs.readFile(__dirname + "/multistreamsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        //throw err;
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }
            // create select picker for the FFMPEG install to use

            let ffmpegPickerHtml = ""
            // 0 = users FFMPEG
            // 1 = StreamRoller FFMPEG
            ffmpegPickerHtml += "<BR>System FFMPEG:  " + localConfig.UserFfmpegInstalled;
            if (localConfig.UserFfmpegInstalled)
                ffmpegPickerHtml += '<span style="color:green">Available</span>'
            else
                ffmpegPickerHtml += '<span style="color:red">Not found</span>'
            if (!serverConfig.useStreamRollerFFMPEG)
                ffmpegPickerHtml += ' <span style="color:yellow">Currently Selected</span>'
            ffmpegPickerHtml += "<BR>StreamRoller FFMPEG available:";
            if (localConfig.StreamRollerFfmpegInstalled)
                ffmpegPickerHtml += '<span style="color:green">Available</span>'
            else
                ffmpegPickerHtml += '<span style="color:red">Not found</span>'
            if (serverConfig.useStreamRollerFFMPEG)
                ffmpegPickerHtml += ' <span style="color:yellow">Currently Selected</span>'
            ffmpegPickerHtml += "<BR>";

            if (serverConfig.useStreamRollerFFMPEG)
            {
                ffmpegPickerHtml +=
                    `<select class="selectpicker btn-secondary" data-style="btn-danger" data-width="150px" title="Select FFMPEG source" id="multistreamffmpegpicker" value="1" name="multistreamffmpegpicker" required="">`
                ffmpegPickerHtml +=
                    `<option value="0">Installed FFMPEG</option>
                         <option value="1" selected>StreamRoller FFMPEG</option>
                    </select >`

            }
            else
            {
                ffmpegPickerHtml +=
                    `<select class="selectpicker btn-secondary" data-style="btn-danger" data-width="150px" title="Select FFMPEG source" id="multistreamffmpegpicker" value="1" name="multistreamffmpegpicker" required="">`
                ffmpegPickerHtml +=
                    `<option value="0" selected>Installed FFMPEG</option>
                        <option value="1">StreamRoller FFMPEG</option>
                    </select >`
            }

            modalString = modalString.replace("multistreamFFMPEGPickerPlaceholder", ffmpegPickerHtml);
            // streams
            serverConfig.streams.forEach((stream, i) =>
            {
                streamsHtml += "<HR>";
                streamsHtml += `<h4>${i}:${stream.name}</h4>`;
                streamsHtml += "<BR>";
                // stream enabled
                streamsHtml += createCheckBox("Enabled/Disabled", `multistream_enabled_${i}`, stream.enabled == "on");
                streamsHtml += "<BR>";
                //StreamName
                streamsHtml += createTextBox("Name", `multistream_name_${i}`, stream.name);
                streamsHtml += "<BR>";
                // URL
                streamsHtml += createTextBox("URL", `multistream_URL_${i}`, stream.URL);
                streamsHtml += "<BR>";
                // AdditionalURL
                streamsHtml += createTextBox("Additional URL", `multistream_AdditionalURL_${i}`, stream.AdditionalURL);
                streamsHtml += "<BR>";
                // AdditionalParams
                streamsHtml += createTextBox("Additional Params", `multistream_AdditionalParams_${i}`, stream.AdditionalParams);
                streamsHtml += "<BR>";
                //StreamName multistreamStream${i}StreamKey
                streamsHtml += createTextBox("Stream Key", `multistreamStream${i}StreamKey`, serverCredentials[`multistreamStream${i}StreamKey`], true);
                streamsHtml += "<BR>";
                // variable bitrate
                streamsHtml += createCheckBox("Variable Bitrate", `multistream_variableBitrate_${i}`, stream.variableBitrate == "on");
                streamsHtml += "<BR>";
                // videoEncoder
                streamsHtml += createDropdown("Video Encoder", `multistream_videoEncoder_${i}`, localConfig.videoEncoders, stream.videoEncoder, "Available Video Encoders in current FFMPEG. If you need others try using a different version of FFMPEG that contain's them");
                // videoPreset
                streamsHtml += createTextBox("Video preset (for nvenc encoders)", `multistream_videoPreset_${i}`, stream.videoPreset);
                streamsHtml += "<BR>";
                // targetBitrate
                streamsHtml += createTextBox("Target Bitrate", `multistream_targetBitrate_${i}`, stream.targetBitrate);
                streamsHtml += "<BR>";
                // resolution
                streamsHtml += createTextBox("resolution", `multistream_resolution_${i}`, stream.resolution);
                streamsHtml += "<BR>";
                // framerate
                streamsHtml += createTextBox("Framerate", `multistream_framerate_${i}`, stream.framerate);
                streamsHtml += "<BR>";
                // keyframeInterval
                streamsHtml += createTextBox("Key Frame Interval (in seconds)", `multistream_keyframeInterval_${i}`, stream.keyframeInterval);
                streamsHtml += "<BR>";
                // AudioEncoder
                streamsHtml += createDropdown("Audio Encoder", `multistream_audioEncoder_${i}`, localConfig.audioEncoders, stream.audioEncoder, "Available Audio Encoders in FFMPEG. If you need others try using a different version of FFMPEG that contain's them");
                // audioBitrate
                streamsHtml += createTextBox("Audio Bitrate ", `multistream_audioBitrate_${i}`, stream.audioBitrate);
                streamsHtml += "<BR>";
                // outputFormat
                streamsHtml += createTextBox("Output Format ", `multistream_outputFormat_${i}`, stream.outputFormat);
                streamsHtml += "<BR>";
            });

            modalString = modalString.replace("multistreamStreamsPlaceholder", streamsHtml)


            if (serverConfig.DEBUG_FFMPEG)
                modalString = modalString.replace("multistream_DEBUG_FFMPEGchecked", "checked")
            if (serverConfig.DEBUG_FFMPEG_STDERR)
                modalString = modalString.replace("multistream_DEBUG_FFMPEG_STDERRchecked", "checked")
            if (serverConfig.DEBUG_FFMPEG_STDOUT)
                modalString = modalString.replace("multistream_DEBUG_FFMPEG_STDOUTchecked", "checked")

            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        serverConfig.channel,
                        toExtension,
                    ),
                    serverConfig.channel,
                    toExtension
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
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our credentials to the server to be saved for next time we run
 */
function saveCredentialsToServer ()
{

    for (var c in serverCredentials)
    {
        let creds = {
            ExtensionName: serverConfig.extensionname,
            CredentialName: c,
            CredentialValue: serverCredentials[c]
        }
        // can't set empty credentials
        if (serverCredentials[c] == "")
            creds.CredentialValue = "Empty"
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "UpdateCredentials",
                serverConfig.extensionname,
                creds,
            ));
    }
}
// ============================================================================
//                           FUNCTION: startStream
// ============================================================================
/*
-preset (int) or
    p1 fastest (lowest quality)
    p2 faster (lower quality)
    p3 fast (low quality)
    p4 medium (default)
    p5 slow (good quality)
    p6 slower (better quality)
    p7 slowest (best quality)
*/
/**
 * 
 * @param {*} ref 
 * @param {*} streamName 
 * @returns 
 */
function startStream (ref)
{
    console.log(`startStream (${ref})`)

    let OBSUrl = serverConfig.localStreamURL.replace("localStreamPort", serverConfig.localStreamPort);
    let ffmpegArgs =
        [
            //"-v", "1",
            "-listen", "1",  // Makes FFmpeg listen for incoming RTMP stream
            "-i",
            OBSUrl + "/" + serverCredentials.localStreamKey,
            /*
            Figure out where these go, they are position specific in the ffmpeg command
            "-reconnect", "1", // Enable reconnect
             "-reconnect_streamed", "1", // Reconnect for streamed content
             "-reconnect_delay_max", "5", // Max delay for reconnect
             "-timeout", "5000000", // Max time waiting for data
             "-rw_timeout", "5000000", // Read/write timeout*/
        ]
    serverConfig.streams.forEach((stream, i) =>
    {
        if (stream.enabled == "on")
        {
            if (stream.variableBitrate == "on")
            { ffmpegArgs.push("-rc"); ffmpegArgs.push("vbr"); }//variable bitrate
            if (stream.videoEncoder && stream.videoEncoder != "")
            { ffmpegArgs.push("-c:v"); ffmpegArgs.push(stream.videoEncoder); }
            if (stream.videoPreset && stream.videoPreset != "")
            { ffmpegArgs.push("-preset"); ffmpegArgs.push(stream.videoPreset); }
            if (stream.targetBitrate && stream.targetBitrate != "")
            { ffmpegArgs.push("-b:v"); ffmpegArgs.push(stream.targetBitrate); }
            if (stream.resolution && stream.resolution != "")
            { ffmpegArgs.push("-s"); ffmpegArgs.push(stream.resolution); }
            //ffmpegArgs.push("-vf"); ffmpegArgs.push("scale=out_color_matrix=bt709"); ffmpegArgs.push("-color_primaries bt709"); ffmpegArgs.push("-color_trc bt709"); ffmpegArgs.push("-colorspace bt709");//set the color space to BT.709
            //ffmpegArgs.push("-pix_fmt"); ffmpegArgs.push("yuv420p");//use 16:9 aspect ratio:
            //ffmpegArgs.push("-movflags"); ffmpegArgs.push("+faststart");//put the moov atom at the front
            if (stream.framerate && stream.framerate != "")
            { ffmpegArgs.push("-r"); ffmpegArgs.push(stream.framerate); }//use a standard frame rate
            if (stream.keyframeInterval && stream.keyframeInterval != "")
            { ffmpegArgs.push("-g"); ffmpegArgs.push(stream.keyframeInterval); }//Keyframe interval (2s is (fps,-r)*2 ie 60g = 2seconds for 30fps)
            //ffmpegArgs.push("-bf"); ffmpegArgs.push("1");//use 2 consecutive B frames
            if (stream.audioEncoder && stream.audioEncoder != "")
            { ffmpegArgs.push("-c:a"); ffmpegArgs.push(stream.audioEncoder); }
            if (stream.audioChannels && stream.audioChannels != "")
            { ffmpegArgs.push("-ac"); ffmpegArgs.push(stream.audioChannels); } // stereo sound
            //ffmpegArgs.push("-crf"); ffmpegArgs.push("18"); // set a constant rate factor to 'visually lossless'
            if (stream.audioBitrate && stream.audioBitrate != "")
            { ffmpegArgs.push("-b:a"); ffmpegArgs.push(stream.audioBitrate); }
            if (stream.outputFormat && stream.outputFormat != "")
            { ffmpegArgs.push("-f"); ffmpegArgs.push(stream.outputFormat) }
            if (stream.URL && stream.URL != "")
            { ffmpegArgs.push(stream.URL + stream.AdditionalURL + "/" + serverCredentials[`multistreamStream${i}StreamKey`] + stream.AdditionalParams); }
            else
                console.log(`Multistream: missing URL for stream ${i}: ${stream.name}`)
        }
    });
    //console.log("ffmpegArgs args", ffmpegArgs)

    if (localConfig.ffmpegHandle && localConfig.ffmpegHandle != null)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".startStream", "A stream is already running");
        return;
    }

    localConfig.ffmpegHandle = runFFMPEG(
        ffmpegArgs,
        { shell: true },
        function (handle)
        {
            // console.log("handle", JSON.stringify(handle, null, 2))
        },
        function (handle)
        {
            if (!localConfig.streamRunning)
            {
                localConfig.streamRunning = true;
                sendStreamStartedTrigger(ref);
                sendOBSStartAction(ref);
            }
            // console.log("handle", JSON.stringify(handle, null, 2))
        },
        function (data, out, err)
        {
            localConfig.streamRunning = false;
            sendStreamStoppedTrigger();
            sendOBSStopAction(ref);
            if (serverConfig.DEBUG_FFMPEG)
            {
                console.log("cmd end received")
                console.log("out", JSON.stringify(out, null, 2))
                console.log("err", JSON.stringify(err, null, 2))
                console.log("end", JSON.stringify(data, null, 2))
            }
            localConfig.ffmpegHandle = null
            localConfig.multistreamEnabled = "off"
        }
    )
}
// ============================================================================
//                           FUNCTION: runFFMPEG
// ============================================================================
/**
 * 
 * @param {*} name 
 * @param {*} args 
 * @param {*} options 
 * @param {*} processCB 
 * @param {*} endCB 
 * @returns 
 */
function runFFMPEG (args = {}, options = {}, processCB = null, streamStarted = null, streamFinished = null)
{
    let command = ""
    if (serverConfig.useStreamRollerFFMPEG)
    {
        if (localConfig.StreamRollerFfmpegInstalled)
            command = localConfig.ffmpegExe;
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".runFFMPEG", "Failed to find StreamRoller FFMPEG");
            return;
        }
    }
    else
    {
        if (localConfig.UserFfmpegInstalled)
            command = "ffmpeg"
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".runFFMPEG", "Failed to find System FFMPEG. Try running 'ffmpeg -version' on the command line to see if it is installed correctly");
            return
        }

    }


    let ffmpegProc = spawn(command, args);
    if (serverConfig.DEBUG_FFMPEG)
        console.log("ffmpegProc ", command, args.join(' '));
    if (ffmpegProc.stderr)
    {
        stderrClosed = false;
        ffmpegProc.stderr.setEncoding('utf8');
    }
    ffmpegProc.on('error', function (err)
    {
        console.log("ffmpegProc:error()", err)
        streamFinished(err);
    });

    ffmpegProc.on('exit', function (code, signal)
    {
        processExited = true;
        if (signal)
        {
            handleExit(new Error("ffmpeg:exit()was killed with signal " + signal), streamFinished);
        } else if (code)
        {
            handleExit(new Error("ffmpeg:exit())exited with code " + code), streamFinished);
        } else
        {
            handleExit(null, streamFinished);
        }
    });

    // Capture stdout if specified

    ffmpegProc.stdout.on('data', function (data)
    {
        stdoutClosed = false;
        if (serverConfig.DEBUG_FFMPEG_STDOUT)
            console.log("ffmpeg:stdout:data()", data.toString())
        stdoutbuffer.push(data.toString())
    });

    ffmpegProc.stdout.on('close', function ()
    {
        stdoutbuffer.push('close')
        if (serverConfig.DEBUG_FFMPEG_STDOUT)
            console.log("ffmpeg:stdout:close")
        stdoutClosed = true;
        handleExit(null, streamFinished);
    });


    // Capture stderr if specified
    ffmpegProc.stderr.on('data', function (data)
    {
        // on first data we notify stream is running so we can start OBS etc
        if (!localConfig.streamRunning)
            streamStarted();
        stderrClosed = false
        stderrbuffer.push(data)
        if (serverConfig.DEBUG_FFMPEG_STDERR)
            console.log("ffmpeg:stderr:data()", JSON.stringify(data, null, 2))
    });

    ffmpegProc.stderr.on('close', function ()
    {
        stderrbuffer.push('close')
        if (serverConfig.DEBUG_FFMPEG_STDERR)
            console.log("ffmpeg:stderr:close()")
        stderrClosed = true;
        handleExit(null, streamFinished);
    });

    // Call process callback
    //processCB(ffmpegProc, stdoutRing, stderrRing);
    processCB(ffmpegProc);
    return ffmpegProc;

}
// ============================================================================
//                           FUNCTION: stopStream
// ============================================================================
/**
 * 
 */
function stopStream ()
{
    if (localConfig.ffmpegHandle)
    {
        sendStreamStoppedTrigger()
        killProcess()
        localConfig.ffmpegHandle = null
    }
}
// ============================================================================
//                           FUNCTION: killProcess
// ============================================================================
/**
 * 
 */
function killProcess ()
{
    if (!localConfig.ffmpegHandle)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".killProcess", "No stream found");
        return;
    }
    else if (localConfig.ffmpegHandle)
        localConfig.ffmpegHandle.kill('SIGINT');
}
// Graceful shutdown on Ctrl+C
process.on("SIGINT", () =>
{
    if (localConfig.ffmpegHandle)
        localConfig.ffmpegHandle.kill("SIGINT"); // Sends SIGINT to FFmpeg
    process.exit();
});
// ============================================================================
//                           FUNCTION: handleExit
// ============================================================================
/**
 * 
 * @param {*} err 
 * @param {*} endCB 
 */
function handleExit (err, endCB)
{
    if (err)
    {
        exitError = err;
    }

    if (processExited && (stdoutClosed) && stderrClosed)
    {
        //endCB(exitError, stdoutRing, stderrRing);
        endCB(exitError, stdoutbuffer, stderrbuffer);
    }
}

// ============================================================================
//                           FUNCTION: sendOBSStartAction
// ============================================================================
/**
 * 
 * @param {*} triggerActionRef 
 */
function sendOBSStartAction (triggerActionRef = "multistream")
{

    /* to send an action we just need the following fields
     action = 
    {
     messagetype: "action_StartStream",
     data: 
        {
            //param data from the extensions action definition
        }
    }
    */
    let action = {
        messagetype: "action_StartStream",
        to: "obs",
        data: {
            triggerActionRef: triggerActionRef,
        }
    }
    sendAction(action);
}
// ============================================================================
//                           FUNCTION: sendOBSStopAction
// ============================================================================
/**
 * 
 * @param {*} triggerActionRef 
 */
function sendOBSStopAction (triggerActionRef = "multistream")
{

    /* to send an action we just need the following fields
     action = 
    {
     messagetype: "action_StartStream",
     data: 
        {
            //param data from the extensions action definition
        }
    }
    */
    let action = {
        messagetype: "action_StopStream",
        to: "obs",
        data: {
            triggerActionRef: triggerActionRef,
        }
    }
    sendAction(action);

}
// ============================================================================
//                           FUNCTION: sendStreamStartedTrigger
// ============================================================================
/**
 * 
 * @param {*} triggerActionRef 
 */
function sendStreamStartedTrigger (triggerActionRef = "multistream")
{
    let trigger = findTriggerByMessageType("trigger_multistreamStreamStarted");
    trigger.parameters =
    {
        triggerActionRef: triggerActionRef,
        localStreamURI: serverConfig.localStreamURL.replace("localStreamPort", serverConfig.localStreamPort),
    }
    sendTrigger(trigger)
}

// ============================================================================
//                           FUNCTION: sendStreamStoppedTrigger
// ============================================================================
/**
 * 
 * @param {*} ref 
 * @param {*} name 
 * @param {*} localStreamURI 
 * @param {*} destinationStreamURL 
 */
function sendStreamStoppedTrigger (triggerActionRef)
{
    let trigger = findTriggerByMessageType("trigger_multistreamStreamStopped");
    trigger.parameters =
    {
        triggerActionRef: triggerActionRef,
        localStreamURI: serverConfig.localStreamURL.replace("localStreamPort", serverConfig.localStreamPort)
    }
    sendTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds the trigger using the passed messagetype
 * @param {string} messagetype 
 * @returns trigger
 */
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find trigger", messagetype);
}

// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
/**
 * sends an action out.
 * @param {*} action {messagetype:..', to:..., data: {<< action params >>}}
 */
function sendAction (action)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ExtensionMessage',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                action.messagetype,
                serverConfig.extensionname,
                action.data,
                "",
                action.to),
            "",
            action.to
        )
    );
}
// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
/**
 * Sends the given trigger or action out on our channel if to is ""
 * or sends to the extension as an extension message if to specifies extension name
 * @param {object} data 
 */
function sendTrigger (data)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                data.messagetype,
                serverConfig.extensionname,
                data,
                serverConfig.channel,
                ''),
            serverConfig.channel,
            ''
        )
    );

}
// ===========================================================================
//                           FUNCTION: createDropdown
// ===========================================================================
function createDropdown (Title, id, data = [], currentSelectedId = 0, label = null)
{
    let dropdownHtml = "";
    dropdownHtml += '<div class="d-flex-align w-100">';
    dropdownHtml += `<select class='selectpicker btn-secondary py-2' data-style='btn-danger' style="max-width: 85%;" title='${Title}' id="${id}" value='${currentSelectedId}' name="${id}" required="">`
    dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--Select an option--</option>'
    data.forEach(option =>
    {
        if (option == currentSelectedId)
            dropdownHtml += '<option value="' + option + '" selected>' + option + '</option>';
        else
            dropdownHtml += '<option value="' + option + '">' + option + '</option>';
    });
    dropdownHtml += '</select>';
    if (label)
        dropdownHtml += `<label class="form-check-label" for="${id}">&nbsp;${label}</label>`
    // add clear history checkbox
    dropdownHtml += '</div>';
    return dropdownHtml;
}

// ===========================================================================
//                           FUNCTION: createTextBox
// ===========================================================================
function createTextBox (description, name, value, password)
{
    let type = "text"
    if (password)
        type = "password"
    return `<div id="${name}_div" class="form-group py-1" style="display: inline-flex;">
        <input type="${type}" name="${name}" class="form-control" style="width:auto" id="${name}" value="${value}"><label for="${name}" class="col-form-label">&nbsp;${description}</label>
    </div>`
}
// ===========================================================================
//                           FUNCTION: createCheckBox
// ===========================================================================
function createCheckBox (description, name, checked)
{
    let checkedtext = "";
    if (checked)
        checkedtext = "checked";
    return `
    <div class="form-check form-check-inline py-2">
        <input class="form-check-input" name="${name}" type="checkbox" id="${name}" ${checkedtext}>
        <label class="form-check-label" for="${name}">&nbsp;${description}</label>
    </div>`
}

// ############################################################################
//                            INSTALL FFMPEG FILES
// If the user doesn't have ffmpeg installed we can install one from github
// ############################################################################

// ============================================================================
//                           FUNCTION: downloadFFMPEG
// ============================================================================
/**
 * 
 */
async function downloadFFMPEG ()
{
    // check we have ffmpeg available or not.
    //console.log(`localConfig.ffmpegDownloadZip = ${localConfig.ffmpegDownloadZip}`)
    //console.log(`localConfig.ffmpegDownloadURL = ${localConfig.ffmpegDownloadURL}`)
    //console.log(`localConfig.ffmpegFolder = ${localConfig.ffmpegFolder}`)
    // inverted failure flag
    let installSuccess = true;

    // if we have a previous download lets delete it (should never be hit as should only run on install)
    if (fs.existsSync(localConfig.ffmpegDownloadZip))
    {
        fs.unlink(localConfig.ffmpegDownloadZip, (err) =>
        {
            if (err == null)
            {
                console.log("finished deleting old ffmpeg download")
                //setTimeout(() => { downloadFFMPEG(); }, 1000);
            }
            else
            { installSuccess = false; console.log("Error deleting previous ffmpeg download", err) }
        });
        return;
    }
    // download the zip and unpack it to the correct place
    axios({
        method: 'get',
        url: localConfig.ffmpegDownloadURL,
        responseType: 'stream',
        onDownloadProgress: progressEvent =>// print progress to in the console
        { printProgress("ffmpeg downloading " + Math.round((progressEvent.loaded * 100) / progressEvent.total) + "%") }
    }
    ).then(response =>
    {
        //download complete write file
        const writer = fs.createWriteStream(localConfig.ffmpegDownloadZip);
        response.data.pipe(writer);
        writer.on('finish', async () => 
        {
            console.log('✅ Download complete!');
            // unzip file
            //console.log("unzipping file", localConfig.ffmpegDownloadZip, localConfig.ffmpegFolder)
            unzipfile(localConfig.ffmpegDownloadZip, localConfig.ffmpegFolder);
            //console.log("unzipping finished")
            let files = [];
            try
            {
                files = fs.readdirSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared/bin")
            }
            catch (err)
            {
                installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ":Error: loading ffmpeg files to copy", err);
            }

            // delete existing files we are about to copy
            files.forEach((value, index) =>
            {
                //console.log("file", value)
                //delete existing file if it exists
                if (fs.existsSync(localConfig.ffmpegFolder + value))
                {
                    //console.log("deleteing", localConfig.ffmpegFolder + value)
                    try { fs.unlinkSync(localConfig.ffmpegFolder + value); }
                    catch (err) { installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ":Error: clearing out old files before replacing", err); }
                }
            })
            // move new files in
            files.forEach((value, index) =>
            {
                console.log("moving in new file", value)
                fs.renameSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared\\bin\\" + value,
                    localConfig.ffmpegFolder + value, function (err)
                {
                    if (err) { installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ":Error: moving file ", localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared\\bin\\" + value, err); }
                    //console.log('Successfully renamed!', localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared\\bin\\" + value)
                })
            })
            // delete downloaded files
            // uncomment once tested it doesn't delete my hd :D :D
            //console.log("removing folder ffmpeg-master-latest-win64-gpl-shared")
            try { fs.rmSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared", { recursive: true, force: true }); }
            catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ":Error: removing directory", localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared", err); }

            // finally delete the zip file we downloaded
            console.log("removing old zip")
            if (fs.existsSync(localConfig.ffmpegDownloadZip))
            {
                try { fs.unlinkSync(localConfig.ffmpegDownloadZip); }
                catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ":Error: clearing out downloaded ffmpeg.zip before replacing", err); }
            }

        });
        writer.on('error', err =>
        {
            installSuccess = false;
            console.error('❌ Failed to download:', err)
        });
    })
        .catch(err =>
        {
            installSuccess = false;
            console.log("err downloading ffmpeg", err)
        })
    if (!installSuccess)
        localConfig.StreamRollerFfmpeg = true;
    else
        localConfig.StreamRollerFfmpeg = false;


}
// ============================================================================
//                           FUNCTION: unzipfile
// ============================================================================
/**
 * 
 * @param {*} file 
 * @param {*} to 
 */
function unzipfile (file, to)
{
    let args = ["xf", file, "-C", to]
    let unzipHandle = spawnSync("tar", args);
    return unzipHandle;

}
// ############################################################################
//                            GET FFMPEG INFO
// Stuff like video encoders available etc
// ############################################################################
// ============================================================================
//                      FUNCTION: UpdateEncodersAvailable
// ============================================================================
/**
 * Checks and updates availabilities of FFMPEG with current settings
 */
function checkFFMPEGAvailabilities ()
{
    let ffmpegExe = null
    // did the user select to use our FFMPEG or their own
    if (serverConfig.useStreamRollerFFMPEG)
    {
        if (localConfig.StreamRollerFfmpegInstalled)
            ffmpegExe = localConfig.ffmpegExe;
    }
    else
    {
        if (localConfig.UserFfmpegInstalled)
            ffmpegExe = "ffmpeg"
    }
    if (!ffmpegExe)
    {
        SendSettingsWidgetLarge();
        return;
    }

    // get our video encoders
    /* Flags
            V..... = Video
            A..... = Audio
            S..... = Subtitle
            .F.... = Frame-level multithreading
            ..S... = Slice-level multithreading
            ...X.. = Codec is experimental
            ....B. = Supports draw_horiz_band
            .....D = Supports direct rendering method 1
    */
    UpdateEncodersAvailable(ffmpegExe)
}
// ============================================================================
//                      FUNCTION: UpdateEncodersAvailable
// ============================================================================
/**
 * tests what ffmpeg encoders are available
 * byproduct: calls out SendSettingsWidgetLarge()
 */
function UpdateEncodersAvailable (ffmpegExe)
{
    let finished = false;
    let args = ["-encoders", "-hide_banner"];
    let ffmpegHandle = spawn("ffmpeg", args);
    localConfig.ffmpegEncodersString = "";

    //console.log("running", ffmpegExe, args.join(' '));
    if (ffmpegHandle.stderr)
        ffmpegHandle.stderr.setEncoding('utf8');
    if (ffmpegHandle.stdout)
        ffmpegHandle.stdout.setEncoding('utf8');

    ffmpegHandle.on('error', function (err)
    {
        console.log("UpdateEncodersAvailable():error()", err)
    });

    ffmpegHandle.on('exit', function (code, signal)
    {
        finished = true;
        if (signal)
            console.log("UpdateEncodersAvailable():exit()was killed with signal " + signal);
        else if (code)
            console.log("UpdateEncodersAvailable():exit())exited with code " + code);
        //console.log("exit called no code or signal")
    });

    ffmpegHandle.stdout.on('data', function (data)
    {
        //console.log("stdout:adding data")
        localConfig.ffmpegEncodersString += data.toString()
    });

    ffmpegHandle.stdout.on('close', function ()
    {
        //console.log("ffmpegHandle:stdout:close()")
    });


    // Capture stderr if specified
    ffmpegHandle.stderr.on('data', function (data)
    {
        //console.log("stdout:adding:stderr:", data)
    })

    ffmpegHandle.stderr.on('close', function ()
    {
        //console.log("ffmpegHandle:stderr:close()")
    });

    localConfig.waitForExitHandle = setInterval(() =>
    {
        if (finished)
        {
            clearInterval(localConfig.waitForExitHandle)
            parseEncodersString();
            SendSettingsWidgetLarge();
        }
    }, 500);

}
// ============================================================================
//                           FUNCTION: parseEncodersString
// ============================================================================
/**
 * creates video and audio encoder lists from the ffmpeg output string
 */
function parseEncodersString ()
{
    localConfig.videoEncoders = [];
    localConfig.audioEncoders = [];
    const tempArray = localConfig.ffmpegEncodersString.split("\r\n")
    let postHeader
    for (let i = 0; i < tempArray.length; i++)
    {
        //skip to end of header
        if (tempArray[i] == " ------")
        {
            postHeader = true;
            continue;
        }
        if (!postHeader)
            continue;
        if (tempArray[i])
        {
            //console.log("tempArray[i]", tempArray[i])
            if (tempArray[i].indexOf(" V") == 0)
                localConfig.videoEncoders.push(tempArray[i].split(" ")[2])
            else if (tempArray[i].indexOf(" A") == 0)
                localConfig.audioEncoders.push(tempArray[i].split(" ")[2])

        }
    }
    console.log("FFMPEG video encoders found", localConfig.videoEncoders.length);
    console.log("FFMPEG audio encoders found", localConfig.audioEncoders.length);
}
// ============================================================================
//                           FUNCTION: printProgress
// ============================================================================
/**
 * overwrites a string on the cmd line, mostly useful for progress etc
 * @param {string} progress 
 */
function printProgress (progress)
{
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}

// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };

