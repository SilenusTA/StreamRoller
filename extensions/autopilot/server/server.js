/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";
import { default_serverData } from "./default_data.js"

const localConfig = {
    host: "http://localhost",
    port: "3000",
    heartBeatHandle: null,
    heartBeatTimeout: "5000",
    DataCenterSocket: null,
}
// defaults for the serverConfig (our saved persistant data)
const default_serverConfig = {
    __version__: "0.1.1",
    extensionname: "autopilot",
    channel: "AUTOPILOT_BE",
    autopilotenabled: "on",
    autopilotresetdefaults: "off"
}
let serverConfig = structuredClone(default_serverConfig);
let serverData = structuredClone(default_serverData);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Autopilot handles triggers/actions that allow the user to perform interesting interactions betewen extensions",
    // these are messages we can send out that other extensions might want to use to trigger an action
    version: "0.1.1",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Macro Triggered",
                displaytitle: "Macro Triggered",
                description: "A Macro was triggered",
                messagetype: "trigger_MacroTriggered",
                parameters: {}
            },
            {
                name: "AllTriggers",
                displaytitle: "AllTriggers",
                description: "Catches all triggers (for debugging)",
                messagetype: "trigger_AllTriggers",
                parameters: {}
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "Activate Macro",
                displaytitle: "Activate Macro",
                description: "Activate a macro function",
                messagetype: "action_ActivateMacro",
                parameters: { name: "" }
            },
            {
                name: "Set Group Pause State",
                displaytitle: "Set Group Pause State",
                description: "Pause/Unpause groups",
                messagetype: "action_SetGroupPauseState",
                parameters: {
                    group: "",
                    state: "unpaused"
                }
            },
            {
                name: "LogToConsole",
                displaytitle: "LogToConsole",
                description: "Log triggers to console",
                messagetype: "action_LogToConsole",
                parameters: {}
            },
        ],
}
// ============================================================================
//                           FUNCTION: startClient
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {String} host 
 * @param {Number} port 
 * @param {Number} heartbeat 
 */
