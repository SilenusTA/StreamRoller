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
 * @extension YouTubeAPI
 * YouTubeAPI functionality. 
 * TBC. Currently just chat (send/receive messages), once testing proves it viable more features need adding (title changing etc)
 */
import * as logger from "../../backend/data_center/modules/logger.js";
import { init } from "./server/server.js";
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
    logger.extra("[EXTENSION]youtubeapi.initialise", "host", host, "port", port, "heartbeat", heartbeat);
    try
    {
        init(host, port, heartbeat, app);
    } catch (err)
    {
        logger.err("[EXTENSION]youtubeapi.initialise", "initialise failed:", err, err.message);
    }
}
export { initialise };

