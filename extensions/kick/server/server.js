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

import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import * as kickAPI from './kickAPIs.js';
import * as chatService from './chat.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    setClientSecretFn: null,// callback to set the client secret for the server to use when authorizing
    apiConnected: false,
    connectToChatScheduleHandle: null,
    connectToChatTimeout: 5000,

    gameSearchCategories: [],
    // use these fields to send errors in searching back to the user
    kickCategoryErrorsText: "",
    kickCategoryErrorsShowCounter: 0,
    currentKickGameCategoryId: -1, // as reported by kick
};

const default_serverConfig = {
    __version__: "0.2",
    extensionname: "kick",
    channel: "KICK_CHANNEL",
    kickEnabled: "off",
    currentCategoryId: -1,
    currentCategoryName: "none selected",
    channelData: null, // only storing this until we can get the official api returning the data. until then we are using a third party API to get the chatroom id so we store it to minimise usage of this api.
    kickCategoriesHistory: [],
    kickTitlesHistory: ["StreamRoller, the most versatile streaming tool around"],
    lastSelectedKickTitleId: -1

};
let serverConfig = structuredClone(default_serverConfig)
const default_serverCredentials =
{
    version: "0.1",
    kickApplicationClientId: "",
    kickApplicationSecret: "",
    streamerName: "",
    botName: ""
};
let serverCredentials = structuredClone(default_serverCredentials);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Demo Extension for copying and pasting to get you started faster on writing extensions",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Kick message received",
                displaytitle: "Kick Chat Message",
                description: "A chat message was received. textMessage field has name and message combined",
                messagetype: "trigger_ChatMessageReceived",
                parameters: {

                    triggerActionRef: "KickChatMessage",
                    triggerActionRef_UIDescription: "Reference for this message",
                    // streamroller settings
                    type: "",
                    platform: "Kick",
                    textMessage: "[username]: [message]",
                    safemessage: "",
                    color: "#FF0000",

                    // youtube message data
                    id: "",
                    message: "",
                    messagetype: "",
                    timestamp: -1,

                    //youtube author data
                    sender: "",
                    senderid: "",
                    senderbadges: "",
                }
            },
            {
                name: "Category search results",
                displaytitle: "Results from a SearchForKickGame request ",
                description: "Results of a search request in a JSON object",
                messagetype: "trigger_searchedKickGames",
                parameters: {

                    triggerActionRef: "KickSearchedCategories",
                    triggerActionRef_UIDescription: "Reference for this message",
                    searchName: "",
                    searchName_UIDescription: "Name that was used for the search",
                    categories: "",
                    categories_UIDescription: "JSON string object of categories",
                }
            },
            {
                name: "Category history cleared",
                displaytitle: "The Category history was cleared",
                description: "The Category history was cleared",
                messagetype: "trigger_categoryHistoryCleared",
                parameters: {
                    triggerActionRef: "KickCategoryHistoryCleared",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }
            ,
            {
                name: "Title history cleared",
                displaytitle: "The Title history was cleared",
                description: "The Title history was cleared",
                messagetype: "trigger_titleHistoryCleared",
                parameters: {
                    triggerActionRef: "KickTitleHistoryCleared",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }
        ],
    actions:
        [
            {
                name: "KickChatSendChatMessage",
                displaytitle: "Post Kick Message",
                description: "Post a message to Kick chat (Note user is case sensitive)",
                messagetype: "action_SendChatMessage",
                parameters: {
                    triggerActionRef: "KickChatMessage",
                    triggerActionRef_UIDescription: "Reference for this message",
                    account: "",
                    message: ""
                }
            },
            {
                name: "SearchForKickGame",
                displaytitle: "Search for a game category on kick",
                description: "Triggers the action trigger_searchedKickGames",
                messagetype: "action_searchForKickGame",
                parameters: {
                    triggerActionRef: "KickChatMessage",
                    triggerActionRef_UIDescription: "Reference for this message",
                    searchName: "",
                    searchName_UIDescription: "Name to search for",
                }
            },
            {
                name: "ClearCategoryHistory",
                displaytitle: "Clear Category History for kick",
                description: "Clears out the Category history list",
                messagetype: "action_clearCategoryHistory",
                parameters: {
                    triggerActionRef: "KickClearCategoryHistory",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "ClearTitleHistory",
                displaytitle: "Clear Title History for kick",
                description: "Clears out the Title history list",
                messagetype: "action_clearKickTitleHistory",
                parameters: {
                    triggerActionRef: "KickClearTitleHistory",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            }

        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * 
 * @param {string} app 
 * @param {string} host 
 * @param {string} port 
 * @param {number} heartbeat 
 */
function start (host, port, nonce, clientId, heartbeat, setClientSecretFn)
{
    try
    {
        localConfig.nonce = nonce;
        localConfig.heartBeatTimeout = heartbeat;
        localConfig.setClientSecretFn = setClientSecretFn;
        serverCredentials.kickApplicationClientId = clientId;

        // setup callbacks and data for the kick API
        kickAPI.init(updateRefreshToken);
        // only have the app id at the moment but more will be sent when received
        kickAPI.setCredentials(serverCredentials);

        // setup callbacks and data for the kick chat API
        chatService.init(onChatMessage, createDummyChatMessage);

        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);

    } catch (err)
    {
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
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
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our Credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    // Create a channel for messages to be sent out on
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout);
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * receives message from the socket
 * @param {data} server_packet 
 */
async function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data && server_packet.data.extensionname
            && server_packet.data.extensionname === serverConfig.extensionname)
        {
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
                if (serverConfig.kickEnabled == "off" && server_packet.kickEnabled == "on")
                    connectionChanged = true;
                serverConfig = structuredClone(server_packet.data);
                SaveConfigToServer();
            }
            if (connectionChanged)
                //check for reconnection required, ie extension turned on/off etc
                SendSettingsWidgetSmall();
            SendSettingsWidgetLarge();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // we have a saved credentials file
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
        {
            serverCredentials = structuredClone(server_packet.data);
            SendSettingsWidgetSmall();
            SendSettingsWidgetLarge();
        }
        else
        {
            serverCredentials = structuredClone(default_serverCredentials);
        }
        // need to send these back to the webserver level so any web auth calls will have this data
        if (serverCredentials.kickApplicationSecret && serverCredentials.kickApplicationSecret)
            localConfig.setClientSecretFn(
                serverCredentials.kickApplicationClientId,
                serverCredentials.kickApplicationSecret)

        // update the kickAPI credentials for initial call
        kickAPI.setCredentials(serverCredentials);

        // ##################### Streamer setup #############################
        if (serverCredentials.kickAccessToken)
        {
            localConfig.streamer = await kickAPI.getUser(true)
            if (localConfig.streamer && localConfig.streamer.data[0].name)
            {
                localConfig.apiConnected = true;
                serverCredentials.streamerName = localConfig.streamer.data[0].name;
                serverCredentials.userId = localConfig.streamer.data[0].user_id
                sendAccountNames();
                // update the kickAPI credentials 
                kickAPI.setCredentials(serverCredentials);
            }
            if (serverConfig.kickEnabled == "on")
            {
                // temp fix until the official api returns the chatroom id.
                // should really do this each time after initial dev is done
                // TBD PreRelease - remove if statement before release
                if (serverConfig.channelData == null)
                {
                    serverConfig.channelData = await kickAPI.getChannelData(localConfig.streamer.data[0].name)
                    SaveConfigToServer()
                }
                localConfig.kickChannel = await kickAPI.getChannel(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`);
                localConfig.kickLiveStream = await kickAPI.getLivestream(localConfig.streamer.data[0].user_id)

                connectToChatScheduler()
            }
        }

        // ##################### Bot setup #############################
        // bot doesn't need all the setup that the streamer does as we assume both are
        // working in the same channel
        if (serverCredentials.kickBotAccessToken)
        {
            localConfig.bot = await kickAPI.getUser(false)
            if (localConfig.bot.data[0].name)
            {
                serverCredentials.botName = localConfig.bot.data[0].name
                sendAccountNames();
                // update the kickAPI credentials 
                kickAPI.setCredentials(serverCredentials);
            }
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            if (extension_packet.to === serverConfig.extensionname)
                SendSettingsWidgetSmall(extension_packet.from);
        }
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
        {
            if (extension_packet.to === serverConfig.extensionname)
                SendSettingsWidgetLarge();
        }
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
                parseSettingsWidgetSmall(extension_packet.data)
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
                parseSettingsWidgetLarge(extension_packet.data)
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
        else if (extension_packet.type === "action_SendChatMessage")
        {
            if (serverConfig.kickEnabled == "on")
                kickAPI.sendChatMessage(extension_packet.data)
        }
        else if (extension_packet.type === "action_searchForKickGame")
        {
            // if we have an empty search item then just return.
            if (extension_packet.data.name == "")
                return
            localConfig.gameSearchCategories = await kickAPI.searchCategories(extension_packet.data.name);
            // this request comes from the small settings widget normally
            sendGameCategoriesSearchTrigger(extension_packet.data.triggerActionRef)
            SendSettingsWidgetSmall()
        }
        else if (extension_packet.type === "action_clearCategoryHistory")
        {
            // if we have an empty search item then just return.
            serverConfig.kickCategoriesHistory = [];
            SaveConfigToServer();
            sendGameCategoriesClearedTrigger(extension_packet.data.triggerActionRef)
            SendSettingsWidgetSmall()
        }
        else if (extension_packet.type === "action_clearKickTitleHistory")
        {
            // if we have an empty search item then just return.
            serverConfig.kickTitlesHistory = [];
            SaveConfigToServer();
            sendTitleClearedTrigger(extension_packet.data.triggerActionRef)
            SendSettingsWidgetSmall()
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);
    }
    else if (server_packet.type === "UnknownChannel")
    {
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", serverConfig.extensionname, server_packet.data
                ));
        }, 5000);
    }
    else if (server_packet.type === "ChannelData")
    {
        //not currently monitoring channel data
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

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * @param {String} [to = ""] // extension name or send to channel if not provided
 */
function SendSettingsWidgetSmall (to = "")
{
    fs.readFile(__dirname + '/kicksettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            let statusHtml = ""
            if (serverConfig.kickEnabled == "off")
                statusHtml = `<BR><div style = "color:rgb(255 255 0 / 80%)">Extension turned off</div>`
            else if (!localConfig.apiConnected)
                statusHtml = `<BR><div style = "color:rgb(255 255 0 / 80%)">Waiting for extension to get data from kick</div>`
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }
            // This code could be hardcoded but we only want to show it when the kick extensions is up and running
            if (serverConfig.kickEnabled == "off" || !localConfig.apiConnected)
            {
                modalString = modalString.replace("kickStreamTitleSelector", statusHtml);
                modalString = modalString.replace("kickGameCategorySelector", statusHtml);
                modalString = modalString.replace("kickSearchForGame", statusHtml);
            }
            else
            {
                modalString = modalString.replace("kickStreamTitleSelector", getTextboxWithHistoryHTML(
                    "kickTitleDropdownSelector",
                    "kickTitleTextElement",
                    serverConfig.kickTitlesHistory,
                    serverConfig.lastSelectedKickTitleId
                )
                    + `<button type="button" class="btn btn-secondary"  onClick="sendAction('action_clearKickTitleHistory', 'kick', {});return false;">ClearHistory</button>`);

                // add our searchable dropdown category selector
                modalString = modalString.replace("kickGameCategorySelector",
                    createDropdownWithSearchableHistory(
                        "kickGameCategoryDropdownSelector",
                        localConfig.gameSearchCategories.data,
                        serverConfig.kickCategoriesHistory,
                        serverConfig.currentCategoryId)
                    + `<button type="button" class="btn btn-secondary"  onClick="sendAction('action_clearCategoryHistory', 'kick', {});return false;">ClearHistory</button>`);
                modalString = modalString.replace("kickSearchForGame", `<input type="text" class="form-control" id="kickSearchForKickGameElementId" name="kickSearchForKickGameElementId" placeholder="Enter Game name to search for (added to history when found)"><button type="button" class="btn btn-secondary"  onClick="sendAction('action_searchForKickGame', 'kick', {name:document.getElementById('kickSearchForKickGameElementId').value});return false;">Search</button>`);
            }
            if (localConfig.kickCategoryErrorsShowCounter > 0)
            {
                localConfig.kickCategoryErrorsShowCounter--;
                modalString = modalString.replace("kickGameCategorySearchErrors",
                    "<div>" + localConfig.kickCategoryErrorsText + "</div>"
                )
            }
            else
                modalString = modalString.replace("kickGameCategorySearchErrors", "")

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
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * 
 */
function SendSettingsWidgetLarge (to = "")
{
    fs.readFile(__dirname + '/kicksettingswidgetlarge.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replace(key + "text", value);
            }
            modalString = modalString.replace("kickApplicationClientIdtext", serverCredentials.kickApplicationClientId);
            modalString = modalString.replace("kickApplicationSecrettext", serverCredentials.kickApplicationSecret);

            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
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
//                           FUNCTION: parseSettingsWidgetSmall
// ============================================================================
/**
 * 
 * @param {object} data // data from user submitted form
 */
async function parseSettingsWidgetSmall (modalData)
{
    try
    {
        let enabledStateChangedTo = null
        let DataChanged = false;
        if (modalData.kick_restore_defaults == "on")
        {
            serverConfig = structuredClone(default_serverConfig);
            console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            DataChanged = true;
        }
        else
        {
            if (serverConfig.kickEnabled != modalData.kickEnabled)
            {
                if (serverConfig.kickEnabled == "on")
                    enabledStateChangedTo = "off"
                else
                    enabledStateChangedTo = "on"
                DataChanged
            }
            // Process kick Title 
            if (modalData["kickTitleTextElement"] && modalData["kickTitleDropdownSelector"] != "")
            {
                // lets check and store the title if we don't already have it
                let historyTitleIndex = serverConfig.kickTitlesHistory.findIndex(x => x === modalData["kickTitleTextElement"]);

                // is this a new title
                if (historyTitleIndex == -1)
                {
                    DataChanged = true;
                    serverConfig.lastSelectedKickTitleId = serverConfig.kickTitlesHistory.push(modalData["kickTitleTextElement"]) - 1
                }
                // not new but changed
                else if (historyTitleIndex != serverConfig.lastSelectedKickTitleId)
                {
                    DataChanged = true
                    serverConfig.lastSelectedKickTitleId = historyTitleIndex
                }
            }
            /* Process kick Category */
            let categoryId = ""
            let categoryName = ""
            const userSelectedCategoryId = modalData["kickGameCategoryDropdownSelector"]
            if (userSelectedCategoryId)
            {
                const historyIndex = serverConfig.kickCategoriesHistory.findIndex(e => e.id == userSelectedCategoryId);
                if (historyIndex == -1)
                {
                    const game = localConfig.gameSearchCategories.data.find(item => item.id == userSelectedCategoryId);
                    categoryId = game.id;
                    categoryName = game.name;
                    addGameToHistoryFromGameName(categoryName)
                    DataChanged = true;
                }
                else
                {
                    categoryId = serverConfig.kickCategoriesHistory[historyIndex].id;
                    categoryName = serverConfig.kickCategoriesHistory[historyIndex].name;
                }
                if (serverConfig.currentCategoryId != categoryId)
                {
                    serverConfig.currentCategoryId = categoryId
                    serverConfig.currentCategoryName = categoryName
                    DataChanged = true;
                }

                if (enabledStateChangedTo != null)
                {
                    if (enabledStateChangedTo == "off")
                    {
                        serverConfig.kickEnabled = "off";
                        chatService.disconnectChat()
                    }
                    else
                    {
                        serverConfig.kickEnabled = "on";
                        connectToChatScheduler()
                    }
                    DataChanged = true;
                }
            }
            // do we need to change title on kick
            if (serverConfig.currentCategoryId && serverConfig.currentCategoryId != ""
                && serverConfig.lastSelectedKickTitleId && serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId] && serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId] != ""
                && serverConfig.kickEnabled
            )
            {
                //update stream title/description
                kickAPI.setTitleAndCategory(serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId], serverConfig.currentCategoryId)
            }
            if (DataChanged)
            {
                SaveConfigToServer();
                SendSettingsWidgetSmall("");
            }
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".parseSettingsWidgetSmall", "Error", err, err.message);
    }
}
// ============================================================================
//                           FUNCTION: connectToChatScheduler
// ============================================================================
/**
 * 
 */
function connectToChatScheduler ()
{
    clearTimeout(localConfig.connectToChatScheduleHandle)
    localConfig.connectToChatScheduleHandle = setTimeout(() =>
    {
        connectToChat()
    },
        localConfig.connectToChatTimeout
    )
}
// ============================================================================
//                           FUNCTION: connectToChat
// ============================================================================
/**
 * 
 */
async function connectToChat ()
{
    try
    {
        // temp fix until the official api returns the chatroom id.
        // should really do this each time after initial dev is done
        // TBD PreRelease - remove if statement before release
        if (serverConfig.channelData == null)
        {
            serverConfig.channelData = await kickAPI.getChannelData(localConfig.streamer.data[0].name)
            SaveConfigToServer()
        }
        localConfig.kickChannel = await kickAPI.getChannel(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`);
        localConfig.kickLiveStream = await kickAPI.getLivestream(localConfig.streamer.data[0].user_id)

        // setup chat connection for the streamer.
        chatService.connectChat(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`, localConfig.streamer.data[0].name)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".connectToChat", "Error connecting to chat", err);
    }
}
// ============================================================================
//                           FUNCTION: parseSettingsWidgetLarge
// ============================================================================
/**
 * @param {object} data // data from user submitted form
 */
function parseSettingsWidgetLarge (data)
{
    if (data.kick_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        DeleteCredentialsOnServer();
        console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
    }
    else
    {
        serverConfig.kickEnabled = "off";
        for (const [key, value] of Object.entries(data))
            if (serverConfig[key])
                serverConfig[key] = value;
        // if we have changed the client ID lets set that
        if (serverCredentials.kickApplicationClientId != data.kickApplicationClientId)
        {
            serverCredentials.kickApplicationClientId = data.kickApplicationClientId;
            kickAPI.setCredentials(serverCredentials);
            SaveCredentialToServer("kickApplicationClientId", serverCredentials.kickApplicationClientId)
        }
        // if we have changed the client ID lets set that
        if (serverCredentials.kickApplicationSecret != data.kickApplicationSecret)
        {
            serverCredentials.kickApplicationSecret = data.kickApplicationSecret;
            kickAPI.setCredentials(serverCredentials);
            SaveCredentialToServer("kickApplicationSecret", serverCredentials.kickApplicationSecret)
        }

    }

    SaveConfigToServer();
    SendSettingsWidgetLarge("");
}
// ===========================================================================
//                           FUNCTION: addGameToHistoryFromGameName
// ===========================================================================
/**
 * Adds a game by name to the history list
 * @param {string} gameName 
 */
async function addGameToHistoryFromGameName (gameName)
{
    try
    {
        // get the game index if we already have the data
        const categoryIndex = localConfig.gameSearchCategories.data.findIndex(e => e.name === gameName);
        if (categoryIndex == -1)
        {
            if (serverConfig.kickCategoriesHistory
                && serverConfig.kickCategoriesHistory.findIndex(e => e.name === gameName) > -1)
            {
                const gameObject = { id: serverConfig.kickCategoriesHistory[categoryIndex].id, name: serverConfig.kickCategoriesHistory[categoryIndex].name }
                serverConfig.kickCategoriesHistory.push(gameObject);
                localConfig.kickCategoryErrorsShowCounter = 0
                SendSettingsWidgetSmall()
            }
            else
            {
                localConfig.kickCategoryErrorsText = "Couldn't Find Game '" + gameName + "'"
                // how many reloads to keep displaying the error 
                // due to the chance of another update going out too quickly
                localConfig.kickCategoryErrorsShowCounter = 3;
                SendSettingsWidgetSmall()
            }
        }
        else
        {
            // get the game from our list
            let game = localConfig.gameSearchCategories.data[categoryIndex]
            // if not in the history already then add it.
            if (!serverConfig.kickCategoriesHistory || serverConfig.kickCategoriesHistory.findIndex(e => e.name === game.name) == -1)
            {
                serverConfig.kickCategoriesHistory.push(game);
                localConfig.kickCategoryErrorsShowCounter = 0;
            }
        }
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addGameToHistoryFromGameName", "Error fetching categories:", err, err.message);
        return null
    }
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
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Sends Credentials to the server
 */
function DeleteCredentialsOnServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "DeleteCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
            },
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Provides a heartbeat message to inform other extensions of our status
 */
function heartBeatCallback ()
{
    clearTimeout(localConfig.heartBeatHandle)
    // we can send a color for things like the liveportal page to use to show on the icon.
    let color = "red";
    let connected = localConfig.apiConnected && chatService.connected();
    // need to fix this for the bots etc, when disabled it stops teh ability to send chat message from live portal
    connected = true;
    // determine the color we wish to show for our status
    if (serverConfig.kickEnabled === "on")
    {
        if (!connected)
            color = "orange"
        else
            color = "green"
    }
    else
    {
        connected = false;
        color = "red"
    }

    // send the status message. These should be short but you can add extra data if you wish to provide status for other extension (ie obs bitrate, connection quality etc). if more than a couple of items it is recommended to setup a status message timer to send them out separately
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    connected: connected,
                    color: color,
                    botName: serverCredentials.botName,
                    streamerName: serverCredentials.streamerName,
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: SaveCredentialToServer
// ============================================================================
/**
 * Store an updated refresh token
 * @param {string} token 
 */
function updateRefreshToken (token)
{
    // dev need to check this is working. remove once seen working ok
    SaveCredentialToServer("kickAccessToken", token.kickAccessToken)
    SaveCredentialToServer("kickRefreshToken", token.kickRefreshToken)
}

// ============================================================================
//                           FUNCTION: SaveCredentialToServer
// ============================================================================
/**
 * Sends Credential to the server to be saved
 * @param {string} name 
 * @param {string} value 
 */
function SaveCredentialToServer (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
                CredentialName: name,
                CredentialValue: value,
            },
        ));
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds a trigger from the messagetype
 * @param {string} messagetype 
 * @returns {object} trigger
 */
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                     FUNCTION: postTrigger
// ============================================================================
/**
 * Posts a trigger out on our channel
 * @param {object} data 
 */
function postTrigger (data)
{
    let message = sr_api.ServerPacket(
        "ChannelData",
        serverConfig.extensionname,
        sr_api.ExtensionPacket(
            data.messagetype,
            serverConfig.extensionname,
            data,
            serverConfig.channel
        ),
        serverConfig.channel
    )
    sr_api.sendMessage(localConfig.DataCenterSocket,
        message);
}
// #######################################################################
// ######################### sanitiseHTML ################################
// #######################################################################
/**
 * Removes html chars from a string to avoid chat message html injection
 * @param {string} string 
 * @returns {string} the parsed string
 */
function sanitiseHTML (string)
{
    // sanitiser
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return String(string).replace(/[&<>"'`=\/]/g, function (s)
    {
        return entityMap[s];
    });
}
// ============================================================================
//                           FUNCTION: onChatMessage
// ============================================================================
function onChatMessage (message)
{
    try
    {
        let parsedTextMessage = message.content
        let safeMessage = message.content;
        //if (message.sender.identity.badges)
        //    console.log("DEBUG:Kick:onChatMessage sender badges", message)

        // split out emotes from messages
        const matches = [...message.content.matchAll(/\[emote:(s?)(\d+):([^\]]+)\]/g)];
        const emotes = {};
        for (const match of matches)
        {
            const fullMatch = match[0];      // full string like "[emote:s23440756:emojiFeerful]"
            const id = parseInt(match[2]);   // extract the numeric part only
            const name = match[3];           // emote name
            emotes[fullMatch] = { id: id, name: name };
        }
        // store the message ready for parsing emotes

        for (const [key, value] of Object.entries(emotes))
        {
            // add emotes to parsed message
            parsedTextMessage = parsedTextMessage.replaceAll(key, `<img src='https://files.kick.com/emotes/${value.id}/fullsize' title='${value.name}' width='28px' height='28px'>`)

            safeMessage = parsedTextMessage.replaceAll(key, "");
        }
        let triggerToSend = findTriggerByMessageType("trigger_ChatMessageReceived")
        // kick appears to sanitise source text but lets replace unicode anyway
        safeMessage = safeMessage.replace(/[^\x00-\x7F]/g, "");

        triggerToSend.parameters = {
            textMessage: parsedTextMessage,
            safemessage: safeMessage,
            color: message.sender.identity.color,// possibly use color from menu for mods etc
            category: serverConfig.currentCategoryName,
            channel: message.channel,
            // youtube message data
            id: message.id,
            messagetype: message.type,
            message: safeMessage,
            timestamp: message.created_at,
            sender: message.sender.username,
            senderid: message.sender.id,
            senderbadges: message.sender.identity.badges,
        }
        postTrigger(triggerToSend);

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".SendSettingsWidgetSmall", "failed to load modal", err);
    }
}
// ============================================================================
//                           FUNCTION: createDummyChatMessage
// ============================================================================
/**
 * Simulates a message from kick chat.
 * @param {object} data 
 */
function createDummyChatMessage (message)
{
    let dummyMessage =
    {
        "id": "1",
        "chatroom_id": 1,
        "channel": serverCredentials.streamerName,
        "content": message,
        "type": "message",
        "created_at": "2025-04-27T07:01:49+00:00",
        "sender":
        {
            "id": 1,
            "username": "System",
            "identity": { "color": "Red", "badges": [{ "type": "bot", "text": "bot" }] }
        }
    }
    onChatMessage(dummyMessage);
}

// ===========================================================================
//                           FUNCTION: sendAccountNames
// ===========================================================================
/**
 * @param {String} toExtension 
 */
function sendAccountNames (toExtension = "")
{
    // TBD create list from available names otherwise we need to supply both names
    let usrlist = {}
    let countusers = 0
    if (serverCredentials.streamerName && serverCredentials.streamerName != "")
    {
        countusers++;
        usrlist["user"] = serverCredentials.streamerName;
    }

    if (serverCredentials.botName && serverCredentials.botName != "")
    {
        countusers++;
        usrlist["bot"] = serverCredentials.botName;
    }

    if (countusers > 0)
    {
        // send the modified modal data to the server
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "UserAccountNames",
                    serverConfig.extensionname,
                    usrlist,
                    serverConfig.channel,
                    toExtension),
                serverConfig.channel,
                toExtension,

            ));
    }
}
// ============================================================================
//                           FUNCTION: sendGameCategoriesSearchTrigger
// ============================================================================
/**
 * 
 * @param {string} reference 
 * @param {string} searchName 
 */
