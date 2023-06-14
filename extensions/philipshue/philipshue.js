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
    __version__: 0.2,
    extensionname: "philipshue",
    channel: "PHILIPSHUE_CHANNEL",
    // sesttings dialog variables
    PhilipsHueenabled: "off",
    PhilipsHuePair: "off",
    philipshue_restore_defaults: "off",
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
                serverConfig = structuredClone(default_serverConfig);
            else
                serverConfig = structuredClone(server_packet.data);
        }
        SaveConfigToServer();
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            localCredentials = server_packet.data;
            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Received credentialsfile, initialising hub")
            initialiseHue()
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
                if (extension_packet.data.philipshue_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                }
                else
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
                        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Received Settings Data, User requested pairing")
                        serverConfig.PhilipsHuePair = "off";
                        initialiseHue(true);
                    }
                    else
                    {
                        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Received Settings Data, Updating data from bridge and sending them out")
                        // update our scenes
                        UpdateHueData()
                        processScenes()
                        outputScenes()
                    }
                    SaveConfigToServer();
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                }
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
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Received a request for scenes, Updating scene lists and sending them out")
                UpdateHueData()
                processScenes()
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
    Object.keys(localCredentials).forEach(key =>
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "UpdateCredentials",
                serverConfig.extensionname,
                {
                    ExtensionName: serverConfig.extensionname,
                    CredentialName: key,
                    CredentialValue: localCredentials[key]
                },
            ));

    });
}

// ============================================================================
// ============================================================================
//                           PHILIPS HUE FUNCTIONALITY
// ============================================================================
// ============================================================================

// ============================================================================
//                           FUNCTION: initialiseHue
// ============================================================================
async function initialiseHue (force_paring = false)
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("initialiseHue()")
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("initialiseHue: Starting up bridge")
    await connectToHub(force_paring);
    await UpdateHueData();
    processScenes();
    outputScenes();

}

// ============================================================================
//                           FUNCTION: connectToHub
// ============================================================================
async function connectToHub (perform_pairing = false)
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("connectToHub()")
    if (serverConfig.DEBUGGING_DATA) 
    {
        console.log("connectToHub:using debugging dataset")
        return;
    }
    if (serverConfig.PhilipsHueenabled == "off")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".gepairtHubs", "Attempting to pair when extension is turned off in settings")
        return;
    }
    // ############################ PAIRING - If Needed or Requested ############################
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") 
    {
        console.log("Testing we have credentials to see if we need to make a pairing call")
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        console.log("localCredentials.ipaddress", localCredentials.ipaddress)
        console.log("localCredentials.username", localCredentials.username)
        console.log("localCredentials.clientkey", localCredentials.clientkey)
        console.log("perform_pairing", perform_pairing)
        console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    }
    if (localCredentials.ipaddress == null || localCredentials.username == null || localCredentials.clientkey == null || perform_pairing)
    {
        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Pairing required")
        localConfig.status.paired = false;
        localConfig.status.connected = false;
        await pair();
    }
    else
        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Pairing NOT required")

    try
    {
        // ################################ CONNECT TO THE HUB ##########################################
        // Create a new API instance that is authenticated 

        localConfig.authenticatedApi = await HueAPI.v3.api.createLocal(localCredentials.ipaddress).connect(localCredentials.username);

        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("connectToHub: authenticatedApi succeeded")

        // Do something with the authenticated user/api
        // we get the bridge config as it is a good test and might be useful later
        localConfig.bridgeConfig = await localConfig.authenticatedApi.configuration.getConfiguration();
        if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log('connectToHub: bridgeConfig succeeded ');

        // safe to assume we are connected if we haven't thrown any errors at this point
        localConfig.status.paired = true;
        localConfig.status.connected = true;

    }
    catch (err)
    {
        localConfig.status.connected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectToHub", "authenticatedApi failed", err.message);
    }
}
// ============================================================================
//                           FUNCTION: pair
// ============================================================================
async function pair ()
{

    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("pair()")
    let createdUser = null;
    let unauthenticatedApi = null;
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("------------- pair --------------")
    if (serverConfig.PhilipsHueenabled == "off")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".gepairtHubs", "Attempting to pair when extension is turned off in settings")
        return;
    }
    // get the bridge address if we don't have it already
    if (localCredentials.ipaddress == null)
        await discoverBridge_nupnp();

    // check that we managed to get an address
    if (localCredentials.ipaddress == null)
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
            console.log('pair: *******************************************************************************\n');
            createdUser = await unauthenticatedApi.users.createUser('StreamRoller', "GodLikeStreamer");
            console.log('pair: User has been created on the Hue Bridge ');
            console.log(`pair: User: ${createdUser.username}`);
            console.log('pair: *******************************************************************************\n');

            // store the credentials for future use. Don't want the user to have to find their hub and press a button every time they start up StreamRoller
            localCredentials.username = createdUser.username;
            localCredentials.clientkey = createdUser.clientkey;
            UpdateCredentials();
            localConfig.status.paired = true;
        } catch (err)
        {
            localConfig.status.paired = false;
            localConfig.status.connected = false;
            localCredentials.username = null;
            localCredentials.clientkey = null;
            if (err.getHueErrorType && err.getHueErrorType() === 101)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pair", "The Link button on the bridge was not pressed. Please press the Link button and try again.", err);
            else
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".pair", "Unexpected Error while creating user (linking with bridge):", err.message);
        }
    }
}
// ============================================================================
//                           FUNCTION: discoverBridge
// ============================================================================
async function discoverBridge_nupnp ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge_nupnp()")
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("------------- discoverBridge_nupnp --------------")
    let discoveryResults = null;
    try
    {
        discoveryResults = await HueAPI.v3.discovery.nupnpSearch();
        if (discoveryResults.length === 0)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge_nupnp", "failed to locate any Philips Hue Bridges", discoveryResults);
        } else
        {
            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge_nupnp: discoveryResults ", discoveryResults);
            // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
            localCredentials.ipaddress = discoveryResults[0].ipaddress
        }
    }
    catch (error)
    {
        if (error.message.includes(429))
        {

            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge_nupnp", "hit meethue.com limit trying slow discovery. error was:", error.message);
            discoverBridge_upnp(5000); // 10 second timeout
        }
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge_nupnp", "nupnpSearch error", error.message);
    }
}

