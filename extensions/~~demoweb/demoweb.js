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
// ############################# demoweb.js ##############################
// A demo page to create a webpage serverd by the StreamRoller backend
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 05-Jul-2023
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
const config = {
    EXTENSION_NAME: "demoweb",
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

function initialise (app, host, port, heartbeat, readyMessagefn)
{
    logger.extra("[EXTENSION]demoweb.initialise", "host", host, "port", port, "heartbeat", heartbeat);
    config.heartBeatTimeout = heartbeat;
    //app.use("/images/", express.static(__dirname + '/public/images'));
    app.use("/demoweb/", express.static(__dirname + "/public"));
    app.use("/demoweb/scripts", express.static(__dirname + "/views/scripts"));

    config.dataCenterApp = app
    try
    {
        config.dataCenterApp.get("/demoweb", function (req, res)
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
        readyMessagefn(config.EXTENSION_NAME)
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "initialise failed:", err);
    }
}
// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
export { initialise };
