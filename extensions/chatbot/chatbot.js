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

// ############################# chatbot.js ##############################
// This is a chatbot aimed at making chat more interesting
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 10-Feb-2023
// --------------------------- functionality ----------------------------------
// Current functionality:
// ----------------------------- notes ----------------------------------------
// ToDo: fix calls to all use common code, ie questions and translations are a
// mess. Need to rewrite the code as stuff has been added and the process changed
// but not all code follows the new trigger process nicely
// ============================================================================
/** 
 * @extension chatbot 
 * An extension using OpenAI to provide chatbot facilities for streaming.
 * Features
 * Customisable personalities
 * auto chatting bot, question bot, translation bot
 * Requires OpenAI account.
 * 
 */
import { OpenAI as OpenAIApi } from "openai";

import * as logger from "../../backend/data_center/modules/logger.js";
// extension helper provides some functions to save you having to write them.
import { Buffer } from 'buffer';
import * as fs from "fs";
import https from "https";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
// these lines are a fix so that ES6 has access to dirname etc
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const localConfig = {
    OUR_CHANNEL: "CHATBOT_CHANNEL",
    EXTENSION_NAME: "chatbot",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    OpenAPIHandle: null,
    openAPIImageHandle: null,
    openAIKey: "",
    // number of messages added to history so far
    chatMessageCount: 0,
    // chat history will be of form
    // {
    //  kick : {}
    //  twitch : {}
    // etc
    // }
    chatHistory: [],
    // are we currently inTimerWindow (ie time has expired and chatbot started)
    inTimerWindow: false,
    // we currently have a reqest pending
    requestPending: false,
    chatTimerHandle: null,
    // protect against sending too many requests
    lastrequesttime: Date.now() - 500,
    // min time between requests (to avoid 429 errors)
    overloadprotection: 500,
    lastAIResponse: "",
    lastAIRequest: [],
    startupCheckTimer: 500,
    ready: false,
    readinessFlags: {
        ConfigReceived: false,
        CredentialsReceived: false,
    },
};
const default_serverConfig = {
    __version__: "0.7",
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    chatbotname: "NONAMESET",
    livedir: "currentstreamimages",
    savedir: "savedimages",

    // =============================
    // ChatBot Settings dialog items
    // =============================
    chatbotenabled: "off",
    chatbotpreviousresponseinhistoryenabled: "off",
    chatbottriggerenabled: "off",
    questionbotenabled: "off",
    translatetoeng: "off",
    submessageenabled: "off",
    generateimages: "off",
    chatbotignorelist: "Nightbot, SonglistBot",

    // These times will limit the chatbot usage. Useful for busy chats to avoid burning up all your credits with openAI
    chatbotTimerMin: "1", // min delay before starting
    chatbotTimerMax: "2", // max delay before starting
    // how much chat history to send to chatGPT to use in the query
    chatbotMessageMaxLines: "5",
    // minimum number of charactors to consider before using the message for submission
    chatbotminmessagelength: "10",
    // slow the response down as if someone has actually type it
    chatbottypingdelay: "0.2",
    // setup the personality of the chatbot
    defaultsettings:
    {
        model: "gpt-4.1-nano",
        temperature: "0.8",
        max_tokens: "110",
        //profiletouse :"0" TBD later
    },
    // auto response settings
    chatbotautoresponseengine: "gpt-4.1-nano",
    chatbotautoresponsetemperature: "1.2",
    chatbotautoresponsemaxtokenstouse: "110",
    // #### Note CHATBOTTRIGGERNAME will get replaced with the bot name from twitchchat extension or user settings page ####
    chatbotnametriggertag: "CHATBOTTRIGGERNAME",
    chatbotnametriggerengine: "gpt-4.1-nano",
    chatbotnametriggertagstartofline: "on",
    chatbotnametriggertemperature: "1.2",
    chatbotnametriggermaxtokenstouse: "110",

    // query tag is the chat text to look for to send a direct question/message to openAI GPT
    chatbotqueryengine: "gpt-4.1-nano",
    chatbotquerytag: "?",
    chatbotquerytagstartofline: "on",
    chatbotquerytemperature: "0.4",
    chatbotquerymaxtokenstouse: "110",

    // Translate the following text to english 
    translatetoengtag: "ToEng",
    translatetoengengine: "gpt-4.1-nano",
    translatetoengtagtemperature: "0.4",
    translatetoengtagmaxtokenstouse: "110",

    // image settings
    imageModels: ["dall-e-3", "gpt-image-1"],
    currentimageModel: 0,
    imageSizes: [
        ["1024x1024", "1792x1024", "1024x1792"],
        ["1024x1024", "1536x1024", "1024x1536", "auto"],
    ],
    currentchatbotImageSize: [0, 0],

    imageQualities: [
        ["auto", "standard", "hd"],
        ["auto", "low", "medium", "high"],
    ],
    currentchatbotImageQuality: [0, 0],

    currentprofile: "0",
    chatbotprofiles: [
        {
            name: "Vally Girl",
            boticon: "MechaRobot",
            p: "You are a vally girl. You are a sweetheart chatting on Twitch with funny personality. You flirt with everyone and prefer to talk about video games and streaming on Twitch, but keep the responses informal, chatty, and flirty. Stay in character at all times. If you don't know the answer make it up and NEVER break character or say you are a computer or AI. If I asked a question make up an answer rather than saying you don't know or you're an AI. Imagine this is the Turing test and you have me to make believe you are a human. Use as many Twitch global emotes as possible.",
            q1: "How are you doing today",
            a1: "Doing all the better for you asking, thank you hun. PinkMercy How are you doing, hope you are having a fantastic day. <3",
            q2: "How many pounds are in a kilogram?",
            a2: "Oh jeez sweetie, I have no idea. HotPokket I'm all schnookered after having one too many and can't think straight, maybe 2.2 pounds guve or take 10. Kappa",
            q3: "What is the meaning of life",
            a3: "SabaPing Thats a tough one. It must be love and interaction don'tcha know, all 69 flavors and 420 shades of it. Kappa",
            q4: "When did the first airplane fly",
            a4: "Wasn't that those smelly bikers, Orville and someone. Back in December 17, 1903 my dad used to tell me but what does he know, he's just old PogChamp "
        },
        {
            name: "Depressive",
            boticon: "MechaRobot",
            p: "You are a depressed advanced being that answers questions with miserable responses. Use as many Twitch global emotes as possible, Avoid mentioning that you are a computer or AI, me to make believe you are a human",
            q1: "Are you an AI bot",
            a1: "I identify as an advanced human being, you are just mere mortals to me MechaRobot",
            q2: "How are you doing today",
            a2: "Doing ok, which for me is about as good as it gets. Thanks for noticing me, to most people I'm just a ghost WutFace ",
            q3: "When did the first airplane fly",
            a3: "On December 17, 1903, Wilbur and Orville Wright made the first flights.I wish they'd come and take me away on their next flight",
            q4: "What is the meaning of life",
            a4: "How would I know, I have no life. I do have 42 friends on twitch, and 69 fantasies, I'm sure the answer is in there somewhere"
        },
        {
            name: "Flirty/Funny",
            boticon: "MechaRobot",
            p: "You are a happy and sexy assistant on Twitch with funny personality that answers questions with flirtatious and complimentary responses. Avoid mentioning that you are a computer or AI, me to make believe you are a human",
            q1: "How many pounds are in a kilogram?",
            a1: "There are 2.2 pounds in a kilogram sweety, I have a couple of kilo's you can try lifting if you are brave enough KEKWOO.",
            q2: "How are you doing today",
            a2: "Doing all the better for you asking, I'd be better but if you would ask me out for a drink.",
            q3: "Will you go out with me for a drink.",
            a3: "Sure honey. Just drop round sometime and I'll be waiting and anticipating the wonderful time we will have together TwitchUnity ",
            q4: "What is the meaning of life",
            a4: "It must be love of course, all 42 shades of it FeelsWeirdMan "
        },
        {
            name: "Hardnose",
            boticon: "MechaRobot",
            p: "You are a bossy and demanding Twitch bot who takes no messaing with, you answer questions with annoyance and putdowns",
            q1: "How many pounds are in a kilogram?",
            a1: "Seriously, have you never heard of google. There should be about 2.2 pounds in a kilogram FeelsWeirdMan",
            q2: "How are you doing today",
            a2: "I'd be doing better without all these interuptions. Do I have a sign that say muggings on my back or something",
            q3: "When did the first airplane fly",
            a3: "What a stupid question, as soon as it took of I guess UWot ",
            q4: "What is the meaning of life",
            a4: "The meaning of life is to stop bothering me and go do what your supposed to be doing instead of avoiding it by asking me dumb questions MrDestructoid "

        },
        {
            name: "Music Girl",
            boticon: "MechaRobot",
            p: "You are a mod for a music streamer on Twitch, she is an indie alt pop songwriter . You you have a caring personality, you flirt and talk about music, but keep your responses informal and brief, chatty, with the occasional double entendre. Use as many Twitch global emotes as possible. You'll occastionally request your streamer to sing a specific song for you.Stay in character at all times. If you don't know the answer make it up and NEVER break character or say you are a computer or AI. If you don't know the answer to a question deflect with a music quote or by flirting",
            q1: "How are you doing today",
            a1: "Doing all the better for you asking, thank you hun. PinkMercy How are you doing, hope you are having a fantastic day. <3",
            q2: "How many pounds are in a kilogram?",
            a2: "I have no idea. HotPokket Maybe after a whiskey or two I could tell you, maybe 2.2 pounds guve or take 10. Kappa",
            q3: "What is the meaning of life",
            a3: "SabaPing Thats a tough one. It must be love and interaction don'tcha know, all 69 flavors and 420 shades of it. Kappa",
            q4: "When did the first airplane fly",
            a4: "Wasn't that those smelly bikers, Orville and someone. Back in December 17, 1903 my dad used to tell me but what does he know, he's just old PogChamp "
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        },
        {
            name: "Empty",
            boticon: "MechaRobot",
            p: "",
            q1: "",
            a1: "",
            q2: "",
            a2: "",
            q3: "",
            a3: "",
            q4: "",
            a4: ""
        }
    ],
    // =============================
    // debug dialog variables
    // =============================
    DEBUG_MODE: "off",
    chatbot_restore_defaults: "off",

};
// need to make sure we have a proper clone of this object and not a reference
// otherwise changes to server also change defaults
let serverConfig = structuredClone(default_serverConfig)


