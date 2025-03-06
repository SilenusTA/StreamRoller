<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # Discord Chat
Contents
- [Discord Chat](#discord-chat)
- [Setup](#setup)
  - [Outgoing channel : "DISCORD\_CHAT"](#outgoing-channel--discord_chat)
  - [Authorization fields](#authorization-fields)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
# Setup

## Outgoing channel : "DISCORD_CHAT"
## Authorization fields
- Name: DISCORD_TOKEN 
- Value: discord bot token

## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Thu, 06 Mar 2025 06:12:14 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| DiscordMessageRecieved | trigger_DiscordMessageReceived | A message was posted to a discord chat room |

### Actions

| name | trigger | description |
| --- | --- | --- |
| DiscordPostMessage | action_DiscordPostMessage | Post a message to a discord channel |
