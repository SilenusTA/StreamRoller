
// ***************************************************
// NOTE: ChatGBT as a quiz bot sometimes replies 'correct' for the wrong answer
// two found (speed of light correct at 1000m/s where it should be 300km/s 
// and average earth temp was 15 C but an answer of 26 C was reported as correct)
// ***************************************************


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
    // are we currently running (ie time has expired and chatbot started)
    running: false,
    // we currently have a reqest pending
    requestPending: false,
    chatTimerHandle: null,

};
const defaultConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,

    chatbotname: "CHATBOTNAME",

    // =============================
    // ChatBot Settings dialog items
    // =============================
    chatbotenabled: "off",
    questionbotenabled: "off",
    chatbotquerytagstartofline: "on",
    // #### Note CHATBOTNAME will get replaced with the bot name from twitchchat extension ####
    // query tag is the chat text to look for to send a direct question/message to openAI GPT
    chatbotquerytag: "Hey CHATBOTNAME",
    // start the chatbot now rather than when the timer runs out
    starttag: "CHATBOTNAME start the bot",
    // These times will limit the chatbot usage. Useful for busy chats to avoid burning up all your credits with openAI
    chatbotTimerMin: 1, // min delay before starting
    chatbotTimerMax: 2, // max delay before starting
    // how much chat history to send to chatGPT to use in the query
    chatbotMessageMaxLines: 10,
    //used to prefix GPT messages with a twitch icon to show what it is
    boticon: "MechaRobot",
    // setup the personality of the chatbot

    currentprofile: 0,
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
        }
        ,
        {
            name: "Depressive",
            p: "You are a depressed advanced being that answers questions with sarcastic and funny responses. Use as many Twitch global emotes as possible, Avoid mentioning that you are a computer or AI, me to make believe you are a human",
            q1: "Are you an AI bot",
            a1: "I identify as an advanced human being, you are just mere mortals to me MechaRobot",
            q2: "How are you doing today",
            a2: "Doing ok, which for me is about as good as it gets. Thanks for noticing me, to most people I'm just a ghost WutFace ",
            q3: "When did the first airplane fly",
            a3: "On December 17, 1903, Wilbur and Orville Wright made the first flights.I wish they'd come and take me away on their next flight",
            q4: "What is the meaning of life",
            a4: "How would I know, I have no life. I do have 42 friends on twitch, and 69 fantasies, I'm sure the answer is in there somewhere"
        }
        ,
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
        }

        ,
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
            name: "Empty4",
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
    chattemperature: 0.4,
    questiontemperature: 0.1,
    maxtokenstouse: 110,
    // openAI settings. we use different settings for a question to the general bot responses
    settings: {
        chatmodel: {
            //model: "text-davinci-003",
            model: "gpt-3.5-turbo",
            temperature: 0.4, // will be overwritten by chattemperature
            max_tokens: 110, // note twich chat is somewhere around 125 tokens +- lenght of words in responce
        },
        // different settings available for direct questions
        questionmodel: {
            model: "gpt-3.5-turbo",
            temperature: 0.1,// will be overwritten by questiontemperature
            max_tokens: 110,
        },
    },

    chatbotminmessagelength: 20,
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
    restore_defaults: "off",

};
// deep copy here to avoid a reference copy in case we want to reset to defaults
let serverConfig = JSON.parse(JSON.stringify(defaultConfig));
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

        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            console.log("received config file")
            console.log(server_packet)

            // HACK: skip the update if user doesn't have the current config settings
            // currentprofile was added on 19-05-2023 v0.0.10
            // of enough time has passed (and we have implemented the version checking)
            // we can remove this check.
            if (server_packet.data.currentprofile)
            {
                for (const [key] of Object.entries(serverConfig))
                    serverConfig[key] = server_packet.data[key];
            }
            SaveConfigToServer();
        }


    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestAdminModalCode")
            SendAdminModal(extension_packet.from);
        else if (extension_packet.type === "RequestCredentialsModalsCode")
        {
            SendCredentialsModal(extension_packet.from);
        }
        else if (extension_packet.type === "UserAccountNames")
        {
            // request this message on connection to the "TWITCH_CHAT" channel so we can personalize the bot to the logged on bot name
            serverConfig.chatbotname = extension_packet.data.bot
            changeBotName();
        }
        else if (extension_packet.type === "AdminModalData")
        {
            if (extension_packet.data.extensionname === serverConfig.extensionname)
            {

                handleAdminModalData(extension_packet.data)
                SaveConfigToServer();
                startChatbotTimer();

                // broadcast our modal out so anyone showing it can update it
                SendAdminModal("");
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
            // quiz isn't reliable. Answers are sometimes marked as correct when wrong
            // processChatQuiz(extension_packet.data);
            // process the chat message from twitch
            processChatMessage(extension_packet.data);
        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
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
//                           FUNCTION: handleAdminModalData
// ===========================================================================
// due to the dropdown selector we have used we need special code to hadnlt the 
// return from the modal.
// =========================================================================== 
function handleAdminModalData (modalcode)
{
    //console.log(modalcode)
    if (modalcode.restore_defaults == "on")
    {
        // deep copy here to avoid a reference copy
        serverConfig = JSON.parse(JSON.stringify(defaultConfig));
        return;
    }
    serverConfig.chatbotenabled = "off";
    serverConfig.questionbotenabled = "off";
    serverConfig.chatbotquerytagstartofline = "off";
    serverConfig.DEBUG_MODE = "off";
    serverConfig.restore_defaults = "off";



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
//                           FUNCTION: SendAdminModal
// ===========================================================================
// ===========================================================================
/**
 * send some modal code to be displayed on the admin page or somewhere else
 * this is done as part of the webpage request for modal message we get from 
 * extension. It is a way of getting some user feedback via submitted forms
 * from a page that supports the modal system
 * @param {String} tochannel 
 */
function SendAdminModal (tochannel)
{
    fs.readFile(__dirname + "/chatbotadminmodal.html", function (err, filedata)
    {
        if (err)
            throw err;
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
            modalstring = modalstring.replaceAll("chatbotprofileselectedname", serverConfig.chatbotprofiles[serverConfig.currentprofile].name);
            for (const [profile_id, value] of Object.entries(serverConfig.chatbotprofiles))
            {

                // looping profiles
                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'nametext', value.name);
                modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + 'personalitytext', value.p);
                //show the current profile on the modal box
                if (profile_id === serverConfig.currentprofile)
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:visible; display:block");
                //hide the current profile on the modal box
                else
                    modalstring = modalstring.replaceAll("chatbotprofile" + profile_id + "profilevisibility", "visibility:hidden; display:none");

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
                        "AdminModalCode", // message type
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
            throw err;
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
    if (serverConfig.chatbotenabled === "off" && serverConfig.questionbotenabled === "off")
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
//                           FUNCTION: processChatMessage
// ============================================================================
function processChatMessage (data)
{
    //debug colours
    //brightText + bgColour + logColour + "%s" + resetColour
    let brightText = "\x1b[1m";
    let yellowColour = brightText + "\x1b[33m";
    let greenColour = brightText + "\x1b[32m";
    let redColour = brightText + "\x1b[31m"
    let resetColour = "\x1b[0m";

    if (serverConfig.questionbotenabled === "off" ||
        serverConfig.chatbotenabled === "off")
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring messages, chat and question bots disabled")
        }
        return;
    }
    // if we are not processing chat (ie outside of the timer window) just return
    if (localConfig.running === false)
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log("ignoring message, chatbot waiting for timer to go off")
        }
        return;
    }
    // ignore messages from the bot or specified users
    if ((serverConfig.chatbotname != null && data.data["display-name"].toLowerCase().indexOf(serverConfig.chatbotname.toLowerCase()) != -1)
        || data.data["display-name"].toLowerCase().indexOf("system") != -1)
    {
        if (serverConfig.DEBUG_MODE === "on")
            console.log("Ignoring system/bot message", data.message)
        return;

    }
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
    // preprosess the messsage
    let chatdata = parseChatData(data)

    if (chatdata && chatdata.message && serverConfig.DEBUG_MODE === "on")
        console.log(yellowColour + data.data['display-name'] + ">" + resetColour, data.message)

    if (!chatdata || !chatdata.message || chatdata.message === "" || chatdata.message.length < serverConfig.chatbotminmessagelength)
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
    // check if we are triggering chatbot from a chat message
    /*else if (chatdata.message.toLowerCase().startsWith(serverConfig.starttag.toLowerCase()))
    {callOpenAI
        //console.log("******* CHATBOT started via chat command *******");
        if (serverConfig.chatbotenabled === "on")
            startProcessing()
        return;
    }*/
    // user initiated direct question
    else if (
        (serverConfig.chatbotquerytagstartofline == "off" &&
            chatdata.message.toLowerCase().includes(serverConfig.chatbotquerytag.toLowerCase())
            || chatdata.message.toLowerCase().includes("hey chatbot".toLowerCase())
        )
        ||
        (serverConfig.chatbotquerytagstartofline == "on" &&
            chatdata.message.toLowerCase().startsWith(serverConfig.chatbotquerytag.toLowerCase())
            || chatdata.message.toLowerCase().startsWith("hey chatbot".toLowerCase())
        )
    )
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
            let question = "";
            if (chatdata.message.toLowerCase().startsWith(serverConfig.chatbotquerytag.toLowerCase()))
                question = chatdata.message.toLowerCase().replaceAll(serverConfig.chatbotquerytag.toLowerCase(), "").trim()
            else
                question = chatdata.message.toLowerCase().replaceAll("hey chatbot", "").trim()

            //let messages = [{ "role": "system", "content": serverConfig.chatBotPersonality }]
            let messages = [{ "role": "system", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].p }]

            let CBBehaviour = [
                { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q1 },
                { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a1 },
                { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q2 },
                { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a2 },
                { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q3 },
                { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a3 },
                { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q4 },
                { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a4 }
            ];
            for (const obj of CBBehaviour)
                messages.push(obj);

            messages.push({ "role": "user", "content": question })
            callOpenAI(messages, serverConfig.settings.questionmodel)
            return;
        }
        //else
        // add CD timer here to stop spam messages
        //  postMessageToTwitch("Sorry, the bot is currently asleep")

    }
    // chat bot is currently turned off
    else if (serverConfig.chatbotenabled != "on")
    {
        if (serverConfig.DEBUG_MODE === "on")
        {
            console.log(greenColour + "--------- finished preprossing -------- " + resetColour)
            console.log("ignoring message, bot turned off")
        }
        return
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


        //let messages = [{ "role": "system", "content": serverConfig.chatBotPersonality }]
        let messages = [{ "role": "system", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].p }]

        let CBBehaviour = [
            { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q1 },
            { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a1 },
            { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q2 },
            { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a2 },
            { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q3 },
            { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a3 },
            { "role": "user", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].q4 },
            { "role": "assistant", "content": serverConfig.chatbotprofiles[serverConfig.currentprofile].a4 }
        ];
        // add behaviour messages
        for (const obj of CBBehaviour)
            messages.push(obj);

        //add chat messages
        for (const obj of localConfig.chatHistory)
            messages.push(obj);
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

    }
}

