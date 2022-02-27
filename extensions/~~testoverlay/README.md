# StreamRoller Test Overlay
## Outgoing channel : none
- [StreamRoller Test Overlay](#streamroller-test-overlay)
  - [Outgoing channel : none](#outgoing-channel--none)
  - [About](#about)
  - [Usage](#usage)
  - [Running on the server](#running-on-the-server)
  - [Running standalone](#running-standalone)
    - [getting access to the api](#getting-access-to-the-api)
      - [Method 1](#method-1)
      - [Method 2](#method-2)
  - [Expanding the Overlay (not related to StreamRoller)](#expanding-the-overlay-not-related-to-streamroller)
## About
The current version has 3 features added
- Stream Follow
  - Triggers an animated popup box
- Streamlabs Donation
  - Adds donation text message to a div
- Discord message
  - Puts discord message in a div
- Test button
  - Runs a test on the animated alert just to check the css alert code is working correctly
## Usage
The overlay can be used in two ways
- From the server
- Standalone


## Running on the server
To run on the server just start the server up as normal (npm start) and then point your browser at <host>:<port>/testoverlay of the server

For the default settings this would be http://localhost:3000/testoverlay

## Running standalone
This is mainly used when running host and server on different machines.

To run the overlay standalone you will first need to start the server (in order to get the data)

After starting the server you will need to add the server name(host) and port into the code so it knows where to connect to.

There are two things needed to run the overlay. First you need access to the streamroller-message-api.cjs and second the connection to the server itself.
### getting access to the api
There are two ways to do this.
#### Method 1
In the demo code you will need to update the line changing the server:port to where the remote machine it is running on (maybe another IP on the local system, ie 192.168.1.5:3000/...)
``` 
<script src="http://localhost:3000/streamroller-message-api.cjs"></script>
```
#### Method 2
Alternativly you could copy the file into the same directory as the overlay. (copy from the backend/data_center/public folder) and then just reference that in the src command
``` 
<script src="/streamroller-message-api.cjs"></script>
```
###
Provide the host and port in the URL to access the server for messages
```
file:///repos/StreamRoller/extensions/testoverlay/testoverlaystandalone.html?host=localhost&port=3000
```
## Expanding the Overlay (not related to StreamRoller)
An overlay (streaming browser source as added to OBS) is simply a webpage with transparent background that OBS puts over the top of youre video/camera etc

As it stands the overlay is pretty useless for streaming but it could be easily developed into a full overlay by adding in your backdrops, alert animations etc.

You can have multiple overlays in the same scene, ie one for a camera surround or maybe a title overlay if you wish. Doing it in an overlay gives more control than doing it in OBS as now you could have different camera surrounds depending on your game and feed data into the bottom of it to display health etc

Your overlay is only limited by your ability to create web page components and the data sources you have access to, the lattter being where StreamRoller comes into play
