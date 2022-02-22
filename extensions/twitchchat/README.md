# Twitch Chat

# Usage
Currenlty the extension is just readonly so no credentials are requried. This will be updated to be able to use credentials (and thereby posting as well as reading froma chat channel)

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