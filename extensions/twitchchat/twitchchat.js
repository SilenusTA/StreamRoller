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
/**
 * @extension TwitchChat
 * Access to Twitch Chat IRC for sending/receiving message and also some alerts/notifications
 */
// ############################# TWITCHCHAT.js ##############################
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
// Description: Import/Variable section
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
    joinChannelScheduleHandle: null,

    //avoid swamping reconnection
    connectToTwitchSchedulerTimeout: 3000,
    connectToTwitchSchedulerHandle: [],
};
localConfig.twitchClient["bot"] = {
    connection: null,
    connecting: false,
    channelState: [],// monitor joins
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
    channelState: [],// monitor joins
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
        dateStamp: Date.now(),
        message: "Empty chat buffer",
        data: { 'display-name': serverConfig.streamername, emotes: '' }
    }
    ],
}

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Twitch Chat.",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [{
            name: "TwitchChatChatMessageReceived",
            displaytitle: "Twitch Chat Message",
            description: "A chat message was received. textMessage field has name and message combined",
            messagetype: "trigger_ChatMessageReceived",
            parameters: {
                type: "trigger_ChatMessageReceived",
                textMessage: "[username]: [message]",
                sender: "",
                message: "",
                safemessage: "",
                color: "",
                firstmessage: false,
                mod: false,
                subscriber: false,
                vip: false,
                platform: "Twitch"
            }
        }, {
            name: "TwitchChatActionReceived",
            displaytitle: "Chat Action",
            description: "A chat action was received (a /me message)",
            messagetype: "trigger_ChatActionReceived",
            parameters: {
                type: "trigger_ChatActionReceived",
                textMessage: "[message]",
                sender: "",
                message: "",
                color: "",
                firstmessage: false,
                mod: false,
                subscriber: false
            }
        }, {
            name: "TwitchChatBanReceived",
            displaytitle: "Chat Ban",
            description: "A chat users was banned",
            messagetype: "trigger_ChatBanReceived",
            parameters: {
                type: "trigger_ChatBanReceived",
                textMessage: "[username] was banned for [timeout]s: [reason]",
                username: "",
                message: ""
            }
        }, {
            name: "TwitchChatMessageDeletedReceived",
            displaytitle: "Chat MessageDeleted",
            description: "A chat message was deleted ",
            messagetype: "trigger_ChatMessageDeleted",
            parameters: {
                type: "trigger_ChatMessageDeleted",
                textMessage: "[Username]'s message was deleted",
                username: "",
                message: ""
            }
        }, {
            name: "TwitchChatPrimePaidUpgradeReceived",
            displaytitle: "Chat PrimePaidUpgrade",
            description: "A user paid to upgrade their prime sub ",
            messagetype: "trigger_ChatPrimePaidUpgrade",
            parameters: {
                type: "trigger_ChatPrimePaidUpgrade",
                textMessage: "[Username] upgraded their prime",
                username: ""
            }
        }, {
            name: "TwitchChatRaidReceived",
            displaytitle: "Someone Raided",
            description: "Another streamer raided you",
            messagetype: "trigger_ChatRaid",
            parameters: {
                type: "trigger_ChatRaid",
                textMessage: "[Username] raided with [viewers]",
                username: "",
                viewers: ""
            }
        }, {
            name: "TwitchChatRedeemReceived",
            displaytitle: "Points Redeemed",
            description: "Viewer reddemed chat points",
            messagetype: "trigger_ChatRedeem",
            parameters: {
                type: "trigger_ChatRedeem",
                textMessage: "[Username] redeemed chat points",
                username: "",
                message: "",
                rewardType: ""
            }
        }, {
            name: "TwitchChatResubReceived",
            displaytitle: "Someone Resubbed",
            description: "Someone Resubbed",
            messagetype: "trigger_ChatResub",
            parameters: {
                type: "trigger_ChatResub",
                textMessage: "[Username] resubbed: [message]",
                username: "",
                message: "",
                months: ""
            }
        }, {
            name: "TwitchChatRitualReceived",
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
            name: "TwitchChatRoomstateReceived",
            displaytitle: "Roomstate message",
            description: "This message contains things like sub-only mode etc",
            messagetype: "trigger_ChatRoomstate",
            parameters: {
                type: "trigger_ChatRoomstate",
                textMessage: "Roomstate changed",
                channel: "",
                emoteonly: false,
                followersonly: "-1",
                r9k: false,
                slow: false,
                subsonly: false
            }
        }, {
            name: "TwitchChatSubscriptionReceived",
            displaytitle: "Someone Subscribed",
            description: "Someone Subscribed",
            messagetype: "trigger_ChatSubscription",
            parameters: {
                type: "trigger_ChatSubscription",
                textMessage: "[Username] subscribed: [message]",
                username: "",
                message: "",
                subplan: ""
            }
        }, {
            name: "TwitchChatTimeoutReceived",
            displaytitle: "Viewer Timeout",
            description: "A viewer was timedout",
            messagetype: "trigger_ChatTimeout",
            parameters: {
                type: "trigger_ChatTimeout",
                textMessage: "[Username] was timedout for [duration]:[reason]",
                username: "",
                message: "",
                duration: ""
            }
        }, {
            name: "TwitchChatSubMysteryGiftReceived",
            displaytitle: "SubMysteryGift",
            description: "A viewer Gifted a sub",
            messagetype: "trigger_ChatSubMysteryGift",
            parameters: {
                type: "trigger_ChatSubMysteryGift",
                textMessage: "[Username] received a giftsub",
                username: "",
                message: ""
            }
        },
        {
            name: "TwitchChatAutoModReceived",
            displaytitle: "Automod action",
            description: "Automod action happened",
            messagetype: "trigger_ChatAutoMod",
            parameters: {
                type: "trigger_ChatAutoMod",
                textMessage: "no default message",
                msgID: "",
                message: ""
            }
        },
        {
            name: "TwitchChatReconnect",
            displaytitle: "Chat Reconnected",
            description: "Chat Reconnected",
            messagetype: "trigger_ChatReconnect",
            parameters: {
                type: "trigger_ChatReconnect",
                textMessage: "Reconnect",
            }
        }, {
            name: "TwitchChatAnonGiftPaidUpgradeReceived",
            displaytitle: "Anon Gift Paid Upgrade",
            description: "Your guess is as good as mine on this one",
            messagetype: "trigger_ChatAnonGiftPaidUpgrade",
            parameters: {
                type: "trigger_ChatAnonGiftPaidUpgrade",
                textMessage: "[Username] received an annonomous paid upgrade (I think)",
                username: ""
            }
        }, {
            name: "TwitchChatAnonSubMysteryGiftReceived",
            displaytitle: "Anon Sub Mystery Gift",
            description: "Someone Gifted an Sub Anonymously",
            messagetype: "trigger_ChatAnonSubMysteryGift",
            parameters: {
                type: "trigger_ChatAnonSubMysteryGift",
                textMessage: "anon sub mystery gift x[numbOfSubs]",
                numbOfSubs: "",
                message: ""
            }
        }, {
            name: "TwitchChatAnonSubGiftReceived",
            displaytitle: "Anon Sub Gift",
            description: "Someone Gifted an Sub",
            messagetype: "trigger_ChatAnonSubGift",
            parameters: {
                type: "trigger_ChatAnonSubGift",
                textMessage: "[Username] received an anon sub gift: [message]",
                username: "",
                message: ""
            }
        }, {
            name: "TwitchChatCheerReceived",
            displaytitle: "Somone Cheered",
            description: "Someone donated bits",
            messagetype: "trigger_ChatCheer",
            parameters: {
                type: "trigger_ChatCheer",
                textMessage: "[Username] Cheered with [bits]",
                username: "",
                message: ""
            }
        },
        {
            name: "TwitchChatMod",
            displaytitle: "Mod?!?",
            description: "A Mod message was received, someone modded maybe or a mod action was performed. let me know if you know which it is",
            messagetype: "trigger_ChatMod",
            parameters: {
                type: "trigger_ChatMod",
                textMessage: "no default message",
                username: ""
            }
        },
        /* {
                name: "TwitchChatMods",
                displaytitle: "Mods?!?",
                description: "A Mods message was received, possibly a list of mods in this channel. need to log it and see",
                messagetype: "trigger_ChatMods",
                            parameters: {
                    type: "trigger_ChatMods",
                    textMessage: "mod list received",  
                    message: ""
                }
            },*/
        {
            name: "TwitchChatSubGift",
            displaytitle: "A sub was gifted",
            description: "Someone gifted a sub to another viewer",
            messagetype: "trigger_ChatSubGift",
            parameters: {
                type: "trigger_ChatSubGift",
                textMessage: "[Username] gifed a sub to [Username] ",
                gifter: "",
                recipient: ""

            }
        }, {
            name: "TwitchChatSubscribers",
            displaytitle: "Channel Subscribers",
            description: "Subscribers",
            messagetype: "trigger_ChatSubscribers",
            parameters: {
                type: "trigger_ChatSubscribers",
                textMessage: "List of subscribers (I think)",
                channel: "",
                enabled: "",
            }
        }, {
            name: "TwitchChatVipss",
            displaytitle: "Channel Vips",
            description: "Channel Vips",
            messagetype: "trigger_ChatVips",
            parameters: {
                type: "trigger_ChatVips",
                textMessage: "List of Vips(I think)",
                channel: "",
                vips: "",
            }
        }, {
            name: "TwitchChatClear",
            displaytitle: "Clear Chat",
            description: "Chat was cleared",
            messagetype: "trigger_ChatClear",
            parameters: {
                type: "trigger_ChatClear",
                textMessage: "Chat was cleared",
                channel: "",
            }
        },
        /* {
            name: "TwitchChatUnmod",
            displaytitle: "Unmod",
            description: "Someone was un-modded",
            messagetype: "trigger_ChatUnmod",
                        parameters: {
                type: "trigger_ChatUnmod",
                textMessage: "no default message",  
                username: "",
            }
        },         {
            name: "TwitchChatEmoteSet",
            displaytitle: "EmoteSet",
            description: "Emote set (currently passed through, if there is a need let me know)",
            messagetype: "trigger_ChatEmoteSet",
                        parameters: {
                type: "trigger_ChatEmoteSet",
                textMessage: "emote set received",  
                message: "",
            }
        }, */
        {
            name: "TwitchChatFollowersOnly",
            displaytitle: "FollowersOnly",
            description: "FollowersOnly mode was changed",
            messagetype: "trigger_ChatFollowersOnly",
            parameters: {
                type: "trigger_ChatFollowersOnly",
                textMessage: "Follower only mode [enabled] for [length]",
                enabled: false,
                length: ""
            }
        }, {
            name: "TwitchChatGiftPaidUpgrade",
            displaytitle: "GiftPaidUpgrade",
            description: "Someone gifted a paid upgrade",
            messagetype: "trigger_ChatGiftPaidUpgrade",
            parameters: {
                type: "trigger_ChatGiftPaidUpgrade",
                textMessage: "[Username] upgraded [Username] to a paid sub",
                sender: "",
                recipient: "",
            }
        }, {
            name: "TwitchChatEmoteOnly",
            displaytitle: "EmoteOnly",
            description: "EmoteOnly mode changed",
            messagetype: "trigger_ChatEmoteOnly",
            parameters: {
                type: "trigger_ChatEmoteOnly",
                textMessage: "Emote only mode [enabled]",
                enabled: false
            }
        }, {
            name: "TwitchChatr9kbeta",
            displaytitle: "r9kbeta",
            description: "r9kbeta mode changed",
            messagetype: "trigger_Chatr9kbeta",
            parameters: {
                type: "trigger_Chatr9kbeta",
                textMessage: "r9kBeta mode [message]",
                message: ""
            }
        }, {
            name: "TwitchChatSlowmode",
            displaytitle: "Slowmode",
            description: "Slowmode mode changed",
            messagetype: "trigger_ChatSlowmode",
            parameters: {
                type: "trigger_ChatSlowmode",
                textMessage: "Slowmode [enabled] for [length]",
                enabled: false,
                length: ""
            }
        }, {
            name: "TwitchChatWhisper",
            displaytitle: "Whisper",
            description: "Someone Whispered you or the bot",
            messagetype: "trigger_ChatWhisper",
            parameters: {
                type: "trigger_ChatWhisper",
                textMessage: "Whisper from [Username]: [message]",
                from: "",
                message: ""
            }
        }, {
            name: "TwitchChatNotice",
            displaytitle: "Notice",
            description: "You received a notice (ie about chat being in follower mode etc)",
            messagetype: "trigger_ChatNotice",
            parameters: {
                type: "trigger_ChatNotice",
                textMessage: "Notice: [message]",
                msgid: "",
                message: ""
            }
        }, {
            name: "TwitchChatUserNotice",
            displaytitle: "UserNotice",
            description: "UserNotice received",
            messagetype: "trigger_ChatUserNotice",
            parameters: {
                type: "trigger_ChatUserNotice",
                textMessage: "UserNotice: [message]",
                msgid: "",
                message: ""
            }
        }, {
            name: "TwitchChatDisconnected",
            displaytitle: "Disconnected",
            description: "Chat was Disconnected",
            messagetype: "trigger_ChatDisconnected",
            parameters: {
                type: "trigger_ChatDisconnected",
                textMessage: "Disconnected: [reason]",
                reason: ""
            }
        },
        /*{
            name: "TwitchChatServerChange",
            displaytitle: "ServerChange",
            description: "Chat server changed",
            messagetype: "trigger_ChatServerChange",
                        parameters: {
                type: "trigger_ChatServerChange",
                textMessage: "Server changed to [channel]",  
                channel: ""
            }
        },*/
        {
            name: "TwitchChatConnected",
            displaytitle: "Connected",
            description: "Chat was connected",
            messagetype: "trigger_ChatConnected",
            parameters: {
                type: "trigger_ChatConnected",
                textMessage: "Connected to [address][port]",
                address: "",
                port: ""
            }
        },
        /* {
            name: "TwitchChatConnecting",
            displaytitle: "Connecting",
            description: "Chat is connecting",
            messagetype: "trigger_ChatConnecting",
                            parameters: {
                type: "trigger_ChatConnecting",
                textMessage: "Connecting to [address][port]",  
                address: "",
                port: ""
            }
        },   {
            name: "TwitchChatLogon",
            displaytitle: "Logon",
            description: "Logged in to chat",
            messagetype: "trigger_ChatLogon",
                            parameters: {
                type: "trigger_ChatLogon",
                textMessage: "Logon",  
            }
        }, 
        */
        {
            name: "TwitchChatJoin",
            displaytitle: "Chat Join",
            description: "Someone Joined the chat",
            messagetype: "trigger_ChatJoin",
            parameters: {
                type: "trigger_ChatJoin",
                textMessage: "[username] Joined [channel]",
                username: "",
                channel: "",
                platform: ""
            }
        },
            /* {
                name: "TwitchChatPart",
                displaytitle: "Part",
                description: "Someone Left the chat",
                messagetype: "trigger_ChatPart",
                                parameters: {
                    type: "trigger_ChatPart",
                    textMessage: "[username] Left",
                    username: ""
                }
            }*/
        ],
    // these are messages we can receive to perform an action
    actions:
        [{
            name: "TwitchChatSendChatMessage",
            displaytitle: "Post Twitch Message",
            description: "Post a message to twitch chat (Note user is case sensitive)",
            messagetype: "action_SendChatMessage",
            parameters: {
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
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {object:Express} app 
 * @param {string} host 
 * @param {number} port 
 * @param {number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "host", host, "port", port, "heartbeatst", heartbeat);
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage,
            onDataCenterConnect, onDataCenterDisconnect, host, port);
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
/**
 * Called on websocket disconnect
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/** 
 * called on connection to the StreamRoller websocket
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
    // create our channel
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
/**
 * Called when we receive a message on the websocket from StreamRoller
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    try
    {
        if (server_packet.type === "ConfigFile")
        {
            // check it is our config
            if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
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
                    if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                    {
                        for (const [key, value] of Object.entries(localConfig.usernames))
                        {
                            if (localConfig.twitchClient[key].state.connected)
                                reconnectChat(key);
                            else
                                connectToTwitch(key);
                        }
                    }
                    else
                    {
                        /* Readonly connection */
                        localConfig.usernames.user = [];
                        localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                        connectToTwitch("user");
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
                                reconnectChat(key);
                            else
                                connectToTwitch(key);
                        }
                    }
                    else // connect readonly if no credentials available
                    {
                        localConfig.usernames.user = [];
                        localConfig.usernames.user["name"] = server_packet.data.twitchchatuser;
                        connectToTwitch("user");
                        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                    }
                }
            }
        }
        else if (server_packet.type === "DataFile")
        {
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
        else if (server_packet.type === "ExtensionMessage")
        {
            let extension_packet = server_packet.data;
            // -------------------- PROCESSING SETTINGS WIDGET SMALLS -----------------------
            if (extension_packet.type === "RequestSettingsWidgetSmallCode")
                SendSettingsWidgetSmall(server_packet.from);
            else if (extension_packet.type === "CredentialsFile")
            {
                // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
                // if it is empty we will use our current default and send it to the server 
                if (extension_packet.to === serverConfig.extensionname)
                {
                    // check we have been sent something
                    if (extension_packet.data != "")
                    {
                        if (extension_packet.data.twitchchatuser && extension_packet.data.twitchchatuseroauth)
                        {
                            serverConfig.username = extension_packet.data.twitchchatuser
                            localConfig.usernames.user = [];
                            localConfig.usernames.user["name"] = extension_packet.data.twitchchatuser;
                            localConfig.usernames.user["oauth"] = extension_packet.data.twitchchatuseroauth;
                        }
                        if (extension_packet.data.twitchchatbot && extension_packet.data.twitchchatbotoauth)
                        {
                            serverConfig.botname = extension_packet.data.twitchchatbot
                            localConfig.usernames.bot = [];
                            localConfig.usernames.bot["name"] = extension_packet.data.twitchchatbot;
                            localConfig.usernames.bot["oauth"] = extension_packet.data.twitchchatbotoauth;
                        }
                        // start connection
                        if (localConfig.usernames != [] && Object.keys(localConfig.usernames).length > 0)
                        {
                            for (const [key, value] of Object.entries(localConfig.usernames))
                                connectToTwitch(key);
                        }
                        else
                        {
                            /* Readonly connection */
                            localConfig.usernames.user = [];
                            localConfig.usernames.user["name"] = extension_packet.data.twitchchatuser;
                            connectToTwitch("user");
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
                                    reconnectChat(key);
                                else
                                    connectToTwitch(key);
                            }
                        }
                        else // connect readonly if no credentials available
                        {
                            localConfig.usernames.user = [];
                            localConfig.usernames.user["name"] = extension_packet.data.twitchchatuser;
                            connectToTwitch("user");
                            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": serverConfig.streamername, "emotes": "", "message-type": "twitchchat_extension" }, "No twitch users setup yet")
                        }
                    }
                }
            }
            else if (extension_packet.type === "RequestSettingsWidgetLargeCode")
                SendSettingsWidgetLarge(server_packet.from);
            else if (extension_packet.type === "SettingsWidgetSmallData")
            {
                if (extension_packet.to === serverConfig.extensionname)
                {
                    if (extension_packet.data.twitchchatresetdefaults == "on")
                    {
                        serverConfig = structuredClone(default_serverConfig);
                        console.log("\x1b[31m" + serverConfig.extensionname + " Config defaults loaded.", "Source: User request \x1b[0m");
                    }
                    else
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
                                reconnectChat(key);
                            else
                                connectToTwitch(key);
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
                                reconnectChat(key);
                            else
                                connectToTwitch(key);
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
                if (serverConfig.DEBUG_ONLY_MIMIC_POSTING_TO_TWITCH.indexOf("on") < 0)
                    action_SendChatMessage(serverConfig.streamername, extension_packet.data)
                else
                {
                    let name = ""
                    if (extension_packet.data.account
                        && localConfig.usernames[extension_packet.data.account]
                        && localConfig.usernames[extension_packet.data.account].name
                    )
                        name = localConfig.usernames[extension_packet.data.account].name
                    else if (localConfig.usernames.bot && localConfig.usernames.bot.name && extension_packet.data.account == "")
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

            clearTimeout(localConfig.joinChannelScheduleHandle);
            localConfig.joinChannelScheduleHandle = setTimeout(() =>
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
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandler Error", err);
    }
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
                "TwitchChatBuffer",
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
function SendSettingsWidgetSmall (toExtension = "")
{

    // read our modal file
    fs.readFile(__dirname + "/twitchchatsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
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
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Save our config to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            localConfig.EXTENSION_NAME,
            serverConfig));
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveCredential (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            localConfig.EXTENSION_NAME,
            {
                ExtensionName: localConfig.EXTENSION_NAME,
                CredentialName: name,
                CredentialValue: value
            },
        ));
}
// ============================================================================
//                           FUNCTION: SaveDataToServer
// ============================================================================
// Description:save data on backend data store
// Parameters: none
// ----------------------------- notes ----------------------------------------
// none
// ===========================================================================
/**
 * Save our data to the server
 */
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
/**
 * Poll timer to save the data to server to maintain a chat history over restarts
 */
function SaveChatMessagesToServerScheduler ()
{
    SaveDataToServer()
    // clear any previous timeout
    clearTimeout(localConfig.saveDataHandle)
    localConfig.saveDataHandle = setTimeout(SaveChatMessagesToServerScheduler, serverConfig.chatMessageBackupTimer * 1000)

}
// ============================================================================
//                     FUNCTION: postChatTrigger
// ============================================================================
/**
 * Posts a trigger of type data.messagetype to our channel
 * @param {object} data 
 */
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
/**
 * Finds a trigger by messagetype
 * @param {string} messagetype 
 * @returns trigger
 */
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                     FUNCTION: process_chat_data
// ============================================================================
// Description: receives twitch chat messages
// ============================================================================
/**
 * Constructs a ChatMessage type message from the given data.
 * TBD needs to be moved to a trigger type message 
 * @param {string} channel 
 * @param {object} tags 
 * @param {string} chatmessage 
  */
function process_chat_data (channel, tags, chatmessage)
{
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

    // set the channel name
    data.channel = channel
    if (localConfig.twitchClient["user"].state.readonly)
        data.channel += " [Readonly - no user connected]"
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
/**
 * Send the to twitch on the given channel or fakes a message if debug flag is on
 * and sends it out as if twitch has sent us the message back from the chat trigger
 * @param {string} channel 
 * @param {object} data 
 */
function action_SendChatMessage (channel, data, attempts = 0)
{
    let sent = false
    let account = "";
    if (serverConfig.enabletwitchchat == "off")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Trying to send twitch message with twitchchat turned off", data.account, data.message)
        return;
    }
    try
    {
        if (data.account === "bot" || (localConfig.usernames.bot && localConfig.usernames.bot.name == data.account))
            account = "bot"
        else if (data.account === "user" || (localConfig.usernames.user && localConfig.usernames.user.name == data.account))
            account = "user"
        else
            account = "bot"
        // first run we might still be waiting for chat to connect
        if (!localConfig.twitchClient[account]
            || !localConfig.twitchClient[account].connection
            || !localConfig.twitchClient[account].connection.channels
            || localConfig.twitchClient[account].connection.channels.length == 0)
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Trying to send twitch message with zero channels connected yet, scheduling wait timer number", attempts, data.account, data.message)
            if (++attempts < 5)
            {
                setTimeout(() =>
                {
                    action_SendChatMessage(channel, data, attempts)
                }, 2000)
                return;
            }
            else
            {
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Couldn't send twitch chat message, no connection or channels available", data.account, data.message)
                return;
            }
        }
        if (account && localConfig.twitchClient[account].connection && localConfig.twitchClient[account].state.connected)
        {
            localConfig.twitchClient[account].connection.say(channel, data.message)
                .then(() =>
                {
                    sent = true;
                })
                .catch((e) => 
                {
                    sent = false;
                    console.log("Received error while trying to send a chat message message from'" + data.account + "'. message was", data.message)
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".action_SendChatMessage error()", e)
                })
                .finally(() =>
                {
                    if (!sent)
                    {
                        if (account && localConfig.twitchClient[account].state.connected)
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, couldn't send message.", data.account)
                        else
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch, User not connected (have you setup your credentials in the admin page) user:", data.account, "Message:", data.message)
                        process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "(Failed to send to twitch) " + data.account, "emotes": "", "message-type": "chat" }, data.message)
                    }
                });
        }
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME, "Twitch.say error", e.message)
    }
}
// ############################# IRC Client #########################################
// ============================================================================
//                     FUNCTION: reconnectChat
// ============================================================================
/**
 * reconnect to the IRC client
 * @param {string} account 
 */
