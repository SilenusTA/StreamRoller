<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # MSFS2020
Contents
- [MSFS2020](#msfs2020)
  - [Outgoing channel : "MSFS2020\_CHANNEL"](#outgoing-channel--msfs2020_channel)
  - [Description](#description)
  - [Triggers/actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "MSFS2020_CHANNEL"
## Description
This extension connects to Microsoft Flight Simulator using the simconnect system. 
It will allow the reading and writing of variables to the sim so that you can trigger on them or perfrom actions on them.
ie you can change your obs settns/overlay/chat based on game variable and also setup chat commands etc to control parts of the game
## Triggers/actions
<div style="color:red">

> Note that there are thousands of options for MSFS2020. These will only appear if the game is
running and the extension connected.
</div>


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Wed, 05 Mar 2025 00:47:17 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| onRequest_PLANE LATITUDE LONGITUDE | trigger_onRequest_PLANE LATITUDE LONGITUDE | The current lat long in one message with separate variables |

### Actions

| name | trigger | description |
| --- | --- | --- |
| PLANE LATITUDE LONGITUDE_get | action_PLANE LATITUDE LONGITUDE_get | Get the current lat long in one message |
