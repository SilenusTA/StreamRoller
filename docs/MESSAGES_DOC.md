# Messges (might need updating, console.log is your friend here)

## Developer Table of Contents

- [Messges (might need updating, console.log is your friend here)](#messges-might-need-updating-consolelog-is-your-friend-here)
  - [Developer Table of Contents](#developer-table-of-contents)
- [Overview](#overview)
- [Server Message data packets](#server-message-data-packets)
  - [Server Message Types](#server-message-types)
    - [Server Message Types](#server-message-types-1)
    - [Server Message Type requirements](#server-message-type-requirements)
    - [Server information messages](#server-information-messages)
      - [Broadcast messages](#broadcast-messages)
      - [Direct messages](#direct-messages)
    - [Debug/utility functions](#debugutility-functions)
- [Extension Message Format](#extension-message-format)

# Overview

The messages system sits on the socket protocol. There are helper functions to help with sending messages to aid in sending and receiving data. It is recommended to use these functions to avoid conflicts with changes in future versions.


# Server Message data packets
These messages are meant for server forwarding or information. The data packet for the top level message is as follows.

Note: fields with a (*) are mandatory

```
{
    * type:         <message type>
    * from:         <sender name>
    # data:         <data packet of message>
    # dest_channel: <channel you want to send this message to>
    # to:           <who you want to receive this message>
    # ret_channel:  <channel you would expect replies on>
    # version:      <version of messaging system>
}
```

- type
  - type of message. ie data, error, info registerforchannel (see [message types](#message-types) for more information) 
- from
  - who sent the message. normally the extension name
- data
  - data for this message.
- dest_channel
  - channel you want to send this message on. Everyone on that channel will receive it. (see 'to' field for broadcast messages)
- to
  - who you are sending this message to. if empty then the dest_channel field will be checked to send on a channel. if both are empty then it is broadcast
- ret_channel
  - normally your channel. A channel you are connected to that you expect the reply to be sent on if not directly if not a reply to you. Usefull if you have more than one extension on a channel and you want them all to get the same reply
- version
  - version of messaging system. normally omitted. used internally to make sure the sender/receiver are using the same message system vers.

Note: an empty field will default to "" if not supplied.

## Server Message Types
There are some special message types that are used (normally during startup or error handling). These are server message/data handled by the system.
### Server Message Types
```
  "RequestConfig"         Receive your saved config file
  "SaveConfig"            Saved your config file
  "UpdateCredentials"     Update a credential for an extension
  "RequestCredentials"    Request the credentials for your extension
  "CredentialsFile"       Response from the "RequestCredentials" message
  "RequestData"           Request data file for extension
  "SaveData"              Save extension data
  "RequestExtensionsList" Request a list of extensions using the system
  "ExtensionList"         List of extensions
  "RequestChannelsList"   Request a list of channels currently available
  "ChannelList"           List of channels
  "CreateChannel"         Create a channel for to send/receive messages on
  "JoinChannel"           Join a channel to send/receive messages on
  "ChannelJoined"         Extension joined a channel
  "LeaveChannel"          Leave a channel
  "ChannelLeft"           Extension left a channel
  "UnknownChannel"        Channel name not recognised
                          an unknown channel
  "UnknownExtension"      Extension name not recognised
                          an unknown extension)
  "InvalidMessage"        The message sent was invalid
  "ExtensionMessage"      A non server message type, it will be processed 
                          and forwarded depending on type and included contents (see 
                          extension messages below)
  "ChannelData"           Data to be broadcast on channel.
```
### Server Message Type requirements
Additional information on data/fields needed (over the madatory message type and from fields) for the requests
- RequestConfig
   - none
- SaveConfig
  - data field contains your config object
config file in response to the "RequestConfig" message above
  - The to field will contain the name of the extension it is for
  - The data field will contain the config file
-  StopServer
   -  none
- UpdateCredentials
  - A data packet containing the extensionname, key and value pair for the credential you wish to set
- RequestCredentials
  - none
for the extension
- RequestExtensionsList
  - none
- RequestChannelsList
  - none
- RequestData
  - none
- SaveData
  - data field contains data to save.
- CreateChannel
  - data field to contain string of channel name 
- JoinChannel
  - data field to contain string of channel name 
- LeaveChannel
  - data field to contain string of channel name 
- ExtensionMessage 
  - data field to contain an extension object as shown below
  - if 'to' field is populated then the object will be sent to that extension directly
  - if the 'dest_channel' field is populated then the message will be broadcast on that channel
  - if no 'to' or 'dest_channel' information then the message will be broadcast on all channels
- ChannelData
  - "data" field to contain data packet. This will be an extension specific data structure/type and is defined by the extension.
  - "dest_channal" field to be the channel to broadcast on.
### Server information messages
There are message you can use to see information about channels created etc
#### Broadcast messages
These will be sent out to all extensions
```
- ChannelJoined
  - Lets you know an extension has goined a particular channel
  - the data field will contain an object with the from name set to the extension that left the channel
- ChannelLeft
  - Lets you know an extension left a channel, broadcast in that channel
  - the data field will contain the extension name
- ChannelCreated
  - Sent when a new channel is created
  - the data field will contain an object with the from name set to the extension that left the channel
```

#### Direct messages
These are sent to an individual extension. Normally in reply to a request or error.
```
- ConfigFile
  - This is a message sent from the server to an Extension containing it's config
  - to field indicates who it is for
  - data field contains the config
- CredentialsFile
  - data will contain the json object containing all credentials stored 
- ExtensionList
  - Server sent message containing a the current list of extensions attached to the server
- ChannelList
  - Server sent message containing a the current list of channels attached to the server
- UnknownChannel
  - i.e sent when a request to join channel includes an unknown channel
  - data will be the channel name that was attempted to join.
- UnknownExtension
  - i.e sent when a request to send a message that needs routing direct to an extension but providing a name that isn't known
  - data will be the channel name that was attempted to join.
- InvalidMessage
  - Inidicates an issue with the message. Additional info will be in the data.
```

### Debug/utility functions
These are mainly used for debugging purposes
```
  "SetLoggingLevel"       Sets the logging level for the server
  "RequestLoggingLevel"   Request the logging level for the server
  "LoggingLevel"          Response to Set/Request logging level
  "StopServer"            Stop the server
```
- SetLoggingLevel
  - data field should contain the level to set (0-5)
- RequestLoggingLevel 
  - data field will contain the current logging level(0-5)
- LoggingLevel (broadcast to all extensions)
  - this is the respont to a set or request for logging level
# Extension Message Format
These messges are for communication between extensions or to send/request data to an extension. i.e. sending html code to the admin extension to display on your link on the admin page or to receive the data back if a form was submitted.

These messages are sent like any other but the data packet has a specified format. This can be defined yourself but it is suggested to use this format so that we have a common packet format for all extensions.

The format is similar for both server and extension messages
```
{
    * type:         <message type>
    * from:         <sender name>
    # data:         <data packet of message>
    # dest_channel: <channel sent this message to>
    # to:           <who should receive this message>
    # ret_channel:  <channel you would expect replies on>
    # version:      <version of messaging system>
}
```
The main differences between the server packet and extension packet are
 - type is specific to the extension (ie "AdminModalCode" for the admin to define the data contains html code it will place on the screen, or "AdminModalData" if this is the results from a form submit)
 - It is up to the extension to define it's message types, data structures.
 - routing is done on priority of supplied fields IN THE SERVER MESSAGE, The fields in the extension message are used only by the extensions and not for routing
    1) "to" sent to the extension only
    2) "dest_channel" broadcast on the channel requested
    3) if neither of the above fields are populated the message will be broadcast to all extensions
  - messages will follow the same format as server messages, The extension data packect will be inside the data field of message sent.
  ie 
  ```
    
    {
      type      : "ExtensionMessage"
      from      : "randomfact"
      data      : {
                    type : "AdminModalCode"
                    from : "randomfact"
                    data : "..."
                  }
    to          : "adminpage"
    ret_channel : ""
    }
  ```