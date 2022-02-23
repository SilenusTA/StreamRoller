// ############################# OBS.js ##############################
// OBS extension for controlling OBS and information on OBS
// output channel OBS_CHANNEL
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 22-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Desription: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// none
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import * as sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { config } from "./config.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
let streamlabsChannelConnectionAttempts = 0;

const serverConfig = {
    extensionname: config.EXTENSION_NAME,
    channel: config.OUR_CHANNEL,
    obsenable: "on",
    obsscene: "OBS scene to switch to"
};
const OverwriteDataCenterConfig = false;

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise(app, host, port)
{
    try
    {
        config.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".initialise", "connection failed:", err);
    }
    connectToObs();
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
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect(socket)
{
    logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
    else
        sr_api.sendMessage(config.DataCenterSocket,
            sr_api.ServerPacket("SaveConfig", config.EXTENSION_NAME, serverConfig));

    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", config.EXTENSION_NAME, config.OUR_CHANNEL)
    );

    /*sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", config.EXTENSION_NAME, "STREAMLABS_ALERT")
    );*/

}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} data 
 */
function onDataCenterMessage(data)
{
    var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        if (decoded_data.data != "" && decoded_data.to === serverConfig.extensionname)
        {
            for (const [key, value] of Object.entries(serverConfig))
                if (key in decoded_data.data)
                    serverConfig[key] = decoded_data.data[key];
            SaveConfigToServer();
        }
    }
    else if (decoded_data.type === "ExtensionMessage")
    {
        let decoded_packet = JSON.parse(decoded_data.data);
        if (decoded_packet.type === "RequestAdminModalCode")
            SendAdminModal(decoded_packet.from);
        else if (decoded_packet.type === "AdminModalData")
        {
            if (decoded_packet.extensionname === serverConfig.extensionname)
            {
                serverConfig.obsenable = "off";
                for (const [key, value] of Object.entries(decoded_packet.message_contents))
                    serverConfig[key] = value;
                SaveConfigToServer();
            }
        }
        else if (decoded_packet.type === "ChangeScene")
        {
            ChangeScene(decoded_packet.data)
        }
        else
            logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "unhandled ExtensionMessage ", decoded_data);

    }
    else if (decoded_data.type === "UnknownChannel")
    {
        if (streamlabsChannelConnectionAttempts++ < config.channelConnectionAttempts)
        {
            logger.info(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
            setTimeout(() =>
            {
                sr_api.sendMessage(config.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel", config.EXTENSION_NAME, decoded_data.data
                    ));
            }, 5000);
        }
    }    // we have received data from a channel we are listening to
    else if (decoded_data.type === "ChannelData")
    {
        logger.log(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", decoded_data.dest_channel);
    }
    else if (decoded_data.type === "InvalidMessage")
    {
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", decoded_data.data.error, decoded_data);
    }
    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(config.SYSTEM_LOGGING_TAG + config.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.data.error);
}

// ===========================================================================
//                           FUNCTION: SendOBSControlModal
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendOBSControlModal(tochannel)
{
    // read our modal file
    fs.readFile(__dirname + '/obsadminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
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
// ===========================================================================
//                           FUNCTION: SendAdminModal
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
    fs.readFile(__dirname + '/obsadminmodal.html', function (err, filedata)
    {
        if (err)
            throw err;
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
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

function ChangeScene(scene)
{
    console.log("changing scene ", scene)
    obs.send('SetCurrentScene', {
        'scene-name': scene
    }).catch((err) =>
    {
        console.log("OBS Changescene failed ", err)
    }

    )

}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            config.EXTENSION_NAME,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: SceneChanged
// ============================================================================
function SceneChanged(scene)
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                {
                    type: "SceneChanged",
                    scene: scene.sceneName
                },
                config.OUR_CHANNEL
            ));
}
// ============================================================================
//                           FUNCTION: StreamStopped
// ============================================================================
function StreamStopped(data)
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                {
                    type: "StreamStopped",
                    scene: data
                },
                config.OUR_CHANNEL
            ));
}
// ============================================================================
//                           FUNCTION: StreamStarted
// ============================================================================
function StreamStarted(data)
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                {
                    type: "StreamStarted",
                    scene: data
                },
                config.OUR_CHANNEL
            ));
}
// ============================================================================
//                           FUNCTION: OBSScenes
// ============================================================================
function OBSScenes(data)
{
    //console.log(data)
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(config.DataCenterSocket,
        sr_api.ServerPacket
            ("ChannelData",
                config.EXTENSION_NAME,
                {
                    type: "OBSScenes",
                    scene: data
                },
                config.OUR_CHANNEL
            ));
}
// ############################################################################
// ============================================================================
//                             OBS functionality
// ============================================================================
// ############################################################################
import OBSWebSocket from "obs-websocket-js";
//let obs = null;

function connectToObs()
{ }
const obs = new OBSWebSocket();
obs.connect({
    address: 'localhost:4445',
    password: 'pass'
}).then(() =>
{
    console.log(`Success! We're connected & authenticated.`);

    return obs.send('GetSceneList');
}).then((data) =>
{
    //console.log(data);
    OBSScenes(data);
})

obs.on("SceneList", data =>
{
    console.log(data);
});

obs.on('SwitchScenes', data =>
{
    console.log('New Active Scene: ', data.sceneName);
    SceneChanged(data)
});

obs.on('StreamStarted', data =>
{
    //console.log('StreamStarted: ', data);
    StreamStarted(data)
});

obs.on('StreamStopped', data =>
{
    //console.log('StreamStopped: ', data);
    StreamStopped(data)
});





























// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
