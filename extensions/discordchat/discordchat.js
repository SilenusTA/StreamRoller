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
 * @extension DiscordChat 
 * Send received discord chat messages. Useful for mod messages during stream
 * as these can be displayed below chat on the liveportal
 * This is useful when you want mod messages not seen by chat.
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as logger from "../../backend/data_center/modules/logger.js";
import sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));
// declare our stream references

// use localConfig for stuff that doesn't change or is temporary and not needed to
// be saved over restarts
const localConfig = {
    OUR_CHANNEL: "DISCORD_CHAT",
    EXTENSION_NAME: "discordchat",
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    discordClient: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false
    },
    DataCenterSocket: null
};
//this object will be overwritten from the sever data if it exists
const default_serverConfig = {
    __version__: 0.2,
    extensionname: localConfig.EXTENSION_NAME,
    channel: localConfig.OUR_CHANNEL, // backend socket channel.
    monitoring_channel: "stream-mod-messages", // discord channel
    discordenabled: "off",
    discordMessageBufferMaxSize: "300",
    discordMessageBackupTimer: "60",
    discordchat_restore_defaults: "off",
    //credentials variable names to use (in credentials modal)
    credentialscount: "1",
    cred1name: "DISCORD_TOKEN",
    cred1value: ""
};
// need to make sure we have a proper clone of this object and not a reference
// otherwise changes to server also change defaults
let serverConfig = structuredClone(default_serverConfig)
const serverData =
{
    discordMessageBuffer: [{ name: "system", message: "Start of buffer" }]
};

const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Discord provides an easy way to talk over voice, video, and text. Talk, chat, hang out, and stay close with your friends and communities.",
    version: "0.3",
    channel: serverConfig.channel,
    // these are messages we can sendout that other extensions might want to use to trigger an action
    triggers:
        [
            {
                name: "DiscordMessageRecieved",
                displaytitle: "Discord Message Posted",
                description: "A message was posted to a discord chat room",
                messagetype: "trigger_DiscordMessageReceived",
                parameters:
                {
                    channel: "",
                    name: "",
                    message: ""
                }
            }
        ],
    // these are messages we can receive to perform an action
    actions:
        [
            {
                name: "DiscordPostMessage",
                displaytitle: "Post Message",
                description: "Post a message to a discord channel",
                messagetype: "action_DiscordPostMessage",
                parameters:
                {
                    channel: "",
                    message: "",
                    file: ""
                }
            }

        ],
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

    logger.extra(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "host", host, "port", port, "heartbeat", heartbeat);
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket no heatbeat passed:", heartbeat);

    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * called when websocket connection to server goes down
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * called when a new server websocket connection is made
 */
