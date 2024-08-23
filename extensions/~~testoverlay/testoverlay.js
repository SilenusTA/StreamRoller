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
// ############################# testoverlay.js ##############################
// overlay file for inclusion in to OBS etc for streaming
// currently meant as an example of a standalone browser file
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
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
function initialise (app, host, port)
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
export { initialise };
