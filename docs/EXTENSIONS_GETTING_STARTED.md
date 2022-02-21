# Extensions - Getting started

- [Extensions - Getting started](#extensions---getting-started)
  - [Loading the socket.io library](#loading-the-socketio-library)
    - [Web page](#web-page)
    - [Node.js](#nodejs)
  - [Using the SreamRoller API](#using-the-sreamroller-api)
    - [Getting up and running](#getting-up-and-running)
  - [Sending messages](#sending-messages)
    - [Messages](#messages)
  

An extension is considered as anything that uses the data center to send or consume data from the backend. 

You can write an extension on any platform or programming language that can use sockets.

The examples on this page are using javascript running as a backend started extension (ie the ones in the extensions folder). 

The only additions steps needed for a standalone extension or webpage is to load the socket.io library than then you can load and use the streamroller api.

## Loading the socket.io library
### Web page
i.e for a standalone web page
```
<script src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.5/socket.io.js' type='text/javascript'></script>
<script src="streamroller-message-api.cjs"></script>
```
### Node.js
i.e.running 
in VSCode.
First install the socket library (at time of writing v2.0.5)
```
npm i socket.io@3.0.5
```
## Using the SreamRoller API

Then to use in the javascript file from the extension folder
import the api as you normally would
```
import * as sr_api from "../../data_center/public/streamroller-message-api.cjs";
```
### Getting up and running
To join the messaging system you call the setupConnection() function passing it three callback functions.

```
DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect);
```
```
i.e
function connect() {console.log("started")}
function message(data){console.log("message received ", data)}
function disconnect (reason){console.log("disconnected ",reason)}

const DataCenterSocket = sr_api.setupConnection(connect,message,disconnect);
```
This will return a handle to your connection 'DataCenterSocket' that you will use to send/receive messages.

The call back functions are functions you create and then pass the name of the function to the startup code

## Sending messages
To send a message you use the function 
```
sr_api.sendMessage( socket, data );
```
The socket is the return from the initial connection.
Data is defined in the [messages](MESSAGE_DOC.md) help file.
### Messages
Message have a specified format. A simple example is shown below. This would join you to the "TWITCH_CHAT" channel to receive any message sent by the extension that creates the channel. In order to read these messages you will need to refer to the extension that creates them to see their data layout. Or if in a rush just console.log(data) and you can probably work it out :D
```
var msg = 
    {
         "JoinChannel",
         "myextensionname",
         "TWITCH_CHAT",
    }
sr_api.sendMessage( DataCenterSocket, msg );
```
After running the above command your message handler (function 'message()' above) will get called anytime a message is sent on the "TWITCH_CHAT" channel. 