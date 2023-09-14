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

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const localConfig = {
    OUR_CHANNEL: "AUTOPILOT_CHANNEL",
    EXTENSION_NAME: "autopilot",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
};

const default_serverConfig = {
    __version__: "0.1",
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    demovar1: "on",  // example of a checkbox. "on" or "off"
    demotext1: "demo text", // example of a text field

    demoextension_restore_defaults: "off"
};
// need to make sure we have a proper clone of this object and not a reference
// otherwise changes to server also change defaults
let serverConfig = structuredClone(default_serverConfig)

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    // do something here when disconnects happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL)
    );

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", localConfig.EXTENSION_NAME, "STREAMLABS_ALERT")
    );

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                if (extension_packet.data.demoextension_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    serverConfig.demovar1 = "off";
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;

                }
                SaveConfigToServer();
                SendSettingsWidgetSmall("");
            }
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        // we asked for something that didn't exist
    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else
        {
            // might want to log message to see if we are not handling something we should be
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
        }
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ============================================================================
//                           FUNCTION: process_stream_alert
// ============================================================================
// Desription: Handle stream alerts (follows,subs etc)
// Parameters: data for the alert
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
/**
 * Just a function to log data from the streamlabs api messages
 * @param {String} server_packet 
 */
function process_stream_alert (server_packet)
{
    // for this type of message we need to know the format of the data packet. 
    //and do something usefull with it 
    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".process_stream_alert", "empty function");

}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
// Desription: Send the settings widget small code back after setting the defaults according 
// to our server settings
// Parameters: channel to send data to
// ----------------------------- notes ---------------------------------------
// none
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
{
    // read our modal file
    fs.readFile(__dirname + '/demoextensionsettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            // now is the time to set any data we want in the form. ie what checkboxes should be
            // set to match our current serverConfig settings etc
            // this works as our config names are the same as the names in the modal form

            // loop through our config and if we have matching tags in the html code replace them
            // this might be easier to do using a DOM object but this is a simple way to get the
            // job done
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                // leaving the demotextchecked item there will get ignored so we don't need to do anything
                // with unchecked values

                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        localConfig.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig))
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