function reconnectChat (account)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Reconnecting chat " + serverConfig.streamername + ":" + serverConfig.enabletwitchchat);
    //if we are already connecting then return (might have been multiple requests sent though at the same time)
    if (localConfig.twitchClient[account].connecting)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "trying to reconnect while a connection is already in progress")
        return;
    }
    try
    {
        localConfig.twitchClient[account].connecting = true;
        var connectedChannels = localConfig.twitchClient[account].connection.getChannels();
        if (connectedChannels.length == 0)
        {
            joinChatChannel(account);
        }
        else
        {
            connectedChannels.forEach(element =>
            {
                localConfig.twitchClient[account].connection.part(element)
                    .then(channel => 
                    {
                        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "left Chat channel " + channel)

                    })
                    .catch((err) => 
                    {
                        localConfig.twitchClient[account].state.connected = false;
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".leaveAllChannels", "Leave chat failed", element, err)
                    });
            })
        }
        if (serverConfig.enabletwitchchat === "on")
        {
            joinChatChannel(account);
        }
        localConfig.twitchClient[account].connecting = false;
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".reconnectChat", "Changing stream failed for (account,streamer,err):", account, serverConfig.streamername, err.message);
        localConfig.twitchClient[account].state.connected = false;
        localConfig.twitchClient[account].connecting = false;
    }
}
// ============================================================================
//                     FUNCTION: joinChatChannel
// ============================================================================
/**
 * Join the given account to the currently selected streamer IRC chat channel
 * @param {string} account 
 */