function sendGameCategoriesSearchTrigger (reference, searchName)
{
    let trigger = findTriggerByMessageType("trigger_searchedKickGames")
    trigger.parameters.triggerActionRef = reference;
    trigger.parameters.searchName = searchName;
    trigger.parameters.categories = JSON.stringify(localConfig.gameSearchCategories.data)
    postTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: sendGameCategoriesClearedTrigger
// ============================================================================
/**
 * 
 * @param {string} reference 
 */
function sendGameCategoriesClearedTrigger (reference)
{
    let trigger = findTriggerByMessageType("trigger_categoryHistoryCleared")
    trigger.parameters.triggerActionRef = reference;
    postTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: createDropdownWithSearchableHistory
// ============================================================================
function sendTitleClearedTrigger (reference)
{
    let trigger = findTriggerByMessageType("trigger_titleHistoryCleared")
    trigger.parameters.triggerActionRef = reference;
    postTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: createDropdownWithSearchableHistory
// ============================================================================
/**
 * Creates an html dropdown list that is searchable using the given information
 * @param {string} id 
 * @param {string} categories 
 * @param {string} history 
 * @param {string} currentSelectedId 
 * @returns html string containing dropdown code
 */
function createDropdownWithSearchableHistory (id, categories = [], history = [], currentSelectedId = -1)
{
    let dropdownHtml = ""
    dropdownHtml += '<div class="d-flex-align w-100">';
    dropdownHtml += `<select class='selectpicker btn-secondary' data-style='btn-danger' style="max-width: 85%;" title='Current Game Category' id="${id}" value='${currentSelectedId}' name="${id}" required="">`
    // add history section if we have one
    if (history.length)
    {
        // add history separator
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--HISTORY--</option>'
        // Append history options first
        history.forEach(item =>
        {
            if (item.id == currentSelectedId)
                dropdownHtml += "<option value=\"" + item.id + "\" selected>" + item.name + "</option>";
            else
                dropdownHtml += "<option value=\"" + item.id + "\">" + item.name + "</option>";
        });

        // add history separator
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--SEARCH RESULTS--</option>';
    }
    else
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--Select an option--</option>'
    // check if we have loaded the categories yet
    if (serverConfig.kickEnabled == "off")
        dropdownHtml += '<option value="separator" disabled style="color:red;font-weight: bold">Extension turned off ...</option>';
    else if (!categories.length)
        dropdownHtml += '<option value="separator" disabled style="color:red;font-weight: bold">LOADING...</option>';
    // append categories
    categories.forEach(option =>
    {
        // only include if it isn't already in the history list
        if (!history.some(e => e.id === option.id))
        {
            if (option.id == currentSelectedId)
                dropdownHtml += '<option value="' + option.id + '" selected>' + option.name + '</option>';
            else
                dropdownHtml += '<option value="' + option.id + '">' + option.name + '</option>';
        }
    });
    dropdownHtml += '</select>';
    dropdownHtml += '</div>';
    return dropdownHtml;
}
// ============================================================================
//                           FUNCTION: getTextboxWithHistoryHTML
// ============================================================================
/**
 * Creates an html dropdown list on a text box is searchable using the given information
 * @param {string} SelectEleId 
 * @param {string} TextEleId 
 * @param {string} history 
 * @param {string} currentSelectedId 
 * @returns html string containing textbox code
 */
function getTextboxWithHistoryHTML (SelectEleId, TextEleId, history, currentSelectedId)
{
    let dropdownHtml = "";
    dropdownHtml += '<div class="d-flex-align w-100">';
    if (history[currentSelectedId])
        dropdownHtml += `<input type="text" class="form-control" id="${TextEleId}" name="${TextEleId}" value = "${history[currentSelectedId]}" placeholder="${history[currentSelectedId]}">`
    else
        dropdownHtml += `<input type="text" class="form-control" id="${TextEleId}" name="${TextEleId}" placeholder="Please Enter a new Title or select one from the history">`


    dropdownHtml += `<select class='selectpicker btn-secondary' data-style='btn-danger' style="max-width: 85%;" title='Current Title' id="${SelectEleId}" value='${currentSelectedId}' name="${SelectEleId}" onchange="document.getElementById('${TextEleId}').value = this.options[this.selectedIndex].text">`

    if (history.length)
    {
        history.forEach((item, i) => 
        {
            if (i == currentSelectedId)
                dropdownHtml += `<option value="` + i + `" selected >` + item + `</option>`;

            else
                dropdownHtml += `<option value="` + i + `">` + item + `</option>`;
        });
    }
    else
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--No History Available--</option>'
    dropdownHtml += '</select>';
    dropdownHtml += "</div>"

    return dropdownHtml
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { start, triggersandactions };

