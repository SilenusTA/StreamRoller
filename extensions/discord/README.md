# Discord
- [Discord](#discord)
- [Setup](#setup)
- [About](#about)
  - [Discord credentials](#discord-credentials)

# Setup
```
Note You need an environment variable, "DISCORD_TOKEN", set to your bot accounts token in order for this extension to work.
```
# About
The discord extension currently provides the following features
- Creates a 'DISCORD_BOT' channel for other extension to consume mesages from
- Reads messages from a discord channel (set in the settings) and sends them out on the 'DISCORD_BOT' channel with the following format
  ```
  {
      type: "ChannelData",
      from: "discord",
      {
          "DiscordModChat",
          "discord",
          {
            name: <message author>,
            message: <message sent>,
          },
          "DISCORD_BOT"
      },
      dest_channel: "DISCORD_BOT",
  }
  ```
- Listents to 'STREAMLABS_ALERT' channel and posts certain events on the discord channel set in the settings
- Discord Channels
  - There are two channels the extension utilises. 
    - mod messages channel - used to read messages and output on our "DISCORD_BOT' channel for other extension to use
    - alerts channel - used to post alerts to
  - These channel names are defined in the settings files and can be updated buy the provided admin modal code
- AdminModal.
  - Provide an admin modal to the admin page to allow the user to set the following values
    - streamlabs alerts to log
    - channelname for streamlabs alerts to be post on (on discord)
    - channelname to read on discord for message we will post out on our 'DISCORD_BOT' channel
  
## Discord credentials
Currnetly the extension reads the environment variable "DISCORD_TOKEN" to be able to connect to the discord needed. You will need to provide a token in your PC's environment variable to use this addon