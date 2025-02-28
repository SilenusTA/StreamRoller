# Youtube Extension

Contents

- [Youtube Extension](#youtube-extension)
  - [Outgoing channel : "YOUTUBE"](#outgoing-channel--youtube)
  - [Description](#description)
  - [Features](#features)
  - [Settings](#settings)
    - [Settings Small (for mainpage quick links)](#settings-small-for-mainpage-quick-links)
    - [Settings Large (for main settings full page)](#settings-large-for-main-settings-full-page)
  - [Authorization TBD](#authorization-tbd)
  - [Autopilot triggers and actions](#autopilot-triggers-and-actions)
    - [Triggers](#triggers)
      - ["trigger\_ChatMessageReceived"](#trigger_chatmessagereceived)
    - [Actions](#actions)
      - ["action\_youtubePostLiveChatMessage"](#action_youtubepostlivechatmessage)

## Outgoing channel : "YOUTUBE"

## Description

This extension allows youtube integration into chat

## Features

Currently the extension only receives youtube messages from your current live stream. Sending of messages is still TBD

## Settings

### Settings Small (for mainpage quick links)

- enable/disable addon
- chat poll rate
- - This allows you to reduce the google api usage by limiting how often to check for new messages
- restore defaults
- - Resets the extension data to defaults.

### Settings Large (for main settings full page)

none

## Authorization TBD

## Autopilot triggers and actions

### Triggers

#### "trigger_ChatMessageReceived"
Fires when a chat message is received on the live stream chat

``` 
name: "YoutubeMessageReceived",
displaytitle: "YouTube Chat Message",
description: "A chat message was received. textMessage field has name and message combined",
messagetype: "trigger_ChatMessageReceived",
parameters: 
{
    triggerId: "YouTubeChatMessage", //Identifier that users can use to identify this particular trigger message if triggered by an action
    // streamroller settings
    type: "trigger_ChatMessageReceived",
    platform: "Youtube",
    textMessage: "[username]: [message]",
    safemessage: "",
    color: "#FF0000",

    // youtube message data
    id: "",
    message: "",
    ytmessagetype: "",
    timestamp: -1,
    
    //youtube author data
    sender: "",
    senderid: "",
    senderprofileimageurl: "",
    senderbadges: "",
    senderisverified: false,
    senderischatmoderator: false,
}
```

### Actions

#### "action_youtubePostLiveChatMessage"
TBD. Not implemented yet. Waiting on auth to be sorted.
```
name: "youtubepostlivechatmessage",
displaytitle: "Post a Message to youtube live chat",
description: "Post to youtube live chat if we are connected.",
messagetype: "action_youtubePostLiveChatMessage",
parameters: {
    actionId: "YouTubeChatMessage", //Identifier that users can use to identify any trigger fired by this action
    message: ""
}
```