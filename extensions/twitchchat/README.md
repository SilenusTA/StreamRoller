<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# Twitch Chat

Contents

- [Twitch Chat](#twitch-chat)
- [Setup](#setup)
  - [Outgoing channel : "TWITCH\_CHAT"](#outgoing-channel--twitch_chat)
  - [Authorization fields](#authorization-fields)
    - [(BOT) Field 1](#bot-field-1)
    - [(BOT) Field 2](#bot-field-2)
    - [(USER) Field 1](#user-field-1)
    - [(USER) Field 2](#user-field-2)
- [About](#about)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

# Setup

## Outgoing channel : "TWITCH_CHAT"

## Authorization fields

There are two sets of credentials needed. One for the user and one for the bot. Future versions will add the ability for multiple users and bots

### (BOT) Field 1

- Name: twitchchatbot
- Value: 'botname' ie myChatBot

### (BOT) Field 2

- Name: twitchchatbotoauth
- Value: bot oauth token (including the oauth: part, ie "oauth:sdfeicx345324dfsfe3242")

### (USER) Field 1

- Name: twitchchauser
- Value: 'username' ie OldDepressedGamer

### (USER) Field 2

- Name: twitchchatuseroauth
- Value: user oauth token (including the oauth: part, ie "oauth:sdfeicx345324dfsfe3242")

# About

The twitch chat extension will send out any messages sent on the channel provided in the settings (or Admin page settings box) using the username provided or defaults to the bot

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Wed, 12 Mar 2025 05:38:02 GMT*

### Triggers

| name | trigger | description |
| --- | --- | --- |
| TwitchChatChatMessageReceived | trigger_ChatMessageReceived | A chat message was received. textMessage field has name and message combined |
| TwitchChatActionReceived | trigger_ChatActionReceived | A chat action was received (a /me message) |
| TwitchChatBanReceived | trigger_ChatBanReceived | A chat users was banned |
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

