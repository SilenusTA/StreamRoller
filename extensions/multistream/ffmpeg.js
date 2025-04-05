/**
 * Copyright (C) 2025 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import commandExists from 'command-exists';
import axios from 'axios';
import process from 'process';
import * as fs from "fs";
import { exec, spawn, spawnSync } from "node:child_process";
import * as logger from "../../backend/data_center/modules/logger.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    // ############### Streamroller stuff
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    extensionname: "multistream",
    // Ensure we wait for captured streams to end before calling endCB
    exitError: null,
    // Buffers and flags
    stdoutBuffer: [],
    stderrBuffer: [],
    exitFlags: [],
    debugOptions: {},
    busyFlags: [],

    // ffmpeg command 
    // installed version of ffmpeg available/installed/selected
    ffmpegVersion: "",
    streamRollerFfmpegInstalled: false,
    userFfmpegInstalled: false,
    useStreamRollerFfmpeg: false,//use/install ffmpeg in bin dir

    // encoder stuff
    ffmpegEncodersString: null,
    encoderFileName: "data/encoders.json",
    audioEncoders: {},
    videoEncoders: {},


    // download options for ffmpeg
    ffmpegDownloadURL: "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl-shared.zip",
    ffmpegFolder: __dirname + "\\bin\\",
    ffmpegDownloadZip: __dirname + "\\bin\\ffmpeg.zip",
    ffmpegExe: __dirname + "\\bin\\ffmpeg.exe",
    ffmpegHandle: null,

    // ################ Timer Handles
    encoderBuildTimeout: 10000,
    encoderBuildTimeoutHandle: null,
    // timer handle to wait for UpdateEncodersAvailable() to finish before returning promises
    waitForUpdateEncodersAvailableTimeout: 500,
    waitForUpdateEncodersAvailableHandle: null,
    // encoders json file save handle (to avoid saving in the middle of an update)
    encodersFileSaveTimerTimeout: 500,
    encodersFileSaveTimerHandle: null,

    waitForParseEncodersStringTimeout: 500,
    waitForParseEncodersStringHandle: null,

    // ############### promise cache handles
    // promise handles so we can cache results rather than run multiple times
    UpdateEncodersAvailablePromiseCache: null,
    parseEncodersStringPromiseCache: null,
}
// ============================================================================
//                           FUNCTION: init
// ============================================================================
/**
 * 
 */
function init ()
{
    // setup monitoring flags
    localConfig.busyFlags.streaming = false;
    localConfig.busyFlags.getEncoders = false;
    localConfig.busyFlags.getEncoderOptions = 0;

    // setup debug options
    localConfig.debugOptions.DEBUG_FFMPEG = false;
    localConfig.debugOptions.DEBUG_FFMPEG_STDERR = false;
    localConfig.debugOptions.DEBUG_FFMPEG_STDOUT = false;

    //set process exited flags
    localConfig.exitFlags.processExited = true;
    localConfig.exitFlags.stdoutClosed = true;
    localConfig.exitFlags.stderrClosed = true;

    checkFFMPEGInstall();
}
// ============================================================================
//                           FUNCTION: useStreamRollerFfmpeg
// ============================================================================
/**
 * Should we use StreamRoller FFMPEG or the PC Installed one (if available)
 * @param {boolean} useStreamRoller 
 */
function useStreamRollerFfmpeg (useStreamRoller)
{
    localConfig.useStreamRollerFfmpeg = useStreamRoller;
}
// ============================================================================
//                           FUNCTION: getInstalledFFMPEGs
// ============================================================================
/**
 * Returns the types of FFMPEG we have installed (ie user or StreamRoller)
 * {streamRollerFfmpegInstalled,userFfmpegInstalled}
 */
function getInstalledFFMPEGs ()
{
    return {
        streamRollerFfmpegInstalled: localConfig.streamRollerFfmpegInstalled,
        userFfmpegInstalled: localConfig.userFfmpegInstalled
    };
}
// ============================================================================
//                           FUNCTION: ffmpegBusyFlags
// ============================================================================
/**
 * checks if ffmpegBusyFlags processing is still happening, ie encoder queries etc
 * @returns boolean
 */
