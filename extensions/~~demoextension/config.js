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
    STREAMLABS_ALERT_ConnectionAttempts: 20
};