function joinChatChannel (account)
{
    let chatmessagename = "#" + serverConfig.streamername.toLocaleLowerCase();
    let chatmessagetags = { "display-name": "System", "emotes": "" };
    if (serverConfig.enabletwitchchat === "on"
        && localConfig.twitchClient[account].channelState[serverConfig.streamername] != "connecting")
    {
        localConfig.twitchClient[account].channelState[serverConfig.streamername] = "connecting";
        try
        {
            localConfig.twitchClient[account].connection.join(serverConfig.streamername)
                .then(() =>
                {
                    localConfig.twitchClient[account].state.connected = true;
                    localConfig.twitchClient[account].channelState[serverConfig.streamername] = "connected";
                    process_chat_data(chatmessagename, chatmessagetags, "[" + account + "]Chat channel changed to " + serverConfig.streamername);
                }
                )
                .catch((err) =>
                {
                    localConfig.twitchClient[account].state.connected = false;
                    localConfig.twitchClient[account].channelState[serverConfig.streamername] = "connect failed";
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "stream join threw an error", err, " sheduling reconnect");
                    process_chat_data(chatmessagename, chatmessagetags, "Failed to join " + serverConfig.streamername)
                    setTimeout(() =>
                    {
                        reconnectChat(account)
                    }, 5000)
                });
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".joinChatChannel", "connect failed", err
            );
        }
    }
}
// ############################# IRC Client Initial Connection  #########################################
// ############################# Initial connection is readonly #########################################
import * as tmi from "tmi.js";


