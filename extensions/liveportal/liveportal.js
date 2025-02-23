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
// ############################# LIVE.js ##############################
// A page for live streaming. This should contain all items needed while
// streaming. settings title, modding chatters, OBS controls etc
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRollerller
// Date: 05-Jan-2022
// --------------------------- functionality ----------------------------------
// In Progress.
// ----------------------------- notes ----------------------------------------
// In Progress
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
/**
 * @extension LivePortal 
 * The main webpage used as a control center/monitor for streamroller.
 */
const config = {
    EXTENSION_NAME: "liveportal",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000
};
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as logger from "../../backend/data_center/modules/logger.js";
const __dirname = dirname(fileURLToPath(import.meta.url));


// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Description: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// creates the connection to the data server and registers our message handlers
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {object:Express} app 
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    logger.extra("[EXTENSION]liveportal.initialise", "host", host, "port", port, "heartbeat", heartbeat);
    config.heartBeatTimeout = heartbeat;
    config.dataCenterApp = app
    //app.use("/images/", express.static(__dirname + '/public/images'));
    config.dataCenterApp.use("/liveportal/", express.static(__dirname + "/public"));
    config.dataCenterApp.use("/liveportal/scripts", express.static(__dirname + "/views/scripts"));

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
// Description: exports from this module
// ----------------------------- notes ----------------------------------------
// will also need additional exports in future (ie reconnect, stop, start etc)
// ============================================================================

export { initialise };

