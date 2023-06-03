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
 // ############################# execphp.js ####################################
// Used to parse PHP files. Needed only as my current overlay uses PHP files
// This will be removed once I have converted my overlay to us nodejs
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 18-Jan-2022
// ============================================================================
import exec from "child_process";
import { exists } from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from "./modules/logger.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
class ExecPHP
{
    constructor()
    {
        let winpath = "C:/repos/ODGOverlay/php/php.exe";
        let linuxparth = "/usr/bin/php";

        this.foundphp = false;
        //find out which platform we are on.
        exists(winpath, (e) =>
        {
            if (e)
            {
                this.phpPath = winpath;
                this.foundphp = true;
            }
        });
        exists(linuxparth, (e) =>
        {
            if (e)
            {
                this.phpPath = linuxparth;
                this.foundphp = true;
            }
        });
        this.phpFolder = '';
    }
    parseFile(fileName, callback)
    {
        if (this.foundphp)
        {
            var realFileName = this.phpFolder + fileName;
            var cmd = this.phpPath + ' ' + realFileName;
            exec.exec(cmd, function (error, stdout, stderr)
            {
                callback(stdout);
            });
        }
        else
            logger.warn("[DATA_CENTER].execphp.js", "PHP installation not found");
    }
}

export const execPHP = new ExecPHP();
