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
import crypto from 'crypto';
import process from 'node:process';

//const usersPath = dirname(fileURLToPath(import.meta.url));
let usersPath = process.env.APPDATA + "\\StreamRoller\\Data";
const configFilesPath = usersPath + "\\configstore\\";
const dataFilesPath = usersPath + "\\datastore\\";
const credentialFilesPath = usersPath + "\\credentialstore\\";
let credentials = {};

if (!fs.existsSync(configFilesPath)) fs.mkdirSync(configFilesPath, { recursive: true }, (err) => { if (err) throw err; });
if (!fs.existsSync(dataFilesPath)) fs.mkdirSync(dataFilesPath, { recursive: true }, (err) => { if (err) throw err; });
if (!fs.existsSync(credentialFilesPath)) fs.mkdirSync(credentialFilesPath, { recursive: true }, (err) => { if (err) throw err; });

// ============================================================================
//                  FUNCTION: encrypt
// ============================================================================
/**
 * decrypt a text string
 * @param {String} text 
 * @returns 
 */
function encrypt (text)
{
    let Buffer = ""
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(credentials.key), Buffer.from(credentials.iv, 'hex'));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: JSON.stringify(credentials.iv), encryptedData: encrypted.toString('hex') };
}

// ============================================================================
//                  FUNCTION: decrypt
// ============================================================================
/**
 * decrypt a text string
 * @param {String} text 
 * @returns 
 */
function decrypt (text)
{
    //let iv = Buffer.from(text.iv, 'hex');
    //let iv = JSON.parse(text.iv);
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(credentials.algorithm, Buffer.from(credentials.key), Buffer.from(credentials.iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
// ============================================================================
//                  FUNCTION: loadconfig
// ============================================================================
function initcrypto ()
{
    const credfile = loadConfig("seed", credentialFilesPath)
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
}

// ============================================================================
//                  FUNCTION: loadconfig
// ============================================================================
/**
 * Loads and returns a config file
 * @param {String} configname 
 * @returns configfile object or ""
 */
function loadConfig (configname, path = configFilesPath)
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
                console.log('common.js: loadConfig: There has been an error parsing your JSON while loading the config file')
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
function saveConfig (configname, data, path = configFilesPath)
{
    try
    {
        if (!fs.existsSync(path + configname + ".json"))
        {
            if (!fs.existsSync(configFilesPath))
                console.log("common.js: saveConfig Path doesn't exist creating new")
        }
        fs.writeFileSync(path + configname + ".json", JSON.stringify(data), function (err)
        {
            if (err)
                return false;
            else
                return true;
        });
    }
    catch (err)
    {
        console.log("common.js: saveConfig failed,", err.message)
    }
}

// ============================================================================
//                  FUNCTION: loadData
// ============================================================================
function loadData (configname)
{
    return loadConfig(configname, dataFilesPath)
}
// ============================================================================
//                  FUNCTION: saveData
// ============================================================================
function saveData (configname, data)
{
    return saveConfig(configname, data, dataFilesPath)
}
// ============================================================================
//                  FUNCTION: loadCredentials
// ============================================================================
/**
 * Loads and returns a config file
 * @param {String} configname 
 * @returns configfile object or ""
 */
function loadCredentials (configname)
{
    const credfile = loadConfig(configname, credentialFilesPath)
    if (credfile != "")
    {
        const credfile = loadConfig(configname, credentialFilesPath)
        const decrypted = decrypt(credfile);
        return JSON.parse(decrypted);
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
function saveCredentials (data)
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
        console.log("common.js: SaveCredentials failed, missing field", data.ExtensionName)
}
// ============================================================================
//                           EXPORTS: 
// ============================================================================
export { initcrypto, loadConfig, saveConfig, loadData, saveData, loadCredentials, saveCredentials };
