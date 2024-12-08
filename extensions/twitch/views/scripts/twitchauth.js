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
    tempStorage sr_api,parseFragment
*/
// ============================================================================
//                           FUNCTION: updatepage
// ============================================================================
function updatePage ()
{
    // check if this page has been called from the twitch callback
    if (document.location.hash.match(/access_token=(\w+)/))
    {
        parseFragment(document.location.hash);
    }
    else
    {
        window.location.href = 'https://id.twitch.tv/oauth2/authorize' +
            '?response_type=token' +
            '&force_verify=true' +
            '&client_id=' + tempStorage.clientId +
            '&redirect_uri=' + 'http://localhost:3000/twitch/auth' +
            '&state=' + tempStorage.twitchOAuthState +
            '&scope=' + tempStorage.scopes;
    }
}
updatePage()
