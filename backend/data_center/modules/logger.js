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
// ############################# LOGGER.js ####################################
// This file is to handle all our logging in one place. If you need to add
// logging to the code use this inport to do it so it can easily be turn on
// or off as required.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// Adds console messages for logging, errors and warnings.
// .....
// Environment variable "STREAMTOOL_DEBUG_LEVEL" can be changed to format
// the output.
// Options include
//      0   : errors only (always on)
//      1   : warn and err
//      2   : log, warn and err
//      3   : log, info, awrn and err.
//      4   : extra, additional info/heavy logging
// *** no flag set defaults to standard logging
// ----------------------------- notes ----------------------------------------
// TBD. Still need to update this to a better formatting for logging
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import process from 'node:process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logfilename = __dirname + "/../../../streamroller.log"
// This will pipe all normal logging to a common file
const __createlogfile = false;
let firstrun = true;

// this is for user specified logging
let filestreams = [];

// cap message to 300 chars max
let cap_message_length = 300;
//default level
let loglevel = 5;
// what color scheme to use
let usecolor = "default";
// empty colors
let bgColour = "";
let resetColour = "";
let dimText = "";
let brightText = "";
let logColour = "";
let infoColour = "";
let warnColour = "";
let errColour = "";
let extraColour = ""

/**
 * Turn on or off color
 * @param {string} val "off","default" or a color code
 */
function usecoloredlogs (val)
{
    usecolor = val;
    if (val === "off")
    {
        bgColour = "";
        resetColour = "";
        dimText = "";
        brightText = "";
        logColour = "";
        infoColour = "";
        warnColour = "";
        errColour = "";
        extraColour = "";
    }
    else if (val === "default")
    {
        if (process.platform === "win32")
        {
            //bgColour = "\x1b[44m";
            bgColour = "";
            resetColour = "\x1b[0m";
            dimText = "\x1b[1m";
            brightText = "\x1b[1m";
            infoColour = "\x1b[32m";
            logColour = "\x1b[33m";
            warnColour = "\x1b[35m";
            errColour = "\x1b[31m";
            extraColour = "\x1b[32m";
        }
        else if (process.platform === "linux")
        {
            bgColour = "";
            resetColour = "\x1b[0m";
            dimText = "\x1b[1m";
            brightText = "\x1b[1m";
            infoColour = "\x1b[32m";
            logColour = "\x1b[33m";
            warnColour = "\x1b[35m";
            errColour = "\x1b[31m";
            extraColour = "\x1b[32m";
        }
    }
    else
    {
        bgColour = "";
        resetColour = "\x1b[0m";
        dimText = val;
        brightText = val;
        logColour = val;
        infoColour = val;
        warnColour = val;
        errColour = val;
        extraColour = val;
    }
}
/* color reference
Reset = "\x1b[0m"
Bold = "\x1b[1m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
 */

/**
 * Sets the logging level for this module
 * 0) errors only
 * 1) 0 + warnings
 * 2) 1 + logging
 * 3) 2 + info
 * @param {string} level 
 */
function setLoggingLevel (level)
{
    loglevel = level;
}
/**
 * gets the current logging elvel
 * @returns logging level (string)
 */
function getLoggingLevel ()
{
    return loglevel;
}
// ============================================================================
//                           FUNCTION: log
// ============================================================================
/**
 * log a message 
 * logging level 2 or above
 * @param {String} source log source. Normall "filename.function"
 * @param  {...any} args additional arguments
 */
function log (source, ...args)
{
    if (__createlogfile)
        addToLogfile("[log]" + source, args)
    if (loglevel >= 2)
        output(brightText + bgColour + logColour + "%s" + resetColour, source, "[log]", args);
}
// ============================================================================
//                           FUNCTION: info
// ============================================================================
/**
 * log additional informational message
 * logging level 3 or above
 * @param {String} source log source. Normall "filename.function"
 * @param  {...any} args additional arguments
 */
function info (source, ...args)
{
    if (__createlogfile)
        addToLogfile("[info]" + source, args)
    if (loglevel >= 3)
        output(brightText + bgColour + infoColour + "%s" + resetColour, source, "[info]", args);
}
// ============================================================================
//                           FUNCTION: warn
// ============================================================================
/**
 * log a warning messge message
 * logging level 1 or above
 * @param {String} source log source. Normall "filename.function"
 * @param  {...any} args additional arguments
 */
