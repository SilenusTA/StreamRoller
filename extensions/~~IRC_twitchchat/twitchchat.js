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
// ############################# twitchchat.js ##############################
// Simple twitch chat reader so we can display/parse twitch chat/commands
// in other extension
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 06-Feb-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// receive twitch chat message
// ----------------------------- notes ----------------------------------------
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
// Description: Import/Variable secion
// ----------------------------- notes ----------------------------------------
// using lib: https://github.com/tmijs/docs
// currently restricted to be configured one bot and one user.
// only the user account is monitored for messages.
// ============================================================================
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as twitch_IRC from "./irc.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "TWITCH_CHAT",
    EXTENSION_NAME: "twitchchat",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    twitchClient: ["bot", "user"],
    usernames: [],
    channelConnectionAttempts: 20,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    saveDataHandle: null,
    logRawMessages: false,
    startupCheckTimer: 500,
    ready: false,
    readinessFlags: {
        ConfigReceived: false,
        CredentialsReceived: false,
        DataFileReceived: false,
    },
};
localConfig.twitchClient["bot"] = {
    connection: null,
    connecting: false,
    state: {
        readonly: true,
        connected: false,
        emoteonly: false,
        followersonly: -1,
        r9k: false,
        slowmode: false,
        subsonly: false
    }
}
localConfig.twitchClient["user"] = {
    connection: null,
    connecting: false,
    state: {
        readonly: true,
        connected: false,
        emoteonly: false,
        followersonly: -1,
        r9k: false,
        slowmode: false,
        subsonly: false
    }
}
const default_serverConfig = {
    __version__: 0.2,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    enabletwitchchat: "on",
    checkforbots: "on",
    updateUserLists: "off",
    streamername: "OldDepressedGamer",// channel we are streaming on (set from settings submits by user)
    botname: "Botname", // only used so we can put a hint in the credentials box
    username: "Username",
    chatMessageBufferMaxSize: "300",
    chatMessageBackupTimer: "60",
    twitchchat_restore_defaults: "off",
    //credentials variable names to use (in credentials modal, data doesn't get stored here)
    credentialscount: "4",
    cred1name: "twitchchatbot",
    cred1value: "",
    cred2name: "twitchchatbotoauth",
    cred2value: "",
    cred3name: "twitchchatuser",
    cred3value: "",
    cred4name: "twitchchatuseroauth",
    cred4value: "",
    /// this debug settings will post messages internally only and not to twich
    DEBUG_ONLY_MIMIC_POSTING_TO_TWITCH: "off",
    DEBUG_EXTRA_CHAT_MESSAGE: "off",
    DEBUG_LOG_DATA_TO_FILE: "off"
};
let serverConfig = structuredClone(default_serverConfig)

