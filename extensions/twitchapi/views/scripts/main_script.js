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
    tempStorage sr_api
*/
// ============================================================================
//                           FUNCTION: updatepage
// ============================================================================
function updatepage ()
{
    const redirectURI = 'http://localhost:3000/twitchauth'; // redirect for the twitch callback
    window.location.href = 'https://id.twitch.tv/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' + tempStorage.clientId +
        '&redirect_uri=' + redirectURI +
        '&state=' + tempStorage.twitchOAuthState +
        '&scope=' + tempStorage.scopes;
}
// runs when the page has loaded
updatepage()
