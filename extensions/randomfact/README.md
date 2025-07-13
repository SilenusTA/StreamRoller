<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# RandomFact
Contents
- [RandomFact](#randomfact)
  - [Outgoing channel : "RANDOMFACT\_CHANNEL"](#outgoing-channel--randomfact_channel)
  - [Description](#description)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "RANDOMFACT_CHANNEL"
## Description
Request a random fact and the result will be posted back.
## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sun, 13 Jul 2025 18:24:16 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

### Triggers

| name | trigger | description |
| --- | --- | --- |
| RandfactPoster | trigger_RandomFact | An interesting or amusing random fact was received |

### Actions

| name | trigger | description |
| --- | --- | --- |
| RandfactRequest | action_RequestRandomFact | Requests a random fact |