const serverData =
{
    chatMessageBuffer: [{
        channel: serverConfig.streamername + " (Readonly)",
        dateStamp: "sys",
        message: "Empty chat buffer",
        data: { 'display-name': serverConfig.streamername, emotes: '' }
    }
    ],
}

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Twitch chat and alerts (ie subs, redeeems etc), this contans raw data fields plus 'htmlMessage' which is a formatted message to use directly<BR> NOTE: use the message field for checking string typed into chat (ie for commands)",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [{
            name: "twitchchatChatMessageReceived",
            displaytitle: "Chat Message",
            description: "A chat message was received",
            messagetype: "trigger_ChatMessageReceived",
            parameters: {
                type: "trigger_ChatMessageReceived",
                htmlMessage: "[username]: [message]",
                sender: "",
                message: "",
                color: "",
                firstmessage: false,
                mod: false,
                subscriber: false,
                vip: false,
                platform: ""
            }
        }, {
            name: "twitchchatActionReceived",
            displaytitle: "Chat Action",
            description: "A chat action was received (a /me message)",
            messagetype: "trigger_ChatActionReceived",
            parameters: {
                type: "trigger_ChatActionReceived",
                htmlMessage: "[message]",
                sender: "",
                message: "",
                color: "",
                firstmessage: false,
                mod: false,
                subscriber: false
            }
        }, {
            name: "twitchchatBanReceived",
            displaytitle: "Chat Ban",
            description: "A chat users was banned",
            messagetype: "trigger_ChatBanReceived",
            parameters: {
                type: "trigger_ChatBanReceived",
                htmlMessage: "[username] was banned for [timeout]s: [reason]",
                username: "",
                message: ""
            }
        }, {
            name: "twitchchatMessageDeletedReceived",
            displaytitle: "Chat MessageDeleted",
            description: "A chat message was deleted ",
            messagetype: "trigger_ChatMessageDeleted",
            parameters: {
                type: "trigger_ChatMessageDeleted",
                htmlMessage: "[Username]'s message was deleted",
                username: "",
                message: ""
            }
        }, {
            name: "twitchchatPrimePaidUpgradeReceived",
            displaytitle: "Chat PrimePaidUpgrade",
            description: "A user paid to upgrade their prime sub ",
            messagetype: "trigger_ChatPrimePaidUpgrade",
            parameters: {
                type: "trigger_ChatPrimePaidUpgrade",
                htmlMessage: "[Username] upgraded their prime",
                username: ""
            }
        }, {
            name: "twitchchatRaidReceived",
            displaytitle: "Someone Raided",
            description: "Another streamer raided you",
            messagetype: "trigger_ChatRaid",
            parameters: {
                type: "trigger_ChatRaid",
                htmlMessage: "[Username] raided with [viewers]",
                username: "",
                viewers: ""
            }
        }, {
            name: "twitchchatRedeemReceived",
            displaytitle: "Points Redeemed",
            description: "Viewer reddemed chat points",
            messagetype: "trigger_ChatRedeem",
            parameters: {
                type: "trigger_ChatRedeem",
                htmlMessage: "[Username] redeemed chat points",
                username: "",
                message: "",
                rewardType: ""
            }
        }, {
            name: "twitchchatResubReceived",
            displaytitle: "Someone Resubbed",
            description: "Someone Resubbed",
            messagetype: "trigger_ChatResub",
            parameters: {
                type: "trigger_ChatResub",
                htmlMessage: "[Username] resubbed: [message]",
                username: "",
                message: "",
                months: ""
            }
        }, {
            name: "twitchchatRitualReceived",
            displaytitle: "Ritual",
            description: "Ritual",
            messagetype: "trigger_ChatRitual",
            parameters: {
                type: "trigger_ChatRitual",
                ritualName: "",
                username: "",
                message: "",
            }
        }, {
            name: "twitchchatRoomstateReceived",
            displaytitle: "Roomstate message",
            description: "This message contains things like sub-only mode etc",
            messagetype: "trigger_ChatRoomstate",
            parameters: {
                type: "trigger_ChatRoomstate",
                htmlMessage: "Roomstate changed",
                channel: "",
                emoteonly: false,
                followersonly: "-1",
                r9k: false,
                slow: false,
                subsonly: false
            }
        }, {
            name: "twitchchatSubscriptionReceived",
            displaytitle: "Someone Subscribed",
            description: "Someone Subscribed",
            messagetype: "trigger_ChatSubscription",
            parameters: {
                type: "trigger_ChatSubscription",
                htmlMessage: "[Username] subscribed: [message]",
                username: "",
                message: "",
                subplan: ""
            }
        }, {
            name: "twitchchatTimeoutReceived",
            displaytitle: "Viewer Timeout",
            description: "A viewer was timedout",
            messagetype: "trigger_ChatTimeout",
            parameters: {
                type: "trigger_ChatTimeout",
                htmlMessage: "[Username] was timedout for [duration]:[reason]",
                username: "",
                message: "",
                duration: ""
            }
        }, {
            name: "twitchchatSubMysteryGiftReceived",
            displaytitle: "SubMysteryGift",
            description: "A viewer Gifted a sub",
            messagetype: "trigger_ChatSubMysteryGift",
            parameters: {
                type: "trigger_ChatSubMysteryGift",
                htmlMessage: "[Username] received a giftsub",
                username: "",
                message: ""
            }
        },
        {
            name: "twitchchatAutoModReceived",
            displaytitle: "Automod action",
            description: "Automod action happened",
            messagetype: "trigger_ChatAutoMod",
            parameters: {
                type: "trigger_ChatAutoMod",
                htmlMessage: "no default message",
                msgID: "",
                message: ""
            }
        },
        {
            name: "twitchchatReconnect",
            displaytitle: "Chat Reconnected",
            description: "Chat Reconnected",
            messagetype: "trigger_ChatReconnect",
            parameters: {
                type: "trigger_ChatReconnect",
                htmlMessage: "Reconnect",
            }
        }, {
            name: "twitchchatAnonGiftPaidUpgradeReceived",
            displaytitle: "Anon Gift Paid Upgrade",
            description: "Your guess is as good as mine on this one",
            messagetype: "trigger_ChatAnonGiftPaidUpgrade",
            parameters: {
                type: "trigger_ChatAnonGiftPaidUpgrade",
                htmlMessage: "[Username] received an annonomous paid upgrade (I think)",
                username: ""
            }
        }, {
            name: "twitchchatAnonSubMysteryGiftReceived",
            displaytitle: "Anon Sub Mystery Gift",
            description: "Someone Gifted an Sub Anonymously",
            messagetype: "trigger_ChatAnonSubMysteryGift",
            parameters: {
                type: "trigger_ChatAnonSubMysteryGift",
                htmlMessage: "anon sub mystery gift x[numbOfSubs]",
                numbOfSubs: "",
                message: ""
            }
        }, {
            name: "twitchchatAnonSubGiftReceived",
            displaytitle: "Anon Sub Gift",
            description: "Someone Gifted an Sub",
            messagetype: "trigger_ChatAnonSubGift",
            parameters: {
                type: "trigger_ChatAnonSubGift",
                htmlMessage: "[Username] received an anon sub gift: [message]",
                username: "",
                message: ""
            }
        }, {
            name: "twitchchatCheerReceived",
            displaytitle: "Somone Cheered",
            description: "Someone donated bits",
            messagetype: "trigger_ChatCheer",
            parameters: {
                type: "trigger_ChatCheer",
                htmlMessage: "[Username] Cheered with [bits]",
                username: "",
                message: ""
            }
        },
        {
            name: "twitchchatMod",
            displaytitle: "Mod?!?",
            description: "A Mod message was received, someone modded maybe or a mod action was performed. let me know if you know which it is",
            messagetype: "trigger_ChatMod",
            parameters: {
                type: "trigger_ChatMod",
                htmlMessage: "no default message",
                username: ""
            }
        },
        /* {
                name: "twitchchatMods",
                displaytitle: "Mods?!?",
                description: "A Mods message was received, possibly a list of mods in this channel. need to log it and see",
                messagetype: "trigger_ChatMods",
                            parameters: {
                    type: "trigger_ChatMods",
                    htmlMessage: "mod list received",  
                    message: ""
                }
            },*/
        {
            name: "twitchchatSubGift",
            displaytitle: "A sub was gifted",
            description: "Someone gifted a sub to another viewer",
            messagetype: "trigger_ChatSubGift",
            parameters: {
                type: "trigger_ChatSubGift",
                htmlMessage: "[Username] gifed a sub to [Username] ",
                gifter: "",
                recipient: ""

            }
        }, {
            name: "twitchchatSubscribers",
            displaytitle: "Channel Subscribers",
            description: "Subscribers",
            messagetype: "trigger_ChatSubscribers",
            parameters: {
                type: "trigger_ChatSubscribers",
                htmlMessage: "List of subscribers (I think)",
                channel: "",
                enabled: "",
            }
        }, {
            name: "twitchchatVipss",
            displaytitle: "Channel Vips",
            description: "Channel Vips",
            messagetype: "trigger_ChatVips",
            parameters: {
                type: "trigger_ChatVips",
                htmlMessage: "List of Vips(I think)",
                channel: "",
                vips: "",
            }
        }, {
            name: "twitchchatClear",
            displaytitle: "Clear Chat",
            description: "Chat was cleared",
            messagetype: "trigger_ChatClear",
            parameters: {
                type: "trigger_ChatClear",
                htmlMessage: "Chat was cleared",
                channel: "",
            }
        },
        /* {
            name: "twitchchatUnmod",
            displaytitle: "Unmod",
            description: "Someone was un-modded",
            messagetype: "trigger_ChatUnmod",
                        parameters: {
                type: "trigger_ChatUnmod",
                htmlMessage: "no default message",  
                username: "",
            }
        },         {
            name: "twitchchatEmoteSet",
            displaytitle: "EmoteSet",
            description: "Emote set (currently passed through, if there is a need let me know)",
            messagetype: "trigger_ChatEmoteSet",
                        parameters: {
                type: "trigger_ChatEmoteSet",
                htmlMessage: "emote set received",  
                message: "",
            }
        }, */
        {
            name: "twitchchatFollowersOnly",
            displaytitle: "FollowersOnly",
            description: "FollowersOnly mode was changed",
            messagetype: "trigger_ChatFollowersOnly",
            parameters: {
                type: "trigger_ChatFollowersOnly",
                htmlMessage: "Follower only mode [enabled] for [length]",
                enabled: false,
                length: ""
            }
        }, {
            name: "twitchchatGiftPaidUpgrade",
            displaytitle: "GiftPaidUpgrade",
            description: "Someone gifted a paid upgrade",
            messagetype: "trigger_ChatGiftPaidUpgrade",
            parameters: {
                type: "trigger_ChatGiftPaidUpgrade",
                htmlMessage: "[Username] upgraded [Username] to a paid sub",
                sender: "",
                recipient: "",
            }
        }, {
            name: "twitchchatEmoteOnly",
            displaytitle: "EmoteOnly",
            description: "EmoteOnly mode changed",
            messagetype: "trigger_ChatEmoteOnly",
            parameters: {
                type: "trigger_ChatEmoteOnly",
                htmlMessage: "Emote only mode [enabled]",
                enabled: false
            }
        }, {
            name: "twitchchatr9kbeta",
            displaytitle: "r9kbeta",
            description: "r9kbeta mode changed",
            messagetype: "trigger_Chatr9kbeta",
            parameters: {
                type: "trigger_Chatr9kbeta",
                htmlMessage: "r9kBeta mode [message]",
                message: ""
            }
        }, {
            name: "twitchchatSlowmode",
            displaytitle: "Slowmode",
            description: "Slowmode mode changed",
            messagetype: "trigger_ChatSlowmode",
            parameters: {
                type: "trigger_ChatSlowmode",
                htmlMessage: "Slowmode [enabled] for [length]",
                enabled: false,
                length: ""
            }
        }, {
            name: "twitchchatWhisper",
            displaytitle: "Whisper",
            description: "Someone Whispered you or the bot",
            messagetype: "trigger_ChatWhisper",
            parameters: {
                type: "trigger_ChatWhisper",
                htmlMessage: "Whisper from [Username]: [message]",
                from: "",
                message: ""
            }
        }, {
            name: "twitchchatNotice",
            displaytitle: "Notice",
            description: "You received a notice (ie about chat being in follower mode etc)",
            messagetype: "trigger_ChatNotice",
            parameters: {
                type: "trigger_ChatNotice",
                htmlMessage: "Notice: [message]",
                msgid: "",
                message: ""
            }
        }, {
            name: "twitchchatUserNotice",
            displaytitle: "UserNotice",
            description: "UserNotice received",
            messagetype: "trigger_ChatUserNotice",
            parameters: {
                type: "trigger_ChatUserNotice",
                htmlMessage: "UserNotice: [message]",
                msgid: "",
                message: ""
            }
        }, {
            name: "twitchchatDisconnected",
            displaytitle: "Disconnected",
            description: "Chat was Disconnected",
            messagetype: "trigger_ChatDisconnected",
            parameters: {
                type: "trigger_ChatDisconnected",
                htmlMessage: "Disconnected: [reason]",
                reason: ""
            }
        },
        /*{
            name: "twitchchatServerChange",
            displaytitle: "ServerChange",
            description: "Chat server changed",
            messagetype: "trigger_ChatServerChange",
                        parameters: {
                type: "trigger_ChatServerChange",
                htmlMessage: "Server changed to [channel]",  
                channel: ""
            }
        },*/
        {
            name: "twitchchatConnected",
            displaytitle: "Connected",
            description: "Chat was connected",
            messagetype: "trigger_ChatConnected",
            parameters: {
                type: "trigger_ChatConnected",
                htmlMessage: "Connected to [address][port]",
                address: "",
                port: ""
            }
        },
        /* {
            name: "twitchchatConnecting",
            displaytitle: "Connecting",
            description: "Chat is connecting",
            messagetype: "trigger_ChatConnecting",
                            parameters: {
                type: "trigger_ChatConnecting",
                htmlMessage: "Connecting to [address][port]",  
                address: "",
                port: ""
            }
        },   {
            name: "twitchchatLogon",
            displaytitle: "Logon",
            description: "Logged in to chat",
            messagetype: "trigger_ChatLogon",
                            parameters: {
                type: "trigger_ChatLogon",
                htmlMessage: "Logon",  
            }
        }, 
        */
        {
            name: "twitchchatJoin",
            displaytitle: "Chat Join",
            description: "Someone Joined the chat",
            messagetype: "trigger_ChatJoin",
            parameters: {
                type: "trigger_ChatJoin",
                htmlMessage: "[username] Joined [channel]",
                username: "",
                channel: "",
                platform: ""
            }
        },
            /* {
                name: "twitchchatPart",
                displaytitle: "Part",
                description: "Someone Left the chat",
                messagetype: "trigger_ChatPart",
                                parameters: {
                    type: "trigger_ChatPart",
                    htmlMessage: "[username] Left",
                    username: ""
                }
            }*/
        ],
    // these are messages we can receive to perform an action
    actions:
        [{
            name: "twitchchatSendChatMessage",
            displaytitle: "Post Twitch Message",
            description: "Post a message to twitch chat",
            messagetype: "action_SendChatMessage",
            parameters: {
                platform: "twitch",
                account: "",
                message: ""
            }
        }],
}

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Description: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this function is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heartbeat passed:", heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage,
            onDataCenterConnect, onDataCenterDisconnect, host, port);
        startupCheck();
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
// Description: Received disconnect message
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
// Description: Received connect message
// Parameters: none
// ----------------------------- notes ----------------------------------------
// When we connect to the StreamRoller server the first time (or if we reconnect)
// we will get this function called. we need to store our clientID here.
// it is also a good place to create/join channels we wish to use for data
// monitoring/sending on.
// ===========================================================================
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", localConfig.EXTENSION_NAME));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", localConfig.EXTENSION_NAME));
    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
