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
import * as fs from "fs";
import { dirname } from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as ffmpeg from "./ffmpeg.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// volatile variables
const localConfig = {
    // StreamRoller stuff
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    dataCenterApp: null,
    host: null,
    port: null,
    SendSettingsWidgetLargeTimerHandle: null,
    serverCredentials: {},

    //extensions basics
    multistreamStarStreaming: "off",
    streamRunning: false,

    // encoders
    ffmpegEncodersString: null,
    Encoders: {},
    encodersUpdating: false, // flag for when we are done updating encoders, if we need to get them.
    //others
    hideStreamKey: true, // show stream key on the screen or not
    encoderBuildTimeoutHandle: null, // cancels the encoder builder (in case it gets stuck)
    encoderBuildTimeout: 10000, // give ourselves 10 seconds to run the builder or quit if not finished
}

// default empty stream object that wil be used to create new stream objects when we add user expansion of the number of streams available
const defaultEmptyStream =
{
    enabled: "off",
    name: "multistream",
    configurationMode: "Simple",
    Advanced: "",
    URL: "",
    AdditionalURL: "",//goes between URL and StreamKey
    AdditionalParams: "",//goes after StreamKey
    variableBitrate: "off",
    videoEncoder: "",// card dependant, need to check ffmpeg and update as needed
    videoEncoderOption: "",
    videoEncoderOptionParameters: "",
    targetBitrate: "8M",
    resolution: "1664x936",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioEncoderOption: "",
    audioEncoderOptionParameters: "",
    audioChannels: "2", // number of audio channels output (defaults to source)
    audioBitrate: "128k",
    outputFormat: "flv",
}
// setup some defaults for twitch/youtube to help users get started etc
const defaultTwitchStream =
{
    enabled: "off",
    name: "Twitch",
    configurationMode: "Simple",
    Advanced: "",
    URL: "rtmp://live.twitch.tv/app",
    AdditionalURL: "",
    AdditionalParams: "?bandwidthtest=true",
    variableBitrate: "off",
    videoEncoder: "h264_nvenc",
    videoEncoderOption: "-preset",
    videoEncoderOptionParameters: "p4",
    targetBitrate: "8M",
    resolution: "1664x936",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioEncoderOption: "",
    audioEncoderOptionParameters: "",
    audioChannels: "",
    audioBitrate: "128k",
    outputFormat: "flv",
}
const defaultYouTubeStream =
{
    enabled: "off",
    name: "Youtube",
    Advanced: "",
    configurationMode: "Simple",
    URL: "rtmp://b.rtmp.youtube.com/live2",
    AdditionalURL: "",
    AdditionalParams: "",
    variableBitrate: "off",
    videoEncoder: "h264_nvenc",
    videoEncoderOption: "-preset",
    videoEncoderOptionParameters: "p4",
    targetBitrate: "8M",
    resolution: "1920x1080",
    framerate: "30",
    keyframeInterval: "60",
    audioEncoder: "aac",
    audioEncoderOption: "",
    audioEncoderOptionParameters: "",
    audioChannels: "",
    audioBitrate: "128k",
    outputFormat: "flv",
}

const default_serverConfig = {
    __version__: "0.1",
    multistreamEnabled: "off",
    extensionname: "multistream",
    channel: "MULTISTREAM",
    streams: [defaultTwitchStream, defaultYouTubeStream, defaultTwitchStream, defaultTwitchStream],
    localStreamPort: 1935,
    localStreamURL: "rtmp://localhost:localStreamPort/live/",
    multistream_restore_defaults: "off",
    useStreamRollerFFMPEG: false,
};

