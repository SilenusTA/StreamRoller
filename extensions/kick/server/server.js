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
import * as chatService from './chat.js';
import * as kickAPI from './kickAPIs.js';

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

    userLiveStreamSchedulerHandle: null,
    userLiveStreamSchedulerTimeout: 300000,//5mins
    botLiveStreamSchedulerHandle: null,
    botLiveStreamSchedulerTimeout: 1200000,//20mins
    updateCredentialsSchedulerHandle: null,
    updateCredentialsSchedulerTimeout: 10000,//10sec
    setupUsersSchedulerHandle: null,
    setupUsersSchedulerTimeout: 10000,//10sec
};

const default_serverConfig = {
    __version__: "0.2",
    extensionname: "kick",
    channel: "KICK_CHANNEL",
    kickEnabled: "off",
    currentCategoryId: -1,
    currentCategoryName: "none selected",
    currentCategoryUrl: "",
    currentTitle: "",
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
    streamerName: "", // streamer we are connecting to (ie channel for that streamer)
    userName: "", // currently log in user
    userId: "",
    botName: "", // currently logged in bot
    botId: ""
};
let serverCredentials = structuredClone(default_serverCredentials);
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Kick extension for enabling trigger/actions from kick",
    version: "0.3",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "Kick message received",
                displaytitle: "Kick Chat Message",
                description: "A chat message was received. htmlMessage field has name and message combined",
                messagetype: "trigger_ChatMessageReceived",
                parameters: {
                    type: "chat",//required
                    type_UIDescription: "StreamRoller message type for chat messages",
                    platform: "Kick",//required
                    platform_UIDescription: "Source of message platform",
                    htmlMessage: "Not set",//required
                    htmlMessage_UIDescription: "Message with addef html links to emotes etc",
                    safeMessage: "",//required
                    safeMessage_UIDescription: "parsed text only message",
                    message: "",//required
                    message_UIDescription: "raw unprocessed message",
                    sender: "",//required
                    sender_UIDescription: "kick sender/user name",

                    id: "",//optional
                    id_UIDescription: "kick message id",
                    messagetype: "",//optional kick message type
                    messagetype_UIDescription: "kick message type",
                    timestamp: -1,//required
                    timestamp_UIDescription: "kick message timestamp",

                    senderId: "",//optional
                    senderId_UIDescription: "kick sender/user id",
                    userRoles: "",//optional
                    userRoles_UIDescription: "comma separated string of user roles",
                    senderBadges: "",//optional
                    senderBadges_UIDescription: "kick sender/user badges",
                    color: "#FF0000",//optional
                    color_UIDescription: "chat message color for this user/message",
                    emotes: "",
                    emotes_UIDescription: "string containing emote id's and names",
                    triggerActionRef: "KickChatMessage",//optional
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "Category search results",
                displaytitle: "Results from a SearchForKickGame request ",
                description: "Results of a search request in a JSON object",
                messagetype: "trigger_searchedKickGames",
                parameters: {
                    platform: "kick",
                    platform_UIDescription: "Platform should be 'kick'",
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
                    platform: "kick",
                    triggerActionRef: "KickCategoryHistoryCleared",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "Title history cleared",
                displaytitle: "The Title history was cleared",
                description: "The Title history was cleared",
                messagetype: "trigger_titleHistoryCleared",
                parameters: {
                    platform: "kick",
                    triggerActionRef: "KickTitleHistoryCleared",
                    triggerActionRef_UIDescription: "Reference for this message",
                }
            },
            {
                name: "GamedChanged",
                displaytitle: "Gamed Changed",
                description: "The Game was changed",
                messagetype: "trigger_KickGamedChanged",
                parameters: {
                    gameId: "",
                    name: "",
                    imageURL: "",
                    triggerActionRef: "kick",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "TitleChanged",
                displaytitle: "Title Changed",
                description: "The Title was changed",
                messagetype: "trigger_KickTitleChanged",
                parameters: {
                    title: "",
                    triggerActionRef: "kick",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
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
                    platform: "Kick",//required
                    platform_UIDescription: "platform that this message applies to",
                    account: "",
                    account_UIDescription: "account to send on ie. user/bot",
                    message: "",
                    message_UIDescription: "message to send",
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
                    platform: "Kick",//required
                    platform_UIDescription: "platform that this message applies to",
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
                    platform: "Kick",//required
                    platform_UIDescription: "platform that this message applies to",
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
                    platform: "Kick",//required
                    platform_UIDescription: "platform that this message applies to",
                }
            },
            {
                name: "SetTitleAndCategory",
                displaytitle: "Set Title And Category",
                description: "Changes teh current stream title and category",
                messagetype: "action_setTitleAndCategory",
                parameters: {
                    title: "",
                    title_UIDescription: "Title to set",
                    category: "",
                    category_UIDescription: "Category to set",
                    triggerActionRef: "SetTitleAndCategory",
                    triggerActionRef_UIDescription: "Reference for this message",
                    platform: "Kick",//required
                    platform_UIDescription: "platform that this message applies to",
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
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
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

        // update the kickAPI credentials for initial calls
        kickAPI.setCredentials(serverCredentials);
        setupUsers();
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                SendSettingsWidgetSmall(extension_packet.from);
                updateCategoryTitleFromKick()
            }
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

            if (extension_packet.data.platform && extension_packet.data.platform == "kick")
            {
                // only called once for kick
                if (serverConfig.kickEnabled == "on")
                {

                    if (extension_packet.data.account == "")
                        extension_packet.data.account = "bot"

                    kickAPI.sendChatMessage({
                        account: extension_packet.data.account,
                        message: extension_packet.data.message
                    }
                    )
                        .then((data) =>
                        {
                            //console.log("kickAPI.sendChatMessage returned", data)
                        })
                        .catch((err) =>
                        {
                            if (err.type == "invalid_grant")
                            {
                                // ignore these as the user would have been informed already
                                //logger.err("Kick", "Can't send chat message, user not authorized", extension_packet.data);
                            }
                            else
                                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "action_SendChatMessage ERROR ", err);
                        })

                }
                else if (extension_packet.data.platform == "")
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "action_SendChatMessage action has no platform selected ", server_packet);
            }
            else
            {
                if (extension_packet.data.platform == "")
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "action_SendChatMessage action is missing a platform tag. Delete and recreate the trigger/action pairing to pick the new action that now has a platform option", server_packet);
            }
        }
        else if (extension_packet.type === "action_searchForKickGame")
        {
            // if we have an empty search item then just return.
            if (extension_packet.data.searchName == "")
                return
            try
            {
                localConfig.gameSearchCategories = await kickAPI.searchCategories(extension_packet.data.searchName);
            }
            catch (err)
            {
                console.log("searchCategories failed", err)
            }
            // this request comes from the small settings widget normally
            sendGameCategoriesSearchTrigger(extension_packet.data.triggerActionRef, extension_packet.data.searchName)
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
        else if (extension_packet.type === "action_setTitleAndCategory")
        {
            // get all category that have the name in them.
            try
            {
                localConfig.gameSearchCategories = await kickAPI.searchCategories(extension_packet.data.category);
                // find the category we are looking for
                const game = localConfig.gameSearchCategories.data.find(item => item.name == extension_packet.data.category);
                if (game)
                {
                    kickAPI.setTitleAndCategory(extension_packet.data.title, game.id)
                        .then((data) =>
                        {
                            updateCategoryTitleFromKick();
                        })
                }
            }
            catch (err)
            {
                console.log("action_setTitleAndCategory error", err)
            }
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
                modalString = modalString.replace("kickSearchForGame", `<input type="text" class="form-control" id="kickSearchForKickGameElementId" name="kickSearchForKickGameElementId" placeholder="Enter Game name to search for (added to history when found)"><button type="button" class="btn btn-secondary"  onClick="sendAction('action_searchForKickGame', 'kick', {searchName:document.getElementById('kickSearchForKickGameElementId').value});return false;">Search</button>`);
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
                DataChanged = true
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
            // user selected category from our history
            if (userSelectedCategoryId)
            {
                const historyIndex = serverConfig.kickCategoriesHistory.findIndex(e => e.id == userSelectedCategoryId);
                if (historyIndex == -1)
                {
                    // check previous game search history to avoid res
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
                DataChanged = true;
            }
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
            // do we need to change title on kick
            if (serverConfig.currentCategoryId && serverConfig.currentCategoryId != ""
                && serverConfig.lastSelectedKickTitleId && serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId] && serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId] != ""
                && serverConfig.kickEnabled == "on"
            )
            {
                //update stream title/description
                kickAPI.setTitleAndCategory(serverConfig.kickTitlesHistory[serverConfig.lastSelectedKickTitleId], serverConfig.currentCategoryId)
                    .then((data) =>
                    {
                        updateCategoryTitleFromKick();
                    })
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
//                           FUNCTION: updateCategoryTitleFromKick
// ============================================================================
async function updateCategoryTitleFromKick ()
{
    try
    {
        if (serverConfig.channelData)
        {
            localConfig.kickChannel = await kickAPI.getChannel(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`);
            // update our category
            if (localConfig.kickChannel && localConfig.kickChannel.data && localConfig.kickChannel.data[0].category && localConfig.kickChannel.data[0].category.name != "")
            {
                serverConfig.currentCategoryId = localConfig.kickChannel.data[0].category.id;
                serverConfig.currentCategoryName = localConfig.kickChannel.data[0].category.name;
                serverConfig.currentCategoryUrl = localConfig.kickChannel.data[0].category.thumbnail;
                // check if we need to add this to our history list
                let historyCategoryIndex = serverConfig.kickCategoriesHistory.findIndex(x => x.name === serverConfig.currentCategoryName);
                // is this a new title
                if (historyCategoryIndex == -1)
                    serverConfig.kickCategoriesHistory.push({ id: serverConfig.currentCategoryId, name: serverConfig.currentCategoryName });
                sendCategoryTrigger();
            }
            // update our title
            if (localConfig.kickChannel && localConfig.kickChannel.data && localConfig.kickChannel.data[0].stream_title)
            {
                // update our title
                serverConfig.currentTitle = localConfig.kickChannel.data[0].stream_title;
                // add title to history if not already there
                let historyTitleIndex = serverConfig.kickTitlesHistory.findIndex(x => x === serverConfig.currentTitle);
                // is this a new title
                if (historyTitleIndex == -1)
                    serverConfig.lastSelectedKickTitleId = serverConfig.kickTitlesHistory.push(serverConfig.currentTitle) - 1
                sendTitleTrigger();
            }
            SendSettingsWidgetSmall();
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".updateCategoryTitleFromKick", "Error:", err);
    }
}
// ============================================================================
//                           FUNCTION: sendCategoryTrigger
// ============================================================================
function sendCategoryTrigger ()
{
    let triggerToSend = null
    // category changed
    if (serverConfig.currentCategoryId != -1)
    {
        triggerToSend = findTriggerByMessageType("trigger_KickGamedChanged")
        triggerToSend.parameters.gameId = serverConfig.currentCategoryId;
        triggerToSend.parameters.name = serverConfig.currentCategoryName;
        triggerToSend.parameters.imageURL = serverConfig.currentCategoryUrl;
        postTrigger(triggerToSend);
    }
}
// ============================================================================
//                           FUNCTION: sendTitleTrigger
// ============================================================================
function sendTitleTrigger ()
{
    // title changed
    let triggerToSend = findTriggerByMessageType("trigger_KickTitleChanged")
    triggerToSend.parameters.title = serverConfig.currentTitle;
    postTrigger(triggerToSend);
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
        if (!localConfig.streamer || !localConfig.streamer.data)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".connectToChat", "no streamer to connect with, have you completed the user auth");
            return;
        }

        // temp fix until the official api returns the chatroom id.
        // should really do this each time after initial dev is done
        // TBD PreRelease - remove if statement before release
        if (serverConfig.channelData == null)
        {
            serverConfig.channelData = await kickAPI.getChannelData(serverCredentials.streamerName)
            SaveConfigToServer()
        }
        localConfig.kickChannel = await kickAPI.getChannel(`chatrooms.${serverConfig.channelData.chatroom.id}.v2`);
        localConfig.kickLiveStream = await kickAPI.getLivestream(localConfig.streamer.data[0].user_id)

        // setup chat connection for the streamer.
        chatService.connectChat(serverConfig.channelData.chatroom.id, serverConfig.channelData.id, serverCredentials.streamerName, serverCredentials.streamerName)
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
                    currentCategoryId: serverConfig.currentCategoryId,
                    categoryName: serverConfig.currentCategoryName,
                    categoryURL: serverConfig.currentCategoryUrl
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
 * @param {string} credentials 
 */
function updateRefreshToken (name, value)
{
    // during auth we may call this function several times so lets just buffer them
    // save them for use in the meantime
    serverCredentials[name] = value;
    clearTimeout(localConfig.updateCredentialsSchedulerHandle);
    localConfig.updateCredentialsSchedulerHandle = setTimeout(() =>
    {
        updateRefreshTokenScheduler(name, value)
    }, localConfig.updateCredentialsSchedulerTimeout);
}
// ============================================================================
//                           FUNCTION: updateRefreshTokenScheduler
// ============================================================================
/**
 * Store an updated refresh token
 * @param {string} credentials 
 */
function updateRefreshTokenScheduler (name, value)
{
    // dev need to check this is working. remove once seen working ok
    SaveCredentialToServer(name, value)
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
        const regex = /\[emote:(s?)(\d+):([^\]]+)\]/g;
        const matches = [];
        for (const match of message.content.matchAll(regex))
            matches.push(match);
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
            triggerActionRef: "KickChatMessage",
            type: "chat",
            platform: "Kick",
            htmlMessage: parsedTextMessage,
            safeMessage: safeMessage,
            color: message.sender.identity.color,

            // kick message data
            id: message.id,
            message: message.content,
            messagetype: message.type,
            timestamp: message.created_at,
            emotes: JSON.stringify(emotes),

            //kick author data
            sender: message.sender.username,
            senderId: message.sender.id,
            senderBadges: message.sender.identity.badges,
            roles: "viewer"
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
//                           FUNCTION: createDummyChatMessageFromMessage
// ============================================================================
/**
 * Simulates a message from kick chat.
 * @param {object} data 
 */
function createDummyChatMessageFromMessage (message)
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
// ============================================================================
//                           FUNCTION: createDummyChatMessage
// ============================================================================
/**
 * Simulates a message from kick chat.
 * @param {object} data 
 */
function createDummyChatMessage (message)
{
    //message.type("system")
    onChatMessage(message);
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
    trigger.parameters.categories = localConfig.gameSearchCategories.data.map(item => item.name).join(', ')
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
//                           FUNCTION: sendTitleClearedTrigger
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
//                      FUNCTION: checkForLiveStreams
// ============================================================================
/**
 * schedules a check for users going live. might need to tweek the timeouts once working
 */
function checkForLiveStreams ()
{
    clearInterval(localConfig.botLiveStreamSchedulerHandle)
    clearInterval(localConfig.userLiveStreamSchedulerHandle)

    if (serverConfig.kickEnabled == "on")
    {
        localConfig.userLiveStreamSchedulerHandle = setInterval(() =>
        {
            checkForLiveStreamsScheduler(serverCredentials.userId)
        }, localConfig.userLiveStreamSchedulerTimeout)

        localConfig.botLiveStreamSchedulerHandle = setInterval(() =>
        {
            checkForLiveStreamsScheduler(serverCredentials.userId)
        }, localConfig.botLiveStreamSchedulerTimeout)
    }
}
// ============================================================================
//                      FUNCTION: checkForLiveStreams
// ============================================================================
/**
 * checks if a user is live
 * @param {number} id 
 */
function checkForLiveStreamsScheduler (id)
{
    if (typeof (id) != "undefined")
    {
        kickAPI.getLivestream(id)
            .then((data) =>
            {
                //console.log("checkForLive status", data.message);
                //console.log("checkForLive data", data.data);
            })
            .catch((err) =>
            {
                console.log("checkForLiveStreamsScheduler error", err)
            })
    }
}
// ============================================================================
//                      FUNCTION: setupUsers
// ============================================================================
/**
 * 
 */
async function setupUsers ()
{
    // avoid multiple requests close together. This happens during auth where 
    // we get multiple callbacks for credentials
    clearTimeout(localConfig.setupUsersSchedulerHandle)
    localConfig.setupUsersSchedulerHandle = setTimeout(() =>
    {
        setupUsersScheduler()
    }, localConfig.setupUsersSchedulerTimeout);
}
// ============================================================================
//                      FUNCTION: setupUsersScheduler
// ============================================================================
async function setupUsersScheduler ()
{
    // ##################### Streamer setup #############################
    if (serverCredentials.kickAccessToken)
    {
        try
        {
            localConfig.streamer = await kickAPI.getUser(true)
            if (localConfig.streamer && localConfig.streamer.data[0].name)
            {
                localConfig.apiConnected = true;
                serverCredentials.streamerName = localConfig.streamer.data[0].name;
                serverCredentials.userName = localConfig.streamer.data[0].name;
                serverCredentials.userId = localConfig.streamer.data[0].user_id
                sendAccountNames();
                // update the kickAPI credentials 
                kickAPI.setCredentials(serverCredentials);
                if (serverConfig.kickEnabled == "on")
                {
                    // temp fix until the official api returns the chatroom id.
                    // should really do this each time after initial dev is done
                    // TBD PreRelease - remove if statement before release
                    if (serverConfig.channelData == null)
                    {
                        serverConfig.channelData = await kickAPI.getChannelData(serverCredentials.streamerName)
                        SaveConfigToServer()
                    }
                    updateCategoryTitleFromKick()
                    localConfig.kickLiveStream = await kickAPI.getLivestream(serverCredentials.userId)
                    connectToChatScheduler()
                }
            }
            else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "CredentialsFile failed to get streamer details from kick ");
            }
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Streamer setup error", err);
        }
    }
    else
    {
        console.log("Kick: Missing streamer credentials,please connect using the main settings page for Kick")
    }

    // ##################### Bot setup #############################
    // bot doesn't need all the setup that the streamer does as we assume both are
    // working in the same channel
    if (serverCredentials.kickBotAccessToken)
    {
        try
        {
            localConfig.bot = await kickAPI.getUser(false)
            if (localConfig.bot && localConfig.bot.data[0].name)
            {
                if (localConfig.bot && localConfig.bot.data[0].name)
                {
                    serverCredentials.botName = localConfig.bot.data[0].name
                    serverCredentials.botId = localConfig.bot.data[0].user_id
                    sendAccountNames();
                    // update the kickAPI credentials 
                    kickAPI.setCredentials(serverCredentials);
                }
                else
                {
                    console.log("KickAPI CredentialsFile failed on getUser for bot")
                    console.log(localConfig.bot)
                }
            }
            else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "CredentialsFile failed to get bot details from kick ");
            }
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Bot setup error", err);
        }
    }
    else
    {
        console.log("Kick: Missing bot credentials,please connect using the main settings page for Kick")
    }
    checkForLiveStreams();
    //checkForLiveStreamsScheduler(serverCredentials.userId)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { start, triggersandactions };