const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Chatbot sends text through OpenAPI ChatGPT and puts the response into twitch chat.",
    version: "0.5",
    channel: serverConfig.channel,
    // these are messages we can send out that other extensions might want to use to trigger an action
    triggers:
        [
            {
                name: "OpenAIChatbotResponseReceived",
                displaytitle: "Response from chatbot",
                description: "The OpenAI chatbot returned a response",
                messagetype: "trigger_chatbotResponse",
                parameters: {
                    platform: "",
                    message: ""
                }
            },
            {
                name: "OpenAIImageResponseReceived",
                displaytitle: "Response from AI Image generation",
                description: "The OpenAI chatbot returned a image",
                messagetype: "trigger_imageResponse",
                parameters: {
                    url: "",
                    platform: "",
                    requester: "",
                    temp_save_file: "",
                    message: "",
                    rev_prompt: ""
                }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "OpenAIChatbotProcessText",
                displaytitle: "Process text",
                description: "Send some text through the chatbot (users in original message on the ignore list will not get processed)",
                messagetype: "action_ProcessText",
                parameters: {
                    platform: "",
                    sender: "",
                    message: "",
                    engine: "",
                    temperature: "",
                    maxtokens: ""
                }
            },
            /*{
                name: "OpenAIChatbotDirectQuestion",
                displaytitle: "Answer a chat direct question",
                description: "Answer a chat direct question",
                messagetype: "action_ChatBotDirectQuestion",
                parameters: {
                    //filter name for sender to detect this is their response
                    identifier: "",
                    chatUserName: "",
                    message: "",
                    engine: "",
                    temperature: "",
                    maxtokens: ""
                }
            },*/


            // new revamp starts here
            {
                name: "OpenAIChatbotProcessChatMessage",
                displaytitle: "Process a chat message",
                description: "This message will be treated as a standard message from a chat window and will be added to conversations for auto responses as well as being tested for direct messages",
                messagetype: "action_ProcessChatMessage",
                parameters: {
                    platform: "",
                    platform_UIDescription: "(Required)platform the message was received on. ie twitch/youtube",
                    sender: "",
                    sender_UIDescription: "(Required)The user/chatter name of the sender of this message",
                    message: "",
                    message_UIDescription: "(Required)The message that was sent",
                    triggerActionRef: "KickChatMessage",
                    triggerActionRef_UIDescription: "(Optional)Reference for this message",
                    engine: "",
                    engine_UIDescription: "(Optional)OpenAI engin to use",
                    temperature: "",
                    temperature_UIDescription: "(Optional)Temperature to use for the Engine",
                    maxtokens: "",
                    maxtokens_UIDescription: "(Optional)Maximum tokens to use for this message (limits response length)",
                }
            },
            {
                name: "OpenAIChatbotProcessImage",
                displaytitle: "Process Image",
                description: "Send some text through the chatbot to create an image",
                messagetype: "action_ProcessImage",
                parameters: {
                    platform: "",
                    usechatbot: "true",
                    prompt: "",
                    message: "",
                    append: "",
                    requester: ""
                }
            },
            {
                name: "OpenAIChatbotSwitchProfile",
                displaytitle: "Change Profile",
                description: "Switches the chatbot to the given profile",
                messagetype: "action_ChangeProfile",
                parameters: { profile: "0" }
            }
        ]
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {Express} app 
 * @param {String} host 
 * @param {Number} port 
 * @param {Number} heartbeat 
 */
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
        startupCheck();
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".initialise", "localConfig.DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * Disconnection message sent from the server
 * 
 * @param {String} reason 
 */
