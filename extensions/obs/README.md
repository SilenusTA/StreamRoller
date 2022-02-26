# OBS Extension
## Outgoing channel : "OBS_CHANNEL"
Provides connection to OBS for information and control. Allows setting of host/port/password and level of via the admin modal as well as the indicators that should be used to identify Primary and secondary scenes.
## Current features

### Channel messages
If developing the system it is recommended to 'console.log' messages to see data avalable. 

All messages follw the standard server message with with the obs data within the data section.
These will be broadcast on the outgoing channel
- "OBSStats" - heatbeat message when stream is live. Contains various information like bitrage, cpu usage, FPS etc
- "StreamStarted" - sent at stream start
- "StreamStopped" - send when stream stopped
- "SceneChanged" - when the current OBS scene is switched
- "ScenesList" - on startup or in response to a "RequestScenes" message.
### Requests
The following requests can be made to the exension
- "RequestAdminModalCode" - provides the settinsg panel for webpages
- "RequestScenes" - request the list of scenes available
- "ChangeScene" - request OBS to change to given scene