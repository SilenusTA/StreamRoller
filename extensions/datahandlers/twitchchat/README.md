# Twitch Chat
## Outgoing channel : "TWITCH_CHAT"
## Authorization fields
#### Field 1
- Name: twitchchatbot 
- Value: botname
#### Field 2
- Name: twitchchatoauth
- Value: bot oauth token (including the oauth: part, ie "oauth:sdfeicx345324dfsfe3242")

# About
The twitch chat extension will send out any messages sent on the channel provided in the settings (or Admin page settings box).
# Features
## messages
The messages will be sent out on the "TWITCH_CHAT" channel in the following format

```
  {
      type: "TWITCH_CHAT",
      from: "twitchchat",
      {
          "follow",
          "twitchchat",
          {
            channel: channel,
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