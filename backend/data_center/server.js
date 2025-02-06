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
// ############################# SERVER.JS ####################################
// This file starts up the http server, express app and then call the socket 
// startup and import all the extension code needed
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// Standard express startup plus loading the extension files and starting them
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================

// ============================================================================
//                      CONFIG IMPORTS/VARIABLES
// ============================================================================
import * as cm from "./modules/common.js";
import * as logger from "./modules/logger.js";
import * as ServerSocket from "./modules/server_socket.js";
import sr_api from "./public/streamroller-message-api.cjs";

// testing startup time
let DEBUG_TIMING = false;
let debugStartTime = performance.now()
let debugEndTime = performance.now()
// END testing startup time

// load our config settings from the config store
let config = cm.loadConfig("datacenter");
let localConfig =
{
    version: cm.loadSoftwareVersion(),
    extensions: [],
    serverPingTimeout: 3600000 //1 hour
}

let defaultconfig = {
    name: "StreamRoller",
    extensionname: "datacenter",
    SYSTEM_LOGGING_TAG: "DATA-CENTER",
    HOST: "localhost",
    PORT: 3000,
    logginglevel: 0,
    heartbeat: 5000, // heartbeat timers
    apiVersion: sr_api.__api_version__,
    softwareversion: localConfig.version,
    overlayfolder: "/repos/ODGOverlay/", // need to fix this and get a proper overlay area setup
    testing: 0,// used to import extra extensions during testing
    uuid: false
};

// check we have a config. if this is a new instance the we need to create a config from the default
if (config === "" | !config.uuid)
{
    config = defaultconfig;
    config.uuid = crypto.randomUUID();
    cm.saveConfig(config.extensionname, config);
}
// check if we have updated the software, if so we will reload the default config
if (config.softwareversion != localConfig.version)
{
    console.log("New software version detected. resetting server config.")
    config = defaultconfig;
    cm.saveConfig(config.extensionname, config);
}