function ffmpegBusyFlags () 
{
    return localConfig.busyFlags;
    /*return (
        Object.values(localConfig.busyFlags).includes(true)
        || localConfig.busyFlags.getEncoderOptions > 0)
        ;
        */
}
// ============================================================================
//                           FUNCTION: runFFMPEG
// ============================================================================
/**
 * 
 * @param {string} command 
 * @param {array} args 
 * @param {object} options 
 * @param {callback} processCB 
 * @param {callback} streamStarted 
 * @param {callback} streamFinished 
 * @returns 
 */
function runFFMPEG (command, args, options = {}, processCB = null, streamStarted = null, streamFinished = null)
{
    localConfig.exitFlags.processExited = false;
    let ffmpegProc = spawn(command, args, options);
    localConfig.busyFlags.streaming = true;
    if (localConfig.debugOptions.DEBUG_FFMPEG)
        console.log("ffmpegProc ", command, args.join(' '));

    ffmpegProc.on('error', function (err)
    {
        localConfig.exitFlags.processExited = true;
        localConfig.busyFlags.streaming = false;
        console.log("ffmpegProc:error()", err)
        streamFinished(err);
    });

    ffmpegProc.on('exit', function (code, signal)
    {
        if (signal)
        {
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log("ffmpeg:exit()was killed with signal " + signal.toString());

        } else if (code)
        {
            console.log("ffmpeg:exit()exited with code " + code.toString());
        } else
        {
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log("ffmpeg:exit()");
        }
        localConfig.exitFlags.processExited = true;
        localConfig.busyFlags.streaming = false;
        streamFinished();
    });

    // Capture stdout buffer
    ffmpegProc.stdout.on('data', function (data)
    {
        localConfig.exitFlags.stdoutClosed = false;
        localConfig.busyFlags.streaming = true;
        localConfig.stdoutBuffer.push(data.toString())
    });

    ffmpegProc.stdout.on('close', function ()
    {
        localConfig.exitFlags.stdoutClosed = true
        localConfig.busyFlags.streaming = false;
        if (localConfig.debugOptions.DEBUG_FFMPEG_STDOUT)
            console.log("ffmpeg:stdout:close")
        handleExit(null, streamFinished);
    });

    // Capture stderr buffer
    ffmpegProc.stderr.on('data', function (data)
    {
        localConfig.exitFlags.stderrClosed = false
        localConfig.busyFlags.streaming = true;
        localConfig.stderrBuffer.push(data.toString())
        // on first data we notify stream is running so we can start OBS etc
        if (!localConfig.streamRunning)
            streamStarted();
        if (localConfig.debugOptions.DEBUG_FFMPEG_STDERR)
            console.log("ffmpeg:stderr:data()", JSON.stringify(data.toString(), null, 2))
    });

    ffmpegProc.stderr.on('close', function ()
    {
        //stderrBuffer.push('close')
        if (localConfig.debugOptions.DEBUG_FFMPEG_STDERR)
            console.log("ffmpeg:stderr:close()")
        localConfig.exitFlags.stderrClosed = true;
        localConfig.busyFlags.streaming = false;
        handleExit(null, streamFinished);
    });

    // Call process callback
    processCB(ffmpegProc);
    return ffmpegProc;
}
// ============================================================================
//                           FUNCTION: handleExit
// ============================================================================
/**
 * 
 * @param {error} err 
 * @param {callback} endCB 
 */
function handleExit (err, endCB)
{
    if (localConfig.debugOptions.DEBUG_FFMPEG)
        console.log(`handleExit(${err},endCB())`)
    let exitError = null;
    if (err)
    {
        exitError = err;
    }

    if (localConfig.exitFlags.processExited && (localConfig.exitFlags.stdoutClosed) && localConfig.exitFlags.stderrClosed)
    {
        endCB(exitError, localConfig.exitFlags.stdoutBuffer, localConfig.exitFlags.stderrBuffer);
    }
}
// ============================================================================
//                           FUNCTION: setDebug
// ============================================================================
/**
 * 
 * @param {object} debugOptions 
 */
