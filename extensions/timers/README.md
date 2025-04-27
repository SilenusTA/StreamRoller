<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# Timers

Contents

- [Timers](#timers)
  - [Description](#description)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

## Description

Allows the setting, monitoring and triggering actions from timers. This gives teh ability to chain triggers/actions together with timed gaps etc

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sun, 27 Apr 2025 16:28:18 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| TimerStart | trigger_TimerStarted | A timer was started |
| TimerEnd | trigger_TimerEnded | A timer has finished |
| TimerRunning | trigger_TimerRunning | A timer is running |


### Actions

| name | trigger | description |
| --- | --- | --- |
| TimerStart | action_TimerStart | Start/Restart a countdown timer, duration in seconds |
| TimerStop | action_TimerStop | Stop a running timer |