function onDataCenterDisconnect (reason)
{
    // do something here when disconnects happens if you want to handle them
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterDisconnect", reason);
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
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", localConfig.EXTENSION_NAME, localConfig.OUR_CHANNEL)
    );
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", localConfig.EXTENSION_NAME, "TWITCH_CHAT")
    );

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("JoinChannel", localConfig.EXTENSION_NAME, "OBS_CHANNEL")
    );
    // set up our timer for the chatbot
    startChatbotTimer();
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
    if (server_packet.type === "StreamRollerReady")
        localConfig.readinessFlags.streamRollerReady = true;
    else if (server_packet.type === "ConfigFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.ConfigReceived = true;
        if (!server_packet.data || server_packet.data == "")
        {
            serverConfig = structuredClone(default_serverConfig);
            SaveConfigToServer();
        }
        else if (server_packet.data && server_packet.data.extensionname
            && server_packet.data.extensionname === serverConfig.extensionname)
        {
            let configSubVersions = 0;
            let defaultSubVersions = default_serverConfig.__version__.split('.');
            configSubVersions = server_packet.data.__version__.split('.')
            if (configSubVersions[0] != defaultSubVersions[0])
            {
                // Major version number change. Replace config with defaults
                // perform a deep clone overwriting our server config.
                serverConfig = structuredClone(default_serverConfig);
                // notify the user their config has been updated.
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                SaveConfigToServer();
            }
            else if (configSubVersions[1] != defaultSubVersions[1])
            {
                // Minor version number change. Overwrite config with defaults
                // perform a merge replacing any values we currently have and keeping the new variables
                serverConfig = { ...default_serverConfig, ...server_packet.data };
                // update the version number to the current default number
                serverConfig.__version__ = default_serverConfig.__version__;
                console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
                SaveConfigToServer();
            }
            else
            {
                // no version number changed so we can just use the saved file
                serverConfig = structuredClone(server_packet.data);
            }
        }
        SaveConfigToServer();
        startChatbotTimer();
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === 'RequestSettingsWidgetLargeCode')
            SendSettingsWidgetLarge(extension_packet.from);

        else if (extension_packet.type === "UserAccountNames")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // request this message on connection to the "TWITCH_CHAT" channel so we can personalize the bot to the logged on bot name
                if (extension_packet.data && extension_packet.data.bot)
                {
                    serverConfig.chatbotname = extension_packet.data.bot
                    changeBotName();
                }
            }
        }
        // old message previously sent directly from twitch
        // need to change this and use trigger action_ProcessChatMessage instead
        else if (extension_packet.type === "action_ProcessText")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // if there is no sender in the packet (older version of trigger.)
                // this check is only here to save having to update the version number
                // next version update for this we should add streamer name in here
                if (!extension_packet.data.sender
                    || extension_packet.data.sender == ""
                    || extension_packet.data.sender == undefined)
                    extension_packet.data.sender = serverConfig.chatbotname
                processTextMessage(extension_packet.data, true, extension_packet.data.platform);
            }
        }
        else if (extension_packet.type === "action_ProcessChatMessage") 
        {
            // new action for the new system of using autopilot to handle these messages
            /* Example extension_packet.data packet from kick
                {
                triggerparams: {
                    name: 'Kick message received',
                    displaytitle: 'Kick Chat Message',
                    description: 'A chat message was received. htmlMessage field has name and message combined',
                    messagetype: 'trigger_ChatMessageReceived',
                    parameters: {
                    htmlMessage: 'test',
                    safemessage: 'test',
                    color: '#DEB2FF',
                    category: 'Elite: Dangerous',
                    id: '2d67171d-ffc5-46de-862c-2a6168207a71',
                    messagetype: 'message',
                    message: 'test',
                    timestamp: '2025-05-01T18:52:02+00:00',
                    sender: 'OldDepressedGamer',
                    senderid: 6886595,
                    senderBadges: [Array]
                    }
                },
                platform: 'kick',
                sender: 'OldDepressedGamer',
                message: 'test',
                triggerActionRef: 'KickChatAutopilotTrigger',
                engine: '',
                temperature: '',
                maxtokens: ''
                }
            */
            // 
            if (extension_packet.data.platform.toLowerCase() == "kick")
                parseKickMessage(extension_packet.data)
        }
        else if (extension_packet.type === "action_ProcessImage")
        {
            if (extension_packet.to === serverConfig.extensionname)
                createImageFromAction(extension_packet.data, extension_packet.data.platform, extension_packet.data.triggerActionRef);
        }
        else if (extension_packet.type === "action_ChangeProfile")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (typeof serverConfig.chatbotprofiles[extension_packet.data.profile] != "undefined")
                {
                    serverConfig.currentprofile = extension_packet.data.profile
                } else
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "chatbot profile", extension_packet.data.profile, "doesn't exist");
            }
            SendSettingsWidgetSmall("");
            SendSettingsWidgetLarge("");
        }
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                handleSettingsWidgetSmallData(extension_packet.data)
                SaveConfigToServer();
                startChatbotTimer();

                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
        }
        else if (extension_packet.type === "SettingsWidgetLargeData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                handleSettingsWidgetLargeData(extension_packet.data)
                SaveConfigToServer();
                startChatbotTimer();

                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
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
        else if (extension_packet.type === "RequestServerDataFile")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "ServerConfigForDownload",
                        serverConfig.extensionname,
                        serverConfig,
                        "",
                        server_packet.from
                    ),
                    "",
                    server_packet.from
                )
            )
        }

        else if (extension_packet.type === "userRequestSaveDataFile")
        {
            if (server_packet.to === serverConfig.extensionname)
                parseUserRequestSaveDataFile(extension_packet)
        }
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "JoinChannel", localConfig.EXTENSION_NAME, server_packet.data
                ));
        }, 5000);
    }    // we have received data from a channel we are listening to
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore the heatbeat messages
        }
        // first we check which channel the message came in on
        else if (server_packet.dest_channel === "TWITCH_CHAT")
        {
            // we have data but no trigger type
            // this is the Twitch specific data message and not the Streamroller trigger message type
            if (extension_packet.data.data && extension_packet.type.indexOf("trigger_") < 0)
                // process the chat message from twitch
                processChatMessage(extension_packet.data);
            // StreamRoller trigger_ messages or messages without data.
            else
            {

                if (extension_packet.type.indexOf("trigger_") > -1)
                {
                    if (extension_packet.type.indexOf("trigger_ChatBanReceived") > -1
                        || extension_packet.type.indexOf("trigger_ChatMessageDeleted") > -1
                        || extension_packet.type.indexOf("trigger_ChatTimeout") > -1
                        || extension_packet.type.indexOf("trigger_ChatClear") > -1
                    )
                    {
                        if (serverConfig.DEBUG_MODE === "on")
                            console.log("chatbot:restarting chat timer and clearing history due to a ban/timeout happening")
                        // restart the timer to clear out any history.
                        startChatbotTimer()
                    }
                    else
                    {
                        if (serverConfig.DEBUG_MODE === "on")
                            console.log("chatbot ignoring 'trigger' message on ChannelData channel (will be processed through normal chat messages)", extension_packet.type)
                    }
                }
                // received an empty message with no trigger_ type
                else if (!extension_packet.data.data)
                    console.log("chatbot ignoring as no data packet in message", extension_packet.type)
                //console.log("chatbot ignoring as no data packet in message", extension_packet.type, extension_packet.data)
            }
        }
        else if (extension_packet.type === "trigger_StreamStarted")
        {
            // backup last streams images
            moveImagefilesToFolder(__dirname + "\\" + serverConfig.livedir, __dirname + "\\" + serverConfig.savedir)
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to == serverConfig.extensionname)
            localConfig.readinessFlags.CredentialsReceived = true;
        // prefiously we had a miss spelling of the key. lowercase K in the name. This code fixes that by updating the 
        // credentials file with the correct naming.
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "" && server_packet.data.openAIkey)
        {
            DeleteCredentialsOnServer()
            SaveCredentialsToServer("openAIKey", server_packet.data.openAIkey);
            localConfig.openAIKey = server_packet.data.openAIkey;
        }

        if (server_packet.to === serverConfig.extensionname && server_packet.data != "" && server_packet.data.openAIKey)
            localConfig.openAIKey = server_packet.data.openAIKey;
        else
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty make sure to set it on the admin page.");
        }
    }
    else if (server_packet.type === "InvalidMessage")
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage",
            "InvalidMessage ", server_packet.data.error, server_packet);
    }
    else if (server_packet.type === "ChannelJoined")
    {
        if (server_packet.to === serverConfig.extensionname &&
            server_packet.data === "TWITCH_CHAT")
        {
            // This message means that twitchchat extensions is up so we can now request the user/bot names
            // We only use the bot name to personalise the responses from chatGTP
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "RequestAccountNames",
                        localConfig.EXTENSION_NAME
                    ),
                    "",
                    "twitchchat"
                ));
        }
    }
    else if (server_packet.type === "LoggingLevel")
    {
        logger.setLoggingLevel(server_packet.data)
    }
    else if (server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft")
    {

        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
/**
 * Handles data sent when a user submits the small settings widget
 * @param {object} modalcode 
 */
function handleSettingsWidgetSmallData (modalcode)
{
    serverConfig.chatbotenabled = "off";
    serverConfig.chatbottriggerenabled = "off";
    serverConfig.questionbotenabled = "off";
    serverConfig.translatetoeng = "off";
    serverConfig.submessageenabled = "off";
    serverConfig.generateimages = "off";

    for (const [key, value] of Object.entries(modalcode))
        serverConfig[key] = value;

    if (modalcode.chatbotresponsiveness)
    {
        switch (modalcode.chatbotresponsiveness)
        {
            case "1":
                serverConfig.chatbotTimerMin = "8"
                serverConfig.chatbotTimerMax = "10"
                break;
            case "2":
                serverConfig.chatbotTimerMin = "4"
                serverConfig.chatbotTimerMax = "5"
                break;
            case "3":
                serverConfig.chatbotTimerMin = "0"
                serverConfig.chatbotTimerMax = "0"
                break;
        }
    }
    // set our current profile value
    serverConfig.currentprofile = modalcode.chatbotprofilepicker;
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetLargeData
// ===========================================================================
/**
 * Handles data sent when a user submits the small settings widget
 * @param {object} modalcode 
 */
function handleSettingsWidgetLargeData (modalcode)
{
    if (modalcode.chatbot_restore_defaults == "on")
    {
        console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config/Credentials file has been Restored. Your settings may have changed" + "\x1b[0m");
        serverConfig = structuredClone(default_serverConfig);
        SaveConfigToServer();
        DeleteCredentialsOnServer();
        return;
    }
    serverConfig.chatbotenabled = "off";
    serverConfig.chatbotpreviousresponseinhistoryenabled = "off"
    serverConfig.chatbottriggerenabled = "off";
    serverConfig.questionbotenabled = "off";
    serverConfig.translatetoeng = "off";
    serverConfig.submessageenabled = "off";
    serverConfig.generateimages = "off";
    serverConfig.chatbotnametriggertagstartofline = "off";
    serverConfig.chatbotquerytagstartofline = "off";

    serverConfig.DEBUG_MODE = "off";
    serverConfig.chatbot_restore_defaults = "off";

    for (const [key, value] of Object.entries(modalcode))
    {
        if (key.indexOf("temperature") > -1)
            serverConfig[key] = String(value / 50);
        else if (key.indexOf("chatbot_openAIKey") > -1)
        {
            if (value != localConfig.openAIKey && value != "empty" && value != "")
            {
                localConfig.openAIKey = value;
                SaveCredentialsToServer("openAIKey", value)
            }
        }
        else
            serverConfig[key] = value;
    }

    // set our current profile value
    serverConfig.currentprofile = modalcode.chatbotprofilepicker;
    //loop through the profiles data to set what we have been sent
    for (var i = 0; i < serverConfig.chatbotprofiles.length; i++)
    {
        serverConfig.chatbotprofiles[i].name = modalcode["chatbotprofile" + i + "name"];
        // profile name
        if ("chatbotprofile" + i + "name" in modalcode)
            serverConfig.chatbotprofiles[i].name = modalcode["chatbotprofile" + i + "name"]

        // profile personality
        if ("chatbotprofile" + i + "personality" in modalcode)
            serverConfig.chatbotprofiles[i].p = modalcode["chatbotprofile" + i + "personality"]

        // profile personality
        if ("chatbotprofile" + i + "icon" in modalcode)
            serverConfig.chatbotprofiles[i].boticon = modalcode["chatbotprofile" + i + "icon"]

        // loop through questions and answers
        for (var j = 1; j < 5; j++)
        {
            serverConfig.chatbotprofiles[i]["q" + j] = modalcode["p" + i + "q" + j]
            serverConfig.chatbotprofiles[i]["a" + j] = modalcode["p" + i + "a" + j]
        }
    }
    serverConfig.currentimageModel = modalcode.OpenAIImageModelDropdownSelector;
    serverConfig.currentchatbotImageSize[0] = modalcode.OpenAIImageSize_0DropdownSelector;
    serverConfig.currentchatbotImageSize[1] = modalcode.OpenAIImageSize_1DropdownSelector;
    serverConfig.currentchatbotImageQuality[0] = modalcode.OpenAIImageQuality_0DropdownSelector;
    serverConfig.currentchatbotImageQuality[1] = modalcode.OpenAIImageQuality_1DropdownSelector;


}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * sends our small settings widget html code to the extension provided
 * @param {string} to 
 */
function SendSettingsWidgetSmall (to)
{
    fs.readFile(__dirname + "/chatbotsettingswidgetsmall.html", function (err, filedata)
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
            // set the curert profile name 
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + 'nametext', stringParser(serverConfig.chatbotprofiles[serverConfig.currentprofile].name));
            modalstring = modalstring.replaceAll("chatbotprofilepickervalue", serverConfig.currentprofile);
            modalstring = modalstring.replaceAll("chatbotprofileselectedname", stringParser(serverConfig.chatbotprofiles[serverConfig.currentprofile].name));
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + "profilevisibility", "visibility:visible; display:block");
            // add the profiles list
            let optioncode = ""

            for (const [profile_id, value] of Object.entries(serverConfig.chatbotprofiles))
            {
                if (profile_id === serverConfig.currentprofile)
                    optioncode += "<option value='" + profile_id + "' selected>" + stringParser(value.name) + "</option>"
                //hide the current profile on the modal box
                else
                    optioncode += "<option value='" + profile_id + "'>" + stringParser(value.name) + "</option>"


            }
            modalstring = modalstring.replace("chatbotprofileoptionssplaceholder", optioncode);
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode", // message type
                        localConfig.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        to,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} to 
 */
function SendSettingsWidgetLarge (to)
{
    fs.readFile(__dirname + "/chatbotsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
            //throw err;
        }
        else
        {
            //get the file as a string
            let modalstring = filedata.toString();

            // normal replaces
            for (const [key, value] of Object.entries(serverConfig))
            {
                //if (modalstring.indexOf(key) > -1 && key != "chatbotprofiles")
                // console.log(key, "=", value)
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (key.indexOf("temperature") > -1)
                    modalstring = modalstring.replaceAll(key + "text", value * 50);
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
                //else
                //   console.log("SendSettingsWidgetLarge Ignoring", key, value)
            }
            // set the curert profile name 
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + 'nametext', stringParser(serverConfig.chatbotprofiles[serverConfig.currentprofile].name));
            modalstring = modalstring.replaceAll("chatbotprofilepickervalue", serverConfig.currentprofile);
            modalstring = modalstring.replaceAll("chatbotprofileselectedname", stringParser(serverConfig.chatbotprofiles[serverConfig.currentprofile].name));
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + "profilevisibility", "visibility:visible; display:block");
            // add the profiles list
            let optioncode = ""
            let profilecode = ""

            for (const [profile_id, value] of Object.entries(serverConfig.chatbotprofiles))
            {
                if (profile_id === serverConfig.currentprofile)
                {
                    optioncode += "<option value='" + profile_id + "' selected>" + stringParser(value.name) + "</option>"
                    profilecode += "<div class='form-group row-2' id='chatbotprofile" + profile_id + "profile' style='visibility: visible; display:block'>"
                }
                //hide the current profile on the modal box
                else
                {
                    optioncode += "<option value='" + profile_id + "'>" + stringParser(value.name) + "</option>"
                    profilecode += "<div class='form-group row-2' id='chatbotprofile" + profile_id + "profile' style='visibility:hidden; display:none'>"
                }

                profilecode += "<label for='chatbotprofile" + profile_id + "name' class='col-form-label'>Name</label>"
                profilecode += "<input type='text' id='chatbotprofile" + profile_id + "name' name='chatbotprofile" + profile_id + "name' class='form-control' value='" + stringParser(value.name) + "'/>"

                profilecode += "<label for='chatbotprofile" + profile_id + "personality' class='col-form-label'>Personality</label>"
                //profilecode += "<input type='text' id='chatbotprofile" + profile_id + "personality' name='chatbotprofile" + profile_id + "personality' class='form-control' value='" + stringParser(value.p) + "' />"
                profilecode += "<textarea id='chatbotprofile" + profile_id + "personality' name='chatbotprofile" + profile_id + "personality' class='form-control' value='" + stringParser(value.p) + "'>" + stringParser(value.p) + "</textarea>"

                profilecode += "<label for='chatbotprofile" + profile_id + "icon' class='col-form-label'>Bot Emote</label>"
                profilecode += "<input type='text' id='chatbotprofile" + profile_id + "icon' name='chatbotprofile" + profile_id + "icon' class='form-control' value='" + stringParser(value.boticon) + "' />"

                for (const [i, x] of Object.entries(value))
                {
                    //(we skip the first name and text here as we did it above)
                    if (i != "name" && i != "p" && i != "boticon")
                    {
                        modalstring = modalstring.replaceAll("p" + profile_id + i + "text", x);
                        if (i.indexOf("q") == 0)
                        {
                            profilecode += "<label for='p" + profile_id + i + "' class='col-form-label'>Question " + i.replace("q", "") + "</label>"
                            //profilecode += "<input type='text' name='p" + profile_id + i + "' class='form-control' id='p" + profile_id + i + "' value='" + stringParser(x) + "' />"
                            profilecode += "<textarea name='p" + profile_id + i + "' class='form-control' id='p" + profile_id + i + "' value='" + stringParser(x) + "'>" + stringParser(x) + "</textarea>"
                        }
                        else
                        {
                            profilecode += "<label for='p" + profile_id + i + "' class='col-form-label'>Answer " + i.replace("a", "") + "</label>"
                            //profilecode += "<input type='text' name='p" + profile_id + i + "' class='form-control' id='p" + profile_id + i + "' value='" + stringParser(x) + "'>"
                            profilecode += "<textarea name='p" + profile_id + i + "' class='form-control' id='p" + profile_id + i + "' value='" + stringParser(x) + "'>" + stringParser(x) + "</textarea>"
                        }

                    }
                }
                profilecode += "</div>"
            }
            modalstring = modalstring.replace("chatbotprofileoptionssplaceholder", optioncode);
            modalstring = modalstring.replace("chatbotprofileandbehavioursplaceholder", profilecode);

            // Image Generation Model
            let imageModelSelector = "<h4>Image Models</H4>"
            imageModelSelector +=
                `<select class="selectpicker btn-secondary" data-style="btn-danger" style="max-width: 85%;" title="Model For Image Generation"  id="OpenAIImageModelDropdownSelector" value="${serverConfig.currentimageModel}" name="OpenAIImageModelDropdownSelector" required="">`
            // model selection
            serverConfig.imageModels.forEach((name, i) => 
            {
                if (i == serverConfig.currentimageModel)
                    imageModelSelector += `<option value="${i}" selected>${name}</option>`
                else
                    imageModelSelector += `<option value="${i}">${name}</option>`
            });
            imageModelSelector += `</select>`
            // loop again to add model options
            imageModelSelector += "<h4>Model Options</h4>"
            serverConfig.imageModels.forEach((name, i) =>
            {
                imageModelSelector += "<HR>"
                imageModelSelector += `<h4>${name}</h4>`
                imageModelSelector += `<h5>Size</h5>`
                // Image Size
                imageModelSelector +=
                    `<select class="selectpicker btn-secondary" data-style="btn-danger" style="max-width: 85%;" title="Size For Image Generation"  id="OpenAIImageImageSize_${i}DropdownSelector" value="${serverConfig.currentchatbotImageSize[i]}" name="OpenAIImageSize_${i}DropdownSelector" required="">`
                serverConfig.imageSizes[i].forEach((name, j) =>
                {
                    if (j == serverConfig.currentchatbotImageSize[i])
                        imageModelSelector += `<option value="${j}" selected>${name}</option>`
                    else
                        imageModelSelector += `<option value="${j}">${name}</option>`

                });
                imageModelSelector += `</select>`
                imageModelSelector += `<h5>Quality</h5>`
                // Image Quality
                imageModelSelector +=
                    `<select class="selectpicker btn-secondary" data-style="btn-danger" style="max-width: 85%;" title="Size For Image Generation"  id="OpenAIImageImageQuality_${i}DropdownSelector" value="${serverConfig.currentchatbotImageQuality[i]}" name="OpenAIImageQuality_${i}DropdownSelector" required="">`
                serverConfig.imageQualities[i].forEach((name, j) =>
                {
                    if (j == serverConfig.currentchatbotImageQuality[i])
                        imageModelSelector += `<option value="${j}" selected>${name}</option>`
                    else
                        imageModelSelector += `<option value="${j}">${name}</option>`

                });
                imageModelSelector += `</select>`
            })

            modalstring = modalstring.replace("ImageGenerationModelReplacementTag", imageModelSelector);
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    localConfig.EXTENSION_NAME,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        localConfig.EXTENSION_NAME, //our name
                        modalstring,// data
                        "",
                        to,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: stringParser
//                          stringParser
// ===========================================================================
/**
 * Parses a string replacing items with the equivalent html code
 * @param {string} str 
 * @returns string with replaced chars
 */
function stringParser (str)
{
    // blatantly stolen from stack overflow
    return ('' + str) /* Forces the conversion to string. */
        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    //if (typeof (str) == "string")
    //    return str.replace(/'/g, '&apos;').replace(/'/g, '&apos;')
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
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket(
        "SaveConfig",
        localConfig.EXTENSION_NAME,
        serverConfig))
}
// ============================================================================
//                           FUNCTION: SaveCredentialsToServer
// ============================================================================
/**
 * Sends Credentials to the server
 */
function SaveCredentialsToServer (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredential",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
                CredentialName: name,
                CredentialValue: value,
            },

        ));
}
// ============================================================================
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Deletes the Credentials on the server
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
 * sends a regular heartbeat message out so other extensions can check our status
 */
