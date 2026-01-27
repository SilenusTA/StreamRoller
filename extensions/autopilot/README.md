<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # AutoPilot
## Outgoing channels : AUTOPILOT_BE, AUTOPILOT_FE
- [AutoPilot](#autopilot)
  - [Outgoing channels : AUTOPILOT\_BE, AUTOPILOT\_FE](#outgoing-channels--autopilot_be-autopilot_fe)
- [About](#about)
  - [Simple example](#simple-example)
  - [Macro triggers](#macro-triggers)
  - [Advanced triggers](#advanced-triggers)
    - [Multiple actions](#multiple-actions)
    - [Using trigger names](#using-trigger-names)
    - [Using timers](#using-timers)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

# About
Allows the user to pair up triggers and actions in order to perform tasks in streamroller.
## Simple example
Sending a bits donation message on twitter (image from setup dialogs):
<img src="https://raw.githubusercontent.com/SilenusTA/StreamRoller/refs/heads/master/extensions/autopilot/images/bits_to_twitter.png" title="bits to twitter" alt="bits to twitter">

Quizbot example handling all the quizbot functionality (image from existing trigger/action pairings)
<img src="https://raw.githubusercontent.com/SilenusTA/StreamRoller/refs/heads/master/extensions/quizbot/exampletriggers.png" title="example quzbot triggers" alt="example quzbot triggers">

## Macro triggers
To setup a streamdeck style macro to trigger an action simply create a macro button and then use that as the trigger for an action

## Advanced triggers
You can setup quite advanced triggers and actions by utilizing chaining and the timer extension.
Most actions you call will cause a resulting trigger to fire.
ie. 
action "change stream title" will cause a twitch extension 'stream title changed' trigger to happen when twitch calls back to tell us the title has changed.
### Multiple actions
You can set as many actions to trigger from the same trigger if you need to. If you need them triggered in a certain order/delay then use the timers (see below)
### Using trigger names
You can set an identification in the action that will be passed back by a trigger so you can filter that particular response out. (note some triggers/actions might still be missing the triggerID/actionID fields. please let me know if you find this field is missing so I can add them in) 
### Using timers
Timers provide a great way to give more control over the system. You can set a timer with a 1 second timeout and use that as a starting trigger for serveral pairings. You can also then trigger a timer from a macro button like any other trigger.


## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Tue, 27 Jan 2026 21:20:40 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

### Triggers

| name | trigger | description |
| --- | --- | --- |
| Macro Triggered | trigger_MacroTriggered | A Macro was triggered |
| AllTriggers | trigger_AllTriggers | Catches all triggers (for debugging) |

### Actions

| name | trigger | description |
| --- | --- | --- |
| Activate Macro | action_ActivateMacro | Activate a macro function |
| Set Group Pause State | action_SetGroupPauseState | Pause/Unpause groups |
| LogToConsole | action_LogToConsole | Log triggers to console |

