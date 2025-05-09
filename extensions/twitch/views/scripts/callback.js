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
*/
const localConfig =
{
    heartBeatTimeout: "6000",
    connected: false,
    DataCenterSocket: null,
    redirectURI: 'http://localhost:3000/twitch',
    extensionsname: "twitch"
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
    //heartBeatCallback();
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
    if (localConfig.connected && isStreamerAccount)
    {
        //streamer auth
        UpdateCredential("twitchOAuthState", tempStorage.twitchOAuthState)
        UpdateCredential("twitchOAuthToken", tempStorage.twitchOAuthToken)
    }
    if (localConfig.connected && !isStreamerAccount)
    {    //bot auth
        UpdateCredential("twitchBotOAuthState", tempStorage.twitchOAuthState)
        UpdateCredential("twitchBotOAuthToken", tempStorage.twitchOAuthToken)
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
            "twitch_auth",
            {
                ExtensionName: localConfig.extensionsname, // set "twitch" here so that teh twitch extension will received these creds. The creds files are saved by this name and then the extension will received this file when asking for their credentials.
                CredentialName: name,
                CredentialValue: value
            },
        ));
}

// ============================================================================
//                           FUNCTION: parseFragment
// ============================================================================
function parseFragment (hash)
{
    let isStreamer = false;// is this a streamer or bot auth
    // get the data back from twitch call
    const hashMatch = function (expr)
    {
        const match = hash.match(expr);
        return match ? match[1] : null;
    };
    let state = hashMatch(/state=(\w+)/);

    if (state.indexOf("_streamer") > -1)
    {
        isStreamer = true;
        state = state.replace("_streamer", "")
    }
    if (state.indexOf("_bot") > -1)
        state = state.replace("_bot", "")

    if (tempStorage.twitchOAuthState == state)
    {
        tempStorage.twitchOAuthToken = hashMatch(/access_token=(\w+)/);
        storeCredentials(isStreamer)
    }
    else
    {
        document.getElementById("messages").innerHTML = "Authorisation state incorrect. please try again by closing and reopening this window <a href='http://" + window.location.host + window.location.pathname + "'>Reload</a>"
    }
    return;
}