function setDebug (debugOptions)
{
    localConfig.debugOptions = debugOptions
}
// ============================================================================
//                           FUNCTION: getDebug
// ============================================================================
/**
 * 
 * @returns object
 */
function getDebug ()
{
    return localConfig.debugOptions
}
// ============================================================================
//                           FUNCTION: getEncoders
// ============================================================================
/**
 * 
 * @returns object {videoEncoders[],audioEncoders[]}
 */
function getEncoders ()
{
    return { videoEncoders: localConfig.videoEncoders, audioEncoders: localConfig.audioEncoders }
}
// ============================================================================
//                      FUNCTION: UpdateEncodersAvailable
// ============================================================================
/**
 * Query the Computer for ffmpeg encoders
 * @returns Promise with encoders object when resolved or null 
 */
function UpdateEncodersAvailable ()
{
    if (localConfig.debugOptions.DEBUG_FFMPEG)
        console.log("UpdateEncodersAvailable ()")
    let ffmpegExe = getFFMPEGCommand()
    // if we already have an instance running then return that promise
    // this will effectively cache calls to this function for multiple users
    if (!localConfig.UpdateEncodersAvailablePromiseCache)
    {
        localConfig.UpdateEncodersAvailablePromiseCache = new Promise((resolve, reject) =>
        {
            let finished = false;
            let timeout = false;
            let uptoEncoders = false;
            localConfig.busyFlags.getEncoders = true;
            // just in case the command fails or we don't finish early enough lets kill it after 10 seconds
            if (!localConfig.encoderBuildTimeoutHandle)
            {
                localConfig.encoderBuildTimeoutHandle = setTimeout(() =>
                {
                    console.log("Encoder query taking too long, Exiting")
                    timeout = true;
                }, localConfig.encoderBuildTimeout)
            }
            //let args = ["-hide_banner"];
            //need the banner to get the version line
            let args = ["-encoders"];
            let ffmpegHandle = spawn(ffmpegExe, args);
            localConfig.ffmpegEncodersString = "";

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
                clearTimeout(localConfig.encoderBuildTimeoutHandle)
                localConfig.encoderBuildTimeoutHandle = null;
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
                let text = data.toString()
                if (text.indexOf("Encoders:") == 0)
                    uptoEncoders = true;

                if (uptoEncoders)
                    localConfig.ffmpegEncodersString += text
            });

            ffmpegHandle.stdout.on('close', function ()
            {
                if (localConfig.debugOptions.DEBUG_FFMPEG_STDOUT)
                    console.log("UpdateEncodersAvailable():stdout:close()")
            });
            // Capture stderr if specified
            ffmpegHandle.stderr.on('data', function (data)
            {
                // get the version number
                let text = data.toString()
                if (text.indexOf("ffmpeg version") == 0)
                    localConfig.ffmpegVersion = text.split('\n')[0].replace("\r", "")
                //console.log("stdout:adding:stderr:", data)
            })

            ffmpegHandle.stderr.on('close', function ()
            {
                if (localConfig.debugOptions.DEBUG_FFMPEG_STDERR)
                    console.log("UpdateEncodersAvailable():stderr:close()")
            });
            let count = 0;
            localConfig.waitForUpdateEncodersAvailableHandle = setInterval(async () =>
            {
                if (localConfig.debugOptions.DEBUG_FFMPEG)
                    console.log("waiting for exit", count++, finished, timeout)
                if (finished || timeout)
                {
                    if (timeout)
                        if (localConfig.debugOptions.DEBUG_FFMPEG)
                            console.log("UpdateEncodersAvailable():Encoder search timed out")
                    finished = false;
                    clearInterval(localConfig.waitForUpdateEncodersAvailableHandle)
                    await parseEncodersString(ffmpegExe);
                    localConfig.busyFlags.getEncoders = false;
                    if (timeout)
                        reject(null)
                    else
                    {
                        updateEncoderWebJSONFile();
                        resolve(true);
                    }
                }
            }, localConfig.waitForUpdateEncodersAvailableTimeout);
        })
    }
    return localConfig.UpdateEncodersAvailablePromiseCache;
}
// ============================================================================
//                           FUNCTION: parseEncodersString
// ============================================================================
/**
 * creates video and audio encoder lists from the ffmpeg output string
 * @param {string} ffmpegExe 
 * @returns Promise (true) or error
 */
