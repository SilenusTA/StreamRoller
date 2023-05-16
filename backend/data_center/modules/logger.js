// ############################# LOGGER.js ####################################
// This file is to handle all our logging in one place. If you need to add
// logging to the code use this inport to do it so it can easily be turn on
// or off as required.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
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
// .....
// Environment variable "STREAMTOOL_DEBUG_FORMAT" can be changed to format
// the output.
// Options include
//     extended, extended-line, off
// *** no flag set defaults to standard logging
// ----------------------------- notes ----------------------------------------
// TBD. Still need to update this to a better formatting for logging
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logfilename = __dirname + "/../../../streamroller.log"

const __createlogfile = false;
let firstrun = true;
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
    /*    
        console.log("LOG:STREAMTOOL_DEBUG_LEVEL: ", loglevel);
        if (!process.env.STREAMTOOL_DEBUG_FORMAT)
            process.env.STREAMTOOL_DEBUG_FORMAT = "off"
        console.log("LOG:Log system: " + process.platform);
        console.log("LOG:Log color: " + usecolor);
    */
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
    if (typeof (message) == "object")
        message = JSON.stringify(message);
    if (message.length > cap_message_length)
        message = message.substring(0, cap_message_length) + "...";
    if (process.env.STREAMTOOL_DEBUG_FORMAT == "extended-line")
        console.log(col, message, tag, func, tag);
    else if (process.env.STREAMTOOL_DEBUG_FORMAT == "extended")
        console.log(col, tag, func, tag, "\n", message);
    else if (process.env.STREAMTOOL_DEBUG_FORMAT != "off")
        console.log(col, tag, func, message);
    else
        console.log(col, tag, func, message);
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
//                           EXPORTS: 
// ============================================================================
export { log, err, warn, info, extra, loglevel, setLoggingLevel, getLoggingLevel, usecoloredlogs };
