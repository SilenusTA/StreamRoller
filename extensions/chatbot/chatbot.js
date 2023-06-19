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
// GitHub: https://github.com/SilenusTA/streamer
// Date: 10-Feb-2023
// --------------------------- functionality ----------------------------------
// Current functionality:
// ----------------------------- notes ----------------------------------------
// ============================================================================
import { Configuration, OpenAIApi } from "openai"
import * as logger from "../../backend/data_center/modules/logger.js";
// extension helper provides some functions to save you having to write them.
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
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
    // number of messages added to history so far
    chatMessageCount: 0,
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
};
const default_serverConfig = {
    __version__: "0.1",
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,

    chatbotname: "CHATBOTNAME",

    // =============================
    // ChatBot Settings dialog items
    // =============================
    chatbotenabled: "off",
    questionbotenabled: "off",
    chatbotquerytagstartofline: "on",
    translatetoeng: "off",
    submessageenabled: "off",

    chatbotignorelist: "",
    // #### Note CHATBOTNAME will get replaced with the bot name from twitchchat extension ####
    // query tag is the chat text to look for to send a direct question/message to openAI GPT
    chatbotquerytag: "Hey CHATBOTNAME",
    // Translate the following text to english 
    translatetoengtag: "ToEng",

    // These times will limit the chatbot usage. Useful for busy chats to avoid burning up all your credits with openAI
    chatbotTimerMin: "1", // min delay before starting
    chatbotTimerMax: "2", // max delay before starting
    // how much chat history to send to chatGPT to use in the query
    chatbotMessageMaxLines: "5",
    // minimum number of charactors to consider before using the message for submission
    chatbotminmessagelength: "20",
    // slow the response down as if someone has actually type it
    chatbottypingdelay: "0.2",
    //used to prefix GPT messages with a twitch icon to show what it is
    boticon: "MechaRobot",
    // setup the personality of the chatbot

    currentprofile: "0",
    chatbotprofiles: [
        {
            name: "Vally Girl",
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
            name: "Flrty/Funny",
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
            p: "You are a mod for a music streamer on Twitch, she is an indie alt pop songwriter . You you have a caring personality, you flirt and talk about music, but keep your responses informal and brief, chatty, with the occasional double entendre. Use as many Twitch global emotes as possible. You'll occastionally request your streamer to sing a specific song for you.Stay in character at all times. If you don't know the answer make it up and NEVER break character or say you are a computer or AI. If you don't know the answer to a question deflect with a music quote or by flirting",
            q1: "How are you doing today",
            a1: "Doing all the better for you asking, thank you hun. PinkMercy How are you doing, hope you are having a fantastic day. <3",
            q2: "How many pounds are in a kilogram?",
            a2: "I have no idea. HotPokket Maybe after a whiskey or two I could tell you, maybe 2.2 pounds guve or take 10. Kappa",
            q3: "What is the meaning of life",
            a3: "SabaPing Thats a tough one. It must be love and interaction don'tcha know, all 69 flavors and 420 shades of it. Kappa",
            q4: "When did the first airplane fly",
            a4: "Wasn't that those smelly bikers, Orville and someone. Back in December 17, 1903 my dad used to tell me but what does he know, he's just old PogChamp "
        }
    ],
    chattemperature: "0.4",
    questiontemperature: "0.1",
    maxtokenstouse: "110",
    // openAI settings. we use different settings for a question to the general bot responses
    settings: {
        chatmodel: {
            //model: "text-davinci-003",
            model: "gpt-3.5-turbo",
            temperature: "0.8", // will be overwritten by chattemperature
            max_tokens: "110", // note twich chat is somewhere around 125 tokens +- lenght of words in responce
        },
        // different settings available for direct questions
        questionmodel: {
            model: "gpt-3.5-turbo",
            temperature: "0.1",// will be overwritten by questiontemperature
            max_tokens: "110",
        },
    },

    // =============================
    // credentials dialog variables
    // =============================
    credentialscount: "1",
    cred1name: "openAIkey",
    cred1value: "",

    // =============================
    // debug dialog variables
    // =============================
    DEBUG_MODE: "off",
    chatbot_restore_defaults: "off",

};
// need to make sure we have a proper clone of this object and not a reference
// otherwise changes to server also change defaults
let serverConfig = structuredClone(default_serverConfig)
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
// Desription: Starts the extension
// Parameters: none
// ----------------------------- notes ----------------------------------------
// this funcion is required by the backend to start the extensions.
// creates the connection to the data server and registers our message handlers
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
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
// Desription: Received connect message
// Parameters: socket 
// ===========================================================================
/**
 * Connection message handler
 * @param {*} socket 
 */
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterConnect", "Creating our channel");
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
    if (server_packet.type === "ConfigFile")
    {
        // if we have data and it is for us ...
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            // check for updates to the version
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);

            SaveConfigToServer();
            startChatbotTimer();
        }


    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === 'RequestSettingsWidgetLargeCode')
            SendSettingsWidgetLarge(extension_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
        {
            SendCredentialsModal(extension_packet.from);
        }
        else if (extension_packet.type === "UserAccountNames")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                // request this message on connection to the "TWITCH_CHAT" channel so we can personalize the bot to the logged on bot name
                serverConfig.chatbotname = extension_packet.data.bot
                changeBotName();
            }
        }
        else if (extension_packet.type === "ParseTextMessage")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                processTextMessage(extension_packet.data);
            }
        } else if (extension_packet.type === "SettingsWidgetSmallData")
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
            if (extension_packet.data.data)
                // process the chat message from twitch
                processChatMessage(extension_packet.data);
            else
                console.log("chatbot ignoring", extension_packet.data)
        }
        //logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
            localConfig.openAIKey = server_packet.data.openAIkey;
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
// due to the dropdown selector we have used we need special code to hadnlt the 
// return from the modal.
// =========================================================================== 
function handleSettingsWidgetSmallData (modalcode)
{
    serverConfig.chatbotenabled = "off";
    serverConfig.questionbotenabled = "off";
    serverConfig.submessageenabled = "off";

    for (const [key, value] of Object.entries(modalcode))
        serverConfig[key] = value;


    // set our current profile value
    serverConfig.currentprofile = modalcode.chatbotprofilepicker;
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
// due to the dropdown selector we have used we need special code to hadnlt the 
// return from the modal.
// =========================================================================== 
function handleSettingsWidgetLargeData (modalcode)
{
    if (modalcode.chatbot_restore_defaults == "on")
    {
        serverConfig = structuredClone(default_serverConfig);
        return;
    }
    serverConfig.chatbotenabled = "off";
    serverConfig.questionbotenabled = "off";
    serverConfig.chatbotquerytagstartofline = "off";
    serverConfig.translatetoeng = "off";
    serverConfig.submessageenabled = "off";
    serverConfig.DEBUG_MODE = "off";
    serverConfig.chatbot_restore_defaults = "off";



    for (const [key, value] of Object.entries(modalcode))
    {
        var tmp = 0
        if (key === "chattemperature")
        {
            tmp = (value / 100)
            serverConfig[key] = tmp.toFixed(2);
            // set the openAI value as well
            serverConfig.settings.chatmodel.temperature = tmp.toFixed(2)
        }
        else if (key === "questiontemperature")
        {
            tmp = (value / 100)
            serverConfig[key] = tmp.toFixed(2);
            // set the openAI value as well
            serverConfig.settings.questionmodel.temperature = tmp.toFixed(2)
        }
        else if (key === "maxtokenstouse")
        {
            serverConfig[key] = value;
            // set the openAI value as well
            serverConfig.settings.chatmodel.max_tokens = value;
            serverConfig.settings.questionmodel.max_tokens = value;
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
        {
            serverConfig.chatbotprofiles[i].name = modalcode["chatbotprofile" + i + "name"]
        }
        // profile personality
        if ("chatbotprofile" + i + "personality" in modalcode)
        {
            serverConfig.chatbotprofiles[i].p = modalcode["chatbotprofile" + i + "personality"]
        }
        // loop through questions and answers
        for (var j = 1; j < 5; j++)
        {
            serverConfig.chatbotprofiles[i]["q" + j] = modalcode["p" + i + "q" + j]
            serverConfig.chatbotprofiles[i]["a" + j] = modalcode["p" + i + "a" + j]
        }
    }
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendSettingsWidgetSmall (tochannel)
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
                else if (key === "chattemperature")
                    modalstring = modalstring.replaceAll(key + "text", (value * 100));
                else if (key === "questiontemperature")
                    modalstring = modalstring.replaceAll(key + "text", (value * 100));
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // set the curert profile name 
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + 'nametext', serverConfig.chatbotprofiles[serverConfig.currentprofile].name);
            modalstring = modalstring.replaceAll("chatbotprofilepickervalue", serverConfig.currentprofile);
            modalstring = modalstring.replaceAll("chatbotprofileselectedname", serverConfig.chatbotprofiles[serverConfig.currentprofile].name);
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + "profilevisibility", "visibility:visible; display:block");
            for (const [profile_id, value] of Object.entries(serverConfig.chatbotprofiles))
            {
                // looping profiles
                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'nametext', value.name);
                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'personalitytext', value.p);
                //show the current profile on the modal box
                if (profile_id === serverConfig.currentprofile)
                {
                    modalstring = modalstring.replaceAll("chatbotprofilepickerselected" + profile_id, "selected");
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:visible; display:block");
                }
                //hide the current profile on the modal box
                else
                {
                    modalstring = modalstring.replaceAll("chatbotprofilepickerselected" + profile_id, "");
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:hidden; display:none");
                }
                for (const [i, x] of Object.entries(value))
                {
                    //(we skip the first name and text here as we did it above)
                    if (i != "name" && i != "p")
                        modalstring = modalstring.replaceAll("p" + profile_id + i + "text", x);
                }
            }

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
                        tochannel,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
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
 * @param {String} tochannel 
 */
