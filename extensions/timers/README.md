# Timers
Contents
- [Timers](#timers)
  - [Outgoing channel : "TIMERS\_CHANNEL"](#outgoing-channel--timers_channel)
  - [Description](#description)
  - [Features](#features)
    - [Standard Features](#standard-features)
    - [Extended features (working with adminpage extension)](#extended-features-working-with-adminpage-extension)
## Outgoing channel : "TIMERS_CHANNEL"
## Description
The Timers extension is designed to give a starting point for you to copy and paste into your own extension.

The idea is to save the ammount of time/code needed to get up and running with you own extension

## Features
The Timers has the following features implemented in it
### Standard Features
- Connect to server and consume messages
- Saving/Loading config settings from the server for persistance for the next run.
- Logging commands to show the preferred way of logging messages (log,info,warn,err)
  - It is recommended to use 'log' for most messages to trace where the code is and what it is doing and then add 'info' to expand on these. The 'log' messages are mostly to track down where the code is in case of errors or to report status of the code. Recommended format of messages is currently 
  
  ```
  log("Extension " + EXTENSION_NAME + "." <filename> + "." <functionname>, message);
  ```

- Creating a channel to broadcast your data on
  - This is effectivly your channel ("TIMERS_CHANNEL") to send out data on that you are providing to the system. ie if you are a chat application then you would send chat message out on this channel
- Joining a Channel
  - These are other extensions channels that you want to consume data from. in this case we join the 'STREAMLABS_ALERT' channel so we can consume and process these messages. All we do at the moment is log that data to the console
  
  You can always browse other extensions to see how they implement things in the system to get other ideas
  
### Extended features (working with adminpage extension)
- Provide an SettingsWidgetSmall
  - SettingsWidgetSmalls are something that the adminpage extension can use to display a popup box (a modal) with code you provide. These are normally used for settings. This feature of the adminpage will put your code onto a link so that when a user clicks it your modal will be shown. If the modal is a form then when the user clicks the form the data will be sent back to you. Usefull for settings etc.
- Process SettingsWidgetSmall data
  - This is the data sent back from the modal (popup) when the user clicks the submit button. in this case our modal just has a checkbox and text field and all we do is save the data
  
  Note that the SettingsWidgetSmall part of this extension is something that is only needed by the settingswidgetsmall page extension. It is not requied at all if you don't want any settings to be shown or changed from the admin page.
  
  Other extension can implement their own style of this data. ie an Overaly could reqest code to be displayed. the livestreampage addon will probably use these to display status information in future.