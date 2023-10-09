/**
 *      StreamRoller Copyright 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 *      StreamRoller is an all in one streaming solution designed to give a single
 *      'second monitor' control page and allow easy integration for localConfiguring
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
// ############################# twitch.js ##############################

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
const localConfig = {
    EXTENSION_NAME: "twitch",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000,
    clientId: "s65xinp3a4orpi4qtn62pypekg5n6q",
    scopes: 'user_read+channel:read:redemptions+channel:manage:broadcast+channel:edit:commercial+channel:read:vips+channel:manage:vips+channel:manage:moderators+moderation:read+channel:read:editors+user:read:follows+bits:read+channel:read:polls+channel:manage:polls+channel:read:goals+moderator:read:shield_mode+moderator:manage:shield_mode+channel:read:charity+channel:read:predictions+channel:manage:predictions+channel:read:hype_train+moderator:read:shoutouts+moderator:manage:shoutouts+moderator:read:followers+channel:read:subscriptions+channel:moderate+user:manage:blocked_users+user:read:blocked_users'
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
function initialise (app, host, port, heartbeat)
{
    logger.extra("[EXTENSION]twitch.initialise", "host", host, "port", port, "heartbeat", heartbeat);
    localConfig.heartBeatTimeout = heartbeat;
    app.use("/twitch/", express.static(__dirname + "/public"));
    app.use("/twitch/scripts", express.static(__dirname + "/views/scripts"));
    localConfig.dataCenterApp = app
    try
    {
        localConfig.dataCenterApp.get("/twitch/auth", function (req, res)
        {
            res.render(__dirname + "/views/pages/twitchauth",
                {
                    host: host,
                    port: port,
                    heartbeat: heartbeat,
                    clientId: localConfig.clientId,
                    nonce: localConfig.nonce,
                    scopes: localConfig.scopes
                }
            );
        });

        localConfig.nonce = nonce(15)
        server.start(host, port, localConfig.nonce, localConfig.clientId, heartbeat)
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "initialise failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: nonce
// ============================================================================
function nonce (length)
{
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
// ============================================================================
//                           EXPORTS
// ============================================================================
export { initialise };