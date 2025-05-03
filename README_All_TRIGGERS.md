# All Triggers currently in Streamroller

## Overview

### Current count (5,297)

```Triggers: 3,717 / Actions: 1,580```

Contents

- [All Triggers currently in Streamroller](#all-triggers-currently-in-streamroller)
  - [Overview](#overview)
    - [Current count](#current-count)
  - [Description](#description)
  - [Triggers/Actions](#triggersactions)
    - [autopilot](#autopilot)
    - [chatbot](#chatbot)
    - [discordchat](#discordchat)
    - [kick](#kick)
    - [msfs2020](#msfs2020)
    - [multistream](#multistream)
    - [obs](#obs)
    - [philipshue](#philipshue)
    - [quizbot](#quizbot)
    - [randomfact](#randomfact)
    - [streamersonglist](#streamersonglist)
    - [streamlabs_api](#streamlabs_api)
    - [sysinfo](#sysinfo)
    - [timers](#timers)
    - [twitch](#twitch)
    - [twitchchat](#twitchchat)
    - [twitter](#twitter)
    - [users](#users)
    - [youtube](#youtube)
## Description

Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.
Some triggers and action have to be manually parsed as they are dynamic (ie the thousands that are generated for MSFS2020)

Table last updated: *Sat, 03 May 2025 17:47:41 GMT*## Extensions

## autopilot

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
## chatbot

### Triggers

| name | trigger | description |
| --- | --- | --- |
| OpenAIChatbotResponseReceived | trigger_chatbotResponse | The OpenAI chatbot returned a response |
| OpenAIImageResponseReceived | trigger_imageResponse | The OpenAI chatbot returned a image |
### Actions

| name | trigger | description |
| --- | --- | --- |
| OpenAIChatbotProcessText | action_ProcessText | Send some text through the chatbot (users in original message on the ignore list will not get processed) |
| OpenAIChatbotChatMessageReceived | action_ProcessChatMessage | This message will be treated as a standard message from a chat window and will be added to conversations for auto responses as well as being tested for direct messages |
| OpenAIChatbotProcessImage | action_ProcessImage | Send some text through the chatbot to create an image |
| OpenAIChatbotSwitchProfile | action_ChangeProfile | Switches the chatbot to the given profile |
## discordchat

### Triggers

| name | trigger | description |
| --- | --- | --- |
| DiscordMessageRecieved | trigger_DiscordMessageReceived | A message was posted to a discord chat room |
### Actions

| name | trigger | description |
| --- | --- | --- |
| DiscordPostMessage | action_DiscordPostMessage | Post a message to a discord channel |
## kick

### Triggers

| name | trigger | description |
| --- | --- | --- |
| Kick message received | trigger_ChatMessageReceived | A chat message was received. htmlMessage field has name and message combined |
| Category search results | trigger_searchedKickGames | Results of a search request in a JSON object |
| Category history cleared | trigger_categoryHistoryCleared | The Category history was cleared |
| Title history cleared | trigger_titleHistoryCleared | The Title history was cleared |
### Actions

| name | trigger | description |
| --- | --- | --- |
| KickChatSendChatMessage | action_SendChatMessage | Post a message to Kick chat (Note user is case sensitive) |
| SearchForKickGame | action_searchForKickGame | Triggers the action trigger_searchedKickGames |
| ClearCategoryHistory | action_clearCategoryHistory | Clears out the Category history list |
| ClearTitleHistory | action_clearKickTitleHistory | Clears out the Title history list |
## msfs2020

### Triggers

| name | trigger | description |
| --- | --- | --- |
| onRequest_PLANE LATITUDE LONGITUDE | trigger_onRequest_PLANE LATITUDE LONGITUDE | The current lat long in one message with separate variables |
| onRequest_PLANE LATITUDE LONGITUDE | trigger_onRequest_PLANE LATITUDE LONGITUDE | The current lat long in one message with separate variables |
| AircraftLoaded | trigger_AircraftLoaded | Request a notification when the aircraft flight dynamics file is changed. These files have a .AIR extension. The filename is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| onChange_AircraftLoaded | trigger_onChange_AircraftLoaded | Request a notification when the aircraft flight dynamics file is changed. These files have a .AIR extension. The filename is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| Crashed | trigger_Crashed | Request a notification if the user aircraft crashes. |
| onChange_Crashed | trigger_onChange_Crashed | Request a notification if the user aircraft crashes. |
| CrashReset | trigger_CrashReset | Request a notification when the crash cut-scene has completed. |
| onChange_CrashReset | trigger_onChange_CrashReset | Request a notification when the crash cut-scene has completed. |
| CustomMissionActionExecuted | trigger_CustomMissionActionExecuted | Request a notification when a mission action has been executed.  |
| onChange_CustomMissionActionExecuted | trigger_onChange_CustomMissionActionExecuted | Request a notification when a mission action has been executed.  |
| FlightLoaded | trigger_FlightLoaded | Request a notification when a flight is loaded. Note that when a flight is ended, a default flight is typically loaded, so these events will occur when flights and missions are started and finished. The filename of the flight loaded is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| onChange_FlightLoaded | trigger_onChange_FlightLoaded | Request a notification when a flight is loaded. Note that when a flight is ended, a default flight is typically loaded, so these events will occur when flights and missions are started and finished. The filename of the flight loaded is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| FlightSaved | trigger_FlightSaved | Request a notification when a flight is saved correctly. The filename of the flight saved is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| onChange_FlightSaved | trigger_onChange_FlightSaved | Request a notification when a flight is saved correctly. The filename of the flight saved is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| FlightPlanActivated | trigger_FlightPlanActivated | Request a notification when a new flight plan is activated. The filename of the activated flight plan is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| onChange_FlightPlanActivated | trigger_onChange_FlightPlanActivated | Request a notification when a new flight plan is activated. The filename of the activated flight plan is returned in a SIMCONNECT_RECV_EVENT_FILENAME structure. |
| FlightPlanDeactivated | trigger_FlightPlanDeactivated | Request a notification when the active flight plan is de-activated. |
| onChange_FlightPlanDeactivated | trigger_onChange_FlightPlanDeactivated | Request a notification when the active flight plan is de-activated. |
| ObjectAdded | trigger_ObjectAdded | Request a notification when an AI object is added to the simulation. Refer also to the SIMCONNECT_RECV_EVENT_OBJECT_ADDREMOVE structure. |
| onChange_ObjectAdded | trigger_onChange_ObjectAdded | Request a notification when an AI object is added to the simulation. Refer also to the SIMCONNECT_RECV_EVENT_OBJECT_ADDREMOVE structure. |
| ObjectRemoved | trigger_ObjectRemoved | Request a notification when an AI object is removed from the simulation. Refer also to the SIMCONNECT_RECV_EVENT_OBJECT_ADDREMOVE structure. |
| onChange_ObjectRemoved | trigger_onChange_ObjectRemoved | Request a notification when an AI object is removed from the simulation. Refer also to the SIMCONNECT_RECV_EVENT_OBJECT_ADDREMOVE structure. |
| Pause | trigger_Pause | Request notifications when the flight is paused or unpaused, and also immediately returns the current pause state (1 = paused or 0 = unpaused). The state is returned in the dwData parameter. |
| onChange_Pause | trigger_onChange_Pause | Request notifications when the flight is paused or unpaused, and also immediately returns the current pause state (1 = paused or 0 = unpaused). The state is returned in the dwData parameter. |
| Pause_EX1 | trigger_Pause_EX1 | Request notifications when the flight is paused or unpaused, and also immediately returns the current pause state with more detail than the regular Pause system event. The state is returned in the dwData parameter, see documentation. |
| onChange_Pause_EX1 | trigger_onChange_Pause_EX1 | Request notifications when the flight is paused or unpaused, and also immediately returns the current pause state with more detail than the regular Pause system event. The state is returned in the dwData parameter, see documentation. |
| Paused | trigger_Paused | Request a notification when the flight is paused. |
| onChange_Paused | trigger_onChange_Paused | Request a notification when the flight is paused. |
| PositionChanged | trigger_PositionChanged | Request a notification when the user changes the position of their aircraft through a dialog. |
| onChange_PositionChanged | trigger_onChange_PositionChanged | Request a notification when the user changes the position of their aircraft through a dialog. |
| SimStart | trigger_SimStart | The simulator is running. Typically the user is actively controlling the aircraft on the ground or in the air. However, in some cases additional pairs of SimStart/SimStop events are sent. For example, when a flight is reset the events that are sent are SimStop, SimStart, SimStop, SimStart. Also when a flight is started with the SHOW_OPENING_SCREEN value set to zero, then an additional SimStart/SimStop pair are sent before a second SimStart event is sent when the scenery is fully loaded. The opening screen provides the options to change aircraft, departure airport, and so on. |
| onChange_SimStart | trigger_onChange_SimStart | The simulator is running. Typically the user is actively controlling the aircraft on the ground or in the air. However, in some cases additional pairs of SimStart/SimStop events are sent. For example, when a flight is reset the events that are sent are SimStop, SimStart, SimStop, SimStart. Also when a flight is started with the SHOW_OPENING_SCREEN value set to zero, then an additional SimStart/SimStop pair are sent before a second SimStart event is sent when the scenery is fully loaded. The opening screen provides the options to change aircraft, departure airport, and so on. |
| SimStop | trigger_SimStop | The simulator is not running. Typically the user is loading a flight, navigating the shell or in a dialog. |
| onChange_SimStop | trigger_onChange_SimStop | The simulator is not running. Typically the user is loading a flight, navigating the shell or in a dialog. |
| Unpaused | trigger_Unpaused | Request a notification when the flight is un-paused. |
| onChange_Unpaused | trigger_onChange_Unpaused | Request a notification when the flight is un-paused. |
| View | trigger_View | Requests a notification when the user aircraft view is changed. This request will also return the current view immediately. A flag is returned in the dwData parameter, one of: SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_COCKPIT_2D SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_COCKPIT_VIRTUAL SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_ORTHOGONAL (the map view). |
| onChange_View | trigger_onChange_View | Requests a notification when the user aircraft view is changed. This request will also return the current view immediately. A flag is returned in the dwData parameter, one of: SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_COCKPIT_2D SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_COCKPIT_VIRTUAL SIMCONNECT_VIEW_SYSTEM_EVENT_DATA_ORTHOGONAL (the map view). |
| ACCELERATION BODY X | trigger_ACCELERATION BODY X | Acceleration relative to aircraft X axis, in east/west direction: Units feet: settable false |
| onChange_ACCELERATION BODY X | trigger_onChange_ACCELERATION BODY X | Acceleration relative to aircraft X axis, in east/west direction: Units feet: settable false |
| onRequest_ACCELERATION BODY X | trigger_onRequest_ACCELERATION BODY X | Acceleration relative to aircraft X axis, in east/west direction: Units feet: settable false |
| ACCELERATION BODY Y | trigger_ACCELERATION BODY Y | Acceleration relative to aircraft Y axis, in vertical direction: Units feet: settable false |
| onChange_ACCELERATION BODY Y | trigger_onChange_ACCELERATION BODY Y | Acceleration relative to aircraft Y axis, in vertical direction: Units feet: settable false |
| onRequest_ACCELERATION BODY Y | trigger_onRequest_ACCELERATION BODY Y | Acceleration relative to aircraft Y axis, in vertical direction: Units feet: settable false |
| ACCELERATION BODY Z | trigger_ACCELERATION BODY Z | Acceleration relative to aircraft Z axis, in north/south direction: Units feet: settable false |
| onChange_ACCELERATION BODY Z | trigger_onChange_ACCELERATION BODY Z | Acceleration relative to aircraft Z axis, in north/south direction: Units feet: settable false |
| onRequest_ACCELERATION BODY Z | trigger_onRequest_ACCELERATION BODY Z | Acceleration relative to aircraft Z axis, in north/south direction: Units feet: settable false |
| ACCELERATION WORLD X | trigger_ACCELERATION WORLD X | Acceleration relative to the earth X axis, in east/west direction: Units feet: settable false |
| onChange_ACCELERATION WORLD X | trigger_onChange_ACCELERATION WORLD X | Acceleration relative to the earth X axis, in east/west direction: Units feet: settable false |
| onRequest_ACCELERATION WORLD X | trigger_onRequest_ACCELERATION WORLD X | Acceleration relative to the earth X axis, in east/west direction: Units feet: settable false |
| ACCELERATION WORLD Y | trigger_ACCELERATION WORLD Y | Acceleration relative to the earth Y axis, in vertical direction: Units feet: settable false |
| onChange_ACCELERATION WORLD Y | trigger_onChange_ACCELERATION WORLD Y | Acceleration relative to the earth Y axis, in vertical direction: Units feet: settable false |
| onRequest_ACCELERATION WORLD Y | trigger_onRequest_ACCELERATION WORLD Y | Acceleration relative to the earth Y axis, in vertical direction: Units feet: settable false |
| ACCELERATION WORLD Z | trigger_ACCELERATION WORLD Z | Acceleration relative to the earth Z axis, in north/south direction: Units feet: settable false |
| onChange_ACCELERATION WORLD Z | trigger_onChange_ACCELERATION WORLD Z | Acceleration relative to the earth Z axis, in north/south direction: Units feet: settable false |
| onRequest_ACCELERATION WORLD Z | trigger_onRequest_ACCELERATION WORLD Z | Acceleration relative to the earth Z axis, in north/south direction: Units feet: settable false |
| ADF ACTIVE FREQUENCY:index | trigger_ADF ACTIVE FREQUENCY:index | ADF frequency. Index of 1 or 2.: Units frequency ADF BCD32: settable false |
| onChange_ADF ACTIVE FREQUENCY:index | trigger_onChange_ADF ACTIVE FREQUENCY:index | ADF frequency. Index of 1 or 2.: Units frequency ADF BCD32: settable false |
| onRequest_ADF ACTIVE FREQUENCY:index | trigger_onRequest_ADF ACTIVE FREQUENCY:index | ADF frequency. Index of 1 or 2.: Units frequency ADF BCD32: settable false |
| ADF AVAILABLE:index | trigger_ADF AVAILABLE:index | True if ADF is available: Units bool: settable false |
| onChange_ADF AVAILABLE:index | trigger_onChange_ADF AVAILABLE:index | True if ADF is available: Units bool: settable false |
| onRequest_ADF AVAILABLE:index | trigger_onRequest_ADF AVAILABLE:index | True if ADF is available: Units bool: settable false |
| ADF CARD | trigger_ADF CARD | ADF compass rose setting: Units degrees: settable false |
| onChange_ADF CARD | trigger_onChange_ADF CARD | ADF compass rose setting: Units degrees: settable false |
| onRequest_ADF CARD | trigger_onRequest_ADF CARD | ADF compass rose setting: Units degrees: settable false |
| ADF IDENT | trigger_ADF IDENT | ICAO code: Units null: settable false |
| onChange_ADF IDENT | trigger_onChange_ADF IDENT | ICAO code: Units null: settable false |
| onRequest_ADF IDENT | trigger_onRequest_ADF IDENT | ICAO code: Units null: settable false |
| ADF NAME:index | trigger_ADF NAME:index | Descriptive name: Units null: settable false |
| onChange_ADF NAME:index | trigger_onChange_ADF NAME:index | Descriptive name: Units null: settable false |
| onRequest_ADF NAME:index | trigger_onRequest_ADF NAME:index | Descriptive name: Units null: settable false |
| ADF RADIAL MAG:index | trigger_ADF RADIAL MAG:index | Returns the magnetic bearing to the currently tuned ADF transmitter.: Units degrees: settable false |
| onChange_ADF RADIAL MAG:index | trigger_onChange_ADF RADIAL MAG:index | Returns the magnetic bearing to the currently tuned ADF transmitter.: Units degrees: settable false |
| onRequest_ADF RADIAL MAG:index | trigger_onRequest_ADF RADIAL MAG:index | Returns the magnetic bearing to the currently tuned ADF transmitter.: Units degrees: settable false |
| ADF RADIAL:index | trigger_ADF RADIAL:index | Current direction from NDB station: Units degrees: settable false |
| onChange_ADF RADIAL:index | trigger_onChange_ADF RADIAL:index | Current direction from NDB station: Units degrees: settable false |
| onRequest_ADF RADIAL:index | trigger_onRequest_ADF RADIAL:index | Current direction from NDB station: Units degrees: settable false |
| ADF SIGNAL:index | trigger_ADF SIGNAL:index | Signal strength: Units number: settable false |
| onChange_ADF SIGNAL:index | trigger_onChange_ADF SIGNAL:index | Signal strength: Units number: settable false |
| onRequest_ADF SIGNAL:index | trigger_onRequest_ADF SIGNAL:index | Signal strength: Units number: settable false |
| ADF SOUND:index | trigger_ADF SOUND:index | ADF audio flag. Index of 0 or 1.: Units bool: settable false |
| onChange_ADF SOUND:index | trigger_onChange_ADF SOUND:index | ADF audio flag. Index of 0 or 1.: Units bool: settable false |
| onRequest_ADF SOUND:index | trigger_onRequest_ADF SOUND:index | ADF audio flag. Index of 0 or 1.: Units bool: settable false |
| ADF STANDBY AVAILABLE:index | trigger_ADF STANDBY AVAILABLE:index | True if ADF Standby is available: Units bool: settable false |
| onChange_ADF STANDBY AVAILABLE:index | trigger_onChange_ADF STANDBY AVAILABLE:index | True if ADF Standby is available: Units bool: settable false |
| onRequest_ADF STANDBY AVAILABLE:index | trigger_onRequest_ADF STANDBY AVAILABLE:index | True if ADF Standby is available: Units bool: settable false |
| ADF STANDBY FREQUENCY:index | trigger_ADF STANDBY FREQUENCY:index | ADF standby frequency: Units Hz: settable false |
| onChange_ADF STANDBY FREQUENCY:index | trigger_onChange_ADF STANDBY FREQUENCY:index | ADF standby frequency: Units Hz: settable false |
| onRequest_ADF STANDBY FREQUENCY:index | trigger_onRequest_ADF STANDBY FREQUENCY:index | ADF standby frequency: Units Hz: settable false |
| ADF VOLUME | trigger_ADF VOLUME | Returns the volume of the ADF: Units percent Over 100: settable false |
| onChange_ADF VOLUME | trigger_onChange_ADF VOLUME | Returns the volume of the ADF: Units percent Over 100: settable false |
| onRequest_ADF VOLUME | trigger_onRequest_ADF VOLUME | Returns the volume of the ADF: Units percent Over 100: settable false |
| AI ANTISTALL STATE | trigger_AI ANTISTALL STATE | The current state of the AI anti-stall system: Units enum: settable false |
| onChange_AI ANTISTALL STATE | trigger_onChange_AI ANTISTALL STATE | The current state of the AI anti-stall system: Units enum: settable false |
| onRequest_AI ANTISTALL STATE | trigger_onRequest_AI ANTISTALL STATE | The current state of the AI anti-stall system: Units enum: settable false |
| AI AUTOTRIM ACTIVE | trigger_AI AUTOTRIM ACTIVE | Returns whether the AI auto-trim system is enabled or not: Units bool: settable false |
| onChange_AI AUTOTRIM ACTIVE | trigger_onChange_AI AUTOTRIM ACTIVE | Returns whether the AI auto-trim system is enabled or not: Units bool: settable false |
| onRequest_AI AUTOTRIM ACTIVE | trigger_onRequest_AI AUTOTRIM ACTIVE | Returns whether the AI auto-trim system is enabled or not: Units bool: settable false |
| AI AUTOTRIM ACTIVE AGAINST PLAYER | trigger_AI AUTOTRIM ACTIVE AGAINST PLAYER | Returns whether the AI auto-trim system is enabled or not for AI controlled aircraft: Units bool: settable false |
| onChange_AI AUTOTRIM ACTIVE AGAINST PLAYER | trigger_onChange_AI AUTOTRIM ACTIVE AGAINST PLAYER | Returns whether the AI auto-trim system is enabled or not for AI controlled aircraft: Units bool: settable false |
| onRequest_AI AUTOTRIM ACTIVE AGAINST PLAYER | trigger_onRequest_AI AUTOTRIM ACTIVE AGAINST PLAYER | Returns whether the AI auto-trim system is enabled or not for AI controlled aircraft: Units bool: settable false |
| AI CONTROLS | trigger_AI CONTROLS | Returns whether the AI control system is enabled or not: Units bool: settable false |
| onChange_AI CONTROLS | trigger_onChange_AI CONTROLS | Returns whether the AI control system is enabled or not: Units bool: settable false |
| onRequest_AI CONTROLS | trigger_onRequest_AI CONTROLS | Returns whether the AI control system is enabled or not: Units bool: settable false |
| AI CURSOR MODE ACTIVE | trigger_AI CURSOR MODE ACTIVE | Returns whether the AI cursor mode is active or not: Units bool: settable false |
| onChange_AI CURSOR MODE ACTIVE | trigger_onChange_AI CURSOR MODE ACTIVE | Returns whether the AI cursor mode is active or not: Units bool: settable false |
| onRequest_AI CURSOR MODE ACTIVE | trigger_onRequest_AI CURSOR MODE ACTIVE | Returns whether the AI cursor mode is active or not: Units bool: settable false |
| AILERON AVERAGE DEFLECTION | trigger_AILERON AVERAGE DEFLECTION | Angle deflection: Units radians: settable false |
| onChange_AILERON AVERAGE DEFLECTION | trigger_onChange_AILERON AVERAGE DEFLECTION | Angle deflection: Units radians: settable false |
| onRequest_AILERON AVERAGE DEFLECTION | trigger_onRequest_AILERON AVERAGE DEFLECTION | Angle deflection: Units radians: settable false |
| AILERON LEFT DEFLECTION | trigger_AILERON LEFT DEFLECTION | Angle deflection: Units radians: settable false |
| onChange_AILERON LEFT DEFLECTION | trigger_onChange_AILERON LEFT DEFLECTION | Angle deflection: Units radians: settable false |
| onRequest_AILERON LEFT DEFLECTION | trigger_onRequest_AILERON LEFT DEFLECTION | Angle deflection: Units radians: settable false |
| AILERON LEFT DEFLECTION PCT | trigger_AILERON LEFT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onChange_AILERON LEFT DEFLECTION PCT | trigger_onChange_AILERON LEFT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onRequest_AILERON LEFT DEFLECTION PCT | trigger_onRequest_AILERON LEFT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| AILERON POSITION | trigger_AILERON POSITION | Percent aileron input left/right: Units position: settable true |
| onChange_AILERON POSITION | trigger_onChange_AILERON POSITION | Percent aileron input left/right: Units position: settable true |
| onRequest_AILERON POSITION | trigger_onRequest_AILERON POSITION | Percent aileron input left/right: Units position: settable true |
| AILERON RIGHT DEFLECTION | trigger_AILERON RIGHT DEFLECTION | Angle deflection: Units radians: settable false |
| onChange_AILERON RIGHT DEFLECTION | trigger_onChange_AILERON RIGHT DEFLECTION | Angle deflection: Units radians: settable false |
| onRequest_AILERON RIGHT DEFLECTION | trigger_onRequest_AILERON RIGHT DEFLECTION | Angle deflection: Units radians: settable false |
| AILERON RIGHT DEFLECTION PCT | trigger_AILERON RIGHT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onChange_AILERON RIGHT DEFLECTION PCT | trigger_onChange_AILERON RIGHT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onRequest_AILERON RIGHT DEFLECTION PCT | trigger_onRequest_AILERON RIGHT DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| AILERON TRIM | trigger_AILERON TRIM | Angle deflection: Units radians: settable false |
| onChange_AILERON TRIM | trigger_onChange_AILERON TRIM | Angle deflection: Units radians: settable false |
| onRequest_AILERON TRIM | trigger_onRequest_AILERON TRIM | Angle deflection: Units radians: settable false |
| AILERON TRIM DISABLED | trigger_AILERON TRIM DISABLED | Whether or not the Aileron Trim has been disabled: Units bool: settable false |
| onChange_AILERON TRIM DISABLED | trigger_onChange_AILERON TRIM DISABLED | Whether or not the Aileron Trim has been disabled: Units bool: settable false |
| onRequest_AILERON TRIM DISABLED | trigger_onRequest_AILERON TRIM DISABLED | Whether or not the Aileron Trim has been disabled: Units bool: settable false |
| AILERON TRIM PCT | trigger_AILERON TRIM PCT | The trim position of the ailerons. Zero is fully retracted: Units percent Over 100: settable true |
| onChange_AILERON TRIM PCT | trigger_onChange_AILERON TRIM PCT | The trim position of the ailerons. Zero is fully retracted: Units percent Over 100: settable true |
| onRequest_AILERON TRIM PCT | trigger_onRequest_AILERON TRIM PCT | The trim position of the ailerons. Zero is fully retracted: Units percent Over 100: settable true |
| AIRCRAFT WIND X | trigger_AIRCRAFT WIND X | Wind component in aircraft lateral (X) axis: Units knots: settable false |
| onChange_AIRCRAFT WIND X | trigger_onChange_AIRCRAFT WIND X | Wind component in aircraft lateral (X) axis: Units knots: settable false |
| onRequest_AIRCRAFT WIND X | trigger_onRequest_AIRCRAFT WIND X | Wind component in aircraft lateral (X) axis: Units knots: settable false |
| AIRCRAFT WIND Y | trigger_AIRCRAFT WIND Y | Wind component in aircraft vertical (Y) axis.: Units knots: settable false |
| onChange_AIRCRAFT WIND Y | trigger_onChange_AIRCRAFT WIND Y | Wind component in aircraft vertical (Y) axis.: Units knots: settable false |
| onRequest_AIRCRAFT WIND Y | trigger_onRequest_AIRCRAFT WIND Y | Wind component in aircraft vertical (Y) axis.: Units knots: settable false |
| AIRCRAFT WIND Z | trigger_AIRCRAFT WIND Z | Wind component in aircraft longitudinal (Z) axis.: Units knots: settable false |
| onChange_AIRCRAFT WIND Z | trigger_onChange_AIRCRAFT WIND Z | Wind component in aircraft longitudinal (Z) axis.: Units knots: settable false |
| onRequest_AIRCRAFT WIND Z | trigger_onRequest_AIRCRAFT WIND Z | Wind component in aircraft longitudinal (Z) axis.: Units knots: settable false |
| AIRSPEED BARBER POLE | trigger_AIRSPEED BARBER POLE | Redline airspeed (dynamic on some aircraft).: Units knots: settable false |
| onChange_AIRSPEED BARBER POLE | trigger_onChange_AIRSPEED BARBER POLE | Redline airspeed (dynamic on some aircraft).: Units knots: settable false |
| onRequest_AIRSPEED BARBER POLE | trigger_onRequest_AIRSPEED BARBER POLE | Redline airspeed (dynamic on some aircraft).: Units knots: settable false |
| AIRSPEED INDICATED | trigger_AIRSPEED INDICATED | Indicated airspeed.: Units knots: settable true |
| onChange_AIRSPEED INDICATED | trigger_onChange_AIRSPEED INDICATED | Indicated airspeed.: Units knots: settable true |
| onRequest_AIRSPEED INDICATED | trigger_onRequest_AIRSPEED INDICATED | Indicated airspeed.: Units knots: settable true |
| AIRSPEED MACH | trigger_AIRSPEED MACH | Current mach.: Units mach: settable false |
| onChange_AIRSPEED MACH | trigger_onChange_AIRSPEED MACH | Current mach.: Units mach: settable false |
| onRequest_AIRSPEED MACH | trigger_onRequest_AIRSPEED MACH | Current mach.: Units mach: settable false |
| AIRSPEED SELECT INDICATED OR TRUE | trigger_AIRSPEED SELECT INDICATED OR TRUE | The airspeed, whether true or indicated airspeed has been selected.: Units knots: settable false |
| onChange_AIRSPEED SELECT INDICATED OR TRUE | trigger_onChange_AIRSPEED SELECT INDICATED OR TRUE | The airspeed, whether true or indicated airspeed has been selected.: Units knots: settable false |
| onRequest_AIRSPEED SELECT INDICATED OR TRUE | trigger_onRequest_AIRSPEED SELECT INDICATED OR TRUE | The airspeed, whether true or indicated airspeed has been selected.: Units knots: settable false |
| AIRSPEED TRUE | trigger_AIRSPEED TRUE | True airspeed.: Units knots: settable true |
| onChange_AIRSPEED TRUE | trigger_onChange_AIRSPEED TRUE | True airspeed.: Units knots: settable true |
| onRequest_AIRSPEED TRUE | trigger_onRequest_AIRSPEED TRUE | True airspeed.: Units knots: settable true |
| AIRSPEED TRUE CALIBRATE | trigger_AIRSPEED TRUE CALIBRATE | Angle of True calibration scale on airspeed indicator.: Units degrees: settable true |
| onChange_AIRSPEED TRUE CALIBRATE | trigger_onChange_AIRSPEED TRUE CALIBRATE | Angle of True calibration scale on airspeed indicator.: Units degrees: settable true |
| onRequest_AIRSPEED TRUE CALIBRATE | trigger_onRequest_AIRSPEED TRUE CALIBRATE | Angle of True calibration scale on airspeed indicator.: Units degrees: settable true |
| AIRSPEED TRUE RAW | trigger_AIRSPEED TRUE RAW | Equivalent to AIRSPEED TRUE, but does not account for wind when used to Set Airspeed value: Units knots: settable true |
| onChange_AIRSPEED TRUE RAW | trigger_onChange_AIRSPEED TRUE RAW | Equivalent to AIRSPEED TRUE, but does not account for wind when used to Set Airspeed value: Units knots: settable true |
| onRequest_AIRSPEED TRUE RAW | trigger_onRequest_AIRSPEED TRUE RAW | Equivalent to AIRSPEED TRUE, but does not account for wind when used to Set Airspeed value: Units knots: settable true |
| ALTERNATE STATIC SOURCE OPEN:index | trigger_ALTERNATE STATIC SOURCE OPEN:index | Alternate static air source.: Units bool: settable false |
| onChange_ALTERNATE STATIC SOURCE OPEN:index | trigger_onChange_ALTERNATE STATIC SOURCE OPEN:index | Alternate static air source.: Units bool: settable false |
| onRequest_ALTERNATE STATIC SOURCE OPEN:index | trigger_onRequest_ALTERNATE STATIC SOURCE OPEN:index | Alternate static air source.: Units bool: settable false |
| ALTERNATOR BREAKER PULLED | trigger_ALTERNATOR BREAKER PULLED | This will be true if the alternator breaker is pulled. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable true |
| onChange_ALTERNATOR BREAKER PULLED | trigger_onChange_ALTERNATOR BREAKER PULLED | This will be true if the alternator breaker is pulled. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable true |
| onRequest_ALTERNATOR BREAKER PULLED | trigger_onRequest_ALTERNATOR BREAKER PULLED | This will be true if the alternator breaker is pulled. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable true |
| ALTERNATOR CONNECTION ON | trigger_ALTERNATOR CONNECTION ON | This will be true if the alternator is connected. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable false |
| onChange_ALTERNATOR CONNECTION ON | trigger_onChange_ALTERNATOR CONNECTION ON | This will be true if the alternator is connected. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable false |
| onRequest_ALTERNATOR CONNECTION ON | trigger_onRequest_ALTERNATOR CONNECTION ON | This will be true if the alternator is connected. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool: settable false |
| AMBIENT DENSITY | trigger_AMBIENT DENSITY | Ambient density.: Units Slugs per cubic feet: settable false |
| onChange_AMBIENT DENSITY | trigger_onChange_AMBIENT DENSITY | Ambient density.: Units Slugs per cubic feet: settable false |
| onRequest_AMBIENT DENSITY | trigger_onRequest_AMBIENT DENSITY | Ambient density.: Units Slugs per cubic feet: settable false |
| AMBIENT IN CLOUD | trigger_AMBIENT IN CLOUD | True if the aircraft is in a cloud: Units bool: settable false |
| onChange_AMBIENT IN CLOUD | trigger_onChange_AMBIENT IN CLOUD | True if the aircraft is in a cloud: Units bool: settable false |
| onRequest_AMBIENT IN CLOUD | trigger_onRequest_AMBIENT IN CLOUD | True if the aircraft is in a cloud: Units bool: settable false |
| AMBIENT PRECIP RATE | trigger_AMBIENT PRECIP RATE | The current precipitation rate.: Units millimeters of water: settable false |
| onChange_AMBIENT PRECIP RATE | trigger_onChange_AMBIENT PRECIP RATE | The current precipitation rate.: Units millimeters of water: settable false |
| onRequest_AMBIENT PRECIP RATE | trigger_onRequest_AMBIENT PRECIP RATE | The current precipitation rate.: Units millimeters of water: settable false |
| AMBIENT PRECIP STATE | trigger_AMBIENT PRECIP STATE | The current state of precipitation.: Units mask: settable false |
| onChange_AMBIENT PRECIP STATE | trigger_onChange_AMBIENT PRECIP STATE | The current state of precipitation.: Units mask: settable false |
| onRequest_AMBIENT PRECIP STATE | trigger_onRequest_AMBIENT PRECIP STATE | The current state of precipitation.: Units mask: settable false |
| AMBIENT PRESSURE | trigger_AMBIENT PRESSURE | Ambient pressure.: Units Inches of Mercury: settable false |
| onChange_AMBIENT PRESSURE | trigger_onChange_AMBIENT PRESSURE | Ambient pressure.: Units Inches of Mercury: settable false |
| onRequest_AMBIENT PRESSURE | trigger_onRequest_AMBIENT PRESSURE | Ambient pressure.: Units Inches of Mercury: settable false |
| AMBIENT TEMPERATURE | trigger_AMBIENT TEMPERATURE | Ambient temperature.: Units celsius: settable false |
| onChange_AMBIENT TEMPERATURE | trigger_onChange_AMBIENT TEMPERATURE | Ambient temperature.: Units celsius: settable false |
| onRequest_AMBIENT TEMPERATURE | trigger_onRequest_AMBIENT TEMPERATURE | Ambient temperature.: Units celsius: settable false |
| AMBIENT VISIBILITY | trigger_AMBIENT VISIBILITY | Ambient visibility (only measures ambient particle visibility - related to ambient density).: Units meters: settable false |
| onChange_AMBIENT VISIBILITY | trigger_onChange_AMBIENT VISIBILITY | Ambient visibility (only measures ambient particle visibility - related to ambient density).: Units meters: settable false |
| onRequest_AMBIENT VISIBILITY | trigger_onRequest_AMBIENT VISIBILITY | Ambient visibility (only measures ambient particle visibility - related to ambient density).: Units meters: settable false |
| AMBIENT WIND DIRECTION | trigger_AMBIENT WIND DIRECTION | Wind direction, relative to true north.: Units degrees: settable false |
| onChange_AMBIENT WIND DIRECTION | trigger_onChange_AMBIENT WIND DIRECTION | Wind direction, relative to true north.: Units degrees: settable false |
| onRequest_AMBIENT WIND DIRECTION | trigger_onRequest_AMBIENT WIND DIRECTION | Wind direction, relative to true north.: Units degrees: settable false |
| AMBIENT WIND VELOCITY | trigger_AMBIENT WIND VELOCITY | Wind velocity.: Units knots: settable false |
| onChange_AMBIENT WIND VELOCITY | trigger_onChange_AMBIENT WIND VELOCITY | Wind velocity.: Units knots: settable false |
| onRequest_AMBIENT WIND VELOCITY | trigger_onRequest_AMBIENT WIND VELOCITY | Wind velocity.: Units knots: settable false |
| AMBIENT WIND X | trigger_AMBIENT WIND X | Wind component in East/West direction.: Units Meters per second: settable false |
| onChange_AMBIENT WIND X | trigger_onChange_AMBIENT WIND X | Wind component in East/West direction.: Units Meters per second: settable false |
| onRequest_AMBIENT WIND X | trigger_onRequest_AMBIENT WIND X | Wind component in East/West direction.: Units Meters per second: settable false |
| AMBIENT WIND Y | trigger_AMBIENT WIND Y | Wind component in vertical direction.: Units Meters per second: settable false |
| onChange_AMBIENT WIND Y | trigger_onChange_AMBIENT WIND Y | Wind component in vertical direction.: Units Meters per second: settable false |
| onRequest_AMBIENT WIND Y | trigger_onRequest_AMBIENT WIND Y | Wind component in vertical direction.: Units Meters per second: settable false |
| AMBIENT WIND Z | trigger_AMBIENT WIND Z | Wind component in North/South direction.: Units Meters per second: settable false |
| onChange_AMBIENT WIND Z | trigger_onChange_AMBIENT WIND Z | Wind component in North/South direction.: Units Meters per second: settable false |
| onRequest_AMBIENT WIND Z | trigger_onRequest_AMBIENT WIND Z | Wind component in North/South direction.: Units Meters per second: settable false |
| ANEMOMETER PCT RPM | trigger_ANEMOMETER PCT RPM | Anemometer rpm as a percentage.: Units percent Over 100: settable false |
| onChange_ANEMOMETER PCT RPM | trigger_onChange_ANEMOMETER PCT RPM | Anemometer rpm as a percentage.: Units percent Over 100: settable false |
| onRequest_ANEMOMETER PCT RPM | trigger_onRequest_ANEMOMETER PCT RPM | Anemometer rpm as a percentage.: Units percent Over 100: settable false |
| ANGLE OF ATTACK INDICATOR | trigger_ANGLE OF ATTACK INDICATOR | AoA indication.: Units radians: settable false |
| onChange_ANGLE OF ATTACK INDICATOR | trigger_onChange_ANGLE OF ATTACK INDICATOR | AoA indication.: Units radians: settable false |
| onRequest_ANGLE OF ATTACK INDICATOR | trigger_onRequest_ANGLE OF ATTACK INDICATOR | AoA indication.: Units radians: settable false |
| ANIMATION DELTA TIME | trigger_ANIMATION DELTA TIME | Difference of time between the current frame and the last frame where this SimObject has been animated: Units seconds: settable false |
| onChange_ANIMATION DELTA TIME | trigger_onChange_ANIMATION DELTA TIME | Difference of time between the current frame and the last frame where this SimObject has been animated: Units seconds: settable false |
| onRequest_ANIMATION DELTA TIME | trigger_onRequest_ANIMATION DELTA TIME | Difference of time between the current frame and the last frame where this SimObject has been animated: Units seconds: settable false |
| ANTISKID BRAKES ACTIVE | trigger_ANTISKID BRAKES ACTIVE | True if antiskid brakes active. This can be set using the AntiSkidActive parameter: Units bool: settable false |
| onChange_ANTISKID BRAKES ACTIVE | trigger_onChange_ANTISKID BRAKES ACTIVE | True if antiskid brakes active. This can be set using the AntiSkidActive parameter: Units bool: settable false |
| onRequest_ANTISKID BRAKES ACTIVE | trigger_onRequest_ANTISKID BRAKES ACTIVE | True if antiskid brakes active. This can be set using the AntiSkidActive parameter: Units bool: settable false |
| APPLY HEAT TO SYSTEMS | trigger_APPLY HEAT TO SYSTEMS | Used when too close to a fire.: Units bool: settable true |
| onChange_APPLY HEAT TO SYSTEMS | trigger_onChange_APPLY HEAT TO SYSTEMS | Used when too close to a fire.: Units bool: settable true |
| onRequest_APPLY HEAT TO SYSTEMS | trigger_onRequest_APPLY HEAT TO SYSTEMS | Used when too close to a fire.: Units bool: settable true |
| APU BLEED PRESSURE RECEIVED BY ENGINE | trigger_APU BLEED PRESSURE RECEIVED BY ENGINE | Bleed air pressure received by the engine from the APU: Units pounds: settable false |
| onChange_APU BLEED PRESSURE RECEIVED BY ENGINE | trigger_onChange_APU BLEED PRESSURE RECEIVED BY ENGINE | Bleed air pressure received by the engine from the APU: Units pounds: settable false |
| onRequest_APU BLEED PRESSURE RECEIVED BY ENGINE | trigger_onRequest_APU BLEED PRESSURE RECEIVED BY ENGINE | Bleed air pressure received by the engine from the APU: Units pounds: settable false |
| APU GENERATOR ACTIVE:index | trigger_APU GENERATOR ACTIVE:index | Set or get whether an APU is active (true) or not (false). Takes an index to be able to have multiple generators on a single APU: Units bool: settable true |
| onChange_APU GENERATOR ACTIVE:index | trigger_onChange_APU GENERATOR ACTIVE:index | Set or get whether an APU is active (true) or not (false). Takes an index to be able to have multiple generators on a single APU: Units bool: settable true |
| onRequest_APU GENERATOR ACTIVE:index | trigger_onRequest_APU GENERATOR ACTIVE:index | Set or get whether an APU is active (true) or not (false). Takes an index to be able to have multiple generators on a single APU: Units bool: settable true |
| APU GENERATOR SWITCH:index | trigger_APU GENERATOR SWITCH:index | Enables or disables the APU for an engine. Takes an index to be able to have multiple generators on a single APU: Units bool: settable false |
| onChange_APU GENERATOR SWITCH:index | trigger_onChange_APU GENERATOR SWITCH:index | Enables or disables the APU for an engine. Takes an index to be able to have multiple generators on a single APU: Units bool: settable false |
| onRequest_APU GENERATOR SWITCH:index | trigger_onRequest_APU GENERATOR SWITCH:index | Enables or disables the APU for an engine. Takes an index to be able to have multiple generators on a single APU: Units bool: settable false |
| APU ON FIRE DETECTED | trigger_APU ON FIRE DETECTED | Will return true if the APU is on fire, or false otherwise: Units bool: settable false |
| onChange_APU ON FIRE DETECTED | trigger_onChange_APU ON FIRE DETECTED | Will return true if the APU is on fire, or false otherwise: Units bool: settable false |
| onRequest_APU ON FIRE DETECTED | trigger_onRequest_APU ON FIRE DETECTED | Will return true if the APU is on fire, or false otherwise: Units bool: settable false |
| APU PCT RPM | trigger_APU PCT RPM | Auxiliary power unit RPM, as a percentage: Units percent Over 100: settable false |
| onChange_APU PCT RPM | trigger_onChange_APU PCT RPM | Auxiliary power unit RPM, as a percentage: Units percent Over 100: settable false |
| onRequest_APU PCT RPM | trigger_onRequest_APU PCT RPM | Auxiliary power unit RPM, as a percentage: Units percent Over 100: settable false |
| APU PCT STARTER | trigger_APU PCT STARTER | Auxiliary power unit starter, as a percentage: Units percent Over 100: settable false |
| onChange_APU PCT STARTER | trigger_onChange_APU PCT STARTER | Auxiliary power unit starter, as a percentage: Units percent Over 100: settable false |
| onRequest_APU PCT STARTER | trigger_onRequest_APU PCT STARTER | Auxiliary power unit starter, as a percentage: Units percent Over 100: settable false |
| APU SWITCH | trigger_APU SWITCH | Boolean, whether or not the APU is switched on: Units bool: settable true |
| onChange_APU SWITCH | trigger_onChange_APU SWITCH | Boolean, whether or not the APU is switched on: Units bool: settable true |
| onRequest_APU SWITCH | trigger_onRequest_APU SWITCH | Boolean, whether or not the APU is switched on: Units bool: settable true |
| APU VOLTS:index | trigger_APU VOLTS:index | The volts from the APU to the selected engine. Takes an index to be able to have multiple generators on a single APU: Units volts: settable false |
| onChange_APU VOLTS:index | trigger_onChange_APU VOLTS:index | The volts from the APU to the selected engine. Takes an index to be able to have multiple generators on a single APU: Units volts: settable false |
| onRequest_APU VOLTS:index | trigger_onRequest_APU VOLTS:index | The volts from the APU to the selected engine. Takes an index to be able to have multiple generators on a single APU: Units volts: settable false |
| ARTIFICIAL GROUND ELEVATION | trigger_ARTIFICIAL GROUND ELEVATION | In case scenery is not loaded for AI planes, this variable can be used to set a default surface elevation.: Units feet: settable false |
| onChange_ARTIFICIAL GROUND ELEVATION | trigger_onChange_ARTIFICIAL GROUND ELEVATION | In case scenery is not loaded for AI planes, this variable can be used to set a default surface elevation.: Units feet: settable false |
| onRequest_ARTIFICIAL GROUND ELEVATION | trigger_onRequest_ARTIFICIAL GROUND ELEVATION | In case scenery is not loaded for AI planes, this variable can be used to set a default surface elevation.: Units feet: settable false |
| ASSISTANCE LANDING ENABLED | trigger_ASSISTANCE LANDING ENABLED | Returns whether landing assistance has been enabled or not: Units bool: settable false |
| onChange_ASSISTANCE LANDING ENABLED | trigger_onChange_ASSISTANCE LANDING ENABLED | Returns whether landing assistance has been enabled or not: Units bool: settable false |
| onRequest_ASSISTANCE LANDING ENABLED | trigger_onRequest_ASSISTANCE LANDING ENABLED | Returns whether landing assistance has been enabled or not: Units bool: settable false |
| ASSISTANCE TAKEOFF ENABLED | trigger_ASSISTANCE TAKEOFF ENABLED | Returns whether takeoff assistance has been enabled or not: Units bool: settable false |
| onChange_ASSISTANCE TAKEOFF ENABLED | trigger_onChange_ASSISTANCE TAKEOFF ENABLED | Returns whether takeoff assistance has been enabled or not: Units bool: settable false |
| onRequest_ASSISTANCE TAKEOFF ENABLED | trigger_onRequest_ASSISTANCE TAKEOFF ENABLED | Returns whether takeoff assistance has been enabled or not: Units bool: settable false |
| ATC AIRLINE | trigger_ATC AIRLINE | The name of the Airline used by ATC, as a string with a maximum length of 50 characters.: Units null: settable true |
| onChange_ATC AIRLINE | trigger_onChange_ATC AIRLINE | The name of the Airline used by ATC, as a string with a maximum length of 50 characters.: Units null: settable true |
| onRequest_ATC AIRLINE | trigger_onRequest_ATC AIRLINE | The name of the Airline used by ATC, as a string with a maximum length of 50 characters.: Units null: settable true |
| ATC AIRPORT IS TOWERED | trigger_ATC AIRPORT IS TOWERED | If the airport is controlled, this boolean is true.: Units bool: settable false |
| onChange_ATC AIRPORT IS TOWERED | trigger_onChange_ATC AIRPORT IS TOWERED | If the airport is controlled, this boolean is true.: Units bool: settable false |
| onRequest_ATC AIRPORT IS TOWERED | trigger_onRequest_ATC AIRPORT IS TOWERED | If the airport is controlled, this boolean is true.: Units bool: settable false |
| ATC CLEARED IFR | trigger_ATC CLEARED IFR | Returns whether or not the user has filed an IFR flightplan that has been cleared by the sim ATC: Units bool: settable false |
| onChange_ATC CLEARED IFR | trigger_onChange_ATC CLEARED IFR | Returns whether or not the user has filed an IFR flightplan that has been cleared by the sim ATC: Units bool: settable false |
| onRequest_ATC CLEARED IFR | trigger_onRequest_ATC CLEARED IFR | Returns whether or not the user has filed an IFR flightplan that has been cleared by the sim ATC: Units bool: settable false |
| ATC CLEARED LANDING | trigger_ATC CLEARED LANDING | Whether the ATC has cleared the plane for landing.: Units bool: settable false |
| onChange_ATC CLEARED LANDING | trigger_onChange_ATC CLEARED LANDING | Whether the ATC has cleared the plane for landing.: Units bool: settable false |
| onRequest_ATC CLEARED LANDING | trigger_onRequest_ATC CLEARED LANDING | Whether the ATC has cleared the plane for landing.: Units bool: settable false |
| ATC CLEARED TAKEOFF | trigger_ATC CLEARED TAKEOFF | Whether the ATC has cleared the plane for takeoff.: Units bool: settable false |
| onChange_ATC CLEARED TAKEOFF | trigger_onChange_ATC CLEARED TAKEOFF | Whether the ATC has cleared the plane for takeoff.: Units bool: settable false |
| onRequest_ATC CLEARED TAKEOFF | trigger_onRequest_ATC CLEARED TAKEOFF | Whether the ATC has cleared the plane for takeoff.: Units bool: settable false |
| ATC CLEARED TAXI | trigger_ATC CLEARED TAXI | Whether the ATC has cleared the plane for taxi.: Units bool: settable false |
| onChange_ATC CLEARED TAXI | trigger_onChange_ATC CLEARED TAXI | Whether the ATC has cleared the plane for taxi.: Units bool: settable false |
| onRequest_ATC CLEARED TAXI | trigger_onRequest_ATC CLEARED TAXI | Whether the ATC has cleared the plane for taxi.: Units bool: settable false |
| ATC CURRENT WAYPOINT ALTITUDE | trigger_ATC CURRENT WAYPOINT ALTITUDE | Returns the target altitude for the current ATC flightplan waypoint.: Units bool: settable false |
| onChange_ATC CURRENT WAYPOINT ALTITUDE | trigger_onChange_ATC CURRENT WAYPOINT ALTITUDE | Returns the target altitude for the current ATC flightplan waypoint.: Units bool: settable false |
| onRequest_ATC CURRENT WAYPOINT ALTITUDE | trigger_onRequest_ATC CURRENT WAYPOINT ALTITUDE | Returns the target altitude for the current ATC flightplan waypoint.: Units bool: settable false |
| ATC FLIGHT NUMBER | trigger_ATC FLIGHT NUMBER | Flight Number used by ATC, as a string with a maximum number of 6 characters.: Units null: settable true |
| onChange_ATC FLIGHT NUMBER | trigger_onChange_ATC FLIGHT NUMBER | Flight Number used by ATC, as a string with a maximum number of 6 characters.: Units null: settable true |
| onRequest_ATC FLIGHT NUMBER | trigger_onRequest_ATC FLIGHT NUMBER | Flight Number used by ATC, as a string with a maximum number of 6 characters.: Units null: settable true |
| ATC FLIGHTPLAN DIFF ALT | trigger_ATC FLIGHTPLAN DIFF ALT | Altitude between the position of the aircraft and his closest waypoints in the flightplan.: Units meters: settable false |
| onChange_ATC FLIGHTPLAN DIFF ALT | trigger_onChange_ATC FLIGHTPLAN DIFF ALT | Altitude between the position of the aircraft and his closest waypoints in the flightplan.: Units meters: settable false |
| onRequest_ATC FLIGHTPLAN DIFF ALT | trigger_onRequest_ATC FLIGHTPLAN DIFF ALT | Altitude between the position of the aircraft and his closest waypoints in the flightplan.: Units meters: settable false |
| ATC FLIGHTPLAN DIFF DISTANCE | trigger_ATC FLIGHTPLAN DIFF DISTANCE | Returns the lateral distance the user's plane is from the ATC flight plan track.: Units meters: settable false |
| onChange_ATC FLIGHTPLAN DIFF DISTANCE | trigger_onChange_ATC FLIGHTPLAN DIFF DISTANCE | Returns the lateral distance the user's plane is from the ATC flight plan track.: Units meters: settable false |
| onRequest_ATC FLIGHTPLAN DIFF DISTANCE | trigger_onRequest_ATC FLIGHTPLAN DIFF DISTANCE | Returns the lateral distance the user's plane is from the ATC flight plan track.: Units meters: settable false |
| ATC FLIGHTPLAN DIFF HEADING | trigger_ATC FLIGHTPLAN DIFF HEADING | Heading between the position of the aircraft and his closest waypoints in the flightplan.: Units degrees: settable false |
| onChange_ATC FLIGHTPLAN DIFF HEADING | trigger_onChange_ATC FLIGHTPLAN DIFF HEADING | Heading between the position of the aircraft and his closest waypoints in the flightplan.: Units degrees: settable false |
| onRequest_ATC FLIGHTPLAN DIFF HEADING | trigger_onRequest_ATC FLIGHTPLAN DIFF HEADING | Heading between the position of the aircraft and his closest waypoints in the flightplan.: Units degrees: settable false |
| ATC HEAVY | trigger_ATC HEAVY | Is this aircraft recognized by ATC as heavy.: Units bool: settable true |
| onChange_ATC HEAVY | trigger_onChange_ATC HEAVY | Is this aircraft recognized by ATC as heavy.: Units bool: settable true |
| onRequest_ATC HEAVY | trigger_onRequest_ATC HEAVY | Is this aircraft recognized by ATC as heavy.: Units bool: settable true |
| ATC ID | trigger_ATC ID | ID used by ATC, as a string with a maximum number of 10 characters.: Units null: settable true |
| onChange_ATC ID | trigger_onChange_ATC ID | ID used by ATC, as a string with a maximum number of 10 characters.: Units null: settable true |
| onRequest_ATC ID | trigger_onRequest_ATC ID | ID used by ATC, as a string with a maximum number of 10 characters.: Units null: settable true |
| ATC IFR FP TO REQUEST | trigger_ATC IFR FP TO REQUEST | Returns true if the user has a valid IFR flight plan they can as for clearance for with ATC at the airport they are currently at.: Units bool: settable false |
| onChange_ATC IFR FP TO REQUEST | trigger_onChange_ATC IFR FP TO REQUEST | Returns true if the user has a valid IFR flight plan they can as for clearance for with ATC at the airport they are currently at.: Units bool: settable false |
| onRequest_ATC IFR FP TO REQUEST | trigger_onRequest_ATC IFR FP TO REQUEST | Returns true if the user has a valid IFR flight plan they can as for clearance for with ATC at the airport they are currently at.: Units bool: settable false |
| ATC MODEL | trigger_ATC MODEL | Model used by ATC, as a string with a maximum number of 10 characters.: Units null: settable false |
| onChange_ATC MODEL | trigger_onChange_ATC MODEL | Model used by ATC, as a string with a maximum number of 10 characters.: Units null: settable false |
| onRequest_ATC MODEL | trigger_onRequest_ATC MODEL | Model used by ATC, as a string with a maximum number of 10 characters.: Units null: settable false |
| ATC ON PARKING SPOT | trigger_ATC ON PARKING SPOT | Is ATC aircraft on parking spot.: Units bool: settable false |
| onChange_ATC ON PARKING SPOT | trigger_onChange_ATC ON PARKING SPOT | Is ATC aircraft on parking spot.: Units bool: settable false |
| onRequest_ATC ON PARKING SPOT | trigger_onRequest_ATC ON PARKING SPOT | Is ATC aircraft on parking spot.: Units bool: settable false |
| ATC PREVIOUS WAYPOINT ALTITUDE | trigger_ATC PREVIOUS WAYPOINT ALTITUDE | Returns the target altitude for the previous ATC flightplan waypoint.: Units meters: settable false |
| onChange_ATC PREVIOUS WAYPOINT ALTITUDE | trigger_onChange_ATC PREVIOUS WAYPOINT ALTITUDE | Returns the target altitude for the previous ATC flightplan waypoint.: Units meters: settable false |
| onRequest_ATC PREVIOUS WAYPOINT ALTITUDE | trigger_onRequest_ATC PREVIOUS WAYPOINT ALTITUDE | Returns the target altitude for the previous ATC flightplan waypoint.: Units meters: settable false |
| ATC RUNWAY AIRPORT NAME | trigger_ATC RUNWAY AIRPORT NAME | The name of the airport of the runway assigned by the ATC. Returns "" if no runway is assigned.: Units null: settable false |
| onChange_ATC RUNWAY AIRPORT NAME | trigger_onChange_ATC RUNWAY AIRPORT NAME | The name of the airport of the runway assigned by the ATC. Returns "" if no runway is assigned.: Units null: settable false |
| onRequest_ATC RUNWAY AIRPORT NAME | trigger_onRequest_ATC RUNWAY AIRPORT NAME | The name of the airport of the runway assigned by the ATC. Returns "" if no runway is assigned.: Units null: settable false |
| ATC RUNWAY DISTANCE | trigger_ATC RUNWAY DISTANCE | This float represents the distance between the player's plane and the center of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY DISTANCE | trigger_onChange_ATC RUNWAY DISTANCE | This float represents the distance between the player's plane and the center of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY DISTANCE | trigger_onRequest_ATC RUNWAY DISTANCE | This float represents the distance between the player's plane and the center of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY END DISTANCE | trigger_ATC RUNWAY END DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the end of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY END DISTANCE | trigger_onChange_ATC RUNWAY END DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the end of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY END DISTANCE | trigger_onRequest_ATC RUNWAY END DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the end of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY HEADING DEGREES TRUE | trigger_ATC RUNWAY HEADING DEGREES TRUE | This float represents the true heading of the runway selected by the ATC.: Units degrees: settable false |
| onChange_ATC RUNWAY HEADING DEGREES TRUE | trigger_onChange_ATC RUNWAY HEADING DEGREES TRUE | This float represents the true heading of the runway selected by the ATC.: Units degrees: settable false |
| onRequest_ATC RUNWAY HEADING DEGREES TRUE | trigger_onRequest_ATC RUNWAY HEADING DEGREES TRUE | This float represents the true heading of the runway selected by the ATC.: Units degrees: settable false |
| ATC RUNWAY LENGTH | trigger_ATC RUNWAY LENGTH | The length of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| onChange_ATC RUNWAY LENGTH | trigger_onChange_ATC RUNWAY LENGTH | The length of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| onRequest_ATC RUNWAY LENGTH | trigger_onRequest_ATC RUNWAY LENGTH | The length of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| ATC RUNWAY RELATIVE POSITION X | trigger_ATC RUNWAY RELATIVE POSITION X | This is a float corresponding to the player's main gear relative X (transverse) position on the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY RELATIVE POSITION X | trigger_onChange_ATC RUNWAY RELATIVE POSITION X | This is a float corresponding to the player's main gear relative X (transverse) position on the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY RELATIVE POSITION X | trigger_onRequest_ATC RUNWAY RELATIVE POSITION X | This is a float corresponding to the player's main gear relative X (transverse) position on the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY RELATIVE POSITION Y | trigger_ATC RUNWAY RELATIVE POSITION Y | This is a float corresponding to the player's main gear relative Y (height) position on the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY RELATIVE POSITION Y | trigger_onChange_ATC RUNWAY RELATIVE POSITION Y | This is a float corresponding to the player's main gear relative Y (height) position on the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY RELATIVE POSITION Y | trigger_onRequest_ATC RUNWAY RELATIVE POSITION Y | This is a float corresponding to the player's main gear relative Y (height) position on the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY RELATIVE POSITION Z | trigger_ATC RUNWAY RELATIVE POSITION Z | This is a float corresponding to the player's main gear relative Z (longitudinal) position on the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY RELATIVE POSITION Z | trigger_onChange_ATC RUNWAY RELATIVE POSITION Z | This is a float corresponding to the player's main gear relative Z (longitudinal) position on the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY RELATIVE POSITION Z | trigger_onRequest_ATC RUNWAY RELATIVE POSITION Z | This is a float corresponding to the player's main gear relative Z (longitudinal) position on the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY SELECTED | trigger_ATC RUNWAY SELECTED | This is a boolean corresponding to whether or not the ATC has pre-selected a runway for the player's plane. If this is false, every other ATC RUNWAY * SimVar will return default values.: Units bool: settable false |
| onChange_ATC RUNWAY SELECTED | trigger_onChange_ATC RUNWAY SELECTED | This is a boolean corresponding to whether or not the ATC has pre-selected a runway for the player's plane. If this is false, every other ATC RUNWAY * SimVar will return default values.: Units bool: settable false |
| onRequest_ATC RUNWAY SELECTED | trigger_onRequest_ATC RUNWAY SELECTED | This is a boolean corresponding to whether or not the ATC has pre-selected a runway for the player's plane. If this is false, every other ATC RUNWAY * SimVar will return default values.: Units bool: settable false |
| ATC RUNWAY START DISTANCE | trigger_ATC RUNWAY START DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the start of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY START DISTANCE | trigger_onChange_ATC RUNWAY START DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the start of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY START DISTANCE | trigger_onRequest_ATC RUNWAY START DISTANCE | This is a float corresponding to the horizontal distance between the player's plane and the start of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY TDPOINT RELATIVE POSITION X | trigger_ATC RUNWAY TDPOINT RELATIVE POSITION X | This float represents the player's main gear relative X (transverse) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY TDPOINT RELATIVE POSITION X | trigger_onChange_ATC RUNWAY TDPOINT RELATIVE POSITION X | This float represents the player's main gear relative X (transverse) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION X | trigger_onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION X | This float represents the player's main gear relative X (transverse) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY TDPOINT RELATIVE POSITION Y | trigger_ATC RUNWAY TDPOINT RELATIVE POSITION Y | This float represents the player's main gear relative Y (height) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY TDPOINT RELATIVE POSITION Y | trigger_onChange_ATC RUNWAY TDPOINT RELATIVE POSITION Y | This float represents the player's main gear relative Y (height) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION Y | trigger_onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION Y | This float represents the player's main gear relative Y (height) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY TDPOINT RELATIVE POSITION Z | trigger_ATC RUNWAY TDPOINT RELATIVE POSITION Z | This float represents the player's main relative Z (longitudinal) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onChange_ATC RUNWAY TDPOINT RELATIVE POSITION Z | trigger_onChange_ATC RUNWAY TDPOINT RELATIVE POSITION Z | This float represents the player's main relative Z (longitudinal) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION Z | trigger_onRequest_ATC RUNWAY TDPOINT RELATIVE POSITION Z | This float represents the player's main relative Z (longitudinal) position according to the aiming point of the runway selected by the ATC.: Units meters: settable false |
| ATC RUNWAY WIDTH | trigger_ATC RUNWAY WIDTH | The width of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| onChange_ATC RUNWAY WIDTH | trigger_onChange_ATC RUNWAY WIDTH | The width of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| onRequest_ATC RUNWAY WIDTH | trigger_onRequest_ATC RUNWAY WIDTH | The width of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters: settable false |
| ATC SUGGESTED MIN RWY LANDING | trigger_ATC SUGGESTED MIN RWY LANDING | Suggested minimum runway length for landing. Used by ATC.: Units feet: settable false |
| onChange_ATC SUGGESTED MIN RWY LANDING | trigger_onChange_ATC SUGGESTED MIN RWY LANDING | Suggested minimum runway length for landing. Used by ATC.: Units feet: settable false |
| onRequest_ATC SUGGESTED MIN RWY LANDING | trigger_onRequest_ATC SUGGESTED MIN RWY LANDING | Suggested minimum runway length for landing. Used by ATC.: Units feet: settable false |
| ATC SUGGESTED MIN RWY TAKEOFF | trigger_ATC SUGGESTED MIN RWY TAKEOFF | Suggested minimum runway length for takeoff. Used by ATC.: Units feet: settable false |
| onChange_ATC SUGGESTED MIN RWY TAKEOFF | trigger_onChange_ATC SUGGESTED MIN RWY TAKEOFF | Suggested minimum runway length for takeoff. Used by ATC.: Units feet: settable false |
| onRequest_ATC SUGGESTED MIN RWY TAKEOFF | trigger_onRequest_ATC SUGGESTED MIN RWY TAKEOFF | Suggested minimum runway length for takeoff. Used by ATC.: Units feet: settable false |
| ATC TAXIPATH DISTANCE | trigger_ATC TAXIPATH DISTANCE | Returns the lateral distance the user's plane is from the path of the currently issued ATC taxi instructions.: Units meters: settable false |
| onChange_ATC TAXIPATH DISTANCE | trigger_onChange_ATC TAXIPATH DISTANCE | Returns the lateral distance the user's plane is from the path of the currently issued ATC taxi instructions.: Units meters: settable false |
| onRequest_ATC TAXIPATH DISTANCE | trigger_onRequest_ATC TAXIPATH DISTANCE | Returns the lateral distance the user's plane is from the path of the currently issued ATC taxi instructions.: Units meters: settable false |
| ATC TYPE | trigger_ATC TYPE | Type used by ATC.: Units null: settable false |
| onChange_ATC TYPE | trigger_onChange_ATC TYPE | Type used by ATC.: Units null: settable false |
| onRequest_ATC TYPE | trigger_onRequest_ATC TYPE | Type used by ATC.: Units null: settable false |
| ATTITUDE BARS POSITION | trigger_ATTITUDE BARS POSITION | AI reference pitch reference bars: Units percent Over 100: settable false |
| onChange_ATTITUDE BARS POSITION | trigger_onChange_ATTITUDE BARS POSITION | AI reference pitch reference bars: Units percent Over 100: settable false |
| onRequest_ATTITUDE BARS POSITION | trigger_onRequest_ATTITUDE BARS POSITION | AI reference pitch reference bars: Units percent Over 100: settable false |
| ATTITUDE CAGE | trigger_ATTITUDE CAGE | AI caged state: Units bool: settable false |
| onChange_ATTITUDE CAGE | trigger_onChange_ATTITUDE CAGE | AI caged state: Units bool: settable false |
| onRequest_ATTITUDE CAGE | trigger_onRequest_ATTITUDE CAGE | AI caged state: Units bool: settable false |
| ATTITUDE INDICATOR BANK DEGREES | trigger_ATTITUDE INDICATOR BANK DEGREES | AI bank indication: Units radians: settable false |
| onChange_ATTITUDE INDICATOR BANK DEGREES | trigger_onChange_ATTITUDE INDICATOR BANK DEGREES | AI bank indication: Units radians: settable false |
| onRequest_ATTITUDE INDICATOR BANK DEGREES | trigger_onRequest_ATTITUDE INDICATOR BANK DEGREES | AI bank indication: Units radians: settable false |
| ATTITUDE INDICATOR PITCH DEGREES | trigger_ATTITUDE INDICATOR PITCH DEGREES | AI pitch indication: Units radians: settable false |
| onChange_ATTITUDE INDICATOR PITCH DEGREES | trigger_onChange_ATTITUDE INDICATOR PITCH DEGREES | AI pitch indication: Units radians: settable false |
| onRequest_ATTITUDE INDICATOR PITCH DEGREES | trigger_onRequest_ATTITUDE INDICATOR PITCH DEGREES | AI pitch indication: Units radians: settable false |
| AUDIO PANEL AVAILABLE | trigger_AUDIO PANEL AVAILABLE | True if the audio panel is available.: Units bool: settable false |
| onChange_AUDIO PANEL AVAILABLE | trigger_onChange_AUDIO PANEL AVAILABLE | True if the audio panel is available.: Units bool: settable false |
| onRequest_AUDIO PANEL AVAILABLE | trigger_onRequest_AUDIO PANEL AVAILABLE | True if the audio panel is available.: Units bool: settable false |
| AUDIO PANEL VOLUME | trigger_AUDIO PANEL VOLUME | The Volume of the Audio Panel.: Units percent: settable false |
| onChange_AUDIO PANEL VOLUME | trigger_onChange_AUDIO PANEL VOLUME | The Volume of the Audio Panel.: Units percent: settable false |
| onRequest_AUDIO PANEL VOLUME | trigger_onRequest_AUDIO PANEL VOLUME | The Volume of the Audio Panel.: Units percent: settable false |
| AUTO BRAKE SWITCH CB | trigger_AUTO BRAKE SWITCH CB | Auto brake switch position: Units number: settable false |
| onChange_AUTO BRAKE SWITCH CB | trigger_onChange_AUTO BRAKE SWITCH CB | Auto brake switch position: Units number: settable false |
| onRequest_AUTO BRAKE SWITCH CB | trigger_onRequest_AUTO BRAKE SWITCH CB | Auto brake switch position: Units number: settable false |
| AUTO COORDINATION | trigger_AUTO COORDINATION | Is auto-coordination active.: Units bool: settable true |
| onChange_AUTO COORDINATION | trigger_onChange_AUTO COORDINATION | Is auto-coordination active.: Units bool: settable true |
| onRequest_AUTO COORDINATION | trigger_onRequest_AUTO COORDINATION | Is auto-coordination active.: Units bool: settable true |
| AUTOBRAKES ACTIVE | trigger_AUTOBRAKES ACTIVE | Whether or not the AutoBrakes are currently active: Units bool: settable false |
| onChange_AUTOBRAKES ACTIVE | trigger_onChange_AUTOBRAKES ACTIVE | Whether or not the AutoBrakes are currently active: Units bool: settable false |
| onRequest_AUTOBRAKES ACTIVE | trigger_onRequest_AUTOBRAKES ACTIVE | Whether or not the AutoBrakes are currently active: Units bool: settable false |
| AUTOPILOT AIRSPEED ACQUISITION | trigger_AUTOPILOT AIRSPEED ACQUISITION | Currently not used within the simulation: Units bool: settable false |
| onChange_AUTOPILOT AIRSPEED ACQUISITION | trigger_onChange_AUTOPILOT AIRSPEED ACQUISITION | Currently not used within the simulation: Units bool: settable false |
| onRequest_AUTOPILOT AIRSPEED ACQUISITION | trigger_onRequest_AUTOPILOT AIRSPEED ACQUISITION | Currently not used within the simulation: Units bool: settable false |
| AUTOPILOT AIRSPEED HOLD | trigger_AUTOPILOT AIRSPEED HOLD | returns whether airspeed hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT AIRSPEED HOLD | trigger_onChange_AUTOPILOT AIRSPEED HOLD | returns whether airspeed hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT AIRSPEED HOLD | trigger_onRequest_AUTOPILOT AIRSPEED HOLD | returns whether airspeed hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT AIRSPEED HOLD CURRENT | trigger_AUTOPILOT AIRSPEED HOLD CURRENT | Currently not used within the simulation: Units bool: settable false |
| onChange_AUTOPILOT AIRSPEED HOLD CURRENT | trigger_onChange_AUTOPILOT AIRSPEED HOLD CURRENT | Currently not used within the simulation: Units bool: settable false |
| onRequest_AUTOPILOT AIRSPEED HOLD CURRENT | trigger_onRequest_AUTOPILOT AIRSPEED HOLD CURRENT | Currently not used within the simulation: Units bool: settable false |
| AUTOPILOT AIRSPEED HOLD VAR | trigger_AUTOPILOT AIRSPEED HOLD VAR | Returns the target holding airspeed for the autopilot: Units knots: settable false |
| onChange_AUTOPILOT AIRSPEED HOLD VAR | trigger_onChange_AUTOPILOT AIRSPEED HOLD VAR | Returns the target holding airspeed for the autopilot: Units knots: settable false |
| onRequest_AUTOPILOT AIRSPEED HOLD VAR | trigger_onRequest_AUTOPILOT AIRSPEED HOLD VAR | Returns the target holding airspeed for the autopilot: Units knots: settable false |
| AUTOPILOT AIRSPEED MAX CALCULATED | trigger_AUTOPILOT AIRSPEED MAX CALCULATED | Returns the maximum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| onChange_AUTOPILOT AIRSPEED MAX CALCULATED | trigger_onChange_AUTOPILOT AIRSPEED MAX CALCULATED | Returns the maximum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| onRequest_AUTOPILOT AIRSPEED MAX CALCULATED | trigger_onRequest_AUTOPILOT AIRSPEED MAX CALCULATED | Returns the maximum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| AUTOPILOT AIRSPEED MIN CALCULATED | trigger_AUTOPILOT AIRSPEED MIN CALCULATED | Returns the minimum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| onChange_AUTOPILOT AIRSPEED MIN CALCULATED | trigger_onChange_AUTOPILOT AIRSPEED MIN CALCULATED | Returns the minimum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| onRequest_AUTOPILOT AIRSPEED MIN CALCULATED | trigger_onRequest_AUTOPILOT AIRSPEED MIN CALCULATED | Returns the minimum calculated airspeed (kcas) limit set for the autopilot: Units knots: settable false |
| AUTOPILOT ALT RADIO MODE | trigger_AUTOPILOT ALT RADIO MODE | If enabled the Autopilot will use the Radio Altitude rather than the Indicated Altitude: Units bool: settable false |
| onChange_AUTOPILOT ALT RADIO MODE | trigger_onChange_AUTOPILOT ALT RADIO MODE | If enabled the Autopilot will use the Radio Altitude rather than the Indicated Altitude: Units bool: settable false |
| onRequest_AUTOPILOT ALT RADIO MODE | trigger_onRequest_AUTOPILOT ALT RADIO MODE | If enabled the Autopilot will use the Radio Altitude rather than the Indicated Altitude: Units bool: settable false |
| AUTOPILOT ALTITUDE ARM | trigger_AUTOPILOT ALTITUDE ARM | Returns whether the autopilot is in Altitude Arm mode (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT ALTITUDE ARM | trigger_onChange_AUTOPILOT ALTITUDE ARM | Returns whether the autopilot is in Altitude Arm mode (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT ALTITUDE ARM | trigger_onRequest_AUTOPILOT ALTITUDE ARM | Returns whether the autopilot is in Altitude Arm mode (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT ALTITUDE LOCK | trigger_AUTOPILOT ALTITUDE LOCK | Altitude hold active: Units bool: settable false |
| onChange_AUTOPILOT ALTITUDE LOCK | trigger_onChange_AUTOPILOT ALTITUDE LOCK | Altitude hold active: Units bool: settable false |
| onRequest_AUTOPILOT ALTITUDE LOCK | trigger_onRequest_AUTOPILOT ALTITUDE LOCK | Altitude hold active: Units bool: settable false |
| AUTOPILOT ALTITUDE LOCK VAR | trigger_AUTOPILOT ALTITUDE LOCK VAR | Set or get the slot index which the altitude hold mode will track when captured. See alt_mode_slot_index for more information: Units feet: settable true |
| onChange_AUTOPILOT ALTITUDE LOCK VAR | trigger_onChange_AUTOPILOT ALTITUDE LOCK VAR | Set or get the slot index which the altitude hold mode will track when captured. See alt_mode_slot_index for more information: Units feet: settable true |
| onRequest_AUTOPILOT ALTITUDE LOCK VAR | trigger_onRequest_AUTOPILOT ALTITUDE LOCK VAR | Set or get the slot index which the altitude hold mode will track when captured. See alt_mode_slot_index for more information: Units feet: settable true |
| AUTOPILOT ALTITUDE MANUALLY TUNABLE | trigger_AUTOPILOT ALTITUDE MANUALLY TUNABLE | Whether or not the autopilot altitude is manually tunable or not: Units bool: settable false |
| onChange_AUTOPILOT ALTITUDE MANUALLY TUNABLE | trigger_onChange_AUTOPILOT ALTITUDE MANUALLY TUNABLE | Whether or not the autopilot altitude is manually tunable or not: Units bool: settable false |
| onRequest_AUTOPILOT ALTITUDE MANUALLY TUNABLE | trigger_onRequest_AUTOPILOT ALTITUDE MANUALLY TUNABLE | Whether or not the autopilot altitude is manually tunable or not: Units bool: settable false |
| AUTOPILOT ALTITUDE SLOT INDEX | trigger_AUTOPILOT ALTITUDE SLOT INDEX | Index of the slot that the autopilot will use for the altitude reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onChange_AUTOPILOT ALTITUDE SLOT INDEX | trigger_onChange_AUTOPILOT ALTITUDE SLOT INDEX | Index of the slot that the autopilot will use for the altitude reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onRequest_AUTOPILOT ALTITUDE SLOT INDEX | trigger_onRequest_AUTOPILOT ALTITUDE SLOT INDEX | Index of the slot that the autopilot will use for the altitude reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| AUTOPILOT APPROACH ACTIVE | trigger_AUTOPILOT APPROACH ACTIVE | When true, the autopilot is currently flying the approach Flight Plan (the last legs): Units bool: settable false |
| onChange_AUTOPILOT APPROACH ACTIVE | trigger_onChange_AUTOPILOT APPROACH ACTIVE | When true, the autopilot is currently flying the approach Flight Plan (the last legs): Units bool: settable false |
| onRequest_AUTOPILOT APPROACH ACTIVE | trigger_onRequest_AUTOPILOT APPROACH ACTIVE | When true, the autopilot is currently flying the approach Flight Plan (the last legs): Units bool: settable false |
| AUTOPILOT APPROACH ARM | trigger_AUTOPILOT APPROACH ARM | Returns true when the autopilot is active on the approach, once it reaches the adequate condition (in most cases, once it reaches the second-last waypoint of the flightplan): Units bool: settable false |
| onChange_AUTOPILOT APPROACH ARM | trigger_onChange_AUTOPILOT APPROACH ARM | Returns true when the autopilot is active on the approach, once it reaches the adequate condition (in most cases, once it reaches the second-last waypoint of the flightplan): Units bool: settable false |
| onRequest_AUTOPILOT APPROACH ARM | trigger_onRequest_AUTOPILOT APPROACH ARM | Returns true when the autopilot is active on the approach, once it reaches the adequate condition (in most cases, once it reaches the second-last waypoint of the flightplan): Units bool: settable false |
| AUTOPILOT APPROACH CAPTURED | trigger_AUTOPILOT APPROACH CAPTURED | Returns true when the lateral NAV mode is engaged and the angular deviation with the current tuned navigation frequency is less than 5°: Units bool: settable false |
| onChange_AUTOPILOT APPROACH CAPTURED | trigger_onChange_AUTOPILOT APPROACH CAPTURED | Returns true when the lateral NAV mode is engaged and the angular deviation with the current tuned navigation frequency is less than 5°: Units bool: settable false |
| onRequest_AUTOPILOT APPROACH CAPTURED | trigger_onRequest_AUTOPILOT APPROACH CAPTURED | Returns true when the lateral NAV mode is engaged and the angular deviation with the current tuned navigation frequency is less than 5°: Units bool: settable false |
| AUTOPILOT APPROACH HOLD | trigger_AUTOPILOT APPROACH HOLD | Returns whether pproach mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT APPROACH HOLD | trigger_onChange_AUTOPILOT APPROACH HOLD | Returns whether pproach mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT APPROACH HOLD | trigger_onRequest_AUTOPILOT APPROACH HOLD | Returns whether pproach mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT APPROACH IS LOCALIZER | trigger_AUTOPILOT APPROACH IS LOCALIZER | Returns true if the current approach is using a localizer: Units bool: settable false |
| onChange_AUTOPILOT APPROACH IS LOCALIZER | trigger_onChange_AUTOPILOT APPROACH IS LOCALIZER | Returns true if the current approach is using a localizer: Units bool: settable false |
| onRequest_AUTOPILOT APPROACH IS LOCALIZER | trigger_onRequest_AUTOPILOT APPROACH IS LOCALIZER | Returns true if the current approach is using a localizer: Units bool: settable false |
| AUTOPILOT ATTITUDE HOLD | trigger_AUTOPILOT ATTITUDE HOLD | Attitude hold active: Units bool: settable false |
| onChange_AUTOPILOT ATTITUDE HOLD | trigger_onChange_AUTOPILOT ATTITUDE HOLD | Attitude hold active: Units bool: settable false |
| onRequest_AUTOPILOT ATTITUDE HOLD | trigger_onRequest_AUTOPILOT ATTITUDE HOLD | Attitude hold active: Units bool: settable false |
| AUTOPILOT AVAILABLE | trigger_AUTOPILOT AVAILABLE | Available flag: Units bool: settable false |
| onChange_AUTOPILOT AVAILABLE | trigger_onChange_AUTOPILOT AVAILABLE | Available flag: Units bool: settable false |
| onRequest_AUTOPILOT AVAILABLE | trigger_onRequest_AUTOPILOT AVAILABLE | Available flag: Units bool: settable false |
| AUTOPILOT AVIONICS MANAGED | trigger_AUTOPILOT AVIONICS MANAGED | Returns whether the autopilot has active managed avionics (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT AVIONICS MANAGED | trigger_onChange_AUTOPILOT AVIONICS MANAGED | Returns whether the autopilot has active managed avionics (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT AVIONICS MANAGED | trigger_onRequest_AUTOPILOT AVIONICS MANAGED | Returns whether the autopilot has active managed avionics (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT BACKCOURSE HOLD | trigger_AUTOPILOT BACKCOURSE HOLD | Returns whether the autopilot back course mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT BACKCOURSE HOLD | trigger_onChange_AUTOPILOT BACKCOURSE HOLD | Returns whether the autopilot back course mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT BACKCOURSE HOLD | trigger_onRequest_AUTOPILOT BACKCOURSE HOLD | Returns whether the autopilot back course mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT BANK HOLD | trigger_AUTOPILOT BANK HOLD | Returns whether the autopilot bank hold mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT BANK HOLD | trigger_onChange_AUTOPILOT BANK HOLD | Returns whether the autopilot bank hold mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT BANK HOLD | trigger_onRequest_AUTOPILOT BANK HOLD | Returns whether the autopilot bank hold mode is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT BANK HOLD REF | trigger_AUTOPILOT BANK HOLD REF | The current bank-hold bank reference. Note that if you set this, the next frame the value will be overwritten by the engine, so you may need to write to this every game frame to ensure it maintains the required value: Units degrees: settable true |
| onChange_AUTOPILOT BANK HOLD REF | trigger_onChange_AUTOPILOT BANK HOLD REF | The current bank-hold bank reference. Note that if you set this, the next frame the value will be overwritten by the engine, so you may need to write to this every game frame to ensure it maintains the required value: Units degrees: settable true |
| onRequest_AUTOPILOT BANK HOLD REF | trigger_onRequest_AUTOPILOT BANK HOLD REF | The current bank-hold bank reference. Note that if you set this, the next frame the value will be overwritten by the engine, so you may need to write to this every game frame to ensure it maintains the required value: Units degrees: settable true |
| AUTOPILOT CRUISE SPEED HOLD | trigger_AUTOPILOT CRUISE SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| onChange_AUTOPILOT CRUISE SPEED HOLD | trigger_onChange_AUTOPILOT CRUISE SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| onRequest_AUTOPILOT CRUISE SPEED HOLD | trigger_onRequest_AUTOPILOT CRUISE SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| AUTOPILOT DEFAULT PITCH MODE | trigger_AUTOPILOT DEFAULT PITCH MODE | The current default pitch mode of the autopilot as configured in the plane configuration with the parameter default_pitch_mode: Units enum: settable false |
| onChange_AUTOPILOT DEFAULT PITCH MODE | trigger_onChange_AUTOPILOT DEFAULT PITCH MODE | The current default pitch mode of the autopilot as configured in the plane configuration with the parameter default_pitch_mode: Units enum: settable false |
| onRequest_AUTOPILOT DEFAULT PITCH MODE | trigger_onRequest_AUTOPILOT DEFAULT PITCH MODE | The current default pitch mode of the autopilot as configured in the plane configuration with the parameter default_pitch_mode: Units enum: settable false |
| AUTOPILOT DEFAULT ROLL MODE | trigger_AUTOPILOT DEFAULT ROLL MODE | The current default roll mode of the autopilot as configured in the plane configuration with the parameter default_bank_mode: Units enum: settable false |
| onChange_AUTOPILOT DEFAULT ROLL MODE | trigger_onChange_AUTOPILOT DEFAULT ROLL MODE | The current default roll mode of the autopilot as configured in the plane configuration with the parameter default_bank_mode: Units enum: settable false |
| onRequest_AUTOPILOT DEFAULT ROLL MODE | trigger_onRequest_AUTOPILOT DEFAULT ROLL MODE | The current default roll mode of the autopilot as configured in the plane configuration with the parameter default_bank_mode: Units enum: settable false |
| AUTOPILOT DISENGAGED | trigger_AUTOPILOT DISENGAGED | Returns whether the autopilot has been disengaged (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT DISENGAGED | trigger_onChange_AUTOPILOT DISENGAGED | Returns whether the autopilot has been disengaged (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT DISENGAGED | trigger_onRequest_AUTOPILOT DISENGAGED | Returns whether the autopilot has been disengaged (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT FLIGHT DIRECTOR ACTIVE | trigger_AUTOPILOT FLIGHT DIRECTOR ACTIVE | Flight director active: Units bool: settable false |
| onChange_AUTOPILOT FLIGHT DIRECTOR ACTIVE | trigger_onChange_AUTOPILOT FLIGHT DIRECTOR ACTIVE | Flight director active: Units bool: settable false |
| onRequest_AUTOPILOT FLIGHT DIRECTOR ACTIVE | trigger_onRequest_AUTOPILOT FLIGHT DIRECTOR ACTIVE | Flight director active: Units bool: settable false |
| AUTOPILOT FLIGHT DIRECTOR BANK | trigger_AUTOPILOT FLIGHT DIRECTOR BANK | Reference bank angle: Units radians: settable false |
| onChange_AUTOPILOT FLIGHT DIRECTOR BANK | trigger_onChange_AUTOPILOT FLIGHT DIRECTOR BANK | Reference bank angle: Units radians: settable false |
| onRequest_AUTOPILOT FLIGHT DIRECTOR BANK | trigger_onRequest_AUTOPILOT FLIGHT DIRECTOR BANK | Reference bank angle: Units radians: settable false |
| AUTOPILOT FLIGHT DIRECTOR BANK EX1 | trigger_AUTOPILOT FLIGHT DIRECTOR BANK EX1 | Raw reference bank angle: Units radians: settable false |
| onChange_AUTOPILOT FLIGHT DIRECTOR BANK EX1 | trigger_onChange_AUTOPILOT FLIGHT DIRECTOR BANK EX1 | Raw reference bank angle: Units radians: settable false |
| onRequest_AUTOPILOT FLIGHT DIRECTOR BANK EX1 | trigger_onRequest_AUTOPILOT FLIGHT DIRECTOR BANK EX1 | Raw reference bank angle: Units radians: settable false |
| AUTOPILOT FLIGHT DIRECTOR PITCH | trigger_AUTOPILOT FLIGHT DIRECTOR PITCH | Reference pitch angle: Units radians: settable false |
| onChange_AUTOPILOT FLIGHT DIRECTOR PITCH | trigger_onChange_AUTOPILOT FLIGHT DIRECTOR PITCH | Reference pitch angle: Units radians: settable false |
| onRequest_AUTOPILOT FLIGHT DIRECTOR PITCH | trigger_onRequest_AUTOPILOT FLIGHT DIRECTOR PITCH | Reference pitch angle: Units radians: settable false |
| AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | trigger_AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | Raw reference pitch angle: Units radians: settable false |
| onChange_AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | trigger_onChange_AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | Raw reference pitch angle: Units radians: settable false |
| onRequest_AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | trigger_onRequest_AUTOPILOT FLIGHT DIRECTOR PITCH EX1 | Raw reference pitch angle: Units radians: settable false |
| AUTOPILOT FLIGHT LEVEL CHANGE | trigger_AUTOPILOT FLIGHT LEVEL CHANGE | Boolean, toggles the autopilot Flight Level Change mode: Units bool: settable true |
| onChange_AUTOPILOT FLIGHT LEVEL CHANGE | trigger_onChange_AUTOPILOT FLIGHT LEVEL CHANGE | Boolean, toggles the autopilot Flight Level Change mode: Units bool: settable true |
| onRequest_AUTOPILOT FLIGHT LEVEL CHANGE | trigger_onRequest_AUTOPILOT FLIGHT LEVEL CHANGE | Boolean, toggles the autopilot Flight Level Change mode: Units bool: settable true |
| AUTOPILOT GLIDESLOPE ACTIVE | trigger_AUTOPILOT GLIDESLOPE ACTIVE | When true, the autopilot is receiving a signal from the runway beacon and is following the slope to reach the ground: Units bool: settable false |
| onChange_AUTOPILOT GLIDESLOPE ACTIVE | trigger_onChange_AUTOPILOT GLIDESLOPE ACTIVE | When true, the autopilot is receiving a signal from the runway beacon and is following the slope to reach the ground: Units bool: settable false |
| onRequest_AUTOPILOT GLIDESLOPE ACTIVE | trigger_onRequest_AUTOPILOT GLIDESLOPE ACTIVE | When true, the autopilot is receiving a signal from the runway beacon and is following the slope to reach the ground: Units bool: settable false |
| AUTOPILOT GLIDESLOPE ARM | trigger_AUTOPILOT GLIDESLOPE ARM | Returns true when the autopilot is active on the glide slope: Units bool: settable false |
| onChange_AUTOPILOT GLIDESLOPE ARM | trigger_onChange_AUTOPILOT GLIDESLOPE ARM | Returns true when the autopilot is active on the glide slope: Units bool: settable false |
| onRequest_AUTOPILOT GLIDESLOPE ARM | trigger_onRequest_AUTOPILOT GLIDESLOPE ARM | Returns true when the autopilot is active on the glide slope: Units bool: settable false |
| AUTOPILOT GLIDESLOPE HOLD | trigger_AUTOPILOT GLIDESLOPE HOLD | Returns whether the autopilot glidslope hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT GLIDESLOPE HOLD | trigger_onChange_AUTOPILOT GLIDESLOPE HOLD | Returns whether the autopilot glidslope hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT GLIDESLOPE HOLD | trigger_onRequest_AUTOPILOT GLIDESLOPE HOLD | Returns whether the autopilot glidslope hold is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT HEADING LOCK | trigger_AUTOPILOT HEADING LOCK | Returns whether the autopilot heading lock is enabled (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT HEADING LOCK | trigger_onChange_AUTOPILOT HEADING LOCK | Returns whether the autopilot heading lock is enabled (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT HEADING LOCK | trigger_onRequest_AUTOPILOT HEADING LOCK | Returns whether the autopilot heading lock is enabled (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT HEADING LOCK DIR | trigger_AUTOPILOT HEADING LOCK DIR | Specifies / Returns the locked in heading for the autopilot: Units degrees: settable true |
| onChange_AUTOPILOT HEADING LOCK DIR | trigger_onChange_AUTOPILOT HEADING LOCK DIR | Specifies / Returns the locked in heading for the autopilot: Units degrees: settable true |
| onRequest_AUTOPILOT HEADING LOCK DIR | trigger_onRequest_AUTOPILOT HEADING LOCK DIR | Specifies / Returns the locked in heading for the autopilot: Units degrees: settable true |
| AUTOPILOT HEADING MANUALLY TUNABLE | trigger_AUTOPILOT HEADING MANUALLY TUNABLE | Whether or not the autopilot heading is manually tunable or not: Units bool: settable true |
| onChange_AUTOPILOT HEADING MANUALLY TUNABLE | trigger_onChange_AUTOPILOT HEADING MANUALLY TUNABLE | Whether or not the autopilot heading is manually tunable or not: Units bool: settable true |
| onRequest_AUTOPILOT HEADING MANUALLY TUNABLE | trigger_onRequest_AUTOPILOT HEADING MANUALLY TUNABLE | Whether or not the autopilot heading is manually tunable or not: Units bool: settable true |
| AUTOPILOT HEADING SLOT INDEX | trigger_AUTOPILOT HEADING SLOT INDEX | Index of the slot that the autopilot will use for the heading reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onChange_AUTOPILOT HEADING SLOT INDEX | trigger_onChange_AUTOPILOT HEADING SLOT INDEX | Index of the slot that the autopilot will use for the heading reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onRequest_AUTOPILOT HEADING SLOT INDEX | trigger_onRequest_AUTOPILOT HEADING SLOT INDEX | Index of the slot that the autopilot will use for the heading reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| AUTOPILOT MACH HOLD | trigger_AUTOPILOT MACH HOLD | Mach hold active: Units bool: settable false |
| onChange_AUTOPILOT MACH HOLD | trigger_onChange_AUTOPILOT MACH HOLD | Mach hold active: Units bool: settable false |
| onRequest_AUTOPILOT MACH HOLD | trigger_onRequest_AUTOPILOT MACH HOLD | Mach hold active: Units bool: settable false |
| AUTOPILOT MACH HOLD VAR | trigger_AUTOPILOT MACH HOLD VAR | Returns the target holding mach airspeed for the autopilot: Units number: settable false |
| onChange_AUTOPILOT MACH HOLD VAR | trigger_onChange_AUTOPILOT MACH HOLD VAR | Returns the target holding mach airspeed for the autopilot: Units number: settable false |
| onRequest_AUTOPILOT MACH HOLD VAR | trigger_onRequest_AUTOPILOT MACH HOLD VAR | Returns the target holding mach airspeed for the autopilot: Units number: settable false |
| AUTOPILOT MANAGED INDEX | trigger_AUTOPILOT MANAGED INDEX | Currently not used within the simulation: Units number: settable false |
| onChange_AUTOPILOT MANAGED INDEX | trigger_onChange_AUTOPILOT MANAGED INDEX | Currently not used within the simulation: Units number: settable false |
| onRequest_AUTOPILOT MANAGED INDEX | trigger_onRequest_AUTOPILOT MANAGED INDEX | Currently not used within the simulation: Units number: settable false |
| AUTOPILOT MANAGED SPEED IN MACH | trigger_AUTOPILOT MANAGED SPEED IN MACH | Returns whether the managed speed is in mach (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT MANAGED SPEED IN MACH | trigger_onChange_AUTOPILOT MANAGED SPEED IN MACH | Returns whether the managed speed is in mach (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT MANAGED SPEED IN MACH | trigger_onRequest_AUTOPILOT MANAGED SPEED IN MACH | Returns whether the managed speed is in mach (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT MANAGED THROTTLE ACTIVE | trigger_AUTOPILOT MANAGED THROTTLE ACTIVE | Returns whether the autopilot managed throttle is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT MANAGED THROTTLE ACTIVE | trigger_onChange_AUTOPILOT MANAGED THROTTLE ACTIVE | Returns whether the autopilot managed throttle is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT MANAGED THROTTLE ACTIVE | trigger_onRequest_AUTOPILOT MANAGED THROTTLE ACTIVE | Returns whether the autopilot managed throttle is active (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT MASTER | trigger_AUTOPILOT MASTER | On/off flag: Units bool: settable false |
| onChange_AUTOPILOT MASTER | trigger_onChange_AUTOPILOT MASTER | On/off flag: Units bool: settable false |
| onRequest_AUTOPILOT MASTER | trigger_onRequest_AUTOPILOT MASTER | On/off flag: Units bool: settable false |
| AUTOPILOT MAX BANK | trigger_AUTOPILOT MAX BANK | Returns the maximum banking angle for the autopilot, in radians.: Units radians: settable false |
| onChange_AUTOPILOT MAX BANK | trigger_onChange_AUTOPILOT MAX BANK | Returns the maximum banking angle for the autopilot, in radians.: Units radians: settable false |
| onRequest_AUTOPILOT MAX BANK | trigger_onRequest_AUTOPILOT MAX BANK | Returns the maximum banking angle for the autopilot, in radians.: Units radians: settable false |
| AUTOPILOT MAX BANK ID | trigger_AUTOPILOT MAX BANK ID | Returns the index of the current maximum bank setting of the autopilot: Units number: settable false |
| onChange_AUTOPILOT MAX BANK ID | trigger_onChange_AUTOPILOT MAX BANK ID | Returns the index of the current maximum bank setting of the autopilot: Units number: settable false |
| onRequest_AUTOPILOT MAX BANK ID | trigger_onRequest_AUTOPILOT MAX BANK ID | Returns the index of the current maximum bank setting of the autopilot: Units number: settable false |
| AUTOPILOT MAX SPEED HOLD | trigger_AUTOPILOT MAX SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| onChange_AUTOPILOT MAX SPEED HOLD | trigger_onChange_AUTOPILOT MAX SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| onRequest_AUTOPILOT MAX SPEED HOLD | trigger_onRequest_AUTOPILOT MAX SPEED HOLD | Currently not used within the simulation: Units bool: settable false |
| AUTOPILOT NAV SELECTED | trigger_AUTOPILOT NAV SELECTED | Index of Nav radio selected: Units number: settable false |
| onChange_AUTOPILOT NAV SELECTED | trigger_onChange_AUTOPILOT NAV SELECTED | Index of Nav radio selected: Units number: settable false |
| onRequest_AUTOPILOT NAV SELECTED | trigger_onRequest_AUTOPILOT NAV SELECTED | Index of Nav radio selected: Units number: settable false |
| AUTOPILOT NAV1 LOCK | trigger_AUTOPILOT NAV1 LOCK | Returns TRUE (1) if the autopilot Nav1 lock is applied, or 0 (FALSE) otherwise: Units bool: settable false |
| onChange_AUTOPILOT NAV1 LOCK | trigger_onChange_AUTOPILOT NAV1 LOCK | Returns TRUE (1) if the autopilot Nav1 lock is applied, or 0 (FALSE) otherwise: Units bool: settable false |
| onRequest_AUTOPILOT NAV1 LOCK | trigger_onRequest_AUTOPILOT NAV1 LOCK | Returns TRUE (1) if the autopilot Nav1 lock is applied, or 0 (FALSE) otherwise: Units bool: settable false |
| AUTOPILOT PITCH HOLD | trigger_AUTOPILOT PITCH HOLD | Set to True if the autopilot pitch hold has is engaged: Units bool: settable false |
| onChange_AUTOPILOT PITCH HOLD | trigger_onChange_AUTOPILOT PITCH HOLD | Set to True if the autopilot pitch hold has is engaged: Units bool: settable false |
| onRequest_AUTOPILOT PITCH HOLD | trigger_onRequest_AUTOPILOT PITCH HOLD | Set to True if the autopilot pitch hold has is engaged: Units bool: settable false |
| AUTOPILOT PITCH HOLD REF | trigger_AUTOPILOT PITCH HOLD REF | Returns the current autotpilot reference pitch.: Units radians: settable false |
| onChange_AUTOPILOT PITCH HOLD REF | trigger_onChange_AUTOPILOT PITCH HOLD REF | Returns the current autotpilot reference pitch.: Units radians: settable false |
| onRequest_AUTOPILOT PITCH HOLD REF | trigger_onRequest_AUTOPILOT PITCH HOLD REF | Returns the current autotpilot reference pitch.: Units radians: settable false |
| AUTOPILOT RPM HOLD | trigger_AUTOPILOT RPM HOLD | True if autopilot rpm hold applied: Units bool: settable false |
| onChange_AUTOPILOT RPM HOLD | trigger_onChange_AUTOPILOT RPM HOLD | True if autopilot rpm hold applied: Units bool: settable false |
| onRequest_AUTOPILOT RPM HOLD | trigger_onRequest_AUTOPILOT RPM HOLD | True if autopilot rpm hold applied: Units bool: settable false |
| AUTOPILOT RPM HOLD VAR | trigger_AUTOPILOT RPM HOLD VAR | Selected rpm: Units number: settable false |
| onChange_AUTOPILOT RPM HOLD VAR | trigger_onChange_AUTOPILOT RPM HOLD VAR | Selected rpm: Units number: settable false |
| onRequest_AUTOPILOT RPM HOLD VAR | trigger_onRequest_AUTOPILOT RPM HOLD VAR | Selected rpm: Units number: settable false |
| AUTOPILOT RPM SLOT INDEX | trigger_AUTOPILOT RPM SLOT INDEX | Index of the slot that the autopilot will use for the RPM reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onChange_AUTOPILOT RPM SLOT INDEX | trigger_onChange_AUTOPILOT RPM SLOT INDEX | Index of the slot that the autopilot will use for the RPM reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onRequest_AUTOPILOT RPM SLOT INDEX | trigger_onRequest_AUTOPILOT RPM SLOT INDEX | Index of the slot that the autopilot will use for the RPM reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| AUTOPILOT SPEED SETTING | trigger_AUTOPILOT SPEED SETTING | Currently not used within the simulation: Units knots: settable false |
| onChange_AUTOPILOT SPEED SETTING | trigger_onChange_AUTOPILOT SPEED SETTING | Currently not used within the simulation: Units knots: settable false |
| onRequest_AUTOPILOT SPEED SETTING | trigger_onRequest_AUTOPILOT SPEED SETTING | Currently not used within the simulation: Units knots: settable false |
| AUTOPILOT SPEED SLOT INDEX | trigger_AUTOPILOT SPEED SLOT INDEX | Index of the managed references: Units number: settable false |
| onChange_AUTOPILOT SPEED SLOT INDEX | trigger_onChange_AUTOPILOT SPEED SLOT INDEX | Index of the managed references: Units number: settable false |
| onRequest_AUTOPILOT SPEED SLOT INDEX | trigger_onRequest_AUTOPILOT SPEED SLOT INDEX | Index of the managed references: Units number: settable false |
| AUTOPILOT TAKEOFF POWER ACTIVE | trigger_AUTOPILOT TAKEOFF POWER ACTIVE | Takeoff / Go Around power mode active: Units bool: settable false |
| onChange_AUTOPILOT TAKEOFF POWER ACTIVE | trigger_onChange_AUTOPILOT TAKEOFF POWER ACTIVE | Takeoff / Go Around power mode active: Units bool: settable false |
| onRequest_AUTOPILOT TAKEOFF POWER ACTIVE | trigger_onRequest_AUTOPILOT TAKEOFF POWER ACTIVE | Takeoff / Go Around power mode active: Units bool: settable false |
| AUTOPILOT THROTTLE ARM | trigger_AUTOPILOT THROTTLE ARM | Returns whether the autopilot auto-throttle is armed (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onChange_AUTOPILOT THROTTLE ARM | trigger_onChange_AUTOPILOT THROTTLE ARM | Returns whether the autopilot auto-throttle is armed (1, TRUE) or not (0, FALSE): Units bool: settable false |
| onRequest_AUTOPILOT THROTTLE ARM | trigger_onRequest_AUTOPILOT THROTTLE ARM | Returns whether the autopilot auto-throttle is armed (1, TRUE) or not (0, FALSE): Units bool: settable false |
| AUTOPILOT THROTTLE MAX THRUST | trigger_AUTOPILOT THROTTLE MAX THRUST | This can be used to set/get the thrust lever position for autopilot maximum thrust: Units percent: settable true |
| onChange_AUTOPILOT THROTTLE MAX THRUST | trigger_onChange_AUTOPILOT THROTTLE MAX THRUST | This can be used to set/get the thrust lever position for autopilot maximum thrust: Units percent: settable true |
| onRequest_AUTOPILOT THROTTLE MAX THRUST | trigger_onRequest_AUTOPILOT THROTTLE MAX THRUST | This can be used to set/get the thrust lever position for autopilot maximum thrust: Units percent: settable true |
| AUTOPILOT VERTICAL HOLD | trigger_AUTOPILOT VERTICAL HOLD | True if autopilot vertical hold applied: Units bool: settable false |
| onChange_AUTOPILOT VERTICAL HOLD | trigger_onChange_AUTOPILOT VERTICAL HOLD | True if autopilot vertical hold applied: Units bool: settable false |
| onRequest_AUTOPILOT VERTICAL HOLD | trigger_onRequest_AUTOPILOT VERTICAL HOLD | True if autopilot vertical hold applied: Units bool: settable false |
| AUTOPILOT VERTICAL HOLD VAR | trigger_AUTOPILOT VERTICAL HOLD VAR | Selected vertical speed: Units feet: settable true |
| onChange_AUTOPILOT VERTICAL HOLD VAR | trigger_onChange_AUTOPILOT VERTICAL HOLD VAR | Selected vertical speed: Units feet: settable true |
| onRequest_AUTOPILOT VERTICAL HOLD VAR | trigger_onRequest_AUTOPILOT VERTICAL HOLD VAR | Selected vertical speed: Units feet: settable true |
| AUTOPILOT VS SLOT INDEX | trigger_AUTOPILOT VS SLOT INDEX | Index of the slot that the autopilot will use for the VS reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onChange_AUTOPILOT VS SLOT INDEX | trigger_onChange_AUTOPILOT VS SLOT INDEX | Index of the slot that the autopilot will use for the VS reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| onRequest_AUTOPILOT VS SLOT INDEX | trigger_onRequest_AUTOPILOT VS SLOT INDEX | Index of the slot that the autopilot will use for the VS reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number: settable false |
| AUTOPILOT WING LEVELER | trigger_AUTOPILOT WING LEVELER | Wing leveler active: Units bool: settable false |
| onChange_AUTOPILOT WING LEVELER | trigger_onChange_AUTOPILOT WING LEVELER | Wing leveler active: Units bool: settable false |
| onRequest_AUTOPILOT WING LEVELER | trigger_onRequest_AUTOPILOT WING LEVELER | Wing leveler active: Units bool: settable false |
| AUTOPILOT YAW DAMPER | trigger_AUTOPILOT YAW DAMPER | Yaw damper active: Units bool: settable false |
| onChange_AUTOPILOT YAW DAMPER | trigger_onChange_AUTOPILOT YAW DAMPER | Yaw damper active: Units bool: settable false |
| onRequest_AUTOPILOT YAW DAMPER | trigger_onRequest_AUTOPILOT YAW DAMPER | Yaw damper active: Units bool: settable false |
| AUTOTHROTTLE ACTIVE | trigger_AUTOTHROTTLE ACTIVE | Auto-throttle active.: Units bool: settable false |
| onChange_AUTOTHROTTLE ACTIVE | trigger_onChange_AUTOTHROTTLE ACTIVE | Auto-throttle active.: Units bool: settable false |
| onRequest_AUTOTHROTTLE ACTIVE | trigger_onRequest_AUTOTHROTTLE ACTIVE | Auto-throttle active.: Units bool: settable false |
| AUX WHEEL ROTATION ANGLE | trigger_AUX WHEEL ROTATION ANGLE | Aux wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onChange_AUX WHEEL ROTATION ANGLE | trigger_onChange_AUX WHEEL ROTATION ANGLE | Aux wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onRequest_AUX WHEEL ROTATION ANGLE | trigger_onRequest_AUX WHEEL ROTATION ANGLE | Aux wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| AUX WHEEL RPM | trigger_AUX WHEEL RPM | Rpm of fourth set of gear wheels: Units RPM: settable false |
| onChange_AUX WHEEL RPM | trigger_onChange_AUX WHEEL RPM | Rpm of fourth set of gear wheels: Units RPM: settable false |
| onRequest_AUX WHEEL RPM | trigger_onRequest_AUX WHEEL RPM | Rpm of fourth set of gear wheels: Units RPM: settable false |
| AVIONICS MASTER SWITCH:index | trigger_AVIONICS MASTER SWITCH:index | The avionics master switch position, true if the switch is ON. Use an avionics circuit index when referencing.: Units bool: settable false |
| onChange_AVIONICS MASTER SWITCH:index | trigger_onChange_AVIONICS MASTER SWITCH:index | The avionics master switch position, true if the switch is ON. Use an avionics circuit index when referencing.: Units bool: settable false |
| onRequest_AVIONICS MASTER SWITCH:index | trigger_onRequest_AVIONICS MASTER SWITCH:index | The avionics master switch position, true if the switch is ON. Use an avionics circuit index when referencing.: Units bool: settable false |
| BAGGAGELOADER ANGLE CURRENT | trigger_BAGGAGELOADER ANGLE CURRENT | Current angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| onChange_BAGGAGELOADER ANGLE CURRENT | trigger_onChange_BAGGAGELOADER ANGLE CURRENT | Current angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| onRequest_BAGGAGELOADER ANGLE CURRENT | trigger_onRequest_BAGGAGELOADER ANGLE CURRENT | Current angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| BAGGAGELOADER ANGLE TARGET | trigger_BAGGAGELOADER ANGLE TARGET | Target angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| onChange_BAGGAGELOADER ANGLE TARGET | trigger_onChange_BAGGAGELOADER ANGLE TARGET | Target angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| onRequest_BAGGAGELOADER ANGLE TARGET | trigger_onRequest_BAGGAGELOADER ANGLE TARGET | Target angle of the baggage loader ramp, relative to the ground.: Units degrees: settable false |
| BAGGAGELOADER END RAMP Y | trigger_BAGGAGELOADER END RAMP Y | "Y" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| onChange_BAGGAGELOADER END RAMP Y | trigger_onChange_BAGGAGELOADER END RAMP Y | "Y" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| onRequest_BAGGAGELOADER END RAMP Y | trigger_onRequest_BAGGAGELOADER END RAMP Y | "Y" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| BAGGAGELOADER END RAMP Z | trigger_BAGGAGELOADER END RAMP Z | "Z" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| onChange_BAGGAGELOADER END RAMP Z | trigger_onChange_BAGGAGELOADER END RAMP Z | "Z" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| onRequest_BAGGAGELOADER END RAMP Z | trigger_onRequest_BAGGAGELOADER END RAMP Z | "Z" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters: settable false |
| BAGGAGELOADER PIVOT Y | trigger_BAGGAGELOADER PIVOT Y | "Y" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| onChange_BAGGAGELOADER PIVOT Y | trigger_onChange_BAGGAGELOADER PIVOT Y | "Y" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| onRequest_BAGGAGELOADER PIVOT Y | trigger_onRequest_BAGGAGELOADER PIVOT Y | "Y" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| BAGGAGELOADER PIVOT Z | trigger_BAGGAGELOADER PIVOT Z | "Z" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| onChange_BAGGAGELOADER PIVOT Z | trigger_onChange_BAGGAGELOADER PIVOT Z | "Z" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| onRequest_BAGGAGELOADER PIVOT Z | trigger_onRequest_BAGGAGELOADER PIVOT Z | "Z" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters: settable false |
| BARBER POLE MACH | trigger_BARBER POLE MACH | Mach associated with maximum airspeed.: Units mach: settable false |
| onChange_BARBER POLE MACH | trigger_onChange_BARBER POLE MACH | Mach associated with maximum airspeed.: Units mach: settable false |
| onRequest_BARBER POLE MACH | trigger_onRequest_BARBER POLE MACH | Mach associated with maximum airspeed.: Units mach: settable false |
| BAROMETER PRESSURE | trigger_BAROMETER PRESSURE | Barometric pressure.: Units Millibars: settable false |
| onChange_BAROMETER PRESSURE | trigger_onChange_BAROMETER PRESSURE | Barometric pressure.: Units Millibars: settable false |
| onRequest_BAROMETER PRESSURE | trigger_onRequest_BAROMETER PRESSURE | Barometric pressure.: Units Millibars: settable false |
| BATTERY BREAKER PULLED | trigger_BATTERY BREAKER PULLED | This will be true if the battery breaker is pulled. Requires a BUS LOOKUP INDEX and a battery index: Units bool: settable true |
| onChange_BATTERY BREAKER PULLED | trigger_onChange_BATTERY BREAKER PULLED | This will be true if the battery breaker is pulled. Requires a BUS LOOKUP INDEX and a battery index: Units bool: settable true |
| onRequest_BATTERY BREAKER PULLED | trigger_onRequest_BATTERY BREAKER PULLED | This will be true if the battery breaker is pulled. Requires a BUS LOOKUP INDEX and a battery index: Units bool: settable true |
| BATTERY CONNECTION ON | trigger_BATTERY CONNECTION ON | This will be true if the battery is connected. Requires a BUS_LOOKUP_INDEX and a battery index: Units bool: settable false |
| onChange_BATTERY CONNECTION ON | trigger_onChange_BATTERY CONNECTION ON | This will be true if the battery is connected. Requires a BUS_LOOKUP_INDEX and a battery index: Units bool: settable false |
| onRequest_BATTERY CONNECTION ON | trigger_onRequest_BATTERY CONNECTION ON | This will be true if the battery is connected. Requires a BUS_LOOKUP_INDEX and a battery index: Units bool: settable false |
| BETA DOT | trigger_BETA DOT | Beta dot: Units radians per second: settable false |
| onChange_BETA DOT | trigger_onChange_BETA DOT | Beta dot: Units radians per second: settable false |
| onRequest_BETA DOT | trigger_onRequest_BETA DOT | Beta dot: Units radians per second: settable false |
| BLAST SHIELD POSITION:index | trigger_BLAST SHIELD POSITION:index | Indexed from 1, 100 is fully deployed, 0 flat on deck: Units percent Over 100: settable false |
| onChange_BLAST SHIELD POSITION:index | trigger_onChange_BLAST SHIELD POSITION:index | Indexed from 1, 100 is fully deployed, 0 flat on deck: Units percent Over 100: settable false |
| onRequest_BLAST SHIELD POSITION:index | trigger_onRequest_BLAST SHIELD POSITION:index | Indexed from 1, 100 is fully deployed, 0 flat on deck: Units percent Over 100: settable false |
| BLEED AIR APU | trigger_BLEED AIR APU | Boolean, returns whether or not the APU attempts to provide Bleed Air: Units bool: settable false |
| onChange_BLEED AIR APU | trigger_onChange_BLEED AIR APU | Boolean, returns whether or not the APU attempts to provide Bleed Air: Units bool: settable false |
| onRequest_BLEED AIR APU | trigger_onRequest_BLEED AIR APU | Boolean, returns whether or not the APU attempts to provide Bleed Air: Units bool: settable false |
| BLEED AIR ENGINE:index | trigger_BLEED AIR ENGINE:index | Returns whether or not the indexed engine attempts to provide bleed air: Units bool: settable false |
| onChange_BLEED AIR ENGINE:index | trigger_onChange_BLEED AIR ENGINE:index | Returns whether or not the indexed engine attempts to provide bleed air: Units bool: settable false |
| onRequest_BLEED AIR ENGINE:index | trigger_onRequest_BLEED AIR ENGINE:index | Returns whether or not the indexed engine attempts to provide bleed air: Units bool: settable false |
| BLEED AIR SOURCE CONTROL:index | trigger_BLEED AIR SOURCE CONTROL:index | The bleed air system source controller for an indexed engine: Units enum: settable false |
| onChange_BLEED AIR SOURCE CONTROL:index | trigger_onChange_BLEED AIR SOURCE CONTROL:index | The bleed air system source controller for an indexed engine: Units enum: settable false |
| onRequest_BLEED AIR SOURCE CONTROL:index | trigger_onRequest_BLEED AIR SOURCE CONTROL:index | The bleed air system source controller for an indexed engine: Units enum: settable false |
| BOARDINGRAMP ELEVATION CURRENT | trigger_BOARDINGRAMP ELEVATION CURRENT | The current altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| onChange_BOARDINGRAMP ELEVATION CURRENT | trigger_onChange_BOARDINGRAMP ELEVATION CURRENT | The current altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| onRequest_BOARDINGRAMP ELEVATION CURRENT | trigger_onRequest_BOARDINGRAMP ELEVATION CURRENT | The current altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| BOARDINGRAMP ELEVATION TARGET | trigger_BOARDINGRAMP ELEVATION TARGET | The target altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| onChange_BOARDINGRAMP ELEVATION TARGET | trigger_onChange_BOARDINGRAMP ELEVATION TARGET | The target altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| onRequest_BOARDINGRAMP ELEVATION TARGET | trigger_onRequest_BOARDINGRAMP ELEVATION TARGET | The target altitude AGL of the top of the boarding ramp stairs.: Units meters: settable false |
| BOARDINGRAMP END POSITION Y | trigger_BOARDINGRAMP END POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| onChange_BOARDINGRAMP END POSITION Y | trigger_onChange_BOARDINGRAMP END POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| onRequest_BOARDINGRAMP END POSITION Y | trigger_onRequest_BOARDINGRAMP END POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| BOARDINGRAMP END POSITION Z | trigger_BOARDINGRAMP END POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| onChange_BOARDINGRAMP END POSITION Z | trigger_onChange_BOARDINGRAMP END POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| onRequest_BOARDINGRAMP END POSITION Z | trigger_onRequest_BOARDINGRAMP END POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters: settable false |
| BOARDINGRAMP ORIENTATION CURRENT | trigger_BOARDINGRAMP ORIENTATION CURRENT | The current orientation of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| onChange_BOARDINGRAMP ORIENTATION CURRENT | trigger_onChange_BOARDINGRAMP ORIENTATION CURRENT | The current orientation of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| onRequest_BOARDINGRAMP ORIENTATION CURRENT | trigger_onRequest_BOARDINGRAMP ORIENTATION CURRENT | The current orientation of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| BOARDINGRAMP ORIENTATION TARGET | trigger_BOARDINGRAMP ORIENTATION TARGET | The target orientation of of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| onChange_BOARDINGRAMP ORIENTATION TARGET | trigger_onChange_BOARDINGRAMP ORIENTATION TARGET | The target orientation of of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| onRequest_BOARDINGRAMP ORIENTATION TARGET | trigger_onRequest_BOARDINGRAMP ORIENTATION TARGET | The target orientation of of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100: settable false |
| BOARDINGRAMP START POSITION Y | trigger_BOARDINGRAMP START POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| onChange_BOARDINGRAMP START POSITION Y | trigger_onChange_BOARDINGRAMP START POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| onRequest_BOARDINGRAMP START POSITION Y | trigger_onRequest_BOARDINGRAMP START POSITION Y | The "Y" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| BOARDINGRAMP START POSITION Z | trigger_BOARDINGRAMP START POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| onChange_BOARDINGRAMP START POSITION Z | trigger_onChange_BOARDINGRAMP START POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| onRequest_BOARDINGRAMP START POSITION Z | trigger_onRequest_BOARDINGRAMP START POSITION Z | The "Z" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters: settable false |
| BRAKE DEPENDENT HYDRAULIC PRESSURE | trigger_BRAKE DEPENDENT HYDRAULIC PRESSURE | Brake dependent hydraulic pressure reading: Units pounds: settable false |
| onChange_BRAKE DEPENDENT HYDRAULIC PRESSURE | trigger_onChange_BRAKE DEPENDENT HYDRAULIC PRESSURE | Brake dependent hydraulic pressure reading: Units pounds: settable false |
| onRequest_BRAKE DEPENDENT HYDRAULIC PRESSURE | trigger_onRequest_BRAKE DEPENDENT HYDRAULIC PRESSURE | Brake dependent hydraulic pressure reading: Units pounds: settable false |
| BRAKE INDICATOR | trigger_BRAKE INDICATOR | Brake on indication: Units position: settable false |
| onChange_BRAKE INDICATOR | trigger_onChange_BRAKE INDICATOR | Brake on indication: Units position: settable false |
| onRequest_BRAKE INDICATOR | trigger_onRequest_BRAKE INDICATOR | Brake on indication: Units position: settable false |
| BRAKE LEFT POSITION | trigger_BRAKE LEFT POSITION | Percent left brake: Units position: settable true |
| onChange_BRAKE LEFT POSITION | trigger_onChange_BRAKE LEFT POSITION | Percent left brake: Units position: settable true |
| onRequest_BRAKE LEFT POSITION | trigger_onRequest_BRAKE LEFT POSITION | Percent left brake: Units position: settable true |
| BRAKE LEFT POSITION EX1 | trigger_BRAKE LEFT POSITION EX1 | Percent left brake, ignoring the effect of the parking brake: Units position: settable true |
| onChange_BRAKE LEFT POSITION EX1 | trigger_onChange_BRAKE LEFT POSITION EX1 | Percent left brake, ignoring the effect of the parking brake: Units position: settable true |
| onRequest_BRAKE LEFT POSITION EX1 | trigger_onRequest_BRAKE LEFT POSITION EX1 | Percent left brake, ignoring the effect of the parking brake: Units position: settable true |
| BRAKE PARKING INDICATOR | trigger_BRAKE PARKING INDICATOR | Parking brake indicator: Units bool: settable false |
| onChange_BRAKE PARKING INDICATOR | trigger_onChange_BRAKE PARKING INDICATOR | Parking brake indicator: Units bool: settable false |
| onRequest_BRAKE PARKING INDICATOR | trigger_onRequest_BRAKE PARKING INDICATOR | Parking brake indicator: Units bool: settable false |
| BRAKE PARKING POSITION | trigger_BRAKE PARKING POSITION | Gets the parking brake position - either on (true) or off (false): Units bool: settable false |
| onChange_BRAKE PARKING POSITION | trigger_onChange_BRAKE PARKING POSITION | Gets the parking brake position - either on (true) or off (false): Units bool: settable false |
| onRequest_BRAKE PARKING POSITION | trigger_onRequest_BRAKE PARKING POSITION | Gets the parking brake position - either on (true) or off (false): Units bool: settable false |
| BRAKE RIGHT POSITION | trigger_BRAKE RIGHT POSITION | Percent right brake: Units position: settable true |
| onChange_BRAKE RIGHT POSITION | trigger_onChange_BRAKE RIGHT POSITION | Percent right brake: Units position: settable true |
| onRequest_BRAKE RIGHT POSITION | trigger_onRequest_BRAKE RIGHT POSITION | Percent right brake: Units position: settable true |
| BRAKE RIGHT POSITION EX1 | trigger_BRAKE RIGHT POSITION EX1 | Percent right brake, ignoring the effect of the parking brake: Units position: settable true |
| onChange_BRAKE RIGHT POSITION EX1 | trigger_onChange_BRAKE RIGHT POSITION EX1 | Percent right brake, ignoring the effect of the parking brake: Units position: settable true |
| onRequest_BRAKE RIGHT POSITION EX1 | trigger_onRequest_BRAKE RIGHT POSITION EX1 | Percent right brake, ignoring the effect of the parking brake: Units position: settable true |
| BREAKER ADF | trigger_BREAKER ADF | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER ADF | trigger_onChange_BREAKER ADF | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER ADF | trigger_onRequest_BREAKER ADF | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER ALTFLD | trigger_BREAKER ALTFLD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER ALTFLD | trigger_onChange_BREAKER ALTFLD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER ALTFLD | trigger_onRequest_BREAKER ALTFLD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER AUTOPILOT | trigger_BREAKER AUTOPILOT | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER AUTOPILOT | trigger_onChange_BREAKER AUTOPILOT | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER AUTOPILOT | trigger_onRequest_BREAKER AUTOPILOT | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER AVNBUS1 | trigger_BREAKER AVNBUS1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER AVNBUS1 | trigger_onChange_BREAKER AVNBUS1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER AVNBUS1 | trigger_onRequest_BREAKER AVNBUS1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER AVNBUS2 | trigger_BREAKER AVNBUS2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER AVNBUS2 | trigger_onChange_BREAKER AVNBUS2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER AVNBUS2 | trigger_onRequest_BREAKER AVNBUS2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER AVNFAN | trigger_BREAKER AVNFAN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER AVNFAN | trigger_onChange_BREAKER AVNFAN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER AVNFAN | trigger_onRequest_BREAKER AVNFAN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER FLAP | trigger_BREAKER FLAP | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER FLAP | trigger_onChange_BREAKER FLAP | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER FLAP | trigger_onRequest_BREAKER FLAP | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER GPS | trigger_BREAKER GPS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER GPS | trigger_onChange_BREAKER GPS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER GPS | trigger_onRequest_BREAKER GPS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER INST | trigger_BREAKER INST | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER INST | trigger_onChange_BREAKER INST | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER INST | trigger_onRequest_BREAKER INST | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER INSTLTS | trigger_BREAKER INSTLTS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER INSTLTS | trigger_onChange_BREAKER INSTLTS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER INSTLTS | trigger_onRequest_BREAKER INSTLTS | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER NAVCOM1 | trigger_BREAKER NAVCOM1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER NAVCOM1 | trigger_onChange_BREAKER NAVCOM1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER NAVCOM1 | trigger_onRequest_BREAKER NAVCOM1 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER NAVCOM2 | trigger_BREAKER NAVCOM2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER NAVCOM2 | trigger_onChange_BREAKER NAVCOM2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER NAVCOM2 | trigger_onRequest_BREAKER NAVCOM2 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER NAVCOM3 | trigger_BREAKER NAVCOM3 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER NAVCOM3 | trigger_onChange_BREAKER NAVCOM3 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER NAVCOM3 | trigger_onRequest_BREAKER NAVCOM3 | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER TURNCOORD | trigger_BREAKER TURNCOORD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER TURNCOORD | trigger_onChange_BREAKER TURNCOORD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER TURNCOORD | trigger_onRequest_BREAKER TURNCOORD | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER WARN | trigger_BREAKER WARN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER WARN | trigger_onChange_BREAKER WARN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER WARN | trigger_onRequest_BREAKER WARN | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BREAKER XPNDR | trigger_BREAKER XPNDR | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onChange_BREAKER XPNDR | trigger_onChange_BREAKER XPNDR | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| onRequest_BREAKER XPNDR | trigger_onRequest_BREAKER XPNDR | Can be used to get or set the breaker state for the electrical system: Units bool: settable true |
| BUS BREAKER PULLED | trigger_BUS BREAKER PULLED | This will be true if the bus breaker is pulled. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable true |
| onChange_BUS BREAKER PULLED | trigger_onChange_BUS BREAKER PULLED | This will be true if the bus breaker is pulled. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable true |
| onRequest_BUS BREAKER PULLED | trigger_onRequest_BUS BREAKER PULLED | This will be true if the bus breaker is pulled. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable true |
| BUS CONNECTION ON | trigger_BUS CONNECTION ON | This will be true if the bus is connected. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable false |
| onChange_BUS CONNECTION ON | trigger_onChange_BUS CONNECTION ON | This will be true if the bus is connected. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable false |
| onRequest_BUS CONNECTION ON | trigger_onRequest_BUS CONNECTION ON | This will be true if the bus is connected. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool: settable false |
| CABIN NO SMOKING ALERT SWITCH | trigger_CABIN NO SMOKING ALERT SWITCH | True if the No Smoking switch is on.: Units bool: settable false |
| onChange_CABIN NO SMOKING ALERT SWITCH | trigger_onChange_CABIN NO SMOKING ALERT SWITCH | True if the No Smoking switch is on.: Units bool: settable false |
| onRequest_CABIN NO SMOKING ALERT SWITCH | trigger_onRequest_CABIN NO SMOKING ALERT SWITCH | True if the No Smoking switch is on.: Units bool: settable false |
| CABIN SEATBELTS ALERT SWITCH | trigger_CABIN SEATBELTS ALERT SWITCH | True if the Seatbelts switch is on.: Units bool: settable false |
| onChange_CABIN SEATBELTS ALERT SWITCH | trigger_onChange_CABIN SEATBELTS ALERT SWITCH | True if the Seatbelts switch is on.: Units bool: settable false |
| onRequest_CABIN SEATBELTS ALERT SWITCH | trigger_onRequest_CABIN SEATBELTS ALERT SWITCH | True if the Seatbelts switch is on.: Units bool: settable false |
| CABLE CAUGHT BY TAILHOOK:index | trigger_CABLE CAUGHT BY TAILHOOK:index | A number 1 through 4 for the cable number caught by the tailhook. Cable 1 is the one closest to the stern of the carrier. A value of 0 indicates no cable was caught: Units number: settable false |
| onChange_CABLE CAUGHT BY TAILHOOK:index | trigger_onChange_CABLE CAUGHT BY TAILHOOK:index | A number 1 through 4 for the cable number caught by the tailhook. Cable 1 is the one closest to the stern of the carrier. A value of 0 indicates no cable was caught: Units number: settable false |
| onRequest_CABLE CAUGHT BY TAILHOOK:index | trigger_onRequest_CABLE CAUGHT BY TAILHOOK:index | A number 1 through 4 for the cable number caught by the tailhook. Cable 1 is the one closest to the stern of the carrier. A value of 0 indicates no cable was caught: Units number: settable false |
| CAMERA ACTION COCKPIT VIEW RESET | trigger_CAMERA ACTION COCKPIT VIEW RESET | This can be used to reset the cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). Essentially the same as the user pressing the default reset keys CTRL + Space.: Units bool: settable true |
| onChange_CAMERA ACTION COCKPIT VIEW RESET | trigger_onChange_CAMERA ACTION COCKPIT VIEW RESET | This can be used to reset the cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). Essentially the same as the user pressing the default reset keys CTRL + Space.: Units bool: settable true |
| onRequest_CAMERA ACTION COCKPIT VIEW RESET | trigger_onRequest_CAMERA ACTION COCKPIT VIEW RESET | This can be used to reset the cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). Essentially the same as the user pressing the default reset keys CTRL + Space.: Units bool: settable true |
| CAMERA ACTION COCKPIT VIEW SAVE:index | trigger_CAMERA ACTION COCKPIT VIEW SAVE:index | This can be used to save a cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). The index value given is the save "slot" that will be used, from 0 to 9. Essentially this is the same as the user pressing the default save keys CTRL + Alt + 0-9.: Units bool: settable true |
| onChange_CAMERA ACTION COCKPIT VIEW SAVE:index | trigger_onChange_CAMERA ACTION COCKPIT VIEW SAVE:index | This can be used to save a cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). The index value given is the save "slot" that will be used, from 0 to 9. Essentially this is the same as the user pressing the default save keys CTRL + Alt + 0-9.: Units bool: settable true |
| onRequest_CAMERA ACTION COCKPIT VIEW SAVE:index | trigger_onRequest_CAMERA ACTION COCKPIT VIEW SAVE:index | This can be used to save a cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). The index value given is the save "slot" that will be used, from 0 to 9. Essentially this is the same as the user pressing the default save keys CTRL + Alt + 0-9.: Units bool: settable true |
| CAMERA GAMEPLAY PITCH YAW:index | trigger_CAMERA GAMEPLAY PITCH YAW:index | Returns either the pitch (index 0) or the yaw (index 1) of the current gameplay camera.: Units radians: settable false |
| onChange_CAMERA GAMEPLAY PITCH YAW:index | trigger_onChange_CAMERA GAMEPLAY PITCH YAW:index | Returns either the pitch (index 0) or the yaw (index 1) of the current gameplay camera.: Units radians: settable false |
| onRequest_CAMERA GAMEPLAY PITCH YAW:index | trigger_onRequest_CAMERA GAMEPLAY PITCH YAW:index | Returns either the pitch (index 0) or the yaw (index 1) of the current gameplay camera.: Units radians: settable false |
| CAMERA REQUEST ACTION | trigger_CAMERA REQUEST ACTION | This can be used to have the currently active camera perform a predefined action. Currently only 1 action is supported, but more may be added over time.: Units enum: settable true |
| onChange_CAMERA REQUEST ACTION | trigger_onChange_CAMERA REQUEST ACTION | This can be used to have the currently active camera perform a predefined action. Currently only 1 action is supported, but more may be added over time.: Units enum: settable true |
| onRequest_CAMERA REQUEST ACTION | trigger_onRequest_CAMERA REQUEST ACTION | This can be used to have the currently active camera perform a predefined action. Currently only 1 action is supported, but more may be added over time.: Units enum: settable true |
| CAMERA STATE | trigger_CAMERA STATE | This can be used to get or set the camera "state", which will be one of the listed enum values.: Units enum: settable true |
| onChange_CAMERA STATE | trigger_onChange_CAMERA STATE | This can be used to get or set the camera "state", which will be one of the listed enum values.: Units enum: settable true |
| onRequest_CAMERA STATE | trigger_onRequest_CAMERA STATE | This can be used to get or set the camera "state", which will be one of the listed enum values.: Units enum: settable true |
| CAMERA SUBSTATE | trigger_CAMERA SUBSTATE | This variable can be used to get or set the camera "sub-state". The options here are generally only required when working with the in-sim panel UI. Note that the "locked" and "unlocked" state will be changed automatically if the following SimVars have their values changed: COCKPIT_CAMERA_HEADLOOK, CHASE_CAMERA_HEADLOOK.: Units enum: settable true |
| onChange_CAMERA SUBSTATE | trigger_onChange_CAMERA SUBSTATE | This variable can be used to get or set the camera "sub-state". The options here are generally only required when working with the in-sim panel UI. Note that the "locked" and "unlocked" state will be changed automatically if the following SimVars have their values changed: COCKPIT_CAMERA_HEADLOOK, CHASE_CAMERA_HEADLOOK.: Units enum: settable true |
| onRequest_CAMERA SUBSTATE | trigger_onRequest_CAMERA SUBSTATE | This variable can be used to get or set the camera "sub-state". The options here are generally only required when working with the in-sim panel UI. Note that the "locked" and "unlocked" state will be changed automatically if the following SimVars have their values changed: COCKPIT_CAMERA_HEADLOOK, CHASE_CAMERA_HEADLOOK.: Units enum: settable true |
| CAMERA VIEW TYPE AND INDEX MAX:index | trigger_CAMERA VIEW TYPE AND INDEX MAX:index | This variable can get the number of option indices related to a specific camera view type. The index value supplied to the SimVar should be one of the camera view type Enum values (see CAMERA VIEW TYPE AND INDEX), and the SimVar will return the number of options available for that camera type (counting from 1, so - for example - if the camera view type is "Quickview" and has 8 quickview settings, then CAMERA VIEW TYPE AND INDEX MAX:4 will return 8). Note that this value can be set after a flight has started, but it will have no effect since the number of camera options is initilaised once only and not updated (and the simulation may overwrite the value again even after setting it).: Units number: settable true |
| onChange_CAMERA VIEW TYPE AND INDEX MAX:index | trigger_onChange_CAMERA VIEW TYPE AND INDEX MAX:index | This variable can get the number of option indices related to a specific camera view type. The index value supplied to the SimVar should be one of the camera view type Enum values (see CAMERA VIEW TYPE AND INDEX), and the SimVar will return the number of options available for that camera type (counting from 1, so - for example - if the camera view type is "Quickview" and has 8 quickview settings, then CAMERA VIEW TYPE AND INDEX MAX:4 will return 8). Note that this value can be set after a flight has started, but it will have no effect since the number of camera options is initilaised once only and not updated (and the simulation may overwrite the value again even after setting it).: Units number: settable true |
| onRequest_CAMERA VIEW TYPE AND INDEX MAX:index | trigger_onRequest_CAMERA VIEW TYPE AND INDEX MAX:index | This variable can get the number of option indices related to a specific camera view type. The index value supplied to the SimVar should be one of the camera view type Enum values (see CAMERA VIEW TYPE AND INDEX), and the SimVar will return the number of options available for that camera type (counting from 1, so - for example - if the camera view type is "Quickview" and has 8 quickview settings, then CAMERA VIEW TYPE AND INDEX MAX:4 will return 8). Note that this value can be set after a flight has started, but it will have no effect since the number of camera options is initilaised once only and not updated (and the simulation may overwrite the value again even after setting it).: Units number: settable true |
| CAMERA VIEW TYPE AND INDEX:index | trigger_CAMERA VIEW TYPE AND INDEX:index | With this you can get or set both the type of view for the current camera, as well as the option index, which will be between 0 and the maximum index value (as retrieved using the CAMERA VIEW TYPE AND INDEX MAX SimVar). Supplying an index of 0 to the SimVar will get/set the type (from the selection of enum values listed), and using an index of 1 will get/set the option index, which is an integer value.: Units enum: settable true |
| onChange_CAMERA VIEW TYPE AND INDEX:index | trigger_onChange_CAMERA VIEW TYPE AND INDEX:index | With this you can get or set both the type of view for the current camera, as well as the option index, which will be between 0 and the maximum index value (as retrieved using the CAMERA VIEW TYPE AND INDEX MAX SimVar). Supplying an index of 0 to the SimVar will get/set the type (from the selection of enum values listed), and using an index of 1 will get/set the option index, which is an integer value.: Units enum: settable true |
| onRequest_CAMERA VIEW TYPE AND INDEX:index | trigger_onRequest_CAMERA VIEW TYPE AND INDEX:index | With this you can get or set both the type of view for the current camera, as well as the option index, which will be between 0 and the maximum index value (as retrieved using the CAMERA VIEW TYPE AND INDEX MAX SimVar). Supplying an index of 0 to the SimVar will get/set the type (from the selection of enum values listed), and using an index of 1 will get/set the option index, which is an integer value.: Units enum: settable true |
| CANOPY OPEN | trigger_CANOPY OPEN | Percent primary door/exit open.: Units percent Over 100: settable true |
| onChange_CANOPY OPEN | trigger_onChange_CANOPY OPEN | Percent primary door/exit open.: Units percent Over 100: settable true |
| onRequest_CANOPY OPEN | trigger_onRequest_CANOPY OPEN | Percent primary door/exit open.: Units percent Over 100: settable true |
| CARB HEAT AVAILABLE | trigger_CARB HEAT AVAILABLE | True if carburetor heat available.: Units bool: settable false |
| onChange_CARB HEAT AVAILABLE | trigger_onChange_CARB HEAT AVAILABLE | True if carburetor heat available.: Units bool: settable false |
| onRequest_CARB HEAT AVAILABLE | trigger_onRequest_CARB HEAT AVAILABLE | True if carburetor heat available.: Units bool: settable false |
| CATAPULT STROKE POSITION:index | trigger_CATAPULT STROKE POSITION:index | Catapults are indexed from 1. This value will be 0 before the catapult fires, and then up to 100 as the aircraft is propelled down the catapult. The aircraft may takeoff before the value reaches 100 (depending on the aircraft weight, power applied, and other factors), in which case this value will not be further updated. This value could be used to drive a bogie animation: Units number: settable false |
| onChange_CATAPULT STROKE POSITION:index | trigger_onChange_CATAPULT STROKE POSITION:index | Catapults are indexed from 1. This value will be 0 before the catapult fires, and then up to 100 as the aircraft is propelled down the catapult. The aircraft may takeoff before the value reaches 100 (depending on the aircraft weight, power applied, and other factors), in which case this value will not be further updated. This value could be used to drive a bogie animation: Units number: settable false |
| onRequest_CATAPULT STROKE POSITION:index | trigger_onRequest_CATAPULT STROKE POSITION:index | Catapults are indexed from 1. This value will be 0 before the catapult fires, and then up to 100 as the aircraft is propelled down the catapult. The aircraft may takeoff before the value reaches 100 (depending on the aircraft weight, power applied, and other factors), in which case this value will not be further updated. This value could be used to drive a bogie animation: Units number: settable false |
| CATEGORY | trigger_CATEGORY | Type of aircraft: Units null: settable false |
| onChange_CATEGORY | trigger_onChange_CATEGORY | Type of aircraft: Units null: settable false |
| onRequest_CATEGORY | trigger_onRequest_CATEGORY | Type of aircraft: Units null: settable false |
| CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | trigger_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | The "Z" axis position of the point of contact between the catering truck and the bottom of the aircraft door, relative to the ground.: Units meters: settable false |
| onChange_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | trigger_onChange_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | The "Z" axis position of the point of contact between the catering truck and the bottom of the aircraft door, relative to the ground.: Units meters: settable false |
| onRequest_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | trigger_onRequest_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z | The "Z" axis position of the point of contact between the catering truck and the bottom of the aircraft door, relative to the ground.: Units meters: settable false |
| CATERINGTRUCK ELEVATION CURRENT | trigger_CATERINGTRUCK ELEVATION CURRENT | The current altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| onChange_CATERINGTRUCK ELEVATION CURRENT | trigger_onChange_CATERINGTRUCK ELEVATION CURRENT | The current altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| onRequest_CATERINGTRUCK ELEVATION CURRENT | trigger_onRequest_CATERINGTRUCK ELEVATION CURRENT | The current altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| CATERINGTRUCK ELEVATION TARGET | trigger_CATERINGTRUCK ELEVATION TARGET | The target altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| onChange_CATERINGTRUCK ELEVATION TARGET | trigger_onChange_CATERINGTRUCK ELEVATION TARGET | The target altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| onRequest_CATERINGTRUCK ELEVATION TARGET | trigger_onRequest_CATERINGTRUCK ELEVATION TARGET | The target altitude AGL of the bottom of the catering truck container.: Units meters: settable false |
| CATERINGTRUCK OPENING CURRENT | trigger_CATERINGTRUCK OPENING CURRENT | The current state of the catering truck when opening the container and deploying the bridge, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| onChange_CATERINGTRUCK OPENING CURRENT | trigger_onChange_CATERINGTRUCK OPENING CURRENT | The current state of the catering truck when opening the container and deploying the bridge, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| onRequest_CATERINGTRUCK OPENING CURRENT | trigger_onRequest_CATERINGTRUCK OPENING CURRENT | The current state of the catering truck when opening the container and deploying the bridge, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| CATERINGTRUCK OPENING TARGET | trigger_CATERINGTRUCK OPENING TARGET | The target state of the catering truck the container is opene and the bridge deployed, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| onChange_CATERINGTRUCK OPENING TARGET | trigger_onChange_CATERINGTRUCK OPENING TARGET | The target state of the catering truck the container is opene and the bridge deployed, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| onRequest_CATERINGTRUCK OPENING TARGET | trigger_onRequest_CATERINGTRUCK OPENING TARGET | The target state of the catering truck the container is opene and the bridge deployed, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100: settable false |
| CENTER WHEEL ROTATION ANGLE | trigger_CENTER WHEEL ROTATION ANGLE | Center wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onChange_CENTER WHEEL ROTATION ANGLE | trigger_onChange_CENTER WHEEL ROTATION ANGLE | Center wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onRequest_CENTER WHEEL ROTATION ANGLE | trigger_onRequest_CENTER WHEEL ROTATION ANGLE | Center wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| CENTER WHEEL RPM | trigger_CENTER WHEEL RPM | Center landing gear rpm: Units RPM: settable false |
| onChange_CENTER WHEEL RPM | trigger_onChange_CENTER WHEEL RPM | Center landing gear rpm: Units RPM: settable false |
| onRequest_CENTER WHEEL RPM | trigger_onRequest_CENTER WHEEL RPM | Center landing gear rpm: Units RPM: settable false |
| CG AFT LIMIT | trigger_CG AFT LIMIT | Most backward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| onChange_CG AFT LIMIT | trigger_onChange_CG AFT LIMIT | Most backward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| onRequest_CG AFT LIMIT | trigger_onRequest_CG AFT LIMIT | Most backward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| CG FEET | trigger_CG FEET | The longitudinal CG position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET | trigger_onChange_CG FEET | The longitudinal CG position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET | trigger_onRequest_CG FEET | The longitudinal CG position relative to the Reference Datum Position.: Units feet: settable false |
| CG FEET AFT LIMIT | trigger_CG FEET AFT LIMIT | The aft CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET AFT LIMIT | trigger_onChange_CG FEET AFT LIMIT | The aft CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET AFT LIMIT | trigger_onRequest_CG FEET AFT LIMIT | The aft CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| CG FEET FWD LIMIT | trigger_CG FEET FWD LIMIT | The forward CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET FWD LIMIT | trigger_onChange_CG FEET FWD LIMIT | The forward CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET FWD LIMIT | trigger_onRequest_CG FEET FWD LIMIT | The forward CG limit position relative to the Reference Datum Position.: Units feet: settable false |
| CG FEET LATERAL | trigger_CG FEET LATERAL | The lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET LATERAL | trigger_onChange_CG FEET LATERAL | The lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET LATERAL | trigger_onRequest_CG FEET LATERAL | The lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| CG FEET LATERAL LEFT LIMIT | trigger_CG FEET LATERAL LEFT LIMIT | The left hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET LATERAL LEFT LIMIT | trigger_onChange_CG FEET LATERAL LEFT LIMIT | The left hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET LATERAL LEFT LIMIT | trigger_onRequest_CG FEET LATERAL LEFT LIMIT | The left hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| CG FEET LATERAL RIGHT LIMIT | trigger_CG FEET LATERAL RIGHT LIMIT | The right hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onChange_CG FEET LATERAL RIGHT LIMIT | trigger_onChange_CG FEET LATERAL RIGHT LIMIT | The right hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| onRequest_CG FEET LATERAL RIGHT LIMIT | trigger_onRequest_CG FEET LATERAL RIGHT LIMIT | The right hand lateral CG position relative to the Reference Datum Position.: Units feet: settable false |
| CG FWD LIMIT | trigger_CG FWD LIMIT | Most forward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| onChange_CG FWD LIMIT | trigger_onChange_CG FWD LIMIT | Most forward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| onRequest_CG FWD LIMIT | trigger_onRequest_CG FWD LIMIT | Most forward authorized position of the CG according to the POH.: Units percent Over 100: settable false |
| CG MAX MACH | trigger_CG MAX MACH | Deprecated, do not use!: Units mach: settable false |
| onChange_CG MAX MACH | trigger_onChange_CG MAX MACH | Deprecated, do not use!: Units mach: settable false |
| onRequest_CG MAX MACH | trigger_onRequest_CG MAX MACH | Deprecated, do not use!: Units mach: settable false |
| CG MIN MACH | trigger_CG MIN MACH | Deprecated, do not use!: Units mach: settable false |
| onChange_CG MIN MACH | trigger_onChange_CG MIN MACH | Deprecated, do not use!: Units mach: settable false |
| onRequest_CG MIN MACH | trigger_onRequest_CG MIN MACH | Deprecated, do not use!: Units mach: settable false |
| CG PERCENT | trigger_CG PERCENT | Longitudinal CG position as a percent of reference chord: Units percent Over 100: settable false |
| onChange_CG PERCENT | trigger_onChange_CG PERCENT | Longitudinal CG position as a percent of reference chord: Units percent Over 100: settable false |
| onRequest_CG PERCENT | trigger_onRequest_CG PERCENT | Longitudinal CG position as a percent of reference chord: Units percent Over 100: settable false |
| CG PERCENT LATERAL | trigger_CG PERCENT LATERAL | Lateral CG position as a percent of reference chord: Units percent Over 100: settable false |
| onChange_CG PERCENT LATERAL | trigger_onChange_CG PERCENT LATERAL | Lateral CG position as a percent of reference chord: Units percent Over 100: settable false |
| onRequest_CG PERCENT LATERAL | trigger_onRequest_CG PERCENT LATERAL | Lateral CG position as a percent of reference chord: Units percent Over 100: settable false |
| CHASE CAMERA HEADLOOK | trigger_CHASE CAMERA HEADLOOK | This is used to get/set the look state of the chase (external) camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 3 (External/Chase).: Units enum: settable true |
| onChange_CHASE CAMERA HEADLOOK | trigger_onChange_CHASE CAMERA HEADLOOK | This is used to get/set the look state of the chase (external) camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 3 (External/Chase).: Units enum: settable true |
| onRequest_CHASE CAMERA HEADLOOK | trigger_onRequest_CHASE CAMERA HEADLOOK | This is used to get/set the look state of the chase (external) camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 3 (External/Chase).: Units enum: settable true |
| CHASE CAMERA MOMENTUM | trigger_CHASE CAMERA MOMENTUM | Sets/gets the momentum modifier of the chase (external) camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| onChange_CHASE CAMERA MOMENTUM | trigger_onChange_CHASE CAMERA MOMENTUM | Sets/gets the momentum modifier of the chase (external) camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| onRequest_CHASE CAMERA MOMENTUM | trigger_onRequest_CHASE CAMERA MOMENTUM | Sets/gets the momentum modifier of the chase (external) camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| CHASE CAMERA SPEED | trigger_CHASE CAMERA SPEED | Sets/gets the translation speed modifier of the chase (external) camara, as a percentage. Default is 50%.: Units percent: settable true |
| onChange_CHASE CAMERA SPEED | trigger_onChange_CHASE CAMERA SPEED | Sets/gets the translation speed modifier of the chase (external) camara, as a percentage. Default is 50%.: Units percent: settable true |
| onRequest_CHASE CAMERA SPEED | trigger_onRequest_CHASE CAMERA SPEED | Sets/gets the translation speed modifier of the chase (external) camara, as a percentage. Default is 50%.: Units percent: settable true |
| CHASE CAMERA ZOOM | trigger_CHASE CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the chase (external) camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| onChange_CHASE CAMERA ZOOM | trigger_onChange_CHASE CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the chase (external) camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| onRequest_CHASE CAMERA ZOOM | trigger_onRequest_CHASE CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the chase (external) camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| CHASE CAMERA ZOOM SPEED | trigger_CHASE CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV chase (external) camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| onChange_CHASE CAMERA ZOOM SPEED | trigger_onChange_CHASE CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV chase (external) camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| onRequest_CHASE CAMERA ZOOM SPEED | trigger_onRequest_CHASE CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV chase (external) camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| CIRCUIT AUTO BRAKES ON | trigger_CIRCUIT AUTO BRAKES ON | Is electrical power available to this circuit: Units bool: settable false |
| onChange_CIRCUIT AUTO BRAKES ON | trigger_onChange_CIRCUIT AUTO BRAKES ON | Is electrical power available to this circuit: Units bool: settable false |
| onRequest_CIRCUIT AUTO BRAKES ON | trigger_onRequest_CIRCUIT AUTO BRAKES ON | Is electrical power available to this circuit: Units bool: settable false |
| CIRCUIT AUTO FEATHER ON | trigger_CIRCUIT AUTO FEATHER ON | Is electrical power available to this circuit: Units bool: settable false |
| onChange_CIRCUIT AUTO FEATHER ON | trigger_onChange_CIRCUIT AUTO FEATHER ON | Is electrical power available to this circuit: Units bool: settable false |
| onRequest_CIRCUIT AUTO FEATHER ON | trigger_onRequest_CIRCUIT AUTO FEATHER ON | Is electrical power available to this circuit: Units bool: settable false |
| CIRCUIT AUTOPILOT ON | trigger_CIRCUIT AUTOPILOT ON | Is electrical power available to this circuit: Units bool: settable false |
| onChange_CIRCUIT AUTOPILOT ON | trigger_onChange_CIRCUIT AUTOPILOT ON | Is electrical power available to this circuit: Units bool: settable false |
| onRequest_CIRCUIT AUTOPILOT ON | trigger_onRequest_CIRCUIT AUTOPILOT ON | Is electrical power available to this circuit: Units bool: settable false |
| CIRCUIT AVIONICS ON | trigger_CIRCUIT AVIONICS ON | Is electrical power available to this circuit: Units bool: settable false |
| onChange_CIRCUIT AVIONICS ON | trigger_onChange_CIRCUIT AVIONICS ON | Is electrical power available to this circuit: Units bool: settable false |
| onRequest_CIRCUIT AVIONICS ON | trigger_onRequest_CIRCUIT AVIONICS ON | Is electrical power available to this circuit: Units bool: settable false |
| CIRCUIT BREAKER PULLED | trigger_CIRCUIT BREAKER PULLED | This will be true if the circuit breaker is pulled. Requires a BUS_LOOKUP_INDEX and a circuit index.: Units bool: settable true |
| onChange_CIRCUIT BREAKER PULLED | trigger_onChange_CIRCUIT BREAKER PULLED | This will be true if the circuit breaker is pulled. Requires a BUS_LOOKUP_INDEX and a circuit index.: Units bool: settable true |
| onRequest_CIRCUIT BREAKER PULLED | trigger_onRequest_CIRCUIT BREAKER PULLED | This will be true if the circuit breaker is pulled. Requires a BUS_LOOKUP_INDEX and a circuit index.: Units bool: settable true |
| CIRCUIT CONNECTION ON | trigger_CIRCUIT CONNECTION ON | This will be true if the circuit is connected. Requires a BUS_LOOKUP_INDEX and a circuit index: Units bool: settable false |
| onChange_CIRCUIT CONNECTION ON | trigger_onChange_CIRCUIT CONNECTION ON | This will be true if the circuit is connected. Requires a BUS_LOOKUP_INDEX and a circuit index: Units bool: settable false |
| onRequest_CIRCUIT CONNECTION ON | trigger_onRequest_CIRCUIT CONNECTION ON | This will be true if the circuit is connected. Requires a BUS_LOOKUP_INDEX and a circuit index: Units bool: settable false |
| CIRCUIT FLAP MOTOR ON | trigger_CIRCUIT FLAP MOTOR ON | Is electrical power available to the flap motor circuit: Units bool: settable false |
| onChange_CIRCUIT FLAP MOTOR ON | trigger_onChange_CIRCUIT FLAP MOTOR ON | Is electrical power available to the flap motor circuit: Units bool: settable false |
| onRequest_CIRCUIT FLAP MOTOR ON | trigger_onRequest_CIRCUIT FLAP MOTOR ON | Is electrical power available to the flap motor circuit: Units bool: settable false |
| CIRCUIT GEAR MOTOR ON | trigger_CIRCUIT GEAR MOTOR ON | Is electrical power available to the gear motor circuit: Units bool: settable false |
| onChange_CIRCUIT GEAR MOTOR ON | trigger_onChange_CIRCUIT GEAR MOTOR ON | Is electrical power available to the gear motor circuit: Units bool: settable false |
| onRequest_CIRCUIT GEAR MOTOR ON | trigger_onRequest_CIRCUIT GEAR MOTOR ON | Is electrical power available to the gear motor circuit: Units bool: settable false |
| CIRCUIT GEAR WARNING ON | trigger_CIRCUIT GEAR WARNING ON | Is electrical power available to gear warning circuit: Units bool: settable false |
| onChange_CIRCUIT GEAR WARNING ON | trigger_onChange_CIRCUIT GEAR WARNING ON | Is electrical power available to gear warning circuit: Units bool: settable false |
| onRequest_CIRCUIT GEAR WARNING ON | trigger_onRequest_CIRCUIT GEAR WARNING ON | Is electrical power available to gear warning circuit: Units bool: settable false |
| CIRCUIT GENERAL PANEL ON | trigger_CIRCUIT GENERAL PANEL ON | Is electrical power available to the general panel circuit: Units bool: settable false |
| onChange_CIRCUIT GENERAL PANEL ON | trigger_onChange_CIRCUIT GENERAL PANEL ON | Is electrical power available to the general panel circuit: Units bool: settable false |
| onRequest_CIRCUIT GENERAL PANEL ON | trigger_onRequest_CIRCUIT GENERAL PANEL ON | Is electrical power available to the general panel circuit: Units bool: settable false |
| CIRCUIT HYDRAULIC PUMP ON | trigger_CIRCUIT HYDRAULIC PUMP ON | Is electrical power available to the hydraulic pump circuit: Units bool: settable false |
| onChange_CIRCUIT HYDRAULIC PUMP ON | trigger_onChange_CIRCUIT HYDRAULIC PUMP ON | Is electrical power available to the hydraulic pump circuit: Units bool: settable false |
| onRequest_CIRCUIT HYDRAULIC PUMP ON | trigger_onRequest_CIRCUIT HYDRAULIC PUMP ON | Is electrical power available to the hydraulic pump circuit: Units bool: settable false |
| CIRCUIT MARKER BEACON ON | trigger_CIRCUIT MARKER BEACON ON | Is electrical power available to the marker beacon circuit: Units bool: settable false |
| onChange_CIRCUIT MARKER BEACON ON | trigger_onChange_CIRCUIT MARKER BEACON ON | Is electrical power available to the marker beacon circuit: Units bool: settable false |
| onRequest_CIRCUIT MARKER BEACON ON | trigger_onRequest_CIRCUIT MARKER BEACON ON | Is electrical power available to the marker beacon circuit: Units bool: settable false |
| CIRCUIT NAVCOM1 ON | trigger_CIRCUIT NAVCOM1 ON | Whether or not power is available to the NAVCOM1 circuit.: Units bool: settable false |
| onChange_CIRCUIT NAVCOM1 ON | trigger_onChange_CIRCUIT NAVCOM1 ON | Whether or not power is available to the NAVCOM1 circuit.: Units bool: settable false |
| onRequest_CIRCUIT NAVCOM1 ON | trigger_onRequest_CIRCUIT NAVCOM1 ON | Whether or not power is available to the NAVCOM1 circuit.: Units bool: settable false |
| CIRCUIT NAVCOM2 ON | trigger_CIRCUIT NAVCOM2 ON | Whether or not power is available to the NAVCOM2 circuit.: Units bool: settable false |
| onChange_CIRCUIT NAVCOM2 ON | trigger_onChange_CIRCUIT NAVCOM2 ON | Whether or not power is available to the NAVCOM2 circuit.: Units bool: settable false |
| onRequest_CIRCUIT NAVCOM2 ON | trigger_onRequest_CIRCUIT NAVCOM2 ON | Whether or not power is available to the NAVCOM2 circuit.: Units bool: settable false |
| CIRCUIT NAVCOM3 ON | trigger_CIRCUIT NAVCOM3 ON | Whether or not power is available to the NAVCOM3 circuit.: Units bool: settable false |
| onChange_CIRCUIT NAVCOM3 ON | trigger_onChange_CIRCUIT NAVCOM3 ON | Whether or not power is available to the NAVCOM3 circuit.: Units bool: settable false |
| onRequest_CIRCUIT NAVCOM3 ON | trigger_onRequest_CIRCUIT NAVCOM3 ON | Whether or not power is available to the NAVCOM3 circuit.: Units bool: settable false |
| CIRCUIT ON | trigger_CIRCUIT ON | This will be true if the given circuit is functioning. Use a circuit index when referencing.: Units bool: settable false |
| onChange_CIRCUIT ON | trigger_onChange_CIRCUIT ON | This will be true if the given circuit is functioning. Use a circuit index when referencing.: Units bool: settable false |
| onRequest_CIRCUIT ON | trigger_onRequest_CIRCUIT ON | This will be true if the given circuit is functioning. Use a circuit index when referencing.: Units bool: settable false |
| CIRCUIT PITOT HEAT ON | trigger_CIRCUIT PITOT HEAT ON | Is electrical power available to the pitot heat circuit: Units bool: settable false |
| onChange_CIRCUIT PITOT HEAT ON | trigger_onChange_CIRCUIT PITOT HEAT ON | Is electrical power available to the pitot heat circuit: Units bool: settable false |
| onRequest_CIRCUIT PITOT HEAT ON | trigger_onRequest_CIRCUIT PITOT HEAT ON | Is electrical power available to the pitot heat circuit: Units bool: settable false |
| CIRCUIT POWER SETTING | trigger_CIRCUIT POWER SETTING | This returns the percentage of use that the circuit is getting. This requires a circuit index when referencing: Units percent: settable false |
| onChange_CIRCUIT POWER SETTING | trigger_onChange_CIRCUIT POWER SETTING | This returns the percentage of use that the circuit is getting. This requires a circuit index when referencing: Units percent: settable false |
| onRequest_CIRCUIT POWER SETTING | trigger_onRequest_CIRCUIT POWER SETTING | This returns the percentage of use that the circuit is getting. This requires a circuit index when referencing: Units percent: settable false |
| CIRCUIT PROP SYNC ON | trigger_CIRCUIT PROP SYNC ON | Is electrical power available to the propeller sync circuit: Units bool: settable false |
| onChange_CIRCUIT PROP SYNC ON | trigger_onChange_CIRCUIT PROP SYNC ON | Is electrical power available to the propeller sync circuit: Units bool: settable false |
| onRequest_CIRCUIT PROP SYNC ON | trigger_onRequest_CIRCUIT PROP SYNC ON | Is electrical power available to the propeller sync circuit: Units bool: settable false |
| CIRCUIT STANDBY VACUUM ON | trigger_CIRCUIT STANDBY VACUUM ON | Is electrical power available to the vacuum circuit: Units bool: settable false |
| onChange_CIRCUIT STANDBY VACUUM ON | trigger_onChange_CIRCUIT STANDBY VACUUM ON | Is electrical power available to the vacuum circuit: Units bool: settable false |
| onRequest_CIRCUIT STANDBY VACUUM ON | trigger_onRequest_CIRCUIT STANDBY VACUUM ON | Is electrical power available to the vacuum circuit: Units bool: settable false |
| CIRCUIT SWITCH ON | trigger_CIRCUIT SWITCH ON | The circuit switch position, true if the switch is ON. Use a circuit index when referencing.: Units bool: settable false |
| onChange_CIRCUIT SWITCH ON | trigger_onChange_CIRCUIT SWITCH ON | The circuit switch position, true if the switch is ON. Use a circuit index when referencing.: Units bool: settable false |
| onRequest_CIRCUIT SWITCH ON | trigger_onRequest_CIRCUIT SWITCH ON | The circuit switch position, true if the switch is ON. Use a circuit index when referencing.: Units bool: settable false |
| COCKPIT CAMERA HEADLOOK | trigger_COCKPIT CAMERA HEADLOOK | This is used to get/set the look state of the cockpit camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 2 (Cockpit).: Units enum: settable true |
| onChange_COCKPIT CAMERA HEADLOOK | trigger_onChange_COCKPIT CAMERA HEADLOOK | This is used to get/set the look state of the cockpit camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 2 (Cockpit).: Units enum: settable true |
| onRequest_COCKPIT CAMERA HEADLOOK | trigger_onRequest_COCKPIT CAMERA HEADLOOK | This is used to get/set the look state of the cockpit camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 2 (Cockpit).: Units enum: settable true |
| COCKPIT CAMERA HEIGHT | trigger_COCKPIT CAMERA HEIGHT | This can be used to get/set the cockpit camera height modifier expressed as a percentage. Default is 50%.: Units percent: settable true |
| onChange_COCKPIT CAMERA HEIGHT | trigger_onChange_COCKPIT CAMERA HEIGHT | This can be used to get/set the cockpit camera height modifier expressed as a percentage. Default is 50%.: Units percent: settable true |
| onRequest_COCKPIT CAMERA HEIGHT | trigger_onRequest_COCKPIT CAMERA HEIGHT | This can be used to get/set the cockpit camera height modifier expressed as a percentage. Default is 50%.: Units percent: settable true |
| COCKPIT CAMERA INSTRUMENT AUTOSELECT | trigger_COCKPIT CAMERA INSTRUMENT AUTOSELECT | This can be used to get or set the autoselect option for the cockpit camera when viewing the instruments (ie: the CAMERA_SUBSTATE is 5). When enabled the camera will move automatically if the player mouse reaches the edge of the screen and there are instrument panels available on that side.: Units bool: settable true |
| onChange_COCKPIT CAMERA INSTRUMENT AUTOSELECT | trigger_onChange_COCKPIT CAMERA INSTRUMENT AUTOSELECT | This can be used to get or set the autoselect option for the cockpit camera when viewing the instruments (ie: the CAMERA_SUBSTATE is 5). When enabled the camera will move automatically if the player mouse reaches the edge of the screen and there are instrument panels available on that side.: Units bool: settable true |
| onRequest_COCKPIT CAMERA INSTRUMENT AUTOSELECT | trigger_onRequest_COCKPIT CAMERA INSTRUMENT AUTOSELECT | This can be used to get or set the autoselect option for the cockpit camera when viewing the instruments (ie: the CAMERA_SUBSTATE is 5). When enabled the camera will move automatically if the player mouse reaches the edge of the screen and there are instrument panels available on that side.: Units bool: settable true |
| COCKPIT CAMERA MOMENTUM | trigger_COCKPIT CAMERA MOMENTUM | Sets/gets the momentum modifier of the cockpit camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| onChange_COCKPIT CAMERA MOMENTUM | trigger_onChange_COCKPIT CAMERA MOMENTUM | Sets/gets the momentum modifier of the cockpit camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| onRequest_COCKPIT CAMERA MOMENTUM | trigger_onRequest_COCKPIT CAMERA MOMENTUM | Sets/gets the momentum modifier of the cockpit camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent: settable true |
| COCKPIT CAMERA SPEED | trigger_COCKPIT CAMERA SPEED | Sets/gets the translation speed modifier of the cockpit camara, as a percentage. Default is 50%.: Units percent: settable true |
| onChange_COCKPIT CAMERA SPEED | trigger_onChange_COCKPIT CAMERA SPEED | Sets/gets the translation speed modifier of the cockpit camara, as a percentage. Default is 50%.: Units percent: settable true |
| onRequest_COCKPIT CAMERA SPEED | trigger_onRequest_COCKPIT CAMERA SPEED | Sets/gets the translation speed modifier of the cockpit camara, as a percentage. Default is 50%.: Units percent: settable true |
| COCKPIT CAMERA UPPER POSITION | trigger_COCKPIT CAMERA UPPER POSITION | Sets/gets the current "upper position" cockpit camera toggle. When 1 (TRUE), the camera is is in the upper position, and when 0 (FALSE) it is in the default position.: Units bool: settable true |
| onChange_COCKPIT CAMERA UPPER POSITION | trigger_onChange_COCKPIT CAMERA UPPER POSITION | Sets/gets the current "upper position" cockpit camera toggle. When 1 (TRUE), the camera is is in the upper position, and when 0 (FALSE) it is in the default position.: Units bool: settable true |
| onRequest_COCKPIT CAMERA UPPER POSITION | trigger_onRequest_COCKPIT CAMERA UPPER POSITION | Sets/gets the current "upper position" cockpit camera toggle. When 1 (TRUE), the camera is is in the upper position, and when 0 (FALSE) it is in the default position.: Units bool: settable true |
| COCKPIT CAMERA ZOOM | trigger_COCKPIT CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the cockpit camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| onChange_COCKPIT CAMERA ZOOM | trigger_onChange_COCKPIT CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the cockpit camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| onRequest_COCKPIT CAMERA ZOOM | trigger_onRequest_COCKPIT CAMERA ZOOM | Sets/gets the zoom/FOV modifier for the cockpit camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent: settable true |
| COCKPIT CAMERA ZOOM SPEED | trigger_COCKPIT CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV cockpit camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| onChange_COCKPIT CAMERA ZOOM SPEED | trigger_onChange_COCKPIT CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV cockpit camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| onRequest_COCKPIT CAMERA ZOOM SPEED | trigger_onRequest_COCKPIT CAMERA ZOOM SPEED | Sets/gets the speed modifier for when the zoom/FOV cockpit camera changes zoom/FOV levels. Default is 50%.: Units percent: settable true |
| COLLECTIVE POSITION | trigger_COLLECTIVE POSITION | The position of the helicopter's collective. 0 is fully up, 100 fully depressed.: Units percent Over 100: settable false |
| onChange_COLLECTIVE POSITION | trigger_onChange_COLLECTIVE POSITION | The position of the helicopter's collective. 0 is fully up, 100 fully depressed.: Units percent Over 100: settable false |
| onRequest_COLLECTIVE POSITION | trigger_onRequest_COLLECTIVE POSITION | The position of the helicopter's collective. 0 is fully up, 100 fully depressed.: Units percent Over 100: settable false |
| COM ACTIVE BEARING:index | trigger_COM ACTIVE BEARING:index | Gives the bearing (in degrees) of the active COM station (airport) or a value less than 0 if the station does not belong to an airport. Index is 1, 2 or 3.: Units degrees: settable false |
| onChange_COM ACTIVE BEARING:index | trigger_onChange_COM ACTIVE BEARING:index | Gives the bearing (in degrees) of the active COM station (airport) or a value less than 0 if the station does not belong to an airport. Index is 1, 2 or 3.: Units degrees: settable false |
| onRequest_COM ACTIVE BEARING:index | trigger_onRequest_COM ACTIVE BEARING:index | Gives the bearing (in degrees) of the active COM station (airport) or a value less than 0 if the station does not belong to an airport. Index is 1, 2 or 3.: Units degrees: settable false |
| COM ACTIVE DISTANCE:index | trigger_COM ACTIVE DISTANCE:index | Gives the distance (in meters) to the active COM station (airport) or a value less than -180° if the station does not belong to an airport. Index is 1, 2 or 3.: Units meters: settable false |
| onChange_COM ACTIVE DISTANCE:index | trigger_onChange_COM ACTIVE DISTANCE:index | Gives the distance (in meters) to the active COM station (airport) or a value less than -180° if the station does not belong to an airport. Index is 1, 2 or 3.: Units meters: settable false |
| onRequest_COM ACTIVE DISTANCE:index | trigger_onRequest_COM ACTIVE DISTANCE:index | Gives the distance (in meters) to the active COM station (airport) or a value less than -180° if the station does not belong to an airport. Index is 1, 2 or 3.: Units meters: settable false |
| COM ACTIVE FREQ IDENT:index | trigger_COM ACTIVE FREQ IDENT:index | The identity of the station that is tuned on the indexed active COM radio. Index is 1, 2, or 3.: Units null: settable false |
| onChange_COM ACTIVE FREQ IDENT:index | trigger_onChange_COM ACTIVE FREQ IDENT:index | The identity of the station that is tuned on the indexed active COM radio. Index is 1, 2, or 3.: Units null: settable false |
| onRequest_COM ACTIVE FREQ IDENT:index | trigger_onRequest_COM ACTIVE FREQ IDENT:index | The identity of the station that is tuned on the indexed active COM radio. Index is 1, 2, or 3.: Units null: settable false |
| COM ACTIVE FREQ TYPE:index | trigger_COM ACTIVE FREQ TYPE:index | The type of COM frequency for the active indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| onChange_COM ACTIVE FREQ TYPE:index | trigger_onChange_COM ACTIVE FREQ TYPE:index | The type of COM frequency for the active indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| onRequest_COM ACTIVE FREQ TYPE:index | trigger_onRequest_COM ACTIVE FREQ TYPE:index | The type of COM frequency for the active indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| COM ACTIVE FREQUENCY:index | trigger_COM ACTIVE FREQUENCY:index | Com frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| onChange_COM ACTIVE FREQUENCY:index | trigger_onChange_COM ACTIVE FREQUENCY:index | Com frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| onRequest_COM ACTIVE FREQUENCY:index | trigger_onRequest_COM ACTIVE FREQUENCY:index | Com frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| COM AVAILABLE:index | trigger_COM AVAILABLE:index | True if COM1, COM2 or COM3 is available (depending on the index, either 1, 2, or 3): Units bool: settable false |
| onChange_COM AVAILABLE:index | trigger_onChange_COM AVAILABLE:index | True if COM1, COM2 or COM3 is available (depending on the index, either 1, 2, or 3): Units bool: settable false |
| onRequest_COM AVAILABLE:index | trigger_onRequest_COM AVAILABLE:index | True if COM1, COM2 or COM3 is available (depending on the index, either 1, 2, or 3): Units bool: settable false |
| COM RECEIVE ALL | trigger_COM RECEIVE ALL | Toggles all COM radios to receive on: Units bool: settable false |
| onChange_COM RECEIVE ALL | trigger_onChange_COM RECEIVE ALL | Toggles all COM radios to receive on: Units bool: settable false |
| onRequest_COM RECEIVE ALL | trigger_onRequest_COM RECEIVE ALL | Toggles all COM radios to receive on: Units bool: settable false |
| COM RECEIVE EX1:index | trigger_COM RECEIVE EX1:index | Whether or not the plane is receiving on the indexed com channel. Index is 1, 2 or 3.: Units bool: settable false |
| onChange_COM RECEIVE EX1:index | trigger_onChange_COM RECEIVE EX1:index | Whether or not the plane is receiving on the indexed com channel. Index is 1, 2 or 3.: Units bool: settable false |
| onRequest_COM RECEIVE EX1:index | trigger_onRequest_COM RECEIVE EX1:index | Whether or not the plane is receiving on the indexed com channel. Index is 1, 2 or 3.: Units bool: settable false |
| COM RECEIVE:index | trigger_COM RECEIVE:index | Whether or not the plane is receiving on the indexed com channel or not (either 1, 2, or 3 for the index).: Units bool: settable false |
| onChange_COM RECEIVE:index | trigger_onChange_COM RECEIVE:index | Whether or not the plane is receiving on the indexed com channel or not (either 1, 2, or 3 for the index).: Units bool: settable false |
| onRequest_COM RECEIVE:index | trigger_onRequest_COM RECEIVE:index | Whether or not the plane is receiving on the indexed com channel or not (either 1, 2, or 3 for the index).: Units bool: settable false |
| COM SPACING MODE:index | trigger_COM SPACING MODE:index | The COM radio frequency step. Index is 1, 2 or 3.: Units enum: settable false |
| onChange_COM SPACING MODE:index | trigger_onChange_COM SPACING MODE:index | The COM radio frequency step. Index is 1, 2 or 3.: Units enum: settable false |
| onRequest_COM SPACING MODE:index | trigger_onRequest_COM SPACING MODE:index | The COM radio frequency step. Index is 1, 2 or 3.: Units enum: settable false |
| COM STANDBY FREQ IDENT:index | trigger_COM STANDBY FREQ IDENT:index | The identity of the station that is tuned on the indexed standby COM radio. Index is 1, 2, or 3.: Units null: settable false |
| onChange_COM STANDBY FREQ IDENT:index | trigger_onChange_COM STANDBY FREQ IDENT:index | The identity of the station that is tuned on the indexed standby COM radio. Index is 1, 2, or 3.: Units null: settable false |
| onRequest_COM STANDBY FREQ IDENT:index | trigger_onRequest_COM STANDBY FREQ IDENT:index | The identity of the station that is tuned on the indexed standby COM radio. Index is 1, 2, or 3.: Units null: settable false |
| COM STANDBY FREQ TYPE:index | trigger_COM STANDBY FREQ TYPE:index | The type of COM frequency for the standby indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| onChange_COM STANDBY FREQ TYPE:index | trigger_onChange_COM STANDBY FREQ TYPE:index | The type of COM frequency for the standby indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| onRequest_COM STANDBY FREQ TYPE:index | trigger_onRequest_COM STANDBY FREQ TYPE:index | The type of COM frequency for the standby indexed COM system. Index is 1, 2, or 3.: Units null: settable false |
| COM STANDBY FREQUENCY:index | trigger_COM STANDBY FREQUENCY:index | Com standby frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| onChange_COM STANDBY FREQUENCY:index | trigger_onChange_COM STANDBY FREQUENCY:index | Com standby frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| onRequest_COM STANDBY FREQUENCY:index | trigger_onRequest_COM STANDBY FREQUENCY:index | Com standby frequency. Index is 1, 2 or 3.: Units Frequency BCD16: settable false |
| COM STATUS:index | trigger_COM STATUS:index | Radio status flag for the indexed com channel. Index is 1, 2 or 3.: Units enum: settable false |
| onChange_COM STATUS:index | trigger_onChange_COM STATUS:index | Radio status flag for the indexed com channel. Index is 1, 2 or 3.: Units enum: settable false |
| onRequest_COM STATUS:index | trigger_onRequest_COM STATUS:index | Radio status flag for the indexed com channel. Index is 1, 2 or 3.: Units enum: settable false |
| COM TEST:index | trigger_COM TEST:index | Enter an index of 1, 2 or 3. Will return TRUE if the COM system is working, FALSE otherwise.: Units bool: settable false |
| onChange_COM TEST:index | trigger_onChange_COM TEST:index | Enter an index of 1, 2 or 3. Will return TRUE if the COM system is working, FALSE otherwise.: Units bool: settable false |
| onRequest_COM TEST:index | trigger_onRequest_COM TEST:index | Enter an index of 1, 2 or 3. Will return TRUE if the COM system is working, FALSE otherwise.: Units bool: settable false |
| COM TRANSMIT:index | trigger_COM TRANSMIT:index | Audio panel com transmit state. Index of 1, 2 or 3.: Units bool: settable false |
| onChange_COM TRANSMIT:index | trigger_onChange_COM TRANSMIT:index | Audio panel com transmit state. Index of 1, 2 or 3.: Units bool: settable false |
| onRequest_COM TRANSMIT:index | trigger_onRequest_COM TRANSMIT:index | Audio panel com transmit state. Index of 1, 2 or 3.: Units bool: settable false |
| COM VOLUME | trigger_COM VOLUME | The volume of the COM Radio.: Units percent: settable false |
| onChange_COM VOLUME | trigger_onChange_COM VOLUME | The volume of the COM Radio.: Units percent: settable false |
| onRequest_COM VOLUME | trigger_onRequest_COM VOLUME | The volume of the COM Radio.: Units percent: settable false |
| COM1 STORED FREQUENCY | trigger_COM1 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onChange_COM1 STORED FREQUENCY | trigger_onChange_COM1 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onRequest_COM1 STORED FREQUENCY | trigger_onRequest_COM1 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| COM2 STORED FREQUENCY | trigger_COM2 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onChange_COM2 STORED FREQUENCY | trigger_onChange_COM2 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onRequest_COM2 STORED FREQUENCY | trigger_onRequest_COM2 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| COM3 STORED FREQUENCY | trigger_COM3 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onChange_COM3 STORED FREQUENCY | trigger_onChange_COM3 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| onRequest_COM3 STORED FREQUENCY | trigger_onRequest_COM3 STORED FREQUENCY | The stored COM 1/2/3 frequency value.: Units Frequency BCD16: settable false |
| CONTACT POINT COMPRESSION:index | trigger_CONTACT POINT COMPRESSION:index | The percentage value representing the amount the contact point is compressed.: Units percent: settable false |
| onChange_CONTACT POINT COMPRESSION:index | trigger_onChange_CONTACT POINT COMPRESSION:index | The percentage value representing the amount the contact point is compressed.: Units percent: settable false |
| onRequest_CONTACT POINT COMPRESSION:index | trigger_onRequest_CONTACT POINT COMPRESSION:index | The percentage value representing the amount the contact point is compressed.: Units percent: settable false |
| CONTACT POINT IS ON GROUND:index | trigger_CONTACT POINT IS ON GROUND:index | Returns true if the indexed contact point is on the ground, or will return false otherwise.: Units bool: settable false |
| onChange_CONTACT POINT IS ON GROUND:index | trigger_onChange_CONTACT POINT IS ON GROUND:index | Returns true if the indexed contact point is on the ground, or will return false otherwise.: Units bool: settable false |
| onRequest_CONTACT POINT IS ON GROUND:index | trigger_onRequest_CONTACT POINT IS ON GROUND:index | Returns true if the indexed contact point is on the ground, or will return false otherwise.: Units bool: settable false |
| CONTACT POINT IS SKIDDING:index | trigger_CONTACT POINT IS SKIDDING:index | Returns true if the indexed contact point is skidding, or will return false otherwise.: Units bool: settable false |
| onChange_CONTACT POINT IS SKIDDING:index | trigger_onChange_CONTACT POINT IS SKIDDING:index | Returns true if the indexed contact point is skidding, or will return false otherwise.: Units bool: settable false |
| onRequest_CONTACT POINT IS SKIDDING:index | trigger_onRequest_CONTACT POINT IS SKIDDING:index | Returns true if the indexed contact point is skidding, or will return false otherwise.: Units bool: settable false |
| CONTACT POINT POSITION:index | trigger_CONTACT POINT POSITION:index | The currently extended position of the (retractable) contact point, expressed as a percentage.: Units position: settable false |
| onChange_CONTACT POINT POSITION:index | trigger_onChange_CONTACT POINT POSITION:index | The currently extended position of the (retractable) contact point, expressed as a percentage.: Units position: settable false |
| onRequest_CONTACT POINT POSITION:index | trigger_onRequest_CONTACT POINT POSITION:index | The currently extended position of the (retractable) contact point, expressed as a percentage.: Units position: settable false |
| CONTACT POINT SKIDDING FACTOR:index | trigger_CONTACT POINT SKIDDING FACTOR:index | The skidding factor associated with the indexed contact point, from 0 to 1.: Units percent Over 100: settable false |
| onChange_CONTACT POINT SKIDDING FACTOR:index | trigger_onChange_CONTACT POINT SKIDDING FACTOR:index | The skidding factor associated with the indexed contact point, from 0 to 1.: Units percent Over 100: settable false |
| onRequest_CONTACT POINT SKIDDING FACTOR:index | trigger_onRequest_CONTACT POINT SKIDDING FACTOR:index | The skidding factor associated with the indexed contact point, from 0 to 1.: Units percent Over 100: settable false |
| CONTACT POINT WATER DEPTH:index | trigger_CONTACT POINT WATER DEPTH:index | This returns the depth of the water for the indexed contact point.: Units feet: settable false |
| onChange_CONTACT POINT WATER DEPTH:index | trigger_onChange_CONTACT POINT WATER DEPTH:index | This returns the depth of the water for the indexed contact point.: Units feet: settable false |
| onRequest_CONTACT POINT WATER DEPTH:index | trigger_onRequest_CONTACT POINT WATER DEPTH:index | This returns the depth of the water for the indexed contact point.: Units feet: settable false |
| CONTRAILS CONDITIONS MET | trigger_CONTRAILS CONDITIONS MET | True if the aircraft has met the conditions required to spawn the contrail VFX: Units bool: settable false |
| onChange_CONTRAILS CONDITIONS MET | trigger_onChange_CONTRAILS CONDITIONS MET | True if the aircraft has met the conditions required to spawn the contrail VFX: Units bool: settable false |
| onRequest_CONTRAILS CONDITIONS MET | trigger_onRequest_CONTRAILS CONDITIONS MET | True if the aircraft has met the conditions required to spawn the contrail VFX: Units bool: settable false |
| COPILOT TRANSMITTER TYPE | trigger_COPILOT TRANSMITTER TYPE | On which channel the copilot is transmitting.: Units enum: settable false |
| onChange_COPILOT TRANSMITTER TYPE | trigger_onChange_COPILOT TRANSMITTER TYPE | On which channel the copilot is transmitting.: Units enum: settable false |
| onRequest_COPILOT TRANSMITTER TYPE | trigger_onRequest_COPILOT TRANSMITTER TYPE | On which channel the copilot is transmitting.: Units enum: settable false |
| COPILOT TRANSMITTING | trigger_COPILOT TRANSMITTING | Whether or not the copilot is transmitting: Units bool: settable false |
| onChange_COPILOT TRANSMITTING | trigger_onChange_COPILOT TRANSMITTING | Whether or not the copilot is transmitting: Units bool: settable false |
| onRequest_COPILOT TRANSMITTING | trigger_onRequest_COPILOT TRANSMITTING | Whether or not the copilot is transmitting: Units bool: settable false |
| CRASH FLAG | trigger_CRASH FLAG | Flag value that indicates the cause of a crash.: Units enum: settable false |
| onChange_CRASH FLAG | trigger_onChange_CRASH FLAG | Flag value that indicates the cause of a crash.: Units enum: settable false |
| onRequest_CRASH FLAG | trigger_onRequest_CRASH FLAG | Flag value that indicates the cause of a crash.: Units enum: settable false |
| CRASH SEQUENCE | trigger_CRASH SEQUENCE | The state of the crash event sequence.: Units enum: settable false |
| onChange_CRASH SEQUENCE | trigger_onChange_CRASH SEQUENCE | The state of the crash event sequence.: Units enum: settable false |
| onRequest_CRASH SEQUENCE | trigger_onRequest_CRASH SEQUENCE | The state of the crash event sequence.: Units enum: settable false |
| DECISION ALTITUDE MSL | trigger_DECISION ALTITUDE MSL | Design decision altitude above mean sea level: Units feet: settable false |
| onChange_DECISION ALTITUDE MSL | trigger_onChange_DECISION ALTITUDE MSL | Design decision altitude above mean sea level: Units feet: settable false |
| onRequest_DECISION ALTITUDE MSL | trigger_onRequest_DECISION ALTITUDE MSL | Design decision altitude above mean sea level: Units feet: settable false |
| DECISION HEIGHT | trigger_DECISION HEIGHT | Design decision height: Units feet: settable false |
| onChange_DECISION HEIGHT | trigger_onChange_DECISION HEIGHT | Design decision height: Units feet: settable false |
| onRequest_DECISION HEIGHT | trigger_onRequest_DECISION HEIGHT | Design decision height: Units feet: settable false |
| DELEGATE CONTROLS TO AI | trigger_DELEGATE CONTROLS TO AI | Returns whether the AI control system is active or not: Units bool: settable true |
| onChange_DELEGATE CONTROLS TO AI | trigger_onChange_DELEGATE CONTROLS TO AI | Returns whether the AI control system is active or not: Units bool: settable true |
| onRequest_DELEGATE CONTROLS TO AI | trigger_onRequest_DELEGATE CONTROLS TO AI | Returns whether the AI control system is active or not: Units bool: settable true |
| DELTA HEADING RATE | trigger_DELTA HEADING RATE | Rate of turn of heading indicator.: Units radians per second: settable true |
| onChange_DELTA HEADING RATE | trigger_onChange_DELTA HEADING RATE | Rate of turn of heading indicator.: Units radians per second: settable true |
| onRequest_DELTA HEADING RATE | trigger_onRequest_DELTA HEADING RATE | Rate of turn of heading indicator.: Units radians per second: settable true |
| DESIGN CRUISE ALT | trigger_DESIGN CRUISE ALT | This design constant represents the optimal altitude the aircraft should maintain when in cruise. It is derived from the cruise_alt setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| onChange_DESIGN CRUISE ALT | trigger_onChange_DESIGN CRUISE ALT | This design constant represents the optimal altitude the aircraft should maintain when in cruise. It is derived from the cruise_alt setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| onRequest_DESIGN CRUISE ALT | trigger_onRequest_DESIGN CRUISE ALT | This design constant represents the optimal altitude the aircraft should maintain when in cruise. It is derived from the cruise_alt setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| DESIGN SPAWN ALTITUDE CRUISE | trigger_DESIGN SPAWN ALTITUDE CRUISE | This design constant represents the spawn altitude for the aircraft when spawning in cruise. It is derived from the spawn_cruise_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| onChange_DESIGN SPAWN ALTITUDE CRUISE | trigger_onChange_DESIGN SPAWN ALTITUDE CRUISE | This design constant represents the spawn altitude for the aircraft when spawning in cruise. It is derived from the spawn_cruise_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| onRequest_DESIGN SPAWN ALTITUDE CRUISE | trigger_onRequest_DESIGN SPAWN ALTITUDE CRUISE | This design constant represents the spawn altitude for the aircraft when spawning in cruise. It is derived from the spawn_cruise_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet: settable false |
| DESIGN SPAWN ALTITUDE DESCENT | trigger_DESIGN SPAWN ALTITUDE DESCENT | This design constant represents the spawn altitude for the aircraft when spawning in descent. It is derived from the spawn_descent_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 500ft.: Units feet: settable false |
| onChange_DESIGN SPAWN ALTITUDE DESCENT | trigger_onChange_DESIGN SPAWN ALTITUDE DESCENT | This design constant represents the spawn altitude for the aircraft when spawning in descent. It is derived from the spawn_descent_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 500ft.: Units feet: settable false |
| onRequest_DESIGN SPAWN ALTITUDE DESCENT | trigger_onRequest_DESIGN SPAWN ALTITUDE DESCENT | This design constant represents the spawn altitude for the aircraft when spawning in descent. It is derived from the spawn_descent_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 500ft.: Units feet: settable false |
| DESIGN SPEED CLIMB | trigger_DESIGN SPEED CLIMB | This design constant represents the optimal climb speed for the aircraft. It is derived from the climb_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| onChange_DESIGN SPEED CLIMB | trigger_onChange_DESIGN SPEED CLIMB | This design constant represents the optimal climb speed for the aircraft. It is derived from the climb_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| onRequest_DESIGN SPEED CLIMB | trigger_onRequest_DESIGN SPEED CLIMB | This design constant represents the optimal climb speed for the aircraft. It is derived from the climb_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| DESIGN SPEED MIN ROTATION | trigger_DESIGN SPEED MIN ROTATION | This design constant represents the minimum speed required for aircraft rotation. It is derived from the rotation_speed_min setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| onChange_DESIGN SPEED MIN ROTATION | trigger_onChange_DESIGN SPEED MIN ROTATION | This design constant represents the minimum speed required for aircraft rotation. It is derived from the rotation_speed_min setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| onRequest_DESIGN SPEED MIN ROTATION | trigger_onRequest_DESIGN SPEED MIN ROTATION | This design constant represents the minimum speed required for aircraft rotation. It is derived from the rotation_speed_min setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet: settable false |
| DESIGN SPEED VC | trigger_DESIGN SPEED VC | This design constant represents the aircraft ideal cruising speed. It is derived from the cruise_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. The default value is computed an internal function that uses the estimated cruise altitude and estimated cruise percent power, according of the engine type, the number of engines, the density, the wing area and some drag parameters. Normally this value is set in the CFG file and the default value is never used.: Units feet: settable false |
| onChange_DESIGN SPEED VC | trigger_onChange_DESIGN SPEED VC | This design constant represents the aircraft ideal cruising speed. It is derived from the cruise_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. The default value is computed an internal function that uses the estimated cruise altitude and estimated cruise percent power, according of the engine type, the number of engines, the density, the wing area and some drag parameters. Normally this value is set in the CFG file and the default value is never used.: Units feet: settable false |
| onRequest_DESIGN SPEED VC | trigger_onRequest_DESIGN SPEED VC | This design constant represents the aircraft ideal cruising speed. It is derived from the cruise_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. The default value is computed an internal function that uses the estimated cruise altitude and estimated cruise percent power, according of the engine type, the number of engines, the density, the wing area and some drag parameters. Normally this value is set in the CFG file and the default value is never used.: Units feet: settable false |
| DESIGN SPEED VS0 | trigger_DESIGN SPEED VS0 | This design constant represents the the stall speed when flaps are fully extended. It is derived from the full_flaps_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.8 x VS.: Units knots: settable false |
| onChange_DESIGN SPEED VS0 | trigger_onChange_DESIGN SPEED VS0 | This design constant represents the the stall speed when flaps are fully extended. It is derived from the full_flaps_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.8 x VS.: Units knots: settable false |
| onRequest_DESIGN SPEED VS0 | trigger_onRequest_DESIGN SPEED VS0 | This design constant represents the the stall speed when flaps are fully extended. It is derived from the full_flaps_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.8 x VS.: Units knots: settable false |
| DESIGN SPEED VS1 | trigger_DESIGN SPEED VS1 | This design constant represents the stall speed when flaps are fully retracted. It is derived from the flaps_up_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.: Units knots: settable false |
| onChange_DESIGN SPEED VS1 | trigger_onChange_DESIGN SPEED VS1 | This design constant represents the stall speed when flaps are fully retracted. It is derived from the flaps_up_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.: Units knots: settable false |
| onRequest_DESIGN SPEED VS1 | trigger_onRequest_DESIGN SPEED VS1 | This design constant represents the stall speed when flaps are fully retracted. It is derived from the flaps_up_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.: Units knots: settable false |
| DESIGN TAKEOFF SPEED | trigger_DESIGN TAKEOFF SPEED | This design constant represents the aircraft ideal takoff speed. It is derived from the takeoff_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg.: Units knots: settable false |
| onChange_DESIGN TAKEOFF SPEED | trigger_onChange_DESIGN TAKEOFF SPEED | This design constant represents the aircraft ideal takoff speed. It is derived from the takeoff_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg.: Units knots: settable false |
| onRequest_DESIGN TAKEOFF SPEED | trigger_onRequest_DESIGN TAKEOFF SPEED | This design constant represents the aircraft ideal takoff speed. It is derived from the takeoff_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg.: Units knots: settable false |
| DISK BANK ANGLE:index | trigger_DISK BANK ANGLE:index | Rotor bank angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onChange_DISK BANK ANGLE:index | trigger_onChange_DISK BANK ANGLE:index | Rotor bank angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onRequest_DISK BANK ANGLE:index | trigger_onRequest_DISK BANK ANGLE:index | Rotor bank angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| DISK BANK PCT:index | trigger_DISK BANK PCT:index | Rotor bank percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onChange_DISK BANK PCT:index | trigger_onChange_DISK BANK PCT:index | Rotor bank percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onRequest_DISK BANK PCT:index | trigger_onRequest_DISK BANK PCT:index | Rotor bank percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| DISK CONING PCT:index | trigger_DISK CONING PCT:index | Rotor coning percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onChange_DISK CONING PCT:index | trigger_onChange_DISK CONING PCT:index | Rotor coning percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onRequest_DISK CONING PCT:index | trigger_onRequest_DISK CONING PCT:index | Rotor coning percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| DISK PITCH ANGLE:index | trigger_DISK PITCH ANGLE:index | Rotor pitch angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onChange_DISK PITCH ANGLE:index | trigger_onChange_DISK PITCH ANGLE:index | Rotor pitch angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onRequest_DISK PITCH ANGLE:index | trigger_onRequest_DISK PITCH ANGLE:index | Rotor pitch angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| DISK PITCH PCT:index | trigger_DISK PITCH PCT:index | Rotor pitch percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onChange_DISK PITCH PCT:index | trigger_onChange_DISK PITCH PCT:index | Rotor pitch percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onRequest_DISK PITCH PCT:index | trigger_onRequest_DISK PITCH PCT:index | Rotor pitch percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| DME SOUND | trigger_DME SOUND | DME audio flag.: Units bool: settable false |
| onChange_DME SOUND | trigger_onChange_DME SOUND | DME audio flag.: Units bool: settable false |
| onRequest_DME SOUND | trigger_onRequest_DME SOUND | DME audio flag.: Units bool: settable false |
| DRONE CAMERA FOCUS | trigger_DRONE CAMERA FOCUS | Sets/gets the focus modifier for the drone camera. Default is 50%, and a lower value will set the drone focus to things in the foreground and a higher level will set the drone focus to things in the background. Note that this is only taken into account when the DRONE_CAMERA_FOCUS_MODE is set to 3 (manual).: Units percent: settable true |
| onChange_DRONE CAMERA FOCUS | trigger_onChange_DRONE CAMERA FOCUS | Sets/gets the focus modifier for the drone camera. Default is 50%, and a lower value will set the drone focus to things in the foreground and a higher level will set the drone focus to things in the background. Note that this is only taken into account when the DRONE_CAMERA_FOCUS_MODE is set to 3 (manual).: Units percent: settable true |
| onRequest_DRONE CAMERA FOCUS | trigger_onRequest_DRONE CAMERA FOCUS | Sets/gets the focus modifier for the drone camera. Default is 50%, and a lower value will set the drone focus to things in the foreground and a higher level will set the drone focus to things in the background. Note that this is only taken into account when the DRONE_CAMERA_FOCUS_MODE is set to 3 (manual).: Units percent: settable true |
| DRONE CAMERA FOCUS MODE | trigger_DRONE CAMERA FOCUS MODE | Sets/gets the current drone focus mode. When set to 3 (manual), the focus position will be based on the DRONE_CAMERA_FOCUS value.: Units enum: settable true |
| onChange_DRONE CAMERA FOCUS MODE | trigger_onChange_DRONE CAMERA FOCUS MODE | Sets/gets the current drone focus mode. When set to 3 (manual), the focus position will be based on the DRONE_CAMERA_FOCUS value.: Units enum: settable true |
| onRequest_DRONE CAMERA FOCUS MODE | trigger_onRequest_DRONE CAMERA FOCUS MODE | Sets/gets the current drone focus mode. When set to 3 (manual), the focus position will be based on the DRONE_CAMERA_FOCUS value.: Units enum: settable true |
| DRONE CAMERA FOLLOW | trigger_DRONE CAMERA FOLLOW | Sets/gets the whether the drone camera is in follow mode or not.: Units bool: settable true |
| onChange_DRONE CAMERA FOLLOW | trigger_onChange_DRONE CAMERA FOLLOW | Sets/gets the whether the drone camera is in follow mode or not.: Units bool: settable true |
| onRequest_DRONE CAMERA FOLLOW | trigger_onRequest_DRONE CAMERA FOLLOW | Sets/gets the whether the drone camera is in follow mode or not.: Units bool: settable true |
| DRONE CAMERA FOV | trigger_DRONE CAMERA FOV | Sets/gets the zoom/FOV modifier for the drone camera. Default is 50%.: Units percent: settable true |
| onChange_DRONE CAMERA FOV | trigger_onChange_DRONE CAMERA FOV | Sets/gets the zoom/FOV modifier for the drone camera. Default is 50%.: Units percent: settable true |
| onRequest_DRONE CAMERA FOV | trigger_onRequest_DRONE CAMERA FOV | Sets/gets the zoom/FOV modifier for the drone camera. Default is 50%.: Units percent: settable true |
| DRONE CAMERA LOCKED | trigger_DRONE CAMERA LOCKED | Sets/gets the whether the drone camera is locked or not.: Units bool: settable true |
| onChange_DRONE CAMERA LOCKED | trigger_onChange_DRONE CAMERA LOCKED | Sets/gets the whether the drone camera is locked or not.: Units bool: settable true |
| onRequest_DRONE CAMERA LOCKED | trigger_onRequest_DRONE CAMERA LOCKED | Sets/gets the whether the drone camera is locked or not.: Units bool: settable true |
| DRONE CAMERA SPEED ROTATION | trigger_DRONE CAMERA SPEED ROTATION | Sets/gets the rotation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| onChange_DRONE CAMERA SPEED ROTATION | trigger_onChange_DRONE CAMERA SPEED ROTATION | Sets/gets the rotation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| onRequest_DRONE CAMERA SPEED ROTATION | trigger_onRequest_DRONE CAMERA SPEED ROTATION | Sets/gets the rotation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| DRONE CAMERA SPEED TRAVELLING | trigger_DRONE CAMERA SPEED TRAVELLING | Sets/gets the translation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| onChange_DRONE CAMERA SPEED TRAVELLING | trigger_onChange_DRONE CAMERA SPEED TRAVELLING | Sets/gets the translation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| onRequest_DRONE CAMERA SPEED TRAVELLING | trigger_onRequest_DRONE CAMERA SPEED TRAVELLING | Sets/gets the translation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent: settable true |
| DROPPABLE OBJECTS COUNT:index | trigger_DROPPABLE OBJECTS COUNT:index | The number of droppable objects at the station number identified by the index.: Units number: settable false |
| onChange_DROPPABLE OBJECTS COUNT:index | trigger_onChange_DROPPABLE OBJECTS COUNT:index | The number of droppable objects at the station number identified by the index.: Units number: settable false |
| onRequest_DROPPABLE OBJECTS COUNT:index | trigger_onRequest_DROPPABLE OBJECTS COUNT:index | The number of droppable objects at the station number identified by the index.: Units number: settable false |
| DROPPABLE OBJECTS TYPE:index | trigger_DROPPABLE OBJECTS TYPE:index | The type of droppable object at the station number identified by the index.: Units null: settable true |
| onChange_DROPPABLE OBJECTS TYPE:index | trigger_onChange_DROPPABLE OBJECTS TYPE:index | The type of droppable object at the station number identified by the index.: Units null: settable true |
| onRequest_DROPPABLE OBJECTS TYPE:index | trigger_onRequest_DROPPABLE OBJECTS TYPE:index | The type of droppable object at the station number identified by the index.: Units null: settable true |
| DROPPABLE OBJECTS UI NAME:index | trigger_DROPPABLE OBJECTS UI NAME:index | Descriptive name, used in User Interface dialogs, of a droppable object, identified by index.: Units null: settable false |
| onChange_DROPPABLE OBJECTS UI NAME:index | trigger_onChange_DROPPABLE OBJECTS UI NAME:index | Descriptive name, used in User Interface dialogs, of a droppable object, identified by index.: Units null: settable false |
| onRequest_DROPPABLE OBJECTS UI NAME:index | trigger_onRequest_DROPPABLE OBJECTS UI NAME:index | Descriptive name, used in User Interface dialogs, of a droppable object, identified by index.: Units null: settable false |
| DYNAMIC PRESSURE | trigger_DYNAMIC PRESSURE | Dynamic pressure: Units pounds: settable false |
| onChange_DYNAMIC PRESSURE | trigger_onChange_DYNAMIC PRESSURE | Dynamic pressure: Units pounds: settable false |
| onRequest_DYNAMIC PRESSURE | trigger_onRequest_DYNAMIC PRESSURE | Dynamic pressure: Units pounds: settable false |
| ELECTRICAL AVIONICS BUS AMPS | trigger_ELECTRICAL AVIONICS BUS AMPS | Avionics bus current: Units amperes: settable true |
| onChange_ELECTRICAL AVIONICS BUS AMPS | trigger_onChange_ELECTRICAL AVIONICS BUS AMPS | Avionics bus current: Units amperes: settable true |
| onRequest_ELECTRICAL AVIONICS BUS AMPS | trigger_onRequest_ELECTRICAL AVIONICS BUS AMPS | Avionics bus current: Units amperes: settable true |
| ELECTRICAL AVIONICS BUS VOLTAGE | trigger_ELECTRICAL AVIONICS BUS VOLTAGE | Avionics bus voltage: Units volts: settable true |
| onChange_ELECTRICAL AVIONICS BUS VOLTAGE | trigger_onChange_ELECTRICAL AVIONICS BUS VOLTAGE | Avionics bus voltage: Units volts: settable true |
| onRequest_ELECTRICAL AVIONICS BUS VOLTAGE | trigger_onRequest_ELECTRICAL AVIONICS BUS VOLTAGE | Avionics bus voltage: Units volts: settable true |
| ELECTRICAL BATTERY BUS AMPS | trigger_ELECTRICAL BATTERY BUS AMPS | Battery bus current: Units amperes: settable true |
| onChange_ELECTRICAL BATTERY BUS AMPS | trigger_onChange_ELECTRICAL BATTERY BUS AMPS | Battery bus current: Units amperes: settable true |
| onRequest_ELECTRICAL BATTERY BUS AMPS | trigger_onRequest_ELECTRICAL BATTERY BUS AMPS | Battery bus current: Units amperes: settable true |
| ELECTRICAL BATTERY BUS VOLTAGE | trigger_ELECTRICAL BATTERY BUS VOLTAGE | Battery bus voltage: Units volts: settable true |
| onChange_ELECTRICAL BATTERY BUS VOLTAGE | trigger_onChange_ELECTRICAL BATTERY BUS VOLTAGE | Battery bus voltage: Units volts: settable true |
| onRequest_ELECTRICAL BATTERY BUS VOLTAGE | trigger_onRequest_ELECTRICAL BATTERY BUS VOLTAGE | Battery bus voltage: Units volts: settable true |
| ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | trigger_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | Battery capacity over max capacity, 100 is full: Units percent: settable false |
| onChange_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | trigger_onChange_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | Battery capacity over max capacity, 100 is full: Units percent: settable false |
| onRequest_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | trigger_onRequest_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT | Battery capacity over max capacity, 100 is full: Units percent: settable false |
| ELECTRICAL BATTERY LOAD | trigger_ELECTRICAL BATTERY LOAD | The load handled by the battery (negative values mean the battery is receiving current). Use a battery index when referencing: Units amperes: settable true |
| onChange_ELECTRICAL BATTERY LOAD | trigger_onChange_ELECTRICAL BATTERY LOAD | The load handled by the battery (negative values mean the battery is receiving current). Use a battery index when referencing: Units amperes: settable true |
| onRequest_ELECTRICAL BATTERY LOAD | trigger_onRequest_ELECTRICAL BATTERY LOAD | The load handled by the battery (negative values mean the battery is receiving current). Use a battery index when referencing: Units amperes: settable true |
| ELECTRICAL BATTERY VOLTAGE | trigger_ELECTRICAL BATTERY VOLTAGE | The battery voltage. Use a battery index when referencing: Units volts: settable true |
| onChange_ELECTRICAL BATTERY VOLTAGE | trigger_onChange_ELECTRICAL BATTERY VOLTAGE | The battery voltage. Use a battery index when referencing: Units volts: settable true |
| onRequest_ELECTRICAL BATTERY VOLTAGE | trigger_onRequest_ELECTRICAL BATTERY VOLTAGE | The battery voltage. Use a battery index when referencing: Units volts: settable true |
| ELECTRICAL GENALT BUS AMPS | trigger_ELECTRICAL GENALT BUS AMPS | The load handled by the alternator. This requires an alternator index when referencing: Units amperes: settable true |
| onChange_ELECTRICAL GENALT BUS AMPS | trigger_onChange_ELECTRICAL GENALT BUS AMPS | The load handled by the alternator. This requires an alternator index when referencing: Units amperes: settable true |
| onRequest_ELECTRICAL GENALT BUS AMPS | trigger_onRequest_ELECTRICAL GENALT BUS AMPS | The load handled by the alternator. This requires an alternator index when referencing: Units amperes: settable true |
| ELECTRICAL GENALT BUS VOLTAGE | trigger_ELECTRICAL GENALT BUS VOLTAGE | General alternator voltage. This requires an alternator index when referencing: Units volts: settable true |
| onChange_ELECTRICAL GENALT BUS VOLTAGE | trigger_onChange_ELECTRICAL GENALT BUS VOLTAGE | General alternator voltage. This requires an alternator index when referencing: Units volts: settable true |
| onRequest_ELECTRICAL GENALT BUS VOLTAGE | trigger_onRequest_ELECTRICAL GENALT BUS VOLTAGE | General alternator voltage. This requires an alternator index when referencing: Units volts: settable true |
| ELECTRICAL GENALT LOAD | trigger_ELECTRICAL GENALT LOAD | This returns the percentage of the load output that is being consumed. This requires an alternator index when referencing: Units percent: settable false |
| onChange_ELECTRICAL GENALT LOAD | trigger_onChange_ELECTRICAL GENALT LOAD | This returns the percentage of the load output that is being consumed. This requires an alternator index when referencing: Units percent: settable false |
| onRequest_ELECTRICAL GENALT LOAD | trigger_onRequest_ELECTRICAL GENALT LOAD | This returns the percentage of the load output that is being consumed. This requires an alternator index when referencing: Units percent: settable false |
| ELECTRICAL HOT BATTERY BUS AMPS | trigger_ELECTRICAL HOT BATTERY BUS AMPS | Current available when battery switch is turned off: Units amperes: settable true |
| onChange_ELECTRICAL HOT BATTERY BUS AMPS | trigger_onChange_ELECTRICAL HOT BATTERY BUS AMPS | Current available when battery switch is turned off: Units amperes: settable true |
| onRequest_ELECTRICAL HOT BATTERY BUS AMPS | trigger_onRequest_ELECTRICAL HOT BATTERY BUS AMPS | Current available when battery switch is turned off: Units amperes: settable true |
| ELECTRICAL HOT BATTERY BUS VOLTAGE | trigger_ELECTRICAL HOT BATTERY BUS VOLTAGE | Voltage available when battery switch is turned off: Units volts: settable true |
| onChange_ELECTRICAL HOT BATTERY BUS VOLTAGE | trigger_onChange_ELECTRICAL HOT BATTERY BUS VOLTAGE | Voltage available when battery switch is turned off: Units volts: settable true |
| onRequest_ELECTRICAL HOT BATTERY BUS VOLTAGE | trigger_onRequest_ELECTRICAL HOT BATTERY BUS VOLTAGE | Voltage available when battery switch is turned off: Units volts: settable true |
| ELECTRICAL MAIN BUS AMPS | trigger_ELECTRICAL MAIN BUS AMPS | Main bus current: Units amperes: settable true |
| onChange_ELECTRICAL MAIN BUS AMPS | trigger_onChange_ELECTRICAL MAIN BUS AMPS | Main bus current: Units amperes: settable true |
| onRequest_ELECTRICAL MAIN BUS AMPS | trigger_onRequest_ELECTRICAL MAIN BUS AMPS | Main bus current: Units amperes: settable true |
| ELECTRICAL MAIN BUS VOLTAGE | trigger_ELECTRICAL MAIN BUS VOLTAGE | The main bus voltage. Use a bus index when referencing: Units volts: settable true |
| onChange_ELECTRICAL MAIN BUS VOLTAGE | trigger_onChange_ELECTRICAL MAIN BUS VOLTAGE | The main bus voltage. Use a bus index when referencing: Units volts: settable true |
| onRequest_ELECTRICAL MAIN BUS VOLTAGE | trigger_onRequest_ELECTRICAL MAIN BUS VOLTAGE | The main bus voltage. Use a bus index when referencing: Units volts: settable true |
| ELECTRICAL MASTER BATTERY | trigger_ELECTRICAL MASTER BATTERY | The battery switch position, true if the switch is ON. Use a battery index when referencing: Units bool: settable true |
| onChange_ELECTRICAL MASTER BATTERY | trigger_onChange_ELECTRICAL MASTER BATTERY | The battery switch position, true if the switch is ON. Use a battery index when referencing: Units bool: settable true |
| onRequest_ELECTRICAL MASTER BATTERY | trigger_onRequest_ELECTRICAL MASTER BATTERY | The battery switch position, true if the switch is ON. Use a battery index when referencing: Units bool: settable true |
| ELECTRICAL TOTAL LOAD AMPS | trigger_ELECTRICAL TOTAL LOAD AMPS | Total load amps: Units amperes: settable true |
| onChange_ELECTRICAL TOTAL LOAD AMPS | trigger_onChange_ELECTRICAL TOTAL LOAD AMPS | Total load amps: Units amperes: settable true |
| onRequest_ELECTRICAL TOTAL LOAD AMPS | trigger_onRequest_ELECTRICAL TOTAL LOAD AMPS | Total load amps: Units amperes: settable true |
| ELEVATOR DEFLECTION | trigger_ELEVATOR DEFLECTION | Angle deflection: Units radians: settable false |
| onChange_ELEVATOR DEFLECTION | trigger_onChange_ELEVATOR DEFLECTION | Angle deflection: Units radians: settable false |
| onRequest_ELEVATOR DEFLECTION | trigger_onRequest_ELEVATOR DEFLECTION | Angle deflection: Units radians: settable false |
| ELEVATOR DEFLECTION PCT | trigger_ELEVATOR DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onChange_ELEVATOR DEFLECTION PCT | trigger_onChange_ELEVATOR DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onRequest_ELEVATOR DEFLECTION PCT | trigger_onRequest_ELEVATOR DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| ELEVATOR POSITION | trigger_ELEVATOR POSITION | Percent elevator input deflection: Units position: settable true |
| onChange_ELEVATOR POSITION | trigger_onChange_ELEVATOR POSITION | Percent elevator input deflection: Units position: settable true |
| onRequest_ELEVATOR POSITION | trigger_onRequest_ELEVATOR POSITION | Percent elevator input deflection: Units position: settable true |
| ELEVATOR TRIM DISABLED | trigger_ELEVATOR TRIM DISABLED | Whether or not the Elevator Trim has been disabled: Units bool: settable false |
| onChange_ELEVATOR TRIM DISABLED | trigger_onChange_ELEVATOR TRIM DISABLED | Whether or not the Elevator Trim has been disabled: Units bool: settable false |
| onRequest_ELEVATOR TRIM DISABLED | trigger_onRequest_ELEVATOR TRIM DISABLED | Whether or not the Elevator Trim has been disabled: Units bool: settable false |
| ELEVATOR TRIM DOWN LIMIT | trigger_ELEVATOR TRIM DOWN LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_down_limit in the Flight Model Config file: Units degrees: settable false |
| onChange_ELEVATOR TRIM DOWN LIMIT | trigger_onChange_ELEVATOR TRIM DOWN LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_down_limit in the Flight Model Config file: Units degrees: settable false |
| onRequest_ELEVATOR TRIM DOWN LIMIT | trigger_onRequest_ELEVATOR TRIM DOWN LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_down_limit in the Flight Model Config file: Units degrees: settable false |
| ELEVATOR TRIM INDICATOR | trigger_ELEVATOR TRIM INDICATOR | Percent elevator trim (for indication): Units position: settable false |
| onChange_ELEVATOR TRIM INDICATOR | trigger_onChange_ELEVATOR TRIM INDICATOR | Percent elevator trim (for indication): Units position: settable false |
| onRequest_ELEVATOR TRIM INDICATOR | trigger_onRequest_ELEVATOR TRIM INDICATOR | Percent elevator trim (for indication): Units position: settable false |
| ELEVATOR TRIM NEUTRAL | trigger_ELEVATOR TRIM NEUTRAL | Elevator trim neutral: Units radians: settable false |
| onChange_ELEVATOR TRIM NEUTRAL | trigger_onChange_ELEVATOR TRIM NEUTRAL | Elevator trim neutral: Units radians: settable false |
| onRequest_ELEVATOR TRIM NEUTRAL | trigger_onRequest_ELEVATOR TRIM NEUTRAL | Elevator trim neutral: Units radians: settable false |
| ELEVATOR TRIM PCT | trigger_ELEVATOR TRIM PCT | Percent elevator trim: Units percent Over 100: settable false |
| onChange_ELEVATOR TRIM PCT | trigger_onChange_ELEVATOR TRIM PCT | Percent elevator trim: Units percent Over 100: settable false |
| onRequest_ELEVATOR TRIM PCT | trigger_onRequest_ELEVATOR TRIM PCT | Percent elevator trim: Units percent Over 100: settable false |
| ELEVATOR TRIM POSITION | trigger_ELEVATOR TRIM POSITION | Elevator trim deflection: Units radians: settable true |
| onChange_ELEVATOR TRIM POSITION | trigger_onChange_ELEVATOR TRIM POSITION | Elevator trim deflection: Units radians: settable true |
| onRequest_ELEVATOR TRIM POSITION | trigger_onRequest_ELEVATOR TRIM POSITION | Elevator trim deflection: Units radians: settable true |
| ELEVATOR TRIM UP LIMIT | trigger_ELEVATOR TRIM UP LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_up_limit in the Flight Model Config file: Units degrees: settable false |
| onChange_ELEVATOR TRIM UP LIMIT | trigger_onChange_ELEVATOR TRIM UP LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_up_limit in the Flight Model Config file: Units degrees: settable false |
| onRequest_ELEVATOR TRIM UP LIMIT | trigger_onRequest_ELEVATOR TRIM UP LIMIT | Returns the maximum elevator trim value. This corresponds to the elevator_trim_up_limit in the Flight Model Config file: Units degrees: settable false |
| ELEVON DEFLECTION | trigger_ELEVON DEFLECTION | Elevon deflection: Units radians: settable false |
| onChange_ELEVON DEFLECTION | trigger_onChange_ELEVON DEFLECTION | Elevon deflection: Units radians: settable false |
| onRequest_ELEVON DEFLECTION | trigger_onRequest_ELEVON DEFLECTION | Elevon deflection: Units radians: settable false |
| ELT ACTIVATED | trigger_ELT ACTIVATED | Whether or not the Emergency Locator Transmitter is active.: Units bool: settable false |
| onChange_ELT ACTIVATED | trigger_onChange_ELT ACTIVATED | Whether or not the Emergency Locator Transmitter is active.: Units bool: settable false |
| onRequest_ELT ACTIVATED | trigger_onRequest_ELT ACTIVATED | Whether or not the Emergency Locator Transmitter is active.: Units bool: settable false |
| EMPTY WEIGHT | trigger_EMPTY WEIGHT | Empty weight of the aircraft: Units pounds: settable false |
| onChange_EMPTY WEIGHT | trigger_onChange_EMPTY WEIGHT | Empty weight of the aircraft: Units pounds: settable false |
| onRequest_EMPTY WEIGHT | trigger_onRequest_EMPTY WEIGHT | Empty weight of the aircraft: Units pounds: settable false |
| EMPTY WEIGHT CROSS COUPLED MOI | trigger_EMPTY WEIGHT CROSS COUPLED MOI | Empty weight cross coupled moment of inertia: Units slugs: settable false |
| onChange_EMPTY WEIGHT CROSS COUPLED MOI | trigger_onChange_EMPTY WEIGHT CROSS COUPLED MOI | Empty weight cross coupled moment of inertia: Units slugs: settable false |
| onRequest_EMPTY WEIGHT CROSS COUPLED MOI | trigger_onRequest_EMPTY WEIGHT CROSS COUPLED MOI | Empty weight cross coupled moment of inertia: Units slugs: settable false |
| EMPTY WEIGHT PITCH MOI | trigger_EMPTY WEIGHT PITCH MOI | Empty weight pitch moment of inertia: Units slugs: settable false |
| onChange_EMPTY WEIGHT PITCH MOI | trigger_onChange_EMPTY WEIGHT PITCH MOI | Empty weight pitch moment of inertia: Units slugs: settable false |
| onRequest_EMPTY WEIGHT PITCH MOI | trigger_onRequest_EMPTY WEIGHT PITCH MOI | Empty weight pitch moment of inertia: Units slugs: settable false |
| EMPTY WEIGHT ROLL MOI | trigger_EMPTY WEIGHT ROLL MOI | Empty weight roll moment of inertia: Units slugs: settable false |
| onChange_EMPTY WEIGHT ROLL MOI | trigger_onChange_EMPTY WEIGHT ROLL MOI | Empty weight roll moment of inertia: Units slugs: settable false |
| onRequest_EMPTY WEIGHT ROLL MOI | trigger_onRequest_EMPTY WEIGHT ROLL MOI | Empty weight roll moment of inertia: Units slugs: settable false |
| EMPTY WEIGHT YAW MOI | trigger_EMPTY WEIGHT YAW MOI | Empty weight yaw moment of inertia: Units slugs: settable false |
| onChange_EMPTY WEIGHT YAW MOI | trigger_onChange_EMPTY WEIGHT YAW MOI | Empty weight yaw moment of inertia: Units slugs: settable false |
| onRequest_EMPTY WEIGHT YAW MOI | trigger_onRequest_EMPTY WEIGHT YAW MOI | Empty weight yaw moment of inertia: Units slugs: settable false |
| ENG ANTI ICE:index | trigger_ENG ANTI ICE:index | Anti-ice switch for the indexed engine, true if enabled false otherwise: Units bool: settable false |
| onChange_ENG ANTI ICE:index | trigger_onChange_ENG ANTI ICE:index | Anti-ice switch for the indexed engine, true if enabled false otherwise: Units bool: settable false |
| onRequest_ENG ANTI ICE:index | trigger_onRequest_ENG ANTI ICE:index | Anti-ice switch for the indexed engine, true if enabled false otherwise: Units bool: settable false |
| ENG COMBUSTION:index | trigger_ENG COMBUSTION:index | True if the indexed engine is running, false otherwise: Units bool: settable false |
| onChange_ENG COMBUSTION:index | trigger_onChange_ENG COMBUSTION:index | True if the indexed engine is running, false otherwise: Units bool: settable false |
| onRequest_ENG COMBUSTION:index | trigger_onRequest_ENG COMBUSTION:index | True if the indexed engine is running, false otherwise: Units bool: settable false |
| ENG CYLINDER HEAD TEMPERATURE:index | trigger_ENG CYLINDER HEAD TEMPERATURE:index | The indexed engine cylinder head temperature: Units rankine: settable false |
| onChange_ENG CYLINDER HEAD TEMPERATURE:index | trigger_onChange_ENG CYLINDER HEAD TEMPERATURE:index | The indexed engine cylinder head temperature: Units rankine: settable false |
| onRequest_ENG CYLINDER HEAD TEMPERATURE:index | trigger_onRequest_ENG CYLINDER HEAD TEMPERATURE:index | The indexed engine cylinder head temperature: Units rankine: settable false |
| ENG EXHAUST GAS TEMPERATURE GES:index | trigger_ENG EXHAUST GAS TEMPERATURE GES:index | Governed engine setting exhaust gas temperature for the indexed engine: Units percent Over 100: settable false |
| onChange_ENG EXHAUST GAS TEMPERATURE GES:index | trigger_onChange_ENG EXHAUST GAS TEMPERATURE GES:index | Governed engine setting exhaust gas temperature for the indexed engine: Units percent Over 100: settable false |
| onRequest_ENG EXHAUST GAS TEMPERATURE GES:index | trigger_onRequest_ENG EXHAUST GAS TEMPERATURE GES:index | Governed engine setting exhaust gas temperature for the indexed engine: Units percent Over 100: settable false |
| ENG EXHAUST GAS TEMPERATURE:index | trigger_ENG EXHAUST GAS TEMPERATURE:index | Exhaust gas temperature for the indexed engine: Units rankine: settable false |
| onChange_ENG EXHAUST GAS TEMPERATURE:index | trigger_onChange_ENG EXHAUST GAS TEMPERATURE:index | Exhaust gas temperature for the indexed engine: Units rankine: settable false |
| onRequest_ENG EXHAUST GAS TEMPERATURE:index | trigger_onRequest_ENG EXHAUST GAS TEMPERATURE:index | Exhaust gas temperature for the indexed engine: Units rankine: settable false |
| ENG FAILED:index | trigger_ENG FAILED:index | Failure flag for the indexed engine that has failed: Units bool: settable false |
| onChange_ENG FAILED:index | trigger_onChange_ENG FAILED:index | Failure flag for the indexed engine that has failed: Units bool: settable false |
| onRequest_ENG FAILED:index | trigger_onRequest_ENG FAILED:index | Failure flag for the indexed engine that has failed: Units bool: settable false |
| ENG FUEL FLOW BUG POSITION:index | trigger_ENG FUEL FLOW BUG POSITION:index | Fuel flow reference in pounds per hour for the indexed engine: Units pounds per hour: settable false |
| onChange_ENG FUEL FLOW BUG POSITION:index | trigger_onChange_ENG FUEL FLOW BUG POSITION:index | Fuel flow reference in pounds per hour for the indexed engine: Units pounds per hour: settable false |
| onRequest_ENG FUEL FLOW BUG POSITION:index | trigger_onRequest_ENG FUEL FLOW BUG POSITION:index | Fuel flow reference in pounds per hour for the indexed engine: Units pounds per hour: settable false |
| ENG FUEL FLOW GPH:index | trigger_ENG FUEL FLOW GPH:index | Engine fuel flow in gallons per hour for the indexed engine: Units gallons per hour: settable false |
| onChange_ENG FUEL FLOW GPH:index | trigger_onChange_ENG FUEL FLOW GPH:index | Engine fuel flow in gallons per hour for the indexed engine: Units gallons per hour: settable false |
| onRequest_ENG FUEL FLOW GPH:index | trigger_onRequest_ENG FUEL FLOW GPH:index | Engine fuel flow in gallons per hour for the indexed engine: Units gallons per hour: settable false |
| ENG FUEL FLOW PPH:index | trigger_ENG FUEL FLOW PPH:index | The indexed engine fuel flow in pounds per hour: Units pounds per hour: settable false |
| onChange_ENG FUEL FLOW PPH:index | trigger_onChange_ENG FUEL FLOW PPH:index | The indexed engine fuel flow in pounds per hour: Units pounds per hour: settable false |
| onRequest_ENG FUEL FLOW PPH:index | trigger_onRequest_ENG FUEL FLOW PPH:index | The indexed engine fuel flow in pounds per hour: Units pounds per hour: settable false |
| ENG HYDRAULIC PRESSURE:index | trigger_ENG HYDRAULIC PRESSURE:index | The indexed engine hydraulic pressure: Units pounds: settable false |
| onChange_ENG HYDRAULIC PRESSURE:index | trigger_onChange_ENG HYDRAULIC PRESSURE:index | The indexed engine hydraulic pressure: Units pounds: settable false |
| onRequest_ENG HYDRAULIC PRESSURE:index | trigger_onRequest_ENG HYDRAULIC PRESSURE:index | The indexed engine hydraulic pressure: Units pounds: settable false |
| ENG HYDRAULIC QUANTITY:index | trigger_ENG HYDRAULIC QUANTITY:index | The indexed enginehydraulic fluid quantity, as a percentage of total capacity: Units percent Over 100: settable false |
| onChange_ENG HYDRAULIC QUANTITY:index | trigger_onChange_ENG HYDRAULIC QUANTITY:index | The indexed enginehydraulic fluid quantity, as a percentage of total capacity: Units percent Over 100: settable false |
| onRequest_ENG HYDRAULIC QUANTITY:index | trigger_onRequest_ENG HYDRAULIC QUANTITY:index | The indexed enginehydraulic fluid quantity, as a percentage of total capacity: Units percent Over 100: settable false |
| ENG MANIFOLD PRESSURE:index | trigger_ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units inches: settable false |
| onChange_ENG MANIFOLD PRESSURE:index | trigger_onChange_ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units inches: settable false |
| onRequest_ENG MANIFOLD PRESSURE:index | trigger_onRequest_ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units inches: settable false |
| ENG MAX RPM | trigger_ENG MAX RPM | The indexed engine Maximum rpm: Units RPM: settable false |
| onChange_ENG MAX RPM | trigger_onChange_ENG MAX RPM | The indexed engine Maximum rpm: Units RPM: settable false |
| onRequest_ENG MAX RPM | trigger_onRequest_ENG MAX RPM | The indexed engine Maximum rpm: Units RPM: settable false |
| ENG N1 RPM:index | trigger_ENG N1 RPM:index | The indexed engine N1 rpm: Units RPM: settable false |
| onChange_ENG N1 RPM:index | trigger_onChange_ENG N1 RPM:index | The indexed engine N1 rpm: Units RPM: settable false |
| onRequest_ENG N1 RPM:index | trigger_onRequest_ENG N1 RPM:index | The indexed engine N1 rpm: Units RPM: settable false |
| ENG N2 RPM:index | trigger_ENG N2 RPM:index | The indexed engine N2 rpm: Units RPM: settable false |
| onChange_ENG N2 RPM:index | trigger_onChange_ENG N2 RPM:index | The indexed engine N2 rpm: Units RPM: settable false |
| onRequest_ENG N2 RPM:index | trigger_onRequest_ENG N2 RPM:index | The indexed engine N2 rpm: Units RPM: settable false |
| ENG OIL PRESSURE:index | trigger_ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable false |
| onChange_ENG OIL PRESSURE:index | trigger_onChange_ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable false |
| onRequest_ENG OIL PRESSURE:index | trigger_onRequest_ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable false |
| ENG OIL QUANTITY:index | trigger_ENG OIL QUANTITY:index | The indexed engine oil quantity as a percentage of full capacity: Units percent Over 100: settable false |
| onChange_ENG OIL QUANTITY:index | trigger_onChange_ENG OIL QUANTITY:index | The indexed engine oil quantity as a percentage of full capacity: Units percent Over 100: settable false |
| onRequest_ENG OIL QUANTITY:index | trigger_onRequest_ENG OIL QUANTITY:index | The indexed engine oil quantity as a percentage of full capacity: Units percent Over 100: settable false |
| ENG OIL TEMPERATURE:index | trigger_ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable false |
| onChange_ENG OIL TEMPERATURE:index | trigger_onChange_ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable false |
| onRequest_ENG OIL TEMPERATURE:index | trigger_onRequest_ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable false |
| ENG ON FIRE:index | trigger_ENG ON FIRE:index | The indexed engine on fire state: Units bool: settable true |
| onChange_ENG ON FIRE:index | trigger_onChange_ENG ON FIRE:index | The indexed engine on fire state: Units bool: settable true |
| onRequest_ENG ON FIRE:index | trigger_onRequest_ENG ON FIRE:index | The indexed engine on fire state: Units bool: settable true |
| ENG PRESSURE RATIO:index | trigger_ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable false |
| onChange_ENG PRESSURE RATIO:index | trigger_onChange_ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable false |
| onRequest_ENG PRESSURE RATIO:index | trigger_onRequest_ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable false |
| ENG RPM ANIMATION PERCENT:index | trigger_ENG RPM ANIMATION PERCENT:index | The indexed engine percentage maximum rated rpm (used for visual animation): Units percent: settable false |
| onChange_ENG RPM ANIMATION PERCENT:index | trigger_onChange_ENG RPM ANIMATION PERCENT:index | The indexed engine percentage maximum rated rpm (used for visual animation): Units percent: settable false |
| onRequest_ENG RPM ANIMATION PERCENT:index | trigger_onRequest_ENG RPM ANIMATION PERCENT:index | The indexed engine percentage maximum rated rpm (used for visual animation): Units percent: settable false |
| ENG TORQUE:index | trigger_ENG TORQUE:index | The indexed engine torque: Units foot pounds: settable false |
| onChange_ENG TORQUE:index | trigger_onChange_ENG TORQUE:index | The indexed engine torque: Units foot pounds: settable false |
| onRequest_ENG TORQUE:index | trigger_onRequest_ENG TORQUE:index | The indexed engine torque: Units foot pounds: settable false |
| ENG VIBRATION:index | trigger_ENG VIBRATION:index | The indexed engine vibration: Units number: settable false |
| onChange_ENG VIBRATION:index | trigger_onChange_ENG VIBRATION:index | The indexed engine vibration: Units number: settable false |
| onRequest_ENG VIBRATION:index | trigger_onRequest_ENG VIBRATION:index | The indexed engine vibration: Units number: settable false |
| ENGINE CONTROL SELECT | trigger_ENGINE CONTROL SELECT | Selected engines (combination of bit flags): Units mask: settable true |
| onChange_ENGINE CONTROL SELECT | trigger_onChange_ENGINE CONTROL SELECT | Selected engines (combination of bit flags): Units mask: settable true |
| onRequest_ENGINE CONTROL SELECT | trigger_onRequest_ENGINE CONTROL SELECT | Selected engines (combination of bit flags): Units mask: settable true |
| ENGINE PRIMER | trigger_ENGINE PRIMER | The engine primer position: Units position: settable true |
| onChange_ENGINE PRIMER | trigger_onChange_ENGINE PRIMER | The engine primer position: Units position: settable true |
| onRequest_ENGINE PRIMER | trigger_onRequest_ENGINE PRIMER | The engine primer position: Units position: settable true |
| ENGINE TYPE | trigger_ENGINE TYPE | Engine type: Units enum: settable false |
| onChange_ENGINE TYPE | trigger_onChange_ENGINE TYPE | Engine type: Units enum: settable false |
| onRequest_ENGINE TYPE | trigger_onRequest_ENGINE TYPE | Engine type: Units enum: settable false |
| ESTIMATED CRUISE SPEED | trigger_ESTIMATED CRUISE SPEED | Estimated cruise speed: Units feet: settable false |
| onChange_ESTIMATED CRUISE SPEED | trigger_onChange_ESTIMATED CRUISE SPEED | Estimated cruise speed: Units feet: settable false |
| onRequest_ESTIMATED CRUISE SPEED | trigger_onRequest_ESTIMATED CRUISE SPEED | Estimated cruise speed: Units feet: settable false |
| ESTIMATED FUEL FLOW:index | trigger_ESTIMATED FUEL FLOW:index | Estimated fuel flow to the indexed engine at cruise speed: Units pounds per hour: settable false |
| onChange_ESTIMATED FUEL FLOW:index | trigger_onChange_ESTIMATED FUEL FLOW:index | Estimated fuel flow to the indexed engine at cruise speed: Units pounds per hour: settable false |
| onRequest_ESTIMATED FUEL FLOW:index | trigger_onRequest_ESTIMATED FUEL FLOW:index | Estimated fuel flow to the indexed engine at cruise speed: Units pounds per hour: settable false |
| EXTERNAL POWER AVAILABLE | trigger_EXTERNAL POWER AVAILABLE | This will be true if the given external power source is available. Use an external power index when referencing: Units bool: settable false |
| onChange_EXTERNAL POWER AVAILABLE | trigger_onChange_EXTERNAL POWER AVAILABLE | This will be true if the given external power source is available. Use an external power index when referencing: Units bool: settable false |
| onRequest_EXTERNAL POWER AVAILABLE | trigger_onRequest_EXTERNAL POWER AVAILABLE | This will be true if the given external power source is available. Use an external power index when referencing: Units bool: settable false |
| EXTERNAL POWER BREAKER PULLED | trigger_EXTERNAL POWER BREAKER PULLED | Boolean, The state of the breaker of an external power source: Units bool: settable true |
| onChange_EXTERNAL POWER BREAKER PULLED | trigger_onChange_EXTERNAL POWER BREAKER PULLED | Boolean, The state of the breaker of an external power source: Units bool: settable true |
| onRequest_EXTERNAL POWER BREAKER PULLED | trigger_onRequest_EXTERNAL POWER BREAKER PULLED | Boolean, The state of the breaker of an external power source: Units bool: settable true |
| EXTERNAL POWER CONNECTION ON | trigger_EXTERNAL POWER CONNECTION ON | Boolean, The state of the connection between a bus and an external power source: Units bool: settable false |
| onChange_EXTERNAL POWER CONNECTION ON | trigger_onChange_EXTERNAL POWER CONNECTION ON | Boolean, The state of the connection between a bus and an external power source: Units bool: settable false |
| onRequest_EXTERNAL POWER CONNECTION ON | trigger_onRequest_EXTERNAL POWER CONNECTION ON | Boolean, The state of the connection between a bus and an external power source: Units bool: settable false |
| EXTERNAL POWER ON | trigger_EXTERNAL POWER ON | The external power switch position, true if the switch is ON. Use an external power index when referencing: Units bool: settable false |
| onChange_EXTERNAL POWER ON | trigger_onChange_EXTERNAL POWER ON | The external power switch position, true if the switch is ON. Use an external power index when referencing: Units bool: settable false |
| onRequest_EXTERNAL POWER ON | trigger_onRequest_EXTERNAL POWER ON | The external power switch position, true if the switch is ON. Use an external power index when referencing: Units bool: settable false |
| EXTERNAL SYSTEM VALUE | trigger_EXTERNAL SYSTEM VALUE | Generic SimVar.: Units number: settable true |
| onChange_EXTERNAL SYSTEM VALUE | trigger_onChange_EXTERNAL SYSTEM VALUE | Generic SimVar.: Units number: settable true |
| onRequest_EXTERNAL SYSTEM VALUE | trigger_onRequest_EXTERNAL SYSTEM VALUE | Generic SimVar.: Units number: settable true |
| FIRE BOTTLE DISCHARGED | trigger_FIRE BOTTLE DISCHARGED | True if the fire bottle is discharged.: Units bool: settable false |
| onChange_FIRE BOTTLE DISCHARGED | trigger_onChange_FIRE BOTTLE DISCHARGED | True if the fire bottle is discharged.: Units bool: settable false |
| onRequest_FIRE BOTTLE DISCHARGED | trigger_onRequest_FIRE BOTTLE DISCHARGED | True if the fire bottle is discharged.: Units bool: settable false |
| FIRE BOTTLE SWITCH | trigger_FIRE BOTTLE SWITCH | True if the fire bottle switch is on.: Units bool: settable false |
| onChange_FIRE BOTTLE SWITCH | trigger_onChange_FIRE BOTTLE SWITCH | True if the fire bottle switch is on.: Units bool: settable false |
| onRequest_FIRE BOTTLE SWITCH | trigger_onRequest_FIRE BOTTLE SWITCH | True if the fire bottle switch is on.: Units bool: settable false |
| FLAP DAMAGE BY SPEED | trigger_FLAP DAMAGE BY SPEED | True if flaps are damaged by excessive speed: Units bool: settable false |
| onChange_FLAP DAMAGE BY SPEED | trigger_onChange_FLAP DAMAGE BY SPEED | True if flaps are damaged by excessive speed: Units bool: settable false |
| onRequest_FLAP DAMAGE BY SPEED | trigger_onRequest_FLAP DAMAGE BY SPEED | True if flaps are damaged by excessive speed: Units bool: settable false |
| FLAP POSITION SET | trigger_FLAP POSITION SET | Set the position of the flaps control: Units position: settable true |
| onChange_FLAP POSITION SET | trigger_onChange_FLAP POSITION SET | Set the position of the flaps control: Units position: settable true |
| onRequest_FLAP POSITION SET | trigger_onRequest_FLAP POSITION SET | Set the position of the flaps control: Units position: settable true |
| FLAP SPEED EXCEEDED | trigger_FLAP SPEED EXCEEDED | True if safe speed limit for flaps exceeded: Units bool: settable false |
| onChange_FLAP SPEED EXCEEDED | trigger_onChange_FLAP SPEED EXCEEDED | True if safe speed limit for flaps exceeded: Units bool: settable false |
| onRequest_FLAP SPEED EXCEEDED | trigger_onRequest_FLAP SPEED EXCEEDED | True if safe speed limit for flaps exceeded: Units bool: settable false |
| FLAPS AVAILABLE | trigger_FLAPS AVAILABLE | True if flaps available: Units bool: settable false |
| onChange_FLAPS AVAILABLE | trigger_onChange_FLAPS AVAILABLE | True if flaps available: Units bool: settable false |
| onRequest_FLAPS AVAILABLE | trigger_onRequest_FLAPS AVAILABLE | True if flaps available: Units bool: settable false |
| FLAPS EFFECTIVE HANDLE INDEX:index | trigger_FLAPS EFFECTIVE HANDLE INDEX:index | This returns the effective flaps handle index, after some of the conditions have potentially forced the state to change: Units number: settable false |
| onChange_FLAPS EFFECTIVE HANDLE INDEX:index | trigger_onChange_FLAPS EFFECTIVE HANDLE INDEX:index | This returns the effective flaps handle index, after some of the conditions have potentially forced the state to change: Units number: settable false |
| onRequest_FLAPS EFFECTIVE HANDLE INDEX:index | trigger_onRequest_FLAPS EFFECTIVE HANDLE INDEX:index | This returns the effective flaps handle index, after some of the conditions have potentially forced the state to change: Units number: settable false |
| FLAPS HANDLE INDEX:index | trigger_FLAPS HANDLE INDEX:index | Index of current flap position: Units number: settable true |
| onChange_FLAPS HANDLE INDEX:index | trigger_onChange_FLAPS HANDLE INDEX:index | Index of current flap position: Units number: settable true |
| onRequest_FLAPS HANDLE INDEX:index | trigger_onRequest_FLAPS HANDLE INDEX:index | Index of current flap position: Units number: settable true |
| FLAPS HANDLE PERCENT | trigger_FLAPS HANDLE PERCENT | Percent flap handle extended: Units percent Over 100: settable false |
| onChange_FLAPS HANDLE PERCENT | trigger_onChange_FLAPS HANDLE PERCENT | Percent flap handle extended: Units percent Over 100: settable false |
| onRequest_FLAPS HANDLE PERCENT | trigger_onRequest_FLAPS HANDLE PERCENT | Percent flap handle extended: Units percent Over 100: settable false |
| FLAPS NUM HANDLE POSITIONS | trigger_FLAPS NUM HANDLE POSITIONS | Number of available flap positions: Units number: settable false |
| onChange_FLAPS NUM HANDLE POSITIONS | trigger_onChange_FLAPS NUM HANDLE POSITIONS | Number of available flap positions: Units number: settable false |
| onRequest_FLAPS NUM HANDLE POSITIONS | trigger_onRequest_FLAPS NUM HANDLE POSITIONS | Number of available flap positions: Units number: settable false |
| FLARM AVAILABLE | trigger_FLARM AVAILABLE | Whether the FLARM is available (TRUE, 1) or not (FALSE, 0).: Units bool: settable true |
| onChange_FLARM AVAILABLE | trigger_onChange_FLARM AVAILABLE | Whether the FLARM is available (TRUE, 1) or not (FALSE, 0).: Units bool: settable true |
| onRequest_FLARM AVAILABLE | trigger_onRequest_FLARM AVAILABLE | Whether the FLARM is available (TRUE, 1) or not (FALSE, 0).: Units bool: settable true |
| FLARM THREAT BEARING | trigger_FLARM THREAT BEARING | The bearing of the FLARM threat aircraft, relative to track.: Units degrees: settable false |
| onChange_FLARM THREAT BEARING | trigger_onChange_FLARM THREAT BEARING | The bearing of the FLARM threat aircraft, relative to track.: Units degrees: settable false |
| onRequest_FLARM THREAT BEARING | trigger_onRequest_FLARM THREAT BEARING | The bearing of the FLARM threat aircraft, relative to track.: Units degrees: settable false |
| FLARM THREAT DISTANCE | trigger_FLARM THREAT DISTANCE | The distance to the FLARM threat object.: Units meters: settable false |
| onChange_FLARM THREAT DISTANCE | trigger_onChange_FLARM THREAT DISTANCE | The distance to the FLARM threat object.: Units meters: settable false |
| onRequest_FLARM THREAT DISTANCE | trigger_onRequest_FLARM THREAT DISTANCE | The distance to the FLARM threat object.: Units meters: settable false |
| FLARM THREAT HEADING | trigger_FLARM THREAT HEADING | The heading to the FLARM threat object.: Units degrees: settable false |
| onChange_FLARM THREAT HEADING | trigger_onChange_FLARM THREAT HEADING | The heading to the FLARM threat object.: Units degrees: settable false |
| onRequest_FLARM THREAT HEADING | trigger_onRequest_FLARM THREAT HEADING | The heading to the FLARM threat object.: Units degrees: settable false |
| FLARM THREAT RELATIVE ALTITUDE | trigger_FLARM THREAT RELATIVE ALTITUDE | The relative altitude of the threat object.: Units meters: settable false |
| onChange_FLARM THREAT RELATIVE ALTITUDE | trigger_onChange_FLARM THREAT RELATIVE ALTITUDE | The relative altitude of the threat object.: Units meters: settable false |
| onRequest_FLARM THREAT RELATIVE ALTITUDE | trigger_onRequest_FLARM THREAT RELATIVE ALTITUDE | The relative altitude of the threat object.: Units meters: settable false |
| FLARM THREAT TIME TO COLLISION | trigger_FLARM THREAT TIME TO COLLISION | The estimated time to a collision.: Units seconds: settable false |
| onChange_FLARM THREAT TIME TO COLLISION | trigger_onChange_FLARM THREAT TIME TO COLLISION | The estimated time to a collision.: Units seconds: settable false |
| onRequest_FLARM THREAT TIME TO COLLISION | trigger_onRequest_FLARM THREAT TIME TO COLLISION | The estimated time to a collision.: Units seconds: settable false |
| FLARM THREAT VERTICAL BEARING | trigger_FLARM THREAT VERTICAL BEARING | The vertical bearing towards the threat.: Units degrees: settable false |
| onChange_FLARM THREAT VERTICAL BEARING | trigger_onChange_FLARM THREAT VERTICAL BEARING | The vertical bearing towards the threat.: Units degrees: settable false |
| onRequest_FLARM THREAT VERTICAL BEARING | trigger_onRequest_FLARM THREAT VERTICAL BEARING | The vertical bearing towards the threat.: Units degrees: settable false |
| FLY ASSISTANT CANCEL DESTINATION | trigger_FLY ASSISTANT CANCEL DESTINATION | When set with any value this will cancel the current flight assistant destination: Units number: settable true |
| onChange_FLY ASSISTANT CANCEL DESTINATION | trigger_onChange_FLY ASSISTANT CANCEL DESTINATION | When set with any value this will cancel the current flight assistant destination: Units number: settable true |
| onRequest_FLY ASSISTANT CANCEL DESTINATION | trigger_onRequest_FLY ASSISTANT CANCEL DESTINATION | When set with any value this will cancel the current flight assistant destination: Units number: settable true |
| FLY ASSISTANT CANCEL DESTINATION DISPLAY | trigger_FLY ASSISTANT CANCEL DESTINATION DISPLAY | When set with any value this will cancel the display of the current flight assistant destination: Units number: settable true |
| onChange_FLY ASSISTANT CANCEL DESTINATION DISPLAY | trigger_onChange_FLY ASSISTANT CANCEL DESTINATION DISPLAY | When set with any value this will cancel the display of the current flight assistant destination: Units number: settable true |
| onRequest_FLY ASSISTANT CANCEL DESTINATION DISPLAY | trigger_onRequest_FLY ASSISTANT CANCEL DESTINATION DISPLAY | When set with any value this will cancel the display of the current flight assistant destination: Units number: settable true |
| FLY ASSISTANT COM AI LOCKED | trigger_FLY ASSISTANT COM AI LOCKED | Returns true when the copilot AI control is active and therefore COM AI is locked on active too: Units bool: settable false |
| onChange_FLY ASSISTANT COM AI LOCKED | trigger_onChange_FLY ASSISTANT COM AI LOCKED | Returns true when the copilot AI control is active and therefore COM AI is locked on active too: Units bool: settable false |
| onRequest_FLY ASSISTANT COM AI LOCKED | trigger_onRequest_FLY ASSISTANT COM AI LOCKED | Returns true when the copilot AI control is active and therefore COM AI is locked on active too: Units bool: settable false |
| FLY ASSISTANT HAVE DESTINATION | trigger_FLY ASSISTANT HAVE DESTINATION | Returns true when a destination has been set in the flight assistant: Units bool: settable false |
| onChange_FLY ASSISTANT HAVE DESTINATION | trigger_onChange_FLY ASSISTANT HAVE DESTINATION | Returns true when a destination has been set in the flight assistant: Units bool: settable false |
| onRequest_FLY ASSISTANT HAVE DESTINATION | trigger_onRequest_FLY ASSISTANT HAVE DESTINATION | Returns true when a destination has been set in the flight assistant: Units bool: settable false |
| FLY ASSISTANT LANDING SPEED | trigger_FLY ASSISTANT LANDING SPEED | Returns the POH range or an estimated value for this speed: Units null: settable false |
| onChange_FLY ASSISTANT LANDING SPEED | trigger_onChange_FLY ASSISTANT LANDING SPEED | Returns the POH range or an estimated value for this speed: Units null: settable false |
| onRequest_FLY ASSISTANT LANDING SPEED | trigger_onRequest_FLY ASSISTANT LANDING SPEED | Returns the POH range or an estimated value for this speed: Units null: settable false |
| FLY ASSISTANT LANDING SPEED DISPLAY MODE | trigger_FLY ASSISTANT LANDING SPEED DISPLAY MODE | Returns the display mode of the speed, CSS side (only STALL SPEED is working and will turn red when below): Units null: settable false |
| onChange_FLY ASSISTANT LANDING SPEED DISPLAY MODE | trigger_onChange_FLY ASSISTANT LANDING SPEED DISPLAY MODE | Returns the display mode of the speed, CSS side (only STALL SPEED is working and will turn red when below): Units null: settable false |
| onRequest_FLY ASSISTANT LANDING SPEED DISPLAY MODE | trigger_onRequest_FLY ASSISTANT LANDING SPEED DISPLAY MODE | Returns the display mode of the speed, CSS side (only STALL SPEED is working and will turn red when below): Units null: settable false |
| FLY ASSISTANT NEAREST CATEGORY | trigger_FLY ASSISTANT NEAREST CATEGORY | Selected category: Units enum: settable true |
| onChange_FLY ASSISTANT NEAREST CATEGORY | trigger_onChange_FLY ASSISTANT NEAREST CATEGORY | Selected category: Units enum: settable true |
| onRequest_FLY ASSISTANT NEAREST CATEGORY | trigger_onRequest_FLY ASSISTANT NEAREST CATEGORY | Selected category: Units enum: settable true |
| FLY ASSISTANT NEAREST COUNT | trigger_FLY ASSISTANT NEAREST COUNT | Number of elements in this category: Units number: settable false |
| onChange_FLY ASSISTANT NEAREST COUNT | trigger_onChange_FLY ASSISTANT NEAREST COUNT | Number of elements in this category: Units number: settable false |
| onRequest_FLY ASSISTANT NEAREST COUNT | trigger_onRequest_FLY ASSISTANT NEAREST COUNT | Number of elements in this category: Units number: settable false |
| FLY ASSISTANT NEAREST NAME | trigger_FLY ASSISTANT NEAREST NAME | Returns the name of the element at the specified index: Units null: settable false |
| onChange_FLY ASSISTANT NEAREST NAME | trigger_onChange_FLY ASSISTANT NEAREST NAME | Returns the name of the element at the specified index: Units null: settable false |
| onRequest_FLY ASSISTANT NEAREST NAME | trigger_onRequest_FLY ASSISTANT NEAREST NAME | Returns the name of the element at the specified index: Units null: settable false |
| FLY ASSISTANT NEAREST SELECTED | trigger_FLY ASSISTANT NEAREST SELECTED | Returns the index of the currently selected element: Units number: settable true |
| onChange_FLY ASSISTANT NEAREST SELECTED | trigger_onChange_FLY ASSISTANT NEAREST SELECTED | Returns the index of the currently selected element: Units number: settable true |
| onRequest_FLY ASSISTANT NEAREST SELECTED | trigger_onRequest_FLY ASSISTANT NEAREST SELECTED | Returns the index of the currently selected element: Units number: settable true |
| FLY ASSISTANT RIBBONS ACTIVE | trigger_FLY ASSISTANT RIBBONS ACTIVE | Returns true when both ribbon assistances are active (taxi and landing), and can also be used to set them: Units bool: settable true |
| onChange_FLY ASSISTANT RIBBONS ACTIVE | trigger_onChange_FLY ASSISTANT RIBBONS ACTIVE | Returns true when both ribbon assistances are active (taxi and landing), and can also be used to set them: Units bool: settable true |
| onRequest_FLY ASSISTANT RIBBONS ACTIVE | trigger_onRequest_FLY ASSISTANT RIBBONS ACTIVE | Returns true when both ribbon assistances are active (taxi and landing), and can also be used to set them: Units bool: settable true |
| FLY ASSISTANT SET AS DESTINATION | trigger_FLY ASSISTANT SET AS DESTINATION | When set with any value, it will set the selected element as the current destination: Units number: settable true |
| onChange_FLY ASSISTANT SET AS DESTINATION | trigger_onChange_FLY ASSISTANT SET AS DESTINATION | When set with any value, it will set the selected element as the current destination: Units number: settable true |
| onRequest_FLY ASSISTANT SET AS DESTINATION | trigger_onRequest_FLY ASSISTANT SET AS DESTINATION | When set with any value, it will set the selected element as the current destination: Units number: settable true |
| FLY ASSISTANT STALL SPEED | trigger_FLY ASSISTANT STALL SPEED | Returns the flight assistant stall speed: Units knots: settable true |
| onChange_FLY ASSISTANT STALL SPEED | trigger_onChange_FLY ASSISTANT STALL SPEED | Returns the flight assistant stall speed: Units knots: settable true |
| onRequest_FLY ASSISTANT STALL SPEED | trigger_onRequest_FLY ASSISTANT STALL SPEED | Returns the flight assistant stall speed: Units knots: settable true |
| FLY ASSISTANT STALL SPEED DISPLAY MODE | trigger_FLY ASSISTANT STALL SPEED DISPLAY MODE | Returns the flight assistant stall speed display mode: Units null: settable false |
| onChange_FLY ASSISTANT STALL SPEED DISPLAY MODE | trigger_onChange_FLY ASSISTANT STALL SPEED DISPLAY MODE | Returns the flight assistant stall speed display mode: Units null: settable false |
| onRequest_FLY ASSISTANT STALL SPEED DISPLAY MODE | trigger_onRequest_FLY ASSISTANT STALL SPEED DISPLAY MODE | Returns the flight assistant stall speed display mode: Units null: settable false |
| FLY ASSISTANT TAKEOFF SPEED | trigger_FLY ASSISTANT TAKEOFF SPEED | Returns the flight assistant takeoff speed: Units knots: settable true |
| onChange_FLY ASSISTANT TAKEOFF SPEED | trigger_onChange_FLY ASSISTANT TAKEOFF SPEED | Returns the flight assistant takeoff speed: Units knots: settable true |
| onRequest_FLY ASSISTANT TAKEOFF SPEED | trigger_onRequest_FLY ASSISTANT TAKEOFF SPEED | Returns the flight assistant takeoff speed: Units knots: settable true |
| FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | trigger_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | Returns the flight assistant takeoff speed display mode: Units null: settable false |
| onChange_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | trigger_onChange_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | Returns the flight assistant takeoff speed display mode: Units null: settable false |
| onRequest_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | trigger_onRequest_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE | Returns the flight assistant takeoff speed display mode: Units null: settable false |
| FLY ASSISTANT TAKEOFF SPEED ESTIMATED | trigger_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | Can be set to override the estimated takeoff speed: Units knots: settable true |
| onChange_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | trigger_onChange_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | Can be set to override the estimated takeoff speed: Units knots: settable true |
| onRequest_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | trigger_onRequest_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | Can be set to override the estimated takeoff speed: Units knots: settable true |
| FLY BY WIRE ALPHA PROTECTION | trigger_FLY BY WIRE ALPHA PROTECTION | Returns true if the fly-by-wire alpha protection is enabled or false otherwise: Units bool: settable false |
| onChange_FLY BY WIRE ALPHA PROTECTION | trigger_onChange_FLY BY WIRE ALPHA PROTECTION | Returns true if the fly-by-wire alpha protection is enabled or false otherwise: Units bool: settable false |
| onRequest_FLY BY WIRE ALPHA PROTECTION | trigger_onRequest_FLY BY WIRE ALPHA PROTECTION | Returns true if the fly-by-wire alpha protection is enabled or false otherwise: Units bool: settable false |
| FLY BY WIRE ELAC FAILED | trigger_FLY BY WIRE ELAC FAILED | True if the Elevators and Ailerons computer has failed: Units bool: settable false |
| onChange_FLY BY WIRE ELAC FAILED | trigger_onChange_FLY BY WIRE ELAC FAILED | True if the Elevators and Ailerons computer has failed: Units bool: settable false |
| onRequest_FLY BY WIRE ELAC FAILED | trigger_onRequest_FLY BY WIRE ELAC FAILED | True if the Elevators and Ailerons computer has failed: Units bool: settable false |
| FLY BY WIRE ELAC SWITCH | trigger_FLY BY WIRE ELAC SWITCH | True if the fly by wire Elevators and Ailerons computer is on: Units bool: settable false |
| onChange_FLY BY WIRE ELAC SWITCH | trigger_onChange_FLY BY WIRE ELAC SWITCH | True if the fly by wire Elevators and Ailerons computer is on: Units bool: settable false |
| onRequest_FLY BY WIRE ELAC SWITCH | trigger_onRequest_FLY BY WIRE ELAC SWITCH | True if the fly by wire Elevators and Ailerons computer is on: Units bool: settable false |
| FLY BY WIRE FAC FAILED | trigger_FLY BY WIRE FAC FAILED | True if the Flight Augmentation computer has failed: Units bool: settable false |
| onChange_FLY BY WIRE FAC FAILED | trigger_onChange_FLY BY WIRE FAC FAILED | True if the Flight Augmentation computer has failed: Units bool: settable false |
| onRequest_FLY BY WIRE FAC FAILED | trigger_onRequest_FLY BY WIRE FAC FAILED | True if the Flight Augmentation computer has failed: Units bool: settable false |
| FLY BY WIRE FAC SWITCH | trigger_FLY BY WIRE FAC SWITCH | True if the fly by wire Flight Augmentation computer is on: Units bool: settable false |
| onChange_FLY BY WIRE FAC SWITCH | trigger_onChange_FLY BY WIRE FAC SWITCH | True if the fly by wire Flight Augmentation computer is on: Units bool: settable false |
| onRequest_FLY BY WIRE FAC SWITCH | trigger_onRequest_FLY BY WIRE FAC SWITCH | True if the fly by wire Flight Augmentation computer is on: Units bool: settable false |
| FLY BY WIRE SEC FAILED | trigger_FLY BY WIRE SEC FAILED | True if the Spoilers and Elevators computer has failed: Units bool: settable false |
| onChange_FLY BY WIRE SEC FAILED | trigger_onChange_FLY BY WIRE SEC FAILED | True if the Spoilers and Elevators computer has failed: Units bool: settable false |
| onRequest_FLY BY WIRE SEC FAILED | trigger_onRequest_FLY BY WIRE SEC FAILED | True if the Spoilers and Elevators computer has failed: Units bool: settable false |
| FLY BY WIRE SEC SWITCH | trigger_FLY BY WIRE SEC SWITCH | True if the fly by wire Spoilers and Elevators computer is on: Units bool: settable false |
| onChange_FLY BY WIRE SEC SWITCH | trigger_onChange_FLY BY WIRE SEC SWITCH | True if the fly by wire Spoilers and Elevators computer is on: Units bool: settable false |
| onRequest_FLY BY WIRE SEC SWITCH | trigger_onRequest_FLY BY WIRE SEC SWITCH | True if the fly by wire Spoilers and Elevators computer is on: Units bool: settable false |
| FOLDING WING HANDLE POSITION | trigger_FOLDING WING HANDLE POSITION | True if the folding wing handle is engaged: Units bool: settable false |
| onChange_FOLDING WING HANDLE POSITION | trigger_onChange_FOLDING WING HANDLE POSITION | True if the folding wing handle is engaged: Units bool: settable false |
| onRequest_FOLDING WING HANDLE POSITION | trigger_onRequest_FOLDING WING HANDLE POSITION | True if the folding wing handle is engaged: Units bool: settable false |
| FOLDING WING LEFT PERCENT | trigger_FOLDING WING LEFT PERCENT | Left folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| onChange_FOLDING WING LEFT PERCENT | trigger_onChange_FOLDING WING LEFT PERCENT | Left folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| onRequest_FOLDING WING LEFT PERCENT | trigger_onRequest_FOLDING WING LEFT PERCENT | Left folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| FOLDING WING RIGHT PERCENT | trigger_FOLDING WING RIGHT PERCENT | Right folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| onChange_FOLDING WING RIGHT PERCENT | trigger_onChange_FOLDING WING RIGHT PERCENT | Right folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| onRequest_FOLDING WING RIGHT PERCENT | trigger_onRequest_FOLDING WING RIGHT PERCENT | Right folding wing position, 1.0 is fully folded: Units percent Over 100: settable false |
| FUELTRUCK HOSE DEPLOYED | trigger_FUELTRUCK HOSE DEPLOYED | The current deployment amount of the fuel truck hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| onChange_FUELTRUCK HOSE DEPLOYED | trigger_onChange_FUELTRUCK HOSE DEPLOYED | The current deployment amount of the fuel truck hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| onRequest_FUELTRUCK HOSE DEPLOYED | trigger_onRequest_FUELTRUCK HOSE DEPLOYED | The current deployment amount of the fuel truck hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| FUELTRUCK HOSE END POSX | trigger_FUELTRUCK HOSE END POSX | The "X" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| onChange_FUELTRUCK HOSE END POSX | trigger_onChange_FUELTRUCK HOSE END POSX | The "X" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| onRequest_FUELTRUCK HOSE END POSX | trigger_onRequest_FUELTRUCK HOSE END POSX | The "X" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| FUELTRUCK HOSE END POSZ | trigger_FUELTRUCK HOSE END POSZ | The "Z" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| onChange_FUELTRUCK HOSE END POSZ | trigger_onChange_FUELTRUCK HOSE END POSZ | The "Z" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| onRequest_FUELTRUCK HOSE END POSZ | trigger_onRequest_FUELTRUCK HOSE END POSZ | The "Z" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters: settable false |
| FUELTRUCK HOSE END RELATIVE HEADING | trigger_FUELTRUCK HOSE END RELATIVE HEADING | The heading of the end of the fuel truck hose, relative to the vehicle heading.: Units degrees: settable false |
| onChange_FUELTRUCK HOSE END RELATIVE HEADING | trigger_onChange_FUELTRUCK HOSE END RELATIVE HEADING | The heading of the end of the fuel truck hose, relative to the vehicle heading.: Units degrees: settable false |
| onRequest_FUELTRUCK HOSE END RELATIVE HEADING | trigger_onRequest_FUELTRUCK HOSE END RELATIVE HEADING | The heading of the end of the fuel truck hose, relative to the vehicle heading.: Units degrees: settable false |
| FULL THROTTLE THRUST TO WEIGHT RATIO | trigger_FULL THROTTLE THRUST TO WEIGHT RATIO | Full throttle thrust to weight ratio: Units number: settable false |
| onChange_FULL THROTTLE THRUST TO WEIGHT RATIO | trigger_onChange_FULL THROTTLE THRUST TO WEIGHT RATIO | Full throttle thrust to weight ratio: Units number: settable false |
| onRequest_FULL THROTTLE THRUST TO WEIGHT RATIO | trigger_onRequest_FULL THROTTLE THRUST TO WEIGHT RATIO | Full throttle thrust to weight ratio: Units number: settable false |
| G FORCE | trigger_G FORCE | Current g force: Units gforce: settable true |
| onChange_G FORCE | trigger_onChange_G FORCE | Current g force: Units gforce: settable true |
| onRequest_G FORCE | trigger_onRequest_G FORCE | Current g force: Units gforce: settable true |
| G LIMITER SETTING | trigger_G LIMITER SETTING | This returns the setting of the G-limiter, as set using the GLimiterSetting parameter: Units enum: settable false |
| onChange_G LIMITER SETTING | trigger_onChange_G LIMITER SETTING | This returns the setting of the G-limiter, as set using the GLimiterSetting parameter: Units enum: settable false |
| onRequest_G LIMITER SETTING | trigger_onRequest_G LIMITER SETTING | This returns the setting of the G-limiter, as set using the GLimiterSetting parameter: Units enum: settable false |
| GAMEPLAY CAMERA FOCUS | trigger_GAMEPLAY CAMERA FOCUS | This gets/sets the focus for the camera zoom, which can be either manual, or auto. The setting affects both the Cockpit and the External (Chase) cameras.: Units enum: settable true |
| onChange_GAMEPLAY CAMERA FOCUS | trigger_onChange_GAMEPLAY CAMERA FOCUS | This gets/sets the focus for the camera zoom, which can be either manual, or auto. The setting affects both the Cockpit and the External (Chase) cameras.: Units enum: settable true |
| onRequest_GAMEPLAY CAMERA FOCUS | trigger_onRequest_GAMEPLAY CAMERA FOCUS | This gets/sets the focus for the camera zoom, which can be either manual, or auto. The setting affects both the Cockpit and the External (Chase) cameras.: Units enum: settable true |
| GEAR ANIMATION POSITION:index | trigger_GEAR ANIMATION POSITION:index | Percent indexed gear animation extended: Units percent: settable false |
| onChange_GEAR ANIMATION POSITION:index | trigger_onChange_GEAR ANIMATION POSITION:index | Percent indexed gear animation extended: Units percent: settable false |
| onRequest_GEAR ANIMATION POSITION:index | trigger_onRequest_GEAR ANIMATION POSITION:index | Percent indexed gear animation extended: Units percent: settable false |
| GEAR AUX POSITION | trigger_GEAR AUX POSITION | Percent auxiliary gear extended: Units percent Over 100: settable true |
| onChange_GEAR AUX POSITION | trigger_onChange_GEAR AUX POSITION | Percent auxiliary gear extended: Units percent Over 100: settable true |
| onRequest_GEAR AUX POSITION | trigger_onRequest_GEAR AUX POSITION | Percent auxiliary gear extended: Units percent Over 100: settable true |
| GEAR AUX STEER ANGLE | trigger_GEAR AUX STEER ANGLE | Aux wheel angle, negative to the left, positive to the right. The aux wheel is the fourth set of landing gear, sometimes used on helicopters: Units radians: settable false |
| onChange_GEAR AUX STEER ANGLE | trigger_onChange_GEAR AUX STEER ANGLE | Aux wheel angle, negative to the left, positive to the right. The aux wheel is the fourth set of landing gear, sometimes used on helicopters: Units radians: settable false |
| onRequest_GEAR AUX STEER ANGLE | trigger_onRequest_GEAR AUX STEER ANGLE | Aux wheel angle, negative to the left, positive to the right. The aux wheel is the fourth set of landing gear, sometimes used on helicopters: Units radians: settable false |
| GEAR AUX STEER ANGLE PCT | trigger_GEAR AUX STEER ANGLE PCT | Aux steer angle as a percentage: Units percent Over 100: settable false |
| onChange_GEAR AUX STEER ANGLE PCT | trigger_onChange_GEAR AUX STEER ANGLE PCT | Aux steer angle as a percentage: Units percent Over 100: settable false |
| onRequest_GEAR AUX STEER ANGLE PCT | trigger_onRequest_GEAR AUX STEER ANGLE PCT | Aux steer angle as a percentage: Units percent Over 100: settable false |
| GEAR CENTER POSITION | trigger_GEAR CENTER POSITION | Percent center gear extended: Units percent Over 100: settable true |
| onChange_GEAR CENTER POSITION | trigger_onChange_GEAR CENTER POSITION | Percent center gear extended: Units percent Over 100: settable true |
| onRequest_GEAR CENTER POSITION | trigger_onRequest_GEAR CENTER POSITION | Percent center gear extended: Units percent Over 100: settable true |
| GEAR CENTER STEER ANGLE | trigger_GEAR CENTER STEER ANGLE | Center wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onChange_GEAR CENTER STEER ANGLE | trigger_onChange_GEAR CENTER STEER ANGLE | Center wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onRequest_GEAR CENTER STEER ANGLE | trigger_onRequest_GEAR CENTER STEER ANGLE | Center wheel angle, negative to the left, positive to the right: Units radians: settable false |
| GEAR CENTER STEER ANGLE PCT | trigger_GEAR CENTER STEER ANGLE PCT | Center steer angle as a percentage: Units percent Over 100: settable false |
| onChange_GEAR CENTER STEER ANGLE PCT | trigger_onChange_GEAR CENTER STEER ANGLE PCT | Center steer angle as a percentage: Units percent Over 100: settable false |
| onRequest_GEAR CENTER STEER ANGLE PCT | trigger_onRequest_GEAR CENTER STEER ANGLE PCT | Center steer angle as a percentage: Units percent Over 100: settable false |
| GEAR DAMAGE BY SPEED | trigger_GEAR DAMAGE BY SPEED | True if gear has been damaged by excessive speed: Units bool: settable false |
| onChange_GEAR DAMAGE BY SPEED | trigger_onChange_GEAR DAMAGE BY SPEED | True if gear has been damaged by excessive speed: Units bool: settable false |
| onRequest_GEAR DAMAGE BY SPEED | trigger_onRequest_GEAR DAMAGE BY SPEED | True if gear has been damaged by excessive speed: Units bool: settable false |
| GEAR EMERGENCY HANDLE POSITION | trigger_GEAR EMERGENCY HANDLE POSITION | True if gear emergency handle applied: Units bool: settable false |
| onChange_GEAR EMERGENCY HANDLE POSITION | trigger_onChange_GEAR EMERGENCY HANDLE POSITION | True if gear emergency handle applied: Units bool: settable false |
| onRequest_GEAR EMERGENCY HANDLE POSITION | trigger_onRequest_GEAR EMERGENCY HANDLE POSITION | True if gear emergency handle applied: Units bool: settable false |
| GEAR HANDLE POSITION | trigger_GEAR HANDLE POSITION | The gear handle position, where 0 means the handle is retracted and 1 is the handle fully applied: Units percent Over 100: settable true |
| onChange_GEAR HANDLE POSITION | trigger_onChange_GEAR HANDLE POSITION | The gear handle position, where 0 means the handle is retracted and 1 is the handle fully applied: Units percent Over 100: settable true |
| onRequest_GEAR HANDLE POSITION | trigger_onRequest_GEAR HANDLE POSITION | The gear handle position, where 0 means the handle is retracted and 1 is the handle fully applied: Units percent Over 100: settable true |
| GEAR HYDRAULIC PRESSURE | trigger_GEAR HYDRAULIC PRESSURE | Gear hydraulic pressure: Units pounds: settable false |
| onChange_GEAR HYDRAULIC PRESSURE | trigger_onChange_GEAR HYDRAULIC PRESSURE | Gear hydraulic pressure: Units pounds: settable false |
| onRequest_GEAR HYDRAULIC PRESSURE | trigger_onRequest_GEAR HYDRAULIC PRESSURE | Gear hydraulic pressure: Units pounds: settable false |
| GEAR IS ON GROUND:index | trigger_GEAR IS ON GROUND:index | True if the gear is on the ground: Units bool: settable false |
| onChange_GEAR IS ON GROUND:index | trigger_onChange_GEAR IS ON GROUND:index | True if the gear is on the ground: Units bool: settable false |
| onRequest_GEAR IS ON GROUND:index | trigger_onRequest_GEAR IS ON GROUND:index | True if the gear is on the ground: Units bool: settable false |
| GEAR IS SKIDDING:index | trigger_GEAR IS SKIDDING:index | True if the gear is skidding: Units bool: settable false |
| onChange_GEAR IS SKIDDING:index | trigger_onChange_GEAR IS SKIDDING:index | True if the gear is skidding: Units bool: settable false |
| onRequest_GEAR IS SKIDDING:index | trigger_onRequest_GEAR IS SKIDDING:index | True if the gear is skidding: Units bool: settable false |
| GEAR LEFT POSITION | trigger_GEAR LEFT POSITION | Percent left gear extended: Units percent Over 100: settable true |
| onChange_GEAR LEFT POSITION | trigger_onChange_GEAR LEFT POSITION | Percent left gear extended: Units percent Over 100: settable true |
| onRequest_GEAR LEFT POSITION | trigger_onRequest_GEAR LEFT POSITION | Percent left gear extended: Units percent Over 100: settable true |
| GEAR LEFT STEER ANGLE | trigger_GEAR LEFT STEER ANGLE | Left wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onChange_GEAR LEFT STEER ANGLE | trigger_onChange_GEAR LEFT STEER ANGLE | Left wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onRequest_GEAR LEFT STEER ANGLE | trigger_onRequest_GEAR LEFT STEER ANGLE | Left wheel angle, negative to the left, positive to the right: Units radians: settable false |
| GEAR LEFT STEER ANGLE PCT | trigger_GEAR LEFT STEER ANGLE PCT | Left steer angle as a percentage: Units percent Over 100: settable false |
| onChange_GEAR LEFT STEER ANGLE PCT | trigger_onChange_GEAR LEFT STEER ANGLE PCT | Left steer angle as a percentage: Units percent Over 100: settable false |
| onRequest_GEAR LEFT STEER ANGLE PCT | trigger_onRequest_GEAR LEFT STEER ANGLE PCT | Left steer angle as a percentage: Units percent Over 100: settable false |
| GEAR POSITION:index | trigger_GEAR POSITION:index | Position of landing gear: Units enum: settable true |
| onChange_GEAR POSITION:index | trigger_onChange_GEAR POSITION:index | Position of landing gear: Units enum: settable true |
| onRequest_GEAR POSITION:index | trigger_onRequest_GEAR POSITION:index | Position of landing gear: Units enum: settable true |
| GEAR RIGHT POSITION | trigger_GEAR RIGHT POSITION | Percent right gear extended: Units percent Over 100: settable true |
| onChange_GEAR RIGHT POSITION | trigger_onChange_GEAR RIGHT POSITION | Percent right gear extended: Units percent Over 100: settable true |
| onRequest_GEAR RIGHT POSITION | trigger_onRequest_GEAR RIGHT POSITION | Percent right gear extended: Units percent Over 100: settable true |
| GEAR RIGHT STEER ANGLE | trigger_GEAR RIGHT STEER ANGLE | Right wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onChange_GEAR RIGHT STEER ANGLE | trigger_onChange_GEAR RIGHT STEER ANGLE | Right wheel angle, negative to the left, positive to the right: Units radians: settable false |
| onRequest_GEAR RIGHT STEER ANGLE | trigger_onRequest_GEAR RIGHT STEER ANGLE | Right wheel angle, negative to the left, positive to the right: Units radians: settable false |
| GEAR RIGHT STEER ANGLE PCT | trigger_GEAR RIGHT STEER ANGLE PCT | Right steer angle as a percentage: Units percent Over 100: settable false |
| onChange_GEAR RIGHT STEER ANGLE PCT | trigger_onChange_GEAR RIGHT STEER ANGLE PCT | Right steer angle as a percentage: Units percent Over 100: settable false |
| onRequest_GEAR RIGHT STEER ANGLE PCT | trigger_onRequest_GEAR RIGHT STEER ANGLE PCT | Right steer angle as a percentage: Units percent Over 100: settable false |
| GEAR SPEED EXCEEDED | trigger_GEAR SPEED EXCEEDED | True if safe speed limit for gear exceeded: Units bool: settable false |
| onChange_GEAR SPEED EXCEEDED | trigger_onChange_GEAR SPEED EXCEEDED | True if safe speed limit for gear exceeded: Units bool: settable false |
| onRequest_GEAR SPEED EXCEEDED | trigger_onRequest_GEAR SPEED EXCEEDED | True if safe speed limit for gear exceeded: Units bool: settable false |
| GEAR STEER ANGLE PCT:index | trigger_GEAR STEER ANGLE PCT:index | Alternative method of getting steer angle as a percentage: Units percent Over 100: settable false |
| onChange_GEAR STEER ANGLE PCT:index | trigger_onChange_GEAR STEER ANGLE PCT:index | Alternative method of getting steer angle as a percentage: Units percent Over 100: settable false |
| onRequest_GEAR STEER ANGLE PCT:index | trigger_onRequest_GEAR STEER ANGLE PCT:index | Alternative method of getting steer angle as a percentage: Units percent Over 100: settable false |
| GEAR STEER ANGLE:index | trigger_GEAR STEER ANGLE:index | Alternative method of getting the steer angle: Units radians: settable false |
| onChange_GEAR STEER ANGLE:index | trigger_onChange_GEAR STEER ANGLE:index | Alternative method of getting the steer angle: Units radians: settable false |
| onRequest_GEAR STEER ANGLE:index | trigger_onRequest_GEAR STEER ANGLE:index | Alternative method of getting the steer angle: Units radians: settable false |
| GEAR TOTAL PCT EXTENDED | trigger_GEAR TOTAL PCT EXTENDED | Percent total gear extended: Units percent: settable false |
| onChange_GEAR TOTAL PCT EXTENDED | trigger_onChange_GEAR TOTAL PCT EXTENDED | Percent total gear extended: Units percent: settable false |
| onRequest_GEAR TOTAL PCT EXTENDED | trigger_onRequest_GEAR TOTAL PCT EXTENDED | Percent total gear extended: Units percent: settable false |
| GEAR WARNING:index | trigger_GEAR WARNING:index | Gear warnings: Units enum: settable false |
| onChange_GEAR WARNING:index | trigger_onChange_GEAR WARNING:index | Gear warnings: Units enum: settable false |
| onRequest_GEAR WARNING:index | trigger_onRequest_GEAR WARNING:index | Gear warnings: Units enum: settable false |
| GEAR WATER DEPTH | trigger_GEAR WATER DEPTH | The depth of the gear in the water: Units centimeters: settable false |
| onChange_GEAR WATER DEPTH | trigger_onChange_GEAR WATER DEPTH | The depth of the gear in the water: Units centimeters: settable false |
| onRequest_GEAR WATER DEPTH | trigger_onRequest_GEAR WATER DEPTH | The depth of the gear in the water: Units centimeters: settable false |
| GENERAL ENG ANTI ICE POSITION:index | trigger_GENERAL ENG ANTI ICE POSITION:index | The indexed engine anti-ice switch state: Units bool: settable false |
| onChange_GENERAL ENG ANTI ICE POSITION:index | trigger_onChange_GENERAL ENG ANTI ICE POSITION:index | The indexed engine anti-ice switch state: Units bool: settable false |
| onRequest_GENERAL ENG ANTI ICE POSITION:index | trigger_onRequest_GENERAL ENG ANTI ICE POSITION:index | The indexed engine anti-ice switch state: Units bool: settable false |
| GENERAL ENG COMBUSTION EX1:index | trigger_GENERAL ENG COMBUSTION EX1:index | This SimVar is similar to GENERAL ENG COMBUSTION, in that it can also be used to enable or disable engine combustion. However this SimVar will not interfere with the current state of ths simulation. For example, if the aircraft has a turbine engine with auto_ignition enabled or it's a propeller engine with magnetos, then in the subsequent simulation frames this SimVar may be set to 1 (TRUE) again as the engine restarts automatically: Units bool: settable true |
| onChange_GENERAL ENG COMBUSTION EX1:index | trigger_onChange_GENERAL ENG COMBUSTION EX1:index | This SimVar is similar to GENERAL ENG COMBUSTION, in that it can also be used to enable or disable engine combustion. However this SimVar will not interfere with the current state of ths simulation. For example, if the aircraft has a turbine engine with auto_ignition enabled or it's a propeller engine with magnetos, then in the subsequent simulation frames this SimVar may be set to 1 (TRUE) again as the engine restarts automatically: Units bool: settable true |
| onRequest_GENERAL ENG COMBUSTION EX1:index | trigger_onRequest_GENERAL ENG COMBUSTION EX1:index | This SimVar is similar to GENERAL ENG COMBUSTION, in that it can also be used to enable or disable engine combustion. However this SimVar will not interfere with the current state of ths simulation. For example, if the aircraft has a turbine engine with auto_ignition enabled or it's a propeller engine with magnetos, then in the subsequent simulation frames this SimVar may be set to 1 (TRUE) again as the engine restarts automatically: Units bool: settable true |
| GENERAL ENG COMBUSTION SOUND PERCENT:index | trigger_GENERAL ENG COMBUSTION SOUND PERCENT:index | Percent of maximum sound being created by the indexed engine: Units percent: settable false |
| onChange_GENERAL ENG COMBUSTION SOUND PERCENT:index | trigger_onChange_GENERAL ENG COMBUSTION SOUND PERCENT:index | Percent of maximum sound being created by the indexed engine: Units percent: settable false |
| onRequest_GENERAL ENG COMBUSTION SOUND PERCENT:index | trigger_onRequest_GENERAL ENG COMBUSTION SOUND PERCENT:index | Percent of maximum sound being created by the indexed engine: Units percent: settable false |
| GENERAL ENG COMBUSTION:index | trigger_GENERAL ENG COMBUSTION:index | Set the indexed engine combustion flag to TRUE or FALSE. Note that this will not only stop all combustion, but it will also set the engine RPM to 0, regardless of the actual state of the simulation: Units bool: settable true |
| onChange_GENERAL ENG COMBUSTION:index | trigger_onChange_GENERAL ENG COMBUSTION:index | Set the indexed engine combustion flag to TRUE or FALSE. Note that this will not only stop all combustion, but it will also set the engine RPM to 0, regardless of the actual state of the simulation: Units bool: settable true |
| onRequest_GENERAL ENG COMBUSTION:index | trigger_onRequest_GENERAL ENG COMBUSTION:index | Set the indexed engine combustion flag to TRUE or FALSE. Note that this will not only stop all combustion, but it will also set the engine RPM to 0, regardless of the actual state of the simulation: Units bool: settable true |
| GENERAL ENG DAMAGE PERCENT:index | trigger_GENERAL ENG DAMAGE PERCENT:index | Percent of total damage to the indexed engine: Units percent: settable false |
| onChange_GENERAL ENG DAMAGE PERCENT:index | trigger_onChange_GENERAL ENG DAMAGE PERCENT:index | Percent of total damage to the indexed engine: Units percent: settable false |
| onRequest_GENERAL ENG DAMAGE PERCENT:index | trigger_onRequest_GENERAL ENG DAMAGE PERCENT:index | Percent of total damage to the indexed engine: Units percent: settable false |
| GENERAL ENG ELAPSED TIME:index | trigger_GENERAL ENG ELAPSED TIME:index | Total elapsed time since the indexed engine was started: Units hours: settable false |
| onChange_GENERAL ENG ELAPSED TIME:index | trigger_onChange_GENERAL ENG ELAPSED TIME:index | Total elapsed time since the indexed engine was started: Units hours: settable false |
| onRequest_GENERAL ENG ELAPSED TIME:index | trigger_onRequest_GENERAL ENG ELAPSED TIME:index | Total elapsed time since the indexed engine was started: Units hours: settable false |
| GENERAL ENG EXHAUST GAS TEMPERATURE:index | trigger_GENERAL ENG EXHAUST GAS TEMPERATURE:index | The indexed engine exhaust gas temperature: Units rankine: settable true |
| onChange_GENERAL ENG EXHAUST GAS TEMPERATURE:index | trigger_onChange_GENERAL ENG EXHAUST GAS TEMPERATURE:index | The indexed engine exhaust gas temperature: Units rankine: settable true |
| onRequest_GENERAL ENG EXHAUST GAS TEMPERATURE:index | trigger_onRequest_GENERAL ENG EXHAUST GAS TEMPERATURE:index | The indexed engine exhaust gas temperature: Units rankine: settable true |
| GENERAL ENG FAILED:index | trigger_GENERAL ENG FAILED:index | The indexed engine fail flag: Units bool: settable false |
| onChange_GENERAL ENG FAILED:index | trigger_onChange_GENERAL ENG FAILED:index | The indexed engine fail flag: Units bool: settable false |
| onRequest_GENERAL ENG FAILED:index | trigger_onRequest_GENERAL ENG FAILED:index | The indexed engine fail flag: Units bool: settable false |
| GENERAL ENG FIRE DETECTED:index | trigger_GENERAL ENG FIRE DETECTED:index | Detects if a fire has been detected in an indexed engine or not. If 0 (FALSE) no fire has been detected and if 1 (TRUE) then it has: Units bool: settable false |
| onChange_GENERAL ENG FIRE DETECTED:index | trigger_onChange_GENERAL ENG FIRE DETECTED:index | Detects if a fire has been detected in an indexed engine or not. If 0 (FALSE) no fire has been detected and if 1 (TRUE) then it has: Units bool: settable false |
| onRequest_GENERAL ENG FIRE DETECTED:index | trigger_onRequest_GENERAL ENG FIRE DETECTED:index | Detects if a fire has been detected in an indexed engine or not. If 0 (FALSE) no fire has been detected and if 1 (TRUE) then it has: Units bool: settable false |
| GENERAL ENG FUEL PRESSURE:index | trigger_GENERAL ENG FUEL PRESSURE:index | The indexed engine fuel pressure: Units pounds: settable true |
| onChange_GENERAL ENG FUEL PRESSURE:index | trigger_onChange_GENERAL ENG FUEL PRESSURE:index | The indexed engine fuel pressure: Units pounds: settable true |
| onRequest_GENERAL ENG FUEL PRESSURE:index | trigger_onRequest_GENERAL ENG FUEL PRESSURE:index | The indexed engine fuel pressure: Units pounds: settable true |
| GENERAL ENG FUEL PUMP ON:index | trigger_GENERAL ENG FUEL PUMP ON:index | Whether the indexed engine fuel pump on (1, TRUE) or off (0, FALSE): Units bool: settable false |
| onChange_GENERAL ENG FUEL PUMP ON:index | trigger_onChange_GENERAL ENG FUEL PUMP ON:index | Whether the indexed engine fuel pump on (1, TRUE) or off (0, FALSE): Units bool: settable false |
| onRequest_GENERAL ENG FUEL PUMP ON:index | trigger_onRequest_GENERAL ENG FUEL PUMP ON:index | Whether the indexed engine fuel pump on (1, TRUE) or off (0, FALSE): Units bool: settable false |
| GENERAL ENG FUEL PUMP SWITCH EX1:index | trigger_GENERAL ENG FUEL PUMP SWITCH EX1:index | Equivalent to GENERAL ENG FUEL PUMP SWITCH but differentiates between ON and AUTO: Units bool: settable false |
| onChange_GENERAL ENG FUEL PUMP SWITCH EX1:index | trigger_onChange_GENERAL ENG FUEL PUMP SWITCH EX1:index | Equivalent to GENERAL ENG FUEL PUMP SWITCH but differentiates between ON and AUTO: Units bool: settable false |
| onRequest_GENERAL ENG FUEL PUMP SWITCH EX1:index | trigger_onRequest_GENERAL ENG FUEL PUMP SWITCH EX1:index | Equivalent to GENERAL ENG FUEL PUMP SWITCH but differentiates between ON and AUTO: Units bool: settable false |
| GENERAL ENG FUEL PUMP SWITCH:index | trigger_GENERAL ENG FUEL PUMP SWITCH:index | Fuel pump switch state the indexed engine. If 0 (FALSE) the pump is off and if 1 (TRUE) then it is on: Units bool: settable false |
| onChange_GENERAL ENG FUEL PUMP SWITCH:index | trigger_onChange_GENERAL ENG FUEL PUMP SWITCH:index | Fuel pump switch state the indexed engine. If 0 (FALSE) the pump is off and if 1 (TRUE) then it is on: Units bool: settable false |
| onRequest_GENERAL ENG FUEL PUMP SWITCH:index | trigger_onRequest_GENERAL ENG FUEL PUMP SWITCH:index | Fuel pump switch state the indexed engine. If 0 (FALSE) the pump is off and if 1 (TRUE) then it is on: Units bool: settable false |
| GENERAL ENG FUEL USED SINCE START:index | trigger_GENERAL ENG FUEL USED SINCE START:index | Fuel used since the indexed engine was last started: Units pounds: settable false |
| onChange_GENERAL ENG FUEL USED SINCE START:index | trigger_onChange_GENERAL ENG FUEL USED SINCE START:index | Fuel used since the indexed engine was last started: Units pounds: settable false |
| onRequest_GENERAL ENG FUEL USED SINCE START:index | trigger_onRequest_GENERAL ENG FUEL USED SINCE START:index | Fuel used since the indexed engine was last started: Units pounds: settable false |
| GENERAL ENG FUEL VALVE:index | trigger_GENERAL ENG FUEL VALVE:index | Fuel valve state for the indexed engine. If 0 (FALSE) then the valve is closed and if 1 (TRUE) then it is open: Units bool: settable false |
| onChange_GENERAL ENG FUEL VALVE:index | trigger_onChange_GENERAL ENG FUEL VALVE:index | Fuel valve state for the indexed engine. If 0 (FALSE) then the valve is closed and if 1 (TRUE) then it is open: Units bool: settable false |
| onRequest_GENERAL ENG FUEL VALVE:index | trigger_onRequest_GENERAL ENG FUEL VALVE:index | Fuel valve state for the indexed engine. If 0 (FALSE) then the valve is closed and if 1 (TRUE) then it is open: Units bool: settable false |
| GENERAL ENG GENERATOR ACTIVE:index | trigger_GENERAL ENG GENERATOR ACTIVE:index | Settable alternator (generator) on/off switch for the indexed engine: Units bool: settable true |
| onChange_GENERAL ENG GENERATOR ACTIVE:index | trigger_onChange_GENERAL ENG GENERATOR ACTIVE:index | Settable alternator (generator) on/off switch for the indexed engine: Units bool: settable true |
| onRequest_GENERAL ENG GENERATOR ACTIVE:index | trigger_onRequest_GENERAL ENG GENERATOR ACTIVE:index | Settable alternator (generator) on/off switch for the indexed engine: Units bool: settable true |
| GENERAL ENG GENERATOR SWITCH:index | trigger_GENERAL ENG GENERATOR SWITCH:index | Alternator (generator) on/off switch state for the indexed engine: Units bool: settable false |
| onChange_GENERAL ENG GENERATOR SWITCH:index | trigger_onChange_GENERAL ENG GENERATOR SWITCH:index | Alternator (generator) on/off switch state for the indexed engine: Units bool: settable false |
| onRequest_GENERAL ENG GENERATOR SWITCH:index | trigger_onRequest_GENERAL ENG GENERATOR SWITCH:index | Alternator (generator) on/off switch state for the indexed engine: Units bool: settable false |
| GENERAL ENG HOBBS ELAPSED TIME:index | trigger_GENERAL ENG HOBBS ELAPSED TIME:index | This can be used to find the time since the indexed engine started running: Units seconds: settable false |
| onChange_GENERAL ENG HOBBS ELAPSED TIME:index | trigger_onChange_GENERAL ENG HOBBS ELAPSED TIME:index | This can be used to find the time since the indexed engine started running: Units seconds: settable false |
| onRequest_GENERAL ENG HOBBS ELAPSED TIME:index | trigger_onRequest_GENERAL ENG HOBBS ELAPSED TIME:index | This can be used to find the time since the indexed engine started running: Units seconds: settable false |
| GENERAL ENG MASTER ALTERNATOR | trigger_GENERAL ENG MASTER ALTERNATOR | The alternator switch for a specific engine. Requires an engine index (1:4) when used: Units bool: settable false |
| onChange_GENERAL ENG MASTER ALTERNATOR | trigger_onChange_GENERAL ENG MASTER ALTERNATOR | The alternator switch for a specific engine. Requires an engine index (1:4) when used: Units bool: settable false |
| onRequest_GENERAL ENG MASTER ALTERNATOR | trigger_onRequest_GENERAL ENG MASTER ALTERNATOR | The alternator switch for a specific engine. Requires an engine index (1:4) when used: Units bool: settable false |
| GENERAL ENG MASTER ALTERNATOR:index | trigger_GENERAL ENG MASTER ALTERNATOR:index | The alternator (generator) switch position, true if the switch is ON. Requires an engine index, and the use of an alternator index when referencing: Units bool: settable false |
| onChange_GENERAL ENG MASTER ALTERNATOR:index | trigger_onChange_GENERAL ENG MASTER ALTERNATOR:index | The alternator (generator) switch position, true if the switch is ON. Requires an engine index, and the use of an alternator index when referencing: Units bool: settable false |
| onRequest_GENERAL ENG MASTER ALTERNATOR:index | trigger_onRequest_GENERAL ENG MASTER ALTERNATOR:index | The alternator (generator) switch position, true if the switch is ON. Requires an engine index, and the use of an alternator index when referencing: Units bool: settable false |
| GENERAL ENG MAX REACHED RPM:index | trigger_GENERAL ENG MAX REACHED RPM:index | Maximum attained rpm for the indexed engine: Units RPM: settable false |
| onChange_GENERAL ENG MAX REACHED RPM:index | trigger_onChange_GENERAL ENG MAX REACHED RPM:index | Maximum attained rpm for the indexed engine: Units RPM: settable false |
| onRequest_GENERAL ENG MAX REACHED RPM:index | trigger_onRequest_GENERAL ENG MAX REACHED RPM:index | Maximum attained rpm for the indexed engine: Units RPM: settable false |
| GENERAL ENG MIXTURE LEVER POSITION:index | trigger_GENERAL ENG MIXTURE LEVER POSITION:index | Percent of max mixture lever position for the indexed engine: Units percent: settable true |
| onChange_GENERAL ENG MIXTURE LEVER POSITION:index | trigger_onChange_GENERAL ENG MIXTURE LEVER POSITION:index | Percent of max mixture lever position for the indexed engine: Units percent: settable true |
| onRequest_GENERAL ENG MIXTURE LEVER POSITION:index | trigger_onRequest_GENERAL ENG MIXTURE LEVER POSITION:index | Percent of max mixture lever position for the indexed engine: Units percent: settable true |
| GENERAL ENG OIL LEAKED PERCENT:index | trigger_GENERAL ENG OIL LEAKED PERCENT:index | Percent of max oil capacity leaked for the indexed engine: Units percent: settable false |
| onChange_GENERAL ENG OIL LEAKED PERCENT:index | trigger_onChange_GENERAL ENG OIL LEAKED PERCENT:index | Percent of max oil capacity leaked for the indexed engine: Units percent: settable false |
| onRequest_GENERAL ENG OIL LEAKED PERCENT:index | trigger_onRequest_GENERAL ENG OIL LEAKED PERCENT:index | Percent of max oil capacity leaked for the indexed engine: Units percent: settable false |
| GENERAL ENG OIL PRESSURE:index | trigger_GENERAL ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable true |
| onChange_GENERAL ENG OIL PRESSURE:index | trigger_onChange_GENERAL ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable true |
| onRequest_GENERAL ENG OIL PRESSURE:index | trigger_onRequest_GENERAL ENG OIL PRESSURE:index | The indexed engine oil pressure: Units pounds: settable true |
| GENERAL ENG OIL TEMPERATURE:index | trigger_GENERAL ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable true |
| onChange_GENERAL ENG OIL TEMPERATURE:index | trigger_onChange_GENERAL ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable true |
| onRequest_GENERAL ENG OIL TEMPERATURE:index | trigger_onRequest_GENERAL ENG OIL TEMPERATURE:index | The indexed engine oil temperature: Units rankine: settable true |
| GENERAL ENG PCT MAX RPM:index | trigger_GENERAL ENG PCT MAX RPM:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| onChange_GENERAL ENG PCT MAX RPM:index | trigger_onChange_GENERAL ENG PCT MAX RPM:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| onRequest_GENERAL ENG PCT MAX RPM:index | trigger_onRequest_GENERAL ENG PCT MAX RPM:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| GENERAL ENG PROPELLER LEVER POSITION:index | trigger_GENERAL ENG PROPELLER LEVER POSITION:index | Percent of max prop lever position for the indexed engine: Units percent: settable true |
| onChange_GENERAL ENG PROPELLER LEVER POSITION:index | trigger_onChange_GENERAL ENG PROPELLER LEVER POSITION:index | Percent of max prop lever position for the indexed engine: Units percent: settable true |
| onRequest_GENERAL ENG PROPELLER LEVER POSITION:index | trigger_onRequest_GENERAL ENG PROPELLER LEVER POSITION:index | Percent of max prop lever position for the indexed engine: Units percent: settable true |
| GENERAL ENG REVERSE THRUST ENGAGED | trigger_GENERAL ENG REVERSE THRUST ENGAGED | This will return 1 (TRUE) if the reverse thruster is engaged, or 0 (FALSE) otherwise: Units bool: settable false |
| onChange_GENERAL ENG REVERSE THRUST ENGAGED | trigger_onChange_GENERAL ENG REVERSE THRUST ENGAGED | This will return 1 (TRUE) if the reverse thruster is engaged, or 0 (FALSE) otherwise: Units bool: settable false |
| onRequest_GENERAL ENG REVERSE THRUST ENGAGED | trigger_onRequest_GENERAL ENG REVERSE THRUST ENGAGED | This will return 1 (TRUE) if the reverse thruster is engaged, or 0 (FALSE) otherwise: Units bool: settable false |
| GENERAL ENG RPM:index | trigger_GENERAL ENG RPM:index | The RPM for an indexed engine: Units RPM: settable true |
| onChange_GENERAL ENG RPM:index | trigger_onChange_GENERAL ENG RPM:index | The RPM for an indexed engine: Units RPM: settable true |
| onRequest_GENERAL ENG RPM:index | trigger_onRequest_GENERAL ENG RPM:index | The RPM for an indexed engine: Units RPM: settable true |
| GENERAL ENG STARTER ACTIVE:index | trigger_GENERAL ENG STARTER ACTIVE:index | True if the indexed engine starter is active: Units bool: settable false |
| onChange_GENERAL ENG STARTER ACTIVE:index | trigger_onChange_GENERAL ENG STARTER ACTIVE:index | True if the indexed engine starter is active: Units bool: settable false |
| onRequest_GENERAL ENG STARTER ACTIVE:index | trigger_onRequest_GENERAL ENG STARTER ACTIVE:index | True if the indexed engine starter is active: Units bool: settable false |
| GENERAL ENG STARTER:index | trigger_GENERAL ENG STARTER:index | The indexed engine starter on/off state: Units bool: settable false |
| onChange_GENERAL ENG STARTER:index | trigger_onChange_GENERAL ENG STARTER:index | The indexed engine starter on/off state: Units bool: settable false |
| onRequest_GENERAL ENG STARTER:index | trigger_onRequest_GENERAL ENG STARTER:index | The indexed engine starter on/off state: Units bool: settable false |
| GENERAL ENG THROTTLE LEVER POSITION:index | trigger_GENERAL ENG THROTTLE LEVER POSITION:index | Percent of max throttle position for the indexed engine: Units percent: settable true |
| onChange_GENERAL ENG THROTTLE LEVER POSITION:index | trigger_onChange_GENERAL ENG THROTTLE LEVER POSITION:index | Percent of max throttle position for the indexed engine: Units percent: settable true |
| onRequest_GENERAL ENG THROTTLE LEVER POSITION:index | trigger_onRequest_GENERAL ENG THROTTLE LEVER POSITION:index | Percent of max throttle position for the indexed engine: Units percent: settable true |
| GENERAL ENG THROTTLE MANAGED MODE:index | trigger_GENERAL ENG THROTTLE MANAGED MODE:index | Current mode of the managed throttle for the indexed engine: Units number: settable false |
| onChange_GENERAL ENG THROTTLE MANAGED MODE:index | trigger_onChange_GENERAL ENG THROTTLE MANAGED MODE:index | Current mode of the managed throttle for the indexed engine: Units number: settable false |
| onRequest_GENERAL ENG THROTTLE MANAGED MODE:index | trigger_onRequest_GENERAL ENG THROTTLE MANAGED MODE:index | Current mode of the managed throttle for the indexed engine: Units number: settable false |
| GLASSCOCKPIT AUTOMATIC BRIGHTNESS | trigger_GLASSCOCKPIT AUTOMATIC BRIGHTNESS | This variable will return a value between 0 and 1 for the automatic brightness setting for glass cockpit displays, where 0 is the dimmest and 1 is the brightest. This value will vary depending on the time of day.: Units number: settable false |
| onChange_GLASSCOCKPIT AUTOMATIC BRIGHTNESS | trigger_onChange_GLASSCOCKPIT AUTOMATIC BRIGHTNESS | This variable will return a value between 0 and 1 for the automatic brightness setting for glass cockpit displays, where 0 is the dimmest and 1 is the brightest. This value will vary depending on the time of day.: Units number: settable false |
| onRequest_GLASSCOCKPIT AUTOMATIC BRIGHTNESS | trigger_onRequest_GLASSCOCKPIT AUTOMATIC BRIGHTNESS | This variable will return a value between 0 and 1 for the automatic brightness setting for glass cockpit displays, where 0 is the dimmest and 1 is the brightest. This value will vary depending on the time of day.: Units number: settable false |
| GPS APPROACH AIRPORT ID | trigger_GPS APPROACH AIRPORT ID | ID of airport.: Units null: settable false |
| onChange_GPS APPROACH AIRPORT ID | trigger_onChange_GPS APPROACH AIRPORT ID | ID of airport.: Units null: settable false |
| onRequest_GPS APPROACH AIRPORT ID | trigger_onRequest_GPS APPROACH AIRPORT ID | ID of airport.: Units null: settable false |
| GPS APPROACH APPROACH ID | trigger_GPS APPROACH APPROACH ID | ID of approach.: Units null: settable false |
| onChange_GPS APPROACH APPROACH ID | trigger_onChange_GPS APPROACH APPROACH ID | ID of approach.: Units null: settable false |
| onRequest_GPS APPROACH APPROACH ID | trigger_onRequest_GPS APPROACH APPROACH ID | ID of approach.: Units null: settable false |
| GPS APPROACH APPROACH INDEX | trigger_GPS APPROACH APPROACH INDEX | Index of approach for given airport.: Units number: settable true |
| onChange_GPS APPROACH APPROACH INDEX | trigger_onChange_GPS APPROACH APPROACH INDEX | Index of approach for given airport.: Units number: settable true |
| onRequest_GPS APPROACH APPROACH INDEX | trigger_onRequest_GPS APPROACH APPROACH INDEX | Index of approach for given airport.: Units number: settable true |
| GPS APPROACH APPROACH TYPE | trigger_GPS APPROACH APPROACH TYPE | Approach type.: Units enum: settable true |
| onChange_GPS APPROACH APPROACH TYPE | trigger_onChange_GPS APPROACH APPROACH TYPE | Approach type.: Units enum: settable true |
| onRequest_GPS APPROACH APPROACH TYPE | trigger_onRequest_GPS APPROACH APPROACH TYPE | Approach type.: Units enum: settable true |
| GPS APPROACH IS FINAL | trigger_GPS APPROACH IS FINAL | Is approach transition final approach segment.: Units bool: settable true |
| onChange_GPS APPROACH IS FINAL | trigger_onChange_GPS APPROACH IS FINAL | Is approach transition final approach segment.: Units bool: settable true |
| onRequest_GPS APPROACH IS FINAL | trigger_onRequest_GPS APPROACH IS FINAL | Is approach transition final approach segment.: Units bool: settable true |
| GPS APPROACH IS MISSED | trigger_GPS APPROACH IS MISSED | Is approach segment missed approach segment.: Units bool: settable true |
| onChange_GPS APPROACH IS MISSED | trigger_onChange_GPS APPROACH IS MISSED | Is approach segment missed approach segment.: Units bool: settable true |
| onRequest_GPS APPROACH IS MISSED | trigger_onRequest_GPS APPROACH IS MISSED | Is approach segment missed approach segment.: Units bool: settable true |
| GPS APPROACH IS WP RUNWAY | trigger_GPS APPROACH IS WP RUNWAY | Waypoint is the runway.: Units bool: settable true |
| onChange_GPS APPROACH IS WP RUNWAY | trigger_onChange_GPS APPROACH IS WP RUNWAY | Waypoint is the runway.: Units bool: settable true |
| onRequest_GPS APPROACH IS WP RUNWAY | trigger_onRequest_GPS APPROACH IS WP RUNWAY | Waypoint is the runway.: Units bool: settable true |
| GPS APPROACH MODE | trigger_GPS APPROACH MODE | Sub mode within approach mode.: Units enum: settable true |
| onChange_GPS APPROACH MODE | trigger_onChange_GPS APPROACH MODE | Sub mode within approach mode.: Units enum: settable true |
| onRequest_GPS APPROACH MODE | trigger_onRequest_GPS APPROACH MODE | Sub mode within approach mode.: Units enum: settable true |
| GPS APPROACH SEGMENT TYPE | trigger_GPS APPROACH SEGMENT TYPE | Segment type within approach.: Units enum: settable true |
| onChange_GPS APPROACH SEGMENT TYPE | trigger_onChange_GPS APPROACH SEGMENT TYPE | Segment type within approach.: Units enum: settable true |
| onRequest_GPS APPROACH SEGMENT TYPE | trigger_onRequest_GPS APPROACH SEGMENT TYPE | Segment type within approach.: Units enum: settable true |
| GPS APPROACH TIMEZONE DEVIATION | trigger_GPS APPROACH TIMEZONE DEVIATION | Deviation of local time from GMT.: Units seconds: settable false |
| onChange_GPS APPROACH TIMEZONE DEVIATION | trigger_onChange_GPS APPROACH TIMEZONE DEVIATION | Deviation of local time from GMT.: Units seconds: settable false |
| onRequest_GPS APPROACH TIMEZONE DEVIATION | trigger_onRequest_GPS APPROACH TIMEZONE DEVIATION | Deviation of local time from GMT.: Units seconds: settable false |
| GPS APPROACH TRANSITION ID | trigger_GPS APPROACH TRANSITION ID | ID of approach transition.: Units null: settable true |
| onChange_GPS APPROACH TRANSITION ID | trigger_onChange_GPS APPROACH TRANSITION ID | ID of approach transition.: Units null: settable true |
| onRequest_GPS APPROACH TRANSITION ID | trigger_onRequest_GPS APPROACH TRANSITION ID | ID of approach transition.: Units null: settable true |
| GPS APPROACH TRANSITION INDEX | trigger_GPS APPROACH TRANSITION INDEX | Index of approach transition.: Units number: settable true |
| onChange_GPS APPROACH TRANSITION INDEX | trigger_onChange_GPS APPROACH TRANSITION INDEX | Index of approach transition.: Units number: settable true |
| onRequest_GPS APPROACH TRANSITION INDEX | trigger_onRequest_GPS APPROACH TRANSITION INDEX | Index of approach transition.: Units number: settable true |
| GPS APPROACH WP COUNT | trigger_GPS APPROACH WP COUNT | Number of waypoints.: Units number: settable true |
| onChange_GPS APPROACH WP COUNT | trigger_onChange_GPS APPROACH WP COUNT | Number of waypoints.: Units number: settable true |
| onRequest_GPS APPROACH WP COUNT | trigger_onRequest_GPS APPROACH WP COUNT | Number of waypoints.: Units number: settable true |
| GPS APPROACH WP INDEX | trigger_GPS APPROACH WP INDEX | Index of current waypoint.: Units number: settable true |
| onChange_GPS APPROACH WP INDEX | trigger_onChange_GPS APPROACH WP INDEX | Index of current waypoint.: Units number: settable true |
| onRequest_GPS APPROACH WP INDEX | trigger_onRequest_GPS APPROACH WP INDEX | Index of current waypoint.: Units number: settable true |
| GPS APPROACH WP TYPE | trigger_GPS APPROACH WP TYPE | Waypoint type within approach mode.: Units enum: settable true |
| onChange_GPS APPROACH WP TYPE | trigger_onChange_GPS APPROACH WP TYPE | Waypoint type within approach mode.: Units enum: settable true |
| onRequest_GPS APPROACH WP TYPE | trigger_onRequest_GPS APPROACH WP TYPE | Waypoint type within approach mode.: Units enum: settable true |
| GPS CDI NEEDLE | trigger_GPS CDI NEEDLE | The course deviation of the needle for a CDI instrument. The SimVar displays the deviation from -127 to +127. It returns a value if a flight plan is set (otherwise it will return 0) even if the autopilot isn't on GPS mode. Scaling can also be set through the GPS CDI SCALING simvar.: Units number: settable false |
| onChange_GPS CDI NEEDLE | trigger_onChange_GPS CDI NEEDLE | The course deviation of the needle for a CDI instrument. The SimVar displays the deviation from -127 to +127. It returns a value if a flight plan is set (otherwise it will return 0) even if the autopilot isn't on GPS mode. Scaling can also be set through the GPS CDI SCALING simvar.: Units number: settable false |
| onRequest_GPS CDI NEEDLE | trigger_onRequest_GPS CDI NEEDLE | The course deviation of the needle for a CDI instrument. The SimVar displays the deviation from -127 to +127. It returns a value if a flight plan is set (otherwise it will return 0) even if the autopilot isn't on GPS mode. Scaling can also be set through the GPS CDI SCALING simvar.: Units number: settable false |
| GPS CDI SCALING | trigger_GPS CDI SCALING | The full scale deflection of the CDI due to GPS cross-track error, in meters.: Units meters: settable true |
| onChange_GPS CDI SCALING | trigger_onChange_GPS CDI SCALING | The full scale deflection of the CDI due to GPS cross-track error, in meters.: Units meters: settable true |
| onRequest_GPS CDI SCALING | trigger_onRequest_GPS CDI SCALING | The full scale deflection of the CDI due to GPS cross-track error, in meters.: Units meters: settable true |
| GPS COURSE TO STEER | trigger_GPS COURSE TO STEER | Suggested heading to steer (for autopilot).: Units radians: settable true |
| onChange_GPS COURSE TO STEER | trigger_onChange_GPS COURSE TO STEER | Suggested heading to steer (for autopilot).: Units radians: settable true |
| onRequest_GPS COURSE TO STEER | trigger_onRequest_GPS COURSE TO STEER | Suggested heading to steer (for autopilot).: Units radians: settable true |
| GPS DRIVES NAV1 | trigger_GPS DRIVES NAV1 | GPS is driving Nav 1 indicator. Note this setting will also affect the SimVars HSI_STATION_IDENT and HSI_BEARING.: Units bool: settable false |
| onChange_GPS DRIVES NAV1 | trigger_onChange_GPS DRIVES NAV1 | GPS is driving Nav 1 indicator. Note this setting will also affect the SimVars HSI_STATION_IDENT and HSI_BEARING.: Units bool: settable false |
| onRequest_GPS DRIVES NAV1 | trigger_onRequest_GPS DRIVES NAV1 | GPS is driving Nav 1 indicator. Note this setting will also affect the SimVars HSI_STATION_IDENT and HSI_BEARING.: Units bool: settable false |
| GPS ETA | trigger_GPS ETA | Estimated time of arrival at destination.: Units seconds: settable false |
| onChange_GPS ETA | trigger_onChange_GPS ETA | Estimated time of arrival at destination.: Units seconds: settable false |
| onRequest_GPS ETA | trigger_onRequest_GPS ETA | Estimated time of arrival at destination.: Units seconds: settable false |
| GPS ETE | trigger_GPS ETE | Estimated time en route to destination.: Units seconds: settable false |
| onChange_GPS ETE | trigger_onChange_GPS ETE | Estimated time en route to destination.: Units seconds: settable false |
| onRequest_GPS ETE | trigger_onRequest_GPS ETE | Estimated time en route to destination.: Units seconds: settable false |
| GPS FLIGHT PLAN WP COUNT | trigger_GPS FLIGHT PLAN WP COUNT | Number of waypoints.: Units number: settable true |
| onChange_GPS FLIGHT PLAN WP COUNT | trigger_onChange_GPS FLIGHT PLAN WP COUNT | Number of waypoints.: Units number: settable true |
| onRequest_GPS FLIGHT PLAN WP COUNT | trigger_onRequest_GPS FLIGHT PLAN WP COUNT | Number of waypoints.: Units number: settable true |
| GPS FLIGHT PLAN WP INDEX | trigger_GPS FLIGHT PLAN WP INDEX | Index of waypoint.: Units number: settable true |
| onChange_GPS FLIGHT PLAN WP INDEX | trigger_onChange_GPS FLIGHT PLAN WP INDEX | Index of waypoint.: Units number: settable true |
| onRequest_GPS FLIGHT PLAN WP INDEX | trigger_onRequest_GPS FLIGHT PLAN WP INDEX | Index of waypoint.: Units number: settable true |
| GPS FLIGHTPLAN TOTAL DISTANCE | trigger_GPS FLIGHTPLAN TOTAL DISTANCE | This is the complete flightplan length from start to end. Essentially the cumulative length of all the flight plan legs added together.: Units meters: settable false |
| onChange_GPS FLIGHTPLAN TOTAL DISTANCE | trigger_onChange_GPS FLIGHTPLAN TOTAL DISTANCE | This is the complete flightplan length from start to end. Essentially the cumulative length of all the flight plan legs added together.: Units meters: settable false |
| onRequest_GPS FLIGHTPLAN TOTAL DISTANCE | trigger_onRequest_GPS FLIGHTPLAN TOTAL DISTANCE | This is the complete flightplan length from start to end. Essentially the cumulative length of all the flight plan legs added together.: Units meters: settable false |
| GPS GROUND MAGNETIC TRACK | trigger_GPS GROUND MAGNETIC TRACK | Current magnetic ground track.: Units radians: settable true |
| onChange_GPS GROUND MAGNETIC TRACK | trigger_onChange_GPS GROUND MAGNETIC TRACK | Current magnetic ground track.: Units radians: settable true |
| onRequest_GPS GROUND MAGNETIC TRACK | trigger_onRequest_GPS GROUND MAGNETIC TRACK | Current magnetic ground track.: Units radians: settable true |
| GPS GROUND SPEED | trigger_GPS GROUND SPEED | Current ground speed.: Units Meters per second: settable true |
| onChange_GPS GROUND SPEED | trigger_onChange_GPS GROUND SPEED | Current ground speed.: Units Meters per second: settable true |
| onRequest_GPS GROUND SPEED | trigger_onRequest_GPS GROUND SPEED | Current ground speed.: Units Meters per second: settable true |
| GPS GROUND TRUE HEADING | trigger_GPS GROUND TRUE HEADING | Current true heading.: Units radians: settable true |
| onChange_GPS GROUND TRUE HEADING | trigger_onChange_GPS GROUND TRUE HEADING | Current true heading.: Units radians: settable true |
| onRequest_GPS GROUND TRUE HEADING | trigger_onRequest_GPS GROUND TRUE HEADING | Current true heading.: Units radians: settable true |
| GPS GROUND TRUE TRACK | trigger_GPS GROUND TRUE TRACK | Current true ground track.: Units radians: settable true |
| onChange_GPS GROUND TRUE TRACK | trigger_onChange_GPS GROUND TRUE TRACK | Current true ground track.: Units radians: settable true |
| onRequest_GPS GROUND TRUE TRACK | trigger_onRequest_GPS GROUND TRUE TRACK | Current true ground track.: Units radians: settable true |
| GPS GSI SCALING | trigger_GPS GSI SCALING | The full scale deflection of the vertical GSI due to GPS glidepath deviation, in meters.: Units meters: settable true |
| onChange_GPS GSI SCALING | trigger_onChange_GPS GSI SCALING | The full scale deflection of the vertical GSI due to GPS glidepath deviation, in meters.: Units meters: settable true |
| onRequest_GPS GSI SCALING | trigger_onRequest_GPS GSI SCALING | The full scale deflection of the vertical GSI due to GPS glidepath deviation, in meters.: Units meters: settable true |
| GPS HAS GLIDEPATH | trigger_GPS HAS GLIDEPATH | Whether or not the GPS system has a presently available glidepath for guidance. Only applicable with GPS_OVERRIDDEN. When true and in GPS OVERRIDDEN, HSI_GSI_NEEDLE_VALID will also be true.: Units bool: settable true |
| onChange_GPS HAS GLIDEPATH | trigger_onChange_GPS HAS GLIDEPATH | Whether or not the GPS system has a presently available glidepath for guidance. Only applicable with GPS_OVERRIDDEN. When true and in GPS OVERRIDDEN, HSI_GSI_NEEDLE_VALID will also be true.: Units bool: settable true |
| onRequest_GPS HAS GLIDEPATH | trigger_onRequest_GPS HAS GLIDEPATH | Whether or not the GPS system has a presently available glidepath for guidance. Only applicable with GPS_OVERRIDDEN. When true and in GPS OVERRIDDEN, HSI_GSI_NEEDLE_VALID will also be true.: Units bool: settable true |
| GPS IS ACTIVE FLIGHT PLAN | trigger_GPS IS ACTIVE FLIGHT PLAN | Flight plan mode active.: Units bool: settable true |
| onChange_GPS IS ACTIVE FLIGHT PLAN | trigger_onChange_GPS IS ACTIVE FLIGHT PLAN | Flight plan mode active.: Units bool: settable true |
| onRequest_GPS IS ACTIVE FLIGHT PLAN | trigger_onRequest_GPS IS ACTIVE FLIGHT PLAN | Flight plan mode active.: Units bool: settable true |
| GPS IS ACTIVE WAY POINT | trigger_GPS IS ACTIVE WAY POINT | Waypoint mode active.: Units bool: settable true |
| onChange_GPS IS ACTIVE WAY POINT | trigger_onChange_GPS IS ACTIVE WAY POINT | Waypoint mode active.: Units bool: settable true |
| onRequest_GPS IS ACTIVE WAY POINT | trigger_onRequest_GPS IS ACTIVE WAY POINT | Waypoint mode active.: Units bool: settable true |
| GPS IS ACTIVE WP LOCKED | trigger_GPS IS ACTIVE WP LOCKED | Is switching to next waypoint locked.: Units bool: settable false |
| onChange_GPS IS ACTIVE WP LOCKED | trigger_onChange_GPS IS ACTIVE WP LOCKED | Is switching to next waypoint locked.: Units bool: settable false |
| onRequest_GPS IS ACTIVE WP LOCKED | trigger_onRequest_GPS IS ACTIVE WP LOCKED | Is switching to next waypoint locked.: Units bool: settable false |
| GPS IS APPROACH ACTIVE | trigger_GPS IS APPROACH ACTIVE | Is approach mode active.: Units bool: settable false |
| onChange_GPS IS APPROACH ACTIVE | trigger_onChange_GPS IS APPROACH ACTIVE | Is approach mode active.: Units bool: settable false |
| onRequest_GPS IS APPROACH ACTIVE | trigger_onRequest_GPS IS APPROACH ACTIVE | Is approach mode active.: Units bool: settable false |
| GPS IS APPROACH LOADED | trigger_GPS IS APPROACH LOADED | Is approach loaded.: Units bool: settable false |
| onChange_GPS IS APPROACH LOADED | trigger_onChange_GPS IS APPROACH LOADED | Is approach loaded.: Units bool: settable false |
| onRequest_GPS IS APPROACH LOADED | trigger_onRequest_GPS IS APPROACH LOADED | Is approach loaded.: Units bool: settable false |
| GPS IS ARRIVED | trigger_GPS IS ARRIVED | Is flight plan destination reached.: Units bool: settable true |
| onChange_GPS IS ARRIVED | trigger_onChange_GPS IS ARRIVED | Is flight plan destination reached.: Units bool: settable true |
| onRequest_GPS IS ARRIVED | trigger_onRequest_GPS IS ARRIVED | Is flight plan destination reached.: Units bool: settable true |
| GPS IS DIRECTTO FLIGHTPLAN | trigger_GPS IS DIRECTTO FLIGHTPLAN | Is Direct To Waypoint mode active.: Units bool: settable true |
| onChange_GPS IS DIRECTTO FLIGHTPLAN | trigger_onChange_GPS IS DIRECTTO FLIGHTPLAN | Is Direct To Waypoint mode active.: Units bool: settable true |
| onRequest_GPS IS DIRECTTO FLIGHTPLAN | trigger_onRequest_GPS IS DIRECTTO FLIGHTPLAN | Is Direct To Waypoint mode active.: Units bool: settable true |
| GPS MAGVAR | trigger_GPS MAGVAR | Current GPS magnetic variation.: Units radians: settable true |
| onChange_GPS MAGVAR | trigger_onChange_GPS MAGVAR | Current GPS magnetic variation.: Units radians: settable true |
| onRequest_GPS MAGVAR | trigger_onRequest_GPS MAGVAR | Current GPS magnetic variation.: Units radians: settable true |
| GPS OBS ACTIVE | trigger_GPS OBS ACTIVE | Whether or not the OBS mode is currently active (disable the automatic sequencing of waypoints in GPS flight plan).: Units bool: settable true |
| onChange_GPS OBS ACTIVE | trigger_onChange_GPS OBS ACTIVE | Whether or not the OBS mode is currently active (disable the automatic sequencing of waypoints in GPS flight plan).: Units bool: settable true |
| onRequest_GPS OBS ACTIVE | trigger_onRequest_GPS OBS ACTIVE | Whether or not the OBS mode is currently active (disable the automatic sequencing of waypoints in GPS flight plan).: Units bool: settable true |
| GPS OBS VALUE | trigger_GPS OBS VALUE | This is the currently selected OBS course in degrees, from 0 to 360.: Units degrees: settable true |
| onChange_GPS OBS VALUE | trigger_onChange_GPS OBS VALUE | This is the currently selected OBS course in degrees, from 0 to 360.: Units degrees: settable true |
| onRequest_GPS OBS VALUE | trigger_onRequest_GPS OBS VALUE | This is the currently selected OBS course in degrees, from 0 to 360.: Units degrees: settable true |
| GPS OVERRIDDEN | trigger_GPS OVERRIDDEN | When it is active, all sim GPS system updates are suspended. This must be set to TRUE to be able to correctly set to any other GPS SimVar.: Units bool: settable true |
| onChange_GPS OVERRIDDEN | trigger_onChange_GPS OVERRIDDEN | When it is active, all sim GPS system updates are suspended. This must be set to TRUE to be able to correctly set to any other GPS SimVar.: Units bool: settable true |
| onRequest_GPS OVERRIDDEN | trigger_onRequest_GPS OVERRIDDEN | When it is active, all sim GPS system updates are suspended. This must be set to TRUE to be able to correctly set to any other GPS SimVar.: Units bool: settable true |
| GPS POSITION ALT | trigger_GPS POSITION ALT | Current GPS altitude.: Units meters: settable true |
| onChange_GPS POSITION ALT | trigger_onChange_GPS POSITION ALT | Current GPS altitude.: Units meters: settable true |
| onRequest_GPS POSITION ALT | trigger_onRequest_GPS POSITION ALT | Current GPS altitude.: Units meters: settable true |
| GPS POSITION LAT | trigger_GPS POSITION LAT | Current GPS latitude.: Units degrees: settable true |
| onChange_GPS POSITION LAT | trigger_onChange_GPS POSITION LAT | Current GPS latitude.: Units degrees: settable true |
| onRequest_GPS POSITION LAT | trigger_onRequest_GPS POSITION LAT | Current GPS latitude.: Units degrees: settable true |
| GPS POSITION LON | trigger_GPS POSITION LON | Current GPS longitude.: Units degrees: settable true |
| onChange_GPS POSITION LON | trigger_onChange_GPS POSITION LON | Current GPS longitude.: Units degrees: settable true |
| onRequest_GPS POSITION LON | trigger_onRequest_GPS POSITION LON | Current GPS longitude.: Units degrees: settable true |
| GPS TARGET ALTITUDE | trigger_GPS TARGET ALTITUDE | Altitude of GPS target.: Units meters: settable true |
| onChange_GPS TARGET ALTITUDE | trigger_onChange_GPS TARGET ALTITUDE | Altitude of GPS target.: Units meters: settable true |
| onRequest_GPS TARGET ALTITUDE | trigger_onRequest_GPS TARGET ALTITUDE | Altitude of GPS target.: Units meters: settable true |
| GPS TARGET DISTANCE | trigger_GPS TARGET DISTANCE | Distance to target.: Units meters: settable true |
| onChange_GPS TARGET DISTANCE | trigger_onChange_GPS TARGET DISTANCE | Distance to target.: Units meters: settable true |
| onRequest_GPS TARGET DISTANCE | trigger_onRequest_GPS TARGET DISTANCE | Distance to target.: Units meters: settable true |
| GPS VERTICAL ANGLE | trigger_GPS VERTICAL ANGLE | Glidepath in degrees.: Units degrees: settable true |
| onChange_GPS VERTICAL ANGLE | trigger_onChange_GPS VERTICAL ANGLE | Glidepath in degrees.: Units degrees: settable true |
| onRequest_GPS VERTICAL ANGLE | trigger_onRequest_GPS VERTICAL ANGLE | Glidepath in degrees.: Units degrees: settable true |
| GPS VERTICAL ANGLE ERROR | trigger_GPS VERTICAL ANGLE ERROR | Vertical error in degrees from GlidePath.: Units degrees: settable true |
| onChange_GPS VERTICAL ANGLE ERROR | trigger_onChange_GPS VERTICAL ANGLE ERROR | Vertical error in degrees from GlidePath.: Units degrees: settable true |
| onRequest_GPS VERTICAL ANGLE ERROR | trigger_onRequest_GPS VERTICAL ANGLE ERROR | Vertical error in degrees from GlidePath.: Units degrees: settable true |
| GPS VERTICAL ERROR | trigger_GPS VERTICAL ERROR | Vertical deviation in meters from GlidePath.: Units meters: settable true |
| onChange_GPS VERTICAL ERROR | trigger_onChange_GPS VERTICAL ERROR | Vertical deviation in meters from GlidePath.: Units meters: settable true |
| onRequest_GPS VERTICAL ERROR | trigger_onRequest_GPS VERTICAL ERROR | Vertical deviation in meters from GlidePath.: Units meters: settable true |
| GPS WP BEARING | trigger_GPS WP BEARING | Magnetic bearing to waypoint.: Units radians: settable true |
| onChange_GPS WP BEARING | trigger_onChange_GPS WP BEARING | Magnetic bearing to waypoint.: Units radians: settable true |
| onRequest_GPS WP BEARING | trigger_onRequest_GPS WP BEARING | Magnetic bearing to waypoint.: Units radians: settable true |
| GPS WP CROSS TRK | trigger_GPS WP CROSS TRK | Cross track distance.: Units meters: settable true |
| onChange_GPS WP CROSS TRK | trigger_onChange_GPS WP CROSS TRK | Cross track distance.: Units meters: settable true |
| onRequest_GPS WP CROSS TRK | trigger_onRequest_GPS WP CROSS TRK | Cross track distance.: Units meters: settable true |
| GPS WP DESIRED TRACK | trigger_GPS WP DESIRED TRACK | The required heading (magnetic) from the previous waypoint to the next waypoint.: Units radians: settable true |
| onChange_GPS WP DESIRED TRACK | trigger_onChange_GPS WP DESIRED TRACK | The required heading (magnetic) from the previous waypoint to the next waypoint.: Units radians: settable true |
| onRequest_GPS WP DESIRED TRACK | trigger_onRequest_GPS WP DESIRED TRACK | The required heading (magnetic) from the previous waypoint to the next waypoint.: Units radians: settable true |
| GPS WP DISTANCE | trigger_GPS WP DISTANCE | Distance to waypoint.: Units meters: settable true |
| onChange_GPS WP DISTANCE | trigger_onChange_GPS WP DISTANCE | Distance to waypoint.: Units meters: settable true |
| onRequest_GPS WP DISTANCE | trigger_onRequest_GPS WP DISTANCE | Distance to waypoint.: Units meters: settable true |
| GPS WP ETA | trigger_GPS WP ETA | Estimated time of arrival at waypoint.: Units seconds: settable true |
| onChange_GPS WP ETA | trigger_onChange_GPS WP ETA | Estimated time of arrival at waypoint.: Units seconds: settable true |
| onRequest_GPS WP ETA | trigger_onRequest_GPS WP ETA | Estimated time of arrival at waypoint.: Units seconds: settable true |
| GPS WP ETE | trigger_GPS WP ETE | Estimated time en route to waypoint.: Units seconds: settable true |
| onChange_GPS WP ETE | trigger_onChange_GPS WP ETE | Estimated time en route to waypoint.: Units seconds: settable true |
| onRequest_GPS WP ETE | trigger_onRequest_GPS WP ETE | Estimated time en route to waypoint.: Units seconds: settable true |
| GPS WP NEXT ALT | trigger_GPS WP NEXT ALT | Altitude of next waypoint.: Units meters: settable true |
| onChange_GPS WP NEXT ALT | trigger_onChange_GPS WP NEXT ALT | Altitude of next waypoint.: Units meters: settable true |
| onRequest_GPS WP NEXT ALT | trigger_onRequest_GPS WP NEXT ALT | Altitude of next waypoint.: Units meters: settable true |
| GPS WP NEXT ID | trigger_GPS WP NEXT ID | ID of next GPS waypoint.: Units null: settable true |
| onChange_GPS WP NEXT ID | trigger_onChange_GPS WP NEXT ID | ID of next GPS waypoint.: Units null: settable true |
| onRequest_GPS WP NEXT ID | trigger_onRequest_GPS WP NEXT ID | ID of next GPS waypoint.: Units null: settable true |
| GPS WP NEXT LAT | trigger_GPS WP NEXT LAT | Latitude of next waypoint.: Units degrees: settable true |
| onChange_GPS WP NEXT LAT | trigger_onChange_GPS WP NEXT LAT | Latitude of next waypoint.: Units degrees: settable true |
| onRequest_GPS WP NEXT LAT | trigger_onRequest_GPS WP NEXT LAT | Latitude of next waypoint.: Units degrees: settable true |
| GPS WP NEXT LON | trigger_GPS WP NEXT LON | Longitude of next waypoint.: Units degrees: settable true |
| onChange_GPS WP NEXT LON | trigger_onChange_GPS WP NEXT LON | Longitude of next waypoint.: Units degrees: settable true |
| onRequest_GPS WP NEXT LON | trigger_onRequest_GPS WP NEXT LON | Longitude of next waypoint.: Units degrees: settable true |
| GPS WP PREV ALT | trigger_GPS WP PREV ALT | Altitude of previous waypoint.: Units meters: settable true |
| onChange_GPS WP PREV ALT | trigger_onChange_GPS WP PREV ALT | Altitude of previous waypoint.: Units meters: settable true |
| onRequest_GPS WP PREV ALT | trigger_onRequest_GPS WP PREV ALT | Altitude of previous waypoint.: Units meters: settable true |
| GPS WP PREV ID | trigger_GPS WP PREV ID | ID of previous GPS waypoint.: Units null: settable true |
| onChange_GPS WP PREV ID | trigger_onChange_GPS WP PREV ID | ID of previous GPS waypoint.: Units null: settable true |
| onRequest_GPS WP PREV ID | trigger_onRequest_GPS WP PREV ID | ID of previous GPS waypoint.: Units null: settable true |
| GPS WP PREV LAT | trigger_GPS WP PREV LAT | Latitude of previous waypoint.: Units degrees: settable true |
| onChange_GPS WP PREV LAT | trigger_onChange_GPS WP PREV LAT | Latitude of previous waypoint.: Units degrees: settable true |
| onRequest_GPS WP PREV LAT | trigger_onRequest_GPS WP PREV LAT | Latitude of previous waypoint.: Units degrees: settable true |
| GPS WP PREV LON | trigger_GPS WP PREV LON | Longitude of previous waypoint.: Units degrees: settable true |
| onChange_GPS WP PREV LON | trigger_onChange_GPS WP PREV LON | Longitude of previous waypoint.: Units degrees: settable true |
| onRequest_GPS WP PREV LON | trigger_onRequest_GPS WP PREV LON | Longitude of previous waypoint.: Units degrees: settable true |
| GPS WP PREV VALID | trigger_GPS WP PREV VALID | Is previous waypoint valid (i.e. current waypoint is not the first waypoint).: Units bool: settable true |
| onChange_GPS WP PREV VALID | trigger_onChange_GPS WP PREV VALID | Is previous waypoint valid (i.e. current waypoint is not the first waypoint).: Units bool: settable true |
| onRequest_GPS WP PREV VALID | trigger_onRequest_GPS WP PREV VALID | Is previous waypoint valid (i.e. current waypoint is not the first waypoint).: Units bool: settable true |
| GPS WP TRACK ANGLE ERROR | trigger_GPS WP TRACK ANGLE ERROR | Tracking angle error to waypoint.: Units radians: settable true |
| onChange_GPS WP TRACK ANGLE ERROR | trigger_onChange_GPS WP TRACK ANGLE ERROR | Tracking angle error to waypoint.: Units radians: settable true |
| onRequest_GPS WP TRACK ANGLE ERROR | trigger_onRequest_GPS WP TRACK ANGLE ERROR | Tracking angle error to waypoint.: Units radians: settable true |
| GPS WP TRUE BEARING | trigger_GPS WP TRUE BEARING | True bearing to waypoint.: Units radians: settable true |
| onChange_GPS WP TRUE BEARING | trigger_onChange_GPS WP TRUE BEARING | True bearing to waypoint.: Units radians: settable true |
| onRequest_GPS WP TRUE BEARING | trigger_onRequest_GPS WP TRUE BEARING | True bearing to waypoint.: Units radians: settable true |
| GPS WP TRUE REQ HDG | trigger_GPS WP TRUE REQ HDG | Required true heading to waypoint.: Units radians: settable true |
| onChange_GPS WP TRUE REQ HDG | trigger_onChange_GPS WP TRUE REQ HDG | Required true heading to waypoint.: Units radians: settable true |
| onRequest_GPS WP TRUE REQ HDG | trigger_onRequest_GPS WP TRUE REQ HDG | Required true heading to waypoint.: Units radians: settable true |
| GPS WP VERTICAL SPEED | trigger_GPS WP VERTICAL SPEED | Vertical speed to waypoint.: Units Meters per second: settable true |
| onChange_GPS WP VERTICAL SPEED | trigger_onChange_GPS WP VERTICAL SPEED | Vertical speed to waypoint.: Units Meters per second: settable true |
| onRequest_GPS WP VERTICAL SPEED | trigger_onRequest_GPS WP VERTICAL SPEED | Vertical speed to waypoint.: Units Meters per second: settable true |
| GPWS SYSTEM ACTIVE | trigger_GPWS SYSTEM ACTIVE | True if the Ground Proximity Warning System is active.: Units bool: settable true |
| onChange_GPWS SYSTEM ACTIVE | trigger_onChange_GPWS SYSTEM ACTIVE | True if the Ground Proximity Warning System is active.: Units bool: settable true |
| onRequest_GPWS SYSTEM ACTIVE | trigger_onRequest_GPWS SYSTEM ACTIVE | True if the Ground Proximity Warning System is active.: Units bool: settable true |
| GPWS WARNING | trigger_GPWS WARNING | True if Ground Proximity Warning System installed.: Units bool: settable false |
| onChange_GPWS WARNING | trigger_onChange_GPWS WARNING | True if Ground Proximity Warning System installed.: Units bool: settable false |
| onRequest_GPWS WARNING | trigger_onRequest_GPWS WARNING | True if Ground Proximity Warning System installed.: Units bool: settable false |
| GROUND ALTITUDE | trigger_GROUND ALTITUDE | Altitude of surface.: Units meters: settable false |
| onChange_GROUND ALTITUDE | trigger_onChange_GROUND ALTITUDE | Altitude of surface.: Units meters: settable false |
| onRequest_GROUND ALTITUDE | trigger_onRequest_GROUND ALTITUDE | Altitude of surface.: Units meters: settable false |
| GROUND VELOCITY | trigger_GROUND VELOCITY |  relative to the earths surface: Units knots: settable false |
| onChange_GROUND VELOCITY | trigger_onChange_GROUND VELOCITY |  relative to the earths surface: Units knots: settable false |
| onRequest_GROUND VELOCITY | trigger_onRequest_GROUND VELOCITY |  relative to the earths surface: Units knots: settable false |
| GROUNDPOWERUNIT HOSE DEPLOYED | trigger_GROUNDPOWERUNIT HOSE DEPLOYED | The current deployment amount of the ground power unit hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| onChange_GROUNDPOWERUNIT HOSE DEPLOYED | trigger_onChange_GROUNDPOWERUNIT HOSE DEPLOYED | The current deployment amount of the ground power unit hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| onRequest_GROUNDPOWERUNIT HOSE DEPLOYED | trigger_onRequest_GROUNDPOWERUNIT HOSE DEPLOYED | The current deployment amount of the ground power unit hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100: settable false |
| GROUNDPOWERUNIT HOSE END POSX | trigger_GROUNDPOWERUNIT HOSE END POSX | The "X" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| onChange_GROUNDPOWERUNIT HOSE END POSX | trigger_onChange_GROUNDPOWERUNIT HOSE END POSX | The "X" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| onRequest_GROUNDPOWERUNIT HOSE END POSX | trigger_onRequest_GROUNDPOWERUNIT HOSE END POSX | The "X" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| GROUNDPOWERUNIT HOSE END POSZ | trigger_GROUNDPOWERUNIT HOSE END POSZ | The "Z" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| onChange_GROUNDPOWERUNIT HOSE END POSZ | trigger_onChange_GROUNDPOWERUNIT HOSE END POSZ | The "Z" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| onRequest_GROUNDPOWERUNIT HOSE END POSZ | trigger_onRequest_GROUNDPOWERUNIT HOSE END POSZ | The "Z" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters: settable false |
| GROUNDPOWERUNIT HOSE END RELATIVE HEADING | trigger_GROUNDPOWERUNIT HOSE END RELATIVE HEADING | The heading of the end of the ground power unit hose, relative to the vehicle heading.: Units degrees: settable false |
| onChange_GROUNDPOWERUNIT HOSE END RELATIVE HEADING | trigger_onChange_GROUNDPOWERUNIT HOSE END RELATIVE HEADING | The heading of the end of the ground power unit hose, relative to the vehicle heading.: Units degrees: settable false |
| onRequest_GROUNDPOWERUNIT HOSE END RELATIVE HEADING | trigger_onRequest_GROUNDPOWERUNIT HOSE END RELATIVE HEADING | The heading of the end of the ground power unit hose, relative to the vehicle heading.: Units degrees: settable false |
| GYRO DRIFT ERROR | trigger_GYRO DRIFT ERROR | Angular error of heading indicator.: Units radians: settable false |
| onChange_GYRO DRIFT ERROR | trigger_onChange_GYRO DRIFT ERROR | Angular error of heading indicator.: Units radians: settable false |
| onRequest_GYRO DRIFT ERROR | trigger_onRequest_GYRO DRIFT ERROR | Angular error of heading indicator.: Units radians: settable false |
| HAND ANIM STATE | trigger_HAND ANIM STATE | What frame of the hand is currently used.: Units enum: settable true |
| onChange_HAND ANIM STATE | trigger_onChange_HAND ANIM STATE | What frame of the hand is currently used.: Units enum: settable true |
| onRequest_HAND ANIM STATE | trigger_onRequest_HAND ANIM STATE | What frame of the hand is currently used.: Units enum: settable true |
| HAS STALL PROTECTION | trigger_HAS STALL PROTECTION | Will return whether the aircraft has stall protection (true) or not (false).: Units bool: settable false |
| onChange_HAS STALL PROTECTION | trigger_onChange_HAS STALL PROTECTION | Will return whether the aircraft has stall protection (true) or not (false).: Units bool: settable false |
| onRequest_HAS STALL PROTECTION | trigger_onRequest_HAS STALL PROTECTION | Will return whether the aircraft has stall protection (true) or not (false).: Units bool: settable false |
| HEADING INDICATOR | trigger_HEADING INDICATOR | Heading indicator (directional gyro) indication.: Units radians: settable false |
| onChange_HEADING INDICATOR | trigger_onChange_HEADING INDICATOR | Heading indicator (directional gyro) indication.: Units radians: settable false |
| onRequest_HEADING INDICATOR | trigger_onRequest_HEADING INDICATOR | Heading indicator (directional gyro) indication.: Units radians: settable false |
| HOLDBACK BAR INSTALLED | trigger_HOLDBACK BAR INSTALLED | Holdback bars allow build up of thrust before takeoff from a catapult, and are installed by the deck crew of an aircraft carrier: Units bool: settable false |
| onChange_HOLDBACK BAR INSTALLED | trigger_onChange_HOLDBACK BAR INSTALLED | Holdback bars allow build up of thrust before takeoff from a catapult, and are installed by the deck crew of an aircraft carrier: Units bool: settable false |
| onRequest_HOLDBACK BAR INSTALLED | trigger_onRequest_HOLDBACK BAR INSTALLED | Holdback bars allow build up of thrust before takeoff from a catapult, and are installed by the deck crew of an aircraft carrier: Units bool: settable false |
| HSI BEARING | trigger_HSI BEARING | If the GPS_DRIVES_NAV1 variable is true and the HSI BEARING VALID variable is true, this variable contains the HSI needle bearing. If the GPS DRIVES NAV1 variable is false and the HSI BEARING VALID variable is true, this variable contains the ADF1 frequency.: Units degrees: settable false |
| onChange_HSI BEARING | trigger_onChange_HSI BEARING | If the GPS_DRIVES_NAV1 variable is true and the HSI BEARING VALID variable is true, this variable contains the HSI needle bearing. If the GPS DRIVES NAV1 variable is false and the HSI BEARING VALID variable is true, this variable contains the ADF1 frequency.: Units degrees: settable false |
| onRequest_HSI BEARING | trigger_onRequest_HSI BEARING | If the GPS_DRIVES_NAV1 variable is true and the HSI BEARING VALID variable is true, this variable contains the HSI needle bearing. If the GPS DRIVES NAV1 variable is false and the HSI BEARING VALID variable is true, this variable contains the ADF1 frequency.: Units degrees: settable false |
| HSI BEARING VALID | trigger_HSI BEARING VALID | This will return true if the HSI BEARING variable contains valid data.: Units bool: settable false |
| onChange_HSI BEARING VALID | trigger_onChange_HSI BEARING VALID | This will return true if the HSI BEARING variable contains valid data.: Units bool: settable false |
| onRequest_HSI BEARING VALID | trigger_onRequest_HSI BEARING VALID | This will return true if the HSI BEARING variable contains valid data.: Units bool: settable false |
| HSI CDI NEEDLE | trigger_HSI CDI NEEDLE | Needle deflection (+/- 127).: Units number: settable false |
| onChange_HSI CDI NEEDLE | trigger_onChange_HSI CDI NEEDLE | Needle deflection (+/- 127).: Units number: settable false |
| onRequest_HSI CDI NEEDLE | trigger_onRequest_HSI CDI NEEDLE | Needle deflection (+/- 127).: Units number: settable false |
| HSI CDI NEEDLE VALID | trigger_HSI CDI NEEDLE VALID | Signal valid.: Units bool: settable false |
| onChange_HSI CDI NEEDLE VALID | trigger_onChange_HSI CDI NEEDLE VALID | Signal valid.: Units bool: settable false |
| onRequest_HSI CDI NEEDLE VALID | trigger_onRequest_HSI CDI NEEDLE VALID | Signal valid.: Units bool: settable false |
| HSI DISTANCE | trigger_HSI DISTANCE | DME/GPS distance.: Units nautical miles: settable false |
| onChange_HSI DISTANCE | trigger_onChange_HSI DISTANCE | DME/GPS distance.: Units nautical miles: settable false |
| onRequest_HSI DISTANCE | trigger_onRequest_HSI DISTANCE | DME/GPS distance.: Units nautical miles: settable false |
| HSI GSI NEEDLE | trigger_HSI GSI NEEDLE | Needle deflection (+/- 119).: Units number: settable false |
| onChange_HSI GSI NEEDLE | trigger_onChange_HSI GSI NEEDLE | Needle deflection (+/- 119).: Units number: settable false |
| onRequest_HSI GSI NEEDLE | trigger_onRequest_HSI GSI NEEDLE | Needle deflection (+/- 119).: Units number: settable false |
| HSI GSI NEEDLE VALID | trigger_HSI GSI NEEDLE VALID | Signal valid.: Units bool: settable false |
| onChange_HSI GSI NEEDLE VALID | trigger_onChange_HSI GSI NEEDLE VALID | Signal valid.: Units bool: settable false |
| onRequest_HSI GSI NEEDLE VALID | trigger_onRequest_HSI GSI NEEDLE VALID | Signal valid.: Units bool: settable false |
| HSI HAS LOCALIZER | trigger_HSI HAS LOCALIZER | Station is a localizer.: Units bool: settable false |
| onChange_HSI HAS LOCALIZER | trigger_onChange_HSI HAS LOCALIZER | Station is a localizer.: Units bool: settable false |
| onRequest_HSI HAS LOCALIZER | trigger_onRequest_HSI HAS LOCALIZER | Station is a localizer.: Units bool: settable false |
| HSI SPEED | trigger_HSI SPEED | DME/GPS speed.: Units knots: settable false |
| onChange_HSI SPEED | trigger_onChange_HSI SPEED | DME/GPS speed.: Units knots: settable false |
| onRequest_HSI SPEED | trigger_onRequest_HSI SPEED | DME/GPS speed.: Units knots: settable false |
| HSI STATION IDENT | trigger_HSI STATION IDENT | Returns the ident of the the next GPS waypoint, if GPS_DRIVES_NAV1 is true. If GPS DRIVES NAV1 is false, it returns the identity of the station that is tuned on nav radio 1.: Units null: settable false |
| onChange_HSI STATION IDENT | trigger_onChange_HSI STATION IDENT | Returns the ident of the the next GPS waypoint, if GPS_DRIVES_NAV1 is true. If GPS DRIVES NAV1 is false, it returns the identity of the station that is tuned on nav radio 1.: Units null: settable false |
| onRequest_HSI STATION IDENT | trigger_onRequest_HSI STATION IDENT | Returns the ident of the the next GPS waypoint, if GPS_DRIVES_NAV1 is true. If GPS DRIVES NAV1 is false, it returns the identity of the station that is tuned on nav radio 1.: Units null: settable false |
| HSI TF FLAGS | trigger_HSI TF FLAGS | Nav TO/FROM flag.: Units enum: settable false |
| onChange_HSI TF FLAGS | trigger_onChange_HSI TF FLAGS | Nav TO/FROM flag.: Units enum: settable false |
| onRequest_HSI TF FLAGS | trigger_onRequest_HSI TF FLAGS | Nav TO/FROM flag.: Units enum: settable false |
| HYDRAULIC PRESSURE:index | trigger_HYDRAULIC PRESSURE:index | Hydraulic system pressure. Indexes start at 1.: Units pounds: settable false |
| onChange_HYDRAULIC PRESSURE:index | trigger_onChange_HYDRAULIC PRESSURE:index | Hydraulic system pressure. Indexes start at 1.: Units pounds: settable false |
| onRequest_HYDRAULIC PRESSURE:index | trigger_onRequest_HYDRAULIC PRESSURE:index | Hydraulic system pressure. Indexes start at 1.: Units pounds: settable false |
| HYDRAULIC RESERVOIR PERCENT:index | trigger_HYDRAULIC RESERVOIR PERCENT:index | Hydraulic pressure changes will follow changes to this variable. Indexes start at 1.: Units percent Over 100: settable true |
| onChange_HYDRAULIC RESERVOIR PERCENT:index | trigger_onChange_HYDRAULIC RESERVOIR PERCENT:index | Hydraulic pressure changes will follow changes to this variable. Indexes start at 1.: Units percent Over 100: settable true |
| onRequest_HYDRAULIC RESERVOIR PERCENT:index | trigger_onRequest_HYDRAULIC RESERVOIR PERCENT:index | Hydraulic pressure changes will follow changes to this variable. Indexes start at 1.: Units percent Over 100: settable true |
| HYDRAULIC SWITCH | trigger_HYDRAULIC SWITCH | True if hydraulic switch is on.: Units bool: settable false |
| onChange_HYDRAULIC SWITCH | trigger_onChange_HYDRAULIC SWITCH | True if hydraulic switch is on.: Units bool: settable false |
| onRequest_HYDRAULIC SWITCH | trigger_onRequest_HYDRAULIC SWITCH | True if hydraulic switch is on.: Units bool: settable false |
| HYDRAULIC SYSTEM INTEGRITY | trigger_HYDRAULIC SYSTEM INTEGRITY | Percent system functional.: Units percent Over 100: settable false |
| onChange_HYDRAULIC SYSTEM INTEGRITY | trigger_onChange_HYDRAULIC SYSTEM INTEGRITY | Percent system functional.: Units percent Over 100: settable false |
| onRequest_HYDRAULIC SYSTEM INTEGRITY | trigger_onRequest_HYDRAULIC SYSTEM INTEGRITY | Percent system functional.: Units percent Over 100: settable false |
| IDLE ANIMATION ID | trigger_IDLE ANIMATION ID | The ID of the idle animation for the sim object.: Units null: settable false |
| onChange_IDLE ANIMATION ID | trigger_onChange_IDLE ANIMATION ID | The ID of the idle animation for the sim object.: Units null: settable false |
| onRequest_IDLE ANIMATION ID | trigger_onRequest_IDLE ANIMATION ID | The ID of the idle animation for the sim object.: Units null: settable false |
| INCIDENCE ALPHA | trigger_INCIDENCE ALPHA | Angle of attack: Units radians: settable false |
| onChange_INCIDENCE ALPHA | trigger_onChange_INCIDENCE ALPHA | Angle of attack: Units radians: settable false |
| onRequest_INCIDENCE ALPHA | trigger_onRequest_INCIDENCE ALPHA | Angle of attack: Units radians: settable false |
| INCIDENCE BETA | trigger_INCIDENCE BETA | Sideslip angle: Units radians: settable false |
| onChange_INCIDENCE BETA | trigger_onChange_INCIDENCE BETA | Sideslip angle: Units radians: settable false |
| onRequest_INCIDENCE BETA | trigger_onRequest_INCIDENCE BETA | Sideslip angle: Units radians: settable false |
| INDICATED ALTITUDE | trigger_INDICATED ALTITUDE | The indicated altitude.: Units feet: settable true |
| onChange_INDICATED ALTITUDE | trigger_onChange_INDICATED ALTITUDE | The indicated altitude.: Units feet: settable true |
| onRequest_INDICATED ALTITUDE | trigger_onRequest_INDICATED ALTITUDE | The indicated altitude.: Units feet: settable true |
| INDICATED ALTITUDE CALIBRATED | trigger_INDICATED ALTITUDE CALIBRATED | Indicated altitude with the altimeter calibrated to current sea level pressure.: Units feet: settable false |
| onChange_INDICATED ALTITUDE CALIBRATED | trigger_onChange_INDICATED ALTITUDE CALIBRATED | Indicated altitude with the altimeter calibrated to current sea level pressure.: Units feet: settable false |
| onRequest_INDICATED ALTITUDE CALIBRATED | trigger_onRequest_INDICATED ALTITUDE CALIBRATED | Indicated altitude with the altimeter calibrated to current sea level pressure.: Units feet: settable false |
| INDICATED ALTITUDE EX1 | trigger_INDICATED ALTITUDE EX1 | Similar to INDICATED_ALTITUDE but doesn't affect actual plane position when setting this variable.: Units feet: settable false |
| onChange_INDICATED ALTITUDE EX1 | trigger_onChange_INDICATED ALTITUDE EX1 | Similar to INDICATED_ALTITUDE but doesn't affect actual plane position when setting this variable.: Units feet: settable false |
| onRequest_INDICATED ALTITUDE EX1 | trigger_onRequest_INDICATED ALTITUDE EX1 | Similar to INDICATED_ALTITUDE but doesn't affect actual plane position when setting this variable.: Units feet: settable false |
| INDUCTOR COMPASS HEADING REF | trigger_INDUCTOR COMPASS HEADING REF | Inductor compass heading.: Units radians: settable false |
| onChange_INDUCTOR COMPASS HEADING REF | trigger_onChange_INDUCTOR COMPASS HEADING REF | Inductor compass heading.: Units radians: settable false |
| onRequest_INDUCTOR COMPASS HEADING REF | trigger_onRequest_INDUCTOR COMPASS HEADING REF | Inductor compass heading.: Units radians: settable false |
| INDUCTOR COMPASS PERCENT DEVIATION | trigger_INDUCTOR COMPASS PERCENT DEVIATION | Inductor compass deviation reading.: Units percent Over 100: settable false |
| onChange_INDUCTOR COMPASS PERCENT DEVIATION | trigger_onChange_INDUCTOR COMPASS PERCENT DEVIATION | Inductor compass deviation reading.: Units percent Over 100: settable false |
| onRequest_INDUCTOR COMPASS PERCENT DEVIATION | trigger_onRequest_INDUCTOR COMPASS PERCENT DEVIATION | Inductor compass deviation reading.: Units percent Over 100: settable false |
| INNER MARKER | trigger_INNER MARKER | Inner marker state.: Units bool: settable true |
| onChange_INNER MARKER | trigger_onChange_INNER MARKER | Inner marker state.: Units bool: settable true |
| onRequest_INNER MARKER | trigger_onRequest_INNER MARKER | Inner marker state.: Units bool: settable true |
| INTERACTIVE POINT BANK | trigger_INTERACTIVE POINT BANK | Interactive Point orientation: Bank: Units degrees: settable false |
| onChange_INTERACTIVE POINT BANK | trigger_onChange_INTERACTIVE POINT BANK | Interactive Point orientation: Bank: Units degrees: settable false |
| onRequest_INTERACTIVE POINT BANK | trigger_onRequest_INTERACTIVE POINT BANK | Interactive Point orientation: Bank: Units degrees: settable false |
| INTERACTIVE POINT GOAL | trigger_INTERACTIVE POINT GOAL | The Interactive Point goal percentage of opening (if it's for a door) or percentage of deployment (if it's for a hose or cable).: Units percent Over 100: settable true |
| onChange_INTERACTIVE POINT GOAL | trigger_onChange_INTERACTIVE POINT GOAL | The Interactive Point goal percentage of opening (if it's for a door) or percentage of deployment (if it's for a hose or cable).: Units percent Over 100: settable true |
| onRequest_INTERACTIVE POINT GOAL | trigger_onRequest_INTERACTIVE POINT GOAL | The Interactive Point goal percentage of opening (if it's for a door) or percentage of deployment (if it's for a hose or cable).: Units percent Over 100: settable true |
| INTERACTIVE POINT HEADING | trigger_INTERACTIVE POINT HEADING | Interactive Point orientation: Heading: Units degrees: settable false |
| onChange_INTERACTIVE POINT HEADING | trigger_onChange_INTERACTIVE POINT HEADING | Interactive Point orientation: Heading: Units degrees: settable false |
| onRequest_INTERACTIVE POINT HEADING | trigger_onRequest_INTERACTIVE POINT HEADING | Interactive Point orientation: Heading: Units degrees: settable false |
| INTERACTIVE POINT JETWAY LEFT BEND | trigger_INTERACTIVE POINT JETWAY LEFT BEND | Interactive Point Jetway constant, determining the desired left bend ratio of jetway hood: Units percent: settable false |
| onChange_INTERACTIVE POINT JETWAY LEFT BEND | trigger_onChange_INTERACTIVE POINT JETWAY LEFT BEND | Interactive Point Jetway constant, determining the desired left bend ratio of jetway hood: Units percent: settable false |
| onRequest_INTERACTIVE POINT JETWAY LEFT BEND | trigger_onRequest_INTERACTIVE POINT JETWAY LEFT BEND | Interactive Point Jetway constant, determining the desired left bend ratio of jetway hood: Units percent: settable false |
| INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | trigger_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | Interactive Point Jetway constant, determining the desired left deployment angle of jetway hood: Units degrees: settable false |
| onChange_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | trigger_onChange_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | Interactive Point Jetway constant, determining the desired left deployment angle of jetway hood: Units degrees: settable false |
| onRequest_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | trigger_onRequest_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT | Interactive Point Jetway constant, determining the desired left deployment angle of jetway hood: Units degrees: settable false |
| INTERACTIVE POINT JETWAY RIGHT BEND | trigger_INTERACTIVE POINT JETWAY RIGHT BEND | Interactive Point Jetway constant, determining the desired right bend ratio of jetway hood: Units percent: settable false |
| onChange_INTERACTIVE POINT JETWAY RIGHT BEND | trigger_onChange_INTERACTIVE POINT JETWAY RIGHT BEND | Interactive Point Jetway constant, determining the desired right bend ratio of jetway hood: Units percent: settable false |
| onRequest_INTERACTIVE POINT JETWAY RIGHT BEND | trigger_onRequest_INTERACTIVE POINT JETWAY RIGHT BEND | Interactive Point Jetway constant, determining the desired right bend ratio of jetway hood: Units percent: settable false |
| INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | trigger_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | Interactive Point Jetway constant, determining the desired right deployment angle of jetway hood: Units degrees: settable false |
| onChange_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | trigger_onChange_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | Interactive Point Jetway constant, determining the desired right deployment angle of jetway hood: Units degrees: settable false |
| onRequest_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | trigger_onRequest_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT | Interactive Point Jetway constant, determining the desired right deployment angle of jetway hood: Units degrees: settable false |
| INTERACTIVE POINT JETWAY TOP HORIZONTAL | trigger_INTERACTIVE POINT JETWAY TOP HORIZONTAL | Interactive Point Jetway constant, determining the desired top horizontal ratio of displacement of jetway hood: Units percent: settable false |
| onChange_INTERACTIVE POINT JETWAY TOP HORIZONTAL | trigger_onChange_INTERACTIVE POINT JETWAY TOP HORIZONTAL | Interactive Point Jetway constant, determining the desired top horizontal ratio of displacement of jetway hood: Units percent: settable false |
| onRequest_INTERACTIVE POINT JETWAY TOP HORIZONTAL | trigger_onRequest_INTERACTIVE POINT JETWAY TOP HORIZONTAL | Interactive Point Jetway constant, determining the desired top horizontal ratio of displacement of jetway hood: Units percent: settable false |
| INTERACTIVE POINT JETWAY TOP VERTICAL | trigger_INTERACTIVE POINT JETWAY TOP VERTICAL | Interactive Point Jetway constant, determining the desired top vertical ratio of displacement of jetway hood: Units percent: settable false |
| onChange_INTERACTIVE POINT JETWAY TOP VERTICAL | trigger_onChange_INTERACTIVE POINT JETWAY TOP VERTICAL | Interactive Point Jetway constant, determining the desired top vertical ratio of displacement of jetway hood: Units percent: settable false |
| onRequest_INTERACTIVE POINT JETWAY TOP VERTICAL | trigger_onRequest_INTERACTIVE POINT JETWAY TOP VERTICAL | Interactive Point Jetway constant, determining the desired top vertical ratio of displacement of jetway hood: Units percent: settable false |
| INTERACTIVE POINT OPEN | trigger_INTERACTIVE POINT OPEN | Interactive Point current percentage of opening (if door) or deployment (if hose/cable): Units percent Over 100: settable true |
| onChange_INTERACTIVE POINT OPEN | trigger_onChange_INTERACTIVE POINT OPEN | Interactive Point current percentage of opening (if door) or deployment (if hose/cable): Units percent Over 100: settable true |
| onRequest_INTERACTIVE POINT OPEN | trigger_onRequest_INTERACTIVE POINT OPEN | Interactive Point current percentage of opening (if door) or deployment (if hose/cable): Units percent Over 100: settable true |
| INTERACTIVE POINT PITCH | trigger_INTERACTIVE POINT PITCH | Interactive Point orientation: Pitch: Units degrees: settable false |
| onChange_INTERACTIVE POINT PITCH | trigger_onChange_INTERACTIVE POINT PITCH | Interactive Point orientation: Pitch: Units degrees: settable false |
| onRequest_INTERACTIVE POINT PITCH | trigger_onRequest_INTERACTIVE POINT PITCH | Interactive Point orientation: Pitch: Units degrees: settable false |
| INTERACTIVE POINT POSX | trigger_INTERACTIVE POINT POSX | Interactive Point X position relative to datum reference point: Units feet: settable false |
| onChange_INTERACTIVE POINT POSX | trigger_onChange_INTERACTIVE POINT POSX | Interactive Point X position relative to datum reference point: Units feet: settable false |
| onRequest_INTERACTIVE POINT POSX | trigger_onRequest_INTERACTIVE POINT POSX | Interactive Point X position relative to datum reference point: Units feet: settable false |
| INTERACTIVE POINT POSY | trigger_INTERACTIVE POINT POSY | Interactive Point Y position relative to datum reference point: Units feet: settable false |
| onChange_INTERACTIVE POINT POSY | trigger_onChange_INTERACTIVE POINT POSY | Interactive Point Y position relative to datum reference point: Units feet: settable false |
| onRequest_INTERACTIVE POINT POSY | trigger_onRequest_INTERACTIVE POINT POSY | Interactive Point Y position relative to datum reference point: Units feet: settable false |
| INTERACTIVE POINT POSZ | trigger_INTERACTIVE POINT POSZ | Interactive Point Z position relative to datum reference point: Units feet: settable false |
| onChange_INTERACTIVE POINT POSZ | trigger_onChange_INTERACTIVE POINT POSZ | Interactive Point Z position relative to datum reference point: Units feet: settable false |
| onRequest_INTERACTIVE POINT POSZ | trigger_onRequest_INTERACTIVE POINT POSZ | Interactive Point Z position relative to datum reference point: Units feet: settable false |
| INTERACTIVE POINT TYPE | trigger_INTERACTIVE POINT TYPE | The type of interactive point: Units enum: settable false |
| onChange_INTERACTIVE POINT TYPE | trigger_onChange_INTERACTIVE POINT TYPE | The type of interactive point: Units enum: settable false |
| onRequest_INTERACTIVE POINT TYPE | trigger_onRequest_INTERACTIVE POINT TYPE | The type of interactive point: Units enum: settable false |
| INTERCOM MODE | trigger_INTERCOM MODE | Intercom Mode: Units enum: settable false |
| onChange_INTERCOM MODE | trigger_onChange_INTERCOM MODE | Intercom Mode: Units enum: settable false |
| onRequest_INTERCOM MODE | trigger_onRequest_INTERCOM MODE | Intercom Mode: Units enum: settable false |
| INTERCOM SYSTEM ACTIVE | trigger_INTERCOM SYSTEM ACTIVE | Whether or not the intercom system is active.: Units bool: settable false |
| onChange_INTERCOM SYSTEM ACTIVE | trigger_onChange_INTERCOM SYSTEM ACTIVE | Whether or not the intercom system is active.: Units bool: settable false |
| onRequest_INTERCOM SYSTEM ACTIVE | trigger_onRequest_INTERCOM SYSTEM ACTIVE | Whether or not the intercom system is active.: Units bool: settable false |
| IS ALTITUDE FREEZE ON | trigger_IS ALTITUDE FREEZE ON | True if the altitude of the aircraft is frozen.: Units bool: settable false |
| onChange_IS ALTITUDE FREEZE ON | trigger_onChange_IS ALTITUDE FREEZE ON | True if the altitude of the aircraft is frozen.: Units bool: settable false |
| onRequest_IS ALTITUDE FREEZE ON | trigger_onRequest_IS ALTITUDE FREEZE ON | True if the altitude of the aircraft is frozen.: Units bool: settable false |
| IS ANY INTERIOR LIGHT ON | trigger_IS ANY INTERIOR LIGHT ON | Will return true if any interior light is on or false otherwise.: Units bool: settable false |
| onChange_IS ANY INTERIOR LIGHT ON | trigger_onChange_IS ANY INTERIOR LIGHT ON | Will return true if any interior light is on or false otherwise.: Units bool: settable false |
| onRequest_IS ANY INTERIOR LIGHT ON | trigger_onRequest_IS ANY INTERIOR LIGHT ON | Will return true if any interior light is on or false otherwise.: Units bool: settable false |
| IS ATTACHED TO SLING | trigger_IS ATTACHED TO SLING | Set to true if this object is attached to a sling.: Units bool: settable false |
| onChange_IS ATTACHED TO SLING | trigger_onChange_IS ATTACHED TO SLING | Set to true if this object is attached to a sling.: Units bool: settable false |
| onRequest_IS ATTACHED TO SLING | trigger_onRequest_IS ATTACHED TO SLING | Set to true if this object is attached to a sling.: Units bool: settable false |
| IS ATTITUDE FREEZE ON | trigger_IS ATTITUDE FREEZE ON | True if the attitude (pitch, bank and heading) of the aircraft is frozen.: Units bool: settable false |
| onChange_IS ATTITUDE FREEZE ON | trigger_onChange_IS ATTITUDE FREEZE ON | True if the attitude (pitch, bank and heading) of the aircraft is frozen.: Units bool: settable false |
| onRequest_IS ATTITUDE FREEZE ON | trigger_onRequest_IS ATTITUDE FREEZE ON | True if the attitude (pitch, bank and heading) of the aircraft is frozen.: Units bool: settable false |
| IS CAMERA RAY INTERSECT WITH NODE | trigger_IS CAMERA RAY INTERSECT WITH NODE | This SimVar is used to check for a collision along a ray from the center of the user FOV and a model node. The available nodes that can be checked using this SimVar must be previously defined in the [CAMERA_RAY_NODE_COLLISION] of the camera.cfg file. The SimVar requires a node index value between 1 and 10, corresponding to the node defined in the CFG file, and the SimVar will return 1 (TRUE) if there is a collision along the camera ray or 0 (FALSE) otherwise. You may also supply an index of 0 to perform a collision check for all defined nodes, in which case the SimVar will return 1 (TRUE) if there is a collision between the ray and any of the defined nodes. Supplying an index outside of the range of 1 to 10, or supplying an index for which no node has been defined, will return 0 (FALSE).: Units bool: settable false |
| onChange_IS CAMERA RAY INTERSECT WITH NODE | trigger_onChange_IS CAMERA RAY INTERSECT WITH NODE | This SimVar is used to check for a collision along a ray from the center of the user FOV and a model node. The available nodes that can be checked using this SimVar must be previously defined in the [CAMERA_RAY_NODE_COLLISION] of the camera.cfg file. The SimVar requires a node index value between 1 and 10, corresponding to the node defined in the CFG file, and the SimVar will return 1 (TRUE) if there is a collision along the camera ray or 0 (FALSE) otherwise. You may also supply an index of 0 to perform a collision check for all defined nodes, in which case the SimVar will return 1 (TRUE) if there is a collision between the ray and any of the defined nodes. Supplying an index outside of the range of 1 to 10, or supplying an index for which no node has been defined, will return 0 (FALSE).: Units bool: settable false |
| onRequest_IS CAMERA RAY INTERSECT WITH NODE | trigger_onRequest_IS CAMERA RAY INTERSECT WITH NODE | This SimVar is used to check for a collision along a ray from the center of the user FOV and a model node. The available nodes that can be checked using this SimVar must be previously defined in the [CAMERA_RAY_NODE_COLLISION] of the camera.cfg file. The SimVar requires a node index value between 1 and 10, corresponding to the node defined in the CFG file, and the SimVar will return 1 (TRUE) if there is a collision along the camera ray or 0 (FALSE) otherwise. You may also supply an index of 0 to perform a collision check for all defined nodes, in which case the SimVar will return 1 (TRUE) if there is a collision between the ray and any of the defined nodes. Supplying an index outside of the range of 1 to 10, or supplying an index for which no node has been defined, will return 0 (FALSE).: Units bool: settable false |
| IS GEAR FLOATS | trigger_IS GEAR FLOATS | True if landing gear are floats: Units bool: settable false |
| onChange_IS GEAR FLOATS | trigger_onChange_IS GEAR FLOATS | True if landing gear are floats: Units bool: settable false |
| onRequest_IS GEAR FLOATS | trigger_onRequest_IS GEAR FLOATS | True if landing gear are floats: Units bool: settable false |
| IS GEAR RETRACTABLE | trigger_IS GEAR RETRACTABLE | True if gear can be retracted: Units bool: settable false |
| onChange_IS GEAR RETRACTABLE | trigger_onChange_IS GEAR RETRACTABLE | True if gear can be retracted: Units bool: settable false |
| onRequest_IS GEAR RETRACTABLE | trigger_onRequest_IS GEAR RETRACTABLE | True if gear can be retracted: Units bool: settable false |
| IS GEAR SKIDS | trigger_IS GEAR SKIDS | True if landing gear is skids: Units bool: settable false |
| onChange_IS GEAR SKIDS | trigger_onChange_IS GEAR SKIDS | True if landing gear is skids: Units bool: settable false |
| onRequest_IS GEAR SKIDS | trigger_onRequest_IS GEAR SKIDS | True if landing gear is skids: Units bool: settable false |
| IS GEAR SKIS | trigger_IS GEAR SKIS | True if landing gear is skis: Units bool: settable false |
| onChange_IS GEAR SKIS | trigger_onChange_IS GEAR SKIS | True if landing gear is skis: Units bool: settable false |
| onRequest_IS GEAR SKIS | trigger_onRequest_IS GEAR SKIS | True if landing gear is skis: Units bool: settable false |
| IS GEAR WHEELS | trigger_IS GEAR WHEELS | True if landing gear is wheels: Units bool: settable false |
| onChange_IS GEAR WHEELS | trigger_onChange_IS GEAR WHEELS | True if landing gear is wheels: Units bool: settable false |
| onRequest_IS GEAR WHEELS | trigger_onRequest_IS GEAR WHEELS | True if landing gear is wheels: Units bool: settable false |
| IS LATITUDE LONGITUDE FREEZE ON | trigger_IS LATITUDE LONGITUDE FREEZE ON | True if the lat/lon of the aircraft (either user or AI controlled) is frozen. If this variable returns true, it means that the latitude and longitude of the aircraft are not being controlled by ESP, so enabling, for example, a SimConnect client to control the position of the aircraft. This can also apply to altitude and attitude. Also refer to the range of KEY_FREEZE..... Event IDs.: Units bool: settable false |
| onChange_IS LATITUDE LONGITUDE FREEZE ON | trigger_onChange_IS LATITUDE LONGITUDE FREEZE ON | True if the lat/lon of the aircraft (either user or AI controlled) is frozen. If this variable returns true, it means that the latitude and longitude of the aircraft are not being controlled by ESP, so enabling, for example, a SimConnect client to control the position of the aircraft. This can also apply to altitude and attitude. Also refer to the range of KEY_FREEZE..... Event IDs.: Units bool: settable false |
| onRequest_IS LATITUDE LONGITUDE FREEZE ON | trigger_onRequest_IS LATITUDE LONGITUDE FREEZE ON | True if the lat/lon of the aircraft (either user or AI controlled) is frozen. If this variable returns true, it means that the latitude and longitude of the aircraft are not being controlled by ESP, so enabling, for example, a SimConnect client to control the position of the aircraft. This can also apply to altitude and attitude. Also refer to the range of KEY_FREEZE..... Event IDs.: Units bool: settable false |
| IS SLEW ACTIVE | trigger_IS SLEW ACTIVE | True if slew is active: Units bool: settable true |
| onChange_IS SLEW ACTIVE | trigger_onChange_IS SLEW ACTIVE | True if slew is active: Units bool: settable true |
| onRequest_IS SLEW ACTIVE | trigger_onRequest_IS SLEW ACTIVE | True if slew is active: Units bool: settable true |
| IS SLEW ALLOWED | trigger_IS SLEW ALLOWED | True if slew is enabled: Units bool: settable true |
| onChange_IS SLEW ALLOWED | trigger_onChange_IS SLEW ALLOWED | True if slew is enabled: Units bool: settable true |
| onRequest_IS SLEW ALLOWED | trigger_onRequest_IS SLEW ALLOWED | True if slew is enabled: Units bool: settable true |
| IS TAIL DRAGGER | trigger_IS TAIL DRAGGER | True if the aircraft is a taildragger: Units bool: settable false |
| onChange_IS TAIL DRAGGER | trigger_onChange_IS TAIL DRAGGER | True if the aircraft is a taildragger: Units bool: settable false |
| onRequest_IS TAIL DRAGGER | trigger_onRequest_IS TAIL DRAGGER | True if the aircraft is a taildragger: Units bool: settable false |
| IS USER SIM | trigger_IS USER SIM | Is this the user loaded aircraft: Units bool: settable false |
| onChange_IS USER SIM | trigger_onChange_IS USER SIM | Is this the user loaded aircraft: Units bool: settable false |
| onRequest_IS USER SIM | trigger_onRequest_IS USER SIM | Is this the user loaded aircraft: Units bool: settable false |
| JETWAY HOOD LEFT BEND | trigger_JETWAY HOOD LEFT BEND | The target position for the left bend animation of the jetway hood.: Units percent: settable false |
| onChange_JETWAY HOOD LEFT BEND | trigger_onChange_JETWAY HOOD LEFT BEND | The target position for the left bend animation of the jetway hood.: Units percent: settable false |
| onRequest_JETWAY HOOD LEFT BEND | trigger_onRequest_JETWAY HOOD LEFT BEND | The target position for the left bend animation of the jetway hood.: Units percent: settable false |
| JETWAY HOOD LEFT DEPLOYMENT | trigger_JETWAY HOOD LEFT DEPLOYMENT | The target angle for the left deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| onChange_JETWAY HOOD LEFT DEPLOYMENT | trigger_onChange_JETWAY HOOD LEFT DEPLOYMENT | The target angle for the left deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| onRequest_JETWAY HOOD LEFT DEPLOYMENT | trigger_onRequest_JETWAY HOOD LEFT DEPLOYMENT | The target angle for the left deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| JETWAY HOOD RIGHT BEND | trigger_JETWAY HOOD RIGHT BEND | The target position for the right bend animation of the jetway hood.: Units percent: settable false |
| onChange_JETWAY HOOD RIGHT BEND | trigger_onChange_JETWAY HOOD RIGHT BEND | The target position for the right bend animation of the jetway hood.: Units percent: settable false |
| onRequest_JETWAY HOOD RIGHT BEND | trigger_onRequest_JETWAY HOOD RIGHT BEND | The target position for the right bend animation of the jetway hood.: Units percent: settable false |
| JETWAY HOOD RIGHT DEPLOYMENT | trigger_JETWAY HOOD RIGHT DEPLOYMENT | The target angle for the right deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| onChange_JETWAY HOOD RIGHT DEPLOYMENT | trigger_onChange_JETWAY HOOD RIGHT DEPLOYMENT | The target angle for the right deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| onRequest_JETWAY HOOD RIGHT DEPLOYMENT | trigger_onRequest_JETWAY HOOD RIGHT DEPLOYMENT | The target angle for the right deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees: settable false |
| JETWAY HOOD TOP HORIZONTAL | trigger_JETWAY HOOD TOP HORIZONTAL | Target position for the top horizontal animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| onChange_JETWAY HOOD TOP HORIZONTAL | trigger_onChange_JETWAY HOOD TOP HORIZONTAL | Target position for the top horizontal animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| onRequest_JETWAY HOOD TOP HORIZONTAL | trigger_onRequest_JETWAY HOOD TOP HORIZONTAL | Target position for the top horizontal animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| JETWAY HOOD TOP VERTICAL | trigger_JETWAY HOOD TOP VERTICAL | Target position for the top vertical animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| onChange_JETWAY HOOD TOP VERTICAL | trigger_onChange_JETWAY HOOD TOP VERTICAL | Target position for the top vertical animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| onRequest_JETWAY HOOD TOP VERTICAL | trigger_onRequest_JETWAY HOOD TOP VERTICAL | Target position for the top vertical animation of the jetway hood. Values can be between -100% and 100%.: Units percent: settable false |
| JETWAY MOVING | trigger_JETWAY MOVING | This will be 1 (TRUE) id the jetway body is currently moving (it will not include checks on hood animation).: Units bool: settable false |
| onChange_JETWAY MOVING | trigger_onChange_JETWAY MOVING | This will be 1 (TRUE) id the jetway body is currently moving (it will not include checks on hood animation).: Units bool: settable false |
| onRequest_JETWAY MOVING | trigger_onRequest_JETWAY MOVING | This will be 1 (TRUE) id the jetway body is currently moving (it will not include checks on hood animation).: Units bool: settable false |
| JETWAY WHEEL ORIENTATION CURRENT | trigger_JETWAY WHEEL ORIENTATION CURRENT | The current angle of the jetway wheels.: Units degrees: settable false |
| onChange_JETWAY WHEEL ORIENTATION CURRENT | trigger_onChange_JETWAY WHEEL ORIENTATION CURRENT | The current angle of the jetway wheels.: Units degrees: settable false |
| onRequest_JETWAY WHEEL ORIENTATION CURRENT | trigger_onRequest_JETWAY WHEEL ORIENTATION CURRENT | The current angle of the jetway wheels.: Units degrees: settable false |
| JETWAY WHEEL ORIENTATION TARGET | trigger_JETWAY WHEEL ORIENTATION TARGET | The (approximate) target angle for the jetway wheels.: Units degrees: settable false |
| onChange_JETWAY WHEEL ORIENTATION TARGET | trigger_onChange_JETWAY WHEEL ORIENTATION TARGET | The (approximate) target angle for the jetway wheels.: Units degrees: settable false |
| onRequest_JETWAY WHEEL ORIENTATION TARGET | trigger_onRequest_JETWAY WHEEL ORIENTATION TARGET | The (approximate) target angle for the jetway wheels.: Units degrees: settable false |
| JETWAY WHEEL SPEED | trigger_JETWAY WHEEL SPEED | The current speed of the jetway wheels.: Units Meters per second: settable false |
| onChange_JETWAY WHEEL SPEED | trigger_onChange_JETWAY WHEEL SPEED | The current speed of the jetway wheels.: Units Meters per second: settable false |
| onRequest_JETWAY WHEEL SPEED | trigger_onRequest_JETWAY WHEEL SPEED | The current speed of the jetway wheels.: Units Meters per second: settable false |
| KOHLSMAN SETTING HG:index | trigger_KOHLSMAN SETTING HG:index | The value for the given altimeter index in inches of mercury.: Units Inches of Mercury: settable false |
| onChange_KOHLSMAN SETTING HG:index | trigger_onChange_KOHLSMAN SETTING HG:index | The value for the given altimeter index in inches of mercury.: Units Inches of Mercury: settable false |
| onRequest_KOHLSMAN SETTING HG:index | trigger_onRequest_KOHLSMAN SETTING HG:index | The value for the given altimeter index in inches of mercury.: Units Inches of Mercury: settable false |
| KOHLSMAN SETTING MB:index | trigger_KOHLSMAN SETTING MB:index | The value for the given altimeter index in millibars.: Units Millibars: settable false |
| onChange_KOHLSMAN SETTING MB:index | trigger_onChange_KOHLSMAN SETTING MB:index | The value for the given altimeter index in millibars.: Units Millibars: settable false |
| onRequest_KOHLSMAN SETTING MB:index | trigger_onRequest_KOHLSMAN SETTING MB:index | The value for the given altimeter index in millibars.: Units Millibars: settable false |
| KOHLSMAN SETTING STD:index | trigger_KOHLSMAN SETTING STD:index | True if the indexed altimeter is in"Standard" mode, or false otherwise.: Units bool: settable false |
| onChange_KOHLSMAN SETTING STD:index | trigger_onChange_KOHLSMAN SETTING STD:index | True if the indexed altimeter is in"Standard" mode, or false otherwise.: Units bool: settable false |
| onRequest_KOHLSMAN SETTING STD:index | trigger_onRequest_KOHLSMAN SETTING STD:index | True if the indexed altimeter is in"Standard" mode, or false otherwise.: Units bool: settable false |
| LAUNCHBAR HELD EXTENDED | trigger_LAUNCHBAR HELD EXTENDED | This will be True if the launchbar is fully extended, and can be used, for example, to change the color of an instrument light: Units bool: settable false |
| onChange_LAUNCHBAR HELD EXTENDED | trigger_onChange_LAUNCHBAR HELD EXTENDED | This will be True if the launchbar is fully extended, and can be used, for example, to change the color of an instrument light: Units bool: settable false |
| onRequest_LAUNCHBAR HELD EXTENDED | trigger_onRequest_LAUNCHBAR HELD EXTENDED | This will be True if the launchbar is fully extended, and can be used, for example, to change the color of an instrument light: Units bool: settable false |
| LAUNCHBAR POSITION | trigger_LAUNCHBAR POSITION | Installed on aircraft before takeoff from a carrier catapult. Note that gear cannot retract with this extended. 100 = fully extended: Units percent Over 100: settable false |
| onChange_LAUNCHBAR POSITION | trigger_onChange_LAUNCHBAR POSITION | Installed on aircraft before takeoff from a carrier catapult. Note that gear cannot retract with this extended. 100 = fully extended: Units percent Over 100: settable false |
| onRequest_LAUNCHBAR POSITION | trigger_onRequest_LAUNCHBAR POSITION | Installed on aircraft before takeoff from a carrier catapult. Note that gear cannot retract with this extended. 100 = fully extended: Units percent Over 100: settable false |
| LAUNCHBAR SWITCH | trigger_LAUNCHBAR SWITCH | If this is set to True the launch bar switch has been engaged: Units bool: settable false |
| onChange_LAUNCHBAR SWITCH | trigger_onChange_LAUNCHBAR SWITCH | If this is set to True the launch bar switch has been engaged: Units bool: settable false |
| onRequest_LAUNCHBAR SWITCH | trigger_onRequest_LAUNCHBAR SWITCH | If this is set to True the launch bar switch has been engaged: Units bool: settable false |
| LEADING EDGE FLAPS LEFT ANGLE | trigger_LEADING EDGE FLAPS LEFT ANGLE | Angle left leading edge flap extended. Use LEADING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| onChange_LEADING EDGE FLAPS LEFT ANGLE | trigger_onChange_LEADING EDGE FLAPS LEFT ANGLE | Angle left leading edge flap extended. Use LEADING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| onRequest_LEADING EDGE FLAPS LEFT ANGLE | trigger_onRequest_LEADING EDGE FLAPS LEFT ANGLE | Angle left leading edge flap extended. Use LEADING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| LEADING EDGE FLAPS LEFT INDEX | trigger_LEADING EDGE FLAPS LEFT INDEX | Index of left leading edge flap position: Units number: settable false |
| onChange_LEADING EDGE FLAPS LEFT INDEX | trigger_onChange_LEADING EDGE FLAPS LEFT INDEX | Index of left leading edge flap position: Units number: settable false |
| onRequest_LEADING EDGE FLAPS LEFT INDEX | trigger_onRequest_LEADING EDGE FLAPS LEFT INDEX | Index of left leading edge flap position: Units number: settable false |
| LEADING EDGE FLAPS LEFT PERCENT | trigger_LEADING EDGE FLAPS LEFT PERCENT | Percent left leading edge flap extended: Units percent Over 100: settable true |
| onChange_LEADING EDGE FLAPS LEFT PERCENT | trigger_onChange_LEADING EDGE FLAPS LEFT PERCENT | Percent left leading edge flap extended: Units percent Over 100: settable true |
| onRequest_LEADING EDGE FLAPS LEFT PERCENT | trigger_onRequest_LEADING EDGE FLAPS LEFT PERCENT | Percent left leading edge flap extended: Units percent Over 100: settable true |
| LEADING EDGE FLAPS RIGHT ANGLE | trigger_LEADING EDGE FLAPS RIGHT ANGLE | Angle right leading edge flap extended. Use LEADING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| onChange_LEADING EDGE FLAPS RIGHT ANGLE | trigger_onChange_LEADING EDGE FLAPS RIGHT ANGLE | Angle right leading edge flap extended. Use LEADING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| onRequest_LEADING EDGE FLAPS RIGHT ANGLE | trigger_onRequest_LEADING EDGE FLAPS RIGHT ANGLE | Angle right leading edge flap extended. Use LEADING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| LEADING EDGE FLAPS RIGHT INDEX | trigger_LEADING EDGE FLAPS RIGHT INDEX | Index of right leading edge flap position: Units number: settable false |
| onChange_LEADING EDGE FLAPS RIGHT INDEX | trigger_onChange_LEADING EDGE FLAPS RIGHT INDEX | Index of right leading edge flap position: Units number: settable false |
| onRequest_LEADING EDGE FLAPS RIGHT INDEX | trigger_onRequest_LEADING EDGE FLAPS RIGHT INDEX | Index of right leading edge flap position: Units number: settable false |
| LEADING EDGE FLAPS RIGHT PERCENT | trigger_LEADING EDGE FLAPS RIGHT PERCENT | Percent right leading edge flap extended: Units percent Over 100: settable true |
| onChange_LEADING EDGE FLAPS RIGHT PERCENT | trigger_onChange_LEADING EDGE FLAPS RIGHT PERCENT | Percent right leading edge flap extended: Units percent Over 100: settable true |
| onRequest_LEADING EDGE FLAPS RIGHT PERCENT | trigger_onRequest_LEADING EDGE FLAPS RIGHT PERCENT | Percent right leading edge flap extended: Units percent Over 100: settable true |
| LEFT WHEEL ROTATION ANGLE | trigger_LEFT WHEEL ROTATION ANGLE | Left wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onChange_LEFT WHEEL ROTATION ANGLE | trigger_onChange_LEFT WHEEL ROTATION ANGLE | Left wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onRequest_LEFT WHEEL ROTATION ANGLE | trigger_onRequest_LEFT WHEEL ROTATION ANGLE | Left wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| LEFT WHEEL RPM | trigger_LEFT WHEEL RPM | Left landing gear rpm: Units RPM: settable false |
| onChange_LEFT WHEEL RPM | trigger_onChange_LEFT WHEEL RPM | Left landing gear rpm: Units RPM: settable false |
| onRequest_LEFT WHEEL RPM | trigger_onRequest_LEFT WHEEL RPM | Left landing gear rpm: Units RPM: settable false |
| LIGHT BACKLIGHT INTENSITY | trigger_LIGHT BACKLIGHT INTENSITY | Vehicle backlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onChange_LIGHT BACKLIGHT INTENSITY | trigger_onChange_LIGHT BACKLIGHT INTENSITY | Vehicle backlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onRequest_LIGHT BACKLIGHT INTENSITY | trigger_onRequest_LIGHT BACKLIGHT INTENSITY | Vehicle backlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| LIGHT BEACON | trigger_LIGHT BEACON | Light switch state.: Units bool: settable true |
| onChange_LIGHT BEACON | trigger_onChange_LIGHT BEACON | Light switch state.: Units bool: settable true |
| onRequest_LIGHT BEACON | trigger_onRequest_LIGHT BEACON | Light switch state.: Units bool: settable true |
| LIGHT BEACON ON | trigger_LIGHT BEACON ON | Returns true if the target beacon light is functioning or if the switch is ON. Use beacon lightdef index.: Units bool: settable false |
| onChange_LIGHT BEACON ON | trigger_onChange_LIGHT BEACON ON | Returns true if the target beacon light is functioning or if the switch is ON. Use beacon lightdef index.: Units bool: settable false |
| onRequest_LIGHT BEACON ON | trigger_onRequest_LIGHT BEACON ON | Returns true if the target beacon light is functioning or if the switch is ON. Use beacon lightdef index.: Units bool: settable false |
| LIGHT BRAKE ON | trigger_LIGHT BRAKE ON | Returns true if the target brake light is functioning or if the switch is ON.: Units bool: settable false |
| onChange_LIGHT BRAKE ON | trigger_onChange_LIGHT BRAKE ON | Returns true if the target brake light is functioning or if the switch is ON.: Units bool: settable false |
| onRequest_LIGHT BRAKE ON | trigger_onRequest_LIGHT BRAKE ON | Returns true if the target brake light is functioning or if the switch is ON.: Units bool: settable false |
| LIGHT CABIN | trigger_LIGHT CABIN | Light switch state.: Units bool: settable true |
| onChange_LIGHT CABIN | trigger_onChange_LIGHT CABIN | Light switch state.: Units bool: settable true |
| onRequest_LIGHT CABIN | trigger_onRequest_LIGHT CABIN | Light switch state.: Units bool: settable true |
| LIGHT CABIN ON | trigger_LIGHT CABIN ON | Returns true if the target cabin light is functioning or if the switch is ON. Use the cabin lightdef index.: Units bool: settable false |
| onChange_LIGHT CABIN ON | trigger_onChange_LIGHT CABIN ON | Returns true if the target cabin light is functioning or if the switch is ON. Use the cabin lightdef index.: Units bool: settable false |
| onRequest_LIGHT CABIN ON | trigger_onRequest_LIGHT CABIN ON | Returns true if the target cabin light is functioning or if the switch is ON. Use the cabin lightdef index.: Units bool: settable false |
| LIGHT CABIN POWER SETTING | trigger_LIGHT CABIN POWER SETTING | The current cabin light power setting. Requires the cabin lightdef index.: Units percent: settable false |
| onChange_LIGHT CABIN POWER SETTING | trigger_onChange_LIGHT CABIN POWER SETTING | The current cabin light power setting. Requires the cabin lightdef index.: Units percent: settable false |
| onRequest_LIGHT CABIN POWER SETTING | trigger_onRequest_LIGHT CABIN POWER SETTING | The current cabin light power setting. Requires the cabin lightdef index.: Units percent: settable false |
| LIGHT GLARESHIELD | trigger_LIGHT GLARESHIELD | Whether or not the Light switch for the Glareshield is enabled.: Units bool: settable true |
| onChange_LIGHT GLARESHIELD | trigger_onChange_LIGHT GLARESHIELD | Whether or not the Light switch for the Glareshield is enabled.: Units bool: settable true |
| onRequest_LIGHT GLARESHIELD | trigger_onRequest_LIGHT GLARESHIELD | Whether or not the Light switch for the Glareshield is enabled.: Units bool: settable true |
| LIGHT GLARESHIELD ON | trigger_LIGHT GLARESHIELD ON | Returns true if the target glareshield light is functioning or if the switch is ON. Use the glareshield lightdef index.: Units bool: settable false |
| onChange_LIGHT GLARESHIELD ON | trigger_onChange_LIGHT GLARESHIELD ON | Returns true if the target glareshield light is functioning or if the switch is ON. Use the glareshield lightdef index.: Units bool: settable false |
| onRequest_LIGHT GLARESHIELD ON | trigger_onRequest_LIGHT GLARESHIELD ON | Returns true if the target glareshield light is functioning or if the switch is ON. Use the glareshield lightdef index.: Units bool: settable false |
| LIGHT GLARESHIELD POWER SETTING | trigger_LIGHT GLARESHIELD POWER SETTING | The current glareshield light power setting. Requires the glareshield lightdef index.: Units percent: settable false |
| onChange_LIGHT GLARESHIELD POWER SETTING | trigger_onChange_LIGHT GLARESHIELD POWER SETTING | The current glareshield light power setting. Requires the glareshield lightdef index.: Units percent: settable false |
| onRequest_LIGHT GLARESHIELD POWER SETTING | trigger_onRequest_LIGHT GLARESHIELD POWER SETTING | The current glareshield light power setting. Requires the glareshield lightdef index.: Units percent: settable false |
| LIGHT GYROLIGHT INTENSITY | trigger_LIGHT GYROLIGHT INTENSITY | Vehicle gyrolights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onChange_LIGHT GYROLIGHT INTENSITY | trigger_onChange_LIGHT GYROLIGHT INTENSITY | Vehicle gyrolights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onRequest_LIGHT GYROLIGHT INTENSITY | trigger_onRequest_LIGHT GYROLIGHT INTENSITY | Vehicle gyrolights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| LIGHT HEAD ON | trigger_LIGHT HEAD ON | Returns true if the target navigation light is functioning or if the switch is ON.: Units bool: settable false |
| onChange_LIGHT HEAD ON | trigger_onChange_LIGHT HEAD ON | Returns true if the target navigation light is functioning or if the switch is ON.: Units bool: settable false |
| onRequest_LIGHT HEAD ON | trigger_onRequest_LIGHT HEAD ON | Returns true if the target navigation light is functioning or if the switch is ON.: Units bool: settable false |
| LIGHT HEADLIGHT INTENSITY | trigger_LIGHT HEADLIGHT INTENSITY | Vehicle headlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onChange_LIGHT HEADLIGHT INTENSITY | trigger_onChange_LIGHT HEADLIGHT INTENSITY | Vehicle headlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| onRequest_LIGHT HEADLIGHT INTENSITY | trigger_onRequest_LIGHT HEADLIGHT INTENSITY | Vehicle headlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100: settable true |
| LIGHT LANDING | trigger_LIGHT LANDING | Light switch state for landing light.: Units bool: settable true |
| onChange_LIGHT LANDING | trigger_onChange_LIGHT LANDING | Light switch state for landing light.: Units bool: settable true |
| onRequest_LIGHT LANDING | trigger_onRequest_LIGHT LANDING | Light switch state for landing light.: Units bool: settable true |
| LIGHT LANDING ON | trigger_LIGHT LANDING ON | Returns true if the target landing light is functioning or if the switch is ON. Use landing lightdef index.: Units bool: settable false |
| onChange_LIGHT LANDING ON | trigger_onChange_LIGHT LANDING ON | Returns true if the target landing light is functioning or if the switch is ON. Use landing lightdef index.: Units bool: settable false |
| onRequest_LIGHT LANDING ON | trigger_onRequest_LIGHT LANDING ON | Returns true if the target landing light is functioning or if the switch is ON. Use landing lightdef index.: Units bool: settable false |
| LIGHT LOGO | trigger_LIGHT LOGO | Light switch state for logo light.: Units bool: settable true |
| onChange_LIGHT LOGO | trigger_onChange_LIGHT LOGO | Light switch state for logo light.: Units bool: settable true |
| onRequest_LIGHT LOGO | trigger_onRequest_LIGHT LOGO | Light switch state for logo light.: Units bool: settable true |
| LIGHT LOGO ON | trigger_LIGHT LOGO ON | Returns true if the target logo light is functioning or if the switch is ON. Use the logo lightdef index.: Units bool: settable false |
| onChange_LIGHT LOGO ON | trigger_onChange_LIGHT LOGO ON | Returns true if the target logo light is functioning or if the switch is ON. Use the logo lightdef index.: Units bool: settable false |
| onRequest_LIGHT LOGO ON | trigger_onRequest_LIGHT LOGO ON | Returns true if the target logo light is functioning or if the switch is ON. Use the logo lightdef index.: Units bool: settable false |
| LIGHT NAV | trigger_LIGHT NAV | Light switch state for the NAV light.: Units bool: settable true |
| onChange_LIGHT NAV | trigger_onChange_LIGHT NAV | Light switch state for the NAV light.: Units bool: settable true |
| onRequest_LIGHT NAV | trigger_onRequest_LIGHT NAV | Light switch state for the NAV light.: Units bool: settable true |
| LIGHT NAV ON | trigger_LIGHT NAV ON | Returns true if the target navigation light is functioning or if the switch is ON. Use navigation lightdef index.: Units bool: settable false |
| onChange_LIGHT NAV ON | trigger_onChange_LIGHT NAV ON | Returns true if the target navigation light is functioning or if the switch is ON. Use navigation lightdef index.: Units bool: settable false |
| onRequest_LIGHT NAV ON | trigger_onRequest_LIGHT NAV ON | Returns true if the target navigation light is functioning or if the switch is ON. Use navigation lightdef index.: Units bool: settable false |
| LIGHT ON STATES | trigger_LIGHT ON STATES | light on using bit mask (see documentation): Units mask: settable false |
| onChange_LIGHT ON STATES | trigger_onChange_LIGHT ON STATES | light on using bit mask (see documentation): Units mask: settable false |
| onRequest_LIGHT ON STATES | trigger_onRequest_LIGHT ON STATES | light on using bit mask (see documentation): Units mask: settable false |
| LIGHT PANEL | trigger_LIGHT PANEL | Light switch state of the panel light.: Units bool: settable true |
| onChange_LIGHT PANEL | trigger_onChange_LIGHT PANEL | Light switch state of the panel light.: Units bool: settable true |
| onRequest_LIGHT PANEL | trigger_onRequest_LIGHT PANEL | Light switch state of the panel light.: Units bool: settable true |
| LIGHT PANEL ON | trigger_LIGHT PANEL ON | Returns true if the target panel light is functioning or if the switch is ON. Use the panel lightdef index.: Units bool: settable false |
| onChange_LIGHT PANEL ON | trigger_onChange_LIGHT PANEL ON | Returns true if the target panel light is functioning or if the switch is ON. Use the panel lightdef index.: Units bool: settable false |
| onRequest_LIGHT PANEL ON | trigger_onRequest_LIGHT PANEL ON | Returns true if the target panel light is functioning or if the switch is ON. Use the panel lightdef index.: Units bool: settable false |
| LIGHT PANEL POWER SETTING | trigger_LIGHT PANEL POWER SETTING | The current panel light power setting. Requires the panel lightdef index.: Units percent: settable false |
| onChange_LIGHT PANEL POWER SETTING | trigger_onChange_LIGHT PANEL POWER SETTING | The current panel light power setting. Requires the panel lightdef index.: Units percent: settable false |
| onRequest_LIGHT PANEL POWER SETTING | trigger_onRequest_LIGHT PANEL POWER SETTING | The current panel light power setting. Requires the panel lightdef index.: Units percent: settable false |
| LIGHT PEDESTRAL | trigger_LIGHT PEDESTRAL | Whether or not the Light switch for the Pedestal is enabled.: Units bool: settable true |
| onChange_LIGHT PEDESTRAL | trigger_onChange_LIGHT PEDESTRAL | Whether or not the Light switch for the Pedestal is enabled.: Units bool: settable true |
| onRequest_LIGHT PEDESTRAL | trigger_onRequest_LIGHT PEDESTRAL | Whether or not the Light switch for the Pedestal is enabled.: Units bool: settable true |
| LIGHT PEDESTRAL ON | trigger_LIGHT PEDESTRAL ON | Returns true if the target pedestral light is functioning or if the switch is ON. Requires the pedestral lightdef index.: Units bool: settable false |
| onChange_LIGHT PEDESTRAL ON | trigger_onChange_LIGHT PEDESTRAL ON | Returns true if the target pedestral light is functioning or if the switch is ON. Requires the pedestral lightdef index.: Units bool: settable false |
| onRequest_LIGHT PEDESTRAL ON | trigger_onRequest_LIGHT PEDESTRAL ON | Returns true if the target pedestral light is functioning or if the switch is ON. Requires the pedestral lightdef index.: Units bool: settable false |
| LIGHT PEDESTRAL POWER SETTING | trigger_LIGHT PEDESTRAL POWER SETTING | The current pedestral light power setting. Requires the pedestral lightdef index.: Units percent: settable false |
| onChange_LIGHT PEDESTRAL POWER SETTING | trigger_onChange_LIGHT PEDESTRAL POWER SETTING | The current pedestral light power setting. Requires the pedestral lightdef index.: Units percent: settable false |
| onRequest_LIGHT PEDESTRAL POWER SETTING | trigger_onRequest_LIGHT PEDESTRAL POWER SETTING | The current pedestral light power setting. Requires the pedestral lightdef index.: Units percent: settable false |
| LIGHT POTENTIOMETER:index | trigger_LIGHT POTENTIOMETER:index | Adjust the potentiometer of the indexed lighting. Index is defined in the appropriate lightdef hashmap setting.: Units percent Over 100: settable false |
| onChange_LIGHT POTENTIOMETER:index | trigger_onChange_LIGHT POTENTIOMETER:index | Adjust the potentiometer of the indexed lighting. Index is defined in the appropriate lightdef hashmap setting.: Units percent Over 100: settable false |
| onRequest_LIGHT POTENTIOMETER:index | trigger_onRequest_LIGHT POTENTIOMETER:index | Adjust the potentiometer of the indexed lighting. Index is defined in the appropriate lightdef hashmap setting.: Units percent Over 100: settable false |
| LIGHT RECOGNITION | trigger_LIGHT RECOGNITION | Light switch state for the recognition light.: Units bool: settable true |
| onChange_LIGHT RECOGNITION | trigger_onChange_LIGHT RECOGNITION | Light switch state for the recognition light.: Units bool: settable true |
| onRequest_LIGHT RECOGNITION | trigger_onRequest_LIGHT RECOGNITION | Light switch state for the recognition light.: Units bool: settable true |
| LIGHT RECOGNITION ON | trigger_LIGHT RECOGNITION ON | Returns true if the target recognition light is functioning or if the switch is ON. Use the recognition lightdef index.: Units bool: settable false |
| onChange_LIGHT RECOGNITION ON | trigger_onChange_LIGHT RECOGNITION ON | Returns true if the target recognition light is functioning or if the switch is ON. Use the recognition lightdef index.: Units bool: settable false |
| onRequest_LIGHT RECOGNITION ON | trigger_onRequest_LIGHT RECOGNITION ON | Returns true if the target recognition light is functioning or if the switch is ON. Use the recognition lightdef index.: Units bool: settable false |
| LIGHT STATES | trigger_LIGHT STATES | Same as LIGHT_ON_STATES.: Units mask: settable false |
| onChange_LIGHT STATES | trigger_onChange_LIGHT STATES | Same as LIGHT_ON_STATES.: Units mask: settable false |
| onRequest_LIGHT STATES | trigger_onRequest_LIGHT STATES | Same as LIGHT_ON_STATES.: Units mask: settable false |
| LIGHT STROBE | trigger_LIGHT STROBE | Light switch state.: Units bool: settable true |
| onChange_LIGHT STROBE | trigger_onChange_LIGHT STROBE | Light switch state.: Units bool: settable true |
| onRequest_LIGHT STROBE | trigger_onRequest_LIGHT STROBE | Light switch state.: Units bool: settable true |
| LIGHT STROBE ON | trigger_LIGHT STROBE ON | Returns true if the target strobe light is functioning or if the switch is ON. Use the strobe lightdef index.: Units bool: settable false |
| onChange_LIGHT STROBE ON | trigger_onChange_LIGHT STROBE ON | Returns true if the target strobe light is functioning or if the switch is ON. Use the strobe lightdef index.: Units bool: settable false |
| onRequest_LIGHT STROBE ON | trigger_onRequest_LIGHT STROBE ON | Returns true if the target strobe light is functioning or if the switch is ON. Use the strobe lightdef index.: Units bool: settable false |
| LIGHT TAXI | trigger_LIGHT TAXI | Light switch state for the taxi light.: Units bool: settable true |
| onChange_LIGHT TAXI | trigger_onChange_LIGHT TAXI | Light switch state for the taxi light.: Units bool: settable true |
| onRequest_LIGHT TAXI | trigger_onRequest_LIGHT TAXI | Light switch state for the taxi light.: Units bool: settable true |
| LIGHT TAXI ON | trigger_LIGHT TAXI ON | Returns true if the target taxi light is functioning or if the switch is ON. Use taxi lightdef index.: Units bool: settable false |
| onChange_LIGHT TAXI ON | trigger_onChange_LIGHT TAXI ON | Returns true if the target taxi light is functioning or if the switch is ON. Use taxi lightdef index.: Units bool: settable false |
| onRequest_LIGHT TAXI ON | trigger_onRequest_LIGHT TAXI ON | Returns true if the target taxi light is functioning or if the switch is ON. Use taxi lightdef index.: Units bool: settable false |
| LIGHT WING | trigger_LIGHT WING | Light switch state for the wing lights.: Units bool: settable true |
| onChange_LIGHT WING | trigger_onChange_LIGHT WING | Light switch state for the wing lights.: Units bool: settable true |
| onRequest_LIGHT WING | trigger_onRequest_LIGHT WING | Light switch state for the wing lights.: Units bool: settable true |
| LIGHT WING ON | trigger_LIGHT WING ON | Returns true if the target wing light is functioning or if the switch is ON. Use the wing lightdef index.: Units bool: settable false |
| onChange_LIGHT WING ON | trigger_onChange_LIGHT WING ON | Returns true if the target wing light is functioning or if the switch is ON. Use the wing lightdef index.: Units bool: settable false |
| onRequest_LIGHT WING ON | trigger_onRequest_LIGHT WING ON | Returns true if the target wing light is functioning or if the switch is ON. Use the wing lightdef index.: Units bool: settable false |
| LINEAR CL ALPHA | trigger_LINEAR CL ALPHA | Linear CL alpha: Units per radian: settable false |
| onChange_LINEAR CL ALPHA | trigger_onChange_LINEAR CL ALPHA | Linear CL alpha: Units per radian: settable false |
| onRequest_LINEAR CL ALPHA | trigger_onRequest_LINEAR CL ALPHA | Linear CL alpha: Units per radian: settable false |
| MACH MAX OPERATE | trigger_MACH MAX OPERATE | Maximum design mach: Units mach: settable false |
| onChange_MACH MAX OPERATE | trigger_onChange_MACH MAX OPERATE | Maximum design mach: Units mach: settable false |
| onRequest_MACH MAX OPERATE | trigger_onRequest_MACH MAX OPERATE | Maximum design mach: Units mach: settable false |
| MAGNETIC COMPASS | trigger_MAGNETIC COMPASS | Compass reading.: Units degrees: settable true |
| onChange_MAGNETIC COMPASS | trigger_onChange_MAGNETIC COMPASS | Compass reading.: Units degrees: settable true |
| onRequest_MAGNETIC COMPASS | trigger_onRequest_MAGNETIC COMPASS | Compass reading.: Units degrees: settable true |
| MAGVAR | trigger_MAGVAR | Magnetic variation.: Units degrees: settable false |
| onChange_MAGVAR | trigger_onChange_MAGVAR | Magnetic variation.: Units degrees: settable false |
| onRequest_MAGVAR | trigger_onRequest_MAGVAR | Magnetic variation.: Units degrees: settable false |
| MANUAL FUEL PUMP HANDLE | trigger_MANUAL FUEL PUMP HANDLE | Position of manual fuel pump handle. 1 is fully deployed.: Units percent Over 100: settable false |
| onChange_MANUAL FUEL PUMP HANDLE | trigger_onChange_MANUAL FUEL PUMP HANDLE | Position of manual fuel pump handle. 1 is fully deployed.: Units percent Over 100: settable false |
| onRequest_MANUAL FUEL PUMP HANDLE | trigger_onRequest_MANUAL FUEL PUMP HANDLE | Position of manual fuel pump handle. 1 is fully deployed.: Units percent Over 100: settable false |
| MANUAL INSTRUMENT LIGHTS | trigger_MANUAL INSTRUMENT LIGHTS | True if instrument lights are set manually.: Units bool: settable false |
| onChange_MANUAL INSTRUMENT LIGHTS | trigger_onChange_MANUAL INSTRUMENT LIGHTS | True if instrument lights are set manually.: Units bool: settable false |
| onRequest_MANUAL INSTRUMENT LIGHTS | trigger_onRequest_MANUAL INSTRUMENT LIGHTS | True if instrument lights are set manually.: Units bool: settable false |
| MARKER AVAILABLE | trigger_MARKER AVAILABLE | True if Marker is available.: Units bool: settable false |
| onChange_MARKER AVAILABLE | trigger_onChange_MARKER AVAILABLE | True if Marker is available.: Units bool: settable false |
| onRequest_MARKER AVAILABLE | trigger_onRequest_MARKER AVAILABLE | True if Marker is available.: Units bool: settable false |
| MARKER BEACON SENSITIVITY HIGH | trigger_MARKER BEACON SENSITIVITY HIGH | Whether or not the Marker Beacon is in High Sensitivity mode.: Units bool: settable false |
| onChange_MARKER BEACON SENSITIVITY HIGH | trigger_onChange_MARKER BEACON SENSITIVITY HIGH | Whether or not the Marker Beacon is in High Sensitivity mode.: Units bool: settable false |
| onRequest_MARKER BEACON SENSITIVITY HIGH | trigger_onRequest_MARKER BEACON SENSITIVITY HIGH | Whether or not the Marker Beacon is in High Sensitivity mode.: Units bool: settable false |
| MARKER BEACON STATE | trigger_MARKER BEACON STATE | Marker beacon state.: Units enum: settable true |
| onChange_MARKER BEACON STATE | trigger_onChange_MARKER BEACON STATE | Marker beacon state.: Units enum: settable true |
| onRequest_MARKER BEACON STATE | trigger_onRequest_MARKER BEACON STATE | Marker beacon state.: Units enum: settable true |
| MARKER BEACON TEST MUTE | trigger_MARKER BEACON TEST MUTE | Whether or not the Marker Beacon is in Test/Mute mode.: Units bool: settable false |
| onChange_MARKER BEACON TEST MUTE | trigger_onChange_MARKER BEACON TEST MUTE | Whether or not the Marker Beacon is in Test/Mute mode.: Units bool: settable false |
| onRequest_MARKER BEACON TEST MUTE | trigger_onRequest_MARKER BEACON TEST MUTE | Whether or not the Marker Beacon is in Test/Mute mode.: Units bool: settable false |
| MARKER SOUND | trigger_MARKER SOUND | Marker audio flag.: Units bool: settable false |
| onChange_MARKER SOUND | trigger_onChange_MARKER SOUND | Marker audio flag.: Units bool: settable false |
| onRequest_MARKER SOUND | trigger_onRequest_MARKER SOUND | Marker audio flag.: Units bool: settable false |
| MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | trigger_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | Currently not used in the simulation.: Units degrees: settable false |
| onChange_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | trigger_onChange_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | Currently not used in the simulation.: Units degrees: settable false |
| onRequest_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | trigger_onRequest_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE | Currently not used in the simulation.: Units degrees: settable false |
| MARSHALLER AIRCRAFT DISTANCE | trigger_MARSHALLER AIRCRAFT DISTANCE | The distance between the Marshaller and the aircraft.: Units meters: settable false |
| onChange_MARSHALLER AIRCRAFT DISTANCE | trigger_onChange_MARSHALLER AIRCRAFT DISTANCE | The distance between the Marshaller and the aircraft.: Units meters: settable false |
| onRequest_MARSHALLER AIRCRAFT DISTANCE | trigger_onRequest_MARSHALLER AIRCRAFT DISTANCE | The distance between the Marshaller and the aircraft.: Units meters: settable false |
| MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | trigger_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | Position on the X axis of the aircraft in the parking space (negative means the aircraft is on the left side and positive the right side).: Units meters: settable false |
| onChange_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | trigger_onChange_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | Position on the X axis of the aircraft in the parking space (negative means the aircraft is on the left side and positive the right side).: Units meters: settable false |
| onRequest_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | trigger_onRequest_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE | Position on the X axis of the aircraft in the parking space (negative means the aircraft is on the left side and positive the right side).: Units meters: settable false |
| MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | trigger_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | Position on the Z axis of the aircraft in the parking space (negative means the aircraft is behind the parking space and positive is in front of the parking space).: Units meters: settable false |
| onChange_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | trigger_onChange_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | Position on the Z axis of the aircraft in the parking space (negative means the aircraft is behind the parking space and positive is in front of the parking space).: Units meters: settable false |
| onRequest_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | trigger_onRequest_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE | Position on the Z axis of the aircraft in the parking space (negative means the aircraft is behind the parking space and positive is in front of the parking space).: Units meters: settable false |
| MARSHALLER AIRCRAFT ENGINE SHUTDOWN | trigger_MARSHALLER AIRCRAFT ENGINE SHUTDOWN | True if the engine(s) of the aircraft is (are) shut down.: Units bool: settable false |
| onChange_MARSHALLER AIRCRAFT ENGINE SHUTDOWN | trigger_onChange_MARSHALLER AIRCRAFT ENGINE SHUTDOWN | True if the engine(s) of the aircraft is (are) shut down.: Units bool: settable false |
| onRequest_MARSHALLER AIRCRAFT ENGINE SHUTDOWN | trigger_onRequest_MARSHALLER AIRCRAFT ENGINE SHUTDOWN | True if the engine(s) of the aircraft is (are) shut down.: Units bool: settable false |
| MARSHALLER AIRCRAFT HEADING PARKINGSPACE | trigger_MARSHALLER AIRCRAFT HEADING PARKINGSPACE | Angle between the direction of the aircraft and the direction of the parking place.: Units degrees: settable false |
| onChange_MARSHALLER AIRCRAFT HEADING PARKINGSPACE | trigger_onChange_MARSHALLER AIRCRAFT HEADING PARKINGSPACE | Angle between the direction of the aircraft and the direction of the parking place.: Units degrees: settable false |
| onRequest_MARSHALLER AIRCRAFT HEADING PARKINGSPACE | trigger_onRequest_MARSHALLER AIRCRAFT HEADING PARKINGSPACE | Angle between the direction of the aircraft and the direction of the parking place.: Units degrees: settable false |
| MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | trigger_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | Value in Z axis of the projection from the aircraft position following the heading of the aircraft.  : Units meters: settable false |
| onChange_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | trigger_onChange_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | Value in Z axis of the projection from the aircraft position following the heading of the aircraft.  : Units meters: settable false |
| onRequest_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | trigger_onRequest_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE | Value in Z axis of the projection from the aircraft position following the heading of the aircraft.  : Units meters: settable false |
| MARSHALLER AIRCRAFT VELOCITY | trigger_MARSHALLER AIRCRAFT VELOCITY | The velocity of the aircraft.: Units knots: settable false |
| onChange_MARSHALLER AIRCRAFT VELOCITY | trigger_onChange_MARSHALLER AIRCRAFT VELOCITY | The velocity of the aircraft.: Units knots: settable false |
| onRequest_MARSHALLER AIRCRAFT VELOCITY | trigger_onRequest_MARSHALLER AIRCRAFT VELOCITY | The velocity of the aircraft.: Units knots: settable false |
| MASTER IGNITION SWITCH | trigger_MASTER IGNITION SWITCH | Aircraft master ignition switch (grounds all engines magnetos): Units bool: settable false |
| onChange_MASTER IGNITION SWITCH | trigger_onChange_MASTER IGNITION SWITCH | Aircraft master ignition switch (grounds all engines magnetos): Units bool: settable false |
| onRequest_MASTER IGNITION SWITCH | trigger_onRequest_MASTER IGNITION SWITCH | Aircraft master ignition switch (grounds all engines magnetos): Units bool: settable false |
| MAX EGT | trigger_MAX EGT | The maximum EGT, as set using the egt_peak_temperature parameter in the engine.cfg file: Units rankine: settable false |
| onChange_MAX EGT | trigger_onChange_MAX EGT | The maximum EGT, as set using the egt_peak_temperature parameter in the engine.cfg file: Units rankine: settable false |
| onRequest_MAX EGT | trigger_onRequest_MAX EGT | The maximum EGT, as set using the egt_peak_temperature parameter in the engine.cfg file: Units rankine: settable false |
| MAX G FORCE | trigger_MAX G FORCE | Maximum G force attained: Units gforce: settable false |
| onChange_MAX G FORCE | trigger_onChange_MAX G FORCE | Maximum G force attained: Units gforce: settable false |
| onRequest_MAX G FORCE | trigger_onRequest_MAX G FORCE | Maximum G force attained: Units gforce: settable false |
| MAX GROSS WEIGHT | trigger_MAX GROSS WEIGHT | Maximum gross weight of the aircaft: Units pounds: settable false |
| onChange_MAX GROSS WEIGHT | trigger_onChange_MAX GROSS WEIGHT | Maximum gross weight of the aircaft: Units pounds: settable false |
| onRequest_MAX GROSS WEIGHT | trigger_onRequest_MAX GROSS WEIGHT | Maximum gross weight of the aircaft: Units pounds: settable false |
| MAX OIL TEMPERATURE | trigger_MAX OIL TEMPERATURE | The maximum oil temperature, as set using the parameter oil_temp_heating_constant in the engine.cfg file: Units rankine: settable false |
| onChange_MAX OIL TEMPERATURE | trigger_onChange_MAX OIL TEMPERATURE | The maximum oil temperature, as set using the parameter oil_temp_heating_constant in the engine.cfg file: Units rankine: settable false |
| onRequest_MAX OIL TEMPERATURE | trigger_onRequest_MAX OIL TEMPERATURE | The maximum oil temperature, as set using the parameter oil_temp_heating_constant in the engine.cfg file: Units rankine: settable false |
| MAX RATED ENGINE RPM | trigger_MAX RATED ENGINE RPM | Maximum rated rpm for the indexed engine: Units RPM: settable false |
| onChange_MAX RATED ENGINE RPM | trigger_onChange_MAX RATED ENGINE RPM | Maximum rated rpm for the indexed engine: Units RPM: settable false |
| onRequest_MAX RATED ENGINE RPM | trigger_onRequest_MAX RATED ENGINE RPM | Maximum rated rpm for the indexed engine: Units RPM: settable false |
| MIDDLE MARKER | trigger_MIDDLE MARKER | Middle marker state.: Units bool: settable true |
| onChange_MIDDLE MARKER | trigger_onChange_MIDDLE MARKER | Middle marker state.: Units bool: settable true |
| onRequest_MIDDLE MARKER | trigger_onRequest_MIDDLE MARKER | Middle marker state.: Units bool: settable true |
| MIN DRAG VELOCITY | trigger_MIN DRAG VELOCITY | Minimum drag velocity, in clean, with no input and no gears, when at 10000ft.: Units feet: settable false |
| onChange_MIN DRAG VELOCITY | trigger_onChange_MIN DRAG VELOCITY | Minimum drag velocity, in clean, with no input and no gears, when at 10000ft.: Units feet: settable false |
| onRequest_MIN DRAG VELOCITY | trigger_onRequest_MIN DRAG VELOCITY | Minimum drag velocity, in clean, with no input and no gears, when at 10000ft.: Units feet: settable false |
| MIN G FORCE | trigger_MIN G FORCE | Minimum G force attained: Units gforce: settable false |
| onChange_MIN G FORCE | trigger_onChange_MIN G FORCE | Minimum G force attained: Units gforce: settable false |
| onRequest_MIN G FORCE | trigger_onRequest_MIN G FORCE | Minimum G force attained: Units gforce: settable false |
| MISSION SCORE | trigger_MISSION SCORE | : Units number: settable true |
| onChange_MISSION SCORE | trigger_onChange_MISSION SCORE | : Units number: settable true |
| onRequest_MISSION SCORE | trigger_onRequest_MISSION SCORE | : Units number: settable true |
| NAV ACTIVE FREQUENCY:index | trigger_NAV ACTIVE FREQUENCY:index | Nav active frequency. Index is 1 or 2.: Units MHz: settable false |
| onChange_NAV ACTIVE FREQUENCY:index | trigger_onChange_NAV ACTIVE FREQUENCY:index | Nav active frequency. Index is 1 or 2.: Units MHz: settable false |
| onRequest_NAV ACTIVE FREQUENCY:index | trigger_onRequest_NAV ACTIVE FREQUENCY:index | Nav active frequency. Index is 1 or 2.: Units MHz: settable false |
| NAV AVAILABLE:index | trigger_NAV AVAILABLE:index | Flag if Nav equipped on aircraft.: Units bool: settable false |
| onChange_NAV AVAILABLE:index | trigger_onChange_NAV AVAILABLE:index | Flag if Nav equipped on aircraft.: Units bool: settable false |
| onRequest_NAV AVAILABLE:index | trigger_onRequest_NAV AVAILABLE:index | Flag if Nav equipped on aircraft.: Units bool: settable false |
| NAV BACK COURSE FLAGS:index | trigger_NAV BACK COURSE FLAGS:index | Returns the listed bit flags.: Units Flags: settable false |
| onChange_NAV BACK COURSE FLAGS:index | trigger_onChange_NAV BACK COURSE FLAGS:index | Returns the listed bit flags.: Units Flags: settable false |
| onRequest_NAV BACK COURSE FLAGS:index | trigger_onRequest_NAV BACK COURSE FLAGS:index | Returns the listed bit flags.: Units Flags: settable false |
| NAV CDI:index | trigger_NAV CDI:index | CDI needle deflection (+/- 127).: Units number: settable false |
| onChange_NAV CDI:index | trigger_onChange_NAV CDI:index | CDI needle deflection (+/- 127).: Units number: settable false |
| onRequest_NAV CDI:index | trigger_onRequest_NAV CDI:index | CDI needle deflection (+/- 127).: Units number: settable false |
| NAV CLOSE DME:index | trigger_NAV CLOSE DME:index | Closest DME distance. Requires an index value from 1 to 4 to set which NAV to target.: Units nautical miles: settable false |
| onChange_NAV CLOSE DME:index | trigger_onChange_NAV CLOSE DME:index | Closest DME distance. Requires an index value from 1 to 4 to set which NAV to target.: Units nautical miles: settable false |
| onRequest_NAV CLOSE DME:index | trigger_onRequest_NAV CLOSE DME:index | Closest DME distance. Requires an index value from 1 to 4 to set which NAV to target.: Units nautical miles: settable false |
| NAV CLOSE FREQUENCY:index | trigger_NAV CLOSE FREQUENCY:index | Closest Localizer course frequency. Requires an index value from 1 to 4 to set which NAV to target.: Units Hz: settable false |
| onChange_NAV CLOSE FREQUENCY:index | trigger_onChange_NAV CLOSE FREQUENCY:index | Closest Localizer course frequency. Requires an index value from 1 to 4 to set which NAV to target.: Units Hz: settable false |
| onRequest_NAV CLOSE FREQUENCY:index | trigger_onRequest_NAV CLOSE FREQUENCY:index | Closest Localizer course frequency. Requires an index value from 1 to 4 to set which NAV to target.: Units Hz: settable false |
| NAV CLOSE IDENT:index | trigger_NAV CLOSE IDENT:index | ICAO code. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| onChange_NAV CLOSE IDENT:index | trigger_onChange_NAV CLOSE IDENT:index | ICAO code. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| onRequest_NAV CLOSE IDENT:index | trigger_onRequest_NAV CLOSE IDENT:index | ICAO code. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| NAV CLOSE LOCALIZER:index | trigger_NAV CLOSE LOCALIZER:index | Closest Localizer course heading. Requires an index value from 1 to 4 to set which NAV to target.: Units degrees: settable false |
| onChange_NAV CLOSE LOCALIZER:index | trigger_onChange_NAV CLOSE LOCALIZER:index | Closest Localizer course heading. Requires an index value from 1 to 4 to set which NAV to target.: Units degrees: settable false |
| onRequest_NAV CLOSE LOCALIZER:index | trigger_onRequest_NAV CLOSE LOCALIZER:index | Closest Localizer course heading. Requires an index value from 1 to 4 to set which NAV to target.: Units degrees: settable false |
| NAV CLOSE NAME:index | trigger_NAV CLOSE NAME:index | Descriptive name. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| onChange_NAV CLOSE NAME:index | trigger_onChange_NAV CLOSE NAME:index | Descriptive name. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| onRequest_NAV CLOSE NAME:index | trigger_onRequest_NAV CLOSE NAME:index | Descriptive name. Requires an index value from 1 to 4 to set which NAV to target.: Units null: settable false |
| NAV CODES | trigger_NAV CODES | Returns bit flags with the listed meaning.: Units Flags: settable false |
| onChange_NAV CODES | trigger_onChange_NAV CODES | Returns bit flags with the listed meaning.: Units Flags: settable false |
| onRequest_NAV CODES | trigger_onRequest_NAV CODES | Returns bit flags with the listed meaning.: Units Flags: settable false |
| NAV DME | trigger_NAV DME | DME distance.: Units nautical miles: settable false |
| onChange_NAV DME | trigger_onChange_NAV DME | DME distance.: Units nautical miles: settable false |
| onRequest_NAV DME | trigger_onRequest_NAV DME | DME distance.: Units nautical miles: settable false |
| NAV DMESPEED | trigger_NAV DMESPEED | DME speed.: Units knots: settable false |
| onChange_NAV DMESPEED | trigger_onChange_NAV DMESPEED | DME speed.: Units knots: settable false |
| onRequest_NAV DMESPEED | trigger_onRequest_NAV DMESPEED | DME speed.: Units knots: settable false |
| NAV FREQUENCY | trigger_NAV FREQUENCY | Localizer course frequency: Units Hz: settable false |
| onChange_NAV FREQUENCY | trigger_onChange_NAV FREQUENCY | Localizer course frequency: Units Hz: settable false |
| onRequest_NAV FREQUENCY | trigger_onRequest_NAV FREQUENCY | Localizer course frequency: Units Hz: settable false |
| NAV GLIDE SLOPE | trigger_NAV GLIDE SLOPE | The glide slope gradient. The value returned is an integer value formed as sin(slope) * 65536 * 2: Units number: settable false |
| onChange_NAV GLIDE SLOPE | trigger_onChange_NAV GLIDE SLOPE | The glide slope gradient. The value returned is an integer value formed as sin(slope) * 65536 * 2: Units number: settable false |
| onRequest_NAV GLIDE SLOPE | trigger_onRequest_NAV GLIDE SLOPE | The glide slope gradient. The value returned is an integer value formed as sin(slope) * 65536 * 2: Units number: settable false |
| NAV GLIDE SLOPE ERROR | trigger_NAV GLIDE SLOPE ERROR | Difference between current position and glideslope angle. Note that this provides 32 bit floating point precision, rather than the 8 bit integer precision of NAV GSI.: Units degrees: settable false |
| onChange_NAV GLIDE SLOPE ERROR | trigger_onChange_NAV GLIDE SLOPE ERROR | Difference between current position and glideslope angle. Note that this provides 32 bit floating point precision, rather than the 8 bit integer precision of NAV GSI.: Units degrees: settable false |
| onRequest_NAV GLIDE SLOPE ERROR | trigger_onRequest_NAV GLIDE SLOPE ERROR | Difference between current position and glideslope angle. Note that this provides 32 bit floating point precision, rather than the 8 bit integer precision of NAV GSI.: Units degrees: settable false |
| NAV GLIDE SLOPE LENGTH | trigger_NAV GLIDE SLOPE LENGTH | The distance between the plane and the Glide beacon.: Units feet: settable false |
| onChange_NAV GLIDE SLOPE LENGTH | trigger_onChange_NAV GLIDE SLOPE LENGTH | The distance between the plane and the Glide beacon.: Units feet: settable false |
| onRequest_NAV GLIDE SLOPE LENGTH | trigger_onRequest_NAV GLIDE SLOPE LENGTH | The distance between the plane and the Glide beacon.: Units feet: settable false |
| NAV GS FLAG | trigger_NAV GS FLAG | Glideslope flag.: Units bool: settable false |
| onChange_NAV GS FLAG | trigger_onChange_NAV GS FLAG | Glideslope flag.: Units bool: settable false |
| onRequest_NAV GS FLAG | trigger_onRequest_NAV GS FLAG | Glideslope flag.: Units bool: settable false |
| NAV GSI | trigger_NAV GSI | Glideslope needle deflection (+/- 119). Note that this provides only 8 bit precision, whereas NAV GLIDE SLOPE ERROR provides 32 bit floating point precision.: Units number: settable false |
| onChange_NAV GSI | trigger_onChange_NAV GSI | Glideslope needle deflection (+/- 119). Note that this provides only 8 bit precision, whereas NAV GLIDE SLOPE ERROR provides 32 bit floating point precision.: Units number: settable false |
| onRequest_NAV GSI | trigger_onRequest_NAV GSI | Glideslope needle deflection (+/- 119). Note that this provides only 8 bit precision, whereas NAV GLIDE SLOPE ERROR provides 32 bit floating point precision.: Units number: settable false |
| NAV HAS CLOSE DME | trigger_NAV HAS CLOSE DME | Flag if found a close station with a DME.: Units bool: settable false |
| onChange_NAV HAS CLOSE DME | trigger_onChange_NAV HAS CLOSE DME | Flag if found a close station with a DME.: Units bool: settable false |
| onRequest_NAV HAS CLOSE DME | trigger_onRequest_NAV HAS CLOSE DME | Flag if found a close station with a DME.: Units bool: settable false |
| NAV HAS CLOSE LOCALIZER | trigger_NAV HAS CLOSE LOCALIZER | Flag if found a close localizer station.: Units bool: settable false |
| onChange_NAV HAS CLOSE LOCALIZER | trigger_onChange_NAV HAS CLOSE LOCALIZER | Flag if found a close localizer station.: Units bool: settable false |
| onRequest_NAV HAS CLOSE LOCALIZER | trigger_onRequest_NAV HAS CLOSE LOCALIZER | Flag if found a close localizer station.: Units bool: settable false |
| NAV HAS DME | trigger_NAV HAS DME | Flag if tuned station has a DME.: Units bool: settable false |
| onChange_NAV HAS DME | trigger_onChange_NAV HAS DME | Flag if tuned station has a DME.: Units bool: settable false |
| onRequest_NAV HAS DME | trigger_onRequest_NAV HAS DME | Flag if tuned station has a DME.: Units bool: settable false |
| NAV HAS GLIDE SLOPE | trigger_NAV HAS GLIDE SLOPE | Flag if tuned station has a glide slope.: Units bool: settable false |
| onChange_NAV HAS GLIDE SLOPE | trigger_onChange_NAV HAS GLIDE SLOPE | Flag if tuned station has a glide slope.: Units bool: settable false |
| onRequest_NAV HAS GLIDE SLOPE | trigger_onRequest_NAV HAS GLIDE SLOPE | Flag if tuned station has a glide slope.: Units bool: settable false |
| NAV HAS LOCALIZER | trigger_NAV HAS LOCALIZER | Flag if tuned station is a localizer.: Units bool: settable false |
| onChange_NAV HAS LOCALIZER | trigger_onChange_NAV HAS LOCALIZER | Flag if tuned station is a localizer.: Units bool: settable false |
| onRequest_NAV HAS LOCALIZER | trigger_onRequest_NAV HAS LOCALIZER | Flag if tuned station is a localizer.: Units bool: settable false |
| NAV HAS NAV | trigger_NAV HAS NAV | Flag if Nav has signal.: Units bool: settable false |
| onChange_NAV HAS NAV | trigger_onChange_NAV HAS NAV | Flag if Nav has signal.: Units bool: settable false |
| onRequest_NAV HAS NAV | trigger_onRequest_NAV HAS NAV | Flag if Nav has signal.: Units bool: settable false |
| NAV HAS TACAN | trigger_NAV HAS TACAN | Flag if Nav has a Tacan.: Units bool: settable false |
| onChange_NAV HAS TACAN | trigger_onChange_NAV HAS TACAN | Flag if Nav has a Tacan.: Units bool: settable false |
| onRequest_NAV HAS TACAN | trigger_onRequest_NAV HAS TACAN | Flag if Nav has a Tacan.: Units bool: settable false |
| NAV IDENT | trigger_NAV IDENT | ICAO code.: Units null: settable false |
| onChange_NAV IDENT | trigger_onChange_NAV IDENT | ICAO code.: Units null: settable false |
| onRequest_NAV IDENT | trigger_onRequest_NAV IDENT | ICAO code.: Units null: settable false |
| NAV LOC AIRPORT IDENT | trigger_NAV LOC AIRPORT IDENT | The airport ICAO ident for the localizer that is currently tuned on the nav radio (like 'EGLL' or 'KJFK'): Units null: settable false |
| onChange_NAV LOC AIRPORT IDENT | trigger_onChange_NAV LOC AIRPORT IDENT | The airport ICAO ident for the localizer that is currently tuned on the nav radio (like 'EGLL' or 'KJFK'): Units null: settable false |
| onRequest_NAV LOC AIRPORT IDENT | trigger_onRequest_NAV LOC AIRPORT IDENT | The airport ICAO ident for the localizer that is currently tuned on the nav radio (like 'EGLL' or 'KJFK'): Units null: settable false |
| NAV LOC RUNWAY DESIGNATOR | trigger_NAV LOC RUNWAY DESIGNATOR | The letter code for the runway that the currently tuned localizer is tuned to.: Units null: settable false |
| onChange_NAV LOC RUNWAY DESIGNATOR | trigger_onChange_NAV LOC RUNWAY DESIGNATOR | The letter code for the runway that the currently tuned localizer is tuned to.: Units null: settable false |
| onRequest_NAV LOC RUNWAY DESIGNATOR | trigger_onRequest_NAV LOC RUNWAY DESIGNATOR | The letter code for the runway that the currently tuned localizer is tuned to.: Units null: settable false |
| NAV LOC RUNWAY NUMBER | trigger_NAV LOC RUNWAY NUMBER | NAV LOC RUNWAY NUMBER - The number portion of the runway that the currently tuned localizer is tuned to (so if the runway was 15L, this would be 15).: Units null: settable false |
| onChange_NAV LOC RUNWAY NUMBER | trigger_onChange_NAV LOC RUNWAY NUMBER | NAV LOC RUNWAY NUMBER - The number portion of the runway that the currently tuned localizer is tuned to (so if the runway was 15L, this would be 15).: Units null: settable false |
| onRequest_NAV LOC RUNWAY NUMBER | trigger_onRequest_NAV LOC RUNWAY NUMBER | NAV LOC RUNWAY NUMBER - The number portion of the runway that the currently tuned localizer is tuned to (so if the runway was 15L, this would be 15).: Units null: settable false |
| NAV LOCALIZER | trigger_NAV LOCALIZER | Localizer course heading.: Units degrees: settable false |
| onChange_NAV LOCALIZER | trigger_onChange_NAV LOCALIZER | Localizer course heading.: Units degrees: settable false |
| onRequest_NAV LOCALIZER | trigger_onRequest_NAV LOCALIZER | Localizer course heading.: Units degrees: settable false |
| NAV MAGVAR | trigger_NAV MAGVAR | Magnetic variation of tuned Nav station.: Units degrees: settable false |
| onChange_NAV MAGVAR | trigger_onChange_NAV MAGVAR | Magnetic variation of tuned Nav station.: Units degrees: settable false |
| onRequest_NAV MAGVAR | trigger_onRequest_NAV MAGVAR | Magnetic variation of tuned Nav station.: Units degrees: settable false |
| NAV NAME | trigger_NAV NAME | Descriptive name.: Units null: settable false |
| onChange_NAV NAME | trigger_onChange_NAV NAME | Descriptive name.: Units null: settable false |
| onRequest_NAV NAME | trigger_onRequest_NAV NAME | Descriptive name.: Units null: settable false |
| NAV OBS | trigger_NAV OBS | OBS setting. Index of 1 or 2.: Units degrees: settable false |
| onChange_NAV OBS | trigger_onChange_NAV OBS | OBS setting. Index of 1 or 2.: Units degrees: settable false |
| onRequest_NAV OBS | trigger_onRequest_NAV OBS | OBS setting. Index of 1 or 2.: Units degrees: settable false |
| NAV RADIAL | trigger_NAV RADIAL | Radial that aircraft is on.: Units degrees: settable false |
| onChange_NAV RADIAL | trigger_onChange_NAV RADIAL | Radial that aircraft is on.: Units degrees: settable false |
| onRequest_NAV RADIAL | trigger_onRequest_NAV RADIAL | Radial that aircraft is on.: Units degrees: settable false |
| NAV RADIAL ERROR | trigger_NAV RADIAL ERROR | Difference between current radial and OBS tuned radial.: Units degrees: settable false |
| onChange_NAV RADIAL ERROR | trigger_onChange_NAV RADIAL ERROR | Difference between current radial and OBS tuned radial.: Units degrees: settable false |
| onRequest_NAV RADIAL ERROR | trigger_onRequest_NAV RADIAL ERROR | Difference between current radial and OBS tuned radial.: Units degrees: settable false |
| NAV RAW GLIDE SLOPE | trigger_NAV RAW GLIDE SLOPE | The glide slope angle.: Units degrees: settable false |
| onChange_NAV RAW GLIDE SLOPE | trigger_onChange_NAV RAW GLIDE SLOPE | The glide slope angle.: Units degrees: settable false |
| onRequest_NAV RAW GLIDE SLOPE | trigger_onRequest_NAV RAW GLIDE SLOPE | The glide slope angle.: Units degrees: settable false |
| NAV RELATIVE BEARING TO STATION | trigger_NAV RELATIVE BEARING TO STATION | Relative bearing to station.: Units degrees: settable false |
| onChange_NAV RELATIVE BEARING TO STATION | trigger_onChange_NAV RELATIVE BEARING TO STATION | Relative bearing to station.: Units degrees: settable false |
| onRequest_NAV RELATIVE BEARING TO STATION | trigger_onRequest_NAV RELATIVE BEARING TO STATION | Relative bearing to station.: Units degrees: settable false |
| NAV SIGNAL | trigger_NAV SIGNAL | Nav signal strength.: Units number: settable false |
| onChange_NAV SIGNAL | trigger_onChange_NAV SIGNAL | Nav signal strength.: Units number: settable false |
| onRequest_NAV SIGNAL | trigger_onRequest_NAV SIGNAL | Nav signal strength.: Units number: settable false |
| NAV SOUND:index | trigger_NAV SOUND:index | Nav audio flag. Index of 1 or 2.: Units bool: settable false |
| onChange_NAV SOUND:index | trigger_onChange_NAV SOUND:index | Nav audio flag. Index of 1 or 2.: Units bool: settable false |
| onRequest_NAV SOUND:index | trigger_onRequest_NAV SOUND:index | Nav audio flag. Index of 1 or 2.: Units bool: settable false |
| NAV STANDBY FREQUENCY:index | trigger_NAV STANDBY FREQUENCY:index | Nav standby frequency. Index is 1 or 2.: Units MHz: settable false |
| onChange_NAV STANDBY FREQUENCY:index | trigger_onChange_NAV STANDBY FREQUENCY:index | Nav standby frequency. Index is 1 or 2.: Units MHz: settable false |
| onRequest_NAV STANDBY FREQUENCY:index | trigger_onRequest_NAV STANDBY FREQUENCY:index | Nav standby frequency. Index is 1 or 2.: Units MHz: settable false |
| NAV TOFROM | trigger_NAV TOFROM | Returns whether the Nav is going to or from the current radial (or is off).: Units enum: settable false |
| onChange_NAV TOFROM | trigger_onChange_NAV TOFROM | Returns whether the Nav is going to or from the current radial (or is off).: Units enum: settable false |
| onRequest_NAV TOFROM | trigger_onRequest_NAV TOFROM | Returns whether the Nav is going to or from the current radial (or is off).: Units enum: settable false |
| NAV VOLUME | trigger_NAV VOLUME | The volume of the Nav radio.: Units percent: settable false |
| onChange_NAV VOLUME | trigger_onChange_NAV VOLUME | The volume of the Nav radio.: Units percent: settable false |
| onRequest_NAV VOLUME | trigger_onRequest_NAV VOLUME | The volume of the Nav radio.: Units percent: settable false |
| NAV VOR DISTANCE | trigger_NAV VOR DISTANCE | Distance of the VOR beacon.: Units meters: settable false |
| onChange_NAV VOR DISTANCE | trigger_onChange_NAV VOR DISTANCE | Distance of the VOR beacon.: Units meters: settable false |
| onRequest_NAV VOR DISTANCE | trigger_onRequest_NAV VOR DISTANCE | Distance of the VOR beacon.: Units meters: settable false |
| NEW ELECTRICAL SYSTEM | trigger_NEW ELECTRICAL SYSTEM | Is the aircraft using the new Electrical System or the legacy FSX one: Units bool: settable false |
| onChange_NEW ELECTRICAL SYSTEM | trigger_onChange_NEW ELECTRICAL SYSTEM | Is the aircraft using the new Electrical System or the legacy FSX one: Units bool: settable false |
| onRequest_NEW ELECTRICAL SYSTEM | trigger_onRequest_NEW ELECTRICAL SYSTEM | Is the aircraft using the new Electrical System or the legacy FSX one: Units bool: settable false |
| NOSEWHEEL LOCK ON | trigger_NOSEWHEEL LOCK ON | True if the nosewheel lock is engaged. This can be set using the NosewheelLock parameter.: Units bool: settable false |
| onChange_NOSEWHEEL LOCK ON | trigger_onChange_NOSEWHEEL LOCK ON | True if the nosewheel lock is engaged. This can be set using the NosewheelLock parameter.: Units bool: settable false |
| onRequest_NOSEWHEEL LOCK ON | trigger_onRequest_NOSEWHEEL LOCK ON | True if the nosewheel lock is engaged. This can be set using the NosewheelLock parameter.: Units bool: settable false |
| NOSEWHEEL MAX STEERING ANGLE | trigger_NOSEWHEEL MAX STEERING ANGLE | Can be used to get or set the maximum permitted steering angle for the nose wheel of the aircraft: Units radians: settable true |
| onChange_NOSEWHEEL MAX STEERING ANGLE | trigger_onChange_NOSEWHEEL MAX STEERING ANGLE | Can be used to get or set the maximum permitted steering angle for the nose wheel of the aircraft: Units radians: settable true |
| onRequest_NOSEWHEEL MAX STEERING ANGLE | trigger_onRequest_NOSEWHEEL MAX STEERING ANGLE | Can be used to get or set the maximum permitted steering angle for the nose wheel of the aircraft: Units radians: settable true |
| NUM SLING CABLES | trigger_NUM SLING CABLES | The number of sling cables (not hoists) that are configured for the helicopter.: Units number: settable false |
| onChange_NUM SLING CABLES | trigger_onChange_NUM SLING CABLES | The number of sling cables (not hoists) that are configured for the helicopter.: Units number: settable false |
| onRequest_NUM SLING CABLES | trigger_onRequest_NUM SLING CABLES | The number of sling cables (not hoists) that are configured for the helicopter.: Units number: settable false |
| NUMBER OF CATAPULTS | trigger_NUMBER OF CATAPULTS | Maximum of 4. A model can contain more than 4 catapults, but only the first four will be read and recognized by the simulation: Units number: settable false |
| onChange_NUMBER OF CATAPULTS | trigger_onChange_NUMBER OF CATAPULTS | Maximum of 4. A model can contain more than 4 catapults, but only the first four will be read and recognized by the simulation: Units number: settable false |
| onRequest_NUMBER OF CATAPULTS | trigger_onRequest_NUMBER OF CATAPULTS | Maximum of 4. A model can contain more than 4 catapults, but only the first four will be read and recognized by the simulation: Units number: settable false |
| NUMBER OF ENGINES | trigger_NUMBER OF ENGINES | Number of engines (minimum 0, maximum 4): Units number: settable false |
| onChange_NUMBER OF ENGINES | trigger_onChange_NUMBER OF ENGINES | Number of engines (minimum 0, maximum 4): Units number: settable false |
| onRequest_NUMBER OF ENGINES | trigger_onRequest_NUMBER OF ENGINES | Number of engines (minimum 0, maximum 4): Units number: settable false |
| ON ANY RUNWAY | trigger_ON ANY RUNWAY | Whether or not the plane is currently on a runway: Units bool: settable false |
| onChange_ON ANY RUNWAY | trigger_onChange_ON ANY RUNWAY | Whether or not the plane is currently on a runway: Units bool: settable false |
| onRequest_ON ANY RUNWAY | trigger_onRequest_ON ANY RUNWAY | Whether or not the plane is currently on a runway: Units bool: settable false |
| OUTER MARKER | trigger_OUTER MARKER | Outer marker state.: Units bool: settable true |
| onChange_OUTER MARKER | trigger_onChange_OUTER MARKER | Outer marker state.: Units bool: settable true |
| onRequest_OUTER MARKER | trigger_onRequest_OUTER MARKER | Outer marker state.: Units bool: settable true |
| OVERSPEED WARNING | trigger_OVERSPEED WARNING | Overspeed warning state.: Units bool: settable false |
| onChange_OVERSPEED WARNING | trigger_onChange_OVERSPEED WARNING | Overspeed warning state.: Units bool: settable false |
| onRequest_OVERSPEED WARNING | trigger_onRequest_OVERSPEED WARNING | Overspeed warning state.: Units bool: settable false |
| PANEL ANTI ICE SWITCH | trigger_PANEL ANTI ICE SWITCH | True if panel anti-ice switch is on.: Units bool: settable false |
| onChange_PANEL ANTI ICE SWITCH | trigger_onChange_PANEL ANTI ICE SWITCH | True if panel anti-ice switch is on.: Units bool: settable false |
| onRequest_PANEL ANTI ICE SWITCH | trigger_onRequest_PANEL ANTI ICE SWITCH | True if panel anti-ice switch is on.: Units bool: settable false |
| PANEL AUTO FEATHER SWITCH:index | trigger_PANEL AUTO FEATHER SWITCH:index | Auto-feather arming switch for the indexed engine: Units bool: settable false |
| onChange_PANEL AUTO FEATHER SWITCH:index | trigger_onChange_PANEL AUTO FEATHER SWITCH:index | Auto-feather arming switch for the indexed engine: Units bool: settable false |
| onRequest_PANEL AUTO FEATHER SWITCH:index | trigger_onRequest_PANEL AUTO FEATHER SWITCH:index | Auto-feather arming switch for the indexed engine: Units bool: settable false |
| PARTIAL PANEL ADF | trigger_PARTIAL PANEL ADF | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL ADF | trigger_onChange_PARTIAL PANEL ADF | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL ADF | trigger_onRequest_PARTIAL PANEL ADF | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL AIRSPEED | trigger_PARTIAL PANEL AIRSPEED | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL AIRSPEED | trigger_onChange_PARTIAL PANEL AIRSPEED | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL AIRSPEED | trigger_onRequest_PARTIAL PANEL AIRSPEED | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL ALTIMETER | trigger_PARTIAL PANEL ALTIMETER | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL ALTIMETER | trigger_onChange_PARTIAL PANEL ALTIMETER | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL ALTIMETER | trigger_onRequest_PARTIAL PANEL ALTIMETER | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL ATTITUDE | trigger_PARTIAL PANEL ATTITUDE | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL ATTITUDE | trigger_onChange_PARTIAL PANEL ATTITUDE | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL ATTITUDE | trigger_onRequest_PARTIAL PANEL ATTITUDE | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL AVIONICS | trigger_PARTIAL PANEL AVIONICS | Gauge fail flag.: Units enum: settable false |
| onChange_PARTIAL PANEL AVIONICS | trigger_onChange_PARTIAL PANEL AVIONICS | Gauge fail flag.: Units enum: settable false |
| onRequest_PARTIAL PANEL AVIONICS | trigger_onRequest_PARTIAL PANEL AVIONICS | Gauge fail flag.: Units enum: settable false |
| PARTIAL PANEL COMM | trigger_PARTIAL PANEL COMM | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL COMM | trigger_onChange_PARTIAL PANEL COMM | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL COMM | trigger_onRequest_PARTIAL PANEL COMM | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL COMPASS | trigger_PARTIAL PANEL COMPASS | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL COMPASS | trigger_onChange_PARTIAL PANEL COMPASS | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL COMPASS | trigger_onRequest_PARTIAL PANEL COMPASS | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL ELECTRICAL | trigger_PARTIAL PANEL ELECTRICAL | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL ELECTRICAL | trigger_onChange_PARTIAL PANEL ELECTRICAL | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL ELECTRICAL | trigger_onRequest_PARTIAL PANEL ELECTRICAL | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL ENGINE | trigger_PARTIAL PANEL ENGINE | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL ENGINE | trigger_onChange_PARTIAL PANEL ENGINE | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL ENGINE | trigger_onRequest_PARTIAL PANEL ENGINE | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL FUEL INDICATOR | trigger_PARTIAL PANEL FUEL INDICATOR | Gauge fail flag.: Units enum: settable false |
| onChange_PARTIAL PANEL FUEL INDICATOR | trigger_onChange_PARTIAL PANEL FUEL INDICATOR | Gauge fail flag.: Units enum: settable false |
| onRequest_PARTIAL PANEL FUEL INDICATOR | trigger_onRequest_PARTIAL PANEL FUEL INDICATOR | Gauge fail flag.: Units enum: settable false |
| PARTIAL PANEL HEADING | trigger_PARTIAL PANEL HEADING | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL HEADING | trigger_onChange_PARTIAL PANEL HEADING | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL HEADING | trigger_onRequest_PARTIAL PANEL HEADING | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL NAV | trigger_PARTIAL PANEL NAV | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL NAV | trigger_onChange_PARTIAL PANEL NAV | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL NAV | trigger_onRequest_PARTIAL PANEL NAV | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL PITOT | trigger_PARTIAL PANEL PITOT | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL PITOT | trigger_onChange_PARTIAL PANEL PITOT | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL PITOT | trigger_onRequest_PARTIAL PANEL PITOT | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL TRANSPONDER | trigger_PARTIAL PANEL TRANSPONDER | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL TRANSPONDER | trigger_onChange_PARTIAL PANEL TRANSPONDER | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL TRANSPONDER | trigger_onRequest_PARTIAL PANEL TRANSPONDER | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL TURN COORDINATOR | trigger_PARTIAL PANEL TURN COORDINATOR | Gauge fail flag.: Units enum: settable false |
| onChange_PARTIAL PANEL TURN COORDINATOR | trigger_onChange_PARTIAL PANEL TURN COORDINATOR | Gauge fail flag.: Units enum: settable false |
| onRequest_PARTIAL PANEL TURN COORDINATOR | trigger_onRequest_PARTIAL PANEL TURN COORDINATOR | Gauge fail flag.: Units enum: settable false |
| PARTIAL PANEL VACUUM | trigger_PARTIAL PANEL VACUUM | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL VACUUM | trigger_onChange_PARTIAL PANEL VACUUM | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL VACUUM | trigger_onRequest_PARTIAL PANEL VACUUM | Gauge fail flag.: Units enum: settable true |
| PARTIAL PANEL VERTICAL VELOCITY | trigger_PARTIAL PANEL VERTICAL VELOCITY | Gauge fail flag.: Units enum: settable true |
| onChange_PARTIAL PANEL VERTICAL VELOCITY | trigger_onChange_PARTIAL PANEL VERTICAL VELOCITY | Gauge fail flag.: Units enum: settable true |
| onRequest_PARTIAL PANEL VERTICAL VELOCITY | trigger_onRequest_PARTIAL PANEL VERTICAL VELOCITY | Gauge fail flag.: Units enum: settable true |
| PAYLOAD STATION COUNT | trigger_PAYLOAD STATION COUNT | Number of payload stations (1 to 15).: Units number: settable false |
| onChange_PAYLOAD STATION COUNT | trigger_onChange_PAYLOAD STATION COUNT | Number of payload stations (1 to 15).: Units number: settable false |
| onRequest_PAYLOAD STATION COUNT | trigger_onRequest_PAYLOAD STATION COUNT | Number of payload stations (1 to 15).: Units number: settable false |
| PAYLOAD STATION NAME:index | trigger_PAYLOAD STATION NAME:index | Descriptive name for payload station.: Units null: settable false |
| onChange_PAYLOAD STATION NAME:index | trigger_onChange_PAYLOAD STATION NAME:index | Descriptive name for payload station.: Units null: settable false |
| onRequest_PAYLOAD STATION NAME:index | trigger_onRequest_PAYLOAD STATION NAME:index | Descriptive name for payload station.: Units null: settable false |
| PAYLOAD STATION NUM SIMOBJECTS:index | trigger_PAYLOAD STATION NUM SIMOBJECTS:index | The number of objects at the payload station.: Units number: settable false |
| onChange_PAYLOAD STATION NUM SIMOBJECTS:index | trigger_onChange_PAYLOAD STATION NUM SIMOBJECTS:index | The number of objects at the payload station.: Units number: settable false |
| onRequest_PAYLOAD STATION NUM SIMOBJECTS:index | trigger_onRequest_PAYLOAD STATION NUM SIMOBJECTS:index | The number of objects at the payload station.: Units number: settable false |
| PAYLOAD STATION OBJECT:index | trigger_PAYLOAD STATION OBJECT:index | Places the named object at the payload station identified by the index (starting from 1). The string is the Container name (refer to the title property of Simulation Object Configuration Files).: Units null: settable false |
| onChange_PAYLOAD STATION OBJECT:index | trigger_onChange_PAYLOAD STATION OBJECT:index | Places the named object at the payload station identified by the index (starting from 1). The string is the Container name (refer to the title property of Simulation Object Configuration Files).: Units null: settable false |
| onRequest_PAYLOAD STATION OBJECT:index | trigger_onRequest_PAYLOAD STATION OBJECT:index | Places the named object at the payload station identified by the index (starting from 1). The string is the Container name (refer to the title property of Simulation Object Configuration Files).: Units null: settable false |
| PAYLOAD STATION WEIGHT:index | trigger_PAYLOAD STATION WEIGHT:index | Individual payload station weight.: Units pounds: settable true |
| onChange_PAYLOAD STATION WEIGHT:index | trigger_onChange_PAYLOAD STATION WEIGHT:index | Individual payload station weight.: Units pounds: settable true |
| onRequest_PAYLOAD STATION WEIGHT:index | trigger_onRequest_PAYLOAD STATION WEIGHT:index | Individual payload station weight.: Units pounds: settable true |
| PILOT TRANSMITTER TYPE | trigger_PILOT TRANSMITTER TYPE | On which channel the pilot is transmitting.: Units enum: settable false |
| onChange_PILOT TRANSMITTER TYPE | trigger_onChange_PILOT TRANSMITTER TYPE | On which channel the pilot is transmitting.: Units enum: settable false |
| onRequest_PILOT TRANSMITTER TYPE | trigger_onRequest_PILOT TRANSMITTER TYPE | On which channel the pilot is transmitting.: Units enum: settable false |
| PILOT TRANSMITTING | trigger_PILOT TRANSMITTING | Whether or not the pilot is transmitting.: Units bool: settable false |
| onChange_PILOT TRANSMITTING | trigger_onChange_PILOT TRANSMITTING | Whether or not the pilot is transmitting.: Units bool: settable false |
| onRequest_PILOT TRANSMITTING | trigger_onRequest_PILOT TRANSMITTING | Whether or not the pilot is transmitting.: Units bool: settable false |
| PITOT HEAT | trigger_PITOT HEAT | Pitot heat active.: Units bool: settable false |
| onChange_PITOT HEAT | trigger_onChange_PITOT HEAT | Pitot heat active.: Units bool: settable false |
| onRequest_PITOT HEAT | trigger_onRequest_PITOT HEAT | Pitot heat active.: Units bool: settable false |
| PITOT HEAT SWITCH:index | trigger_PITOT HEAT SWITCH:index | Pitot heat switch state.: Units enum: settable false |
| onChange_PITOT HEAT SWITCH:index | trigger_onChange_PITOT HEAT SWITCH:index | Pitot heat switch state.: Units enum: settable false |
| onRequest_PITOT HEAT SWITCH:index | trigger_onRequest_PITOT HEAT SWITCH:index | Pitot heat switch state.: Units enum: settable false |
| PITOT ICE PCT | trigger_PITOT ICE PCT | Amount of pitot ice. 100 is fully iced.: Units percent Over 100: settable false |
| onChange_PITOT ICE PCT | trigger_onChange_PITOT ICE PCT | Amount of pitot ice. 100 is fully iced.: Units percent Over 100: settable false |
| onRequest_PITOT ICE PCT | trigger_onRequest_PITOT ICE PCT | Amount of pitot ice. 100 is fully iced.: Units percent Over 100: settable false |
| PLANE ALT ABOVE GROUND | trigger_PLANE ALT ABOVE GROUND | Altitude above the surface: Units feet: settable true |
| onChange_PLANE ALT ABOVE GROUND | trigger_onChange_PLANE ALT ABOVE GROUND | Altitude above the surface: Units feet: settable true |
| onRequest_PLANE ALT ABOVE GROUND | trigger_onRequest_PLANE ALT ABOVE GROUND | Altitude above the surface: Units feet: settable true |
| PLANE ALT ABOVE GROUND MINUS CG | trigger_PLANE ALT ABOVE GROUND MINUS CG | Altitude above the surface minus CG: Units feet: settable true |
| onChange_PLANE ALT ABOVE GROUND MINUS CG | trigger_onChange_PLANE ALT ABOVE GROUND MINUS CG | Altitude above the surface minus CG: Units feet: settable true |
| onRequest_PLANE ALT ABOVE GROUND MINUS CG | trigger_onRequest_PLANE ALT ABOVE GROUND MINUS CG | Altitude above the surface minus CG: Units feet: settable true |
| PLANE ALTITUDE | trigger_PLANE ALTITUDE | Altitude of aircraft: Units feet: settable true |
| onChange_PLANE ALTITUDE | trigger_onChange_PLANE ALTITUDE | Altitude of aircraft: Units feet: settable true |
| onRequest_PLANE ALTITUDE | trigger_onRequest_PLANE ALTITUDE | Altitude of aircraft: Units feet: settable true |
| PLANE BANK DEGREES | trigger_PLANE BANK DEGREES | Bank angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| onChange_PLANE BANK DEGREES | trigger_onChange_PLANE BANK DEGREES | Bank angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| onRequest_PLANE BANK DEGREES | trigger_onRequest_PLANE BANK DEGREES | Bank angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| PLANE HEADING DEGREES GYRO | trigger_PLANE HEADING DEGREES GYRO | Heading indicator (directional gyro) indication.: Units radians: settable true |
| onChange_PLANE HEADING DEGREES GYRO | trigger_onChange_PLANE HEADING DEGREES GYRO | Heading indicator (directional gyro) indication.: Units radians: settable true |
| onRequest_PLANE HEADING DEGREES GYRO | trigger_onRequest_PLANE HEADING DEGREES GYRO | Heading indicator (directional gyro) indication.: Units radians: settable true |
| PLANE HEADING DEGREES MAGNETIC | trigger_PLANE HEADING DEGREES MAGNETIC | Heading relative to magnetic north - although the name mentions degrees the units used are radians: Units radians: settable true |
| onChange_PLANE HEADING DEGREES MAGNETIC | trigger_onChange_PLANE HEADING DEGREES MAGNETIC | Heading relative to magnetic north - although the name mentions degrees the units used are radians: Units radians: settable true |
| onRequest_PLANE HEADING DEGREES MAGNETIC | trigger_onRequest_PLANE HEADING DEGREES MAGNETIC | Heading relative to magnetic north - although the name mentions degrees the units used are radians: Units radians: settable true |
| PLANE HEADING DEGREES TRUE | trigger_PLANE HEADING DEGREES TRUE | Heading relative to true north - although the name mentions degrees the units used are radians: Units radians: settable true |
| onChange_PLANE HEADING DEGREES TRUE | trigger_onChange_PLANE HEADING DEGREES TRUE | Heading relative to true north - although the name mentions degrees the units used are radians: Units radians: settable true |
| onRequest_PLANE HEADING DEGREES TRUE | trigger_onRequest_PLANE HEADING DEGREES TRUE | Heading relative to true north - although the name mentions degrees the units used are radians: Units radians: settable true |
| PLANE IN PARKING STATE | trigger_PLANE IN PARKING STATE | Whether or not the plane is currently parked (true) or not (false): Units bool: settable false |
| onChange_PLANE IN PARKING STATE | trigger_onChange_PLANE IN PARKING STATE | Whether or not the plane is currently parked (true) or not (false): Units bool: settable false |
| onRequest_PLANE IN PARKING STATE | trigger_onRequest_PLANE IN PARKING STATE | Whether or not the plane is currently parked (true) or not (false): Units bool: settable false |
| PLANE LATITUDE | trigger_PLANE LATITUDE | Latitude of aircraft, North is positive, South negative: Units radians: settable true |
| onChange_PLANE LATITUDE | trigger_onChange_PLANE LATITUDE | Latitude of aircraft, North is positive, South negative: Units radians: settable true |
| onRequest_PLANE LATITUDE | trigger_onRequest_PLANE LATITUDE | Latitude of aircraft, North is positive, South negative: Units radians: settable true |
| PLANE LONGITUDE | trigger_PLANE LONGITUDE | Longitude of aircraft, East is positive, West negative: Units radians: settable true |
| onChange_PLANE LONGITUDE | trigger_onChange_PLANE LONGITUDE | Longitude of aircraft, East is positive, West negative: Units radians: settable true |
| onRequest_PLANE LONGITUDE | trigger_onRequest_PLANE LONGITUDE | Longitude of aircraft, East is positive, West negative: Units radians: settable true |
| PLANE PITCH DEGREES | trigger_PLANE PITCH DEGREES | Pitch angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| onChange_PLANE PITCH DEGREES | trigger_onChange_PLANE PITCH DEGREES | Pitch angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| onRequest_PLANE PITCH DEGREES | trigger_onRequest_PLANE PITCH DEGREES | Pitch angle, although the name mentions degrees the units used are radians: Units radians: settable true |
| PLANE TOUCHDOWN BANK DEGREES | trigger_PLANE TOUCHDOWN BANK DEGREES | This float represents the bank of the player's plane from the last touchdown: Units degrees: settable true |
| onChange_PLANE TOUCHDOWN BANK DEGREES | trigger_onChange_PLANE TOUCHDOWN BANK DEGREES | This float represents the bank of the player's plane from the last touchdown: Units degrees: settable true |
| onRequest_PLANE TOUCHDOWN BANK DEGREES | trigger_onRequest_PLANE TOUCHDOWN BANK DEGREES | This float represents the bank of the player's plane from the last touchdown: Units degrees: settable true |
| PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | trigger_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | This float represents the magnetic heading of the player's plane from the last touchdown: Units degrees: settable false |
| onChange_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | trigger_onChange_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | This float represents the magnetic heading of the player's plane from the last touchdown: Units degrees: settable false |
| onRequest_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | trigger_onRequest_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC | This float represents the magnetic heading of the player's plane from the last touchdown: Units degrees: settable false |
| PLANE TOUCHDOWN HEADING DEGREES TRUE | trigger_PLANE TOUCHDOWN HEADING DEGREES TRUE | This float represents the true heading of the player's plane from the last touchdown: Units degrees: settable false |
| onChange_PLANE TOUCHDOWN HEADING DEGREES TRUE | trigger_onChange_PLANE TOUCHDOWN HEADING DEGREES TRUE | This float represents the true heading of the player's plane from the last touchdown: Units degrees: settable false |
| onRequest_PLANE TOUCHDOWN HEADING DEGREES TRUE | trigger_onRequest_PLANE TOUCHDOWN HEADING DEGREES TRUE | This float represents the true heading of the player's plane from the last touchdown: Units degrees: settable false |
| PLANE TOUCHDOWN LATITUDE | trigger_PLANE TOUCHDOWN LATITUDE | This float represents the plane latitude for the last touchdown: Units radians: settable false |
| onChange_PLANE TOUCHDOWN LATITUDE | trigger_onChange_PLANE TOUCHDOWN LATITUDE | This float represents the plane latitude for the last touchdown: Units radians: settable false |
| onRequest_PLANE TOUCHDOWN LATITUDE | trigger_onRequest_PLANE TOUCHDOWN LATITUDE | This float represents the plane latitude for the last touchdown: Units radians: settable false |
| PLANE TOUCHDOWN LONGITUDE | trigger_PLANE TOUCHDOWN LONGITUDE | This float represents the plane longitude for the last touchdown: Units radians: settable false |
| onChange_PLANE TOUCHDOWN LONGITUDE | trigger_onChange_PLANE TOUCHDOWN LONGITUDE | This float represents the plane longitude for the last touchdown: Units radians: settable false |
| onRequest_PLANE TOUCHDOWN LONGITUDE | trigger_onRequest_PLANE TOUCHDOWN LONGITUDE | This float represents the plane longitude for the last touchdown: Units radians: settable false |
| PLANE TOUCHDOWN NORMAL VELOCITY | trigger_PLANE TOUCHDOWN NORMAL VELOCITY | This float represents the player's plane speed according to ground normal from the last touchdown: Units feet: settable false |
| onChange_PLANE TOUCHDOWN NORMAL VELOCITY | trigger_onChange_PLANE TOUCHDOWN NORMAL VELOCITY | This float represents the player's plane speed according to ground normal from the last touchdown: Units feet: settable false |
| onRequest_PLANE TOUCHDOWN NORMAL VELOCITY | trigger_onRequest_PLANE TOUCHDOWN NORMAL VELOCITY | This float represents the player's plane speed according to ground normal from the last touchdown: Units feet: settable false |
| PLANE TOUCHDOWN PITCH DEGREES | trigger_PLANE TOUCHDOWN PITCH DEGREES | This float represents the pitch of the player's plane from the last touchdown: Units degrees: settable false |
| onChange_PLANE TOUCHDOWN PITCH DEGREES | trigger_onChange_PLANE TOUCHDOWN PITCH DEGREES | This float represents the pitch of the player's plane from the last touchdown: Units degrees: settable false |
| onRequest_PLANE TOUCHDOWN PITCH DEGREES | trigger_onRequest_PLANE TOUCHDOWN PITCH DEGREES | This float represents the pitch of the player's plane from the last touchdown: Units degrees: settable false |
| PRESSURE ALTITUDE | trigger_PRESSURE ALTITUDE | Standard Altitude, ie: at a 1013.25 hPa (1 atmosphere) setting.: Units meters: settable false |
| onChange_PRESSURE ALTITUDE | trigger_onChange_PRESSURE ALTITUDE | Standard Altitude, ie: at a 1013.25 hPa (1 atmosphere) setting.: Units meters: settable false |
| onRequest_PRESSURE ALTITUDE | trigger_onRequest_PRESSURE ALTITUDE | Standard Altitude, ie: at a 1013.25 hPa (1 atmosphere) setting.: Units meters: settable false |
| PRESSURIZATION CABIN ALTITUDE | trigger_PRESSURIZATION CABIN ALTITUDE | The current altitude of the cabin pressurization.: Units feet: settable false |
| onChange_PRESSURIZATION CABIN ALTITUDE | trigger_onChange_PRESSURIZATION CABIN ALTITUDE | The current altitude of the cabin pressurization.: Units feet: settable false |
| onRequest_PRESSURIZATION CABIN ALTITUDE | trigger_onRequest_PRESSURIZATION CABIN ALTITUDE | The current altitude of the cabin pressurization.: Units feet: settable false |
| PRESSURIZATION CABIN ALTITUDE GOAL | trigger_PRESSURIZATION CABIN ALTITUDE GOAL | The set altitude of the cabin pressurization.: Units feet: settable false |
| onChange_PRESSURIZATION CABIN ALTITUDE GOAL | trigger_onChange_PRESSURIZATION CABIN ALTITUDE GOAL | The set altitude of the cabin pressurization.: Units feet: settable false |
| onRequest_PRESSURIZATION CABIN ALTITUDE GOAL | trigger_onRequest_PRESSURIZATION CABIN ALTITUDE GOAL | The set altitude of the cabin pressurization.: Units feet: settable false |
| PRESSURIZATION CABIN ALTITUDE RATE | trigger_PRESSURIZATION CABIN ALTITUDE RATE | The rate at which cabin pressurization changes.: Units feet per second: settable false |
| onChange_PRESSURIZATION CABIN ALTITUDE RATE | trigger_onChange_PRESSURIZATION CABIN ALTITUDE RATE | The rate at which cabin pressurization changes.: Units feet per second: settable false |
| onRequest_PRESSURIZATION CABIN ALTITUDE RATE | trigger_onRequest_PRESSURIZATION CABIN ALTITUDE RATE | The rate at which cabin pressurization changes.: Units feet per second: settable false |
| PRESSURIZATION DUMP SWITCH | trigger_PRESSURIZATION DUMP SWITCH | True if the cabin pressurization dump switch is on.: Units bool: settable false |
| onChange_PRESSURIZATION DUMP SWITCH | trigger_onChange_PRESSURIZATION DUMP SWITCH | True if the cabin pressurization dump switch is on.: Units bool: settable false |
| onRequest_PRESSURIZATION DUMP SWITCH | trigger_onRequest_PRESSURIZATION DUMP SWITCH | True if the cabin pressurization dump switch is on.: Units bool: settable false |
| PRESSURIZATION PRESSURE DIFFERENTIAL | trigger_PRESSURIZATION PRESSURE DIFFERENTIAL | The difference in pressure between the set altitude pressurization and the current pressurization.: Units pounds: settable false |
| onChange_PRESSURIZATION PRESSURE DIFFERENTIAL | trigger_onChange_PRESSURIZATION PRESSURE DIFFERENTIAL | The difference in pressure between the set altitude pressurization and the current pressurization.: Units pounds: settable false |
| onRequest_PRESSURIZATION PRESSURE DIFFERENTIAL | trigger_onRequest_PRESSURIZATION PRESSURE DIFFERENTIAL | The difference in pressure between the set altitude pressurization and the current pressurization.: Units pounds: settable false |
| PROP AUTO CRUISE ACTIVE | trigger_PROP AUTO CRUISE ACTIVE | True if prop auto cruise active: Units bool: settable false |
| onChange_PROP AUTO CRUISE ACTIVE | trigger_onChange_PROP AUTO CRUISE ACTIVE | True if prop auto cruise active: Units bool: settable false |
| onRequest_PROP AUTO CRUISE ACTIVE | trigger_onRequest_PROP AUTO CRUISE ACTIVE | True if prop auto cruise active: Units bool: settable false |
| PROP AUTO FEATHER ARMED:index | trigger_PROP AUTO FEATHER ARMED:index | Auto-feather armed state for the indexed engine: Units bool: settable false |
| onChange_PROP AUTO FEATHER ARMED:index | trigger_onChange_PROP AUTO FEATHER ARMED:index | Auto-feather armed state for the indexed engine: Units bool: settable false |
| onRequest_PROP AUTO FEATHER ARMED:index | trigger_onRequest_PROP AUTO FEATHER ARMED:index | Auto-feather armed state for the indexed engine: Units bool: settable false |
| PROP BETA FORCED ACTIVE | trigger_PROP BETA FORCED ACTIVE | This can be used to enable the propeller forced beta mode (1, TRUE) or disable it (0, FALSE), when being written to. When being read from, it will return TRUE (1) if the forced beta mode is enabled or FALSE (0) if it isn't. When enabled, the PROP BETA FORCED POSITION value will be used to drive the prop beta, while the internal coded simulation logic is used when this is disabled: Units bool: settable true |
| onChange_PROP BETA FORCED ACTIVE | trigger_onChange_PROP BETA FORCED ACTIVE | This can be used to enable the propeller forced beta mode (1, TRUE) or disable it (0, FALSE), when being written to. When being read from, it will return TRUE (1) if the forced beta mode is enabled or FALSE (0) if it isn't. When enabled, the PROP BETA FORCED POSITION value will be used to drive the prop beta, while the internal coded simulation logic is used when this is disabled: Units bool: settable true |
| onRequest_PROP BETA FORCED ACTIVE | trigger_onRequest_PROP BETA FORCED ACTIVE | This can be used to enable the propeller forced beta mode (1, TRUE) or disable it (0, FALSE), when being written to. When being read from, it will return TRUE (1) if the forced beta mode is enabled or FALSE (0) if it isn't. When enabled, the PROP BETA FORCED POSITION value will be used to drive the prop beta, while the internal coded simulation logic is used when this is disabled: Units bool: settable true |
| PROP BETA FORCED POSITION | trigger_PROP BETA FORCED POSITION | Get or set the beta at which the prop is forced. Only valid when PROP BETA FORCED ACTIVE is TRUE (1): Units radians: settable false |
| onChange_PROP BETA FORCED POSITION | trigger_onChange_PROP BETA FORCED POSITION | Get or set the beta at which the prop is forced. Only valid when PROP BETA FORCED ACTIVE is TRUE (1): Units radians: settable false |
| onRequest_PROP BETA FORCED POSITION | trigger_onRequest_PROP BETA FORCED POSITION | Get or set the beta at which the prop is forced. Only valid when PROP BETA FORCED ACTIVE is TRUE (1): Units radians: settable false |
| PROP BETA MAX | trigger_PROP BETA MAX | The "prop beta" is the pitch of the blades of the propeller. This retrieves the maximum possible pitch value for all engines: Units radians: settable false |
| onChange_PROP BETA MAX | trigger_onChange_PROP BETA MAX | The "prop beta" is the pitch of the blades of the propeller. This retrieves the maximum possible pitch value for all engines: Units radians: settable false |
| onRequest_PROP BETA MAX | trigger_onRequest_PROP BETA MAX | The "prop beta" is the pitch of the blades of the propeller. This retrieves the maximum possible pitch value for all engines: Units radians: settable false |
| PROP BETA MIN | trigger_PROP BETA MIN | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value for all engines: Units radians: settable false |
| onChange_PROP BETA MIN | trigger_onChange_PROP BETA MIN | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value for all engines: Units radians: settable false |
| onRequest_PROP BETA MIN | trigger_onRequest_PROP BETA MIN | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value for all engines: Units radians: settable false |
| PROP BETA MIN REVERSE | trigger_PROP BETA MIN REVERSE | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value when the propeller is in reverse for all engines: Units radians: settable false |
| onChange_PROP BETA MIN REVERSE | trigger_onChange_PROP BETA MIN REVERSE | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value when the propeller is in reverse for all engines: Units radians: settable false |
| onRequest_PROP BETA MIN REVERSE | trigger_onRequest_PROP BETA MIN REVERSE | The "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value when the propeller is in reverse for all engines: Units radians: settable false |
| PROP BETA:index | trigger_PROP BETA:index | The "prop beta" is the pitch of the blades of the propeller, and this can be used to retrieve the current pitch setting, per indexed engine: Units radians: settable true |
| onChange_PROP BETA:index | trigger_onChange_PROP BETA:index | The "prop beta" is the pitch of the blades of the propeller, and this can be used to retrieve the current pitch setting, per indexed engine: Units radians: settable true |
| onRequest_PROP BETA:index | trigger_onRequest_PROP BETA:index | The "prop beta" is the pitch of the blades of the propeller, and this can be used to retrieve the current pitch setting, per indexed engine: Units radians: settable true |
| PROP DEICE SWITCH:index | trigger_PROP DEICE SWITCH:index | True if prop deice switch on for the indexed engine: Units bool: settable false |
| onChange_PROP DEICE SWITCH:index | trigger_onChange_PROP DEICE SWITCH:index | True if prop deice switch on for the indexed engine: Units bool: settable false |
| onRequest_PROP DEICE SWITCH:index | trigger_onRequest_PROP DEICE SWITCH:index | True if prop deice switch on for the indexed engine: Units bool: settable false |
| PROP FEATHER SWITCH:index | trigger_PROP FEATHER SWITCH:index | Prop feather switch for the indexed engine: Units bool: settable false |
| onChange_PROP FEATHER SWITCH:index | trigger_onChange_PROP FEATHER SWITCH:index | Prop feather switch for the indexed engine: Units bool: settable false |
| onRequest_PROP FEATHER SWITCH:index | trigger_onRequest_PROP FEATHER SWITCH:index | Prop feather switch for the indexed engine: Units bool: settable false |
| PROP FEATHERED:index | trigger_PROP FEATHERED:index | This will return the feathered state of the propeller for an indexed engine. The state is either feathered (true) or not (false): Units bool: settable false |
| onChange_PROP FEATHERED:index | trigger_onChange_PROP FEATHERED:index | This will return the feathered state of the propeller for an indexed engine. The state is either feathered (true) or not (false): Units bool: settable false |
| onRequest_PROP FEATHERED:index | trigger_onRequest_PROP FEATHERED:index | This will return the feathered state of the propeller for an indexed engine. The state is either feathered (true) or not (false): Units bool: settable false |
| PROP FEATHERING INHIBIT:index | trigger_PROP FEATHERING INHIBIT:index | Feathering inhibit flag for the indexed engine: Units bool: settable false |
| onChange_PROP FEATHERING INHIBIT:index | trigger_onChange_PROP FEATHERING INHIBIT:index | Feathering inhibit flag for the indexed engine: Units bool: settable false |
| onRequest_PROP FEATHERING INHIBIT:index | trigger_onRequest_PROP FEATHERING INHIBIT:index | Feathering inhibit flag for the indexed engine: Units bool: settable false |
| PROP MAX RPM PERCENT:index | trigger_PROP MAX RPM PERCENT:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| onChange_PROP MAX RPM PERCENT:index | trigger_onChange_PROP MAX RPM PERCENT:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| onRequest_PROP MAX RPM PERCENT:index | trigger_onRequest_PROP MAX RPM PERCENT:index | Percent of max rated rpm for the indexed engine: Units percent: settable true |
| PROP ROTATION ANGLE | trigger_PROP ROTATION ANGLE | Prop rotation angle: Units radians: settable false |
| onChange_PROP ROTATION ANGLE | trigger_onChange_PROP ROTATION ANGLE | Prop rotation angle: Units radians: settable false |
| onRequest_PROP ROTATION ANGLE | trigger_onRequest_PROP ROTATION ANGLE | Prop rotation angle: Units radians: settable false |
| PROP RPM:index | trigger_PROP RPM:index | Propeller rpm for the indexed engine: Units RPM: settable true |
| onChange_PROP RPM:index | trigger_onChange_PROP RPM:index | Propeller rpm for the indexed engine: Units RPM: settable true |
| onRequest_PROP RPM:index | trigger_onRequest_PROP RPM:index | Propeller rpm for the indexed engine: Units RPM: settable true |
| PROP SYNC ACTIVE:index | trigger_PROP SYNC ACTIVE:index | True if prop sync is active the indexed engine: Units bool: settable false |
| onChange_PROP SYNC ACTIVE:index | trigger_onChange_PROP SYNC ACTIVE:index | True if prop sync is active the indexed engine: Units bool: settable false |
| onRequest_PROP SYNC ACTIVE:index | trigger_onRequest_PROP SYNC ACTIVE:index | True if prop sync is active the indexed engine: Units bool: settable false |
| PROP SYNC DELTA LEVER:index | trigger_PROP SYNC DELTA LEVER:index | Corrected prop correction input on slaved engine for the indexed engine: Units position: settable false |
| onChange_PROP SYNC DELTA LEVER:index | trigger_onChange_PROP SYNC DELTA LEVER:index | Corrected prop correction input on slaved engine for the indexed engine: Units position: settable false |
| onRequest_PROP SYNC DELTA LEVER:index | trigger_onRequest_PROP SYNC DELTA LEVER:index | Corrected prop correction input on slaved engine for the indexed engine: Units position: settable false |
| PROP THRUST:index | trigger_PROP THRUST:index | Propeller thrust for the indexed engine: Units pounds: settable false |
| onChange_PROP THRUST:index | trigger_onChange_PROP THRUST:index | Propeller thrust for the indexed engine: Units pounds: settable false |
| onRequest_PROP THRUST:index | trigger_onRequest_PROP THRUST:index | Propeller thrust for the indexed engine: Units pounds: settable false |
| PUSHBACK ANGLE | trigger_PUSHBACK ANGLE | Pushback angle (the heading of the tug).: Units radians: settable false |
| onChange_PUSHBACK ANGLE | trigger_onChange_PUSHBACK ANGLE | Pushback angle (the heading of the tug).: Units radians: settable false |
| onRequest_PUSHBACK ANGLE | trigger_onRequest_PUSHBACK ANGLE | Pushback angle (the heading of the tug).: Units radians: settable false |
| PUSHBACK ATTACHED | trigger_PUSHBACK ATTACHED | True if this vehicle is attached to an aircraft.: Units bool: settable false |
| onChange_PUSHBACK ATTACHED | trigger_onChange_PUSHBACK ATTACHED | True if this vehicle is attached to an aircraft.: Units bool: settable false |
| onRequest_PUSHBACK ATTACHED | trigger_onRequest_PUSHBACK ATTACHED | True if this vehicle is attached to an aircraft.: Units bool: settable false |
| PUSHBACK AVAILABLE | trigger_PUSHBACK AVAILABLE | True if a push back is available on the parking space.: Units bool: settable false |
| onChange_PUSHBACK AVAILABLE | trigger_onChange_PUSHBACK AVAILABLE | True if a push back is available on the parking space.: Units bool: settable false |
| onRequest_PUSHBACK AVAILABLE | trigger_onRequest_PUSHBACK AVAILABLE | True if a push back is available on the parking space.: Units bool: settable false |
| PUSHBACK CONTACTX | trigger_PUSHBACK CONTACTX | The towpoint position, relative to the aircrafts datum reference point.: Units feet: settable false |
| onChange_PUSHBACK CONTACTX | trigger_onChange_PUSHBACK CONTACTX | The towpoint position, relative to the aircrafts datum reference point.: Units feet: settable false |
| onRequest_PUSHBACK CONTACTX | trigger_onRequest_PUSHBACK CONTACTX | The towpoint position, relative to the aircrafts datum reference point.: Units feet: settable false |
| PUSHBACK CONTACTY | trigger_PUSHBACK CONTACTY | Pushback contact position in vertical direction.: Units feet: settable false |
| onChange_PUSHBACK CONTACTY | trigger_onChange_PUSHBACK CONTACTY | Pushback contact position in vertical direction.: Units feet: settable false |
| onRequest_PUSHBACK CONTACTY | trigger_onRequest_PUSHBACK CONTACTY | Pushback contact position in vertical direction.: Units feet: settable false |
| PUSHBACK CONTACTZ | trigger_PUSHBACK CONTACTZ | Pushback contact position in fore/aft direction.: Units feet: settable false |
| onChange_PUSHBACK CONTACTZ | trigger_onChange_PUSHBACK CONTACTZ | Pushback contact position in fore/aft direction.: Units feet: settable false |
| onRequest_PUSHBACK CONTACTZ | trigger_onRequest_PUSHBACK CONTACTZ | Pushback contact position in fore/aft direction.: Units feet: settable false |
| PUSHBACK STATE:index | trigger_PUSHBACK STATE:index | Type of pushback.: Units enum: settable false |
| onChange_PUSHBACK STATE:index | trigger_onChange_PUSHBACK STATE:index | Type of pushback.: Units enum: settable false |
| onRequest_PUSHBACK STATE:index | trigger_onRequest_PUSHBACK STATE:index | Type of pushback.: Units enum: settable false |
| PUSHBACK WAIT | trigger_PUSHBACK WAIT | True if waiting for pushback.: Units bool: settable false |
| onChange_PUSHBACK WAIT | trigger_onChange_PUSHBACK WAIT | True if waiting for pushback.: Units bool: settable false |
| onRequest_PUSHBACK WAIT | trigger_onRequest_PUSHBACK WAIT | True if waiting for pushback.: Units bool: settable false |
| RAD INS SWITCH | trigger_RAD INS SWITCH | True if Rad INS switch on.: Units bool: settable false |
| onChange_RAD INS SWITCH | trigger_onChange_RAD INS SWITCH | True if Rad INS switch on.: Units bool: settable false |
| onRequest_RAD INS SWITCH | trigger_onRequest_RAD INS SWITCH | True if Rad INS switch on.: Units bool: settable false |
| RADIO HEIGHT | trigger_RADIO HEIGHT | Radar altitude.: Units feet: settable false |
| onChange_RADIO HEIGHT | trigger_onChange_RADIO HEIGHT | Radar altitude.: Units feet: settable false |
| onRequest_RADIO HEIGHT | trigger_onRequest_RADIO HEIGHT | Radar altitude.: Units feet: settable false |
| REALISM | trigger_REALISM | General realism percent.: Units number: settable true |
| onChange_REALISM | trigger_onChange_REALISM | General realism percent.: Units number: settable true |
| onRequest_REALISM | trigger_onRequest_REALISM | General realism percent.: Units number: settable true |
| REALISM CRASH DETECTION | trigger_REALISM CRASH DETECTION | True indicates crash detection is turned on.: Units bool: settable false |
| onChange_REALISM CRASH DETECTION | trigger_onChange_REALISM CRASH DETECTION | True indicates crash detection is turned on.: Units bool: settable false |
| onRequest_REALISM CRASH DETECTION | trigger_onRequest_REALISM CRASH DETECTION | True indicates crash detection is turned on.: Units bool: settable false |
| REALISM CRASH WITH OTHERS | trigger_REALISM CRASH WITH OTHERS | True indicates crashing with other aircraft is possible.: Units bool: settable false |
| onChange_REALISM CRASH WITH OTHERS | trigger_onChange_REALISM CRASH WITH OTHERS | True indicates crashing with other aircraft is possible.: Units bool: settable false |
| onRequest_REALISM CRASH WITH OTHERS | trigger_onRequest_REALISM CRASH WITH OTHERS | True indicates crashing with other aircraft is possible.: Units bool: settable false |
| RECIP CARBURETOR TEMPERATURE:index | trigger_RECIP CARBURETOR TEMPERATURE:index | Carburetor temperature the indexed engine: Units celsius: settable true |
| onChange_RECIP CARBURETOR TEMPERATURE:index | trigger_onChange_RECIP CARBURETOR TEMPERATURE:index | Carburetor temperature the indexed engine: Units celsius: settable true |
| onRequest_RECIP CARBURETOR TEMPERATURE:index | trigger_onRequest_RECIP CARBURETOR TEMPERATURE:index | Carburetor temperature the indexed engine: Units celsius: settable true |
| RECIP ENG ALTERNATE AIR POSITION:index | trigger_RECIP ENG ALTERNATE AIR POSITION:index | Alternate air control the indexed engine: Units position: settable true |
| onChange_RECIP ENG ALTERNATE AIR POSITION:index | trigger_onChange_RECIP ENG ALTERNATE AIR POSITION:index | Alternate air control the indexed engine: Units position: settable true |
| onRequest_RECIP ENG ALTERNATE AIR POSITION:index | trigger_onRequest_RECIP ENG ALTERNATE AIR POSITION:index | Alternate air control the indexed engine: Units position: settable true |
| RECIP ENG ANTIDETONATION FLOW RATE:index | trigger_RECIP ENG ANTIDETONATION FLOW RATE:index | This gives the actual flow rate of the Anti Detonation system for the indexed engine: Units gallons per hour: settable false |
| onChange_RECIP ENG ANTIDETONATION FLOW RATE:index | trigger_onChange_RECIP ENG ANTIDETONATION FLOW RATE:index | This gives the actual flow rate of the Anti Detonation system for the indexed engine: Units gallons per hour: settable false |
| onRequest_RECIP ENG ANTIDETONATION FLOW RATE:index | trigger_onRequest_RECIP ENG ANTIDETONATION FLOW RATE:index | This gives the actual flow rate of the Anti Detonation system for the indexed engine: Units gallons per hour: settable false |
| RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | trigger_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | The maximum quantity of water/methanol mixture in the ADI tank for the indexed engine. This value is set as part of the [ANTIDETONATION_SYSTEM.N] section in the aircraft configuration files: Units gallons: settable false |
| onChange_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | trigger_onChange_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | The maximum quantity of water/methanol mixture in the ADI tank for the indexed engine. This value is set as part of the [ANTIDETONATION_SYSTEM.N] section in the aircraft configuration files: Units gallons: settable false |
| onRequest_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | trigger_onRequest_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index | The maximum quantity of water/methanol mixture in the ADI tank for the indexed engine. This value is set as part of the [ANTIDETONATION_SYSTEM.N] section in the aircraft configuration files: Units gallons: settable false |
| RECIP ENG ANTIDETONATION TANK QUANTITY:index | trigger_RECIP ENG ANTIDETONATION TANK QUANTITY:index | The quantity of water/methanol mixture currently in the ADI tank for the indexed engine: Units gallons: settable true |
| onChange_RECIP ENG ANTIDETONATION TANK QUANTITY:index | trigger_onChange_RECIP ENG ANTIDETONATION TANK QUANTITY:index | The quantity of water/methanol mixture currently in the ADI tank for the indexed engine: Units gallons: settable true |
| onRequest_RECIP ENG ANTIDETONATION TANK QUANTITY:index | trigger_onRequest_RECIP ENG ANTIDETONATION TANK QUANTITY:index | The quantity of water/methanol mixture currently in the ADI tank for the indexed engine: Units gallons: settable true |
| RECIP ENG ANTIDETONATION TANK VALVE:index | trigger_RECIP ENG ANTIDETONATION TANK VALVE:index | The status of the ADI tank valve for the indexed engine: Units bool: settable true |
| onChange_RECIP ENG ANTIDETONATION TANK VALVE:index | trigger_onChange_RECIP ENG ANTIDETONATION TANK VALVE:index | The status of the ADI tank valve for the indexed engine: Units bool: settable true |
| onRequest_RECIP ENG ANTIDETONATION TANK VALVE:index | trigger_onRequest_RECIP ENG ANTIDETONATION TANK VALVE:index | The status of the ADI tank valve for the indexed engine: Units bool: settable true |
| RECIP ENG BRAKE POWER:index | trigger_RECIP ENG BRAKE POWER:index | Brake power produced by the indexed engine: Units pounds: settable true |
| onChange_RECIP ENG BRAKE POWER:index | trigger_onChange_RECIP ENG BRAKE POWER:index | Brake power produced by the indexed engine: Units pounds: settable true |
| onRequest_RECIP ENG BRAKE POWER:index | trigger_onRequest_RECIP ENG BRAKE POWER:index | Brake power produced by the indexed engine: Units pounds: settable true |
| RECIP ENG COOLANT RESERVOIR PERCENT:index | trigger_RECIP ENG COOLANT RESERVOIR PERCENT:index | Percent coolant available for the indexed engine: Units percent: settable true |
| onChange_RECIP ENG COOLANT RESERVOIR PERCENT:index | trigger_onChange_RECIP ENG COOLANT RESERVOIR PERCENT:index | Percent coolant available for the indexed engine: Units percent: settable true |
| onRequest_RECIP ENG COOLANT RESERVOIR PERCENT:index | trigger_onRequest_RECIP ENG COOLANT RESERVOIR PERCENT:index | Percent coolant available for the indexed engine: Units percent: settable true |
| RECIP ENG COWL FLAP POSITION:index | trigger_RECIP ENG COWL FLAP POSITION:index | Percent cowl flap opened for the indexed engine: Units percent: settable true |
| onChange_RECIP ENG COWL FLAP POSITION:index | trigger_onChange_RECIP ENG COWL FLAP POSITION:index | Percent cowl flap opened for the indexed engine: Units percent: settable true |
| onRequest_RECIP ENG COWL FLAP POSITION:index | trigger_onRequest_RECIP ENG COWL FLAP POSITION:index | Percent cowl flap opened for the indexed engine: Units percent: settable true |
| RECIP ENG CYLINDER HEAD TEMPERATURE:index | trigger_RECIP ENG CYLINDER HEAD TEMPERATURE:index | Engine cylinder head temperature for the indexed engine: Units celsius: settable true |
| onChange_RECIP ENG CYLINDER HEAD TEMPERATURE:index | trigger_onChange_RECIP ENG CYLINDER HEAD TEMPERATURE:index | Engine cylinder head temperature for the indexed engine: Units celsius: settable true |
| onRequest_RECIP ENG CYLINDER HEAD TEMPERATURE:index | trigger_onRequest_RECIP ENG CYLINDER HEAD TEMPERATURE:index | Engine cylinder head temperature for the indexed engine: Units celsius: settable true |
| RECIP ENG CYLINDER HEALTH:index | trigger_RECIP ENG CYLINDER HEALTH:index | Index high 16 bits is engine number, low16 cylinder number, both indexed from 1: Units percent Over 100: settable false |
| onChange_RECIP ENG CYLINDER HEALTH:index | trigger_onChange_RECIP ENG CYLINDER HEALTH:index | Index high 16 bits is engine number, low16 cylinder number, both indexed from 1: Units percent Over 100: settable false |
| onRequest_RECIP ENG CYLINDER HEALTH:index | trigger_onRequest_RECIP ENG CYLINDER HEALTH:index | Index high 16 bits is engine number, low16 cylinder number, both indexed from 1: Units percent Over 100: settable false |
| RECIP ENG DETONATING:index | trigger_RECIP ENG DETONATING:index | Set to 1 (TRUE) if the indexed engine is detonating: Units bool: settable false |
| onChange_RECIP ENG DETONATING:index | trigger_onChange_RECIP ENG DETONATING:index | Set to 1 (TRUE) if the indexed engine is detonating: Units bool: settable false |
| onRequest_RECIP ENG DETONATING:index | trigger_onRequest_RECIP ENG DETONATING:index | Set to 1 (TRUE) if the indexed engine is detonating: Units bool: settable false |
| RECIP ENG EMERGENCY BOOST ACTIVE:index | trigger_RECIP ENG EMERGENCY BOOST ACTIVE:index | Whether emergency boost is active (1, TRUE) or not (0, FALSE) for the indexed engine: Units bool: settable true |
| onChange_RECIP ENG EMERGENCY BOOST ACTIVE:index | trigger_onChange_RECIP ENG EMERGENCY BOOST ACTIVE:index | Whether emergency boost is active (1, TRUE) or not (0, FALSE) for the indexed engine: Units bool: settable true |
| onRequest_RECIP ENG EMERGENCY BOOST ACTIVE:index | trigger_onRequest_RECIP ENG EMERGENCY BOOST ACTIVE:index | Whether emergency boost is active (1, TRUE) or not (0, FALSE) for the indexed engine: Units bool: settable true |
| RECIP ENG EMERGENCY BOOST ELAPSED TIME:index | trigger_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index |  The elapsed time that emergency boost has been active on the indexed engine. The timer will start when boost is first activated: Units hours: settable true |
| onChange_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index | trigger_onChange_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index |  The elapsed time that emergency boost has been active on the indexed engine. The timer will start when boost is first activated: Units hours: settable true |
| onRequest_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index | trigger_onRequest_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index |  The elapsed time that emergency boost has been active on the indexed engine. The timer will start when boost is first activated: Units hours: settable true |
| RECIP ENG ENGINE MASTER SWITCH:index | trigger_RECIP ENG ENGINE MASTER SWITCH:index | Whether or not the Engine Master switch is active on an indexed engine: Units bool: settable false |
| onChange_RECIP ENG ENGINE MASTER SWITCH:index | trigger_onChange_RECIP ENG ENGINE MASTER SWITCH:index | Whether or not the Engine Master switch is active on an indexed engine: Units bool: settable false |
| onRequest_RECIP ENG ENGINE MASTER SWITCH:index | trigger_onRequest_RECIP ENG ENGINE MASTER SWITCH:index | Whether or not the Engine Master switch is active on an indexed engine: Units bool: settable false |
| RECIP ENG FUEL AVAILABLE:index | trigger_RECIP ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable true |
| onChange_RECIP ENG FUEL AVAILABLE:index | trigger_onChange_RECIP ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable true |
| onRequest_RECIP ENG FUEL AVAILABLE:index | trigger_onRequest_RECIP ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable true |
| RECIP ENG FUEL FLOW:index | trigger_RECIP ENG FUEL FLOW:index | The indexed engine fuel flow: Units pounds per hour: settable true |
| onChange_RECIP ENG FUEL FLOW:index | trigger_onChange_RECIP ENG FUEL FLOW:index | The indexed engine fuel flow: Units pounds per hour: settable true |
| onRequest_RECIP ENG FUEL FLOW:index | trigger_onRequest_RECIP ENG FUEL FLOW:index | The indexed engine fuel flow: Units pounds per hour: settable true |
| RECIP ENG FUEL NUMBER TANKS USED:index | trigger_RECIP ENG FUEL NUMBER TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| onChange_RECIP ENG FUEL NUMBER TANKS USED:index | trigger_onChange_RECIP ENG FUEL NUMBER TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| onRequest_RECIP ENG FUEL NUMBER TANKS USED:index | trigger_onRequest_RECIP ENG FUEL NUMBER TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| RECIP ENG FUEL TANK SELECTOR:index | trigger_RECIP ENG FUEL TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| onChange_RECIP ENG FUEL TANK SELECTOR:index | trigger_onChange_RECIP ENG FUEL TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| onRequest_RECIP ENG FUEL TANK SELECTOR:index | trigger_onRequest_RECIP ENG FUEL TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| RECIP ENG FUEL TANKS USED:index | trigger_RECIP ENG FUEL TANKS USED:index | Fuel tanks used by the indexed engine, one or more bit flags: Units mask: settable true |
| onChange_RECIP ENG FUEL TANKS USED:index | trigger_onChange_RECIP ENG FUEL TANKS USED:index | Fuel tanks used by the indexed engine, one or more bit flags: Units mask: settable true |
| onRequest_RECIP ENG FUEL TANKS USED:index | trigger_onRequest_RECIP ENG FUEL TANKS USED:index | Fuel tanks used by the indexed engine, one or more bit flags: Units mask: settable true |
| RECIP ENG GLOW PLUG ACTIVE:index | trigger_RECIP ENG GLOW PLUG ACTIVE:index | Whether or not the Glow Plug is active on the indexed engine: Units bool: settable false |
| onChange_RECIP ENG GLOW PLUG ACTIVE:index | trigger_onChange_RECIP ENG GLOW PLUG ACTIVE:index | Whether or not the Glow Plug is active on the indexed engine: Units bool: settable false |
| onRequest_RECIP ENG GLOW PLUG ACTIVE:index | trigger_onRequest_RECIP ENG GLOW PLUG ACTIVE:index | Whether or not the Glow Plug is active on the indexed engine: Units bool: settable false |
| RECIP ENG LEFT MAGNETO:index | trigger_RECIP ENG LEFT MAGNETO:index |  Left magneto state for the indexed engine: Units bool: settable true |
| onChange_RECIP ENG LEFT MAGNETO:index | trigger_onChange_RECIP ENG LEFT MAGNETO:index |  Left magneto state for the indexed engine: Units bool: settable true |
| onRequest_RECIP ENG LEFT MAGNETO:index | trigger_onRequest_RECIP ENG LEFT MAGNETO:index |  Left magneto state for the indexed engine: Units bool: settable true |
| RECIP ENG MANIFOLD PRESSURE:index | trigger_RECIP ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units pounds: settable true |
| onChange_RECIP ENG MANIFOLD PRESSURE:index | trigger_onChange_RECIP ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units pounds: settable true |
| onRequest_RECIP ENG MANIFOLD PRESSURE:index | trigger_onRequest_RECIP ENG MANIFOLD PRESSURE:index | The indexed engine manifold pressure: Units pounds: settable true |
| RECIP ENG NITROUS TANK MAX QUANTITY:index | trigger_RECIP ENG NITROUS TANK MAX QUANTITY:index | The maximum quantity of nitrous permitted per indexed engine: Units gallons: settable false |
| onChange_RECIP ENG NITROUS TANK MAX QUANTITY:index | trigger_onChange_RECIP ENG NITROUS TANK MAX QUANTITY:index | The maximum quantity of nitrous permitted per indexed engine: Units gallons: settable false |
| onRequest_RECIP ENG NITROUS TANK MAX QUANTITY:index | trigger_onRequest_RECIP ENG NITROUS TANK MAX QUANTITY:index | The maximum quantity of nitrous permitted per indexed engine: Units gallons: settable false |
| RECIP ENG NITROUS TANK QUANTITY:index | trigger_RECIP ENG NITROUS TANK QUANTITY:index | The quantity of nitrous per indexed engine: Units gallons: settable true |
| onChange_RECIP ENG NITROUS TANK QUANTITY:index | trigger_onChange_RECIP ENG NITROUS TANK QUANTITY:index | The quantity of nitrous per indexed engine: Units gallons: settable true |
| onRequest_RECIP ENG NITROUS TANK QUANTITY:index | trigger_onRequest_RECIP ENG NITROUS TANK QUANTITY:index | The quantity of nitrous per indexed engine: Units gallons: settable true |
| RECIP ENG NITROUS TANK VALVE | trigger_RECIP ENG NITROUS TANK VALVE | The statte of the nitrous tank valve for the indexed engine. Either 1 (TRUE) for open or 0 (FALSE) for closed: Units bool: settable true |
| onChange_RECIP ENG NITROUS TANK VALVE | trigger_onChange_RECIP ENG NITROUS TANK VALVE | The statte of the nitrous tank valve for the indexed engine. Either 1 (TRUE) for open or 0 (FALSE) for closed: Units bool: settable true |
| onRequest_RECIP ENG NITROUS TANK VALVE | trigger_onRequest_RECIP ENG NITROUS TANK VALVE | The statte of the nitrous tank valve for the indexed engine. Either 1 (TRUE) for open or 0 (FALSE) for closed: Units bool: settable true |
| RECIP ENG NUM CYLINDERS FAILED:index | trigger_RECIP ENG NUM CYLINDERS FAILED:index | The number of cylinders that have failed in the indexed engine: Units number: settable false |
| onChange_RECIP ENG NUM CYLINDERS FAILED:index | trigger_onChange_RECIP ENG NUM CYLINDERS FAILED:index | The number of cylinders that have failed in the indexed engine: Units number: settable false |
| onRequest_RECIP ENG NUM CYLINDERS FAILED:index | trigger_onRequest_RECIP ENG NUM CYLINDERS FAILED:index | The number of cylinders that have failed in the indexed engine: Units number: settable false |
| RECIP ENG NUM CYLINDERS:index | trigger_RECIP ENG NUM CYLINDERS:index | The number of cylinders for the indexed engine: Units number: settable false |
| onChange_RECIP ENG NUM CYLINDERS:index | trigger_onChange_RECIP ENG NUM CYLINDERS:index | The number of cylinders for the indexed engine: Units number: settable false |
| onRequest_RECIP ENG NUM CYLINDERS:index | trigger_onRequest_RECIP ENG NUM CYLINDERS:index | The number of cylinders for the indexed engine: Units number: settable false |
| RECIP ENG PRIMER:index | trigger_RECIP ENG PRIMER:index | The indexed engine primer state: Units bool: settable true |
| onChange_RECIP ENG PRIMER:index | trigger_onChange_RECIP ENG PRIMER:index | The indexed engine primer state: Units bool: settable true |
| onRequest_RECIP ENG PRIMER:index | trigger_onRequest_RECIP ENG PRIMER:index | The indexed engine primer state: Units bool: settable true |
| RECIP ENG RADIATOR TEMPERATURE:index | trigger_RECIP ENG RADIATOR TEMPERATURE:index | The indexed engine radiator temperature: Units celsius: settable true |
| onChange_RECIP ENG RADIATOR TEMPERATURE:index | trigger_onChange_RECIP ENG RADIATOR TEMPERATURE:index | The indexed engine radiator temperature: Units celsius: settable true |
| onRequest_RECIP ENG RADIATOR TEMPERATURE:index | trigger_onRequest_RECIP ENG RADIATOR TEMPERATURE:index | The indexed engine radiator temperature: Units celsius: settable true |
| RECIP ENG RIGHT MAGNETO:index | trigger_RECIP ENG RIGHT MAGNETO:index |  The indexed engine right magneto state: Units bool: settable true |
| onChange_RECIP ENG RIGHT MAGNETO:index | trigger_onChange_RECIP ENG RIGHT MAGNETO:index |  The indexed engine right magneto state: Units bool: settable true |
| onRequest_RECIP ENG RIGHT MAGNETO:index | trigger_onRequest_RECIP ENG RIGHT MAGNETO:index |  The indexed engine right magneto state: Units bool: settable true |
| RECIP ENG STARTER TORQUE:index | trigger_RECIP ENG STARTER TORQUE:index | Torque produced by the indexed engine: Units foot pound: settable true |
| onChange_RECIP ENG STARTER TORQUE:index | trigger_onChange_RECIP ENG STARTER TORQUE:index | Torque produced by the indexed engine: Units foot pound: settable true |
| onRequest_RECIP ENG STARTER TORQUE:index | trigger_onRequest_RECIP ENG STARTER TORQUE:index | Torque produced by the indexed engine: Units foot pound: settable true |
| RECIP ENG SUPERCHARGER ACTIVE GEAR:index | trigger_RECIP ENG SUPERCHARGER ACTIVE GEAR:index | Returns which of the supercharger gears is engaged for the indexed engine: Units number: settable false |
| onChange_RECIP ENG SUPERCHARGER ACTIVE GEAR:index | trigger_onChange_RECIP ENG SUPERCHARGER ACTIVE GEAR:index | Returns which of the supercharger gears is engaged for the indexed engine: Units number: settable false |
| onRequest_RECIP ENG SUPERCHARGER ACTIVE GEAR:index | trigger_onRequest_RECIP ENG SUPERCHARGER ACTIVE GEAR:index | Returns which of the supercharger gears is engaged for the indexed engine: Units number: settable false |
| RECIP ENG TURBINE INLET TEMPERATURE:index | trigger_RECIP ENG TURBINE INLET TEMPERATURE:index | The indexed engine turbine inlet temperature: Units celsius: settable true |
| onChange_RECIP ENG TURBINE INLET TEMPERATURE:index | trigger_onChange_RECIP ENG TURBINE INLET TEMPERATURE:index | The indexed engine turbine inlet temperature: Units celsius: settable true |
| onRequest_RECIP ENG TURBINE INLET TEMPERATURE:index | trigger_onRequest_RECIP ENG TURBINE INLET TEMPERATURE:index | The indexed engine turbine inlet temperature: Units celsius: settable true |
| RECIP ENG TURBOCHARGER FAILED:index | trigger_RECIP ENG TURBOCHARGER FAILED:index | The indexed engine turbo failed state: Units bool: settable true |
| onChange_RECIP ENG TURBOCHARGER FAILED:index | trigger_onChange_RECIP ENG TURBOCHARGER FAILED:index | The indexed engine turbo failed state: Units bool: settable true |
| onRequest_RECIP ENG TURBOCHARGER FAILED:index | trigger_onRequest_RECIP ENG TURBOCHARGER FAILED:index | The indexed engine turbo failed state: Units bool: settable true |
| RECIP ENG WASTEGATE POSITION:index | trigger_RECIP ENG WASTEGATE POSITION:index | When the engine.cfg parameter turbocharged is TRUE, this SimVar will return the percentage that the turbo waste gate is closed for the indexed engine. If the turbocharged variable is FALSE and the manifold_pressure_regulator parameter is TRUE, then this will return the percentage that the manifold pressure regulator is closed for the indexed engine: Units percent: settable true |
| onChange_RECIP ENG WASTEGATE POSITION:index | trigger_onChange_RECIP ENG WASTEGATE POSITION:index | When the engine.cfg parameter turbocharged is TRUE, this SimVar will return the percentage that the turbo waste gate is closed for the indexed engine. If the turbocharged variable is FALSE and the manifold_pressure_regulator parameter is TRUE, then this will return the percentage that the manifold pressure regulator is closed for the indexed engine: Units percent: settable true |
| onRequest_RECIP ENG WASTEGATE POSITION:index | trigger_onRequest_RECIP ENG WASTEGATE POSITION:index | When the engine.cfg parameter turbocharged is TRUE, this SimVar will return the percentage that the turbo waste gate is closed for the indexed engine. If the turbocharged variable is FALSE and the manifold_pressure_regulator parameter is TRUE, then this will return the percentage that the manifold pressure regulator is closed for the indexed engine: Units percent: settable true |
| RECIP MAX CHT | trigger_RECIP MAX CHT | This will return the cylinder head temperature value set by the cht_heating_constant parameter in the engine.cfg file: Units rankine: settable false |
| onChange_RECIP MAX CHT | trigger_onChange_RECIP MAX CHT | This will return the cylinder head temperature value set by the cht_heating_constant parameter in the engine.cfg file: Units rankine: settable false |
| onRequest_RECIP MAX CHT | trigger_onRequest_RECIP MAX CHT | This will return the cylinder head temperature value set by the cht_heating_constant parameter in the engine.cfg file: Units rankine: settable false |
| RECIP MIXTURE RATIO:index | trigger_RECIP MIXTURE RATIO:index | Fuel / Air mixture ratio for the indexed engine: Units ratio: settable true |
| onChange_RECIP MIXTURE RATIO:index | trigger_onChange_RECIP MIXTURE RATIO:index | Fuel / Air mixture ratio for the indexed engine: Units ratio: settable true |
| onRequest_RECIP MIXTURE RATIO:index | trigger_onRequest_RECIP MIXTURE RATIO:index | Fuel / Air mixture ratio for the indexed engine: Units ratio: settable true |
| REJECTED TAKEOFF BRAKES ACTIVE | trigger_REJECTED TAKEOFF BRAKES ACTIVE | Whether or not the rejected takeoff brakes are currently active.: Units bool: settable false |
| onChange_REJECTED TAKEOFF BRAKES ACTIVE | trigger_onChange_REJECTED TAKEOFF BRAKES ACTIVE | Whether or not the rejected takeoff brakes are currently active.: Units bool: settable false |
| onRequest_REJECTED TAKEOFF BRAKES ACTIVE | trigger_onRequest_REJECTED TAKEOFF BRAKES ACTIVE | Whether or not the rejected takeoff brakes are currently active.: Units bool: settable false |
| RELATIVE WIND VELOCITY BODY X | trigger_RELATIVE WIND VELOCITY BODY X | Lateral (X axis) speed relative to wind: Units feet: settable false |
| onChange_RELATIVE WIND VELOCITY BODY X | trigger_onChange_RELATIVE WIND VELOCITY BODY X | Lateral (X axis) speed relative to wind: Units feet: settable false |
| onRequest_RELATIVE WIND VELOCITY BODY X | trigger_onRequest_RELATIVE WIND VELOCITY BODY X | Lateral (X axis) speed relative to wind: Units feet: settable false |
| RELATIVE WIND VELOCITY BODY Y | trigger_RELATIVE WIND VELOCITY BODY Y | Vertical (Y axis) speed relative to wind: Units feet: settable false |
| onChange_RELATIVE WIND VELOCITY BODY Y | trigger_onChange_RELATIVE WIND VELOCITY BODY Y | Vertical (Y axis) speed relative to wind: Units feet: settable false |
| onRequest_RELATIVE WIND VELOCITY BODY Y | trigger_onRequest_RELATIVE WIND VELOCITY BODY Y | Vertical (Y axis) speed relative to wind: Units feet: settable false |
| RELATIVE WIND VELOCITY BODY Z | trigger_RELATIVE WIND VELOCITY BODY Z | Longitudinal (Z axis) speed relative to wind: Units feet: settable false |
| onChange_RELATIVE WIND VELOCITY BODY Z | trigger_onChange_RELATIVE WIND VELOCITY BODY Z | Longitudinal (Z axis) speed relative to wind: Units feet: settable false |
| onRequest_RELATIVE WIND VELOCITY BODY Z | trigger_onRequest_RELATIVE WIND VELOCITY BODY Z | Longitudinal (Z axis) speed relative to wind: Units feet: settable false |
| RETRACT FLOAT SWITCH | trigger_RETRACT FLOAT SWITCH | True if retract float switch on: Units bool: settable false |
| onChange_RETRACT FLOAT SWITCH | trigger_onChange_RETRACT FLOAT SWITCH | True if retract float switch on: Units bool: settable false |
| onRequest_RETRACT FLOAT SWITCH | trigger_onRequest_RETRACT FLOAT SWITCH | True if retract float switch on: Units bool: settable false |
| RETRACT LEFT FLOAT EXTENDED | trigger_RETRACT LEFT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| onChange_RETRACT LEFT FLOAT EXTENDED | trigger_onChange_RETRACT LEFT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| onRequest_RETRACT LEFT FLOAT EXTENDED | trigger_onRequest_RETRACT LEFT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| RETRACT RIGHT FLOAT EXTENDED | trigger_RETRACT RIGHT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| onChange_RETRACT RIGHT FLOAT EXTENDED | trigger_onChange_RETRACT RIGHT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| onRequest_RETRACT RIGHT FLOAT EXTENDED | trigger_onRequest_RETRACT RIGHT FLOAT EXTENDED | If aircraft has retractable floats: Units percent: settable false |
| RIGHT WHEEL ROTATION ANGLE | trigger_RIGHT WHEEL ROTATION ANGLE | Right wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onChange_RIGHT WHEEL ROTATION ANGLE | trigger_onChange_RIGHT WHEEL ROTATION ANGLE | Right wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onRequest_RIGHT WHEEL ROTATION ANGLE | trigger_onRequest_RIGHT WHEEL ROTATION ANGLE | Right wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| RIGHT WHEEL RPM | trigger_RIGHT WHEEL RPM | Right landing gear rpm.: Units RPM: settable false |
| onChange_RIGHT WHEEL RPM | trigger_onChange_RIGHT WHEEL RPM | Right landing gear rpm.: Units RPM: settable false |
| onRequest_RIGHT WHEEL RPM | trigger_onRequest_RIGHT WHEEL RPM | Right landing gear rpm.: Units RPM: settable false |
| ROTATION ACCELERATION BODY X | trigger_ROTATION ACCELERATION BODY X | Rotation acceleration relative to aircraft X axis: Units radians per second squared: settable true |
| onChange_ROTATION ACCELERATION BODY X | trigger_onChange_ROTATION ACCELERATION BODY X | Rotation acceleration relative to aircraft X axis: Units radians per second squared: settable true |
| onRequest_ROTATION ACCELERATION BODY X | trigger_onRequest_ROTATION ACCELERATION BODY X | Rotation acceleration relative to aircraft X axis: Units radians per second squared: settable true |
| ROTATION ACCELERATION BODY Y | trigger_ROTATION ACCELERATION BODY Y | Rotation acceleration relative to aircraft Y axis: Units radians per second squared: settable true |
| onChange_ROTATION ACCELERATION BODY Y | trigger_onChange_ROTATION ACCELERATION BODY Y | Rotation acceleration relative to aircraft Y axis: Units radians per second squared: settable true |
| onRequest_ROTATION ACCELERATION BODY Y | trigger_onRequest_ROTATION ACCELERATION BODY Y | Rotation acceleration relative to aircraft Y axis: Units radians per second squared: settable true |
| ROTATION ACCELERATION BODY Z | trigger_ROTATION ACCELERATION BODY Z | Rotation acceleration relative to aircraft Z axis: Units radians per second squared: settable true |
| onChange_ROTATION ACCELERATION BODY Z | trigger_onChange_ROTATION ACCELERATION BODY Z | Rotation acceleration relative to aircraft Z axis: Units radians per second squared: settable true |
| onRequest_ROTATION ACCELERATION BODY Z | trigger_onRequest_ROTATION ACCELERATION BODY Z | Rotation acceleration relative to aircraft Z axis: Units radians per second squared: settable true |
| ROTATION VELOCITY BODY X | trigger_ROTATION VELOCITY BODY X | Rotation velocity relative to aircraft X axis: Units feet: settable true |
| onChange_ROTATION VELOCITY BODY X | trigger_onChange_ROTATION VELOCITY BODY X | Rotation velocity relative to aircraft X axis: Units feet: settable true |
| onRequest_ROTATION VELOCITY BODY X | trigger_onRequest_ROTATION VELOCITY BODY X | Rotation velocity relative to aircraft X axis: Units feet: settable true |
| ROTATION VELOCITY BODY Y | trigger_ROTATION VELOCITY BODY Y | Rotation velocity relative to aircraft Y axis: Units feet: settable true |
| onChange_ROTATION VELOCITY BODY Y | trigger_onChange_ROTATION VELOCITY BODY Y | Rotation velocity relative to aircraft Y axis: Units feet: settable true |
| onRequest_ROTATION VELOCITY BODY Y | trigger_onRequest_ROTATION VELOCITY BODY Y | Rotation velocity relative to aircraft Y axis: Units feet: settable true |
| ROTATION VELOCITY BODY Z | trigger_ROTATION VELOCITY BODY Z | Rotation velocity relative to aircraft Z axis: Units feet: settable true |
| onChange_ROTATION VELOCITY BODY Z | trigger_onChange_ROTATION VELOCITY BODY Z | Rotation velocity relative to aircraft Z axis: Units feet: settable true |
| onRequest_ROTATION VELOCITY BODY Z | trigger_onRequest_ROTATION VELOCITY BODY Z | Rotation velocity relative to aircraft Z axis: Units feet: settable true |
| ROTOR BRAKE ACTIVE | trigger_ROTOR BRAKE ACTIVE | Whether the rotor brake is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onChange_ROTOR BRAKE ACTIVE | trigger_onChange_ROTOR BRAKE ACTIVE | Whether the rotor brake is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR BRAKE ACTIVE | trigger_onRequest_ROTOR BRAKE ACTIVE | Whether the rotor brake is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| ROTOR BRAKE HANDLE POS | trigger_ROTOR BRAKE HANDLE POS | The percentage actuated of the rotor brake handle.: Units percent Over 100: settable false |
| onChange_ROTOR BRAKE HANDLE POS | trigger_onChange_ROTOR BRAKE HANDLE POS | The percentage actuated of the rotor brake handle.: Units percent Over 100: settable false |
| onRequest_ROTOR BRAKE HANDLE POS | trigger_onRequest_ROTOR BRAKE HANDLE POS | The percentage actuated of the rotor brake handle.: Units percent Over 100: settable false |
| ROTOR CHIP DETECTED | trigger_ROTOR CHIP DETECTED | Whether the rotor chip is detected (1,TRUE) or not (0, FALSE).: Units bool: settable false |
| onChange_ROTOR CHIP DETECTED | trigger_onChange_ROTOR CHIP DETECTED | Whether the rotor chip is detected (1,TRUE) or not (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR CHIP DETECTED | trigger_onRequest_ROTOR CHIP DETECTED | Whether the rotor chip is detected (1,TRUE) or not (0, FALSE).: Units bool: settable false |
| ROTOR CLUTCH ACTIVE | trigger_ROTOR CLUTCH ACTIVE | Whether the rotor clutch is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onChange_ROTOR CLUTCH ACTIVE | trigger_onChange_ROTOR CLUTCH ACTIVE | Whether the rotor clutch is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR CLUTCH ACTIVE | trigger_onRequest_ROTOR CLUTCH ACTIVE | Whether the rotor clutch is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| ROTOR CLUTCH SWITCH POS | trigger_ROTOR CLUTCH SWITCH POS | The rotor clutch switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| onChange_ROTOR CLUTCH SWITCH POS | trigger_onChange_ROTOR CLUTCH SWITCH POS | The rotor clutch switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR CLUTCH SWITCH POS | trigger_onRequest_ROTOR CLUTCH SWITCH POS | The rotor clutch switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| ROTOR COLLECTIVE BLADE PITCH PCT | trigger_ROTOR COLLECTIVE BLADE PITCH PCT | The rotor collective blade pitch.: Units percent Over 100: settable false |
| onChange_ROTOR COLLECTIVE BLADE PITCH PCT | trigger_onChange_ROTOR COLLECTIVE BLADE PITCH PCT | The rotor collective blade pitch.: Units percent Over 100: settable false |
| onRequest_ROTOR COLLECTIVE BLADE PITCH PCT | trigger_onRequest_ROTOR COLLECTIVE BLADE PITCH PCT | The rotor collective blade pitch.: Units percent Over 100: settable false |
| ROTOR CYCLIC BLADE MAX PITCH POSITION | trigger_ROTOR CYCLIC BLADE MAX PITCH POSITION | The position (angle) at which blade has the maximum cyclic pitch.: Units degrees: settable false |
| onChange_ROTOR CYCLIC BLADE MAX PITCH POSITION | trigger_onChange_ROTOR CYCLIC BLADE MAX PITCH POSITION | The position (angle) at which blade has the maximum cyclic pitch.: Units degrees: settable false |
| onRequest_ROTOR CYCLIC BLADE MAX PITCH POSITION | trigger_onRequest_ROTOR CYCLIC BLADE MAX PITCH POSITION | The position (angle) at which blade has the maximum cyclic pitch.: Units degrees: settable false |
| ROTOR CYCLIC BLADE PITCH PCT | trigger_ROTOR CYCLIC BLADE PITCH PCT | The rotor cyclic blade (maximum) pitch.: Units percent Over 100: settable false |
| onChange_ROTOR CYCLIC BLADE PITCH PCT | trigger_onChange_ROTOR CYCLIC BLADE PITCH PCT | The rotor cyclic blade (maximum) pitch.: Units percent Over 100: settable false |
| onRequest_ROTOR CYCLIC BLADE PITCH PCT | trigger_onRequest_ROTOR CYCLIC BLADE PITCH PCT | The rotor cyclic blade (maximum) pitch.: Units percent Over 100: settable false |
| ROTOR GOV ACTIVE | trigger_ROTOR GOV ACTIVE | Whether the rotor governor is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onChange_ROTOR GOV ACTIVE | trigger_onChange_ROTOR GOV ACTIVE | Whether the rotor governor is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR GOV ACTIVE | trigger_onRequest_ROTOR GOV ACTIVE | Whether the rotor governor is active (1, TRUE) or not (0, FALSE).: Units bool: settable false |
| ROTOR GOV SWITCH POS | trigger_ROTOR GOV SWITCH POS | The rotor governor switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| onChange_ROTOR GOV SWITCH POS | trigger_onChange_ROTOR GOV SWITCH POS | The rotor governor switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| onRequest_ROTOR GOV SWITCH POS | trigger_onRequest_ROTOR GOV SWITCH POS | The rotor governor switch position, either on (1 TRUE) or off (0, FALSE).: Units bool: settable false |
| ROTOR LATERAL TRIM PCT | trigger_ROTOR LATERAL TRIM PCT | The rotor lateral trim percentage.: Units percent Over 100: settable false |
| onChange_ROTOR LATERAL TRIM PCT | trigger_onChange_ROTOR LATERAL TRIM PCT | The rotor lateral trim percentage.: Units percent Over 100: settable false |
| onRequest_ROTOR LATERAL TRIM PCT | trigger_onRequest_ROTOR LATERAL TRIM PCT | The rotor lateral trim percentage.: Units percent Over 100: settable false |
| ROTOR LONGITUDINAL TRIM PCT | trigger_ROTOR LONGITUDINAL TRIM PCT | The rotor longitudinal trim percentage.: Units percent Over 100: settable false |
| onChange_ROTOR LONGITUDINAL TRIM PCT | trigger_onChange_ROTOR LONGITUDINAL TRIM PCT | The rotor longitudinal trim percentage.: Units percent Over 100: settable false |
| onRequest_ROTOR LONGITUDINAL TRIM PCT | trigger_onRequest_ROTOR LONGITUDINAL TRIM PCT | The rotor longitudinal trim percentage.: Units percent Over 100: settable false |
| ROTOR ROTATION ANGLE:index | trigger_ROTOR ROTATION ANGLE:index | Rotor rotation angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onChange_ROTOR ROTATION ANGLE:index | trigger_onChange_ROTOR ROTATION ANGLE:index | Rotor rotation angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| onRequest_ROTOR ROTATION ANGLE:index | trigger_onRequest_ROTOR ROTATION ANGLE:index | Rotor rotation angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians: settable false |
| ROTOR RPM PCT:index | trigger_ROTOR RPM PCT:index | Percent max rated rpm of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onChange_ROTOR RPM PCT:index | trigger_onChange_ROTOR RPM PCT:index | Percent max rated rpm of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| onRequest_ROTOR RPM PCT:index | trigger_onRequest_ROTOR RPM PCT:index | Percent max rated rpm of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100: settable false |
| ROTOR RPM:index | trigger_ROTOR RPM:index | The indexed rotor RPM.: Units RPM: settable false |
| onChange_ROTOR RPM:index | trigger_onChange_ROTOR RPM:index | The indexed rotor RPM.: Units RPM: settable false |
| onRequest_ROTOR RPM:index | trigger_onRequest_ROTOR RPM:index | The indexed rotor RPM.: Units RPM: settable false |
| ROTOR TEMPERATURE | trigger_ROTOR TEMPERATURE | The main rotor transmission temperature.: Units rankine: settable false |
| onChange_ROTOR TEMPERATURE | trigger_onChange_ROTOR TEMPERATURE | The main rotor transmission temperature.: Units rankine: settable false |
| onRequest_ROTOR TEMPERATURE | trigger_onRequest_ROTOR TEMPERATURE | The main rotor transmission temperature.: Units rankine: settable false |
| RUDDER DEFLECTION | trigger_RUDDER DEFLECTION | Angle deflection: Units radians: settable false |
| onChange_RUDDER DEFLECTION | trigger_onChange_RUDDER DEFLECTION | Angle deflection: Units radians: settable false |
| onRequest_RUDDER DEFLECTION | trigger_onRequest_RUDDER DEFLECTION | Angle deflection: Units radians: settable false |
| RUDDER DEFLECTION PCT | trigger_RUDDER DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onChange_RUDDER DEFLECTION PCT | trigger_onChange_RUDDER DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| onRequest_RUDDER DEFLECTION PCT | trigger_onRequest_RUDDER DEFLECTION PCT | Percent deflection: Units percent Over 100: settable false |
| RUDDER PEDAL INDICATOR | trigger_RUDDER PEDAL INDICATOR | Rudder pedal position: Units position: settable false |
| onChange_RUDDER PEDAL INDICATOR | trigger_onChange_RUDDER PEDAL INDICATOR | Rudder pedal position: Units position: settable false |
| onRequest_RUDDER PEDAL INDICATOR | trigger_onRequest_RUDDER PEDAL INDICATOR | Rudder pedal position: Units position: settable false |
| RUDDER PEDAL POSITION | trigger_RUDDER PEDAL POSITION | Percent rudder pedal deflection (for animation): Units position: settable true |
| onChange_RUDDER PEDAL POSITION | trigger_onChange_RUDDER PEDAL POSITION | Percent rudder pedal deflection (for animation): Units position: settable true |
| onRequest_RUDDER PEDAL POSITION | trigger_onRequest_RUDDER PEDAL POSITION | Percent rudder pedal deflection (for animation): Units position: settable true |
| RUDDER POSITION | trigger_RUDDER POSITION | Percent rudder input deflection: Units position: settable true |
| onChange_RUDDER POSITION | trigger_onChange_RUDDER POSITION | Percent rudder input deflection: Units position: settable true |
| onRequest_RUDDER POSITION | trigger_onRequest_RUDDER POSITION | Percent rudder input deflection: Units position: settable true |
| RUDDER TRIM | trigger_RUDDER TRIM | Angle deflection: Units radians: settable false |
| onChange_RUDDER TRIM | trigger_onChange_RUDDER TRIM | Angle deflection: Units radians: settable false |
| onRequest_RUDDER TRIM | trigger_onRequest_RUDDER TRIM | Angle deflection: Units radians: settable false |
| RUDDER TRIM DISABLED | trigger_RUDDER TRIM DISABLED | Whether or not the Rudder Trim has been disabled: Units bool: settable false |
| onChange_RUDDER TRIM DISABLED | trigger_onChange_RUDDER TRIM DISABLED | Whether or not the Rudder Trim has been disabled: Units bool: settable false |
| onRequest_RUDDER TRIM DISABLED | trigger_onRequest_RUDDER TRIM DISABLED | Whether or not the Rudder Trim has been disabled: Units bool: settable false |
| RUDDER TRIM PCT | trigger_RUDDER TRIM PCT | The trim position of the rudder. Zero is no trim: Units percent Over 100: settable true |
| onChange_RUDDER TRIM PCT | trigger_onChange_RUDDER TRIM PCT | The trim position of the rudder. Zero is no trim: Units percent Over 100: settable true |
| onRequest_RUDDER TRIM PCT | trigger_onRequest_RUDDER TRIM PCT | The trim position of the rudder. Zero is no trim: Units percent Over 100: settable true |
| SEA LEVEL PRESSURE | trigger_SEA LEVEL PRESSURE | Barometric pressure at sea level.: Units Millibars: settable false |
| onChange_SEA LEVEL PRESSURE | trigger_onChange_SEA LEVEL PRESSURE | Barometric pressure at sea level.: Units Millibars: settable false |
| onRequest_SEA LEVEL PRESSURE | trigger_onRequest_SEA LEVEL PRESSURE | Barometric pressure at sea level.: Units Millibars: settable false |
| SELECTED DME | trigger_SELECTED DME | Selected DME.: Units number: settable false |
| onChange_SELECTED DME | trigger_onChange_SELECTED DME | Selected DME.: Units number: settable false |
| onRequest_SELECTED DME | trigger_onRequest_SELECTED DME | Selected DME.: Units number: settable false |
| SEMIBODY LOADFACTOR Y | trigger_SEMIBODY LOADFACTOR Y | Acceleration along the axis Y divided by the gravity constant g (usually around 9.81m.s²): Units number: settable false |
| onChange_SEMIBODY LOADFACTOR Y | trigger_onChange_SEMIBODY LOADFACTOR Y | Acceleration along the axis Y divided by the gravity constant g (usually around 9.81m.s²): Units number: settable false |
| onRequest_SEMIBODY LOADFACTOR Y | trigger_onRequest_SEMIBODY LOADFACTOR Y | Acceleration along the axis Y divided by the gravity constant g (usually around 9.81m.s²): Units number: settable false |
| SEMIBODY LOADFACTOR YDOT | trigger_SEMIBODY LOADFACTOR YDOT | Derivative of SEMIBODY LOADFACTOR Y in relation to time.: Units number: settable false |
| onChange_SEMIBODY LOADFACTOR YDOT | trigger_onChange_SEMIBODY LOADFACTOR YDOT | Derivative of SEMIBODY LOADFACTOR Y in relation to time.: Units number: settable false |
| onRequest_SEMIBODY LOADFACTOR YDOT | trigger_onRequest_SEMIBODY LOADFACTOR YDOT | Derivative of SEMIBODY LOADFACTOR Y in relation to time.: Units number: settable false |
| SHUTOFF VALVE PULLED | trigger_SHUTOFF VALVE PULLED | This checks if the shutoff valve to the engine has been pulled (true) or not (false). When pulled piston engines will be blocked from getting any fuel: Units bool: settable false |
| onChange_SHUTOFF VALVE PULLED | trigger_onChange_SHUTOFF VALVE PULLED | This checks if the shutoff valve to the engine has been pulled (true) or not (false). When pulled piston engines will be blocked from getting any fuel: Units bool: settable false |
| onRequest_SHUTOFF VALVE PULLED | trigger_onRequest_SHUTOFF VALVE PULLED | This checks if the shutoff valve to the engine has been pulled (true) or not (false). When pulled piston engines will be blocked from getting any fuel: Units bool: settable false |
| SIGMA SQRT | trigger_SIGMA SQRT | Sigma sqrt: Units number: settable false |
| onChange_SIGMA SQRT | trigger_onChange_SIGMA SQRT | Sigma sqrt: Units number: settable false |
| onRequest_SIGMA SQRT | trigger_onRequest_SIGMA SQRT | Sigma sqrt: Units number: settable false |
| SIM DISABLED | trigger_SIM DISABLED | Is sim disabled.: Units bool: settable true |
| onChange_SIM DISABLED | trigger_onChange_SIM DISABLED | Is sim disabled.: Units bool: settable true |
| onRequest_SIM DISABLED | trigger_onRequest_SIM DISABLED | Is sim disabled.: Units bool: settable true |
| SIM ON GROUND | trigger_SIM ON GROUND | On ground flag.: Units bool: settable false |
| onChange_SIM ON GROUND | trigger_onChange_SIM ON GROUND | On ground flag.: Units bool: settable false |
| onRequest_SIM ON GROUND | trigger_onRequest_SIM ON GROUND | On ground flag.: Units bool: settable false |
| SIM SHOULD SET ON GROUND | trigger_SIM SHOULD SET ON GROUND | : Units bool: settable true |
| onChange_SIM SHOULD SET ON GROUND | trigger_onChange_SIM SHOULD SET ON GROUND | : Units bool: settable true |
| onRequest_SIM SHOULD SET ON GROUND | trigger_onRequest_SIM SHOULD SET ON GROUND | : Units bool: settable true |
| SIMULATED RADIUS | trigger_SIMULATED RADIUS | Simulated radius: Units feet: settable false |
| onChange_SIMULATED RADIUS | trigger_onChange_SIMULATED RADIUS | Simulated radius: Units feet: settable false |
| onRequest_SIMULATED RADIUS | trigger_onRequest_SIMULATED RADIUS | Simulated radius: Units feet: settable false |
| SLING CABLE BROKEN:index | trigger_SLING CABLE BROKEN:index | THis will be True (1) if the indexed cable is broken, or False (0) otherwise.: Units bool: settable false |
| onChange_SLING CABLE BROKEN:index | trigger_onChange_SLING CABLE BROKEN:index | THis will be True (1) if the indexed cable is broken, or False (0) otherwise.: Units bool: settable false |
| onRequest_SLING CABLE BROKEN:index | trigger_onRequest_SLING CABLE BROKEN:index | THis will be True (1) if the indexed cable is broken, or False (0) otherwise.: Units bool: settable false |
| SLING CABLE EXTENDED LENGTH:index | trigger_SLING CABLE EXTENDED LENGTH:index | The length of the indexed cable extending from the aircraft.: Units feet: settable true |
| onChange_SLING CABLE EXTENDED LENGTH:index | trigger_onChange_SLING CABLE EXTENDED LENGTH:index | The length of the indexed cable extending from the aircraft.: Units feet: settable true |
| onRequest_SLING CABLE EXTENDED LENGTH:index | trigger_onRequest_SLING CABLE EXTENDED LENGTH:index | The length of the indexed cable extending from the aircraft.: Units feet: settable true |
| SLING HOIST PERCENT DEPLOYED:index | trigger_SLING HOIST PERCENT DEPLOYED:index | The percentage of the full length of the sling cable deployed.: Units percent Over 100: settable false |
| onChange_SLING HOIST PERCENT DEPLOYED:index | trigger_onChange_SLING HOIST PERCENT DEPLOYED:index | The percentage of the full length of the sling cable deployed.: Units percent Over 100: settable false |
| onRequest_SLING HOIST PERCENT DEPLOYED:index | trigger_onRequest_SLING HOIST PERCENT DEPLOYED:index | The percentage of the full length of the sling cable deployed.: Units percent Over 100: settable false |
| SLING HOIST SWITCH:index | trigger_SLING HOIST SWITCH:index | This will be True (1) if the hoist is enabled or False (0) otherwise.: Units bool: settable true |
| onChange_SLING HOIST SWITCH:index | trigger_onChange_SLING HOIST SWITCH:index | This will be True (1) if the hoist is enabled or False (0) otherwise.: Units bool: settable true |
| onRequest_SLING HOIST SWITCH:index | trigger_onRequest_SLING HOIST SWITCH:index | This will be True (1) if the hoist is enabled or False (0) otherwise.: Units bool: settable true |
| SLING HOOK IN PICKUP MODE | trigger_SLING HOOK IN PICKUP MODE | This will be True (1) if the hook is in pickup mode or False (0) otherwise. When True, the hook will be capable of picking up another object.: Units bool: settable false |
| onChange_SLING HOOK IN PICKUP MODE | trigger_onChange_SLING HOOK IN PICKUP MODE | This will be True (1) if the hook is in pickup mode or False (0) otherwise. When True, the hook will be capable of picking up another object.: Units bool: settable false |
| onRequest_SLING HOOK IN PICKUP MODE | trigger_onRequest_SLING HOOK IN PICKUP MODE | This will be True (1) if the hook is in pickup mode or False (0) otherwise. When True, the hook will be capable of picking up another object.: Units bool: settable false |
| SLOPE TO ATC RUNWAY | trigger_SLOPE TO ATC RUNWAY | The slope between the plane and the expected landing position of the runway. Returns 0 if no runway is assigned: Units radians: settable false |
| onChange_SLOPE TO ATC RUNWAY | trigger_onChange_SLOPE TO ATC RUNWAY | The slope between the plane and the expected landing position of the runway. Returns 0 if no runway is assigned: Units radians: settable false |
| onRequest_SLOPE TO ATC RUNWAY | trigger_onRequest_SLOPE TO ATC RUNWAY | The slope between the plane and the expected landing position of the runway. Returns 0 if no runway is assigned: Units radians: settable false |
| SMART CAMERA ACTIVE | trigger_SMART CAMERA ACTIVE | Sets/gets the whether the smart camera is active or not.: Units bool: settable true |
| onChange_SMART CAMERA ACTIVE | trigger_onChange_SMART CAMERA ACTIVE | Sets/gets the whether the smart camera is active or not.: Units bool: settable true |
| onRequest_SMART CAMERA ACTIVE | trigger_onRequest_SMART CAMERA ACTIVE | Sets/gets the whether the smart camera is active or not.: Units bool: settable true |
| SMART CAMERA INFO:index | trigger_SMART CAMERA INFO:index | Gets information on the smartcam system. The index sets what kind of information will be returned (or set).: Units number: settable true |
| onChange_SMART CAMERA INFO:index | trigger_onChange_SMART CAMERA INFO:index | Gets information on the smartcam system. The index sets what kind of information will be returned (or set).: Units number: settable true |
| onRequest_SMART CAMERA INFO:index | trigger_onRequest_SMART CAMERA INFO:index | Gets information on the smartcam system. The index sets what kind of information will be returned (or set).: Units number: settable true |
| SMART CAMERA LIST DESCRIPTION:index | trigger_SMART CAMERA LIST DESCRIPTION:index | This returns a localized string that represents the smartcam target specified by the given index. Indices count from 0 so index 0 is the first target in the list. 	String: Units null: settable false |
| onChange_SMART CAMERA LIST DESCRIPTION:index | trigger_onChange_SMART CAMERA LIST DESCRIPTION:index | This returns a localized string that represents the smartcam target specified by the given index. Indices count from 0 so index 0 is the first target in the list. 	String: Units null: settable false |
| onRequest_SMART CAMERA LIST DESCRIPTION:index | trigger_onRequest_SMART CAMERA LIST DESCRIPTION:index | This returns a localized string that represents the smartcam target specified by the given index. Indices count from 0 so index 0 is the first target in the list. 	String: Units null: settable false |
| SMART CAMERA LIST:index | trigger_SMART CAMERA LIST:index | Retrieves the type of target for the indexed position in the smartcam list, counting from 0 (so index 0 is the first target in the list).: Units enum: settable true |
| onChange_SMART CAMERA LIST:index | trigger_onChange_SMART CAMERA LIST:index | Retrieves the type of target for the indexed position in the smartcam list, counting from 0 (so index 0 is the first target in the list).: Units enum: settable true |
| onRequest_SMART CAMERA LIST:index | trigger_onRequest_SMART CAMERA LIST:index | Retrieves the type of target for the indexed position in the smartcam list, counting from 0 (so index 0 is the first target in the list).: Units enum: settable true |
| SMOKE ENABLE | trigger_SMOKE ENABLE | Set to True to activate the smoke system, if one is available. Please see the notes for SMOKESYSTEM AVAILABLE for more information.: Units bool: settable true |
| onChange_SMOKE ENABLE | trigger_onChange_SMOKE ENABLE | Set to True to activate the smoke system, if one is available. Please see the notes for SMOKESYSTEM AVAILABLE for more information.: Units bool: settable true |
| onRequest_SMOKE ENABLE | trigger_onRequest_SMOKE ENABLE | Set to True to activate the smoke system, if one is available. Please see the notes for SMOKESYSTEM AVAILABLE for more information.: Units bool: settable true |
| SMOKESYSTEM AVAILABLE | trigger_SMOKESYSTEM AVAILABLE | Smoke system available.: Units bool: settable false |
| onChange_SMOKESYSTEM AVAILABLE | trigger_onChange_SMOKESYSTEM AVAILABLE | Smoke system available.: Units bool: settable false |
| onRequest_SMOKESYSTEM AVAILABLE | trigger_onRequest_SMOKESYSTEM AVAILABLE | Smoke system available.: Units bool: settable false |
| SPEAKER ACTIVE | trigger_SPEAKER ACTIVE | Whether or not the speaker is active.: Units bool: settable false |
| onChange_SPEAKER ACTIVE | trigger_onChange_SPEAKER ACTIVE | Whether or not the speaker is active.: Units bool: settable false |
| onRequest_SPEAKER ACTIVE | trigger_onRequest_SPEAKER ACTIVE | Whether or not the speaker is active.: Units bool: settable false |
| SPOILER AVAILABLE | trigger_SPOILER AVAILABLE | True if spoiler system available: Units bool: settable false |
| onChange_SPOILER AVAILABLE | trigger_onChange_SPOILER AVAILABLE | True if spoiler system available: Units bool: settable false |
| onRequest_SPOILER AVAILABLE | trigger_onRequest_SPOILER AVAILABLE | True if spoiler system available: Units bool: settable false |
| SPOILERS ARMED | trigger_SPOILERS ARMED | Checks if autospoilers are armed (true) or not (false): Units bool: settable false |
| onChange_SPOILERS ARMED | trigger_onChange_SPOILERS ARMED | Checks if autospoilers are armed (true) or not (false): Units bool: settable false |
| onRequest_SPOILERS ARMED | trigger_onRequest_SPOILERS ARMED | Checks if autospoilers are armed (true) or not (false): Units bool: settable false |
| SPOILERS HANDLE POSITION | trigger_SPOILERS HANDLE POSITION | Spoiler handle position: Units percent Over 100: settable false |
| onChange_SPOILERS HANDLE POSITION | trigger_onChange_SPOILERS HANDLE POSITION | Spoiler handle position: Units percent Over 100: settable false |
| onRequest_SPOILERS HANDLE POSITION | trigger_onRequest_SPOILERS HANDLE POSITION | Spoiler handle position: Units percent Over 100: settable false |
| SPOILERS LEFT POSITION | trigger_SPOILERS LEFT POSITION | Percent left spoiler deflected: Units percent Over 100: settable false |
| onChange_SPOILERS LEFT POSITION | trigger_onChange_SPOILERS LEFT POSITION | Percent left spoiler deflected: Units percent Over 100: settable false |
| onRequest_SPOILERS LEFT POSITION | trigger_onRequest_SPOILERS LEFT POSITION | Percent left spoiler deflected: Units percent Over 100: settable false |
| SPOILERS RIGHT POSITION | trigger_SPOILERS RIGHT POSITION | Percent right spoiler deflected: Units percent Over 100: settable false |
| onChange_SPOILERS RIGHT POSITION | trigger_onChange_SPOILERS RIGHT POSITION | Percent right spoiler deflected: Units percent Over 100: settable false |
| onRequest_SPOILERS RIGHT POSITION | trigger_onRequest_SPOILERS RIGHT POSITION | Percent right spoiler deflected: Units percent Over 100: settable false |
| STALL ALPHA | trigger_STALL ALPHA | The angle of attack which produces the maximum lift coefficient before entering into stall conditions.: Units radians: settable false |
| onChange_STALL ALPHA | trigger_onChange_STALL ALPHA | The angle of attack which produces the maximum lift coefficient before entering into stall conditions.: Units radians: settable false |
| onRequest_STALL ALPHA | trigger_onRequest_STALL ALPHA | The angle of attack which produces the maximum lift coefficient before entering into stall conditions.: Units radians: settable false |
| STALL HORN AVAILABLE | trigger_STALL HORN AVAILABLE | True if stall alarm available.: Units bool: settable false |
| onChange_STALL HORN AVAILABLE | trigger_onChange_STALL HORN AVAILABLE | True if stall alarm available.: Units bool: settable false |
| onRequest_STALL HORN AVAILABLE | trigger_onRequest_STALL HORN AVAILABLE | True if stall alarm available.: Units bool: settable false |
| STALL PROTECTION OFF LIMIT | trigger_STALL PROTECTION OFF LIMIT | Alpha below which the Stall Protection can be disabled. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onChange_STALL PROTECTION OFF LIMIT | trigger_onChange_STALL PROTECTION OFF LIMIT | Alpha below which the Stall Protection can be disabled. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onRequest_STALL PROTECTION OFF LIMIT | trigger_onRequest_STALL PROTECTION OFF LIMIT | Alpha below which the Stall Protection can be disabled. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| STALL PROTECTION ON GOAL | trigger_STALL PROTECTION ON GOAL | The alpha that the Stall Protection will attempt to reach when triggered. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onChange_STALL PROTECTION ON GOAL | trigger_onChange_STALL PROTECTION ON GOAL | The alpha that the Stall Protection will attempt to reach when triggered. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onRequest_STALL PROTECTION ON GOAL | trigger_onRequest_STALL PROTECTION ON GOAL | The alpha that the Stall Protection will attempt to reach when triggered. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| STALL PROTECTION ON LIMIT | trigger_STALL PROTECTION ON LIMIT | Alpha above which the Stall Protection timer starts. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onChange_STALL PROTECTION ON LIMIT | trigger_onChange_STALL PROTECTION ON LIMIT | Alpha above which the Stall Protection timer starts. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| onRequest_STALL PROTECTION ON LIMIT | trigger_onRequest_STALL PROTECTION ON LIMIT | Alpha above which the Stall Protection timer starts. See the [STALL PROTECTION] section for more information.: Units radians: settable false |
| STALL WARNING | trigger_STALL WARNING | Stall warning state.: Units bool: settable false |
| onChange_STALL WARNING | trigger_onChange_STALL WARNING | Stall warning state.: Units bool: settable false |
| onRequest_STALL WARNING | trigger_onRequest_STALL WARNING | Stall warning state.: Units bool: settable false |
| STANDARD ATM TEMPERATURE | trigger_STANDARD ATM TEMPERATURE | Outside temperature on the standard ATM scale: Units rankine: settable false |
| onChange_STANDARD ATM TEMPERATURE | trigger_onChange_STANDARD ATM TEMPERATURE | Outside temperature on the standard ATM scale: Units rankine: settable false |
| onRequest_STANDARD ATM TEMPERATURE | trigger_onRequest_STANDARD ATM TEMPERATURE | Outside temperature on the standard ATM scale: Units rankine: settable false |
| STATIC CG TO GROUND | trigger_STATIC CG TO GROUND | Static CG position with reference to the ground: Units feet: settable false |
| onChange_STATIC CG TO GROUND | trigger_onChange_STATIC CG TO GROUND | Static CG position with reference to the ground: Units feet: settable false |
| onRequest_STATIC CG TO GROUND | trigger_onRequest_STATIC CG TO GROUND | Static CG position with reference to the ground: Units feet: settable false |
| STATIC PITCH | trigger_STATIC PITCH | The angle at which static pitch stability is achieved.: Units radians: settable false |
| onChange_STATIC PITCH | trigger_onChange_STATIC PITCH | The angle at which static pitch stability is achieved.: Units radians: settable false |
| onRequest_STATIC PITCH | trigger_onRequest_STATIC PITCH | The angle at which static pitch stability is achieved.: Units radians: settable false |
| STEER INPUT CONTROL | trigger_STEER INPUT CONTROL | Position of steering tiller: Units percent Over 100: settable false |
| onChange_STEER INPUT CONTROL | trigger_onChange_STEER INPUT CONTROL | Position of steering tiller: Units percent Over 100: settable false |
| onRequest_STEER INPUT CONTROL | trigger_onRequest_STEER INPUT CONTROL | Position of steering tiller: Units percent Over 100: settable false |
| STROBES AVAILABLE | trigger_STROBES AVAILABLE | True if strobe lights are available.: Units bool: settable false |
| onChange_STROBES AVAILABLE | trigger_onChange_STROBES AVAILABLE | True if strobe lights are available.: Units bool: settable false |
| onRequest_STROBES AVAILABLE | trigger_onRequest_STROBES AVAILABLE | True if strobe lights are available.: Units bool: settable false |
| STRUCT AMBIENT WIND | trigger_STRUCT AMBIENT WIND | X (latitude), Y (vertical) and Z (longitude) components of the wind.: Units feet per second: settable false |
| onChange_STRUCT AMBIENT WIND | trigger_onChange_STRUCT AMBIENT WIND | X (latitude), Y (vertical) and Z (longitude) components of the wind.: Units feet per second: settable false |
| onRequest_STRUCT AMBIENT WIND | trigger_onRequest_STRUCT AMBIENT WIND | X (latitude), Y (vertical) and Z (longitude) components of the wind.: Units feet per second: settable false |
| STRUCTURAL DEICE SWITCH | trigger_STRUCTURAL DEICE SWITCH | True if the aircraft structure deice switch is on.: Units bool: settable false |
| onChange_STRUCTURAL DEICE SWITCH | trigger_onChange_STRUCTURAL DEICE SWITCH | True if the aircraft structure deice switch is on.: Units bool: settable false |
| onRequest_STRUCTURAL DEICE SWITCH | trigger_onRequest_STRUCTURAL DEICE SWITCH | True if the aircraft structure deice switch is on.: Units bool: settable false |
| STRUCTURAL ICE PCT | trigger_STRUCTURAL ICE PCT | Amount of ice on aircraft structure. 100 is fully iced: Units percent Over 100: settable false |
| onChange_STRUCTURAL ICE PCT | trigger_onChange_STRUCTURAL ICE PCT | Amount of ice on aircraft structure. 100 is fully iced: Units percent Over 100: settable false |
| onRequest_STRUCTURAL ICE PCT | trigger_onRequest_STRUCTURAL ICE PCT | Amount of ice on aircraft structure. 100 is fully iced: Units percent Over 100: settable false |
| SUCTION PRESSURE | trigger_SUCTION PRESSURE | Vacuum system suction pressure.: Units Inches of Mercury: settable true |
| onChange_SUCTION PRESSURE | trigger_onChange_SUCTION PRESSURE | Vacuum system suction pressure.: Units Inches of Mercury: settable true |
| onRequest_SUCTION PRESSURE | trigger_onRequest_SUCTION PRESSURE | Vacuum system suction pressure.: Units Inches of Mercury: settable true |
| SURFACE CONDITION | trigger_SURFACE CONDITION | The state of the surface directly under the aircraft: Units enum: settable false |
| onChange_SURFACE CONDITION | trigger_onChange_SURFACE CONDITION | The state of the surface directly under the aircraft: Units enum: settable false |
| onRequest_SURFACE CONDITION | trigger_onRequest_SURFACE CONDITION | The state of the surface directly under the aircraft: Units enum: settable false |
| SURFACE INFO VALID | trigger_SURFACE INFO VALID | True indicates that the SURFACE CONDITION return value is meaningful: Units bool: settable false |
| onChange_SURFACE INFO VALID | trigger_onChange_SURFACE INFO VALID | True indicates that the SURFACE CONDITION return value is meaningful: Units bool: settable false |
| onRequest_SURFACE INFO VALID | trigger_onRequest_SURFACE INFO VALID | True indicates that the SURFACE CONDITION return value is meaningful: Units bool: settable false |
| SURFACE RELATIVE GROUND SPEED | trigger_SURFACE RELATIVE GROUND SPEED | The speed of the aircraft relative to the speed of the first surface directly underneath it. Use this to retrieve, for example, an aircraft's taxiing speed while it is moving on a moving carrier. It also applies to airborne aircraft, for example when a helicopter is successfully hovering above a moving ship, this value should be zero. The returned value will be the same as GROUND VELOCITY if the first surface beneath it is not moving: Units feet per second: settable false |
| onChange_SURFACE RELATIVE GROUND SPEED | trigger_onChange_SURFACE RELATIVE GROUND SPEED | The speed of the aircraft relative to the speed of the first surface directly underneath it. Use this to retrieve, for example, an aircraft's taxiing speed while it is moving on a moving carrier. It also applies to airborne aircraft, for example when a helicopter is successfully hovering above a moving ship, this value should be zero. The returned value will be the same as GROUND VELOCITY if the first surface beneath it is not moving: Units feet per second: settable false |
| onRequest_SURFACE RELATIVE GROUND SPEED | trigger_onRequest_SURFACE RELATIVE GROUND SPEED | The speed of the aircraft relative to the speed of the first surface directly underneath it. Use this to retrieve, for example, an aircraft's taxiing speed while it is moving on a moving carrier. It also applies to airborne aircraft, for example when a helicopter is successfully hovering above a moving ship, this value should be zero. The returned value will be the same as GROUND VELOCITY if the first surface beneath it is not moving: Units feet per second: settable false |
| SURFACE TYPE | trigger_SURFACE TYPE | The type of surface under the aircraft: Units enum: settable false |
| onChange_SURFACE TYPE | trigger_onChange_SURFACE TYPE | The type of surface under the aircraft: Units enum: settable false |
| onRequest_SURFACE TYPE | trigger_onRequest_SURFACE TYPE | The type of surface under the aircraft: Units enum: settable false |
| TACAN ACTIVE CHANNEL:index | trigger_TACAN ACTIVE CHANNEL:index | The active channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| onChange_TACAN ACTIVE CHANNEL:index | trigger_onChange_TACAN ACTIVE CHANNEL:index | The active channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| onRequest_TACAN ACTIVE CHANNEL:index | trigger_onRequest_TACAN ACTIVE CHANNEL:index | The active channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| TACAN ACTIVE MODE:index | trigger_TACAN ACTIVE MODE:index | The active mode used by the indexed Tacan receiver on the aircraft, where 0 = X and 1 = Y.: Units bool: settable false |
| onChange_TACAN ACTIVE MODE:index | trigger_onChange_TACAN ACTIVE MODE:index | The active mode used by the indexed Tacan receiver on the aircraft, where 0 = X and 1 = Y.: Units bool: settable false |
| onRequest_TACAN ACTIVE MODE:index | trigger_onRequest_TACAN ACTIVE MODE:index | The active mode used by the indexed Tacan receiver on the aircraft, where 0 = X and 1 = Y.: Units bool: settable false |
| TACAN AVAILABLE:index | trigger_TACAN AVAILABLE:index | Will be TRUE (1) if NAV1, NAV2, NAV3 or NAV4 can receive Tacan (depending on the index - 1, 2, 3, or 4), or FALSE (0) otherwise.: Units bool: settable false |
| onChange_TACAN AVAILABLE:index | trigger_onChange_TACAN AVAILABLE:index | Will be TRUE (1) if NAV1, NAV2, NAV3 or NAV4 can receive Tacan (depending on the index - 1, 2, 3, or 4), or FALSE (0) otherwise.: Units bool: settable false |
| onRequest_TACAN AVAILABLE:index | trigger_onRequest_TACAN AVAILABLE:index | Will be TRUE (1) if NAV1, NAV2, NAV3 or NAV4 can receive Tacan (depending on the index - 1, 2, 3, or 4), or FALSE (0) otherwise.: Units bool: settable false |
| TACAN DRIVES NAV1:index | trigger_TACAN DRIVES NAV1:index | Tells whether the Tacan is driving the Nav 1 indicator (TRUE, 1) or not (FALSE, 0), for autopilot purposes.: Units bool: settable false |
| onChange_TACAN DRIVES NAV1:index | trigger_onChange_TACAN DRIVES NAV1:index | Tells whether the Tacan is driving the Nav 1 indicator (TRUE, 1) or not (FALSE, 0), for autopilot purposes.: Units bool: settable false |
| onRequest_TACAN DRIVES NAV1:index | trigger_onRequest_TACAN DRIVES NAV1:index | Tells whether the Tacan is driving the Nav 1 indicator (TRUE, 1) or not (FALSE, 0), for autopilot purposes.: Units bool: settable false |
| TACAN OBS:index | trigger_TACAN OBS:index | The Tacan OBS setting, in degrees.: Units degrees: settable false |
| onChange_TACAN OBS:index | trigger_onChange_TACAN OBS:index | The Tacan OBS setting, in degrees.: Units degrees: settable false |
| onRequest_TACAN OBS:index | trigger_onRequest_TACAN OBS:index | The Tacan OBS setting, in degrees.: Units degrees: settable false |
| TACAN STANDBY CHANNEL:index | trigger_TACAN STANDBY CHANNEL:index | The standby channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| onChange_TACAN STANDBY CHANNEL:index | trigger_onChange_TACAN STANDBY CHANNEL:index | The standby channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| onRequest_TACAN STANDBY CHANNEL:index | trigger_onRequest_TACAN STANDBY CHANNEL:index | The standby channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number: settable false |
| TACAN STANDBY MODE:index | trigger_TACAN STANDBY MODE:index | Indicates the indexed Tacan receiver standby mode, where 0 = X and 1 = Y.: Units bool: settable false |
| onChange_TACAN STANDBY MODE:index | trigger_onChange_TACAN STANDBY MODE:index | Indicates the indexed Tacan receiver standby mode, where 0 = X and 1 = Y.: Units bool: settable false |
| onRequest_TACAN STANDBY MODE:index | trigger_onRequest_TACAN STANDBY MODE:index | Indicates the indexed Tacan receiver standby mode, where 0 = X and 1 = Y.: Units bool: settable false |
| TACAN STATION CDI:index | trigger_TACAN STATION CDI:index | The CDI needle deflection amount(course deviation) to the station. Can be +/- 127.: Units number: settable false |
| onChange_TACAN STATION CDI:index | trigger_onChange_TACAN STATION CDI:index | The CDI needle deflection amount(course deviation) to the station. Can be +/- 127.: Units number: settable false |
| onRequest_TACAN STATION CDI:index | trigger_onRequest_TACAN STATION CDI:index | The CDI needle deflection amount(course deviation) to the station. Can be +/- 127.: Units number: settable false |
| TACAN STATION DISTANCE:index | trigger_TACAN STATION DISTANCE:index | The distance between the Tacan station position and the aircraft position. The index value refers to the Tacan receiver connected to the station (1 or 2).: Units meters: settable false |
| onChange_TACAN STATION DISTANCE:index | trigger_onChange_TACAN STATION DISTANCE:index | The distance between the Tacan station position and the aircraft position. The index value refers to the Tacan receiver connected to the station (1 or 2).: Units meters: settable false |
| onRequest_TACAN STATION DISTANCE:index | trigger_onRequest_TACAN STATION DISTANCE:index | The distance between the Tacan station position and the aircraft position. The index value refers to the Tacan receiver connected to the station (1 or 2).: Units meters: settable false |
| TACAN STATION IDENT:index | trigger_TACAN STATION IDENT:index | The tuned station identifier for the indexed Tacan.: Units null: settable false |
| onChange_TACAN STATION IDENT:index | trigger_onChange_TACAN STATION IDENT:index | The tuned station identifier for the indexed Tacan.: Units null: settable false |
| onRequest_TACAN STATION IDENT:index | trigger_onRequest_TACAN STATION IDENT:index | The tuned station identifier for the indexed Tacan.: Units null: settable false |
| TACAN STATION RADIAL ERROR:index | trigger_TACAN STATION RADIAL ERROR:index | Difference between the current radial and OBS tuned radial, in degrees.: Units degrees: settable false |
| onChange_TACAN STATION RADIAL ERROR:index | trigger_onChange_TACAN STATION RADIAL ERROR:index | Difference between the current radial and OBS tuned radial, in degrees.: Units degrees: settable false |
| onRequest_TACAN STATION RADIAL ERROR:index | trigger_onRequest_TACAN STATION RADIAL ERROR:index | Difference between the current radial and OBS tuned radial, in degrees.: Units degrees: settable false |
| TACAN STATION RADIAL:index | trigger_TACAN STATION RADIAL:index | The radial between the Tacan station and the aircraft.: Units degrees: settable false |
| onChange_TACAN STATION RADIAL:index | trigger_onChange_TACAN STATION RADIAL:index | The radial between the Tacan station and the aircraft.: Units degrees: settable false |
| onRequest_TACAN STATION RADIAL:index | trigger_onRequest_TACAN STATION RADIAL:index | The radial between the Tacan station and the aircraft.: Units degrees: settable false |
| TACAN STATION TOFROM:index | trigger_TACAN STATION TOFROM:index | Returns whether the indexed Tacan is going to or from the current radial (or is off).: Units enum: settable false |
| onChange_TACAN STATION TOFROM:index | trigger_onChange_TACAN STATION TOFROM:index | Returns whether the indexed Tacan is going to or from the current radial (or is off).: Units enum: settable false |
| onRequest_TACAN STATION TOFROM:index | trigger_onRequest_TACAN STATION TOFROM:index | Returns whether the indexed Tacan is going to or from the current radial (or is off).: Units enum: settable false |
| TACAN VOLUME:index | trigger_TACAN VOLUME:index | The volume value of the indexed Tacan receiver on the aircraft.: Units percent Over 100: settable false |
| onChange_TACAN VOLUME:index | trigger_onChange_TACAN VOLUME:index | The volume value of the indexed Tacan receiver on the aircraft.: Units percent Over 100: settable false |
| onRequest_TACAN VOLUME:index | trigger_onRequest_TACAN VOLUME:index | The volume value of the indexed Tacan receiver on the aircraft.: Units percent Over 100: settable false |
| TAIL ROTOR BLADE PITCH PCT | trigger_TAIL ROTOR BLADE PITCH PCT | The pitch position of the tailrotor blades.: Units percent Over 100: settable false |
| onChange_TAIL ROTOR BLADE PITCH PCT | trigger_onChange_TAIL ROTOR BLADE PITCH PCT | The pitch position of the tailrotor blades.: Units percent Over 100: settable false |
| onRequest_TAIL ROTOR BLADE PITCH PCT | trigger_onRequest_TAIL ROTOR BLADE PITCH PCT | The pitch position of the tailrotor blades.: Units percent Over 100: settable false |
| TAIL ROTOR PEDAL POSITION | trigger_TAIL ROTOR PEDAL POSITION | Percent tail rotor pedal deflection.: Units percent Over 100: settable false |
| onChange_TAIL ROTOR PEDAL POSITION | trigger_onChange_TAIL ROTOR PEDAL POSITION | Percent tail rotor pedal deflection.: Units percent Over 100: settable false |
| onRequest_TAIL ROTOR PEDAL POSITION | trigger_onRequest_TAIL ROTOR PEDAL POSITION | Percent tail rotor pedal deflection.: Units percent Over 100: settable false |
| TAILHOOK HANDLE | trigger_TAILHOOK HANDLE | True if the tailhook handle is engaged.: Units bool: settable false |
| onChange_TAILHOOK HANDLE | trigger_onChange_TAILHOOK HANDLE | True if the tailhook handle is engaged.: Units bool: settable false |
| onRequest_TAILHOOK HANDLE | trigger_onRequest_TAILHOOK HANDLE | True if the tailhook handle is engaged.: Units bool: settable false |
| TAILHOOK POSITION | trigger_TAILHOOK POSITION | Percent tail hook extended.: Units percent Over 100: settable true |
| onChange_TAILHOOK POSITION | trigger_onChange_TAILHOOK POSITION | Percent tail hook extended.: Units percent Over 100: settable true |
| onRequest_TAILHOOK POSITION | trigger_onRequest_TAILHOOK POSITION | Percent tail hook extended.: Units percent Over 100: settable true |
| TAILWHEEL LOCK ON | trigger_TAILWHEEL LOCK ON | True if tailwheel lock applied. This can be set using the TailwheelLock parameter.: Units bool: settable false |
| onChange_TAILWHEEL LOCK ON | trigger_onChange_TAILWHEEL LOCK ON | True if tailwheel lock applied. This can be set using the TailwheelLock parameter.: Units bool: settable false |
| onRequest_TAILWHEEL LOCK ON | trigger_onRequest_TAILWHEEL LOCK ON | True if tailwheel lock applied. This can be set using the TailwheelLock parameter.: Units bool: settable false |
| THROTTLE LOWER LIMIT | trigger_THROTTLE LOWER LIMIT | Percent throttle defining lower limit (negative for reverse thrust equipped airplanes): Units percent: settable false |
| onChange_THROTTLE LOWER LIMIT | trigger_onChange_THROTTLE LOWER LIMIT | Percent throttle defining lower limit (negative for reverse thrust equipped airplanes): Units percent: settable false |
| onRequest_THROTTLE LOWER LIMIT | trigger_onRequest_THROTTLE LOWER LIMIT | Percent throttle defining lower limit (negative for reverse thrust equipped airplanes): Units percent: settable false |
| TITLE | trigger_TITLE | Title from aircraft.cfg: Units null: settable false |
| onChange_TITLE | trigger_onChange_TITLE | Title from aircraft.cfg: Units null: settable false |
| onRequest_TITLE | trigger_onRequest_TITLE | Title from aircraft.cfg: Units null: settable false |
| TOE BRAKES AVAILABLE | trigger_TOE BRAKES AVAILABLE | True if toe brakes are available: Units bool: settable false |
| onChange_TOE BRAKES AVAILABLE | trigger_onChange_TOE BRAKES AVAILABLE | True if toe brakes are available: Units bool: settable false |
| onRequest_TOE BRAKES AVAILABLE | trigger_onRequest_TOE BRAKES AVAILABLE | True if toe brakes are available: Units bool: settable false |
| TOTAL AIR TEMPERATURE | trigger_TOTAL AIR TEMPERATURE | Total air temperature is the air temperature at the front of the aircraft where the ram pressure from the speed of the aircraft is taken into account: Units celsius: settable false |
| onChange_TOTAL AIR TEMPERATURE | trigger_onChange_TOTAL AIR TEMPERATURE | Total air temperature is the air temperature at the front of the aircraft where the ram pressure from the speed of the aircraft is taken into account: Units celsius: settable false |
| onRequest_TOTAL AIR TEMPERATURE | trigger_onRequest_TOTAL AIR TEMPERATURE | Total air temperature is the air temperature at the front of the aircraft where the ram pressure from the speed of the aircraft is taken into account: Units celsius: settable false |
| TOTAL VELOCITY | trigger_TOTAL VELOCITY | Velocity regardless of direction. For example, if a helicopter is ascending vertically at 100 fps, getting this variable will return 100.: Units feet: settable false |
| onChange_TOTAL VELOCITY | trigger_onChange_TOTAL VELOCITY | Velocity regardless of direction. For example, if a helicopter is ascending vertically at 100 fps, getting this variable will return 100.: Units feet: settable false |
| onRequest_TOTAL VELOCITY | trigger_onRequest_TOTAL VELOCITY | Velocity regardless of direction. For example, if a helicopter is ascending vertically at 100 fps, getting this variable will return 100.: Units feet: settable false |
| TOTAL WEIGHT | trigger_TOTAL WEIGHT | Total weight of the aircraft: Units pounds: settable false |
| onChange_TOTAL WEIGHT | trigger_onChange_TOTAL WEIGHT | Total weight of the aircraft: Units pounds: settable false |
| onRequest_TOTAL WEIGHT | trigger_onRequest_TOTAL WEIGHT | Total weight of the aircraft: Units pounds: settable false |
| TOTAL WEIGHT CROSS COUPLED MOI | trigger_TOTAL WEIGHT CROSS COUPLED MOI | Total weight cross coupled moment of inertia: Units slugs: settable false |
| onChange_TOTAL WEIGHT CROSS COUPLED MOI | trigger_onChange_TOTAL WEIGHT CROSS COUPLED MOI | Total weight cross coupled moment of inertia: Units slugs: settable false |
| onRequest_TOTAL WEIGHT CROSS COUPLED MOI | trigger_onRequest_TOTAL WEIGHT CROSS COUPLED MOI | Total weight cross coupled moment of inertia: Units slugs: settable false |
| TOTAL WEIGHT PITCH MOI | trigger_TOTAL WEIGHT PITCH MOI | Total weight pitch moment of inertia: Units slugs: settable false |
| onChange_TOTAL WEIGHT PITCH MOI | trigger_onChange_TOTAL WEIGHT PITCH MOI | Total weight pitch moment of inertia: Units slugs: settable false |
| onRequest_TOTAL WEIGHT PITCH MOI | trigger_onRequest_TOTAL WEIGHT PITCH MOI | Total weight pitch moment of inertia: Units slugs: settable false |
| TOTAL WEIGHT ROLL MOI | trigger_TOTAL WEIGHT ROLL MOI | Total weight roll moment of inertia: Units slugs: settable false |
| onChange_TOTAL WEIGHT ROLL MOI | trigger_onChange_TOTAL WEIGHT ROLL MOI | Total weight roll moment of inertia: Units slugs: settable false |
| onRequest_TOTAL WEIGHT ROLL MOI | trigger_onRequest_TOTAL WEIGHT ROLL MOI | Total weight roll moment of inertia: Units slugs: settable false |
| TOTAL WEIGHT YAW MOI | trigger_TOTAL WEIGHT YAW MOI | Total weight yaw moment of inertia: Units slugs: settable false |
| onChange_TOTAL WEIGHT YAW MOI | trigger_onChange_TOTAL WEIGHT YAW MOI | Total weight yaw moment of inertia: Units slugs: settable false |
| onRequest_TOTAL WEIGHT YAW MOI | trigger_onRequest_TOTAL WEIGHT YAW MOI | Total weight yaw moment of inertia: Units slugs: settable false |
| TOTAL WORLD VELOCITY | trigger_TOTAL WORLD VELOCITY | Speed relative to the earths center.: Units feet per second: settable true |
| onChange_TOTAL WORLD VELOCITY | trigger_onChange_TOTAL WORLD VELOCITY | Speed relative to the earths center.: Units feet per second: settable true |
| onRequest_TOTAL WORLD VELOCITY | trigger_onRequest_TOTAL WORLD VELOCITY | Speed relative to the earths center.: Units feet per second: settable true |
| TOW CONNECTION | trigger_TOW CONNECTION | True if a towline is connected to both tow plane and glider: Units bool: settable false |
| onChange_TOW CONNECTION | trigger_onChange_TOW CONNECTION | True if a towline is connected to both tow plane and glider: Units bool: settable false |
| onRequest_TOW CONNECTION | trigger_onRequest_TOW CONNECTION | True if a towline is connected to both tow plane and glider: Units bool: settable false |
| TOW RELEASE HANDLE | trigger_TOW RELEASE HANDLE | Position of tow release handle. 100 is fully deployed.: Units percent Over 100: settable false |
| onChange_TOW RELEASE HANDLE | trigger_onChange_TOW RELEASE HANDLE | Position of tow release handle. 100 is fully deployed.: Units percent Over 100: settable false |
| onRequest_TOW RELEASE HANDLE | trigger_onRequest_TOW RELEASE HANDLE | Position of tow release handle. 100 is fully deployed.: Units percent Over 100: settable false |
| TRACK IR ENABLE | trigger_TRACK IR ENABLE | Returns true if Track IR is enabled or not.: Units bool: settable true |
| onChange_TRACK IR ENABLE | trigger_onChange_TRACK IR ENABLE | Returns true if Track IR is enabled or not.: Units bool: settable true |
| onRequest_TRACK IR ENABLE | trigger_onRequest_TRACK IR ENABLE | Returns true if Track IR is enabled or not.: Units bool: settable true |
| TRAILING EDGE FLAPS LEFT ANGLE | trigger_TRAILING EDGE FLAPS LEFT ANGLE | Angle left trailing edge flap extended. Use TRAILING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| onChange_TRAILING EDGE FLAPS LEFT ANGLE | trigger_onChange_TRAILING EDGE FLAPS LEFT ANGLE | Angle left trailing edge flap extended. Use TRAILING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| onRequest_TRAILING EDGE FLAPS LEFT ANGLE | trigger_onRequest_TRAILING EDGE FLAPS LEFT ANGLE | Angle left trailing edge flap extended. Use TRAILING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians: settable false |
| TRAILING EDGE FLAPS LEFT INDEX | trigger_TRAILING EDGE FLAPS LEFT INDEX | Index of left trailing edge flap position: Units number: settable false |
| onChange_TRAILING EDGE FLAPS LEFT INDEX | trigger_onChange_TRAILING EDGE FLAPS LEFT INDEX | Index of left trailing edge flap position: Units number: settable false |
| onRequest_TRAILING EDGE FLAPS LEFT INDEX | trigger_onRequest_TRAILING EDGE FLAPS LEFT INDEX | Index of left trailing edge flap position: Units number: settable false |
| TRAILING EDGE FLAPS LEFT PERCENT | trigger_TRAILING EDGE FLAPS LEFT PERCENT | Percent left trailing edge flap extended: Units percent Over 100: settable true |
| onChange_TRAILING EDGE FLAPS LEFT PERCENT | trigger_onChange_TRAILING EDGE FLAPS LEFT PERCENT | Percent left trailing edge flap extended: Units percent Over 100: settable true |
| onRequest_TRAILING EDGE FLAPS LEFT PERCENT | trigger_onRequest_TRAILING EDGE FLAPS LEFT PERCENT | Percent left trailing edge flap extended: Units percent Over 100: settable true |
| TRAILING EDGE FLAPS RIGHT ANGLE | trigger_TRAILING EDGE FLAPS RIGHT ANGLE | Angle right trailing edge flap extended. Use TRAILING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| onChange_TRAILING EDGE FLAPS RIGHT ANGLE | trigger_onChange_TRAILING EDGE FLAPS RIGHT ANGLE | Angle right trailing edge flap extended. Use TRAILING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| onRequest_TRAILING EDGE FLAPS RIGHT ANGLE | trigger_onRequest_TRAILING EDGE FLAPS RIGHT ANGLE | Angle right trailing edge flap extended. Use TRAILING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians: settable false |
| TRAILING EDGE FLAPS RIGHT INDEX | trigger_TRAILING EDGE FLAPS RIGHT INDEX | Index of right trailing edge flap position: Units number: settable false |
| onChange_TRAILING EDGE FLAPS RIGHT INDEX | trigger_onChange_TRAILING EDGE FLAPS RIGHT INDEX | Index of right trailing edge flap position: Units number: settable false |
| onRequest_TRAILING EDGE FLAPS RIGHT INDEX | trigger_onRequest_TRAILING EDGE FLAPS RIGHT INDEX | Index of right trailing edge flap position: Units number: settable false |
| TRAILING EDGE FLAPS RIGHT PERCENT | trigger_TRAILING EDGE FLAPS RIGHT PERCENT | Percent right trailing edge flap extended: Units percent Over 100: settable true |
| onChange_TRAILING EDGE FLAPS RIGHT PERCENT | trigger_onChange_TRAILING EDGE FLAPS RIGHT PERCENT | Percent right trailing edge flap extended: Units percent Over 100: settable true |
| onRequest_TRAILING EDGE FLAPS RIGHT PERCENT | trigger_onRequest_TRAILING EDGE FLAPS RIGHT PERCENT | Percent right trailing edge flap extended: Units percent Over 100: settable true |
| TRAILING EDGE FLAPS0 LEFT ANGLE | trigger_TRAILING EDGE FLAPS0 LEFT ANGLE | TESTING: Units radians: settable false |
| onChange_TRAILING EDGE FLAPS0 LEFT ANGLE | trigger_onChange_TRAILING EDGE FLAPS0 LEFT ANGLE | TESTING: Units radians: settable false |
| onRequest_TRAILING EDGE FLAPS0 LEFT ANGLE | trigger_onRequest_TRAILING EDGE FLAPS0 LEFT ANGLE | TESTING: Units radians: settable false |
| TRAILING EDGE FLAPS0 RIGHT ANGLE | trigger_TRAILING EDGE FLAPS0 RIGHT ANGLE | TESTING: Units radians: settable false |
| onChange_TRAILING EDGE FLAPS0 RIGHT ANGLE | trigger_onChange_TRAILING EDGE FLAPS0 RIGHT ANGLE | TESTING: Units radians: settable false |
| onRequest_TRAILING EDGE FLAPS0 RIGHT ANGLE | trigger_onRequest_TRAILING EDGE FLAPS0 RIGHT ANGLE | TESTING: Units radians: settable false |
| TRANSPONDER AVAILABLE | trigger_TRANSPONDER AVAILABLE | True if a transponder is available.: Units bool: settable false |
| onChange_TRANSPONDER AVAILABLE | trigger_onChange_TRANSPONDER AVAILABLE | True if a transponder is available.: Units bool: settable false |
| onRequest_TRANSPONDER AVAILABLE | trigger_onRequest_TRANSPONDER AVAILABLE | True if a transponder is available.: Units bool: settable false |
| TRANSPONDER CODE:index | trigger_TRANSPONDER CODE:index | 4-digit code.: Units number: settable false |
| onChange_TRANSPONDER CODE:index | trigger_onChange_TRANSPONDER CODE:index | 4-digit code.: Units number: settable false |
| onRequest_TRANSPONDER CODE:index | trigger_onRequest_TRANSPONDER CODE:index | 4-digit code.: Units number: settable false |
| TRANSPONDER IDENT | trigger_TRANSPONDER IDENT | This can set the Ident transponder using the KEY_XPNDR_IDENT_SET, KEY_XPNDR_IDENT_TOGGLE, KEY_XPNDR_IDENT_ON or KEY_XPNDR_IDENT_OFF Event IDs (see XPNDR (Transponder) section for more information). When set to true, it will automatically turn false after 18 seconds.: Units bool: settable true |
| onChange_TRANSPONDER IDENT | trigger_onChange_TRANSPONDER IDENT | This can set the Ident transponder using the KEY_XPNDR_IDENT_SET, KEY_XPNDR_IDENT_TOGGLE, KEY_XPNDR_IDENT_ON or KEY_XPNDR_IDENT_OFF Event IDs (see XPNDR (Transponder) section for more information). When set to true, it will automatically turn false after 18 seconds.: Units bool: settable true |
| onRequest_TRANSPONDER IDENT | trigger_onRequest_TRANSPONDER IDENT | This can set the Ident transponder using the KEY_XPNDR_IDENT_SET, KEY_XPNDR_IDENT_TOGGLE, KEY_XPNDR_IDENT_ON or KEY_XPNDR_IDENT_OFF Event IDs (see XPNDR (Transponder) section for more information). When set to true, it will automatically turn false after 18 seconds.: Units bool: settable true |
| TRANSPONDER STATE | trigger_TRANSPONDER STATE | Transponder State.: Units enum: settable true |
| onChange_TRANSPONDER STATE | trigger_onChange_TRANSPONDER STATE | Transponder State.: Units enum: settable true |
| onRequest_TRANSPONDER STATE | trigger_onRequest_TRANSPONDER STATE | Transponder State.: Units enum: settable true |
| TRUE AIRSPEED SELECTED | trigger_TRUE AIRSPEED SELECTED | True if True Airspeed has been selected.: Units bool: settable true |
| onChange_TRUE AIRSPEED SELECTED | trigger_onChange_TRUE AIRSPEED SELECTED | True if True Airspeed has been selected.: Units bool: settable true |
| onRequest_TRUE AIRSPEED SELECTED | trigger_onRequest_TRUE AIRSPEED SELECTED | True if True Airspeed has been selected.: Units bool: settable true |
| TURB ENG AFTERBURNER PCT ACTIVE:index | trigger_TURB ENG AFTERBURNER PCT ACTIVE:index | The percentage that the afterburner is running at: Units percent Over 100: settable false |
| onChange_TURB ENG AFTERBURNER PCT ACTIVE:index | trigger_onChange_TURB ENG AFTERBURNER PCT ACTIVE:index | The percentage that the afterburner is running at: Units percent Over 100: settable false |
| onRequest_TURB ENG AFTERBURNER PCT ACTIVE:index | trigger_onRequest_TURB ENG AFTERBURNER PCT ACTIVE:index | The percentage that the afterburner is running at: Units percent Over 100: settable false |
| TURB ENG AFTERBURNER STAGE ACTIVE:index | trigger_TURB ENG AFTERBURNER STAGE ACTIVE:index | The stage of the afterburner, or 0 if the afterburner is not active: Units number: settable false |
| onChange_TURB ENG AFTERBURNER STAGE ACTIVE:index | trigger_onChange_TURB ENG AFTERBURNER STAGE ACTIVE:index | The stage of the afterburner, or 0 if the afterburner is not active: Units number: settable false |
| onRequest_TURB ENG AFTERBURNER STAGE ACTIVE:index | trigger_onRequest_TURB ENG AFTERBURNER STAGE ACTIVE:index | The stage of the afterburner, or 0 if the afterburner is not active: Units number: settable false |
| TURB ENG AFTERBURNER:index | trigger_TURB ENG AFTERBURNER:index | Afterburner state for the indexed engine: Units bool: settable false |
| onChange_TURB ENG AFTERBURNER:index | trigger_onChange_TURB ENG AFTERBURNER:index | Afterburner state for the indexed engine: Units bool: settable false |
| onRequest_TURB ENG AFTERBURNER:index | trigger_onRequest_TURB ENG AFTERBURNER:index | Afterburner state for the indexed engine: Units bool: settable false |
| TURB ENG BLEED AIR:index | trigger_TURB ENG BLEED AIR:index | Bleed air pressure for the indexed engine: Units pounds: settable false |
| onChange_TURB ENG BLEED AIR:index | trigger_onChange_TURB ENG BLEED AIR:index | Bleed air pressure for the indexed engine: Units pounds: settable false |
| onRequest_TURB ENG BLEED AIR:index | trigger_onRequest_TURB ENG BLEED AIR:index | Bleed air pressure for the indexed engine: Units pounds: settable false |
| TURB ENG COMMANDED N1:index | trigger_TURB ENG COMMANDED N1:index |  Effective commanded N1 for the indexed turbine engine: Units percent: settable true |
| onChange_TURB ENG COMMANDED N1:index | trigger_onChange_TURB ENG COMMANDED N1:index |  Effective commanded N1 for the indexed turbine engine: Units percent: settable true |
| onRequest_TURB ENG COMMANDED N1:index | trigger_onRequest_TURB ENG COMMANDED N1:index |  Effective commanded N1 for the indexed turbine engine: Units percent: settable true |
| TURB ENG CONDITION LEVER POSITION:index | trigger_TURB ENG CONDITION LEVER POSITION:index |  See documentation: Units enum: settable true |
| onChange_TURB ENG CONDITION LEVER POSITION:index | trigger_onChange_TURB ENG CONDITION LEVER POSITION:index |  See documentation: Units enum: settable true |
| onRequest_TURB ENG CONDITION LEVER POSITION:index | trigger_onRequest_TURB ENG CONDITION LEVER POSITION:index |  See documentation: Units enum: settable true |
| TURB ENG CORRECTED FF:index | trigger_TURB ENG CORRECTED FF:index | Corrected fuel flow for the indexed engine: Units pounds per hour: settable true |
| onChange_TURB ENG CORRECTED FF:index | trigger_onChange_TURB ENG CORRECTED FF:index | Corrected fuel flow for the indexed engine: Units pounds per hour: settable true |
| onRequest_TURB ENG CORRECTED FF:index | trigger_onRequest_TURB ENG CORRECTED FF:index | Corrected fuel flow for the indexed engine: Units pounds per hour: settable true |
| TURB ENG CORRECTED N1:index | trigger_TURB ENG CORRECTED N1:index | The indexed turbine engine corrected N1: Units percent: settable true |
| onChange_TURB ENG CORRECTED N1:index | trigger_onChange_TURB ENG CORRECTED N1:index | The indexed turbine engine corrected N1: Units percent: settable true |
| onRequest_TURB ENG CORRECTED N1:index | trigger_onRequest_TURB ENG CORRECTED N1:index | The indexed turbine engine corrected N1: Units percent: settable true |
| TURB ENG CORRECTED N2:index | trigger_TURB ENG CORRECTED N2:index | The indexed turbine engine corrected N2: Units percent: settable true |
| onChange_TURB ENG CORRECTED N2:index | trigger_onChange_TURB ENG CORRECTED N2:index | The indexed turbine engine corrected N2: Units percent: settable true |
| onRequest_TURB ENG CORRECTED N2:index | trigger_onRequest_TURB ENG CORRECTED N2:index | The indexed turbine engine corrected N2: Units percent: settable true |
| TURB ENG FREE TURBINE TORQUE:index | trigger_TURB ENG FREE TURBINE TORQUE:index | The amount of free torque for the indexed turbine engine: Units foot pound: settable true |
| onChange_TURB ENG FREE TURBINE TORQUE:index | trigger_onChange_TURB ENG FREE TURBINE TORQUE:index | The amount of free torque for the indexed turbine engine: Units foot pound: settable true |
| onRequest_TURB ENG FREE TURBINE TORQUE:index | trigger_onRequest_TURB ENG FREE TURBINE TORQUE:index | The amount of free torque for the indexed turbine engine: Units foot pound: settable true |
| TURB ENG FUEL AVAILABLE:index | trigger_TURB ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable false |
| onChange_TURB ENG FUEL AVAILABLE:index | trigger_onChange_TURB ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable false |
| onRequest_TURB ENG FUEL AVAILABLE:index | trigger_onRequest_TURB ENG FUEL AVAILABLE:index | True if fuel is available for the indexed engine: Units bool: settable false |
| TURB ENG FUEL EFFICIENCY LOSS:index | trigger_TURB ENG FUEL EFFICIENCY LOSS:index | This is used to control the fuel efficiency loss of the indexed engine: Units percent: settable true |
| onChange_TURB ENG FUEL EFFICIENCY LOSS:index | trigger_onChange_TURB ENG FUEL EFFICIENCY LOSS:index | This is used to control the fuel efficiency loss of the indexed engine: Units percent: settable true |
| onRequest_TURB ENG FUEL EFFICIENCY LOSS:index | trigger_onRequest_TURB ENG FUEL EFFICIENCY LOSS:index | This is used to control the fuel efficiency loss of the indexed engine: Units percent: settable true |
| TURB ENG FUEL FLOW PPH:index | trigger_TURB ENG FUEL FLOW PPH:index | The indexed engine fuel flow rate: Units pounds per hour: settable false |
| onChange_TURB ENG FUEL FLOW PPH:index | trigger_onChange_TURB ENG FUEL FLOW PPH:index | The indexed engine fuel flow rate: Units pounds per hour: settable false |
| onRequest_TURB ENG FUEL FLOW PPH:index | trigger_onRequest_TURB ENG FUEL FLOW PPH:index | The indexed engine fuel flow rate: Units pounds per hour: settable false |
| TURB ENG HIGH IDLE:index | trigger_TURB ENG HIGH IDLE:index | Retrieves the high idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in high idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| onChange_TURB ENG HIGH IDLE:index | trigger_onChange_TURB ENG HIGH IDLE:index | Retrieves the high idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in high idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| onRequest_TURB ENG HIGH IDLE:index | trigger_onRequest_TURB ENG HIGH IDLE:index | Retrieves the high idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in high idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| TURB ENG IGNITION SWITCH EX1:index | trigger_TURB ENG IGNITION SWITCH EX1:index | Position of the the indexed turbine engine Ignition Switch. Similar to TURB_ENG_IGNITION_SWITCH but differentiates between ON and AUTO: Units enum: settable false |
| onChange_TURB ENG IGNITION SWITCH EX1:index | trigger_onChange_TURB ENG IGNITION SWITCH EX1:index | Position of the the indexed turbine engine Ignition Switch. Similar to TURB_ENG_IGNITION_SWITCH but differentiates between ON and AUTO: Units enum: settable false |
| onRequest_TURB ENG IGNITION SWITCH EX1:index | trigger_onRequest_TURB ENG IGNITION SWITCH EX1:index | Position of the the indexed turbine engine Ignition Switch. Similar to TURB_ENG_IGNITION_SWITCH but differentiates between ON and AUTO: Units enum: settable false |
| TURB ENG IGNITION SWITCH:index | trigger_TURB ENG IGNITION SWITCH:index | True if the the indexed turbine engine ignition switch is on: Units bool: settable false |
| onChange_TURB ENG IGNITION SWITCH:index | trigger_onChange_TURB ENG IGNITION SWITCH:index | True if the the indexed turbine engine ignition switch is on: Units bool: settable false |
| onRequest_TURB ENG IGNITION SWITCH:index | trigger_onRequest_TURB ENG IGNITION SWITCH:index | True if the the indexed turbine engine ignition switch is on: Units bool: settable false |
| TURB ENG IS IGNITING:index | trigger_TURB ENG IS IGNITING:index | Whether or not the ignition system is currently running for the indexed engine. Depends on TURB_ENG_IGNITION_SWITCH_EX1 Enum, the cfg var ignition_auto_type and current state of the plane: Units bool: settable false |
| onChange_TURB ENG IS IGNITING:index | trigger_onChange_TURB ENG IS IGNITING:index | Whether or not the ignition system is currently running for the indexed engine. Depends on TURB_ENG_IGNITION_SWITCH_EX1 Enum, the cfg var ignition_auto_type and current state of the plane: Units bool: settable false |
| onRequest_TURB ENG IS IGNITING:index | trigger_onRequest_TURB ENG IS IGNITING:index | Whether or not the ignition system is currently running for the indexed engine. Depends on TURB_ENG_IGNITION_SWITCH_EX1 Enum, the cfg var ignition_auto_type and current state of the plane: Units bool: settable false |
| TURB ENG ITT COOLING EFFICIENCY LOSS:index | trigger_TURB ENG ITT COOLING EFFICIENCY LOSS:index | This is used to control the ITT cooling efficiency loss of the indexed engine: Units percent: settable true |
| onChange_TURB ENG ITT COOLING EFFICIENCY LOSS:index | trigger_onChange_TURB ENG ITT COOLING EFFICIENCY LOSS:index | This is used to control the ITT cooling efficiency loss of the indexed engine: Units percent: settable true |
| onRequest_TURB ENG ITT COOLING EFFICIENCY LOSS:index | trigger_onRequest_TURB ENG ITT COOLING EFFICIENCY LOSS:index | This is used to control the ITT cooling efficiency loss of the indexed engine: Units percent: settable true |
| TURB ENG ITT:index | trigger_TURB ENG ITT:index | Retrieve or set the ITT for the indexed engine: Units rankine: settable true |
| onChange_TURB ENG ITT:index | trigger_onChange_TURB ENG ITT:index | Retrieve or set the ITT for the indexed engine: Units rankine: settable true |
| onRequest_TURB ENG ITT:index | trigger_onRequest_TURB ENG ITT:index | Retrieve or set the ITT for the indexed engine: Units rankine: settable true |
| TURB ENG JET THRUST:index | trigger_TURB ENG JET THRUST:index | The indexed engine jet thrust: Units pounds: settable false |
| onChange_TURB ENG JET THRUST:index | trigger_onChange_TURB ENG JET THRUST:index | The indexed engine jet thrust: Units pounds: settable false |
| onRequest_TURB ENG JET THRUST:index | trigger_onRequest_TURB ENG JET THRUST:index | The indexed engine jet thrust: Units pounds: settable false |
| TURB ENG LOW IDLE:index | trigger_TURB ENG LOW IDLE:index | Retrieves the low idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in low idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| onChange_TURB ENG LOW IDLE:index | trigger_onChange_TURB ENG LOW IDLE:index | Retrieves the low idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in low idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| onRequest_TURB ENG LOW IDLE:index | trigger_onRequest_TURB ENG LOW IDLE:index | Retrieves the low idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in low idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent: settable false |
| TURB ENG MASTER STARTER SWITCH | trigger_TURB ENG MASTER STARTER SWITCH | True if the turbine engine master starter switch is on, false otherwise: Units bool: settable false |
| onChange_TURB ENG MASTER STARTER SWITCH | trigger_onChange_TURB ENG MASTER STARTER SWITCH | True if the turbine engine master starter switch is on, false otherwise: Units bool: settable false |
| onRequest_TURB ENG MASTER STARTER SWITCH | trigger_onRequest_TURB ENG MASTER STARTER SWITCH | True if the turbine engine master starter switch is on, false otherwise: Units bool: settable false |
| TURB ENG MAX TORQUE PERCENT:index | trigger_TURB ENG MAX TORQUE PERCENT:index | Percent of max rated torque for the indexed engine: Units percent: settable true |
| onChange_TURB ENG MAX TORQUE PERCENT:index | trigger_onChange_TURB ENG MAX TORQUE PERCENT:index | Percent of max rated torque for the indexed engine: Units percent: settable true |
| onRequest_TURB ENG MAX TORQUE PERCENT:index | trigger_onRequest_TURB ENG MAX TORQUE PERCENT:index | Percent of max rated torque for the indexed engine: Units percent: settable true |
| TURB ENG N1 LOSS:index | trigger_TURB ENG N1 LOSS:index | This is used to control the N1 loss of the indexed engine: Units percent: settable true |
| onChange_TURB ENG N1 LOSS:index | trigger_onChange_TURB ENG N1 LOSS:index | This is used to control the N1 loss of the indexed engine: Units percent: settable true |
| onRequest_TURB ENG N1 LOSS:index | trigger_onRequest_TURB ENG N1 LOSS:index | This is used to control the N1 loss of the indexed engine: Units percent: settable true |
| TURB ENG N1:index | trigger_TURB ENG N1:index | The indexed turbine engine N1 value: Units percent: settable true |
| onChange_TURB ENG N1:index | trigger_onChange_TURB ENG N1:index | The indexed turbine engine N1 value: Units percent: settable true |
| onRequest_TURB ENG N1:index | trigger_onRequest_TURB ENG N1:index | The indexed turbine engine N1 value: Units percent: settable true |
| TURB ENG N2:index | trigger_TURB ENG N2:index |  The indexed turbine engine N2 value: Units percent: settable true |
| onChange_TURB ENG N2:index | trigger_onChange_TURB ENG N2:index |  The indexed turbine engine N2 value: Units percent: settable true |
| onRequest_TURB ENG N2:index | trigger_onRequest_TURB ENG N2:index |  The indexed turbine engine N2 value: Units percent: settable true |
| TURB ENG NUM TANKS USED:index | trigger_TURB ENG NUM TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| onChange_TURB ENG NUM TANKS USED:index | trigger_onChange_TURB ENG NUM TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| onRequest_TURB ENG NUM TANKS USED:index | trigger_onRequest_TURB ENG NUM TANKS USED:index | Number of tanks currently being used by the indexed engine: Units number: settable false |
| TURB ENG PRESSURE RATIO:index | trigger_TURB ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable true |
| onChange_TURB ENG PRESSURE RATIO:index | trigger_onChange_TURB ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable true |
| onRequest_TURB ENG PRESSURE RATIO:index | trigger_onRequest_TURB ENG PRESSURE RATIO:index | The indexed engine pressure ratio: Units ratio: settable true |
| TURB ENG PRIMARY NOZZLE PERCENT:index | trigger_TURB ENG PRIMARY NOZZLE PERCENT:index | Percent thrust of primary nozzle for the indexed engine: Units percent Over 100: settable false |
| onChange_TURB ENG PRIMARY NOZZLE PERCENT:index | trigger_onChange_TURB ENG PRIMARY NOZZLE PERCENT:index | Percent thrust of primary nozzle for the indexed engine: Units percent Over 100: settable false |
| onRequest_TURB ENG PRIMARY NOZZLE PERCENT:index | trigger_onRequest_TURB ENG PRIMARY NOZZLE PERCENT:index | Percent thrust of primary nozzle for the indexed engine: Units percent Over 100: settable false |
| TURB ENG REVERSE NOZZLE PERCENT:index | trigger_TURB ENG REVERSE NOZZLE PERCENT:index | Percent thrust reverser nozzles deployed for the indexed engine: Units percent: settable false |
| onChange_TURB ENG REVERSE NOZZLE PERCENT:index | trigger_onChange_TURB ENG REVERSE NOZZLE PERCENT:index | Percent thrust reverser nozzles deployed for the indexed engine: Units percent: settable false |
| onRequest_TURB ENG REVERSE NOZZLE PERCENT:index | trigger_onRequest_TURB ENG REVERSE NOZZLE PERCENT:index | Percent thrust reverser nozzles deployed for the indexed engine: Units percent: settable false |
| TURB ENG TANK SELECTOR:index | trigger_TURB ENG TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| onChange_TURB ENG TANK SELECTOR:index | trigger_onChange_TURB ENG TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| onRequest_TURB ENG TANK SELECTOR:index | trigger_onRequest_TURB ENG TANK SELECTOR:index | Fuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum: settable false |
| TURB ENG TANKS USED:index | trigger_TURB ENG TANKS USED:index | Fuel tanks used by the indexed engine: Units mask: settable false |
| onChange_TURB ENG TANKS USED:index | trigger_onChange_TURB ENG TANKS USED:index | Fuel tanks used by the indexed engine: Units mask: settable false |
| onRequest_TURB ENG TANKS USED:index | trigger_onRequest_TURB ENG TANKS USED:index | Fuel tanks used by the indexed engine: Units mask: settable false |
| TURB ENG THROTTLE COMMANDED N1:index | trigger_TURB ENG THROTTLE COMMANDED N1:index |  The indexed turbine engine commanded N1 for current throttle position: Units percent: settable true |
| onChange_TURB ENG THROTTLE COMMANDED N1:index | trigger_onChange_TURB ENG THROTTLE COMMANDED N1:index |  The indexed turbine engine commanded N1 for current throttle position: Units percent: settable true |
| onRequest_TURB ENG THROTTLE COMMANDED N1:index | trigger_onRequest_TURB ENG THROTTLE COMMANDED N1:index |  The indexed turbine engine commanded N1 for current throttle position: Units percent: settable true |
| TURB ENG THRUST EFFICIENCY LOSS:index | trigger_TURB ENG THRUST EFFICIENCY LOSS:index | This can be used to control the thrust efficiency loss of the indexed engine, where a value of 0 is 100% of available thrust, and 100 is 0% available thrust: Units percent: settable true |
| onChange_TURB ENG THRUST EFFICIENCY LOSS:index | trigger_onChange_TURB ENG THRUST EFFICIENCY LOSS:index | This can be used to control the thrust efficiency loss of the indexed engine, where a value of 0 is 100% of available thrust, and 100 is 0% available thrust: Units percent: settable true |
| onRequest_TURB ENG THRUST EFFICIENCY LOSS:index | trigger_onRequest_TURB ENG THRUST EFFICIENCY LOSS:index | This can be used to control the thrust efficiency loss of the indexed engine, where a value of 0 is 100% of available thrust, and 100 is 0% available thrust: Units percent: settable true |
| TURB ENG VIBRATION:index | trigger_TURB ENG VIBRATION:index | The indexed turbine engine vibration value: Units number: settable false |
| onChange_TURB ENG VIBRATION:index | trigger_onChange_TURB ENG VIBRATION:index | The indexed turbine engine vibration value: Units number: settable false |
| onRequest_TURB ENG VIBRATION:index | trigger_onRequest_TURB ENG VIBRATION:index | The indexed turbine engine vibration value: Units number: settable false |
| TURB MAX ITT | trigger_TURB MAX ITT | Retrieve the itt_peak_temperature as set in the engine.cfg file: Units rankine: settable false |
| onChange_TURB MAX ITT | trigger_onChange_TURB MAX ITT | Retrieve the itt_peak_temperature as set in the engine.cfg file: Units rankine: settable false |
| onRequest_TURB MAX ITT | trigger_onRequest_TURB MAX ITT | Retrieve the itt_peak_temperature as set in the engine.cfg file: Units rankine: settable false |
| TURN COORDINATOR BALL | trigger_TURN COORDINATOR BALL | Turn coordinator ball position.: Units position 128: settable false |
| onChange_TURN COORDINATOR BALL | trigger_onChange_TURN COORDINATOR BALL | Turn coordinator ball position.: Units position 128: settable false |
| onRequest_TURN COORDINATOR BALL | trigger_onRequest_TURN COORDINATOR BALL | Turn coordinator ball position.: Units position 128: settable false |
| TURN COORDINATOR BALL INV | trigger_TURN COORDINATOR BALL INV | Turn coordinator ball position inverted (upside down).: Units position 128: settable false |
| onChange_TURN COORDINATOR BALL INV | trigger_onChange_TURN COORDINATOR BALL INV | Turn coordinator ball position inverted (upside down).: Units position 128: settable false |
| onRequest_TURN COORDINATOR BALL INV | trigger_onRequest_TURN COORDINATOR BALL INV | Turn coordinator ball position inverted (upside down).: Units position 128: settable false |
| TURN INDICATOR RATE | trigger_TURN INDICATOR RATE | Turn indicator reading.: Units radians per second: settable false |
| onChange_TURN INDICATOR RATE | trigger_onChange_TURN INDICATOR RATE | Turn indicator reading.: Units radians per second: settable false |
| onRequest_TURN INDICATOR RATE | trigger_onRequest_TURN INDICATOR RATE | Turn indicator reading.: Units radians per second: settable false |
| TURN INDICATOR SWITCH | trigger_TURN INDICATOR SWITCH | True if turn indicator switch is on.: Units bool: settable false |
| onChange_TURN INDICATOR SWITCH | trigger_onChange_TURN INDICATOR SWITCH | True if turn indicator switch is on.: Units bool: settable false |
| onRequest_TURN INDICATOR SWITCH | trigger_onRequest_TURN INDICATOR SWITCH | True if turn indicator switch is on.: Units bool: settable false |
| TYPICAL DESCENT RATE | trigger_TYPICAL DESCENT RATE | the typical (normal) descent rate for the aircraft.: Units feet: settable false |
| onChange_TYPICAL DESCENT RATE | trigger_onChange_TYPICAL DESCENT RATE | the typical (normal) descent rate for the aircraft.: Units feet: settable false |
| onRequest_TYPICAL DESCENT RATE | trigger_onRequest_TYPICAL DESCENT RATE | the typical (normal) descent rate for the aircraft.: Units feet: settable false |
| USER INPUT ENABLED | trigger_USER INPUT ENABLED | Is input allowed from the user.: Units bool: settable true |
| onChange_USER INPUT ENABLED | trigger_onChange_USER INPUT ENABLED | Is input allowed from the user.: Units bool: settable true |
| onRequest_USER INPUT ENABLED | trigger_onRequest_USER INPUT ENABLED | Is input allowed from the user.: Units bool: settable true |
| VARIOMETER MAC CREADY SETTING | trigger_VARIOMETER MAC CREADY SETTING | The MacCready setting used to fly an optimal speed between thermals.: Units Meters per second: settable true |
| onChange_VARIOMETER MAC CREADY SETTING | trigger_onChange_VARIOMETER MAC CREADY SETTING | The MacCready setting used to fly an optimal speed between thermals.: Units Meters per second: settable true |
| onRequest_VARIOMETER MAC CREADY SETTING | trigger_onRequest_VARIOMETER MAC CREADY SETTING | The MacCready setting used to fly an optimal speed between thermals.: Units Meters per second: settable true |
| VARIOMETER NETTO | trigger_VARIOMETER NETTO | Variometer rate using Netto (Total Energy - polar sinkRate).: Units feet per second: settable false |
| onChange_VARIOMETER NETTO | trigger_onChange_VARIOMETER NETTO | Variometer rate using Netto (Total Energy - polar sinkRate).: Units feet per second: settable false |
| onRequest_VARIOMETER NETTO | trigger_onRequest_VARIOMETER NETTO | Variometer rate using Netto (Total Energy - polar sinkRate).: Units feet per second: settable false |
| VARIOMETER RATE | trigger_VARIOMETER RATE | The variometer rate.: Units feet per second: settable false |
| onChange_VARIOMETER RATE | trigger_onChange_VARIOMETER RATE | The variometer rate.: Units feet per second: settable false |
| onRequest_VARIOMETER RATE | trigger_onRequest_VARIOMETER RATE | The variometer rate.: Units feet per second: settable false |
| VARIOMETER SPEED TO FLY | trigger_VARIOMETER SPEED TO FLY | Optimal speed to fly between thermals using polar curve and MacCready setting.: Units Kilometers per hour: settable false |
| onChange_VARIOMETER SPEED TO FLY | trigger_onChange_VARIOMETER SPEED TO FLY | Optimal speed to fly between thermals using polar curve and MacCready setting.: Units Kilometers per hour: settable false |
| onRequest_VARIOMETER SPEED TO FLY | trigger_onRequest_VARIOMETER SPEED TO FLY | Optimal speed to fly between thermals using polar curve and MacCready setting.: Units Kilometers per hour: settable false |
| VARIOMETER SPEED TO FLY GLIDE RATIO | trigger_VARIOMETER SPEED TO FLY GLIDE RATIO | The glide ratio at optimal speed to fly.: Units number: settable false |
| onChange_VARIOMETER SPEED TO FLY GLIDE RATIO | trigger_onChange_VARIOMETER SPEED TO FLY GLIDE RATIO | The glide ratio at optimal speed to fly.: Units number: settable false |
| onRequest_VARIOMETER SPEED TO FLY GLIDE RATIO | trigger_onRequest_VARIOMETER SPEED TO FLY GLIDE RATIO | The glide ratio at optimal speed to fly.: Units number: settable false |
| VARIOMETER SWITCH | trigger_VARIOMETER SWITCH | True if the variometer switch is on, false if it is not.: Units bool: settable false |
| onChange_VARIOMETER SWITCH | trigger_onChange_VARIOMETER SWITCH | True if the variometer switch is on, false if it is not.: Units bool: settable false |
| onRequest_VARIOMETER SWITCH | trigger_onRequest_VARIOMETER SWITCH | True if the variometer switch is on, false if it is not.: Units bool: settable false |
| VARIOMETER TOTAL ENERGY | trigger_VARIOMETER TOTAL ENERGY | The variometer rate using total energy.: Units feet per second: settable false |
| onChange_VARIOMETER TOTAL ENERGY | trigger_onChange_VARIOMETER TOTAL ENERGY | The variometer rate using total energy.: Units feet per second: settable false |
| onRequest_VARIOMETER TOTAL ENERGY | trigger_onRequest_VARIOMETER TOTAL ENERGY | The variometer rate using total energy.: Units feet per second: settable false |
| VELOCITY BODY X | trigger_VELOCITY BODY X | True lateral speed, relative to aircraft X axis: Units feet: settable true |
| onChange_VELOCITY BODY X | trigger_onChange_VELOCITY BODY X | True lateral speed, relative to aircraft X axis: Units feet: settable true |
| onRequest_VELOCITY BODY X | trigger_onRequest_VELOCITY BODY X | True lateral speed, relative to aircraft X axis: Units feet: settable true |
| VELOCITY BODY Y | trigger_VELOCITY BODY Y | True vertical speed, relative to aircraft Y axis: Units feet: settable true |
| onChange_VELOCITY BODY Y | trigger_onChange_VELOCITY BODY Y | True vertical speed, relative to aircraft Y axis: Units feet: settable true |
| onRequest_VELOCITY BODY Y | trigger_onRequest_VELOCITY BODY Y | True vertical speed, relative to aircraft Y axis: Units feet: settable true |
| VELOCITY BODY Z | trigger_VELOCITY BODY Z | True longitudinal speed, relative to aircraft Z axis: Units feet: settable true |
| onChange_VELOCITY BODY Z | trigger_onChange_VELOCITY BODY Z | True longitudinal speed, relative to aircraft Z axis: Units feet: settable true |
| onRequest_VELOCITY BODY Z | trigger_onRequest_VELOCITY BODY Z | True longitudinal speed, relative to aircraft Z axis: Units feet: settable true |
| VELOCITY WORLD X | trigger_VELOCITY WORLD X | Speed relative to earth, in East/West direction.: Units feet per second: settable true |
| onChange_VELOCITY WORLD X | trigger_onChange_VELOCITY WORLD X | Speed relative to earth, in East/West direction.: Units feet per second: settable true |
| onRequest_VELOCITY WORLD X | trigger_onRequest_VELOCITY WORLD X | Speed relative to earth, in East/West direction.: Units feet per second: settable true |
| VELOCITY WORLD Y | trigger_VELOCITY WORLD Y | Speed relative to earth, in vertical direction.: Units feet per second: settable true |
| onChange_VELOCITY WORLD Y | trigger_onChange_VELOCITY WORLD Y | Speed relative to earth, in vertical direction.: Units feet per second: settable true |
| onRequest_VELOCITY WORLD Y | trigger_onRequest_VELOCITY WORLD Y | Speed relative to earth, in vertical direction.: Units feet per second: settable true |
| VELOCITY WORLD Z | trigger_VELOCITY WORLD Z | Speed relative to earth, in North/South direction.: Units feet per second: settable true |
| onChange_VELOCITY WORLD Z | trigger_onChange_VELOCITY WORLD Z | Speed relative to earth, in North/South direction.: Units feet per second: settable true |
| onRequest_VELOCITY WORLD Z | trigger_onRequest_VELOCITY WORLD Z | Speed relative to earth, in North/South direction.: Units feet per second: settable true |
| VERTICAL SPEED | trigger_VERTICAL SPEED | The current indicated vertical speed for the aircraft: Units feet: settable true |
| onChange_VERTICAL SPEED | trigger_onChange_VERTICAL SPEED | The current indicated vertical speed for the aircraft: Units feet: settable true |
| onRequest_VERTICAL SPEED | trigger_onRequest_VERTICAL SPEED | The current indicated vertical speed for the aircraft: Units feet: settable true |
| VISUAL MODEL RADIUS | trigger_VISUAL MODEL RADIUS | Model radius.: Units meters: settable false |
| onChange_VISUAL MODEL RADIUS | trigger_onChange_VISUAL MODEL RADIUS | Model radius.: Units meters: settable false |
| onRequest_VISUAL MODEL RADIUS | trigger_onRequest_VISUAL MODEL RADIUS | Model radius.: Units meters: settable false |
| WAGON BACK LINK LENGTH | trigger_WAGON BACK LINK LENGTH | The length of the link at the back of the vehicle used to attach a wagon behind.: Units meters: settable false |
| onChange_WAGON BACK LINK LENGTH | trigger_onChange_WAGON BACK LINK LENGTH | The length of the link at the back of the vehicle used to attach a wagon behind.: Units meters: settable false |
| onRequest_WAGON BACK LINK LENGTH | trigger_onRequest_WAGON BACK LINK LENGTH | The length of the link at the back of the vehicle used to attach a wagon behind.: Units meters: settable false |
| WAGON BACK LINK ORIENTATION | trigger_WAGON BACK LINK ORIENTATION | The current orientation of the link at the back of the vehicle used to attach a wagon behind.: Units degrees: settable false |
| onChange_WAGON BACK LINK ORIENTATION | trigger_onChange_WAGON BACK LINK ORIENTATION | The current orientation of the link at the back of the vehicle used to attach a wagon behind.: Units degrees: settable false |
| onRequest_WAGON BACK LINK ORIENTATION | trigger_onRequest_WAGON BACK LINK ORIENTATION | The current orientation of the link at the back of the vehicle used to attach a wagon behind.: Units degrees: settable false |
| WAGON BACK LINK START POSZ | trigger_WAGON BACK LINK START POSZ | The "Z" axis position of the start of the link at the back of the vehicle used to attach a wagon behind, relative to the ground.: Units meters: settable false |
| onChange_WAGON BACK LINK START POSZ | trigger_onChange_WAGON BACK LINK START POSZ | The "Z" axis position of the start of the link at the back of the vehicle used to attach a wagon behind, relative to the ground.: Units meters: settable false |
| onRequest_WAGON BACK LINK START POSZ | trigger_onRequest_WAGON BACK LINK START POSZ | The "Z" axis position of the start of the link at the back of the vehicle used to attach a wagon behind, relative to the ground.: Units meters: settable false |
| WAGON FRONT LINK LENGTH | trigger_WAGON FRONT LINK LENGTH | The length of the link at the front of the vehicle used to be attached as wagon.: Units meters: settable false |
| onChange_WAGON FRONT LINK LENGTH | trigger_onChange_WAGON FRONT LINK LENGTH | The length of the link at the front of the vehicle used to be attached as wagon.: Units meters: settable false |
| onRequest_WAGON FRONT LINK LENGTH | trigger_onRequest_WAGON FRONT LINK LENGTH | The length of the link at the front of the vehicle used to be attached as wagon.: Units meters: settable false |
| WAGON FRONT LINK ORIENTATION | trigger_WAGON FRONT LINK ORIENTATION | The current orientation of the link at the front of the vehicle used to be attached as wagon.: Units degrees: settable false |
| onChange_WAGON FRONT LINK ORIENTATION | trigger_onChange_WAGON FRONT LINK ORIENTATION | The current orientation of the link at the front of the vehicle used to be attached as wagon.: Units degrees: settable false |
| onRequest_WAGON FRONT LINK ORIENTATION | trigger_onRequest_WAGON FRONT LINK ORIENTATION | The current orientation of the link at the front of the vehicle used to be attached as wagon.: Units degrees: settable false |
| WAGON FRONT LINK START POSZ | trigger_WAGON FRONT LINK START POSZ | The "Z" axis position of the start of the link at the front of the vehicle used to be attached as wagon, relative to the ground.: Units meters: settable false |
| onChange_WAGON FRONT LINK START POSZ | trigger_onChange_WAGON FRONT LINK START POSZ | The "Z" axis position of the start of the link at the front of the vehicle used to be attached as wagon, relative to the ground.: Units meters: settable false |
| onRequest_WAGON FRONT LINK START POSZ | trigger_onRequest_WAGON FRONT LINK START POSZ | The "Z" axis position of the start of the link at the front of the vehicle used to be attached as wagon, relative to the ground.: Units meters: settable false |
| WARNING FUEL | trigger_WARNING FUEL | This is the current state of the fuel warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING FUEL | trigger_onChange_WARNING FUEL | This is the current state of the fuel warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING FUEL | trigger_onRequest_WARNING FUEL | This is the current state of the fuel warning, either on (true) or off (false).: Units bool: settable false |
| WARNING FUEL LEFT | trigger_WARNING FUEL LEFT | This is the current state of the left fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING FUEL LEFT | trigger_onChange_WARNING FUEL LEFT | This is the current state of the left fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING FUEL LEFT | trigger_onRequest_WARNING FUEL LEFT | This is the current state of the left fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| WARNING FUEL RIGHT | trigger_WARNING FUEL RIGHT | This is the current state of the right fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING FUEL RIGHT | trigger_onChange_WARNING FUEL RIGHT | This is the current state of the right fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING FUEL RIGHT | trigger_onRequest_WARNING FUEL RIGHT | This is the current state of the right fuel tank warning, either on (true) or off (false).: Units bool: settable false |
| WARNING LOW HEIGHT | trigger_WARNING LOW HEIGHT | This is the current state of the low height warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING LOW HEIGHT | trigger_onChange_WARNING LOW HEIGHT | This is the current state of the low height warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING LOW HEIGHT | trigger_onRequest_WARNING LOW HEIGHT | This is the current state of the low height warning, either on (true) or off (false).: Units bool: settable false |
| WARNING OIL PRESSURE | trigger_WARNING OIL PRESSURE | This is the current state of the oil pressure warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING OIL PRESSURE | trigger_onChange_WARNING OIL PRESSURE | This is the current state of the oil pressure warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING OIL PRESSURE | trigger_onRequest_WARNING OIL PRESSURE | This is the current state of the oil pressure warning, either on (true) or off (false).: Units bool: settable false |
| WARNING VACUUM | trigger_WARNING VACUUM | This is the current state of the vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING VACUUM | trigger_onChange_WARNING VACUUM | This is the current state of the vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING VACUUM | trigger_onRequest_WARNING VACUUM | This is the current state of the vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| WARNING VACUUM LEFT | trigger_WARNING VACUUM LEFT | This is the current state of the left vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING VACUUM LEFT | trigger_onChange_WARNING VACUUM LEFT | This is the current state of the left vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING VACUUM LEFT | trigger_onRequest_WARNING VACUUM LEFT | This is the current state of the left vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| WARNING VACUUM RIGHT | trigger_WARNING VACUUM RIGHT | This is the current state of the right vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING VACUUM RIGHT | trigger_onChange_WARNING VACUUM RIGHT | This is the current state of the right vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING VACUUM RIGHT | trigger_onRequest_WARNING VACUUM RIGHT | This is the current state of the right vacuum system warning, either on (true) or off (false).: Units bool: settable false |
| WARNING VOLTAGE | trigger_WARNING VOLTAGE | This is the current state of the electrical system voltage warning, either on (true) or off (false).: Units bool: settable false |
| onChange_WARNING VOLTAGE | trigger_onChange_WARNING VOLTAGE | This is the current state of the electrical system voltage warning, either on (true) or off (false).: Units bool: settable false |
| onRequest_WARNING VOLTAGE | trigger_onRequest_WARNING VOLTAGE | This is the current state of the electrical system voltage warning, either on (true) or off (false).: Units bool: settable false |
| WATER BALLAST TANK CAPACITY:index | trigger_WATER BALLAST TANK CAPACITY:index | The capacity of the indexed water ballast tank.: Units pounds: settable false |
| onChange_WATER BALLAST TANK CAPACITY:index | trigger_onChange_WATER BALLAST TANK CAPACITY:index | The capacity of the indexed water ballast tank.: Units pounds: settable false |
| onRequest_WATER BALLAST TANK CAPACITY:index | trigger_onRequest_WATER BALLAST TANK CAPACITY:index | The capacity of the indexed water ballast tank.: Units pounds: settable false |
| WATER BALLAST TANK NUMBER | trigger_WATER BALLAST TANK NUMBER | The number of water ballast tank available.: Units number: settable false |
| onChange_WATER BALLAST TANK NUMBER | trigger_onChange_WATER BALLAST TANK NUMBER | The number of water ballast tank available.: Units number: settable false |
| onRequest_WATER BALLAST TANK NUMBER | trigger_onRequest_WATER BALLAST TANK NUMBER | The number of water ballast tank available.: Units number: settable false |
| WATER BALLAST TANK QUANTITY:index | trigger_WATER BALLAST TANK QUANTITY:index | The quantity of water ballast in the indexed tank.: Units pounds: settable false |
| onChange_WATER BALLAST TANK QUANTITY:index | trigger_onChange_WATER BALLAST TANK QUANTITY:index | The quantity of water ballast in the indexed tank.: Units pounds: settable false |
| onRequest_WATER BALLAST TANK QUANTITY:index | trigger_onRequest_WATER BALLAST TANK QUANTITY:index | The quantity of water ballast in the indexed tank.: Units pounds: settable false |
| WATER BALLAST VALVE | trigger_WATER BALLAST VALVE | True (1) if a water ballast valve is available, False (0) otherwise.: Units bool: settable false |
| onChange_WATER BALLAST VALVE | trigger_onChange_WATER BALLAST VALVE | True (1) if a water ballast valve is available, False (0) otherwise.: Units bool: settable false |
| onRequest_WATER BALLAST VALVE | trigger_onRequest_WATER BALLAST VALVE | True (1) if a water ballast valve is available, False (0) otherwise.: Units bool: settable false |
| WATER BALLAST VALVE FLOW RATE | trigger_WATER BALLAST VALVE FLOW RATE | The flow rate of the water ballast valve.: Units gallons per hour: settable false |
| onChange_WATER BALLAST VALVE FLOW RATE | trigger_onChange_WATER BALLAST VALVE FLOW RATE | The flow rate of the water ballast valve.: Units gallons per hour: settable false |
| onRequest_WATER BALLAST VALVE FLOW RATE | trigger_onRequest_WATER BALLAST VALVE FLOW RATE | The flow rate of the water ballast valve.: Units gallons per hour: settable false |
| WATER LEFT RUDDER EXTENDED | trigger_WATER LEFT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| onChange_WATER LEFT RUDDER EXTENDED | trigger_onChange_WATER LEFT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| onRequest_WATER LEFT RUDDER EXTENDED | trigger_onRequest_WATER LEFT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| WATER LEFT RUDDER STEER ANGLE | trigger_WATER LEFT RUDDER STEER ANGLE | Water left rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| onChange_WATER LEFT RUDDER STEER ANGLE | trigger_onChange_WATER LEFT RUDDER STEER ANGLE | Water left rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| onRequest_WATER LEFT RUDDER STEER ANGLE | trigger_onRequest_WATER LEFT RUDDER STEER ANGLE | Water left rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| WATER LEFT RUDDER STEER ANGLE PCT | trigger_WATER LEFT RUDDER STEER ANGLE PCT | Water left rudder angle as a percentage: Units percent Over 100: settable false |
| onChange_WATER LEFT RUDDER STEER ANGLE PCT | trigger_onChange_WATER LEFT RUDDER STEER ANGLE PCT | Water left rudder angle as a percentage: Units percent Over 100: settable false |
| onRequest_WATER LEFT RUDDER STEER ANGLE PCT | trigger_onRequest_WATER LEFT RUDDER STEER ANGLE PCT | Water left rudder angle as a percentage: Units percent Over 100: settable false |
| WATER RIGHT RUDDER EXTENDED | trigger_WATER RIGHT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| onChange_WATER RIGHT RUDDER EXTENDED | trigger_onChange_WATER RIGHT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| onRequest_WATER RIGHT RUDDER EXTENDED | trigger_onRequest_WATER RIGHT RUDDER EXTENDED | Percent extended: Units percent: settable false |
| WATER RIGHT RUDDER STEER ANGLE | trigger_WATER RIGHT RUDDER STEER ANGLE | Water right rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| onChange_WATER RIGHT RUDDER STEER ANGLE | trigger_onChange_WATER RIGHT RUDDER STEER ANGLE | Water right rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| onRequest_WATER RIGHT RUDDER STEER ANGLE | trigger_onRequest_WATER RIGHT RUDDER STEER ANGLE | Water right rudder angle, negative to the left, positive to the right: Units percent Over 100: settable false |
| WATER RIGHT RUDDER STEER ANGLE PCT | trigger_WATER RIGHT RUDDER STEER ANGLE PCT | Water right rudder as a percentage: Units percent Over 100: settable false |
| onChange_WATER RIGHT RUDDER STEER ANGLE PCT | trigger_onChange_WATER RIGHT RUDDER STEER ANGLE PCT | Water right rudder as a percentage: Units percent Over 100: settable false |
| onRequest_WATER RIGHT RUDDER STEER ANGLE PCT | trigger_onRequest_WATER RIGHT RUDDER STEER ANGLE PCT | Water right rudder as a percentage: Units percent Over 100: settable false |
| WATER RUDDER HANDLE POSITION | trigger_WATER RUDDER HANDLE POSITION | Position of the water rudder handle (0 handle retracted, 1 rudder handle applied): Units percent Over 100: settable true |
| onChange_WATER RUDDER HANDLE POSITION | trigger_onChange_WATER RUDDER HANDLE POSITION | Position of the water rudder handle (0 handle retracted, 1 rudder handle applied): Units percent Over 100: settable true |
| onRequest_WATER RUDDER HANDLE POSITION | trigger_onRequest_WATER RUDDER HANDLE POSITION | Position of the water rudder handle (0 handle retracted, 1 rudder handle applied): Units percent Over 100: settable true |
| WHEEL ROTATION ANGLE:index | trigger_WHEEL ROTATION ANGLE:index | Wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onChange_WHEEL ROTATION ANGLE:index | trigger_onChange_WHEEL ROTATION ANGLE:index | Wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| onRequest_WHEEL ROTATION ANGLE:index | trigger_onRequest_WHEEL ROTATION ANGLE:index | Wheel rotation angle (rotation around the axis for the wheel): Units radians: settable false |
| WHEEL RPM:index | trigger_WHEEL RPM:index | Wheel rpm: Units RPM: settable false |
| onChange_WHEEL RPM:index | trigger_onChange_WHEEL RPM:index | Wheel rpm: Units RPM: settable false |
| onRequest_WHEEL RPM:index | trigger_onRequest_WHEEL RPM:index | Wheel rpm: Units RPM: settable false |
| WINDSHIELD DEICE SWITCH | trigger_WINDSHIELD DEICE SWITCH | True if the aircraft windshield deice switch is on.: Units bool: settable false |
| onChange_WINDSHIELD DEICE SWITCH | trigger_onChange_WINDSHIELD DEICE SWITCH | True if the aircraft windshield deice switch is on.: Units bool: settable false |
| onRequest_WINDSHIELD DEICE SWITCH | trigger_onRequest_WINDSHIELD DEICE SWITCH | True if the aircraft windshield deice switch is on.: Units bool: settable false |
| WINDSHIELD RAIN EFFECT AVAILABLE | trigger_WINDSHIELD RAIN EFFECT AVAILABLE | Is visual effect available on this aircraft: Units bool: settable false |
| onChange_WINDSHIELD RAIN EFFECT AVAILABLE | trigger_onChange_WINDSHIELD RAIN EFFECT AVAILABLE | Is visual effect available on this aircraft: Units bool: settable false |
| onRequest_WINDSHIELD RAIN EFFECT AVAILABLE | trigger_onRequest_WINDSHIELD RAIN EFFECT AVAILABLE | Is visual effect available on this aircraft: Units bool: settable false |
| WINDSHIELD WIND VELOCITY | trigger_WINDSHIELD WIND VELOCITY | Longitudinal speed of wind on the windshield.: Units feet: settable false |
| onChange_WINDSHIELD WIND VELOCITY | trigger_onChange_WINDSHIELD WIND VELOCITY | Longitudinal speed of wind on the windshield.: Units feet: settable false |
| onRequest_WINDSHIELD WIND VELOCITY | trigger_onRequest_WINDSHIELD WIND VELOCITY | Longitudinal speed of wind on the windshield.: Units feet: settable false |
| WING AREA | trigger_WING AREA | Total wing area: Units square feet: settable false |
| onChange_WING AREA | trigger_onChange_WING AREA | Total wing area: Units square feet: settable false |
| onRequest_WING AREA | trigger_onRequest_WING AREA | Total wing area: Units square feet: settable false |
| WING FLEX PCT:index | trigger_WING FLEX PCT:index | The current wing flex. Different values can be set for each wing (for example, during banking). Set an index of 1 for the left wing, and 2 for the right wing.: Units percent Over 100: settable true |
| onChange_WING FLEX PCT:index | trigger_onChange_WING FLEX PCT:index | The current wing flex. Different values can be set for each wing (for example, during banking). Set an index of 1 for the left wing, and 2 for the right wing.: Units percent Over 100: settable true |
| onRequest_WING FLEX PCT:index | trigger_onRequest_WING FLEX PCT:index | The current wing flex. Different values can be set for each wing (for example, during banking). Set an index of 1 for the left wing, and 2 for the right wing.: Units percent Over 100: settable true |
| WING SPAN | trigger_WING SPAN | Total wing span: Units feet: settable false |
| onChange_WING SPAN | trigger_onChange_WING SPAN | Total wing span: Units feet: settable false |
| onRequest_WING SPAN | trigger_onRequest_WING SPAN | Total wing span: Units feet: settable false |
| YAW STRING ANGLE | trigger_YAW STRING ANGLE | The yaw string angle. Yaw strings are attached to gliders as visible indicators of the yaw angle. An animation of this is not implemented in ESP.: Units radians: settable false |
| onChange_YAW STRING ANGLE | trigger_onChange_YAW STRING ANGLE | The yaw string angle. Yaw strings are attached to gliders as visible indicators of the yaw angle. An animation of this is not implemented in ESP.: Units radians: settable false |
| onRequest_YAW STRING ANGLE | trigger_onRequest_YAW STRING ANGLE | The yaw string angle. Yaw strings are attached to gliders as visible indicators of the yaw angle. An animation of this is not implemented in ESP.: Units radians: settable false |
| YAW STRING PCT EXTENDED | trigger_YAW STRING PCT EXTENDED | Yaw string angle as a percentage: Units percent Over 100: settable false |
| onChange_YAW STRING PCT EXTENDED | trigger_onChange_YAW STRING PCT EXTENDED | Yaw string angle as a percentage: Units percent Over 100: settable false |
| onRequest_YAW STRING PCT EXTENDED | trigger_onRequest_YAW STRING PCT EXTENDED | Yaw string angle as a percentage: Units percent Over 100: settable false |
| YOKE X INDICATOR | trigger_YOKE X INDICATOR | Yoke position in horizontal direction.: Units position: settable false |
| onChange_YOKE X INDICATOR | trigger_onChange_YOKE X INDICATOR | Yoke position in horizontal direction.: Units position: settable false |
| onRequest_YOKE X INDICATOR | trigger_onRequest_YOKE X INDICATOR | Yoke position in horizontal direction.: Units position: settable false |
| YOKE X POSITION | trigger_YOKE X POSITION | Percent control deflection left/right (for animation).: Units position: settable true |
| onChange_YOKE X POSITION | trigger_onChange_YOKE X POSITION | Percent control deflection left/right (for animation).: Units position: settable true |
| onRequest_YOKE X POSITION | trigger_onRequest_YOKE X POSITION | Percent control deflection left/right (for animation).: Units position: settable true |
| YOKE X POSITION WITH AP | trigger_YOKE X POSITION WITH AP | Percent control deflection left/right (for animation). Also includes AP's inputs.: Units position: settable false |
| onChange_YOKE X POSITION WITH AP | trigger_onChange_YOKE X POSITION WITH AP | Percent control deflection left/right (for animation). Also includes AP's inputs.: Units position: settable false |
| onRequest_YOKE X POSITION WITH AP | trigger_onRequest_YOKE X POSITION WITH AP | Percent control deflection left/right (for animation). Also includes AP's inputs.: Units position: settable false |
| YOKE Y INDICATOR | trigger_YOKE Y INDICATOR | Yoke position in vertical direction.: Units position: settable false |
| onChange_YOKE Y INDICATOR | trigger_onChange_YOKE Y INDICATOR | Yoke position in vertical direction.: Units position: settable false |
| onRequest_YOKE Y INDICATOR | trigger_onRequest_YOKE Y INDICATOR | Yoke position in vertical direction.: Units position: settable false |
| YOKE Y POSITION | trigger_YOKE Y POSITION | Percent control deflection fore/aft (for animation).: Units position: settable true |
| onChange_YOKE Y POSITION | trigger_onChange_YOKE Y POSITION | Percent control deflection fore/aft (for animation).: Units position: settable true |
| onRequest_YOKE Y POSITION | trigger_onRequest_YOKE Y POSITION | Percent control deflection fore/aft (for animation).: Units position: settable true |
| YOKE Y POSITION WITH AP | trigger_YOKE Y POSITION WITH AP | Percent control deflection fore/aft (for animation). Also includes AP's inputs.: Units position: settable false |
| onChange_YOKE Y POSITION WITH AP | trigger_onChange_YOKE Y POSITION WITH AP | Percent control deflection fore/aft (for animation). Also includes AP's inputs.: Units position: settable false |
| onRequest_YOKE Y POSITION WITH AP | trigger_onRequest_YOKE Y POSITION WITH AP | Percent control deflection fore/aft (for animation). Also includes AP's inputs.: Units position: settable false |
| ZERO LIFT ALPHA | trigger_ZERO LIFT ALPHA | The angle of attack at which the wing has zero lift.: Units radians: settable false |
| onChange_ZERO LIFT ALPHA | trigger_onChange_ZERO LIFT ALPHA | The angle of attack at which the wing has zero lift.: Units radians: settable false |
| onRequest_ZERO LIFT ALPHA | trigger_onRequest_ZERO LIFT ALPHA | The angle of attack at which the wing has zero lift.: Units radians: settable false |
### Actions

| name | trigger | description |
| --- | --- | --- |
| PLANE LATITUDE LONGITUDE_get | action_PLANE LATITUDE LONGITUDE_get | Get the current lat long in one message |
| PLANE LATITUDE LONGITUDE_get | action_PLANE LATITUDE LONGITUDE_get | Get the current lat long in one message |
| ACCELERATION BODY X_get | action_ACCELERATION BODY X_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to aircraft X axis, in east/west direction: Units feet |
| ACCELERATION BODY Y_get | action_ACCELERATION BODY Y_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to aircraft Y axis, in vertical direction: Units feet |
| ACCELERATION BODY Z_get | action_ACCELERATION BODY Z_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to aircraft Z axis, in north/south direction: Units feet |
| ACCELERATION WORLD X_get | action_ACCELERATION WORLD X_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to the earth X axis, in east/west direction: Units feet |
| ACCELERATION WORLD Y_get | action_ACCELERATION WORLD Y_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to the earth Y axis, in vertical direction: Units feet |
| ACCELERATION WORLD Z_get | action_ACCELERATION WORLD Z_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration relative to the earth Z axis, in north/south direction: Units feet |
| ADF ACTIVE FREQUENCY:index_get | action_ADF ACTIVE FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerADF frequency. Index of 1 or 2.: Units frequency ADF BCD32 |
| ADF AVAILABLE:index_get | action_ADF AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if ADF is available: Units bool |
| ADF CARD_get | action_ADF CARD_get | Request the value, will be returned in a 'name_(Single) 'triggerADF compass rose setting: Units degrees |
| ADF IDENT_get | action_ADF IDENT_get | Request the value, will be returned in a 'name_(Single) 'triggerICAO code: Units null |
| ADF NAME:index_get | action_ADF NAME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDescriptive name: Units null |
| ADF RADIAL MAG:index_get | action_ADF RADIAL MAG:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the magnetic bearing to the currently tuned ADF transmitter.: Units degrees |
| ADF RADIAL:index_get | action_ADF RADIAL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent direction from NDB station: Units degrees |
| ADF SIGNAL:index_get | action_ADF SIGNAL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerSignal strength: Units number |
| ADF SOUND:index_get | action_ADF SOUND:index_get | Request the value, will be returned in a 'name_(Single) 'triggerADF audio flag. Index of 0 or 1.: Units bool |
| ADF STANDBY AVAILABLE:index_get | action_ADF STANDBY AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if ADF Standby is available: Units bool |
| ADF STANDBY FREQUENCY:index_get | action_ADF STANDBY FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerADF standby frequency: Units Hz |
| ADF VOLUME_get | action_ADF VOLUME_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the volume of the ADF: Units percent Over 100 |
| AI ANTISTALL STATE_get | action_AI ANTISTALL STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current state of the AI anti-stall system: Units enum |
| AI AUTOTRIM ACTIVE_get | action_AI AUTOTRIM ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the AI auto-trim system is enabled or not: Units bool |
| AI AUTOTRIM ACTIVE AGAINST PLAYER_get | action_AI AUTOTRIM ACTIVE AGAINST PLAYER_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the AI auto-trim system is enabled or not for AI controlled aircraft: Units bool |
| AI CONTROLS_get | action_AI CONTROLS_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the AI control system is enabled or not: Units bool |
| AI CURSOR MODE ACTIVE_get | action_AI CURSOR MODE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the AI cursor mode is active or not: Units bool |
| AILERON AVERAGE DEFLECTION_get | action_AILERON AVERAGE DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| AILERON LEFT DEFLECTION_get | action_AILERON LEFT DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| AILERON LEFT DEFLECTION PCT_get | action_AILERON LEFT DEFLECTION PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent deflection: Units percent Over 100 |
| AILERON POSITION | action_AILERON POSITION | Set the simvar Percent aileron input left/right: Units position |
| AILERON POSITION_get | action_AILERON POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent aileron input left/right: Units position |
| AILERON RIGHT DEFLECTION_get | action_AILERON RIGHT DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| AILERON RIGHT DEFLECTION PCT_get | action_AILERON RIGHT DEFLECTION PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent deflection: Units percent Over 100 |
| AILERON TRIM_get | action_AILERON TRIM_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| AILERON TRIM DISABLED_get | action_AILERON TRIM DISABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Aileron Trim has been disabled: Units bool |
| AILERON TRIM PCT | action_AILERON TRIM PCT | Set the simvar The trim position of the ailerons. Zero is fully retracted: Units percent Over 100 |
| AILERON TRIM PCT_get | action_AILERON TRIM PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe trim position of the ailerons. Zero is fully retracted: Units percent Over 100 |
| AIRCRAFT WIND X_get | action_AIRCRAFT WIND X_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in aircraft lateral (X) axis: Units knots |
| AIRCRAFT WIND Y_get | action_AIRCRAFT WIND Y_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in aircraft vertical (Y) axis.: Units knots |
| AIRCRAFT WIND Z_get | action_AIRCRAFT WIND Z_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in aircraft longitudinal (Z) axis.: Units knots |
| AIRSPEED BARBER POLE_get | action_AIRSPEED BARBER POLE_get | Request the value, will be returned in a 'name_(Single) 'triggerRedline airspeed (dynamic on some aircraft).: Units knots |
| AIRSPEED INDICATED | action_AIRSPEED INDICATED | Set the simvar Indicated airspeed.: Units knots |
| AIRSPEED INDICATED_get | action_AIRSPEED INDICATED_get | Request the value, will be returned in a 'name_(Single) 'triggerIndicated airspeed.: Units knots |
| AIRSPEED MACH_get | action_AIRSPEED MACH_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent mach.: Units mach |
| AIRSPEED SELECT INDICATED OR TRUE_get | action_AIRSPEED SELECT INDICATED OR TRUE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe airspeed, whether true or indicated airspeed has been selected.: Units knots |
| AIRSPEED TRUE | action_AIRSPEED TRUE | Set the simvar True airspeed.: Units knots |
| AIRSPEED TRUE_get | action_AIRSPEED TRUE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue airspeed.: Units knots |
| AIRSPEED TRUE CALIBRATE | action_AIRSPEED TRUE CALIBRATE | Set the simvar Angle of True calibration scale on airspeed indicator.: Units degrees |
| AIRSPEED TRUE CALIBRATE_get | action_AIRSPEED TRUE CALIBRATE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle of True calibration scale on airspeed indicator.: Units degrees |
| AIRSPEED TRUE RAW | action_AIRSPEED TRUE RAW | Set the simvar Equivalent to AIRSPEED TRUE, but does not account for wind when used to Set Airspeed value: Units knots |
| AIRSPEED TRUE RAW_get | action_AIRSPEED TRUE RAW_get | Request the value, will be returned in a 'name_(Single) 'triggerEquivalent to AIRSPEED TRUE, but does not account for wind when used to Set Airspeed value: Units knots |
| ALTERNATE STATIC SOURCE OPEN:index_get | action_ALTERNATE STATIC SOURCE OPEN:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAlternate static air source.: Units bool |
| ALTERNATOR BREAKER PULLED | action_ALTERNATOR BREAKER PULLED | Set the simvar This will be true if the alternator breaker is pulled. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool |
| ALTERNATOR BREAKER PULLED_get | action_ALTERNATOR BREAKER PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the alternator breaker is pulled. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool |
| ALTERNATOR CONNECTION ON_get | action_ALTERNATOR CONNECTION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the alternator is connected. Requires a BUS_LOOKUP_INDEX and an alternator index: Units bool |
| AMBIENT DENSITY_get | action_AMBIENT DENSITY_get | Request the value, will be returned in a 'name_(Single) 'triggerAmbient density.: Units Slugs per cubic feet |
| AMBIENT IN CLOUD_get | action_AMBIENT IN CLOUD_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the aircraft is in a cloud: Units bool |
| AMBIENT PRECIP RATE_get | action_AMBIENT PRECIP RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current precipitation rate.: Units millimeters of water |
| AMBIENT PRECIP STATE_get | action_AMBIENT PRECIP STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current state of precipitation.: Units mask |
| AMBIENT PRESSURE_get | action_AMBIENT PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerAmbient pressure.: Units Inches of Mercury |
| AMBIENT TEMPERATURE_get | action_AMBIENT TEMPERATURE_get | Request the value, will be returned in a 'name_(Single) 'triggerAmbient temperature.: Units celsius |
| AMBIENT VISIBILITY_get | action_AMBIENT VISIBILITY_get | Request the value, will be returned in a 'name_(Single) 'triggerAmbient visibility (only measures ambient particle visibility - related to ambient density).: Units meters |
| AMBIENT WIND DIRECTION_get | action_AMBIENT WIND DIRECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerWind direction, relative to true north.: Units degrees |
| AMBIENT WIND VELOCITY_get | action_AMBIENT WIND VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerWind velocity.: Units knots |
| AMBIENT WIND X_get | action_AMBIENT WIND X_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in East/West direction.: Units Meters per second |
| AMBIENT WIND Y_get | action_AMBIENT WIND Y_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in vertical direction.: Units Meters per second |
| AMBIENT WIND Z_get | action_AMBIENT WIND Z_get | Request the value, will be returned in a 'name_(Single) 'triggerWind component in North/South direction.: Units Meters per second |
| ANEMOMETER PCT RPM_get | action_ANEMOMETER PCT RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerAnemometer rpm as a percentage.: Units percent Over 100 |
| ANGLE OF ATTACK INDICATOR_get | action_ANGLE OF ATTACK INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerAoA indication.: Units radians |
| ANIMATION DELTA TIME_get | action_ANIMATION DELTA TIME_get | Request the value, will be returned in a 'name_(Single) 'triggerDifference of time between the current frame and the last frame where this SimObject has been animated: Units seconds |
| ANTISKID BRAKES ACTIVE_get | action_ANTISKID BRAKES ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if antiskid brakes active. This can be set using the AntiSkidActive parameter: Units bool |
| APPLY HEAT TO SYSTEMS | action_APPLY HEAT TO SYSTEMS | Set the simvar Used when too close to a fire.: Units bool |
| APPLY HEAT TO SYSTEMS_get | action_APPLY HEAT TO SYSTEMS_get | Request the value, will be returned in a 'name_(Single) 'triggerUsed when too close to a fire.: Units bool |
| APU BLEED PRESSURE RECEIVED BY ENGINE_get | action_APU BLEED PRESSURE RECEIVED BY ENGINE_get | Request the value, will be returned in a 'name_(Single) 'triggerBleed air pressure received by the engine from the APU: Units pounds |
| APU GENERATOR ACTIVE:index | action_APU GENERATOR ACTIVE:index | Set the simvar Set or get whether an APU is active (true) or not (false). Takes an index to be able to have multiple generators on a single APU: Units bool |
| APU GENERATOR ACTIVE:index_get | action_APU GENERATOR ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerSet or get whether an APU is active (true) or not (false). Takes an index to be able to have multiple generators on a single APU: Units bool |
| APU GENERATOR SWITCH:index_get | action_APU GENERATOR SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEnables or disables the APU for an engine. Takes an index to be able to have multiple generators on a single APU: Units bool |
| APU ON FIRE DETECTED_get | action_APU ON FIRE DETECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerWill return true if the APU is on fire, or false otherwise: Units bool |
| APU PCT RPM_get | action_APU PCT RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerAuxiliary power unit RPM, as a percentage: Units percent Over 100 |
| APU PCT STARTER_get | action_APU PCT STARTER_get | Request the value, will be returned in a 'name_(Single) 'triggerAuxiliary power unit starter, as a percentage: Units percent Over 100 |
| APU SWITCH | action_APU SWITCH | Set the simvar Boolean, whether or not the APU is switched on: Units bool |
| APU SWITCH_get | action_APU SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerBoolean, whether or not the APU is switched on: Units bool |
| APU VOLTS:index_get | action_APU VOLTS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe volts from the APU to the selected engine. Takes an index to be able to have multiple generators on a single APU: Units volts |
| ARTIFICIAL GROUND ELEVATION_get | action_ARTIFICIAL GROUND ELEVATION_get | Request the value, will be returned in a 'name_(Single) 'triggerIn case scenery is not loaded for AI planes, this variable can be used to set a default surface elevation.: Units feet |
| ASSISTANCE LANDING ENABLED_get | action_ASSISTANCE LANDING ENABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether landing assistance has been enabled or not: Units bool |
| ASSISTANCE TAKEOFF ENABLED_get | action_ASSISTANCE TAKEOFF ENABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether takeoff assistance has been enabled or not: Units bool |
| ATC AIRLINE | action_ATC AIRLINE | Set the simvar The name of the Airline used by ATC, as a string with a maximum length of 50 characters.: Units null |
| ATC AIRLINE_get | action_ATC AIRLINE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe name of the Airline used by ATC, as a string with a maximum length of 50 characters.: Units null |
| ATC AIRPORT IS TOWERED_get | action_ATC AIRPORT IS TOWERED_get | Request the value, will be returned in a 'name_(Single) 'triggerIf the airport is controlled, this boolean is true.: Units bool |
| ATC CLEARED IFR_get | action_ATC CLEARED IFR_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether or not the user has filed an IFR flightplan that has been cleared by the sim ATC: Units bool |
| ATC CLEARED LANDING_get | action_ATC CLEARED LANDING_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the ATC has cleared the plane for landing.: Units bool |
| ATC CLEARED TAKEOFF_get | action_ATC CLEARED TAKEOFF_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the ATC has cleared the plane for takeoff.: Units bool |
| ATC CLEARED TAXI_get | action_ATC CLEARED TAXI_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the ATC has cleared the plane for taxi.: Units bool |
| ATC CURRENT WAYPOINT ALTITUDE_get | action_ATC CURRENT WAYPOINT ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the target altitude for the current ATC flightplan waypoint.: Units bool |
| ATC FLIGHT NUMBER | action_ATC FLIGHT NUMBER | Set the simvar Flight Number used by ATC, as a string with a maximum number of 6 characters.: Units null |
| ATC FLIGHT NUMBER_get | action_ATC FLIGHT NUMBER_get | Request the value, will be returned in a 'name_(Single) 'triggerFlight Number used by ATC, as a string with a maximum number of 6 characters.: Units null |
| ATC FLIGHTPLAN DIFF ALT_get | action_ATC FLIGHTPLAN DIFF ALT_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude between the position of the aircraft and his closest waypoints in the flightplan.: Units meters |
| ATC FLIGHTPLAN DIFF DISTANCE_get | action_ATC FLIGHTPLAN DIFF DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the lateral distance the user's plane is from the ATC flight plan track.: Units meters |
| ATC FLIGHTPLAN DIFF HEADING_get | action_ATC FLIGHTPLAN DIFF HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerHeading between the position of the aircraft and his closest waypoints in the flightplan.: Units degrees |
| ATC HEAVY | action_ATC HEAVY | Set the simvar Is this aircraft recognized by ATC as heavy.: Units bool |
| ATC HEAVY_get | action_ATC HEAVY_get | Request the value, will be returned in a 'name_(Single) 'triggerIs this aircraft recognized by ATC as heavy.: Units bool |
| ATC ID | action_ATC ID | Set the simvar ID used by ATC, as a string with a maximum number of 10 characters.: Units null |
| ATC ID_get | action_ATC ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID used by ATC, as a string with a maximum number of 10 characters.: Units null |
| ATC IFR FP TO REQUEST_get | action_ATC IFR FP TO REQUEST_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the user has a valid IFR flight plan they can as for clearance for with ATC at the airport they are currently at.: Units bool |
| ATC MODEL_get | action_ATC MODEL_get | Request the value, will be returned in a 'name_(Single) 'triggerModel used by ATC, as a string with a maximum number of 10 characters.: Units null |
| ATC ON PARKING SPOT_get | action_ATC ON PARKING SPOT_get | Request the value, will be returned in a 'name_(Single) 'triggerIs ATC aircraft on parking spot.: Units bool |
| ATC PREVIOUS WAYPOINT ALTITUDE_get | action_ATC PREVIOUS WAYPOINT ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the target altitude for the previous ATC flightplan waypoint.: Units meters |
| ATC RUNWAY AIRPORT NAME_get | action_ATC RUNWAY AIRPORT NAME_get | Request the value, will be returned in a 'name_(Single) 'triggerThe name of the airport of the runway assigned by the ATC. Returns "" if no runway is assigned.: Units null |
| ATC RUNWAY DISTANCE_get | action_ATC RUNWAY DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the distance between the player's plane and the center of the runway selected by the ATC.: Units meters |
| ATC RUNWAY END DISTANCE_get | action_ATC RUNWAY END DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a float corresponding to the horizontal distance between the player's plane and the end of the runway selected by the ATC.: Units meters |
| ATC RUNWAY HEADING DEGREES TRUE_get | action_ATC RUNWAY HEADING DEGREES TRUE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the true heading of the runway selected by the ATC.: Units degrees |
| ATC RUNWAY LENGTH_get | action_ATC RUNWAY LENGTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe length of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters |
| ATC RUNWAY RELATIVE POSITION X_get | action_ATC RUNWAY RELATIVE POSITION X_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a float corresponding to the player's main gear relative X (transverse) position on the runway selected by the ATC.: Units meters |
| ATC RUNWAY RELATIVE POSITION Y_get | action_ATC RUNWAY RELATIVE POSITION Y_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a float corresponding to the player's main gear relative Y (height) position on the runway selected by the ATC.: Units meters |
| ATC RUNWAY RELATIVE POSITION Z_get | action_ATC RUNWAY RELATIVE POSITION Z_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a float corresponding to the player's main gear relative Z (longitudinal) position on the runway selected by the ATC.: Units meters |
| ATC RUNWAY SELECTED_get | action_ATC RUNWAY SELECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a boolean corresponding to whether or not the ATC has pre-selected a runway for the player's plane. If this is false, every other ATC RUNWAY * SimVar will return default values.: Units bool |
| ATC RUNWAY START DISTANCE_get | action_ATC RUNWAY START DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is a float corresponding to the horizontal distance between the player's plane and the start of the runway selected by the ATC.: Units meters |
| ATC RUNWAY TDPOINT RELATIVE POSITION X_get | action_ATC RUNWAY TDPOINT RELATIVE POSITION X_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the player's main gear relative X (transverse) position according to the aiming point of the runway selected by the ATC.: Units meters |
| ATC RUNWAY TDPOINT RELATIVE POSITION Y_get | action_ATC RUNWAY TDPOINT RELATIVE POSITION Y_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the player's main gear relative Y (height) position according to the aiming point of the runway selected by the ATC.: Units meters |
| ATC RUNWAY TDPOINT RELATIVE POSITION Z_get | action_ATC RUNWAY TDPOINT RELATIVE POSITION Z_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the player's main relative Z (longitudinal) position according to the aiming point of the runway selected by the ATC.: Units meters |
| ATC RUNWAY WIDTH_get | action_ATC RUNWAY WIDTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe width of the runway assigned by the ATC. Returns -1 if no runway is assigned.: Units meters |
| ATC SUGGESTED MIN RWY LANDING_get | action_ATC SUGGESTED MIN RWY LANDING_get | Request the value, will be returned in a 'name_(Single) 'triggerSuggested minimum runway length for landing. Used by ATC.: Units feet |
| ATC SUGGESTED MIN RWY TAKEOFF_get | action_ATC SUGGESTED MIN RWY TAKEOFF_get | Request the value, will be returned in a 'name_(Single) 'triggerSuggested minimum runway length for takeoff. Used by ATC.: Units feet |
| ATC TAXIPATH DISTANCE_get | action_ATC TAXIPATH DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the lateral distance the user's plane is from the path of the currently issued ATC taxi instructions.: Units meters |
| ATC TYPE_get | action_ATC TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerType used by ATC.: Units null |
| ATTITUDE BARS POSITION_get | action_ATTITUDE BARS POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerAI reference pitch reference bars: Units percent Over 100 |
| ATTITUDE CAGE_get | action_ATTITUDE CAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerAI caged state: Units bool |
| ATTITUDE INDICATOR BANK DEGREES_get | action_ATTITUDE INDICATOR BANK DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerAI bank indication: Units radians |
| ATTITUDE INDICATOR PITCH DEGREES_get | action_ATTITUDE INDICATOR PITCH DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerAI pitch indication: Units radians |
| AUDIO PANEL AVAILABLE_get | action_AUDIO PANEL AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the audio panel is available.: Units bool |
| AUDIO PANEL VOLUME_get | action_AUDIO PANEL VOLUME_get | Request the value, will be returned in a 'name_(Single) 'triggerThe Volume of the Audio Panel.: Units percent |
| AUTO BRAKE SWITCH CB_get | action_AUTO BRAKE SWITCH CB_get | Request the value, will be returned in a 'name_(Single) 'triggerAuto brake switch position: Units number |
| AUTO COORDINATION | action_AUTO COORDINATION | Set the simvar Is auto-coordination active.: Units bool |
| AUTO COORDINATION_get | action_AUTO COORDINATION_get | Request the value, will be returned in a 'name_(Single) 'triggerIs auto-coordination active.: Units bool |
| AUTOBRAKES ACTIVE_get | action_AUTOBRAKES ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the AutoBrakes are currently active: Units bool |
| AUTOPILOT AIRSPEED ACQUISITION_get | action_AUTOPILOT AIRSPEED ACQUISITION_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units bool |
| AUTOPILOT AIRSPEED HOLD_get | action_AUTOPILOT AIRSPEED HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerreturns whether airspeed hold is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT AIRSPEED HOLD CURRENT_get | action_AUTOPILOT AIRSPEED HOLD CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units bool |
| AUTOPILOT AIRSPEED HOLD VAR_get | action_AUTOPILOT AIRSPEED HOLD VAR_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the target holding airspeed for the autopilot: Units knots |
| AUTOPILOT AIRSPEED MAX CALCULATED_get | action_AUTOPILOT AIRSPEED MAX CALCULATED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the maximum calculated airspeed (kcas) limit set for the autopilot: Units knots |
| AUTOPILOT AIRSPEED MIN CALCULATED_get | action_AUTOPILOT AIRSPEED MIN CALCULATED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the minimum calculated airspeed (kcas) limit set for the autopilot: Units knots |
| AUTOPILOT ALT RADIO MODE_get | action_AUTOPILOT ALT RADIO MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerIf enabled the Autopilot will use the Radio Altitude rather than the Indicated Altitude: Units bool |
| AUTOPILOT ALTITUDE ARM_get | action_AUTOPILOT ALTITUDE ARM_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot is in Altitude Arm mode (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT ALTITUDE LOCK_get | action_AUTOPILOT ALTITUDE LOCK_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude hold active: Units bool |
| AUTOPILOT ALTITUDE LOCK VAR | action_AUTOPILOT ALTITUDE LOCK VAR | Set the simvar Set or get the slot index which the altitude hold mode will track when captured. See alt_mode_slot_index for more information: Units feet |
| AUTOPILOT ALTITUDE LOCK VAR_get | action_AUTOPILOT ALTITUDE LOCK VAR_get | Request the value, will be returned in a 'name_(Single) 'triggerSet or get the slot index which the altitude hold mode will track when captured. See alt_mode_slot_index for more information: Units feet |
| AUTOPILOT ALTITUDE MANUALLY TUNABLE_get | action_AUTOPILOT ALTITUDE MANUALLY TUNABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the autopilot altitude is manually tunable or not: Units bool |
| AUTOPILOT ALTITUDE SLOT INDEX_get | action_AUTOPILOT ALTITUDE SLOT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of the slot that the autopilot will use for the altitude reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number |
| AUTOPILOT APPROACH ACTIVE_get | action_AUTOPILOT APPROACH ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen true, the autopilot is currently flying the approach Flight Plan (the last legs): Units bool |
| AUTOPILOT APPROACH ARM_get | action_AUTOPILOT APPROACH ARM_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when the autopilot is active on the approach, once it reaches the adequate condition (in most cases, once it reaches the second-last waypoint of the flightplan): Units bool |
| AUTOPILOT APPROACH CAPTURED_get | action_AUTOPILOT APPROACH CAPTURED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when the lateral NAV mode is engaged and the angular deviation with the current tuned navigation frequency is less than 5°: Units bool |
| AUTOPILOT APPROACH HOLD_get | action_AUTOPILOT APPROACH HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether pproach mode is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT APPROACH IS LOCALIZER_get | action_AUTOPILOT APPROACH IS LOCALIZER_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the current approach is using a localizer: Units bool |
| AUTOPILOT ATTITUDE HOLD_get | action_AUTOPILOT ATTITUDE HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerAttitude hold active: Units bool |
| AUTOPILOT AVAILABLE_get | action_AUTOPILOT AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAvailable flag: Units bool |
| AUTOPILOT AVIONICS MANAGED_get | action_AUTOPILOT AVIONICS MANAGED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot has active managed avionics (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT BACKCOURSE HOLD_get | action_AUTOPILOT BACKCOURSE HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot back course mode is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT BANK HOLD_get | action_AUTOPILOT BANK HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot bank hold mode is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT BANK HOLD REF | action_AUTOPILOT BANK HOLD REF | Set the simvar The current bank-hold bank reference. Note that if you set this, the next frame the value will be overwritten by the engine, so you may need to write to this every game frame to ensure it maintains the required value: Units degrees |
| AUTOPILOT BANK HOLD REF_get | action_AUTOPILOT BANK HOLD REF_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current bank-hold bank reference. Note that if you set this, the next frame the value will be overwritten by the engine, so you may need to write to this every game frame to ensure it maintains the required value: Units degrees |
| AUTOPILOT CRUISE SPEED HOLD_get | action_AUTOPILOT CRUISE SPEED HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units bool |
| AUTOPILOT DEFAULT PITCH MODE_get | action_AUTOPILOT DEFAULT PITCH MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current default pitch mode of the autopilot as configured in the plane configuration with the parameter default_pitch_mode: Units enum |
| AUTOPILOT DEFAULT ROLL MODE_get | action_AUTOPILOT DEFAULT ROLL MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current default roll mode of the autopilot as configured in the plane configuration with the parameter default_bank_mode: Units enum |
| AUTOPILOT DISENGAGED_get | action_AUTOPILOT DISENGAGED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot has been disengaged (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT FLIGHT DIRECTOR ACTIVE_get | action_AUTOPILOT FLIGHT DIRECTOR ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerFlight director active: Units bool |
| AUTOPILOT FLIGHT DIRECTOR BANK_get | action_AUTOPILOT FLIGHT DIRECTOR BANK_get | Request the value, will be returned in a 'name_(Single) 'triggerReference bank angle: Units radians |
| AUTOPILOT FLIGHT DIRECTOR BANK EX1_get | action_AUTOPILOT FLIGHT DIRECTOR BANK EX1_get | Request the value, will be returned in a 'name_(Single) 'triggerRaw reference bank angle: Units radians |
| AUTOPILOT FLIGHT DIRECTOR PITCH_get | action_AUTOPILOT FLIGHT DIRECTOR PITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerReference pitch angle: Units radians |
| AUTOPILOT FLIGHT DIRECTOR PITCH EX1_get | action_AUTOPILOT FLIGHT DIRECTOR PITCH EX1_get | Request the value, will be returned in a 'name_(Single) 'triggerRaw reference pitch angle: Units radians |
| AUTOPILOT FLIGHT LEVEL CHANGE | action_AUTOPILOT FLIGHT LEVEL CHANGE | Set the simvar Boolean, toggles the autopilot Flight Level Change mode: Units bool |
| AUTOPILOT FLIGHT LEVEL CHANGE_get | action_AUTOPILOT FLIGHT LEVEL CHANGE_get | Request the value, will be returned in a 'name_(Single) 'triggerBoolean, toggles the autopilot Flight Level Change mode: Units bool |
| AUTOPILOT GLIDESLOPE ACTIVE_get | action_AUTOPILOT GLIDESLOPE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen true, the autopilot is receiving a signal from the runway beacon and is following the slope to reach the ground: Units bool |
| AUTOPILOT GLIDESLOPE ARM_get | action_AUTOPILOT GLIDESLOPE ARM_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when the autopilot is active on the glide slope: Units bool |
| AUTOPILOT GLIDESLOPE HOLD_get | action_AUTOPILOT GLIDESLOPE HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot glidslope hold is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT HEADING LOCK_get | action_AUTOPILOT HEADING LOCK_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot heading lock is enabled (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT HEADING LOCK DIR | action_AUTOPILOT HEADING LOCK DIR | Set the simvar Specifies / Returns the locked in heading for the autopilot: Units degrees |
| AUTOPILOT HEADING LOCK DIR_get | action_AUTOPILOT HEADING LOCK DIR_get | Request the value, will be returned in a 'name_(Single) 'triggerSpecifies / Returns the locked in heading for the autopilot: Units degrees |
| AUTOPILOT HEADING MANUALLY TUNABLE | action_AUTOPILOT HEADING MANUALLY TUNABLE | Set the simvar Whether or not the autopilot heading is manually tunable or not: Units bool |
| AUTOPILOT HEADING MANUALLY TUNABLE_get | action_AUTOPILOT HEADING MANUALLY TUNABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the autopilot heading is manually tunable or not: Units bool |
| AUTOPILOT HEADING SLOT INDEX_get | action_AUTOPILOT HEADING SLOT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of the slot that the autopilot will use for the heading reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number |
| AUTOPILOT MACH HOLD_get | action_AUTOPILOT MACH HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerMach hold active: Units bool |
| AUTOPILOT MACH HOLD VAR_get | action_AUTOPILOT MACH HOLD VAR_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the target holding mach airspeed for the autopilot: Units number |
| AUTOPILOT MANAGED INDEX_get | action_AUTOPILOT MANAGED INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units number |
| AUTOPILOT MANAGED SPEED IN MACH_get | action_AUTOPILOT MANAGED SPEED IN MACH_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the managed speed is in mach (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT MANAGED THROTTLE ACTIVE_get | action_AUTOPILOT MANAGED THROTTLE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot managed throttle is active (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT MASTER_get | action_AUTOPILOT MASTER_get | Request the value, will be returned in a 'name_(Single) 'triggerOn/off flag: Units bool |
| AUTOPILOT MAX BANK_get | action_AUTOPILOT MAX BANK_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the maximum banking angle for the autopilot, in radians.: Units radians |
| AUTOPILOT MAX BANK ID_get | action_AUTOPILOT MAX BANK ID_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the index of the current maximum bank setting of the autopilot: Units number |
| AUTOPILOT MAX SPEED HOLD_get | action_AUTOPILOT MAX SPEED HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units bool |
| AUTOPILOT NAV SELECTED_get | action_AUTOPILOT NAV SELECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of Nav radio selected: Units number |
| AUTOPILOT NAV1 LOCK_get | action_AUTOPILOT NAV1 LOCK_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns TRUE (1) if the autopilot Nav1 lock is applied, or 0 (FALSE) otherwise: Units bool |
| AUTOPILOT PITCH HOLD_get | action_AUTOPILOT PITCH HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerSet to True if the autopilot pitch hold has is engaged: Units bool |
| AUTOPILOT PITCH HOLD REF_get | action_AUTOPILOT PITCH HOLD REF_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the current autotpilot reference pitch.: Units radians |
| AUTOPILOT RPM HOLD_get | action_AUTOPILOT RPM HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if autopilot rpm hold applied: Units bool |
| AUTOPILOT RPM HOLD VAR_get | action_AUTOPILOT RPM HOLD VAR_get | Request the value, will be returned in a 'name_(Single) 'triggerSelected rpm: Units number |
| AUTOPILOT RPM SLOT INDEX_get | action_AUTOPILOT RPM SLOT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of the slot that the autopilot will use for the RPM reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number |
| AUTOPILOT SPEED SETTING_get | action_AUTOPILOT SPEED SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used within the simulation: Units knots |
| AUTOPILOT SPEED SLOT INDEX_get | action_AUTOPILOT SPEED SLOT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of the managed references: Units number |
| AUTOPILOT TAKEOFF POWER ACTIVE_get | action_AUTOPILOT TAKEOFF POWER ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTakeoff / Go Around power mode active: Units bool |
| AUTOPILOT THROTTLE ARM_get | action_AUTOPILOT THROTTLE ARM_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the autopilot auto-throttle is armed (1, TRUE) or not (0, FALSE): Units bool |
| AUTOPILOT THROTTLE MAX THRUST | action_AUTOPILOT THROTTLE MAX THRUST | Set the simvar This can be used to set/get the thrust lever position for autopilot maximum thrust: Units percent |
| AUTOPILOT THROTTLE MAX THRUST_get | action_AUTOPILOT THROTTLE MAX THRUST_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to set/get the thrust lever position for autopilot maximum thrust: Units percent |
| AUTOPILOT VERTICAL HOLD_get | action_AUTOPILOT VERTICAL HOLD_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if autopilot vertical hold applied: Units bool |
| AUTOPILOT VERTICAL HOLD VAR | action_AUTOPILOT VERTICAL HOLD VAR | Set the simvar Selected vertical speed: Units feet |
| AUTOPILOT VERTICAL HOLD VAR_get | action_AUTOPILOT VERTICAL HOLD VAR_get | Request the value, will be returned in a 'name_(Single) 'triggerSelected vertical speed: Units feet |
| AUTOPILOT VS SLOT INDEX_get | action_AUTOPILOT VS SLOT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of the slot that the autopilot will use for the VS reference. Note that there are 3 slots (1, 2, 3) that you can set/get normally, however you can also target slot index 0. Writing to slot 0 will overwrite all other slots with the slot 0 value, and by default the autopilot will follow slot 0 if you have not selected any slot index: Units number |
| AUTOPILOT WING LEVELER_get | action_AUTOPILOT WING LEVELER_get | Request the value, will be returned in a 'name_(Single) 'triggerWing leveler active: Units bool |
| AUTOPILOT YAW DAMPER_get | action_AUTOPILOT YAW DAMPER_get | Request the value, will be returned in a 'name_(Single) 'triggerYaw damper active: Units bool |
| AUTOTHROTTLE ACTIVE_get | action_AUTOTHROTTLE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerAuto-throttle active.: Units bool |
| AUX WHEEL ROTATION ANGLE_get | action_AUX WHEEL ROTATION ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAux wheel rotation angle (rotation around the axis for the wheel): Units radians |
| AUX WHEEL RPM_get | action_AUX WHEEL RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerRpm of fourth set of gear wheels: Units RPM |
| AVIONICS MASTER SWITCH:index_get | action_AVIONICS MASTER SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe avionics master switch position, true if the switch is ON. Use an avionics circuit index when referencing.: Units bool |
| BAGGAGELOADER ANGLE CURRENT_get | action_BAGGAGELOADER ANGLE CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent angle of the baggage loader ramp, relative to the ground.: Units degrees |
| BAGGAGELOADER ANGLE TARGET_get | action_BAGGAGELOADER ANGLE TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerTarget angle of the baggage loader ramp, relative to the ground.: Units degrees |
| BAGGAGELOADER END RAMP Y_get | action_BAGGAGELOADER END RAMP Y_get | Request the value, will be returned in a 'name_(Single) 'trigger"Y" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters |
| BAGGAGELOADER END RAMP Z_get | action_BAGGAGELOADER END RAMP Z_get | Request the value, will be returned in a 'name_(Single) 'trigger"Z" axis position of the end of the baggage loader ramp, relative to the ground.: Units meters |
| BAGGAGELOADER PIVOT Y_get | action_BAGGAGELOADER PIVOT Y_get | Request the value, will be returned in a 'name_(Single) 'trigger"Y" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters |
| BAGGAGELOADER PIVOT Z_get | action_BAGGAGELOADER PIVOT Z_get | Request the value, will be returned in a 'name_(Single) 'trigger"Z" axis position of the baggage loader ramp pivot, relative to the ground.: Units meters |
| BARBER POLE MACH_get | action_BARBER POLE MACH_get | Request the value, will be returned in a 'name_(Single) 'triggerMach associated with maximum airspeed.: Units mach |
| BAROMETER PRESSURE_get | action_BAROMETER PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerBarometric pressure.: Units Millibars |
| BATTERY BREAKER PULLED | action_BATTERY BREAKER PULLED | Set the simvar This will be true if the battery breaker is pulled. Requires a BUS LOOKUP INDEX and a battery index: Units bool |
| BATTERY BREAKER PULLED_get | action_BATTERY BREAKER PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the battery breaker is pulled. Requires a BUS LOOKUP INDEX and a battery index: Units bool |
| BATTERY CONNECTION ON_get | action_BATTERY CONNECTION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the battery is connected. Requires a BUS_LOOKUP_INDEX and a battery index: Units bool |
| BETA DOT_get | action_BETA DOT_get | Request the value, will be returned in a 'name_(Single) 'triggerBeta dot: Units radians per second |
| BLAST SHIELD POSITION:index_get | action_BLAST SHIELD POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerIndexed from 1, 100 is fully deployed, 0 flat on deck: Units percent Over 100 |
| BLEED AIR APU_get | action_BLEED AIR APU_get | Request the value, will be returned in a 'name_(Single) 'triggerBoolean, returns whether or not the APU attempts to provide Bleed Air: Units bool |
| BLEED AIR ENGINE:index_get | action_BLEED AIR ENGINE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether or not the indexed engine attempts to provide bleed air: Units bool |
| BLEED AIR SOURCE CONTROL:index_get | action_BLEED AIR SOURCE CONTROL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe bleed air system source controller for an indexed engine: Units enum |
| BOARDINGRAMP ELEVATION CURRENT_get | action_BOARDINGRAMP ELEVATION CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current altitude AGL of the top of the boarding ramp stairs.: Units meters |
| BOARDINGRAMP ELEVATION TARGET_get | action_BOARDINGRAMP ELEVATION TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target altitude AGL of the top of the boarding ramp stairs.: Units meters |
| BOARDINGRAMP END POSITION Y_get | action_BOARDINGRAMP END POSITION Y_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Y" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters |
| BOARDINGRAMP END POSITION Z_get | action_BOARDINGRAMP END POSITION Z_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the top of the boarding ramp stairs when extended at maximal capacity, relative to the ground.: Units meters |
| BOARDINGRAMP ORIENTATION CURRENT_get | action_BOARDINGRAMP ORIENTATION CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current orientation of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100 |
| BOARDINGRAMP ORIENTATION TARGET_get | action_BOARDINGRAMP ORIENTATION TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target orientation of of the boarding ramp stairs, where 0 is at rest and 1 is suited for boarding.: Units percent Over 100 |
| BOARDINGRAMP START POSITION Y_get | action_BOARDINGRAMP START POSITION Y_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Y" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters |
| BOARDINGRAMP START POSITION Z_get | action_BOARDINGRAMP START POSITION Z_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the top of the boarding ramp stairs when at minimal extension, relative to the ground.: Units meters |
| BRAKE DEPENDENT HYDRAULIC PRESSURE_get | action_BRAKE DEPENDENT HYDRAULIC PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerBrake dependent hydraulic pressure reading: Units pounds |
| BRAKE INDICATOR_get | action_BRAKE INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerBrake on indication: Units position |
| BRAKE LEFT POSITION | action_BRAKE LEFT POSITION | Set the simvar Percent left brake: Units position |
| BRAKE LEFT POSITION_get | action_BRAKE LEFT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left brake: Units position |
| BRAKE LEFT POSITION EX1 | action_BRAKE LEFT POSITION EX1 | Set the simvar Percent left brake, ignoring the effect of the parking brake: Units position |
| BRAKE LEFT POSITION EX1_get | action_BRAKE LEFT POSITION EX1_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left brake, ignoring the effect of the parking brake: Units position |
| BRAKE PARKING INDICATOR_get | action_BRAKE PARKING INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerParking brake indicator: Units bool |
| BRAKE PARKING POSITION_get | action_BRAKE PARKING POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerGets the parking brake position - either on (true) or off (false): Units bool |
| BRAKE RIGHT POSITION | action_BRAKE RIGHT POSITION | Set the simvar Percent right brake: Units position |
| BRAKE RIGHT POSITION_get | action_BRAKE RIGHT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right brake: Units position |
| BRAKE RIGHT POSITION EX1 | action_BRAKE RIGHT POSITION EX1 | Set the simvar Percent right brake, ignoring the effect of the parking brake: Units position |
| BRAKE RIGHT POSITION EX1_get | action_BRAKE RIGHT POSITION EX1_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right brake, ignoring the effect of the parking brake: Units position |
| BREAKER ADF | action_BREAKER ADF | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER ADF_get | action_BREAKER ADF_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER ALTFLD | action_BREAKER ALTFLD | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER ALTFLD_get | action_BREAKER ALTFLD_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AUTOPILOT | action_BREAKER AUTOPILOT | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AUTOPILOT_get | action_BREAKER AUTOPILOT_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNBUS1 | action_BREAKER AVNBUS1 | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNBUS1_get | action_BREAKER AVNBUS1_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNBUS2 | action_BREAKER AVNBUS2 | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNBUS2_get | action_BREAKER AVNBUS2_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNFAN | action_BREAKER AVNFAN | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER AVNFAN_get | action_BREAKER AVNFAN_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER FLAP | action_BREAKER FLAP | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER FLAP_get | action_BREAKER FLAP_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER GPS | action_BREAKER GPS | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER GPS_get | action_BREAKER GPS_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER INST | action_BREAKER INST | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER INST_get | action_BREAKER INST_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER INSTLTS | action_BREAKER INSTLTS | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER INSTLTS_get | action_BREAKER INSTLTS_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM1 | action_BREAKER NAVCOM1 | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM1_get | action_BREAKER NAVCOM1_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM2 | action_BREAKER NAVCOM2 | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM2_get | action_BREAKER NAVCOM2_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM3 | action_BREAKER NAVCOM3 | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER NAVCOM3_get | action_BREAKER NAVCOM3_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER TURNCOORD | action_BREAKER TURNCOORD | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER TURNCOORD_get | action_BREAKER TURNCOORD_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER WARN | action_BREAKER WARN | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER WARN_get | action_BREAKER WARN_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER XPNDR | action_BREAKER XPNDR | Set the simvar Can be used to get or set the breaker state for the electrical system: Units bool |
| BREAKER XPNDR_get | action_BREAKER XPNDR_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the breaker state for the electrical system: Units bool |
| BUS BREAKER PULLED | action_BUS BREAKER PULLED | Set the simvar This will be true if the bus breaker is pulled. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool |
| BUS BREAKER PULLED_get | action_BUS BREAKER PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the bus breaker is pulled. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool |
| BUS CONNECTION ON_get | action_BUS CONNECTION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the bus is connected. Requires a BUS_LOOKUP_INDEX and a bus index: Units bool |
| CABIN NO SMOKING ALERT SWITCH_get | action_CABIN NO SMOKING ALERT SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the No Smoking switch is on.: Units bool |
| CABIN SEATBELTS ALERT SWITCH_get | action_CABIN SEATBELTS ALERT SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the Seatbelts switch is on.: Units bool |
| CABLE CAUGHT BY TAILHOOK:index_get | action_CABLE CAUGHT BY TAILHOOK:index_get | Request the value, will be returned in a 'name_(Single) 'triggerA number 1 through 4 for the cable number caught by the tailhook. Cable 1 is the one closest to the stern of the carrier. A value of 0 indicates no cable was caught: Units number |
| CAMERA ACTION COCKPIT VIEW RESET | action_CAMERA ACTION COCKPIT VIEW RESET | Set the simvar This can be used to reset the cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). Essentially the same as the user pressing the default reset keys CTRL + Space.: Units bool |
| CAMERA ACTION COCKPIT VIEW RESET_get | action_CAMERA ACTION COCKPIT VIEW RESET_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to reset the cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). Essentially the same as the user pressing the default reset keys CTRL + Space.: Units bool |
| CAMERA ACTION COCKPIT VIEW SAVE:index | action_CAMERA ACTION COCKPIT VIEW SAVE:index | Set the simvar This can be used to save a cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). The index value given is the save "slot" that will be used, from 0 to 9. Essentially this is the same as the user pressing the default save keys CTRL + Alt + 0-9.: Units bool |
| CAMERA ACTION COCKPIT VIEW SAVE:index_get | action_CAMERA ACTION COCKPIT VIEW SAVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to save a cockpit camera when the CAMERA_STATE is set to 2 (Cockpit). The index value given is the save "slot" that will be used, from 0 to 9. Essentially this is the same as the user pressing the default save keys CTRL + Alt + 0-9.: Units bool |
| CAMERA GAMEPLAY PITCH YAW:index_get | action_CAMERA GAMEPLAY PITCH YAW:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns either the pitch (index 0) or the yaw (index 1) of the current gameplay camera.: Units radians |
| CAMERA REQUEST ACTION | action_CAMERA REQUEST ACTION | Set the simvar This can be used to have the currently active camera perform a predefined action. Currently only 1 action is supported, but more may be added over time.: Units enum |
| CAMERA REQUEST ACTION_get | action_CAMERA REQUEST ACTION_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to have the currently active camera perform a predefined action. Currently only 1 action is supported, but more may be added over time.: Units enum |
| CAMERA STATE | action_CAMERA STATE | Set the simvar This can be used to get or set the camera "state", which will be one of the listed enum values.: Units enum |
| CAMERA STATE_get | action_CAMERA STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to get or set the camera "state", which will be one of the listed enum values.: Units enum |
| CAMERA SUBSTATE | action_CAMERA SUBSTATE | Set the simvar This variable can be used to get or set the camera "sub-state". The options here are generally only required when working with the in-sim panel UI. Note that the "locked" and "unlocked" state will be changed automatically if the following SimVars have their values changed: COCKPIT_CAMERA_HEADLOOK, CHASE_CAMERA_HEADLOOK.: Units enum |
| CAMERA SUBSTATE_get | action_CAMERA SUBSTATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis variable can be used to get or set the camera "sub-state". The options here are generally only required when working with the in-sim panel UI. Note that the "locked" and "unlocked" state will be changed automatically if the following SimVars have their values changed: COCKPIT_CAMERA_HEADLOOK, CHASE_CAMERA_HEADLOOK.: Units enum |
| CAMERA VIEW TYPE AND INDEX MAX:index | action_CAMERA VIEW TYPE AND INDEX MAX:index | Set the simvar This variable can get the number of option indices related to a specific camera view type. The index value supplied to the SimVar should be one of the camera view type Enum values (see CAMERA VIEW TYPE AND INDEX), and the SimVar will return the number of options available for that camera type (counting from 1, so - for example - if the camera view type is "Quickview" and has 8 quickview settings, then CAMERA VIEW TYPE AND INDEX MAX:4 will return 8). Note that this value can be set after a flight has started, but it will have no effect since the number of camera options is initilaised once only and not updated (and the simulation may overwrite the value again even after setting it).: Units number |
| CAMERA VIEW TYPE AND INDEX MAX:index_get | action_CAMERA VIEW TYPE AND INDEX MAX:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis variable can get the number of option indices related to a specific camera view type. The index value supplied to the SimVar should be one of the camera view type Enum values (see CAMERA VIEW TYPE AND INDEX), and the SimVar will return the number of options available for that camera type (counting from 1, so - for example - if the camera view type is "Quickview" and has 8 quickview settings, then CAMERA VIEW TYPE AND INDEX MAX:4 will return 8). Note that this value can be set after a flight has started, but it will have no effect since the number of camera options is initilaised once only and not updated (and the simulation may overwrite the value again even after setting it).: Units number |
| CAMERA VIEW TYPE AND INDEX:index | action_CAMERA VIEW TYPE AND INDEX:index | Set the simvar With this you can get or set both the type of view for the current camera, as well as the option index, which will be between 0 and the maximum index value (as retrieved using the CAMERA VIEW TYPE AND INDEX MAX SimVar). Supplying an index of 0 to the SimVar will get/set the type (from the selection of enum values listed), and using an index of 1 will get/set the option index, which is an integer value.: Units enum |
| CAMERA VIEW TYPE AND INDEX:index_get | action_CAMERA VIEW TYPE AND INDEX:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWith this you can get or set both the type of view for the current camera, as well as the option index, which will be between 0 and the maximum index value (as retrieved using the CAMERA VIEW TYPE AND INDEX MAX SimVar). Supplying an index of 0 to the SimVar will get/set the type (from the selection of enum values listed), and using an index of 1 will get/set the option index, which is an integer value.: Units enum |
| CANOPY OPEN | action_CANOPY OPEN | Set the simvar Percent primary door/exit open.: Units percent Over 100 |
| CANOPY OPEN_get | action_CANOPY OPEN_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent primary door/exit open.: Units percent Over 100 |
| CARB HEAT AVAILABLE_get | action_CARB HEAT AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if carburetor heat available.: Units bool |
| CATAPULT STROKE POSITION:index_get | action_CATAPULT STROKE POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCatapults are indexed from 1. This value will be 0 before the catapult fires, and then up to 100 as the aircraft is propelled down the catapult. The aircraft may takeoff before the value reaches 100 (depending on the aircraft weight, power applied, and other factors), in which case this value will not be further updated. This value could be used to drive a bogie animation: Units number |
| CATEGORY_get | action_CATEGORY_get | Request the value, will be returned in a 'name_(Single) 'triggerType of aircraft: Units null |
| CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z_get | action_CATERINGTRUCK AIRCRAFT DOOR CONTACT OFFSET Z_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the point of contact between the catering truck and the bottom of the aircraft door, relative to the ground.: Units meters |
| CATERINGTRUCK ELEVATION CURRENT_get | action_CATERINGTRUCK ELEVATION CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current altitude AGL of the bottom of the catering truck container.: Units meters |
| CATERINGTRUCK ELEVATION TARGET_get | action_CATERINGTRUCK ELEVATION TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target altitude AGL of the bottom of the catering truck container.: Units meters |
| CATERINGTRUCK OPENING CURRENT_get | action_CATERINGTRUCK OPENING CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current state of the catering truck when opening the container and deploying the bridge, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100 |
| CATERINGTRUCK OPENING TARGET_get | action_CATERINGTRUCK OPENING TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target state of the catering truck the container is opene and the bridge deployed, where 0 is fully closed and 1 is fully opened and deployed.: Units percent Over 100 |
| CENTER WHEEL ROTATION ANGLE_get | action_CENTER WHEEL ROTATION ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerCenter wheel rotation angle (rotation around the axis for the wheel): Units radians |
| CENTER WHEEL RPM_get | action_CENTER WHEEL RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerCenter landing gear rpm: Units RPM |
| CG AFT LIMIT_get | action_CG AFT LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerMost backward authorized position of the CG according to the POH.: Units percent Over 100 |
| CG FEET_get | action_CG FEET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe longitudinal CG position relative to the Reference Datum Position.: Units feet |
| CG FEET AFT LIMIT_get | action_CG FEET AFT LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe aft CG limit position relative to the Reference Datum Position.: Units feet |
| CG FEET FWD LIMIT_get | action_CG FEET FWD LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe forward CG limit position relative to the Reference Datum Position.: Units feet |
| CG FEET LATERAL_get | action_CG FEET LATERAL_get | Request the value, will be returned in a 'name_(Single) 'triggerThe lateral CG position relative to the Reference Datum Position.: Units feet |
| CG FEET LATERAL LEFT LIMIT_get | action_CG FEET LATERAL LEFT LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe left hand lateral CG position relative to the Reference Datum Position.: Units feet |
| CG FEET LATERAL RIGHT LIMIT_get | action_CG FEET LATERAL RIGHT LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe right hand lateral CG position relative to the Reference Datum Position.: Units feet |
| CG FWD LIMIT_get | action_CG FWD LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerMost forward authorized position of the CG according to the POH.: Units percent Over 100 |
| CG MAX MACH_get | action_CG MAX MACH_get | Request the value, will be returned in a 'name_(Single) 'triggerDeprecated, do not use!: Units mach |
| CG MIN MACH_get | action_CG MIN MACH_get | Request the value, will be returned in a 'name_(Single) 'triggerDeprecated, do not use!: Units mach |
| CG PERCENT_get | action_CG PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitudinal CG position as a percent of reference chord: Units percent Over 100 |
| CG PERCENT LATERAL_get | action_CG PERCENT LATERAL_get | Request the value, will be returned in a 'name_(Single) 'triggerLateral CG position as a percent of reference chord: Units percent Over 100 |
| CHASE CAMERA HEADLOOK | action_CHASE CAMERA HEADLOOK | Set the simvar This is used to get/set the look state of the chase (external) camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 3 (External/Chase).: Units enum |
| CHASE CAMERA HEADLOOK_get | action_CHASE CAMERA HEADLOOK_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is used to get/set the look state of the chase (external) camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 3 (External/Chase).: Units enum |
| CHASE CAMERA MOMENTUM | action_CHASE CAMERA MOMENTUM | Set the simvar Sets/gets the momentum modifier of the chase (external) camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent |
| CHASE CAMERA MOMENTUM_get | action_CHASE CAMERA MOMENTUM_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the momentum modifier of the chase (external) camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent |
| CHASE CAMERA SPEED | action_CHASE CAMERA SPEED | Set the simvar Sets/gets the translation speed modifier of the chase (external) camara, as a percentage. Default is 50%.: Units percent |
| CHASE CAMERA SPEED_get | action_CHASE CAMERA SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the translation speed modifier of the chase (external) camara, as a percentage. Default is 50%.: Units percent |
| CHASE CAMERA ZOOM | action_CHASE CAMERA ZOOM | Set the simvar Sets/gets the zoom/FOV modifier for the chase (external) camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent |
| CHASE CAMERA ZOOM_get | action_CHASE CAMERA ZOOM_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the zoom/FOV modifier for the chase (external) camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent |
| CHASE CAMERA ZOOM SPEED | action_CHASE CAMERA ZOOM SPEED | Set the simvar Sets/gets the speed modifier for when the zoom/FOV chase (external) camera changes zoom/FOV levels. Default is 50%.: Units percent |
| CHASE CAMERA ZOOM SPEED_get | action_CHASE CAMERA ZOOM SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the speed modifier for when the zoom/FOV chase (external) camera changes zoom/FOV levels. Default is 50%.: Units percent |
| CIRCUIT AUTO BRAKES ON_get | action_CIRCUIT AUTO BRAKES ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to this circuit: Units bool |
| CIRCUIT AUTO FEATHER ON_get | action_CIRCUIT AUTO FEATHER ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to this circuit: Units bool |
| CIRCUIT AUTOPILOT ON_get | action_CIRCUIT AUTOPILOT ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to this circuit: Units bool |
| CIRCUIT AVIONICS ON_get | action_CIRCUIT AVIONICS ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to this circuit: Units bool |
| CIRCUIT BREAKER PULLED | action_CIRCUIT BREAKER PULLED | Set the simvar This will be true if the circuit breaker is pulled. Requires a BUS_LOOKUP_INDEX and a circuit index.: Units bool |
| CIRCUIT BREAKER PULLED_get | action_CIRCUIT BREAKER PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the circuit breaker is pulled. Requires a BUS_LOOKUP_INDEX and a circuit index.: Units bool |
| CIRCUIT CONNECTION ON_get | action_CIRCUIT CONNECTION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the circuit is connected. Requires a BUS_LOOKUP_INDEX and a circuit index: Units bool |
| CIRCUIT FLAP MOTOR ON_get | action_CIRCUIT FLAP MOTOR ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the flap motor circuit: Units bool |
| CIRCUIT GEAR MOTOR ON_get | action_CIRCUIT GEAR MOTOR ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the gear motor circuit: Units bool |
| CIRCUIT GEAR WARNING ON_get | action_CIRCUIT GEAR WARNING ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to gear warning circuit: Units bool |
| CIRCUIT GENERAL PANEL ON_get | action_CIRCUIT GENERAL PANEL ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the general panel circuit: Units bool |
| CIRCUIT HYDRAULIC PUMP ON_get | action_CIRCUIT HYDRAULIC PUMP ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the hydraulic pump circuit: Units bool |
| CIRCUIT MARKER BEACON ON_get | action_CIRCUIT MARKER BEACON ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the marker beacon circuit: Units bool |
| CIRCUIT NAVCOM1 ON_get | action_CIRCUIT NAVCOM1 ON_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not power is available to the NAVCOM1 circuit.: Units bool |
| CIRCUIT NAVCOM2 ON_get | action_CIRCUIT NAVCOM2 ON_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not power is available to the NAVCOM2 circuit.: Units bool |
| CIRCUIT NAVCOM3 ON_get | action_CIRCUIT NAVCOM3 ON_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not power is available to the NAVCOM3 circuit.: Units bool |
| CIRCUIT ON_get | action_CIRCUIT ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the given circuit is functioning. Use a circuit index when referencing.: Units bool |
| CIRCUIT PITOT HEAT ON_get | action_CIRCUIT PITOT HEAT ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the pitot heat circuit: Units bool |
| CIRCUIT POWER SETTING_get | action_CIRCUIT POWER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns the percentage of use that the circuit is getting. This requires a circuit index when referencing: Units percent |
| CIRCUIT PROP SYNC ON_get | action_CIRCUIT PROP SYNC ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the propeller sync circuit: Units bool |
| CIRCUIT STANDBY VACUUM ON_get | action_CIRCUIT STANDBY VACUUM ON_get | Request the value, will be returned in a 'name_(Single) 'triggerIs electrical power available to the vacuum circuit: Units bool |
| CIRCUIT SWITCH ON_get | action_CIRCUIT SWITCH ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThe circuit switch position, true if the switch is ON. Use a circuit index when referencing.: Units bool |
| COCKPIT CAMERA HEADLOOK | action_COCKPIT CAMERA HEADLOOK | Set the simvar This is used to get/set the look state of the cockpit camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 2 (Cockpit).: Units enum |
| COCKPIT CAMERA HEADLOOK_get | action_COCKPIT CAMERA HEADLOOK_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is used to get/set the look state of the cockpit camera. Note that this value will also affect the CAMERA_SUBSTATE value, when the CAMERA_STATE is set to 2 (Cockpit).: Units enum |
| COCKPIT CAMERA HEIGHT | action_COCKPIT CAMERA HEIGHT | Set the simvar This can be used to get/set the cockpit camera height modifier expressed as a percentage. Default is 50%.: Units percent |
| COCKPIT CAMERA HEIGHT_get | action_COCKPIT CAMERA HEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to get/set the cockpit camera height modifier expressed as a percentage. Default is 50%.: Units percent |
| COCKPIT CAMERA INSTRUMENT AUTOSELECT | action_COCKPIT CAMERA INSTRUMENT AUTOSELECT | Set the simvar This can be used to get or set the autoselect option for the cockpit camera when viewing the instruments (ie: the CAMERA_SUBSTATE is 5). When enabled the camera will move automatically if the player mouse reaches the edge of the screen and there are instrument panels available on that side.: Units bool |
| COCKPIT CAMERA INSTRUMENT AUTOSELECT_get | action_COCKPIT CAMERA INSTRUMENT AUTOSELECT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to get or set the autoselect option for the cockpit camera when viewing the instruments (ie: the CAMERA_SUBSTATE is 5). When enabled the camera will move automatically if the player mouse reaches the edge of the screen and there are instrument panels available on that side.: Units bool |
| COCKPIT CAMERA MOMENTUM | action_COCKPIT CAMERA MOMENTUM | Set the simvar Sets/gets the momentum modifier of the cockpit camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent |
| COCKPIT CAMERA MOMENTUM_get | action_COCKPIT CAMERA MOMENTUM_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the momentum modifier of the cockpit camera, which is controls how fast/slow the camera will stop moving when no longer being moved by the user. Default is 50%.: Units percent |
| COCKPIT CAMERA SPEED | action_COCKPIT CAMERA SPEED | Set the simvar Sets/gets the translation speed modifier of the cockpit camara, as a percentage. Default is 50%.: Units percent |
| COCKPIT CAMERA SPEED_get | action_COCKPIT CAMERA SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the translation speed modifier of the cockpit camara, as a percentage. Default is 50%.: Units percent |
| COCKPIT CAMERA UPPER POSITION | action_COCKPIT CAMERA UPPER POSITION | Set the simvar Sets/gets the current "upper position" cockpit camera toggle. When 1 (TRUE), the camera is is in the upper position, and when 0 (FALSE) it is in the default position.: Units bool |
| COCKPIT CAMERA UPPER POSITION_get | action_COCKPIT CAMERA UPPER POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the current "upper position" cockpit camera toggle. When 1 (TRUE), the camera is is in the upper position, and when 0 (FALSE) it is in the default position.: Units bool |
| COCKPIT CAMERA ZOOM | action_COCKPIT CAMERA ZOOM | Set the simvar Sets/gets the zoom/FOV modifier for the cockpit camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent |
| COCKPIT CAMERA ZOOM_get | action_COCKPIT CAMERA ZOOM_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the zoom/FOV modifier for the cockpit camera. Note that when setting this value, it will affect the camera regardless of whether the GAMEPLAY_CAMERA_FOCUS is set to manual or automatic. Default is 50%.: Units percent |
| COCKPIT CAMERA ZOOM SPEED | action_COCKPIT CAMERA ZOOM SPEED | Set the simvar Sets/gets the speed modifier for when the zoom/FOV cockpit camera changes zoom/FOV levels. Default is 50%.: Units percent |
| COCKPIT CAMERA ZOOM SPEED_get | action_COCKPIT CAMERA ZOOM SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the speed modifier for when the zoom/FOV cockpit camera changes zoom/FOV levels. Default is 50%.: Units percent |
| COLLECTIVE POSITION_get | action_COLLECTIVE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe position of the helicopter's collective. 0 is fully up, 100 fully depressed.: Units percent Over 100 |
| COM ACTIVE BEARING:index_get | action_COM ACTIVE BEARING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerGives the bearing (in degrees) of the active COM station (airport) or a value less than 0 if the station does not belong to an airport. Index is 1, 2 or 3.: Units degrees |
| COM ACTIVE DISTANCE:index_get | action_COM ACTIVE DISTANCE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerGives the distance (in meters) to the active COM station (airport) or a value less than -180° if the station does not belong to an airport. Index is 1, 2 or 3.: Units meters |
| COM ACTIVE FREQ IDENT:index_get | action_COM ACTIVE FREQ IDENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe identity of the station that is tuned on the indexed active COM radio. Index is 1, 2, or 3.: Units null |
| COM ACTIVE FREQ TYPE:index_get | action_COM ACTIVE FREQ TYPE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe type of COM frequency for the active indexed COM system. Index is 1, 2, or 3.: Units null |
| COM ACTIVE FREQUENCY:index_get | action_COM ACTIVE FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCom frequency. Index is 1, 2 or 3.: Units Frequency BCD16 |
| COM AVAILABLE:index_get | action_COM AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if COM1, COM2 or COM3 is available (depending on the index, either 1, 2, or 3): Units bool |
| COM RECEIVE ALL_get | action_COM RECEIVE ALL_get | Request the value, will be returned in a 'name_(Single) 'triggerToggles all COM radios to receive on: Units bool |
| COM RECEIVE EX1:index_get | action_COM RECEIVE EX1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the plane is receiving on the indexed com channel. Index is 1, 2 or 3.: Units bool |
| COM RECEIVE:index_get | action_COM RECEIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the plane is receiving on the indexed com channel or not (either 1, 2, or 3 for the index).: Units bool |
| COM SPACING MODE:index_get | action_COM SPACING MODE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe COM radio frequency step. Index is 1, 2 or 3.: Units enum |
| COM STANDBY FREQ IDENT:index_get | action_COM STANDBY FREQ IDENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe identity of the station that is tuned on the indexed standby COM radio. Index is 1, 2, or 3.: Units null |
| COM STANDBY FREQ TYPE:index_get | action_COM STANDBY FREQ TYPE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe type of COM frequency for the standby indexed COM system. Index is 1, 2, or 3.: Units null |
| COM STANDBY FREQUENCY:index_get | action_COM STANDBY FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCom standby frequency. Index is 1, 2 or 3.: Units Frequency BCD16 |
| COM STATUS:index_get | action_COM STATUS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRadio status flag for the indexed com channel. Index is 1, 2 or 3.: Units enum |
| COM TEST:index_get | action_COM TEST:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEnter an index of 1, 2 or 3. Will return TRUE if the COM system is working, FALSE otherwise.: Units bool |
| COM TRANSMIT:index_get | action_COM TRANSMIT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAudio panel com transmit state. Index of 1, 2 or 3.: Units bool |
| COM VOLUME_get | action_COM VOLUME_get | Request the value, will be returned in a 'name_(Single) 'triggerThe volume of the COM Radio.: Units percent |
| COM1 STORED FREQUENCY_get | action_COM1 STORED FREQUENCY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe stored COM 1/2/3 frequency value.: Units Frequency BCD16 |
| COM2 STORED FREQUENCY_get | action_COM2 STORED FREQUENCY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe stored COM 1/2/3 frequency value.: Units Frequency BCD16 |
| COM3 STORED FREQUENCY_get | action_COM3 STORED FREQUENCY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe stored COM 1/2/3 frequency value.: Units Frequency BCD16 |
| CONTACT POINT COMPRESSION:index_get | action_CONTACT POINT COMPRESSION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe percentage value representing the amount the contact point is compressed.: Units percent |
| CONTACT POINT IS ON GROUND:index_get | action_CONTACT POINT IS ON GROUND:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the indexed contact point is on the ground, or will return false otherwise.: Units bool |
| CONTACT POINT IS SKIDDING:index_get | action_CONTACT POINT IS SKIDDING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the indexed contact point is skidding, or will return false otherwise.: Units bool |
| CONTACT POINT POSITION:index_get | action_CONTACT POINT POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe currently extended position of the (retractable) contact point, expressed as a percentage.: Units position |
| CONTACT POINT SKIDDING FACTOR:index_get | action_CONTACT POINT SKIDDING FACTOR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe skidding factor associated with the indexed contact point, from 0 to 1.: Units percent Over 100 |
| CONTACT POINT WATER DEPTH:index_get | action_CONTACT POINT WATER DEPTH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns the depth of the water for the indexed contact point.: Units feet |
| CONTRAILS CONDITIONS MET_get | action_CONTRAILS CONDITIONS MET_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the aircraft has met the conditions required to spawn the contrail VFX: Units bool |
| COPILOT TRANSMITTER TYPE_get | action_COPILOT TRANSMITTER TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerOn which channel the copilot is transmitting.: Units enum |
| COPILOT TRANSMITTING_get | action_COPILOT TRANSMITTING_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the copilot is transmitting: Units bool |
| CRASH FLAG_get | action_CRASH FLAG_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag value that indicates the cause of a crash.: Units enum |
| CRASH SEQUENCE_get | action_CRASH SEQUENCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe state of the crash event sequence.: Units enum |
| DECISION ALTITUDE MSL_get | action_DECISION ALTITUDE MSL_get | Request the value, will be returned in a 'name_(Single) 'triggerDesign decision altitude above mean sea level: Units feet |
| DECISION HEIGHT_get | action_DECISION HEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerDesign decision height: Units feet |
| DELEGATE CONTROLS TO AI | action_DELEGATE CONTROLS TO AI | Set the simvar Returns whether the AI control system is active or not: Units bool |
| DELEGATE CONTROLS TO AI_get | action_DELEGATE CONTROLS TO AI_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the AI control system is active or not: Units bool |
| DELTA HEADING RATE | action_DELTA HEADING RATE | Set the simvar Rate of turn of heading indicator.: Units radians per second |
| DELTA HEADING RATE_get | action_DELTA HEADING RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerRate of turn of heading indicator.: Units radians per second |
| DESIGN CRUISE ALT_get | action_DESIGN CRUISE ALT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the optimal altitude the aircraft should maintain when in cruise. It is derived from the cruise_alt setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet |
| DESIGN SPAWN ALTITUDE CRUISE_get | action_DESIGN SPAWN ALTITUDE CRUISE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the spawn altitude for the aircraft when spawning in cruise. It is derived from the spawn_cruise_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 1500ft.: Units feet |
| DESIGN SPAWN ALTITUDE DESCENT_get | action_DESIGN SPAWN ALTITUDE DESCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the spawn altitude for the aircraft when spawning in descent. It is derived from the spawn_descent_altitude setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default is 500ft.: Units feet |
| DESIGN SPEED CLIMB_get | action_DESIGN SPEED CLIMB_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the optimal climb speed for the aircraft. It is derived from the climb_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet |
| DESIGN SPEED MIN ROTATION_get | action_DESIGN SPEED MIN ROTATION_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the minimum speed required for aircraft rotation. It is derived from the rotation_speed_min setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is -1.: Units feet |
| DESIGN SPEED VC_get | action_DESIGN SPEED VC_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the aircraft ideal cruising speed. It is derived from the cruise_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. The default value is computed an internal function that uses the estimated cruise altitude and estimated cruise percent power, according of the engine type, the number of engines, the density, the wing area and some drag parameters. Normally this value is set in the CFG file and the default value is never used.: Units feet |
| DESIGN SPEED VS0_get | action_DESIGN SPEED VS0_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the the stall speed when flaps are fully extended. It is derived from the full_flaps_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.8 x VS.: Units knots |
| DESIGN SPEED VS1_get | action_DESIGN SPEED VS1_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the stall speed when flaps are fully retracted. It is derived from the flaps_up_stall_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg. Default value is 0.: Units knots |
| DESIGN TAKEOFF SPEED_get | action_DESIGN TAKEOFF SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis design constant represents the aircraft ideal takoff speed. It is derived from the takeoff_speed setting in the [REFERENCE SPEEDS] section of the flightmodel.cfg.: Units knots |
| DISK BANK ANGLE:index_get | action_DISK BANK ANGLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor bank angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians |
| DISK BANK PCT:index_get | action_DISK BANK PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor bank percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100 |
| DISK CONING PCT:index_get | action_DISK CONING PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor coning percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100 |
| DISK PITCH ANGLE:index_get | action_DISK PITCH ANGLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor pitch angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians |
| DISK PITCH PCT:index_get | action_DISK PITCH PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor pitch percent of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100 |
| DME SOUND_get | action_DME SOUND_get | Request the value, will be returned in a 'name_(Single) 'triggerDME audio flag.: Units bool |
| DRONE CAMERA FOCUS | action_DRONE CAMERA FOCUS | Set the simvar Sets/gets the focus modifier for the drone camera. Default is 50%, and a lower value will set the drone focus to things in the foreground and a higher level will set the drone focus to things in the background. Note that this is only taken into account when the DRONE_CAMERA_FOCUS_MODE is set to 3 (manual).: Units percent |
| DRONE CAMERA FOCUS_get | action_DRONE CAMERA FOCUS_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the focus modifier for the drone camera. Default is 50%, and a lower value will set the drone focus to things in the foreground and a higher level will set the drone focus to things in the background. Note that this is only taken into account when the DRONE_CAMERA_FOCUS_MODE is set to 3 (manual).: Units percent |
| DRONE CAMERA FOCUS MODE | action_DRONE CAMERA FOCUS MODE | Set the simvar Sets/gets the current drone focus mode. When set to 3 (manual), the focus position will be based on the DRONE_CAMERA_FOCUS value.: Units enum |
| DRONE CAMERA FOCUS MODE_get | action_DRONE CAMERA FOCUS MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the current drone focus mode. When set to 3 (manual), the focus position will be based on the DRONE_CAMERA_FOCUS value.: Units enum |
| DRONE CAMERA FOLLOW | action_DRONE CAMERA FOLLOW | Set the simvar Sets/gets the whether the drone camera is in follow mode or not.: Units bool |
| DRONE CAMERA FOLLOW_get | action_DRONE CAMERA FOLLOW_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the whether the drone camera is in follow mode or not.: Units bool |
| DRONE CAMERA FOV | action_DRONE CAMERA FOV | Set the simvar Sets/gets the zoom/FOV modifier for the drone camera. Default is 50%.: Units percent |
| DRONE CAMERA FOV_get | action_DRONE CAMERA FOV_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the zoom/FOV modifier for the drone camera. Default is 50%.: Units percent |
| DRONE CAMERA LOCKED | action_DRONE CAMERA LOCKED | Set the simvar Sets/gets the whether the drone camera is locked or not.: Units bool |
| DRONE CAMERA LOCKED_get | action_DRONE CAMERA LOCKED_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the whether the drone camera is locked or not.: Units bool |
| DRONE CAMERA SPEED ROTATION | action_DRONE CAMERA SPEED ROTATION | Set the simvar Sets/gets the rotation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent |
| DRONE CAMERA SPEED ROTATION_get | action_DRONE CAMERA SPEED ROTATION_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the rotation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent |
| DRONE CAMERA SPEED TRAVELLING | action_DRONE CAMERA SPEED TRAVELLING | Set the simvar Sets/gets the translation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent |
| DRONE CAMERA SPEED TRAVELLING_get | action_DRONE CAMERA SPEED TRAVELLING_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the translation speed modifier of the drone camara, as a percentage. Default is 50%.: Units percent |
| DROPPABLE OBJECTS COUNT:index_get | action_DROPPABLE OBJECTS COUNT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of droppable objects at the station number identified by the index.: Units number |
| DROPPABLE OBJECTS TYPE:index | action_DROPPABLE OBJECTS TYPE:index | Set the simvar The type of droppable object at the station number identified by the index.: Units null |
| DROPPABLE OBJECTS TYPE:index_get | action_DROPPABLE OBJECTS TYPE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe type of droppable object at the station number identified by the index.: Units null |
| DROPPABLE OBJECTS UI NAME:index_get | action_DROPPABLE OBJECTS UI NAME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDescriptive name, used in User Interface dialogs, of a droppable object, identified by index.: Units null |
| DYNAMIC PRESSURE_get | action_DYNAMIC PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerDynamic pressure: Units pounds |
| ELECTRICAL AVIONICS BUS AMPS | action_ELECTRICAL AVIONICS BUS AMPS | Set the simvar Avionics bus current: Units amperes |
| ELECTRICAL AVIONICS BUS AMPS_get | action_ELECTRICAL AVIONICS BUS AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerAvionics bus current: Units amperes |
| ELECTRICAL AVIONICS BUS VOLTAGE | action_ELECTRICAL AVIONICS BUS VOLTAGE | Set the simvar Avionics bus voltage: Units volts |
| ELECTRICAL AVIONICS BUS VOLTAGE_get | action_ELECTRICAL AVIONICS BUS VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerAvionics bus voltage: Units volts |
| ELECTRICAL BATTERY BUS AMPS | action_ELECTRICAL BATTERY BUS AMPS | Set the simvar Battery bus current: Units amperes |
| ELECTRICAL BATTERY BUS AMPS_get | action_ELECTRICAL BATTERY BUS AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerBattery bus current: Units amperes |
| ELECTRICAL BATTERY BUS VOLTAGE | action_ELECTRICAL BATTERY BUS VOLTAGE | Set the simvar Battery bus voltage: Units volts |
| ELECTRICAL BATTERY BUS VOLTAGE_get | action_ELECTRICAL BATTERY BUS VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerBattery bus voltage: Units volts |
| ELECTRICAL BATTERY ESTIMATED CAPACITY PCT_get | action_ELECTRICAL BATTERY ESTIMATED CAPACITY PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerBattery capacity over max capacity, 100 is full: Units percent |
| ELECTRICAL BATTERY LOAD | action_ELECTRICAL BATTERY LOAD | Set the simvar The load handled by the battery (negative values mean the battery is receiving current). Use a battery index when referencing: Units amperes |
| ELECTRICAL BATTERY LOAD_get | action_ELECTRICAL BATTERY LOAD_get | Request the value, will be returned in a 'name_(Single) 'triggerThe load handled by the battery (negative values mean the battery is receiving current). Use a battery index when referencing: Units amperes |
| ELECTRICAL BATTERY VOLTAGE | action_ELECTRICAL BATTERY VOLTAGE | Set the simvar The battery voltage. Use a battery index when referencing: Units volts |
| ELECTRICAL BATTERY VOLTAGE_get | action_ELECTRICAL BATTERY VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe battery voltage. Use a battery index when referencing: Units volts |
| ELECTRICAL GENALT BUS AMPS | action_ELECTRICAL GENALT BUS AMPS | Set the simvar The load handled by the alternator. This requires an alternator index when referencing: Units amperes |
| ELECTRICAL GENALT BUS AMPS_get | action_ELECTRICAL GENALT BUS AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerThe load handled by the alternator. This requires an alternator index when referencing: Units amperes |
| ELECTRICAL GENALT BUS VOLTAGE | action_ELECTRICAL GENALT BUS VOLTAGE | Set the simvar General alternator voltage. This requires an alternator index when referencing: Units volts |
| ELECTRICAL GENALT BUS VOLTAGE_get | action_ELECTRICAL GENALT BUS VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerGeneral alternator voltage. This requires an alternator index when referencing: Units volts |
| ELECTRICAL GENALT LOAD_get | action_ELECTRICAL GENALT LOAD_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns the percentage of the load output that is being consumed. This requires an alternator index when referencing: Units percent |
| ELECTRICAL HOT BATTERY BUS AMPS | action_ELECTRICAL HOT BATTERY BUS AMPS | Set the simvar Current available when battery switch is turned off: Units amperes |
| ELECTRICAL HOT BATTERY BUS AMPS_get | action_ELECTRICAL HOT BATTERY BUS AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent available when battery switch is turned off: Units amperes |
| ELECTRICAL HOT BATTERY BUS VOLTAGE | action_ELECTRICAL HOT BATTERY BUS VOLTAGE | Set the simvar Voltage available when battery switch is turned off: Units volts |
| ELECTRICAL HOT BATTERY BUS VOLTAGE_get | action_ELECTRICAL HOT BATTERY BUS VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerVoltage available when battery switch is turned off: Units volts |
| ELECTRICAL MAIN BUS AMPS | action_ELECTRICAL MAIN BUS AMPS | Set the simvar Main bus current: Units amperes |
| ELECTRICAL MAIN BUS AMPS_get | action_ELECTRICAL MAIN BUS AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerMain bus current: Units amperes |
| ELECTRICAL MAIN BUS VOLTAGE | action_ELECTRICAL MAIN BUS VOLTAGE | Set the simvar The main bus voltage. Use a bus index when referencing: Units volts |
| ELECTRICAL MAIN BUS VOLTAGE_get | action_ELECTRICAL MAIN BUS VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe main bus voltage. Use a bus index when referencing: Units volts |
| ELECTRICAL MASTER BATTERY | action_ELECTRICAL MASTER BATTERY | Set the simvar The battery switch position, true if the switch is ON. Use a battery index when referencing: Units bool |
| ELECTRICAL MASTER BATTERY_get | action_ELECTRICAL MASTER BATTERY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe battery switch position, true if the switch is ON. Use a battery index when referencing: Units bool |
| ELECTRICAL TOTAL LOAD AMPS | action_ELECTRICAL TOTAL LOAD AMPS | Set the simvar Total load amps: Units amperes |
| ELECTRICAL TOTAL LOAD AMPS_get | action_ELECTRICAL TOTAL LOAD AMPS_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal load amps: Units amperes |
| ELEVATOR DEFLECTION_get | action_ELEVATOR DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| ELEVATOR DEFLECTION PCT_get | action_ELEVATOR DEFLECTION PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent deflection: Units percent Over 100 |
| ELEVATOR POSITION | action_ELEVATOR POSITION | Set the simvar Percent elevator input deflection: Units position |
| ELEVATOR POSITION_get | action_ELEVATOR POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent elevator input deflection: Units position |
| ELEVATOR TRIM DISABLED_get | action_ELEVATOR TRIM DISABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Elevator Trim has been disabled: Units bool |
| ELEVATOR TRIM DOWN LIMIT_get | action_ELEVATOR TRIM DOWN LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the maximum elevator trim value. This corresponds to the elevator_trim_down_limit in the Flight Model Config file: Units degrees |
| ELEVATOR TRIM INDICATOR_get | action_ELEVATOR TRIM INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent elevator trim (for indication): Units position |
| ELEVATOR TRIM NEUTRAL_get | action_ELEVATOR TRIM NEUTRAL_get | Request the value, will be returned in a 'name_(Single) 'triggerElevator trim neutral: Units radians |
| ELEVATOR TRIM PCT_get | action_ELEVATOR TRIM PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent elevator trim: Units percent Over 100 |
| ELEVATOR TRIM POSITION | action_ELEVATOR TRIM POSITION | Set the simvar Elevator trim deflection: Units radians |
| ELEVATOR TRIM POSITION_get | action_ELEVATOR TRIM POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerElevator trim deflection: Units radians |
| ELEVATOR TRIM UP LIMIT_get | action_ELEVATOR TRIM UP LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the maximum elevator trim value. This corresponds to the elevator_trim_up_limit in the Flight Model Config file: Units degrees |
| ELEVON DEFLECTION_get | action_ELEVON DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerElevon deflection: Units radians |
| ELT ACTIVATED_get | action_ELT ACTIVATED_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Emergency Locator Transmitter is active.: Units bool |
| EMPTY WEIGHT_get | action_EMPTY WEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerEmpty weight of the aircraft: Units pounds |
| EMPTY WEIGHT CROSS COUPLED MOI_get | action_EMPTY WEIGHT CROSS COUPLED MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerEmpty weight cross coupled moment of inertia: Units slugs |
| EMPTY WEIGHT PITCH MOI_get | action_EMPTY WEIGHT PITCH MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerEmpty weight pitch moment of inertia: Units slugs |
| EMPTY WEIGHT ROLL MOI_get | action_EMPTY WEIGHT ROLL MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerEmpty weight roll moment of inertia: Units slugs |
| EMPTY WEIGHT YAW MOI_get | action_EMPTY WEIGHT YAW MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerEmpty weight yaw moment of inertia: Units slugs |
| ENG ANTI ICE:index_get | action_ENG ANTI ICE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAnti-ice switch for the indexed engine, true if enabled false otherwise: Units bool |
| ENG COMBUSTION:index_get | action_ENG COMBUSTION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the indexed engine is running, false otherwise: Units bool |
| ENG CYLINDER HEAD TEMPERATURE:index_get | action_ENG CYLINDER HEAD TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine cylinder head temperature: Units rankine |
| ENG EXHAUST GAS TEMPERATURE GES:index_get | action_ENG EXHAUST GAS TEMPERATURE GES:index_get | Request the value, will be returned in a 'name_(Single) 'triggerGoverned engine setting exhaust gas temperature for the indexed engine: Units percent Over 100 |
| ENG EXHAUST GAS TEMPERATURE:index_get | action_ENG EXHAUST GAS TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerExhaust gas temperature for the indexed engine: Units rankine |
| ENG FAILED:index_get | action_ENG FAILED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFailure flag for the indexed engine that has failed: Units bool |
| ENG FUEL FLOW BUG POSITION:index_get | action_ENG FUEL FLOW BUG POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel flow reference in pounds per hour for the indexed engine: Units pounds per hour |
| ENG FUEL FLOW GPH:index_get | action_ENG FUEL FLOW GPH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEngine fuel flow in gallons per hour for the indexed engine: Units gallons per hour |
| ENG FUEL FLOW PPH:index_get | action_ENG FUEL FLOW PPH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine fuel flow in pounds per hour: Units pounds per hour |
| ENG HYDRAULIC PRESSURE:index_get | action_ENG HYDRAULIC PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine hydraulic pressure: Units pounds |
| ENG HYDRAULIC QUANTITY:index_get | action_ENG HYDRAULIC QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed enginehydraulic fluid quantity, as a percentage of total capacity: Units percent Over 100 |
| ENG MANIFOLD PRESSURE:index_get | action_ENG MANIFOLD PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine manifold pressure: Units inches |
| ENG MAX RPM_get | action_ENG MAX RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine Maximum rpm: Units RPM |
| ENG N1 RPM:index_get | action_ENG N1 RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine N1 rpm: Units RPM |
| ENG N2 RPM:index_get | action_ENG N2 RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine N2 rpm: Units RPM |
| ENG OIL PRESSURE:index_get | action_ENG OIL PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine oil pressure: Units pounds |
| ENG OIL QUANTITY:index_get | action_ENG OIL QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine oil quantity as a percentage of full capacity: Units percent Over 100 |
| ENG OIL TEMPERATURE:index_get | action_ENG OIL TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine oil temperature: Units rankine |
| ENG ON FIRE:index | action_ENG ON FIRE:index | Set the simvar The indexed engine on fire state: Units bool |
| ENG ON FIRE:index_get | action_ENG ON FIRE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine on fire state: Units bool |
| ENG PRESSURE RATIO:index_get | action_ENG PRESSURE RATIO:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine pressure ratio: Units ratio |
| ENG RPM ANIMATION PERCENT:index_get | action_ENG RPM ANIMATION PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine percentage maximum rated rpm (used for visual animation): Units percent |
| ENG TORQUE:index_get | action_ENG TORQUE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine torque: Units foot pounds |
| ENG VIBRATION:index_get | action_ENG VIBRATION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine vibration: Units number |
| ENGINE CONTROL SELECT | action_ENGINE CONTROL SELECT | Set the simvar Selected engines (combination of bit flags): Units mask |
| ENGINE CONTROL SELECT_get | action_ENGINE CONTROL SELECT_get | Request the value, will be returned in a 'name_(Single) 'triggerSelected engines (combination of bit flags): Units mask |
| ENGINE PRIMER | action_ENGINE PRIMER | Set the simvar The engine primer position: Units position |
| ENGINE PRIMER_get | action_ENGINE PRIMER_get | Request the value, will be returned in a 'name_(Single) 'triggerThe engine primer position: Units position |
| ENGINE TYPE_get | action_ENGINE TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerEngine type: Units enum |
| ESTIMATED CRUISE SPEED_get | action_ESTIMATED CRUISE SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated cruise speed: Units feet |
| ESTIMATED FUEL FLOW:index_get | action_ESTIMATED FUEL FLOW:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated fuel flow to the indexed engine at cruise speed: Units pounds per hour |
| EXTERNAL POWER AVAILABLE_get | action_EXTERNAL POWER AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be true if the given external power source is available. Use an external power index when referencing: Units bool |
| EXTERNAL POWER BREAKER PULLED | action_EXTERNAL POWER BREAKER PULLED | Set the simvar Boolean, The state of the breaker of an external power source: Units bool |
| EXTERNAL POWER BREAKER PULLED_get | action_EXTERNAL POWER BREAKER PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerBoolean, The state of the breaker of an external power source: Units bool |
| EXTERNAL POWER CONNECTION ON_get | action_EXTERNAL POWER CONNECTION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerBoolean, The state of the connection between a bus and an external power source: Units bool |
| EXTERNAL POWER ON_get | action_EXTERNAL POWER ON_get | Request the value, will be returned in a 'name_(Single) 'triggerThe external power switch position, true if the switch is ON. Use an external power index when referencing: Units bool |
| EXTERNAL SYSTEM VALUE | action_EXTERNAL SYSTEM VALUE | Set the simvar Generic SimVar.: Units number |
| EXTERNAL SYSTEM VALUE_get | action_EXTERNAL SYSTEM VALUE_get | Request the value, will be returned in a 'name_(Single) 'triggerGeneric SimVar.: Units number |
| FIRE BOTTLE DISCHARGED_get | action_FIRE BOTTLE DISCHARGED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the fire bottle is discharged.: Units bool |
| FIRE BOTTLE SWITCH_get | action_FIRE BOTTLE SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the fire bottle switch is on.: Units bool |
| FLAP DAMAGE BY SPEED_get | action_FLAP DAMAGE BY SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if flaps are damaged by excessive speed: Units bool |
| FLAP POSITION SET | action_FLAP POSITION SET | Set the simvar Set the position of the flaps control: Units position |
| FLAP POSITION SET_get | action_FLAP POSITION SET_get | Request the value, will be returned in a 'name_(Single) 'triggerSet the position of the flaps control: Units position |
| FLAP SPEED EXCEEDED_get | action_FLAP SPEED EXCEEDED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if safe speed limit for flaps exceeded: Units bool |
| FLAPS AVAILABLE_get | action_FLAPS AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if flaps available: Units bool |
| FLAPS EFFECTIVE HANDLE INDEX:index_get | action_FLAPS EFFECTIVE HANDLE INDEX:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns the effective flaps handle index, after some of the conditions have potentially forced the state to change: Units number |
| FLAPS HANDLE INDEX:index | action_FLAPS HANDLE INDEX:index | Set the simvar Index of current flap position: Units number |
| FLAPS HANDLE INDEX:index_get | action_FLAPS HANDLE INDEX:index_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of current flap position: Units number |
| FLAPS HANDLE PERCENT_get | action_FLAPS HANDLE PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent flap handle extended: Units percent Over 100 |
| FLAPS NUM HANDLE POSITIONS_get | action_FLAPS NUM HANDLE POSITIONS_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of available flap positions: Units number |
| FLARM AVAILABLE | action_FLARM AVAILABLE | Set the simvar Whether the FLARM is available (TRUE, 1) or not (FALSE, 0).: Units bool |
| FLARM AVAILABLE_get | action_FLARM AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the FLARM is available (TRUE, 1) or not (FALSE, 0).: Units bool |
| FLARM THREAT BEARING_get | action_FLARM THREAT BEARING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe bearing of the FLARM threat aircraft, relative to track.: Units degrees |
| FLARM THREAT DISTANCE_get | action_FLARM THREAT DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe distance to the FLARM threat object.: Units meters |
| FLARM THREAT HEADING_get | action_FLARM THREAT HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe heading to the FLARM threat object.: Units degrees |
| FLARM THREAT RELATIVE ALTITUDE_get | action_FLARM THREAT RELATIVE ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe relative altitude of the threat object.: Units meters |
| FLARM THREAT TIME TO COLLISION_get | action_FLARM THREAT TIME TO COLLISION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe estimated time to a collision.: Units seconds |
| FLARM THREAT VERTICAL BEARING_get | action_FLARM THREAT VERTICAL BEARING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe vertical bearing towards the threat.: Units degrees |
| FLY ASSISTANT CANCEL DESTINATION | action_FLY ASSISTANT CANCEL DESTINATION | Set the simvar When set with any value this will cancel the current flight assistant destination: Units number |
| FLY ASSISTANT CANCEL DESTINATION_get | action_FLY ASSISTANT CANCEL DESTINATION_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen set with any value this will cancel the current flight assistant destination: Units number |
| FLY ASSISTANT CANCEL DESTINATION DISPLAY | action_FLY ASSISTANT CANCEL DESTINATION DISPLAY | Set the simvar When set with any value this will cancel the display of the current flight assistant destination: Units number |
| FLY ASSISTANT CANCEL DESTINATION DISPLAY_get | action_FLY ASSISTANT CANCEL DESTINATION DISPLAY_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen set with any value this will cancel the display of the current flight assistant destination: Units number |
| FLY ASSISTANT COM AI LOCKED_get | action_FLY ASSISTANT COM AI LOCKED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when the copilot AI control is active and therefore COM AI is locked on active too: Units bool |
| FLY ASSISTANT HAVE DESTINATION_get | action_FLY ASSISTANT HAVE DESTINATION_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when a destination has been set in the flight assistant: Units bool |
| FLY ASSISTANT LANDING SPEED_get | action_FLY ASSISTANT LANDING SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the POH range or an estimated value for this speed: Units null |
| FLY ASSISTANT LANDING SPEED DISPLAY MODE_get | action_FLY ASSISTANT LANDING SPEED DISPLAY MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the display mode of the speed, CSS side (only STALL SPEED is working and will turn red when below): Units null |
| FLY ASSISTANT NEAREST CATEGORY | action_FLY ASSISTANT NEAREST CATEGORY | Set the simvar Selected category: Units enum |
| FLY ASSISTANT NEAREST CATEGORY_get | action_FLY ASSISTANT NEAREST CATEGORY_get | Request the value, will be returned in a 'name_(Single) 'triggerSelected category: Units enum |
| FLY ASSISTANT NEAREST COUNT_get | action_FLY ASSISTANT NEAREST COUNT_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of elements in this category: Units number |
| FLY ASSISTANT NEAREST NAME_get | action_FLY ASSISTANT NEAREST NAME_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the name of the element at the specified index: Units null |
| FLY ASSISTANT NEAREST SELECTED | action_FLY ASSISTANT NEAREST SELECTED | Set the simvar Returns the index of the currently selected element: Units number |
| FLY ASSISTANT NEAREST SELECTED_get | action_FLY ASSISTANT NEAREST SELECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the index of the currently selected element: Units number |
| FLY ASSISTANT RIBBONS ACTIVE | action_FLY ASSISTANT RIBBONS ACTIVE | Set the simvar Returns true when both ribbon assistances are active (taxi and landing), and can also be used to set them: Units bool |
| FLY ASSISTANT RIBBONS ACTIVE_get | action_FLY ASSISTANT RIBBONS ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true when both ribbon assistances are active (taxi and landing), and can also be used to set them: Units bool |
| FLY ASSISTANT SET AS DESTINATION | action_FLY ASSISTANT SET AS DESTINATION | Set the simvar When set with any value, it will set the selected element as the current destination: Units number |
| FLY ASSISTANT SET AS DESTINATION_get | action_FLY ASSISTANT SET AS DESTINATION_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen set with any value, it will set the selected element as the current destination: Units number |
| FLY ASSISTANT STALL SPEED | action_FLY ASSISTANT STALL SPEED | Set the simvar Returns the flight assistant stall speed: Units knots |
| FLY ASSISTANT STALL SPEED_get | action_FLY ASSISTANT STALL SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the flight assistant stall speed: Units knots |
| FLY ASSISTANT STALL SPEED DISPLAY MODE_get | action_FLY ASSISTANT STALL SPEED DISPLAY MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the flight assistant stall speed display mode: Units null |
| FLY ASSISTANT TAKEOFF SPEED | action_FLY ASSISTANT TAKEOFF SPEED | Set the simvar Returns the flight assistant takeoff speed: Units knots |
| FLY ASSISTANT TAKEOFF SPEED_get | action_FLY ASSISTANT TAKEOFF SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the flight assistant takeoff speed: Units knots |
| FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE_get | action_FLY ASSISTANT TAKEOFF SPEED DISPLAY MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the flight assistant takeoff speed display mode: Units null |
| FLY ASSISTANT TAKEOFF SPEED ESTIMATED | action_FLY ASSISTANT TAKEOFF SPEED ESTIMATED | Set the simvar Can be set to override the estimated takeoff speed: Units knots |
| FLY ASSISTANT TAKEOFF SPEED ESTIMATED_get | action_FLY ASSISTANT TAKEOFF SPEED ESTIMATED_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be set to override the estimated takeoff speed: Units knots |
| FLY BY WIRE ALPHA PROTECTION_get | action_FLY BY WIRE ALPHA PROTECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the fly-by-wire alpha protection is enabled or false otherwise: Units bool |
| FLY BY WIRE ELAC FAILED_get | action_FLY BY WIRE ELAC FAILED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the Elevators and Ailerons computer has failed: Units bool |
| FLY BY WIRE ELAC SWITCH_get | action_FLY BY WIRE ELAC SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the fly by wire Elevators and Ailerons computer is on: Units bool |
| FLY BY WIRE FAC FAILED_get | action_FLY BY WIRE FAC FAILED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the Flight Augmentation computer has failed: Units bool |
| FLY BY WIRE FAC SWITCH_get | action_FLY BY WIRE FAC SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the fly by wire Flight Augmentation computer is on: Units bool |
| FLY BY WIRE SEC FAILED_get | action_FLY BY WIRE SEC FAILED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the Spoilers and Elevators computer has failed: Units bool |
| FLY BY WIRE SEC SWITCH_get | action_FLY BY WIRE SEC SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the fly by wire Spoilers and Elevators computer is on: Units bool |
| FOLDING WING HANDLE POSITION_get | action_FOLDING WING HANDLE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the folding wing handle is engaged: Units bool |
| FOLDING WING LEFT PERCENT_get | action_FOLDING WING LEFT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerLeft folding wing position, 1.0 is fully folded: Units percent Over 100 |
| FOLDING WING RIGHT PERCENT_get | action_FOLDING WING RIGHT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerRight folding wing position, 1.0 is fully folded: Units percent Over 100 |
| FUELTRUCK HOSE DEPLOYED_get | action_FUELTRUCK HOSE DEPLOYED_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current deployment amount of the fuel truck hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100 |
| FUELTRUCK HOSE END POSX_get | action_FUELTRUCK HOSE END POSX_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "X" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters |
| FUELTRUCK HOSE END POSZ_get | action_FUELTRUCK HOSE END POSZ_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the end of the fuel truck hose when fully deployed, relative to the ground.: Units meters |
| FUELTRUCK HOSE END RELATIVE HEADING_get | action_FUELTRUCK HOSE END RELATIVE HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe heading of the end of the fuel truck hose, relative to the vehicle heading.: Units degrees |
| FULL THROTTLE THRUST TO WEIGHT RATIO_get | action_FULL THROTTLE THRUST TO WEIGHT RATIO_get | Request the value, will be returned in a 'name_(Single) 'triggerFull throttle thrust to weight ratio: Units number |
| G FORCE | action_G FORCE | Set the simvar Current g force: Units gforce |
| G FORCE_get | action_G FORCE_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent g force: Units gforce |
| G LIMITER SETTING_get | action_G LIMITER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns the setting of the G-limiter, as set using the GLimiterSetting parameter: Units enum |
| GAMEPLAY CAMERA FOCUS | action_GAMEPLAY CAMERA FOCUS | Set the simvar This gets/sets the focus for the camera zoom, which can be either manual, or auto. The setting affects both the Cockpit and the External (Chase) cameras.: Units enum |
| GAMEPLAY CAMERA FOCUS_get | action_GAMEPLAY CAMERA FOCUS_get | Request the value, will be returned in a 'name_(Single) 'triggerThis gets/sets the focus for the camera zoom, which can be either manual, or auto. The setting affects both the Cockpit and the External (Chase) cameras.: Units enum |
| GEAR ANIMATION POSITION:index_get | action_GEAR ANIMATION POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent indexed gear animation extended: Units percent |
| GEAR AUX POSITION | action_GEAR AUX POSITION | Set the simvar Percent auxiliary gear extended: Units percent Over 100 |
| GEAR AUX POSITION_get | action_GEAR AUX POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent auxiliary gear extended: Units percent Over 100 |
| GEAR AUX STEER ANGLE_get | action_GEAR AUX STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAux wheel angle, negative to the left, positive to the right. The aux wheel is the fourth set of landing gear, sometimes used on helicopters: Units radians |
| GEAR AUX STEER ANGLE PCT_get | action_GEAR AUX STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerAux steer angle as a percentage: Units percent Over 100 |
| GEAR CENTER POSITION | action_GEAR CENTER POSITION | Set the simvar Percent center gear extended: Units percent Over 100 |
| GEAR CENTER POSITION_get | action_GEAR CENTER POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent center gear extended: Units percent Over 100 |
| GEAR CENTER STEER ANGLE_get | action_GEAR CENTER STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerCenter wheel angle, negative to the left, positive to the right: Units radians |
| GEAR CENTER STEER ANGLE PCT_get | action_GEAR CENTER STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerCenter steer angle as a percentage: Units percent Over 100 |
| GEAR DAMAGE BY SPEED_get | action_GEAR DAMAGE BY SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if gear has been damaged by excessive speed: Units bool |
| GEAR EMERGENCY HANDLE POSITION_get | action_GEAR EMERGENCY HANDLE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if gear emergency handle applied: Units bool |
| GEAR HANDLE POSITION | action_GEAR HANDLE POSITION | Set the simvar The gear handle position, where 0 means the handle is retracted and 1 is the handle fully applied: Units percent Over 100 |
| GEAR HANDLE POSITION_get | action_GEAR HANDLE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe gear handle position, where 0 means the handle is retracted and 1 is the handle fully applied: Units percent Over 100 |
| GEAR HYDRAULIC PRESSURE_get | action_GEAR HYDRAULIC PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerGear hydraulic pressure: Units pounds |
| GEAR IS ON GROUND:index_get | action_GEAR IS ON GROUND:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the gear is on the ground: Units bool |
| GEAR IS SKIDDING:index_get | action_GEAR IS SKIDDING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the gear is skidding: Units bool |
| GEAR LEFT POSITION | action_GEAR LEFT POSITION | Set the simvar Percent left gear extended: Units percent Over 100 |
| GEAR LEFT POSITION_get | action_GEAR LEFT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left gear extended: Units percent Over 100 |
| GEAR LEFT STEER ANGLE_get | action_GEAR LEFT STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerLeft wheel angle, negative to the left, positive to the right: Units radians |
| GEAR LEFT STEER ANGLE PCT_get | action_GEAR LEFT STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerLeft steer angle as a percentage: Units percent Over 100 |
| GEAR POSITION:index | action_GEAR POSITION:index | Set the simvar Position of landing gear: Units enum |
| GEAR POSITION:index_get | action_GEAR POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of landing gear: Units enum |
| GEAR RIGHT POSITION | action_GEAR RIGHT POSITION | Set the simvar Percent right gear extended: Units percent Over 100 |
| GEAR RIGHT POSITION_get | action_GEAR RIGHT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right gear extended: Units percent Over 100 |
| GEAR RIGHT STEER ANGLE_get | action_GEAR RIGHT STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerRight wheel angle, negative to the left, positive to the right: Units radians |
| GEAR RIGHT STEER ANGLE PCT_get | action_GEAR RIGHT STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerRight steer angle as a percentage: Units percent Over 100 |
| GEAR SPEED EXCEEDED_get | action_GEAR SPEED EXCEEDED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if safe speed limit for gear exceeded: Units bool |
| GEAR STEER ANGLE PCT:index_get | action_GEAR STEER ANGLE PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAlternative method of getting steer angle as a percentage: Units percent Over 100 |
| GEAR STEER ANGLE:index_get | action_GEAR STEER ANGLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAlternative method of getting the steer angle: Units radians |
| GEAR TOTAL PCT EXTENDED_get | action_GEAR TOTAL PCT EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent total gear extended: Units percent |
| GEAR WARNING:index_get | action_GEAR WARNING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerGear warnings: Units enum |
| GEAR WATER DEPTH_get | action_GEAR WATER DEPTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe depth of the gear in the water: Units centimeters |
| GENERAL ENG ANTI ICE POSITION:index_get | action_GENERAL ENG ANTI ICE POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine anti-ice switch state: Units bool |
| GENERAL ENG COMBUSTION EX1:index | action_GENERAL ENG COMBUSTION EX1:index | Set the simvar This SimVar is similar to GENERAL ENG COMBUSTION, in that it can also be used to enable or disable engine combustion. However this SimVar will not interfere with the current state of ths simulation. For example, if the aircraft has a turbine engine with auto_ignition enabled or it's a propeller engine with magnetos, then in the subsequent simulation frames this SimVar may be set to 1 (TRUE) again as the engine restarts automatically: Units bool |
| GENERAL ENG COMBUSTION EX1:index_get | action_GENERAL ENG COMBUSTION EX1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis SimVar is similar to GENERAL ENG COMBUSTION, in that it can also be used to enable or disable engine combustion. However this SimVar will not interfere with the current state of ths simulation. For example, if the aircraft has a turbine engine with auto_ignition enabled or it's a propeller engine with magnetos, then in the subsequent simulation frames this SimVar may be set to 1 (TRUE) again as the engine restarts automatically: Units bool |
| GENERAL ENG COMBUSTION SOUND PERCENT:index_get | action_GENERAL ENG COMBUSTION SOUND PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of maximum sound being created by the indexed engine: Units percent |
| GENERAL ENG COMBUSTION:index | action_GENERAL ENG COMBUSTION:index | Set the simvar Set the indexed engine combustion flag to TRUE or FALSE. Note that this will not only stop all combustion, but it will also set the engine RPM to 0, regardless of the actual state of the simulation: Units bool |
| GENERAL ENG COMBUSTION:index_get | action_GENERAL ENG COMBUSTION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerSet the indexed engine combustion flag to TRUE or FALSE. Note that this will not only stop all combustion, but it will also set the engine RPM to 0, regardless of the actual state of the simulation: Units bool |
| GENERAL ENG DAMAGE PERCENT:index_get | action_GENERAL ENG DAMAGE PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of total damage to the indexed engine: Units percent |
| GENERAL ENG ELAPSED TIME:index_get | action_GENERAL ENG ELAPSED TIME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal elapsed time since the indexed engine was started: Units hours |
| GENERAL ENG EXHAUST GAS TEMPERATURE:index | action_GENERAL ENG EXHAUST GAS TEMPERATURE:index | Set the simvar The indexed engine exhaust gas temperature: Units rankine |
| GENERAL ENG EXHAUST GAS TEMPERATURE:index_get | action_GENERAL ENG EXHAUST GAS TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine exhaust gas temperature: Units rankine |
| GENERAL ENG FAILED:index_get | action_GENERAL ENG FAILED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine fail flag: Units bool |
| GENERAL ENG FIRE DETECTED:index_get | action_GENERAL ENG FIRE DETECTED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDetects if a fire has been detected in an indexed engine or not. If 0 (FALSE) no fire has been detected and if 1 (TRUE) then it has: Units bool |
| GENERAL ENG FUEL PRESSURE:index | action_GENERAL ENG FUEL PRESSURE:index | Set the simvar The indexed engine fuel pressure: Units pounds |
| GENERAL ENG FUEL PRESSURE:index_get | action_GENERAL ENG FUEL PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine fuel pressure: Units pounds |
| GENERAL ENG FUEL PUMP ON:index_get | action_GENERAL ENG FUEL PUMP ON:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the indexed engine fuel pump on (1, TRUE) or off (0, FALSE): Units bool |
| GENERAL ENG FUEL PUMP SWITCH EX1:index_get | action_GENERAL ENG FUEL PUMP SWITCH EX1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEquivalent to GENERAL ENG FUEL PUMP SWITCH but differentiates between ON and AUTO: Units bool |
| GENERAL ENG FUEL PUMP SWITCH:index_get | action_GENERAL ENG FUEL PUMP SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel pump switch state the indexed engine. If 0 (FALSE) the pump is off and if 1 (TRUE) then it is on: Units bool |
| GENERAL ENG FUEL USED SINCE START:index_get | action_GENERAL ENG FUEL USED SINCE START:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel used since the indexed engine was last started: Units pounds |
| GENERAL ENG FUEL VALVE:index_get | action_GENERAL ENG FUEL VALVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel valve state for the indexed engine. If 0 (FALSE) then the valve is closed and if 1 (TRUE) then it is open: Units bool |
| GENERAL ENG GENERATOR ACTIVE:index | action_GENERAL ENG GENERATOR ACTIVE:index | Set the simvar Settable alternator (generator) on/off switch for the indexed engine: Units bool |
| GENERAL ENG GENERATOR ACTIVE:index_get | action_GENERAL ENG GENERATOR ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerSettable alternator (generator) on/off switch for the indexed engine: Units bool |
| GENERAL ENG GENERATOR SWITCH:index_get | action_GENERAL ENG GENERATOR SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAlternator (generator) on/off switch state for the indexed engine: Units bool |
| GENERAL ENG HOBBS ELAPSED TIME:index_get | action_GENERAL ENG HOBBS ELAPSED TIME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to find the time since the indexed engine started running: Units seconds |
| GENERAL ENG MASTER ALTERNATOR_get | action_GENERAL ENG MASTER ALTERNATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerThe alternator switch for a specific engine. Requires an engine index (1:4) when used: Units bool |
| GENERAL ENG MASTER ALTERNATOR:index_get | action_GENERAL ENG MASTER ALTERNATOR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe alternator (generator) switch position, true if the switch is ON. Requires an engine index, and the use of an alternator index when referencing: Units bool |
| GENERAL ENG MAX REACHED RPM:index_get | action_GENERAL ENG MAX REACHED RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum attained rpm for the indexed engine: Units RPM |
| GENERAL ENG MIXTURE LEVER POSITION:index | action_GENERAL ENG MIXTURE LEVER POSITION:index | Set the simvar Percent of max mixture lever position for the indexed engine: Units percent |
| GENERAL ENG MIXTURE LEVER POSITION:index_get | action_GENERAL ENG MIXTURE LEVER POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max mixture lever position for the indexed engine: Units percent |
| GENERAL ENG OIL LEAKED PERCENT:index_get | action_GENERAL ENG OIL LEAKED PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max oil capacity leaked for the indexed engine: Units percent |
| GENERAL ENG OIL PRESSURE:index | action_GENERAL ENG OIL PRESSURE:index | Set the simvar The indexed engine oil pressure: Units pounds |
| GENERAL ENG OIL PRESSURE:index_get | action_GENERAL ENG OIL PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine oil pressure: Units pounds |
| GENERAL ENG OIL TEMPERATURE:index | action_GENERAL ENG OIL TEMPERATURE:index | Set the simvar The indexed engine oil temperature: Units rankine |
| GENERAL ENG OIL TEMPERATURE:index_get | action_GENERAL ENG OIL TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine oil temperature: Units rankine |
| GENERAL ENG PCT MAX RPM:index | action_GENERAL ENG PCT MAX RPM:index | Set the simvar Percent of max rated rpm for the indexed engine: Units percent |
| GENERAL ENG PCT MAX RPM:index_get | action_GENERAL ENG PCT MAX RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max rated rpm for the indexed engine: Units percent |
| GENERAL ENG PROPELLER LEVER POSITION:index | action_GENERAL ENG PROPELLER LEVER POSITION:index | Set the simvar Percent of max prop lever position for the indexed engine: Units percent |
| GENERAL ENG PROPELLER LEVER POSITION:index_get | action_GENERAL ENG PROPELLER LEVER POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max prop lever position for the indexed engine: Units percent |
| GENERAL ENG REVERSE THRUST ENGAGED_get | action_GENERAL ENG REVERSE THRUST ENGAGED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will return 1 (TRUE) if the reverse thruster is engaged, or 0 (FALSE) otherwise: Units bool |
| GENERAL ENG RPM:index | action_GENERAL ENG RPM:index | Set the simvar The RPM for an indexed engine: Units RPM |
| GENERAL ENG RPM:index_get | action_GENERAL ENG RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe RPM for an indexed engine: Units RPM |
| GENERAL ENG STARTER ACTIVE:index_get | action_GENERAL ENG STARTER ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the indexed engine starter is active: Units bool |
| GENERAL ENG STARTER:index_get | action_GENERAL ENG STARTER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine starter on/off state: Units bool |
| GENERAL ENG THROTTLE LEVER POSITION:index | action_GENERAL ENG THROTTLE LEVER POSITION:index | Set the simvar Percent of max throttle position for the indexed engine: Units percent |
| GENERAL ENG THROTTLE LEVER POSITION:index_get | action_GENERAL ENG THROTTLE LEVER POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max throttle position for the indexed engine: Units percent |
| GENERAL ENG THROTTLE MANAGED MODE:index_get | action_GENERAL ENG THROTTLE MANAGED MODE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent mode of the managed throttle for the indexed engine: Units number |
| GLASSCOCKPIT AUTOMATIC BRIGHTNESS_get | action_GLASSCOCKPIT AUTOMATIC BRIGHTNESS_get | Request the value, will be returned in a 'name_(Single) 'triggerThis variable will return a value between 0 and 1 for the automatic brightness setting for glass cockpit displays, where 0 is the dimmest and 1 is the brightest. This value will vary depending on the time of day.: Units number |
| GPS APPROACH AIRPORT ID_get | action_GPS APPROACH AIRPORT ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID of airport.: Units null |
| GPS APPROACH APPROACH ID_get | action_GPS APPROACH APPROACH ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID of approach.: Units null |
| GPS APPROACH APPROACH INDEX | action_GPS APPROACH APPROACH INDEX | Set the simvar Index of approach for given airport.: Units number |
| GPS APPROACH APPROACH INDEX_get | action_GPS APPROACH APPROACH INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of approach for given airport.: Units number |
| GPS APPROACH APPROACH TYPE | action_GPS APPROACH APPROACH TYPE | Set the simvar Approach type.: Units enum |
| GPS APPROACH APPROACH TYPE_get | action_GPS APPROACH APPROACH TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerApproach type.: Units enum |
| GPS APPROACH IS FINAL | action_GPS APPROACH IS FINAL | Set the simvar Is approach transition final approach segment.: Units bool |
| GPS APPROACH IS FINAL_get | action_GPS APPROACH IS FINAL_get | Request the value, will be returned in a 'name_(Single) 'triggerIs approach transition final approach segment.: Units bool |
| GPS APPROACH IS MISSED | action_GPS APPROACH IS MISSED | Set the simvar Is approach segment missed approach segment.: Units bool |
| GPS APPROACH IS MISSED_get | action_GPS APPROACH IS MISSED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs approach segment missed approach segment.: Units bool |
| GPS APPROACH IS WP RUNWAY | action_GPS APPROACH IS WP RUNWAY | Set the simvar Waypoint is the runway.: Units bool |
| GPS APPROACH IS WP RUNWAY_get | action_GPS APPROACH IS WP RUNWAY_get | Request the value, will be returned in a 'name_(Single) 'triggerWaypoint is the runway.: Units bool |
| GPS APPROACH MODE | action_GPS APPROACH MODE | Set the simvar Sub mode within approach mode.: Units enum |
| GPS APPROACH MODE_get | action_GPS APPROACH MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerSub mode within approach mode.: Units enum |
| GPS APPROACH SEGMENT TYPE | action_GPS APPROACH SEGMENT TYPE | Set the simvar Segment type within approach.: Units enum |
| GPS APPROACH SEGMENT TYPE_get | action_GPS APPROACH SEGMENT TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerSegment type within approach.: Units enum |
| GPS APPROACH TIMEZONE DEVIATION_get | action_GPS APPROACH TIMEZONE DEVIATION_get | Request the value, will be returned in a 'name_(Single) 'triggerDeviation of local time from GMT.: Units seconds |
| GPS APPROACH TRANSITION ID | action_GPS APPROACH TRANSITION ID | Set the simvar ID of approach transition.: Units null |
| GPS APPROACH TRANSITION ID_get | action_GPS APPROACH TRANSITION ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID of approach transition.: Units null |
| GPS APPROACH TRANSITION INDEX | action_GPS APPROACH TRANSITION INDEX | Set the simvar Index of approach transition.: Units number |
| GPS APPROACH TRANSITION INDEX_get | action_GPS APPROACH TRANSITION INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of approach transition.: Units number |
| GPS APPROACH WP COUNT | action_GPS APPROACH WP COUNT | Set the simvar Number of waypoints.: Units number |
| GPS APPROACH WP COUNT_get | action_GPS APPROACH WP COUNT_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of waypoints.: Units number |
| GPS APPROACH WP INDEX | action_GPS APPROACH WP INDEX | Set the simvar Index of current waypoint.: Units number |
| GPS APPROACH WP INDEX_get | action_GPS APPROACH WP INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of current waypoint.: Units number |
| GPS APPROACH WP TYPE | action_GPS APPROACH WP TYPE | Set the simvar Waypoint type within approach mode.: Units enum |
| GPS APPROACH WP TYPE_get | action_GPS APPROACH WP TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerWaypoint type within approach mode.: Units enum |
| GPS CDI NEEDLE_get | action_GPS CDI NEEDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe course deviation of the needle for a CDI instrument. The SimVar displays the deviation from -127 to +127. It returns a value if a flight plan is set (otherwise it will return 0) even if the autopilot isn't on GPS mode. Scaling can also be set through the GPS CDI SCALING simvar.: Units number |
| GPS CDI SCALING | action_GPS CDI SCALING | Set the simvar The full scale deflection of the CDI due to GPS cross-track error, in meters.: Units meters |
| GPS CDI SCALING_get | action_GPS CDI SCALING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe full scale deflection of the CDI due to GPS cross-track error, in meters.: Units meters |
| GPS COURSE TO STEER | action_GPS COURSE TO STEER | Set the simvar Suggested heading to steer (for autopilot).: Units radians |
| GPS COURSE TO STEER_get | action_GPS COURSE TO STEER_get | Request the value, will be returned in a 'name_(Single) 'triggerSuggested heading to steer (for autopilot).: Units radians |
| GPS DRIVES NAV1_get | action_GPS DRIVES NAV1_get | Request the value, will be returned in a 'name_(Single) 'triggerGPS is driving Nav 1 indicator. Note this setting will also affect the SimVars HSI_STATION_IDENT and HSI_BEARING.: Units bool |
| GPS ETA_get | action_GPS ETA_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated time of arrival at destination.: Units seconds |
| GPS ETE_get | action_GPS ETE_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated time en route to destination.: Units seconds |
| GPS FLIGHT PLAN WP COUNT | action_GPS FLIGHT PLAN WP COUNT | Set the simvar Number of waypoints.: Units number |
| GPS FLIGHT PLAN WP COUNT_get | action_GPS FLIGHT PLAN WP COUNT_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of waypoints.: Units number |
| GPS FLIGHT PLAN WP INDEX | action_GPS FLIGHT PLAN WP INDEX | Set the simvar Index of waypoint.: Units number |
| GPS FLIGHT PLAN WP INDEX_get | action_GPS FLIGHT PLAN WP INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of waypoint.: Units number |
| GPS FLIGHTPLAN TOTAL DISTANCE_get | action_GPS FLIGHTPLAN TOTAL DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the complete flightplan length from start to end. Essentially the cumulative length of all the flight plan legs added together.: Units meters |
| GPS GROUND MAGNETIC TRACK | action_GPS GROUND MAGNETIC TRACK | Set the simvar Current magnetic ground track.: Units radians |
| GPS GROUND MAGNETIC TRACK_get | action_GPS GROUND MAGNETIC TRACK_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent magnetic ground track.: Units radians |
| GPS GROUND SPEED | action_GPS GROUND SPEED | Set the simvar Current ground speed.: Units Meters per second |
| GPS GROUND SPEED_get | action_GPS GROUND SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent ground speed.: Units Meters per second |
| GPS GROUND TRUE HEADING | action_GPS GROUND TRUE HEADING | Set the simvar Current true heading.: Units radians |
| GPS GROUND TRUE HEADING_get | action_GPS GROUND TRUE HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent true heading.: Units radians |
| GPS GROUND TRUE TRACK | action_GPS GROUND TRUE TRACK | Set the simvar Current true ground track.: Units radians |
| GPS GROUND TRUE TRACK_get | action_GPS GROUND TRUE TRACK_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent true ground track.: Units radians |
| GPS GSI SCALING | action_GPS GSI SCALING | Set the simvar The full scale deflection of the vertical GSI due to GPS glidepath deviation, in meters.: Units meters |
| GPS GSI SCALING_get | action_GPS GSI SCALING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe full scale deflection of the vertical GSI due to GPS glidepath deviation, in meters.: Units meters |
| GPS HAS GLIDEPATH | action_GPS HAS GLIDEPATH | Set the simvar Whether or not the GPS system has a presently available glidepath for guidance. Only applicable with GPS_OVERRIDDEN. When true and in GPS OVERRIDDEN, HSI_GSI_NEEDLE_VALID will also be true.: Units bool |
| GPS HAS GLIDEPATH_get | action_GPS HAS GLIDEPATH_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the GPS system has a presently available glidepath for guidance. Only applicable with GPS_OVERRIDDEN. When true and in GPS OVERRIDDEN, HSI_GSI_NEEDLE_VALID will also be true.: Units bool |
| GPS IS ACTIVE FLIGHT PLAN | action_GPS IS ACTIVE FLIGHT PLAN | Set the simvar Flight plan mode active.: Units bool |
| GPS IS ACTIVE FLIGHT PLAN_get | action_GPS IS ACTIVE FLIGHT PLAN_get | Request the value, will be returned in a 'name_(Single) 'triggerFlight plan mode active.: Units bool |
| GPS IS ACTIVE WAY POINT | action_GPS IS ACTIVE WAY POINT | Set the simvar Waypoint mode active.: Units bool |
| GPS IS ACTIVE WAY POINT_get | action_GPS IS ACTIVE WAY POINT_get | Request the value, will be returned in a 'name_(Single) 'triggerWaypoint mode active.: Units bool |
| GPS IS ACTIVE WP LOCKED_get | action_GPS IS ACTIVE WP LOCKED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs switching to next waypoint locked.: Units bool |
| GPS IS APPROACH ACTIVE_get | action_GPS IS APPROACH ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerIs approach mode active.: Units bool |
| GPS IS APPROACH LOADED_get | action_GPS IS APPROACH LOADED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs approach loaded.: Units bool |
| GPS IS ARRIVED | action_GPS IS ARRIVED | Set the simvar Is flight plan destination reached.: Units bool |
| GPS IS ARRIVED_get | action_GPS IS ARRIVED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs flight plan destination reached.: Units bool |
| GPS IS DIRECTTO FLIGHTPLAN | action_GPS IS DIRECTTO FLIGHTPLAN | Set the simvar Is Direct To Waypoint mode active.: Units bool |
| GPS IS DIRECTTO FLIGHTPLAN_get | action_GPS IS DIRECTTO FLIGHTPLAN_get | Request the value, will be returned in a 'name_(Single) 'triggerIs Direct To Waypoint mode active.: Units bool |
| GPS MAGVAR | action_GPS MAGVAR | Set the simvar Current GPS magnetic variation.: Units radians |
| GPS MAGVAR_get | action_GPS MAGVAR_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent GPS magnetic variation.: Units radians |
| GPS OBS ACTIVE | action_GPS OBS ACTIVE | Set the simvar Whether or not the OBS mode is currently active (disable the automatic sequencing of waypoints in GPS flight plan).: Units bool |
| GPS OBS ACTIVE_get | action_GPS OBS ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the OBS mode is currently active (disable the automatic sequencing of waypoints in GPS flight plan).: Units bool |
| GPS OBS VALUE | action_GPS OBS VALUE | Set the simvar This is the currently selected OBS course in degrees, from 0 to 360.: Units degrees |
| GPS OBS VALUE_get | action_GPS OBS VALUE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the currently selected OBS course in degrees, from 0 to 360.: Units degrees |
| GPS OVERRIDDEN | action_GPS OVERRIDDEN | Set the simvar When it is active, all sim GPS system updates are suspended. This must be set to TRUE to be able to correctly set to any other GPS SimVar.: Units bool |
| GPS OVERRIDDEN_get | action_GPS OVERRIDDEN_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen it is active, all sim GPS system updates are suspended. This must be set to TRUE to be able to correctly set to any other GPS SimVar.: Units bool |
| GPS POSITION ALT | action_GPS POSITION ALT | Set the simvar Current GPS altitude.: Units meters |
| GPS POSITION ALT_get | action_GPS POSITION ALT_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent GPS altitude.: Units meters |
| GPS POSITION LAT | action_GPS POSITION LAT | Set the simvar Current GPS latitude.: Units degrees |
| GPS POSITION LAT_get | action_GPS POSITION LAT_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent GPS latitude.: Units degrees |
| GPS POSITION LON | action_GPS POSITION LON | Set the simvar Current GPS longitude.: Units degrees |
| GPS POSITION LON_get | action_GPS POSITION LON_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrent GPS longitude.: Units degrees |
| GPS TARGET ALTITUDE | action_GPS TARGET ALTITUDE | Set the simvar Altitude of GPS target.: Units meters |
| GPS TARGET ALTITUDE_get | action_GPS TARGET ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude of GPS target.: Units meters |
| GPS TARGET DISTANCE | action_GPS TARGET DISTANCE | Set the simvar Distance to target.: Units meters |
| GPS TARGET DISTANCE_get | action_GPS TARGET DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerDistance to target.: Units meters |
| GPS VERTICAL ANGLE | action_GPS VERTICAL ANGLE | Set the simvar Glidepath in degrees.: Units degrees |
| GPS VERTICAL ANGLE_get | action_GPS VERTICAL ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerGlidepath in degrees.: Units degrees |
| GPS VERTICAL ANGLE ERROR | action_GPS VERTICAL ANGLE ERROR | Set the simvar Vertical error in degrees from GlidePath.: Units degrees |
| GPS VERTICAL ANGLE ERROR_get | action_GPS VERTICAL ANGLE ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerVertical error in degrees from GlidePath.: Units degrees |
| GPS VERTICAL ERROR | action_GPS VERTICAL ERROR | Set the simvar Vertical deviation in meters from GlidePath.: Units meters |
| GPS VERTICAL ERROR_get | action_GPS VERTICAL ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerVertical deviation in meters from GlidePath.: Units meters |
| GPS WP BEARING | action_GPS WP BEARING | Set the simvar Magnetic bearing to waypoint.: Units radians |
| GPS WP BEARING_get | action_GPS WP BEARING_get | Request the value, will be returned in a 'name_(Single) 'triggerMagnetic bearing to waypoint.: Units radians |
| GPS WP CROSS TRK | action_GPS WP CROSS TRK | Set the simvar Cross track distance.: Units meters |
| GPS WP CROSS TRK_get | action_GPS WP CROSS TRK_get | Request the value, will be returned in a 'name_(Single) 'triggerCross track distance.: Units meters |
| GPS WP DESIRED TRACK | action_GPS WP DESIRED TRACK | Set the simvar The required heading (magnetic) from the previous waypoint to the next waypoint.: Units radians |
| GPS WP DESIRED TRACK_get | action_GPS WP DESIRED TRACK_get | Request the value, will be returned in a 'name_(Single) 'triggerThe required heading (magnetic) from the previous waypoint to the next waypoint.: Units radians |
| GPS WP DISTANCE | action_GPS WP DISTANCE | Set the simvar Distance to waypoint.: Units meters |
| GPS WP DISTANCE_get | action_GPS WP DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerDistance to waypoint.: Units meters |
| GPS WP ETA | action_GPS WP ETA | Set the simvar Estimated time of arrival at waypoint.: Units seconds |
| GPS WP ETA_get | action_GPS WP ETA_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated time of arrival at waypoint.: Units seconds |
| GPS WP ETE | action_GPS WP ETE | Set the simvar Estimated time en route to waypoint.: Units seconds |
| GPS WP ETE_get | action_GPS WP ETE_get | Request the value, will be returned in a 'name_(Single) 'triggerEstimated time en route to waypoint.: Units seconds |
| GPS WP NEXT ALT | action_GPS WP NEXT ALT | Set the simvar Altitude of next waypoint.: Units meters |
| GPS WP NEXT ALT_get | action_GPS WP NEXT ALT_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude of next waypoint.: Units meters |
| GPS WP NEXT ID | action_GPS WP NEXT ID | Set the simvar ID of next GPS waypoint.: Units null |
| GPS WP NEXT ID_get | action_GPS WP NEXT ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID of next GPS waypoint.: Units null |
| GPS WP NEXT LAT | action_GPS WP NEXT LAT | Set the simvar Latitude of next waypoint.: Units degrees |
| GPS WP NEXT LAT_get | action_GPS WP NEXT LAT_get | Request the value, will be returned in a 'name_(Single) 'triggerLatitude of next waypoint.: Units degrees |
| GPS WP NEXT LON | action_GPS WP NEXT LON | Set the simvar Longitude of next waypoint.: Units degrees |
| GPS WP NEXT LON_get | action_GPS WP NEXT LON_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitude of next waypoint.: Units degrees |
| GPS WP PREV ALT | action_GPS WP PREV ALT | Set the simvar Altitude of previous waypoint.: Units meters |
| GPS WP PREV ALT_get | action_GPS WP PREV ALT_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude of previous waypoint.: Units meters |
| GPS WP PREV ID | action_GPS WP PREV ID | Set the simvar ID of previous GPS waypoint.: Units null |
| GPS WP PREV ID_get | action_GPS WP PREV ID_get | Request the value, will be returned in a 'name_(Single) 'triggerID of previous GPS waypoint.: Units null |
| GPS WP PREV LAT | action_GPS WP PREV LAT | Set the simvar Latitude of previous waypoint.: Units degrees |
| GPS WP PREV LAT_get | action_GPS WP PREV LAT_get | Request the value, will be returned in a 'name_(Single) 'triggerLatitude of previous waypoint.: Units degrees |
| GPS WP PREV LON | action_GPS WP PREV LON | Set the simvar Longitude of previous waypoint.: Units degrees |
| GPS WP PREV LON_get | action_GPS WP PREV LON_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitude of previous waypoint.: Units degrees |
| GPS WP PREV VALID | action_GPS WP PREV VALID | Set the simvar Is previous waypoint valid (i.e. current waypoint is not the first waypoint).: Units bool |
| GPS WP PREV VALID_get | action_GPS WP PREV VALID_get | Request the value, will be returned in a 'name_(Single) 'triggerIs previous waypoint valid (i.e. current waypoint is not the first waypoint).: Units bool |
| GPS WP TRACK ANGLE ERROR | action_GPS WP TRACK ANGLE ERROR | Set the simvar Tracking angle error to waypoint.: Units radians |
| GPS WP TRACK ANGLE ERROR_get | action_GPS WP TRACK ANGLE ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerTracking angle error to waypoint.: Units radians |
| GPS WP TRUE BEARING | action_GPS WP TRUE BEARING | Set the simvar True bearing to waypoint.: Units radians |
| GPS WP TRUE BEARING_get | action_GPS WP TRUE BEARING_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue bearing to waypoint.: Units radians |
| GPS WP TRUE REQ HDG | action_GPS WP TRUE REQ HDG | Set the simvar Required true heading to waypoint.: Units radians |
| GPS WP TRUE REQ HDG_get | action_GPS WP TRUE REQ HDG_get | Request the value, will be returned in a 'name_(Single) 'triggerRequired true heading to waypoint.: Units radians |
| GPS WP VERTICAL SPEED | action_GPS WP VERTICAL SPEED | Set the simvar Vertical speed to waypoint.: Units Meters per second |
| GPS WP VERTICAL SPEED_get | action_GPS WP VERTICAL SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerVertical speed to waypoint.: Units Meters per second |
| GPWS SYSTEM ACTIVE | action_GPWS SYSTEM ACTIVE | Set the simvar True if the Ground Proximity Warning System is active.: Units bool |
| GPWS SYSTEM ACTIVE_get | action_GPWS SYSTEM ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the Ground Proximity Warning System is active.: Units bool |
| GPWS WARNING_get | action_GPWS WARNING_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if Ground Proximity Warning System installed.: Units bool |
| GROUND ALTITUDE_get | action_GROUND ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude of surface.: Units meters |
| GROUND VELOCITY_get | action_GROUND VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'trigger relative to the earths surface: Units knots |
| GROUNDPOWERUNIT HOSE DEPLOYED_get | action_GROUNDPOWERUNIT HOSE DEPLOYED_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current deployment amount of the ground power unit hose. Currently can only be set to 0 (not deployed) and 1 (deployed).: Units percent Over 100 |
| GROUNDPOWERUNIT HOSE END POSX_get | action_GROUNDPOWERUNIT HOSE END POSX_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "X" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters |
| GROUNDPOWERUNIT HOSE END POSZ_get | action_GROUNDPOWERUNIT HOSE END POSZ_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the end of the ground power unit hose when fully deployed, relative to the ground.: Units meters |
| GROUNDPOWERUNIT HOSE END RELATIVE HEADING_get | action_GROUNDPOWERUNIT HOSE END RELATIVE HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe heading of the end of the ground power unit hose, relative to the vehicle heading.: Units degrees |
| GYRO DRIFT ERROR_get | action_GYRO DRIFT ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerAngular error of heading indicator.: Units radians |
| HAND ANIM STATE | action_HAND ANIM STATE | Set the simvar What frame of the hand is currently used.: Units enum |
| HAND ANIM STATE_get | action_HAND ANIM STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhat frame of the hand is currently used.: Units enum |
| HAS STALL PROTECTION_get | action_HAS STALL PROTECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerWill return whether the aircraft has stall protection (true) or not (false).: Units bool |
| HEADING INDICATOR_get | action_HEADING INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerHeading indicator (directional gyro) indication.: Units radians |
| HOLDBACK BAR INSTALLED_get | action_HOLDBACK BAR INSTALLED_get | Request the value, will be returned in a 'name_(Single) 'triggerHoldback bars allow build up of thrust before takeoff from a catapult, and are installed by the deck crew of an aircraft carrier: Units bool |
| HSI BEARING_get | action_HSI BEARING_get | Request the value, will be returned in a 'name_(Single) 'triggerIf the GPS_DRIVES_NAV1 variable is true and the HSI BEARING VALID variable is true, this variable contains the HSI needle bearing. If the GPS DRIVES NAV1 variable is false and the HSI BEARING VALID variable is true, this variable contains the ADF1 frequency.: Units degrees |
| HSI BEARING VALID_get | action_HSI BEARING VALID_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will return true if the HSI BEARING variable contains valid data.: Units bool |
| HSI CDI NEEDLE_get | action_HSI CDI NEEDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerNeedle deflection (+/- 127).: Units number |
| HSI CDI NEEDLE VALID_get | action_HSI CDI NEEDLE VALID_get | Request the value, will be returned in a 'name_(Single) 'triggerSignal valid.: Units bool |
| HSI DISTANCE_get | action_HSI DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerDME/GPS distance.: Units nautical miles |
| HSI GSI NEEDLE_get | action_HSI GSI NEEDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerNeedle deflection (+/- 119).: Units number |
| HSI GSI NEEDLE VALID_get | action_HSI GSI NEEDLE VALID_get | Request the value, will be returned in a 'name_(Single) 'triggerSignal valid.: Units bool |
| HSI HAS LOCALIZER_get | action_HSI HAS LOCALIZER_get | Request the value, will be returned in a 'name_(Single) 'triggerStation is a localizer.: Units bool |
| HSI SPEED_get | action_HSI SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerDME/GPS speed.: Units knots |
| HSI STATION IDENT_get | action_HSI STATION IDENT_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the ident of the the next GPS waypoint, if GPS_DRIVES_NAV1 is true. If GPS DRIVES NAV1 is false, it returns the identity of the station that is tuned on nav radio 1.: Units null |
| HSI TF FLAGS_get | action_HSI TF FLAGS_get | Request the value, will be returned in a 'name_(Single) 'triggerNav TO/FROM flag.: Units enum |
| HYDRAULIC PRESSURE:index_get | action_HYDRAULIC PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerHydraulic system pressure. Indexes start at 1.: Units pounds |
| HYDRAULIC RESERVOIR PERCENT:index | action_HYDRAULIC RESERVOIR PERCENT:index | Set the simvar Hydraulic pressure changes will follow changes to this variable. Indexes start at 1.: Units percent Over 100 |
| HYDRAULIC RESERVOIR PERCENT:index_get | action_HYDRAULIC RESERVOIR PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerHydraulic pressure changes will follow changes to this variable. Indexes start at 1.: Units percent Over 100 |
| HYDRAULIC SWITCH_get | action_HYDRAULIC SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if hydraulic switch is on.: Units bool |
| HYDRAULIC SYSTEM INTEGRITY_get | action_HYDRAULIC SYSTEM INTEGRITY_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent system functional.: Units percent Over 100 |
| IDLE ANIMATION ID_get | action_IDLE ANIMATION ID_get | Request the value, will be returned in a 'name_(Single) 'triggerThe ID of the idle animation for the sim object.: Units null |
| INCIDENCE ALPHA_get | action_INCIDENCE ALPHA_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle of attack: Units radians |
| INCIDENCE BETA_get | action_INCIDENCE BETA_get | Request the value, will be returned in a 'name_(Single) 'triggerSideslip angle: Units radians |
| INDICATED ALTITUDE | action_INDICATED ALTITUDE | Set the simvar The indicated altitude.: Units feet |
| INDICATED ALTITUDE_get | action_INDICATED ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indicated altitude.: Units feet |
| INDICATED ALTITUDE CALIBRATED_get | action_INDICATED ALTITUDE CALIBRATED_get | Request the value, will be returned in a 'name_(Single) 'triggerIndicated altitude with the altimeter calibrated to current sea level pressure.: Units feet |
| INDICATED ALTITUDE EX1_get | action_INDICATED ALTITUDE EX1_get | Request the value, will be returned in a 'name_(Single) 'triggerSimilar to INDICATED_ALTITUDE but doesn't affect actual plane position when setting this variable.: Units feet |
| INDUCTOR COMPASS HEADING REF_get | action_INDUCTOR COMPASS HEADING REF_get | Request the value, will be returned in a 'name_(Single) 'triggerInductor compass heading.: Units radians |
| INDUCTOR COMPASS PERCENT DEVIATION_get | action_INDUCTOR COMPASS PERCENT DEVIATION_get | Request the value, will be returned in a 'name_(Single) 'triggerInductor compass deviation reading.: Units percent Over 100 |
| INNER MARKER | action_INNER MARKER | Set the simvar Inner marker state.: Units bool |
| INNER MARKER_get | action_INNER MARKER_get | Request the value, will be returned in a 'name_(Single) 'triggerInner marker state.: Units bool |
| INTERACTIVE POINT BANK_get | action_INTERACTIVE POINT BANK_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point orientation: Bank: Units degrees |
| INTERACTIVE POINT GOAL | action_INTERACTIVE POINT GOAL | Set the simvar The Interactive Point goal percentage of opening (if it's for a door) or percentage of deployment (if it's for a hose or cable).: Units percent Over 100 |
| INTERACTIVE POINT GOAL_get | action_INTERACTIVE POINT GOAL_get | Request the value, will be returned in a 'name_(Single) 'triggerThe Interactive Point goal percentage of opening (if it's for a door) or percentage of deployment (if it's for a hose or cable).: Units percent Over 100 |
| INTERACTIVE POINT HEADING_get | action_INTERACTIVE POINT HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point orientation: Heading: Units degrees |
| INTERACTIVE POINT JETWAY LEFT BEND_get | action_INTERACTIVE POINT JETWAY LEFT BEND_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired left bend ratio of jetway hood: Units percent |
| INTERACTIVE POINT JETWAY LEFT DEPLOYMENT_get | action_INTERACTIVE POINT JETWAY LEFT DEPLOYMENT_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired left deployment angle of jetway hood: Units degrees |
| INTERACTIVE POINT JETWAY RIGHT BEND_get | action_INTERACTIVE POINT JETWAY RIGHT BEND_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired right bend ratio of jetway hood: Units percent |
| INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT_get | action_INTERACTIVE POINT JETWAY RIGHT DEPLOYMENT_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired right deployment angle of jetway hood: Units degrees |
| INTERACTIVE POINT JETWAY TOP HORIZONTAL_get | action_INTERACTIVE POINT JETWAY TOP HORIZONTAL_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired top horizontal ratio of displacement of jetway hood: Units percent |
| INTERACTIVE POINT JETWAY TOP VERTICAL_get | action_INTERACTIVE POINT JETWAY TOP VERTICAL_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Jetway constant, determining the desired top vertical ratio of displacement of jetway hood: Units percent |
| INTERACTIVE POINT OPEN | action_INTERACTIVE POINT OPEN | Set the simvar Interactive Point current percentage of opening (if door) or deployment (if hose/cable): Units percent Over 100 |
| INTERACTIVE POINT OPEN_get | action_INTERACTIVE POINT OPEN_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point current percentage of opening (if door) or deployment (if hose/cable): Units percent Over 100 |
| INTERACTIVE POINT PITCH_get | action_INTERACTIVE POINT PITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point orientation: Pitch: Units degrees |
| INTERACTIVE POINT POSX_get | action_INTERACTIVE POINT POSX_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point X position relative to datum reference point: Units feet |
| INTERACTIVE POINT POSY_get | action_INTERACTIVE POINT POSY_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Y position relative to datum reference point: Units feet |
| INTERACTIVE POINT POSZ_get | action_INTERACTIVE POINT POSZ_get | Request the value, will be returned in a 'name_(Single) 'triggerInteractive Point Z position relative to datum reference point: Units feet |
| INTERACTIVE POINT TYPE_get | action_INTERACTIVE POINT TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe type of interactive point: Units enum |
| INTERCOM MODE_get | action_INTERCOM MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerIntercom Mode: Units enum |
| INTERCOM SYSTEM ACTIVE_get | action_INTERCOM SYSTEM ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the intercom system is active.: Units bool |
| IS ALTITUDE FREEZE ON_get | action_IS ALTITUDE FREEZE ON_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the altitude of the aircraft is frozen.: Units bool |
| IS ANY INTERIOR LIGHT ON_get | action_IS ANY INTERIOR LIGHT ON_get | Request the value, will be returned in a 'name_(Single) 'triggerWill return true if any interior light is on or false otherwise.: Units bool |
| IS ATTACHED TO SLING_get | action_IS ATTACHED TO SLING_get | Request the value, will be returned in a 'name_(Single) 'triggerSet to true if this object is attached to a sling.: Units bool |
| IS ATTITUDE FREEZE ON_get | action_IS ATTITUDE FREEZE ON_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the attitude (pitch, bank and heading) of the aircraft is frozen.: Units bool |
| IS CAMERA RAY INTERSECT WITH NODE_get | action_IS CAMERA RAY INTERSECT WITH NODE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis SimVar is used to check for a collision along a ray from the center of the user FOV and a model node. The available nodes that can be checked using this SimVar must be previously defined in the [CAMERA_RAY_NODE_COLLISION] of the camera.cfg file. The SimVar requires a node index value between 1 and 10, corresponding to the node defined in the CFG file, and the SimVar will return 1 (TRUE) if there is a collision along the camera ray or 0 (FALSE) otherwise. You may also supply an index of 0 to perform a collision check for all defined nodes, in which case the SimVar will return 1 (TRUE) if there is a collision between the ray and any of the defined nodes. Supplying an index outside of the range of 1 to 10, or supplying an index for which no node has been defined, will return 0 (FALSE).: Units bool |
| IS GEAR FLOATS_get | action_IS GEAR FLOATS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if landing gear are floats: Units bool |
| IS GEAR RETRACTABLE_get | action_IS GEAR RETRACTABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if gear can be retracted: Units bool |
| IS GEAR SKIDS_get | action_IS GEAR SKIDS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if landing gear is skids: Units bool |
| IS GEAR SKIS_get | action_IS GEAR SKIS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if landing gear is skis: Units bool |
| IS GEAR WHEELS_get | action_IS GEAR WHEELS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if landing gear is wheels: Units bool |
| IS LATITUDE LONGITUDE FREEZE ON_get | action_IS LATITUDE LONGITUDE FREEZE ON_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the lat/lon of the aircraft (either user or AI controlled) is frozen. If this variable returns true, it means that the latitude and longitude of the aircraft are not being controlled by ESP, so enabling, for example, a SimConnect client to control the position of the aircraft. This can also apply to altitude and attitude. Also refer to the range of KEY_FREEZE..... Event IDs.: Units bool |
| IS SLEW ACTIVE | action_IS SLEW ACTIVE | Set the simvar True if slew is active: Units bool |
| IS SLEW ACTIVE_get | action_IS SLEW ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if slew is active: Units bool |
| IS SLEW ALLOWED | action_IS SLEW ALLOWED | Set the simvar True if slew is enabled: Units bool |
| IS SLEW ALLOWED_get | action_IS SLEW ALLOWED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if slew is enabled: Units bool |
| IS TAIL DRAGGER_get | action_IS TAIL DRAGGER_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the aircraft is a taildragger: Units bool |
| IS USER SIM_get | action_IS USER SIM_get | Request the value, will be returned in a 'name_(Single) 'triggerIs this the user loaded aircraft: Units bool |
| JETWAY HOOD LEFT BEND_get | action_JETWAY HOOD LEFT BEND_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target position for the left bend animation of the jetway hood.: Units percent |
| JETWAY HOOD LEFT DEPLOYMENT_get | action_JETWAY HOOD LEFT DEPLOYMENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target angle for the left deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees |
| JETWAY HOOD RIGHT BEND_get | action_JETWAY HOOD RIGHT BEND_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target position for the right bend animation of the jetway hood.: Units percent |
| JETWAY HOOD RIGHT DEPLOYMENT_get | action_JETWAY HOOD RIGHT DEPLOYMENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe target angle for the right deployment animation of the jetway hood, where 0 is considered vertical.: Units degrees |
| JETWAY HOOD TOP HORIZONTAL_get | action_JETWAY HOOD TOP HORIZONTAL_get | Request the value, will be returned in a 'name_(Single) 'triggerTarget position for the top horizontal animation of the jetway hood. Values can be between -100% and 100%.: Units percent |
| JETWAY HOOD TOP VERTICAL_get | action_JETWAY HOOD TOP VERTICAL_get | Request the value, will be returned in a 'name_(Single) 'triggerTarget position for the top vertical animation of the jetway hood. Values can be between -100% and 100%.: Units percent |
| JETWAY MOVING_get | action_JETWAY MOVING_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be 1 (TRUE) id the jetway body is currently moving (it will not include checks on hood animation).: Units bool |
| JETWAY WHEEL ORIENTATION CURRENT_get | action_JETWAY WHEEL ORIENTATION CURRENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current angle of the jetway wheels.: Units degrees |
| JETWAY WHEEL ORIENTATION TARGET_get | action_JETWAY WHEEL ORIENTATION TARGET_get | Request the value, will be returned in a 'name_(Single) 'triggerThe (approximate) target angle for the jetway wheels.: Units degrees |
| JETWAY WHEEL SPEED_get | action_JETWAY WHEEL SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current speed of the jetway wheels.: Units Meters per second |
| KOHLSMAN SETTING HG:index_get | action_KOHLSMAN SETTING HG:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe value for the given altimeter index in inches of mercury.: Units Inches of Mercury |
| KOHLSMAN SETTING MB:index_get | action_KOHLSMAN SETTING MB:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe value for the given altimeter index in millibars.: Units Millibars |
| KOHLSMAN SETTING STD:index_get | action_KOHLSMAN SETTING STD:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the indexed altimeter is in"Standard" mode, or false otherwise.: Units bool |
| LAUNCHBAR HELD EXTENDED_get | action_LAUNCHBAR HELD EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be True if the launchbar is fully extended, and can be used, for example, to change the color of an instrument light: Units bool |
| LAUNCHBAR POSITION_get | action_LAUNCHBAR POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerInstalled on aircraft before takeoff from a carrier catapult. Note that gear cannot retract with this extended. 100 = fully extended: Units percent Over 100 |
| LAUNCHBAR SWITCH_get | action_LAUNCHBAR SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerIf this is set to True the launch bar switch has been engaged: Units bool |
| LEADING EDGE FLAPS LEFT ANGLE_get | action_LEADING EDGE FLAPS LEFT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle left leading edge flap extended. Use LEADING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians |
| LEADING EDGE FLAPS LEFT INDEX_get | action_LEADING EDGE FLAPS LEFT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of left leading edge flap position: Units number |
| LEADING EDGE FLAPS LEFT PERCENT | action_LEADING EDGE FLAPS LEFT PERCENT | Set the simvar Percent left leading edge flap extended: Units percent Over 100 |
| LEADING EDGE FLAPS LEFT PERCENT_get | action_LEADING EDGE FLAPS LEFT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left leading edge flap extended: Units percent Over 100 |
| LEADING EDGE FLAPS RIGHT ANGLE_get | action_LEADING EDGE FLAPS RIGHT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle right leading edge flap extended. Use LEADING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians |
| LEADING EDGE FLAPS RIGHT INDEX_get | action_LEADING EDGE FLAPS RIGHT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of right leading edge flap position: Units number |
| LEADING EDGE FLAPS RIGHT PERCENT | action_LEADING EDGE FLAPS RIGHT PERCENT | Set the simvar Percent right leading edge flap extended: Units percent Over 100 |
| LEADING EDGE FLAPS RIGHT PERCENT_get | action_LEADING EDGE FLAPS RIGHT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right leading edge flap extended: Units percent Over 100 |
| LEFT WHEEL ROTATION ANGLE_get | action_LEFT WHEEL ROTATION ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerLeft wheel rotation angle (rotation around the axis for the wheel): Units radians |
| LEFT WHEEL RPM_get | action_LEFT WHEEL RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerLeft landing gear rpm: Units RPM |
| LIGHT BACKLIGHT INTENSITY | action_LIGHT BACKLIGHT INTENSITY | Set the simvar Vehicle backlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT BACKLIGHT INTENSITY_get | action_LIGHT BACKLIGHT INTENSITY_get | Request the value, will be returned in a 'name_(Single) 'triggerVehicle backlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT BEACON | action_LIGHT BEACON | Set the simvar Light switch state.: Units bool |
| LIGHT BEACON_get | action_LIGHT BEACON_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state.: Units bool |
| LIGHT BEACON ON_get | action_LIGHT BEACON ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target beacon light is functioning or if the switch is ON. Use beacon lightdef index.: Units bool |
| LIGHT BRAKE ON_get | action_LIGHT BRAKE ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target brake light is functioning or if the switch is ON.: Units bool |
| LIGHT CABIN | action_LIGHT CABIN | Set the simvar Light switch state.: Units bool |
| LIGHT CABIN_get | action_LIGHT CABIN_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state.: Units bool |
| LIGHT CABIN ON_get | action_LIGHT CABIN ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target cabin light is functioning or if the switch is ON. Use the cabin lightdef index.: Units bool |
| LIGHT CABIN POWER SETTING_get | action_LIGHT CABIN POWER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current cabin light power setting. Requires the cabin lightdef index.: Units percent |
| LIGHT GLARESHIELD | action_LIGHT GLARESHIELD | Set the simvar Whether or not the Light switch for the Glareshield is enabled.: Units bool |
| LIGHT GLARESHIELD_get | action_LIGHT GLARESHIELD_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Light switch for the Glareshield is enabled.: Units bool |
| LIGHT GLARESHIELD ON_get | action_LIGHT GLARESHIELD ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target glareshield light is functioning or if the switch is ON. Use the glareshield lightdef index.: Units bool |
| LIGHT GLARESHIELD POWER SETTING_get | action_LIGHT GLARESHIELD POWER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current glareshield light power setting. Requires the glareshield lightdef index.: Units percent |
| LIGHT GYROLIGHT INTENSITY | action_LIGHT GYROLIGHT INTENSITY | Set the simvar Vehicle gyrolights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT GYROLIGHT INTENSITY_get | action_LIGHT GYROLIGHT INTENSITY_get | Request the value, will be returned in a 'name_(Single) 'triggerVehicle gyrolights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT HEAD ON_get | action_LIGHT HEAD ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target navigation light is functioning or if the switch is ON.: Units bool |
| LIGHT HEADLIGHT INTENSITY | action_LIGHT HEADLIGHT INTENSITY | Set the simvar Vehicle headlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT HEADLIGHT INTENSITY_get | action_LIGHT HEADLIGHT INTENSITY_get | Request the value, will be returned in a 'name_(Single) 'triggerVehicle headlights current intensity (0 = off, 1 = full intensity).: Units percent Over 100 |
| LIGHT LANDING | action_LIGHT LANDING | Set the simvar Light switch state for landing light.: Units bool |
| LIGHT LANDING_get | action_LIGHT LANDING_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for landing light.: Units bool |
| LIGHT LANDING ON_get | action_LIGHT LANDING ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target landing light is functioning or if the switch is ON. Use landing lightdef index.: Units bool |
| LIGHT LOGO | action_LIGHT LOGO | Set the simvar Light switch state for logo light.: Units bool |
| LIGHT LOGO_get | action_LIGHT LOGO_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for logo light.: Units bool |
| LIGHT LOGO ON_get | action_LIGHT LOGO ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target logo light is functioning or if the switch is ON. Use the logo lightdef index.: Units bool |
| LIGHT NAV | action_LIGHT NAV | Set the simvar Light switch state for the NAV light.: Units bool |
| LIGHT NAV_get | action_LIGHT NAV_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for the NAV light.: Units bool |
| LIGHT NAV ON_get | action_LIGHT NAV ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target navigation light is functioning or if the switch is ON. Use navigation lightdef index.: Units bool |
| LIGHT ON STATES_get | action_LIGHT ON STATES_get | Request the value, will be returned in a 'name_(Single) 'triggerlight on using bit mask (see documentation): Units mask |
| LIGHT PANEL | action_LIGHT PANEL | Set the simvar Light switch state of the panel light.: Units bool |
| LIGHT PANEL_get | action_LIGHT PANEL_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state of the panel light.: Units bool |
| LIGHT PANEL ON_get | action_LIGHT PANEL ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target panel light is functioning or if the switch is ON. Use the panel lightdef index.: Units bool |
| LIGHT PANEL POWER SETTING_get | action_LIGHT PANEL POWER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current panel light power setting. Requires the panel lightdef index.: Units percent |
| LIGHT PEDESTRAL | action_LIGHT PEDESTRAL | Set the simvar Whether or not the Light switch for the Pedestal is enabled.: Units bool |
| LIGHT PEDESTRAL_get | action_LIGHT PEDESTRAL_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Light switch for the Pedestal is enabled.: Units bool |
| LIGHT PEDESTRAL ON_get | action_LIGHT PEDESTRAL ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target pedestral light is functioning or if the switch is ON. Requires the pedestral lightdef index.: Units bool |
| LIGHT PEDESTRAL POWER SETTING_get | action_LIGHT PEDESTRAL POWER SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current pedestral light power setting. Requires the pedestral lightdef index.: Units percent |
| LIGHT POTENTIOMETER:index_get | action_LIGHT POTENTIOMETER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAdjust the potentiometer of the indexed lighting. Index is defined in the appropriate lightdef hashmap setting.: Units percent Over 100 |
| LIGHT RECOGNITION | action_LIGHT RECOGNITION | Set the simvar Light switch state for the recognition light.: Units bool |
| LIGHT RECOGNITION_get | action_LIGHT RECOGNITION_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for the recognition light.: Units bool |
| LIGHT RECOGNITION ON_get | action_LIGHT RECOGNITION ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target recognition light is functioning or if the switch is ON. Use the recognition lightdef index.: Units bool |
| LIGHT STATES_get | action_LIGHT STATES_get | Request the value, will be returned in a 'name_(Single) 'triggerSame as LIGHT_ON_STATES.: Units mask |
| LIGHT STROBE | action_LIGHT STROBE | Set the simvar Light switch state.: Units bool |
| LIGHT STROBE_get | action_LIGHT STROBE_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state.: Units bool |
| LIGHT STROBE ON_get | action_LIGHT STROBE ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target strobe light is functioning or if the switch is ON. Use the strobe lightdef index.: Units bool |
| LIGHT TAXI | action_LIGHT TAXI | Set the simvar Light switch state for the taxi light.: Units bool |
| LIGHT TAXI_get | action_LIGHT TAXI_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for the taxi light.: Units bool |
| LIGHT TAXI ON_get | action_LIGHT TAXI ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target taxi light is functioning or if the switch is ON. Use taxi lightdef index.: Units bool |
| LIGHT WING | action_LIGHT WING | Set the simvar Light switch state for the wing lights.: Units bool |
| LIGHT WING_get | action_LIGHT WING_get | Request the value, will be returned in a 'name_(Single) 'triggerLight switch state for the wing lights.: Units bool |
| LIGHT WING ON_get | action_LIGHT WING ON_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if the target wing light is functioning or if the switch is ON. Use the wing lightdef index.: Units bool |
| LINEAR CL ALPHA_get | action_LINEAR CL ALPHA_get | Request the value, will be returned in a 'name_(Single) 'triggerLinear CL alpha: Units per radian |
| MACH MAX OPERATE_get | action_MACH MAX OPERATE_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum design mach: Units mach |
| MAGNETIC COMPASS | action_MAGNETIC COMPASS | Set the simvar Compass reading.: Units degrees |
| MAGNETIC COMPASS_get | action_MAGNETIC COMPASS_get | Request the value, will be returned in a 'name_(Single) 'triggerCompass reading.: Units degrees |
| MAGVAR_get | action_MAGVAR_get | Request the value, will be returned in a 'name_(Single) 'triggerMagnetic variation.: Units degrees |
| MANUAL FUEL PUMP HANDLE_get | action_MANUAL FUEL PUMP HANDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of manual fuel pump handle. 1 is fully deployed.: Units percent Over 100 |
| MANUAL INSTRUMENT LIGHTS_get | action_MANUAL INSTRUMENT LIGHTS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if instrument lights are set manually.: Units bool |
| MARKER AVAILABLE_get | action_MARKER AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if Marker is available.: Units bool |
| MARKER BEACON SENSITIVITY HIGH_get | action_MARKER BEACON SENSITIVITY HIGH_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Marker Beacon is in High Sensitivity mode.: Units bool |
| MARKER BEACON STATE | action_MARKER BEACON STATE | Set the simvar Marker beacon state.: Units enum |
| MARKER BEACON STATE_get | action_MARKER BEACON STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerMarker beacon state.: Units enum |
| MARKER BEACON TEST MUTE_get | action_MARKER BEACON TEST MUTE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Marker Beacon is in Test/Mute mode.: Units bool |
| MARKER SOUND_get | action_MARKER SOUND_get | Request the value, will be returned in a 'name_(Single) 'triggerMarker audio flag.: Units bool |
| MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE_get | action_MARSHALLER AIRCRAFT DIRECTION PARKINGSPACE_get | Request the value, will be returned in a 'name_(Single) 'triggerCurrently not used in the simulation.: Units degrees |
| MARSHALLER AIRCRAFT DISTANCE_get | action_MARSHALLER AIRCRAFT DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe distance between the Marshaller and the aircraft.: Units meters |
| MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE_get | action_MARSHALLER AIRCRAFT DISTANCE DIRECTION X PARKINGSPACE_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition on the X axis of the aircraft in the parking space (negative means the aircraft is on the left side and positive the right side).: Units meters |
| MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE_get | action_MARSHALLER AIRCRAFT DISTANCE DIRECTION Z PARKINGSPACE_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition on the Z axis of the aircraft in the parking space (negative means the aircraft is behind the parking space and positive is in front of the parking space).: Units meters |
| MARSHALLER AIRCRAFT ENGINE SHUTDOWN_get | action_MARSHALLER AIRCRAFT ENGINE SHUTDOWN_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the engine(s) of the aircraft is (are) shut down.: Units bool |
| MARSHALLER AIRCRAFT HEADING PARKINGSPACE_get | action_MARSHALLER AIRCRAFT HEADING PARKINGSPACE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle between the direction of the aircraft and the direction of the parking place.: Units degrees |
| MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE_get | action_MARSHALLER AIRCRAFT PROJECTION POINT PARKINGSPACE_get | Request the value, will be returned in a 'name_(Single) 'triggerValue in Z axis of the projection from the aircraft position following the heading of the aircraft.  : Units meters |
| MARSHALLER AIRCRAFT VELOCITY_get | action_MARSHALLER AIRCRAFT VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe velocity of the aircraft.: Units knots |
| MASTER IGNITION SWITCH_get | action_MASTER IGNITION SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerAircraft master ignition switch (grounds all engines magnetos): Units bool |
| MAX EGT_get | action_MAX EGT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe maximum EGT, as set using the egt_peak_temperature parameter in the engine.cfg file: Units rankine |
| MAX G FORCE_get | action_MAX G FORCE_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum G force attained: Units gforce |
| MAX GROSS WEIGHT_get | action_MAX GROSS WEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum gross weight of the aircaft: Units pounds |
| MAX OIL TEMPERATURE_get | action_MAX OIL TEMPERATURE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe maximum oil temperature, as set using the parameter oil_temp_heating_constant in the engine.cfg file: Units rankine |
| MAX RATED ENGINE RPM_get | action_MAX RATED ENGINE RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum rated rpm for the indexed engine: Units RPM |
| MIDDLE MARKER | action_MIDDLE MARKER | Set the simvar Middle marker state.: Units bool |
| MIDDLE MARKER_get | action_MIDDLE MARKER_get | Request the value, will be returned in a 'name_(Single) 'triggerMiddle marker state.: Units bool |
| MIN DRAG VELOCITY_get | action_MIN DRAG VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerMinimum drag velocity, in clean, with no input and no gears, when at 10000ft.: Units feet |
| MIN G FORCE_get | action_MIN G FORCE_get | Request the value, will be returned in a 'name_(Single) 'triggerMinimum G force attained: Units gforce |
| MISSION SCORE | action_MISSION SCORE | Set the simvar : Units number |
| MISSION SCORE_get | action_MISSION SCORE_get | Request the value, will be returned in a 'name_(Single) 'trigger: Units number |
| NAV ACTIVE FREQUENCY:index_get | action_NAV ACTIVE FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerNav active frequency. Index is 1 or 2.: Units MHz |
| NAV AVAILABLE:index_get | action_NAV AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if Nav equipped on aircraft.: Units bool |
| NAV BACK COURSE FLAGS:index_get | action_NAV BACK COURSE FLAGS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns the listed bit flags.: Units Flags |
| NAV CDI:index_get | action_NAV CDI:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCDI needle deflection (+/- 127).: Units number |
| NAV CLOSE DME:index_get | action_NAV CLOSE DME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerClosest DME distance. Requires an index value from 1 to 4 to set which NAV to target.: Units nautical miles |
| NAV CLOSE FREQUENCY:index_get | action_NAV CLOSE FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerClosest Localizer course frequency. Requires an index value from 1 to 4 to set which NAV to target.: Units Hz |
| NAV CLOSE IDENT:index_get | action_NAV CLOSE IDENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerICAO code. Requires an index value from 1 to 4 to set which NAV to target.: Units null |
| NAV CLOSE LOCALIZER:index_get | action_NAV CLOSE LOCALIZER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerClosest Localizer course heading. Requires an index value from 1 to 4 to set which NAV to target.: Units degrees |
| NAV CLOSE NAME:index_get | action_NAV CLOSE NAME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDescriptive name. Requires an index value from 1 to 4 to set which NAV to target.: Units null |
| NAV CODES_get | action_NAV CODES_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns bit flags with the listed meaning.: Units Flags |
| NAV DME_get | action_NAV DME_get | Request the value, will be returned in a 'name_(Single) 'triggerDME distance.: Units nautical miles |
| NAV DMESPEED_get | action_NAV DMESPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerDME speed.: Units knots |
| NAV FREQUENCY_get | action_NAV FREQUENCY_get | Request the value, will be returned in a 'name_(Single) 'triggerLocalizer course frequency: Units Hz |
| NAV GLIDE SLOPE_get | action_NAV GLIDE SLOPE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe glide slope gradient. The value returned is an integer value formed as sin(slope) * 65536 * 2: Units number |
| NAV GLIDE SLOPE ERROR_get | action_NAV GLIDE SLOPE ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerDifference between current position and glideslope angle. Note that this provides 32 bit floating point precision, rather than the 8 bit integer precision of NAV GSI.: Units degrees |
| NAV GLIDE SLOPE LENGTH_get | action_NAV GLIDE SLOPE LENGTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe distance between the plane and the Glide beacon.: Units feet |
| NAV GS FLAG_get | action_NAV GS FLAG_get | Request the value, will be returned in a 'name_(Single) 'triggerGlideslope flag.: Units bool |
| NAV GSI_get | action_NAV GSI_get | Request the value, will be returned in a 'name_(Single) 'triggerGlideslope needle deflection (+/- 119). Note that this provides only 8 bit precision, whereas NAV GLIDE SLOPE ERROR provides 32 bit floating point precision.: Units number |
| NAV HAS CLOSE DME_get | action_NAV HAS CLOSE DME_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if found a close station with a DME.: Units bool |
| NAV HAS CLOSE LOCALIZER_get | action_NAV HAS CLOSE LOCALIZER_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if found a close localizer station.: Units bool |
| NAV HAS DME_get | action_NAV HAS DME_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if tuned station has a DME.: Units bool |
| NAV HAS GLIDE SLOPE_get | action_NAV HAS GLIDE SLOPE_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if tuned station has a glide slope.: Units bool |
| NAV HAS LOCALIZER_get | action_NAV HAS LOCALIZER_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if tuned station is a localizer.: Units bool |
| NAV HAS NAV_get | action_NAV HAS NAV_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if Nav has signal.: Units bool |
| NAV HAS TACAN_get | action_NAV HAS TACAN_get | Request the value, will be returned in a 'name_(Single) 'triggerFlag if Nav has a Tacan.: Units bool |
| NAV IDENT_get | action_NAV IDENT_get | Request the value, will be returned in a 'name_(Single) 'triggerICAO code.: Units null |
| NAV LOC AIRPORT IDENT_get | action_NAV LOC AIRPORT IDENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe airport ICAO ident for the localizer that is currently tuned on the nav radio (like 'EGLL' or 'KJFK'): Units null |
| NAV LOC RUNWAY DESIGNATOR_get | action_NAV LOC RUNWAY DESIGNATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerThe letter code for the runway that the currently tuned localizer is tuned to.: Units null |
| NAV LOC RUNWAY NUMBER_get | action_NAV LOC RUNWAY NUMBER_get | Request the value, will be returned in a 'name_(Single) 'triggerNAV LOC RUNWAY NUMBER - The number portion of the runway that the currently tuned localizer is tuned to (so if the runway was 15L, this would be 15).: Units null |
| NAV LOCALIZER_get | action_NAV LOCALIZER_get | Request the value, will be returned in a 'name_(Single) 'triggerLocalizer course heading.: Units degrees |
| NAV MAGVAR_get | action_NAV MAGVAR_get | Request the value, will be returned in a 'name_(Single) 'triggerMagnetic variation of tuned Nav station.: Units degrees |
| NAV NAME_get | action_NAV NAME_get | Request the value, will be returned in a 'name_(Single) 'triggerDescriptive name.: Units null |
| NAV OBS_get | action_NAV OBS_get | Request the value, will be returned in a 'name_(Single) 'triggerOBS setting. Index of 1 or 2.: Units degrees |
| NAV RADIAL_get | action_NAV RADIAL_get | Request the value, will be returned in a 'name_(Single) 'triggerRadial that aircraft is on.: Units degrees |
| NAV RADIAL ERROR_get | action_NAV RADIAL ERROR_get | Request the value, will be returned in a 'name_(Single) 'triggerDifference between current radial and OBS tuned radial.: Units degrees |
| NAV RAW GLIDE SLOPE_get | action_NAV RAW GLIDE SLOPE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe glide slope angle.: Units degrees |
| NAV RELATIVE BEARING TO STATION_get | action_NAV RELATIVE BEARING TO STATION_get | Request the value, will be returned in a 'name_(Single) 'triggerRelative bearing to station.: Units degrees |
| NAV SIGNAL_get | action_NAV SIGNAL_get | Request the value, will be returned in a 'name_(Single) 'triggerNav signal strength.: Units number |
| NAV SOUND:index_get | action_NAV SOUND:index_get | Request the value, will be returned in a 'name_(Single) 'triggerNav audio flag. Index of 1 or 2.: Units bool |
| NAV STANDBY FREQUENCY:index_get | action_NAV STANDBY FREQUENCY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerNav standby frequency. Index is 1 or 2.: Units MHz |
| NAV TOFROM_get | action_NAV TOFROM_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the Nav is going to or from the current radial (or is off).: Units enum |
| NAV VOLUME_get | action_NAV VOLUME_get | Request the value, will be returned in a 'name_(Single) 'triggerThe volume of the Nav radio.: Units percent |
| NAV VOR DISTANCE_get | action_NAV VOR DISTANCE_get | Request the value, will be returned in a 'name_(Single) 'triggerDistance of the VOR beacon.: Units meters |
| NEW ELECTRICAL SYSTEM_get | action_NEW ELECTRICAL SYSTEM_get | Request the value, will be returned in a 'name_(Single) 'triggerIs the aircraft using the new Electrical System or the legacy FSX one: Units bool |
| NOSEWHEEL LOCK ON_get | action_NOSEWHEEL LOCK ON_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the nosewheel lock is engaged. This can be set using the NosewheelLock parameter.: Units bool |
| NOSEWHEEL MAX STEERING ANGLE | action_NOSEWHEEL MAX STEERING ANGLE | Set the simvar Can be used to get or set the maximum permitted steering angle for the nose wheel of the aircraft: Units radians |
| NOSEWHEEL MAX STEERING ANGLE_get | action_NOSEWHEEL MAX STEERING ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerCan be used to get or set the maximum permitted steering angle for the nose wheel of the aircraft: Units radians |
| NUM SLING CABLES_get | action_NUM SLING CABLES_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of sling cables (not hoists) that are configured for the helicopter.: Units number |
| NUMBER OF CATAPULTS_get | action_NUMBER OF CATAPULTS_get | Request the value, will be returned in a 'name_(Single) 'triggerMaximum of 4. A model can contain more than 4 catapults, but only the first four will be read and recognized by the simulation: Units number |
| NUMBER OF ENGINES_get | action_NUMBER OF ENGINES_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of engines (minimum 0, maximum 4): Units number |
| ON ANY RUNWAY_get | action_ON ANY RUNWAY_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the plane is currently on a runway: Units bool |
| OUTER MARKER | action_OUTER MARKER | Set the simvar Outer marker state.: Units bool |
| OUTER MARKER_get | action_OUTER MARKER_get | Request the value, will be returned in a 'name_(Single) 'triggerOuter marker state.: Units bool |
| OVERSPEED WARNING_get | action_OVERSPEED WARNING_get | Request the value, will be returned in a 'name_(Single) 'triggerOverspeed warning state.: Units bool |
| PANEL ANTI ICE SWITCH_get | action_PANEL ANTI ICE SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if panel anti-ice switch is on.: Units bool |
| PANEL AUTO FEATHER SWITCH:index_get | action_PANEL AUTO FEATHER SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAuto-feather arming switch for the indexed engine: Units bool |
| PARTIAL PANEL ADF | action_PARTIAL PANEL ADF | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL ADF_get | action_PARTIAL PANEL ADF_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL AIRSPEED | action_PARTIAL PANEL AIRSPEED | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL AIRSPEED_get | action_PARTIAL PANEL AIRSPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL ALTIMETER | action_PARTIAL PANEL ALTIMETER | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL ALTIMETER_get | action_PARTIAL PANEL ALTIMETER_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL ATTITUDE | action_PARTIAL PANEL ATTITUDE | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL ATTITUDE_get | action_PARTIAL PANEL ATTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL AVIONICS_get | action_PARTIAL PANEL AVIONICS_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL COMM | action_PARTIAL PANEL COMM | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL COMM_get | action_PARTIAL PANEL COMM_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL COMPASS | action_PARTIAL PANEL COMPASS | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL COMPASS_get | action_PARTIAL PANEL COMPASS_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL ELECTRICAL | action_PARTIAL PANEL ELECTRICAL | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL ELECTRICAL_get | action_PARTIAL PANEL ELECTRICAL_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL ENGINE | action_PARTIAL PANEL ENGINE | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL ENGINE_get | action_PARTIAL PANEL ENGINE_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL FUEL INDICATOR_get | action_PARTIAL PANEL FUEL INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL HEADING | action_PARTIAL PANEL HEADING | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL HEADING_get | action_PARTIAL PANEL HEADING_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL NAV | action_PARTIAL PANEL NAV | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL NAV_get | action_PARTIAL PANEL NAV_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL PITOT | action_PARTIAL PANEL PITOT | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL PITOT_get | action_PARTIAL PANEL PITOT_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL TRANSPONDER | action_PARTIAL PANEL TRANSPONDER | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL TRANSPONDER_get | action_PARTIAL PANEL TRANSPONDER_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL TURN COORDINATOR_get | action_PARTIAL PANEL TURN COORDINATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL VACUUM | action_PARTIAL PANEL VACUUM | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL VACUUM_get | action_PARTIAL PANEL VACUUM_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PARTIAL PANEL VERTICAL VELOCITY | action_PARTIAL PANEL VERTICAL VELOCITY | Set the simvar Gauge fail flag.: Units enum |
| PARTIAL PANEL VERTICAL VELOCITY_get | action_PARTIAL PANEL VERTICAL VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerGauge fail flag.: Units enum |
| PAYLOAD STATION COUNT_get | action_PAYLOAD STATION COUNT_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of payload stations (1 to 15).: Units number |
| PAYLOAD STATION NAME:index_get | action_PAYLOAD STATION NAME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDescriptive name for payload station.: Units null |
| PAYLOAD STATION NUM SIMOBJECTS:index_get | action_PAYLOAD STATION NUM SIMOBJECTS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of objects at the payload station.: Units number |
| PAYLOAD STATION OBJECT:index_get | action_PAYLOAD STATION OBJECT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPlaces the named object at the payload station identified by the index (starting from 1). The string is the Container name (refer to the title property of Simulation Object Configuration Files).: Units null |
| PAYLOAD STATION WEIGHT:index | action_PAYLOAD STATION WEIGHT:index | Set the simvar Individual payload station weight.: Units pounds |
| PAYLOAD STATION WEIGHT:index_get | action_PAYLOAD STATION WEIGHT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerIndividual payload station weight.: Units pounds |
| PILOT TRANSMITTER TYPE_get | action_PILOT TRANSMITTER TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerOn which channel the pilot is transmitting.: Units enum |
| PILOT TRANSMITTING_get | action_PILOT TRANSMITTING_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the pilot is transmitting.: Units bool |
| PITOT HEAT_get | action_PITOT HEAT_get | Request the value, will be returned in a 'name_(Single) 'triggerPitot heat active.: Units bool |
| PITOT HEAT SWITCH:index_get | action_PITOT HEAT SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPitot heat switch state.: Units enum |
| PITOT ICE PCT_get | action_PITOT ICE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerAmount of pitot ice. 100 is fully iced.: Units percent Over 100 |
| PLANE ALT ABOVE GROUND | action_PLANE ALT ABOVE GROUND | Set the simvar Altitude above the surface: Units feet |
| PLANE ALT ABOVE GROUND_get | action_PLANE ALT ABOVE GROUND_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude above the surface: Units feet |
| PLANE ALT ABOVE GROUND MINUS CG | action_PLANE ALT ABOVE GROUND MINUS CG | Set the simvar Altitude above the surface minus CG: Units feet |
| PLANE ALT ABOVE GROUND MINUS CG_get | action_PLANE ALT ABOVE GROUND MINUS CG_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude above the surface minus CG: Units feet |
| PLANE ALTITUDE | action_PLANE ALTITUDE | Set the simvar Altitude of aircraft: Units feet |
| PLANE ALTITUDE_get | action_PLANE ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerAltitude of aircraft: Units feet |
| PLANE BANK DEGREES | action_PLANE BANK DEGREES | Set the simvar Bank angle, although the name mentions degrees the units used are radians: Units radians |
| PLANE BANK DEGREES_get | action_PLANE BANK DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerBank angle, although the name mentions degrees the units used are radians: Units radians |
| PLANE HEADING DEGREES GYRO | action_PLANE HEADING DEGREES GYRO | Set the simvar Heading indicator (directional gyro) indication.: Units radians |
| PLANE HEADING DEGREES GYRO_get | action_PLANE HEADING DEGREES GYRO_get | Request the value, will be returned in a 'name_(Single) 'triggerHeading indicator (directional gyro) indication.: Units radians |
| PLANE HEADING DEGREES MAGNETIC | action_PLANE HEADING DEGREES MAGNETIC | Set the simvar Heading relative to magnetic north - although the name mentions degrees the units used are radians: Units radians |
| PLANE HEADING DEGREES MAGNETIC_get | action_PLANE HEADING DEGREES MAGNETIC_get | Request the value, will be returned in a 'name_(Single) 'triggerHeading relative to magnetic north - although the name mentions degrees the units used are radians: Units radians |
| PLANE HEADING DEGREES TRUE | action_PLANE HEADING DEGREES TRUE | Set the simvar Heading relative to true north - although the name mentions degrees the units used are radians: Units radians |
| PLANE HEADING DEGREES TRUE_get | action_PLANE HEADING DEGREES TRUE_get | Request the value, will be returned in a 'name_(Single) 'triggerHeading relative to true north - although the name mentions degrees the units used are radians: Units radians |
| PLANE IN PARKING STATE_get | action_PLANE IN PARKING STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the plane is currently parked (true) or not (false): Units bool |
| PLANE LATITUDE | action_PLANE LATITUDE | Set the simvar Latitude of aircraft, North is positive, South negative: Units radians |
| PLANE LATITUDE_get | action_PLANE LATITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerLatitude of aircraft, North is positive, South negative: Units radians |
| PLANE LONGITUDE | action_PLANE LONGITUDE | Set the simvar Longitude of aircraft, East is positive, West negative: Units radians |
| PLANE LONGITUDE_get | action_PLANE LONGITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitude of aircraft, East is positive, West negative: Units radians |
| PLANE PITCH DEGREES | action_PLANE PITCH DEGREES | Set the simvar Pitch angle, although the name mentions degrees the units used are radians: Units radians |
| PLANE PITCH DEGREES_get | action_PLANE PITCH DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerPitch angle, although the name mentions degrees the units used are radians: Units radians |
| PLANE TOUCHDOWN BANK DEGREES | action_PLANE TOUCHDOWN BANK DEGREES | Set the simvar This float represents the bank of the player's plane from the last touchdown: Units degrees |
| PLANE TOUCHDOWN BANK DEGREES_get | action_PLANE TOUCHDOWN BANK DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the bank of the player's plane from the last touchdown: Units degrees |
| PLANE TOUCHDOWN HEADING DEGREES MAGNETIC_get | action_PLANE TOUCHDOWN HEADING DEGREES MAGNETIC_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the magnetic heading of the player's plane from the last touchdown: Units degrees |
| PLANE TOUCHDOWN HEADING DEGREES TRUE_get | action_PLANE TOUCHDOWN HEADING DEGREES TRUE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the true heading of the player's plane from the last touchdown: Units degrees |
| PLANE TOUCHDOWN LATITUDE_get | action_PLANE TOUCHDOWN LATITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the plane latitude for the last touchdown: Units radians |
| PLANE TOUCHDOWN LONGITUDE_get | action_PLANE TOUCHDOWN LONGITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the plane longitude for the last touchdown: Units radians |
| PLANE TOUCHDOWN NORMAL VELOCITY_get | action_PLANE TOUCHDOWN NORMAL VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the player's plane speed according to ground normal from the last touchdown: Units feet |
| PLANE TOUCHDOWN PITCH DEGREES_get | action_PLANE TOUCHDOWN PITCH DEGREES_get | Request the value, will be returned in a 'name_(Single) 'triggerThis float represents the pitch of the player's plane from the last touchdown: Units degrees |
| PRESSURE ALTITUDE_get | action_PRESSURE ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerStandard Altitude, ie: at a 1013.25 hPa (1 atmosphere) setting.: Units meters |
| PRESSURIZATION CABIN ALTITUDE_get | action_PRESSURIZATION CABIN ALTITUDE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current altitude of the cabin pressurization.: Units feet |
| PRESSURIZATION CABIN ALTITUDE GOAL_get | action_PRESSURIZATION CABIN ALTITUDE GOAL_get | Request the value, will be returned in a 'name_(Single) 'triggerThe set altitude of the cabin pressurization.: Units feet |
| PRESSURIZATION CABIN ALTITUDE RATE_get | action_PRESSURIZATION CABIN ALTITUDE RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rate at which cabin pressurization changes.: Units feet per second |
| PRESSURIZATION DUMP SWITCH_get | action_PRESSURIZATION DUMP SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the cabin pressurization dump switch is on.: Units bool |
| PRESSURIZATION PRESSURE DIFFERENTIAL_get | action_PRESSURIZATION PRESSURE DIFFERENTIAL_get | Request the value, will be returned in a 'name_(Single) 'triggerThe difference in pressure between the set altitude pressurization and the current pressurization.: Units pounds |
| PROP AUTO CRUISE ACTIVE_get | action_PROP AUTO CRUISE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if prop auto cruise active: Units bool |
| PROP AUTO FEATHER ARMED:index_get | action_PROP AUTO FEATHER ARMED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAuto-feather armed state for the indexed engine: Units bool |
| PROP BETA FORCED ACTIVE | action_PROP BETA FORCED ACTIVE | Set the simvar This can be used to enable the propeller forced beta mode (1, TRUE) or disable it (0, FALSE), when being written to. When being read from, it will return TRUE (1) if the forced beta mode is enabled or FALSE (0) if it isn't. When enabled, the PROP BETA FORCED POSITION value will be used to drive the prop beta, while the internal coded simulation logic is used when this is disabled: Units bool |
| PROP BETA FORCED ACTIVE_get | action_PROP BETA FORCED ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to enable the propeller forced beta mode (1, TRUE) or disable it (0, FALSE), when being written to. When being read from, it will return TRUE (1) if the forced beta mode is enabled or FALSE (0) if it isn't. When enabled, the PROP BETA FORCED POSITION value will be used to drive the prop beta, while the internal coded simulation logic is used when this is disabled: Units bool |
| PROP BETA FORCED POSITION_get | action_PROP BETA FORCED POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerGet or set the beta at which the prop is forced. Only valid when PROP BETA FORCED ACTIVE is TRUE (1): Units radians |
| PROP BETA MAX_get | action_PROP BETA MAX_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "prop beta" is the pitch of the blades of the propeller. This retrieves the maximum possible pitch value for all engines: Units radians |
| PROP BETA MIN_get | action_PROP BETA MIN_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value for all engines: Units radians |
| PROP BETA MIN REVERSE_get | action_PROP BETA MIN REVERSE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "prop beta" is the pitch of the blades of the propeller. This retrieves the minimum possible pitch value when the propeller is in reverse for all engines: Units radians |
| PROP BETA:index | action_PROP BETA:index | Set the simvar The "prop beta" is the pitch of the blades of the propeller, and this can be used to retrieve the current pitch setting, per indexed engine: Units radians |
| PROP BETA:index_get | action_PROP BETA:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "prop beta" is the pitch of the blades of the propeller, and this can be used to retrieve the current pitch setting, per indexed engine: Units radians |
| PROP DEICE SWITCH:index_get | action_PROP DEICE SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if prop deice switch on for the indexed engine: Units bool |
| PROP FEATHER SWITCH:index_get | action_PROP FEATHER SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerProp feather switch for the indexed engine: Units bool |
| PROP FEATHERED:index_get | action_PROP FEATHERED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will return the feathered state of the propeller for an indexed engine. The state is either feathered (true) or not (false): Units bool |
| PROP FEATHERING INHIBIT:index_get | action_PROP FEATHERING INHIBIT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFeathering inhibit flag for the indexed engine: Units bool |
| PROP MAX RPM PERCENT:index | action_PROP MAX RPM PERCENT:index | Set the simvar Percent of max rated rpm for the indexed engine: Units percent |
| PROP MAX RPM PERCENT:index_get | action_PROP MAX RPM PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max rated rpm for the indexed engine: Units percent |
| PROP ROTATION ANGLE_get | action_PROP ROTATION ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerProp rotation angle: Units radians |
| PROP RPM:index | action_PROP RPM:index | Set the simvar Propeller rpm for the indexed engine: Units RPM |
| PROP RPM:index_get | action_PROP RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPropeller rpm for the indexed engine: Units RPM |
| PROP SYNC ACTIVE:index_get | action_PROP SYNC ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if prop sync is active the indexed engine: Units bool |
| PROP SYNC DELTA LEVER:index_get | action_PROP SYNC DELTA LEVER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCorrected prop correction input on slaved engine for the indexed engine: Units position |
| PROP THRUST:index_get | action_PROP THRUST:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPropeller thrust for the indexed engine: Units pounds |
| PUSHBACK ANGLE_get | action_PUSHBACK ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerPushback angle (the heading of the tug).: Units radians |
| PUSHBACK ATTACHED_get | action_PUSHBACK ATTACHED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if this vehicle is attached to an aircraft.: Units bool |
| PUSHBACK AVAILABLE_get | action_PUSHBACK AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if a push back is available on the parking space.: Units bool |
| PUSHBACK CONTACTX_get | action_PUSHBACK CONTACTX_get | Request the value, will be returned in a 'name_(Single) 'triggerThe towpoint position, relative to the aircrafts datum reference point.: Units feet |
| PUSHBACK CONTACTY_get | action_PUSHBACK CONTACTY_get | Request the value, will be returned in a 'name_(Single) 'triggerPushback contact position in vertical direction.: Units feet |
| PUSHBACK CONTACTZ_get | action_PUSHBACK CONTACTZ_get | Request the value, will be returned in a 'name_(Single) 'triggerPushback contact position in fore/aft direction.: Units feet |
| PUSHBACK STATE:index_get | action_PUSHBACK STATE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerType of pushback.: Units enum |
| PUSHBACK WAIT_get | action_PUSHBACK WAIT_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if waiting for pushback.: Units bool |
| RAD INS SWITCH_get | action_RAD INS SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if Rad INS switch on.: Units bool |
| RADIO HEIGHT_get | action_RADIO HEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerRadar altitude.: Units feet |
| REALISM | action_REALISM | Set the simvar General realism percent.: Units number |
| REALISM_get | action_REALISM_get | Request the value, will be returned in a 'name_(Single) 'triggerGeneral realism percent.: Units number |
| REALISM CRASH DETECTION_get | action_REALISM CRASH DETECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue indicates crash detection is turned on.: Units bool |
| REALISM CRASH WITH OTHERS_get | action_REALISM CRASH WITH OTHERS_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue indicates crashing with other aircraft is possible.: Units bool |
| RECIP CARBURETOR TEMPERATURE:index | action_RECIP CARBURETOR TEMPERATURE:index | Set the simvar Carburetor temperature the indexed engine: Units celsius |
| RECIP CARBURETOR TEMPERATURE:index_get | action_RECIP CARBURETOR TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCarburetor temperature the indexed engine: Units celsius |
| RECIP ENG ALTERNATE AIR POSITION:index | action_RECIP ENG ALTERNATE AIR POSITION:index | Set the simvar Alternate air control the indexed engine: Units position |
| RECIP ENG ALTERNATE AIR POSITION:index_get | action_RECIP ENG ALTERNATE AIR POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAlternate air control the indexed engine: Units position |
| RECIP ENG ANTIDETONATION FLOW RATE:index_get | action_RECIP ENG ANTIDETONATION FLOW RATE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis gives the actual flow rate of the Anti Detonation system for the indexed engine: Units gallons per hour |
| RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index_get | action_RECIP ENG ANTIDETONATION TANK MAX QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe maximum quantity of water/methanol mixture in the ADI tank for the indexed engine. This value is set as part of the [ANTIDETONATION_SYSTEM.N] section in the aircraft configuration files: Units gallons |
| RECIP ENG ANTIDETONATION TANK QUANTITY:index | action_RECIP ENG ANTIDETONATION TANK QUANTITY:index | Set the simvar The quantity of water/methanol mixture currently in the ADI tank for the indexed engine: Units gallons |
| RECIP ENG ANTIDETONATION TANK QUANTITY:index_get | action_RECIP ENG ANTIDETONATION TANK QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe quantity of water/methanol mixture currently in the ADI tank for the indexed engine: Units gallons |
| RECIP ENG ANTIDETONATION TANK VALVE:index | action_RECIP ENG ANTIDETONATION TANK VALVE:index | Set the simvar The status of the ADI tank valve for the indexed engine: Units bool |
| RECIP ENG ANTIDETONATION TANK VALVE:index_get | action_RECIP ENG ANTIDETONATION TANK VALVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe status of the ADI tank valve for the indexed engine: Units bool |
| RECIP ENG BRAKE POWER:index | action_RECIP ENG BRAKE POWER:index | Set the simvar Brake power produced by the indexed engine: Units pounds |
| RECIP ENG BRAKE POWER:index_get | action_RECIP ENG BRAKE POWER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerBrake power produced by the indexed engine: Units pounds |
| RECIP ENG COOLANT RESERVOIR PERCENT:index | action_RECIP ENG COOLANT RESERVOIR PERCENT:index | Set the simvar Percent coolant available for the indexed engine: Units percent |
| RECIP ENG COOLANT RESERVOIR PERCENT:index_get | action_RECIP ENG COOLANT RESERVOIR PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent coolant available for the indexed engine: Units percent |
| RECIP ENG COWL FLAP POSITION:index | action_RECIP ENG COWL FLAP POSITION:index | Set the simvar Percent cowl flap opened for the indexed engine: Units percent |
| RECIP ENG COWL FLAP POSITION:index_get | action_RECIP ENG COWL FLAP POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent cowl flap opened for the indexed engine: Units percent |
| RECIP ENG CYLINDER HEAD TEMPERATURE:index | action_RECIP ENG CYLINDER HEAD TEMPERATURE:index | Set the simvar Engine cylinder head temperature for the indexed engine: Units celsius |
| RECIP ENG CYLINDER HEAD TEMPERATURE:index_get | action_RECIP ENG CYLINDER HEAD TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerEngine cylinder head temperature for the indexed engine: Units celsius |
| RECIP ENG CYLINDER HEALTH:index_get | action_RECIP ENG CYLINDER HEALTH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex high 16 bits is engine number, low16 cylinder number, both indexed from 1: Units percent Over 100 |
| RECIP ENG DETONATING:index_get | action_RECIP ENG DETONATING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerSet to 1 (TRUE) if the indexed engine is detonating: Units bool |
| RECIP ENG EMERGENCY BOOST ACTIVE:index | action_RECIP ENG EMERGENCY BOOST ACTIVE:index | Set the simvar Whether emergency boost is active (1, TRUE) or not (0, FALSE) for the indexed engine: Units bool |
| RECIP ENG EMERGENCY BOOST ACTIVE:index_get | action_RECIP ENG EMERGENCY BOOST ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether emergency boost is active (1, TRUE) or not (0, FALSE) for the indexed engine: Units bool |
| RECIP ENG EMERGENCY BOOST ELAPSED TIME:index | action_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index | Set the simvar  The elapsed time that emergency boost has been active on the indexed engine. The timer will start when boost is first activated: Units hours |
| RECIP ENG EMERGENCY BOOST ELAPSED TIME:index_get | action_RECIP ENG EMERGENCY BOOST ELAPSED TIME:index_get | Request the value, will be returned in a 'name_(Single) 'trigger The elapsed time that emergency boost has been active on the indexed engine. The timer will start when boost is first activated: Units hours |
| RECIP ENG ENGINE MASTER SWITCH:index_get | action_RECIP ENG ENGINE MASTER SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Engine Master switch is active on an indexed engine: Units bool |
| RECIP ENG FUEL AVAILABLE:index | action_RECIP ENG FUEL AVAILABLE:index | Set the simvar True if fuel is available for the indexed engine: Units bool |
| RECIP ENG FUEL AVAILABLE:index_get | action_RECIP ENG FUEL AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if fuel is available for the indexed engine: Units bool |
| RECIP ENG FUEL FLOW:index | action_RECIP ENG FUEL FLOW:index | Set the simvar The indexed engine fuel flow: Units pounds per hour |
| RECIP ENG FUEL FLOW:index_get | action_RECIP ENG FUEL FLOW:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine fuel flow: Units pounds per hour |
| RECIP ENG FUEL NUMBER TANKS USED:index_get | action_RECIP ENG FUEL NUMBER TANKS USED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of tanks currently being used by the indexed engine: Units number |
| RECIP ENG FUEL TANK SELECTOR:index_get | action_RECIP ENG FUEL TANK SELECTOR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum |
| RECIP ENG FUEL TANKS USED:index | action_RECIP ENG FUEL TANKS USED:index | Set the simvar Fuel tanks used by the indexed engine, one or more bit flags: Units mask |
| RECIP ENG FUEL TANKS USED:index_get | action_RECIP ENG FUEL TANKS USED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel tanks used by the indexed engine, one or more bit flags: Units mask |
| RECIP ENG GLOW PLUG ACTIVE:index_get | action_RECIP ENG GLOW PLUG ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Glow Plug is active on the indexed engine: Units bool |
| RECIP ENG LEFT MAGNETO:index | action_RECIP ENG LEFT MAGNETO:index | Set the simvar  Left magneto state for the indexed engine: Units bool |
| RECIP ENG LEFT MAGNETO:index_get | action_RECIP ENG LEFT MAGNETO:index_get | Request the value, will be returned in a 'name_(Single) 'trigger Left magneto state for the indexed engine: Units bool |
| RECIP ENG MANIFOLD PRESSURE:index | action_RECIP ENG MANIFOLD PRESSURE:index | Set the simvar The indexed engine manifold pressure: Units pounds |
| RECIP ENG MANIFOLD PRESSURE:index_get | action_RECIP ENG MANIFOLD PRESSURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine manifold pressure: Units pounds |
| RECIP ENG NITROUS TANK MAX QUANTITY:index_get | action_RECIP ENG NITROUS TANK MAX QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe maximum quantity of nitrous permitted per indexed engine: Units gallons |
| RECIP ENG NITROUS TANK QUANTITY:index | action_RECIP ENG NITROUS TANK QUANTITY:index | Set the simvar The quantity of nitrous per indexed engine: Units gallons |
| RECIP ENG NITROUS TANK QUANTITY:index_get | action_RECIP ENG NITROUS TANK QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe quantity of nitrous per indexed engine: Units gallons |
| RECIP ENG NITROUS TANK VALVE | action_RECIP ENG NITROUS TANK VALVE | Set the simvar The statte of the nitrous tank valve for the indexed engine. Either 1 (TRUE) for open or 0 (FALSE) for closed: Units bool |
| RECIP ENG NITROUS TANK VALVE_get | action_RECIP ENG NITROUS TANK VALVE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe statte of the nitrous tank valve for the indexed engine. Either 1 (TRUE) for open or 0 (FALSE) for closed: Units bool |
| RECIP ENG NUM CYLINDERS FAILED:index_get | action_RECIP ENG NUM CYLINDERS FAILED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of cylinders that have failed in the indexed engine: Units number |
| RECIP ENG NUM CYLINDERS:index_get | action_RECIP ENG NUM CYLINDERS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of cylinders for the indexed engine: Units number |
| RECIP ENG PRIMER:index | action_RECIP ENG PRIMER:index | Set the simvar The indexed engine primer state: Units bool |
| RECIP ENG PRIMER:index_get | action_RECIP ENG PRIMER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine primer state: Units bool |
| RECIP ENG RADIATOR TEMPERATURE:index | action_RECIP ENG RADIATOR TEMPERATURE:index | Set the simvar The indexed engine radiator temperature: Units celsius |
| RECIP ENG RADIATOR TEMPERATURE:index_get | action_RECIP ENG RADIATOR TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine radiator temperature: Units celsius |
| RECIP ENG RIGHT MAGNETO:index | action_RECIP ENG RIGHT MAGNETO:index | Set the simvar  The indexed engine right magneto state: Units bool |
| RECIP ENG RIGHT MAGNETO:index_get | action_RECIP ENG RIGHT MAGNETO:index_get | Request the value, will be returned in a 'name_(Single) 'trigger The indexed engine right magneto state: Units bool |
| RECIP ENG STARTER TORQUE:index | action_RECIP ENG STARTER TORQUE:index | Set the simvar Torque produced by the indexed engine: Units foot pound |
| RECIP ENG STARTER TORQUE:index_get | action_RECIP ENG STARTER TORQUE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTorque produced by the indexed engine: Units foot pound |
| RECIP ENG SUPERCHARGER ACTIVE GEAR:index_get | action_RECIP ENG SUPERCHARGER ACTIVE GEAR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns which of the supercharger gears is engaged for the indexed engine: Units number |
| RECIP ENG TURBINE INLET TEMPERATURE:index | action_RECIP ENG TURBINE INLET TEMPERATURE:index | Set the simvar The indexed engine turbine inlet temperature: Units celsius |
| RECIP ENG TURBINE INLET TEMPERATURE:index_get | action_RECIP ENG TURBINE INLET TEMPERATURE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine turbine inlet temperature: Units celsius |
| RECIP ENG TURBOCHARGER FAILED:index | action_RECIP ENG TURBOCHARGER FAILED:index | Set the simvar The indexed engine turbo failed state: Units bool |
| RECIP ENG TURBOCHARGER FAILED:index_get | action_RECIP ENG TURBOCHARGER FAILED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine turbo failed state: Units bool |
| RECIP ENG WASTEGATE POSITION:index | action_RECIP ENG WASTEGATE POSITION:index | Set the simvar When the engine.cfg parameter turbocharged is TRUE, this SimVar will return the percentage that the turbo waste gate is closed for the indexed engine. If the turbocharged variable is FALSE and the manifold_pressure_regulator parameter is TRUE, then this will return the percentage that the manifold pressure regulator is closed for the indexed engine: Units percent |
| RECIP ENG WASTEGATE POSITION:index_get | action_RECIP ENG WASTEGATE POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhen the engine.cfg parameter turbocharged is TRUE, this SimVar will return the percentage that the turbo waste gate is closed for the indexed engine. If the turbocharged variable is FALSE and the manifold_pressure_regulator parameter is TRUE, then this will return the percentage that the manifold pressure regulator is closed for the indexed engine: Units percent |
| RECIP MAX CHT_get | action_RECIP MAX CHT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will return the cylinder head temperature value set by the cht_heating_constant parameter in the engine.cfg file: Units rankine |
| RECIP MIXTURE RATIO:index | action_RECIP MIXTURE RATIO:index | Set the simvar Fuel / Air mixture ratio for the indexed engine: Units ratio |
| RECIP MIXTURE RATIO:index_get | action_RECIP MIXTURE RATIO:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel / Air mixture ratio for the indexed engine: Units ratio |
| REJECTED TAKEOFF BRAKES ACTIVE_get | action_REJECTED TAKEOFF BRAKES ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the rejected takeoff brakes are currently active.: Units bool |
| RELATIVE WIND VELOCITY BODY X_get | action_RELATIVE WIND VELOCITY BODY X_get | Request the value, will be returned in a 'name_(Single) 'triggerLateral (X axis) speed relative to wind: Units feet |
| RELATIVE WIND VELOCITY BODY Y_get | action_RELATIVE WIND VELOCITY BODY Y_get | Request the value, will be returned in a 'name_(Single) 'triggerVertical (Y axis) speed relative to wind: Units feet |
| RELATIVE WIND VELOCITY BODY Z_get | action_RELATIVE WIND VELOCITY BODY Z_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitudinal (Z axis) speed relative to wind: Units feet |
| RETRACT FLOAT SWITCH_get | action_RETRACT FLOAT SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if retract float switch on: Units bool |
| RETRACT LEFT FLOAT EXTENDED_get | action_RETRACT LEFT FLOAT EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerIf aircraft has retractable floats: Units percent |
| RETRACT RIGHT FLOAT EXTENDED_get | action_RETRACT RIGHT FLOAT EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerIf aircraft has retractable floats: Units percent |
| RIGHT WHEEL ROTATION ANGLE_get | action_RIGHT WHEEL ROTATION ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerRight wheel rotation angle (rotation around the axis for the wheel): Units radians |
| RIGHT WHEEL RPM_get | action_RIGHT WHEEL RPM_get | Request the value, will be returned in a 'name_(Single) 'triggerRight landing gear rpm.: Units RPM |
| ROTATION ACCELERATION BODY X | action_ROTATION ACCELERATION BODY X | Set the simvar Rotation acceleration relative to aircraft X axis: Units radians per second squared |
| ROTATION ACCELERATION BODY X_get | action_ROTATION ACCELERATION BODY X_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation acceleration relative to aircraft X axis: Units radians per second squared |
| ROTATION ACCELERATION BODY Y | action_ROTATION ACCELERATION BODY Y | Set the simvar Rotation acceleration relative to aircraft Y axis: Units radians per second squared |
| ROTATION ACCELERATION BODY Y_get | action_ROTATION ACCELERATION BODY Y_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation acceleration relative to aircraft Y axis: Units radians per second squared |
| ROTATION ACCELERATION BODY Z | action_ROTATION ACCELERATION BODY Z | Set the simvar Rotation acceleration relative to aircraft Z axis: Units radians per second squared |
| ROTATION ACCELERATION BODY Z_get | action_ROTATION ACCELERATION BODY Z_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation acceleration relative to aircraft Z axis: Units radians per second squared |
| ROTATION VELOCITY BODY X | action_ROTATION VELOCITY BODY X | Set the simvar Rotation velocity relative to aircraft X axis: Units feet |
| ROTATION VELOCITY BODY X_get | action_ROTATION VELOCITY BODY X_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation velocity relative to aircraft X axis: Units feet |
| ROTATION VELOCITY BODY Y | action_ROTATION VELOCITY BODY Y | Set the simvar Rotation velocity relative to aircraft Y axis: Units feet |
| ROTATION VELOCITY BODY Y_get | action_ROTATION VELOCITY BODY Y_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation velocity relative to aircraft Y axis: Units feet |
| ROTATION VELOCITY BODY Z | action_ROTATION VELOCITY BODY Z | Set the simvar Rotation velocity relative to aircraft Z axis: Units feet |
| ROTATION VELOCITY BODY Z_get | action_ROTATION VELOCITY BODY Z_get | Request the value, will be returned in a 'name_(Single) 'triggerRotation velocity relative to aircraft Z axis: Units feet |
| ROTOR BRAKE ACTIVE_get | action_ROTOR BRAKE ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the rotor brake is active (1, TRUE) or not (0, FALSE).: Units bool |
| ROTOR BRAKE HANDLE POS_get | action_ROTOR BRAKE HANDLE POS_get | Request the value, will be returned in a 'name_(Single) 'triggerThe percentage actuated of the rotor brake handle.: Units percent Over 100 |
| ROTOR CHIP DETECTED_get | action_ROTOR CHIP DETECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the rotor chip is detected (1,TRUE) or not (0, FALSE).: Units bool |
| ROTOR CLUTCH ACTIVE_get | action_ROTOR CLUTCH ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the rotor clutch is active (1, TRUE) or not (0, FALSE).: Units bool |
| ROTOR CLUTCH SWITCH POS_get | action_ROTOR CLUTCH SWITCH POS_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor clutch switch position, either on (1 TRUE) or off (0, FALSE).: Units bool |
| ROTOR COLLECTIVE BLADE PITCH PCT_get | action_ROTOR COLLECTIVE BLADE PITCH PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor collective blade pitch.: Units percent Over 100 |
| ROTOR CYCLIC BLADE MAX PITCH POSITION_get | action_ROTOR CYCLIC BLADE MAX PITCH POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe position (angle) at which blade has the maximum cyclic pitch.: Units degrees |
| ROTOR CYCLIC BLADE PITCH PCT_get | action_ROTOR CYCLIC BLADE PITCH PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor cyclic blade (maximum) pitch.: Units percent Over 100 |
| ROTOR GOV ACTIVE_get | action_ROTOR GOV ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether the rotor governor is active (1, TRUE) or not (0, FALSE).: Units bool |
| ROTOR GOV SWITCH POS_get | action_ROTOR GOV SWITCH POS_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor governor switch position, either on (1 TRUE) or off (0, FALSE).: Units bool |
| ROTOR LATERAL TRIM PCT_get | action_ROTOR LATERAL TRIM PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor lateral trim percentage.: Units percent Over 100 |
| ROTOR LONGITUDINAL TRIM PCT_get | action_ROTOR LONGITUDINAL TRIM PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe rotor longitudinal trim percentage.: Units percent Over 100 |
| ROTOR ROTATION ANGLE:index_get | action_ROTOR ROTATION ANGLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRotor rotation angle of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units radians |
| ROTOR RPM PCT:index_get | action_ROTOR RPM PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent max rated rpm of the given rotor index. Index should be specified to 1 for main rotor and 2 for tail rotor.: Units percent Over 100 |
| ROTOR RPM:index_get | action_ROTOR RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed rotor RPM.: Units RPM |
| ROTOR TEMPERATURE_get | action_ROTOR TEMPERATURE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe main rotor transmission temperature.: Units rankine |
| RUDDER DEFLECTION_get | action_RUDDER DEFLECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| RUDDER DEFLECTION PCT_get | action_RUDDER DEFLECTION PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent deflection: Units percent Over 100 |
| RUDDER PEDAL INDICATOR_get | action_RUDDER PEDAL INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerRudder pedal position: Units position |
| RUDDER PEDAL POSITION | action_RUDDER PEDAL POSITION | Set the simvar Percent rudder pedal deflection (for animation): Units position |
| RUDDER PEDAL POSITION_get | action_RUDDER PEDAL POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent rudder pedal deflection (for animation): Units position |
| RUDDER POSITION | action_RUDDER POSITION | Set the simvar Percent rudder input deflection: Units position |
| RUDDER POSITION_get | action_RUDDER POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent rudder input deflection: Units position |
| RUDDER TRIM_get | action_RUDDER TRIM_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle deflection: Units radians |
| RUDDER TRIM DISABLED_get | action_RUDDER TRIM DISABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the Rudder Trim has been disabled: Units bool |
| RUDDER TRIM PCT | action_RUDDER TRIM PCT | Set the simvar The trim position of the rudder. Zero is no trim: Units percent Over 100 |
| RUDDER TRIM PCT_get | action_RUDDER TRIM PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe trim position of the rudder. Zero is no trim: Units percent Over 100 |
| SEA LEVEL PRESSURE_get | action_SEA LEVEL PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerBarometric pressure at sea level.: Units Millibars |
| SELECTED DME_get | action_SELECTED DME_get | Request the value, will be returned in a 'name_(Single) 'triggerSelected DME.: Units number |
| SEMIBODY LOADFACTOR Y_get | action_SEMIBODY LOADFACTOR Y_get | Request the value, will be returned in a 'name_(Single) 'triggerAcceleration along the axis Y divided by the gravity constant g (usually around 9.81m.s²): Units number |
| SEMIBODY LOADFACTOR YDOT_get | action_SEMIBODY LOADFACTOR YDOT_get | Request the value, will be returned in a 'name_(Single) 'triggerDerivative of SEMIBODY LOADFACTOR Y in relation to time.: Units number |
| SHUTOFF VALVE PULLED_get | action_SHUTOFF VALVE PULLED_get | Request the value, will be returned in a 'name_(Single) 'triggerThis checks if the shutoff valve to the engine has been pulled (true) or not (false). When pulled piston engines will be blocked from getting any fuel: Units bool |
| SIGMA SQRT_get | action_SIGMA SQRT_get | Request the value, will be returned in a 'name_(Single) 'triggerSigma sqrt: Units number |
| SIM DISABLED | action_SIM DISABLED | Set the simvar Is sim disabled.: Units bool |
| SIM DISABLED_get | action_SIM DISABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs sim disabled.: Units bool |
| SIM ON GROUND_get | action_SIM ON GROUND_get | Request the value, will be returned in a 'name_(Single) 'triggerOn ground flag.: Units bool |
| SIM SHOULD SET ON GROUND | action_SIM SHOULD SET ON GROUND | Set the simvar : Units bool |
| SIM SHOULD SET ON GROUND_get | action_SIM SHOULD SET ON GROUND_get | Request the value, will be returned in a 'name_(Single) 'trigger: Units bool |
| SIMULATED RADIUS_get | action_SIMULATED RADIUS_get | Request the value, will be returned in a 'name_(Single) 'triggerSimulated radius: Units feet |
| SLING CABLE BROKEN:index_get | action_SLING CABLE BROKEN:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTHis will be True (1) if the indexed cable is broken, or False (0) otherwise.: Units bool |
| SLING CABLE EXTENDED LENGTH:index | action_SLING CABLE EXTENDED LENGTH:index | Set the simvar The length of the indexed cable extending from the aircraft.: Units feet |
| SLING CABLE EXTENDED LENGTH:index_get | action_SLING CABLE EXTENDED LENGTH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe length of the indexed cable extending from the aircraft.: Units feet |
| SLING HOIST PERCENT DEPLOYED:index_get | action_SLING HOIST PERCENT DEPLOYED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe percentage of the full length of the sling cable deployed.: Units percent Over 100 |
| SLING HOIST SWITCH:index | action_SLING HOIST SWITCH:index | Set the simvar This will be True (1) if the hoist is enabled or False (0) otherwise.: Units bool |
| SLING HOIST SWITCH:index_get | action_SLING HOIST SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be True (1) if the hoist is enabled or False (0) otherwise.: Units bool |
| SLING HOOK IN PICKUP MODE_get | action_SLING HOOK IN PICKUP MODE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis will be True (1) if the hook is in pickup mode or False (0) otherwise. When True, the hook will be capable of picking up another object.: Units bool |
| SLOPE TO ATC RUNWAY_get | action_SLOPE TO ATC RUNWAY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe slope between the plane and the expected landing position of the runway. Returns 0 if no runway is assigned: Units radians |
| SMART CAMERA ACTIVE | action_SMART CAMERA ACTIVE | Set the simvar Sets/gets the whether the smart camera is active or not.: Units bool |
| SMART CAMERA ACTIVE_get | action_SMART CAMERA ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerSets/gets the whether the smart camera is active or not.: Units bool |
| SMART CAMERA INFO:index | action_SMART CAMERA INFO:index | Set the simvar Gets information on the smartcam system. The index sets what kind of information will be returned (or set).: Units number |
| SMART CAMERA INFO:index_get | action_SMART CAMERA INFO:index_get | Request the value, will be returned in a 'name_(Single) 'triggerGets information on the smartcam system. The index sets what kind of information will be returned (or set).: Units number |
| SMART CAMERA LIST DESCRIPTION:index_get | action_SMART CAMERA LIST DESCRIPTION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis returns a localized string that represents the smartcam target specified by the given index. Indices count from 0 so index 0 is the first target in the list. 	String: Units null |
| SMART CAMERA LIST:index | action_SMART CAMERA LIST:index | Set the simvar Retrieves the type of target for the indexed position in the smartcam list, counting from 0 (so index 0 is the first target in the list).: Units enum |
| SMART CAMERA LIST:index_get | action_SMART CAMERA LIST:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRetrieves the type of target for the indexed position in the smartcam list, counting from 0 (so index 0 is the first target in the list).: Units enum |
| SMOKE ENABLE | action_SMOKE ENABLE | Set the simvar Set to True to activate the smoke system, if one is available. Please see the notes for SMOKESYSTEM AVAILABLE for more information.: Units bool |
| SMOKE ENABLE_get | action_SMOKE ENABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerSet to True to activate the smoke system, if one is available. Please see the notes for SMOKESYSTEM AVAILABLE for more information.: Units bool |
| SMOKESYSTEM AVAILABLE_get | action_SMOKESYSTEM AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerSmoke system available.: Units bool |
| SPEAKER ACTIVE_get | action_SPEAKER ACTIVE_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the speaker is active.: Units bool |
| SPOILER AVAILABLE_get | action_SPOILER AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if spoiler system available: Units bool |
| SPOILERS ARMED_get | action_SPOILERS ARMED_get | Request the value, will be returned in a 'name_(Single) 'triggerChecks if autospoilers are armed (true) or not (false): Units bool |
| SPOILERS HANDLE POSITION_get | action_SPOILERS HANDLE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerSpoiler handle position: Units percent Over 100 |
| SPOILERS LEFT POSITION_get | action_SPOILERS LEFT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left spoiler deflected: Units percent Over 100 |
| SPOILERS RIGHT POSITION_get | action_SPOILERS RIGHT POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right spoiler deflected: Units percent Over 100 |
| STALL ALPHA_get | action_STALL ALPHA_get | Request the value, will be returned in a 'name_(Single) 'triggerThe angle of attack which produces the maximum lift coefficient before entering into stall conditions.: Units radians |
| STALL HORN AVAILABLE_get | action_STALL HORN AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if stall alarm available.: Units bool |
| STALL PROTECTION OFF LIMIT_get | action_STALL PROTECTION OFF LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerAlpha below which the Stall Protection can be disabled. See the [STALL PROTECTION] section for more information.: Units radians |
| STALL PROTECTION ON GOAL_get | action_STALL PROTECTION ON GOAL_get | Request the value, will be returned in a 'name_(Single) 'triggerThe alpha that the Stall Protection will attempt to reach when triggered. See the [STALL PROTECTION] section for more information.: Units radians |
| STALL PROTECTION ON LIMIT_get | action_STALL PROTECTION ON LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerAlpha above which the Stall Protection timer starts. See the [STALL PROTECTION] section for more information.: Units radians |
| STALL WARNING_get | action_STALL WARNING_get | Request the value, will be returned in a 'name_(Single) 'triggerStall warning state.: Units bool |
| STANDARD ATM TEMPERATURE_get | action_STANDARD ATM TEMPERATURE_get | Request the value, will be returned in a 'name_(Single) 'triggerOutside temperature on the standard ATM scale: Units rankine |
| STATIC CG TO GROUND_get | action_STATIC CG TO GROUND_get | Request the value, will be returned in a 'name_(Single) 'triggerStatic CG position with reference to the ground: Units feet |
| STATIC PITCH_get | action_STATIC PITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe angle at which static pitch stability is achieved.: Units radians |
| STEER INPUT CONTROL_get | action_STEER INPUT CONTROL_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of steering tiller: Units percent Over 100 |
| STROBES AVAILABLE_get | action_STROBES AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if strobe lights are available.: Units bool |
| STRUCT AMBIENT WIND_get | action_STRUCT AMBIENT WIND_get | Request the value, will be returned in a 'name_(Single) 'triggerX (latitude), Y (vertical) and Z (longitude) components of the wind.: Units feet per second |
| STRUCTURAL DEICE SWITCH_get | action_STRUCTURAL DEICE SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the aircraft structure deice switch is on.: Units bool |
| STRUCTURAL ICE PCT_get | action_STRUCTURAL ICE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerAmount of ice on aircraft structure. 100 is fully iced: Units percent Over 100 |
| SUCTION PRESSURE | action_SUCTION PRESSURE | Set the simvar Vacuum system suction pressure.: Units Inches of Mercury |
| SUCTION PRESSURE_get | action_SUCTION PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerVacuum system suction pressure.: Units Inches of Mercury |
| SURFACE CONDITION_get | action_SURFACE CONDITION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe state of the surface directly under the aircraft: Units enum |
| SURFACE INFO VALID_get | action_SURFACE INFO VALID_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue indicates that the SURFACE CONDITION return value is meaningful: Units bool |
| SURFACE RELATIVE GROUND SPEED_get | action_SURFACE RELATIVE GROUND SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerThe speed of the aircraft relative to the speed of the first surface directly underneath it. Use this to retrieve, for example, an aircraft's taxiing speed while it is moving on a moving carrier. It also applies to airborne aircraft, for example when a helicopter is successfully hovering above a moving ship, this value should be zero. The returned value will be the same as GROUND VELOCITY if the first surface beneath it is not moving: Units feet per second |
| SURFACE TYPE_get | action_SURFACE TYPE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe type of surface under the aircraft: Units enum |
| TACAN ACTIVE CHANNEL:index_get | action_TACAN ACTIVE CHANNEL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe active channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number |
| TACAN ACTIVE MODE:index_get | action_TACAN ACTIVE MODE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe active mode used by the indexed Tacan receiver on the aircraft, where 0 = X and 1 = Y.: Units bool |
| TACAN AVAILABLE:index_get | action_TACAN AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWill be TRUE (1) if NAV1, NAV2, NAV3 or NAV4 can receive Tacan (depending on the index - 1, 2, 3, or 4), or FALSE (0) otherwise.: Units bool |
| TACAN DRIVES NAV1:index_get | action_TACAN DRIVES NAV1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTells whether the Tacan is driving the Nav 1 indicator (TRUE, 1) or not (FALSE, 0), for autopilot purposes.: Units bool |
| TACAN OBS:index_get | action_TACAN OBS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe Tacan OBS setting, in degrees.: Units degrees |
| TACAN STANDBY CHANNEL:index_get | action_TACAN STANDBY CHANNEL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe standby channel used by the indexed Tacan receiver on the aircraft, from 1 to 127.: Units number |
| TACAN STANDBY MODE:index_get | action_TACAN STANDBY MODE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerIndicates the indexed Tacan receiver standby mode, where 0 = X and 1 = Y.: Units bool |
| TACAN STATION CDI:index_get | action_TACAN STATION CDI:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe CDI needle deflection amount(course deviation) to the station. Can be +/- 127.: Units number |
| TACAN STATION DISTANCE:index_get | action_TACAN STATION DISTANCE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe distance between the Tacan station position and the aircraft position. The index value refers to the Tacan receiver connected to the station (1 or 2).: Units meters |
| TACAN STATION IDENT:index_get | action_TACAN STATION IDENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe tuned station identifier for the indexed Tacan.: Units null |
| TACAN STATION RADIAL ERROR:index_get | action_TACAN STATION RADIAL ERROR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerDifference between the current radial and OBS tuned radial, in degrees.: Units degrees |
| TACAN STATION RADIAL:index_get | action_TACAN STATION RADIAL:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe radial between the Tacan station and the aircraft.: Units degrees |
| TACAN STATION TOFROM:index_get | action_TACAN STATION TOFROM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns whether the indexed Tacan is going to or from the current radial (or is off).: Units enum |
| TACAN VOLUME:index_get | action_TACAN VOLUME:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe volume value of the indexed Tacan receiver on the aircraft.: Units percent Over 100 |
| TAIL ROTOR BLADE PITCH PCT_get | action_TAIL ROTOR BLADE PITCH PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerThe pitch position of the tailrotor blades.: Units percent Over 100 |
| TAIL ROTOR PEDAL POSITION_get | action_TAIL ROTOR PEDAL POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent tail rotor pedal deflection.: Units percent Over 100 |
| TAILHOOK HANDLE_get | action_TAILHOOK HANDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the tailhook handle is engaged.: Units bool |
| TAILHOOK POSITION | action_TAILHOOK POSITION | Set the simvar Percent tail hook extended.: Units percent Over 100 |
| TAILHOOK POSITION_get | action_TAILHOOK POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent tail hook extended.: Units percent Over 100 |
| TAILWHEEL LOCK ON_get | action_TAILWHEEL LOCK ON_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if tailwheel lock applied. This can be set using the TailwheelLock parameter.: Units bool |
| THROTTLE LOWER LIMIT_get | action_THROTTLE LOWER LIMIT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent throttle defining lower limit (negative for reverse thrust equipped airplanes): Units percent |
| TITLE_get | action_TITLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTitle from aircraft.cfg: Units null |
| TOE BRAKES AVAILABLE_get | action_TOE BRAKES AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if toe brakes are available: Units bool |
| TOTAL AIR TEMPERATURE_get | action_TOTAL AIR TEMPERATURE_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal air temperature is the air temperature at the front of the aircraft where the ram pressure from the speed of the aircraft is taken into account: Units celsius |
| TOTAL VELOCITY_get | action_TOTAL VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerVelocity regardless of direction. For example, if a helicopter is ascending vertically at 100 fps, getting this variable will return 100.: Units feet |
| TOTAL WEIGHT_get | action_TOTAL WEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal weight of the aircraft: Units pounds |
| TOTAL WEIGHT CROSS COUPLED MOI_get | action_TOTAL WEIGHT CROSS COUPLED MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal weight cross coupled moment of inertia: Units slugs |
| TOTAL WEIGHT PITCH MOI_get | action_TOTAL WEIGHT PITCH MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal weight pitch moment of inertia: Units slugs |
| TOTAL WEIGHT ROLL MOI_get | action_TOTAL WEIGHT ROLL MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal weight roll moment of inertia: Units slugs |
| TOTAL WEIGHT YAW MOI_get | action_TOTAL WEIGHT YAW MOI_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal weight yaw moment of inertia: Units slugs |
| TOTAL WORLD VELOCITY | action_TOTAL WORLD VELOCITY | Set the simvar Speed relative to the earths center.: Units feet per second |
| TOTAL WORLD VELOCITY_get | action_TOTAL WORLD VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerSpeed relative to the earths center.: Units feet per second |
| TOW CONNECTION_get | action_TOW CONNECTION_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if a towline is connected to both tow plane and glider: Units bool |
| TOW RELEASE HANDLE_get | action_TOW RELEASE HANDLE_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of tow release handle. 100 is fully deployed.: Units percent Over 100 |
| TRACK IR ENABLE | action_TRACK IR ENABLE | Set the simvar Returns true if Track IR is enabled or not.: Units bool |
| TRACK IR ENABLE_get | action_TRACK IR ENABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerReturns true if Track IR is enabled or not.: Units bool |
| TRAILING EDGE FLAPS LEFT ANGLE_get | action_TRAILING EDGE FLAPS LEFT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle left trailing edge flap extended. Use TRAILING_EDGE_FLAPS_LEFT_PERCENT to set a value: Units radians |
| TRAILING EDGE FLAPS LEFT INDEX_get | action_TRAILING EDGE FLAPS LEFT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of left trailing edge flap position: Units number |
| TRAILING EDGE FLAPS LEFT PERCENT | action_TRAILING EDGE FLAPS LEFT PERCENT | Set the simvar Percent left trailing edge flap extended: Units percent Over 100 |
| TRAILING EDGE FLAPS LEFT PERCENT_get | action_TRAILING EDGE FLAPS LEFT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent left trailing edge flap extended: Units percent Over 100 |
| TRAILING EDGE FLAPS RIGHT ANGLE_get | action_TRAILING EDGE FLAPS RIGHT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerAngle right trailing edge flap extended. Use TRAILING_EDGE_FLAPS_RIGHT_PERCENT to set a value: Units radians |
| TRAILING EDGE FLAPS RIGHT INDEX_get | action_TRAILING EDGE FLAPS RIGHT INDEX_get | Request the value, will be returned in a 'name_(Single) 'triggerIndex of right trailing edge flap position: Units number |
| TRAILING EDGE FLAPS RIGHT PERCENT | action_TRAILING EDGE FLAPS RIGHT PERCENT | Set the simvar Percent right trailing edge flap extended: Units percent Over 100 |
| TRAILING EDGE FLAPS RIGHT PERCENT_get | action_TRAILING EDGE FLAPS RIGHT PERCENT_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent right trailing edge flap extended: Units percent Over 100 |
| TRAILING EDGE FLAPS0 LEFT ANGLE_get | action_TRAILING EDGE FLAPS0 LEFT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTESTING: Units radians |
| TRAILING EDGE FLAPS0 RIGHT ANGLE_get | action_TRAILING EDGE FLAPS0 RIGHT ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTESTING: Units radians |
| TRANSPONDER AVAILABLE_get | action_TRANSPONDER AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if a transponder is available.: Units bool |
| TRANSPONDER CODE:index_get | action_TRANSPONDER CODE:index_get | Request the value, will be returned in a 'name_(Single) 'trigger4-digit code.: Units number |
| TRANSPONDER IDENT | action_TRANSPONDER IDENT | Set the simvar This can set the Ident transponder using the KEY_XPNDR_IDENT_SET, KEY_XPNDR_IDENT_TOGGLE, KEY_XPNDR_IDENT_ON or KEY_XPNDR_IDENT_OFF Event IDs (see XPNDR (Transponder) section for more information). When set to true, it will automatically turn false after 18 seconds.: Units bool |
| TRANSPONDER IDENT_get | action_TRANSPONDER IDENT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can set the Ident transponder using the KEY_XPNDR_IDENT_SET, KEY_XPNDR_IDENT_TOGGLE, KEY_XPNDR_IDENT_ON or KEY_XPNDR_IDENT_OFF Event IDs (see XPNDR (Transponder) section for more information). When set to true, it will automatically turn false after 18 seconds.: Units bool |
| TRANSPONDER STATE | action_TRANSPONDER STATE | Set the simvar Transponder State.: Units enum |
| TRANSPONDER STATE_get | action_TRANSPONDER STATE_get | Request the value, will be returned in a 'name_(Single) 'triggerTransponder State.: Units enum |
| TRUE AIRSPEED SELECTED | action_TRUE AIRSPEED SELECTED | Set the simvar True if True Airspeed has been selected.: Units bool |
| TRUE AIRSPEED SELECTED_get | action_TRUE AIRSPEED SELECTED_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if True Airspeed has been selected.: Units bool |
| TURB ENG AFTERBURNER PCT ACTIVE:index_get | action_TURB ENG AFTERBURNER PCT ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe percentage that the afterburner is running at: Units percent Over 100 |
| TURB ENG AFTERBURNER STAGE ACTIVE:index_get | action_TURB ENG AFTERBURNER STAGE ACTIVE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe stage of the afterburner, or 0 if the afterburner is not active: Units number |
| TURB ENG AFTERBURNER:index_get | action_TURB ENG AFTERBURNER:index_get | Request the value, will be returned in a 'name_(Single) 'triggerAfterburner state for the indexed engine: Units bool |
| TURB ENG BLEED AIR:index_get | action_TURB ENG BLEED AIR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerBleed air pressure for the indexed engine: Units pounds |
| TURB ENG COMMANDED N1:index | action_TURB ENG COMMANDED N1:index | Set the simvar  Effective commanded N1 for the indexed turbine engine: Units percent |
| TURB ENG COMMANDED N1:index_get | action_TURB ENG COMMANDED N1:index_get | Request the value, will be returned in a 'name_(Single) 'trigger Effective commanded N1 for the indexed turbine engine: Units percent |
| TURB ENG CONDITION LEVER POSITION:index | action_TURB ENG CONDITION LEVER POSITION:index | Set the simvar  See documentation: Units enum |
| TURB ENG CONDITION LEVER POSITION:index_get | action_TURB ENG CONDITION LEVER POSITION:index_get | Request the value, will be returned in a 'name_(Single) 'trigger See documentation: Units enum |
| TURB ENG CORRECTED FF:index | action_TURB ENG CORRECTED FF:index | Set the simvar Corrected fuel flow for the indexed engine: Units pounds per hour |
| TURB ENG CORRECTED FF:index_get | action_TURB ENG CORRECTED FF:index_get | Request the value, will be returned in a 'name_(Single) 'triggerCorrected fuel flow for the indexed engine: Units pounds per hour |
| TURB ENG CORRECTED N1:index | action_TURB ENG CORRECTED N1:index | Set the simvar The indexed turbine engine corrected N1: Units percent |
| TURB ENG CORRECTED N1:index_get | action_TURB ENG CORRECTED N1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed turbine engine corrected N1: Units percent |
| TURB ENG CORRECTED N2:index | action_TURB ENG CORRECTED N2:index | Set the simvar The indexed turbine engine corrected N2: Units percent |
| TURB ENG CORRECTED N2:index_get | action_TURB ENG CORRECTED N2:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed turbine engine corrected N2: Units percent |
| TURB ENG FREE TURBINE TORQUE:index | action_TURB ENG FREE TURBINE TORQUE:index | Set the simvar The amount of free torque for the indexed turbine engine: Units foot pound |
| TURB ENG FREE TURBINE TORQUE:index_get | action_TURB ENG FREE TURBINE TORQUE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe amount of free torque for the indexed turbine engine: Units foot pound |
| TURB ENG FUEL AVAILABLE:index_get | action_TURB ENG FUEL AVAILABLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if fuel is available for the indexed engine: Units bool |
| TURB ENG FUEL EFFICIENCY LOSS:index | action_TURB ENG FUEL EFFICIENCY LOSS:index | Set the simvar This is used to control the fuel efficiency loss of the indexed engine: Units percent |
| TURB ENG FUEL EFFICIENCY LOSS:index_get | action_TURB ENG FUEL EFFICIENCY LOSS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is used to control the fuel efficiency loss of the indexed engine: Units percent |
| TURB ENG FUEL FLOW PPH:index_get | action_TURB ENG FUEL FLOW PPH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine fuel flow rate: Units pounds per hour |
| TURB ENG HIGH IDLE:index_get | action_TURB ENG HIGH IDLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRetrieves the high idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in high idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent |
| TURB ENG IGNITION SWITCH EX1:index_get | action_TURB ENG IGNITION SWITCH EX1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of the the indexed turbine engine Ignition Switch. Similar to TURB_ENG_IGNITION_SWITCH but differentiates between ON and AUTO: Units enum |
| TURB ENG IGNITION SWITCH:index_get | action_TURB ENG IGNITION SWITCH:index_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the the indexed turbine engine ignition switch is on: Units bool |
| TURB ENG IS IGNITING:index_get | action_TURB ENG IS IGNITING:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWhether or not the ignition system is currently running for the indexed engine. Depends on TURB_ENG_IGNITION_SWITCH_EX1 Enum, the cfg var ignition_auto_type and current state of the plane: Units bool |
| TURB ENG ITT COOLING EFFICIENCY LOSS:index | action_TURB ENG ITT COOLING EFFICIENCY LOSS:index | Set the simvar This is used to control the ITT cooling efficiency loss of the indexed engine: Units percent |
| TURB ENG ITT COOLING EFFICIENCY LOSS:index_get | action_TURB ENG ITT COOLING EFFICIENCY LOSS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is used to control the ITT cooling efficiency loss of the indexed engine: Units percent |
| TURB ENG ITT:index | action_TURB ENG ITT:index | Set the simvar Retrieve or set the ITT for the indexed engine: Units rankine |
| TURB ENG ITT:index_get | action_TURB ENG ITT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRetrieve or set the ITT for the indexed engine: Units rankine |
| TURB ENG JET THRUST:index_get | action_TURB ENG JET THRUST:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine jet thrust: Units pounds |
| TURB ENG LOW IDLE:index_get | action_TURB ENG LOW IDLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerRetrieves the low idle N1 value to be reached by the the indexed turboprop engine with throttle in idle position and condition lever in low idle position (condition lever position can be checked or set using the TURB_ENG_CONDITION_LEVER_POSITION SimVar): Units percent |
| TURB ENG MASTER STARTER SWITCH_get | action_TURB ENG MASTER STARTER SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the turbine engine master starter switch is on, false otherwise: Units bool |
| TURB ENG MAX TORQUE PERCENT:index | action_TURB ENG MAX TORQUE PERCENT:index | Set the simvar Percent of max rated torque for the indexed engine: Units percent |
| TURB ENG MAX TORQUE PERCENT:index_get | action_TURB ENG MAX TORQUE PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent of max rated torque for the indexed engine: Units percent |
| TURB ENG N1 LOSS:index | action_TURB ENG N1 LOSS:index | Set the simvar This is used to control the N1 loss of the indexed engine: Units percent |
| TURB ENG N1 LOSS:index_get | action_TURB ENG N1 LOSS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is used to control the N1 loss of the indexed engine: Units percent |
| TURB ENG N1:index | action_TURB ENG N1:index | Set the simvar The indexed turbine engine N1 value: Units percent |
| TURB ENG N1:index_get | action_TURB ENG N1:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed turbine engine N1 value: Units percent |
| TURB ENG N2:index | action_TURB ENG N2:index | Set the simvar  The indexed turbine engine N2 value: Units percent |
| TURB ENG N2:index_get | action_TURB ENG N2:index_get | Request the value, will be returned in a 'name_(Single) 'trigger The indexed turbine engine N2 value: Units percent |
| TURB ENG NUM TANKS USED:index_get | action_TURB ENG NUM TANKS USED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerNumber of tanks currently being used by the indexed engine: Units number |
| TURB ENG PRESSURE RATIO:index | action_TURB ENG PRESSURE RATIO:index | Set the simvar The indexed engine pressure ratio: Units ratio |
| TURB ENG PRESSURE RATIO:index_get | action_TURB ENG PRESSURE RATIO:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed engine pressure ratio: Units ratio |
| TURB ENG PRIMARY NOZZLE PERCENT:index_get | action_TURB ENG PRIMARY NOZZLE PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent thrust of primary nozzle for the indexed engine: Units percent Over 100 |
| TURB ENG REVERSE NOZZLE PERCENT:index_get | action_TURB ENG REVERSE NOZZLE PERCENT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent thrust reverser nozzles deployed for the indexed engine: Units percent |
| TURB ENG TANK SELECTOR:index_get | action_TURB ENG TANK SELECTOR:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel tank selected for the indexed engine. See Fuel Tank Selection for a list of values: Units enum |
| TURB ENG TANKS USED:index_get | action_TURB ENG TANKS USED:index_get | Request the value, will be returned in a 'name_(Single) 'triggerFuel tanks used by the indexed engine: Units mask |
| TURB ENG THROTTLE COMMANDED N1:index | action_TURB ENG THROTTLE COMMANDED N1:index | Set the simvar  The indexed turbine engine commanded N1 for current throttle position: Units percent |
| TURB ENG THROTTLE COMMANDED N1:index_get | action_TURB ENG THROTTLE COMMANDED N1:index_get | Request the value, will be returned in a 'name_(Single) 'trigger The indexed turbine engine commanded N1 for current throttle position: Units percent |
| TURB ENG THRUST EFFICIENCY LOSS:index | action_TURB ENG THRUST EFFICIENCY LOSS:index | Set the simvar This can be used to control the thrust efficiency loss of the indexed engine, where a value of 0 is 100% of available thrust, and 100 is 0% available thrust: Units percent |
| TURB ENG THRUST EFFICIENCY LOSS:index_get | action_TURB ENG THRUST EFFICIENCY LOSS:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThis can be used to control the thrust efficiency loss of the indexed engine, where a value of 0 is 100% of available thrust, and 100 is 0% available thrust: Units percent |
| TURB ENG VIBRATION:index_get | action_TURB ENG VIBRATION:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe indexed turbine engine vibration value: Units number |
| TURB MAX ITT_get | action_TURB MAX ITT_get | Request the value, will be returned in a 'name_(Single) 'triggerRetrieve the itt_peak_temperature as set in the engine.cfg file: Units rankine |
| TURN COORDINATOR BALL_get | action_TURN COORDINATOR BALL_get | Request the value, will be returned in a 'name_(Single) 'triggerTurn coordinator ball position.: Units position 128 |
| TURN COORDINATOR BALL INV_get | action_TURN COORDINATOR BALL INV_get | Request the value, will be returned in a 'name_(Single) 'triggerTurn coordinator ball position inverted (upside down).: Units position 128 |
| TURN INDICATOR RATE_get | action_TURN INDICATOR RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerTurn indicator reading.: Units radians per second |
| TURN INDICATOR SWITCH_get | action_TURN INDICATOR SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if turn indicator switch is on.: Units bool |
| TYPICAL DESCENT RATE_get | action_TYPICAL DESCENT RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerthe typical (normal) descent rate for the aircraft.: Units feet |
| USER INPUT ENABLED | action_USER INPUT ENABLED | Set the simvar Is input allowed from the user.: Units bool |
| USER INPUT ENABLED_get | action_USER INPUT ENABLED_get | Request the value, will be returned in a 'name_(Single) 'triggerIs input allowed from the user.: Units bool |
| VARIOMETER MAC CREADY SETTING | action_VARIOMETER MAC CREADY SETTING | Set the simvar The MacCready setting used to fly an optimal speed between thermals.: Units Meters per second |
| VARIOMETER MAC CREADY SETTING_get | action_VARIOMETER MAC CREADY SETTING_get | Request the value, will be returned in a 'name_(Single) 'triggerThe MacCready setting used to fly an optimal speed between thermals.: Units Meters per second |
| VARIOMETER NETTO_get | action_VARIOMETER NETTO_get | Request the value, will be returned in a 'name_(Single) 'triggerVariometer rate using Netto (Total Energy - polar sinkRate).: Units feet per second |
| VARIOMETER RATE_get | action_VARIOMETER RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe variometer rate.: Units feet per second |
| VARIOMETER SPEED TO FLY_get | action_VARIOMETER SPEED TO FLY_get | Request the value, will be returned in a 'name_(Single) 'triggerOptimal speed to fly between thermals using polar curve and MacCready setting.: Units Kilometers per hour |
| VARIOMETER SPEED TO FLY GLIDE RATIO_get | action_VARIOMETER SPEED TO FLY GLIDE RATIO_get | Request the value, will be returned in a 'name_(Single) 'triggerThe glide ratio at optimal speed to fly.: Units number |
| VARIOMETER SWITCH_get | action_VARIOMETER SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the variometer switch is on, false if it is not.: Units bool |
| VARIOMETER TOTAL ENERGY_get | action_VARIOMETER TOTAL ENERGY_get | Request the value, will be returned in a 'name_(Single) 'triggerThe variometer rate using total energy.: Units feet per second |
| VELOCITY BODY X | action_VELOCITY BODY X | Set the simvar True lateral speed, relative to aircraft X axis: Units feet |
| VELOCITY BODY X_get | action_VELOCITY BODY X_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue lateral speed, relative to aircraft X axis: Units feet |
| VELOCITY BODY Y | action_VELOCITY BODY Y | Set the simvar True vertical speed, relative to aircraft Y axis: Units feet |
| VELOCITY BODY Y_get | action_VELOCITY BODY Y_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue vertical speed, relative to aircraft Y axis: Units feet |
| VELOCITY BODY Z | action_VELOCITY BODY Z | Set the simvar True longitudinal speed, relative to aircraft Z axis: Units feet |
| VELOCITY BODY Z_get | action_VELOCITY BODY Z_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue longitudinal speed, relative to aircraft Z axis: Units feet |
| VELOCITY WORLD X | action_VELOCITY WORLD X | Set the simvar Speed relative to earth, in East/West direction.: Units feet per second |
| VELOCITY WORLD X_get | action_VELOCITY WORLD X_get | Request the value, will be returned in a 'name_(Single) 'triggerSpeed relative to earth, in East/West direction.: Units feet per second |
| VELOCITY WORLD Y | action_VELOCITY WORLD Y | Set the simvar Speed relative to earth, in vertical direction.: Units feet per second |
| VELOCITY WORLD Y_get | action_VELOCITY WORLD Y_get | Request the value, will be returned in a 'name_(Single) 'triggerSpeed relative to earth, in vertical direction.: Units feet per second |
| VELOCITY WORLD Z | action_VELOCITY WORLD Z | Set the simvar Speed relative to earth, in North/South direction.: Units feet per second |
| VELOCITY WORLD Z_get | action_VELOCITY WORLD Z_get | Request the value, will be returned in a 'name_(Single) 'triggerSpeed relative to earth, in North/South direction.: Units feet per second |
| VERTICAL SPEED | action_VERTICAL SPEED | Set the simvar The current indicated vertical speed for the aircraft: Units feet |
| VERTICAL SPEED_get | action_VERTICAL SPEED_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current indicated vertical speed for the aircraft: Units feet |
| VISUAL MODEL RADIUS_get | action_VISUAL MODEL RADIUS_get | Request the value, will be returned in a 'name_(Single) 'triggerModel radius.: Units meters |
| WAGON BACK LINK LENGTH_get | action_WAGON BACK LINK LENGTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe length of the link at the back of the vehicle used to attach a wagon behind.: Units meters |
| WAGON BACK LINK ORIENTATION_get | action_WAGON BACK LINK ORIENTATION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current orientation of the link at the back of the vehicle used to attach a wagon behind.: Units degrees |
| WAGON BACK LINK START POSZ_get | action_WAGON BACK LINK START POSZ_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the start of the link at the back of the vehicle used to attach a wagon behind, relative to the ground.: Units meters |
| WAGON FRONT LINK LENGTH_get | action_WAGON FRONT LINK LENGTH_get | Request the value, will be returned in a 'name_(Single) 'triggerThe length of the link at the front of the vehicle used to be attached as wagon.: Units meters |
| WAGON FRONT LINK ORIENTATION_get | action_WAGON FRONT LINK ORIENTATION_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current orientation of the link at the front of the vehicle used to be attached as wagon.: Units degrees |
| WAGON FRONT LINK START POSZ_get | action_WAGON FRONT LINK START POSZ_get | Request the value, will be returned in a 'name_(Single) 'triggerThe "Z" axis position of the start of the link at the front of the vehicle used to be attached as wagon, relative to the ground.: Units meters |
| WARNING FUEL_get | action_WARNING FUEL_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the fuel warning, either on (true) or off (false).: Units bool |
| WARNING FUEL LEFT_get | action_WARNING FUEL LEFT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the left fuel tank warning, either on (true) or off (false).: Units bool |
| WARNING FUEL RIGHT_get | action_WARNING FUEL RIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the right fuel tank warning, either on (true) or off (false).: Units bool |
| WARNING LOW HEIGHT_get | action_WARNING LOW HEIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the low height warning, either on (true) or off (false).: Units bool |
| WARNING OIL PRESSURE_get | action_WARNING OIL PRESSURE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the oil pressure warning, either on (true) or off (false).: Units bool |
| WARNING VACUUM_get | action_WARNING VACUUM_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the vacuum system warning, either on (true) or off (false).: Units bool |
| WARNING VACUUM LEFT_get | action_WARNING VACUUM LEFT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the left vacuum system warning, either on (true) or off (false).: Units bool |
| WARNING VACUUM RIGHT_get | action_WARNING VACUUM RIGHT_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the right vacuum system warning, either on (true) or off (false).: Units bool |
| WARNING VOLTAGE_get | action_WARNING VOLTAGE_get | Request the value, will be returned in a 'name_(Single) 'triggerThis is the current state of the electrical system voltage warning, either on (true) or off (false).: Units bool |
| WATER BALLAST TANK CAPACITY:index_get | action_WATER BALLAST TANK CAPACITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe capacity of the indexed water ballast tank.: Units pounds |
| WATER BALLAST TANK NUMBER_get | action_WATER BALLAST TANK NUMBER_get | Request the value, will be returned in a 'name_(Single) 'triggerThe number of water ballast tank available.: Units number |
| WATER BALLAST TANK QUANTITY:index_get | action_WATER BALLAST TANK QUANTITY:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe quantity of water ballast in the indexed tank.: Units pounds |
| WATER BALLAST VALVE_get | action_WATER BALLAST VALVE_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue (1) if a water ballast valve is available, False (0) otherwise.: Units bool |
| WATER BALLAST VALVE FLOW RATE_get | action_WATER BALLAST VALVE FLOW RATE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe flow rate of the water ballast valve.: Units gallons per hour |
| WATER LEFT RUDDER EXTENDED_get | action_WATER LEFT RUDDER EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent extended: Units percent |
| WATER LEFT RUDDER STEER ANGLE_get | action_WATER LEFT RUDDER STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerWater left rudder angle, negative to the left, positive to the right: Units percent Over 100 |
| WATER LEFT RUDDER STEER ANGLE PCT_get | action_WATER LEFT RUDDER STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerWater left rudder angle as a percentage: Units percent Over 100 |
| WATER RIGHT RUDDER EXTENDED_get | action_WATER RIGHT RUDDER EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent extended: Units percent |
| WATER RIGHT RUDDER STEER ANGLE_get | action_WATER RIGHT RUDDER STEER ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerWater right rudder angle, negative to the left, positive to the right: Units percent Over 100 |
| WATER RIGHT RUDDER STEER ANGLE PCT_get | action_WATER RIGHT RUDDER STEER ANGLE PCT_get | Request the value, will be returned in a 'name_(Single) 'triggerWater right rudder as a percentage: Units percent Over 100 |
| WATER RUDDER HANDLE POSITION | action_WATER RUDDER HANDLE POSITION | Set the simvar Position of the water rudder handle (0 handle retracted, 1 rudder handle applied): Units percent Over 100 |
| WATER RUDDER HANDLE POSITION_get | action_WATER RUDDER HANDLE POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPosition of the water rudder handle (0 handle retracted, 1 rudder handle applied): Units percent Over 100 |
| WHEEL ROTATION ANGLE:index_get | action_WHEEL ROTATION ANGLE:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWheel rotation angle (rotation around the axis for the wheel): Units radians |
| WHEEL RPM:index_get | action_WHEEL RPM:index_get | Request the value, will be returned in a 'name_(Single) 'triggerWheel rpm: Units RPM |
| WINDSHIELD DEICE SWITCH_get | action_WINDSHIELD DEICE SWITCH_get | Request the value, will be returned in a 'name_(Single) 'triggerTrue if the aircraft windshield deice switch is on.: Units bool |
| WINDSHIELD RAIN EFFECT AVAILABLE_get | action_WINDSHIELD RAIN EFFECT AVAILABLE_get | Request the value, will be returned in a 'name_(Single) 'triggerIs visual effect available on this aircraft: Units bool |
| WINDSHIELD WIND VELOCITY_get | action_WINDSHIELD WIND VELOCITY_get | Request the value, will be returned in a 'name_(Single) 'triggerLongitudinal speed of wind on the windshield.: Units feet |
| WING AREA_get | action_WING AREA_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal wing area: Units square feet |
| WING FLEX PCT:index | action_WING FLEX PCT:index | Set the simvar The current wing flex. Different values can be set for each wing (for example, during banking). Set an index of 1 for the left wing, and 2 for the right wing.: Units percent Over 100 |
| WING FLEX PCT:index_get | action_WING FLEX PCT:index_get | Request the value, will be returned in a 'name_(Single) 'triggerThe current wing flex. Different values can be set for each wing (for example, during banking). Set an index of 1 for the left wing, and 2 for the right wing.: Units percent Over 100 |
| WING SPAN_get | action_WING SPAN_get | Request the value, will be returned in a 'name_(Single) 'triggerTotal wing span: Units feet |
| YAW STRING ANGLE_get | action_YAW STRING ANGLE_get | Request the value, will be returned in a 'name_(Single) 'triggerThe yaw string angle. Yaw strings are attached to gliders as visible indicators of the yaw angle. An animation of this is not implemented in ESP.: Units radians |
| YAW STRING PCT EXTENDED_get | action_YAW STRING PCT EXTENDED_get | Request the value, will be returned in a 'name_(Single) 'triggerYaw string angle as a percentage: Units percent Over 100 |
| YOKE X INDICATOR_get | action_YOKE X INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerYoke position in horizontal direction.: Units position |
| YOKE X POSITION | action_YOKE X POSITION | Set the simvar Percent control deflection left/right (for animation).: Units position |
| YOKE X POSITION_get | action_YOKE X POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent control deflection left/right (for animation).: Units position |
| YOKE X POSITION WITH AP_get | action_YOKE X POSITION WITH AP_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent control deflection left/right (for animation). Also includes AP's inputs.: Units position |
| YOKE Y INDICATOR_get | action_YOKE Y INDICATOR_get | Request the value, will be returned in a 'name_(Single) 'triggerYoke position in vertical direction.: Units position |
| YOKE Y POSITION | action_YOKE Y POSITION | Set the simvar Percent control deflection fore/aft (for animation).: Units position |
| YOKE Y POSITION_get | action_YOKE Y POSITION_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent control deflection fore/aft (for animation).: Units position |
| YOKE Y POSITION WITH AP_get | action_YOKE Y POSITION WITH AP_get | Request the value, will be returned in a 'name_(Single) 'triggerPercent control deflection fore/aft (for animation). Also includes AP's inputs.: Units position |
| ZERO LIFT ALPHA_get | action_ZERO LIFT ALPHA_get | Request the value, will be returned in a 'name_(Single) 'triggerThe angle of attack at which the wing has zero lift.: Units radians |
## multistream

### Triggers

| name | trigger | description |
| --- | --- | --- |
| multistreamStreamStarted | trigger_multistreamStreamStarted | A Stream has been started to the destination |
| multistreamStreamStopped | trigger_multistreamStreamStopped | A Stream has been stopped |
### Actions

| name | trigger | description |
| --- | --- | --- |
## obs

### Triggers

| name | trigger | description |
| --- | --- | --- |
| OBSStreamingStarted | trigger_StreamStarted | Stream Started |
| OBSStreamingStopped | trigger_StreamStopped | Stream Stopped |
| OBSRecordingStarted | trigger_RecordingStarted | Recording Started |
| OBSRecordingStopped | trigger_RecordingStopped | Recording Stopped |
| OBSSceneChanged | trigger_SceneChanged | Scene was changed |
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
## philipshue

### Triggers

| name | trigger | description |
| --- | --- | --- |
### Actions

| name | trigger | description |
| --- | --- | --- |
| PhilipsHueActivateScene | action_ActivateScene | Activates a given scene in the Philips Hue hub |
## quizbot

### Triggers

| name | trigger | description |
| --- | --- | --- |
| quizbotQuizStarted | trigger_QuizbotQuizStarted | Quiz was started, restarted or a new question was asked |
| quizbotQuizStopped | trigger_QuizbotQuizStopped | Quiz was stopped |
| quizbotQuizTimeout | trigger_QuizbotQuizTimeout | Quiz Question timedout |
| quizbotIncorrectAnswer | trigger_QuizbotIncorrectAnswer | Someone provided an incorrect answer |
| quizbotCorrectAnswer | trigger_QuizbotCorrectAnswer | Someone answered the quiz question correctly |
### Actions

| name | trigger | description |
| --- | --- | --- |
| quizbotStartQuiz | action_QuizbotStartQuiz | Start, restart or skip current question |
| quizbotStopQuiz | action_QuizbotStopQuiz | Stop the Quiz |
| quizbotCheckAnswer | action_QuizbotCheckAnswer | Check if answer is correct (including chat tag, ie !answer |
## randomfact

### Triggers

| name | trigger | description |
| --- | --- | --- |
| RandfactPoster | trigger_RandomFact | An interesting or amusing random fact was received |
### Actions

| name | trigger | description |
| --- | --- | --- |
| RandfactRequest | action_RequestRandomFact | Requests a random fact |
## streamersonglist

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
## streamlabs_api

### Triggers

| name | trigger | description |
| --- | --- | --- |
| StreamlabsDonationAlert | trigger_StreamlabsDonationReceived | A Streamlabs donation was received |
| StreamlabsMerchAlert | trigger_MerchPurchaseReceived | Someone purchased your Merch |
| StreamlabsLoyaltyStoreRedemptionAlert | trigger_StreamlabsLoyaltyStoreRedemptionReceived | Someone Reddemed something from your LoyaltyStore |
| StreamlabTwitchFollowAlert | trigger_TwitchFollowReceived | A Viewer Followed your twitch stream |
| StreamlabsTwitchSubscriptionAlert | trigger_TwitchSubscriptionReceived | Someone Subscribed to your twitch stream |
| StreamlabsTwitchResubAlert | trigger_TwitchResubReceived | Someone Resubed to your twitch stream |
| StreamlabsTwitchHostAlert | trigger_TwitchHostReceived | Someone Hosted your stream on twitch |
| StreamlabsTwitchBitsAlert | trigger_TwitchBitsReceived | Someone Donated bits on Twitch |
| StreamlabsTwitchRaidAlert | trigger_TwitchRaidReceived | Someone Raided your stream on Twitch |
| StreamlabsTwitchCharityDonationAlert | trigger_TwitchCharityDonationReceived | Someone donated to charity on your Twitch stream |
| StreamlabsCharityDonationAlert | trigger_CharityDonationReceived | Someone donated to charity on your StreamLabs Charity |
| StreamlabsTwitchSubMysteryAlert | trigger_TwitchSubMysteryGiftReceived | Someone gifted some subs on your Twitch stream |
| StreamlabsYouTubeSubscriptionAlert | trigger_YouTubeSubscriptionReceived | Someone Subscribed on YouTube |
| StreamlabsYouTubeMemberAlert | trigger_YouTubeMemberReceived | A Member joined on YouTube |
| StreamlabsYouTubeSuperchatAlert | trigger_YouTubeSuperchatReceived | Someone Superchated on YouTube |
| StreamlabsDataDump | trigger_StreamlabsDataDump | Stream labs data dump, ie subs/month, top10 donators etc etc |
| StreamlabsDataDumpUnderlying | trigger_StreamlabsDataDumpUnderlying | Stream labs Underlying data dump, ie subs/month, top10 donators etc etc |
| StreamlabsKickFollowAlert | trigger_KickFollowReceived | A Viewer Followed your Kick stream |
| StreamlabsKickSubscriptionAlert | trigger_KickSubscriptionReceived | Someone Subscribed to your Kick stream |
### Actions

| name | trigger | description |
| --- | --- | --- |
## sysinfo

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
## timers

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
## twitch

### Triggers

| name | trigger | description |
| --- | --- | --- |
| UserBanned | trigger_TwitchUserBanned | A user was banned |
| CharityCampaignProgress | trigger_TwitchCharityCampaignProgress | Progress of a charity Campaign |
| CharityCampaignStart | trigger_TwitchCharityCampaignStart | Start of a charity campaign |
| CharityCampaignStop | trigger_TwitchCharityCampaignStop | Charity campaign stopped |
| CharityDonation | trigger_TwitchCharityDonation | Charity Donation |
| Cheer | trigger_TwitchCheer | Someone donated some bits |
| Follow | trigger_TwitchFollow | Someone Followed |
| GoalBegin | trigger_TwitchGoalBegin | A stream goal began |
| GoalEnd | trigger_TwitchGoalEnd | A stream goal Ended |
| GoalProgress | trigger_TwitchGoalProgress | A stream goal Progress |
| HypeTrainBegin | trigger_TwitchHypeTrainBegin | A Hype Train Started |
| HypeTrainEnd | trigger_TwitchHypeTrainEnd | A Hype Train Ended |
| HypeTrainProgress | trigger_TwitchHypeTrainProgress | A hypeTrain is in progress |
| ModAdded | trigger_TwitchModAdded | A User was added to the Mod list |
| ModRemoved | trigger_TwitchModRemoved | A User was removed to the Mod list |
| PollBegin | trigger_TwitchPollBegin | A Poll Started |
| PollEnd | trigger_TwitchPollEnd | A Poll Ended |
| PollProgress | trigger_TwitchPollProgress | A Poll Progressed |
| PredictionBegin | trigger_TwitchPredictionBegin | A Prediction Began |
| Prediction | trigger_TwitchPrediction | A Prediction  |
| PredictionEnd | trigger_TwitchPredictionEnd | A Prediction Ended |
| PredictionLock | trigger_TwitchPredictionLock | A Prediction Locked |
| PredictionProgress | trigger_TwitchPredictionProgress | A Prediction Progressed |
| RaidFrom | trigger_TwitchRaidFrom | Another streamer raided the channel |
| RaidTo | trigger_TwitchRaidTo | A raid was started |
| RedemptionAdd | trigger_TwitchRedemptionAdd | A user used channel points for a redemption (id and rewardID appear to be the same number) |
| RedemptionUpdate | trigger_TwitchRedemptionUpdate | A user used channel points for a redemption update?? |
| RewardAdd | trigger_TwitchRewardAdd | Reward added by streamer to channel |
| RewardRemove | trigger_TwitchRewardRemove | Reward removed by streamer to channel |
| RewardUpdate | trigger_TwitchRewardUpdate | Reward updated by streamer to channel |
| ShieldModeBegin | trigger_TwitchShieldModeBegin | Shield mode was started |
| ShieldModeEnd | trigger_TwitchShieldModeEnd | Shield mode was ended |
| ShoutoutSent | trigger_TwitchShoutoutCreate | A shoutout was performed by the streamer |
| ShoutoutReceive | trigger_TwitchShoutoutReceive | A shoutout was received for the streamer |
| Subscription | trigger_TwitchSubscription | Someone subscribed |
| SubscriptionEnd | trigger_TwitchSubscriptionEnd | Someone subscription ended |
| SubscriptionGift | trigger_TwitchSubscriptionGift | Someone gifted a subscription |
| SubscriptionMessage | trigger_TwitchSubscriptionMessage | Announcement of a channel subscription by the subscriber |
| UserUnBanned | trigger_TwitchUserUnBanned | A user was unbanned |
| TitleChanged | trigger_TwitchTitleChanged | The Stream title was changed |
| GamedChanged | trigger_TwitchGamedChanged | The Game was changed |
| StreamIdChanged | trigger_TwitchStreamIdChanged | The stream ID has changed |
| StreamLanguageChanged | trigger_TwitchStreamLanguageChanged | The stream language has changed |
| StreamerNameChanged | trigger_TwitchStreamerNameChanged | The streamer name has changed |
| StreamStarted | trigger_TwitchStreamStarted | The Stream Started |
| StreamEnded | trigger_TwitchStreamEnded | The Stream Ended |
| CommercialStarted | trigger_TwitchCommercialStarted | A Commercial was started |
| VIPAdded | trigger_TwitchVIPAdded | A User was added to the VIP list |
| VIPRemoved | trigger_TwitchVIPRemoved | A User was removed to the VIP list |
| Editors | trigger_TwitchEditors | A list of editors for the channel |
| VIPs | trigger_TwitchVIPs | A list of VIPs for the channel |
| FollowerCount | trigger_TwitchFollowerCount | Follower count |
| FollowedChannels | trigger_TwitchFollowedChannels | Followed channels |
| CheerEmotes | trigger_TwitchCheerEmotes | Cheer emotes |
| Leaderboard | trigger_TwitchLeaderboard | Bits leaderboard |
| Poll | trigger_TwitchPoll | A poll |
| UserBlocks | trigger_TwitchUserBlocks | Who this user has blocked |
| ClipCreated | trigger_TwitchClipCreated | A twitch clip |
| VodClip | trigger_TwitchVodClip | A twitch vod clip |
| UserDetails | trigger_TwitchUserDetails | Twitch User Data |
| GameCategories | trigger_TwitchGameCategories | Updated list of games |
| RaidingChannel | trigger_TwitchRaidChannel | We are Raiding a channel |
### Actions

| name | trigger | description |
| --- | --- | --- |
| ChangeTitle | action_TwitchChangeTitle | Change stream title |
| StartCommercial | action_TwitchStartCommercial | Start a Commercial for (30, 60, 90, 120, 150, 180) seconds |
| GetEditors | action_TwitchGetEditors | Get a list of editors for the channel |
| GetVIPs | action_TwitchGetVIPs | Get a list of VIPs for the channel |
| AddVIP | action_TwitchAddVIP | Promote user to VIP |
| RemoveVIP | action_TwitchRemoveVIP | Demote user from VIP |
| AddMod | action_TwitchAddMod | Promote user to Mod |
| RemoveMod | action_TwitchRemoveMod | Demote user from Mod |
| Ban | action_TwitchBan | Bans a user from the stream |
| Unban | action_TwitchUnban | Unbans a user from the stream |
| FollowerCount | action_TwitchFollowerCount | Get follower count |
| FollowedChannels | action_TwitchFollowedChannels | Get followed channels |
| CheerEmotes | action_TwitchCheerEmotes | Get cheer emotes |
| Leaderboard | action_TwitchLeaderboard | Get bits leaderboard |
| GetPolls | action_TwitchGetPolls | Gets a list of polls |
| GetPoll | action_TwitchGetPoll | Get a poll |
| CreatePoll | action_TwitchCreatePoll | Create a poll |
| EndPoll | action_TwitchEndPoll | End a poll |
| StartPrediction | action_TwitchStartPrediction | Start a prediction |
| CancelPrediction | action_TwitchCancelPrediction | Cancel a prediction |
| GetPredictions | action_TwitchGetPredictions | Gets a list of predictions |
| GetPrediction | action_TwitchGetPrediction | Get a prediction |
| LockPrediction | action_TwitchLockPrediction | Lock a prediction |
| RemovePrediction | action_TwitchLRemovePrediction | Remove a prediction |
| ResolvePrediction | action_TwitchLResolvePrediction | Resolve a prediction |
| CreateUserBlock | action_TwitchCreateBlock | Block a user |
| DeleteUserBlock | action_TwitchDeleteBlock | Unblock a user |
| GetUser | action_TwitchGetUser | Gets a Users Details |
| GetBlocks | action_TwitchGetBlocks | Get a list of blocked users |
| CreateClip | action_TwitchCreateClip | Create a twitch clip |
| GetClipById | action_TwitchGetClipById | Get clip by id |
| GetClipsForBroadcaster | action_TwitchGetClipsForBroadcaster | Get clips for a broadcaster |
| GetClipsForGame | action_TwitchGetClipsForGame | Get clips for a game |
| TwitchGameCategories | action_GetTwitchGameCategories | Get the list of games |
| TwitchGetStats | action_GetTwitchStats | Return will be a set of triggers for current game etc |
| TwitchRaid | action_TwitchRaidChannel | Raids the username specified |
## twitchchat

### Triggers

| name | trigger | description |
| --- | --- | --- |
| TwitchChatChatMessageReceived | trigger_ChatMessageReceived | A chat message was received. htmlMessage field has name and message combined |
| TwitchChatActionReceived | trigger_ChatActionReceived | A chat action was received (a /me message) |
| TwitchChatBanReceived | trigger_ChatBanReceived | A chat user was banned |
| TwitchChatMessageDeletedReceived | trigger_ChatMessageDeleted | A chat message was deleted  |
| TwitchChatPrimePaidUpgradeReceived | trigger_ChatPrimePaidUpgrade | A user paid to upgrade their prime sub  |
| TwitchChatRaidReceived | trigger_ChatRaid | Another streamer raided you |
| TwitchChatRedeemReceived | trigger_ChatRedeem | Viewer reddemed chat points |
| TwitchChatResubReceived | trigger_ChatResub | Someone Resubbed |
| TwitchChatRitualReceived | trigger_ChatRitual | Ritual |
| TwitchChatRoomstateReceived | trigger_ChatRoomstate | This message contains things like sub-only mode etc |
| TwitchChatSubscriptionReceived | trigger_ChatSubscription | Someone Subscribed |
| TwitchChatTimeoutReceived | trigger_ChatTimeout | A viewer was timedout |
| TwitchChatSubMysteryGiftReceived | trigger_ChatSubMysteryGift | A viewer Gifted a sub |
| TwitchChatAutoModReceived | trigger_ChatAutoMod | Automod action happened |
| TwitchChatReconnect | trigger_ChatReconnect | Chat Reconnected |
| TwitchChatAnonGiftPaidUpgradeReceived | trigger_ChatAnonGiftPaidUpgrade | Your guess is as good as mine on this one |
| TwitchChatAnonSubMysteryGiftReceived | trigger_ChatAnonSubMysteryGift | Someone Gifted an Sub Anonymously |
| TwitchChatAnonSubGiftReceived | trigger_ChatAnonSubGift | Someone Gifted an Sub |
| TwitchChatCheerReceived | trigger_ChatCheer | Someone donated bits |
| TwitchChatMod | trigger_ChatMod | A Mod message was received, someone modded maybe or a mod action was performed. let me know if you know which it is |
| TwitchChatSubGift | trigger_ChatSubGift | Someone gifted a sub to another viewer |
| TwitchChatSubscribers | trigger_ChatSubscribers | Subscribers |
| TwitchChatVipss | trigger_ChatVips | Channel Vips |
| TwitchChatClear | trigger_ChatClear | Chat was cleared |
| TwitchChatFollowersOnly | trigger_ChatFollowersOnly | FollowersOnly mode was changed |
| TwitchChatGiftPaidUpgrade | trigger_ChatGiftPaidUpgrade | Someone gifted a paid upgrade |
| TwitchChatEmoteOnly | trigger_ChatEmoteOnly | EmoteOnly mode changed |
| TwitchChatr9kbeta | trigger_Chatr9kbeta | r9kbeta mode changed |
| TwitchChatSlowmode | trigger_ChatSlowmode | Slowmode mode changed |
| TwitchChatWhisper | trigger_ChatWhisper | Someone Whispered you or the bot |
| TwitchChatNotice | trigger_ChatNotice | You received a notice (ie about chat being in follower mode etc) |
| TwitchChatUserNotice | trigger_ChatUserNotice | UserNotice received |
| TwitchChatDisconnected | trigger_ChatDisconnected | Chat was Disconnected |
| TwitchChatConnected | trigger_ChatConnected | Chat was connected |
| TwitchChatJoin | trigger_ChatJoin | Someone Joined the chat |
### Actions

| name | trigger | description |
| --- | --- | --- |
| TwitchChatSendChatMessage | action_SendChatMessage | Post a message to twitch chat (Note user is case sensitive) |
## twitter

### Triggers

| name | trigger | description |
| --- | --- | --- |
### Actions

| name | trigger | description |
| --- | --- | --- |
| TwitterPostTweet | action_PostTweet | Post a message to twtter |
## users

### Triggers

| name | trigger | description |
| --- | --- | --- |
| UsersNewChatter | trigger_NewChatter | Someone has posted in the chat for the first time |
### Actions

| name | trigger | description |
| --- | --- | --- |
## youtube

### Triggers

| name | trigger | description |
| --- | --- | --- |
| Youtube message received | trigger_ChatMessageReceived | A chat message was received. htmlMessage field has name and message combined |
### Actions

| name | trigger | description |
| --- | --- | --- |
| YouTube post livechat message | action_youtubePostLiveChatMessage | Post to youtube live chat if we are connected. |