async function startServer (host, port, heartbeat)
{
    // setup the express app that will handle client side page requests
    //app.use("/images/", express.static(__dirname + '/public/images'));
    localConfig.host = host;
    localConfig.port = port;
    try
    {
        ConnectToDataCenter(localConfig.host, localConfig.port);
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + "autopilot.startServer", "initialise failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: ConnectToDataCenter
// ============================================================================
/**
 * Connect to the StreamRoller websocket
 * @param {string} host 
 * @param {number} port 
 */
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
    } catch (err)
    {
        logger.err(serverConfig.extensionname + "datahandler.initialise", "DataCenterSocket connection failed:", err);
    }
}
/**
 * Called when the StreamRoller websocket disconnects
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * Called when the StreaRoller websocket connection starts
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestConfig",
            serverConfig.extensionname
        ));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestData",
            serverConfig.extensionname
        ));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    RequestExtList();
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Handles all streamroller inbound messages
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CONFIG
    // -------------------------------------------------------------------------------------------------
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname
                    + " ConfigFile Updated", "The config file has been Updated to the latest version v"
                    + default_serverConfig.__version__ + ". Your settings may have changed " + "\x1b[0m");
            }
            else
            {
                // update our config
                if (server_packet.data != "")
                    serverConfig = structuredClone(server_packet.data)
            }
            // update server log, mainly here if we have added new default options when a user
            // updates their version of StreamRoller
            SaveConfigToServer();
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                   RECEIVED DATA File
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverData.__version__)
            {
                serverData = structuredClone(default_serverData);
                console.log("\x1b[31m" + serverConfig.extensionname + " Datafile Updated", "The Data file has been Updated to the latest version v" + default_serverData.__version__ + ". Your settings may have changed" + "\x1b[0m");
                SaveDataToServer()
                SendUserPairings("");
                SendMacros()
            }
            else
            {
                if (server_packet.data != "")
                {
                    serverData = structuredClone(server_packet.data);
                    SendUserPairings("");
                    SendMacros()
                }
            }
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                   RECEIVED EXTENSION LIST
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionList")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            localConfig.extensions = server_packet.data
            RequestChList();
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                  RECEIVED CHANNEL LIST
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ChannelList")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            localConfig.channels = server_packet.data
            localConfig.channels.forEach(element =>
            {
                if (element != serverConfig.channel)
                    sr_api.sendMessage(localConfig.DataCenterSocket,
                        sr_api.ServerPacket(
                            "JoinChannel",
                            serverConfig.extensionname,
                            element
                        ));
            });
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                      ### EXTENSION MESSAGE ###
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR SETTINGS DIALOG
        // -------------------------------------------------------------------------------------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            SendSettingsWidgetSmall(extension_packet.from);
        }
        else if (extension_packet.type.startsWith("action_LogToConsole"))
        {
            console.log("--------- action_LogToConsole -------------")
            console.log(JSON.stringify(extension_packet.data, null, 2))
            console.log("-------------------------------------------")
        }
        else if (extension_packet.type.startsWith("action_ActivateMacro"))
        {
            if (extension_packet.to == serverConfig.extensionname)
                triggerMacroButton(extension_packet.data.name)
        }

        else if (extension_packet.type.startsWith("action_SetGroupPauseState"))
        {
            if (extension_packet.to == serverConfig.extensionname)
                actionAction_SetGroupPauseState(extension_packet.data.group, extension_packet.data.state)
        }
        // -------------------------------------------------------------------------------------------------
        //                   SETTINGS DIALOG DATA
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.autopilotresetdefaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    serverData = structuredClone(default_serverData);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Defaults restored", "The config files have been reset. Your settings may have changed" + "\x1b[0m");
                    SaveConfigToServer();
                    SaveDataToServer();
                }
                else
                {
                    handleSettingsWidgetSmallData(extension_packet.data);
                    SendUserPairings("");
                    SendMacros();
                    SaveConfigToServer();
                }
            }
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -------------------------------------------------------------------------------------------------
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
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "RequestUserTriggers")
        {
            SendUserPairings(extension_packet.from)
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "RequestMacroImages")
        {
            SendMacroImages(extension_packet.from)
        }
        // -------------------------------------------------------------------------------------------------
        //                   UPDATED USER PAIRINGS RECEIVED
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "UpdateUserPairings")
        {
            if (server_packet.to === serverConfig.extensionname)
            {
                ProcessUserPairings(extension_packet.data)
                SaveDataToServer()
                SendUserPairings("");
                SendMacros()
            }
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST MACROS
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "RequestMacros")
        {
            if (server_packet.to === serverConfig.extensionname)
                SendMacros()
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST SERVER DATA FILE
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "RequestServerDataFile")
        {
            //This is used on the front end so users can save off a full data file of the server prior to updating

            if (server_packet.to === serverConfig.extensionname && server_packet.from === "autopilot_frontend")
            {

                sr_api.sendMessage(
                    localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "ExtensionMessage",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "AutopilotServerData",
                            serverConfig.extensionname,
                            serverData,
                            "",
                            "autopilot_frontend"
                        ),
                        "",
                        "autopilot_frontend"
                    ));
            }
        }
        // -------------------------------------------------------------------------------------------------
        //                   REQUEST SERVER DATA FILE
        // -------------------------------------------------------------------------------------------------
        else if (extension_packet.type === "userRequestSaveDataFile")
        {
            //This is used on the front end so users can save off a full data file of the server prior to updating

            if (server_packet.to === serverConfig.extensionname && server_packet.from === "autopilot_frontend")
            {
                parseUserRequestSaveDataFile(extension_packet.data)
            }
        }
        // -------------------------------------------------------------------------------------------------
        //                   RECEIVED Unhandled extension message
        // -------------------------------------------------------------------------------------------------
        else
        {
            //console.log("ExtensionMessage not handled ", extension_packet)
            //    logger.log(serverConfig.extensionname + ".onDataCenterMessage", "ExtensionMessage not handled ", extension_packet.type, " from ", extension_packet.from);
        }
    }

    // -------------------------------------------------------------------------------------------------
    //                   RECEIVED CHANNEL DATA
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        // -------------------------------------------------------------------------------------------------
        //                           CheckForTrigger
        //                   These are triggers in other extensions
        // -------------------------------------------------------------------------------------------------
        if (extension_packet.type.startsWith("trigger_"))
        {
            CheckTriggers(extension_packet)
        }
    }
    // -------------------------------------------------------------------------------------------------
    //                           UNKNOWN CHANNEL MESSAGE RECEIVED
    // -------------------------------------------------------------------------------------------------
    else if (server_packet.type === "UnknownChannel")
    {
        // channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        console.log("UnknownChannel", server_packet)

        if (server_packet.data != "" && server_packet.channel != undefined)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        serverConfig.extensionname,
                        server_packet.data
                    ));
            }, 10000);

        }
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "HeartBeat"
        || server_packet.type === "UnknownExtension"
        || server_packet.type === "ChannelJoined"
        || server_packet.type === "LoggingLevel"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled message type:", server_packet);

}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Saves our config on the server
 */
