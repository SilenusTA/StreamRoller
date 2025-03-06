<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # Youtube Extension

Contents

- [Youtube Extension](#youtube-extension)
  - [Outgoing channel : "YOUTUBE"](#outgoing-channel--youtube)
  - [Description](#description)
  - [Features](#features)
  - [Settings](#settings)
    - [Settings Small (for mainpage quick links)](#settings-small-for-mainpage-quick-links)
    - [Settings Large (for main settings full page)](#settings-large-for-main-settings-full-page)
  - [Authorization](#authorization)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

## Outgoing channel : "YOUTUBE"

## Description

This extension allows youtube integration into chat

## Features

Currently the extension only receives youtube messages from your current live stream.

## Settings

### Settings Small (for mainpage quick links)

- enable/disable addon
- youtube channel to scan
- - This is the channel the extension will scan for live videos
- cookie authentication
- - Enter your yourube cookie here to be able to post into live chat from streamroller
- restore defaults
- - Resets the extension data to defaults/remove creadentials/cookies.

### Settings Large (for main settings full page)

none

## Authorization
Authorization is done via youtube cookies from your normal login when browsing youtube. 

To get hold of a cookie to use in StreamRoller perform the following steps.

- In a browser, sign into YouTube (either incognito or a browser you don't use for YouTube), then hit F12/ctrl-shift-i/right-click-menu to bring up the Developer Tools/Inspector.
- Choose the Network tab.
- Select XHR filter.
- Enter 'browse' in the Filter box.
- Now scroll down the YouTube web page until an entry starting with 'browse' appears. Select it.
- Scroll down in the Headers tab until you see Cookie under Request Headers.
- Right-click on the value of Cookie and select Copy Value (or select all and right click-copy).
note: the cookies are large multiline section blocks.
[More detailed description with pictures](https://github.com/patrickkfkan/Volumio-YouTube.js/wiki/How-to-obtain-Cookie)
## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Thu, 06 Mar 2025 05:50:57 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| Youtube message received | trigger_ChatMessageReceived | A chat message was received. textMessage field has name and message combined |

### Actions

| name | trigger | description |
| --- | --- | --- |
| YouTube post livechat message | action_youtubePostLiveChatMessage | Post to youtube live chat if we are connected. |