function connectToTwitch (account)
{
    if (!localConfig.connectToTwitchSchedulerHandle[account])
        localConfig.connectToTwitchSchedulerHandle[account] = null
    clearTimeout(localConfig.connectToTwitchSchedulerHandle[account])
    localConfig.connectToTwitchSchedulerHandle[account] = setTimeout(() =>
    {
        connectToTwitchSheduler(account)
    }, localConfig.connectToTwitchSchedulerTimeout);

}
/**
 * Connect to the IRC chat channel of the current streamer selected in the settings using the account name given
 * @param {string} account 
 */
async function connectToTwitchSheduler (account)
{
    if (localConfig.twitchClient[account].connection)
    {
        await localConfig.twitchClient[account].connection.removeAllListeners();
        await localConfig.twitchClient[account].connection.disconnect();
    }
    // check for readonly user account login (bot doesn't get logged in if no credentials set)
    if (account === "user" && serverConfig.enabletwitchchat == "on" &&
        (typeof localConfig.usernames.user["name"] === "undefined" || typeof localConfig.usernames.user["oauth"] === "undefined" ||
            localConfig.usernames.user["name"] === "" || localConfig.usernames.user["oauth"] === ""))
    {
        logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwitchSheduler", "Connecting readonly")
        localConfig.twitchClient[account].connection = new tmi.Client({ channels: [serverConfig.streamername] });
        localConfig.twitchClient[account].connection.connect()
            .then(() =>
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = true;
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwitchSheduler", "Twitch chat client connected readonly");
                process_chat_data("#" + serverConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Chat connected readonly: " + serverConfig.streamername);
            }
            )
            .catch((err) => 
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwitchSheduler", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err)
                process_chat_data("#" + serverConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Failed to join " + serverConfig.streamername)
            }
            )

        localConfig.twitchClient[account].connection.on("message", (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message);
        });
    }
    else if (serverConfig.enabletwitchchat == "on")
    // connect with Oauth connection
    {
        chatLogin(account);
    }
    else
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".connectToTwitchSheduler", "twitch chat currently set to off")
}
// ============================================================================
//                           FUNCTION: chatLogin
// ============================================================================
/**
 * Login the account provided to the IRC channel
 * @param {string} account 
 */