function SaveConfigToServer ()
{
    // saves our serverConfig to the server so we can load it again next time we startup
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig,
        ));
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Sends our small settins widget to the given channel 
 * 
 * @param {string} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
{
    fs.readFile(__dirname + "/autopilotsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
            //throw err;
        }
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();

            // mormal replaces
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
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
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
/**
 * Handles data sent when a user submits our small setting dialog box
 * @param {object} modalcode 
 */
function handleSettingsWidgetSmallData (modalcode)
{
    serverConfig.autopilotenabled = "off";
    serverConfig.autopilotresetdefaults = "off";
    for (const [key, value] of Object.entries(modalcode))
        serverConfig[key] = value;
}
// ============================================================================
//                           FUNCTION: CheckTriggers
// ============================================================================
/**
 * Handles received triggers checking if we have any matching trigger/action pairs
 * @param {object} data 
 */
function CheckTriggers (data)
{
    if (Object.keys(serverData.userPairings).length != 0 && serverData.userPairings.pairings != undefined)
    {
        for (const [key, value] of Object.entries(serverData.userPairings.pairings))
        {
            //console.log("value.trigger.messagetype", value.trigger.messagetype)
            if (value.trigger.messagetype == data.data.messagetype || value.trigger.messagetype == "trigger_AllTriggers")
                ProcessReceivedTrigger(value, data)
        }
    }
}
// ============================================================================
//                           FUNCTION: ProcessReceivedTrigger
// ============================================================================
/**
 * Processes a triger action pairing that has been triggered.
 * @param {object} pairing 
 * @param {object} receivedTrigger 
 */
function ProcessReceivedTrigger (pairing, receivedTrigger)
{
    //check if the event fields match the trigger fields we have set for this entry

    // if parameters are entered we need to check that they all match
    // before we trigger the action (ie if one fails to match then we must ignore this trigger)
    // IE ALL CHECKS BELOW SHOULD BE FOR FAILURES TO MATCH
    let match = true
    // we have the correct extension, channel and message type
    // lets check the variables to see if those are a match
    pairing.trigger.data.forEach((param) =>
    {
        for (var i in param)
        {
            try
            {
                // don't check the MATCHER variables as these are used to determine how to perform the match (Start of line etc)
                if (i.indexOf("MATCHER_") != 0 && i != "cooldown" && i != "lastrun")
                {
                    // get the relevant matcher for this value
                    let searchtype = param["MATCHER_" + i]
                    if (typeof (receivedTrigger.data.parameters[i]) == "string")// && typeof param[i] === "string")
                    {
                        switch (searchtype)
                        {
                            case "2"://match anywhere
                                if (param[i] != "" && receivedTrigger.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) == -1)
                                    match = false;
                                break;
                            case "3"://match start of line only
                                if (param[i] != "" && receivedTrigger.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) != 0)
                                    match = false;
                                break;
                            case "4"://doesn't match
                                if (param[i] != "" && receivedTrigger.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) == 0)
                                    match = false;
                                break;
                            case "5"://match complete word only
                                if (param[i] != "" && receivedTrigger.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) == -1)
                                {
                                    match = false;
                                }
                                else
                                {
                                    let wordArray = receivedTrigger.data.parameters[i].split(" ")
                                    match = false;
                                    if (wordArray.includes(param[i]))
                                        match = true;
                                }
                                break;
                            default:
                                // check for exact match
                                if (param[i] != "" && receivedTrigger.data.parameters[i].toLowerCase() != param[i].toLowerCase())
                                    match = false;
                        }
                    }
                    //check non string types for not matching
                    else if (param[i] != "" && receivedTrigger.data.parameters[i] != param[i])
                        match = false;
                }
            }
            catch (err)
            {
                console.log("ProcessReceivedTrigger ERROR", pairing.trigger.data)
                console.log("ProcessReceivedTrigger error", err)
                match = false;
            }
            if (!match)
                break;
        }

    })
    if (match)
    {
        // if we have a cooldown see if we have matched it
        if (pairing.trigger.cooldown > 0)
        {
            const d = new Date();
            let now = d.getTime()
            // are we still in the the cooldown period
            if (pairing.trigger.lastrun + (pairing.trigger.cooldown * 1000) > now)
                return
            else
                pairing.trigger.lastrun = now
        }
        TriggerAction(pairing.action, receivedTrigger)
    }

}
// ============================================================================
//                           FUNCTION: TriggerAction
// ============================================================================
/**
 * Causes an action to be triggered.
 * @param {object} action action to be triggered
 * @param {object} triggerParams received trigger parameters
 * @returns 
 */
