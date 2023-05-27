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
import sr_api from "./public/streamroller-message-api.cjs";
// load our config settings
let config = cm.loadConfig("datacenter");
let version = cm.loadSoftwareVersion();
// old bug, need to remove the old setup if anyone has it.
if (config.HOST.startsWith("http") > 0)
    config = ""

let defaultconfig = {
    name: "StreamRoller",
    extensionname: "datacenter",
    SYSTEM_LOGGING_TAG: "DATA-CENTER",
    HOST: "localhost",
    PORT: 3000,
    logginglevel: 0,
    heartbeat: 5000, // heartbeat timers
    apiVersion: sr_api.__api_version__,
    softwareversion: version,
    overlayfolder: "/repos/ODGOverlay/", // need to fix this and get a proper overlay area setup
    testing: 0// used to import extra extensions during testing
};

// check we have a config. if this is a new instance the we need to create a config from the default
if (config === "")
{
    config = defaultconfig;
    cm.saveConfig(config.extensionname, config);
}
// check if we have updated the software, if so we will reload the default config
if (config.softwareversion != version)
{
    console.log("New software version detected. resetting server config.")
    config = defaultconfig;
    cm.saveConfig(config.extensionname, config);
}


logger.setLoggingLevel(config.logginglevel);
console.log("serverSettings: ", config);
console.log("\x1b[1m\x1b[33mload the url\x1b[31m", config.HOST + ":" + config.PORT, "\x1b[33mIn a browser window to continue\x1b[0m");
// ============================================================================
//                          IMPORTS/VARIABLES
// ============================================================================
// fix for ES6 not having the __dirname var
import { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import express from "express";
import http from "http";
import * as fs from "fs";
// set our localion
const __dirname = dirname(fileURLToPath(import.meta.url));
// app server start
const app = express();
const server = http.createServer(app);
// some global vars, yes I know I need to fix using globals.
const extensions = [];


server.listen(config.PORT);
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
    console.log("Server Started");
})
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
    res.render(__dirname + "/../../extensions/liveportal/views/pages/index", {
        host: "http://" + config.HOST,
        port: config.PORT,
        heartbeat: config.heartbeat
    });
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

// #############################################################
// ################### Install Extensions #####################
// #############################################################
// Just some debugging code
if (config.testing > 0)
{
    console.log("#### running extera DEBUG extensions ####")
    logger.usecoloredlogs("default");
    loadExtensions(__dirname + "/../../test-ext")
    loadExtensions(__dirname + "/../../extensions/datahandlers")
    loadExtensions(__dirname + "/../../extensions")
}
else
{
    logger.usecoloredlogs("default");
    loadExtensions(__dirname + "/../../extensions/datahandlers")
    loadExtensions(__dirname + "/../../extensions")
}

function loadExtensions (extensionFolder)
{
    fs.readdir(extensionFolder, (err, files) =>
    {
        if (!err)
        {
            // loop through each directory
            files.forEach((file) =>
            {
                // ignore files starting wiht "~~" or the datahandler folder
                if (!file.startsWith("~~") && !file.startsWith("datahandlers"))
                {
                    fs.access(extensionFolder + "/" + file + "/" + file + ".js", fs.F_OK, (err) =>
                    {
                        if (err)
                        {
                            logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", err);
                        } else
                        {
                            // we hava a script so lets load it.
                            var extfile = pathToFileURL(extensionFolder + "/" + file + "/" + file + ".js")
                            logger.info("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "loading extension " + extfile);
                            import(extfile)
                                .then(module =>
                                {
                                    extensions[file] = { initialise: module.initialise };
                                    if (typeof extensions[file].initialise === "function")
                                        extensions[file].initialise(
                                            app, "http://" + config.HOST,
                                            config.PORT,
                                            // add a slight offset to the heartbeat so they don't all end up synced
                                            config.heartbeat + (Math.floor(Math.random() * 100)));
                                    else
                                        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "Extension module " + file + " did not export an intialise function");
                                })

                                // put this catch back in for release. removed it to get a better idea of what was breaking during extension startup
                                /*.catch(err =>
                                {
                                    logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "catching error on import from " + file + ". Comment out this catch statement to trace the error better", err.message);
                                })*/                                ;
                        }
                    });
                }
            });
        } else
        {
            logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", err);
        }
    });
}
// ################### start StreamRoller  ####################################
import * as ServerSocket from "./modules/server_socket.js";
ServerSocket.start(app, server, extensions);
