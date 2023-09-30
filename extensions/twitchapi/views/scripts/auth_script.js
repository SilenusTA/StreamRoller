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
    redirectURI: 'http://localhost:3000/twitchauth',
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
    console.log("ConnectToDataCenter", host, port)
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
    console.log(server_packet.type)
}

// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function storeCredentials ()
{
    if (localConfig.connected)
    {
        UpdateCredential("twitchOAuthState", tempStorage.twitchOAuthState)
        UpdateCredential("twitchOAuthToken", tempStorage.twitchOAuthToken)
    }
    else
    {
        console.log("storeCredentials not yet connected, reconnecting")
        setTimeout(() =>
        {
            storeCredentials()
        }, 1000);
    }
}

// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function UpdateCredential (name, value)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "UpdateCredentials",
            "twitchapi_auth",
            {
                ExtensionName: "twitchapi",
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
    // get the data back from twitch call
    const hashMatch = function (expr)
    {
        const match = hash.match(expr);
        return match ? match[1] : null;
    };
    const state = hashMatch(/state=(\w+)/);
    if (tempStorage.twitchOAuthState == state)
    {
        tempStorage.twitchOAuthToken = hashMatch(/access_token=(\w+)/);
        storeCredentials()
    }
    else
        console.log("state is incorrect", tempStorage.twitchOAuthState, state)
    return;

}

// ============================================================================
//                           Start of code
// ============================================================================
parseFragment(document.location.hash);
