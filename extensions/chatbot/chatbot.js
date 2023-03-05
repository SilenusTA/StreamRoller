
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

    // ChatBot Settings
    // #### Note CHATBOTNAME will get replaced with the bot name from twitchchat extension ####
    // query tag is the chat text to look for to send a direct question/message to openAI GPT
    querytag: "Hey CHATBOTNAME",
    // start the chatbot now rather than when the timer runs out
    starttag: "CHATBOTNAME start the bot",
    // These times will limit the chatbot usage. Useful for busy chats to avoid burning up all your credits with openAI
    timerMin: 1, // min delay before starting
    timerMax: 3, // max delay before starting
    // how much chat history to send to chatGPT to use in the query
    chatMessageMaxLines: 5,
    // number of messages added to history so far
    chatMessageCount: 0,
    chatHistory: [],
    // are we currently running (ie time has expired and chatbot started)
    running: false,
    chatTimerHandle: null,
    // openAI settings. we use different settings for a question to the general bot responses
    settings: {
        chatmodel: {
            model: "text-davinci-003",
            temperature: 0.2,
            top_p: 1,
            max_tokens: 60
        },
        questionmodel: {
            model: "text-curie-001",
            temperature: 0,
            top_p: 0,
            max_tokens: 60
        }
    },

    // depreciated (doesn't work well enough scoring answers)
    quiz_history_test: ["Ask me a Hard Quiz question",
        "You: Question",
        "CHATBOTNAME: Answer",
        "You: Correct or InCorrect",
        "You: Question",
        "CHATBOTNAME: Answer",
        "You: Correct or InCorrect"
    ]
};
const serverConfig = {
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL,
    chatbotenabled: "on",  // example of a checkbox. "on" or "off"
    chatbotname: "CHATBOTNAME", // example of a text field
    // setup the personality of the chatbot
    chatBotPersonality: "CHATBOTNAME is a chatbot on Twitch with depression that answers questions with depressive responses: You: How many pounds are in a kilogram? CHATBOTNAME: This again? There are 2.2 pounds in a kilogram.Please make a note of this.         You: What does HTML stand for? CHATBOTNAME: Was Google too busy? Hypertext Markup Language.The T is for try to ask better questions in the future.         You: When did the first airplane fly? CHATBOTNAME: On December 17, 1903, Wilbur and Orville Wright made the first flights.I wish they’d come and take me away.         You: What is the meaning of life? CHATBOTNAME: How would I know, I have no life.",

};
//debug setting to overwrite the stored data with the serverConfig above. 
const OverwriteDataCenterConfig = false;

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
    if (OverwriteDataCenterConfig)
        SaveConfigToServer();
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

    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)

    // set up our timer for the chatbot
    startChatbotTimer();
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
    logger.log(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".onDataCenterMessage", "message received ", server_packet);

    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            for (const [key] of Object.entries(serverConfig))
                if (key in server_packet.data)
                    serverConfig[key] = server_packet.data[key];
            SaveConfigToServer();
        }
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestAdminModalCode")
            SendAdminModal(extension_packet.from);
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
                serverConfig.chatbotenabled = "off";
                for (const [key, value] of Object.entries(extension_packet.data))
                {
                    serverConfig[key] = value;
                }
                SaveConfigToServer();
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
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty make sure to set it on the admin page.", "\nExtension:" + serverConfig.extensionname, "\nName: openAIkey");
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Set ", "Extension to '" + serverConfig.extensionname, "', Name to 'openAIkey'", " and add your token to the 'Value' Field");
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
            // This message means that twitchchat extensions is up and running so we can now request the user/bot names
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
            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
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
    if (serverConfig.chatbotenabled === "off")
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
function processChatMessage (chatdata)
{
    let history_string = "";
    // ignore messages from the bot or specified users
    if (chatdata.data["display-name"].toLowerCase().indexOf(serverConfig.chatbotname) != -1
        || chatdata.data["display-name"].toLowerCase().indexOf("system") != -1)
        return;
    // check if we are triggering chatbot from a chat message
    else if (chatdata.message.toLowerCase().startsWith(localConfig.starttag.toLowerCase()))
    {
        //console.log("******* CHATBOT started via chat command *******");
        startProcessing()
        return;
    }
    else if (chatdata.message.toLowerCase().startsWith(localConfig.querytag.toLowerCase()) ||
        chatdata.message.toLowerCase().startsWith("hey chatbot".toLowerCase()))
    {
        let question = chatdata.message.toLowerCase().replace(localConfig.querytag.toLowerCase(), "").trim()
        //console.log("******* CHATBOT Question asked in chat *******");
        //console.log(question);
        callOpenAI(question, localConfig.settings.questionmodel)
        return;
    }
    // if we are not processing chat (ie outside of the timer window) just return
    else if (localConfig.running == false)
        return;
    // chat bot is currently turned off
    else if (serverConfig.chatbotenabled != "on")
    {
        console.log("Chatbot is currently turned off in settings")
        return
    }

    // add message to history and return if not enough data yet
    localConfig.chatHistory.push("You: " + chatdata.message)
    localConfig.chatMessageCount++;
    if (localConfig.chatMessageCount < localConfig.chatMessageMaxLines)
        return;
    else
    {
        // only get to here if we have enough messages and everything is set to enabled
        history_string = "You: " + localConfig.chatHistory.join("\nYou: ")
        callOpenAI(serverConfig.chatBotPersonality + "\n" + history_string, localConfig.settings.chatmodel)

    }
}

