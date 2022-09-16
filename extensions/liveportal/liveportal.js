// ############################# LIVE.js ##############################
// A page for live streaming. This should contain all items needed while 
// streaming. settings title, modding chatters, OBS controls etc
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 05-Jan-2022
// --------------------------- functionality ----------------------------------
// In Progress.
// ----------------------------- notes ----------------------------------------
// In Progress
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================

const config = {
    EXTENSION_NAME: "liveportal",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000
};
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";


// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// creates the connection to the data server and registers our message handlers
// ============================================================================

function initialise (app, host, port, heartbeat)
{
    logger.extra("[EXTENSION]liveportal.initialise", "host", host, "port", port, "heartbeat", heartbeat);
    config.heartBeatTimeout = heartbeat;
    //app.use("/images/", express.static(__dirname + '/public/images'));
    app.use("/liveportal/", express.static(__dirname + "/public"));
    config.dataCenterApp = app

    try
    {
        config.dataCenterApp.get("/liveportal", function (req, res)
        {

            // we will store our global data in app.data so we need to pass this to any new page
            res.render(__dirname + "/views/pages/index",
                {

                    host: host,
                    port: port,
                    heartbeat: heartbeat
                }
            );
        });
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "initialise failed:", err);
    }
}
// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// will also need additional exports in future (ie reconnect, stop, start etc)
// ============================================================================

export { initialise };