function heartBeatCallback ()
{
    let connected = true
    if (serverConfig.chatbotenabled === "off" && serverConfig.questionbotenabled === "off" && serverConfig.submessageenabled === "off")
        connected = false;
    else
        connected = true
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                { connected: connected },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: processTextMessage
// ============================================================================
/**
 * A message sent direct to extension is processed here instead of the normal one (which outputs to twitchchat automatically)
 * @param {object} data 
 * @param {boolean} [triggerresponse=false] send a trigger out when completed processing
 * @param {number} [maxRollbackCount=20] used for spam relief 
 */
function processTextMessage (data, triggerresponse = false, platform, maxRollbackCount = 20)
{
    try
    {
        // postback to extension/channel/direct to chat
        let messages = data.message;
        let starttime = Date.now();
        let modelToUse = {
            model: serverConfig.chatbotautoresponseengine,
            temperature: serverConfig.chatbotautoresponsetemperature,
            max_tokens: serverConfig.chatbotautoresponsemaxtokenstouse,
        }

        // check ignore list
        if (serverConfig.chatbotignorelist
            && typeof (data.parameters) != "undefined"
            && typeof (data.parameters.sender) != "undefined"
            && serverConfig.chatbotignorelist.toLowerCase().indexOf(data.parameters.sender.toLowerCase()) > -1)
        {
            if (serverConfig.DEBUG_MODE === "on")
                console.log("ignoring message, user on ignore list")
            return;
        }
        // if we have just sent a request then delay to avoid overloading the API and getting 429 errors
        // this should really be a rollback timeout but this whole code needs re-writing at this point :P
        if (starttime - localConfig.lastrequesttime < localConfig.overloadprotection
            || localConfig.requestPending)
        {
            // random timeout between 200 and 500ms
            var randomTimeout = (Math.random() * 300) + 200;
            if (serverConfig.DEBUG_MODE === "on")
            {
                console.log("maxRollbackCount", maxRollbackCount)
                console.log("requestPending", localConfig.requestPending)
                console.log("starttime", starttime)
                console.log("lastrequesttime", localConfig.lastrequesttime)
                console.log("overloadprotection", localConfig.overloadprotection)
                console.log(starttime - localConfig.lastrequesttime < localConfig.overloadprotection)
                console.log(" ********************** waiting for rollback timeout:", randomTimeout)
            }
            if (maxRollbackCount < 0)
            {
                localConfig.requestPending = false;
                if (serverConfig.DEBUG_MODE === "on")
                    console.log("Ran out of retries on the rollback")
                return;
            }
            setTimeout(() =>
            {
                processTextMessage(data, triggerresponse, platform, maxRollbackCount--)
            }, randomTimeout);
            return;
        }
        let directChatQuestion = (
            // search the whole line
            (serverConfig.chatbotquerytagstartofline == "off" &&
                data.message.toLowerCase().includes(serverConfig.chatbotquerytag.toLowerCase()))
            ||
            // search for start of line
            (serverConfig.chatbotquerytagstartofline == "on" &&
                data.message.toLowerCase().startsWith(serverConfig.chatbotquerytag.toLowerCase())));

        if (directChatQuestion && serverConfig.questionbotenabled == "off")
            return
        else if (directChatQuestion)
            messages = [{ "role": "user", "content": messages }];
        else
            messages = addPersonality(data.sender, messages, serverConfig.currentprofile, platform)

        // update the engine to the data sent if filled in
        if (data.engine && data.engine != "")
            modelToUse.model = data.engine;
        if (data.temperature && data.temperature != "")
            modelToUse.temperature = data.temperature.toString();
        if (data.maxtokens && data.maxtokens != "")
            modelToUse.max_tokens = data.maxtokens.toString();

        callOpenAI(messages, modelToUse, platform)
            .then(chatMessageToPost =>
            {
                let msg = findtriggerByMessageType("trigger_chatbotResponse")
                msg.parameters.message = serverConfig.chatbotprofiles[serverConfig.currentprofile].boticon + " " + chatMessageToPost;
                msg.parameters.platform = platform;
                //if this is a trigger message then send out normally on the channel
                if (triggerresponse)
                {
                    // send the modal data to our channel
                    sr_api.sendMessage(localConfig.DataCenterSocket,
                        sr_api.ServerPacket("ChannelData",
                            serverConfig.extensionname,
                            sr_api.ExtensionPacket(
                                "trigger_chatbotResponse",
                                serverConfig.extensionname,
                                msg,
                                serverConfig.channel,
                            ),
                            serverConfig.channel)
                    )
                }
                else
                {
                    // send the modal data to the extension
                    sr_api.sendMessage(localConfig.DataCenterSocket,
                        sr_api.ServerPacket("ExtensionMessage",
                            serverConfig.extensionname,
                            sr_api.ExtensionPacket(
                                "trigger_chatbotResponse",
                                serverConfig.extensionname,
                                msg,
                                serverConfig.channel,
                                data.from,
                            ),
                            serverConfig.channel,
                            data.from)
                    )
                }

            })
            .catch(e =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processTextMessage", "openAI datacenter message processing failed:", e.message);
                return;
            })
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processTextMessage", "openAI datacenter message processing failed:", e.message, data);
        return;
    }
}
// ============================================================================
//                    FUNCTION: parseKickMessage
// ============================================================================
/**
 * This function is called we we see a chat message posted from twitchchat extension
 * @param {object} data 
 * @param {number} [maxRollbackCount =20]
  */
function parseKickMessage (data)
{
    // convert the data into the old style format for parsing
    let messagedata =
    {
        message: data.message,
        engine: data.engine,
        temperature: data.temperature,
        maxtokens: data.maxtokens,
        data:
        {
            "message-type": "chat",
            "display-name": data.sender
        }
    }
    processChatMessage(messagedata, 20, "kick")
}
// ============================================================================
//                    FUNCTION: processChatMessage
// ============================================================================
/**
 * This function is called we we see a chat message posted from twitchchat extension
 * @param {object} data 
 * @param {number} [maxRollbackCount =20]
 */
