/**
 * Copyright (C) 2024 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Parses an IRC message and returns a JSON object with the message's
// component parts (tags, source (nick and host), command, parameters).
// Expects the caller to pass a single message. (Remember, the Twitch
// IRC server may send one or more IRC messages in a single message.)
// ############################# twitchchat.js ##############################
// Simple twitch chat reader so we can display/parse twitch chat/commands
// in other extension
// ---------------------------- creation --------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/StreamRoller
// Date: 25-Jul-2024
// --------------------------- functionality ----------------------------------
// Current functionality:
// receive twitch chat message from IRC and parse it in a way that can be used
// for streamroller messages
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
import WebSocketClient from "ws";
import * as logger from "../../backend/data_center/modules/logger.js";

// ============================================================================
//                           FUNCTION: connectToTwitch
// ============================================================================
/**
 * 
 * @param {Object} pLocalConfig local config of the module
 * @param {Object} pServerConfig server config of the module
 * @param {Function} messageHandler handler for twitch messages
 * @param {Object} account user type to connect ie "user" or "bot"
 * @returns null
 */
async function connectToTwitch (pLocalConfig, pServerConfig, messageHandler, account)
{
    console.log("################### connectToTwitch #####################")
    console.log("account = ", account)
    //console.log(pLocalConfig.twitchClient[account])

    //if (account == "user")
    //{
    //set the default status of the connection (will be updated on message receipt for connection)
    pLocalConfig.twitchClient[account].state.readonly = true;
    pLocalConfig.twitchClient[account].state.connected = false;
    // create our connection to twitch

    pLocalConfig.twitchClient[account].connection = new WebSocketClient('ws://irc-ws.chat.twitch.tv:80');
    pLocalConfig.twitchClient[account].connection.on('open', function open ()
    {
        //console.log('WS pLocalConfig.twitchClient[account].connection Open for', account);
        //console.log(this)
        this.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
        this.send('PASS ' + pLocalConfig.usernames[account]["oauth"]);
        this.send('NICK ' + pLocalConfig.usernames[account]["name"]);
        this.send('JOIN #' + pServerConfig.streamername);
    });
    pLocalConfig.twitchClient[account].connection.on('message', function message (data)
    {
        console.log("@@@@@@@@@@@@@@@@@@@@@ irc.js:parsemessage START @@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        let parsedData = parseMessage(data.toString())
        //console.log('irc.js:parsemessage:IRC message received:', parsedData)
        if (parsedData)
        {
            console.log(parsedData.command.command, "received")
            messageHandler(account, parsedData)
        }
        else
            console.log("parsedData was null")
        console.log("@~@~@~@~@~@~@~@~@~@~@ irc.js:parsemessage END @~@~@~@~@~@~@~@~@~@~@~@~@~@~@~@")

    });

    //}
    /*
    // check for readonly user account login (bot doesn't get logged in if no credentials set)
    if (account === "user" && pServerConfig.enabletwitchchat == "on" &&
        (typeof pLocalConfig.usernames.user["name"] === "undefined" || typeof pLocalConfig.usernames.user["oauth"] === "undefined" ||
            pLocalConfig.usernames.user["name"] === "" || pLocalConfig.usernames.user["oauth"] === ""))
    {
        logger.log(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".connectToTwitch", "Connecting readonly")
        //pLocalConfig.twitchClient[account].connection = new tmi.Client({ channels: [pServerConfig.streamername] });
        pLocalConfig.twitchClient[account].connection = new WebSocketClient();
        pLocalConfig.twitchClient[account].connection.on('connectFailed', function (error)
        {
            console.log('Connect Error: ' + error.toString());
            logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".websocket connect", error.toString());
            return;
        });
        pLocalConfig.twitchClient[account].connection.connect('ws://irc-ws.chat.twitch.tv:80')
            .then(() =>
            {
                pLocalConfig.twitchClient[account].state.readonly = true;
                pLocalConfig.twitchClient[account].state.connected = true;
                logger.info(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".connectToTwitch", "Twitch chat client connected readonly");
                process_chat_data("#" + pServerConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Chat connected readonly: " + pServerConfig.streamername);
            }
            )
            .catch((err) => 
            {
                pLocalConfig.twitchClient[account].state.readonly = true;
                pLocalConfig.twitchClient[account].state.connected = false;
                logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".connectToTwitch", "Twitch chat connect failed for " + account + ":" + pLocalConfig.usernames[account]["name"], err)
                process_chat_data("#" + pServerConfig.streamername, { "display-name": "System", "emotes": "", "message-type": "twitchchat_extension" }, "Failed to join " + pServerConfig.streamername)
            }
            )

        pLocalConfig.twitchClient[account].connection.on("message", (channel, tags, message, self) =>
        {
            process_chat_data(channel, tags, message);
        });
    }
    else if (pServerConfig.enabletwitchchat == "on")
    // connect with Oauth pLocalConfig.twitchClient[account].connection
    {
        chatLogin(account);
    }
    else
        logger.info(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".connectToTwitch", "twitch chat currently set to off")
    */
}
// ============================================================================
//                     FUNCTION: reconnectChat
// ============================================================================
function reconnectChat (pLocalConfig, pServerConfig, messageHandler, account)
{
    console.log("########### reconnectChat ############", account)
    logger.log(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".reconnectChat", "Reconnecting chat " + pServerConfig.streamername + ":" + pServerConfig.enabletwitchchat);
    //if we are already connecting then return (might have been multiple requests sent though at the same time)
    if (pLocalConfig.twitchClient[account].connecting)
    {
        logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".reconnectChat", "trying to reconnect while a connection is already in progress")
        return;
    }
    try
    {
        pLocalConfig.twitchClient[account].connecting = true;
        var connectedChannels = pLocalConfig.twitchClient[account].connection.getChannels();
        if (connectedChannels.length == 0)
        {
            joinChatChannel(pLocalConfig, pServerConfig, messageHandler, account);
        }
        else
        {
            connectedChannels.forEach(element =>
            {
                pLocalConfig.twitchClient[account].connection.part(element)
                    .then(channel => 
                    {
                        logger.log(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".leaveAllChannels", "left Chat channel " + channel)

                    })
                    .catch((err) => 
                    {
                        pLocalConfig.twitchClient[account].state.connected = false;
                        logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".leaveAllChannels", "Leave chat failed", element, err)
                    });
            })
        }
        if (pServerConfig.enabletwitchchat === "on")
        {
            joinChatChannel(pLocalConfig, pServerConfig, messageHandler, account);
        }
        pLocalConfig.twitchClient[account].connecting = false;
    }
    catch (err)
    {
        logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".reconnectChat", "Changing stream failed", pServerConfig.streamername, err.message);
        console.log(JSON.stringify(pLocalConfig.twitchClient[account], null, 2));
        pLocalConfig.twitchClient[account].state.connected = false;
        pLocalConfig.twitchClient[account].connecting = false;
    }
}
// ============================================================================
//                     FUNCTION: joinChatChannel
// ============================================================================
function joinChatChannel (pLocalConfig, pServerConfig, messageHandler, account)
{
    let chatmessagename = "#" + pServerConfig.streamername.toLocaleLowerCase();
    let chatmessagetags = { "display-name": "System", "emotes": "" };
    if (pServerConfig.enabletwitchchat === "on")
    {
        pLocalConfig.twitchClient[account].connection.join(pServerConfig.streamername)
            .then(() =>
            {
                pLocalConfig.twitchClient[account].state.connected = true;
                logger.log(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".joinChatChannel", "Chat channel changed to " + pServerConfig.streamername);
                messageHandler(chatmessagename, chatmessagetags, "[" + account + "]Chat channel changed to " + pServerConfig.streamername);
            }
            )
            .catch((err) =>
            {
                pLocalConfig.twitchClient[account].state.connected = false;
                logger.err(pLocalConfig.SYSTEM_LOGGING_TAG + pLocalConfig.EXTENSION_NAME + ".joinChatChannel", "stream join threw an error", err.message, " sheduling reconnect");
                messageHandler(chatmessagename, chatmessagetags, "Failed to join " + pServerConfig.streamername)
                setTimeout(() =>
                {
                    reconnectChat(pLocalConfig, pServerConfig, account)
                }, 5000)
            });
    }
}
// ============================================================================
//                           FUNCTION: parseMessage
// ============================================================================
function parseMessage (message)
{

    let parsedMessage = {  // Contains the component parts.
        tags: null,
        source: null,
        command: null,
        parameters: null
    };

    // The start index. Increments as we parse the IRC message.

    let idx = 0;

    // The raw components of the IRC message.

    let rawTagsComponent = null;
    let rawSourceComponent = null;
    let rawCommandComponent = null;
    let rawParametersComponent = null;

    // If the message includes tags, get the tags component of the IRC message.

    if (message[idx] === '@')
    {  // The message includes tags.
        let endIdx = message.indexOf(' ');
        rawTagsComponent = message.slice(1, endIdx);
        idx = endIdx + 1; // Should now point to source colon (:).
    }
    // Get the source component (nick and host) of the IRC message.
    // The idx should point to the source part; otherwise, it's a PING command.

    if (message[idx] === ':')
    {
        idx += 1;
        let endIdx = message.indexOf(' ', idx);
        rawSourceComponent = message.slice(idx, endIdx);
        idx = endIdx + 1;  // Should point to the command part of the message.
    }

    // Get the command component of the IRC message.

    let endIdx = message.indexOf(':', idx);  // Looking for the parameters part of the message.
    if (-1 == endIdx)
    {                      // But not all messages include the parameters part.
        endIdx = message.length;
    }

    rawCommandComponent = message.slice(idx, endIdx).trim();


    // Get the parameters component of the IRC message.

    if (endIdx != message.length)
    {  // Check if the IRC message contains a parameters component.
        idx = endIdx + 1;            // Should point to the parameters part of the message.
        rawParametersComponent = message.slice(idx);
    }

    // Parse the command component of the IRC message.

    parsedMessage.command = parseCommand(rawCommandComponent);

    // Only parse the rest of the components if it's a command
    // we care about; we ignore some messages.

    if (null == parsedMessage.command)
    {  // Is null if it's a message we don't care about.
        return null;
    }
    else
    {
        if (null != rawTagsComponent)
        {  // The IRC message contains tags.
            parsedMessage.tags = parseTags(rawTagsComponent);
        }

        parsedMessage.source = parseSource(rawSourceComponent);

        parsedMessage.parameters = rawParametersComponent;
        if (rawParametersComponent && rawParametersComponent[0] === '!')
        {
            // The user entered a bot command in the chat window.            
            parsedMessage.command = parseParameters(rawParametersComponent, parsedMessage.command);
        }
    }

    return parsedMessage;
}

