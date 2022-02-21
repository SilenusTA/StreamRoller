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
        let winpath = __dirname + "/../../php/php.exe";
        let linuxparth = "/usr/bin/php";

        this.foundphp = false;
        //find out which platform we are on.
        exists(winpath, (e) =>
        {
            if (e)
            {
                this.phpPath = winpath;
                this.foundphp = true;
                console.log(e);
            }
        });
        exists(linuxparth, (e) =>
        {
            //console.log(linuxparth, e);
            if (e)
            {
                this.phpPath = linuxparth;
                this.foundphp = true;
                console.log(e);
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
