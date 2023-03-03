# Twitch Chat
Contents
- [Twitch Chat](#twitch-chat)
- [Setup](#setup)
  - [Outgoing channel : "TWITCH\_CHAT"](#outgoing-channel--twitch_chat)
  - [Authorization fields](#authorization-fields)
      - [(BOT) Field 1](#bot-field-1)
      - [(BOT) Field 2](#bot-field-2)
      - [(USER) Field 1](#user-field-1)
      - [(USER) Field 2](#user-field-2)
- [About](#about)
- [Features](#features)
  - [messages](#messages)
  - [AdminModal (Settings)](#adminmodal-settings)
# Setup

## Outgoing channel : "TWITCH_CHAT"
## Authorization fields
There are two sets of credentials needed. One for the user and one for the bot. Future versions will add the ability for multiple users and bots
#### (BOT) Field 1 
- Name: twitchchatbot 
- Value: 'botname' ie myChatBot
#### (BOT) Field 2
- Name: twitchchatbotoauth
- Value: bot oauth token (including the oauth: part, ie "oauth:sdfeicx345324dfsfe3242")
#### (USER) Field 1 
- Name: twitchchauser
- Value: 'username' ie OldDepressedGamer
#### (USER) Field 2
- Name: twitchchatuseroauth
- Value: user oauth token (including the oauth: part, ie "oauth:sdfeicx345324dfsfe3242")

# About
The twitch chat extension will send out any messages sent on the channel provided in the settings (or Admin page settings box) using the username provided or defaults to the bot
# Features
## messages
The messages will be sent out on the "TWITCH_CHAT" channel in the following format. note that account should be either "bot", "user" or the name of the account to send as

```
  {
      type: "TWITCH_CHAT",
      from: "twitchchat",
      {
          "follow",
          "twitchchat",
          {
            channel: channel,
            account: account
            message: chatmessage,
            data: tags
          },
          "TWITCH_CHAT"
      },
      dest_channel: "TWITCH_CHAT",
  }
```
## AdminModal (Settings)
The admin modal povides the following settings
- Enable/Disable extension
- Twitch channel to join
- Chat buffer size (number of lines to save in the buffer)
- How often to save the buffer