// Parses the tags component of the IRC message.
// ============================================================================
//                           FUNCTION: parseTags
// ============================================================================
function parseTags (tags)
{
    // badge-info=;badges=broadcaster/1;color=#0000FF;...

    const tagsToIgnore = {  // List of tags to ignore.
        'client-nonce': null,
        'flags': null
    };

    let dictParsedTags = {};  // Holds the parsed list of tags.
    // The key is the tag's name (e.g., color).
    let parsedTags = tags.split(';');

    parsedTags.forEach(tag =>
    {
        let parsedTag = tag.split('=');  // Tags are key/value pairs.
        let tagValue = (parsedTag[1] === '') ? null : parsedTag[1];

        switch (parsedTag[0])
        {  // Switch on tag name
            case 'badges':
            case 'badge-info':
                // badges=staff/1,broadcaster/1,turbo/1;

                if (tagValue)
                {
                    let dict = {};  // Holds the list of badge objects.
                    // The key is the badge's name (e.g., subscriber).
                    let badges = tagValue.split(',');
                    badges.forEach(pair =>
                    {
                        let badgeParts = pair.split('/');
                        dict[badgeParts[0]] = badgeParts[1];
                    })
                    dictParsedTags[parsedTag[0]] = dict;
                }
                else
                {
                    dictParsedTags[parsedTag[0]] = null;
                }
                break;
            case 'emotes':
                // emotes=25:0-4,12-16/1902:6-10

                if (tagValue)
                {
                    let dictEmotes = {};  // Holds a list of emote objects.
                    // The key is the emote's ID.
                    let emotes = tagValue.split('/');
                    emotes.forEach(emote =>
                    {
                        let emoteParts = emote.split(':');

                        let textPositions = [];  // The list of position objects that identify
                        // the location of the emote in the chat message.
                        let positions = emoteParts[1].split(',');
                        positions.forEach(position =>
                        {
                            let positionParts = position.split('-');
                            textPositions.push({
                                startPosition: positionParts[0],
                                endPosition: positionParts[1]
                            })
                        });

                        dictEmotes[emoteParts[0]] = textPositions;
                    })

                    dictParsedTags[parsedTag[0]] = dictEmotes;
                }
                else
                {
                    dictParsedTags[parsedTag[0]] = null;
                }

                break;
            case 'emote-sets':
                // emote-sets=0,33,50,237

                var emoteSetIds = tagValue.split(',');  // Array of emote set IDs.
                dictParsedTags[parsedTag[0]] = emoteSetIds;
                break;
            default:
                // If the tag is in the list of tags to ignore, ignore
                // it; otherwise, add it.

                if (tagsToIgnore.hasOwnProperty(parsedTag[0]))
                {
                    //ignore it
                }
                else
                {
                    dictParsedTags[parsedTag[0]] = tagValue;
                }
        }
    });

    return dictParsedTags;
}

