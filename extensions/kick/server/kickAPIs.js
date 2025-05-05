/**
 * Copyright (C) 2025 "SilenusTA https://www.twitch.tv/olddepressedgamer"
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

import https from 'https';
import { Buffer } from 'buffer';
import * as querystring from 'querystring';
import * as logger from "../../../backend/data_center/modules/logger.js";
const localConfig =
{
    SYSTEM_LOGGING_TAG: "[KickAPIs.js]",
    maxChatMessageLength: 500,
    retryCounter: 2,// attempt to send a message again on a 400 request if it fails. For some reason occasionally a message will fail for no reason.
    attemptCounter: 0,
    DEBUG: false
}
// callbacks so we can update our refresh token if it expires
const callbacks =
{
    updateRefreshTokenFn: null
}
// store some local credentials to save having to pass them all the time
let Credentials = {};
// ============================================================================
//                           FUNCTION: init
// ============================================================================
/**
 * 
 * @param {function} updateRefreshTokenFn callback for when we get an updated refresh token
 */
function init (updateRefreshTokenFn)
{
    callbacks.updateRefreshTokenFn = updateRefreshTokenFn;
}
// ============================================================================
//                           FUNCTION: setCredentials
// ============================================================================
/**
 * 
 * @param {string} creds credentials
 */
function setCredentials (creds)
{
    Credentials = structuredClone(creds);
}
// ============================================================================
//                           FUNCTION: checkCredentials
// ============================================================================
/**
 * Checks for missing credentials
 * @param {boolean} log log to console any missing creds
 * @returns true/false 
 */
function checkCredentials (log = false)
{
    let returnValue = true
    if (Credentials.kickApplicationClientId == undefined
        || Credentials.kickApplicationClientId == "")
    {
        if (log) console.log("Kick: Missing Client ID")
        returnValue = false;
    }
    if (Credentials.kickApplicationSecret == undefined
        || Credentials.kickApplicationSecret == "")
    {
        if (log) console.log("Kick: Missing Client Secret")
        returnValue = false;
    }
    if (Credentials.kickAccessToken == undefined
        || Credentials.kickAccessToken == "")
    {
        if (log) console.log("Kick: Missing Streamer Access token")
        returnValue = false;
    }
    if (Credentials.kickRefreshToken == undefined
        || Credentials.kickRefreshToken == "")
    {
        if (log) console.log("Kick: Missing Streamer refresh token")
        returnValue = false;
    }
    if (Credentials.kickBotAccessToken == undefined
        || Credentials.kickBotAccessToken == "")
    {
        if (log) console.log("Kick: Missing Bot Access token")
        returnValue = false;
    }
    if (Credentials.kickBotRefreshToken == undefined
        || Credentials.kickBotRefreshToken == "")
    {
        if (log) console.log("Kick: Missing Bot refresh token")
        returnValue = false;
    }
    return returnValue;
}
// ============================================================================
//                           FUNCTION: refreshToken
// ============================================================================
/**
 * 
 * @param {boolean} [forStreamer = true] are we refreshing the streamer or bot token
 * @returns tokens
 */
