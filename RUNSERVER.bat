@echo off
REM ### setup the environment variables
REM options for debugging are 
REM "off" - no debug
REM "standard" - debug info
REM "extended" - source of debug plus debug
REM "extended-line" - source of debug plus debug on the same line
SET STREAMTOOL_DEBUG_FORMAT=extended-line
REM     0   : errors only (always on)
REM     1   : warn and err
REM     2   : log, warn and err
REM     3   : log, info, warn and err.
SET STREAMTOOL_DEBUG_LEVEL=3

REM ### SL_SOCKET_TOKEN is used by the extension streamlabs to attach to the streamlabs API. used for Alerts and data from platforms supported by streamlabs (twitch/youtube etc.)
REM you only need to do this once here as it will set the windows environment varialbe so future runs will have it (no harm in leaving it in though.)
REM SET SL_SOCKET_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"                    


REM start the backend. runnign npm so changes get loaded automatically. in production just use node
start "Server" /d "backend" "cmd /T:16 /k npm start"