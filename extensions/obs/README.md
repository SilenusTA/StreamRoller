<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# OBS

Contents

- [OBS](#obs)
- [Setup](#setup)
  - [Outgoing channel : "OBS\_CHANNEL"](#outgoing-channel--obs_channel)
  - [Authorization fields](#authorization-fields)
    - [Field 1](#field-1)
    - [Field 2](#field-2)
    - [Field 3](#field-3)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 12 Apr 2025 14:26:16 GMT*

# Setup

## Outgoing channel : "OBS_CHANNEL"

## Authorization fields

#### Field 1

- Name: "obshost"
- Value: hostname (ie localhost)

#### Field 2

- Name: "obsport"
- Port to use

#### Field 3

- Name: "obspass"
- Value: password

Provides connection to OBS for information and control.

## Triggers/Actions

| name | trigger | description |
| --- | --- | --- |
| OBSStreamingStarted | trigger_StreamStarted | Stream Started |
| OBSStreamingStopped | trigger_StreamStopped | Stream Stopped |
| OBSRecordingStarted | trigger_RecordingStarted | Recording Started |
| OBSRecordingStopped | trigger_RecordingStopped | Recording Stopped |
| OBSSceneChanged | trigger_SceneChanged | Scene was changed |
UpdatedDocTime

### Triggers

ReplaceTAGForTriggers

### Actions

| name | trigger | description |
| --- | --- | --- |
| OBSStartStream | action_StartStream | Start Streaming in OBS |
| OBSStopStream | action_StopStream | Stop Streaming in OBS |
| OBSStartRecording | action_StartRecording | Start Recording in OBS |
| OBSStopRecording | action_StopRecording | Stop Recording in OBS |
| OBSToggleFilter | action_ToggleFilter | Enable/Disable a filter (true/false) |
| OBSChangeScene | action_ChangeScene | Switch to the OBS scene provided by sceneName |
| OBSEnableSource | action_EnableSource | Turn a source on or off, ie to enable animations, cameraas etc |
| OBSToggleMute | action_ToggleMute | Toggles mute on the source selected, suggest that mic is put in to it's own scene and imported into all others to make this universal |
| OBSSetSceneItemTransform | action_SetSceneItemTransform | Sets the Scene Transform for a given item (note rotation respects the alignment in OBS. It's recommneded to set alightment in OBS to center) |

