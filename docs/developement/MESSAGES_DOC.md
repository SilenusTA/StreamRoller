# Messages (might need updating, console.log is your friend here)

## Developer Table of Contents

- [Messages (might need updating, console.log is your friend here)](#messages-might-need-updating-consolelog-is-your-friend-here)
  - [Developer Table of Contents](#developer-table-of-contents)
  - [Overview](#overview)
  - [ServerMessage data packets](#servermessage-data-packets)
  - [Message Types](#message-types)
    - [Messages to the server](#messages-to-the-server)
    - [Messages from the server](#messages-from-the-server)
  - [Extension/Channel Message Format](#extensionchannel-message-format)

## Overview

The messages system sits on the socket protocol and are JSON objects.

There are helper functions to help with sending messages to aid in sending and receiving data. It is recommended to use these functions to avoid conflicts with changes in future versions.

## ServerMessage data packets

A 'ServerMessage' refers to the top level of the JSON object sent on StreamRoller connections. Any extra data will be held in the nested 'data' field of the ServerMessage

This data is the root of all message JSON packets. The data packet for the top level message is as follows.

Note: fields with a (*) are mandatory

```json
{
    * type:         <message type>
    * from:         <sender name>
    # data:         <data packet of message>
    # dest_channel: <channel you want to send this message to>
    # to:           <who you want to receive this message>
    # version:      <internal use>
}
```

- type
  - type of message. (see [Message Types](#message-types) for more information)
- from
  - who sent the message. normally the extension name
- data
  - data for this message.
- dest_channel
  - channel you want to send this message on. Everyone on that channel will receive it. (see 'to' field for broadcast messages)
- to
  - who you are sending this message to. if empty then the dest_channel field will be checked to send on a channel. if both are empty then it is broadcast
- version
  - version of messaging system. Used internally to make sure the sender/receiver are using the same message system vers.

Note: an empty field will default to "" if not supplied.
Note2: The destination of the message follows the following (in order)

- if 'destination channel' is not ""
  send out on the channel name provided with the type = "ChannelData"
- else if 'to' is not ""
  send out to the extension name provided with the type = "ExtensionMessage"
- else broadcast to all sockets connected (except sending socket)

## Message Types

There are some special message types that are used (normally during startup or error handling). These are server message/data handled by the system.

### Messages to the server

```text
  "ExtensionConnected"    Tell streamroller that you have received the connection message successfully
  "ExtensionReady"        Tell streamRoller you are ready to start working
  "RequestConfig"         Retrieve your saved config file. Response "ConfigFile"
  "RequestSoftwareVersion"Responds with "SoftwareVersion"
  "SaveConfig"            Saved your config file. Response "ConfigFile"
  "RequestData"           Request data file for extension. Response "DataFile"
  "SaveData"              Save extension data
  "StopServer"            Stops the StreamRoller Server
  "RestartServer"         Stop and Restart the StreamRoller server
  "UpdateCredential"      Update a credential the extension. Response "CredentialsFile"
  "UpdateCredentials"     Update multiple credentials the extension. Response "CredentialsFile"
  "RequestCredentials"    Request the credentials for the extension. Response "CredentialsFile"
  "DeleteCredentials"     Delete teh credentials for the extension provided.Response "CredentialsFileDeleted"
  "RequestExtensionsList" Request a list of loaded extensions using the system. Response "ExtensionList"
  "RequestAllExtensionsList" Request all extensions (even not yet connected). Response "ExtensionList"
  "RequestChannelsList"   Request a list of channels currently available. Response "ChannelList"
  "CreateChannel"         Create a channel for to send/receive messages on. Response "ChannelCreated" or "ChannelJoined"
  "JoinChannel"           Join a channel to send/receive messages on. Response "ChannelJoined" or "UnknownChannel"
  "LeaveChannel"          Leave a channel
  "ExtensionMessage"      A message to be forwarded on to an extension
  "ChannelData"           A message to be forwarded on to a channel
  "SetLoggingLevel"       Sets the logging level. Response "LoggingLevel"
  "RequestLoggingLevel"   SGet the logging level. Response "LoggingLevel"
  
```

### Messages from the server

```text
  "StreamRollerReady"     All connected extensions have reported ready to start processing or have timed out
  "StreamRollerUpdating"  Something has changed (extension joined/left etc) 
  "CredentialsFile"       Response from the "RequestCredentials" message
  "CredentialsFileDeleted" Response from the "DeleteCredentials" message
  "trigger_StreamRollerIPChanged" Sent when the server has changed IP address/restarted
  "ExtensionList"         List of extensions
  "ChannelList"           List of channels
  "ChannelCreated"        A channel was created
  "ChannelJoined"         Extension joined a channel
  "UnknownChannel"        Channel name not recognised
                          an unknown channel
  "UnknownExtension"      Extension name not recognised
                          an unknown extension
  "InvalidMessage"        A message parsed was invalid
  "ExtensionMessage"      A non server message type, it will be processed 
                          and forwarded depending on type and included contents (see 
                          extension messages below)
  "ChannelData"           Data to be broadcast on channel.
  "LoggingLevel"          The current logging level of the system
  "SoftwareVersion"       The software version of StreamRoller
```

## Extension/Channel Message Format

These messages are for communication between extensions or to send/request data to an extension or Channel so that extensions monitoring that channel will receive them.

These messages are sent like any other.

The ServerMessage type will be either "ExtensionMessage" or "ChannelData" and the extension/channel message be placed in the ServerMessage object's 'data' variable

The data packet will not be parsed by the server but should follow the ExtensionMessage JSON format show below for consistency across the system

The format is similar for both server and extension messages

```json
{
    * type:         <message type>
    * from:         <sender name>
    # data:         <data packet of message>
    # dest_channel: <channel sent this message to>
    # to:           <who should receive this message>
    # version:      <internal>
}
```

The main differences between the server packet and extension packet are

- type/format of the data packet is specific to the extension
- It is up to the extension to define it's message types, data structures etc that go in the ExtensionMessage.data field.
- routing is done on priority of supplied fields in the ServerMessage, (note that the fields in the extension message are used only by the extensions and not for routing)
    1) "to" sent to the extension only
    2) "dest_channel" broadcast on the channel requested
    3) if neither of the above fields are populated the message will be broadcast to all extensions
- messages will follow the same format as server messages, The extension data packet will be inside the data field of message sent.
  ie a ServerMessage packet being sent to an Extension might look like

```json
ServerPacket =
    {
      type  : "ExtensionMessage",
      from  : "randomfact",
      data  : 
      {
        type : "SettingsWidgetSmallCode",
        from : "randomfact",
        data : "..." // data for this specific message
      },
      to  : "liveportal"
    }
```
