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

const localConfig = {
    dataCenterApp: null,
    heartBeatTimeout: "5000",
    host: "http://localhost",
    port: "3000"
}
// ============================================================================
//                           FUNCTION: startClient
// ============================================================================
async function startClient (app, host, port, heartbeat)
{
    // setup the express app that will handle client side page requests
    //app.use("/images/", express.static(__dirname + '/public/images'));
    console.log("autopilot:startclient started")
    localConfig.host = host;
    localConfig.port = port;
    localConfig.dataCenterApp = app;
    localConfig.dataCenterApp.use("/autopilot/", express.static(__dirname + "/public"));
    localConfig.dataCenterApp.use("/autopilot/scripts", express.static(__dirname + "/views/scripts"));

    try
    {
        localConfig.dataCenterApp.get("/autopilot", async function (req, res)
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
        console.log(localConfig.SYSTEM_LOGGING_TAG + "autopilot.initialise", "initialise failed:", err);
    }
}

export { startClient };