// Description: Received message
// Parameters: data
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
        // check it is our config
        if (server_packet.data != "" && server_packet.data.extensionname === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
            // restart the sceduler in case we changed the values
            SaveChatMessagesToServerScheduler();
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (server_packet.to === serverConfig.extensionname)
        {
            localConfig.readinessFlags.CredentialsReceived = true;
            //console.log("credentials file", server_packet)
            // check we have been sent something
            if (server_packet.data != "")
            {
                if (server_packet.data.twitchchatuser && server_packet.data.twitchchatuseroauth)
                {
                    serverConfig.username = server_packet.data.twitchchatuser
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    localConfig.usernames.user["oauth"] = server_packet.data.twitchchatuseroauth;
                }
                if (server_packet.data.twitchchatbot && server_packet.data.twitchchatbotoauth)
                {
                    serverConfig.botname = server_packet.data.twitchchatbot
                    localConfig.usernames.bot = [];
                    localConfig.usernames.bot["name"] = server_packet.data.twitchchatbot;
                    localConfig.usernames.bot["oauth"] = server_packet.data.twitchchatbotoauth;
                }
                // start connection
                // if we have some usernames to connect with
                if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                {
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            twitch_IRC.reconnectChat(localConfig, serverConfig, process_chat_data, key);
                        else
                            twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, key);

                    }
                }
                else
                {
                    /* Readonly connection (user only connected for read only streams)*/
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, handleMessage, "user");
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                }
            }
            else // credentials empty so connected with previous credentials if we have them
            {
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                    serverConfig.extensionname + " CredentialsFile", "Credential file is empty, connecting readonly");
                // connect with existing credentials if we have them
                if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                {
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            twitch_IRC.reconnectChat(localConfig, serverConfig, process_chat_data, key);
                        else
                            twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, key);
                    }
                }
                else // connect readonly if no credentials available (user only for readonly)
                {
                    localConfig.usernames.user = [];
                    localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                    twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, "user");
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                }
            }
        }
    }
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.to === serverConfig.extensionname)
        {
            localConfig.readinessFlags.DataFileReceived = true;

            if (server_packet.data != "")
            {
                // check it is our data
                if (server_packet.to === serverConfig.extensionname && server_packet.data.chatMessageBuffer.length > 0)
                {
                    serverData.chatMessageBuffer = server_packet.data.chatMessageBuffer;
                    SaveDataToServer();
                }
            }
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -------------------- PROCESSING SETTINGS WIDGET SMALLS -----------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(server_packet.from);
        else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            SendSettingsWidgetLarge(server_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // need to indicate we have changed user in header even if we are turned off.
                if (serverConfig.enabletwitchchat == "off")
                {
                    if (serverConfig.streamername != extension_packet.data.streamername)
                    {
                        // we have turned off twitch chat and are changing channel. need to update the users screen.
                        serverConfig.enabletwitchchat = "on";
                        let name = serverConfig.streamername
                        serverConfig.streamername = extension_packet.data.streamername
                        process_chat_data("#" + extension_packet.data.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "channel: " + extension_packet.data.streamername);
                        serverConfig.enabletwitchchat = "off";
                        serverConfig.streamername = name;
                    }
                }

                // need to update these manually as the web page does not send unchecked box values
                serverConfig.enabletwitchchat = "off";

                for (const [key, value] of Object.entries(serverConfig))
                    if (key in extension_packet.data)
                    {
                        serverConfig[key] = extension_packet.data[key];
                    }
                for (const [key, value] of Object.entries(localConfig.usernames))
                {
                    if (localConfig.twitchClient[key].state.connected)
                        twitch_IRC.reconnectChat(localConfig, serverConfig, process_chat_data, key);
                    else
                        twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, key);
                }
                SaveConfigToServer();
                // restart the scheduler in case we changed it
                SaveChatMessagesToServerScheduler();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {

            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.twitchchat_restore_defaults == "on")
                {
                    console.log("restoring defaults", extension_packet.data.twitchchat_restore_defaults)
                    process_chat_data("#" + extension_packet.data.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "restoring defaults");
                    serverConfig = structuredClone(default_serverConfig);
                    // restart the scheduler in case we changed it
                    SaveChatMessagesToServerScheduler();
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
                else
                {
                    if (serverConfig.streamername != extension_packet.data.streamername)
                    {
                        // need to indicate we have changed user in header even if we are turned off.
                        if (serverConfig.enabletwitchchat == "off")
                        {
                            // we have turned off twitch chat and are changing channel. need to update the users screen.
                            serverConfig.enabletwitchchat = "on";
                            let name = serverConfig.streamername
                            serverConfig.streamername = extension_packet.data.streamername
                            process_chat_data("#" + extension_packet.data.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, " channel: " + extension_packet.data.streamername);
                            serverConfig.enabletwitchchat = "off";
                            serverConfig.streamername = name;
                        }
                    }
                    // need to update these manually as the web page does not send unchecked box values
                    serverConfig.enabletwitchchat = "off";
                    serverConfig.checkforbots = "off";
                    serverConfig.updateUserLists = "off";
                    serverConfig.DEBUG_ONLY_MIMIC_POSTING_TO_TWITCH = "off"
                    serverConfig.DEBUG_EXTRA_CHAT_MESSAGE = "off";
                    serverConfig.DEBUG_LOG_DATA_TO_FILE = "off";

                    for (const [key, value] of Object.entries(serverConfig))
                    {
                        if (key in extension_packet.data)
                            serverConfig[key] = extension_packet.data[key];

                    }
                    for (const [key, value] of Object.entries(localConfig.usernames))
                    {
                        if (localConfig.twitchClient[key].state.connected)
                            twitch_IRC.reconnectChat(localConfig, serverConfig, process_chat_data, key);
                        else
                            twitch_IRC.connectToTwitch(localConfig, serverConfig, handleMessage, key);
                    }
                    SaveConfigToServer();
                    // restart the scheduler in case we changed it
                    SaveChatMessagesToServerScheduler();
                    // broadcast our modal out so anyone showing it can update it
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }

            }
        }
        else if (extension_packet.type === "action_SendChatMessage")
        {
            if (extension_packet.data.pltform != "twitch")
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received action_SendChatMessage with missing platform flag ", server_packet);
                return;
            }
            if (serverConfig.DEBUG_ONLY_MIMIC_POSTING_TO_TWITCH.indexOf("on") < 0)
                action_SendChatMessage(serverConfig.streamername, extension_packet.data)
            else
            {
                let name = ""
                if (extension_packet.data.account == "bot" || extension_packet.data.account == "user")
                    name = localConfig.usernames[extension_packet.data.account].name
                else if (extension_packet.data.account == "")
                    name = localConfig.usernames.bot.name
                else
                    name = extension_packet.data.account
                //logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "action_SendChatMessage Not posting to twitch due to debug flag 'on' in settings", extension_packet.data.message);
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "(localpost debug turned on in settings) " + name, "emotes": "", "message-type": "chat" }, extension_packet.data.message)
            }
        }
        else if (extension_packet.type === "RequestAccountNames")
        {
            sendAccountNames(server_packet.from)
        }
        else if (extension_packet.type === "RequestChatBuffer")
        {
            sendChatBuffer(server_packet.from)
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
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    // ------------------------------------------------ error message received -----------------------------------------------
    else if (server_packet.data === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel",
                    localConfig.EXTENSION_NAME,
                    server_packet.channel));
        }, 5000);
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel"
        || server_packet.type === "ChannelData")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ===========================================================================