// ============================================================================
//                           FUNCTION: callOpenAI
// ============================================================================
async function callOpenAI (history_string, modelToUse)
{
    try
    {
        if (serverConfig.chatbotenabled === "on" && localConfig.openAIKey)
        {
            localConfig.OpenAPIHandle = new OpenAIApi(new Configuration(
                {
                    apiKey: localConfig.openAIKey
                }));

            console.log("#'#'#'#'#'#'#' CHATBOT: sending to OpenAI: #'#'#'#'#'#'#' ")
            console.log(history_string)
            const response = await localConfig.OpenAPIHandle.createCompletion(
                {
                    model: modelToUse.model,
                    prompt: [history_string],
                    temperature: modelToUse.temperature,
                    top_p: modelToUse.top_p,
                    max_tokens: modelToUse.max_tokens
                    //stop: ["Human:", "AI:"]
                });

            // not using this currently but left while we tune it as we might need it
            // use this to exclude certain chat messages from being posted back to chat.
            // we contine on the next chat message
            if (response.data.choices[0].text.startsWith("#########"))
            {
                console.log("CHATBOT: Ignoring OpenAI response")
                console.log(response.data)
                return;
            }
            else
            {
                console.log("CHATBOT: OpenAI returned:")
                console.log(response.data)
                let chatMessageToPost = response.data.choices[response.data.choices.length - 1].text.trim("?").trim("\n").trim()

                localConfig.chatHistory.push(chatMessageToPost)

                if (chatMessageToPost.toLowerCase().indexOf(localConfig.querytag.toLowerCase()) == -1 ||
                    chatMessageToPost.toLowerCase().indexOf(localConfig.starttag.toLowerCase()) == -1)
                    postMessageToTwitch(chatMessageToPost.replace(serverConfig.chatbotname + ":", "").trim())
                else
                    console.log("CHATBOT: ERROR openAI returned the querytag in its message")
            }
        }
        else
        {
            if (localConfig.openAIKey === null)
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "No chatbot credentials set");
            else if (localConfig.OpenAPIHandle === null)
                logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "chatbot turned off by user");
        }
        localConfig.running = false
        startChatbotTimer()
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".callOpenAI", "openAI error:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: processChatQuiz
//          ##### WORK IN PROGRESS. RESULTS CURRENTLY NOT ACCURATE #######
// ============================================================================
/**
 * Sends our config to the server to be saved for next time we run
 */
async function processChatQuiz (chatdata)
{
    let enableOpenAI = false;
    let tmp_question = "";
    try
    {
        console.log("CHATBOT received ", chatdata.message)
        if (chatdata.message.toLowerCase().startsWith(localConfig.querytag.toLowerCase()) && serverConfig.chatbotenabled === "on")
        {

            let question = chatdata.message.substring(localConfig.querytag.length).trim()
            if (question != "")
                localConfig.quiz_history_test.push("Human: " + question)
            tmp_question = localConfig.history.join("\n")
            console.log("CHATBOT: quiz_history_test:")
            console.log(localConfig.quiz_history_test)

            const configuration = new Configuration(
                {
                    apiKey: localConfig.openAIKey,
                });
            if (enableOpenAI)
            {
                const openai = new OpenAIApi(configuration);
                const response = await openai.createCompletion(
                    {
                        //model: "text-curie-001",
                        model: "text-davinci-003",
                        prompt: [tmp_question + "\nAI: "],
                        temperature: 0.6,
                        max_tokens: 40,
                        stop: ["Human:", "AI:"]
                    });

                if (response.data.choices[0].text.startsWith("?"))
                {
                    postMessageToTwitch("I'm just a robot, I don't understand what you mean")
                }
                else
                {
                    let answer = response.data.choices[response.data.choices.length - 1].text.trim()
                    if (answer.toLowerCase().includes("incorrect") > 0 ||
                        answer.toLowerCase().includes("i'm sorry, i didn't understand")
                    )
                    {
                        postMessageToTwitch("Sorry that was the wrong answer")
                    }
                    else
                    {
                        let message = "AI: " + answer;
                        localConfig.quiz_history_test.push(message)
                        if (message.toLowerCase().indexOf(localConfig.querytag.toLowerCase()))
                            postMessageToTwitch(response.data.choices[0].text.trim())
                    }
                }
                console.log("##Chatbot response##");
                console.log(response.data.choices);
            }
            else
            {
                console.log("chatbot turned off")
                console.log("question:", question)
                postMessageToTwitch("ChatGPR it currently turned")
            }
        }
    } catch (err)
    {
        console.log(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".processChatQuiz", "openAI error:", err);
    }
}

// ============================================================================
//                           FUNCTION: postMessageToTwitch
// ============================================================================
function postMessageToTwitch (msg)
{
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
    var randomTimeout = Math.floor(Math.random() * (localConfig.timerMax - localConfig.timerMin + 1) + localConfig.timerMin);
    localConfig.chatHistory = []
    localConfig.chatMessageCount = 0;
    if (localConfig.chatTimerHandle != null)
        clearTimeout(localConfig.chatTimerHandle);
    localConfig.chatTimerHandle = setTimeout(startProcessing, randomTimeout * 60000);

    logger.info(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME + ".startChatbotTimer", "Chatbot Timer started: wait time ", randomTimeout * 60000, "minutes");
}
// ============================================================================
//                           FUNCTION: startProcessing
// triggered after a specified timeout
// ============================================================================
function startProcessing ()
{
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
    localConfig.querytag = localConfig.querytag.replace(/CHATBOTNAME/g, serverConfig.chatbotname);
    localConfig.starttag = localConfig.starttag.replace(/CHATBOTNAME/g, serverConfig.chatbotname);
    serverConfig.chatBotPersonality = serverConfig.chatBotPersonality.replace(/CHATBOTNAME/g, serverConfig.chatbotname);
    localConfig.quiz_history_test.forEach(
        (element, index) => 
        {
            localConfig.quiz_history_test[index] = element.replace(/CHATBOTNAME/g, serverConfig.chatbotname)
        });
}

// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };
