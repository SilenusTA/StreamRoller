# Live Streaming Portal
## Outgoing channel : none
- [Live Streaming Portal](#live-streaming-portal)
  - [Outgoing channel : none](#outgoing-channel--none)
- [About](#about)
  - [Current features (under developement)](#current-features-under-developement)
      - [Display](#display)
      - [Logic](#logic)
  - [TBD.](#tbd)
# About
The live streaming portal is a webpage that you can use on your second monitor to show all the information/settings you need on one page. The idea is to save having to switch programs in order to do things and to have the information you need in one place.
I would expect this to be something that people will want to customise to what you need for streaming. 

If you creatate a portal page for your streaming please consider sharing it so that others who might have similar requrements can use it.

## Current features (under developement)
#### Display
- Chat Window: for twitch chat to display/send messages
- Mod Message Window: to display discord mod messages (twitch mod messages can be filtered to this window as well)
- OBS Stats: Stats for the stream (when stream is started)
- Scenes Buttons: configurable buttons for switching scense (main, secondary, all)
- Mute Button: Mute a specific device (ie the mic)
- Extension Status: Status icon for each extension
- Extension List: list of extensions with a link to settings for that extension
- Alert List: Shows Alerts (donation, follow etc)
#### Logic
- Sends a "Stream Started" message to twitter and discord
- Sends Alerts to discord channel
- Set twitch chat channel to monitor
- Set discord mod and alert messages channel (with options for each alert type)
- Enable/Disable streamlabs alerts/twitchchat/discord/twitter

## TBD.
Add volume monitoring to portal
Add music player to portal (requries a music player extension)
