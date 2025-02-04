/**
 * Copyright (C) 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// ============================================================================
//                           IMPORTS/VARIABLES
// ============================================================================
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
import ex_helper from "../../extension_helpers/public/streamroller-html-functions.cjs";
import * as logger from "../../../backend/data_center/modules/logger.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fs from "fs";
//twurple imports
import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';


// our helper files
import * as eventSubApi from "./eventsub.js";

// local config for volatile data
const localConfig =
{
    host: "",
    port: "",
    DataCenterSocket: null,
    heartBeatTimeout: 5000,
    heartBeatHandle: null,
    status: {
        connected: false, // are we connected to obs
        color: "red"
    },
    SYSTEM_LOGGING_TAG: "[EXTENSION]",

    clientId: "",
    streamerData: "",
    authProvider: "",
    apiClient: null,
    gameCategories: [],
    twitchCategoriesDropdownId: "twitchGameCategory",
    currentTwitchGameCategory: "",
}
const default_serverConfig = {
    __version__: "0.2",
    extensionname: "twitch",
    channel: "TWITCH",
    twitchenabled: "off",
    twitchresetdefaults: "off",
    twitchstreamername: "",
    twitchCategorieshistory: [],
}
let serverConfig = structuredClone(default_serverConfig);
const localCredentials =
{
    twitchOAuthState: "",
    twitchOAuthToken: ""
}
// To further expand this list check out HELIX APIS at
// https://twurple.js.org/reference/api/classes/ApiClient.html
// 1) select the api and functions you want on the left you want to implement/add
// 2) add the action_ trigger and function
// 3) check that a callback trigger_ is defined (should be in the triggers list and implemented in the eventsub.js script)
// 5) run a test to see if the scopes need updating in twitch.js (for authorizing a user, will need to re-authorize through the admin page to update the twitch tokens)
//
// triggers are implemented in eventsub.js
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Twitch handles messages to and from twitch",
    version: "0.1",
    channel: serverConfig.channel,
    triggers:
        [
            {
                name: "UserBanned",
                displaytitle: "UserBanned",
                description: "A user was banned",
                messagetype: "trigger_TwitchUserBanned",
                parameters: {
                    streamer: "",
                    endDate: "",
                    isPermanent: "",
                    moderator: "",
                    reason: "",
                    user: ""
                }
            },
            {
                name: "CharityCampaignProgress",
                displaytitle: "Charity Campaign Progress",
                description: "Progress of a charity Campaign",
                messagetype: "trigger_TwitchCharityCampaignProgress",
                parameters: {
                    streamer: "",
                    charityName: "",
                    charityDescription: "",
                    charityWebsite: "",
                    charityLogo: "",
                    currentAmount: "",
                    targetAmount: "",
                    id: "",
                }
            },
            {
                name: "CharityCampaignStart",
                displaytitle: "Charity Campaign Start",
                description: "Start of a charity campaign",
                messagetype: "trigger_TwitchCharityCampaignStart",
                parameters: {
                    streamer: "",
                    charityName: "",
                    charityDescription: "",
                    charityWebsite: "",
                    charityLogo: "",
                    currentAmount: "",
                    targetAmount: "",
                    id: "",
                    startDate: ""
                }
            },
            {
                name: "CharityCampaignStop",
                displaytitle: "Charity Campaign Stop",
                description: "Charity campaign stopped",
                messagetype: "trigger_TwitchCharityCampaignStop",
                parameters: {
                    streamer: "",
                    charityName: "",
                    charityDescription: "",
                    charityWebsite: "",
                    charityLogo: "",
                    currentAmount: "",
                    targetAmount: "",
                    id: "",
                    endDate: ""
                }
            },
            {
                name: "CharityDonation",
                displaytitle: "Charity Donation",
                description: "Charity Donation",
                messagetype: "trigger_TwitchCharityDonation",
                parameters: {
                    streamer: "",
                    amount: "",
                    campaignId: "",
                    charityName: "",
                    charityDescription: "",
                    charityWebsite: "",
                    charityLogo: "",
                    donor: ""
                }
            },
            {
                name: "Cheer",
                displaytitle: "Cheer",
                description: "Someone donated some bits",
                messagetype: "trigger_TwitchCheer",
                parameters: {
                    streamer: "",
                    bits: "",
                    isAnonymous: "",
                    message: "",
                    user: "",
                }
            },
            {
                name: "Follow",
                displaytitle: "Follow",
                description: "Someone Followed",
                messagetype: "trigger_TwitchFollow",
                parameters: {
                    streamer: "",
                    user: "",
                }
            },
            {
                name: "GoalBegin",
                displaytitle: "Goal Begin",
                description: "A stream goal began",
                messagetype: "trigger_TwitchGoalBegin",
                parameters: {
                    streamer: "",
                    currentAmount: "",
                    description: "",
                    startDate: "",
                    targetAmount: "",
                    type: "",
                }
            },
            {
                name: "GoalEnd",
                displaytitle: "Goal End",
                description: "A stream goal Ended",
                messagetype: "trigger_TwitchGoalEnd",
                parameters: {
                    streamer: "",
                    currentAmount: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    targetAmount: "",
                    type: "",
                    isAchieved: ""
                }
            },
            {
                name: "GoalProgress",
                displaytitle: "Goal Progress",
                description: "A stream goal Progress",
                messagetype: "trigger_TwitchGoalProgress",
                parameters: {
                    streamer: "",
                    currentAmount: "",
                    description: "",
                    startDate: "",
                    targetAmount: "",
                    type: "",
                }
            },
            {
                name: "HypeTrainBegin",
                displaytitle: "Hype Train Begin",
                description: "A Hype Train Started",
                messagetype: "trigger_TwitchHypeTrainBegin",
                parameters: {
                    streamer: "",
                    expiryDate: "",
                    goal: "",
                    id: "",
                    lastContribution: "",
                    level: "",
                    progress: "",
                    startDate: "",
                    topContributors: "",
                    total: "",
                }
            },
            {
                name: "HypeTrainEnd",
                displaytitle: "Hype Train End",
                description: "A Hype Train Ended",
                messagetype: "trigger_TwitchHypeTrainEnd",
                parameters: {
                    streamer: "",
                    cooldownEndDate: "",
                    endDate: "",
                    id: "",
                    level: "",
                    startDate: "",
                    topContributors: "",
                    total: "",
                }
            },
            {
                name: "HypeTrainProgress",
                displaytitle: "HypeTrainProgress",
                description: "A hypeTrain is in progress",
                messagetype: "trigger_TwitchHypeTrainProgress",
                parameters: {
                    streamer: "",
                    expiryDate: "",
                    goal: "",
                    id: "",
                    lastContribution: "",
                    level: "",
                    progress: "",
                    startDate: "",
                    topContributors: "",
                    total: "",
                }
            },
            {
                name: "ModAdded",
                displaytitle: "Mod Added",
                description: "A User was added to the Mod list",
                messagetype: "trigger_TwitchModAdded",
                parameters: {
                    user: ""
                }
            },
            {
                name: "ModRemoved",
                displaytitle: "Mod Removed",
                description: "A User was removed to the Mod list",
                messagetype: "trigger_TwitchModRemoved",
                parameters: {
                    user: ""
                }
            },
            {
                name: "PollBegin",
                displaytitle: "PollBegin",
                description: "A Poll Started",
                messagetype: "trigger_TwitchPollBegin",
                parameters: {
                    streamer: "",
                    bitsPerVote: "",
                    channelPointsPerVote: "",
                    choices: "",
                    endDate: "",
                    id: "",
                    isBitsVotingEnabled: "",
                    isChannelPointsVotingEnabled: "",
                    startDate: "",
                    title: "",
                }
            },
            {
                name: "PollEnd",
                displaytitle: "PollEnd",
                description: "A Poll Ended",
                messagetype: "trigger_TwitchPollEnd",
                parameters: {
                    streamer: "",
                    bitsPerVote: "",
                    channelPointsPerVote: "",
                    choices: "",
                    endDate: "",
                    id: "",
                    isBitsVotingEnabled: "",
                    isChannelPointsVotingEnabled: "",
                    startDate: "",
                    status: "",
                    title: "",
                }
            },
            {
                name: "PollProgress",
                displaytitle: "PollProgress",
                description: "A Poll Progressed",
                messagetype: "trigger_TwitchPollProgress",
                parameters: {
                    streamer: "",
                    bitsPerVote: "",
                    channelPointsPerVote: "",
                    choices: "",
                    endDate: "",
                    id: "",
                    isBitsVotingEnabled: "",
                    isChannelPointsVotingEnabled: "",
                    startDate: "",
                    title: "",
                }
            },
            {
                name: "PredictionBegin",
                displaytitle: "Prediction Begin",
                description: "A Prediction Began",
                messagetype: "trigger_TwitchPredictionBegin",
                parameters: {
                    streamer: "",
                    id: "",
                    lockDate: "",
                    outcomes: "",
                    predictions: "",
                    startDate: "",
                    title: "",
                }
            },
            {
                name: "Prediction",
                displaytitle: "Prediction",
                description: "A Prediction ",
                messagetype: "trigger_TwitchPrediction",
                parameters: {
                    streamer: "",
                    id: "",
                    duration: "",
                    title: "",
                    status: "",
                    outcomes: "",
                    winner: "",
                    winnerId: "",
                    lockDate: "",
                    endDate: "",
                }
            },
            {
                name: "PredictionEnd",
                displaytitle: "Prediction End",
                description: "A Prediction Ended",
                messagetype: "trigger_TwitchPredictionEnd",
                parameters: {
                    streamer: "",
                    endDate: "",
                    id: "",
                    outcomes: "",
                    predictions: "",
                    startDate: "",
                    title: "",
                    winningOutcome: "",
                    winningOutcomeId: ""
                }
            },
            {
                name: "PredictionLock",
                displaytitle: "Prediction Lock",
                description: "A Prediction Locked",
                messagetype: "trigger_TwitchPredictionLock",
                parameters: {
                    streamer: "",
                    id: "",
                    lockDate: "",
                    outcomes: "",
                    predictions: "",
                    startDate: "",
                    title: "",
                }
            },
            {
                name: "PredictionProgress",
                displaytitle: "Prediction Progress",
                description: "A Prediction Progressed",
                messagetype: "trigger_TwitchPredictionProgress",
                parameters: {
                    streamer: "",
                    id: "",
                    lockDate: "",
                    outcomes: "",
                    predictions: "",
                    startDate: "",
                    title: "",
                }
            },
            {
                name: "RaidFrom",
                displaytitle: "Raid From",
                description: "Another streamer raided the channel",
                messagetype: "trigger_TwitchRaidFrom",
                parameters: {
                    streamer: "",
                    raider: "",
                    viewers: "",
                }
            },
            {
                name: "RaidTo",
                displaytitle: "Raid To",
                description: "A raid was started",
                messagetype: "trigger_TwitchRaidTo",
                parameters: {
                    streamer: "",
                    raider: "",
                    viewers: "",
                }
            },

            {
                name: "RedemptionAdd",
                displaytitle: "Points Redemption Add",
                description: "A user used channel points for a redemption",
                messagetype: "trigger_TwitchRedemptionAdd",
                parameters: {
                    streamer: "",
                    id: "",
                    message: "",
                    rewardId: "",
                    cost: "",
                    prompt: "",
                    title: "",
                    status: "",
                    user: ""
                }
            },
            {
                name: "RedemptionUpdate",
                displaytitle: "Points Redemption Update",
                description: "A user used channel points for a redemption update??",
                messagetype: "trigger_TwitchRedemptionUpdate",
                parameters: {
                    streamer: "",
                    message: "",
                    cost: "",
                    id: "",
                    prompt: "",
                    title: "",
                    user: ""
                }
            },
            {
                name: "RewardAdd",
                displaytitle: "Reward Add",
                description: "Reward added by streamer to channel",
                messagetype: "trigger_TwitchRewardAdd",
                parameters: {
                    autoApproved: "",
                    backgroundColor: "",
                    broadcasterDisplayName: "",
                    broadcasterId: "",
                    broadcasterName: "",
                    cooldownExpiryDate: "",
                    cost: "",
                    globalCooldown: "",
                    id: "",
                    isEnabled: "",
                    isInStock: "",
                    isPaused: "",
                    maxRedemptionsPerStream: "",
                    maxRedemptionsPerUserPerStream: "",
                    prompt: "",
                    redemptionsThisStream: "",
                    title: "",
                    userInputRequired: ""
                }
            },
            {
                name: "RewardRemove",
                displaytitle: "Reward Remove",
                description: "Reward removed by streamer to channel",
                messagetype: "trigger_TwitchRewardRemove",
                parameters: {
                    autoApproved: "",
                    backgroundColor: "",
                    broadcasterDisplayName: "",
                    broadcasterId: "",
                    broadcasterName: "",
                    cooldownExpiryDate: "",
                    cost: "",
                    globalCooldown: "",
                    id: "",
                    isEnabled: "",
                    isInStock: "",
                    isPaused: "",
                    maxRedemptionsPerStream: "",
                    maxRedemptionsPerUserPerStream: "",
                    prompt: "",
                    redemptionsThisStream: "",
                    title: "",
                    userInputRequired: ""
                }
            },
            {
                name: "RewardUpdate",
                displaytitle: "Reward Update",
                description: "Reward updated by streamer to channel",
                messagetype: "trigger_TwitchRewardUpdate",
                parameters: {
                    streamer: "",
                    autoApproved: "",
                    bgColor: "",
                    expiryDate: "",
                    cost: "",
                    cooldown: "",
                    id: "",
                    enabled: "",
                    inStock: "",
                    paused: "",
                    maxPerStream: "",
                    maxPerUserPerStream: "",
                    prompt: "",
                    redemptionsThisStream: "",
                    title: "",
                    inputRequired: ""
                }
            },
            {
                name: "ShieldModeBegin",
                displaytitle: "Shield Mode Begin",
                description: "Shield mode was started",
                messagetype: "trigger_TwitchShieldModeBegin",
                parameters: {
                    streamer: "",
                    moderator: "",
                }
            },
            {
                name: "ShieldModeEnd",
                displaytitle: "Shield Mode End",
                description: "Shield mode was ended",
                messagetype: "trigger_TwitchShieldModeEnd",
                parameters: {
                    streamer: "",
                    moderator: "",
                }
            },
            {
                name: "ShoutoutSent",
                displaytitle: "Shoutout Sent",
                description: "A shoutout was performed by the streamer",
                messagetype: "trigger_TwitchShoutoutCreate",
                parameters: {
                    streamer: "",
                    cooldownDate: "",
                    moderator: "",
                    targetName: "",
                    targetCooldown: "",
                    viewerCount: "",
                }
            },
            {
                name: "ShoutoutReceive",
                displaytitle: "Shoutout Receive",
                description: "A shoutout was received for the streamer",
                messagetype: "trigger_TwitchShoutoutReceive",
                parameters: {
                    streamer: "",
                    shouterName: "",
                    viewerCount: "",
                }
            },
            {
                name: "Subscription",
                displaytitle: "Subscription",
                description: "Someone subscribed",
                messagetype: "trigger_TwitchSubscription",
                parameters: {
                    streamer: "",
                    isGift: "",
                    tier: "",
                    userDisplayName: "",
                }
            },
            {
                name: "SubscriptionEnd",
                displaytitle: "Subscription End",
                description: "Someone subscription ended",
                messagetype: "trigger_TwitchSubscriptionEnd",
                parameters: {
                    streamer: "",
                    isGift: "",
                    tier: "",
                    user: "",
                }
            },
            {
                name: "SubscriptionGift",
                displaytitle: "Subscription Gift",
                description: "Someone gifted a subscription",
                messagetype: "trigger_TwitchSubscriptionGift",
                parameters: {
                    streamer: "",
                    amount: "",
                    cumulativeAmount: "",
                    isGift: "",
                    gifter: "",
                    anon: "",
                    tier: "",

                }
            },
            {
                name: "SubscriptionMessage",
                displaytitle: "Subscription Message",
                description: "Announcement of a channel subscription by the subscriber",
                messagetype: "trigger_TwitchSubscriptionMessage",
                parameters: {
                    streamer: "",
                    cumulativeMonths: "",
                    durationMonths: "",
                    emoteOffsets: "",
                    message: "",
                    streakMonths: "",
                    tier: "",
                    user: ""

                }
            },
            {
                name: "UserUnBanned",
                displaytitle: "UserUnBanned",
                description: "A user was unbanned",
                messagetype: "trigger_TwitchUserUnBanned",
                parameters: {
                    streamer: "",
                    moderator: "",
                    user: ""
                }
            },
            {
                name: "TitleChanged",
                displaytitle: "TitleChanged",
                description: "The Stream title was changed",
                messagetype: "trigger_TwitchTitleChanged",
                parameters: {
                    title: ""
                }
            },
            {
                name: "GamedIdChanged",
                displaytitle: "Gamed Id Changed",
                description: "The Game Id was changed",
                messagetype: "trigger_TwitchGamedIdChanged",
                parameters: {
                    gameId: ""
                }
            },
            {
                name: "GamedNameChanged",
                displaytitle: "Gamed Name Changed",
                description: "The Game Name was changed",
                messagetype: "trigger_TwitchGamedNameChanged",
                parameters: {
                    name: ""
                }
            },
            {
                name: "StreamIdChanged",
                displaytitle: "Stream Id Changed",
                description: "The stream ID has changed",
                messagetype: "trigger_TwitchStreamIdChanged",
                parameters: {
                    id: ""
                }
            },
            {
                name: "StreamLanguageChanged",
                displaytitle: "Stream language Changed",
                description: "The stream language has changed",
                messagetype: "trigger_TwitchStreamLanguageChanged",
                parameters: {
                    language: ""
                }
            },
            {
                name: "StreamerNameChanged",
                displaytitle: "Streamer name Changed",
                description: "The streamer name has changed",
                messagetype: "trigger_TwitchStreamerNameChanged",
                parameters: {
                    user: ""
                }
            },
            {
                name: "StreamStarted",
                displaytitle: "Stream Started",
                description: "The Stream Started",
                messagetype: "trigger_TwitchStreamStarted",
                parameters: {}
            },
            {
                name: "StreamEnded",
                displaytitle: "Stream Ended",
                description: "The Stream Ended",
                messagetype: "trigger_TwitchStreamEnded",
                parameters: {}
            },
            {// triggered from here as eventsub doesn't have this event
                name: "CommercialStarted",
                displaytitle: "Commercial started",
                description: "A Commercial was started",
                messagetype: "trigger_TwitchCommercialStarted",
                parameters: {
                    duration: ""
                }
            },
            {// triggered from here as eventsub doesn't have this event
                name: "VIPAdded",
                displaytitle: "VIP Added",
                description: "A User was added to the VIP list",
                messagetype: "trigger_TwitchVIPAdded",
                parameters: {
                    user: ""
                }
            },
            {// triggered from here as eventsub doesn't have this event
                name: "VIPRemoved",
                displaytitle: "VIP Removed",
                description: "A User was removed to the VIP list",
                messagetype: "trigger_TwitchVIPRemoved",
                parameters: {
                    user: ""
                }
            },
            {
                name: "Editors",
                displaytitle: "Editors",
                description: "A list of editors for the channel",
                messagetype: "trigger_TwitchEditors",
                parameters: {
                    editors: ""
                }
            },
            {
                name: "VIPs",
                displaytitle: "VIPs",
                description: "A list of VIPs for the channel",
                messagetype: "trigger_TwitchVIPs",
                parameters: {
                    VIPs: ""
                }
            },
            {
                name: "FollowerCount",
                displaytitle: "Follower Count",
                description: "Follower count",
                messagetype: "trigger_TwitchFollowerCount",
                parameters: { count: "" }
            },
            {
                name: "FollowedChannels",
                displaytitle: "Followed Channels",
                description: "Followed channels",
                messagetype: "trigger_TwitchFollowedChannels",
                parameters: { channels: "" }
            },
            {
                name: "CheerEmotes",
                displaytitle: "Cheer Emotes",
                description: "Cheer emotes",
                messagetype: "trigger_TwitchCheerEmotes",
                parameters: { emotes: "" }
            },
            {
                name: "Leaderboard",
                displaytitle: "Leaderboard",
                description: "Bits leaderboard",
                messagetype: "trigger_TwitchLeaderboard",
                parameters: { leaderboard: "" }
            },
            {
                name: "Poll",
                displaytitle: "Poll",
                description: "A poll",
                messagetype: "trigger_TwitchPoll",
                parameters: {
                    id: "",
                    title: "",
                    status: "",
                    choices: "",
                    duration: "",
                    enabled: "",
                    pointsPerVote: "",
                    startDate: "",
                    endDate: "",
                }
            },
            {
                name: "UserBlocks",
                displaytitle: "User blocks",
                description: "Who this user has blocked",
                messagetype: "trigger_TwitchUserBlocks",
                parameters: {
                    username: "",
                    blocked: ""
                }
            },
            {
                name: "ClipCreated",
                displaytitle: "Twitch clip created",
                description: "A twitch clip",
                messagetype: "trigger_TwitchClipCreated",
                parameters: {
                    clipName: ""
                }
            },
            {
                name: "VodClip",
                displaytitle: "Twitch Vod clip",
                description: "A twitch vod clip",
                messagetype: "trigger_TwitchVodClip",
                parameters: {
                    streamer: "",
                    date: "",
                    creator: "",
                    duration: "",
                    embedUrl: "",
                    gameId: "",
                    id: "",
                    language: "",
                    thumbnail: "",
                    title: "",
                    url: "",
                    videoId: "",
                    views: "",
                    vodOffset: ""
                }
            },
            {
                name: "UserDetails",
                displaytitle: "Twitch User Details",
                description: "Twitch User Data",
                messagetype: "trigger_TwitchUserDetails",
                parameters: {
                    username: "",
                    userNameInvalid: false,
                    userId: "",
                    userDisplayName: "",
                    creationDate: "",
                    description: "",
                    offlinePlaceholderUrl: "",
                    profilePictureUrl: "",
                    type: ""
                }
            },
            {
                name: "GameCategories",
                displaytitle: "List of games",
                description: "Updated list of games",
                messagetype: "trigger_TwitchGameCategories",
                parameters: {
                    id: 0,
                    games: []
                }
            },
        ],
    actions:
        [
            {
                name: "ChangeTitle",
                displaytitle: "Change Title",
                description: "Change channel title",
                messagetype: "action_TwitchChangeTitle",
                parameters: { title: "" }
            },
            {
                name: "StartCommercial",
                displaytitle: "Start Commercial",
                description: "Start a Commercial for (30, 60, 90, 120, 150, 180) seconds",
                messagetype: "action_TwitchStartCommercial",
                parameters: { duration: "" }
            },
            {
                name: "GetEditors",
                displaytitle: "GetEditors",
                description: "Get a list of editors for the channel",
                messagetype: "action_TwitchGetEditors",
                parameters: {}
            },
            {
                name: "GetVIPs",
                displaytitle: "GetVIPs",
                description: "Get a list of VIPs for the channel",
                messagetype: "action_TwitchGetVIPs",
                parameters: {}
            },
            {
                name: "AddVIP",
                displaytitle: "Add VIP",
                description: "Promote user to VIP",
                messagetype: "action_TwitchAddVIP",
                parameters: { user: "" }
            },
            {
                name: "RemoveVIP",
                displaytitle: "Remove VIP",
                description: "Demote user from VIP",
                messagetype: "action_TwitchRemoveVIP",
                parameters: { user: "" }
            },
            {
                name: "AddMod",
                displaytitle: "Add Mod",
                description: "Promote user to Mod",
                messagetype: "action_TwitchAddMod",
                parameters: { user: "" }
            },
            {
                name: "RemoveMod",
                displaytitle: "Remove Mod",
                description: "Demote user from Mod",
                messagetype: "action_TwitchRemoveMod",
                parameters: { user: "" }
            },
            {
                name: "Ban",
                displaytitle: "Ban a user",
                description: "Bans a user from the stream",
                messagetype: "action_TwitchBan",
                parameters: { user: "", reason: "" }
            },
            {
                name: "Unban",
                displaytitle: "Unban a user",
                description: "Unbans a user from the stream",
                messagetype: "action_TwitchUnban",
                parameters: { user: "", reason: "" }
            }, {
                name: "FollowerCount",
                displaytitle: "Follower Count",
                description: "Get follower count",
                messagetype: "action_TwitchFollowerCount",
                parameters: {}
            },
            {
                name: "FollowedChannels",
                displaytitle: "Followed Channels",
                description: "Get followed channels",
                messagetype: "action_TwitchFollowedChannels",
                parameters: {}
            },
            {
                name: "CheerEmotes",
                displaytitle: "Cheer Emotes",
                description: "Get cheer emotes",
                messagetype: "action_TwitchCheerEmotes",
                parameters: {}
            },
            {
                name: "Leaderboard",
                displaytitle: "Leaderboard",
                description: "Get bits leaderboard",
                messagetype: "action_TwitchLeaderboard",
                parameters: {}
            },
            {
                name: "GetPolls",
                displaytitle: "Get Polls",
                description: "Gets a list of polls",
                messagetype: "action_TwitchGetPolls",
                parameters: {}
            },
            {
                name: "GetPoll",
                displaytitle: "Get Poll",
                description: "Get a poll",
                messagetype: "action_TwitchGetPoll",
                parameters: { id: "" }
            },
            {
                name: "CreatePoll",
                displaytitle: "Create Poll",
                description: "Create a poll",
                messagetype: "action_TwitchCreatePoll",
                parameters: {
                    title: "",
                    duration: "",
                    choices: "",//comma separated
                    points: ""
                }
            },
            {
                name: "EndPoll",
                displaytitle: "End Poll",
                description: "End a poll",
                messagetype: "action_TwitchEndPoll",
                parameters: {
                    id: "",
                    display: ""
                }
            },
            {
                name: "StartPrediction",
                displaytitle: "StartPrediction",
                description: "Start a prediction",
                messagetype: "action_TwitchStartPrediction",
                parameters: {
                    title: "",
                    choices: "",
                    duration: ""
                }
            },
            {
                name: "CancelPrediction",
                displaytitle: "CancelPrediction",
                description: "Cancel a prediction",
                messagetype: "action_TwitchCancelPrediction",
                parameters: {
                    id: "",
                }
            },
            {
                name: "GetPredictions",
                displaytitle: "Get Predictions",
                description: "Gets a list of predictions",
                messagetype: "action_TwitchGetPredictions",
                parameters: {
                    state: ""
                }
            },
            {
                name: "GetPrediction",
                displaytitle: "Get Prediction",
                description: "Get a prediction",
                messagetype: "action_TwitchGetPrediction",
                parameters: { id: "" }
            },
            {
                name: "LockPrediction",
                displaytitle: "Lock Prediction",
                description: "Lock a prediction",
                messagetype: "action_TwitchLockPrediction",
                parameters: { id: "" }
            },
            {
                name: "RemovePrediction",
                displaytitle: "Remove Prediction",
                description: "Remove a prediction",
                messagetype: "action_TwitchLRemovePrediction",
                parameters: { id: "" }
            },
            {
                name: "ResolvePrediction",
                displaytitle: "Resolve Prediction",
                description: "Resolve a prediction",
                messagetype: "action_TwitchLResolvePrediction",
                parameters: {
                    id: "",
                    outcomeId: ""
                }
            },
            //users
            {
                name: "CreateUserBlock",
                displaytitle: "Create User Block",
                description: "Block a user",
                messagetype: "action_TwitchCreateBlock",
                parameters: {
                    username: "",
                    reason: "",
                    context: ""
                }
            },
            {
                name: "DeleteUserBlock",
                displaytitle: "Delete User Block",
                description: "Unblock a user",
                messagetype: "action_TwitchDeleteBlock",
                parameters: {
                    username: "",
                }
            },
            {
                name: "GetUser",
                displaytitle: "Get Users Details",
                description: "Gets a Users Details",
                messagetype: "action_TwitchGetUser",
                parameters: {
                    username: "",
                    data: null,
                }
            },
            {
                name: "GetBlocks",
                displaytitle: "Get blocked users",
                description: "Get a list of blocked users",
                messagetype: "action_TwitchGetBlocks",
                parameters: {}
            },
            {
                name: "CreateClip",
                displaytitle: "Create clip",
                description: "Create a twitch clip",
                messagetype: "action_TwitchCreateClip",
                parameters: {}
            },
            {
                name: "GetClipById",
                displaytitle: "Get Clip By Id",
                description: "Get clip by id",
                messagetype: "action_TwitchGetClipById",
                parameters: { clipName: "" }
            },
            {
                name: "GetClipsForBroadcaster",
                displaytitle: "Get Clips For Broadcaster",
                description: "Get clips for a broadcaster",
                messagetype: "action_TwitchGetClipsForBroadcaster",
                parameters: {
                    name: "",
                    count: ""
                }
            },
            {
                name: "GetClipsForGame",
                displaytitle: "Get Clips For Game",
                description: "Get clips for a game",
                messagetype: "action_TwitchGetClipsForGame",
                parameters: {
                    game: "",
                    count: ""
                }
            },
            {
                name: "TwitchGameCategories",
                displaytitle: "Get a list of games",
                description: "Get the list of games",
                messagetype: "action_GetTwitchGameCategories",
                parameters: {
                    id: 0,
                    games: []
                }
            },

        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
function start (host, port, nonce, clientId, heartbeat)
{
    localConfig.host = host;
    localConfig.port = port;
    localConfig.clientId = clientId;
    if (typeof (heartbeat) != "undefined")
        localConfig.heartBeatTimeout = heartbeat;
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".start", "DataCenterSocket no heartbeat passed:", heartbeat);
    try
    {
        ConnectToDataCenter(localConfig.host, localConfig.port);
    }
    catch (err)
    {
        logger.err(serverConfig.extensionname + " server.start", "initialise failed:", err.message);
    }
}
// ============================================================================
//                           FUNCTION: ConnectToDataCenter
// ============================================================================
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
    } catch (err)
    {
        logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
function onDataCenterDisconnect (reason)
{
    logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestConfig", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("RequestCredentials", serverConfig.extensionname));

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("CreateChannel", serverConfig.extensionname, serverConfig.channel));

    clearTimeout(localConfig.heartBeatHandle);
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ============================================================================
//                           FUNCTION: onDataCenterMessage
// ============================================================================
function onDataCenterMessage (server_packet)
{
    // -----------------------------------------------------------------------------------
    //                  RECEIVED CONFIG
    // -----------------------------------------------------------------------------------
    if (server_packet.type === "ConfigFile")
    {
        // check it is our config
        if (server_packet.to === serverConfig.extensionname)
        {
            if (server_packet.data.__version__ != default_serverConfig.__version__)
            {
                serverConfig = structuredClone(default_serverConfig);
                console.log("\x1b[31m" + serverConfig.extensionname
                    + " ConfigFile Updated", "The config file has been Updated to the latest version v"
                    + default_serverConfig.__version__ + ". Your settings may have changed " + "\x1b[0m");
            }
            else
            {
                // update our config
                if (server_packet.data != "")
                    serverConfig = structuredClone(server_packet.data)
            }
            SaveConfigToServer();
        }
    }
    // -----------------------------------------------------------------------------------
    //                  RECEIVED CREDENTIALS
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "CredentialsFile")
    {
        if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != ""
            && server_packet.data.twitchOAuthState != "" && server_packet.data.twitchOAuthToken != "")
        {
            localCredentials.twitchOAuthState = server_packet.data.twitchOAuthState;
            localCredentials.twitchOAuthToken = server_packet.data.twitchOAuthToken;
            localConfig.authProvider = new StaticAuthProvider(localConfig.clientId, localCredentials.twitchOAuthToken);
            if (serverConfig.twitchenabled == "on")
            {
                setTimeout(() =>
                {
                    disconnectTwitch();
                    connectTwitch();
                }, 1000);
            }
        }
    }
    // -----------------------------------------------------------------------------------
    //                      ### EXTENSION MESSAGE ###
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "ExtensionMessage")
    {
        let extension_packet = server_packet.data;
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR SETTINGS DIALOG
        // -----------------------------------------------------------------------------------
        if (extension_packet.type === "RequestSettingsWidgetSmallCode")
        {
            SendSettingsWidgetSmall(extension_packet.from);
        }
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR CREDENTIALS DIALOG
        // -----------------------------------------------------------------------------------

        else if (extension_packet.type === "RequestCredentialsModalsCode")
            SendCredentialsModal(extension_packet.from);
        // -----------------------------------------------------------------------------------
        //                   SETTINGS DIALOG DATA
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "SettingsWidgetSmallData")
        {
            if (extension_packet.to === serverConfig.extensionname)
            {
                if (extension_packet.data.twitchresetdefaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Defaults restored", "The config files have been reset. Your settings may have changed" + "\x1b[0m");
                    SaveConfigToServer();
                }
                else
                {
                    handleSettingsWidgetSmallData(extension_packet.data);
                    SaveConfigToServer();

                    if (localConfig.status.connected)
                        disconnectTwitch();
                    connectTwitch()
                }
            }
        }
        // -----------------------------------------------------------------------------------
        //                   REQUEST FOR USER TRIGGERS
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "SendTriggerAndActions")
        {
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "TriggerAndActions",
                        serverConfig.extensionname,
                        triggersandactions,
                        "",
                        server_packet.from
                    ),
                    "",
                    server_packet.from
                )
            )
        }
        // -----------------------------------------------------------------------------------
        //                   Change title
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchChangeTitle")
        {
            if (extension_packet.data.title != "")
                setStreamTitle(extension_packet.data.title)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to change title with no title provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchStartCommercial
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchStartCommercial")
        {
            if (extension_packet.data.duration != "")
                startCommercial(extension_packet.data.duration)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to start a commercial with no duration provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetEditors
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetEditors")
        {
            getChannelEditors()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetVIPs
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetVIPs")
        {
            getChannelVIPs()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchAddVIP
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchAddVIP")
        {
            if (extension_packet.data.user != "")
                addVIP(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to VIP a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchRemoveVIP
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchRemoveVIP")
        {
            if (extension_packet.data.user != "")
                removeVIP(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove VIP from a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchAddMod
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchAddMod")
        {
            if (extension_packet.data.user != "")
                addMod(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to Mod a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchRemoveMod
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchRemoveMod")
        {
            if (extension_packet.data.user != "")
                removeMod(extension_packet.data.user)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove Mod from a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchBan
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchBan")
        {
            console.log("action_TwitchBan")
            if (extension_packet.data.user != "")
                banUser(extension_packet.data.user, extension_packet.data.reason)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to ban a user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchUnban
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchUnban")
        {
            console.log("action_TwitchBan")
            if (extension_packet.data.user != "")
                unbanUser(extension_packet.data.user, extension_packet.data.reason)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unban user with no username provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchFollowerCount
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchFollowerCount")
        {
            followerCount()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchFollowedChannels
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchFollowedChannels")
        {
            followedChannels()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchCheerEmotes
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchCheerEmotes")
        {
            cheerEmotes()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLeaderboard
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchLeaderboard")
        {
            leaderboard()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetPolls
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetPolls")
        {
            getPolls()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetPoll
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetPoll")
        {
            if (extension_packet.data.id != "")
                getPoll(extension_packet.data.id)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to get a poll with no poll id");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchCreatePoll
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchCreatePoll")
        {
            if (extension_packet.data != "")
                createPoll(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to create a poll with no poll data");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchEndPoll
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchEndPoll")
        {
            if (extension_packet.data != "")
                endPoll(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to end a poll with no poll data");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchStartPrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchStartPrediction")
        {
            if (extension_packet.data != "")
                startPrediction(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to start a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchCancelPrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchCancelPrediction")
        {
            if (extension_packet.data != "")
                cancelPrediction(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to cancel a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetPrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetPrediction")
        {
            if (extension_packet.data != "")
                getPrediction()
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to get a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetPredictions
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetPredictions")
        {
            if (extension_packet.data != "")
                getPredictions(extension_packet.data)
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLockPrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchLockPrediction")
        {
            if (extension_packet.data != "")
                lockPrediction(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to lock a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLRemovePrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchLRemovePrediction")
        {
            if (extension_packet.data != "")
                removePrediction(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLResolvePrediction
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchLResolvePrediction")
        {
            if (extension_packet.data != "")
                resolvePrediction(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to resolve a prediction with no prediction data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLCreateBlock
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchCreateBlock")
        {
            if (extension_packet.data != "")
                createBlock(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to block a user with no data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchLDeleteBlock
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchDeleteBlock")
        {
            if (extension_packet.data != "")
                deleteBlock(extension_packet.data)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unblock a user with no data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetUser
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetUser")
        {
            if (extension_packet.data != "")
                getUser(extension_packet.data.username)
            else
                logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unblock a user with no data provided");
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetBlocks
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetBlocks")
        {
            getBlockedUsers()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchCreateClip
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchCreateClip")
        {
            createClip()
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetClipById
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetClipById")
        {
            getClipById(extension_packet.data)
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetClipsForBroadcaster
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetClipsForBroadcaster")
        {
            getClipsByBroadcaster(extension_packet.data)
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetClipsForGame
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_TwitchGetClipsForGame")
        {
            getClipsByGame(extension_packet.data)
        }
        // -----------------------------------------------------------------------------------
        //                   action_TwitchGetClipsForGame
        // -----------------------------------------------------------------------------------
        else if (extension_packet.type === "action_GetTwitchGameCategories")
        {
            getAllGameCategories(extension_packet.data)
        }


    }
    // -----------------------------------------------------------------------------------
    //                           UNKNOWN CHANNEL MESSAGE RECEIVED
    // -----------------------------------------------------------------------------------
    else if (server_packet.type === "UnknownChannel")
    {
        // channel might not exist yet, extension might still be starting up so lets 
        // reschedule the join attempt need to add some sort of flood control here 
        // so we are only attempting to join one at a time
        if (server_packet.data != "" && server_packet.channel != undefined)
        {
            setTimeout(() =>
            {
                sr_api.sendMessage(localConfig.DataCenterSocket,
                    sr_api.ServerPacket(
                        "JoinChannel",
                        serverConfig.extensionname,
                        server_packet.data
                    ));
            }, 5000);
        }
    }
    else if (server_packet.type === "ChannelJoined"
        || server_packet.type === "ChannelCreated"
        || server_packet.type === "ChannelLeft"
        || server_packet.type === "HeartBeat"
        || server_packet.type === "UnknownExtension"
        || server_packet.type === "ChannelJoined"
        || server_packet.type === "LoggingLevel"
    )
    {
        // just a blank handler for items we are not using to avoid message from the catch all
    }
    // ------------------------ unknown message type received ----------------------------------
    else
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled message type:", server_packet);
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
function SaveConfigToServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "SaveConfig",
            serverConfig.extensionname,
            serverConfig,
        ));
}
// ===========================================================================
//                           FUNCTION: SendSettingsWidgetSmall
// ===========================================================================
function SendSettingsWidgetSmall (toChannel)
{
    fs.readFile(__dirname + "/twitchsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        }
        else
        {
            let modalstring = filedata.toString();

            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalstring = modalstring.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            modalstring = modalstring.replace("twitchGameCategorySelector", updateGameCagogories("twitchGameCategorySelector"));

            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        toChannel,
                        serverConfig.channel
                    ),
                    "",
                    toChannel
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: SendCredentialsModal
// ===========================================================================
/**
 * Send our CredentialsModal to whoever requested it
 * @param {String} extensionname 
 */
