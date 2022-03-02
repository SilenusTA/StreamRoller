# Streamlabs API
## Outgoing channel : "STREAMLABS_ALERT"
- [Streamlabs API](#streamlabs-api)
  - [Outgoing channel : "STREAMLABS_ALERT"](#outgoing-channel--streamlabs_alert)
- [Setup](#setup)
- [About](#about)
# Setup
Add an environment variable with your credentials to access streamlabs api. These can be found on your streamlabs.com dasboard at Account > settings > Api settings"
```
Set your environment variable "SL_SOCKET_TOKEN" to your Streamlabs.com token to be able to use this extension
```
# About
This extension connects to the streamlabs API to retrieve live alert data so that other extensions can comsume it (ie overlays, sharing alerts on discod, twitter etc)

Note: You can also use this api for other streaming platoforms. ie youtube streaming.

The following features are provided
- creates a "STREAMLABS_ALERT" channel to send out streamlabs messages
- Provides an AdminModal so that the adminpage can turn on or off the messages
- Messages sent are of the following format
```
  {
      type: "ChannelData",
      from: "streamlabs_api",
      {
          "follow",
          "streamlabs_api",
          {
            <streamlabs data packet>
          },
          "STREAMLABS_ALERT"
      },
      dest_channel: "STREAMLABS_ALERT",
  }
```
- Due to the number of messages types provided by streamlabs ('streamlabs data packet' above) it is recommened that you inspect the contents of each type of message to see what data you want from it. An example follow message would appar as follows
```
{
    type: "ChannelData",
    from: "streamlabs_api",
    {
        "follow",
        "streamlabs_api",
        {
           {
               "type":"follow",
               "message":
               [{
                    "name":"OldDepressedGamer",
                    "isTest":true,
                    "_id":"fb66efd9ed58435811aa08c57bb4a5b8",
                    "priority":10
                }],
                "for":"twitch_account",
                "event_id":"evt_13c369423ac5e3ad96bf84ca3896dfbe"
            }
        },
        "STREAMLABS_ALERT"
    },
    dest_channel: "STREAMLABS_ALERT",
}
```