function chatLogin (account)
{
    let triggertosend = {};
    //logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Connecting with OAUTH for ", localConfig.usernames[account]["name"])
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
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Failed to get twitch client for", account, ":", err.message);
        }

        localConfig.twitchClient[account].connection.connect()
            .then(() =>
            {
                localConfig.twitchClient[account].state.readonly = false;
                localConfig.twitchClient[account].state.connected = true;
                /*logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat client connected with OAUTH")
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, account + ": " + localConfig.usernames[account]["name"] + " connected to " + serverConfig.streamername)*/
            })
            .catch((err) => 
            {
                localConfig.twitchClient[account].state.readonly = true;
                localConfig.twitchClient[account].state.connected = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Twitch chat connect failed for " + account + ":" + localConfig.usernames[account]["name"], err);
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Chat failed to connect to " + serverConfig.streamername + " with user: " + localConfig.usernames.bot["name"])
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Please check your settings on the admin page.")
            })

        // #################################################################################################################
        // ############################################# USER ONLY MESSAGES ################################################
        // #################################################################################################################
        // we don't want to receive messages for the bot accounts, the user account login will be used to display chat
        if (account === "user")
        {
            // ############################################# USER DEBUGGING MESSAGES ################################################
            if (serverConfig.DEBUG_LOG_DATA_TO_FILE === "on") 
            {
                // raw_message gives you every type of message in the sustem. use for debugging if you think you are missing messages
                localConfig.twitchClient[account].connection.on("raw_message", (messageCloned, message) => { file_log("raw_message", messageCloned, JSON.stringify(message)); });
                // "chat" and "message" messages appear to be the same
                //////// localConfig.twitchClient[account].connection.on("message", (channel, userstate, message, self) => {                     file_log("message", userstate, message); });
            }

            localConfig.twitchClient[account].connection.on("action", (channel, userstate, message, self) => 
            {
                file_log("action", userstate, message);
                process_chat_data(channel, userstate, message);
                triggertosend = findtriggerByMessageType("trigger_ChatActionReceived")
                triggertosend.parameters.type = "trigger_ChatActionReceived"
                triggertosend.parameters.textMessage = message
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
                triggertosend.parameters.textMessage = username + " was banned for " + userstate['ban-duration'] + "s:" + ((reason) ? reason : "")
                triggertosend.parameters.username = username
                triggertosend.parameters.message = reason

                postChatTrigger(triggertosend)
            });
            localConfig.twitchClient[account].connection.on("chat", (channel, userstate, message, self) => 
            {
                file_log("chat", userstate, message);
                // replace the html parts of the string with their escape chars
                let safemessage = sanitiseHTML(message);
                // remove non ascii chars
                safemessage = safemessage.replace(/[^\x00-\x7F]/g, "");
                // remove unicode
                safemessage = safemessage.replace(/[\u{0080}-\u{FFFF}]/gu, "");

                if (!userstate['display-name'])
                    userstate['display-name'] = "<twitchchat.error receiving message data>"

                process_chat_data(channel, userstate, message);

                triggertosend = findtriggerByMessageType("trigger_ChatMessageReceived")
                triggertosend.parameters.type = "trigger_ChatMessageReceived"
                triggertosend.parameters.textMessage = userstate['display-name'] + ": " + message
                triggertosend.parameters.sender = userstate['display-name']
                triggertosend.parameters.message = message
                triggertosend.parameters.safemessage = safemessage
                triggertosend.parameters.firstmessage = userstate['first-msg']
                triggertosend.parameters.mod = userstate.mod
                triggertosend.parameters.color = userstate.color
                triggertosend.parameters.subscriber = userstate.subscriber
                triggertosend.parameters.vip = userstate.vip == true
                triggertosend.parameters.platform = "twitch"
                postChatTrigger(triggertosend)
            });
            localConfig.twitchClient[account].connection.on("messagedeleted", (channel, username, deletedMessage, userstate) => 
            {
                file_log("messagedeleted", userstate, deletedMessage); userstate['display-name'] = localConfig.usernames.bot["name"];
                process_chat_data(channel, userstate, "Message deleted: (" + username + ") " + deletedMessage);
                triggertosend = findtriggerByMessageType("trigger_ChatMessageDeleted")
                triggertosend.parameters.type = "trigger_ChatMessageDeleted"
                triggertosend.parameters.textMessage = username + "'s message was deleted"
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
                triggertosend.parameters.textMessage = username + " upgraded their prime"
                triggertosend.parameters.username = username
                postChatTrigger(triggertosend)
            });
            localConfig.twitchClient[account].connection.on("raided", (channel, username, viewers) => 
            {
                file_log("raided", username, viewers);
                process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "raided", "viewers": viewers }, "raided: Raid from " + username + " with " + viewers);
                triggertosend = findtriggerByMessageType("trigger_ChatRaid")
                triggertosend.parameters.type = "trigger_ChatRaid"
                triggertosend.parameters.textMessage = username + " raided with " + viewers
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
                triggertosend.parameters.textMessage = username + " redeemed chat points"
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
                triggertosend.parameters.textMessage = username + " resubbed: " + ((message) ? message : "")
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
                triggertosend.parameters.textMessage = "Roomstate changed"
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
                triggertosend.parameters.textMessage = username + " subscribed: " + message
                triggertosend.parameters.username = username
                triggertosend.parameters.message = message
                triggertosend.parameters.subplan = userstate["msg-param-sub-plan"]
                postChatTrigger(triggertosend)
            });
            localConfig.twitchClient[account].connection.on("timeout", (channel, username, reason, duration, userstate) => 
            {
                file_log("timeout", userstate, reason);
                userstate['display-name'] = localConfig.usernames.bot["name"]; userstate["message-type"] = "timeout";
                process_chat_data(channel, userstate, " Timeout: (" + username + ") " + duration + " " + ((reason) ? reason : ""));
                triggertosend = findtriggerByMessageType("trigger_ChatTimeout")
                triggertosend.parameters.type = "trigger_ChatTimeout"
                triggertosend.parameters.textMessage = username + " was timedout for " + duration + "s:" + ((reason) ? reason : "")
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
                triggertosend.parameters.textMessage = userstate['system-msg']
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
                triggertosend.parameters.textMessage = "no default message"
                triggertosend.parameters.msgID = msgID
                triggertosend.parameters.message = message

                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("reconnect", () => 
            {
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "reconnect" }, "reconnect: Reconnect");
                triggertosend = findtriggerByMessageType("trigger_ChatReconnect")
                triggertosend.parameters.type = "trigger_ChatReconnect"
                triggertosend.parameters.textMessage = "Reconnect"
                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("anongiftpaidupgrade", (channel, username, userstate) => 
            {
                file_log("anongiftpaidupgrade", userstate, username);
                process_chat_data(channel, userstate, "anongiftpaidupgrade: " + username);
                triggertosend = findtriggerByMessageType("trigger_ChatAnonGiftPaidUpgrade")
                triggertosend.parameters.type = "trigger_ChatAnonGiftPaidUpgrade"
                triggertosend.parameters.textMessage = username + " received an annonomous paid upgrade (I think)"
                triggertosend.parameters.username = username

                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("anonsubmysterygift", (channel, numbOfSubs, methods, userstate) => 
            {
                file_log("anonsubmysterygift", userstate, methods);
                process_chat_data(channel, userstate, "anonsubmysterygift: " + numbOfSubs);
                triggertosend = findtriggerByMessageType("trigger_ChatAnonSubMysteryGift")
                triggertosend.parameters.type = "trigger_ChatAnonSubMysteryGift"
                triggertosend.parameters.textMessage = "anon sub mystery gift x" + numbOfSubs
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
                triggertosend.parameters.textMessage = recipient + " received an anon sub gift"
                triggertosend.parameters.recipient = recipient
                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("cheer", (channel, userstate, message,) => 
            {
                file_log("cheer", userstate, message);
                process_chat_data(channel, userstate, "cheer: " + message);
                triggertosend = findtriggerByMessageType("trigger_ChatCheer")
                triggertosend.parameters.type = "trigger_ChatCheer"
                triggertosend.parameters.textMessage = userstate["username"] + " received an anon sub gift: " + message
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
                triggertosend.parameters.textMessage = "no default message"
                triggertosend.parameters.username = username
                postChatTrigger(triggertosend);
            });
            /*
            localConfig.twitchClient[account].connection.on("mods", (channel, tags, message, self) => 
            {
                file_log("mods", tags, message);
                process_chat_data(channel, tags, "mods: " + message);
                triggertosend = findtriggerByMessageType("trigger_ChatMods")
                triggertosend.parameters.type= "trigger_ChatMods"
                triggertosend.parameters.textMessage= "mod list received"
                triggertosend.parameters.message= message
                postChatTrigger(triggertosend);
            });
*/
            localConfig.twitchClient[account].connection.on("subgift", (channel, username, streakMonths, self, recipient, methods, userstate) => 
            {
                file_log("subgift", userstate, username + ":" + streakMonths + ":" + recipient);
                process_chat_data(channel, userstate, "subgift: Subgift from " + username + " for " + recipient + " months " + streakMonths);
                triggertosend = findtriggerByMessageType("trigger_ChatSubGift")
                triggertosend.parameters.type = "trigger_ChatSubGift"
                triggertosend.parameters.textMessage = username + " gifed a sub to " + recipient
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
                triggertosend.parameters.textMessage = "List of subscribers (I think)"
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
                triggertosend.parameters.textMessage = "List of Vips(I think)"
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
                triggertosend.parameters.textMessage = "Chat was cleared"
                triggertosend.parameters.channel = channel
                postChatTrigger(triggertosend);
            });

            //localConfig.twitchClient[account].connection.on("unhost", (channel, viewers) => { file_log("unhost", viewers, ""); process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unhost" }, "unhost: Unhosted for " + viewers + "viewers"); });
            /*localConfig.twitchClient[account].connection.on("unmod", (channel, username) =>
            {
                file_log("unmod", username, "");
                process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "unmod" }, "unmod: " + username + " UnModded");
                triggertosend = findtriggerByMessageType("trigger_ChatUnmod")
                triggertosend.parameters.type= "trigger_ChatUnmod"
                triggertosend.parameters.textMessage= "no default message"  
                triggertosend.parameters.username= username
                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("emotesets", (sets, obj) => 
            {
                file_log("emotesets", sets, obj);
                process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "emotesets" }, "emotesets: " + sets);
                triggertosend = findtriggerByMessageType("trigger_ChatEmoteSet")
                triggertosend.parameters.type= "trigger_ChatEmoteSet"
                triggertosend.parameters.textMessage= "emote set received"
                postChatTrigger(triggertosend);
            });*/
            localConfig.twitchClient[account].connection.on("followersonly", (channel, enabled, length) => 
            {
                file_log("followersonly", enabled, length);
                process_chat_data(channel, { "display-name": channel, "emotes": "", "message-type": "followersonly" }, "followersonly: " + length + "min Follower Only mode : " + enabled);
                triggertosend = findtriggerByMessageType("trigger_ChatFollowersOnly")
                triggertosend.parameters.type = "trigger_ChatFollowersOnly"
                triggertosend.parameters.textMessage = "Follower only mode " + enabled + " for " + length
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
                triggertosend.parameters.textMessage = sender + " upgraded " + username + " to a paid sub"
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
                triggertosend.parameters.textMessage = "Emote only mode " + enabled
                triggertosend.parameters.enabled = enabled
                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("r9kbeta", (channel, tags, message, self) => 
            {
                file_log("r9kbeta", tags, message);
                process_chat_data(channel, tags, "r9kbeta: " + message);
                triggertosend = findtriggerByMessageType("trigger_Chatr9kbeta")
                triggertosend.parameters.type = "trigger_Chatr9kbeta"
                triggertosend.parameters.textMessage = "r9kBeta mode " + message
                triggertosend.parameters.message = message
                postChatTrigger(triggertosend);
            });
            localConfig.twitchClient[account].connection.on("slowmode", (channel, enabled, length) =>
            {
                file_log("slowmode", enabled, length);
                process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "slowmode" }, "slowmode: " + enabled + " enabled for " + length);
                triggertosend = findtriggerByMessageType("trigger_ChatSlowmode")
                triggertosend.parameters.type = "trigger_ChatSlowmode"
                triggertosend.parameters.textMessage = "Slowmode " + enabled + " for " + length
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
                triggertosend.parameters.textMessage = "UserNotice: " + message
                triggertosend.parameters.msgid = msgid
                triggertosend.parameters.message = message
                postChatTrigger(triggertosend);
            });

        }
        // #################################################################################################################
        // ####################################### BOT AND USER MESSAGES ###################################################
        // #################################################################################################################
        // get these messages for both accounts (user and bot)
        localConfig.twitchClient[account].connection.on("whisper", (from, userstate, message, self) => 
        {
            file_log("whisper", userstate, message);
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": from, "emotes": "", "message-type": "whisper" }, "whisper: " + message);
            triggertosend = findtriggerByMessageType("trigger_ChatWhisper")
            triggertosend.parameters.type = "trigger_ChatWhisper"
            triggertosend.parameters.textMessage = "Whisper from " + from + ": " + message
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
            triggertosend.parameters.textMessage = "Notice: " + message
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
            triggertosend.parameters.textMessage = "Disconnected: " + reason
            triggertosend.parameters.reason = reason
            postChatTrigger(triggertosend);
        });
        /*localConfig.twitchClient[account].connection.on("serverchange", (channel) => 
        {
            file_log("serverchange", channel, channel);
            process_chat_data(channel, { "display-name": "System", "emotes": "", "message-type": "serverchange" }, "serverchange: " + channel);
            triggertosend = findtriggerByMessageType("trigger_ChatServerChange")
            triggertosend.parameters.type= "trigger_ChatServerChange"
            triggertosend.parameters.textMessage= "Server changed to " + channel  
            triggertosend.parameters.channel= channel
            postChatTrigger(triggertosend);
        });*/
        localConfig.twitchClient[account].connection.on("connected", (address, port) => 
        {
            file_log("connected", address, port);
            /*process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connected" }, "connected:" + address + ": " + port);*/
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, account + ": " + localConfig.usernames[account]["name"] + " connected to " + serverConfig.streamername)
            triggertosend = findtriggerByMessageType("trigger_ChatConnected")
            triggertosend.parameters.type = "trigger_ChatConnected"
            triggertosend.parameters.textMessage = "Connected to " + address + ":" + port
            triggertosend.parameters.address = address
            triggertosend.parameters.port = port
            postChatTrigger(triggertosend);

        });
        /*localConfig.twitchClient[account].connection.on("connecting", (address, port) => 
        {
            file_log("connecting", address, port);
            process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "connecting" }, "connecting: " + address + ":" + port);
            triggertosend = findtriggerByMessageType("trigger_ChatConnecting")
            triggertosend.parameters.type= "trigger_ChatConnecting"
            triggertosend.parameters.textMessage= "Connecting to " + address + ":" + port     
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
            triggertosend.parameters.textMessage= "Logon "
            postChatTrigger(triggertosend);
        });
        */
        localConfig.twitchClient[account].connection.on("join", (channel, username, self) =>
        {
            if (serverConfig.checkforbots == "on")
            {
                file_log("join", channel, username);
                //process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "join" }, "join: " + channel);
                triggertosend = findtriggerByMessageType("trigger_ChatJoin")
                triggertosend.parameters.type = "trigger_ChatJoin"
                triggertosend.parameters.textMessage = username + " Joined " + channel
                triggertosend.parameters.username = username
                triggertosend.parameters.channel = channel
                triggertosend.parameters.platform = "twitch"
                postChatTrigger(triggertosend);
                // request a test to see if user is a bot if not already checked
                /*
                                sr_api.sendMessage(localConfig.DataCenterSocket,
                                    sr_api.ServerPacket(
                                        "ExtensionMessage",
                                        localConfig.EXTENSION_NAME,
                                        sr_api.ExtensionPacket(
                                            "action_TwitchGetUser",
                                            localConfig.EXTENSION_NAME,
                                            { "username": username },
                                            "",
                                            "twitch"
                                        ),
                                        "",
                                        "twitch"
                                    ));
                                */
            }
        });

        /*
        localConfig.twitchClient[account].connection.on("part", (channel, username, self) =>
        {
            file_log("part", channel, username); 
            //process_chat_data(channel, { "display-name": username, "emotes": "", "message-type": "part" }, "part: " + username);
            triggertosend = findtriggerByMessageType("trigger_ChatPart")
            triggertosend.parameters.type= "trigger_ChatPart"
            triggertosend.parameters.textMessage= username+ " Left"
            triggertosend.parameters.username= username
            postChatTrigger(triggertosend);
        });*/
        //localConfig.twitchClient[account].connection.on("ping", () => { file_log("ping", "", "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "ping" }, "ping"); */ });
        //localConfig.twitchClient[account].connection.on("pong", (latency) => { file_log("pong", String(latency), "");/* process_chat_data("#" + serverConfig.streamername.toLocaleLowerCase(), { "display-name": "System", "emotes": "", "message-type": "pong" }, String(latency));*/ });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".chatLogin", "Error ", err.message);
    }
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
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
function heartBeatCallback ()
{
    let userconnected = localConfig.twitchClient["user"].state.connected
    let botconnected = localConfig.twitchClient["bot"].state.connected
    let userreadonly = localConfig.twitchClient["user"].state.readonly
    let botreadonly = localConfig.twitchClient["bot"].state.readonly
    let colour = 'red'
    let connected = (userconnected || botconnected) && (!userreadonly || !botreadonly)
    let stats = {
        userconnected: userconnected,
        botconnected: botconnected,
        userreadonly: userreadonly,
        botreadonly: botreadonly
    }

    //is everything conencted and running
    if (serverConfig.enabletwitchchat === "on" && userconnected && botconnected && !userreadonly && !botreadonly)
    {
        colour = 'green'
        connected = true;
    }
    else if (serverConfig.enabletwitchchat === "off")
    {
        colour = "red"
        connected = false;
    }
    else
        // we are turned on but not everything is connected correctly
        colour = "orange"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                {
                    color: colour,
                    connected: connected,
                    stats
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}

// ============================================================================
//                           FUNCTION: sanitiseHTML
// ============================================================================
/**
 * This will replace the strings chars with escape versions so it will be shown rather than parsed in html
 * @param {string} string 
 * @returns sanitised string
 */
function sanitiseHTML (string)
{
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
//                           EXPORTS: initialise
// ============================================================================
export { initialise, triggersandactions };

