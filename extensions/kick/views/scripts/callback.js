/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
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
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
//for eslint highlighting

/*
    global
    host,port,sr_api
    tempStorage    
    $ 
*/
const localConfig =
{
    heartBeatTimeout: "6000",
    connected: false,
    DataCenterSocket: null,
    redirectURI: 'http://localhost:3000/kick',
    extensionsname: "kick"
}

window.addEventListener('load',
    function ()
    {
        ConnectToDataCenter(tempStorage.host, tempStorage.port);
    });
// ============================================================================
//                           FUNCTION: ConnectToDataCenter
// ============================================================================
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
    } catch (err)
    {
        console.log("datahandler.initialise", "DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    localConfig.connected = false;
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    updatePage()
    localConfig.connected = true;
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    // don't really need to process any messages, just here to send data back
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function storeCredentials (isStreamerAccount)
{
    // store this for next callback
    UpdateCredential("kickOAuthChallenge", tempStorage.kickOAuthChallenge)

    if (localConfig.connected && isStreamerAccount)
    {
        //streamer auth

        UpdateCredential("kickOAuthState", tempStorage.kickOAuthState);
        UpdateCredential("kickAccessToken", tempStorage.kickAccessToken);
        UpdateCredential("kickRefreshToken", tempStorage.kickRefreshToken);
        UpdateCredential("kickRefreshExpires", tempStorage.kickRefreshExpires);
    }
    if (localConfig.connected && !isStreamerAccount)
    {    //bot auth
        UpdateCredential("kickBotOAuthState", tempStorage.kickOAuthState);
        UpdateCredential("kickBotAccessToken", tempStorage.kickAccessToken);
        UpdateCredential("kickBotRefreshToken", tempStorage.kickRefreshToken);
        UpdateCredential("kickBotRefreshExpires", tempStorage.kickRefreshExpires)
    }
    if (!localConfig.connected)
    {
        setTimeout(() =>
        {
            storeCredentials(isStreamerAccount)
            document.getElementById("messages").innerHTML = "Authorization complete, you can now close this window"
            return;
        }, 1000);
    }
    else
        document.getElementById("messages").innerHTML = "Authorization complete, you can now close this window"
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function UpdateCredential (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredential",
            "kick_auth",
            {
                ExtensionName: localConfig.extensionsname, // set "kick" here so that the kick extension will received these creds. The creds files are saved by this name and then the extension will received this file when asking for their credentials.
                CredentialName: name,
                CredentialValue: value
            },
        ));
}
// ============================================================================
//                           FUNCTION: getOauthFromCode
// ============================================================================
function getOauthFromCode (code, isStreamer)
{
    const data = {
        grant_type: 'authorization_code',
        client_id: tempStorage.clientId,
        client_secret: tempStorage.kickApplicationSecret,
        redirect_uri: 'http://localhost:3000/kick/auth',
        code_verifier: tempStorage.kickOAuthVerifier,
        code: code
    };

    const formBody = Object.entries(data)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    fetch('https://id.kick.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody
    })
        .then(response => response.json())
        .then(result =>
        {
            //sr_api.sendLogMessage(localConfig.DataCenterSocket, "callback oauth", "kick", "result", JSON.stringify(result, null, 2))
            tempStorage.kickAccessToken = result.access_token;
            tempStorage.kickRefreshToken = result.refresh_token;
            tempStorage.kickRefreshExpires = Date.now() + (result.expires_in * 1000);
            storeCredentials(isStreamer)
        })
        .catch(error =>
        {
            console.error('Error:', error);
        });
}
// ============================================================================
//                           FUNCTION: parseParams
// ============================================================================

function parseParams (params)
{
    let isStreamer = false;// is this a streamer or bot auth
    // get the data back from kick call
    //sr_api.sendLogMessage(localConfig.DataCenterSocket, "callback oauth", "kick", "params", JSON.stringify(params, null, 2))
    // note state will either be a nonce or a tag to say if we are a bot or the streamer.
    //let state = hashMatch(/state=(\w+)/);
    let state = params.get("state")
    if (state.indexOf("_streamer") > -1)
    {
        isStreamer = true;
        state = state.replace("_streamer", "")
    }
    if (state.indexOf("_bot") > -1)
        state = state.replace("_bot", "")

    if (tempStorage.kickOAuthState == state)
    {
        if (params.get("code") != "")
            getOauthFromCode(params.get("code"), isStreamer)
        else
            console.log("page not recognized", params)
    }
    else
        document.getElementById("messages").innerHTML = "Authorisation state incorrect. please try again by closing and reopening this window <a href='http://" + window.location.host + window.location.pathname + "'>Reload</a>"
    return;
}
// ============================================================================
//                           FUNCTION: updatePage
// ============================================================================
function updatePage ()
{
    // check if this page has been called from the kick callback
    if (document.location.href.indexOf("state") > -1)
    {
        if (!tempStorage.authorized)
        {
            const params = new URLSearchParams(window.location.search);
            parseParams(params);
            tempStorage.authorized = true;
        }
    }
    else
    {
        sr_api.sendLogMessage(localConfig.DataCenterSocket, "callback oauth", "kick", "result", document.location.href)
        if (tempStorage.clientId == "")
            document.getElementById("messages").innerHTML += document.getElementById("messages").innerHTML + "<BR>Missing Client Id. Please add the kick application client id and secret in the main setings page before trying to authorize"
        else
            window.location.href = 'https://id.kick.com/oauth/authorize' +
                '?response_type=code' +
                '&client_id=' + tempStorage.clientId +
                '&redirect_uri=' + 'http://localhost:3000/kick/auth' +
                '&scope=' + tempStorage.scopes +
                '&code_challenge=' + tempStorage.kickOAuthChallenge +
                '&code_challenge_method=S256' +
                '&state=' + tempStorage.kickOAuthState + "_" + tempStorage.userType;

    }
}