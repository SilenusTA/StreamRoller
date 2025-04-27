/**
 * Copyright (C) 2025 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @extension kick
 * Provides functionality for the kick streaming service.
 */
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";
import * as server from "./server/server.js"

const localConfig = {
    extensionname: "kick",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    dataCenterApp: null,
    heartBeatTimeout: 5000,
    clientId: "",
    scopes: 'user:read+channel:read+channel:write+chat:write+streamkey:read+events:subscribe',
    kickApplicationSecret: ""
};

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
    localConfig.heartBeatTimeout = heartbeat;
    app.use("/kick/", express.static(__dirname + "/public"));
    app.use("/kick/scripts", express.static(__dirname + "/views/scripts"));
    localConfig.dataCenterApp = app
    localConfig.nonce = nonce(15);
    try
    {
        localConfig.dataCenterApp.get("/kick/auth", function (req, res)
        {
            generateCodeChallenge(localConfig.nonce)
                .then((challenge) =>
                {
                    res.render(__dirname + "/views/pages/kickauth",
                        {
                            host: host,
                            port: port,
                            heartbeat: heartbeat,
                            clientId: localConfig.clientId,
                            kickApplicationSecret: localConfig.kickApplicationSecret,
                            kickOAuthState: localConfig.nonce,
                            kickOAuthVerifier: localConfig.nonce,
                            kickOAuthChallenge: challenge,
                            scopes: localConfig.scopes,
                            userType: req.query.user

                        }
                    );
                })
        });
        server.start(host, port, localConfig.nonce, localConfig.clientId, heartbeat, setClientSecrets)
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
//                           setClientSecret
// ============================================================================
/**
 * called from main server app when credentials are received
 * @param {string} clientId 
 * @param {string} secret 
 */
function setClientSecrets (clientId, secret)
{
    localConfig.clientId = clientId;
    localConfig.kickApplicationSecret = secret;
}
// ============================================================================
//                           generateCodeChallenge
// ============================================================================
async function generateCodeChallenge (codeVerifier)
{
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64Url = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return base64Url;
}
// ============================================================================
//                           EXPORTS
// ============================================================================
export { initialise };