async function parseEncodersString (ffmpegExe)
{
    if (!localConfig.parseEncodersStringPromiseCache)
    {
        localConfig.parseEncodersStringPromiseCache = new Promise((resolve, reject) =>
        {
            try
            {
                // clear out any old data
                localConfig.videoEncoders = {};
                localConfig.audioEncoders = {};
                let videoEncoderCounter = 0;
                let audioEncoderCounter = 0;
                const tempArray = localConfig.ffmpegEncodersString.split("\r\n")
                let postHeader = false;
                //scan lines
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
                        if (tempArray[i].indexOf(" V") == 0)
                        {
                            const videoEncoderName = tempArray[i].split(" ")[2];
                            if (videoEncoderName && videoEncoderName != "")
                            {
                                videoEncoderCounter++;
                                localConfig.videoEncoders[videoEncoderName] = [];
                                getEncoderOptions(ffmpegExe, videoEncoderName)
                                    .then((opt) =>
                                    {
                                        videoEncoderCounter--;
                                        localConfig.videoEncoders[videoEncoderName] = opt;
                                    })
                            }
                        }
                        else if (tempArray[i].indexOf(" A") == 0)
                        {
                            const audioEncoderName = tempArray[i].split(" ")[2];
                            if (audioEncoderName && audioEncoderName != "")
                            {
                                audioEncoderCounter++;
                                localConfig.audioEncoders[audioEncoderName] = [];
                                getEncoderOptions(ffmpegExe, audioEncoderName)
                                    .then((opt) =>
                                    {
                                        audioEncoderCounter--;
                                        localConfig.audioEncoders[audioEncoderName] = opt
                                    })
                            }
                        }
                    }
                }
                localConfig.waitForParseEncodersStringHandle = setInterval(async () =>
                {
                    if (videoEncoderCounter == 0 && audioEncoderCounter == 0)
                    {
                        if (localConfig.debugOptions.DEBUG_FFMPEG)
                            console.log("parseEncodersString():finished")
                        clearInterval(localConfig.waitForParseEncodersStringHandle)
                        updateEncoderWebJSONFile();
                        resolve(true);
                    }
                }, localConfig.waitForParseEncodersStringTimeout);
            }
            catch (err)
            {
                console.log("parseEncodersString():err", err)
                reject(err)
            }
        })
    }
    //new addition
    return localConfig.parseEncodersStringPromiseCache;
}

// ============================================================================
//                           FUNCTION: getEncoderOptions
// ============================================================================
/**
 * 
 * @param {string} ffmpegExe 
 * @param {string} encoder 
 * @returns array of options for the given encoder
 */
async function getEncoderOptions (ffmpegExe, encoder)
{
    localConfig.busyFlags.getEncoderOptions++;
    return new Promise((resolve, reject) =>
    {
        exec(`${ffmpegExe} -hide_banner -h encoder=${encoder}`, (error, stdout, stderr) =>
        {
            if (error) return reject(`Error: ${stderr || error.message}`);
            let startParsing = false

            const options = { "none": "" };
            let optionName = ""
            const lines = stdout.split("\n");
            for (const line of lines)
            {
                if (line.includes("AVOptions"))
                {
                    startParsing = true
                    continue;
                }
                if (!startParsing)
                    continue;
                let regex = /^ {2}-(.+)/;
                let match = regex.test(line)
                if (match)
                {
                    let linearr = line.trim().replaceAll(/\s\s+/g, ' ').split(" ")
                    optionName = linearr[0]
                    //options[optionName] = "EMPTY"
                    options[optionName] = line.trim().replace(optionName, "").replace(linearr[2], "")
                }
            }
            localConfig.busyFlags.getEncoderOptions--;
            resolve(options);
        });
    });
}
// ============================================================================
//                           FUNCTION: updateEncoderWebJSONFile
// ============================================================================
/**
 * Updates the encoders file for the settings page
 */
