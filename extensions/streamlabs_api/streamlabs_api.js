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
// ############################# STREAMLABS_API.js ###################################
// This Module/addon/extension (whatever we decide to call these :D) will
// will handle anything streamlabs_api related
// -------------------------- Creation ----------------------------------------
// Author: Silenus aka streamlabs_api.tv/OldDepressedGamer
// Datatype : JSON message as provided by streamlabs api.
// Date: 14-Jan-2021
// --------------------------- functionality ----------------------------------
// connects to streamlabs API to handle live streamlabs_api alerts and also data
// This gets sent to the data_center for logging and dissemination to user
// that wish to register for this information
// --------------------------- description -------------------------------------
// ================== schema ==================================================
// Channel name : STREAMLABS_ALERT
// GitHub: https://github.com/SilenusTA/StreamRoller
// ----------------------------- notes ----------------------------------------
// TBD. 
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable section
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import { start as SL_connection_start } from "./streamlabs_api_handler.js";
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Description: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    SL_connection_start(host, port, heartbeat);
}

// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
// Description: exports from this module
// ----------------------------- notes ----------------------------------------
// ============================================================================
export { initialise };

