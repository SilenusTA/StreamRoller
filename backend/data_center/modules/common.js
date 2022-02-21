// ############################# COMMON.js ####################################
// Common code that is reused acrross modules
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 02-Feb-2022
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const configFilesPath = __dirname + "/../datastore/";
// ============================================================================
//                  FUNCTION: loadconfig
// ============================================================================
/**
 * Loads and returns a config file
 * @param {String} configname 
 * @returns configfile object or ""
 */
function loadConfig(configname)
{
    let filename = configFilesPath + configname + ".json";
    try
    {
        if (fs.existsSync(filename))
        {
            try
            {
                var data = fs.readFileSync(filename);
                let myObj = JSON.parse(data);
                return myObj;
            }
            catch (err)
            {
                console.log('There has been an error parsing your JSON while loading the config file')
                console.log(err);
                return "";
            }
        }
    }
    catch (err)
    {
        console.log("common.js: loadConfig error", err);
    }
    return "";
}
// ============================================================================
//                  FUNCTION: saveConfig
// ============================================================================
/**
 * Saves data to the filename given.
 * @param {string} configname 
 * @param {object} data 
 */
function saveConfig(configname, data)
{
    fs.writeFileSync(configFilesPath + configname + ".json", JSON.stringify(data), function (err)
    {
        if (err)
            return false;
        else
            return true;
    });
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export { loadConfig, saveConfig };