//                           FUNCTION: sendChatBuffer
// ===========================================================================
/**
 * Send our chat buffer to the extension
 * @param {String} toExtension 
 */
function sendChatBuffer (toExtension)
{
    // send the modified modal data to the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            localConfig.EXTENSION_NAME,
            sr_api.ExtensionPacket(
                "twitchchatBuffer",
                localConfig.EXTENSION_NAME,
                serverData.chatMessageBuffer,
                "",
                toExtension,
                serverConfig.channel),
            "",
            toExtension
        ));
}
// ===========================================================================
//                           FUNCTION: sendAccountNames
// ===========================================================================
/**
 * @param {String} toExtension 
 */
function sendAccountNames (toExtension)
{
    // TBD create list from available names otherwise we need to supply both names
    let usrlist = {}
    let countusers = 0
    for (const id in localConfig.usernames)
    {
        usrlist[id] = localConfig.usernames[id]["name"];
        countusers++;
    }

    if (countusers > 0)
    {
        // send the modified modal data to the server
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "UserAccountNames",
                    localConfig.EXTENSION_NAME,
                    usrlist,
                    "",
                    toExtension,
                    serverConfig.channel),
                "",
                toExtension
            ));
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Send our SettingsWidgetSmall to the extension
 * @param {String} toExtension 
 */
function SendSettingsWidgetSmall (toExtension)
{

    // read our modal file
    fs.readFile(__dirname + "/twitchchatsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toExtension,
                        serverConfig.channel),
                    "",
                    toExtension
                ));
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * Send our SettingsWidgetLarge to the extension
 * @param {String} toExtension 
 */
function SendSettingsWidgetLarge (toExtension)
{

    // read our modal file
    fs.readFile(__dirname + "/twitchchatsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        //throw err;
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (typeof (value) == "string" && value == "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode",
                        localConfig.EXTENSION_NAME,
                        modalstring,
                        "",
                        toExtension,
                        serverConfig.channel),
                    "",
                    toExtension
                ));
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{

    fs.readFile(__dirname + "/twitchchatcredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();
            // first lets update our modal to the current settings
            for (const [key, value] of Object.entries(serverConfig))
            {
                // true values represent a checkbox so replace the "[key]checked" values with checked
                if (value === "on")
                {
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                {
                    modalstring = modalstring.replaceAll(key + "text", value);
                }
            }
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        extensionname,
                        serverConfig.channel
                    ),
                    "",
                    extensionname)
            )
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig));
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
// Description:save data on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
function SaveDataToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveData",
            localConfig.EXTENSION_NAME,
            serverData));
}
// ============================================================================
//                     FUNCTION: SaveChatMessagesToServerScheduler
// ============================================================================
function SaveChatMessagesToServerScheduler ()
{
    SaveDataToServer()
    // clear any previous timeout
    clearTimeout(localConfig.saveDataHandle)
    localConfig.saveDataHandle = setTimeout(SaveChatMessagesToServerScheduler, serverConfig.chatMessageBackupTimer * 1000)

}// ============================================================================
//                     FUNCTION: postChatTrigger
// ============================================================================
function postChatTrigger (data)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            localConfig.EXTENSION_NAME,
            sr_api.ExtensionPacket(
                data.messagetype,
                localConfig.EXTENSION_NAME,
                data,
                serverConfig.channel
            ),
            serverConfig.channel
        ));

}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return structuredClone(triggersandactions.triggers[i]);
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                     FUNCTION: process_chat_data
// ============================================================================
// Description: receives twitch chat messages
// ============================================================================
function process_chat_data (channel, tags, chatmessage)
{
    /* console.log("------------ process_chat_data ---------------")
    console.log("channel", channel)
    console.log("tags", tags)
    console.log("chatmessage", chatmessage)
    */
    let data = {
        channel: channel,
        message: chatmessage,
        dateStamp: Date.now(),
        data: tags
    };
    if (serverConfig.DEBUG_EXTRA_CHAT_MESSAGE === "on")
        console.log("twitchchat:process_chat_data: ", tags, " : ", chatmessage)

    if (tags == null)
    {
        if (serverConfig.DEBUG_EXTRA_CHAT_MESSAGE === "on")   
        {
            console.log("############## NULL tags received in message ################")
            console.log("process_chat_data", channel, tags, chatmessage)
        }
        return;
    }
    data.message = chatmessage

    // set the channel name
    data.channel = channel
    if (localConfig.twitchClient["user"].state.readonly)
        data.channel += " [Readonly]"
    if (localConfig.twitchClient["user"].state.emoteonly)
        data.channel += " [Emoteonly]"
    if (localConfig.twitchClient["user"].state.followersonly != -1)
        data.channel += " [Followersonly (" + localConfig.twitchClient["user"].state.followersonly + ")]"
    if (localConfig.twitchClient["user"].state.r9k)
        data.channel += " [r9k]"
    if (localConfig.twitchClient["user"].state.slowmode)
        data.channel += " [Slowmode]"
    if (localConfig.twitchClient["user"].state.subsonly)
        data.channel += " [Subsonly]"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ChannelData",
            localConfig.EXTENSION_NAME,
            sr_api.ExtensionPacket(
                "ChatMessage",
                localConfig.EXTENSION_NAME,
                data,
                serverConfig.channel
            ),
            serverConfig.channel
        ));
    // lets store the chat history
    serverData.chatMessageBuffer.push(data);
    // keep the number of chat items down to the size of the buffer.
    while (serverData.chatMessageBuffer.length > serverConfig.chatMessageBufferMaxSize)
        serverData.chatMessageBuffer.shift();
}

// ============================================================================
//                     FUNCTION: action_SendChatMessage
// ============================================================================
// Description: Send message to twitch
// ===========================================================================
function action_SendChatMessage (channel, data)
{
    let sent = false
    let account = null;
    if (serverConfig.enabletwitchchat == "off")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Trying to send twitch message with twitchchat turned off", data.account, data.message)
        return;
    }
    try
    {
        if (data.account === "" || data.account === "bot" || (localConfig.usernames.bot && localConfig.usernames.bot.name == data.account))
            account = "bot"
        else if (data.account === "user" || (localConfig.usernames.user && localConfig.usernames.user.name == data.account))
            account = "user"

        if (account && localConfig.twitchClient[account].connection && localConfig.twitchClient[account].state.connected)
        {
            console.log("sending IRC message", "PRIVMSG #" + channel + ":" + data.message)
            localConfig.twitchClient[account].connection.send("PRIVMSG #" + channel + ":" + data.message)
            sent = true;
        }
        if (!sent)
        {
            console.log("======= checking send status")
            console.log("account, state\n", account, localConfig.twitchClient[account].state)
            if (account && localConfig.twitchClient[account].state.connected)
            {
                console.log("post connection data", localConfig.twitchClient[account])
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, couldn't send message. user not available. from", account, "to", data.account)
            }
            else
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, User not connected (have you setup your credentials in the admin page)", data.account)
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "(Failed to send to twitch) " + data.account, "emotes": "", "message-type": "chat" }, data.message)
        }
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch.say error", e.message)
    }
}

