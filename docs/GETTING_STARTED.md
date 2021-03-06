# StreamRoller
- [StreamRoller](#streamroller)
- [Security](#security)
- [Background](#background)
  - [Live streaming](#live-streaming)
  - [Moving things to other PC's](#moving-things-to-other-pcs)
  - [Adding functionality/control with ease](#adding-functionalitycontrol-with-ease)
- [How it works](#how-it-works)
  - [Overview](#overview)
    - [Extensions](#extensions)
  - [Ideas for usage](#ideas-for-usage)
- [Setup and usage](#setup-and-usage)
  - [Installation](#installation)
  - [Getting started](#getting-started)
  - [Pre start settings](#pre-start-settings)
  - [Running the system](#running-the-system)
  - [Using the system](#using-the-system)
_Note: this documentation is currently being written and as such will probably be incorrect but it gives and idea of the vision of the project and an aid to who to get it up an running if you wish to use it_

# Security

**_Note: Currently the system is insecure. Security may be added later if deemed necessary. This is because the current use case for this software is in a controlled environment (ie at home behind your routers firewall)._**
# Background

## Live streaming

StreamRoller design is ultimatly to allow easier integration of anything you might want to use while streaming. ie twitch chat, discord chat mod messages, obs controls, twitch alerts etc.

The idea is to bring all these together so you can have one simple web page open while streaming with all the information controls you want on one page.

It should also allow for easier configurations for new idea's. ie send alerts to a LED display behind the streamer, post the Top'D to twitter etc. 

Over time more data handlers (and API's for them) will be added making it easier to link different parts of the streaming experience together.

## Moving things to other PC's
By using websockets to link the system, you could run the datacenter and all the system on a another PC and simply keep open the live streaming page and OBS on the streaming PC. ie chat applications, alters contorl, overlays can be moved off the streaming machine.
Mod pages can be moved to the moderators own PC with the option of giving as much control to the moderators as you, the streamer, has if you trust them. 
You could even run each extension on it's own machine if you wished. Maybe you have a rasberry pi weather station you want to put an extension on to send the data into the sytem.

## Adding functionality/control with ease
Upgrading/Extending the system is meant to be as easy as possible. If you can do a small amount of programming then the system should be accessable for you to play with (see [Extensions - Getting started](EXTENSIONS_GETTING_STARTED.md) for how easy it is to do something yourself)


# How it works
## Overview
Streamroller works by having one central data handler that all data is sent into the system and sent back out on data channels that extensions can register to monitor (OBS,twitch chat, twitch control etc) to do whatever work they wish to do with them.

### Extensions

These can be any code that registers with the StreamRoller backend. The can received/send data. Some extensions will be simple data producers (twitch alerts, chat data etc), others will be consumers (overlays, logging, controlling OBS etc) and some will be workers that hold the logic (ie a chat moderator extension that will moderate all the chat extensions, discord/twitch or posting twitch messages on twitter, alerts on discord etc)

## Ideas for usage

Donations: Flash your lights and put an alert on stream and in chat, take a twitch clip and post on twitter etc

ChatCommand: ie a darkmode chat command redeemed with channel points could be used to switch to a dark themed scene in obs, change/move a camera source and dim the room lights.

An esports system where each gamers PC has an extension to capture game data/scores and send it into the system
# Setup and usage

## Installation
The system runs using a webserver called [node.js](https://nodejs.org/en/download/) which must be installed first to be able to use the StreamRoller system (note extensions may or may not need this if run remotely, each extension will have it's own requeirements. ie a webpage extension that just consumes data for display will only need a webbrowser to run)

If you wish to modify the system (set up your own commands etc) then the recommended editor is [VSCode](https://code.visualstudio.com/download). At this early stage in development it is recommended to use VSCode for the install until a standalone installer is created.

## Getting started
Summary: Download the repository and save to a folder of your choice. CD to the route directory and install the additional requirements

Note: The required install time will depend on the extensions installed and their dependancies, it could be a few seconds to a few minutes. Each extension will install their own requirements, ie a discord extension might install the discordjs library.

Inside the download folder run the following command
```
npm install
```
## Pre start settings
You may need to perform addition steps for extension authorization requirements (to be able to log into to twitter/discord etc)

To figure out what is needed here check out each extensions readme (or run the system and click the links on the extension names).

To enter the details navigate to the adminpage and enter each item individually. ie the twitter app requires four items so you will need to enter 4 page submits (each item will get added to the auth for that extension)
## Running the system
To finally start the system simply enter the following command
```
npm start
```
At this point the system is now running. You should see some output on the console/command window to indicate the system is running.

## Using the system
Now it is up and running the usage will depend on your requirements.
One option is to open the admin or live portal webpages (from the adminpage and livepage extension)
Simply open a webbrowser and enter
```
localhost:3000
```
Now is the time to decide on what you want to do with the system. 
Look at the [extension](EXTENSION_LIST.md) pages and see what they can do and how to use them.