function warn (source, ...args)
{
    if (__createlogfile)
        addToLogfile("[warn]" + source, args)
    if (loglevel >= 1)
        output(brightText + bgColour + warnColour + "%s" + resetColour, source, "!#! WARNING !#!", args);
}
// ============================================================================
//                           FUNCTION: err
// ============================================================================
/**
 * log an error message
 * logging level 0 or above
 * @param {String} source log source. Normall "filename.function"
 * @param  {...any} args additional arguments
 */
function err (source, ...args)
{
    if (__createlogfile)
        addToLogfile("[err]" + source, args)
    output(brightText + bgColour + errColour + "%s" + resetColour, source, "!!! ERROR !!!", args);
}

// ============================================================================
//                           FUNCTION: extra
// ============================================================================
/**
 * log an extra message
 * logging level 0 or above
 * @param {String} source log source. Normall "filename.function"
 * @param  {...any} args additional arguments
 */
function extra (source, ...args)
{
    if (__createlogfile)
        addToLogfile("[extra]" + source, args)
    if (loglevel >= 4)
        output(brightText + bgColour + extraColour + "%s" + resetColour, source, "[extra]", args);
}
// ============================================================================
//                           FUNCTION: output
// ============================================================================
/**
 * outputs a message to the log
 * @param {String} col colour for message
 * @param {String} func source of the nessge "filename.function"
 * @param {String} tag tag "[EXTENSION]"
 * @param {String} message message to log 
 */
function output (col, func, tag, message)
{
    try
    {
        let outputmessage = []
        if (message.length > 0)
        {
            for (let i = 0; i < message.length; i++)
            {
                if (message[i] instanceof Error)
                {
                    outputmessage.push(message[i].name.toString())
                    outputmessage.push(message[i].outputmessage.toString());
                    outputmessage.push(message[i].stack.toString());
                }
                else
                    outputmessage.push(message[i])
            }
            message = outputmessage;
        }
        if (typeof (message) == "object")
            message = JSON.stringify(message, null, 2);
        if (message.length > cap_message_length)
            message = message.substring(0, cap_message_length) + "...";
        console.log(col, tag, func, message);
    }
    catch (err)
    {
        console.log(brightText + bgColour + errColour + "%s" + resetColour, "!!! LOGGING ERROR !!!", message)
    }
}
// ============================================================================
//                           FUNCTION: output
// ============================================================================
/**
 * 
 * @param {String} func source of the nessge "filename.function"
 * @param {String} tag tag "[EXTENSION]"
 * @param {String} message message to log 
 */
function addToLogfile (func, tag, message)
{
    if (firstrun)
    {
        fs.unlink(logfilename, err =>
        {
            if (err)
            {
                console.error(err)
                return
            }
        })
        firstrun = false;
    }
    if (typeof (func) === "object")
        func = JSON.stringify(func);
    if (typeof (tag) === "object")
        tag = JSON.stringify(tag);
    if (typeof (message) === "object")
        message = JSON.stringify(message);
    else if (typeof (message) === "undefined")
        message = ""

    fs.appendFile(logfilename, tag + " " + func + " " + message + "\n", err =>
    {
        if (err)
        {
            console.error(err)
            return
        }
    })
}
// ============================================================================
//                           FUNCTION: file_log
//                       For debug purposes. logs raw message data
// ============================================================================
//logger.file_log("./", "streamlabstest", "some test data")
function file_log (childdir, file_name, message)
{
    childdir += "/" + childdir
    if (!fs.existsSync(childdir))
    {
        fs.mkdirSync(childdir, { recursive: true });
    }

    let msg = JSON.stringify(message, null, 2)
    // check if we already have this handler
    if (!filestreams.file_name)
    {
        filestreams[file_name] = fs.createWriteStream(childdir + file_name + ".log", { flags: 'a' });
    }
    filestreams[file_name].write(msg + "\n");
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export { err, extra, file_log, getLoggingLevel, info, log, loglevel, setLoggingLevel, usecoloredlogs, warn, bgColour, resetColour, dimText, brightText, logColour, infoColour, warnColour, errColour, extraColour };