function onDataCenterConnect ()
{
    logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterConnect", "Creating our channel");
    // Request our config from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));
    // Request our credentials from the server
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));
    // Create/Join the channels we need for this
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestData", localConfig.EXTENSION_NAME));
    // clear the previous timeout if we have one
    clearTimeout(localConfig.heartBeatHandle);
    // start our heartbeat timer
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
/**
 * Called when a message is received on the websocket
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    if (server_packet.type === "ConfigFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
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
        }
    }
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data != "")
            connectToDiscord(server_packet.data);
        else
        {
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.extensionname + " CredentialsFile", "Credential file is empty make sure to set it on the admin page.");
        }
    }
    else if (server_packet.type === "DataFile")
    {
        if (server_packet.data != "")
        {
            // check it is our config
            if (server_packet.to === serverConfig.extensionname)
            {
                if (Object.keys(server_packet.data).length != 0 && typeof (server_packet.data.discordMessageBuffer) != "undefined")
                    serverData.discordMessageBuffer = server_packet.data.discordMessageBuffer;
            }
            SaveDataToServer();
        }
        SaveChatMessagesToServerScheduler();
    } else if (server_packet.type === "UnknownChannel")
    {
        logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "Channel " + server_packet.data + " doesn't exist, scheduling rejoin");
        //channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        setTimeout(() =>
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("JoinChannel",
                    serverConfig.extensionname,
                    server_packet.data));
        }, 5000);
    }
    else if (server_packet.type == "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // received a reqest for our admin bootstrap modal code
        if (extension_packet.to === serverConfig.extensionname)
        {
            if (extension_packet.type === "RequestSettingsWidgetSmallCode")
                SendSettingsWidgetSmall(extension_packet.from);
            else if (extension_packet.type === 'RequestSettingsWidgetLargeCode')
                SendSettingsWidgetLarge(extension_packet.from);
            else if (extension_packet.type === "RequestCredentialsModalsCode")
                SendCredentialsModal(extension_packet.from);
            // received data from our settings widget small. A user has requested some settings be changedd
            else if (extension_packet.type === "SettingsWidgetSmallData")
            {
                // set our config values to the ones in message
                serverConfig.discordenabled = "off";
                // NOTE: this will ignore new items in the page that we don't currently have in our config
                for (const [key] of Object.entries(serverConfig))
                {
                    if (key in extension_packet.data)
                        serverConfig[key] = extension_packet.data[key];
                }
                // save our data to the server for next time we run
                SaveConfigToServer();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
            else if (extension_packet.type === "SettingsWidgetLargeData")
            {
                if (extension_packet.data.discordchat_restore_defaults == "on")
                    serverConfig = structuredClone(default_serverConfig);
                else
                {
                    // set our config values to the ones in message
                    serverConfig.discordenabled = "off";
                    // NOTE: this will ignore new items in the page that we don't currently have in our config
                    // and only performs a shallow copy
                    for (const [key] of Object.entries(serverConfig))
                    {
                        if (key in extension_packet.data)
                            serverConfig[key] = extension_packet.data[key];
                    }
                }
                // save our data to the server for next time we run
                SaveConfigToServer();
                // broadcast our modal out so anyone showing it can update it
                SendSettingsWidgetSmall("");
                SendSettingsWidgetLarge("");
            }
            else if (extension_packet.type === "action_DiscordPostMessage")
            {
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                    ".onDataCenterMessage", "Posting Message", extension_packet.data)
                if (serverConfig.discordenabled === "on")
                {
                    const channel = localConfig.discordClient.channels.cache.find(channel => channel.name === extension_packet.data.channel);
                    if (typeof (channel) != "undefined")
                    {
                        if (extension_packet.data.file && extension_packet.data.file != "")
                        {
                            channel.send(
                                {
                                    content: extension_packet.data.message,
                                    files: [{
                                        attachment: extension_packet.data.file,
                                        name: 'AI_Image_File.jpg',
                                        description: "AI image from stream"
                                    }]
                                })
                        }
                        else
                        {
                            // Send a basic text message
                            channel.send(extension_packet.data.message);
                        }
                    }
                    else
                        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                            "Failed to find discord channel to send to", extension_packet.data.channel);
                }
                else
                {
                    logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                        "Not posting to Discord as extension is turned off ", extension_packet.data.message);
                }
            }
            else if (extension_packet.type === "RequestChatBuffer")
            {
                sendChatBuffer(server_packet.from)
            }
            else if (extension_packet.type === "ChangeListeningChannel")
            {
                serverConfig.monitoring_channel = extension_packet.data;
                SaveConfigToServer();
                logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage", "ChangeListeningChannel received ", extension_packet.data);
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
                logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                    "Unable to process ExtensionMessage : ", server_packet);
        }
        else if (extension_packet.type === "SettingsWidgetSmallCode"
            || extension_packet.type === "SettingsWidgetLargeCode"
            || extension_packet.type === "TriggerAndActions")
        {
            // ignore these messages
        }
        else
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                "received Unhandled ExtensionMessage : ", server_packet);
    }
    else if (server_packet.type === "ChannelData")
    {
        if (server_packet.channel === serverConfig.channel)
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.channel + " message received !?!?", server_packet);
        else
        {
            logger.info(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                "received message: ", server_packet);
        }
    }

    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "LoggingLevel")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
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
                "DiscordChatBuffer",
                localConfig.EXTENSION_NAME,
                serverData.discordMessageBuffer,
                "",
                toExtension,
                localConfig.OUR_CHANNEL),
            "",
            toExtension
        ));
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
/**
 * Send our SettingsWidgetSmall to whoever requested it
 * @param {String} extensionname 
 */
