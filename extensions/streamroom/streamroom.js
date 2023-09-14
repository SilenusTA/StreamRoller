/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import * as logger from "../../backend/data_center/modules/logger.js";

const localConfig =
{
    app: null,
    host: null,
    port: null,
    heartbeat: null,
    extension_name: "streamroom"
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    localConfig.app = app;
    localConfig.host = host;
    localConfig.port = port;
    localConfig.heartbeat = heartbeat;
    try
    {
        // static requests for streamroom return the public directory
        localConfig.app.use("/streamroom/", express.static(__dirname + "/public"))
        // static requests for scripts return the /views/scripts directory (alows us to not have to add the 'views' part in the code)
        localConfig.app.use("/streamroom/scripts", express.static(__dirname + "/views/scripts"))

        // request for the streamroom page 
        localConfig.app.get("/streamroom", function (req, res)
        {
            // base page of the streamroom app
            res.render(__dirname + "/views/pages/index",
                {
                    host: host,
                    port: port,
                    heartbeat: heartbeat
                }
            );
        });

    }
    catch (err)
    {
        logger.err(localConfig.extension_name + ".initialise", "initialise failed:", err, err.message);
        console.err(err)
    }

}
// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
export { initialise };