function TriggerAction (action, triggerParams)
{
    if (action.paused)
        return
    if (serverConfig.autopilotenabled != "on")
    {
        console.log("autopilot turned off, ignoring triggers")
        return;
    }
    // regular expression to test if input is a mathmatical equasion
    // note this seems to get confused if a string has -1 in it.
    // BUG::: need a better regex
    const re = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
    // tests to get round the bug above
    const bannedRegex = ["process", "system", "for", "while", "loop"];

    let params = {}
    // store the trigger params in the action in case the extension has use for them
    params.triggerparams = triggerParams.data
    // loop through each action field
    for (var i in action.data)
    {
        //loop through each action field name
        for (const property in action.data[i])
        {
            // store the undmodifed field data
            let tempAction = action.data[i][property]
            // *************************
            // check for user variables
            // we need a better way to do this. messy code
            // *************************
            // check if we have %%var%% in the field
            let nextVarIndex = action.data[i][property].indexOf("%%")
            // loop through all %%vars%%
            while (nextVarIndex > -1)
            {
                let endVarIndex = tempAction.indexOf("%%", nextVarIndex + 2)
                // we have a user variable
                if (endVarIndex > -1)
                {
                    // get the full variable
                    let sourceVar = tempAction.substr(nextVarIndex + 2, endVarIndex - (nextVarIndex + 2))
                    // at this point we will have either (example uses the message field and word number 2)
                    // message, 
                    // message:2 
                    // message:2*
                    // check if we have a word number option 
                    if (sourceVar.indexOf(":") > -1)
                    {
                        // get the position of the :
                        let stringIndex = sourceVar.indexOf(":")
                        // get the number the user entered after the : (minus one as non programmers don't count from 0 :P)
                        // (note currently only works with 1 digit so 0-9 words can be selected)
                        let wordNumber = (sourceVar.substr(stringIndex + 1, 1)) - 1
                        // check if we have the *
                        if ((sourceVar.substr(stringIndex + 2) == "*"))
                        {
                            // get the trigger field (ie the named variable data)
                            let sourceData = triggerParams.data.parameters[tempAction.substr(nextVarIndex + 2, stringIndex)]
                            sourceData.replaceAll("%%", "")
                            const sourceArray = sourceData.split(" ");
                            // remove the first number of words the user specified
                            for (var x = 0; x < wordNumber; x++)
                                sourceArray.splice(0, 1)
                            tempAction = sourceArray.join(" ").trim()
                        }
                        else
                        {
                            // get the trigger field (ie the named variable data)
                            let sourceData = triggerParams.data.parameters[tempAction.substr(nextVarIndex + 2, stringIndex)]
                            sourceData.replaceAll("%%", "")
                            // split the data into an array so we can index the work the user wants
                            const sourceArray = sourceData.split(" ");
                            tempAction = sourceArray[wordNumber]
                        }
                    }
                    else
                    {
                        let tmpData = triggerParams.data.parameters[sourceVar]
                        if (typeof triggerParams.data.parameters[sourceVar] == "string")
                            tmpData = tmpData.replaceAll("%%", "")
                        tempAction = tempAction.replace("%%" + sourceVar + "%%", tmpData)
                    }
                }
                if (typeof tempAction == "string")
                    nextVarIndex = tempAction.indexOf("%%", nextVarIndex + 2)
                else
                    nextVarIndex = -1;

            }
            // is this a mathmatical expression
            if (re.test(tempAction) && !bannedRegex.includes(tempAction))
            {
                try
                {
                    tempAction = eval(tempAction).toString()
                }
                catch (err)
                {
                    // this is for when the regex fails and we try to eval a string
                    tempAction = tempAction.toString()
                }
            }
            params[property] = tempAction
        }
    }
    // all actions are handled through the SR socket interface
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                action.messagetype,
                serverConfig.extensionname,
                params,
                "",
                action.extension),
            "",
            action.extension
        ),
    );
}
// ============================================================================
//                           FUNCTION: ProcessUserPairings
// ============================================================================
/**
 * Updates our userPairings array with the date received from the frontend webpage
 * when a user changes/adds a new item
 * @param {object} userPairings 
 */
