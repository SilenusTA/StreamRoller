# StreamRoller: This page is a work in progress
TBD Add images,descriptions for the User/Streamer pont of view.


- [StreamRoller: This page is a work in progress](#streamroller-this-page-is-a-work-in-progress)
- [Security](#security)
- [Background](#background)
  - [Live streaming](#live-streaming)
- [Getting Started](#getting-started)
  - [Overview/Installing](#overviewinstalling)
  - [Liveportal page (main control page for streamroller)](#liveportal-page-main-control-page-for-streamroller)
    - [Main Manu](#main-manu)
    - [Software update version](#software-update-version)
    - [Extension List](#extension-list)
    - [Chat Area](#chat-area)
    - [Discord Area](#discord-area)
    - [Alerts Area](#alerts-area)
    - [Extensions](#extensions)
  - [Autopilot (triggers and actions)](#autopilot-triggers-and-actions)
    - [Triggers and Actions](#triggers-and-actions)
      - [Triggers](#triggers)
      - [Actions](#actions)
    - [Some Advanced options for triggers/actions](#some-advanced-options-for-triggersactions)
      - [Timers and chaining tirggers/actions](#timers-and-chaining-tirggersactions)
    - [Macros](#macros)

# Security

**_Note: Currently the system is insecure. Security may be added later if deemed necessary. This is because the current use case for this software is in a controlled environment (ie at home behind your routers firewall)._**
# Background

## Live streaming

StreamRoller design is ultimatly to allow easier integration of anything you might want to use while streaming. ie twitch chat, discord chat mod messages, obs controls, twitch alerts etc.

The idea is to bring all these together so you can have one simple web page open while streaming with all the information controls you want on one page.

It should also allow for easier configurations for new idea's. ie send alerts to a LED display behind the streamer, post the Top'D to twitter etc. 

# Getting Started
## Overview/Installing
To run streamroller simply download and run the exe from the [releases page](https://github.com/SilenusTA/StreamRoller/releases)

This will install streamroller to %LocalAppData%\streamroller. You will also have a link on your desktop to run the application.

Cone you have the application (server) running simply visit http://localhost:3000 in a webbroswer to see the main liveportal stream page.

## Liveportal page (main control page for streamroller)

TBD: Add screenshot and explain each section.

This runs in a webbrowser and is meant to be used as your second monitor screen when streaming. Simply load http://localhost:3000 into a webbrowser (once the server is running) to start

This page will give you access to all your streaming needs, from Chat, OBS, Alters etc.
### Main Manu
TBD
### Software update version
TBD
### Extension List
TBD
### Chat Area
The chat window is used to display combined chat (when multistreaming) and allows sendin of chat to specific streams.
### Discord Area
TBD
### Alerts Area
TBD

### Extensions

Extensions are features in StreamRoller. ie the OBS extension provides the functionality to control OBS, read and display data from OBS etc. 

Each extension may provide extra webpages.
1. Credentials page (click the admin button in the live portal menu to see all extensions credentials pages)
   -  These allow you to provide login/authorization information (ie to use twitch you will need to authorize StreamRoller to access it).
2. Small Settings page
   - This is the settings page that you can access for that extensions. It is accessed by clicking on the extension name on the right hand side of the live portal page. 
   
   - These are used for regular settings you might want to access for that extension
3. Large Settings page
   - These settings are accessed from the Settings menu on the main live portal page
   - This page will provide the more indepth settings that you might only want to configure once and not change during normal streaming.


## Autopilot (triggers and actions)

The StreamRoller autopilot is where the power of streamroller comes into place. From this page you can link any extension to any other extension via 'triggers' and 'actions'
### Triggers and Actions
These are defined by each extensions depending on what features they provide. ie the twitch extensions have triggers when a subscription/chatmessage etc is received

You can then setup an action to happen when a specific trigger is received.

By doing this you can setup some pretty fun/interesting/useful control over your stream.

On the autopilot page (link in the top menu of the live portal page) you can see all the triggers and actions that every extension provides. Simply select an extension from the dropown list, then browse the dropdown list for the triggers or actions to see what is availble. Some extensions may only have a couple of items, others like Microsoft Flight Simulator 2020 can have a lot more (over 14,0000 options for MSFS sim variables) all acessable to read/write to.

#### Triggers
A Trigger is lets you know something happened. 
- Ie when you press 'Start Streaming' in OBS a trigger is created and sent out. You can then set an action to happen when StreamRoller see's this trigger.
- Each trigger will have some data contained within it, is a chat message from youtube/twitch may contain sender name, message text, profile picture etc.
- You can use this data to decide on how you want to use this trigger
  - ie only match this trigger if the chat message starts with !somechatcommand or is sent by a mod or some particular username
  - There are many ways to filter the trigger you want to filter out and do something based on when that trigger is seen
- Data from the triggers can be either ignored/used to filter out specific messaages or passed through to an action you wish to perform
  - ie you could decide to filter based on a chat messaage mod flag + specific command ie '!changeobsfilter darkfilter' and then send that to a specific action ie OBS "setfilter darkfilter true' etc

  
#### Actions
An Action is something you want to tell an extension to do. When a trigger is selected you will pair this up with an action to be performed when that trigger happens.
- Actions have parameters than can be entered manually or copied from a trigger.
- eg suppose you had a donation through streamlabs. You could trigger on the donation and send a chata message "Thank you very much to %sender% for donating %ammount%"
  - Note that action valuse surrounded by % are a variable name from the trigger.
- You can setup as many actions of each trigger, ie you could also add a second trigger/action pairing for the donation to flash your philips hue lights. Both will be carried out.


### Some Advanced options for triggers/actions
#### Timers and chaining tirggers/actions
Once you get used to doing simple single T -> A pairings you can then extend this dramatically by chaining them together or using timers
- Many actions will fire a trigger off so you can trigger on an action you asked for
- The timer package can allow some very useful setups. ie .
  1) Trigger_startStreming (obs start button pressed) -> actionSetTimer(name=StartCommercial,30minutes)
  2) Trigger_TimerEnded(name=StartCommercial) -> actionTwitchStartCommercial
  3) Trigger_TimerEnded(name=StartCommercial) -> actionSetTimer(name=StartCommercial,30minutes)
  Note this would start and continue running a timer every 30 minutes to play an advert on twitch

### Macros
Macros are used to create your own version of a StreamDeck. A Macro is a fake trigger that can be displayed as button on screen (with custom graphic/colors).
Once you setup a macro, it will then appear in the triggers secion on theauto pilot page so it can be used just like any other trigger.
