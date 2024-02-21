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
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));

const localConfig = {
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    DataCenterSocket: null,
    quizQuestions: [],
    currentQuestionAnswer: 0,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    quizbotTimerHandle: undefined
};

const default_serverConfig = {
    __version__: "0.2",
    extensionname: "quizbot",
    channel: "QUIZBOT_CHANNEL",
    // setting variables
    quizbot_enabled: "off",
    quizbot_restart: "on",
    quizbot_showanswerinconsole: "off",
    quizbot_restore_defaults: "off",
    quizbot_filename: "questions.txt",
    quizbot_duration: "3600000",
};
let serverConfig = structuredClone(default_serverConfig)

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Quiz bot, ask chat a question",
    version: "0.2",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "quizbotQuizStarted",
                displaytitle: "QuizStarted",
                description: "Quiz was started, restarted or a new question was asked",
                messagetype: "trigger_QuizbotQuizStarted",
                parameters: { question: "" }
            },
            {
                name: "quizbotQuizStopped",
                displaytitle: "QuizStopped",
                description: "Quiz was stopped",
                messagetype: "trigger_QuizbotQuizStopped",
                parameters: { question: "", answer: "" }
            },
            {
                name: "quizbotQuizTimeout",
                displaytitle: "QuizTimeout",
                description: "Quiz Question timedout",
                messagetype: "trigger_QuizbotQuizTimeout",
                parameters: { question: "", answer: "" }
            },
            {
                name: "quizbotIncorrectAnswer",
                displaytitle: "IncorrectAnswer",
                description: "Someone provided an incorrec answer",
                messagetype: "trigger_QuizbotIncorrectAnswer",
                parameters: { user: "", question: "", answer: "" }
            },
            {
                name: "quizbotCorrectAnswer",
                displaytitle: "CorrectAnswer",
                description: "Someone answered the quiz question correctly",
                messagetype: "trigger_QuizbotCorrectAnswer",
                parameters: { user: "", question: "", answer: "" }
            },
        ],
    actions:
        [
            {
                name: "quizbotStartQuiz",
                displaytitle: "Start-Restart the quiz",
                description: "Start, restart or skip current question",
                messagetype: "action_QuizbotStartQuiz",
                parameters: {}
            },
            {
                name: "quizbotStopQuiz",
                displaytitle: "Stop the quiz",
                description: "Stop the Quiz",
                messagetype: "action_QuizbotStopQuiz",
                parameters: {}
            },
            {
                name: "quizbotCheckAnswer",
                displaytitle: "Check an answer",
                description: "Check if answer is correct (including chat tag, ie !answer",
                messagetype: "action_QuizbotCheckAnswer",
                parameters: { user: "", answer: "" }
            }

        ],
}
// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
function initialise (app, host, port, heartbeat)
{
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect,
            onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "localConfig.DataCenterSocket connection failed:", err.message);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel)
    );
    // clear the previous timeout if we have one
    clearTimeout(localConfig.heartBeatHandle);
    // start our heatbeat timer
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout);
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        if (server_packet.data != "" && server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
            }
            else
                serverConfig = structuredClone(server_packet.data);
            SaveConfigToServer();
        }
        readQuizFile()
    }
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
            SendSettingsWidgetSmall(extension_packet.from);
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.quizbot_restore_defaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated.", "The config file has been Restored. Your settings may have changed" + "\x1b[0m");
                }
                else
                {
                    let quizstarted = false
                    let quizstopped = false
                    // check if we have toggled the enabled flag
                    if (serverConfig.quizbot_enabled == "on" && extension_packet.data.quizbot_enabled != "on")
                        quizstopped = true;
                    else if (serverConfig.quizbot_enabled == "off" && extension_packet.data.quizbot_enabled == "on")
                        quizstarted = true;

                    serverConfig.quizbot_enabled = "off";
                    serverConfig.quizbot_restart = "off";
                    serverConfig.quizbot_showanswerinconsole = "off";
                    serverConfig.quizbot_restore_defaults = "off";
                    for (const [key, value] of Object.entries(extension_packet.data))
                    {
                        if (key == "quizbot_duration")
                        {
                            // if we have an updated timeout set it and restart the quiz
                            if (value != serverConfig[key] / 1000)
                            {
                                quizstarted = true;
                                if (value > 1)
                                    serverConfig[key] = value * 1000;
                                else
                                    serverConfig[key] = default_serverConfig.quizbot_duration
                            }
                        }
                        else
                            serverConfig[key] = value;
                    }

                    // check if we want to restart the current quiz
                    if (serverConfig.quizbot_enabled == "on" && serverConfig.quizbot_restart == "on")
                        quizstarted = true;
                    // reset the restart flag
                    serverConfig.quizbot_restart = "off";
                    if (quizstopped)
                        stopQuiz()
                    if (quizstarted)
                        startQuiz()
                }

                SaveConfigToServer();
                SendSettingsWidgetSmall("");
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
        else if (extension_packet.type === "action_QuizbotStartQuiz")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                serverConfig.quizbot_enabled = "on"
                startQuiz();
            }
        }
        else if (extension_packet.type === "action_QuizbotStopQuiz")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                stopQuiz();
            }
        }
        else if (extension_packet.type === "action_QuizbotCheckAnswer")
        {
            if (extension_packet.to === serverConfig.extensionname)
                checkAnswer(extension_packet.data);
        }

        else
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received unhandled ExtensionMessage ", server_packet);

    }
    else if (server_packet.type === "UnknownChannel")
    {
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");

    }
    else if (server_packet.type === "ChannelData")
    {
        let extension_packet = server_packet.data;
        if (extension_packet.type === "HeartBeat")
        {
            //Just ignore messages we know we don't want to handle
        }
        else
        {
            logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "received message from unhandled channel ", server_packet.dest_channel);
        }
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
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", server_packet.type);
}

// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
function SendSettingsWidgetSmall (tochannel)
{
    fs.readFile(__dirname + '/quizbotsettingswidgetsmall.html', function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        else
        {
            let modalstring = filedata.toString();
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (key == "quizbot_duration")
                    modalstring = modalstring.replace(key + "text", value / 1000);
                else if (typeof (value) == "string")
                    modalstring = modalstring.replace(key + "text", value);
            }

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        tochannel,
                        serverConfig.channel
                    ),
                    "",
                    tochannel
                ))
        }
    });
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket, sr_api.ServerPacket
        ("SaveConfig",
            serverConfig.extensionname,
            serverConfig))
}
// ============================================================================
//                           FUNCTION: readQuizFile
// ============================================================================
function readQuizFile ()
{
    try
    {
        fs.readFile(__dirname + "/" + serverConfig.quizbot_filename, (err, filedata) =>
        {
            if (err)
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".readQuizFile", "failed read file", err.message);
            else
            {
                let str = filedata.toString()
                if (str.indexOf("\r") > -1)
                    localConfig.quizQuestions = str.split("\r\n")
                else
                    localConfig.quizQuestions = str.split("\n")
                // if we are set to run then start the quiz
                if (serverConfig.quizbot_enabled == "on")
                    startQuiz()
            }
        })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".readQuizFile", "Failed to read quiz file", err.message);
    }
}
// ============================================================================
//                           FUNCTION: sendQuizStarted
// ============================================================================
function sendQuizStarted ()
{
    let QA = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")
    let data = findtriggerByMessageType("trigger_QuizbotQuizStarted")
    let answer = QA[1].trim();

    answer = answer.replaceAll(/[!-~]/ig, "#")
    data.parameters.question = QA[0].trim() + ": !answer " + answer

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_QuizbotQuizStarted",
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel)
    )
}
// ============================================================================
//                           FUNCTION: sendFirstLine
// ============================================================================
function checkAnswer (userAnswer)
{
    let currentAnswer = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[1].trim()
    let answer = userAnswer.answer.replace("!answer ", "").trim()
    let data = {}
    let messagetype = ""
    if (currentAnswer.toLowerCase() == answer.toLowerCase())
        messagetype = "trigger_QuizbotCorrectAnswer";
    else
        messagetype = "trigger_QuizbotIncorrectAnswer";
    data = findtriggerByMessageType(messagetype);
    data.parameters.question = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[0].trim();
    data.parameters.answer = answer;
    data.parameters.user = userAnswer.user;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                messagetype,
                serverConfig.extensionname,
                data,
                serverConfig.channel
            ),
            serverConfig.channel)
    )
    if (currentAnswer.toLowerCase() == answer.toLowerCase())
    {
        clearTimeout(localConfig.quizbotTimerHandle)
        startQuiz();
    }
}
// ============================================================================
//                           FUNCTION: startQuiz
// ============================================================================
function startQuiz ()
{
    // check if quiz is running
    if (typeof (localConfig.quizbotTimerHandle) != "undefined" && !localConfig.quizbotTimerHandle._destroyed)
        stopQuiz()
    localConfig.currentQuestionAnswer = Math.floor(Math.random() * localConfig.quizQuestions.length);

    if (serverConfig.quizbot_showanswerinconsole == "on")
    {
        let currentQuestion = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")
        console.log("currentQuestion", "'" + currentQuestion[0].trim() + "'")
        console.log("answer", "'" + currentQuestion[1].trim() + "'")
    }
    quizTimerCallback();
    //timeout here is so we don't get "sending too quickly" when the bot isn't modded/vip
    setTimeout(() =>
    {
        sendQuizStarted();
    }, 2000);


}
// ============================================================================
//                           FUNCTION: stopQuiz
// ============================================================================
function stopQuiz ()
{
    // if we are currently turned on trigger a message so we can post the answer to the last question when turning it off
    if (serverConfig.quizbot_enabled == "on" && typeof (localConfig.quizbotTimerHandle) != "undefined" && !localConfig.quizbotTimerHandle._destroyed)
    {
        let currentQuestion = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[0].trim();
        let currentAnswer = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[1].trim();
        let data = findtriggerByMessageType("trigger_QuizbotQuizStopped")

        data.parameters.question = currentQuestion
        data.parameters.answer = currentAnswer;
        sr_api.sendMessage(localConfig.DataCenterSocket,
            sr_api.ServerPacket("ChannelData",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "trigger_QuizbotQuizStopped",
                    serverConfig.extensionname,
                    data,
                    serverConfig.channel),
                serverConfig.channel
            ),
        );
    }
    clearTimeout(localConfig.quizbotTimerHandle)
}
// ============================================================================
//                           FUNCTION: quizTimeout
// ============================================================================
function quizTimeout ()
{
    let currentQuestion = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[0].trim();
    let currentAnswer = localConfig.quizQuestions[localConfig.currentQuestionAnswer].split("##")[1].trim();
    let data = findtriggerByMessageType("trigger_QuizbotQuizTimeout")

    data.parameters.question = currentQuestion
    data.parameters.answer = currentAnswer;
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_QuizbotQuizTimeout",
                serverConfig.extensionname,
                data,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function quizTimerCallback ()
{
    clearTimeout(localConfig.quizbotTimerHandle)
    if (serverConfig.quizbot_enabled == "on")
    {
        localConfig.quizbotTimerHandle = setTimeout(() =>
        {
            quizTimeout();
            startQuiz();
            // if we get here the timer has expired
            quizTimerCallback();
        }, serverConfig.quizbot_duration)
    }
}
// ============================================================================
//                           FUNCTION: findtriggerByMessageType
// ============================================================================
function findtriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase()) return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findtriggerByMessageType", "failed to find action", messagetype);
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    let status = {
        connected: serverConfig.quizbot_enabled == "on",
        color: "red"
    }
    if (status.connected && localConfig.quizbotTimerHandle._destroyed)
        status.color = "orange";
    else if (status.connected && !localConfig.quizbotTimerHandle._destroyed)
        status.color = "green";
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                                  EXPORTS
// Note that initialise is mandatory to allow the server to start this extension
// ============================================================================
export { initialise };

