# Startup Sequence

- [Startup Sequence](#startup-sequence)
  - [OverView](#overview)
  - [Server Sequence](#server-sequence)
  - [Extension Sequence](#extension-sequence)
  - [EdgeCase: Extension started but without StreamRoller websockect connection](#edgecase-extension-started-but-without-streamroller-websockect-connection)
  - [Post Startup messages](#post-startup-messages)
  
## OverView

On startup StreamRoller will scan the extensions directory for extension to load into the server.
These extensions are expected to startup a websocket to the StreamRoller server with the passed in data (ipaddress etc). The server will also pass in a handle to an express app that the extensions can use to display webpages if they wish.

## Server Sequence

The startup sequences is as follows.

- start any extensions found
- monitor for incoming connections
- maintain a list of extensions started and any other extensions that connect
- wait for extensions to send a "ExtensionReady"
  This message is sent once an extension has connected to any external API's etc.
  During this period extensions should refrain from sending messages to other extensions that might not be ready yet
  Extensions can request configs/credentials/data from the server during this period.
- When all extensions that were connected have sent the "ExtensionReady" message the server will send out a "StreamRollerReady" message so extensions can start sending messages to other extensions
- After 10 seconds (if not sent already) the server will send out the "StreamRollerReady" message anyway to avoid extensions blocking the startup of the system.

## Extension Sequence

When started an extension should connect to the websocket.

- On receiving a call to the onConnected callback (from the sr_api.setupConnection function)
    send a "ExtensionConnected" message;
- Perform any tasks needed to be read to work (connect to API's, receive configs etc)
- Once an extension is ready to start working
    send a "ExtensionReady" message.

## EdgeCase: Extension started but without StreamRoller websockect connection

There might be a case where the StreamRoller started extension doesn't connect back to the websocket. This could be due to just wanting to use the StreamRoller Express App to display data or where an extension requires a game mod that handles the connection.

For these cases you can call the 'readyMessagefn(extensionname)' function that is passed in during the initial startup call

```javascript
initialise (app, host, port, heartbeat, readyMessagefn)
```

## Post Startup messages

After startup the server may detect a new extension connecting (a game has started or webpage loaded). When this happens StreamRoller will send out a "StreamRollerUpdating" message while it waits for the ready flag from the new extension. When the new extension is connected the "StreamRollerReady" message is resent.

This can be useful for extensions that rely on other extensions that are not always connected.

When a new extension connected if an extension has previously sent a "RequestExtensionsList" or "RequestAllExtensionsList" then an updated "ExtensionList" message will be re-sent to the original requester
