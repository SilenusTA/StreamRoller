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
        if (log) console.log("Kick: Missing Access token")
        returnValue = false;
    }
    if (Credentials.kickRefreshToken == undefined
        || Credentials.kickRefreshToken == "")
    {
        if (log) console.log("Kick: Missing refresh token")
        returnValue = false;
    }
    return returnValue;
}
// ============================================================================
//                           FUNCTION: refreshToken
// ============================================================================
/**
 * 
 * @param {string} clientId 
 * @param {object} Credentials 
 * @returns access token or Error
 */
function refreshToken ()
{
    console.log("############### refreshToken ##################", Credentials)
    return new Promise((resolve, reject) =>
    {
        const postData = querystring.stringify({
            refresh_token: Credentials.kickRefreshToken,
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
                            console.log('🔑 New token received!', parsed);
                            resolve(parsed);
                        } else
                        {
                            reject(new Error('No access_token in response'));
                        }
                    } catch (e)
                    {
                        console.log("refreshToken: err.type", e.type)
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
 * only really need the details from the signed in user so no need to pass any user details
 * the api will return the details for the token's user
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
                    console.log("ERROR: getUsersWithToken: ", res.statusCode)
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
 * gets the user details for the currently logged in user
 */
async function getUser ()
{
    try
    {
        if (!checkCredentials())
            return;
        try
        {
            const data = await getUsersWithToken(Credentials.kickAccessToken);
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
                    const data = await getUsersWithToken(Credentials.kickAccessToken);
                    return data;
                } catch (err2)
                {
                    console.error('❌ getUser: Still failed after refresh:', err2);
                }
            } else
            {
                console.error('❌getUser: Request failed:', err);
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
 * get the channel data for the currently logged in user
 */
async function getChannel ()
{
    try
    {
        if (!checkCredentials())
            return;
        try
        {
            const data = await getChannelsWithToken(Credentials.kickAccessToken);
            return data;
        } catch (err)
        {
            console.log("ERROR: getChannel: Failed will try refresh ", err.type)
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
                    console.error('❌ ERROR: getChannel Still failed after refresh:', err2);
                }
            } else
            {
                console.error('❌ ERROR: getChannel Request failed:', err);
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
//                           FUNCTION: getLivestreamsWithToken
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
            //console.log('✅ getLivestreamsWithToken: Success:', data);
            return data;
        } catch (err)
        {
            console.log("ERROR: getLivestreamsWithToken: Failed will try refresh ", err.type)
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
                    //console.log('✅ getLivestreamsWithToken: Success after refresh:', data);
                    return data;
                } catch (err2)
                {
                    console.error('❌ ERROR: getLivestreamsWithToken Still failed after refresh:', err2);
                }
            } else
            {
                console.error('❌ ERROR: getLivestreamsWithToken Request failed:', err);
            }
        }
    }
    catch (err)
    {
        console.log("ERROR: getLivestreamsWithToken:", err)
    }
}
export { init, setCredentials, getUser, getChannel, getLivestream, getChannelData };