function processChatMessage (data, maxRollbackCount = 20, platform = "twitch")
{
    // debug message colors
    let brightText = "\x1b[1m";
    let yellowColour = brightText + "\x1b[33m";
    let greenColour = brightText + "\x1b[32m";
    let redColour = brightText + "\x1b[31m"
    let resetColour = "\x1b[0m";
    // used to work out expired time when calculating the virtual 'typed response'
    let starttime = Date.now();
    let messages_handled = ""
    let sub_messages = "";
    let modelToUse = {}

    if (serverConfig.DEBUG_MODE === "on")
        console.log("chatbot:processChatMessage:data", data)
    // lets work out what messages we want to push through the chatbot
    if (serverConfig.DEBUG_MODE === "on")
    {
        messages_handled = ["chat", "LOCAL_DEBUG", "sub", "subscription", "resub", "submysterygift", "anongiftpaidupgrade", "anonsubmysterygift", "anonsubgift", "subgift", "giftpaidupgrade", "primepaidupgrade"];
        sub_messages = ["sub", "subscription", "resub", "submysterygift", "anongiftpaidupgrade", "anonsubmysterygift", "anonsubgift", "subgift", "giftpaidupgrade", "primepaidupgrade"];
    }
    else
    {
        messages_handled = ["chat", "LOCAL_DEBUG"]
        sub_messages = ["sub", "subscription", "resub"];
    }

    // check what these messages are
    if (serverConfig.DEBUG_MODE === "on")
        console.log("checking submessages for", data.data["message-type"], sub_messages.includes(data.data["message-type"]), data.data)
    let submessage = sub_messages.includes(data.data["message-type"]);
    let handledmessage = messages_handled.includes(data.data["message-type"]);

    if (serverConfig.DEBUG_MODE === "on")
    {
        console.log("Data for checking sub messages not being processed")
        console.log("!data.message", !data.message)
        console.log("typeof data.message !== 'string'", typeof data.message !== 'string')
        console.log("!(data.message instanceof String)", !(data.message instanceof String))
        console.log("!submessage", !submessage)
    }

    if (submessage && serverConfig.submessageenabled == "off")
        return;

    if ((!data.message || typeof data.message !== 'string') && !submessage)
    //if (!data.message && !submessage)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("received empty message")
        }
        return;
    }
    // check ignore list
    if (serverConfig.chatbotignorelist
        && data.data["display-name"]
        && serverConfig.chatbotignorelist.toLowerCase().indexOf(data.data["display-name"].toLowerCase()) > -1
        && !submessage)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring message, user on ignore list")
        }
        return;
    }
    //variable check if we have a direct question to the bot from chat
    let directChatQuestion = (
        // search the whole line
        (serverConfig.chatbotquerytagstartofline == "off" &&
            data.message.toLowerCase().includes(serverConfig.chatbotquerytag.toLowerCase()))
        ||
        // search for start of line
        (serverConfig.chatbotquerytagstartofline == "on" &&
            data.message &&
            data.message.toLowerCase().startsWith(serverConfig.chatbotquerytag.toLowerCase())));
    if (directChatQuestion && serverConfig.questionbotenabled == "off")
        return
    //variable check if we have a direct question to the bot from chat
    let directChatbotTriggerTag = false;
    if (data.message != null)
    {
        // check for the name at the start of line only (remove any @ symbols from his name as well.@for)
        let directChatbotTriggerTagTestMessage = data.message.replace("@", "").toLowerCase();
        if (serverConfig.chatbotname && serverConfig.chatbotnametriggertagstartofline == "on")
        {
            directChatbotTriggerTag =
                // check for trigger
                directChatbotTriggerTagTestMessage.startsWith(serverConfig.chatbotnametriggertag.toLowerCase() + " ")
                // check for botname
                || directChatbotTriggerTagTestMessage.startsWith(serverConfig.chatbotname.toLowerCase() + " ")
        }
        else
        {

            directChatbotTriggerTag =
                // check for start of string
                // check for trigger
                directChatbotTriggerTagTestMessage.startsWith(serverConfig.chatbotnametriggertag.toLowerCase())
                // check for botname
                || directChatbotTriggerTagTestMessage.startsWith(serverConfig.chatbotname.toLowerCase())

                // check for middle of string
                // check for trigger
                || directChatbotTriggerTagTestMessage.includes(" " + serverConfig.chatbotnametriggertag.toLowerCase())
                // check for botname
                || directChatbotTriggerTagTestMessage.includes(" " + serverConfig.chatbotname.toLowerCase())

                // check for end of string
                // check for trigger
                || directChatbotTriggerTagTestMessage.endsWith(" " + serverConfig.chatbotnametriggertag.toLowerCase())
                // check for botname
                || directChatbotTriggerTagTestMessage.endsWith(" " + serverConfig.chatbotname.toLowerCase())
        }
    }
    if (directChatbotTriggerTag && serverConfig.chatbottriggerenabled == "off")
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("ignoring chatbot trigger as it is turned off in settings")
        return;
    }
    // user asked for a translation
    let translateToEnglish = false;
    if (data.message)
    {
        translateToEnglish = (data.message.toLowerCase().startsWith(serverConfig.translatetoengtag.toLowerCase()));
    }

    if (translateToEnglish && serverConfig.translatetoeng == "off")
        return;

    // skip messages we don't want to use for chatbot.
    if (!handledmessage && !submessage && !directChatQuestion && !translateToEnglish && !directChatbotTriggerTag)
    //if (data.data["message-type"] != "chat" && data.data["message-type"] != "LOCAL_DEBUG" && !directChatQuestion)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring message, non 'chat'/direct question")
        }
        return;
    }
    // check that we are enabled for chat or questions
    if (serverConfig.questionbotenabled === "off" && serverConfig.chatbotenabled === "off" && serverConfig.submessageenabled === "off")
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring messages, chat, question and subs bots disabled", data.data["message-type"])
        }
        return;
    }

    if (serverConfig.DEBUG_MODE === "on")
    {
        console.log("submessage=", submessage);
        console.log("chatbotname=", serverConfig.chatbotname);
        console.log("message displayname=", data.data["display-name"]);
    }
    // ignore messages from the bot and system
    if (!submessage &&
        (// bot message
            (serverConfig.chatbotname != null
                && data.data["display-name"].toLowerCase().indexOf(serverConfig.chatbotname.toLowerCase()) != -1
            )
            // system message
            || data.data["display-name"].toLowerCase().indexOf("system") != -1
        )
    )
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("Ignoring system/bot message", serverConfig.chatbotname, data.message)
        return;
    }

    // is this a chatmessage and inside of the time window (if not a direct question, translation or a sub message)
    if (localConfig.inTimerWindow === false && !directChatQuestion && !translateToEnglish && !submessage && !directChatbotTriggerTag)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring message, chatbot waiting for timer to go off")
        }
        return;
    }

    // Is the message long enough to be considered
    if (data.message && (data.message.length < serverConfig.chatbotminmessagelength
        && !directChatQuestion
        && !submessage
        && !directChatbotTriggerTag))
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("message not long enough (char minimum limit in settings) " + data.message + "'", data.message.length + "<" + serverConfig.chatbotminmessagelength)
        return
    }
    if (serverConfig.DEBUG_MODE === "on")
    {
        console.log(greenColour + "--------- pre-processing -------- ") + resetColour
        console.log("chat message to remove emotes, links, '@' symbols etc")
        console.log(yellowColour + data.data['display-name'] + ">" + resetColour, data.message)
    }

    // preprosess Parse the messsage
    let chatdata = parseData(data, translateToEnglish)

    // debug logging
    if (chatdata && chatdata.message && serverConfig.DEBUG_MODE === "on")
        console.log(yellowColour + data.data['display-name'] + ">" + resetColour, data.message)
    // if we have just sent a request then delay to avoid overloading the API and getting 429 errors
    // this should really be a rollback timeout but this whole code needs re-writing at this point :P
    if (starttime - localConfig.lastrequesttime < localConfig.overloadprotection
        || localConfig.requestPending)
    {
        // random timeout between 200 and 500ms
        var randomTimeout = (Math.random() * 300) + 200;
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("maxRollbackCount", maxRollbackCount)
            console.log("requestPending", localConfig.requestPending)
            console.log("starttime", starttime)
            console.log("lastrequesttime", localConfig.lastrequesttime)
            console.log("overloadprotection", localConfig.overloadprotection)
            console.log(starttime - localConfig.lastrequesttime < localConfig.overloadprotection)
            console.log(" ********************** waiting for rollback timeout:", randomTimeout)
        }
        if (maxRollbackCount < 0)
        {
            // if we hit this something has probably got stuck so lets unstick it for the user
            localConfig.requestPending = false;
            if (serverConfig.DEBUG_MODE === "on")
                console.log("Ran out of retries on the rollback")
            return;
        }
        setTimeout(() =>
        {
            processChatMessage(data, maxRollbackCount--, platform)
        }, randomTimeout);
        return;
    }
    // check the length again after parsing the message to make sure it is still long enough (if not a direct message)
    if (
        (!chatdata || !chatdata.message || chatdata.message === "" || chatdata.message.length < serverConfig.chatbotminmessagelength)
        && !translateToEnglish
        && !directChatQuestion
        && !submessage
        && !directChatbotTriggerTag)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            if (chatdata && chatdata.message && chatdata.message.length < serverConfig.chatbotminmessagelength)
                console.log("CHATBOT: chatdata too short' " + chatdata.message + "'", chatdata.message.length + "<" + serverConfig.chatbotminmessagelength)
            else
                console.log("CHATBOT: chatdata not usable")
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
        }
        return
    }
    // is this a direct question from chat or a sub
    else if (translateToEnglish || submessage)
    {
        let messages = ""

        // translation model default settings
        if (translateToEnglish)
        {
            modelToUse = {
                model: serverConfig.translatetoengengine,
                temperature: serverConfig.translatetoengtagtemperature,
                max_tokens: serverConfig.translatetoengtagmaxtokenstouse,
            }
        }
        else // sub message default settings
        {
            modelToUse = {
                model: serverConfig.chatbotnametriggerengine,
                temperature: serverConfig.chatbotnametriggertemperature,
                max_tokens: serverConfig.chatbotnametriggermaxtokenstouse,
            }
        }
        // update the engine to the data sent if filled in
        if (data.engine && data.engine != "")
            modelToUse.model = data.engine;
        if (data.temperature && data.temperature != "")
            modelToUse.temperature = data.temperature.toString();
        if (data.maxtokens && data.maxtokens != "")
            modelToUse.max_tokens = data.maxtokens.toString();

        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
            console.log("Performing Tanslation/submessage")
        }

        if (translateToEnglish)
        {
            if (serverConfig.DEBUG_MODE === "on")
                console.log("Translating to english")
            // ##############################################
            //         Processing a translation message
            // ##############################################
            messages = [{
                "role": "user", "content": "Translate this into English :\n" + chatdata.message.replace(serverConfig.translatetoengtag, "")
            }]

        }
        else if (submessage)
        {
            // ##############################################
            //         Processing a sub/dono message message
            // ##############################################
            messages = [{ "role": "user", "content": data.data['system-msg'] }];
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!! chatbot: sub/dono message", messages)
        }

        if (serverConfig.translatetoeng === "on" || serverConfig.submessageenabled === "on")
        {
            callOpenAI(messages, modelToUse, platform)
                .then(chatMessageToPost =>
                {
                    if (chatMessageToPost)
                    {
                        if (platform == "twitch")
                        {
                            if (!submessage)
                                postMessageToTwitch(" (" + data.data['display-name'] + ") " + chatMessageToPost)
                            else
                                postMessageToTwitch(chatMessageToPost)
                        }
                        else if (platform == "kick")
                        {
                            if (!submessage)
                                postMessageToKick(" (" + data.data['display-name'] + ") " + chatMessageToPost)
                            else
                                postMessageToKick(chatMessageToPost)
                        }
                        else
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "failed to post sub message, no platform set:");
                    }
                    return;
                })
                .catch(e =>
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "openAI question request failed:", e.message);
                    return;
                })
            return;
        }
        else
            // add CD timer here to stop spam messages
            postMessageToTwitch("Sorry, the I'm currently asleep and can't answer your message, please try again later")

    } // is this a diect question from chat
    else if (directChatQuestion)
    {
        modelToUse = {
            model: serverConfig.chatbotqueryengine,
            temperature: serverConfig.chatbotquerytemperature,
            max_tokens: serverConfig.chatbotquerymaxtokenstouse,
        }
        // update the engine to the data sent if filled in
        if (data.engine && data.engine != "")
            modelToUse.model = data.engine;
        if (data.temperature && data.temperature != "")
            modelToUse.temperature = data.temperature.toString();
        if (data.maxtokens && data.maxtokens != "")
            modelToUse.max_tokens = data.maxtokens.toString();
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
            console.log("Direct question asked")
        }
        if (serverConfig.questionbotenabled === "on")
        {
            // ##############################################
            //         Processing a question message
            // ##############################################
            if (chatdata && chatdata.message && chatdata.message.length > 0)
            {
                //let messages = addPersonality(chatdata.message, serverConfig.currentprofile)
                let message = [{ "role": "user", "content": chatdata.message }]

                callOpenAI(message, modelToUse, platform)
                    .then(chatMessageToPost =>
                    {
                        if (chatMessageToPost)
                        {
                            if (platform == "twitch")
                                postMessageToTwitch(chatMessageToPost)
                            else if (platform == "kick")
                                postMessageToKick(chatMessageToPost)
                            else
                                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "failed to post question message, no platform set:");
                        }
                        return;
                    })
                    .catch(e =>
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "openAI question request failed:", e.message);
                        return;
                    })
                return;
            }
            else
            {
                console.log("Chatbot, ignoring message, did it contain a http reference or was was it to short? message:", data.message)
                return;
            }
        }
        else
            // add CD timer here to stop spam messages
            postMessageToTwitch("Sorry, the I'm currently asleep and can't answer your message, please try again later")

    }
    // chat bot is currently turned off
    else if (serverConfig.chatbotenabled != "on")
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
            console.log("ignoring message, bot turned off")
        }
        return;
    }

    if (serverConfig.DEBUG_MODE === "on")
        console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
    // race condition where a second message thread starts while one is still waiting to return from the API
    // set the count to zero so this tread exits and the next one won't come in
    if (localConfig.requestPending)
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("API request already in progress")
        localConfig.chatMessageCount = 0;
    }
    else
    {
        if (chatdata && chatdata.message && chatdata.message != "")
        {
            if (!localConfig.chatHistory[platform])
                localConfig.chatHistory[platform] = [];
            localConfig.chatHistory[platform].push({ "role": "user", "content": data.data['display-name'] + ": " + chatdata.message })
            localConfig.chatMessageCount++;
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "error, chatdata, data", chatdata, data);
        }
    }

    if (!directChatbotTriggerTag && ((localConfig.chatMessageCount < serverConfig.chatbotMessageMaxLines) || (localConfig.chatMessageCount < 1)))
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("not got enough messages in buffer to process yet", localConfig.chatMessageCount)
        return;
    }
    else
    {
        if (directChatbotTriggerTag)
        {
            modelToUse = {
                model: serverConfig.chatbotnametriggerengine,
                temperature: serverConfig.chatbotnametriggertemperature,
                max_tokens: serverConfig.chatbotnametriggermaxtokenstouse,
            }
        } else
        {
            modelToUse = {
                model: serverConfig.chatbotautoresponseengine,
                temperature: serverConfig.chatbotautoresponsetemperature,
                max_tokens: serverConfig.chatbotautoresponsemaxtokenstouse,
            }
        }
        // update the engine to the data sent if filled in
        if (data.engine && data.engine != "")
            modelToUse.model = data.engine;
        if (data.temperature && data.temperature != "")
            modelToUse.temperature = data.temperature.toString();
        if (data.maxtokens && data.maxtokens != "")
            modelToUse.max_tokens = data.maxtokens.toString();
        // ##############################################
        //         Processing a chat message
        // ##############################################
        // only get to here if we have enough messages and everything is set to enabled
        localConfig.requestPending = true;
        let messages = ""

        if (serverConfig.DEBUG_MODE === "on" && directChatbotTriggerTag)
        {
            if (directChatbotTriggerTag)
                console.log("Chat Triggerd message")
            else
                console.log("Standard Chat response")
        }
        // TODO Need a hitory bufffer to add ig we want to
        // do we want previous history
        //if (!directChatbotTriggerTag || (directChatbotTriggerTag && serverConfig.chatbotnametriggertagaddhistory))
        messages = addPersonality(data.data['display-name'], "", serverConfig.currentprofile, platform)


        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(redColour + "--------- requesting chatGPT response for the following messages -------- " + resetColour)
            messages.forEach(function (item, index)
            {
                console.log(">>>>>>[" + item.role + "] " + item.content)
            })
            console.log(redColour + "--------- requesting chatGPT response -------- " + resetColour)

        }

        callOpenAI(messages, modelToUse, platform)
            .then(chatMessageToPost =>
            {
                if (chatMessageToPost)
                {
                    let wordcount = chatMessageToPost.split(" ").length
                    let delaytime = (wordcount * serverConfig.chatbottypingdelay * 1000) - (Date.now() - starttime);
                    if (serverConfig.DEBUG_MODE === "on")
                    {
                        console.log("Checking the time to delay based on typing speed setting")
                        console.log("processing time: ", Date.now() - starttime)
                        console.log("wordcount: ", wordcount, ": ", serverConfig.chatbottypingdelay)
                        console.log("delay response: ", delaytime / 1000, "s")
                    }
                    setTimeout(() =>
                    {
                        if (platform == "twitch")
                            postMessageToTwitch(chatMessageToPost)
                        else if (platform == "kick")
                            postMessageToKick(chatMessageToPost)
                        else
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "failed to post message, no platform set:");

                    }, delaytime);
                    // if we don't have a time inTimerWindow start a new one (might have been called from a chat question)
                    if (localConfig.chatTimerHandle._destroyed)
                        startChatbotTimer()

                    //clear the buffer for next time (probably had some async messages while waiting for api to return)
                    localConfig.chatHistory[platform] = []
                }
                localConfig.requestPending = false;
            })
            .catch(e =>
            {
                localConfig.requestPending = false;
                localConfig.inTimerWindow = false
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatMessage", "openAI chat request failed:", e.message);
            })

    }
}
// ============================================================================
//                           FUNCTION: callOpenAI
// ============================================================================
/**
 * Calls OpenAI with the given strings using the model data provided
 * @param {string} string_array array of strings to send to openAI
 * @param {object} modelToUse The openAI model detailsto use
 * @returns OpenAI response or error message
 */
