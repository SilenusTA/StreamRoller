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
import { Buffer } from 'buffer';
import https from 'https';
import * as querystring from 'querystring';
import * as logger from "../../../backend/data_center/modules/logger.js";
const localConfig = {
    SYSTEM_LOGGING_TAG: '[KickAPIs.js]',
    maxChatMessageLength: 500,
    retryCounter: 2,
    attemptCounter: 0,
    DEBUG: false,
};

let callbacks = { updateRefreshTokenFn: null };
let Credentials = {};
// ============================================================================
//                           FUNCTION: init
// ============================================================================
/**
 * 
 * @param {function} updateRefreshTokenFn 
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
 * @param {object} creds 
 */
function setCredentials (creds)
{
    Credentials = structuredClone(creds);
}
// ============================================================================
//                           FUNCTION: init
// ============================================================================
/**
 * 
 * @param {object} param { hostname, path, method, headers, data }
 * @returns Promise
 */
function makeRequest ({ hostname, path, method = 'GET', headers = {}, data = null })
{
    return new Promise((resolve, reject) =>
    {
        const req = https.request({ hostname, path, method, headers }, (res) =>
        {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () =>
            {
                if (res.statusCode >= 200 && res.statusCode < 300)
                {
                    try
                    {
                        resolve((body) ? JSON.parse(body) : {});
                    } catch (e)
                    {
                        reject({ type: 'parse_error', message: e.message, body });
                    }
                } else if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', statusCode: res.statusCode, body });
                } else
                {
                    reject({ type: 'error', statusCode: res.statusCode, body });
                }
            });
        });
        req.on('error', (err) => reject({ type: 'request_error', message: err }));
        if (data) req.write(data);
        req.end();
    });
}
// ============================================================================
//                           FUNCTION: buildTokenPayload
// ============================================================================
/**
 * 
 * @param {string} refreshToken 
 * @returns object
 */
function buildTokenPayload (refreshToken)
{
    return querystring.stringify({
        refresh_token: refreshToken,
        client_id: Credentials.kickApplicationClientId,
        client_secret: Credentials.kickApplicationSecret,
        grant_type: 'refresh_token',
    });
}
// ============================================================================
//                           FUNCTION: refreshToken
// ============================================================================
/**
 * 
 * @param {boolean} forStreamer 
 */
async function refreshToken (forStreamer = true)
{
    const refreshToken = forStreamer ? Credentials.kickRefreshToken : Credentials.kickBotRefreshToken;
    const postData = buildTokenPayload(refreshToken);

    try
    {
        const response = await makeRequest({
            hostname: 'id.kick.com',
            path: '/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
            data: postData,
        });

        const { access_token, refresh_token } = response;
        if (!access_token) throw new Error('No access token in response');

        if (forStreamer)
        {
            Credentials.kickAccessToken = access_token;
            Credentials.kickRefreshToken = refresh_token;
            callbacks.updateRefreshTokenFn?.('kickAccessToken', access_token);
            callbacks.updateRefreshTokenFn?.('kickRefreshToken', refresh_token);
        } else
        {
            Credentials.kickBotAccessToken = access_token;
            Credentials.kickBotRefreshToken = refresh_token;
            callbacks.updateRefreshTokenFn?.('kickBotAccessToken', access_token);
            callbacks.updateRefreshTokenFn?.('kickBotRefreshToken', refresh_token);
        }
    } catch (err)
    {
        if (err.body && JSON.parse(err.body)?.error === 'invalid_grant')
        {
            throw { type: 'invalid_grant', message: 'Reauthorization required', location: `refreshToken(${forStreamer})` };
        }
        throw { type: 'refresh_failed', message: 'Token refresh failed', details: err };
    }
}
// ============================================================================
//                           FUNCTION: withAuthRetry
// ============================================================================
/**
 * 
 * @param {function} fn 
 * @param {boolean} forStreamer 
 * @returns object from function
 */
async function withAuthRetry (fn, forStreamer = true)
{
    try
    {
        return await fn();
    } catch (err)
    {
        if (err.type === 'Unauthorized')
        {
            await refreshToken(forStreamer);
            return await fn();
        }
        throw err;
    }
}
// ============================================================================
//                           FUNCTION: authorizedGet
// ============================================================================
/**
 * 
 * @param {object} path 
 * @param {boolean} forStreamer 
 * @returns Promise
 */
