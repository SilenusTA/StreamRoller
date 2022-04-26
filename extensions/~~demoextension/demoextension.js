// ############################# DEMOEXTENSION.js ##############################
// This is a demo extension you can copy to start a new extension. It is
// designed to make creating a new extension easier by habing all the templates 
// you might need.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
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
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
// logger will allow you to log messages in the same format as the system messages
import * as logger from "../../backend/data_center/modules/logger.js";
// extension helper provides some functions to save you having to write them.
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
// config is used for non changing data. 
import { config } from "./config.js";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// we use this to count how many attempts have been made to connect to a channel
// we should have a counter for each channel we wish to join.
let streamlabsChannelConnectionAttempts = 0;


// serverConfig is how we store our data that is needed to persist
// accross a restart or changed via a webpage (ie the admin or live 
// pages that the backend server gives access to in the browser)
const serverConfig = {
    // add our name so we can tell if we receive this config from the server
    extensionname: config.EXTENSION_NAME,
    // the channel name this extension will use for sending/receiving data.
    // this is also used in the admin modal code
    channel: config.OUR_CHANNEL,
    // these are fields we will use in our bit of the admin page code (the modal)
    // good to store them so that we can keep the page up to date when 
    // we send it back
    demovar1: "on",  // example of a checkbox. "on" or "off"
    demotext1: "demo text" // example of a text field
};

// DEBUGGING - Set this to true if you need your server data to be refreshed from above.
// during development you may find your server data gets messed up if changing it often.
// while uncommented your data will not presist and be overwritten by the above config
// every time the server runs up.

const OverwriteDataCenterConfig = false;

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise(app, host, port, heartbeat)
{
    try
    {
        // start the socket connection by using the extensionhelper setupConnection function. we give it our callbaks to 
        // use to process messages 
        config.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        // using the logger module to log message to the console. message generally take the format of
        // message nomrally take the form of 
        // "[<SYSTEM LOCATION>]<EXTENSIONNAME><FILE><FUNCTION><MESSAGES ...>
        // i.e.
        // log("[EXTENSION]demoextension.initialise","Something happened"
        // there are log,info,warn and err functions to use
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "config.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * @param {String} reason 
 */
function onDataCenterDisconnect(reason)
{
    // do something here when disconnt happens if you want to handle them
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Desription: Received connect message
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
function onDataCenterConnect(socket)
{
    // log a message for debugging purposes. Once you have your extension up and running
    // please delete any spurious messages like this to save on the spam in the log window
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");
    // DEBUGGING overwrite our config data on the server if the flag is set
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    // Create a channel for messages to be sent out on
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", config.EXTENSION_NAME, config.OUR_CHANNEL)
    );

    // register here for any channels you want to listen to. this example is going to listen on the 
    // STREAMLABS_ALERT channel for messages. 
    // NOTE: you will need to monitor for failed connections later and setup a scheduler to re-register
    // this can happen if during startup you faster than the extension that creates this channel and it
    // doesn't exist yet.
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", config.EXTENSION_NAME, "STREAMLABS_ALERT")
    );

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Desription: Received message
// Parameters: data - data received
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
function onDataCenterMessage(server_packet)
{
    //logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "message received ", server_packet);

    // if we have requested our stored data we will receive a 'ConfigFile' type of packet
    if (server_packet.type === "ConfigFile")
    {
        // check if there is any data in this packet. This could be empty if it is our first run or we have never 
        // saved any config data before. 
        // if it has data we need to update our serverConfig varable.
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            // we could just assign the values here (ie serverConfig = decoded_packet.data)
            // but if we change/remove an item it would never get removed from the store.
            // we will update any fields we have that are in the message passed to us
            for (const [key, value] of Object.entries(serverConfig))
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];

            // send the config back to the server. This is only need if the server config
            // and our raw congig elements differ sending back is quick and not done often
            // so lets just be lazy and send it back
            SaveConfigToServer();

        }
    }
    // This is a message from an extension. the content format will be described by the extension
    else if (server_packet.type === "ExtensionMessage")
    {
        let decoded_packet = server_packet.data;
        // -------------------- PROCESSING ADMIN MODALS -----------------------
        // Modals are the bit of html code we send to the server to be used on the webpages
        // it is not required to be used so these can be omitted if you wish.
        // if we have a modal file (a section of html we want to put on the admin page)
        // we need to send it back when requested so the page can update itself
        // this is normally inserted into a link on the main page so we can send/receive
        // data from the webpage (ie to change our settings etc)
        if (decoded_packet.type === "RequestAdminModalCode")
            // just call the SendAdminModal function below with the channel to send the message back on
            SendAdminModal(decoded_packet.from);
        // if we receive data back from our admin modal we process this here.
        else if (decoded_packet.type === "AdminModalData")
        {
            //make sure it is our modal
            if (decoded_packet.data.extensionname === serverConfig.extensionname)
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
                // for the given name in the modal html
                for (const [key, value] of Object.entries(decoded_packet.data))
                    serverConfig[key] = value;

                // Update our saved data to the server for next time we run.
                // this is also the point were you make changes based on the settings the user has changed
                SaveConfigToServer();
                // the SendAdminModal function will update the admin page to match what is in our current settings
                // SendAdminModal(server_packet.join);
            }
        }
        else
            logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // looks like a channel we requested to join isn't available. Maybe the extension hasn't started up yet so lets just set a timer
    // to keep trying. 
    else if (server_packet.type === "UnknownChannel")
    {
        // check if we have failed too many times to connect (maybe the service wasn't started)
        if (streamlabsChannelConnectionAttempts++ < config.channelConnectionAttempts)
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
            // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
            setTimeout(() =>
            {
                // resent the register command to see if the extension is up and running yet
                sr_api.sendMessage(config.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", config.EXTENSION_NAME, server_packet.data
                    ));
            }, 5000);
        }
    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
    {
        // first we check which channel the message came in on
        if (server_packet.channel === "STREAMLABS_ALERT")
            // do something with the data
            process_stream_alert(server_packet);
        else
            logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
    )
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME +
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
function process_stream_alert(server_packet)
{
    // for this type of message we need to know the format of the data packet. 
    //and do something usefull with it 
    logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".process_stream_alert", "empty function");

}
// ===========================================================================
//                           FUNCTION: SendAdminModal
// ===========================================================================
// Desription: Send the admin modal code back after setting the defaults according 
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
function SendAdminModal(tochannel)
{
    // read our modal file
    fs.readFile(__dirname + '/demoextensionadminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
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
            sr_api.sendMessage(config.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    config.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "AdminModalCode", // message type
                        config.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        config.OUR_CHANNEL
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
function SaveConfigToServer()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            config.EXTENSION_NAME,
            serverConfig))
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
