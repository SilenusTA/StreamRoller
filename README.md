# Streamroller (current dev. stage: Prototyping)
## Table of Contents

- [Streamroller (current dev. stage: Prototyping)](#streamroller-current-dev-stage-prototyping)
  - [Table of Contents](#table-of-contents)
  - [What is is?](#what-is-is)
  - [Why did I start it](#why-did-i-start-it)
  - [StreamRoller Direction/Development path](#streamroller-directiondevelopment-path)
- [Security](#security)
- [Installing](#installing)
  - [Step 1: Install node](#step-1-install-node)
  - [Step 2: Download Streamroller](#step-2-download-streamroller)
  - [Step 3: Intstall](#step-3-intstall)
  - [Step 4: Configure any extensions (password/tokens etc)](#step-4-configure-any-extensions-passwordtokens-etc)
  - [Step 5: Start StreamRoller](#step-5-start-streamroller)
- [Current Functionality](#current-functionality)
  - [Some of the current extensions](#some-of-the-current-extensions)
    - [Adminpage](#adminpage)
    - [Livestreamingportal](#livestreamingportal)
    - [Twitchchat](#twitchchat)
    - [Discord Chat](#discord-chat)
    - [Streamlabs_api](#streamlabs_api)
  - [In progress](#in-progress)
  - [TBD ideas for extensions](#tbd-ideas-for-extensions)
- [Links](#links)
  - [General links](#general-links)
  - [Extension links](#extension-links)
  - [Dev links](#dev-links)

## What is is?

StreamRoller is a tool designed to bring all the data needed for streaming into one system to make it easier to expand your streaming features. i.e. want to post your alerts to discord/twitter? you can do that without having to code a discord and twitter bot. Just load the existing extensions for twitter and discord, then forward the alert message to them to do the work for you.

As the core extensions are expand you should be able to turn any idea you might want to do into reality with a minimum of effort.

## Why did I start it
I found while streaming I would have so many programs open (discord, twitch, chatty, UpDeck (ipad style streamdeak),streamlabschatbot) and ended up switching between programs depending on what I wanted.

I was also finding I wanted to do things that I can't easily do without. ie posting donation alerts on twitter or discord. Giving chat some extra contorols (maybe some OBS scene items they can turn on or off etc).

## StreamRoller Direction/Development path
Currently StreamRoller should be considered in prototyping stage (yup not even Alpha yet). There will probably be lots of big changes as the design ideas change.

The end goal will reamin the same, a simply and easy system to use to get your ideas working. Want to have donations written on a whiteboard behind you by a 3D printer style aparatus, a few lines of code will do it (assuming someone has written the extension for that devide already)

The main goals of StreamRoller are the following:

- Single full screen webapp with all live streaming controls on one page (OBS,chat,bots etc).
- Reduce the number of programs needed to stream by integrating extensions for things like chat, bots, alerts etc all into Streamroller extension.
- Easy to extend by anyone with a minimal of coding experience.
- Distributed. Extensions run off sockets so they can be distributed if required. 
  - Extensions can be run on any PC as long as they have internet access to the backend. ie. A moderator app can run on the moderators PC, a weather app can run on a RaberryPI in the shed etc.
  - If IRL streaming the live control page could be on a phone while the rest runs at home
  - if two PC's are available the StreamRoller system can run on a second PC with only a webbrowser needing to connect to it for cotrolling everything.
# Security

_Note: Currently the system should be considered insecure._

Security will be added later. 

The current usage is for this software to be run in a controlled environment (ie at home behind your routers firewall). 

Login/users and SSL security will be added later

# Installing

## Step 1: Install node
Streamroller needs the [node.js](https://nodejs.org/en/download/) webserver to run. It is recommended to use [VSCode](https://code.visualstudio.com/download) to modify/change/add extra features. This VSCode editor provides a lot of nice features for development.
## Step 2: Download Streamroller
Grab a copy of this repo and store it somewhere 
## Step 3: Intstall
cd into the StreamRoller directory and run the following commands

These install the required dependancies needed. This may take a few minutes the first time it is run.

```
npm install
```
## Step 4: Configure any extensions (password/tokens etc)

If connecting to twitch/discord/youtube etc you will need to configure your loging credentials/tokens etc as required by the extensions (these will ultimatly be configurable via the admin page).

Most extensions require these keys/tokens to be set in the environment variables in the following format (note you may need to restart VSCode or the teminal/command promt after setting these in order for them to be loaded)

```
SL_SOCKET_TOKEN=<token>
DISCORD_TOKEN=<token>
```
## Step 5: Start StreamRoller
Next we start the server

```
npm start
```

At this point the node webserver will start up and load any extensions currently in the extension directory. point the webrowser at http://localhost:3000 to see it running.

# Current Functionality
A lot of funtionality at this point is either non existant or in progress. If you have a play with the system and produce something useful or expand an existing extension please let me know.

I'd expect people to focus on one extension rather than try and understand the backend. i.e. a moderator extension that can be used by all chat extensions, such that if it needs to ban a user it will just send a message to the twitch/youtube extension rather than connect to the chat itself.

## Some of the current extensions
See the [Extension List](docs/EXTENSION_LIST.md) for the full list
### [Adminpage](extensions/adminpage/README.md)

Provides a webpage to show the status of the system and all settings for extensions that can be configured
### [Livestreamingportal](extensions/livestreamingportal/README.md)
- Supplies streamlabs alerts overlay via STREAMLABS_ALERT channel
### [Twitchchat](extensions/twitchchat/README.md)
- Currently just gets chat from a given twitch channel and sends it out on the "TWITCH_CHAT" cannel. 
- TBD 
  - Add Login to allow posting of messages
  - Add user controls to allow banning etc
### [Discord Chat](extensions/discordchat/README.md)
- A skelton discord chat extension Channel "DISCORD_CHAT"
- Post alerts to a named discord channel
- Provides messages from a given discord channel (currently used in live page as a Mod messages window)
### [Streamlabs_api](extensions/streamlabs_api/README.md)
Channel STREAMLABS_ALERTS
- Povides alerts data from streamlabs for twitch alerts and streamlab donations
- Used in the discord chat extension to alerts them to discord
- Used in demo-overlay (I also run my overlay off StreamRoller so that uses these as well
- 
## In progress
- pretty much everything currently available
## TBD ideas for extensions

The current focus in on twitch streaming (although the streamlabs api currently supports other platforms as is). Other platforms will be integrated in time (Youtube etc)

- OBS: to give the ability for the live page to control OBS scense etc
- Twitch pub/sub: to allow twitch control (setting title, category, bannign users etc)
- IRC chatbot: one bot that will work with all the chat extension to provide a single moderator bot for all chat channels (discord/twitch/youtube/facebook etc)
- NDI stream extension to allow easy integration of external video feeds

# Links

## General links
- [Getting Started](docs/GETTING_STARTED.md) 
  
  How to install/start/use the system
- [Extension List](docs/EXTENSION_LIST.md)
  
  List of current extensions with links to additional documentation
## Extension links
  These can be found by following the Extension list above and clicking the extension name you are interested in.
## Dev links
- [Getting start with extensions](docs/EXTENSIONS_GETTING_STARTED.md)

  Getting started with developing extensions
- [Messages](docs/MESSAGES_DOC.md)
  
  A description of how to use the message system to send/receive data