function SendSettingsWidgetSmall (extensionname)
{
    fs.readFile(__dirname + "/discordsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
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
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
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
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * Send our SettingsWidgetSmall to whoever requested it
 * @param {String} extensionname 
 */
function SendSettingsWidgetLarge (extensionname)
{
    fs.readFile(__dirname + "/discordsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
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
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            // send the modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode",
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

// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{
    fs.readFile(__dirname + "/discordcredentialsmodal.html", function (err, filedata)
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
/**
 * save our config to the server
 */
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
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
/**
 * save our data to the server
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
 * saves the discord chat buffer to the server
 */
function SaveChatMessagesToServerScheduler ()
{
    SaveDataToServer()
    // clear any previous timeout
    clearTimeout(localConfig.saveDataHandle)
    localConfig.saveDataHandle = setTimeout(SaveChatMessagesToServerScheduler, serverConfig.discordMessageBackupTimer * 1000)

}
// ############################################################################
//                          Discord server code
// ############################################################################

// ============================================================================
//                           IMPORTS AND GLOBALS
// ============================================================================
import { Client, Intents } from "discord.js";
//import { clearTimeout } from "timers";

// ============================================================================
//                          FUNCTION: connectToDiscord
// ============================================================================
/**
 * Connets to discord
 * @param {object} credentials 
 */
function connectToDiscord (credentials)
{
    try
    {
        localConfig.discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        localConfig.discordClient.on("ready", function (e)
        {
            localConfig.status.connected = true;
            //logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, `Logged in as ${localConfig.discordClient.user.tag}!`);
            //let messagedata = { name: message.author.username, message: message.content }
            process_chat_data({ author: { username: "System" }, content: "Connected to Discord" });
            //process_chat_data(localConfig.discordClient.user.tag, chatmessagetags, "Chat Connected to " + serverConfig.streamername)

        });
        // Authenticate the discord client to start it up
        if (!credentials.DISCORD_TOKEN)
        {
            localConfig.status.connected = false;
            logger.warn(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "DISORD_TOKEN not set");
        }
        else
        {
            localConfig.discordClient.login(credentials.DISCORD_TOKEN)
                .then(() => { localConfig.status.connected = true; })
                .catch((err) => logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "Discord login failed", err.message))


        }
        localConfig.discordClient.on("reconnection", (message) => discordReconnectHandler(message));
        localConfig.discordClient.on("disconnect", (message) => discordDisconnectHandler(message));
        localConfig.discordClient.on("error", (message) => discordErrorHandler(message));
        localConfig.discordClient.on("messageCreate", (message) => discordMessageHandler(message));
    }
    catch (err)
    {
        localConfig.status.connected = false;
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "Discord Error ", err.name, err.message);

    }
}
// ============================================================================
//                          FUNCTION: discordDisconnectHandler
// ============================================================================
/**
 * Called when discord disconnects
 * @param {string} message 
 */
function discordDisconnectHandler (message)
{
    localConfig.status.connected = false;
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discordDisconnectHandler", "Discord Error ", message);
}
// ============================================================================
//                          FUNCTION: discordErrorHandler
// ============================================================================
/**
 * Handles discord error messages
 * @param {string} message 
 */
function discordErrorHandler (message)
{
    localConfig.status.connected = false;
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discordErrorHandler", "Discord Error ", message);
}
// ============================================================================
//                          FUNCTION: discordErrorHandler
// ============================================================================
/**
 * Handles discord reconnections
 * @param {string} message 
 */
function discordReconnectHandler (message)
{
    localConfig.status.connected = true;
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".discordReconnectHandler", "Discord Reconnected ");
}

// ============================================================================
//                          FUNCTION: discordMessageHandler
// ============================================================================
/**
 * Handles discord messages
 * @param {string} message 
 */
function discordMessageHandler (message)
{
    // stop bot responding to other bots
    if (message.author.bot) return;
    // Stop bot responding to itself
    if (message.author.id === localConfig.discordClient.user.id)
        return;
    if (serverConfig.discordenabled != "on")
        return

    //restrict to only channel the channel we want to
    if (message.channel.name === serverConfig.monitoring_channel)
    {
        // send this out so we can put it in our chat window
        sendAlertMessageReceived(message)
        //restrict to only Twitch Subscribers who have synced with discord
        //if (message.member.roles.cache.some((role) => role.name === "Twitch Subscriber")) {
        //if (message.content === "Test") {
        //const user = interaction.options.getUser(message.user);
        message.reply("Message recieved, I'll pass it on to ODG if I can be bothered!");
        /*console.log(message);
        logger.log(message.user);
        console.log(message.member);
        console.log(message.author.username);*/
        //console.log("discordMessageHandler: ", message)
        process_chat_data(message)

    }
}
// ============================================================================
//                           FUNCTION: sendAlertMessageReceived
// ============================================================================
/**
 * sends a discord message alert trigger.
 * @param {object} message 
 */
function sendAlertMessageReceived (message)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "trigger_DiscordMessageReceived",
                serverConfig.extensionname,
                {
                    channel: message.channel.name,
                    name: message.author.username,
                    message: message.content
                },
                serverConfig.channel),
            serverConfig.channel
        ),
    );
}
// ============================================================================
//                           FUNCTION: process_chat_data
// ============================================================================
/**
 * Sends out a discord message targetted for teh liveportal chat window
 * 
 * @deprecated this should be removed and extensions should check for the 
 * "trigger_DiscordMessageReceived" trigger instead
 * @param {object} message 
 */
function process_chat_data (message)
{
    let messagedata = { name: message.author.username, message: message.content }
    serverData.discordMessageBuffer.push(messagedata);
    // Send the message received out on our streamroller "DISCORD_CHAT" channel for other extensions to use if needed
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "DiscordModChat",
                serverConfig.extensionname,
                messagedata,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/** 
 * sends heartbeat status out so other extensions can monitor our status
 */
function heartBeatCallback ()
{
    let connected = localConfig.status.connected

    if (serverConfig.discordenabled === "off")
        connected = false;
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
//                           EXPORTS: initialise
// ============================================================================
// Description: exports from this module
// ----------------------------- notes ----------------------------------------
// will also need additional exports in future (ie reconnect, stop, start etc)
// ============================================================================
export { initialise, triggersandactions };

