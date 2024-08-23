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
// ############################# DEMOEXTENSION.js ##############################
// This is a demo extension you can copy to start a new extension. It is
// designed to make creating a new extension easier by habing all the templates 
// you might need.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 06-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// None, demo extension
// ----------------------------- notes ----------------------------------------
// --filenames
// To create an extension this file needs to be put in a folder with same name.
// ie if your extension is called billybob then it should be ..
// .../extensions/billybob/billybob.js
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================

// logger will allow you to log messages in the same format as the system messages
import * as logger from "../../backend/data_center/modules/logger.js";
// messaging api provides some functions to make sending messages easier.
import * as fs from "fs";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// we use this to count how many attempts have been made to connect to a channel
// we should have a counter for each channel we wish to join.
let connectionAttempts =
    [{ "STREAMLABS_ALERT_ConnectionAttempts": 0 }]



const localConfig = {
    // settings for how we connect to the backend server
    // normally localhost unless running the extension remotely
    // what we want to call our channel so that others can see the data we post
    OUR_CHANNEL: "DEMOEXT_CHANNEL",
    // this must match the folder and file name of the extension
    EXTENSION_NAME: "demoextension",
    // logging tag used so we can easily work out what part of the system the 
    // console log data is from
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    // This will store our socket connection to the StreamRoller backend
    // this socket is used to send data for others to use and receive
    // data for you to use in your extension
    DataCenterSocket: null,
    // how many times will we attempt to register for a channel if it hasn't been created yet
    MAX_CONNECTION_ATTEMPTS: 5
};

// serverConfig is how we store our data that is needed to persist
// accross a restart or changed via a webpage (ie the admin or live 
// pages that the backend server gives access to in the browser)
const default_serverConfig = {
    // version number. when updated the first run will force an overwrite of config data
    __version__: "0.2",
    // add our name so we can tell if we receive this localConfig from the server
    extensionname: localConfig.EXTENSION_NAME,
    // the channel name this extension will use for sending/receiving data.
    // this is also used in the settings widget small code
    channel: localConfig.OUR_CHANNEL,
    // these are fields we will use in our bit of the admin page code (the modal)
    // good to store them so that we can keep the page up to date when 
    // we send it back
    demovar1: "on",  // example of a checkbox. "on" or "off"
    demotext1: "demo text", // example of a text field

    demoextension_restore_defaults: "off"
};
// need to make sure we have a proper clone of this object and not a reference
// otherwise changes to server also change defaults
let serverConfig = structuredClone(default_serverConfig)

