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
/*
    global
    tempStorage sr_api,parseParams
*/
// ============================================================================
//                           FUNCTION: updatepage
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
updatePage()