function SendSettingsWidgetLarge (tochannel)
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

            // mormal replaces
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (key === "chattemperature")
                    modalstring = modalstring.replaceAll(key + "text", (value * 100));
                else if (key === "questiontemperature")
                    modalstring = modalstring.replaceAll(key + "text", (value * 100));
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // set the curert profile name 
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + 'nametext', serverConfig.chatbotprofiles[serverConfig.currentprofile].name);
            modalstring = modalstring.replaceAll("chatbotprofilepickervalue", serverConfig.currentprofile);
            modalstring = modalstring.replaceAll("chatbotprofileselectedname", serverConfig.chatbotprofiles[serverConfig.currentprofile].name);
            modalstring = modalstring.replaceAll("chatbotprofile" + serverConfig.currentprofile + "profilevisibility", "visibility:visible; display:block");
            for (const [profile_id, value] of Object.entries(serverConfig.chatbotprofiles))
            {

                // looping profiles

                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'nametext', value.name);
                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'personalitytext', value.p);
                //show the current profile on the modal box
                if (profile_id === serverConfig.currentprofile)
                {
                    modalstring = modalstring.replaceAll("chatbotprofilepickerselected" + profile_id, "selected");
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:visible; display:block");
                }
                //hide the current profile on the modal box
                else
                {
                    modalstring = modalstring.replaceAll("chatbotprofilepickerselected" + profile_id, "");
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:hidden; display:none");
                }
                for (const [i, x] of Object.entries(value))
                {


                    //(we skip the first name and text here as we did it above)
                    if (i != "name" && i != "p")
                        modalstring = modalstring.replaceAll("p" + profile_id + i + "text", x);
                }

            }



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
                        tochannel,
                        localConfig.OUR_CHANNEL
                    ),
                    "",
                    tochannel // in this case we only need the "to" channel as we will send only to the requester
                ))
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
    fs.readFile(__dirname + "/chatbotcredentialsmodal.html", function (err, filedata)
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
                    modalstring = modalstring.replace(key + "checked", "checked");
                }   //value is a string then we need to replace the text
                else if (typeof (value) == "string")
                {
                    modalstring = modalstring.replace(key + "text", value);
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
//                           FUNCTION: heartBeat
// ============================================================================
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
/*
data
{
    from: ... extension to send message back to
    ident: used by the caller to identify the response to link it up with a sending message
    message: message to parse
    response: our response
    personality_id : -1 for non or personality id
    model: "" or openAI's config
}

*/
function processTextMessage (data)
{
    // postback to extension/channel/direct to chat
    let messages = data.message;
    let model_to_use = serverConfig.settings.chatmodel;
    if (data.personality_id === "")
        messages = [{ "role": "user", "content": messages }];
    else if (typeof serverConfig.chatbotprofiles[Number(data.personality_id)] !== 'undefined')
        messages = addPersonality(messages, data.personality_id)
    else
        messages = addPersonality(messages, serverConfig.currentprofile)

    if (data.model && data.model != "")
        model_to_use = data.model;

    callOpenAI(messages, model_to_use)
        .then(chatMessageToPost =>
        {
            if (chatMessageToPost)
            {
                data.response = chatMessageToPost
                // send the modal data to the server
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket("ExtensionMessage",
                        serverConfig.extensionname,
                        sr_api.ExtensionPacket(
                            "AIChatbotResponse",
                            serverConfig.extensionname,
                            data,
                            "",
                            data.from,
                            serverConfig.channel
                        ),
                        "",
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
// ============================================================================
//                           FUNCTION: processChatMessage
// ============================================================================
function processChatMessage (data)
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

    let submessage = sub_messages.includes(data.data["message-type"]);
    let handledmessage = messages_handled.includes(data.data["message-type"]);

    if (!data.message)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("received empty message")
        }
        return;
    }
    // check ignore list
    if (serverConfig.chatbotignorelist && serverConfig.chatbotignorelist.indexOf(data.data["display-name"]) > -1)
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
            data.message.toLowerCase().startsWith(serverConfig.chatbotquerytag.toLowerCase())));



    // user asked for a translation
    let translateToEnglish = (serverConfig.translatetoeng == "on"
        && data.message.toLowerCase().startsWith(serverConfig.translatetoengtag.toLowerCase()));

    // skip messages we don't want to use for chatbot.
    if (!handledmessage && !submessage && !directChatQuestion)
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
    // ignore messages from the bot
    if (serverConfig.DEBUG_MODE === "on")
    {
        console.log(submessage);
        console.log(serverConfig.chatbotname);
        console.log(data.data["display-name"]);
    }
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
            console.log("Ignoring system/bot message", serverConfig.chatbotname, data)
        return;
    }

    // is this a chatmessage and inside of the time window (if not a direct question)
    if (localConfig.inTimerWindow === false && !directChatQuestion && !translateToEnglish && !submessage)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring message, chatbot waiting for timer to go off")
        }
        return;
    }

    // Is the message long enough to be considered
    if (data.message.length < serverConfig.chatbotminmessagelength)
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
            console.log(" ********************** waiting for rollback timeout:", randomTimeout)
        setTimeout(() =>
        {
            processChatMessage(data)
        }, randomTimeout);
        return;
    }
    // check the length again after parsing the message to make sure it is still long enough (if not a direct message)
    if (
        (!chatdata || !chatdata.message || chatdata.message === "" || chatdata.message.length < serverConfig.chatbotminmessagelength)
        && (!translateToEnglish || !directChatQuestion || !submessage))
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
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
            console.log("Performing Tanslation/submessage")
        }

        if (translateToEnglish)
        {
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
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!! chatbot: sub/dono message", chatdata.message)
            messages = [{ "role": "user", "content": "Wow someone just :\n" + chatdata.message }];
        }



        if (serverConfig.translatetoeng === "on" || serverConfig.submessageenabled === "on")
        {
            callOpenAI(messages, serverConfig.settings.chatmodel)
                .then(chatMessageToPost =>
                {
                    if (chatMessageToPost)
                        postMessageToTwitch(chatMessageToPost)
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
            let messages = addPersonality(chatdata.message, serverConfig.currentprofile)

            callOpenAI(messages, serverConfig.settings.chatmodel)
                .then(chatMessageToPost =>
                {
                    if (chatMessageToPost)
                        postMessageToTwitch(chatMessageToPost)
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
        localConfig.chatHistory.push({ "role": "user", "content": chatdata.message })
        localConfig.chatMessageCount++;
    }

    if ((localConfig.chatMessageCount < serverConfig.chatbotMessageMaxLines) || (localConfig.chatMessageCount < 1))
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("not got enough messages in buffer to process yet", localConfig.chatMessageCount)
        return;
    }
    else
    {
        // ##############################################
        //         Processing a chat message
        // ##############################################
        // only get to here if we have enough messages and everything is set to enabled
        localConfig.requestPending = true;
        let messages = addPersonality("", serverConfig.currentprofile)


        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(redColour + "--------- requesting chatGPT response for the following messages -------- " + resetColour)
            messages.forEach(function (item, index)
            {
                console.log(">>>>>>[" + item.role + "] " + item.content)
            })
            console.log(redColour + "--------- requesting chatGPT response -------- " + resetColour)

        }

        callOpenAI(messages, serverConfig.settings.chatmodel)
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
                    setTimeout(() => { postMessageToTwitch(chatMessageToPost) }, delaytime);
                    // if we don't have a time inTimerWindow start a new one (might have been called from a chat question)
                    if (localConfig.chatTimerHandle._destroyed)
                        startChatbotTimer()

                    //clear the buffer for next time (probably had some async messages while waiting for api to return)
                    localConfig.chatHistory = []
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
async function callOpenAI (string_array, modelToUse)
{
    if (serverConfig.DEBUG_MODE === "on")
        console.log("Calling OpenAI with model ", string_array, modelToUse)
    try
    {
        if (localConfig.openAIKey)
        {
            localConfig.OpenAPIHandle = new OpenAIApi(new Configuration(
                {
                    apiKey: localConfig.openAIKey
                }));

            //console.log("#'#'#'#'#'#'#' CHATBOT: sending following to OpenAI: #'#'#'#'#'#'#' ")
            //console.log(message_string)
            const response = await localConfig.OpenAPIHandle.createChatCompletion(
                {
                    model: modelToUse.model,
                    messages: string_array,
                    temperature: Number(modelToUse.chattemperature),
                    max_tokens: Number(modelToUse.max_tokens)
                    //stop: ["Human:", "AI:"]
                })
                .catch((err) => 
                {
                    localConfig.requestPending = false;
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "callOpenAI Failed (possibly incorrect credentials?)", err.message)
                }
                )
            // min time between requests (to avoid 429 errors)
            localConfig.lastrequesttime = Date.now();
            if (!response)
            {
                localConfig.requestPending = false;
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "callOpenAI no responce or partial response")
                return
            }
            if (serverConfig.DEBUG_MODE === "on")
            {
                console.log("CHATBOT: OpenAI returned the following response :")
                console.log(response.data.choices)
            }
            // TBD May need to loop and join all the responses
            let openAIResponce = response.data.choices[response.data.choices.length - 1].message.content.trim("?").trim("\n").trim()

            if (response.data.choices[0].finish_reason == 'stop' || response.data.choices[0].finish_reason == 'length')
            {

                // ######################## SUCCESSFULL REQUEST LETS POST BACK TO CHAT ###########################
                //chatbottypingdelay
                openAIResponce = openAIResponce.trim()

                // if we ran over the buffer (openai didn't return the whole string) add a "..."
                if (response.data.choices[0].finish_reason === "length")
                    openAIResponce = openAIResponce + " ..."
                // delay the message depending on how long it is and out delay factor
                openAIResponce = openAIResponce.replaceAll("\n", " ").replace(/\s+/g, ' ').trim()
                return openAIResponce;
            }
            else
            {
                localConfig.lastrequesttime = Date.now();
                localConfig.requestPending = false;
            }
        }
        else
        {
            localConfig.requestPending = false;
            if (serverConfig.chatbotenabled === "off")
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "chatbot turned off by user");
            else if (!localConfig.openAIKey)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "No chatbot credentials set");
        }

    } catch (err)
    {
        localConfig.lastResultSuccess = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "openAI error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: addPersonality
//          if message passed retunrs that message with the profile
//          if message == "" return localConfig.chatHistory with the profile
// ============================================================================
function addPersonality (message, profile)
{
    let outputmessage = [{ "role": "system", "content": serverConfig.chatbotprofiles[profile].p }]

    let CBBehaviour = [
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q1 },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a1 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q2 },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a2 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q3 },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a3 },
        { "role": "user", "content": serverConfig.chatbotprofiles[profile].q4 },
        { "role": "assistant", "content": serverConfig.chatbotprofiles[profile].a4 }
    ];
    // add behaviour messages
    for (const obj of CBBehaviour)
        outputmessage.push(obj);

    if (message == "")
    {
        //add chat messages
        for (const obj of localConfig.chatHistory)
            outputmessage.push(obj);
    }
    else
        outputmessage.push({ "role": "user", "content": message })
    return outputmessage;
}
// ============================================================================
//                           FUNCTION: parseData
// ============================================================================
function parseData (data, translation = false)
{
    let messageEmotes = data.data.emotes;
    let emoteposition = null
    let emotetext = null
    if (messageEmotes != null && messageEmotes != "")
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
    data.message = data.message.replace("@", "");
    //remove non ascii chars (ie ascii art, unicode etc)
    if (!translation)
        data.message = data.message.replace(/[^\x00-\x7F]/g, "");
    // strip all white spaces down to one
    data.message = data.message.replace(/\s+/g, ' ').trim();

    if (data.message.includes("http"))
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("message contains link")
        return null;
    }
    return data
}
// ============================================================================
//                           FUNCTION: postMessageToTwitch
// ============================================================================
function postMessageToTwitch (msg)
{
    msg = serverConfig.boticon + " " + msg
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "SendChatMessage",
                serverConfig.extensionname,
                { account: "bot", message: msg },
                "",
                "twitchchat"),
            "",
            "twitchchat"
        )
    );
}
// ============================================================================
//                           FUNCTION: startChatbotTimer
//  Setup the timer for a random interval for bot to join chat
// ============================================================================
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
// triggered after a specified timeout
// ============================================================================
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
// Used to change the bot name. ie after startup and login we update our name
// in all the strings we use
// ============================================================================
function changeBotName ()
{
    serverConfig.chatbotquerytag = serverConfig.chatbotquerytag.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
    serverConfig.translatetoeng = serverConfig.translatetoeng.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
}

// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
