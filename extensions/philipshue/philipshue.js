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
// ############################# philipshue.js ##############################
// This extension provides access to hue lights
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 08-June-2023
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as HueAPI from "node-hue-api"

const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    hubs: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        color: "red",// for heartbeat callbacks
        connected: false, // have we managed to get data from the hub
        paired: false // have we paired to the hub
    },
    // full scenes and groups data
    allScenes: [],
    allGroups: [],
    // our API only data (ie just name, state etc.)
    allScenesSRAPIData: []

};
const default_serverConfig = {
    __version__: 0.1,
    extensionname: "philipshue",
    channel: "PHILIPSHUE",
    // sesttings dialog variables
    PhilipsHueenabled: "off",
    PhilipsHuePair: "off",
    PHILIPS_HUE_DEBUG: "off",
    DEBUGGING_DATA: false
};
let serverConfig = default_serverConfig;
let localCredentials = {

    ExtensionName: serverConfig.extensionname,
    ipaddress: null,
    username: null,
    clientkey: null
}
// as I don't have a philips hue bridge to test I have to use test data

if (serverConfig.DEBUGGING_DATA)
{
    // load a scenes list from file
    localConfig.allScenes = JSON.parse(fs.readFileSync(__dirname + '/debug_only_testing/DATA_allScenes.js', 'utf8'));
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);

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
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));

    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );

    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    logger.log("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "message received ", server_packet);
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
                serverConfig = default_serverConfig;
            else
                serverConfig = server_packet.data
        }
        SaveConfigToServer();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            localCredentials = server_packet.data;
            // attempt to connet to the hubs
            connectToHub()
            getAllScenes()
            getAllGroups()
            processScenese()
            outputScenes()
        }
        else
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty make sure to set it on the admin page.");
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            // TBD maintain list of all extensions that has requested Modals
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                serverConfig.PhilipsHueenabled = "off";
                serverConfig.PhilipsHuePair = "off";
                serverConfig.PHILIPS_HUE_DEBUG = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                {
                    //lets check our settings and send out updates as required
                    if (value === "on" && !extension_packet.data[key])
                        serverConfig[key] = "off";
                    else if (key === "randomfactstimeout")
                        serverConfig[key] = extension_packet.data[key] * 60000
                    else if (key in extension_packet.data)
                        serverConfig[key] = extension_packet.data[key];
                }
                // pairing was requested or we need to pair
                if (serverConfig.PhilipsHuePair == "on")
                {
                    serverConfig.PhilipsHuePair = "off";
                    connectToHub(true);
                }
                // update our scenes
                getAllScenes()
                getAllGroups()
                processScenese()
                outputScenes()

                SaveConfigToServer();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetSmallCode")
        {
            // ignore these messages
        }
        else if (extension_packet.type === "GetAllScenes")
        {
            if (extension_packet.to === serverConfig.extensionname && serverConfig.PhilipsHueenabled == "on")
            {
                getAllScenes()
                getAllGroups()
                processScenese()
                outputScenes()
            }
        }
        else if (extension_packet.type === "ActivateScene")
        {
            if (extension_packet.to === serverConfig.extensionname && serverConfig.PhilipsHueenabled == "on")
                activateScene(extension_packet.data.sceneID)
        }
        else
            logger.warn("[EXTENSION]" + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
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
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * send some modal code 
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
{

    fs.readFile(__dirname + '/philipshuesettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            modalstring = modalstring.replaceAll("PhilipsHueUsernametext", serverConfig.username);
            modalstring = modalstring.replaceAll("PhilipsHueIPtext", serverConfig.hubip);
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        tochannel,
                        serverConfig.channel
                    ),
                    "",
                    tochannel
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: UpdateCredentials
//          Update the credentials stored in the encrypted credential file
// ============================================================================
function UpdateCredentials ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            serverConfig.extensionname,
            localCredentials,
        ));
}

// ============================================================================
// ============================================================================
//                           PHILIPS HUE FUNCTIONALITY
// ============================================================================
// ============================================================================