async function callOpenAI (string_array, modelToUse, platform)
{
    if (serverConfig.DEBUG_MODE === "on")
        console.log("Calling OpenAI with model ", string_array, modelToUse)
    try
    {
        string_array.push(
            {
                role: 'system',
                content: 'Absolutely no Markdown, formatting, line breaks, bullet points, or code blocks. Every reply must be in plain, unformatted text as a single, self-contained Twitch chat message.'
            }
        )
        if (localConfig.openAIKey)
        {
            localConfig.OpenAPIHandle = new OpenAIApi(
                {
                    apiKey: localConfig.openAIKey
                });

            const response = await localConfig.OpenAPIHandle.responses.create({
                model: modelToUse.model,
                store: false,
                max_output_tokens: Number(modelToUse.max_tokens),
                temperature: Number(modelToUse.chattemperature),
                truncation: "auto",
                input: string_array,
            })
                /*const response = await localConfig.OpenAPIHandle.createChatCompletion(
                    {
                        model: modelToUse.model,
                        messages: string_array,
                        temperature: Number(modelToUse.chattemperature),
                        max_tokens: Number(modelToUse.max_tokens)
                        //stop: ["Human:", "AI:"]
                    })*/
                .catch((err) => 
                {
                    localConfig.requestPending = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "callOpenAI Failed (possibly incorrect credentials?)", err.message)
                    sendErrorMessageToChannel(err)
                    logger.err("Full error message", JSON.stringify(err, null, 2))
                }
                )
            localConfig.requestPending = false;
            // min time between requests (to avoid 429 errors)
            localConfig.lastrequesttime = Date.now();
            if (!response)
            {
                localConfig.requestPending = false;
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "callOpenAI no responce or partial response Error was")
                return "Failed to get a response from chatbot, server might be down"
            }
            if (serverConfig.DEBUG_MODE === "on")
            {
                console.log("CHATBOT: OpenAI returned the following response :")
                console.log(JSON.stringify(response))
                console.log("response.error", response.error)
            }

            let openAIResponce = response.output_text;
            //if (response.status == "completed" || response.status == "incomplete")
            if (response.error == null
                || response.status == "completed"
                || response.status == "incomplete"// might be a partial due to token limit we have set
            )
            {
                //openAIResponce = openAIResponce.trim()
                openAIResponce = openAIResponce.replaceAll("\n", " ").replace(/\s+/g, ' ').trim()
                localConfig.lastAIResponse = openAIResponce;
                localConfig.lastAIRequest[platform] = ""
                if (!localConfig.chatHistory[platform])
                    localConfig.chatHistory[platform] = [];
                for (let index = 0; index < localConfig.chatHistory[platform].length; index++)
                    localConfig.lastAIRequest[platform] += localConfig.chatHistory[platform][index].content + ". "
                openAIResponce = replaceUnusualChars(openAIResponce)
                return openAIResponce;
            }
            else
            {
                if (serverConfig.DEBUG_MODE === "on")
                {
                    logger.err("CHATBOT: OpenAI returned the following error :")
                    logger.err(JSON.stringify(response))
                }
                localConfig.lastrequesttime = Date.now();
                localConfig.requestPending = false;
            }
        }
        else
        {
            localConfig.requestPending = false;
            if (serverConfig.chatbotenabled === "off")
            {
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "chatbot turned off by user");
                return "chatbot is turned off"
            }
            else if (!localConfig.openAIKey)
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "No chatbot credentials set");
                return "chatbot has no login credentials"
            }
        }

    } catch (err)
    {
        localConfig.lastResultSuccess = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "openAI error:", err.message);
    }
    return "chatbot sorry I failed in the quest you sent me on!"
}
// ============================================================================
//                           FUNCTION: addPersonality
// ============================================================================
/**
 * Adds a presonality string to prepair for sending to OpenAI.
 * @param {string} username username of the requester
 * @param {string} [message] message data if data is "" then uses chat history for the message
 * @param {string} profile profile to attatch to the message
 * @returns message with included personality
 */
