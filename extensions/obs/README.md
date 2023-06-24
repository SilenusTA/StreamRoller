# OBS
Contents
- [OBS](#obs)
- [Setup](#setup)
  - [Outgoing channel : "OBS\_CHANNEL"](#outgoing-channel--obs_channel)
  - [Authorization fields](#authorization-fields)
      - [Field 1](#field-1)
      - [Field 2](#field-2)
      - [Field 3](#field-3)
  - [Current features](#current-features)
    - [Channel messages](#channel-messages)
    - [Requests](#requests)
# Setup

## Outgoing channel : "OBS_CHANNEL"
## Authorization fields
#### Field 1
- Name: "obshost"
- Value: hostname (ie localhost)
#### Field 2
- Name: "obsport"
- Port to use

#### Field 3
- Name: "obspass"
- Value: password

Provides connection to OBS for information and control. 
## Current features

### Channel messages

All messages follow the standard server message with with the obs data within the data section.
These will be broadcast on the outgoing channel
- "OBSStats" - heatbeat message when stream is live. Contains various information like bitrate, cpu usage, FPS etc
- "trigger_StreamStarted" - sent at stream start
- "StreamStopped" - send when stream stopped
- "trigger_SceneChanged" - when the current OBS scene is switched
- "ScenesList" - on startup or in response to a "RequestScenes" message.
### Requests
The following requests can be made to the exension
- "RequestSettingsWidgetSmallCode" - provides the settinsg panel for webpages
- "RequestScenes" - request the list of scenes available
- "ChangeScene" - request OBS to change to given scene