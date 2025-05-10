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
- [About](#about)
  - [Credentials](#credentials)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 10 May 2025 04:31:03 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

# About

Provides connection to OBS for information and control.

## Credentials

Follow the steps on the the StreamRoller main settings page for the extension

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