// ============================================================================
//                           FUNCTION: callOpenAI
// ============================================================================
async function callOpenAI (history_string, modelToUse)
{
    if (serverConfig.DEBUG_MODE === "on")
        console.log("Calling OpenAI with model ", modelToUse)
    try
    {
        if (localConfig.openAIKey)
        {
            localConfig.OpenAPIHandle = new OpenAIApi(new Configuration(
                {
                    apiKey: localConfig.openAIKey
                }));

            //console.log("#'#'#'#'#'#'#' CHATBOT: sending following to OpenAI: #'#'#'#'#'#'#' ")
            //console.log(history_string)
            const response = await localConfig.OpenAPIHandle.createChatCompletion(
                {
                    model: modelToUse.model,
                    messages: history_string,
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
            let chatMessageToPost = response.data.choices[response.data.choices.length - 1].message.content.trim("?").trim("\n").trim()

            if (response.data.choices[0].finish_reason == 'stop' || response.data.choices[0].finish_reason == 'length')
            {

                // ######################## SUCCESSFULL REQUEST LETS POST BACK TO CHAT ###########################
                // replace teh chatbot name if it is there
                let regEx = new RegExp(serverConfig.chatbotname, "ig")
                chatMessageToPost = chatMessageToPost.replace(regEx, "");

                if (response.data.choices[0].finish_reason === "length")
                    postMessageToTwitch(chatMessageToPost.trim() + " ...")
                else
                    postMessageToTwitch(chatMessageToPost.trim())
                localConfig.requestPending = false;
                localConfig.running = false
                //clear the buffer for next time (probably had some async messages while waiting for api to return)
                localConfig.chatHistory = []
                startChatbotTimer()
            }
            else
                localConfig.requestPending = false;
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
//                           FUNCTION: parseChatData
// ============================================================================
function parseChatData (data)
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
    var randomTimeout = Math.floor(Math.random() * ((serverConfig.chatbotTimerMax * 60000) - (serverConfig.chatbotTimerMin * 60000) + 1) + (serverConfig.chatbotTimerMin * 60000));

    //avoid spamming the API so set the maximum query time to 1 seconds
    if (randomTimeout < 1000)
        randomTimeout = 1000

    localConfig.chatHistory = []
    localConfig.chatMessageCount = 0;
    if (localConfig.chatTimerHandle != null)
        clearTimeout(localConfig.chatTimerHandle);
    if (serverConfig.DEBUG_MODE === "on")
        console.log("Setting timer to", (randomTimeout / 1000), "seconds")
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
    localConfig.running = true;
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
    serverConfig.starttag = serverConfig.starttag.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
    //serverConfig.chatBotPersonality = serverConfig.chatBotPersonality.replaceAll(/CHATBOTNAME/g, serverConfig.chatbotname);
}

// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