// set the local IP address to this machine for using other devices (ie the fake stream deck macros page)
/*
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces)
{
    for (var k2 in interfaces[k])
    {
        console.log("k2", k)
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal)
        {
            addresses.push(address.address);
        }
    }
}
if (addresses[0] != undefined || addresses[0] != "")
    config.HOST = addresses[0];
*/
logger.setLoggingLevel(config.logginglevel);
console.log("serverSettings: ", config);
console.log("\x1b[1m\x1b[33mload the url\x1b[31m", config.HOST + ":" + config.PORT, "\x1b[33mIn a browser window to continue\x1b[0m");
console.log("\x1b[1m\x1b[33mNote: Only load one version of the browser as mutliple versions will conflict with each other leading to repeated messages in chat\x1b[0m");
// ============================================================================
//                          IMPORTS/VARIABLES
// ============================================================================
// fix for ES6 not having the __dirname var
import crypto from "crypto";
import express from "express";
import * as fs from "fs/promises";
import http from "http";
import https from "https";
import { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

// set our location
const __dirname = dirname(fileURLToPath(import.meta.url));
// app server start
const app = express();
const server = http.createServer(app);
if (DEBUG_TIMING)
{
    debugEndTime = performance.now()
    console.log("start to http.createServer(app) took:", Math.round(debugEndTime - debugStartTime), "ms");
    debugStartTime = debugEndTime
}
server.listen(config.PORT);
if (DEBUG_TIMING)
{
    debugEndTime = performance.now()
    console.log("server.listen:", Math.round(debugEndTime - debugStartTime), "ms");
    debugStartTime = debugEndTime
}

server.on('error', (e) =>
{
    if (e.code === 'EADDRINUSE')
    {
        console.log('Address in use, retrying...');
        setTimeout(() =>
        {
            server.close();
            server.listen(config.PORT);
        }, 1000);
    }
});
server.on('listening', (e) =>
{
    console.log("StreamRoller Started");
})
console.log("Loading Extensions ...");
// ============================================================================
//                          EXPRESS
// ============================================================================
// we are currently using ejs. This 
app.set("view engine", "ejs");
// set our static routes
// server public files (just dump them all in here for now. need a better structure)
app.use(express.static(__dirname + "/public"));
// set th e default page
app.get("/", function (req, res)
{
    let debugWebPageLoadStartTime = performance.now()
    res.render(__dirname + "/../../extensions/liveportal/views/pages/index", {
        host: "http://" + config.HOST,
        port: config.PORT,
        heartbeat: config.heartbeat
    });
    if (DEBUG_TIMING)
    {
        let debugWebPageLoadEndTime = performance.now()
        console.log("app.get('/' took:", debugWebPageLoadEndTime - debugWebPageLoadStartTime, "ms");
    }
});
// serve our overlay. Overlay currently needs updating and moving into the extensions
// as this is where I suspect it should live. or maybe we need a separate overlays folder?
//////let overlayfolder = __dirname + "/../../frontend/overlays/main_overlay";
//////app.use("/overlay", express.static(overlayfolder));
//////app.get("/overlay", (req, res) =>
////{
/////    res.sendFile('main_overlay.html', { root: overlayfolder });
/////});
// #############################################################
// Note that we shouldn't be using php any more now we are on  #
// node.js but until I can rewite my overlay this will remain  #
// #### Maybe this is passed in or setup on the admin page #####
// ### This is only here as my overly was writting using php ###
// #############################################################
//config.overlayfolder = __dirname + "/../../../ODGOverlay";
//config.overlayfolder = "/repos/ODGOverlay";
import { execPHP } from "./execphp.js";
execPHP.phpFolder = config.overlayfolder;
var webfiles = config.overlayfolder;

app.use("*.php", function (request, response, next)
{
    execPHP.parseFile(request.originalUrl, function (phpResult)
    {
        response.write(phpResult);
        response.end();
    });
});
app.use(express.static(webfiles));
if (DEBUG_TIMING)
{
    debugEndTime = performance.now()
    console.log("Phpload:", Math.round(debugEndTime - debugStartTime), "ms");
    debugStartTime = debugEndTime
}
//load extensions and start the server
loadExtensionsAndStartServer()
if (DEBUG_TIMING)
{
    debugEndTime = performance.now()
    console.log("loadExtensionsAndStartServer:", Math.round(debugEndTime - debugStartTime), "ms");
    debugStartTime = debugEndTime
}
// ping server (will be used for updates and later to allow remote login from mods etc)
// testing server connections
pingServer();
if (DEBUG_TIMING)
{
    debugEndTime = performance.now()
    console.log("pingServer:", Math.round(debugEndTime - debugStartTime), "ms");
    debugStartTime = debugEndTime
}
// ############################################################
// ################## Load/Start Extensions ###################
// ############################################################
// added due to minify not liking await at the top level
async function loadExtensionsAndStartServer ()
{
    // Just some debugging code to test new extensions
    if (config.testing > 0)
    {
        console.log("#### running extra DEBUG extensions ####")
        logger.usecoloredlogs("default");
        await loadExtensions(__dirname + "/../../test-ext")
        await loadExtensions(__dirname + "/../../extensions")
        // ################### start StreamRoller  ####################################
        ServerSocket.start(app, server, Object.keys(localConfig.extensions))
    }
    else
    {
        logger.usecoloredlogs("default");
        await loadExtensions(__dirname + "/../../extensions")
        // ################### start StreamRoller  ####################################
        ServerSocket.start(app, server, Object.keys(localConfig.extensions))
    }
}

// ########################################################
// ################### loadExtensions #####################
// ########################################################
async function loadExtensions (extensionFolder)
{
    let files = null;
    let modules = []
    if (DEBUG_TIMING)
    {
        debugStartTime = debugEndTime
    }
    // get a list of extension filenames
    try { files = await fs.readdir(extensionFolder) }
    catch (err) { logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js:Error: loading extension filenames", err); }
    if (DEBUG_TIMING)
    {
        debugEndTime = performance.now()
        console.log("fs.readdir(" + extensionFolder + "):", Math.round(debugEndTime - debugStartTime), "ms");
        debugStartTime = debugEndTime
    }
    // load each of the extensions modules
    try
    {
        let debugStartTimeArray = []
        modules = await Promise.all(
            Array.from(files).map((value) =>
            {
                if (!value.startsWith("~~") && !value.startsWith("datahandlers"))
                {
                    debugStartTimeArray[value] = performance.now()
                    let x = import(pathToFileURL(extensionFolder + "/" + value + "/" + value + ".js").href)
                        .then((x) =>
                        {
                            if (DEBUG_TIMING)
                            {
                                debugEndTime = performance.now()
                                console.log("loaded:", value, "in", Math.round(debugEndTime - debugStartTimeArray[value]), "ms");
                                debugStartTimeArray[value] = debugEndTime
                            }
                            console.log("loaded:", value, "initialising extension..."
                            );
                            return x;
                        })
                    return x;
                }
                else
                    return null
            }
            ),
        )
    }
    catch (err) { logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js:Error: importing extension modules", err.message); }

    // for each extension call it's initialise function
    try
    {
        debugStartTime = []
        modules.forEach((module, index) => 
        {
            if (module)
            {
                try
                {
                    debugStartTime[files[index]] = performance.now()
                    localConfig.extensions[files[index]] = { initialise: module.initialise };
                    if (typeof localConfig.extensions[files[index]].initialise === "function")
                        module.initialise(
                            app, "http://" + config.HOST,
                            config.PORT,
                            // add a slight offset to the heartbeat so they don't all end up synced
                            config.heartbeat + (Math.floor(Math.random() * 100)));
                    else
                        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "Error: Extension module " + files[index] + " did not export an initialise function");
                    if (DEBUG_TIMING)
                        console.log("extension", files[index], " loaded:", Math.round(performance.now() - debugStartTime[files[index]]), "ms");
                    console.log("extension", files[index], "started");
                }
                catch (err) 
                {
                    logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js:Error: calling initialise on ", files[index], err.message);
                }
            }
        })
    }
    catch (err) { logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js:Error: calling initialise on extensions", err, err.message); }
}
// ####################################################
// ################### pingServer #####################
// ####################################################
function pingServer ()
{
    try
    {
        https.get('https://streamroller.stream/api/telemetry.php?UUID=' + config.uuid + '&version=' + localConfig.version, res =>
        {
            let data = [];

            res.on('data', chunk =>
            {
                data.push(chunk);
            });

            res.on('end', () =>
            {
                const result = Buffer.concat(data).toString();
                //console.log('Telementry Status Code:', res.statusCode);
                //console.log("result:", result)
                // Once working we will get the latest version here to provide a check and ask the user if they wish to update
            });
        }).on('error', err =>
        {
            //console.log('Error: ', err.message);
        });
    }
    catch (err)
    {
        //logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js:Error: pinging server ", err.message);
    }
    setTimeout(() =>
    {
        pingServer();
    }, localConfig.serverPingTimeout
    )
}