// triggers and actions are what are used by the main extension (default is the live portal)
// to allow the user to link extensions together (ie when trigger A happens call trigger B)
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Demo Extension for copying and pasting to get you started faster on writing extensions",
    version: "0.2",
    channel: serverConfig.channel,
    // these are messages we can sendout that other extensions might want to use to trigger an action
    triggers:
        [
            {
                name: "demoextensionSomethingHappened",
                displaytitle: "Somthing happened",
                description: "The Demo extension did something that you might like to know about",
                messagetype: "trigger_DemoextensionSomethingHappened",
                parameters: { message: "" }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "demoextensionDoSomething",
                displaytitle: "Do your Stuff",
                description: "A request for the demo extension to do something useful",
                messagetype: "action_DemoextensionDoStuff",
                parameters: { message: "" }
            }

        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Description: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    try
    {
        // start the socket connection by using the extensionhelper setupConnection function. we give it our callbaks to 
        // use to process messages 
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        // using the logger module to log message to the console. message generally take the format of
        // message nomrally take the form of 
        // "[<SYSTEM LOCATION>]<EXTENSIONNAME><FILE><FUNCTION><MESSAGES ...>
        // i.e.
        // log("[EXTENSION]demoextension.initialise","Something happened"
        // there are log,info,warn and err functions to use
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * @param {String} reason 
 */
function onDataCenterDisconnect (reason)
{
    // do something here when disconnects happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Description: Received connect message
// Parameters: socket 
// ----------------------------- notes ----------------------------------------
// When we connect to the StreamRoller server the first time (or if we reconnect)
// we will get this function called.
// it is also a good place to create/join channels we wish to use for data
// monitoring/sending on.
// ===========================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    // log a message for debugging purposes. Once you have your extension up and running
    // please delete any spurious messages like this to save on the spam in the log window
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");

    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL)
    );

    // register here for any channels you want to listen to. this example is going to listen on the 
    // STREAMLABS_ALERT channel for messages. 
    // NOTE: you will need to monitor for failed connections later and setup a scheduler to re-register
    // this can happen if during startup you faster than the extension that creates this channel and it
    // doesn't exist yet.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", localConfig.EXTENSION_NAME, "STREAMLABS_ALERT")
    );

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Description: Received message
// Parameters: data - data received
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    //logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "message received ", server_packet);

    // if we have requested our stored data we will receive a 'ConfigFile' type of packet
    if (server_packet.type === "ConfigFile")
    {
        // check if there is any data in this packet. This could be empty if it is our first run or we have never 
        // saved any config data before. 
        // if it has data we need to update our serverConfig varable.
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            // check for updates to the version. if the version has changed we need to 
            // load the defaults instead.
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            // send the config back to the server. This is only need if the server config
            // and our raw congig elements differ sending back is quick and not done often
            // so lets just be lazy and send it back
            SaveConfigToServer();

        }
    }
    // This is a message from an extension. the content format will be described by the extension
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------- PROCESSING SETTINGS WIDGET SMALLS -----------------------
        // Modals are the bit of html code we send to the server to be used on the webpages
        // it is not required to be used so these can be omitted if you wish.
        // if we have a modal file (a section of html we want to put on the admin page)
        // we need to send it back when requested so the page can update itself
        // this is normally inserted into a link on the main page so we can send/receive
        // data from the webpage (ie to change our settings etc)
        // there are currently three types of pages that can be requested/sent/processed
        // 1. SettingsWidgetSmall - a popup page, added to the link on the main portal page
        // 2. SettingsWidgetLarge - a full screen page, added to the settings tab on the main portal page
        // 3. CredentialsModals - a popup page where the user can add their credentials for login to services etc

        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            // just call the SendSettingsWidgetSmall function below with the channel to send the message back on
            SendSettingsWidgetSmall(extension_packet.from);
        // if we receive data back from our settings widget small we process this here.
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            //make sure it is our modal
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {
                if (extension_packet.data.demoextension_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    // This data has come from the html modal for sumit action (user clicked submit on the page)
                    // It will only contain items we have set in our modal html file we sent above
                    // lets reset our config checkbox settings (modal will omit ones not checked so 
                    // they wont get changed below if the user has deselcted them so we do it here and 
                    // set them back on as we loop through the data if they are there)
                    serverConfig.demovar1 = "off";

                    // set our config values to the ones in message
                    // note this for loop requires the modal html code names to match what we want in the config variable
                    // means we can just assign them here without having to work out what the config name is 
                    // for the given name in the modal html (note: only if we have a flat stucture in our config)
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;

                }

                // Update our saved data to the server for next time we run.
                // this is also the point were you make changes based on the settings the user has changed
                SaveConfigToServer();
                // the SendSettingsWidgetSmall function will update pages that have our settings widget on it
                // ideally it should only be sent if our settings have changed but we just send it here as it is low
                // bandwidth overally
                SendSettingsWidgetSmall("");
            }
        }
        else if (extension_packet.type === "action_DemoextensionDoStuff")
        {
            //do something with your action here
            console.log("action_DemoextensionDoStuff called with", extension_packet.data)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // looks like a channel we requested to join isn't available. Maybe the extension hasn't started up yet so lets just set a timer
    // to keep trying. 
    else if (server_packet.type === "UnknownChannel")
    {
        // check if we have failed too many times to connect (maybe the service wasn't started)
        if (server_packet.data == "STREAMLABS_ALERT" && connectionAttempts[0].STREAMLABS_ALERT_ConnectionAttempts++ < localConfig.MAX_CONNECTION_ATTEMPTS)
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
            setTimeout(() =>
            {
                // resent the register command to see if the extension is up and running yet
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", localConfig.EXTENSION_NAME, server_packet.data
                    ));
            }, 5000);
        }
    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else if (server_packet.dest_channel === "STREAMLABS_ALERT")
            // do something with the data
            process_stream_alert(server_packet);

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
// Description: Handle stream alerts (follows,subs etc)
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
// Description: Send the settings widget small code back after setting the defaults according 
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
 * @param {String} toextension 
 */
function SendSettingsWidgetSmall (toextension)
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
                        toextension,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    toextension // in this case we only need the "to" channel as we will send only to the requester
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