let serverConfig = structuredClone(default_serverConfig)
localConfig.serverCredentials =
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
            /* {
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
             }*/
        ],
}
/**
 * 
 * @param {string} app 
 * @param {string} host 
 * @param {string} port 
 * @param {number} heartbeat 
 */
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    localConfig.dataCenterApp = app
    localConfig.host = host
    localConfig.port = port

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
    ffmpeg.init();
    SetupWebpageServer();
    // TBD needs to only be run when we are enabled ideally rather than at each start of the
    // extension load
    ffmpeg.UpdateEncodersAvailable()
        .then((ret) =>
        {
            localConfig.Encoders = ffmpeg.getEncoders();
        })
}
// ============================================================================
//                           FUNCTION: SetupWebpageServer
// ============================================================================
/**
 * Start the webserver. Mostly used to download encoders list to save on 
 * websocket bandwidth
 */
function SetupWebpageServer ()
{
    try
    {
        localConfig.dataCenterApp.get('/multistream/data/encoders.json', (req, res) =>
        {
            fs.readFile(__dirname + '/data/encoders.json', 'utf8', (err, data) =>
            {
                if (err)
                {
                    return res.status(500).json({ error: "Error reading JSON file" });
                }
                res.json(JSON.parse(data)); // Send JSON as API response
            });
        });
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "initialise failed:", err);
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
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "LIVE_PORTAL")
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
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data && server_packet.data.extensionname
            && server_packet.data.extensionname === serverConfig.extensionname)
        {
            let ffmpegChanged = false;
            let configSubVersions = 0;
            let defaultSubVersions = default_serverConfig.__version__.split('.');
            // should only be hit on very first run when there is no saved data file
            if (!server_packet.data.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                SaveConfigToServer();
            }
            configSubVersions = server_packet.data.__version__.split('.')

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
                // check if we have turned on the extension
                if (server_packet.multistreamEnabled == "on" && server_packet.multistreamEnabled == "off")
                    ffmpegChanged = true;
                serverConfig = structuredClone(server_packet.data);
            }
            ffmpeg.useStreamRollerFfmpeg(serverConfig.useStreamRollerFFMPEG)
            SendSettingsWidgetSmall();
            if (ffmpegChanged)
                checkFFMPEGAvailabilities();
            else
                SendSettingsWidgetLarge();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            localConfig.serverCredentials = structuredClone(server_packet.data);
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
            SendSettingsWidgetSmall();
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge();
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
            console.log("TBD:action_multistreamStartStream called with", extension_packet.data)
        }
        else if (extension_packet.type === "action_multistreamStopStream")
        {
            console.log("TBD:action_multistreamStopStream called with", extension_packet.data)
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
        //let extension_packet = server_packet.data;
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
}

// ============================================================================
//                           FUNCTION: parseSettingsWidgetSmall
// ============================================================================
/**
 * Our small settings widget was submitted
 * @param {object} extension_data 
 */
