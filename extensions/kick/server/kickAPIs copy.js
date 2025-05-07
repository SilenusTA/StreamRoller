import https from 'https';
import { Buffer } from 'buffer';
import * as querystring from 'querystring';
const localConfig =
{
    SYSTEM_LOGGING_TAG: "[KickAPIs.js]",
    maxChatMessageLength: 500,
    retryCounter: 2,
    attemptCounter: 0,
    DEBUG: false
}
const callbacks =
{
    updateRefreshTokenFn: null
}
let Credentials = {};
function init (updateRefreshTokenFn)
{
    callbacks.updateRefreshTokenFn = updateRefreshTokenFn;
}
function setCredentials (creds)
{
    Credentials = structuredClone(creds);
}
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
                            if (forStreamer)
                            {
                                Credentials.kickAccessToken = parsed.access_token;
                                callbacks.updateRefreshTokenFn("kickAccessToken", parsed.access_token)
                                Credentials.kickRefreshToken = parsed.refresh_token;
                                callbacks.updateRefreshTokenFn("kickRefreshToken", parsed.access_token)
                            }
                            else
                            {
                                Credentials.kickBotAccessToken = parsed.access_token;
                                callbacks.updateRefreshTokenFn("kickBotAccessToken", parsed.access_token)
                                Credentials.kickBotRefreshToken = parsed.refresh_token;
                                callbacks.updateRefreshTokenFn("kickBotRefreshToken", parsed.access_token)
                            }
                            resolve({ type: "success", location: `refreshToken(${forStreamer})` });
                        } else
                        {
                            reject({ type: "no_access_token_returned", location: `refreshToken(${forStreamer})`, message: "you may need to re-authorize, API is still a work in progress and refreshing tokens needs a fix sorry" });
                        }
                    } catch (e)
                    {
                        reject({ type: "error_parsing_refresh_token", location: `refreshToken(${forStreamer})`, message: "you may need to re-authorize, API is still a work in progress and refreshing tokens needs a fix sorry" });
                    }
                }
                else if (res.statusCode == 401)
                {
                    let errordata = JSON.parse(data)
                    if (errordata.error == "invalid_grant")
                        reject({ type: "invalid_grant", location: `refreshToken(${(forStreamer) ? "user" : "bot"})`, message: "you may need to re-authorize, API is still a work in progress and refreshing tokens needs a fix sorry" });
                    else
                        reject({ type: "refresh_failed", location: `refreshToken(${forStreamer})`, message: "you may need to re-authorize, API is still a work in progress and refreshing tokens needs a fix sorry" });
                }
                else
                {
                    reject({
                        type: res.statusMessage, location: `refreshToken(${forStreamer})`, message: `Token refresh failed with status ${res.statusCode}`
                    });
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: "invalid_grant", location: `refreshToken(${forStreamer})`, message: err });
        });

        req.write(postData);
        req.end();
    });
}
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
                    reject({ type: 'Unauthorized', location: 'getUsersWithToken', message: 'possible refresh needed' });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        reject({ type: 'parse_error', location: 'getUsersWithToken', message: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getUsersWithToken:request_error', location: 'getUsersWithToken', message: err });
        });

        req.end();
    });
}
async function getUser (forStreamer)
{
    try
    {
        try
        {
            let data = null;
            if (forStreamer)
                data = await getUsersWithToken(Credentials.kickAccessToken);
            else
                data = await getUsersWithToken(Credentials.kickBotAccessToken);
            return data;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {
                try
                {
                    const response = await refreshToken(forStreamer);
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
                        console.log(localConfig.SYSTEM_LOGGING_TAG + "getUser", "Still failed after refresh err2:", err2);
                        throw err2;
                    }
                } catch (err)
                {
                    // failed refresh
                    if (err.type == "invalid_grant")
                        throw err
                    console.log(localConfig.SYSTEM_LOGGING_TAG + `getUser (${forStreamer})`, "failed to refresh:", err);

                }
            } else
            {
                console.log(localConfig.SYSTEM_LOGGING_TAG + "getUser", "Request failed err:", err);
                throw err;
            }
        }
    }
    catch (err)
    {
        if (err.type == "invalid_grant")
            throw err
        else
            console.log("getUser", "ERROR: getUser err:", err);
        throw err;
    }
}
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
                    reject({ type: 'Unauthorized', location: 'getChannelsWithToken', message: data });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        reject({ type: 'getChannelsWithToken: parse_error', location: 'getChannelsWithToken', message: e });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'getChannelsWithToken: request_error', location: 'getChannelsWithToken', message: err });
        });

        req.end();
    });
}
async function getChannel ()
{
    try
    {
        try
        {
            const data = await getChannelsWithToken(Credentials.kickAccessToken);
            return data;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {
                let response = await refreshToken();
                try
                {
                    const data = await getChannelsWithToken(Credentials.kickAccessToken);
                    return data;
                } catch (err2)
                {
                    console.log(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Still failed after refresh:", err2);
                }
            } else
            {
                console.log(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Request failed:", err);
            }
        }
    }
    catch (err)
    {
        console.log(localConfig.SYSTEM_LOGGING_TAG + "getChannel", "Request failed:", err);
    }
}
function getChannelData (username)
{
    return new Promise((resolve, reject) =>
    {
        const options = {
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
                    reject({ type: 'Unauthorized', location: 'getChannelData', message: data });
                else
                {
                    try
                    {
                        resolve(JSON.parse(data));

                    } catch (e)
                    {
                        reject({ type: 'parse_error', location: 'getChannelData', message: e });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'request_error', message: err, location: 'getChannelData' });
        });
        req.end();
    });
}
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
                    reject({ type: 'Unauthorized', location: 'getChannelData', message: data });
                } else
                {
                    try
                    {
                        resolve(JSON.parse(data));
                    } catch (e)
                    {
                        reject({ type: 'parse_error', location: 'getChannelData', message: data });
                    }
                }
            });
        });

        req.on('error', (err) =>
        {
            reject({ type: 'request_error', location: 'getChannelData', message: err });
        });

        req.end();
    });
}
async function getLivestream (userId)
{
    try
    {
        try
        {
            const data = await getLivestreamsWithToken(userId);
            return data;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {
                let response = await refreshToken();
                try
                {
                    const data = await getLivestreamsWithToken(userId);
                    return data;
                } catch (err2)
                {
                    console.log(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Still failed after refresh:", err2);
                }
            } else
            {
                console.log(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Request failed:", err);
            }
        }
    }
    catch (err)
    {
        console.log(localConfig.SYSTEM_LOGGING_TAG + "getLivestreamsWithToken", "Error:", err);
    }
}
async function sendChatMessageWithToken (messageData, token)
{
    return new Promise((resolve, reject) =>
    {
        let message = messageData.message;
        if (messageData.message.length > localConfig.maxChatMessageLength)
            message = message.substring(0, localConfig.maxChatMessageLength - 4) + "...";
        message = message.replace(/\p{Emoji_Presentation}/gu, '');
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
                if (res.statusCode === 401)
                {
                    reject({ type: 'Unauthorized', location: 'sendChatMessageWithToken', message: responseData });
                }
                else if (res.statusCode === 200)
                    resolve("Message Sent ")
                else
                {
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
async function sendChatMessage (messageData)
{
    try
    {
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
                    return null;
                }
            } else
            {
                if (err.type == "400")
                {
                    if (localConfig.attemptCounter++ < localConfig.retryCounter)
                    {
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
                        console.log(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Request failed, to many retries", err);
                    return null;

                }
                console.log(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage", "Request failed", err);
                return null;
            }
        }
    }
    catch (err)
    {
        if (err.type == "invalid_grant")
            throw err
        else
            console.log(localConfig.SYSTEM_LOGGING_TAG + "sendChatMessage:ERROR", err);
    }
}
async function setTitleAndCategoryWithToken (title, categoryId, token)
{
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
async function setTitleAndCategory (title, categoryId)
{
    try
    {
        try
        {
            const response = await setTitleAndCategoryWithToken(title, categoryId, Credentials.kickAccessToken);
            return response;
        } catch (err)
        {
            if (err.type === 'Unauthorized')
            {
                let refreshResponse = await refreshToken();
                try
                {
                    const response = await setTitleAndCategoryWithToken(title, categoryId, Credentials.kickAccessToken);
                    return response;
                } catch (err2)
                {
                    return null;
                }
            } else
            {
                return null;
            }
        }
    }
    catch (err)
    {
        return null;
    }
}
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
async function searchCategories (categoryName)
{
    return new Promise((resolve, reject) =>
    {
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
                                        reject("failed to call searchCategoriesWithToken after refresh", err)
                                    })

                            })
                            .catch((err) =>
                            {
                                reject("failed to get refresh tokens", err)
                            })
                    } else
                    {
                        reject("failed");
                    }
                })
        }
        catch (err)
        {
            reject("failed");
        }
    });
}
export { init, setCredentials, getUser, getChannel, getLivestream, getChannelData, sendChatMessage, setTitleAndCategory, searchCategories };