function SendCredentialsModal (extensionname)
{
    fs.readFile(__dirname + "/twitchcredentialsmodal.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + localConfig.EXTENSION_NAME +
                ".SendCredentialsModal", "failed to load modal", err);
        //throw err;
        else
        {
            let modalstring = filedata.toString();

            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalstring = modalstring.replaceAll(key + "checked", "checked");
                else if (typeof (value) == "string" || typeof (value) == "number")
                    modalstring = modalstring.replaceAll(key + "text", value);
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "CredentialsModalCode",
                        serverConfig.extensionname,
                        modalstring,
                        "",
                        extensionname,
                        serverConfig.channel
                    ),
                    "",
                    extensionname)
            )
        }
    });
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
function handleSettingsWidgetSmallData (modalCode)
{
    serverConfig.twitchenabled = "off";
    serverConfig.twitchresetdefaults = "off";
    for (const [key, value] of Object.entries(modalCode))
        serverConfig[key] = value;
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
function heartBeatCallback ()
{
    localConfig.status.color = "red"
    if (serverConfig.twitchenabled == "on" && localConfig.status.connected)
        localConfig.status.color = "green"
    else if (serverConfig.twitchenabled == "on")
        localConfig.status.color = "orange"

    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ChannelData",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "HeartBeat",
                serverConfig.extensionname,
                localConfig.status,
                serverConfig.channel),
            serverConfig.channel
        ),
    );
    localConfig.heartBeatHandle = setTimeout(heartBeatCallback, localConfig.heartBeatTimeout)
}
// ===========================================================================
//                           TWITCH PUBSUB
// ===========================================================================

