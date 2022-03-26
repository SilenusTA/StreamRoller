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
import crypto from 'crypto';
const __dirname = dirname(fileURLToPath(import.meta.url));
const configFilesPath = __dirname + "/../configstore/";
const credentialFilesPath = __dirname + "/../credentialstore/";
let credentials = {};
// ============================================================================
//                  FUNCTION: encrypt
// ============================================================================
/**
 * decrypt a text string
 * @param {String} text 
 * @returns 
 */
function encrypt(text)
{
    //console.log("encrypt", credentials)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(credentials.key), Buffer.from(credentials.iv, 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: credentials.iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// ============================================================================
//                  FUNCTION: decrypt
// ============================================================================
/**
 * decrypt a text string
 * @param {String} text 
 * @returns 
 */
function decrypt(text)
{
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(credentials.algorithm, Buffer.from(credentials.key), Buffer.from(credentials.iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
// ============================================================================
//                  FUNCTION: loadconfig
// ============================================================================
function initcrypto()
{
    const credfile = loadConfig("seed", credentialFilesPath)
    //console.log("initcrypto", credfile)
    if (credfile === "")
    {
        // should create a new set on run and re-encrypt the current files but as
        // this is really only here to avoid me sahring my keys on stream it isn't 
        // really needed
        credentials.algorithm = 'aes-256-cbc'; //Using AES encryption
        credentials.key = crypto.randomBytes(32);
        credentials.iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(credentials.key), credentials.iv);
        saveConfig("seed", {
            algorithm: credentials.algorithm,
            key: credentials.key,
            iv: credentials.iv
        }, credentialFilesPath)
    }
    else
    {
        credentials.algorithm = credfile.algorithm;
        credentials.key = credfile.key;
        credentials.iv = credfile.iv
    }

    /*let testdata = { ExtensionName: "testcreds", id: "myid", data: "mydata" }
    console.log("testdata pre save", testdata);
    saveCredentials("test", testdata)
    let loadeddata = loadCredentials(testdata.ExtensionName)
    console.log("loadeddata ", loadeddata);
*/
}

// ============================================================================
//                  FUNCTION: loadconfig
// ============================================================================
/**
 * Loads and returns a config file
 * @param {String} configname 
 * @returns configfile object or ""
 */
function loadConfig(configname, path = configFilesPath)
{
    let filename = path + configname + ".json";
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
function saveConfig(configname, data, path = configFilesPath)
{
    fs.writeFileSync(path + configname + ".json", JSON.stringify(data), function (err)
    {
        if (err)
            return false;
        else
            return true;
    });
}
// ============================================================================
//                  FUNCTION: loadCredentials
// ============================================================================
/**
 * Loads and returns a config file
 * @param {String} configname 
 * @returns configfile object or ""
 */
function loadCredentials(configname)
{
    const credfile = loadConfig(configname, credentialFilesPath)
    if (credfile != "")
    {
        const credfile = loadConfig(configname, credentialFilesPath)
        const decrypted = decrypt(credfile);
        return JSON.parse(decrypted);;
    }
    else
        return "";
}
// ============================================================================
//                  FUNCTION: saveCredentials
// ============================================================================
/**
 * Saves data to the filename given.
 * @param {object} data 
 */
function saveCredentials(data)
{
    if (data.ExtensionName != "" && data.CredentialName != "" && data.CredentialValue != "")
    {
        let currentCredentials = loadCredentials(data.ExtensionName);
        if (currentCredentials === "")
        {
            // we don't have an existing credential file
            currentCredentials = {};
            currentCredentials.ExtensionName = data.ExtensionName
        }
        currentCredentials[data.CredentialName] = data.CredentialValue;
        const credstring = JSON.stringify(currentCredentials);
        const encryptedcreds = encrypt(credstring);
        saveConfig(data.ExtensionName, encryptedcreds, credentialFilesPath)
    }
    else
        console.log("SaveCredentials failed, missing field", data.ExtensionName)
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export { initcrypto, loadConfig, saveConfig, loadCredentials, saveCredentials };