function refreshToken (forStreamer = true)
{
    file_log(`######## refreshToken (${forStreamer}) ##############`)
    return new Promise((resolve, reject) =>
    {
        file_log(`refreshToken (${forStreamer}):Attempting refresh using `, Credentials);
        let postData = null
        if (forStreamer)
            postData = querystring.stringify({
                refresh_token: Credentials.kickRefreshToken,
                client_id: Credentials.kickApplicationClientId,
                client_secret: Credentials.kickApplicationSecret,
                grant_type: 'refresh_token'
            });
        else
            postData = querystring.stringify({
                refresh_token: Credentials.kickBotRefreshToken,
                client_id: Credentials.kickApplicationClientId,
                client_secret: Credentials.kickApplicationSecret,
                grant_type: 'refresh_token'
            });
        const options = {
            hostname: 'id.kick.com',
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const req = https.request(options, (res) =>
        {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () =>
            {
                file_log(`refreshToken (${forStreamer}): returned res.statusCode ${res.statusCode} res.statusCode ${res.statusMessage}`);
                file_log(`JSON.parse(data)`, JSON.parse(data));
                if (res.statusCode >= 200 && res.statusCode < 300)
                {
                    try
                    {
                        const parsed = JSON.parse(data);
                        if (parsed.access_token)
                        {
                            if (forStreamer)
                            {
                                Credentials.kickAccessToken = parsed.access_token;
                                callbacks.updateRefreshTokenFn("kickAccessToken", parsed.access_token)
                                Credentials.kickRefreshToken = parsed.refresh_token;
                                callbacks.updateRefreshTokenFn("kickRefreshToken", parsed.access_token)
                            }
                            else
                            {
                                Credentials.kickAccessToken = parsed.access_token;
                                callbacks.updateRefreshTokenFn("kickBotAccessToken", parsed.access_token)
                                Credentials.kickRefreshToken = parsed.refresh_token;
                                callbacks.updateRefreshTokenFn("kickBotRefreshToken", parsed.access_token)
                            }
                            resolve({ type: "success", location: `refreshToken(${forStreamer})` });
                        } else
                        {
                            file_log(`refreshToken (${forStreamer}): No access_token in response`);
                            reject({ type: "no_access_token_returned", location: `refreshToken(${forStreamer})`, message: "need to authorize" });
                        }
                    } catch (e)
                    {
                        file_log(`refreshToken (${forStreamer}): Failed to parse token response`);
                        reject({ type: "error_parsing_refresh_token", location: `refreshToken(${forStreamer})`, message: "need to authorize" });
                    }
                }
                else if (res.statusCode == 401)
                {
                    let errordata = JSON.parse(data)
                    file_log(`refreshToken (${forStreamer}): Refresh failed with 401`, res.statusMessage);
                    file_log(`refreshToken (${forStreamer}): response was`, errordata.error);
                    if (errordata.error == "invalid_grant")
                        reject({ type: "invalid_grant", location: `refreshToken(${(forStreamer) ? "user" : "bot"})`, message: "need to authorize" });
                    else
                        reject({ type: "refresh_failed", location: `refreshToken(${forStreamer})`, message: "need to authorize" });
                }
                else
                {
                    file_log(`refreshToken (${forStreamer}) refreshToken(1): Error res.statusCode=${res.statusCode} res.statusCode=${res.statusMessage}`);
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "refreshToken(2)", "statusCode:", res.statusCode, "message", res.statusMessage);
                    reject({
                        type: res.statusMessage, location: `refreshToken(${forStreamer})`, message: `Token refresh failed with status ${res.statusCode}`
                    });
                }
            });
        });

        req.on('error', (err) =>
        {
            file_log(`refreshToken (${forStreamer}) on err handler`, err);
            reject({ type: "invalid_grant", location: `refreshToken(${forStreamer})`, message: err });
        });

        req.write(postData);
        req.end();
    });
}
// ============================================================================
//                           FUNCTION: getUsersWithToken
// ============================================================================
/**
 * @param {string} token // kick oauth/access token
 * @returns user object
 */