// ===========================================================================
//                           FUNCTION: connectTwitch
// ===========================================================================
async function connectTwitch ()
{
    try
    {
        if (localConfig.authProvider == "")
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Missing authorization, go to http://localhost:3000/twitch/auth to authorise for twitch");
            return;
        }
        if (serverConfig.twitchstreamername == "")
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Missing stream name, please set a stream name to work with in the settings");
            return;
        }
        // setup client
        let auth = localConfig.authProvider
        localConfig.apiClient = new ApiClient({ authProvider: auth });

        // get some data about the streamer (id etc)
        localConfig.streamerData = await localConfig.apiClient.users.getUserByName(serverConfig.twitchstreamername)

        if (localConfig.streamerData == null)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Streamer Not found");
            return
        }

        // get the current channel info (needed so we can trigger on changes)
        let channelData = await localConfig.apiClient.channels.getChannelInfoById(localConfig.streamerData.id)

        // Connect to the pub sub event listener
        eventSubApi.init(localConfig, serverConfig, triggersandactions)
        eventSubApi.startEventSub(localConfig.streamerData.id, localConfig.apiClient, channelData)

        // get the game categories for twitch
        getAllGameCategories();

        // set us to connected at this time
        localConfig.status.connected = true;
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "ERROR", err.message);
        localConfig.status.connected = false;
    }
}
// ===========================================================================
//                           FUNCTION: getAllGameCategories
// ===========================================================================
async function getAllGameCategories (id = "twitch")
{
    try
    {
        // Fetch paginated results for top games
        const gamePaginator = localConfig.apiClient.games.getTopGamesPaginated();

        // Asynchronously iterate through all pages
        for await (const game of gamePaginator)
        {
            localConfig.gameCategories.push(game.name)
            //console.log(`Game: ${game.name}, ID: ${game.id}`);
        }
        sendGameCategoriesTrigger(id)
        console.log('Finished fetching all categories.');
    } catch (error)
    {
        console.error('Error fetching categories:', error);
    }
}

