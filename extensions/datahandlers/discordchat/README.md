# Discord Chat
Contents
- [Discord Chat](#discord-chat)
- [Setup](#setup)
  - [Outgoing channel : "DISCORD_CHAT"](#outgoing-channel--discord_chat)
  - [Authorization fields](#authorization-fields)
      - [Field 1](#field-1)
- [About](#about)
  - [Features](#features)
    - [Channel messages](#channel-messages)
    - [Requests](#requests)
  - [Discord credentials](#discord-credentials)
  - [Future ideas?!?](#future-ideas)
# Setup

## Outgoing channel : "DISCORD_CHAT"
## Authorization fields
#### Field 1
- Name: DISCORD_TOKEN 
- Value: bot token

# About
## Features
- Send alerts to discord. This can be configured in the alerts modal. Channel to use and which alerts to send are currently available
### Channel messages
All messages follow the standard server message with with the message data within the data section.
These will be broadcast on the outgoing channel
- Discord chat messages - from the assigned channel (can be set in the admind card on the admin page)
### Requests
- none

The discordchat extension currently provides the following features
- Creates a 'DISCORD_CHAT' channel for other extension to consume mesages from
- Reads messages from a discord channel (set in the settings) and sends them out on the 'DISCORD_CHAT' channel with the following format
  ```
  {
      type: "ChannelData",
      from: "discordchat",
      {
          "DiscordModChat",
          "discordchat",
          {
            name: <message author>,
            message: <message sent>,
          },
          "DISCORD_CHAT"
      },
      dest_channel: "DISCORD_CHAT",
  }
  ```
- Listents to 'STREAMLABS_ALERT' channel and posts certain events on the discord channel set in the settings
- Discord Channels
  - There are two channels the extension utilises. 
    - mod messages channel - used to read messages and output on our "DISCORD_CHAT' channel for other extension to use
    - alerts channel - used to post alerts to
  - These channel names are defined in the settings files and can be updated buy the provided settings widget small code
- SettingsWidgetSmall.
  - Provide an settings widget small to the admin page to allow the user to set the following values
    - streamlabs alerts to log
    - channelname for streamlabs alerts to be post on (on discord)
    - channelname to read on discord for message we will post out on our 'DISCORD_CHAT' channel
  
## Discord credentials
Currnetly the extension reads the environment variable "DISCORD_TOKEN" to be able to connect to the discord needed. You will need to provide a token in your PC's environment variable to use this addon

## Future ideas?!?
- send a chat message to discord. This would allow a viewer (using a command) to send a message to a discord channel. Useful for reminders, saving the viewers from having to switch to discord to remind me of things.