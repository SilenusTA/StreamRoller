# Extensions - Getting started

- [Extensions - Getting started](#extensions---getting-started)
  - [Loading the socket.io library](#loading-the-socketio-library)
    - [Web page/standalone](#web-pagestandalone)
    - [VSCode](#vscode)
  - [Using the StreamRoller API](#using-the-streamroller-api)
  - [Getting up and running](#getting-up-and-running)
  - [Sending messages](#sending-messages)
  - [Messages 1 (joining a channel to receive data)](#messages-1-joining-a-channel-to-receive-data)
  - [Messages 2 (sending data to an extension)](#messages-2-sending-data-to-an-extension)
    - [Changing OBS scene](#changing-obs-scene)
  - [Messages 3 (processing messages on a channel)](#messages-3-processing-messages-on-a-channel)
    - [Processing a Twitch chat message](#processing-a-twitch-chat-message)
  
An extension is considered as anything that uses the data center to send or consume data from the backend.

You can write an extension on any platform or programming language that can use sockets (TBD add messaging apis for other languages, ie python etc to make it easy to use).

The examples on this page are using javascript running as a backend started extension (ie the ones in the extensions folder).

If you want a standalone extension (normally to run on another machine) then the only additions steps needed for a standalone extension or webpage is to load the socket.io library and the streamroller api (unless you are using a new language then you will need to create the socket messages accordingly).

## Loading the socket.io library

### Web page/standalone

i.e for a standalone web page

```javascript
<script src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.5/socket.io.js' type='text/javascript'></script>
<script src="/streamroller-message-api.cjs"></script>
```

### VSCode

Used by most extensions running in VSCode.
You 'may' need install the socket library if you are not in the StreamRoller system (otherwise it should pick up the StreamRoller install)

```cmd
npm i socket.io@3.0.5
```

## Using the StreamRoller API

Use the javascript file from the public folder to give easier access to the system.

import the api as you normally would

```javascript
import * as sr_api from "../../data_center/public/streamroller-message-api.cjs";
```

## Getting up and running

To join the messaging system you call the setupConnection() function passing it three callback functions.

```javascript
DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect);
```

example callback functions

```javascript
i.e
function connect() {console.log("started")}
function message(data){console.log("message received ", data)}
function disconnect (reason){console.log("disconnected ",reason)}

const DataCenterSocket = sr_api.setupConnection(connect,message,disconnect);
```

Check out [Startup Sequence](StartupSequence.md) for the correct way to initialise an extension.

This will return a handle to your connection 'DataCenterSocket' that you will use to send/receive messages.

The callback functions are just functions you create and then pass the name of the function to the startup code

## Sending messages

To send a message you use the function

```javascript
sr_api.sendMessage( socket, data );
```

The socket is the return from the initial connection.
Data is defined in the [messages](MESSAGES_DOC.md) readme file.

## Messages 1 (joining a channel to receive data)

Message have a specified format. A simple example is shown below.

This would join you to the "TWITCH_CHAT" channel to receive any message sent by the extension that creates the channel. In order to read these messages you will need to refer to the extension that creates them to see their data layout. Or if in a rush just console.log(data) and you can probably work it out :D

Note:

- DataCenterSocket: is the return from the start socket code explained above
- sr_api: comes from the streamroller-message-api import/include
- sr_api.ServerPacket: function creates the message packet to send

```javascript
sr_api.sendMessage
(
  DataCenterSocket,
  sr_api.ServerPacket
  (
    "JoinChannel", 
    <ourExtensionName>, 
    "TWITCH_CHAT"
  )
)
```

After running the above command your message handler (function 'message()' above) will get called anytime a message is sent on the "TWITCH_CHAT" channel (and any other channel you join).

## Messages 2 (sending data to an extension)

To send a message to an extension you need to add an 'ExtensionPacket' data structure (containing the data to send) in the sendMessage function
The format of the sr_api.ExtensionPacket is similar to the sr_api.ServerPacket.  

### Changing OBS scene

In the example below we create a message to change the current OBS scene to the scene named "GameScene".

We will break this one down into individual steps to make it easier to understand each line.

1) First we create our Exntension data packet. The information here is defined by the extension we are sending it to.

```javascript
let ext_data = sr_api.ExtensionPacket
  (
    "ChangeScene",
    <our extension name>,
    "GameScene",
    "",
    "obs"
  )
```

- "ChangeScene": In this case the "obs" extension defines the message type (to change scenes) as "ChangeScene"
- Second we put in our extension name (so if the message needs a response the receiver knows to to reply to)
- Next we have the data section (defined by the obs extension). For this message we just need a string that represents the scene name we need to change to
- The next field is blank as we don't need a channel for this message type
- finally we have the name of the extension we want to receive this.

2) We now create our server message packet to put the data in.

```javascript
let serverMsgPacket = sr_api.ServerPacket
  (
    "ExtensionMessage",
    <our extension name>,
    <ext_object_created_above>,
    "",
    "obs"
  )
```

- "ExtensionMessage" - This lets the server know it needs to forward this message on to the extension we want to process it.
- "our extension name" - We add our extension name (so the server knows where to send errors if it can't send the mssage,
- ext_object_created_above - we then add the extension data packet we created above
- "" - we don't need a channel here as we are sending to an extension directly rather than broadcasting this out on a channel
- "obs" - where we want this message sent (extension name)

Finally we send the message using our "DataCenterSocket" we got when we ran the setupConnection function earlier to start the connection.

```javascript
sr_api.sendMessage
(
  DataCenterSocket,
  serverMsgPacket
)
```

## Messages 3 (processing messages on a channel)

After joining a channel your message handler will recieve messages sent on that channel (and any other you have joined as well as Extension messages)

In your message handler you just need to check for the message type to decide what to do with that message

### Processing a Twitch chat message

The example below is if you have joined the "TWITCH_CHAT" channel

```javascript
function message(server_packet)
{
  if (server_packet.type === "ChannelData")
  {
    if (server_packet.dest_channel === "TWITCH_CHAT")
    {
      // Get the extension data packet
      let extension_data = server_packet.data;

      console.log("Channel data received from ", extensions_data.from);
      // Get the data from that extension packet
      let chat_data = extension_data.data;

      // log the message
      console.log(chat_data.displayName, ">", chat_data.message);
    }
  }
}
```

Steps in the above code:

1) Check if we have a "ChannelData" message (ie one sent out from an extension on it's channel)
2) Next we check the Channel it was posted on (we could have Joined multiple channels)
3) We now need to get access to the data. The sever packets contains the extension packet so we get that out to make it clearer what packet we are working with
4) console.log the extension name that sent this data
5) Get the data from the extension packet
6) console.log the username and message