function updateEncoderWebJSONFile ()
{
    // wait to save the file in case we are still processing
    if (Object.values(localConfig.busyFlags).includes(true)
        || localConfig.busyFlags.getEncoderOptions > 0)
    {
        // if we already have a time then skip setting a new one
        if (localConfig.encodersFileSaveTimerHandle)
            return
        else
        {
            localConfig.encodersFileSaveTimerHandle = setInterval(() =>
            {
                updateEncoderWebJSONFile();
            }, localConfig.encodersFileSaveTimerTimeout);
        }
    }
    else
    {
        clearInterval(localConfig.encodersFileSaveTimerHandle);
        localConfig.encodersFileSaveTimerHandle = null
        fs.writeFileSync(__dirname + "/" + localConfig.encoderFileName, JSON.stringify(
            {
                ffmpegVersion: localConfig.ffmpegVersion,
                videoEncoders: localConfig.videoEncoders,
                audioEncoders: localConfig.audioEncoders
            }))
    }
}
// ============================================================================
//                           FUNCTION: checkFFMPEGInstall
// ============================================================================
/**
 * checks what ffmpeg is installed and sets local variables 
 * (userFfmpegInstalled, streamRollerFfmpegInstalled)
 * to true or false based on availability
 */
function checkFFMPEGInstall ()
{
    // check if we have a cmd installed ffmpeg
    try
    {
        if (commandExists.sync("ffmpeg"))
            localConfig.userFfmpegInstalled = true;
        else
            localConfig.userFfmpegInstalled = false;
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ".initialise", "error while checking for ffmpeg:", err);
    }
    // check if we have a streamroller installed ffmpeg
    try
    {
        if (commandExists.sync(localConfig.ffmpegExe))
            localConfig.streamRollerFfmpegInstalled = true;
        else
            localConfig.streamRollerFfmpegInstalled = false;
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ".initialise", "error while checking for ffmpeg:", err);
    }
}
// ============================================================================
//                           FUNCTION: getFFMPEGCommand
// ============================================================================
/**
 * returns the cmd to run for the current ffmpeg setup
 * @returns ffmpeg exe command
 */
function getFFMPEGCommand ()
{
    let command = null
    if (localConfig.useStreamRollerFfmpeg)
    {
        if (localConfig.streamRollerFfmpegInstalled)
            command = localConfig.ffmpegExe;
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname +
                ".runFFMPEG", "Failed to find StreamRoller FFMPEG");
    }
    else
    {
        if (localConfig.userFfmpegInstalled)
            command = "ffmpeg.exe"
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname +
                ".runFFMPEG", "Failed to find System FFMPEG. Try running 'ffmpeg -version' on the command line to see if it is installed correctly");
    }
    return command;
}
// ############################################################################
//                            INSTALL FFMPEG FILES
// If the user doesn't have ffmpeg installed we can install one from github
// ############################################################################

// ============================================================================
//                           FUNCTION: downloadFFMPEG
// ============================================================================
/**
 * download and install ffmpeg
 */
