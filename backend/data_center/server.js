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
import { __api_version__ } from "./public/streamroller-message-api.cjs";
// load our config settings
let config = cm.loadConfig('datacenter');
// check we have a config. if this is a new instance the we need to create a config
if (config === "")
{
    config = {
        name: "StreamRoller",
        extensionname: "datacenter",
        SYSTEM_LOGGING_TAG: "DATA-CENTER",
        HOST: "http://localhost",
        PORT: 3000,
        logginglevel: 0,
        apiVersion: __api_version__
    };
    cm.saveConfig(config.extensionname, config);
}
logger.setLoggingLevel(config.logginglevel);
console.log(config);
// ============================================================================
//                          IMPORTS/VARIABLES
// ============================================================================
// fix for ES6 not having the __dirname var
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import http from "http";
import * as fs from "fs";
// set our localion
const __dirname = dirname(fileURLToPath(import.meta.url));
// app server start
const app = express();
const server = http.createServer(app);
server.listen(config.PORT);
// some global vars, yes I know I need to fix using globals.
const extensions = [];
// used to import extra extensions during testing
const testing = 0;
process.title = config.name;

// ============================================================================
//                          EXPRESS
// ============================================================================
// we are currently using ejs. This 
app.set('view engine', 'ejs');
// set our static routes
// server public files (just dump them all in here for now. need a better structure)
app.use(express.static(__dirname + "/public"));

// server our overlay. Overlay currently needs updating and moving into the extensions
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
import { execPHP } from './execphp.js';
execPHP.phpFolder = __dirname + '/../../../ODGOverlay';
var webfiles = __dirname + '/../../../ODGOverlay';
app.use('*.php', function (request, response, next)
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
if (testing)
{
    logger.usecoloredlogs("off");
    loadExtensions(__dirname + "/../../test-ext")
    loadExtensions(__dirname + "/../../extensions")
}
else
{
    logger.usecoloredlogs("default");
    loadExtensions(__dirname + "/../../extensions")
}

function loadExtensions(extensionFolder)
{
    //app.use(express.static(extensionFolder + '/extensionhelper'));
    logger.log("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "Loading extensions");
    fs.readdir(extensionFolder, (err, files) =>
    {
        if (!err)
        {
            // loop through each directory
            files.forEach((file) =>
            {
                if (file !== "extensionhelper")
                {
                    fs.access(extensionFolder + "/" + file + "/" + file + ".js", fs.F_OK, (err) =>
                    {
                        if (err)
                        {
                            logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", err);
                        } else
                        {
                            // we hava a script so lets load it.
                            // var extfile = extensionFolder + "/" + file + "/" + file + ".js";
                            var extfile = "../../extensions/" + file + "/" + file + ".js";
                            logger.info("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "loading extension " + extfile);
                            import(extfile)
                                .then(module =>
                                {
                                    extensions[file] = { initialise: module.initialise };
                                    if (typeof extensions[file].initialise === 'function')
                                        extensions[file].initialise(app, config.HOST, config.PORT);
                                    else
                                        logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "Extension module " + file + " did not export an intialise function");
                                })

                            // put this catch back in for release. removed it to get a better idea of what was breaking during extension startup
                            /*.catch(err => {
                                logger.err("[" + config.SYSTEM_LOGGING_TAG + "]server.js", "catching error on import from " + file + ". Comment out this catch statement to trace the error better", err.message);
                            })
                            ;*/
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
