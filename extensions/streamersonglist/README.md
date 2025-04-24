<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# StreamerSongList

Contents

- [StreamerSongList](#streamersonglist)
  - [About](#about)
  - [Credentials](#credentials)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

## About

Handles song request queues from the [StreamerSongList](http://StreamerSongList.com/) website. Shows queue, add/remove/played new songs etc

## Credentials

Follow the steps on the the StreamRoller main settings page for the extension

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Thu, 24 Apr 2025 00:00:56 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| SSLSongAddedToQueue | trigger_SongAddedToQueue | Song was added to queue |
| SSLCurrentSongChanged | trigger_CurrentSongChange | Current song changed |


### Actions

| name | trigger | description |
| --- | --- | --- |
| SSLAddSongToQueue | action_AddSongToQueue | Add a song to the queue |
| SSLPlaySong | action_MarkSongAsPlayed | Mark a song as played |