function ProcessUserPairings (userPairings)
{
    if (userPairings != null
        && typeof (userPairings) != "undefined"
        && userPairings != ""
        && Object.keys(userPairings).length != 0)
    {
        serverData.userPairings = structuredClone(userPairings);
    }
    else
        logger.err(serverConfig.extensionname + ".ProcessUserPairings", "empty userPairings received");
}
// ============================================================================
//                           FUNCTION: RequestExtList
// ============================================================================
/**
 * Requests a list of extensions connected from the server
 */
function RequestExtList ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestExtensionsList",
            serverConfig.extensionname,
        ));
}
/**
 * Requests a channel list from the server
 */
// ============================================================================
//                           FUNCTION: RequestChList
// ============================================================================
function RequestChList ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "RequestChannelsList",
            serverConfig.extensionname,
        ));
}
// ============================================================================
//                           FUNCTION: SendUserPairings
// ============================================================================
/**
 * Sends our user pairing lists to the given extension or broadcasts if we have 
 * just made a change and want to let everyone know
 * @param {string} to 
 */
function SendUserPairings (to)
{
    if (to != "")
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "UserPairings",
                    serverConfig.extensionname,
                    serverData.userPairings,
                    serverConfig.channel,
                    to),
                serverConfig.channel,
                to
            ),
        );
    else
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "UserPairings",
                    serverConfig.extensionname,
                    serverData.userPairings,
                    serverConfig.channel,
                    to),
                serverConfig.channel,
                to
            ),
        );
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
/**
 * Save our data JSON to the server
 */
function SaveDataToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveData",
            serverConfig.extensionname,
            serverData));
}
// ============================================================================
//                           FUNCTION: SendMacros
// ============================================================================
/**
 * Sends out the current list of marcos
 */