function getUsersWithToken (token)
{
    file_log(`######## getUsersWithToken (token) ##############`, token);
    return new Promise((resolve, reject) =>
    {
        const options = {
            hostname: 'api.kick.com',
            path: '/public/v1/users',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        };

        const req = https.request(options, (res) =>
        {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    file_log(`getUsersWithToken (token) res.statusCode:${res.statusCode}, res.statusMessage:${res.statusMessage}`);
                    reject({ type: 'Unauthorized', location: 'getUsersWithToken', message: 'possible refresh needed' });
                } else
                {
                    try
                    {
                        file_log(`getUsersWithToken (token) success`);
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        file_log(`getUsersWithToken (token) Error parsing data`, e);
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getUsersWithToken", "ERROR: ", e);
                        reject({ type: 'parse_error', location: 'getUsersWithToken', message: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            file_log(`getUsersWithToken (token) request_error`, err);
            reject({ type: 'getUsersWithToken:request_error', location: 'getUsersWithToken', message: err });
        });

        req.end();
    });
}
// ============================================================================
//                           FUNCTION: getUser
// ============================================================================
/**
 * gets the user details for either streamer or the bot
 * @param {boolean} forStreamer 
 * @returns user object
 */
async function getUser (forStreamer)
{
    file_log(`######## getUser (${forStreamer}) ##############`);
    try
    {
        //let credentialsOk = checkCredentials()
        //if (!credsOk)
        //    return;
        try
        {
            let data = null;
            // check if we are using the streamer or bot account for this request
            if (forStreamer)
                data = await getUsersWithToken(Credentials.kickAccessToken);
            else
                data = await getUsersWithToken(Credentials.kickBotAccessToken);
            return data;
        } catch (err)
        {
            file_log(`getUser (${forStreamer}) Error`, err);
            if (err.type === 'Unauthorized')
            {
                try
                {
                    // Token likely expired

                    file_log(`getUser (${forStreamer}) Unauthorized, calling refresh`);
                    const response = await refreshToken(forStreamer);
                    file_log(`getUser (${forStreamer}) tokens returned`, response);
                    try
                    {
                        file_log(`getUser (${forStreamer}) Second attempt after refresh`);
                        let data = null;
                        if (forStreamer)
                            data = await getUsersWithToken(Credentials.kickAccessToken);
                        else
                            data = await getUsersWithToken(Credentials.kickBotAccessToken);
                        return data;
                    } catch (err2)
                    {
                        file_log(`getUser (${forStreamer}) Still failed after refresh`, err2);
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getUser", "Still failed after refresh err2:", err2);
                        throw err2;
                    }
                } catch (err)
                {
                    // failed refresh
                    file_log(`getUser (${forStreamer}) failed to refresh`, err);
                    if (err.type == "invalid_grant")
                        throw err
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + `getUser (${forStreamer})`, "failed to refresh:", err);

                }
            } else
            {
                file_log(`getUser (${forStreamer}) Request failed err:`, err);
                logger.err(localConfig.SYSTEM_LOGGING_TAG + "getUser", "Request failed err:", err);
                throw err;
            }
        }
    }
    catch (err)
    {
        file_log(`getUser (${forStreamer}) Error:`, err);
        if (err.type == "invalid_grant")
            throw err
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "getUser", "ERROR: getUser err:", err);
        throw err;
    }
}
// ============================================================================
//                           FUNCTION: getChannelsWithToken
// ============================================================================
function getChannelsWithToken (token)
{
    file_log(`######## getChannelsWithToken (token) ##############`, token);
    return new Promise((resolve, reject) =>
    {
        const options = {
            hostname: 'api.kick.com',
            path: '/public/v1/channels',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        };

        const req = https.request(options, (res) =>
        {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', location: 'getChannelsWithToken', message: data });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannelsWithToken", "ERROR:", e);
                        reject({ type: 'getChannelsWithToken: parse_error', location: 'getChannelsWithToken', message: e });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannelsWithToken", "ERROR:", err);
            reject({ type: 'getChannelsWithToken: request_error', location: 'getChannelsWithToken', message: err });
        });

        req.end();
    });
}
// ============================================================================
//                           FUNCTION: getChannel
// ============================================================================
/**
 * get the channel data for the currently logged in streamer
 */
async function getChannel ()
{
    file_log(`######## getChannel () ##############`);
    try
    {
        //if (!checkCredentials())
        // return;
        try
        {
            const data = await getChannelsWithToken(Credentials.kickAccessToken);
            return data;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {

                // Token likely expired
                let response = await refreshToken();
                try
                {
                    const data = await getChannelsWithToken(Credentials.kickAccessToken);
                    return data;
                } catch (err2)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Still failed after refresh:", err2);
                }
            } else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Request failed:", err);
            }
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Request failed:", err);
    }
}
// this link is provide by oxRetroDev on discord.
// https://api.stream-stuff.com/kick/channels/USERNAME
// ============================================================================
//                           FUNCTION: getLivestreamsWithToken
// ============================================================================
/**
 * 
 * @param {string} username 
 * @returns object
 */
function getChannelData (username)
{
    file_log(`######## getChannelData (${username}) ##############`);
    return new Promise((resolve, reject) =>
    {
        const options = {
            //hostname: 'api.kick.com',
            hostname: 'api.stream-stuff.com',
            path: `/kick/channels/${username}`,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        };

        const req = https.request(options, (res) =>
        {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannelData", res.statusCode, res.statusMessage, data);
                    reject({ type: 'Unauthorized', location: 'getChannelData', message: data });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannelData", "parse_error:", e);
                        reject({ type: 'parse_error', location: 'getChannelData', message: e });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "getChannelData", "request_error:", err);
            reject({ type: 'request_error', message: err, location: 'getChannelData' });
        });

        req.end();
    });
}
// ============================================================================
//                           FUNCTION: getLivestreamsWithToken
// ============================================================================
/**
 * 
 * @param {string} userId // userid
 * @returns livestream object
 */