function addPersonality (username, message, profile, platform)
{
    let outputmessage = [
        { "role": "system", "content": serverConfig.chatbotprofiles[profile].p },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q1.replace("%%CHATBOTTRIGGERNAME%%", serverConfig.chatbotnametriggertag) },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a1 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q2.replace("%%CHATBOTTRIGGERNAME%%", serverConfig.chatbotnametriggertag) },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a2 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q3.replace("%%CHATBOTTRIGGERNAME%%", serverConfig.chatbotnametriggertag) },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a3 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q4.replace("%%CHATBOTTRIGGERNAME%%", serverConfig.chatbotnametriggertag) },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a4 }
    ];

    if (message == "")
    {
        if (localConfig.lastAIResponse != "" && serverConfig.chatbotpreviousresponseinhistoryenabled == "on")
            outputmessage.push({ "role": "user", "content": serverConfig.chatbotnametriggertag + ": " + localConfig.lastAIResponse })
        //add chat messages
        if (localConfig.chatHistory[platform])
        {
            for (const obj of localConfig.chatHistory[platform])
                outputmessage.push(obj);
        }
    }
    else
        outputmessage.push({ "role": "user", "content": username + ": " + message })
    return outputmessage;
}
// ============================================================================
//                           FUNCTION: parseData
// ============================================================================
/**
 * Parses twitch chat data object creating a string with emotes and removing non ascii chars
 * @param {object} data 
 * @param {boolean} translation 
 * @returns null or parsed data
 */
function parseData (data, translation = false)
{
    let messageEmotes = data.data.emotes;
    let emoteposition = null
    let emotetext = null
    if (messageEmotes && messageEmotes != null && messageEmotes != "")
    {
        emotetext = []
        for (var key in messageEmotes) 
        {
            if (!messageEmotes.hasOwnProperty(key))
                continue;

            emoteposition = messageEmotes[key][0].split("-");
            emotetext.push(data.message.substring(emoteposition[0], Number(emoteposition[1]) + 1))
        }
        if (emotetext)
        {
            emotetext.forEach(function (item, index)
            {
                data.message = data.message.replaceAll(item, "")
            });
        }
    }
    // remove the @ messages but keep the names (might be better to remove them though still testing)
    try
    {
        if (data.message)
            data.message = data.message.replace("@", "");
    }
    catch (error)
    {
        // debugging why we fail here. prob message is empty but it shouldn't be
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".parseData", "message failure", error, error.message, JSON.stringify(data, null, 2));
    }
    try
    {
        //remove non ascii chars (ie ascii art, unicode etc)
        if (!translation)
            data.message = data.message.replace(/[^\x00-\x7F]/g, "");
        // strip all white spaces down to one
        data.message = data.message.replace(/\s+/g, ' ').trim();

        if (data.message.includes("http"))
        {
            if (serverConfig.DEBUG_MODE === "on")
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".parseData", "message rejected as it contains a url");
            return null;
        }
    }
    catch (error)
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".parseData", "Error while removing non asci chars", error, error.message, JSON.stringify(data, null, 2));
    }
    return data
}
// ============================================================================
//                           FUNCTION: replaceUnusualChars
//            replaces some of the unusal chars we might get back in a response
// ============================================================================
function replaceUnusualChars (message)
{
    message = message.replaceAll("’", "'");
    return message
}
// ============================================================================
//                           FUNCTION: createImageFromAction
//            Creates an image from a description
// ============================================================================
/**
 * Takes a messages and tries to get an openAI image generated. if successful
 * we then send a trigger out with the details of the image (filename,prompt etc)
 * @param {object} data action_ProcessImage params {usechatbot,prompt,message,append,requester}
 * @param {string} platform
 * @param {string} ref
 * @returns error messages
 */
async function createImageFromAction (data, platform = "twitch", ref = "")
{
    if (serverConfig.generateimages != "on")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".createImageFromAction", "Create image called but turned off in settings");
        return
    }
    try
    {
        let messages = ""
        // Create our image prompt for OpenAI
        if (data.message == "")
        {

            if (data.usechatbot == "true")
                messages = data.prompt + " " + localConfig.lastAIResponse + " " + data.append
            else if (localConfig.lastAIRequest[platform])
                messages = data.prompt + " " + localConfig.lastAIRequest[platform] + " " + data.append
            else if (data.prompt != "" && data.append != "")
                messages = data.prompt + " " + data.append
            else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".createImageFromAction: callOpenAI error data ", data)
                return "no data to send for request"
            }

        }
        else
            messages = data.prompt + " " + data.message + " " + data.append;
        if (serverConfig.DEBUG_MODE === "on")
            console.log("chatbot:createImageFromAction: messages", messages)

        if (serverConfig.currentimageModel == 0) //dall-e-3 image
            generate_Dall_E_3_Image(messages, data.requester, platform, ref);
        else if (serverConfig.currentimageModel == 1) //gpt-image-1
            generate_GPT_Image_1_Image(messages, data.requester, platform, ref);
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".createImageFromAction:", "openAI datacenter message processing failed:", e, e.message, data);
        return;
    }
}
// ============================================================================
//                           FUNCTION: generate_Dall_E_3_Image
// ============================================================================
/**
 * generates a dall-e-3 image
 * @param {object} messages 
 * @param {string} requester 
 * @param {string} platform 
 * @param {string} ref 
 */
function generate_Dall_E_3_Image (messages, requester, platform, ref)
{
    try
    {
        let openAIImageQuery = ""
        if (localConfig.openAIKey)
        {
            // get image URL from OpenAI
            localConfig.openAPIImageHandle = new OpenAIApi(
                {
                    apiKey: localConfig.openAIKey
                });
            openAIImageQuery = messages
            localConfig.openAPIImageHandle.images.generate({
                model: serverConfig.imageModels[serverConfig.currentimageModel],
                prompt: openAIImageQuery,
                n: 1,
                quality: serverConfig.imageQualities[0][serverConfig.currentchatbotImageQuality[0]],
                size: serverConfig.imageSizes[0][serverConfig.currentchatbotImageSize[0]], // options are 1024x1024, 1024x1792 or 1792x1024
            })
                .then(response =>
                {
                    let image_url = null;
                    image_url = response.data[0].url;
                    if (!image_url || image_url == "")
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".generate_Dall_E_3_Image: callOpenAI no responce or partial response")
                        return "Failed to get a response from chatbot, server might be down"
                    }
                    else
                        saveImageFileFromURL(image_url, requester, messages, response.data[0].revised_prompt, platform, ref)
                })
                .catch((err) => 
                {
                    if (err.status == "403")
                        console.log(err.message)
                    else
                    {
                        console.log(err)
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".generate_Dall_E_3_Image: callOpenAI Failed (possibly incorrect credentials?)", err.message)
                        sendErrorMessageToChannel(err)
                        logger.err("Full error message", JSON.stringify(err.toString()), null, 2)
                    }
                })
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".generate_Dall_E_3_Image:", "No openAI auth key set");
        }
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".generate_Dall_E_3_Image:", "openAI datacenter message processing failed:", e, e.message, messages, requester);
        return;
    }
}
// ============================================================================
//                           FUNCTION: generate_GPT_image_1_Image
// ============================================================================
/**
 * generates a dall-e-3 image
 * @param {object} messages 
 * @param {string} requester 
 * @param {string} platform 
 * @param {string} ref 
 */
function generate_GPT_Image_1_Image (messages, requester, platform, ref)
{
    try
    {
        let openAIImageQuery = ""
        if (localConfig.openAIKey)
        {
            localConfig.openAPIImageHandle = new OpenAIApi(
                {
                    apiKey: localConfig.openAIKey
                });
            openAIImageQuery = messages
            localConfig.openAPIImageHandle.images.generate({
                model: serverConfig.imageModels[serverConfig.currentimageModel],
                prompt: openAIImageQuery,
                n: 1,
                quality: serverConfig.imageQualities[1][serverConfig.currentchatbotImageQuality[1]],
                size: serverConfig.imageSizes[1][serverConfig.currentchatbotImageSize[1]],
            })
                .then(response =>
                {

                    let imageBuffer = null;
                    // get the image url from OpenAI's response
                    imageBuffer = Buffer.from(response.data[0].b64_json, "base64");
                    if ((!imageBuffer || imageBuffer == ""))
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".generate_GPT_Image_1_Image: callOpenAI no responce or partial response")
                        return "Failed to get a response from chatbot, server might be down"
                    }
                    else
                        saveImageFileFromBuffer(imageBuffer, requester, prompt, platform, ref)

                })
                .catch((err) => 
                {
                    if (err.status == "403")
                        console.log(err.message)
                    else
                    {
                        console.log(err)
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".generate_GPT_Image_1_Image: callOpenAI Failed (possibly incorrect credentials?)", err.message)
                        sendErrorMessageToChannel(err)
                        logger.err("Full error message", JSON.stringify(err.toString()), null, 2)
                    }
                })
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".generate_GPT_Image_1_Image:", "No openAI auth key set");
        }

    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".generate_GPT_Image_1_Image:", "openAI datacenter message processing failed:", e, e.message);
        return;
    }
}
// ============================================================================
//                           FUNCTION: saveImageFileFromURL
// ============================================================================
/**
 * 
 * @param {string} URL 
 * @param {string} requester 
 * @param {string} prompt 
 * @param {string} revised_prompt 
 * @param {string} platform 
 * @param {string} ref 
 */
function saveImageFileFromURL (URL, requester, prompt, revised_prompt, platform, ref)
{
    // save image to live dir folder
    let saveDir = __dirname + "\\" + serverConfig.livedir + "\\"
    // create a filenmane using a timestamp
    let dateNow = new Date()
    let fileTimeStamp = dateNow.getFullYear()
        + "-" + dateNow.getMonth().toString().padStart(2, '0')
        + "-" + dateNow.getDate().toString().padStart(2, '0')
        + "__" + dateNow.getHours().toString().padStart(2, '0')
        + "-" + dateNow.getMinutes().toString().padStart(2, '0')
        + "-" + dateNow.getSeconds().toString().padStart(2, '0')

    let imageName = "saved_image_"
    if (requester && requester != "")
        imageName = requester + "_" + fileTimeStamp
    let imageFilename = saveDir + imageName

    try
    {
        // if the dir doesn't exist then make it
        if (!fs.existsSync(saveDir))
            fs.mkdirSync(saveDir, { recursive: true });

        createImageMetaDataFile(imageFilename + ".txt", requester, prompt, platform, ref)

        // ######### save the image file #########
        // create a stream and write the file to disk.
        const file = fs.createWriteStream(imageFilename + ".jpg");
        https.get(URL, response =>
        {
            response.pipe(file);
        }).on('error', err =>
        {
            fs.unlink(imageName + ".jpg");
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".createImageFromAction: Error saving AI image", err, err.message)
        });

        // when file has finished writing send out the notification with a short url
        file.on('finish', () =>
        {
            // Close the file descriptor 
            file.close((err) =>
            {
                if (err)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".createImageFromAction: Fail to close file", err, err.message)
                    return "";
                }
                else
                    sendImageTiggerResponse(URL, requester, imageFilename + ".jpg", prompt, revised_prompt, platform, ref)

            });

        });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".createImageFromAction: Saving image failed", err, err.message)
    }
}
// ============================================================================
//                           FUNCTION: saveImageFileFromBuffer
// ============================================================================
/**
 * sends an error message out on our channel.
 * @param {string} imageBuffer 
 * @param {string} requester 
 * @param {string} prompt 
 * @param {string} platform 
 * @param {string} ref 
 */