function parseSettingsWidgetSmall (extension_data)
{
    let extensionTurnedOn = false
    let streamOnOffChanged = false

    // multistreamStarStreaming is stored in localConfig as we should never startup StreamRoller with it enabled so it defaults to off on restart
    if (!extension_data.multistreamStarStreaming)
    {
        if (localConfig.multistreamStarStreaming == "on")
            streamOnOffChanged = true;
        localConfig.multistreamStarStreaming = "off"
    }
    else
    {
        // have have turned the streaming on
        if (localConfig.multistreamStarStreaming == "off")
            streamOnOffChanged = true
        localConfig.multistreamStarStreaming = "on"
    }
    // turn them off here/ they will be turned back on if checkboxes are set in the ui
    serverConfig.streams.forEach((stream, i) =>
    {
        stream.enabled = "off";
    })
    if (extension_data.multistreamEnabled == "on" && serverConfig.multistreamEnabled == "off")
        extensionTurnedOn = true;

    // set any checkbox data to off at this point as it won't appear in extension_data if turned off
    serverConfig.multistreamEnabled = "off";

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
    }
    SaveConfigToServer();
    if (extensionTurnedOn && localConfig.Encoders.videoEncoders == {} && localConfig.Encoders.audioEncoders == {})
        //extension has just been turned on
        checkFFMPEGAvailabilities();
    if (streamOnOffChanged && serverConfig.multistreamEnabled)
    {
        if (localConfig.multistreamStarStreaming == "on")
            startStream("multistream")
        else
            stopStream()
    }
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall();
    SendSettingsWidgetLarge();
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetLarge
// ============================================================================
/**
 * Our large settings widget was submitted
 * @param {object} extension_data 
 */
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
            if (extension_data[`multistreamStream${i}StreamKey`] != localConfig.serverCredentials[`multistreamStream${i}StreamKey`])
            {
                localConfig.serverCredentials[`multistreamStream${i}StreamKey`] = extension_data[`multistreamStream${i}StreamKey`];
                credsChanged = true;
            }
            if ((extension_data.multistreamffmpegpicker == "1") != serverConfig.useStreamRollerFFMPEG)

                ffmpegChanged = true;
        })

        if (credsChanged)
            saveCredentialsToServer()
        if (ffmpegChanged)
            checkFFMPEGAvailabilities();
        // check the config values
        for (const [key, value] of Object.entries(extension_data))
        {
            console.log("setting ", key, "to", value)
            // attempt to get an id value
            // take the last 2 chars, remove the underscore if there is one.
            // this limits us to 100 streams (as will _99 will work with this method)
            var streamId = key.substring(key.length - 2).replace("_", "")
            if (serverConfig.streams[streamId])
            {
                console.log(`serverConfig.streams[${streamId}]`, serverConfig.streams[streamId])
                var variableName = key.replace("multistream_", "").replace("_" + streamId, "")
                serverConfig.streams[streamId][variableName] = value
            }
            else
            {
                if (serverConfig[key])
                    serverConfig[key] = value;
            }
        }
        serverConfig.useStreamRollerFFMPEG = (extension_data.multistreamffmpegpicker == "1");
        ffmpeg.useStreamRollerFfmpeg((extension_data.multistreamffmpegpicker == "1"))
        if (extension_data["multistream_hideStreamKey"] == "on")
            localConfig.hideStreamKey = true;
        else
            localConfig.hideStreamKey = false;

        let ffmpegDebug = {};
        if (extension_data["multistream_DEBUG_FFMPEG"] == "on")
            ffmpegDebug.DEBUG_FFMPEG = true;
        else
            ffmpegDebug.DEBUG_FFMPEG = false;

        if (extension_data["multistream_DEBUG_FFMPEG_STDERR"] == "on")
            ffmpegDebug.DEBUG_FFMPEG_STDERR = true;
        else
            ffmpegDebug.DEBUG_FFMPEG_STDERR = false;

        if (extension_data["multistream_DEBUG_FFMPEG_STDOUT"] == "on")
            ffmpegDebug.DEBUG_FFMPEG_STDOUT = true;
        else
            ffmpegDebug.DEBUG_FFMPEG_STDOUT = false;
        ffmpeg.setDebug(ffmpegDebug);
        // if we want to use our installed version but don't have it then call the download function
        if (serverConfig.useStreamRollerFFMPEG && !ffmpeg.getInstalledFFMPEGs().streamRollerFfmpegInstalled && serverConfig.multistreamEnabled == "on")
            ffmpeg.downloadFFMPEG()

        SaveConfigToServer();
    }
    //update anyone who is showing our code at the moment
    SendSettingsWidgetSmall();
    // if changed we will update our Availabilities and this will send this out anyway
    if (!ffmpegChanged)
        SendSettingsWidgetLarge();
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * update and send out our small settings widget
 */
