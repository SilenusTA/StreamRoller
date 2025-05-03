<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# SysInfo Extension
Contents
- [SysInfo Extension](#sysinfo-extension)
  - [Outgoing channel : "SYSINFO\_CHANNEL"](#outgoing-channel--sysinfo_channel)
  - [Description](#description)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "SYSINFO_CHANNEL"
## Description
The sysinfo extension is designed to provide system information for other extensions to use. For some values to be read you may need to run streamroller 
in admin or sudo mode. For example on windows a lot of the data cannot be read by a user (only an admin). This protects things like uuid's from being read 
but there are also some other things like temperatures that might not show up unless run as admin. On windows you can do this by selecting the StreamRoller 
icon on the desktop and right clicking to set it to run as administrator. Alternativly you can start a command prompt as administrator (right click and 
select run as administrator) and then run StreamRoller from that prompt

## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 03 May 2025 17:47:41 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

### Triggers

| name | trigger | description |
| --- | --- | --- |
| sysInfoCPUData | trigger_sysinfoCPUData | Data about the CPU |
| sysInfoCPUTemperatures | trigger_sysinfoCPUTemperatures | CPU Temperatures if available (you may need to run StreamRoller as admin to allow windows to read this) |
| sysInfoGPUData | trigger_sysInfoGPUData | GPU Data |

### Actions

| name | trigger | description |
| --- | --- | --- |
| sysInfoGetCPUData | action_sysInfoGetCPUData | Sends out a trigger with the CPU Data |
| sysInfoGetCPUTemperatures | action_sysInfoGetCPUTemperatures | Sends out a trigger with the CPU Temperatures |
| sysInfoGetGPUData | action_sysInfoGetGPUData | Sends out a trigger with the GPU Data |