function SendMacros ()
{
    if (serverData.userPairings.macrotriggers != undefined)
    {
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "UserMacros",
                    serverConfig.extensionname,
                    serverData.userPairings.macrotriggers.triggers,
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
}
// ============================================================================
//                           FUNCTION: SendMacroImages
// ============================================================================
/**
 * Sends out the current list of macro images the user can chose from
 * @param {string} to
 */
function SendMacroImages (to)
{
    let imagelist = fs.readdirSync(__dirname + "/../public/images/deckicons")
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "MacroImages",
                serverConfig.extensionname,
                imagelist,
                "",
                to),
            "",
            to
        ),
    );
}
// ============================================================================
//                           FUNCTION: actionAction_SetGroupPauseState
// ============================================================================
/**
 * Handles the paused state actions to pause/unpause a trigger action pair
 * @param {string} group group to toggle
 * @param {string} state state to move to
 */
function actionAction_SetGroupPauseState (group, state)
{
    if (Object.keys(serverData.userPairings).length != 0 && serverData.userPairings.pairings != undefined)
    {
        for (const [key, value] of Object.entries(serverData.userPairings.pairings))
        {
            //console.log("value.trigger.messagetype", value.trigger.messagetype)
            if (value.group == group)
            {
                if (state == "paused")
                    value.action.paused = true;
                else if (state == "unpaused")
                    value.action.paused = false;
                else
                    logger.err(serverConfig.extensionname + ".actionAction_SetGroupPauseState", "group pause should be 'paused' or 'unpaused'. State was set to", state);
            }
        }
    }
    SaveDataToServer();
    SendUserPairings("");
    SendMacros()
}
// ============================================================================
//                           FUNCTION: triggerMacroButton
// ============================================================================
/**
 * Triggers the given actions mapped to a macro button trigger
 * @param {string} name 
 */
function triggerMacroButton (name)
{
    for (var i in serverData.userPairings.pairings)
    {
        if (serverData.userPairings.pairings[i].trigger.name == name)
        {
            let params = {}
            for (var j in serverData.userPairings.pairings[i].action.data)
            {
                for (const property in serverData.userPairings.pairings[i].action.data[j])
                    params[property] = serverData.userPairings.pairings[i].action.data[j][property]
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        serverData.userPairings.pairings[i].action.messagetype,
                        serverConfig.extensionname,
                        params,
                        "",
                        serverData.userPairings.pairings[i].action.extension),
                    "",
                    serverData.userPairings.pairings[i].action.extension
                ),
            );
        }
    }

}
// ============================================================================
//                           FUNCTION: parseUserRequestSaveDataFile
// ============================================================================
/**
 * Handles a 'userRequestSaveDataFile' message triggered when a user uploads a new
 * JSON data file containing the trigger/action pairings
 * @param {object} data 
 */
function parseUserRequestSaveDataFile (data)
{
    //do something with the file. ie check version etc.
    let response = "No Response from Server, please try again.";
    try
    {
        if (data.__version__ === default_serverData.__version__)
        {
            // overwrite our data and save it to the server.
            serverData = structuredClone(data);
            SaveDataToServer()//we have the same version of the file so we should save it over our current one.
            response = "Data saved."
        }
        else

            response = "received file version doesn't match current version: " + data.__version__ + " == " + default_serverData.__version__
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + ".parseUserRequestSaveDataFile", "Error saving data to server.Error:", err, err.message);
        response = "Error saving data to server.Error:", err, err.message;
    }
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "AutopilotUserSaveServerDataResponse",
                serverConfig.extensionname,
                { response: response },
                "",
                "autopilot_frontend"
            ),
            "",
            "autopilot_frontend"
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out our heartbeat message so others can monitor the extensions status
 */
function heartBeatCallback ()
{
    let status = false;
    if (serverConfig.autopilotenabled == "on")
        status = true;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: status },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
export { startServer, triggersandactions };