// ============================================================================
//                           FUNCTION: discoverBridge
// ============================================================================
async function discoverBridge ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("------------- discoverBridge --------------")
    let discoveryResults = null;
    try
    {
        discoveryResults = await HueAPI.v3.discovery.nupnpSearch();
        if (discoveryResults.length === 0)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge", "failed to locate any Philips Hue Bridges", discoveryResults);
        } else
        {
            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge: discoveryResults ", discoveryResults);
            // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
            localCredentials.ipaddress = discoveryResults[0].ipaddress
        }
    }
    catch (error)
    {
        localCredentials.ipaddress = null;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge", "nupnpSearch error", error.message);
    }

}

// ============================================================================
//                           FUNCTION: pair
// ============================================================================
async function pair ()
{
    let createdUser = null;
    let unauthenticatedApi = null;
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("------------- pair --------------")
    if (serverConfig.PhilipsHueenabled == "off")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".gepairtHubs", "Attempting to pair when extension is turned off in settings")
        return;
    }
    // get the bridge address if we don't have it already
    if (!localCredentials.ipaddress)
        await discoverBridge();

    // check that we managed to get an address
    if (!localCredentials.ipaddress)
    {
        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("pair: No IP address found, aboating connection")
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pair", "Failed to get ip of hue Bridge");
    }
    else
    {
        try 
        {
            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log('pair: Got the hub IP:', localCredentials.ipaddress);
            // Create an unauthenticated instance of the Hue API so that we can create a new user
            unauthenticatedApi = await HueAPI.v3.api.createLocal(localCredentials.ipaddress).connect();

        } catch (err)
        {
            localConfig.status.connected = false;
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pair", "Failed to create an unauthenticated connection to the hub to create a new user");
        }

        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log('pair: unauthenticatedApi connected');
        try
        {
            createdUser = await unauthenticatedApi.users.createUser('StreamRoller', "GodLikeStreamer");
            console.log('pair: *******************************************************************************\n');
            console.log('pair: User has been created on the Hue Bridge ');
            console.log(`pair: User: ${createdUser.username}`);
            console.log('pair: *******************************************************************************\n');

            // store the credentials for future use. Don't want the user to have to find their hub and press a button every time they start up StreamRoller
            localCredentials.username = createdUser.username;
            localCredentials.clientkey = createdUser.clientkey;
            localConfig.status.paired = true;
            UpdateCredentials();

        } catch (err)
        {
            localConfig.status.paired = false;
            localConfig.status.connected = false;
            localCredentials.username = null;
            localCredentials.clientkey = null;
            if (err.getHueErrorType && err.getHueErrorType() === 101)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getpairHubs", "The Link button on the bridge was not pressed. Please press the Link button and try again.");
            else
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pair", "Unexpected Error while creating user (linking with bridge):", err.message);
        }
    }
}
// ============================================================================
//                           FUNCTION: connectToHub
// ============================================================================
async function connectToHub (perform_pairing = false)
{
    if (serverConfig.DEBUGGING_DATA) 
    {
        console.log("connectToHub:using debugging dataset")
        return;
    }

    // ############################ PAIRING - If Needed or Requested ############################
    if (!localCredentials.username || !localCredentials.clientkey || !localConfig.status.paired || perform_pairing)
    {
        localConfig.status.paired = false;
        localConfig.status.connected = false;
        await pair();
    }

    try
    {
        // ################################ CONNECT TO THE HUB ##########################################
        // Create a new API instance that is authenticated 

        localConfig.authenticatedApi = await HueAPI.v3.api.createLocal(localCredentials.ipaddress).connect(localCredentials.username);

        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("connectToHub: authenticatedApi", localConfig.authenticatedApi)

        // Do something with the authenticated user/api
        // we get the bridge config as it is a good test and might be useful later
        localConfig.bridgeConfig = await localConfig.authenticatedApi.configuration.getConfiguration();
        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log('connectToHub: bridgeConfig: ', localConfig.bridgeConfig);

        // safe to assume we are connected if we haven't thrown any errors at this point
        localConfig.status.connected = true;

    }
    catch (err)
    {
        localConfig.status.connected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToHub", "authenticatedApi failed", err.message);
    }
}