function SendSettingsWidgetSmall ()
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
            if (localConfig.multistreamStarStreaming == "on")
                modalString = modalString.replace("multistreamStarStreamingchecked", "checked");
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
                    "ChannelData",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
                        serverConfig.channel,
                        "",
                    ),
                    serverConfig.channel,
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 */
function SendSettingsWidgetLarge ()
{
    // if encoders are updating don't send out a widget page yet. start a timer to check for when they have finished updating to send out the widget
    let ffmpegBusyFlags = ffmpeg.ffmpegBusyFlags();
    // check if ffmpeg is currently updating
    if (ffmpegBusyFlags.getEncoders || ffmpegBusyFlags.getEncoderOptions > 0)
    {
        // clear previous timers (has the benefit of squashing multiple requests to sending one result out)
        clearTimeout(localConfig.SendSettingsWidgetLargeTimerHandle)
        localConfig.SendSettingsWidgetLargeTimerHandle = setTimeout(() =>
        {
            SendSettingsWidgetLarge()
        }, 500);
        return;
    }
    // if we receive another request timer might still be running but not busy so cancel the timer and send it out now
    clearTimeout(localConfig.SendSettingsWidgetLargeTimerHandle)
    localConfig.SendSettingsWidgetLargeTimerHandle = null;

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

            /* replacement text for variables */
            const ffmpegExe = __dirname.replaceAll("\\", "\\\\") + "\\bin\\ffmpeg.exe"
            modalString = modalString.replace("currentCommand: replace",
                "currentCommand: '" + ffmpegExe.replaceAll("\\\\", "\\") + " " + buildFFMPEGArgs(localConfig.hideStreamKey).join(" ") + "'")
            modalString = modalString.replace("multistreamtextcurrentCommand", ffmpegExe.replaceAll("\\\\", "\\") + " " + buildFFMPEGArgs(localConfig.hideStreamKey).join(" "))
            modalString = modalString.replace("ffmpegExe: replace",
                "ffmpegExe: '" + ffmpegExe + "'")
            modalString = modalString.replace("InstalledFFMPEGs: replace",
                "InstalledFFMPEGs: " + JSON.stringify(ffmpeg.getInstalledFFMPEGs()))
            modalString = modalString.replace("useStreamRollerFFMPEG: replace",
                "useStreamRollerFFMPEG: " + serverConfig.useStreamRollerFFMPEG)
            modalString = modalString.replace("streams: replace",
                "streams:" + JSON.stringify(serverConfig.streams))
            modalString = modalString.replace("serverCredentials: replace",
                "serverCredentials: " + JSON.stringify(localConfig.serverCredentials))
            modalString = modalString.replace("ffmpegDebug: replace",
                "ffmpegDebug: " + JSON.stringify(ffmpeg.getDebug()))
            modalString = modalString.replace("hideStreamKey: replace",
                "hideStreamKey: " + localConfig.hideStreamKey);
            modalString = modalString.replace("complexityMode: replace",
                "complexityMode: " + "'Simple'")

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
                        "",
                    ),
                    serverConfig.channel,
                    ""
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
//                           FUNCTION: saveCredentialsToServer
// ============================================================================
/**
 * Sends our credentials to the server to be saved for next time we run
 */
function saveCredentialsToServer ()
{
    for (var c in localConfig.serverCredentials)
    {
        let creds = {
            ExtensionName: serverConfig.extensionname,
            CredentialName: c,
            CredentialValue: localConfig.serverCredentials[c]
        }
        // can't set empty credentials
        if (localConfig.serverCredentials[c] == "")
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
/**
 * 
 * @param {string} ref identifier that is carried over from an action or defaulted
 */
function startStream (ref = "multistream")
{
    if (localConfig.ffmpegHandle && localConfig.ffmpegHandle != null)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".startStream", "A stream is already running");
        return;
    }

    localConfig.ffmpegHandle = ffmpeg.runFFMPEG(
        ffmpeg.getFFMPEGCommand(),
        buildFFMPEGArgs(false),
        //{ shell: true },
        {},
        function processCB (handle)
        {
            // console.log("handle", JSON.stringify(handle, null, 2))
        },
        function streamStarted (handle)
        {
            if (!localConfig.streamRunning)
            {
                localConfig.streamRunning = true;
                sendStreamStartedTrigger(ref);
                sendOBSStartAction(ref);
            }
            // console.log("handle", JSON.stringify(handle, null, 2))
        },
        function streamFinished (data, out, err)
        {
            localConfig.streamRunning = false;
            sendStreamStoppedTrigger();
            sendOBSStopAction(ref);
            localConfig.ffmpegHandle = null
            localConfig.multistreamStarStreaming = "off"
        }
    )
}
// ============================================================================
//                           FUNCTION: buildFFMPEGArgs
// ============================================================================

