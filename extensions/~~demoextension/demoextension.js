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

const localConfig = {
    // Temporary settings that don't get saved over restarts

    // logging tag used so we can easily work out what part of the system the 
    // console log data is from
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    // This will store our socket connection to the StreamRoller backend
    // this socket is used to send data for others to use and receive
    // data for you to use in your extension
    DataCenterSocket: null,
    //Timeout for how often we send heartbeat messages
    heartBeatTimeout: 5000,
    // heartbeat handle to hold the heartbeat timer
    heartBeatHandle: null,
    // timeout for checking readinessFlags
    startupCheckTimer: 500,
    // state of startup, ready gets set when we have all our config below
    ready: false,
    // These flags are things we need before consider ourself started up and ready to
    // run. Add things like CredentialsReceived etc as you require them
    readinessFlags: {
        ConfigReceived: false, // gets set when our config files comes in from the server
    },

};

// serverConfig is how we store our data that is needed to persist
// accross a restart or changed via a webpage (ie the admin or live 
// pages that the backend server gives access to in the browser)
const default_serverConfig = {
    // version number. when updated the first run will force an overwrite of config data
    __version__: "0.2",
    // add our name so we can tell if we receive this localConfig from the server
    extensionname: "demoextension",
    // the channel name this extension will use for sending/receiving data.
    // this is also used in the settings widget small code
    channel: "DEMOEXT_CHANNEL",
    // these are fields we will use in our bit of the admin page code (the modal)
    // good to store them so that we can keep the page up to date when 
    // we send it back
    demoExtensionEnabled: "off",  // example of a checkbox. "on" or "off"
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
    // these are messages we can send out that other extensions might want to use to trigger an action
    // types start with either trigger_ or action_ and should be unique to this package (ie name them appropriately)
    // There are a few where a common name might be useful (ie chatmessages)
    triggers:
        [
            {
                // notes:
                // _UIDescription field is used as a tooltip popup on the autopilot page when the user hovers the mouse over this field.
                // triggerActionRef field should be copied through from actions to any triggers happening due to this action (where possible). This allows the user to filter out only triggers that happened due to their action if they need to.
                name: "demoextensionSomethingHappened",
                name_UIDescription: "tooltip",
                displaytitle: "Something happened",
                displaytitle_UIDescription: "tooltip",
                description: "The Demo extension did something that you might like to know about",
                description_UIDescription: "tooltip",
                messagetype: "trigger_DemoextensionSomethingHappened",
                messagetype_UIDescription: "tooltip",
                parameters: {
                    message: "",
                    message_UIDescription: "tooltip",
                    triggerActionRef: "DemoTrigger",// can be used by users to filter triggers
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "demoextensionDoSomething",
                name_UIDescription: "tooltip",
                displaytitle: "Do your Stuff",
                displaytitle_UIDescription: "tooltip",
                description: "A request for the demo extension to do something useful",
                description_UIDescription: "tooltip",
                messagetype: "action_DemoextensionDoStuff",
                messagetype_UIDescription: "tooltip",
                parameters: {
                    message: "",
                    message_UIDescription: "tooltip",
                    triggerActionRef: "DemoAction",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }

        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension
 * @param {string} app 
 * @param {string} host 
 * @param {string} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    try
    {
        // store the heartbeat timeout value
        localConfig.heartBeatTimeout = heartbeat;
        // start the socket connection by using the extensionhelper setupConnection function. we give it our callbaks to 
        // use to process messages 
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
        // startup check will set the ready flag when have met our startup requirements
        startupCheck();
    } catch (err)
    {
        // using the logger module to log message to the console. message generally take the format of
        // message normally take the form of 
        // "[<SYSTEM LOCATION>]<EXTENSIONNAME><FILE><FUNCTION><MESSAGES ...>
        // i.e.
        // log("[EXTENSION]demoextension.initialise","Something happened"
        // there are log,info,warn and err functions to use
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");

    // Let the server know we managed to connect ok
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));

    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );

    // register here for any channels you want to listen to. this example is going to listen on the 
    // STREAMLABS_ALERT channel for messages. 
    // NOTE: you will need to monitor for failed connections later and setup a scheduler to re-register
    // this can happen if during startup you faster than the extension that creates this channel and it
    // doesn't exist yet.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "STREAMLABS_ALERT")
    );

    //start our heartbeat messages
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)

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
    // if we have requested our stored data we will receive a 'ConfigFile' type of packet

    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
        // check this config is ours
        if (server_packet.data != "" && server_packet.data.extensionname === serverConfig.extensionname)
        {

            //
            let connectionChanged
            let configSubVersions = 0;
            let defaultSubVersions = default_serverConfig.__version__.split('.');
            // should only be hit on very first run when there is no saved data file
            if (!server_packet.data.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                SaveConfigToServer();
            }
            // split the version numbers as we can merge and save user settings for minor changes
            configSubVersions = server_packet.data.__version__.split('.')

            if (configSubVersions[0] != defaultSubVersions[0])
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                SaveConfigToServer();
                connectionChanged = true;
            }
            else if (configSubVersions[1] != defaultSubVersions[1])
            {
                serverConfig = { ...default_serverConfig, ...server_packet.data };
                serverConfig.__version__ = default_serverConfig.__version__;
                console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
                SaveConfigToServer();
                connectionChanged = true;
            }
            else
            {
                // check if we have turned on the extension
                if (serverConfig.demoExtensionEnabled == "on" && !server_packet.data.demoExtensionEnabled)
                    connectionChanged = true;
                serverConfig = structuredClone(server_packet.data);
                SaveConfigToServer();
            }

            if (connectionChanged)
                //check for reconnection required, ie extension turned on/off etc
                SendSettingsWidgetSmall();
            //SendSettingsWidgetLarge();

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
                    // This data has come from the html modal for submit action (user clicked submit on the page)
                    // It will only contain items we have set in our modal html file we sent above
                    // lets reset our config checkbox settings (modal will omit ones not checked so 
                    // they wont get changed below if the user has deselected them so we do it here and 
                    // set them back on as we loop through the data if they are there)
                    serverConfig.demoExtensionEnabled = "off";

                    // set our config values to the ones in message
                    // note this for loop requires the modal html code names to match what we want in the config variable
                    // means we can just assign them here without having to work out what the config name is 
                    // for the given name in the modal html (note: only if we have a flat structure in our config)
                    for (const [key, value] of Object.entries(extension_packet.data))
                        serverConfig[key] = value;

                }

                // Update our saved data to the server for next time we run.
                // this is also the point were you make changes based on the settings the user has changed
                SaveConfigToServer();
                // the SendSettingsWidgetSmall function will update pages that have our settings widget on it
                // ideally it should only be sent if our settings have changed but we just send it here as it is low
                // bandwidth overall
                SendSettingsWidgetSmall("");
            }
        }
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "TriggerAndActions",
                        serverConfig.extensionname,
                        triggersandactions,
                        "",
                        server_packet.from
                    ),
                    "",
                    server_packet.from
                )
            )
        }
        else if (extension_packet.type === "action_DemoextensionDoStuff")
        {
            //do something with your action here
            console.log("action_DemoextensionDoStuff called with", extension_packet.data)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // looks like a channel we requested to join isn't available. Maybe the extension hasn't started up yet so lets just set a timer
    // to keep trying. 
    else if (server_packet.type === "UnknownChannel")
    {
        // check if we have failed too many times to connect (maybe the service wasn't started)
        if (server_packet.data == "STREAMLABS_ALERT")
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
            setTimeout(() =>
            {
                // resent the register command to see if the extension is up and running yet
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", serverConfig.extensionname, server_packet.data
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
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
        }
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
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
    //and do something useful with it 
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".process_stream_alert", "empty function");

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
 * @param {String} to 
 */
function SendSettingsWidgetSmall (to)
{
    // read our modal file
    fs.readFile(__dirname + '/demoextensionsettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalString = filedata.toString();
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
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        serverConfig.channel,
                        to,

                    ),
                    serverConfig.channel,
                    to // in this case we only need the "to" channel as we will send only to the requester
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
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Provides a heartbeat message to inform other extensions of our status
 */
function heartBeatCallback ()
{
    // we can send a color for things like the liveportal page to use to show on the icon.
    let color = "red";
    // local variable to determine if we are in an intermediate state.
    // ie extension turned on but can't connect to a service etc
    // for teh demo we just leave it false so this extension should have an orange icon next to it in liveportal
    let connected = false;

    // determine the color we wish to show for our status
    if (serverConfig.demoExtensionEnabled === "on")
    {
        connected = false;
        if (!connected)
            color = "orange"
        else
            color = "green"
    }
    else
        color = "red"

    // send the status message. These should be short but you can add extra data if you wish to provide status for other extension (ie obs bitrate, connection quality etc). if more than a couple of items it is recommended to setup a status message timer to send them out separately
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    connected: connected,
                    color: color
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * waits for config and credentials files to set ready flag
 */
function startupCheck ()
{
    const allReady = Object.values(localConfig.readinessFlags).every(flag => flag);
    if (allReady)
    {
        localConfig.ready = true;
        try
        {
            postStartupActions();
            // perform any startup stuff here that requires saved credentials and config
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", err);
        }
    }
    else
        setTimeout(startupCheck, localConfig.startupCheckTimer);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * At this point we should have any config/credentials loaded
 */
function postStartupActions ()
{
    // Let the server know we are now up and running.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionReady", serverConfig.extensionname));
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

