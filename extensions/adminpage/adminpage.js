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
// ############################# ADMINPAGE.js ##############################
// Page to handle extension settings and show general data
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 05-Jan-2022
// --------------------------- functionality ----------------------------------
// ----------------------------- notes ----------------------------------------
// ============================================================================
/**
 * @extension Adminpage
 * Provides a webpage to allow authorization for an extension.
 * To use the webpage an extension needs to monitor for the message "RequestCredentialsModalsCode" and respond with "CredentialsModalCode".
 * The message should contain a model that will be used to pass back the data to the extension when the user presses submit, any named fields in teh model will be returned (such as text boxes etc).
 * NOTE: checkboxes 'variables' will be only be in the object if checked otherwise they will be missing from the returned object
 * The response message type will be taken from the html's "modaldatatype" element 
 */
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
    logger.extra("[EXTENSION]adminpage.initialise", "host", host, "port", port, "heartbeat", heartbeat);
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