/**
 * Builds the argument string for ffmpeg
 *  @param {boolean} hideStreamKey //if true replaces keys with placeholders
 * @returns ffmpeg args for the given stream
 */
function buildFFMPEGArgs (hideStreamKey = true)
{
    let OBSUrl = serverConfig.localStreamURL.replace("localStreamPort", serverConfig.localStreamPort);
    let ffmpegArgs =
        [
            //"-v", "1",
            "-listen", "1",  // Makes FFmpeg listen for incoming RTMP stream
            "-i",
            OBSUrl + localConfig.serverCredentials.localStreamKey,
        ]
    // examples
    //-c copy -f flv rtmp://twitch 
    //-c:v libx264 -preset medium -maxrate 3500k -bufsize 6000k -r 30 -pix_fmt yuv420p -g 60 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp//:facebook
    serverConfig.streams.forEach((stream, i) =>
    {
        if (stream.enabled == "on")
        {
            if (stream.configurationMode == "Simple")
            {
                ffmpegArgs.push("-c"); ffmpegArgs.push("copy");
                ffmpegArgs.push("-f"); ffmpegArgs.push("flv");
                if (stream.URL && stream.URL != "")
                {
                    if (hideStreamKey)
                        ffmpegArgs.push(stream.URL + "/STREAM_KEY_GOES_HERE");
                    else
                        ffmpegArgs.push(stream.URL + "/" + localConfig.serverCredentials[`multistreamStream${i}StreamKey`]);
                }
                else
                    console.log(`Multistream: missing URL for stream ${i}: ${stream.name}`)
            }
            else
            {
                if (stream.videoEncoder && stream.videoEncoder != "")
                {
                    ffmpegArgs.push("-c:v");
                    ffmpegArgs.push(stream.videoEncoder);
                    if (stream.videoEncoderOption && stream.videoEncoderOption != "" && stream.videoEncoderOption != "none")
                    {
                        ffmpegArgs.push(stream.videoEncoderOption);
                        if (stream.videoEncoderOptionParameters && stream.videoEncoderOptionParameters != "" && stream.videoEncoderOptionParameters != "EMPTY")
                        {

                            let array = stream.videoEncoderOptionParameters.split(" ")
                            array.forEach((value, i) =>
                            {
                                //ffmpegArgs.push("-preset"); 
                                ffmpegArgs.push(value);
                            })
                        }
                    }
                }
                //set the basic options
                if (stream.variableBitrate == "on")
                { ffmpegArgs.push("-rc"); ffmpegArgs.push("vbr"); }//variable bitrate
                else
                { ffmpegArgs.push("-rc"); ffmpegArgs.push("cbr"); }//constant bitrate
                if (stream.targetBitrate && stream.targetBitrate != "")
                { ffmpegArgs.push("-b:v"); ffmpegArgs.push(stream.targetBitrate); }
                if (stream.resolution && stream.resolution != "")
                { ffmpegArgs.push("-s"); ffmpegArgs.push(stream.resolution); }
                if (stream.framerate && stream.framerate != "")
                { ffmpegArgs.push("-r"); ffmpegArgs.push(stream.framerate); }//use a standard frame rate
                if (stream.keyframeInterval && stream.keyframeInterval != "")
                { ffmpegArgs.push("-g"); ffmpegArgs.push(stream.keyframeInterval); }
                if (stream.audioEncoder && stream.audioEncoder != "")
                {
                    ffmpegArgs.push("-c:a");
                    ffmpegArgs.push(stream.audioEncoder);
                    if (stream.audioEncoderOption && stream.audioEncoderOption != "" && stream.audioEncoderOption != "none")
                    {
                        ffmpegArgs.push(stream.audioEncoderOption);
                        if (stream.audioEncoderOptionParameters && stream.audioEncoderOptionParameters != "" && stream.audioEncoderOptionParameters != "EMPTY")
                        {
                            let array = stream.audioEncoderOptionParameters.split(" ")
                            array.forEach((value, i) =>
                            {
                                ffmpegArgs.push(value);
                            })
                        }
                    }
                }
                if (stream.audioChannels && stream.audioChannels != "")
                { ffmpegArgs.push("-ac"); ffmpegArgs.push(stream.audioChannels); } // stereo sound
                //ffmpegArgs.push("-crf"); ffmpegArgs.push("18"); // set a constant rate factor to 'visually lossless'
                if (stream.audioBitrate && stream.audioBitrate != "")
                { ffmpegArgs.push("-b:a"); ffmpegArgs.push(stream.audioBitrate); }
                if (stream.outputFormat && stream.outputFormat != "")
                { ffmpegArgs.push("-f"); ffmpegArgs.push(stream.outputFormat) }

                if (stream.URL && stream.URL != "")
                {
                    if (hideStreamKey)
                        ffmpegArgs.push(stream.URL + stream.AdditionalURL + "/STREAM_KEY_GOES_HERE" + stream.AdditionalParams);
                    else
                        ffmpegArgs.push(stream.URL + stream.AdditionalURL + "/" + localConfig.serverCredentials[`multistreamStream${i}StreamKey`] + stream.AdditionalParams);
                }
                else
                    console.log(`Multistream: missing URL for stream ${i}: ${stream.name}`)
            }
        }
    });
    return ffmpegArgs;
}
// ============================================================================
//                           FUNCTION: stopStream
// ============================================================================
/**
 * Stop streaming
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
 * kills the current ffmpeg process
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
// ============================================================================
//                           process terminate Callback
// ============================================================================
// Graceful shutdown on Ctrl+C/exit
process.on("SIGINT", () =>
{
    if (localConfig.ffmpegHandle)
        localConfig.ffmpegHandle.kill("SIGINT"); // Sends SIGINT to FFmpeg
    process.exit();
});

// ============================================================================
//                           FUNCTION: sendOBSStartAction
// ============================================================================
/**
 * tells OBS to start streaming
 * @param {string} triggerActionRef pass through reference from action or "multistream"
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
 * @param {string} triggerActionRef pass through reference from action or "multistream"
 */
