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
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";
const __dirname = dirname(fileURLToPath(import.meta.url));
//twurple imports
import { ApiClient } from '@twurple/api';
import { StaticAuthProvider } from '@twurple/auth';


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
        connected: false,
        color: "red"
    },
    twitchReconnectTimer: 5000,
    SYSTEM_LOGGING_TAG: "[EXTENSION]",

    clientId: "",
    streamerData: "",
    authProvider: "",
    apiClient: null,
    gameCategories: [],
    twitchImages: {},
    // variables from the Settings widget
    twitchCategoriesDropdownId: "twitchGameCategoryDropdownSelector",
    twitchTitleDropdownId: "twitchTitleDropdownSelector",
    twitchTitlesTextElementId: "twitchTitleTextElement",
    // use these fields to send errors in searching back to the user
    twitchCategoryErrorsText: "",
    twitchCategoryErrorsShowCounter: 0,
    currentTwitchGameCategoryId: -1, // as reported by twitch
    currentTwitchStreamTitle: "", // as reported by twitch

    sendUserTwitchChatCredentialsTimeout: 5000,
    sendUserTwitchChatCredentialsHandle: null,
    sendBotTwitchChatCredentialsTimeout: 5000,
    sendBotTwitchChatCredentialsHandle: null,
    startupCheckTimer: 500,
    ready: false,
    readinessFlags: {
        ConfigReceived: false,
        CredentialsReceived: false,
    },

}

localConfig.twitchImages["badges"] = {};