// ============================================================================
//                           FUNCTION: getAllScenes
// ============================================================================
async function getAllScenes ()
{
    try
    {
        if (serverConfig.PhilipsHueenabled == "on")
        {
            // test code as I have no other way of testing it
            if (serverConfig.DEBUGGING_DATA)
            {
                let tmpscene = {}
                console.log("!!!!!Test code!!!!! getAllScenes returning test data")
                localConfig.allScenesSRAPIData = [];
                localConfig.allScenes.forEach(element =>
                {

                    if (element._data.recycle == false)
                    {
                        tmpscene = {
                            id: element._data.id,
                            name: element._data.name,
                            group: element._data.group,
                            active: false
                        }
                        localConfig.allScenesSRAPIData.push(tmpscene)
                    }
                });
                outputScenes();
                return
            }

            // check we have an api to talk to
            if (localConfig.authenticatedApi)
            {
                // request all scenes
                localConfig.allScenes = await localConfig.authenticatedApi.scenes.getAll()

                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Received a scenes list")

                // we don't want to be pushing all this data around all the time
                // so we cut it down here to only stuff extensions are interested in
                localConfig.allScenes.forEach(element =>
                {
                    // ignore the recycled stuff
                    if (!element._data.recycle)
                    {
                        localConfig.allScenesSRAPIData.push(
                            {
                                id: element._data.id,
                                name: element._data.name,
                                group: element._data.group,
                                active: false
                            })
                    }
                });

                // safe to assume we are connected at this point
                localConfig.status.connected = true;
            }
            else
            {
                localConfig.status.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllScenes", "Cant get scenes, Have you paired to the hub");
            }
        }
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllScenes", "Error returned:", error.message);
    }
}
// ============================================================================
//                           FUNCTION: getAllGroups
// ============================================================================
async function getAllGroups ()
{
    // YET TO BE TESTED OR DEBUGGED, AWAITING ON DATA PACKET TO SEE THE FORMAT OF IT.
    // new get groups need to debug this.
    try
    {
        if (serverConfig.PhilipsHueenabled == "on")
        {
            // test code as I have no other way of testing it
            if (serverConfig.DEBUGGING_DATA)
            {
                console.log("No group data available yet")
                return;
            }

            // check we have an api to talk to
            if (localConfig.authenticatedApi)
            {
                localConfig.allGroups = await localConfig.authenticatedApi.groups.getAll()

                //process group code here

                // output groups so we can get a look at what kind of data we are dealing with
                // these will hopefully allow us to indicate which scenes are 'on' on the live portal
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Outputting groups")
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log(localConfig.allGroups)
            }
            else
            {
                localConfig.status.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllScenes", "Cant get scenes, Have you paired to the hub");
            }
        }
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllScenes", "Error returned:", error.message);
    }

}
// ============================================================================
//                           FUNCTION: processScenese
// This function will go through the scenes and mark them as on, on_part, or off
// ============================================================================
function processScenese ()
{
    console.log("Process scenes TBD")
}
// ============================================================================
//                           FUNCTION: outputScenes
// ============================================================================
function outputScenes ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "PhilipsHueScenes",
                localConfig.extensionname,
                localConfig.allScenesSRAPIData,
                serverConfig.channel
            ),
            serverConfig.channel,
        ))
}
// ============================================================================
//                           FUNCTION: activateScene
// ============================================================================
function activateScene (scenedID)
{

    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("!!!!!Test code!!!!! activating scene ", scenedID)

    if (localConfig.authenticatedApi)
    {
        localConfig.authenticatedApi.scenes.activateScene(scenedID)
            .then(activated =>
            {
                // need to check here if we want to use the result to update our lists or request a new set of scenes groups and process those
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log(`The Scene was successfully activated? ${activated}`);
            })
            .error((err) =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".activateScene", "Failed to activate scene:", err);
            });
    }
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".activateScene", "No connection available");
}

// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    // if we are go then set green
    if (serverConfig.PhilipsHueenabled == "on" && localConfig.status.connected && localConfig.status.paired)
        localConfig.status.color = "green";
    else if (serverConfig.PhilipsHueenabled == "off" && !localConfig.status.connected && !localConfig.status.paired)
        localConfig.status.color = "red";
    else
        localConfig.status.color = "orange";

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                localConfig.status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };

