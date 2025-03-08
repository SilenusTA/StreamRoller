<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
 # Streamlabs API
Contents
- [Streamlabs API](#streamlabs-api)
  - [Outgoing channel : "STREAMLABS\_ALERT"](#outgoing-channel--streamlabs_alert)
  - [Authorization fields](#authorization-fields)
      - [Field 1](#field-1)
- [About](#about)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)
## Outgoing channel : "STREAMLABS_ALERT"
## Authorization fields
#### Field 1
- Name: "SL_SOCKET_TOKEN"
- Value: Socket token

These can be found on your streamlabs.com dashboard at Account > settings > Api settings"
# About
This extension connects to the streamlabs API to retrieve live alert data so that other extensions can consume it (ie overlays, sharing alerts on discord, twitter etc)

Note: You can also use this api for other streaming platoforms. ie youtube streaming.

The following features are provided
- creates a "STREAMLABS_ALERT" channel to send out streamlabs messages
- Provides an SettingsWidgetSmall so that the adminpage can turn on or off the messages
- Messages sent are of the following format

## Triggers/Actions


Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 08 Mar 2025 02:35:23 GMT*

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
| StreamlabsTwitchSubMysteryAlert | trigger_TwitchSubMysteryGiftReceived | Someone gifted some subs on your Twitch stream |
| StreamlabsYouTubeSubscriptionAlert | trigger_YouTubeSubscriptionReceived | Someone Subscribed on YouTube |
| StreamlabsYouTubeMemberAlert | trigger_YouTubeMemberReceived | A Member joined on YouTube |
| StreamlabsYouTubeSuperchatAlert | trigger_YouTubeSuperchatReceived | Someone Superchated on YouTube |
| StreamlabsDataDump | trigger_StreamlabsDataDump | Stream labs data dump, ie subs/month, top10 donators etc etc |
| StreamlabsDataDumpUnderlying | trigger_StreamlabsDataDumpUnderlying | Stream labs Underlying data dump, ie subs/month, top10 donators etc etc |

### Actions

| name | trigger | description |
| --- | --- | --- |