// Parses the command component of the IRC message.
// ============================================================================
//                           FUNCTION: parseCommand
// ============================================================================
function parseCommand (rawCommandComponent)
{
    let parsedCommand = null;
    let commandParts = rawCommandComponent.split(' ');

    switch (commandParts[0])
    {
        case 'JOIN':
        case 'PART':
        case 'NOTICE':
        case 'CLEARCHAT':
        case 'HOSTTARGET':
        case 'PRIVMSG':
            parsedCommand = {
                command: commandParts[0],
                channel: commandParts[1]
            }
            break;
        case 'PING':
            parsedCommand = {
                command: commandParts[0]
            }
            break;
        case 'CAP':
            parsedCommand = {
                command: commandParts[0],
                isCapRequestEnabled: (commandParts[2] === 'ACK'),
                // The parameters part of the messages contains the 
                // enabled capabilities.
            }
            break;
        case 'GLOBALUSERSTATE':  // Included only if you request the /commands capability.
            // But it has no meaning without also including the /tags capability.
            parsedCommand = {
                command: commandParts[0]
            }
            break;
        case 'USERSTATE':   // Included only if you request the /commands capability.
        case 'ROOMSTATE':   // But it has no meaning without also including the /tags capabilities.
            parsedCommand = {
                command: commandParts[0],
                channel: commandParts[1]
            }
            break;
        case 'RECONNECT':
            console.log('The Twitch IRC server is about to terminate the connection for maintenance.')
            parsedCommand = {
                command: commandParts[0]
            }
            break;
        case '421':
            console.log(`Unsupported IRC command: ${commandParts[2]}`)
            return null;
        case '001':  // Logged in (successfully authenticated). 
            parsedCommand = {
                command: commandParts[0],
                channel: commandParts[1]
            }
            break;
        case '002':  // Ignoring all other numeric messages.
        case '003':
        case '004':
        case '353':  // Tells you who else is in the chat room you're joining.
        case '366':
        case '372':
        case '375':
        case '376':
            console.log(`numeric message: ${commandParts[0]}`)
            return null;
        default:
            console.log(`\nUnexpected command: ${commandParts[0]}\n`);
            return null;
    }

    return parsedCommand;
}

// Parses the source (nick and host) components of the IRC message.
// ============================================================================
//                           FUNCTION: parseSource
// ============================================================================
function parseSource (rawSourceComponent)
{
    if (null == rawSourceComponent)
    {  // Not all messages contain a source
        return null;
    }
    else
    {
        let sourceParts = rawSourceComponent.split('!');
        return {
            nick: (sourceParts.length == 2) ? sourceParts[0] : null,
            host: (sourceParts.length == 2) ? sourceParts[1] : sourceParts[0]
        }
    }
}

// Parsing the IRC parameters component if it contains a command (e.g., !dice).
// ============================================================================
//                           FUNCTION: parseParameters
// ============================================================================
function parseParameters (rawParametersComponent, command)
{
    let idx = 0
    let commandParts = rawParametersComponent.slice(idx + 1).trim();
    let paramsIdx = commandParts.indexOf(' ');

    if (-1 == paramsIdx)
    { // no parameters
        command.botCommand = commandParts.slice(0);
    }
    else
    {
        command.botCommand = commandParts.slice(0, paramsIdx);
        command.botCommandParams = commandParts.slice(paramsIdx).trim();
        // TODO: remove extra spaces in parameters string
    }

    return command;
}

export { connectToTwitch, reconnectChat };