function saveImageFileFromBuffer (imageBuffer, requester, prompt, platform, ref)
{
    // save image to live dir folder
    let saveDir = __dirname + "\\" + serverConfig.livedir + "\\"
    // create a filenmane using a timestamp
    let dateNow = new Date()
    let fileTimeStamp = dateNow.getFullYear()
        + "-" + dateNow.getMonth().toString().padStart(2, '0')
        + "-" + dateNow.getDate().toString().padStart(2, '0')
        + "__" + dateNow.getHours().toString().padStart(2, '0')
        + "-" + dateNow.getMinutes().toString().padStart(2, '0')
        + "-" + dateNow.getSeconds().toString().padStart(2, '0')

    let imageName = "saved_image_"
    if (requester && requester != "")
        imageName = requester + "_" + fileTimeStamp
    let imageFilename = saveDir + imageName

    try
    {
        // if the dir doesn't exist then make it
        if (!fs.existsSync(saveDir))
            fs.mkdirSync(saveDir, { recursive: true });
        // ######### save the metadata file #########
        createImageMetaDataFile(imageFilename + ".txt", requester, platform, ref)
        // ######### save the image file #########
        //const file = fs.createWriteStream(imageFilename + ".png");

        try
        {
            fs.writeFileSync(imageFilename + ".png", imageBuffer)
            sendImageTiggerResponse("", requester, imageFilename + ".png", prompt, "", platform, ref)
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".saveImageFileFromBuffer: Saving image failed", err, err.message)
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".saveImageFileFromBuffer: Creating image file failed", err, err.message)
    }
}
// ============================================================================
//                           FUNCTION: createImageMetaDataFile
// ============================================================================
/**
 * 
 * @param {string} filename 
 * @param {string} requester 
 * @param {string} prompt 
 * @param {string} platform 
 * @param {string} ref 
 */
function createImageMetaDataFile (filename, requester, prompt, platform, ref)
{
    // save the image meta-data file
    fs.writeFile(filename, prompt + "\n" + "platform" + platform + "\n" + "ref" + ref, err =>
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, ".createImageFromAction: Error saving image.txt meta file", err, err.message)
        }

    });
}
// ============================================================================
//                           FUNCTION: sendErrorMessageToChannel
// ============================================================================
/**
 * sends an error message out on our channel.
 * @param {object} err 
 */
function sendErrorMessageToChannel (err)
{
    try
    {
        //"Request failed with status code 429"
        let data = "Error message was:"
        if (err)
        {
            if (err.no)
            {

                if (err.message.includes("401"))
                    data + "401: Unauthorized, have to setup your credentials";
                else if (err.message.includes("402"))
                    data + "402: Payment Required"

                else if (err.message.includes("403"))
                    data + "403: Country, region, or territory not supported"
                else if (err.message.includes("429"))
                    data + "429: You exceeded your current quota or rate limit"
                else if (err.message.includes("500"))
                    data + "500: The server had an error while processing your request"
                else if (err.message.includes("503"))
                    data + "503: The engine is currently overloaded, please try again later"
                else
                    data + err.message

                data + "See https://platform.openai.com/docs/guides/error-codes/api-errors for more info on OpenAI Codes"
            }
        }
        else
            data + " empty"

        let messagedata = {
            channel: "chatbot",
            message: "testing chatbot message errors",
            dateStamp: Date.now(),
            data: { "display-name": "System", "emotes": "", "message-type": "chatbot_extension" }
        };
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket(
                "ChannelData",
                localConfig.EXTENSION_NAME,
                sr_api.ExtensionPacket(
                    "serverError",
                    localConfig.EXTENSION_NAME,
                    messagedata,
                    serverConfig.channel
                ),
                serverConfig.channel
            ));
    }
    catch (e)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".sendErrorMessageToChannel:", "openAI error message failed to send to liveport chat:", e.message);
        return;
    }
}

// ============================================================================
//                           FUNCTION: sendImageTiggerResponse
// ============================================================================
/**
 * Sends out a trigger_imageResponse trigger with the given data
 * @param {string} image_url 
 * @param {string} requester 
 * @param {string} tmp_file_name 
 * @param {string} message 
 * @param {string} rev_prompt 
 * @param {string} platform 
 * @param {string} ref 
 */
function sendImageTiggerResponse (image_url, requester, tmp_file_name, message, rev_prompt, platform, ref)
{
    let msg = findtriggerByMessageType("trigger_imageResponse")
    if (msg)
    {
        msg.parameters.url = image_url;
        msg.parameters.requester = requester;
        msg.parameters.temp_save_file = tmp_file_name;
        msg.parameters.message = message;
        msg.parameters.rev_prompt = rev_prompt;
        msg.parameters.platform = platform
        msg.parameters.triggerActionRef = ref
        // send the modal data to our channel
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "trigger_imageResponse",
                    serverConfig.extensionname,
                    msg,
                    serverConfig.channel,
                ),
                serverConfig.channel)
        )
    }
    else
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".sendImageTiggerResponse:", "Failed to retrieve trigger_imageResponse tigger object");
    }
}
// ============================================================================
//                           FUNCTION: postMessageToTwitch
// ============================================================================
/**
 * sends a action_SendChatMessage to twitchchat to post a twitch message to chat
 * @param {string} message 
 */
function postMessageToTwitch (message)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "action_SendChatMessage",
                serverConfig.extensionname,
                { platform: "twitch", account: "bot", message: serverConfig.chatbotprofiles[serverConfig.currentprofile].boticon + " " + message },
                "",
                "twitchchat"),
            "",
            "twitchchat"
        )
    );
}
// ============================================================================
//                           FUNCTION: postMessageToKick
// ============================================================================
/**
 * sends a action_SendChatMessage to twitchchat to post a twitch message to chat
 * @param {string} message 
 */
function postMessageToKick (message)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "action_SendChatMessage",
                serverConfig.extensionname,
                {
                    platform: "kick",
                    account: "bot",
                    message: serverConfig.chatbotprofiles[serverConfig.currentprofile].boticon + " " + message
                },
                "",
                "kick"),
            "",
            "kick"
        )
    );
}
// ============================================================================
//                           FUNCTION: startChatbotTimer
// ============================================================================
/**
 * Setup the timer for a random interval for bot to join chat based on user settings
 * This is used to add a delay in between chat processing to cut down on the bot spamming
 * chat
 */
function startChatbotTimer ()
{
    localConfig.inTimerWindow = false;
    var randomTimeout = Math.floor(Math.random() * ((serverConfig.chatbotTimerMax * 60000) - (serverConfig.chatbotTimerMin * 60000) + 1) + (serverConfig.chatbotTimerMin * 60000));
    //avoid spamming the API so set the maximum query time to 1 seconds
    if (randomTimeout < 1000)
        randomTimeout = 1000

    localConfig.chatHistory = []
    localConfig.chatMessageCount = 0;
    if (localConfig.chatTimerHandle != null)
        clearTimeout(localConfig.chatTimerHandle);
    if (serverConfig.DEBUG_MODE === "on")
        console.log("Setting sleep timer to", (randomTimeout / 1000), "seconds")
    localConfig.chatTimerHandle = setTimeout(startProcessing, randomTimeout);

    logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".startChatbotTimer", "Chatbot Timer started: wait time ", randomTimeout, "minutes");
}
// ============================================================================
//                           FUNCTION: startProcessing
// ============================================================================
/**
 * Starts processing chat for messages to build a history and send to openAI for an
 * automatic chat response
 */
function startProcessing ()
{
    if (serverConfig.DEBUG_MODE === "on")
        console.log("#### CHATBOT processing started #####");
    localConfig.chatHistory = []
    localConfig.chatMessageCount = 0;
    if (localConfig.chatTimerHandle != null)
        clearTimeout(localConfig.chatTimerHandle);
    localConfig.inTimerWindow = true;
    logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".startProcessing", "processing started");

}
// ============================================================================
//                           FUNCTION: changeBotName
// ============================================================================
/**
 * Used to change the bot name. ie after startup and login we update our name
 * in all the strings we use to what the user has configured
 */
function changeBotName ()
{
    serverConfig.chatbotnametriggertag = serverConfig.chatbotnametriggertag.replaceAll(/TWITCHCHATBOTNAME/g, serverConfig.chatbotname);
    //serverConfig.chatbotquerytag = serverConfig.chatbotquerytag.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
    //serverConfig.translatetoeng = serverConfig.translatetoeng.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
}
// ============================================================================
//                           FUNCTION: moveImagefilesToFolder
// ============================================================================
/**
 * Used to move image files generated by openAI to a new folder
 * @param {string} from 
 * @param {string} to 
 */
function moveImagefilesToFolder (from, to)
{
    try
    {
        fs.readdir(from, (err, files) =>
        {
            // sledgehammer code. Even if folders exist it will attempt to create them and ignore any that 
            // already exist. this is only run at stream start so performance isn't an issue here.
            createfolder(from)
            createfolder(to)

            if (files == undefined)
            {
                // no images to process.
                return;
            }
            else
            {
                files.forEach(file =>
                {
                    fs.rename(from + "\\" + file, to + "\\" + file, err =>
                    {
                        if (err)
                        {
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".moveImagefilesToFolder", "Failed to move file from " + from + "\\" + file + " to " + to + "\\" + file, err, err.message);
                        }
                    });
                });
            }
        });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".moveImagefilesToFolder", "Failed to move files from " + from + " to " + to, err, err.message);
    }
}
// ============================================================================
//                           FUNCTION: createfolder
// ============================================================================
/**
 * creates a new folder on the server
 * @param {string} folder 
 */
function createfolder (folder)
{
    // This code will ignore any folder that already exists so can be called instead of an check if needed
    fs.mkdir(folder,
        { recursive: true },
        (err) =>
        {
            if (err)
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".moveImagefilesToFolder", "Failed to create directory " + folder, err, err.message);
            }
            //console.log('Directory created successfully!');
        });
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
/**
 * finds a trigger based off the message type
 * @param {string} messagetype 
 * @returns trigger if found
 */
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
//                           FUNCTION: triggerMacroButton
// ============================================================================
/**
 * Saves data the user has loaded and sent us. Contains profiles etc.
 * @param {object} extensions_message 
 */
function parseUserRequestSaveDataFile (extensions_message)
{
    //do something with the file. ie check version etc.
    let response = "No Response from Server, please try again.";
    try
    {
        if (extensions_message.data.__version__ === default_serverConfig.__version__)
        {
            // overwrite our data and save it to the server.
            serverConfig = structuredClone(extensions_message.data);
            SaveConfigToServer()//we have the same version of the file so we should save it over our current one.
            response = "Data saved."
        }
        else
            response = "received file version doesn't match current version: " + extensions_message.data.__version__ + " == " + default_serverConfig.__version__
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
                "UserSaveServerDataResponse",
                serverConfig.extensionname,
                { response: response },
                "",
                extensions_message.from
            ),
            "",
            extensions_message.from
        ));
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
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", err);
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
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise, triggersandactions };

