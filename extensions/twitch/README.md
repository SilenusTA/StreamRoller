<!-- this file will be auto updated for triggers and actions when the apidocs automatic
document builder is run.
To have the triggers and actions inserted do not remove the tags 'ReplaceTAGFor...' below
To run go to 'StreamRoller\docs\apidocs' and run 'node readmebuilder.mjs'
The script will parse files in the extensions directory looking for "triggersandactions ="
if found it will attempt to load hte file and use the exported 'triggersandactions' variable
to create the tables shown in the parsed README.md files
This was the only way I could find to autoupdate the triggers and actions lists
 -->
# Twitch

- [Twitch](#twitch)
- [About](#about)
  - [Credentials](#credentials)
  - [Triggers/Actions](#triggersactions)
    - [Triggers](#triggers)
    - [Actions](#actions)

# About

This extension provides triggers/actions for twitch to allow things like changing of title/category to banning users ect

## Credentials

Follow the steps on the the StreamRoller main settings page for the extension

## Triggers/Actions



Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.

Table last updated: *Sat, 03 May 2025 15:40:39 GMT*

<div style='color:orange'>> Note that there are thousands of dynamically created options for some games like MSFS2020. These will only appear whe the game/extension is running and the extension connected.</div>

To see the full list of Triggers/Actions available checkout [README_All_TRIGGERS.md](https://github.com/SilenusTA/StreamRoller/blob/master/README_All_TRIGGERS.md)

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