function getLivestreamsWithToken (userId)
{
    file_log(`######## getLivestreamsWithToken (${userId}) ##############`);
    return new Promise((resolve, reject) =>
    {
        const queryParams = new URLSearchParams({
            broadcaster_user_id: userId
        }).toString();
        const options = {
            hostname: 'api.kick.com',
            path: `/public/v1/livestreams?${queryParams}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Credentials.kickAccessToken}`,
                'Accept': '*/*'
            }
        };
        const req = https.request(options, (res) =>
        {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    file_log(`getLivestreamsWithToken (${userId}) res.statusCode:${res.statusCode}, res.statusMessage:${res.statusMessage}`);
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "401:Unauthorized:");
                    reject({ type: 'Unauthorized', location: 'getChannelData', message: data });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        file_log(`getLivestreamsWithToken (${userId}) parse_error:`, e);
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "parse_error:", e);
                        reject({ type: 'parse_error', location: 'getChannelData', message: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            file_log(`getLivestreamsWithToken (${userId}) request_error:`, err);
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "request_error:", err);
            reject({ type: 'request_error', location: 'getChannelData', message: err });
        });

        req.end();
    });
}
// ============================================================================
//                           FUNCTION: getLivestream
// ============================================================================
/**
 * 
 * @param {string} userId 
 * @returns livestream object
 */
async function getLivestream (userId)
{
    file_log(`######## getLivestream (${userId}) ##############`);
    try
    {
        if (!checkCredentials())
            return;
        try
        {
            const data = await getLivestreamsWithToken(userId);
            return data;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {

                // Token likely expired
                let response = await refreshToken();
                try
                {
                    const data = await getLivestreamsWithToken(userId);
                    return data;
                } catch (err2)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Still failed after refresh:", err2);
                }
            } else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Request failed:", err);
            }
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Error:", err);
    }
}

// ============================================================================
//                           FUNCTION: sendChatMessageWithToken
// ============================================================================
/**
 * 
 * @param {object} messageData {account : "bot|user", message : "message"}
 * @param {string} token kick access token
 * @returns promise
 */
async function sendChatMessageWithToken (messageData, token)
{
    file_log(`######## sendChatMessageWithToken (${messageData.message},token) ##############`, token);
    return new Promise((resolve, reject) =>
    {
        // lets pre-parse the message for kick specifically
        let message = messageData.message;
        // truncate message if longer than the chat API can handle
        if (messageData.message.length > localConfig.maxChatMessageLength)
            message = message.substring(0, localConfig.maxChatMessageLength - 4) + "...";
        message = message.replace(/\p{Emoji_Presentation}/gu, '');
        // need to figure out a way for users to specify different emotes for different platforms.
        message = message.replaceAll('olddepMarv ', "[emote:3626103:olddepressedgamerMarv]");
        let postData = JSON.stringify({
            broadcaster_user_id: Credentials.userId,
            content: message.toString(),
            type: "user"
        });
        const options = {
            hostname: 'api.kick.com',
            path: '/public/v1/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': postData.length
            },
        };

        const req = https.request(options, (res) =>
        {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () =>
            {
                /*console.log("res", res.statusCode, res.statusMessage)
                console.log("responseData", responseData)
                console.log("postData", postData)*/

                if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', location: 'sendChatMessageWithToken', message: responseData });
                }
                else if (res.statusCode === 200)
                    resolve("Message Sent ")
                else
                {
                    file_log(`sendChatMessageWithToken,error (${messageData.message})`,
                        { type: res.statusCode, location: 'sendChatMessageWithToken', message: responseData });
                    reject({ type: res.statusCode, location: 'sendChatMessageWithToken', message: responseData })
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: "error", location: 'sendChatMessageWithToken', message: err });
        });

        req.write(postData);
        req.end();
    });
}
// ============================================================================
//                           FUNCTION: sendChatMessage
// ============================================================================
/**
 * 
 * @param {object} messageData {account : "bot|user", message : "message"}
 * @returns response from kick or null
 */
