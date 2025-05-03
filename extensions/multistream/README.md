<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# Multistream Extension

Contents

- [Multistream Extension](#multistream-extension)
  - [Outgoing channel : "MULTISTREAM"](#outgoing-channel--multistream)
- [Multistream Basics](#multistream-basics)
  - [Starting a stream](#starting-a-stream)
    - [Step 1: Select an FFMPEG install to use](#step-1-select-an-ffmpeg-install-to-use)
      - [User installed ffmpeg](#user-installed-ffmpeg)
      - [StreamRollers ffmpeg](#streamrollers-ffmpeg)
    - [Step 2: Setup OBS as described below](#step-2-setup-obs-as-described-below)
  - [Step 3: Select global Options](#step-3-select-global-options)
  - [Step 4: Setup your destination streams](#step-4-setup-your-destination-streams)
  - [Step 5: Start multistreaming](#step-5-start-multistreaming)
  - [Step 5: Stop multistreaming](#step-5-stop-multistreaming)
  - [Debugging/Testing Settings](#debuggingtesting-settings)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

## Outgoing channel : "MULTISTREAM"

# Multistream Basics

The multistream extension will take a local 'recording' stream from OBS and send it on to streaming services like twitch/youtube etc. using ffmpeg.

Ths extension will start/stop OBS recording if you have setup the obs extension. if not you will manually need to start/stop OBS recording for the stream to be available.

Once the streams have been configured selecting the "start streaming" checkbox in the small settings page for multistream on the live portal page will start OBS recording (used as the source stream) and also all streams that have been configured to run.

Note that currently OBS doesn't allow splitting of audio through the 'streaming' option, only through the 'recording' option. When using StreamRoller to multistream it will start OBS 'Recording' to a local port rather than a file and use that as the output.

If you need to use OBS 'streaming' (other addons might monitor the OBS 'stream' rather than the 'recording' for stats etc) you can always Stream to your main platform and then just setup the other platforms below (which will take the stream from the recording stream in OBS)

## Starting a stream

In StreamRoller first go to the large settings page for the multistream extension.

There is a lot of information on this screen, but to get started

### Step 1: Select an FFMPEG install to use

#### User installed ffmpeg

If you have already installed ffmpeg (and it is available from the command line, ie type ffmpeg at a command prompt to check) then you can use that version if you wish.

#### StreamRollers ffmpeg

If you don't have ffmpeg installed you can have streamroller install one for you (will be installed in the bin folder of the extension)
To get ffmpeg installed simply select StreamRoller FFMPEG from the dropdown/options box and submit the form. StreamRoller will then download/unpack FFMPEG to use.

### Step 2: Setup OBS as described below

In OBS go to settings->Output.

Set the following fields. Note not all encoders will work and some might have restrictions (ie unable to select separate audio channels). The list blow worked for me so is probably a good starting/test point

```text
OutputMode --> Advanced
Recording --> Type --> Custom Output (FFmpeg)
Recording --> FFMpeg Output Type --> Output to URL 
Recording --> File Path or URL: udp://localhost:1935
Recording --> Container Format --> mpegts
(might need to click the "Show all codecs button to see these but pick ones to match your system")
Recording --> Video Enoder (based on PC and card most likely h264_nvenc (GPU), lib264 (CPU) or AMD equivalent)
Recording --> Audio encoder --> aac
Recording --> Audio track --> select all
```

<img src="https://raw.githubusercontent.com/SilenusTA/StreamRoller/refs/heads/master/extensions/multistream/images/OBS_Settings.png" title="OBS settings" alt="OBS settings">

## Step 3: Select global Options

1) ffmpeg source (if not set already) chose an available one or install [StreamRollers ffmpeg](#streamrollers-ffmpeg)

## Step 4: Setup your destination streams

There are currently 4 stream slots (for up to 4 destinations) with the following options

(Simplified mode)

1) Enabled/Disabled: When starting a multistream all enabled streams will be started;
2) Name: Name for this stream (just a useful reference, doesn't impact the stream itself)
3) Configuration Mode: Select Simple, Configurable or Advanced to show extra ffmpeg options. Suggested:Simple
4) URL: This is the url provided by Twitch (rtmp://live.twitch.tv/app), YouTube (rtmp://b.rtmp.youtube.com/live2) etc for where to stream to.
5) Twitch Bandwidth test mode: Useful to test without going live on twitch (for YouTube you can set your stream, in YouTube studio, to be unlisted for testing )
6) Stream Key: The stream key provided by the platform you are streaming to
7) Audio Channels: Select specific audio channels. Useful for removing music when streaming to YouTube.

## Step 5: Start multistreaming

From the live portal page click on multistream extension to bring up the small settings page.

1) Select/check which streams you want to stream to (click the enabled box under the stream name to include it in the stream)
2) Check that the extension is Enabled
3) Check the "Start Streaming" checkbox and hit submit on the page.

Step 3: will start the stream, and tell OBS to start recording (to provide a source for the stream)

## Step 5: Stop multistreaming

To stop multistreaming simply bring up the settings as above and deselect the "Start Streaming" box then click Update. This will stop the stream and also stop OBS recording.

## Debugging/Testing Settings

Due to the nature of streaming there can be many reason why streams might not work from incorrect encoder settings/missing parameters for those encodings/Streaming services changing their requirements etc.

One way to test for issues or try out new items that might not exist in SreamRoller (let me know if i'm missing some options) is to run the ffmpeg command from the commandline with extra debug logging.

You can do this by visiting the large settings page, clicking the 'show stream key' at the bottom of the page, update/submit that page. Now when you go back to the page the full commandline used to start the stream will be displayed on the page.

If you copy this into a windows command prompt it will start the ffmpeg multistream running (you will need to manually hit "start recording" in OBS doing it this way)

This gives you the ability to see errors (even more if adding the +info, +verbose or +debug flag)

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 03 May 2025 17:47:41 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

### Triggers

| name | trigger | description |
| --- | --- | --- |
| multistreamStreamStarted | trigger_multistreamStreamStarted | A Stream has been started to the destination |
| multistreamStreamStopped | trigger_multistreamStreamStopped | A Stream has been stopped |


### Actions

| name | trigger | description |
| --- | --- | --- |

