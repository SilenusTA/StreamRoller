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
/**
 * @extension Autopilot
 * Provides the Autopilot webpage. This page allows the user to pair up triggers and actions from extensions to perform tasks.
 * It also provides a macro button system (similar to streamdeck's)
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
const config = {
    EXTENSION_NAME: "autopilot",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000
};
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";
import * as server from "./server/server.js"


// ============================================================================
//                           FUNCTION: initialise
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
    config.heartBeatTimeout = heartbeat;
    app.use("/autopilot/", express.static(__dirname + "/public"));
    app.use("/autopilot/scripts", express.static(__dirname + "/views/scripts"));

    config.dataCenterApp = app
    try
    {
        server.startServer(host, port, heartbeat);
        config.dataCenterApp.get("/autopilot", function (req, res)
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
export { initialise };