// ===========================================================================
//                           FUNCTION: disconnectTwitch
// ===========================================================================
function disconnectTwitch ()
{
    eventSubApi.removeSubs()
}
// ===========================================================================
//                           FUNCTION: setStreamTitle
// ===========================================================================
async function setStreamTitle (title)
{
    await localConfig.apiClient.channels.updateChannelInfo(localConfig.streamerData.id, { title: title })
}
// ===========================================================================
//                           FUNCTION: startCommercial
// ===========================================================================
async function startCommercial (length)
{
    try
    {
        let lengths = ["30", "60", "90", "120", "150", "180"]
        if (!lengths.includes(length))
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "Commercial length invalid, must be one of 30, 60, 90, 120, 150, 180")
        else
        {
            await localConfig.apiClient.channels.startChannelCommercial(localConfig.streamerData.id, length)
            //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
            let trigger = findTriggerByMessageType("trigger_TwitchCommercialStarted");
            trigger.parameters.duration = length;
            sendTrigger(trigger)
        }
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial, is streamer live?");
            console.error(err, err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial (try reauthorising by going to  go to http://localhost:3000/twitch/auth)");
            console.error(err, err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: getChannelEditors
// ===========================================================================
async function getChannelEditors ()
{
    try
    {
        let editors = await localConfig.apiClient.channels.getChannelEditors(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchEditors");
        // need to clear out the last run otherwise we will get repeated names in here
        trigger.parameters.editors = ""
        editors.forEach(function (value, key)
        {
            trigger.parameters.editors += value.userDisplayName + " "
        })
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getChannelEditors", "ERROR", "Failed to get editors (try reauthorising by going to  go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getChannelVIPs
// ===========================================================================
async function getChannelVIPs ()
{
    try
    {
        let VIPs = await localConfig.apiClient.channels.getVips(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchVIPs");
        // need to clear out the last run otherwise we will get repeated names in here
        trigger.parameters.VIPs = ""
        VIPs.data.forEach(function (value, key)
        {
            trigger.parameters.VIPs += value.displayName + " "
        })
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getChannelVIPs", "ERROR", "Failed to get VIPs (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: addVIP
// ===========================================================================
async function addVIP (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.channels.addVip(localConfig.streamerData.id, user.id)
        //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
        let trigger = findTriggerByMessageType("trigger_TwitchVIPAdded");
        trigger.parameters.user = username;
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addVIP", "ERROR", "Failed to add VIP?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addVIP", "ERROR", "Failed to add VIP)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeVIP
// ===========================================================================
async function removeVIP (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.channels.removeVip(localConfig.streamerData.id, user.id)
        //TBD need to move trigger to pubsub/eventsub if we ever work out how to do that
        let trigger = findTriggerByMessageType("trigger_TwitchVIPRemoved");
        trigger.parameters.user = username;
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeVIP", "ERROR", "Failed to remove VIP?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeVIP", "ERROR", "Failed to remove VIP)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: addMod
// ===========================================================================
async function addMod (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.moderation.addModerator(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addMod", "ERROR", "Failed to add Mod?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addMod", "ERROR", "Failed to add Moderator)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeMod
// ===========================================================================
async function removeMod (username)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(username)
        await localConfig.apiClient.moderation.removeModerator(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeMod", "ERROR", "Failed to remove Mod?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeMod", "ERROR", "Failed to remove Moderator)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: banUser
// ===========================================================================
async function banUser (username, reason)
{
    try
    {
        console.log("banUser", username, reason)
        console.log("banUser", localConfig.apiClient)
        let user = await localConfig.apiClient.users.getUserByName(username)
        console.log("banUser", user)
        let banData = {
            duration: 0,
            reason: "streamrollerBan:" + reason,
            user: user.id
        }
        await localConfig.apiClient.moderation.banUser(localConfig.streamerData.id, banData)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".banUser", "ERROR", "Failed to ban User?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".banUser", "ERROR", "Failed to ban User)");
            console.error(err);
        }
    }
}
unbanUser
// ===========================================================================
//                           FUNCTION: unbanUser
// ===========================================================================
async function unbanUser (username, reason)
{
    try
    {
        console.log("unbanUser", username, reason)
        console.log("unbanUser", localConfig.apiClient)
        let user = await localConfig.apiClient.users.getUserByName(username)
        console.log("unbanUser", user)
        let banData = {
            duration: 0,
            reason: "streamrollerBan:" + reason,
            user: user.id
        }
        await localConfig.apiClient.moderation.unbanUser(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".unbanUser", "ERROR", "Failed to ban User?");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".unbanUser", "ERROR", "Failed to ban User)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: followerCount
// ===========================================================================
async function followerCount ()
{
    try
    {
        let count = await localConfig.apiClient.channels.getChannelFollowerCount(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchFollowerCount");
        trigger.parameters.count = count;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".followerCount", "ERROR", "Failed to get follower count)");
        console.error(err);

    }
}
// ===========================================================================
//                           FUNCTION: followedChannels
// ===========================================================================
async function followedChannels ()
{
    // TBD need to use teh paginator to get all the channels.
    try
    {
        let channels = await localConfig.apiClient.channels.getFollowedChannels(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchFollowedChannels");
        // need to clear out the last run otherwise we will get repeated names in here
        trigger.parameters.channels = ""
        channels.data.forEach(function (value, key)
        {
            trigger.parameters.channels += value.broadcasterDisplayName + " "
        })
        trigger.parameters.channels = "(" + channels.total + ") " + trigger.parameters.channels + "..."
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".followedChannels", "ERROR", "Failed followed channels (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: cheerEmotes
// ===========================================================================
async function cheerEmotes ()
{
    // TBD need to use teh paginator to get all the channels.
    try
    {
        let emotes = await localConfig.apiClient.bits.getCheermotes(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchCheerEmotes");
        trigger.parameters.emotes = emotes.getPossibleNames().join(" ")
        sendTrigger(trigger)
    }
    catch (err)
    {
        console.error(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".cheerEmotes", "ERROR", "Failed to get cheer emotes  (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: leaderboard
// ===========================================================================
async function leaderboard ()
{
    // TBD need to use teh paginator to get all the channels.
    try
    {
        let leaderboardlist = await localConfig.apiClient.bits.getLeaderboard(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchLeaderboard");
        // need to clear out the last run otherwise we will get repeated names in here
        trigger.parameters.leaderboard = ""
        for (let i = 0; i < leaderboardlist.totalCount; i++)
        {
            if (i > 0)
                trigger.parameters.leaderboard += " "
            trigger.parameters.leaderboard += leaderboardlist.entries[i].rank + ") " + leaderboardlist.entries[i].userDisplayName + " " + leaderboardlist.entries[i].amount
        }
        sendTrigger(trigger)
    }
    catch (err)
    {
        console.error(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".leaderboard", "ERROR", "Failed to get leaderboard data  (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPolls
// ===========================================================================
async function getPolls ()
{
    try
    {
        let polls = await localConfig.apiClient.polls.getPolls(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchPoll");
        polls.data.forEach(function (value, key)
        {
            trigger.parameters.id = value.id
            trigger.parameters.title = value.title
            trigger.parameters.status = value.status
            trigger.parameters.choices = ""
            value.choices.forEach(function (choice, index)
            {
                if (index > 0)
                    trigger.parameters.choices += " ,  "
                trigger.parameters.choices += choice.title + " " + choice.totalVotes
            })
            trigger.parameters.duration = value.durationInSeconds
            trigger.parameters.enabled = value.isChannelPointsVotingEnabled
            trigger.parameters.pointsPerVote = value.channelPointsPerVote
            trigger.parameters.startDate = value.startDate
            trigger.parameters.endDate = value.endDate
            sendTrigger(trigger)
        })

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getPolls", "ERROR", "Failed to get polls (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPoll
// ===========================================================================
async function getPoll (id)
{
    try
    {
        let poll = await localConfig.apiClient.polls.getPollById(localConfig.streamerData.id, id)
        let trigger = findTriggerByMessageType("trigger_TwitchPoll");
        trigger.parameters.id = poll.id
        trigger.parameters.title = poll.title
        trigger.parameters.status = poll.status
        trigger.parameters.choices = ""
        poll.choices.forEach(function (choice, index)
        {
            if (index > 0)
                trigger.parameters.choices += " ,  "
            trigger.parameters.choices += choice.title + " " + choice.totalVotes
        })
        trigger.parameters.duration = poll.durationInSeconds
        trigger.parameters.enabled = poll.isChannelPointsVotingEnabled
        trigger.parameters.pointsPerVote = poll.channelPointsPerVote
        trigger.parameters.startDate = poll.startDate
        trigger.parameters.endDate = poll.endDate
        sendTrigger(trigger)

    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getPoll", "ERROR", "Failed to get poll by id (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: createPoll
// ===========================================================================
async function createPoll (data)
{
    try
    {
        let newPoll =
        {
            title: data.title,
            choices: data.choices.split(","),
            duration: data.duration,
            channelPointsPerVote: data.points,
        }
        let poll = await localConfig.apiClient.polls.createPoll(localConfig.streamerData.id, newPoll)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createPoll", "ERROR", "Failed to create a poll");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createPoll", "ERROR", "Failed to create a poll (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: endPoll
// ===========================================================================
async function endPoll (data)
{
    try
    {
        let poll = await localConfig.apiClient.polls.endPoll(localConfig.streamerData.id, data.id, data.display)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".endPoll", "ERROR", "Failed to end a poll");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".endPoll", "ERROR", "Failed to end a poll (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: startPrediction
// ===========================================================================
async function startPrediction (data)
{
    try
    {
        let newPoll =
        {
            title: data.title,
            outcomes: data.choices.split(","),
            autoLockAfter: data.duration,
        }
        let poll = await localConfig.apiClient.predictions.createPrediction(localConfig.streamerData.id, newPoll)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startPrediction", "ERROR", "Failed to create a prediction");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startPrediction", "ERROR", "Failed to create a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: cancelPrediction
// ===========================================================================
async function cancelPrediction (data)
{
    try
    {
        let prediction = await localConfig.apiClient.predictions.cancelPrediction(localConfig.streamerData.id, data.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".cancelPrediction", "ERROR", "Failed to cancel a prediction");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".cancelPrediction", "ERROR", "Failed to cancel a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: getPredictionss
// ===========================================================================
async function getPredictions (data)
{
    try
    {
        let predictions = await localConfig.apiClient.predictions.getPredictions(localConfig.streamerData.id)
        let trigger = findTriggerByMessageType("trigger_TwitchPrediction");
        predictions.data.forEach(function (value, key)
        {
            if (data.state == "" || data.state == value.status)
                getPrediction(value.id)
        })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getPredictions", "ERROR", "Failed to get predictions list (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPrediction
// ===========================================================================
async function getPrediction (data)
{
    try
    {
        let prediction = await localConfig.apiClient.predictions.getPredictionById(localConfig.streamerData.id, data.id)
        let trigger = findTriggerByMessageType("trigger_TwitchPrediction");
        trigger.parameters.streamer = prediction.broadcasterDisplayName
        trigger.parameters.id = prediction.id
        trigger.parameters.duration = prediction.autoLockAfter
        trigger.parameters.title = prediction.title
        trigger.parameters.status = prediction.status
        trigger.parameters.winner = prediction.winningOutcome
        trigger.parameters.winnerId = prediction.winningOutcomeId
        trigger.parameters.endDate = prediction.endDate
        trigger.parameters.lockDate = prediction.lockDate

        //  ----------- outcomes --------------
        trigger.parameters.outcomes = ""
        prediction.outcomes.forEach(function (outcome, index)
        {
            if (index > 0)
                trigger.parameters.outcomes += " ,  "
            trigger.parameters.outcomes += "id:" + outcome.id + " "
            trigger.parameters.outcomes += "title:" + outcome.title + " "
            trigger.parameters.outcomes += "color:" + outcome.color + " "
            trigger.parameters.outcomes += "points:" + outcome.totalChannelPoints + " "
            trigger.parameters.outcomes += "users:" + outcome.users + " "
            trigger.parameters.outcomes += "["
            // outcome predictors
            outcome.topPredictors.forEach(function (topP, topPIndex)
            {
                if (topPIndex > 0)
                    trigger.parameters.outcomes += " ,  "
                trigger.parameters.outcomes += "user:" + topP.userDisplayName + " "
                trigger.parameters.outcomes += "pointsUsed:" + topP.channelPointsUsed + " "
                trigger.parameters.outcomes += "pointsWon:" + topP.channelPointsWon + " "
            });
            trigger.parameters.outcomes += "]"
        })
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getPrediction", "ERROR", "Failed to get prediction by id (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.error(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: lockPrediction
// ===========================================================================
async function lockPrediction (data)
{
    try
    {
        let prediction = await localConfig.apiClient.predictions.lockPrediction(localConfig.streamerData.id, data.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".lockPrediction", "ERROR", "Failed to lock a prediction");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".lockPrediction", "ERROR", "Failed to lock a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removePrediction
// ===========================================================================
async function removePrediction (data)
{
    try
    {
        let prediction = await localConfig.apiClient.predictions.cancelPrediction(localConfig.streamerData.id, data.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removePrediction", "ERROR", "Failed to remove a prediction");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removePrediction", "ERROR", "Failed to remove a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: resolvePrediction
// ===========================================================================
async function resolvePrediction (data)
{
    try
    {
        let prediction = await localConfig.apiClient.predictions.resolvePrediction(localConfig.streamerData.id, data.id, data.outcomeId)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".resolvePrediction", "ERROR", "Failed to resolve a prediction");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".resolvePrediction", "ERROR", "Failed to resolve a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.error(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: createBlock
// ===========================================================================
async function createBlock (data)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(data.username)
        let extraInfo = {}
        if (data.reason != "")
            extraInfo["reason"] = data.reason
        if (data.reason != "")
            extraInfo["sourceContext"] = data.context

        let ret = await localConfig.apiClient.users.createBlock(localConfig.streamerData.id, user.id, extraInfo)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createBlock", "ERROR", "Failed to block user");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createBlock", "ERROR", "Failed to block user)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: deleteBlock
// ===========================================================================
async function deleteBlock (data)
{
    try
    {
        let user = await localConfig.apiClient.users.getUserByName(data.username)
        await localConfig.apiClient.users.deleteBlock(localConfig.streamerData.id, user.id)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".deleteBlock", "ERROR", "Failed to unblock user");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".deleteBlock", "ERROR", "Failed to unblock user)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: containsBadChars
// ===========================================================================
function containsBadChars (s)
{
    //return /[\u3040-\uffff]/.test(s);
    return /[\u3100-\uffff]/.test(s);
}
// ===========================================================================
//                           FUNCTION: getUser
// ===========================================================================
async function getUser (username)
{

    let trigger = findTriggerByMessageType("trigger_TwitchUserDetails")
    try
    {
        if (containsBadChars(username))
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".server.getUser", "username contains invalid chars, ignoring", username);
            trigger.parameters.username = username;
            trigger.parameters.userNameInvalid = true;
        }
        else
        {
            if (localConfig.apiClient && localConfig.apiClient.users)
            {
                let user = await localConfig.apiClient.users.getUserByName(username)
                if (user)
                {
                    trigger.parameters.username = user.name
                    trigger.parameters.userId = user.id
                    trigger.parameters.userDisplayName = user.displayName
                    trigger.parameters.creationDate = user.creationDate
                    trigger.parameters.description = user.description
                    trigger.parameters.offlinePlaceholderUrl = user.offlinePlaceholderUrl
                    trigger.parameters.profilePictureUrl = user.profilePictureUrl
                    trigger.parameters.type = user.type
                }
                else
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".server.getUser", "username not found", username);
                    console.log(user);
                    trigger.parameters.username = username;
                    trigger.parameters.userNameInvalid = true;
                }
            }
        }
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".server.getUser", "ERROR", "400:Failed to get user", username);
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".server.getUser", "ERROR", "Failed to get user)", username);
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION:  getBlockedUsers
// ===========================================================================
async function getBlockedUsers ()
{
    try
    {
        let user = await localConfig.apiClient.users.getBlocks(localConfig.streamerData.id)

        let trigger = findTriggerByMessageType("trigger_TwitchUserBlocks")
        trigger.parameters.blocked = ""
        trigger.parameters.userDisplayName = user.userDisplayName
        user.data.forEach(function (value, key)
        {
            if (key > 0)
                trigger.parameters.blocked += " "
            trigger.parameters.blocked += value.userDisplayName
        })
        sendTrigger(trigger)
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ". getAuthenticatedUser", "ERROR", "Failed to get authenticated user");
            console.error(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ". getAuthenticatedUser", "ERROR", "Failed to get authenticated user)");
            console.error(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION:  createClip
// ===========================================================================
async function createClip ()
{
    try
    {
        let clip = await localConfig.apiClient.clips.createClip({ channel: localConfig.streamerData.id })
        let trigger = findTriggerByMessageType("trigger_TwitchClipCreated")
        trigger.parameters.clipName = clip
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createClip", "ERROR", "Failed to create clip)");
        console.error(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipById
// ===========================================================================
async function getClipById (data, rollbackCount = 5)
{
    try
    {
        if (data.clipName == "")
            return
        let clip = await localConfig.apiClient.clips.getClipById(data.clipName)
        if (clip == null)
        {
            //if we have triggered off a clip being created it might take a bit for
            // twitch to make it available so give it a few seconds.
            if (rollbackCount > 0)
            {
                setTimeout(() =>
                {
                    console.log("clip not found, rescheduling in case twitch is still processing it")
                    getClipById(data, rollbackCount--)
                }, 1000);
            }
            return;
        }
        let trigger = findTriggerByMessageType("trigger_TwitchVodClip")
        trigger.parameters.streamer = clip.broadcasterDisplayName
        trigger.parameters.date = clip.creationDate
        trigger.parameters.creator = clip.creatorDisplayName
        trigger.parameters.duration = clip.duration
        trigger.parameters.embedUrl = clip.embedUrl
        trigger.parameters.gameId = clip.gameId
        trigger.parameters.id = clip.id
        trigger.parameters.language = clip.language
        trigger.parameters.thumbnail = clip.thumbnailUrl
        trigger.parameters.title = clip.title
        trigger.parameters.url = clip.url
        trigger.parameters.videoId = clip.videoId
        trigger.parameters.views = clip.views
        trigger.parameters.vodOffset = clip.vodOffset

        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getClipById", "ERROR", "Failed to get clip by name)");
        console.error(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipsByBroadcaster
// ===========================================================================
async function getClipsByBroadcaster (data, rollbackCount = 5)
{
    try
    {
        if (data.name == "")
            return

        let paginatedFilter = {
            // after ?: string, A cursor to get the following page of.
            // before ?: string, A cursor to get the previous page of.
            // endDate ?: string,The latest date to find clips for.
            // limit ?: number, The number of results per page.
            // startDate ?: string,The earliest date to find clips for.
        }
        if (data.count != "")
            paginatedFilter.limit = Number(data.count)

        let user = await localConfig.apiClient.users.getUserByName(data.name)
        let clips = await localConfig.apiClient.clips.getClipsForBroadcaster(user.id, paginatedFilter)
        if (clips == null)
        {
            //if we have triggered off a clip being created it might take a bit for
            // twitch to make it available so give it a few seconds.
            if (rollbackCount > 0)
            {
                setTimeout(() =>
                {
                    console.log("clip not ready found, rescheduling in case twitch is still processing it")
                    getClipById(data, rollbackCount--)
                }, 1000);
            }
            return;
        }
        clips.data.forEach(function (clip, index)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchVodClip")
            trigger.parameters.streamer = clip.broadcasterDisplayName
            trigger.parameters.date = clip.creationDate
            trigger.parameters.creator = clip.creatorDisplayName
            trigger.parameters.duration = clip.duration
            trigger.parameters.embedUrl = clip.embedUrl
            trigger.parameters.gameId = clip.gameId
            trigger.parameters.id = clip.id
            trigger.parameters.language = clip.language
            trigger.parameters.thumbnail = clip.thumbnailUrl
            trigger.parameters.title = clip.title
            trigger.parameters.url = clip.url
            trigger.parameters.videoId = clip.videoId
            trigger.parameters.views = clip.views
            trigger.parameters.vodOffset = clip.vodOffset
            sendTrigger(trigger)
        });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getClipById", "ERROR", "Failed to get clip by name)");
        console.error(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipsByBroadcaster
// ===========================================================================
async function getClipsByGame (data)
{
    try
    {
        if (data.game == "")
            return

        let paginatedFilter = {
            // after ?: string, A cursor to get the following page of.
            // before ?: string, A cursor to get the previous page of.
            // endDate ?: string,The latest date to find clips for.
            // limit ?: number, The number of results per page.
            // startDate ?: string,The earliest date to find clips for.
        }
        if (data.count != "")
            paginatedFilter.limit = Number(data.count)

        let game = await localConfig.apiClient.games.getGameByName(data.game)
        let clips = await localConfig.apiClient.clips.getClipsForGame(game.id, paginatedFilter)
        if (clips == null)
        {
            console.log("No clips found for game name")
            return;
        }
        clips.data.forEach(function (clip, index)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchVodClip")
            trigger.parameters.streamer = clip.broadcasterDisplayName
            trigger.parameters.date = clip.creationDate
            trigger.parameters.creator = clip.creatorDisplayName
            trigger.parameters.duration = clip.duration
            trigger.parameters.embedUrl = clip.embedUrl
            trigger.parameters.gameId = clip.gameId
            trigger.parameters.id = clip.id
            trigger.parameters.language = clip.language
            trigger.parameters.thumbnail = clip.thumbnailUrl
            trigger.parameters.title = clip.title
            trigger.parameters.url = clip.url
            trigger.parameters.videoId = clip.videoId
            trigger.parameters.views = clip.views
            trigger.parameters.vodOffset = clip.vodOffset
            sendTrigger(trigger)
        });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getClipById", "ERROR", "Failed to get clip by name)");
        console.error(err);
    }
}
// ============================================================================
//                           FUNCTION: updateGameCagogories
// ============================================================================
function updateGameCagogories ()
{
    return ex_helper.createDropdownWithHistoryString(localConfig.twitchCategoriesDropdownId, localConfig.gameCategories, serverConfig.twitchCategorieshistory, localConfig.currentTwitchGameCategory);
    //, categories)
}
// ===========================================================================
//                           FUNCTION: sendGameCategoriesTrigger
// ===========================================================================
function sendGameCategoriesTrigger (id)
{
    console.log("getGamesCategories(data)", id)
    let trigger = findTriggerByMessageType("trigger_TwitchGameCategories");
    trigger.parameters.id = id;
    trigger.parameters.games = localConfig.gameCategories;
    sendTrigger(trigger)
}
// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
function sendTrigger (trigger)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                trigger.messagetype,
                serverConfig.extensionname,
                trigger,
                serverConfig.channel,
                ''),
            serverConfig.channel,
            ''
        )
    );
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return triggersandactions.triggers[i];
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find trigger", messagetype);
}

export { start }