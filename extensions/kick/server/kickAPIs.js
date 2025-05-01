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
 * @param {boolean} forStreamer are we refreshing the streamer or bot token
 * @returns tokens
 */
function refreshToken (forStreamer = true)
{
    return new Promise((resolve, reject) =>
    {
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
                if (res.statusCode >= 200 && res.statusCode < 300)
                {
                    try
                    {
                        const parsed = JSON.parse(data);
                        if (parsed.access_token)
                        {
                            resolve(parsed);
                        } else
                        {
                            reject(new Error('No access_token in response'));
                        }
                    } catch (e)
                    {
                        reject(new Error('Failed to parse token response'));
                    }
                } else
                {
                    reject(new Error(`Token refresh failed with status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (err) =>
        {
            reject(err);
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
                    reject({ type: 'unauthorized' });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        console.log("ERROR: getUsersWithToken: err.type", e.type)
                        reject({ type: 'parse_error', raw: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getUsersWithToken:request_error', error: err });
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
    try
    {
        checkCredentials()
        //if (!checkCredentials())
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
            if (err.type === 'unauthorized')
            {
                // Token likely expired
                let tokens = null;
                tokens = await refreshToken(forStreamer);
                if (forStreamer)
                {
                    Credentials.kickAccessToken = tokens.access_token;
                    Credentials.kickRefreshToken = tokens.refresh_token;
                }
                else
                {
                    Credentials.kickBotAccessToken = tokens.access_token;
                    Credentials.kickBotRefreshToken = tokens.refresh_token;
                }
                callbacks.updateRefreshTokenFn(Credentials);
                try
                {
                    let data = null;
                    if (forStreamer)
                        data = await getUsersWithToken(Credentials.kickAccessToken);
                    else
                        data = await getUsersWithToken(Credentials.kickBotAccessToken);
                    return data;
                } catch (err2)
                {
                    console.log('❌ getUser: Still failed after refresh:', err2);
                }
            } else
            {
                console.log('❌getUser: Request failed:', err);
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: getUser:", err)
    }
}
// ============================================================================
//                           FUNCTION: getChannelsWithToken
// ============================================================================
function getChannelsWithToken (token)
{
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
                    reject({ type: 'getChannelsWithToken: unauthorized' });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        console.log("ERROR: getChannelsWithToken: err.type", e.type)
                        reject({ type: 'getChannelsWithToken: parse_error', raw: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getChannelsWithToken: request_error', error: err });
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
            if (err.type === 'unauthorized')
            {

                // Token likely expired
                let tokens = await refreshToken();
                Credentials.kickAccessToken = tokens.access_token
                Credentials.kickRefreshToken = tokens.refresh_token
                callbacks.updateRefreshTokenFn(Credentials)
                try
                {
                    const data = await getChannelsWithToken(Credentials.kickAccessToken);
                    return data;
                } catch (err2)
                {
                    console.log('❌ ERROR: getChannel Still failed after refresh:', err2);
                }
            } else
            {
                console.log('❌ ERROR: getChannel Request failed:', err);
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: getChannel:", err)
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
 * @returns 
 */
function getChannelData (username)
{
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
                    reject({ type: 'getChannelData: unauthorized' });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        console.log("ERROR: getChannelData: err.type", e.type)
                        reject({ type: 'getChannelData: parse_error', raw: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getChannelData: request_error', error: err });
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
                    reject({ type: 'getLivestreamsWithToken: unauthorized' });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        console.log("ERROR: getLivestreamsWithToken: err.type", e.type)
                        reject({ type: 'getLivestreamsWithToken: parse_error', raw: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getLivestreamsWithToken: request_error', error: err });
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
            if (err.type === 'unauthorized')
            {

                // Token likely expired
                let tokens = await refreshToken();
                Credentials.kickAccessToken = tokens.access_token
                Credentials.kickRefreshToken = tokens.refresh_token
                callbacks.updateRefreshTokenFn(Credentials)
                try
                {
                    const data = await getLivestreamsWithToken(userId);
                    return data;
                } catch (err2)
                {
                    console.log('❌ ERROR: getLivestreamsWithToken Still failed after refresh:', err2);
                }
            } else
            {
                console.log('❌ ERROR: getLivestreamsWithToken Request failed:', err);
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: getLivestreamsWithToken:", err)
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
    return new Promise((resolve, reject) =>
    {
        let postData = JSON.stringify({
            broadcaster_user_id: Credentials.userId,
            content: messageData.message,
            type: messageData.account
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
                if (res.statusCode === 401)
                {
                    reject({ type: 'sendChatMessageWithToken: unauthorized' });
                }
                else if (res.statusCode === 200)
                    resolve("Message Sent ")
                else
                    reject({ code: res.statusCode, message: responseData })
            });
        });

        req.on('error', (err) =>
        {
            reject(err);
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
            const response = await sendChatMessageWithToken(messageData, Credentials.kickAccessToken);
            return response;
        } catch (err)
        {
            if (err.type === 'unauthorized')
            {
                // Token likely expired
                let tokens = await refreshToken();
                Credentials.kickAccessToken = tokens.access_token
                Credentials.kickRefreshToken = tokens.refresh_token
                callbacks.updateRefreshTokenFn(Credentials)
                try
                {
                    const response = await sendChatMessageWithToken(messageData, Credentials.kickAccessToken);
                    return response;
                } catch (err2)
                {
                    console.log('❌ ERROR: sendChatMessage Still failed after refresh:', err2);
                    return null;
                }
            } else
            {
                console.log('❌ ERROR: sendChatMessage Request failed:', err);
                return null;
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: sendChatMessage:", err)
        return null;
    }
}
// ============================================================================
//                           FUNCTION: setTitleAndCategoryWithToken
// ============================================================================
/**
 * 
 * @param {string} title 
 * @param {number} category 
 * @param {string} token kick access token
 * @returns promise
 */
async function setTitleAndCategoryWithToken (title, category, token)
{
    return new Promise((resolve, reject) =>
    {
        let postData = JSON.stringify({
            category_id: category,
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
                    reject({ type: 'setTitleAndCategoryWithToken: unauthorized' });
                }
                else if (res.statusCode === 204)
                    resolve("Channel title and Category Updated ")
                else
                    reject({ code: res.statusCode, message: responseData })
            });
        });

        req.on('error', (err) =>
        {
            reject(err);
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
 * @param {number} category 
 * @returns 
 */
async function setTitleAndCategory (title, category)
{
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
            const response = await setTitleAndCategoryWithToken(title, category, Credentials.kickAccessToken);
            return response;
        } catch (err)
        {
            if (err.type === 'unauthorized')
            {
                // Token likely expired
                let tokens = await refreshToken();
                Credentials.kickAccessToken = tokens.access_token
                Credentials.kickRefreshToken = tokens.refresh_token
                callbacks.updateRefreshTokenFn(Credentials)
                try
                {
                    const response = await setTitleAndCategoryWithToken(title, category, Credentials.kickAccessToken);
                    return response;
                } catch (err2)
                {
                    console.log('❌ ERROR: setTitleAndCategory Still failed after refresh:', err2);
                    return null;
                }
            } else
            {
                console.log('❌ ERROR: setTitleAndCategory Request failed:', err);
                return null;
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: setTitleAndCategory:", err)
        return null;
    }
}
// ============================================================================
//                           FUNCTION: searchCategoriesWithToken
// ============================================================================
/**
 * 
 * @param {string} title 
 * @param {number} category 
 * @param {string} token kick access token
 * @returns promise
 */
async function searchCategoriesWithToken (categoryName)
{
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
                    reject({ type: 'searchCategoriesWithToken: unauthorized' });
                }
                else if (res.statusCode === 200)
                    resolve(JSON.parse(responseData))
                else
                    reject({ code: res.statusCode, message: responseData })
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
 * @param {string} title 
 * @param {number} category 
 * @returns 
 */
async function searchCategories (categoryName)
{
    return new Promise((resolve, reject) =>
    {
        /*
        if (!checkCredentials(true))
        {
            console.log("sendChatMessage Invalid credentials")
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
                    reject("failed call to searchCategoriesWithToken", err)
                })
        } catch (err)
        {
            if (err.type === 'unauthorized')
            {
                // Token likely expired
                refreshToken()
                    .then((tokens) =>
                    {
                        Credentials.kickAccessToken = tokens.access_token
                        Credentials.kickRefreshToken = tokens.refresh_token
                        callbacks.updateRefreshTokenFn(Credentials)
                        searchCategoriesWithToken(categoryName)
                            .then((response) =>
                            {
                                resolve(response);
                            })
                            .catch((err) =>
                            {
                                reject("failed to call searchCategoriesWithToken after refresh", err)
                            })

                    })
                    .catch((err) =>
                    {
                        reject("failed to get refresh tokens", err)
                    })
            } else
            {
                console.log('❌ ERROR: searchCategoriesWithPage Request failed:', err);
                reject("failed");
            }
        }
    });
}

export { init, setCredentials, getUser, getChannel, getLivestream, getChannelData, sendChatMessage, setTitleAndCategory, searchCategories };