async function sendChatMessage (messageData)
{
    file_log('######## sendChatMessage (messageData) ##############', messageData);
    //”Dog Days are Over”
    try
    {
        /*
        if (!checkCredentials(true))
        {
            console.log("sendChatMessage Invalid credentials")
            return null;
        }*/
        try
        {
            let response = "Message Not sent"
            if (messageData.account == "user")
            {
                if (Credentials.kickAccessToken && Credentials.kickAccessToken != "")
                    response = await sendChatMessageWithToken(messageData, Credentials.kickAccessToken);
            }
            else if (messageData)
            {
                if (Credentials.kickAccessToken && Credentials.kickBotAccessToken != "")
                    response = await sendChatMessageWithToken(messageData, Credentials.kickBotAccessToken);
            }
            return response;

        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {

                // Token likely expired
                let refreshResponse = {};
                if (messageData.account == "user")
                    refreshResponse = await refreshToken();
                else (messageData.account == "bot")
                refreshResponse = await refreshToken(false);

                try
                {
                    let response = null;
                    if (messageData.account == "user")
                        response = await sendChatMessageWithToken(messageData, Credentials.kickAccessToken);
                    else if (messageData)
                        response = await sendChatMessageWithToken(messageData, Credentials.kickBotAccessToken);
                    return response;
                } catch (err2)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Still failed after refresh", err2);
                    return null;
                }
            } else
            {
                if (err.type == "400")
                {
                    console.log("failed to send message, retrying")
                    if (localConfig.attemptCounter++ < localConfig.retryCounter)
                    {
                        //sometimes these fail for no apparent reason but are fine after a second request.
                        setTimeout(() =>
                        {
                            try
                            {
                                sendChatMessage(messageData)
                                    .then(() =>
                                    {
                                        localConfig.attemptCounter = 0
                                    })
                            }
                            catch (err)
                            {
                                logger.warn(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Request failed on retry", err);
                            }
                        }, 10000)
                    }
                    else
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Request failed, to many retries", err);
                    return null;

                }
                logger.err(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Request failed", err);
                return null;
            }
        }
    }
    catch (err)
    {
        if (err.type == "invalid_grant")
            throw err
        else
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage:ERROR", err);
    }
}
// ============================================================================
//                           FUNCTION: setTitleAndCategoryWithToken
// ============================================================================
/**
 * 
 * @param {string} title 
 * @param {number} categoryId 
 * @param {string} token kick access token
 * @returns promise
 */
async function setTitleAndCategoryWithToken (title, categoryId, token)
{
    file_log(`######## setTitleAndCategoryWithToken (${title},${categoryId},token) ##############`, token);
    return new Promise((resolve, reject) =>
    {
        let postData = JSON.stringify({
            category_id: categoryId,
            stream_title: title,
        });

        const options = {
            hostname: 'api.kick.com',
            path: '/public/v1/channels',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(postData)
            },
        };
        const req = https.request(options, (res) =>
        {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', location: 'setTitleAndCategoryWithToken', data: responseData });
                }
                else if (res.statusCode === 204)
                    resolve("Channel title and Category Updated ")
                else
                    reject({ code: res.statusCode, message: responseData, location: 'setTitleAndCategoryWithToken' })
            });
        });

        req.on('error', (err) =>
        {
            reject({ err: err, location: 'setTitleAndCategoryWithToken' });
        });

        req.write(postData);
        req.end();
    });
}
// ============================================================================
//                           FUNCTION: setTitleAndCategory
// ============================================================================
/**
 * 
 * @param {string} title 
 * @param {number} categoryId 
 * @returns object
 */
async function setTitleAndCategory (title, categoryId)
{
    file_log(`######## setTitleAndCategory (${title},${categoryId}) ##############`);
    try
    {
        /*
        if (!checkCredentials(true))
        {
            console.log("setTitleAndCategory Invalid credentials")
            return null;
        }*/
        try
        {
            const response = await setTitleAndCategoryWithToken(title, categoryId, Credentials.kickAccessToken);
            return response;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {
                // Token likely expired
                let refreshResponse = await refreshToken();
                try
                {
                    const response = await setTitleAndCategoryWithToken(title, categoryId, Credentials.kickAccessToken);
                    return response;
                } catch (err2)
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + "setTitleAndCategory", "Still failed after refresh", err2);
                    return null;
                }
            } else
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + "setTitleAndCategory", "Request failed", err);
                return null;
            }
        }
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + "setTitleAndCategory", "ERROR", err);
        return null;
    }
}
// ============================================================================
//                           FUNCTION: searchCategoriesWithToken
// ============================================================================
/**
 * 
 * @param {string} categoryName 
 * @returns promise
 */