function sendOBSStopAction (triggerActionRef = "multistream")
{
    let action = {
        messagetype: "action_StopStream",
        to: "obs",
        data: {
            //param data from the extensions action definition
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
 * @param {string} triggerActionRef pass through reference from action or "multistream"
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
 * @param {string} triggerActionRef pass through reference from action or "multistream"
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
 * @param {object} action {messagetype:..', to:..., data: {<< action params >>}}
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
//                           FUNCTION: createCheckBox
// ===========================================================================
/**
 * 
 * @param {string} description 
 * @param {string} name 
 * @param {boolean} checked 
 * @returns html code of the checkbox
 */
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
//                            GET FFMPEG INFO
// Stuff like video encoders available etc
// ############################################################################
// ============================================================================
//                      FUNCTION: checkFFMPEGAvailabilities
// ============================================================================
/**
 * Checks and updates availabilities of FFMPEG with current settings
 * and builds the encoders lists
 */
function checkFFMPEGAvailabilities ()
{
    //ffmpeg.checkFFMPEGInstall()
    let ffmpegExe = ffmpeg.getFFMPEGCommand();
    localConfig.encodersUpdating = true;

    // if we don't have a command we can't run so just send the widget
    if (!ffmpegExe)
    {
        console.log("calling SendSettingsWidgetLarge from checkFFMPEGAvailabilities ()")
        SendSettingsWidgetLarge();
        return;
    }
    // get our video encoders
    ffmpeg.UpdateEncodersAvailable()
        .then((encoders) =>
        {
            console.log("encoders returned", encoders)
            SendSettingsWidgetLarge();
        })
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