// ============================================================================
//                           FUNCTION: handleMessage
// ============================================================================
function handleMessage (account, data)
{
    /*
    check https://modern.ircdocs.horse/#rplnamreply-353 for message numbers
    
    */
    console.log("----------------- handleMessage ---------------")
    //console.log("account, data.command:", account, data.command)
    let triggertosend = {};
    try
    {
        /*logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Connecting with OAUTH for ", localConfig.usernames[account]["name"])
        try 
        {
            try
            {
                localConfig.twitchClient[account].connection = new tmi.Client({
                    options: { debug: false, messagesLogLevel: "info" },
                    connection: { reconnect: true, secure: true },
                    identity: {
                        username: localConfig.usernames[account]["name"],//'bot-name',
                        password: localConfig.usernames[account]["oauth"]//'oauth:my-bot-token'
                    },
                    channels: [serverConfig.streamername]
                })
                localConfig.twitchClient[account].connection = new WebSocketClient();
                localConfig.twitchClient[account].connection.on('connectFailed', function (error)
                {
                    console.log('Connect Error: ' + error.toString());
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".websocket connect", error.toString());
                    return;
                });
                localConfig.twitchClient[account].connection.connect('ws://irc-ws.chat.twitch.tv:80')
            }
            catch (err)
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Failed to get twitch client for" + account + ":", err);
            }
    
            
    */
        // ############################################# USER DEBUGGING MESSAGES ################################################
        if (serverConfig.DEBUG_LOG_DATA_TO_FILE === "on") 
        {
            // raw_message gives you every type of message in the system. used for debugging if you think you are missing messages
            file_log("raw_message", data.tags, data.command.parameters);
        }
        // #################################################################################################################
        // ############################################# USER ONLY MESSAGES ################################################
        // #################################################################################################################
        // we don't want to receive messages for the bot accounts, the user account login will be used to display chat
        if (account === "user")
        {
            // parse all the messages and create our streamroller triggers/alerts/twitchchat message socket packets
            switch (data.command.command)
            {
                case "CAP": // Server Capabilities message
                    // do nothing for server capabilities
                    return;
                case "001": // connected to chat (welcome message)
                    // handled in all user messages
                    break;
                case "PRIVMSG": // aka chat messages
                    console.log("================" + logger.warnColour + "PRIVMSG" + logger.resetColour + "================")
                    // remove the newling chars
                    var message = data.parameters.replace("\r\n", " ")
                    // log to file if anabled
                    file_log("chat", data.tags, message);

                    //add the streamroller message type field
                    data.tags["message-type"] = "chat"

                    // send our standard channel message out (need to update extensions to use triggers to delete this message eventually)
                    process_chat_data(data.source.nick, data.tags, message);

                    // Setup trigger
                    triggertosend = findtriggerByMessageType("trigger_ChatMessageReceived")
                    triggertosend.parameters.type = "trigger_ChatMessageReceived"
                    triggertosend.parameters.htmlMessage = data.tags['display-name'] + ": " + message
                    triggertosend.parameters.sender = data.tags['display-name']
                    triggertosend.parameters.message = message
                    triggertosend.parameters.firstmessage = data.tags['first-msg']
                    triggertosend.parameters.mod = data.tags.mod
                    triggertosend.parameters.color = data.tags.color
                    triggertosend.parameters.subscriber = data.tags.subscriber
                    triggertosend.parameters.vip = data.tags.vip == true
                    triggertosend.parameters.platform = "twitch"
                    postChatTrigger(triggertosend)
                    return;
                case "JOIN": // join messages
                    /*
                    two types of messages. when we join and when other join.
                    need to ignore our messages and then parse multiple joins from the other messages.
                    {
                        tags: null,
                        source: {
                            nick: 'olddepressedgamer',
                            host: 'olddepressedgamer@olddepressedgamer.tmi.twitch.tv'
                        },
                        command: { command: 'JOIN', channel: '#olddepressedgamer' },
                        parameters: 'olddepressedgamer.tmi.twitch.tv 353 olddepressedgamer = #olddepressedgamer :olddepressedgamer\r\n' +
                            ':olddepressedgamer.tmi.twitch.tv 366 olddepressedgamer #olddepressedgamer :End of /NAMES list\r\n'
                    }
                    {
                      tags: null,
                      source: {
                        nick: 'miserablemarvin',
                        host: 'miserablemarvin@miserablemarvin.tmi.twitch.tv'
                      },
                      command: { command: 'JOIN', channel: '#olddepressedgamer' },
                      parameters: 'nightbot!nightbot@nightbot.tmi.twitch.tv JOIN #olddepressedgamer\r\n' +
                        ':streamelements!streamelements@streamelements.tmi.twitch.tv JOIN #olddepressedgamer\r\n'
                    }
                     */
                    //console.log(data)
                    var channel = data.command.channel;
                    var username = data.source.nick;

                    // note that multiple joins may appear in the same message.
                    console.log("================" + logger.warnColour, username, "JOIN TBD" + logger.resetColour + "================")

                    if (serverConfig.checkforbots == "on")
                    {
                        file_log("join", channel, username);
                        process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "join" }, "joined");
                        triggertosend = findtriggerByMessageType("trigger_ChatJoin")
                        triggertosend.parameters.type = "trigger_ChatJoin"
                        triggertosend.parameters.htmlMessage = username + " Joined " + channel
                        triggertosend.parameters.username = username
                        triggertosend.parameters.channel = channel
                        triggertosend.parameters.platform = "twitch"
                        //console.log("postChatTrigger", triggertosend)
                        postChatTrigger(triggertosend);
                    }
                    return;

                case "USERSTATE": // join messages
                    // TBD
                    return;
                case "PING":
                    return;
                default:
                    console.log(logger.warnColour, localConfig.usernames[account].name, "message unhandled", data.command.command, logger.resetColour, data)
                    return;
            }
        }

        // parse all users messages 
        switch (data.command.command)
        {

            case "CAP": // Server Capabilities message
                // do nothing for server capabilities
                break;
            case "001": // connected to chat (welcome message)
                console.log("Welcome to channel #", data.command.channel, " ", localConfig.usernames[account]["name"])
                localConfig.twitchClient[account].state.readonly = false;
                localConfig.twitchClient[account].state.connected = true;
                // send message to chat (displays in liveportal)
                // delayed as this can be sent on reload so the liveportal may not be ready without the delay
                setTimeout(() =>
                {
                    process_chat_data("#" + data.command.channel.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, account + ": " + localConfig.usernames[account]["name"] + " connected to " + data.command.channel)
                }, 2000);
                break;
            case "PRIVMSG": // aka chat messages
                // handled in user account to avoid duplicate chat messagexsmessages
                break;
            case "JOIN":
                // handled in user account
                break;
            case "PING":
                break;
            case "USERSTATE": // join messages
                // TBD
                return;
            default:
                console.log(logger.warnColour, "allusers:", localConfig.usernames[account].name, "message unknown", data.command.command, logger.resetColour)
                break;
        }

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".handleMessage", "Error ", err.message);
    }

    /*
    
                localConfig.twitchClient[account].connection.on("action", (channel, userstate, message, self) => 
                {
                    file_log("action", userstate, message);
                    process_chat_data(channel, userstate, message);
                    triggertosend = findtriggerByMessageType("trigger_ChatActionReceived")
                    triggertosend.parameters.type = "trigger_ChatActionReceived"
                    triggertosend.parameters.htmlMessage = message
                    triggertosend.parameters.sender = userstate['display-name']
                    triggertosend.parameters.message = message
                    triggertosend.parameters.firstmessage = userstate['first-msg']
                    triggertosend.parameters.mod = userstate.mod
                    triggertosend.parameters.color = userstate.color
                    triggertosend.parameters.subscriber = userstate.subscriber
    
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("ban", (channel, username, reason, userstate) => 
                {
                    file_log("ban", userstate, reason);
                    userstate['display-name'] = localConfig.usernames.bot["name"];
                    userstate["message-type"] = "ban";
                    process_chat_data(channel, userstate, " Ban: (" + username + "), reason: " + ((reason) ? reason : "Not Specified"));
    
                    triggertosend = findtriggerByMessageType("trigger_ChatBanReceived")
                    triggertosend.parameters.type = "trigger_ChatBanReceived"
                    triggertosend.parameters.htmlMessage = username + " was banned for " + userstate['ban-duration'] + "s:" + ((reason) ? reason : "")
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = reason
    
                    postChatTrigger(triggertosend)
                });
    
                localConfig.twitchClient[account].connection.on("messagedeleted", (channel, username, deletedMessage, userstate) => 
                {
                    file_log("messagedeleted", userstate, deletedMessage); userstate['display-name'] = localConfig.usernames.bot["name"];
                    process_chat_data(channel, userstate, "Message deleted: (" + username + ") " + deletedMessage);
                    triggertosend = findtriggerByMessageType("trigger_ChatMessageDeleted")
                    triggertosend.parameters.type = "trigger_ChatMessageDeleted"
                    triggertosend.parameters.htmlMessage = username + "'s message was deleted"
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = deletedMessage
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("primepaidupgrade", (channel, username, methods, userstate) => 
                {
                    file_log("primepaidupgrade", userstate, methods);
                    process_chat_data(channel, userstate, "");
                    triggertosend = findtriggerByMessageType("trigger_ChatPrimePaidUpgrade")
                    triggertosend.parameters.type = "trigger_ChatPrimePaidUpgrade"
                    triggertosend.parameters.htmlMessage = username + " upgraded their prime"
                    triggertosend.parameters.username = username
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("raided", (channel, username, viewers) => 
                {
                    file_log("raided", username, viewers);
                    process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "raided", "viewers": viewers }, "raided: Raid from " + username + " with " + viewers);
                    triggertosend = findtriggerByMessageType("trigger_ChatRaid")
                    triggertosend.parameters.type = "trigger_ChatRaid"
                    triggertosend.parameters.htmlMessage = username + " raided with " + viewers
                    triggertosend.parameters.username = username
                    triggertosend.parameters.viewers = viewers
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("redeem", (channel, username, rewardType, tags, message) => 
                {
                    file_log("redeem", tags, message);
                    file_log("redeem", tags, rewardType);
    
                    process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "redeem", tags: tags }, message + "");
                    triggertosend = findtriggerByMessageType("trigger_ChatRedeem")
                    triggertosend.parameters.type = "trigger_ChatRedeem"
                    triggertosend.parameters.htmlMessage = username + " redeemed chat points"
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = message
                    triggertosend.parameters.rewardType = rewardType
    
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("resub", (channel, username, months, message, userstate, methods) => 
                {
                    file_log("resub", userstate, message); userstate['display-name'] = localConfig.usernames.bot["name"];
                    process_chat_data(channel, userstate, ((message) ? message : ""));
                    triggertosend = findtriggerByMessageType("trigger_ChatResub")
                    triggertosend.parameters.type = "trigger_ChatResub"
                    triggertosend.parameters.htmlMessage = username + " resubbed: " + ((message) ? message : "")
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = message
                    triggertosend.parameters.months = months
    
                    postChatTrigger(triggertosend)
                });
                //('ritual', ritualName, channel, username, tags, msg);
                localConfig.twitchClient[account].connection.on("ritual", (ritualName, channel, username, userstate, message) => 
                {
                    file_log("ritual", userstate, message); userstate['display-name'] = localConfig.usernames.bot["name"];
                    process_chat_data(channel, userstate, ((message) ? message : ""));
                    triggertosend = findtriggerByMessageType("trigger_ChatRitual")
                    triggertosend.parameters.type = "trigger_ChatRitual"
                    triggertosend.parameters.ritualName = ritualName
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = message
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("roomstate", (channel, state) =>
                {
                    file_log("roomstate", state, channel);
                    localConfig.twitchClient["user"].state.emoteonly = state["emote-only"];
                    localConfig.twitchClient["user"].state.followersonly = (state['followers-only'] === false) ? 0 : state['followers-only'];
                    localConfig.twitchClient["user"].state.r9k = state.r9k;
                    localConfig.twitchClient["user"].state.slowmode = state.slow;
                    localConfig.twitchClient["user"].state.subsonly = state['subs-only'];
    
                    triggertosend = findtriggerByMessageType("trigger_ChatRoomstate")
                    triggertosend.parameters.type = "trigger_ChatRoomstate"
                    triggertosend.parameters.htmlMessage = "Roomstate changed"
                    triggertosend.parameters.channel = channel
                    triggertosend.parameters.emoteonly = state["emote-only"]
                    triggertosend.parameters.followersonly = (state['followers-only'] === false) ? 0 : state['followers-only']
                    triggertosend.parameters.r9k = state.r9k
                    triggertosend.parameters.slow = state.slow
                    triggertosend.parameters.subsonly = state['subs-only']
    
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("subscription", (channel, username, methods, message, userstate) => 
                {
                    file_log("subscription", userstate, message); userstate['display-name'] = localConfig.usernames.bot["name"];
                    process_chat_data(channel, userstate, message);
                    triggertosend = findtriggerByMessageType("trigger_ChatSubscription")
                    triggertosend.parameters.type = "trigger_ChatSubscription"
                    triggertosend.parameters.htmlMessage = username + " subscribed: " + message
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = message
                    triggertosend.parameters.subplan = userstate["msg-param-sub-plan"]
                    postChatTrigger(triggertosend)
                });
                localConfig.twitchClient[account].connection.on("timeout", (channel, username, reason, duration, userstate) => 
                {
                    file_log("timeout", userstate, reason); userstate['display-name'] = localConfig.usernames.bot["name"]; userstate["message-type"] = "timeout";
                    process_chat_data(channel, userstate, " Timeout: (" + username + ") " + duration + " " + ((reason) ? reason : ""));
                    triggertosend = findtriggerByMessageType("trigger_ChatTimeout")
                    triggertosend.parameters.type = "trigger_ChatTimeout"
                    triggertosend.parameters.htmlMessage = username + " was timedout for " + duration + "s:" + ((reason) ? reason : "")
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = reason
                    triggertosend.parameters.duration = duration
                    postChatTrigger(triggertosend)
                });
    
                //////////////////////////////// Anything above here is considered done here, and in liveportal 
                localConfig.twitchClient[account].connection.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => 
                {
                    file_log("submysterygift", userstate, username); userstate['display-name'] = localConfig.usernames.bot["name"];
                    process_chat_data(channel, userstate, userstate['system-msg']);
                    triggertosend = findtriggerByMessageType("trigger_ChatSubMysteryGift")
                    triggertosend.parameters.type = "trigger_ChatSubMysteryGift"
                    triggertosend.parameters.htmlMessage = userstate['system-msg']
                    triggertosend.parameters.username = username
                    triggertosend.parameters.message = userstate['system-msg']
                    postChatTrigger(triggertosend)
                });
                // still working on these single user ones
                localConfig.twitchClient[account].connection.on("automod", (channel, msgID, message) =>
                {
                    file_log("automod", msgID, message);
                    process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "automod" }, "automod:" + msgID + " : " + message);
                    triggertosend = findtriggerByMessageType("trigger_ChatAutoMod")
                    triggertosend.parameters.type = "trigger_ChatAutoMod"
                    triggertosend.parameters.htmlMessage = "no default message"
                    triggertosend.parameters.msgID = msgID
                    triggertosend.parameters.message = message
    
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("reconnect", () => 
                {
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "reconnect" }, "reconnect: Reconnect");
                    triggertosend = findtriggerByMessageType("trigger_ChatReconnect")
                    triggertosend.parameters.type = "trigger_ChatReconnect"
                    triggertosend.parameters.htmlMessage = "Reconnect"
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("anongiftpaidupgrade", (channel, username, userstate) => 
                {
                    file_log("anongiftpaidupgrade", userstate, username);
                    process_chat_data(channel, userstate, "anongiftpaidupgrade: " + username);
                    triggertosend = findtriggerByMessageType("trigger_ChatAnonGiftPaidUpgrade")
                    triggertosend.parameters.type = "trigger_ChatAnonGiftPaidUpgrade"
                    triggertosend.parameters.htmlMessage = username + " received an annonomous paid upgrade (I think)"
                    triggertosend.parameters.username = username
    
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("anonsubmysterygift", (channel, numbOfSubs, methods, userstate) => 
                {
                    file_log("anonsubmysterygift", userstate, methods);
                    process_chat_data(channel, userstate, "anonsubmysterygift: " + numbOfSubs);
                    triggertosend = findtriggerByMessageType("trigger_ChatAnonSubMysteryGift")
                    triggertosend.parameters.type = "trigger_ChatAnonSubMysteryGift"
                    triggertosend.parameters.htmlMessage = "anon sub mystery gift x" + numbOfSubs
                    triggertosend.parameters.numbOfSubs = numbOfSubs
                    triggertosend.parameters.message = "anonsubmysterygift: " + numbOfSubs
                    postChatTrigger(triggertosend);
    
                });
                localConfig.twitchClient[account].connection.on("anonsubgift", (channel, streakMonths, recipient, methods, userstate) => 
                {
                    file_log("anonsubgift", userstate, methods);
                    process_chat_data(channel, userstate, "anonsubgift: " + streakMonths + " : " + recipient);
                    triggertosend = findtriggerByMessageType("trigger_ChatAnonSubGift")
                    triggertosend.parameters.type = "trigger_ChatAnonSubGift"
                    triggertosend.parameters.htmlMessage = recipient + " received an anon sub gift"
                    triggertosend.parameters.recipient = recipient
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("cheer", (channel, userstate, message,) => 
                {
                    file_log("cheer", userstate, message);
                    process_chat_data(channel, userstate, "cheer: " + message);
                    triggertosend = findtriggerByMessageType("trigger_ChatCheer")
                    triggertosend.parameters.type = "trigger_ChatCheer"
                    triggertosend.parameters.htmlMessage = userstate["username"] + " received an anon sub gift: " + message
                    triggertosend.parameters.username = userstate["username"]
                    triggertosend.parameters.message = message
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("mod", (channel, username) => 
                {
                    file_log("mod", username, "");
                    process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "mod" }, "mod:" + username);
                    triggertosend = findtriggerByMessageType("trigger_ChatMod")
                    triggertosend.parameters.type = "trigger_ChatMod"
                    triggertosend.parameters.htmlMessage = "no default message"
                    triggertosend.parameters.username = username
                    postChatTrigger(triggertosend);
                });
                */
    /* ----------------------------------------------------------
    
                localConfig.twitchClient[account].connection.on("mods", (channel, tags, message, self) => 
                {
                    file_log("mods", tags, message);
                    process_chat_data(channel, tags, "mods: " + message);
                    triggertosend = findtriggerByMessageType("trigger_ChatMods")
                    triggertosend.parameters.type= "trigger_ChatMods"
                    triggertosend.parameters.htmlMessage= "mod list received"
                    triggertosend.parameters.message= message
                    postChatTrigger(triggertosend);
                });
    ---------------------------------------------------------- */
    /*
    localConfig.twitchClient[account].connection.on("subgift", (channel, username, streakMonths, self, recipient, methods, userstate) => 
    {
        file_log("subgift", userstate, username + ":" + streakMonths + ":" + recipient);
        process_chat_data(channel, userstate, "subgift: Subgift from " + username + " for " + recipient + " months " + streakMonths);
        triggertosend = findtriggerByMessageType("trigger_ChatSubGift")
        triggertosend.parameters.type = "trigger_ChatSubGift"
        triggertosend.parameters.htmlMessage = username + " gifed a sub to " + recipient
        triggertosend.parameters.gifter = username
        triggertosend.parameters.recipient = recipient
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("subscribers", (channel, enabled) => 
    {
        file_log("subscribers", channel, enabled);
        process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "subscribers" }, "subscribers: " + enabled);
        triggertosend = findtriggerByMessageType("trigger_ChatSubscribers")
        triggertosend.parameters.type = "trigger_ChatSubscribers"
        triggertosend.parameters.htmlMessage = "List of subscribers (I think)"
        triggertosend.parameters.channel = channel
        triggertosend.parameters.enabled = enabled
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("vips", (channel, vips) => 
    {
        file_log("vips", vips, "");
        process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "vips" }, "vips: VIPS are :" + vips.join(" : "));
        triggertosend = findtriggerByMessageType("trigger_ChatVips")
        triggertosend.parameters.type = "trigger_ChatVips"
        triggertosend.parameters.htmlMessage = "List of Vips(I think)"
        triggertosend.parameters.channel = channel
        triggertosend.parameters.vips = vips
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("clearchat", (channel) => 
    {
        file_log("clear", channel, "");
        process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "clearchat" }, "clearchat: Chat has been cleared");
        triggertosend = findtriggerByMessageType("trigger_ChatClear")
        triggertosend.parameters.type = "trigger_ChatClear"
        triggertosend.parameters.htmlMessage = "Chat was cleared"
        triggertosend.parameters.channel = channel
        postChatTrigger(triggertosend);
    });
 
    //localConfig.twitchClient[account].connection.on("unhost", (channel, viewers) => { file_log("unhost", viewers, ""); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unhost" }, "unhost: Unhosted for " + viewers + "viewers"); });
 
*/
    /* -----------------------------------------------
    
                /*localConfig.twitchClient[account].connection.on("unmod", (channel, username) =>
                {
                    file_log("unmod", username, "");
                    process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unmod" }, "unmod: " + username + " UnModded");
                    triggertosend = findtriggerByMessageType("trigger_ChatUnmod")
                    triggertosend.parameters.type= "trigger_ChatUnmod"
                    triggertosend.parameters.htmlMessage= "no default message"  
                    triggertosend.parameters.username= username
                    postChatTrigger(triggertosend);
                });
                localConfig.twitchClient[account].connection.on("emotesets", (sets, obj) => 
                {
                    file_log("emotesets", sets, obj);
                    process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "emotesets" }, "emotesets: " + sets);
                    triggertosend = findtriggerByMessageType("trigger_ChatEmoteSet")
                    triggertosend.parameters.type= "trigger_ChatEmoteSet"
                    triggertosend.parameters.htmlMessage= "emote set received"
                    postChatTrigger(triggertosend);
                });
                ----------------------------------------------- */
    /* 
    localConfig.twitchClient[account].connection.on("followersonly", (channel, enabled, length) => 
    {
        file_log("followersonly", enabled, length);
        process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "followersonly" }, "followersonly: " + length + " Follower Only mode : " + enabled);
        triggertosend = findtriggerByMessageType("trigger_ChatFollowersOnly")
        triggertosend.parameters.type = "trigger_ChatFollowersOnly"
        triggertosend.parameters.htmlMessage = "Follower only mode " + enabled + " for " + length
        triggertosend.parameters.enabled = enabled
        triggertosend.parameters.length = length
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("giftpaidupgrade", (channel, username, sender, userstate) =>
    {
        file_log("giftpaidupgrade", userstate, sender + ":" + username);
        process_chat_data(channel, userstate, "giftpaidupgrade: " + sender + " updradeged " + username + " with a gift paid upgrade");
        triggertosend = findtriggerByMessageType("trigger_ChatGiftPaidUpgrade")
        triggertosend.parameters.type = "trigger_ChatGiftPaidUpgrade"
        triggertosend.parameters.htmlMessage = sender + " upgraded " + username + " to a paid sub"
        triggertosend.parameters.sender = sender
        triggertosend.parameters.recipient = username
        postChatTrigger(triggertosend);
    });
    //localConfig.twitchClient[account].connection.on("hosted", (channel, username, viewers, autohost) => { file_log("hosted", username, viewers); process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "hosted" }, "hosted: Hosted " + username + " with " + viewers + " viewers auto:" + autohost); });
    //localConfig.twitchClient[account].connection.on("hosting", (channel, target, viewers) => { file_log("hosting", target, viewers); process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "hosting" }, "hosting: Hosting " + target + " with " + viewers + "viewers"); });
    localConfig.twitchClient[account].connection.on("emoteonly", (channel, enabled) => 
    {
        file_log("emoteonly", channel, enabled);
        process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "emoteonly" }, "emoteonly: Chat emote only mode :" + enabled);
        triggertosend = findtriggerByMessageType("trigger_ChatEmoteOnly")
        triggertosend.parameters.type = "trigger_ChatEmoteOnly"
        triggertosend.parameters.htmlMessage = "Emote only mode " + enabled
        triggertosend.parameters.enabled = enabled
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("r9kbeta", (channel, tags, message, self) => 
    {
        file_log("r9kbeta", tags, message);
        process_chat_data(channel, tags, "r9kbeta: " + message);
        triggertosend = findtriggerByMessageType("trigger_Chatr9kbeta")
        triggertosend.parameters.type = "trigger_Chatr9kbeta"
        triggertosend.parameters.htmlMessage = "r9kBeta mode " + message
        triggertosend.parameters.message = message
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("slowmode", (channel, enabled, length) =>
    {
        file_log("slowmode", enabled, length);
        process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "slowmode" }, "slowmode: " + enabled + " enabled for " + length);
        triggertosend = findtriggerByMessageType("trigger_ChatSlowmode")
        triggertosend.parameters.type = "trigger_ChatSlowmode"
        triggertosend.parameters.htmlMessage = "Slowmode " + enabled + " for " + length
        triggertosend.parameters.enabled = enabled
        triggertosend.parameters.length = length
        postChatTrigger(triggertosend);
    });
    //('usernotice', msgid, channel, tags, msg)
    localConfig.twitchClient[account].connection.on("usernotice", (msgid, channel, tags, message) => 
    {
        file_log("usernotice", msgid, message);
        process_chat_data(channel, tags, message);
        triggertosend = findtriggerByMessageType("trigger_ChatUserNotice")
        triggertosend.parameters.type = "trigger_ChatUserNotice"
        triggertosend.parameters.htmlMessage = "UserNotice: " + message
        triggertosend.parameters.msgid = msgid
        triggertosend.parameters.message = message
        postChatTrigger(triggertosend);
    });
    */


    // #################################################################################################################
    // ####################################### BOT AND USER MESSAGES ###################################################
    // #################################################################################################################
    // get these messages for both accounts (user and bot)
    /*
    localConfig.twitchClient[account].connection.on("whisper", (from, userstate, message, self) => 
    {
        file_log("whisper", userstate, message);
        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": from, "emotes": "", "message-type": "whisper" }, "whisper: " + message);
        triggertosend = findtriggerByMessageType("trigger_ChatWhisper")
        triggertosend.parameters.type = "trigger_ChatWhisper"
        triggertosend.parameters.htmlMessage = "Whisper from " + from + ": " + message
        triggertosend.parameters.from = from
        triggertosend.parameters.message = message
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("notice", (channel, msgid, message) => 
    {
        file_log("notice", msgid, message);
        process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "notice" }, message);
        triggertosend = findtriggerByMessageType("trigger_ChatNotice")
        triggertosend.parameters.type = "trigger_ChatNotice"
        triggertosend.parameters.htmlMessage = "Notice: " + message
        triggertosend.parameters.msgid = msgid
        triggertosend.parameters.message = message
        postChatTrigger(triggertosend);
    });
 
 
    // Still to be tested before adding directly to the code might be single user/multiple registrations or none
    localConfig.twitchClient[account].connection.on("disconnected", (reason) =>
    {
        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "disconnected" }, "disconnected: " + reason);
        triggertosend = findtriggerByMessageType("trigger_ChatDisconnected")
        triggertosend.parameters.type = "trigger_ChatDisconnected"
        triggertosend.parameters.htmlMessage = "Disconnected: " + reason
        triggertosend.parameters.reason = reason
        postChatTrigger(triggertosend);
    });
    */
    /*=====================================================
    localConfig.twitchClient[account].connection.on("serverchange", (channel) => 
    {
        file_log("serverchange", channel, channel);
        process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "serverchange" }, "serverchange: " + channel);
        triggertosend = findtriggerByMessageType("trigger_ChatServerChange")
        triggertosend.parameters.type= "trigger_ChatServerChange"
        triggertosend.parameters.htmlMessage= "Server changed to " + channel  
        triggertosend.parameters.channel= channel
        postChatTrigger(triggertosend);
    });
    -----------------------------------------------*/
    /*
    localConfig.twitchClient[account].connection.on("connected", (address, port) => 
    {
        file_log("connected", address, port);
        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connected" }, "connected:" + address + ": " + port);
        triggertosend = findtriggerByMessageType("trigger_ChatConnected")
        triggertosend.parameters.type = "trigger_ChatConnected"
        triggertosend.parameters.htmlMessage = "Connected to " + address + ":" + port
        triggertosend.parameters.address = address
        triggertosend.parameters.port = port
        postChatTrigger(triggertosend);
    });
    */
    /*-----------------------------------------------
    localConfig.twitchClient[account].connection.on("connecting", (address, port) => 
    {
        file_log("connecting", address, port);
        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connecting" }, "connecting: " + address + ":" + port);
        triggertosend = findtriggerByMessageType("trigger_ChatConnecting")
        triggertosend.parameters.type= "trigger_ChatConnecting"
        triggertosend.parameters.htmlMessage= "Connecting to " + address + ":" + port     
        triggertosend.parameters.address= address
        triggertosend.parameters.port= port
        postChatTrigger(triggertosend);
    });
    localConfig.twitchClient[account].connection.on("logon", () => 
    {
        file_log("logon", "", "");
        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "logon" }, "logon:");
        triggertosend = findtriggerByMessageType("trigger_ChatLogon")
        triggertosend.parameters.type= "trigger_ChatLogon"
        triggertosend.parameters.htmlMessage= "Logon "
        postChatTrigger(triggertosend);
    });
    ----------------------------------------------- */
    /*
    
 
    
 
 
}
});
 
/* -----------------------------------------------
localConfig.twitchClient[account].connection.on("part", (channel, username, self) =>
{
file_log("part", channel, username); 
//process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "part" }, "part: " + username);
triggertosend = findtriggerByMessageType("trigger_ChatPart")
triggertosend.parameters.type= "trigger_ChatPart"
triggertosend.parameters.htmlMessage= username+ " Left"
triggertosend.parameters.username= username
postChatTrigger(triggertosend);
});  -----------------------------------------------*/

    //localConfig.twitchClient[account].connection.on("ping", () => { file_log("ping", "", "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "ping" }, "ping"); */ });
    //localConfig.twitchClient[account].connection.on("pong", (latency) => { file_log("pong", String(latency), "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "pong" }, String(latency));*/ });

    console.log("-------------- END handleMessage -------------")
}
// ============================================================================
//                           FUNCTION: file_log
//                       For debug purposes. logs raw message data
// ============================================================================
let filestreams = [];
let basedir = "chatdata/";
function file_log (type, tags, message)
{
    try
    {
        //console.log("file_log", type, tags, message)
        if (serverConfig.DEBUG_LOG_DATA_TO_FILE)
        {
            var newfile = false;
            var filename = "__noname__";
            var buffer = "\n//#################################\n";
            // sometimes tags are a string, lets create an object for it to log
            if (typeof tags != "object")
                tags = { tag_converted_to_string: tags }

            if (!fs.existsSync(basedir + type))
            {
                newfile = true;
                fs.mkdirSync(basedir + type, { recursive: true });
            }

            // check if we already have this handler
            if (!filestreams.type)
            {
                if (!tags["message-type"])
                {
                    filename = "__" + type;
                    tags["message-type"] = filename;
                }
                else
                    filename = tags["message-type"];

                filestreams[type] = fs.createWriteStream(basedir + type + "/" + filename + ".js", { flags: 'a' });

            }
            if (newfile)
            {
                buffer += "let " + type + ";\n";
                buffer += "let message='" + message + "'\n"
            }
            else
                buffer += "message='" + message + "'\n"

            buffer += type + "=";
            buffer += JSON.stringify(tags, null, 2);
            buffer += "\n";
            filestreams[type].write(buffer);
            //bad coding but can't end it here (due to async stuff) and it is just debug code (just left as a reminder we have a dangling pointer)
            filestreams[type].end("")
        }
    }
    catch (error)
    {
        console.log("debug file logging crashed", error.message)
    }
}
// ============================================================================
//                           FUNCTION: updateUserList
// ============================================================================
/*function updateUserList (data)
{
    if (serverConfig.updateUserLists == "on")
    {
        sr_api.sendMessage(
            localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "UpdateUserData",
                    localConfig.EXTENSION_NAME,
                    data,
                    "",
                    "users"
                ),
                "",
                "users"
            )
        )
    }
}*/

// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let connected = localConfig.twitchClient["user"].state.connected && localConfig.twitchClient["bot"].state.connected
    let readonly = localConfig.twitchClient["user"].state.readonly && localConfig.twitchClient["bot"].state.readonly

    if (serverConfig.enabletwitchchat === "off")
        connected = false;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    readonly: readonly,
                    connected: connected
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
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", "connectToSE Error:", err);
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
//                           EXPORTS: initialise
// ============================================================================
export { initialise };

