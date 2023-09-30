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

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
const localConfig = {
    EXTENSION_NAME: "twitchapi",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000,
    host: "http://localhost",
    port: "3000",
    clientId: 's65xinp3a4orpi4qtn62pypekg5n6q',
    scopes: 'user_read+channel:read:subscriptions+channel:read:redemptions+bits:read',
    nonce: null
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
    localConfig.heartBeatTimeout = heartbeat;
    localConfig.host = host
    localConfig.port = port
    app.use("/twitchapi/", express.static(__dirname + "/public"));
    app.use("/twitchapi/scripts", express.static(__dirname + "/views/scripts"));
    localConfig.nonce = nonce(15)
    localConfig.dataCenterApp = app
    try
    {
        //server.startServer(host, port, heartbeat);
        localConfig.dataCenterApp.get("/twitchapi", function (req, res)
        {
            // we will store our global data in app.data so we need to pass this to any new page
            res.render(__dirname + "/views/pages/main",
                {
                    host: localConfig.host,
                    port: localConfig.port,
                    clientId: localConfig.clientId,
                    nonce: localConfig.nonce,
                    scopes: localConfig.scopes
                }
            );
        });
        localConfig.dataCenterApp.get("/twitchauth", function (req, res)
        {
            // we will store our global data in app.data so we need to pass this to any new page
            res.render(__dirname + "/views/pages/auth",
                {
                    host: localConfig.host,
                    port: localConfig.port,
                    clientId: localConfig.clientId,
                    nonce: localConfig.nonce,
                    scopes: localConfig.scopes
                }
            );
        });

        server.start(localConfig.host, localConfig.port, localConfig.nonce, localConfig.clientId, localConfig.heartBeatTimeout);

    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "initialise failed:", err);
    }
}
// ============================================================================
//                           EXPORTS: nonce
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
//                           EXPORTS: initialise
// ============================================================================
export { initialise };