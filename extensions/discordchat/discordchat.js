// ############################# DISCORDCHAT.js ##############################
// In progress test discord chat app.
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 05-Jan-2022
// --------------------------- functionality ----------------------------------
// Current functionality:
// 1) Send selected alerts to the given discord channel
// 2) Read discord channel messages and send them out to StreamRoller, currently
// used so that mods can send messages to appear on the live dashboard
// ----------------------------- notes ----------------------------------------
// In Progress
// ============================================================================

// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import * as logger from "../../backend/data_center/modules/logger.js";
import * as sr_api from "../../backend/data_center/public/streamroller-message-api.cjs";
import * as fs from "fs";
import { config } from "./config.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// declare our stream references
let DataCenterSocket = null;
//this object will be overwritten from the sever data if it exists
let serverConfig = {
    extensionname: config.EXTENSION_NAME,
    channel: config.OUR_CHANNEL, // backend socket channel.
    modmessage_channel: "stream-mod-messages", // discord channel
    donations_channel: "announcements" // discord channel
    //listeningchannel: "mod-message-channel"
};

// ============================================================================
//                           FUNCTION: initialise
// ============================================================================
/**
 * maddatory function so that the backend can start us up
 */
function initialise(app, host, port)
{
    try
    {
        DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect, host, port);
    } catch (err)
    {
        logger.err(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".initialise", "DataCenterSocket connection failed:", err);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect(reason)
{
    logger.log(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterDisconnect", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect()
{
    // Request our config from the server
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname, serverConfig.channel));
    // Create/Join the channels we need for this
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage(decoded_data)
{
    //var decoded_data = JSON.parse(data);
    if (decoded_data.type === "ConfigFile")
    {
        // check if there is a server config to use. This could be empty if it is our first run or we have never saved any config data before. 
        // if it is empty we will use our current default and send it to the server 
        if (decoded_data.data != "")

            // check it is our config
            if (decoded_data.to === serverConfig.extensionname)
            {
                // we could just assign the values here (ie serverConfig = decoded_packet.message_contents)
                // but if we change/remove an item it would never get removed from the store
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_data.data)
                        serverConfig[key] = decoded_data.data[key];
            }
        SaveConfigToServer();
    }
    else if (decoded_data.type === "UnknownChannel")
    {
        logger.info(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
            "Channel " + decoded_data.data + " doesn't exist, scheduling rejoin");
        //channel might not exist yet, extension might still be starting up so lets rescehuled the join attempt
        // need to add some sort of flood control here so we are only attempting to join one at a time
        setTimeout(() =>
        {
            sr_api.sendMessage(DataCenterSocket,
                sr_api.ServerPacket("JoinChannel",
                    serverConfig.extensionname,
                    decoded_data.data));
        }, 5000);
    }
    else if (decoded_data.type == "ExtensionMessage")
    {
        var decoded_packet = JSON.parse(decoded_data.data);
        // received a reqest for our admin bootstrap modal code
        console.log(decoded_packet.to)
        console.log(serverConfig.extensionname)
        if (decoded_packet.to === serverConfig.extensionname)
        {
            if (decoded_packet.type === "RequestAdminModalCode")
                SendAdminModal(decoded_packet.from);
            // received data from our admin modal. A user has requested some settings be changedd
            else if (decoded_packet.type === "AdminModalData")
            {
                // lets reset our config checkbox settings (modal will omit ones not checked)
                serverConfig.follows = serverConfig.raids = serverConfig.hosts = serverConfig.bits = serverConfig.donations =
                    serverConfig.subs = serverConfig.resubs = serverConfig.giftsubs = serverConfig.merch = serverConfig.cloudbotredemption = "off";
                // set our config values to the ones in message
                // NOTE: this will ignore new items in hte page that we don't currently have in our config
                for (const [key, value] of Object.entries(serverConfig))
                    if (key in decoded_packet.data)
                        serverConfig[key] = decoded_packet.data[key];
                // save our data to the server for next time we run
                SaveConfigToServer();
                // currently we have the same data as sent so no need to update the server page at the moment
                SendAdminModal(decoded_packet.from);
            }
            else if (decoded_packet.type === "PostMessage")
            {
                console.log(decoded_packet.data)
                const channel = discordClient.channels.cache.find(channel => channel.name === decoded_packet.data.channel);
                channel.send(decoded_packet.data.message);
                console.log("PostMessage received ", decoded_packet);
            }
            else
                logger.err(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                    "Unable to process ExtensionMessage : ", decoded_data);
        }
        else
            logger.err(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                "received Unhandled ExtensionMessage : ", decoded_data);
    }
    else if (decoded_data.type === "ChannelData")
    {
        if (decoded_data.channel === serverConfig.channel)
            logger.warn(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                serverConfig.channel + " message received !?!?", decoded_data);
        else
        {
            logger.info(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".onDataCenterMessage",
                "received message: ", decoded_data);
        }
    }

    else if (decoded_data.type === "ChannelJoined"
        || decoded_data.type === "ChannelCreated"
        || decoded_data.type === "ChannelLeft"
        || decoded_data.type === "LoggingLevel")
    {
        // just a blank handler for items we are not using to avoid message from the catchall
    }
    // ------------------------------------------------ unknown message type received -----------------------------------------------
    else
        logger.warn(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
            ".onDataCenterMessage", "Unhandled message type", decoded_data.type);
}

// ===========================================================================
//                           FUNCTION: SendAdminModal
// ===========================================================================
/**
 * Send our AdminModal to whoever requested it
 * @param {String} extensionname 
 */
function SendAdminModal(extensionname)
{
    fs.readFile(__dirname + '/adminmodal.html', function (err, filedata)
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
                    modalstring = modalstring.replace(key + "text", value);
            }
            // send the modal data to the server
            sr_api.sendMessage(DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "AdminModalCode",
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
function SaveConfigToServer()
{
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig));
}
// ############################################################################
//                          Discord server code
// ############################################################################

// ============================================================================
//                           IMPORTS AND GLOBALS
// ============================================================================
import { Client, Intents, Permissions, Guild } from "discord.js";
// Instantiate a new client with some necessary parameters.
const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// Notify progress
discordClient.on("ready", function (e)
{
    logger.log(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname, `Logged in as ${discordClient.user.tag}!`);
});
// ============================================================================
//                          DISCORD MESSAGE HANDLING
// ============================================================================
discordClient.on("messageCreate", function (message)
{
    // stop bot responding to other bots
    if (message.author.bot) return;
    // Stop bot responding to itself
    if (message.author.id === discordClient.user.id)
        return;
    //restrict to only channel the channel we want to
    if (message.channel.name === serverConfig.modmessage_channel)
    {
        //restrict to only Twitch Subscribers who have synced with discord
        //if (message.member.roles.cache.some((role) => role.name === "Twitch Subscriber")) {
        //if (message.content === "Test") {
        //const user = interaction.options.getUser(message.user);
        message.reply("Message recieved, I'll pass it on to ODG if I can be bothered!");
        /*console.log(message);
        logger.log(message.user);
        console.log(message.member);
        console.log(message.author.username);*/
        let messagedata = { name: message.author.username, message: message.content }

        // Send the message received out on our streamroller "DISCORD_CHAT" channel for other extensions to use if needed
        sr_api.sendMessage(DataCenterSocket,
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
});

// Authenticate the discord client to start it up
if (!process.env.DISCORD_TOKEN)
    logger.log(config.SYSTEM_LOGGING_TAG + serverConfig.extensionname, "DISORD_TOKEN not set in environment variable");
else
    discordClient.login(process.env.DISCORD_TOKEN);

// ============================================================================
//                           EXPORTS: initialise
// ============================================================================
// Desription: exports from this module
// ----------------------------- notes ----------------------------------------
// will also need additional exports in future (ie reconnect, stop, start etc)
// ============================================================================
export { initialise };
