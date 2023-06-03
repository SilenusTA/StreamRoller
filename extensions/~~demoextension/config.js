/**
 *      StreamRoller Copyright 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 *      StreamRoller is an all in one streaming solution designed to give a single
 *      'second monitor' control page and allow easy integration for configuring
 *      content (ie. tweets linked to chat, overlays triggered by messages, hue lights
 *      controlled by donations etc)
 * 
 *      This program is free software: you can redistribute it and/or modify
 *      it under the terms of the GNU Affero General Public License as published
 *      by the Free Software Foundation, either version 3 of the License, or
 *      (at your option) any later version.
 * 
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU Affero General Public License for more details.
 * 
 *      You should have received a copy of the GNU Affero General Public License
 *      along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
 // ######################### config.js ################################
// Configuration settings
// -------------------------- Creation ----------------------------------------
// Author: Silenus aka twitch.tv/OldDepressedGamer
// GitHub: https://github.com/SilenusTA/streamer
// Date: 08-Jan-2022
// --------------------------- functionality ----------------------------------
// 
// --------------------------- description -------------------------------------
// 
// ----------------------------- notes ----------------------------------------
// TBD. 
// ============================================================================
export const config = {
    // settings for how we connect to the backend server
    // normally localhost unless running the extension remotely
    // what we want to call our channel so that others can see the data we post
    OUR_CHANNEL: "DEMOEXT_CHANNEL",
    // this must match the folder and file name of the extension
    EXTENSION_NAME: "demoextension",
    // logging tag used so we can easily work out what part of the system the 
    // console log data is from
    SYSTEM_LOGGING_TAG: "[EXTENSION]",
    // This will store our socket connection to the StreamRoller backend
    // this socket is used to send data for others to use and receive
    // data for you to use in your extension
    DataCenterSocket: null,
    // how many times will we attempt to register for a channel if it hasn't been created yet
    MAX_CONNECTION_ATTEMPTS: 5
};