async function searchCategoriesWithToken (categoryName)
{
    file_log(`######## searchCategoriesWithToken (${categoryName}) ##############`);
    return new Promise((resolve, reject) =>
    {
        let responseData = '';
        const queryParams = new URLSearchParams({
            q: categoryName
        }).toString();

        const options = {
            hostname: 'api.kick.com',
            path: `/public/v1/categories?${queryParams}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Credentials.kickAccessToken}`,
                'Accept': '*/*'
            },
        };


        const req = https.request(options, (res) =>
        {
            res.on('data', (chunk) =>
            {
                responseData += chunk;
            });
            res.on('end', () =>
            {
                if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', location: 'searchCategoriesWithToken', data: responseData });
                }
                else if (res.statusCode === 200)
                    resolve(JSON.parse(responseData))
                else
                    reject({ code: res.statusCode, location: 'searchCategoriesWithToken', data: responseData })
            });
        });

        req.on('error', (err) =>
        {
            reject(err);
        });

        req.write(responseData);
        req.end();
    });
}
// ============================================================================
//                           FUNCTION: searchCategories
// ============================================================================
/**
 * 
 * @param {number} categoryName 
 * @returns object
 */
async function searchCategories (categoryName)
{
    file_log(`######## searchCategories (${categoryName}) ##############`);
    return new Promise((resolve, reject) =>
    {
        /*
        if (!checkCredentials(true))
        {
            console.log("searchCategories Invalid credentials")
            return null;
        }*/
        try
        {
            searchCategoriesWithToken(categoryName)
                .then((response) =>
                {
                    resolve(response);
                })
                .catch((err) =>
                {
                    if (err.type === 'Unauthorized')
                    {
                        // Token likely expired
                        refreshToken()
                            .then((refreshResponse) =>
                            {

                                searchCategoriesWithToken(categoryName)
                                    .then((response) =>
                                    {
                                        resolve(response);
                                    })
                                    .catch((err) =>
                                    {
                                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "searchCategories", "failed call to searchCategoriesWithToken after refresh", err);
                                        reject("failed to call searchCategoriesWithToken after refresh", err)
                                    })

                            })
                            .catch((err) =>
                            {
                                logger.err(localConfig.SYSTEM_LOGGING_TAG + "searchCategories", "failed to get refresh tokens", err);
                                reject("failed to get refresh tokens", err)
                            })
                    } else
                    {
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + "searchCategories", " Request failed", err);
                        reject("failed");
                    }
                })
        }
        catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + "searchCategories", "Error", err);
            reject("failed");
        }
    });
}
// ============================================================================
//                           FUNCTION: file_log
//                       For debug purposes. logs raw message data
// ============================================================================
import fs from 'fs'
let basedir = "chatdata/";
let fileHandle = null;
let startup = true;
async function file_log (userMessage, data = "")
{
    if (!localConfig.DEBUG)
        return
    let message = userMessage
    try
    {

        var filename = "kickAPIRefreshTestLog.js";
        var buffer = "";
        if (!fs.existsSync(basedir))
            fs.mkdirSync(basedir, { recursive: true });

        // check if we already have this handler
        if (!fileHandle)
            fileHandle = await fs.createWriteStream(basedir + "/" + filename, { flags: 'a' });

        if (startup)
        {
            startup = false;
            buffer = "/* ################# startup ######################### */\n"
        }
        buffer += "message='" + message + "'\n"
        if (typeof data != "object")
            buffer += "data='" + data + "'\n"
        else
        {
            if (typeof data.data == "string")
                data.data = JSON.parse(data.data)
            // this will handle the nested objects that are already stringified
            data = JSON.stringify(data)
            buffer += "data=" + data + "\n"
        }

        fileHandle.write(buffer);
        //bad coding but can't end it here (due to async stuff) and it is just debug code (just left as a reminder we have a dangling pointer)
        //fileHandle.end("")

    }
    catch (error)
    {
        console.log("debug file logging crashed", error.message)
    }
}
export { init, setCredentials, getUser, getChannel, getLivestream, getChannelData, sendChatMessage, setTitleAndCategory, searchCategories };