const default_serverConfig = {
    __version__: "0.5",
    extensionname: "twitch",
    channel: "TWITCH",
    twitchenabled: "off",
    twitchresetdefaults: "off",
    twitchstreamername: "",
    twitchCategoriesHistory: [],
    twitchGameCategory_clearHistory: "off",
    twitchTitlesHistory: [],
    lastSelectedTwitchTitleId: -1
}
let serverConfig = structuredClone(default_serverConfig);
const serverCredentials =
{
    twitchName: "",
    twitchOAuthState: "",
    twitchOAuthToken: "",
    twitchBotName: "",
    twitchBotOAuthState: "",
    twitchBotOAuthToken: ""
}
// To further expand this list check out HELIX APIS at
// https://twurple.js.org/reference/api/classes/ApiClient.html
// 1) select the api and functions you want on the left you want to implement/add
// 2) add the action_ trigger and function
// 3) check that a callback trigger_ is defined (should be in the triggers list and implemented in the eventsub.js script)
// 5) run a test to see if the scopes need updating in twitch.js (for authorizing a user, will need to re-authorize through the main settings page to update the twitch tokens)
//
// triggers are implemented in eventsub.js
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Connects to the twitch Pub/Sub API to provide functions to control your twitch stream",
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
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    startDate: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    endDate: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    donor: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    isAchieved: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "ModAdded",
                displaytitle: "Mod Added",
                description: "A User was added to the Mod list",
                messagetype: "trigger_TwitchModAdded",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "ModRemoved",
                displaytitle: "Mod Removed",
                description: "A User was removed to the Mod list",
                messagetype: "trigger_TwitchModRemoved",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    winningOutcomeId: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "RedemptionAdd",
                displaytitle: "Redemption by viewer (channel points)",
                description: "A user used channel points for a redemption (id and rewardID appear to be the same number)",
                messagetype: "trigger_TwitchRedemptionAdd",
                parameters: {
                    title: "",
                    title_UIDescription: "The title of the redeemed item",
                    cost: "",
                    cost_UIDescription: "How much this redemption costs the viewer",
                    prompt: "",
                    prompt_UIDescription: "Prompt set in the redemption when you created it.",
                    user: "",
                    user_UIDescription: "The viewer name who redeemed this item",
                    streamer: "",
                    streamer_UIDescription: "Name of the streamers channel that the redemption was redeemed in",
                    id: "",
                    id_UIDescription: "Twitch ID for the redemption",
                    message: "",
                    message_UIDescription: "Viewer added text for redemptions with user input",
                    rewardId: "",
                    rewardId_UIDescription: "Reward ID, normally same as the id field but there might be a use for this, Please let me know if you find one that is different so I can update this description",
                    status: "",
                    status_UIDescription: "Status of the redemption",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    userInputRequired: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    userInputRequired: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    inputRequired: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"

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
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"

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
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "TitleChanged",
                displaytitle: "TitleChanged",
                description: "The Stream title was changed",
                messagetype: "trigger_TwitchTitleChanged",
                parameters: {
                    title: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "GamedChanged",
                displaytitle: "Gamed Changed",
                description: "The Game was changed",
                messagetype: "trigger_TwitchGamedChanged",
                parameters: {
                    triggerId: "",
                    gameId: "",
                    name: "",
                    imageURL: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "StreamIdChanged",
                displaytitle: "Stream Id Changed",
                description: "The stream ID has changed",
                messagetype: "trigger_TwitchStreamIdChanged",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "StreamLanguageChanged",
                displaytitle: "Stream language Changed",
                description: "The stream language has changed",
                messagetype: "trigger_TwitchStreamLanguageChanged",
                parameters: {
                    language: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "StreamerNameChanged",
                displaytitle: "Streamer name Changed",
                description: "The streamer name has changed",
                messagetype: "trigger_TwitchStreamerNameChanged",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "StreamStarted",
                displaytitle: "Stream Started",
                description: "The Stream Started",
                messagetype: "trigger_TwitchStreamStarted",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "StreamEnded",
                displaytitle: "Stream Ended",
                description: "The Stream Ended",
                messagetype: "trigger_TwitchStreamEnded",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {// triggered from here as eventsub doesn't have this event
                name: "CommercialStarted",
                displaytitle: "Commercial started",
                description: "A Commercial was started",
                messagetype: "trigger_TwitchCommercialStarted",
                parameters: {
                    duration: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {// triggered from here as eventsub doesn't have this event
                name: "VIPAdded",
                displaytitle: "VIP Added",
                description: "A User was added to the VIP list",
                messagetype: "trigger_TwitchVIPAdded",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {// triggered from here as eventsub doesn't have this event
                name: "VIPRemoved",
                displaytitle: "VIP Removed",
                description: "A User was removed to the VIP list",
                messagetype: "trigger_TwitchVIPRemoved",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "Editors",
                displaytitle: "Editors",
                description: "A list of editors for the channel",
                messagetype: "trigger_TwitchEditors",
                parameters: {
                    editors: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "VIPs",
                displaytitle: "VIPs",
                description: "A list of VIPs for the channel",
                messagetype: "trigger_TwitchVIPs",
                parameters: {
                    VIPs: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "FollowerCount",
                displaytitle: "Follower Count",
                description: "Follower count",
                messagetype: "trigger_TwitchFollowerCount",
                parameters: {
                    count: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "FollowedChannels",
                displaytitle: "Followed Channels",
                description: "Followed channels",
                messagetype: "trigger_TwitchFollowedChannels",
                parameters: {
                    channels: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "CheerEmotes",
                displaytitle: "Cheer Emotes",
                description: "Cheer emotes",
                messagetype: "trigger_TwitchCheerEmotes",
                parameters: {
                    emotes: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },

            {
                name: "GlobalBadges",
                displaytitle: "Global Badges",
                description: "Global Badges",
                messagetype: "trigger_TwitchGlobalBadges",
                parameters: {
                    badges: {},
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "Leaderboard",
                displaytitle: "Leaderboard",
                description: "Bits leaderboard",
                messagetype: "trigger_TwitchLeaderboard",
                parameters: {
                    leaderboard: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "UserBlocks",
                displaytitle: "User blocks",
                description: "Who this user has blocked",
                messagetype: "trigger_TwitchUserBlocks",
                parameters: {
                    username: "",
                    blocked: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "ClipCreated",
                displaytitle: "Twitch clip created",
                description: "A twitch clip",
                messagetype: "trigger_TwitchClipCreated",
                parameters: {
                    clipName: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    vodOffset: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
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
                    type: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "GameCategories",
                displaytitle: "List of games",
                description: "Updated list of games",
                messagetype: "trigger_TwitchGameCategories",
                parameters: {
                    id: 0,
                    games: [],
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
            {
                name: "RaidingChannel",
                displaytitle: "Raiding a channel",
                description: "We are Raiding a channel",
                messagetype: "trigger_TwitchRaidChannel",
                parameters: {
                    username: "",
                    username_UIDescription: "user we are raiding",
                    raidDate: "",
                    raidDate_UIDescription: "Datestamp when raid was started",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference copied from the action that created this trigger"
                }
            },
        ],
    actions:
        [
            {
                name: "ChangeTitle",
                displaytitle: "Change Title of the Stream",
                description: "Change stream title",
                messagetype: "action_TwitchChangeTitle",
                parameters: {
                    title: "",
                    title_UIDescription: "New Title to change to"
                },
                triggerActionRef: "twitch",
                triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
            },
            {
                name: "StartCommercial",
                displaytitle: "Start Commercial",
                description: "Start a Commercial for (30, 60, 90, 120, 150, 180) seconds",
                messagetype: "action_TwitchStartCommercial",
                parameters: {
                    duration: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetEditors",
                displaytitle: "GetEditors",
                description: "Get a list of editors for the channel",
                messagetype: "action_TwitchGetEditors",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetVIPs",
                displaytitle: "GetVIPs",
                description: "Get a list of VIPs for the channel",
                messagetype: "action_TwitchGetVIPs",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "AddVIP",
                displaytitle: "Add VIP",
                description: "Promote user to VIP",
                messagetype: "action_TwitchAddVIP",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "RemoveVIP",
                displaytitle: "Remove VIP",
                description: "Demote user from VIP",
                messagetype: "action_TwitchRemoveVIP",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "AddMod",
                displaytitle: "Add Mod",
                description: "Promote user to Mod",
                messagetype: "action_TwitchAddMod",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "RemoveMod",
                displaytitle: "Remove Mod",
                description: "Demote user from Mod",
                messagetype: "action_TwitchRemoveMod",
                parameters: {
                    user: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "Ban",
                displaytitle: "Ban a user",
                description: "Bans a user from the stream",
                messagetype: "action_TwitchBan",
                parameters: {
                    user: "", reason: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "Unban",
                displaytitle: "Unban a user",
                description: "Unbans a user from the stream",
                messagetype: "action_TwitchUnban",
                parameters: {
                    user: "", reason: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            }, {
                name: "FollowerCount",
                displaytitle: "Follower Count",
                description: "Get follower count",
                messagetype: "action_TwitchFollowerCount",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "FollowedChannels",
                displaytitle: "Followed Channels",
                description: "Get followed channels",
                messagetype: "action_TwitchFollowedChannels",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "CheerEmotes",
                displaytitle: "Cheer Emotes",
                description: "Get cheer emotes",
                messagetype: "action_TwitchCheerEmotes",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GlobalBadges",
                displaytitle: "Global Badges",
                description: "Get Global Badges",
                messagetype: "action_TwitchGlobalBadges",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "Leaderboard",
                displaytitle: "Leaderboard",
                description: "Get bits leaderboard",
                messagetype: "action_TwitchLeaderboard",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetPolls",
                displaytitle: "Get Polls",
                description: "Gets a list of polls",
                messagetype: "action_TwitchGetPolls",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetPoll",
                displaytitle: "Get Poll",
                description: "Get a poll",
                messagetype: "action_TwitchGetPoll",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
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
                    points: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "EndPoll",
                displaytitle: "End Poll",
                description: "End a poll",
                messagetype: "action_TwitchEndPoll",
                parameters: {
                    id: "",
                    display: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
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
                    duration: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "CancelPrediction",
                displaytitle: "CancelPrediction",
                description: "Cancel a prediction",
                messagetype: "action_TwitchCancelPrediction",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetPredictions",
                displaytitle: "Get Predictions",
                description: "Gets a list of predictions",
                messagetype: "action_TwitchGetPredictions",
                parameters: {
                    state: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetPrediction",
                displaytitle: "Get Prediction",
                description: "Get a prediction",
                messagetype: "action_TwitchGetPrediction",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "LockPrediction",
                displaytitle: "Lock Prediction",
                description: "Lock a prediction",
                messagetype: "action_TwitchLockPrediction",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "RemovePrediction",
                displaytitle: "Remove Prediction",
                description: "Remove a prediction",
                messagetype: "action_TwitchLRemovePrediction",
                parameters: {
                    id: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "ResolvePrediction",
                displaytitle: "Resolve Prediction",
                description: "Resolve a prediction",
                messagetype: "action_TwitchLResolvePrediction",
                parameters: {
                    id: "",
                    outcomeId: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
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
                    context: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "DeleteUserBlock",
                displaytitle: "Delete User Block",
                description: "Unblock a user",
                messagetype: "action_TwitchDeleteBlock",
                parameters: {
                    username: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
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
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetBlocks",
                displaytitle: "Get blocked users",
                description: "Get a list of blocked users",
                messagetype: "action_TwitchGetBlocks",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "CreateClip",
                displaytitle: "Create clip",
                description: "Create a twitch clip",
                messagetype: "action_TwitchCreateClip",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetClipById",
                displaytitle: "Get Clip By Id",
                description: "Get clip by id",
                messagetype: "action_TwitchGetClipById",
                parameters: {
                    clipName: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetClipsForBroadcaster",
                displaytitle: "Get Clips For Broadcaster",
                description: "Get clips for a broadcaster",
                messagetype: "action_TwitchGetClipsForBroadcaster",
                parameters: {
                    name: "",
                    count: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "GetClipsForGame",
                displaytitle: "Get Clips For Game",
                description: "Get clips for a game",
                messagetype: "action_TwitchGetClipsForGame",
                parameters: {
                    game: "",
                    count: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "TwitchGameCategories",
                displaytitle: "Get a list of games",
                description: "Get the list of games",
                messagetype: "action_GetTwitchGameCategories",
                parameters: {
                    id: 0,
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "TwitchGetStats",
                displaytitle: "Get the Current Twitch Stats",
                description: "Return will be a set of triggers for current game etc",
                messagetype: "action_GetTwitchStats",
                parameters: {
                    actionID: "",
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible"
                }
            },
            {
                name: "TwitchRaid",
                displaytitle: "Raid a username",
                description: "Raids the username specified",
                messagetype: "action_TwitchRaidChannel",
                parameters: {
                    triggerActionRef: "twitch",
                    triggerActionRef_UIDescription: "Extensionname or User reference that will be passed through to triggers created from this action where possible",
                    username: "",
                    username_UIDescription: "The user you wish to raid"

                }
            }

        ],
}
// ============================================================================
//                           FUNCTION: start
// ============================================================================
/**
 * Starts the extension using the given data.
 * @param {string} host 
 * @param {number} port 
 * @param {number} nonce
 * @param {number} clientId
 * @param {number} heartbeat 
 */
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
/**
 * Connects to the StreamRoller server
 * @param {string} host 
 * @param {number} port 
 */
function ConnectToDataCenter (host, port)
{
    try
    {
        localConfig.DataCenterSocket = sr_api.setupConnection(onDataCenterMessage, onDataCenterConnect, onDataCenterDisconnect,
            host, port);
        startupCheck();
    } catch (err)
    {
        logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", err);
    }
}
// ============================================================================
//                           FUNCTION: onDataCenterDisconnect
// ============================================================================
/**
 * called on StreamRoller websocket disconnect
 * @param {string} reason 
 */
function onDataCenterDisconnect (reason)
{
    logger.err(serverConfig.extensionname + " server.initialise", "DataCenterSocket connection failed:", reason);
}
// ============================================================================
//                           FUNCTION: onDataCenterConnect
// ============================================================================
/**
 * called on StreamRoller websocket connect
 * @param {object} socket 
 */
function onDataCenterConnect (socket)
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionConnected", serverConfig.extensionname));
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
/**
 * Called when we receive a StreamRoller message
 * @param {object} server_packet 
 */
function onDataCenterMessage (server_packet)
{
    try
    {
        if (server_packet.type === "StreamRollerReady")
            localConfig.readinessFlags.streamRollerReady = true;
        else if (server_packet.type === "ConfigFile")
        {
            if (server_packet.to == serverConfig.extensionname)
                localConfig.readinessFlags.ConfigReceived = true;
            // check it is our config
            if (server_packet.data
                && server_packet.data.extensionname
                && server_packet.data.extensionname === serverConfig.extensionname)
            {
                let configSubVersions = 0;
                let defaultSubVersions = default_serverConfig.__version__.split('.');
                if (server_packet.data == "")
                {
                    // server data is empty, possibly the first run of the code so just default it
                    serverConfig = structuredClone(default_serverConfig);
                    SaveConfigToServer();
                }
                else
                    configSubVersions = server_packet.data.__version__.split('.')

                if (configSubVersions[0] != defaultSubVersions[0])
                {
                    // Major version number change. Replace config with defaults
                    // perform a deep clone overwriting our server config.
                    serverConfig = structuredClone(default_serverConfig);
                    // notify the user their config has been updated.
                    console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
                    SaveConfigToServer();
                }
                else if (configSubVersions[1] != defaultSubVersions[1])
                {
                    // Minor version number change. Overwrite config with defaults
                    // perform a merge replacing any values we currently have and keeping the new variables
                    serverConfig = { ...default_serverConfig, ...server_packet.data };
                    // update the version number to the current default number
                    serverConfig.__version__ = default_serverConfig.__version__;
                    console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
                    SaveConfigToServer();
                }
                else
                    // no version number changed so we can just saved file
                    serverConfig = structuredClone(server_packet.data);
            }
        }
        // -----------------------------------------------------------------------------------
        //                  RECEIVED CREDENTIALS
        // -----------------------------------------------------------------------------------
        else if (server_packet.type === "CredentialsFile")
        {
            if (server_packet.to == serverConfig.extensionname)
                localConfig.readinessFlags.CredentialsReceived = true;
            if (server_packet.to === serverConfig.extensionname && server_packet.data && server_packet.data != "")
            {
                // streamer account
                if (server_packet.data.twitchOAuthState && server_packet.data.twitchOAuthState != ""
                    && server_packet.data.twitchOAuthToken && server_packet.data.twitchOAuthToken != "")
                {
                    if (server_packet.data.twitchOAuthState)
                        serverCredentials.twitchOAuthState = server_packet.data.twitchOAuthState;
                    if (server_packet.data.twitchOAuthToken)
                        serverCredentials.twitchOAuthToken = server_packet.data.twitchOAuthToken;
                    localConfig.authProvider = new StaticAuthProvider(localConfig.clientId, serverCredentials.twitchOAuthToken);

                    // update the username and data even if extension is turned off.
                    // if we have credentials get the username and send them to twitchchat
                    if (serverCredentials.twitchOAuthState != "" && serverCredentials.twitchOAuthToken != "")
                    {
                        // create a new temporary provide for accounts as we are turned off so don't want to have 
                        // a real account
                        let tempauth = new StaticAuthProvider(localConfig.clientId, serverCredentials.twitchOAuthToken);
                        let tempApiClient = new ApiClient({ authProvider: tempauth });
                        tempApiClient.getTokenInfo()
                            .then((dataUser) =>
                            {
                                // get the display name of the user
                                tempApiClient.users.getUserByName(dataUser.userName)
                                    .then((details) =>
                                    {
                                        serverCredentials.twitchName = details.displayName;
                                        // delay sending in case twitch chat hasn't initialized yet during startup.
                                        clearTimeout(localConfig.sendUserTwitchChatCredentialsHandle)
                                        localConfig.sendUserTwitchChatCredentialsHandle = setTimeout(() =>
                                        {
                                            sendTwitchChatCredentials(details.displayName, serverCredentials.twitchOAuthToken, false);
                                        }, localConfig.sendUserTwitchChatCredentialsTimeout);
                                    })
                            })
                            .catch((err) =>
                            {
                                logger.err(serverConfig.extensionname + ".onDataCenterMessage received CredentialsFile, getting user token", "Unhandled exception:", err);
                            })
                    }

                }

                // bot account
                if (server_packet.data.twitchBotOAuthState && server_packet.data.twitchBotOAuthState != ""
                    && server_packet.data.twitchBotOAuthToken && server_packet.data.twitchBotOAuthToken != "")
                {
                    // update our creds
                    if (server_packet.data.twitchBotOAuthState)
                        serverCredentials.twitchBotOAuthState = server_packet.data.twitchBotOAuthState;
                    if (server_packet.data.twitchBotOAuthToken)
                        serverCredentials.twitchBotOAuthToken = server_packet.data.twitchBotOAuthToken;

                    // if we have credentials get the username and send them to twitchchat
                    if (serverCredentials.twitchBotOAuthState != "" && serverCredentials.twitchBotOAuthToken != "")
                    {
                        let tempauth = new StaticAuthProvider(localConfig.clientId, serverCredentials.twitchBotOAuthToken);
                        let tempApiClient = new ApiClient({ authProvider: tempauth });
                        tempApiClient.getTokenInfo()
                            .then((dataUser) =>
                            {

                                // get the display name of the user
                                tempApiClient.users.getUserByName(dataUser.userName)
                                    .then((details) =>
                                    {
                                        serverCredentials.twitchBotName = details.displayName;
                                        // delay sending in case twitchchat hasn't initialized yet during startup.
                                        clearTimeout(localConfig.sendBotTwitchChatCredentialsHandle)
                                        localConfig.sendBotTwitchChatCredentialsHandle = setTimeout(() =>
                                        {
                                            sendTwitchChatCredentials(details.displayName, serverCredentials.twitchBotOAuthToken, true);
                                        }, localConfig.sendBotTwitchChatCredentialsTimeout);
                                    })
                            })
                            .catch((err) =>
                            {
                                logger.err(serverConfig.extensionname + ".onDataCenterMessage received CredentialsFile, getting bot token", "Unhandled exception:", err);
                            })
                    }
                }
            }
            if (serverConfig.twitchenabled == "on")
            {
                setTimeout(() =>
                {
                    disconnectTwitch();
                    connectTwitch();
                }, 1000);
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
            //                   REQUEST FOR SETTINGS DIALOG
            // -----------------------------------------------------------------------------------
            if (extension_packet.type === "RequestSettingsWidgetLargeCode")
            {
                SendSettingsWidgetLarge(extension_packet.from);
            }
            // -----------------------------------------------------------------------------------
            //                   SettingsWidgetSmallData
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "SettingsWidgetSmallData")
            {
                if (extension_packet.to === serverConfig.extensionname)
                {

                    let restart = handleSettingsWidgetSmallData(extension_packet.data);
                    SaveConfigToServer();

                    if (restart)
                    {
                        if (localConfig.status.connected)
                            disconnectTwitch();
                        connectTwitch()
                    }

                    SendSettingsWidgetSmall();
                }
            }
            // -----------------------------------------------------------------------------------
            //                   SettingsWidgetLargeData
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "SettingsWidgetLargeData")
            {
                // check if we have asked to reset to defaults
                if (extension_packet.data.twitchresetdefaults == "on")
                {
                    serverConfig = structuredClone(default_serverConfig);
                    console.log("\x1b[31m" + serverConfig.extensionname + " Defaults restored", "The config files have been reset. Your settings may have changed" + "\x1b[0m");
                    DeleteCredentialsOnServer()
                    serverConfig.twitchenabled = "off"
                    SaveConfigToServer();
                    SendSettingsWidgetSmall("");
                    SendSettingsWidgetLarge("");
                }
                else
                {
                    // nothing in our large settings to do other than reset defaults.                  
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
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.title != "")
                        setStreamTitle(extension_packet.data.title)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to change title with no title provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchStartCommercial
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchStartCommercial")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.duration != "")
                        startCommercial(extension_packet.data.duration)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to start a commercial with no duration provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetEditors
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetEditors")
            {
                if (serverConfig.twitchenabled == "on")
                    getChannelEditors()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetVIPs
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetVIPs")
            {
                if (serverConfig.twitchenabled == "on")
                    getChannelVIPs()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchAddVIP
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchAddVIP")
            {

                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.user != "")
                        addVIP(extension_packet.data.user)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to VIP a user with no username provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchRemoveVIP
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchRemoveVIP")
            {
                if (serverConfig.twitchenabled == "on") 
                {
                    if (extension_packet.data.user != "")
                        removeVIP(extension_packet.data.user)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove VIP from a user with no username provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchAddMod
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchAddMod")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.user != "")
                        addMod(extension_packet.data.user)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to Mod a user with no username provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchRemoveMod
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchRemoveMod")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.user != "")
                        removeMod(extension_packet.data.user)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove Mod from a user with no username provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchBan
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchBan")
            {
                try
                {
                    if (serverConfig.twitchenabled == "on")
                    {
                        if (extension_packet.data.user != "")
                            banUser(extension_packet.data.user, extension_packet.data.reason)
                        else
                            logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to ban a user with no username provided");
                    }
                }
                catch (err)
                {
                    console.log("action_TwitchBan", err)
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchUnban
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchUnban")
            {
                try
                {
                    if (serverConfig.twitchenabled == "on")
                    {
                        if (extension_packet.data.user != "")
                            unbanUser(extension_packet.data.user, extension_packet.data.reason)
                        else
                            logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unban user with no username provided");
                    }
                }
                catch (err)
                {
                    console.log("action_TwitchBan", err)
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchFollowerCount
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchFollowerCount")
            {
                if (serverConfig.twitchenabled == "on")
                    followerCount()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchFollowedChannels
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchFollowedChannels")
            {
                if (serverConfig.twitchenabled == "on")
                    followedChannels()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchCheerEmotes
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchCheerEmotes")
            {
                if (serverConfig.twitchenabled == "on")
                    cheerEmotes()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGlobalBadges
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGlobalBadges")
            {
                if (serverConfig.twitchenabled == "on")
                    globalBadges()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLeaderboard
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchLeaderboard")
            {
                if (serverConfig.twitchenabled == "on")
                    leaderboard()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetPolls
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetPolls")
            {
                if (serverConfig.twitchenabled == "on")
                    getPolls()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetPoll
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetPoll")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data.id != "")
                        getPoll(extension_packet.data.id)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to get a poll with no poll id");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchCreatePoll
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchCreatePoll")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        createPoll(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to create a poll with no poll data");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchEndPoll
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchEndPoll")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        endPoll(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to end a poll with no poll data");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchStartPrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchStartPrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        startPrediction(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to start a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchCancelPrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchCancelPrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        cancelPrediction(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to cancel a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetPrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetPrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        getPrediction()
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to get a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetPredictions
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetPredictions")
            {
                if (extension_packet.data != "")
                    if (serverConfig.twitchenabled == "on")
                        getPredictions(extension_packet.data)
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLockPrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchLockPrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        lockPrediction(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to lock a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLRemovePrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchLRemovePrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        removePrediction(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to remove a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLResolvePrediction
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchLResolvePrediction")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        resolvePrediction(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to resolve a prediction with no prediction data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLCreateBlock
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchCreateBlock")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        createBlock(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to block a user with no data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchLDeleteBlock
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchDeleteBlock")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        deleteBlock(extension_packet.data)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unblock a user with no data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetUser
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetUser")
            {
                if (serverConfig.twitchenabled == "on")
                {
                    if (extension_packet.data != "")
                        getUser(extension_packet.data.username)
                    else
                        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Attempt to unblock a user with no data provided");
                }
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetBlocks
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetBlocks")
            {
                if (serverConfig.twitchenabled == "on")
                    getBlockedUsers()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchCreateClip
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchCreateClip")
            {
                if (serverConfig.twitchenabled == "on")
                    createClip()
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetClipById
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetClipById")
            {
                if (serverConfig.twitchenabled == "on")
                    getClipById(extension_packet.data)
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetClipsForBroadcaster
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetClipsForBroadcaster")
            {
                if (serverConfig.twitchenabled == "on")
                    getClipsByBroadcaster(extension_packet.data)
            }
            // -----------------------------------------------------------------------------------
            //                   action_TwitchGetClipsForGame
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchGetClipsForGame")
            {
                if (serverConfig.twitchenabled == "on")
                    getClipsByGame(extension_packet.data)
            }
            // -----------------------------------------------------------------------------------
            //                   action_GetTwitchGameCategories
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_GetTwitchGameCategories")
            {
                sendGameCategoriesTrigger(extension_packet.data.parameters.actionID)
            }
            // -----------------------------------------------------------------------------------
            //                   action_GetTwitchStats
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_GetTwitchStats")
            {
                sendTwitchStats(extension_packet.data.actionID)
            }
            // -----------------------------------------------------------------------------------
            //                   action_GetTwitchStats
            // -----------------------------------------------------------------------------------
            else if (extension_packet.type === "action_TwitchRaidChannel")
            {
                raidChannel(extension_packet.data.triggerActionRef, extension_packet.data.username)
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
    }
    catch (error)
    {
        logger.err(serverConfig.extensionname + ".onDataCenterMessage", "Unhandled exception:", error);
    }
}
// ============================================================================
//                           FUNCTION: SaveConfigToServer
// ============================================================================
/**
 * Save our config to the server
 */
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
/**
 * Send our small settings widget html code to the given extension
 * @param {string} toChannel 
 */
function SendSettingsWidgetSmall (toChannel = "")
{
    fs.readFile(__dirname + "/twitchsettingswidgetsmall.html", function (err, filedata)
    {
        if (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetSmall", "failed to load modal", err);
        }
        else
        {
            let modalString = filedata.toString();
            let statusHtml = ""
            if (serverConfig.twitchenabled == "off")
                statusHtml = `<BR><div style = "color:rgb(255 255 0 / 80%)">Extension turned off</div>`
            else if (!localConfig.status.connected)
                statusHtml = `<BR><div style = "color:rgb(255 255 0 / 80%)">Waiting for extension to get data from twitch</div>`

            for (const [key, value] of Object.entries(serverConfig))
            {
                // checkboxes
                if (value === "on")
                    modalString = modalString.replace(key + "checked", "checked");
                else if (typeof (value) === "string" || typeof (value) === "number")
                    modalString = modalString.replaceAll(key + "text", value);
            }

            // This code could be hardcoded but we only want to show it when the twitch extensions is up and running
            if (serverConfig.twitchenabled == "off" || !localConfig.status.connected)
            {
                modalString = modalString.replace("twitchStreamTitleSelector", statusHtml);
                modalString = modalString.replace("twitchGameCategorySelector", statusHtml);
                modalString = modalString.replace("twitchTwitchSearchForGame", statusHtml);
            }
            else
            {
                modalString = modalString.replace("twitchStreamTitleSelector", getTextboxWithHistoryHTML(
                    localConfig.twitchTitleDropdownId,
                    localConfig.twitchTitlesTextElementId,
                    serverConfig.twitchTitlesHistory,
                    serverConfig.lastSelectedTwitchTitleId
                ));
                // add our searchable dropdown category selector
                modalString = modalString.replace("twitchGameCategorySelector",
                    createDropdownWithSearchableHistory(
                        localConfig.twitchCategoriesDropdownId,
                        localConfig.gameCategories,
                        serverConfig.twitchCategoriesHistory,
                        localConfig.currentTwitchGameCategoryId));
                modalString = modalString.replace("twitchTwitchSearchForGame", `<input type="text" class="form-control" id="twitchSearchForTwitchGameElementId" name="twitchSearchForTwitchGameElementId" placeholder="Enter Game name to search for (added to history when found)">`);
            }
            if (localConfig.twitchCategoryErrorsShowCounter > 0)
            {
                localConfig.twitchCategoryErrorsShowCounter--;
                modalString = modalString.replace("twitchGameCategorySearchErrors",
                    "<div>" + localConfig.twitchCategoryErrorsText + "</div>"
                )
            }
            else
                modalString = modalString.replace("twitchGameCategorySearchErrors", "")
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetSmallCode",
                        serverConfig.extensionname,
                        modalString,
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
//                           FUNCTION: SendSettingsWidgetLarge
// ===========================================================================
/**
 * @param {String} to channel to send to or "" to broadcast
 */
function SendSettingsWidgetLarge (to = "")
{
    // read our modal file
    fs.readFile(__dirname + "/twitchsettingswidgetlarge.html", function (err, filedata)
    {
        if (err)
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                ".SendSettingsWidgetLarge", "failed to load modal", err);
        else
        {
            let modalString = filedata.toString();
            // replace any of our server config variables'text' names in the file
            for (const [key, value] of Object.entries(serverConfig))
            {
                if (value === "on")
                    modalString = modalString.replaceAll(key + "checked", "checked");
                // replace text strings
                else if (typeof (value) == "string")
                    modalString = modalString.replaceAll(key + "text", value);
            }
            // send the modified modal data to the server
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket(
                    "ExtensionMessage", // this type of message is just forwarded on to the extension
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        "SettingsWidgetLargeCode", // message type
                        serverConfig.extensionname, //our name
                        modalString,// data
                        "",
                        to,
                        serverConfig.channel
                    ),
                    "",
                    to // in this case we only need the "to" channel as we will send only to the requester
                ))
        }
    });
}
// ===========================================================================
//                           FUNCTION: sendTwitchChatCredentials
// ===========================================================================
/**
 * updates the twitch chat extension with credentials
 * @param {string} name 
 * @param {string} oauth 
 * @param {string} bot 
 */
function sendTwitchChatCredentials (name, oauth, bot = false)
{
    let data = {}
    if (bot)
    {
        data.twitchchatbot = name
        data.twitchchatbotoauth = oauth
    }
    else
    {
        data.twitchchatuser = name
        data.twitchchatuseroauth = oauth
    }
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ExtensionMessage',
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "CredentialsFileFromTwitch",
                serverConfig.extensionname,
                data,
                '',
                'twitchchat'),
            '',
            'twitchchat'
        )
    );
}
// ===========================================================================
//                           FUNCTION: handleSettingsWidgetSmallData
// ===========================================================================
/**
 * Handles data from a user submit on our small settings widget
 * @param {object} modalCode 
 * @returns boolean restart connection needed due to data change
 */
function handleSettingsWidgetSmallData (modalCode)
{
    try
    {
        let restartConnection = false;
        /* check enabled change */
        if (serverConfig.twitchenabled != modalCode.twitchenabled)
        {
            restartConnection = true;
            if (modalCode.twitchenabled)
                serverConfig.twitchenabled = "on"
            else
                serverConfig.twitchenabled = "off"
        }
        /* check streamername change */
        if (modalCode.twitchstreamername != serverConfig.twitchstreamername)
        {
            restartConnection = true;
            serverConfig.twitchstreamername = modalCode["twitchstreamername"]
        }

        /* check clear history/categories flag */
        let clearTwitchTitles = modalCode[localConfig.twitchTitleDropdownId + "_clearHistory"] == "on"
        let clearTwitchCategories = modalCode[localConfig.twitchCategoriesDropdownId + "_clearHistory"] == "on"

        if (clearTwitchTitles || clearTwitchCategories)
        {
            if (clearTwitchCategories)
                serverConfig.twitchCategoriesHistory = [];
            if (clearTwitchTitles)
            {
                serverConfig.twitchTitlesHistory = [];
                localConfig.currentTwitchGameCategoryId = -1
            }
            // return now to clear options
            return restartConnection;
        }
        // search for game on twitch
        if (modalCode["twitchSearchForTwitchGameElementId"] && modalCode["twitchSearchForTwitchGameElementId"] != "")
        {
            let gameName = modalCode["twitchSearchForTwitchGameElementId"];
            // Add game name to history list (true)
            addGameToHistoryFromGameName(gameName)
            // return now as we only want to process the search on this submit
            return restartConnection;
        }
        /* Process Twitch Category */
        const userSelectedCategoryId = modalCode[localConfig.twitchCategoriesDropdownId]
        if (userSelectedCategoryId)
        {
            getGameFromId(userSelectedCategoryId)
                .then((game) =>
                {
                    if (game)
                    {
                        // found game check if we have it in our history already
                        const inHistory = serverConfig.twitchCategoriesHistory.findIndex(e => e.id === game.id);
                        // add to history if not already there
                        if (inHistory == -1)
                            serverConfig.twitchCategoriesHistory.push(game)
                        //  set game if we are connected and the game is different
                        if (localConfig.status.connected && localConfig.currentTwitchGameCategoryId != game.id)
                            setStreamGame(game.id)
                    }
                    else
                        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
                            ".handleSettingsWidgetSmallData", "Couldn't find game id on twitch. Id:", userSelectedCategoryId);

                    /* Process Twitch Title */
                    if (modalCode[localConfig.twitchTitlesTextElementId] && modalCode[localConfig.twitchTitlesTextElementId] != "")
                    {
                        let titleIndex = serverConfig.twitchTitlesHistory.findIndex(x => x === modalCode[localConfig.twitchTitlesTextElementId]);
                        if (titleIndex > -1)
                            serverConfig.lastSelectedTwitchTitleId = titleIndex;
                        else
                            serverConfig.lastSelectedTwitchTitleId = serverConfig.twitchTitlesHistory.push(modalCode[localConfig.twitchTitlesTextElementId]) - 1

                        setStreamTitle(serverConfig.twitchTitlesHistory[serverConfig.lastSelectedTwitchTitleId])
                    }
                    return restartConnection
                })
                .catch((err) =>
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".handleSettingsWidgetSmallData.getGameFromId", "Error", err, err.message);
                })
        }
        return restartConnection
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".handleSettingsWidgetSmallData", "Error", err, err.message);
    }
}
// ============================================================================
//                           FUNCTION: DeleteCredentialsOnServer
// ============================================================================
/**
 * Delete our credential file from the server
 */
function DeleteCredentialsOnServer ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "DeleteCredentials",
            serverConfig.extensionname,
            {
                ExtensionName: serverConfig.extensionname,
            },
        ));
}
// ============================================================================
//                           FUNCTION: heartBeat
// ============================================================================
/**
 * Sends out heartbeat messages so other extensions can see our status
 */
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
/**
 *  Connects to the twitch api
 */
async function connectTwitch ()
{
    try
    {
        if (!serverCredentials.twitchOAuthToken || serverCredentials.twitchOAuthToken == undefined || serverCredentials.twitchOAuthToken == "")
        {
            serverConfig.twitchenabled = "off"
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch",
                "Missing streamer authorization, go to the main twitch settings page to authorise for twitch. Turning off extension");
            return;
        }

        // setup client
        let auth = localConfig.authProvider
        localConfig.apiClient = new ApiClient({ authProvider: auth });

        let datauser = await localConfig.apiClient.getTokenInfo()
        serverCredentials.twitchName = datauser.userName;

        if (serverConfig.twitchstreamername == "")
        {

            if (serverCredentials.twitchName && serverCredentials.twitchName != "")
                serverConfig.twitchstreamername = serverCredentials.twitchName;
            else
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Missing stream name, please set a stream name to work with in the settings");
        }

        // get some data about the streamer (id etc)
        localConfig.streamerData = await localConfig.apiClient.users.getUserByName(serverConfig.twitchstreamername)

        if (localConfig.streamerData == null)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "Streamer Not found");
            return
        }

        // get the current channel info (needed so we can trigger on changes)
        //let channelData = await localConfig.apiClient.channels.getChannelInfoById(localConfig.streamerData.id)
        localConfig.apiClient.channels.getChannelInfoById(localConfig.streamerData.id)
            .then((channelData) =>
            {
                /*console.log("---------GameDataForChannel-------------")
                console.log("contentClassificationLabels", channelData.contentClassificationLabels);
                console.log("delay", channelData.delay);
                console.log("displayName", channelData.displayName);
                console.log("gameId", channelData.gameId);
                console.log("gameName", channelData.gameName);
                console.log("id", channelData.id);
                console.log("isBrandedContent", channelData.isBrandedContent);
                console.log("language", channelData.language);
                console.log("name", channelData.name);
                console.log("tags", channelData.tags);
                console.log("title", channelData.title);*/


                // set our current game id and add it to the history
                localConfig.currentTwitchGameCategoryId = channelData.gameId;
                localConfig.currentTwitchStreamTitle = channelData.title;
                // need to do this here as we don't have the game image in the current data.
                addGameToHistoryFromGameName(channelData.gameName)
                // Connect to the pub sub event listener
                eventSubApi.init(localConfig, serverConfig, triggersandactions, pubSubTriggerCallback)
                eventSubApi.startEventSub(localConfig.streamerData.id, localConfig.apiClient, channelData)

                // set us to connected at this time
                localConfig.status.connected = true;

                // get the game categories for twitch
                getAllGameCategories();

                // send out the game changed trigger (as we have only just connected) but give chance for extensions
                //to start up (if we have just started the server)
                setTimeout(() =>
                {
                    sendTwitchStats("twitch")
                }, 5000);

            })
            .catch((err) =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch:", "ERROR", err, err.message);
            });
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".connectTwitch", "ERROR", err.message);
        localConfig.status.connected = false;
        setTimeout(() =>
        {
            connectTwitch()
        }, localConfig.twitchReconnectTimer);
    }
}
// ===========================================================================
//                           FUNCTION: getAllGameCategories
// ===========================================================================
/**
 * Collates and sends out the twitch 'Top' category list 
 * @param {string} id trigger identifier or "twitch"
 */
async function getAllGameCategories (id = "twitch")
{
    try
    {
        // Fetch paginated results for top games
        const gamePaginator = localConfig.apiClient.games.getTopGamesPaginated();

        // Asynchronously iterate through all pages
        for await (const game of gamePaginator)
            localConfig.gameCategories.push({ id: game.id, name: game.name, imageURL: game.boxArtUrl })
        sendGameCategoriesTrigger(id)
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllGameCategories", "Error fetching categories:", err, err.message);
    }
}
// ===========================================================================
//                           FUNCTION: addGameToHistoryFromGameName
// ===========================================================================
/**
 * Adds a game by name to the history list
 * @param {string} gameName 
 */
async function addGameToHistoryFromGameName (gameName)
{
    try
    {
        // get the game index if we already have the data
        const categoryIndex = localConfig.gameCategories.findIndex(e => e.name === gameName);
        // not got this game in our local cache so get it from twitch
        if (categoryIndex == -1)
        {
            if (!localConfig.apiClient.games)
            {
                console.log("localConfig.apiClient.games not available yet.")
                return null;
            }
            // Fetch the game date if we don't have it already
            localConfig.apiClient.games.getGameByName(gameName)
                .then((game) =>
                {
                    if (game)
                    {
                        if (!serverConfig.twitchCategoriesHistory
                            || serverConfig.twitchCategoriesHistory.findIndex(e => e.name === game.name) == -1)
                        {
                            const gameObject = { id: game.id, name: game.name, imageURL: game.boxArtUrl }
                            serverConfig.twitchCategoriesHistory.push(gameObject);
                            localConfig.twitchCategoryErrorsShowCounter = 0
                            SendSettingsWidgetSmall()
                        }
                    }
                    else
                    {
                        localConfig.twitchCategoryErrorsText = "Couldn't Find Game '" + gameName + "' on twitch"
                        // how many reloads to keep displaying the error 
                        // due to the chance of another update going out too quickly
                        localConfig.twitchCategoryErrorsShowCounter = 3;
                        SendSettingsWidgetSmall()
                    }

                })
                .catch((err) =>
                {
                    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllGameCategories getGameByName failed to fetch Id", "Error fetching categories:", err, err.message);
                })

        }
        else
        {
            // get the game from our list
            let game = localConfig.gameCategories[categoryIndex]
            // if not in the history already then add it.
            if (!serverConfig.twitchCategoriesHistory || serverConfig.twitchCategoriesHistory.findIndex(e => e.name === game.name) == -1)
            {
                serverConfig.twitchCategoriesHistory.push(game);
                localConfig.twitchCategoryErrorsShowCounter = 0;
            }

        }
    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getAllGameCategories", "Error fetching categories:", err, err.message);
        return null
    }
}
// ===========================================================================
//                           FUNCTION: getGameFromId
// ===========================================================================
/**
 * Get a game object from a game Id
 * @param {number} gameId 
 * @returns gameobject
 */
async function getGameFromId (gameId)
{

    try
    {
        // check if we have this game in our list from twitch
        const categoryIndex = localConfig.gameCategories.findIndex(e => e.id === gameId);
        if (!localConfig.apiClient || !localConfig.apiClient.games)
        {
            console.log("localConfig.apiClient.games not available yet.")
            return null;
        }
        if (categoryIndex == -1)
        {
            // wd don't have this game so lets go get it.
            localConfig.apiClient.games.getGameById(gameId)
                .then((game) => 
                {
                    if (game)
                        return { id: game.id, name: game.name, imageURL: game.boxArtUrl }
                    else
                        return null
                })
        }
        else
            return (localConfig.gameCategories[categoryIndex])

    } catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getGameFromId", "Error fetching/finding game:" + gameId, err, err.message);
        return null
    }
}
// ===========================================================================
//                           FUNCTION: disconnectTwitch
// ===========================================================================
/**
 * Disconnect the twitch API
 */
function disconnectTwitch ()
{
    eventSubApi.removeSubs()
}
// ===========================================================================
//                           FUNCTION: setStreamTitle
// ===========================================================================
/**
 * Sets the current stream title
 * @param {string} title 
 */
async function setStreamTitle (title)
{
    localConfig.apiClient.channels.updateChannelInfo(localConfig.streamerData.id, { title: title })
}
// ===========================================================================
//                           FUNCTION: setStreamGame
// ===========================================================================
/**
 * Sets the current game/category in twitch
 * @param {number} gameId 
 */
async function setStreamGame (gameId)
{
    if (gameId)
        localConfig.apiClient.channels.updateChannelInfo(localConfig.streamerData.id, { gameId: gameId })
    else
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".setStreamGame", "No game category id passed");

}
// ===========================================================================
//                           FUNCTION: startCommercial
// ===========================================================================
/**
 * Start a add/commercial running on twitch
 * @param {number} length ["30", "60", "90", "120", "150", "180"]
 */
async function startCommercial (length)
{
    try
    {
        let lengths = ["30", "60", "90", "120", "150", "180"]
        if (!lengths.includes(length))
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "Commercial length invalid, must be one of 30, 60, 90, 120, 150, 180")
        else
        {
            try
            {
                localConfig.apiClient.channels.startChannelCommercial(localConfig.streamerData.id, length)
                    .then(ret =>
                    {
                        //TBD need to move trigger to pubsub/eventsub callback, if we ever have time to work out how to do that
                        let trigger = findTriggerByMessageType("trigger_TwitchCommercialStarted");
                        trigger.parameters.duration = length;
                        sendTrigger(trigger)
                    })
                    .catch((err) =>
                    {
                        if (err && err._body, JSON.parse(err._body).message)
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial:Error", JSON.parse(err._body).message)
                        else
                            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial:Error", JSON.stringify(err, null, 2))

                    })
            }
            catch (err)
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial:Error", JSON.stringify(err, null, 2));
            }
        }
    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial, is streamer live?");
            console.log(err, err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startCommercial", "ERROR", "Failed to start commercial (try reauthorising by going to  go to http://localhost:3000/twitch/auth)");
            console.log(err, err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: getChannelEditors
// ===========================================================================
/**
 * sends trigger trigger_TwitchEditors containing the chat editors
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getChannelVIPs
// ===========================================================================
/**
 * send trigger_TwitchVIPs containing chat VIP's
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: addVIP
// ===========================================================================
/**
 * Make the username a VIP
 * @param {string} username 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addVIP", "ERROR", "Failed to add VIP)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeVIP
// ===========================================================================
/**
 * Remove VIP status from user
 * @param {string} username 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeVIP", "ERROR", "Failed to remove VIP)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: addMod
// ===========================================================================
/**
 * make username a mod
 * @param {string} username 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".addMod", "ERROR", "Failed to add Moderator)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removeMod
// ===========================================================================
/**
 * Remove mod status from username
 * @param {string} username 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removeMod", "ERROR", "Failed to remove Moderator)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: banUser
// ===========================================================================
/**
 * Ban username for given reason
 * @param {string} username 
 * @param {string} reason 
 */
async function banUser (username, reason)
{
    try
    {
        localConfig.apiClient.users.getUserByName(username)
            .then((user) =>
            {
                if (user)
                {
                    let banData = {
                        duration: 0,
                        reason: "streamrollerBan:" + reason,
                        user: user.id
                    }
                    localConfig.apiClient.moderation.banUser(localConfig.streamerData.id, banData)
                        .then((response) =>
                        {
                            console.log("banUser returned", response)
                        })
                        .catch((err) =>
                        {
                            console.log("apiClient.moderation.banUser error", err, err.message)
                        })
                }
                else
                {
                    console.log("BanUser Error: User '" + username + "' was not found on twitch")
                }
            })
            .catch((err) =>
            {
                console.log("BanUser.getUserByName error", err)
            })


    }
    catch (err)
    {
        if (err._statusCode == 400)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".banUser", "ERROR", "Failed to ban User?");
            console.log(err, err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".banUser", "ERROR", "Failed to ban User)");
            console.log(err, err._body);
        }
    }
}

// ===========================================================================
//                           FUNCTION: unbanUser
// ===========================================================================
/**
 * Unban username for give reason
 * @param {string} username 
 * @param {string} reason 
 */
async function unbanUser (username, reason)
{
    try
    {
        await localConfig.apiClient.users.getUserByName(username)
            .then((user) =>
            {
                if (user && user.id && user.name)
                {
                    let banData = {
                        duration: 0,
                        reason: "streamrollerBan:" + reason,
                        user: user.id
                    }
                    localConfig.apiClient.moderation.unbanUser(localConfig.streamerData.id, user.id)
                        .then((response) =>
                        {
                            //console.log("User '"+username+"'was unbanned");
                        })
                        .catch((err) =>
                        {
                            if (err._body && err._body)
                                console.log("Error banning user", JSON.parse(err._body).message.replaceAll("in the user_id query parameter is not banned", username) + ". User is not banned.");
                            else
                                console.log("Error banning user", err)
                        })
                }
                else
                {
                    console.log("Can't unban User '" + username + "' as they were not found on twitch")
                }
            })
            .catch((err) =>
            {
                logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".unbanUser.getUserByName", "ERROR", err);
                console.log("JSON error", JSON.stringify(err, null, 2));
            })
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".unbanUser", "ERROR", "Failed to unBan User)");
        console.log("JSON error", JSON.stringify(err, null, 2));

    }
}
// ===========================================================================
//                           FUNCTION: followerCount
// ===========================================================================
/**
 * Send trigger_TwitchFollowerCount
 */
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
        console.log(err);

    }
}
// ===========================================================================
//                           FUNCTION: followedChannels
// ===========================================================================
/**
 * sends trigger_TwitchFollowedChannels
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: cheerEmotes
// ===========================================================================
/**
 * send trigger_TwitchCheerEmotes
 */
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
        console.log(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".cheerEmotes", "ERROR", "Failed to get cheer emotes  (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: globalBadges
// ===========================================================================
/**
 * send trigger_TwitchGlobalBadges
 */
async function globalBadges ()
{
    try
    {
        localConfig.apiClient.chat.getGlobalBadges()
            .then((data) =>
            {
                let counter = 0
                for (counter = 0; counter < data.length; counter++)
                {
                    localConfig.twitchImages.badges[data[counter].id] = {};
                    let versions = data[counter].versions
                    let c;
                    for (c = 0; c < versions.length; c++)
                    {
                        localConfig.twitchImages.badges[data[counter].id][c] = {};
                        localConfig.twitchImages.badges[data[counter].id][c].url = versions[c].getImageUrl(1);
                        localConfig.twitchImages.badges[data[counter].id][c].description = versions[c].description;
                    }
                }
                let trigger = findTriggerByMessageType("trigger_TwitchGlobalBadges");
                trigger.parameters.badges = localConfig.twitchImages;
                sendTrigger(trigger)

            })
            .catch((err) =>
            {
                logger.err(serverConfig.extensionname + ".globalBadges requesting badges", "Unhandled exception:", err);
            })
    }
    catch (err)
    {
        console.log(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".globalBadges", "ERROR", "Failed to get channel badges  (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: leaderboard
// ===========================================================================
/**
 * send trigger_TwitchLeaderboard
 */
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
        console.log(err)
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".leaderboard", "ERROR", "Failed to get leaderboard data  (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPolls
// ===========================================================================
/**
 * send a trigger_TwitchPoll message for each poll running
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPoll
// ===========================================================================
/**
 * send trigger_TwitchPoll
 * @param {number} id 
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: createPoll
// ===========================================================================
/**
 * Creates a twitch poll
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createPoll", "ERROR", "Failed to create a poll (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: endPoll
// ===========================================================================
/**
 * Ends the given poll
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".endPoll", "ERROR", "Failed to end a poll (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: startPrediction
// ===========================================================================
/**
 * Starts a prediction
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startPrediction", "ERROR", "Failed to create a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: cancelPrediction
// ===========================================================================
/**
 * Cancels a prediction
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".cancelPrediction", "ERROR", "Failed to cancel a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: getPredictions
// ===========================================================================
/**
 * sends trigger_TwitchPrediction for each current predictions
 * @param {object} data 
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: getPrediction
// ===========================================================================
/**
 * Sends trigger_TwitchPrediction for the given prediction
 * @param {object} data 
 */
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
        console.log(err._body);
    }
}
// ===========================================================================
//                           FUNCTION: lockPrediction
// ===========================================================================
/**
 * Locks a prediction in it's current state
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".lockPrediction", "ERROR", "Failed to lock a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: removePrediction
// ===========================================================================
/**
 * Delete prediction
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".removePrediction", "ERROR", "Failed to remove a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: resolvePrediction
// ===========================================================================
/**
 * Resolves the current prediction with the given data
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".resolvePrediction", "ERROR", "Failed to resolve a prediction (try reauthorising by going to go to http://localhost:3000/twitch/auth)");
            console.log(err._body);
        }
    }
}
// ===========================================================================
//                           FUNCTION: createBlock
// ===========================================================================
/**
 * Block the user given
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".createBlock", "ERROR", "Failed to block user)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: deleteBlock
// ===========================================================================
/**
 * Remove a Block from the given user
 * @param {object} data 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".deleteBlock", "ERROR", "Failed to unblock user)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION: containsBadChars
// ===========================================================================
/**
 * Tests for unicode charts in a string
 * @param {string} s 
 * @returns boolean
 */
function containsBadChars (s)
{
    //return /[\u3040-\uffff]/.test(s);
    return /[\u3100-\uffff]/.test(s);
}
// ===========================================================================
//                           FUNCTION: getUser
// ===========================================================================
/**
 * send trigger_TwitchUserDetails message for given user
 * @param {string} username 
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".server.getUser", "ERROR", "Failed to get user)", username);
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION:  getBlockedUsers
// ===========================================================================
/**
 * send a trigger_TwitchUserBlocks message containing current blocked users
 */
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
            console.log(err._body);
        }
        else
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ". getAuthenticatedUser", "ERROR", "Failed to get authenticated user)");
            console.log(err);
        }
    }
}
// ===========================================================================
//                           FUNCTION:  createClip
// ===========================================================================
/**
 * Create a twitch clip and send out trigger_TwitchClipCreated when done
 */
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
        console.log(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipById
// ===========================================================================
/**
 * Gets a clip using data.clipName,if clip isn't available yet (i.e. still being processed)
 * setup a reschedule timer to wait for clip. Sends trigger_TwitchVodClip when found
 * @param {object} data 
 * @param {number} [rollbackCount=5] in seconds, reduced by 1 second each rollback
 */
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
        console.log(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipsByBroadcaster
// ===========================================================================
/**
 * Sends out a trigger_TwitchVodClip message for each clip the broadcaster has
 * data is formatted from an action. 
 * @param {object} data 
 * @param {number} [rollbackCount=5] number of times to check (1 second polls, in case clip is still being processed)
 */
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
        console.log(err);
    }
}
// ===========================================================================
//                           FUNCTION:  getClipsByBroadcaster
// ===========================================================================
/**
 * sends a trigger_TwitchVodClip for each clip from a game category based on data object
 * @param {object} data 
 */
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
        console.log(err);
    }
}
// ===========================================================================
//                           FUNCTION: sendGameCategoriesTrigger
// ===========================================================================
/**
 * sends trigger_TwitchGameCategories containing all games in our category
 * @param {number} [id="twitch"] ref id from action
 */
function sendGameCategoriesTrigger (id = "twitch")
{
    let trigger = findTriggerByMessageType("trigger_TwitchGameCategories");
    trigger.parameters.id = id;
    trigger.parameters.games = localConfig.gameCategories;
    // we also send our settings out in case the categories have change
    SendSettingsWidgetSmall()
    sendTrigger(trigger)
}
// ===========================================================================
//                           FUNCTION: sendTwitchStats
// ===========================================================================
/**
 * sends trigger_TwitchGamedChanged
 * @param {number} [triggerId="twitch"] ref id from action
 */
function sendTwitchStats (triggerId = "twitch")
{
    let trigger = findTriggerByMessageType("trigger_TwitchGamedChanged");
    const game = serverConfig.twitchCategoriesHistory.find(e => e.id === localConfig.currentTwitchGameCategoryId);
    if (game)
    {
        trigger.parameters = { triggerId: triggerId, id: game.id, name: game.name, imageURL: game.imageURL }
        sendTrigger(trigger)
    }

    trigger = findTriggerByMessageType("trigger_TwitchTitleChanged");
    if (game)
    {
        trigger.parameters = { triggerId: triggerId, title: localConfig.currentTwitchStreamTitle }
        sendTrigger(trigger)
    }

}
// ===========================================================================
//                           FUNCTION: raidChannel
// ===========================================================================
/**
 * sends trigger_TwitchGamedChanged
 * @param {string} username ref id from action
 */
async function raidChannel (ref, username)
{
    try
    {
        //const raid = await api.raids.startRaid(from,to);
        let user = await localConfig.apiClient.users.getUserByName(username)
        const raid = await localConfig.apiClient.raids.startRaid(localConfig.streamerData.id, user.id);
        let trigger = findTriggerByMessageType("trigger_TwitchRaidChannel");
        trigger.parameters = { triggerActionRef: ref, username: username, raidDate: raid.creationDate }
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".raidChannel", "Raid channel failed", err);
    }

}
// ===========================================================================
//                           FUNCTION: pubSubTriggerCallback
// ===========================================================================
/**
 * Callback for all triggers used in the twitch pubsub.
 * gets called whenever the pubsub module needs to create a trigger
 * @param {object} trigger 
 */
function pubSubTriggerCallback (trigger)
{
    //This gets called whenever the pubsub modules gets a callback from twitch
    // we've had a twitch game change callback
    if (trigger.messagetype == "trigger_TwitchGamedChanged")
    {
        // change our setup so it matches the data from twitch
        localConfig.currentTwitchGameCategoryId = trigger.parameters.gameId;
        addGameToHistoryFromGameName(trigger.parameters.name)
        //update any of our modals
        SendSettingsWidgetSmall()
        //save the serverConfig so we remember the changes
        SaveConfigToServer()
    }
    else if (trigger.messagetype == "trigger_TwitchTitleChanged")
    {
        // change our setup so it matches the data from twitch
        localConfig.currentTwitchStreamTitle = trigger.parameters.title;

        //update any of our modals
        SendSettingsWidgetSmall()
        //save the serverConfig so we remember the changes
        SaveConfigToServer()
    }
    else
        logger.log(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".getClipById", "pubSubTriggerCallback() no handler for ", trigger.messagetype, " twitch callback message");
}
// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
/**
 * Sends the given trigger out on our channel
 * @param {object} trigger 
 */
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
//                           FUNCTION: createDropdownWithSearchableHistory
// ============================================================================
/**
 * Creates an html dropdown list that is searchable using the given information
 * @param {string} id 
 * @param {string} categories 
 * @param {string} history 
 * @param {string} currentSelectedId 
 * @returns html string containing dropdown code
 */
function createDropdownWithSearchableHistory (id, categories = [], history = [], currentSelectedId = -1)
{
    let dropdownHtml = ""
    dropdownHtml += '<div class="d-flex-align w-100">';
    dropdownHtml += `<select class='selectpicker btn-secondary' data-style='btn-danger' style="max-width: 85%;" title='Current Game Category' id="${id}" value='${currentSelectedId}' name="${id}" required="">`
    // add history section if we have one
    if (history.length)
    {
        // add history separator
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--HISTORY--</option>'
        // Append history options first
        history.forEach(item =>
        {
            if (item.id == currentSelectedId)
                dropdownHtml += "<option value=\"" + item.id + "\" selected>" + item.name + "</option>";
            else
                dropdownHtml += "<option value=\"" + item.id + "\">" + item.name + "</option>";
        });

        // add history separator
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--END HISTORY--</option>';
    }
    else
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--Select an option--</option>'
    // check if we have loaded the categories yet
    if (serverConfig.twitchenabled == "off")
        dropdownHtml += '<option value="separator" disabled style="color:red;font-weight: bold">Extension turned off ...</option>';
    else if (!categories.length)
        dropdownHtml += '<option value="separator" disabled style="color:red;font-weight: bold">LOADING...</option>';
    // append categories
    categories.forEach(option =>
    {
        // only include if it isn't already in the history list
        if (!history.some(e => e.id === option.id))
        {
            if (option.id == currentSelectedId)
                dropdownHtml += '<option value="' + option.id + '" selected>' + option.name + '</option>';
            else
                dropdownHtml += '<option value="' + option.id + '">' + option.name + '</option>';
        }
    });
    dropdownHtml += '</select>';
    // add clear history checkbox
    dropdownHtml += `&nbsp<div class="form-check form-check-inline">
        <input class="form-check-input" name="${id}_clearHistory" type="checkbox" id="${id}_clearHistory" ${id}_clearHistorychecked>
        <label class="form-check-label" for="${id}_clearHistory">Clear History</label>
      </div>`
    dropdownHtml += '</div>';
    return dropdownHtml;
}
// ============================================================================
//                           FUNCTION: getTextboxWithHistoryHTML
// ============================================================================
/**
 * Creates an html dropdown list on a text box is searchable using the given information
 * @param {string} SelectEleId 
 * @param {string} TextEleId 
 * @param {string} history 
 * @param {string} currentSelectedId 
 * @returns html string containing textbox code
 */
function getTextboxWithHistoryHTML (SelectEleId, TextEleId, history, currentSelectedId)
{
    let dropdownHtml = "";
    dropdownHtml += '<div class="d-flex-align w-100">';
    if (history[currentSelectedId])
        dropdownHtml += `<input type="text" class="form-control" id="${TextEleId}" name="${TextEleId}" value = "${history[currentSelectedId]}" placeholder="${history[currentSelectedId]}">`
    else
        dropdownHtml += `<input type="text" class="form-control" id="${TextEleId}" name="${TextEleId}" placeholder="Please Enter a new Title or select one from the history">`


    dropdownHtml += `<select class='selectpicker btn-secondary' data-style='btn-danger' style="max-width: 85%;" title='Current Title' id="${SelectEleId}" value='${currentSelectedId}' name="${SelectEleId}" onchange="document.getElementById('${TextEleId}').value = this.options[this.selectedIndex].text">`

    if (history.length)
    {
        history.forEach((item, i) => 
        {
            if (i == currentSelectedId)
                dropdownHtml += `<option value="` + i + `" selected >` + item + `</option>`;

            else
                dropdownHtml += `<option value="` + i + `">` + item + `</option>`;
        });

    }
    else
        dropdownHtml += '<option value="separator" disabled style="color:rgb(255 255 0 / 80%);font-weight: bold">--No History Available--</option>'
    dropdownHtml += '</select>';
    dropdownHtml += `&nbsp<div class="form-check form-check-inline">
        <input class="form-check-input" name="${SelectEleId}_clearHistory" type="checkbox" id="${SelectEleId}_clearHistory" ${SelectEleId}_clearHistorychecked>
        <label class="form-check-label" for="${SelectEleId}_clearHistory">Clear History</label>
      </div>`

    dropdownHtml += "</div>"

    return dropdownHtml
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
/**
 * Finds the trigger using the passed messagetype
 * @param {string} messagetype 
 * @returns trigger
 */
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return structuredClone(triggersandactions.triggers[i]);
    }
    logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname +
        ".findTriggerByMessageType", "failed to find trigger", messagetype);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * waits for config and credentials files to set ready flag
 */
function startupCheck ()
{
    const allReady = Object.values(localConfig.readinessFlags).every(flag => flag);
    if (allReady)
    {
        localConfig.ready = true;
        try
        {
            postStartupActions();
            // perform any startup stuff here that requires saved credentials and config
        } catch (err)
        {
            logger.err(localConfig.SYSTEM_LOGGING_TAG + serverConfig.extensionname + ".startupCheck", err);
        }
    }
    else
        setTimeout(startupCheck, localConfig.startupCheckTimer);
}
// ============================================================================
//                           FUNCTION: startupCheck
// ============================================================================
/**
 * At this point we should have any config/credentials loaded
 */
function postStartupActions ()
{
    // Let the server know we are now up and running.
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionReady", serverConfig.extensionname));
}

export { start, triggersandactions };

