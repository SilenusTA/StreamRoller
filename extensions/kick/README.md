<!-- this file will be auto updated for triggers and actions when the apidocs automatic document builder is run during ci process for delivering a build
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To test how the final readme will look run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load the file and use the exported 'triggersandactions' variable to create the tables shown in the parsed README.md files -->
# Kick

Contents

- [Kick](#kick)
  - [Description](#description)
  - [About](#about)
  - [Credentials](#credentials)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

## Description

Provides StreamRoller with triggers and actions relating to kick streaming.



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Mon, 05 May 2025 07:13:55 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

## About

Provides connection to OBS for information and control.

## Credentials

Follow the steps on the the StreamRoller main settings page for the extension

## Triggers/Actions

| name | trigger | description |
| --- | --- | --- |
| Kick message received | trigger_ChatMessageReceived | A chat message was received. htmlMessage field has name and message combined |
| Category search results | trigger_searchedKickGames | Results of a search request in a JSON object |
| Category history cleared | trigger_categoryHistoryCleared | The Category history was cleared |
| Title history cleared | trigger_titleHistoryCleared | The Title history was cleared |
| GamedChanged | trigger_KickGamedChanged | The Game was changed |
| TitleChanged | trigger_KickTitleChanged | The Title was changed |
UpdatedDocTime

### Triggers

ReplaceTAGForTriggers

### Actions

| name | trigger | description |
| --- | --- | --- |
| KickChatSendChatMessage | action_SendChatMessage | Post a message to Kick chat (Note user is case sensitive) |
| SearchForKickGame | action_searchForKickGame | Triggers the action trigger_searchedKickGames |
| ClearCategoryHistory | action_clearCategoryHistory | Clears out the Category history list |
| ClearTitleHistory | action_clearKickTitleHistory | Clears out the Title history list |
| SetTitleAndCategory | action_setTitleAndCategory | Changes teh current stream title and category |

