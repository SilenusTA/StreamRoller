// ############################# SRAUDIO.js ##############################
// This is a sraudio extension controls the audio
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 06-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// None, sraudio extension
// ============================================================================

import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import portAudio from "naudiodon";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
export const localConfig = {
    DataCenterSocket: null,
    audioDevOut: [],
    audioDevIn: [],
    audioDevInOut: []

};

const serverConfig = {
    extensionname: "sraudio",
    channel: "SR_AUDIO",
    sraudiovar1: "on",  // example of a checkbox. "on" or "off"
    sraudiotext1: "sraudio text" // example of a text field
};

const OverwriteDataCenterConfig = false;
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
        logger.err("[EXTENSION]" + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
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
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Connection message handler
 * @param {*} _socket 
 */

function onDataCenterConnect (socket)
{
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket("JoinChannel", serverConfig.extensionname, "STREAMLABS_ALERT"));
    //https://github.com/Streampunk/naudiodon
    // microsoft sound mapper is the default device
    /*
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log("###############################################################################")
    console.log(portAudio.getHostAPIs())
    */
    portAudio.getDevices().forEach((dev) =>
    {
        //console.log(dev)
        if (dev.maxInputChannels > 0)
            localConfig.audioDevIn.push(dev)
        else if (dev.maxOutputChannels > 0)
            localConfig.audioDevOut.push(dev)
        else
            localConfig.audioDevInOut.push(dev)
    })
    localConfig.audioDevOut.forEach((dev) =>
    {
        //console.log(">> ", dev.hostAPIName, dev.name, dev.defaultSampleRate)
        console.log(">> ", dev)
    }
    )
    // test audio output
    /*var ao = new portAudio.AudioIO({
      outOptions: {
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat24Bit,
        sampleRate: 44100,
        deviceId: 47, // Use -1 or omit the deviceId to select the default device
        closeOnError: true // Close the stream if an audio error is detected, if set false then just log the error
      }
    });
    
    var rs = fs.createReadStream('extensions/datahandlers/sraudio/test.mp3');
    rs.pipe(ao);
    ao.start();
    */

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
function onDataCenterMessage (server_packet)
{
    //logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "message received ", server_packet);

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
            for (const [key] of Object.entries(serverConfig))
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
                serverConfig.sraudiovar1 = "off";

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
            logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // looks like a channel we requested to join isn't available. Maybe the extension hasn't started up yet so lets just set a timer
    // to keep trying. 
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        setTimeout(() =>
        {
            // resent the register command to see if the extension is up and running yet
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);
    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
    {
        logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage",
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
        logger.warn("[EXTENSION]" + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
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
function SendAdminModal (tochannel)
{
    // read our modal file
    fs.readFile(__dirname + "/sraudioadminmodal.html", function (err, filedata)
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
                // leaving the sraudiotextchecked item there will get ignored so we don't need to do anything
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
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "AdminModalCode", // message type
                        serverConfig.extensionname, //our name
                        modalstring,// data
                        "",
                        tochannel,
                        serverConfig.channel
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
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket("SaveConfig",
        serverConfig.extensionname,
        serverConfig))
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
