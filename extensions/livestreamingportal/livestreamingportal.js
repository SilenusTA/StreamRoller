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
    OUR_CHANNEL: "LIVE_STREAMING_PORTAL",
    EXTENSION_NAME: "livestreamingportal",
    SYSTEM_LOGGING_TAG: "[EXTENSION]"
};
import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";

// declare our stream references
let dataCenterApp = null;
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise(app, host, port)
{
    app.use("/images/", express.static(__dirname + '/public/images'));
    dataCenterApp = app;
    try
    {
        //DataCenterSocket = eh.setupConnection(onDataCenterConnect, onDataCenterDisconnect, onDataCenterMessage);
        dataCenterApp.get('/live', function (req, res)
        {
            // we will store our global data in app.data so we need to pass this to any new page
            res.render(__dirname + '/views/pages/index', {
                host: host,
                port: port
            });
        });
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "DataCenterSocket connection failed:", err);
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