// ============================================================================
//                           FUNCTION: getBridge
// ============================================================================
async function discoverBridge_upnp (timeout)
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge_upnp()")
    let discoveryResults = [];
    try
    {
        discoveryResults = await HueAPI.v3.discovery.upnpSearch(timeout);
        if (discoveryResults.length === 0)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge_upnp", "failed to locate any Philips Hue Bridges", discoveryResults);
        } else
        {
            if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("discoverBridge_upnp: discoveryResults succeeded");
            // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
            localCredentials.ipaddress = discoveryResults[0].ipaddress
        }
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discoverBridge_upnp", "nupnpSearch error", error.message);
        // Results will be an array of bridges that were found
    }
}


// ============================================================================
//                           FUNCTION: UpdateHueData
// ============================================================================
async function UpdateHueData ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("UpdateHueData()")
    await getAllScenes()
    //await getAllGroups()

}
// ============================================================================
//                           FUNCTION: getAllScenes
// ============================================================================
async function getAllScenes ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("getAllScenes()")
    try
    {
        if (serverConfig.PhilipsHueenabled == "on")
        {
            // test code as I have no other way of testing it
            if (serverConfig.DEBUGGING_DATA)
            {
                // as I don't have a philips hue bridge to test I have to use test data
                // load a scenes list from file
                console.log("!!!!!Test code!!!!! getAllScenes returning test data")
                localConfig.allScenes = JSON.parse(fs.readFileSync(__dirname + '/debug_only_testing/DATA_allScenes.js', 'utf8'));

                localConfig.allScenesSRAPIData = [];
                localConfig.allScenes.forEach(element =>
                {
                    if (element._data.recycle == false)
                    {
                        localConfig.allScenesSRAPIData.push({
                            id: element._data.id,
                            name: element._data.name,
                            group: element._data.group,
                            active: false
                        })
                    }
                });
                localConfig.status.paired = true;
                outputScenes();

                return
            }

            // check we have an api to talk to
            if (localConfig.authenticatedApi != null)
            {
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log('getAllScenes: requesting scenes ');
                // request all scenes
                localConfig.allScenes = await localConfig.authenticatedApi.scenes.getAll()

                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("getAllScenes: Received a scenes list")

                // we don't want to be pushing all this data around all the time
                // so we cut it down here to only stuff extensions are interested in
                localConfig.allScenesSRAPIData = [];
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
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("getAllScenes: Done getting scenes")
                // safe to assume we are connected and paired at at this point
                localConfig.status.paired = true;
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
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("getAllGroups()")
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
            if (localConfig.authenticatedApi != null)
            {
                localConfig.allGroups = await localConfig.authenticatedApi.groups.getAll()

                //process group code here

                // output groups so we can get a look at what kind of data we are dealing with
                // these will hopefully allow us to indicate which scenes are 'on' on the live portal
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Outputting groups")
                if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log(localConfig.allGroups)

                localConfig.status.connected = true;
                localConfig.status.paired = true;
            }
            else
            {
                localConfig.status.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllGroups", "Cant get groups, Have you paired to the hub");
            }
        }
    }
    catch (error)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllGroups", "Error returned:", error.message);
    }

}
// ============================================================================
//                           FUNCTION: processScenes
// This function will go through the scenes and mark them as on, on_part, or off
// ============================================================================
function processScenes ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("processScenes()")
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("Process scenes TBD")
}
// ============================================================================
//                           FUNCTION: outputScenes
// ============================================================================
function outputScenes ()
{
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("outputScenes()")
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
    if (serverConfig.PHILIPS_HUE_DEBUG == "on") console.log("activateScene()")
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

