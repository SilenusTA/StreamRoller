// ############################# testoverlay.js ##############################
// overlay file for inclusion in to OBS etc for streaming
// currently meant as an example of a standalone browser file
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

// function initlaise called by the backend during startup
function initialise(app, host, port)
{
    console.log(__dirname + '/testoverlay.html')
    app.use("/", express.static(__dirname + '/'));
    //DataCenterSocket = eh.setupConnection(onDataCenterConnect, onDataCenterDisconnect, onDataCenterMessage);
    app.get('/testoverlay', function (req, res)
    {
        // when someone requests testoverlay lets return our overlay file
        res.render(__dirname + '/overlay.ejs', {
            host: host,
            port: port,
            heartbeat: heartbeat
        });
    });
}
export { initialise }