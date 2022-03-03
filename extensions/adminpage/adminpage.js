// ############################# ADMINPAGE.js ##############################
// Page to handle extension settings and show general data
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 05-Jan-2022
// --------------------------- functionality ----------------------------------
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";

let dataCenterApp = null;
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise(app, host, port, heartbeat)
{
    dataCenterApp = app;
    try
    {
        dataCenterApp.use("/adminpage/", express.static(__dirname + '/public'));
        // add ourselves to the app loader so we can server these pages on the main server connection
        dataCenterApp.get('/adminpage', function (req, res)
        {
            var servervar1 = "server variable passed ok";
            // we will store our global data in app.data so we need to pass this to any new page
            res.render(__dirname + '/views/pages/index', {
                host: host,
                port: port,
                heartbeat: heartbeat
            });
        });
    } catch (err)
    {
        logger.err("[EXTENSION]adminpage.initialise", "Startup Failed:", err);
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