async function downloadFFMPEG ()
{
    // check we have ffmpeg available or not.
    // inverted failure flag
    let installSuccess = true;

    // if we have a previous download lets delete it (should never be hit as should only run on install)
    if (fs.existsSync(localConfig.ffmpegDownloadZip))
    {
        fs.unlink(localConfig.ffmpegDownloadZip, (err) =>
        {
            if (err == null)
            {
                //console.log("finished deleting old ffmpeg download")
            }
            else
            { installSuccess = false; console.log("Error deleting previous ffmpeg download", err) }
        });
    }
    // download the zip and unpack it to the correct place
    axios({
        method: 'get',
        url: localConfig.ffmpegDownloadURL,
        responseType: 'stream',
        onDownloadProgress: progressEvent =>// print progress to in the console
        { printProgress("ffmpeg downloading " + Math.round((progressEvent.loaded * 100) / progressEvent.total) + "%") }
    }).then(response =>
    {
        //download complete write file
        const writer = fs.createWriteStream(localConfig.ffmpegDownloadZip);
        response.data.pipe(writer);
        writer.on('finish', async () => 
        {
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log('Download complete!');
            // unzip file
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log("unzipping file", localConfig.ffmpegDownloadZip, localConfig.ffmpegFolder)
            unzipfile(localConfig.ffmpegDownloadZip, localConfig.ffmpegFolder);
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log("unzipping finished")
            let files = [];
            try
            {
                files = fs.readdirSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared/bin")
            }
            catch (err)
            {
                installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ":Error: loading ffmpeg files to copy", err);
            }

            // delete existing files we are about to copy
            files.forEach((value, index) =>
            {
                //delete existing file if it exists
                if (fs.existsSync(localConfig.ffmpegFolder + value))
                {
                    if (localConfig.debugOptions.DEBUG_FFMPEG)
                        console.log("deleteing", localConfig.ffmpegFolder + value)
                    try { fs.unlinkSync(localConfig.ffmpegFolder + value); }
                    catch (err) { installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ":Error: clearing out old files before replacing", err); }
                }
            })
            // move new files in
            files.forEach((value, index) =>
            {
                if (localConfig.debugOptions.DEBUG_FFMPEG)
                    console.log("moving in new file", value)
                fs.renameSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared\\bin\\" + value,
                    localConfig.ffmpegFolder + value, function (err)
                {
                    if (err) { installSuccess = false; logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ":Error: moving file ", localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared\\bin\\" + value, err); }
                })
            })
            // delete downloaded files
            if (localConfig.debugOptions.DEBUG_FFMPEG)
                console.log("removing folder ffmpeg-master-latest-win64-gpl-shared")
            try { fs.rmSync(localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared", { recursive: true, force: true }); }
            catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ":Error: removing directory", localConfig.ffmpegFolder + "ffmpeg-master-latest-win64-gpl-shared", err); }

            // finally delete the zip file we downloaded
            if (fs.existsSync(localConfig.ffmpegDownloadZip))
            {
                try { fs.unlinkSync(localConfig.ffmpegDownloadZip); }
                catch (err) { logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.extensionname + ":Error: clearing out downloaded ffmpeg.zip before replacing", err); }
            }
        });
        writer.on('error', err =>
        {
            installSuccess = false;
            console.error('Failed to download:', err)
        });
    })
        .catch(err =>
        {
            installSuccess = false;
            console.log("error downloading ffmpeg", err)
        })
    if (!installSuccess)
    {
        localConfig.StreamRollerFfmpeg = true;
        console.log('✅ FFMPEG Install complete!');
    }
    else
    {
        localConfig.StreamRollerFfmpeg = false;
        console.error('❌ FFMPEG Install Failed:')
    }
}
// ============================================================================
//                           FUNCTION: unzipfile
// ============================================================================
/**
 * 
 * @param {string} file filename
 * @param {to} to destination directory
 */
function unzipfile (file, to)
{
    let args = ["xf", file, "-C", to]
    let unzipHandle = spawnSync("tar", args);
    return unzipHandle;
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
//                           EXPORTS
// ============================================================================
export
{
    init,
    ffmpegBusyFlags,
    runFFMPEG,
    setDebug,
    getDebug,
    UpdateEncodersAvailable,
    useStreamRollerFfmpeg,
    getInstalledFFMPEGs,
    getFFMPEGCommand,
    getEncoders,
    downloadFFMPEG
}