function authorizedGet (path, forStreamer = true)
{
    const token = forStreamer ? Credentials.kickAccessToken : Credentials.kickBotAccessToken;
    return makeRequest({
        hostname: 'api.kick.com',
        path,
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
}
// ============================================================================
//                           FUNCTION: getUser
// ============================================================================
/**
 * 
 * @param {boolean} forStreamer 
 * @returns Promise
 */
const getUser = (forStreamer = true) => withAuthRetry(() => authorizedGet('/public/v1/users', forStreamer), forStreamer);
// ============================================================================
//                           FUNCTION: getChannel
// ============================================================================
/**
 * 
 * @returns Promise
 */
const getChannel = () => withAuthRetry(() => authorizedGet('/public/v1/channels'));
// ============================================================================
//                           FUNCTION: getLivestream
// ============================================================================
/**
 * 
 * @param {string} userId 
 * @returns Promise
 */
const getLivestream = (userId) => withAuthRetry(() =>
    makeRequest({
        hostname: 'api.kick.com',
        path: `/public/v1/livestreams?broadcaster_user_id=${userId}`,
        headers: { Authorization: `Bearer ${Credentials.kickAccessToken}`, Accept: '*/*' },
    })
);
// ============================================================================
//                           FUNCTION: sendChatMessage
// ============================================================================
/**
 * 
 * @param {*} messageData 
 * @returns Promise
 */
async function sendChatMessage (messageData)
{
    if (!messageData.message || messageData.message == "")
        return;
    const token = messageData.account === 'user' ? Credentials.kickAccessToken : Credentials.kickBotAccessToken;
    let message = messageData.message
        .replace(/\p{Emoji_Presentation}/gu, '')
        .replaceAll('olddepMarv ', '[emote:3626103:olddepressedgamerMarv]');// temp fix. need to get emojis working
    // remove html
    message = sanitiseHTML(message);
    if (message.byteLength > localConfig.maxChatMessageLength - 4)
        message = message.slice(0, localConfig.maxChatMessageLength - 4) + "..."
    const postData = JSON.stringify({ broadcaster_user_id: Credentials.userId, content: message, type: 'user' });
    return withAuthRetry(() =>
        makeRequest({
            hostname: 'api.kick.com',
            path: '/public/v1/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Length': Buffer.byteLength(postData),
            },
            data: postData,
        })
    );
}
// ============================================================================
//                           FUNCTION: authorizedGet
// ============================================================================
/**
 * 
 * @param {string} title 
 * @param {number} categoryId 
 * @returns Promise
 */
async function setTitleAndCategory (title, categoryId)
{
    const postData = JSON.stringify({ category_id: categoryId, stream_title: title });
    return withAuthRetry(() =>
        makeRequest({
            hostname: 'api.kick.com',
            path: '/public/v1/channels',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Credentials.kickAccessToken}`,
                'Content-Length': Buffer.byteLength(postData),
            },
            data: postData,
        })
    );
}
// ============================================================================
//                           FUNCTION: authorizedGet
// ============================================================================
/**
 * 
 * @param {string} categoryName 
 * @returns Promise
 */
async function searchCategories (categoryName)
{
    return withAuthRetry(() =>
        authorizedGet(`/public/v1/categories?q=${encodeURIComponent(categoryName)}`)
    );
}
// ============================================================================
//                           FUNCTION: authorizedGet
// ============================================================================
/**
 * 
 * @param {string} username 
 * @returns Promise
 */
async function getChannelData (username)
{
    return makeRequest({
        hostname: 'api.stream-stuff.com',
        path: `/kick/channels/${username}`,
        headers: { Accept: 'application/json' },
    });
}
// #######################################################################
// ######################### sanitiseHTML ################################
// #######################################################################
/**
 * Removes html chars from a string to avoid chat message html injection
 * @param {string} string 
 * @returns {string} the parsed string
 */
function sanitiseHTML (string)
{
    // sanitiser
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s)
    {
        return entityMap[s];
    });
}
export { init, setCredentials, getUser, getChannel, getLivestream, getChannelData, sendChatMessage, setTitleAndCategory, searchCategories };