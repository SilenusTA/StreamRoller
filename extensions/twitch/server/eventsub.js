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
/*
These appear to be all the subs that can be made through this interface. 
listed here as I can never seem to find my way back to the webpage at
https://twurple.js.org/reference/eventsub-ws/classes/EventSubWsListener.html

onChannelBan
onChannelCharityCampaignProgress
onChannelCharityCampaignStart
onChannelCharityCampaignStop
onChannelCharityDonation
onChannelCheer
onChannelFollow
onChannelGoalBegin
onChannelGoalEnd
onChannelGoalProgress
onChannelHypeTrainBegin
onChannelHypeTrainEnd
onChannelHypeTrainProgress
onChannelModeratorAdd
onChannelModeratorRemove
onChannelPollBegin
onChannelPollEnd
onChannelPollProgress
onChannelPredictionBegin
onChannelPredictionEnd
onChannelPredictionLock
onChannelPredictionProgress
onChannelRaidFrom
onChannelRaidTo
onChannelRedemptionAdd
onChannelRedemptionUpdate
***onChannelRedemptionAddForReward
***onChannelRedemptionUpdateForReward
onChannelRewardAdd
onChannelRewardRemove
***onChannelRewardRemoveForReward
onChannelRewardUpdate
***onChannelRewardUpdateForReward
onChannelShieldModeBegin
onChannelShieldModeEnd
onChannelShoutoutCreate
onChannelShoutoutReceive
onChannelSubscription
onChannelSubscriptionEnd
onChannelSubscriptionGift
onChannelSubscriptionMessage
onChannelUnban
onChannelUpdate
***onDropEntitlementGrant
***onExtensionBitsTransactionCreate
onStreamOffline
onStreamOnline
***onUserAuthorizationGrant
***onUserAuthorizationRevoke

*/
import { EventSubWsListener } from '@twurple/eventsub-ws';
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";

const localConf = {
    apiClient: null,
    apiEventSub: null,
    eventSubs: [],
    tAndAs: null,
    channelData: null,
    streamerId: null,
    triggerCAllback: null
}
// get functions from https://twurple.js.org/reference/api/classes/HelixChannel.html
// get return values from https://twurple.js.org/reference/eventsub-base/classes/

const pubSubHandles = []
pubSubHandles["onChannelBan"] = { "name": "onChannelBan", "func": onChannelBan, "handle": null }
pubSubHandles["onChannelCharityCampaignProgress"] = { "name": "onChannelCharityCampaignProgress", "func": onChannelCharityCampaignProgress, "handle": null }
pubSubHandles["onChannelCharityCampaignStart"] = { "name": "onChannelCharityCampaignStart", "func": onChannelCharityCampaignStart, "handle": null }
pubSubHandles["onChannelCharityCampaignStop"] = { "name": "onChannelCharityCampaignStop", "func": onChannelCharityCampaignStop, "handle": null }
pubSubHandles["onChannelCharityDonation"] = { "name": "onChannelCharityDonation", "func": onChannelCharityDonation, "handle": null }
pubSubHandles["onChannelCheer"] = { "name": "onChannelCheer", "func": onChannelCheer, "handle": null }
pubSubHandles["onChannelFollow"] = { "name": "onChannelFollow", "func": onChannelFollow, "handle": null, "secondId": "true" }
pubSubHandles["onChannelGoalBegin"] = { "name": "onChannelGoalBegin", "func": onChannelGoalBegin, "handle": null }
pubSubHandles["onChannelGoalEnd"] = { "name": "onChannelGoalEnd", "func": onChannelGoalEnd, "handle": null }
pubSubHandles["onChannelGoalProgress"] = { "name": "onChannelGoalProgress", "func": onChannelGoalProgress, "handle": null }
pubSubHandles["onChannelHypeTrainBegin"] = { "name": "onChannelHypeTrainBegin", "func": onChannelHypeTrainBegin, "handle": null }
pubSubHandles["onChannelHypeTrainEnd"] = { "name": "onChannelHypeTrainEnd", "func": onChannelHypeTrainEnd, "handle": null }
pubSubHandles["onChannelHypeTrainProgress"] = { "name": "onChannelHypeTrainProgress", "func": onChannelHypeTrainProgress, "handle": null }
pubSubHandles["onChannelModeratorAdd"] = { "name": "onChannelModeratorAdd", "func": onChannelModeratorAdd, "handle": null }
pubSubHandles["onChannelModeratorRemove"] = { "name": "onChannelModeratorRemove", "func": onChannelModeratorRemove, "handle": null }
pubSubHandles["onChannelPollBegin"] = { "name": "onChannelPollBegin", "func": onChannelPollBegin, "handle": null }
pubSubHandles["onChannelPollEnd"] = { "name": "onChannelPollEnd", "func": onChannelPollEnd, "handle": null }
pubSubHandles["onChannelPollProgress"] = { "onChannelPollProgress": "onChannelPollProgress", "func": onChannelPollProgress, "handle": null }
pubSubHandles["onChannelPredictionBegin"] = { "name": "onChannelPredictionBegin", "func": onChannelPredictionBegin, "handle": null }
pubSubHandles["onChannelPredictionEnd"] = { "name": "onChannelPredictionEnd", "func": onChannelPredictionEnd, "handle": null }
pubSubHandles["onChannelPredictionProgress"] = { "onChannelPredictionProgress": "onChannelPredictionProgress", "func": onChannelPredictionProgress, "handle": null }
pubSubHandles["onChannelPredictionLock"] = { "onChannelPredictionLock": "onChannelPredictionLock", "func": onChannelPredictionLock, "handle": null }
pubSubHandles["onChannelRaidFrom"] = { "name": "onChannelRaidFrom", "func": onChannelRaidFrom, "handle": null }
pubSubHandles["onChannelRaidTo"] = { "name": "onChannelRaidTo", "func": onChannelRaidTo, "handle": null }
pubSubHandles["onChannelRedemptionAdd"] = { "name": "onChannelRedemptionAdd", "func": onChannelRedemptionAdd, "handle": null }
pubSubHandles["onChannelRedemptionUpdate"] = { "name": "onChannelRedemptionUpdate", "func": onChannelRedemptionUpdate, "handle": null }
pubSubHandles["onChannelRewardAdd"] = { "name": "onChannelRewardAdd", "func": onChannelRewardAdd, "handle": null }
pubSubHandles["onChannelRewardRemove"] = { "name": "onChannelRewardRemove", "func": onChannelRewardRemove, "handle": null }
pubSubHandles["onChannelRewardUpdate"] = { "name": "onChannelRewardUpdate", "func": onChannelRewardUpdate, "handle": null }
pubSubHandles["onChannelShieldModeBegin"] = { "name": "onChannelShieldModeBegin", "func": onChannelShieldModeBegin, "handle": null, "secondId": "true" }
pubSubHandles["onChannelShieldModeEnd"] = { "name": "onChannelShieldModeEnd", "func": onChannelShieldModeEnd, "handle": null, "secondId": "true" }
pubSubHandles["onChannelShoutoutCreate"] = { "name": "onChannelShoutoutCreate", "func": onChannelShoutoutCreate, "handle": null, "secondId": "true" }
pubSubHandles["onChannelShoutoutReceive"] = { "name": "onChannelShoutoutReceive", "func": onChannelShoutoutReceive, "handle": null, "secondId": "true" }
pubSubHandles["onChannelSubscription"] = { "name": "onChannelSubscription", "func": onChannelSubscription, "handle": null }
pubSubHandles["onChannelSubscriptionEnd"] = { "name": "onChannelSubscriptionEnd", "func": onChannelSubscriptionEnd, "handle": null }
pubSubHandles["onChannelSubscriptionGift"] = { "name": "onChannelSubscriptionGift", "func": onChannelSubscriptionGift, "handle": null }
pubSubHandles["onChannelSubscriptionMessage"] = { "name": "onChannelSubscriptionMessage", "func": onChannelSubscriptionMessage, "handle": null }
pubSubHandles["onChannelUnban"] = { "name": "onChannelUnban", "func": onChannelUnban, "handle": null }
pubSubHandles["onChannelUpdate"] = { "name": "onChannelUpdate", "func": onChannelUpdate, "handle": null }
pubSubHandles["onStreamOnline"] = { "name": "onStreamOnline", "func": onStreamOnline, "handle": null }
pubSubHandles["onStreamOffline"] = { "name": "onStreamOffline", "func": onStreamOffline, "handle": null }

let parentLocalConfig = null
let parentServerConfig = null

// ============================================================================
//                           FUNCTION: Init
// ============================================================================
function init (LocalConfig, ServerConfig, tAndAs, triggerCAllback)
{
    parentLocalConfig = LocalConfig;
    parentServerConfig = ServerConfig;
    localConf.tAndAs = tAndAs
    localConf.triggerCAllback = triggerCAllback
}
// ============================================================================
//                           FUNCTION: startEventSub
// ============================================================================
async function startEventSub (streamerId, apiClient, channelData)
{
    try
    {
        localConf.channelData = channelData;
        localConf.streamerId = streamerId
        localConf.apiClient = apiClient
        //connect to the event sub listener and start it
        localConf.apiEventSub = new EventSubWsListener({ apiClient: apiClient });
        await localConf.apiEventSub.start();
        registerSubs(streamerId);

    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.connectEventSubWs", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: registerSubs
// ============================================================================
function registerSubs (streamerId)
{
    try
    {
        // loop object
        let keys = Object.keys(pubSubHandles)
        keys.forEach(element =>
        {
            if (pubSubHandles[element].secondId != "true")
                pubSubHandles[element].handle = localConf.apiEventSub[element](streamerId, pubSubHandles[element].func)
            else  // some events need a second moderatorId so just use the streamers for this
                pubSubHandles[element].handle = localConf.apiEventSub[element](streamerId, streamerId, pubSubHandles[element].func)
        });
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.registerSubs", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: removeSubs
// ============================================================================
function removeSubs ()
{
    try
    {
        // loop object
        let keys = Object.keys(pubSubHandles)
        keys.forEach(element =>
        {
            if (pubSubHandles[element].handle != null)
            {
                pubSubHandles[element].handle.stop()
                pubSubHandles[element].handle = null
            }
        });
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.removeSubs", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelBan
// ============================================================================
function onChannelBan (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchUserBanned");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.isPermanent = data.isPermanent;
        trigger.parameters.moderator = data.moderatorDisplayName;
        trigger.parameters.reason = data.reason;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelBan", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelCharityCampaignProgress
// ============================================================================
function onChannelCharityCampaignProgress (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_CharityCampaignProgress");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.charityName = data.charityName;
        trigger.parameters.charityDescription = data.charityDescription;
        trigger.parameters.charityWebsite = data.charityWebsite;
        trigger.parameters.charityLogo = data.charityLogo;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.id = data.id;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelCharityCampaignProgress", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelCharityCampaignStart
// ============================================================================
function onChannelCharityCampaignStart (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchCharityCampaignStart");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.charityName = data.charityName;
        trigger.parameters.charityDescription = data.charityDescription;
        trigger.parameters.charityWebsite = data.charityWebsite;
        trigger.parameters.charityLogo = data.charityLogo;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.id = data.id;
        trigger.parameters.startDate = data.startDate;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelCharityCampaignStart", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelCharityCampaignStop
// ============================================================================
function onChannelCharityCampaignStop (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchCharityCampaignStop");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.charityName = data.charityName;
        trigger.parameters.charityDescription = data.charityDescription;
        trigger.parameters.charityWebsite = data.charityWebsite;
        trigger.parameters.charityLogo = data.charityLogo;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.id = data.id;
        trigger.parameters.endDate = data.endDate;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelCharityCampaignStop", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelCharityDonation
// ============================================================================
function onChannelCharityDonation (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchCharityDonation");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.amount = data.amount;
        trigger.parameters.campaignId = data.campaignId;
        trigger.parameters.charityName = data.charityName;
        trigger.parameters.charityDescription = data.charityDescription;
        trigger.parameters.charityWebsite = data.charityWebsite;
        trigger.parameters.charityLogo = data.charityLogo;
        trigger.parameters.donor = data.donorDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelCharityDonation", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelCheer
// ============================================================================
function onChannelCheer (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchCheer");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.bits = data.bits;
        trigger.parameters.isAnonymous = data.isAnonymous;
        trigger.parameters.message = data.message;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelCheer", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelFollow
// ============================================================================
function onChannelFollow (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchFollow");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelFollow", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelGoalBegin
// ============================================================================
function onChannelGoalBegin (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchGoalBegin");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.description = data.description;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.type = data.type;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelGoalBegin", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelGoalEnd
// ============================================================================
function onChannelGoalEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchGoalEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.description = data.description;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.type = data.type;
        trigger.parameters.isAchieved = data.isAchieved;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelGoalEnd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelGoalProgress
// ============================================================================
function onChannelGoalProgress (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchGoalProgress");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.currentAmount = data.currentAmount;
        trigger.parameters.description = data.description;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.targetAmount = data.targetAmount;
        trigger.parameters.type = data.type;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelGoalProgress", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelHypeTrainBegin
// ============================================================================
function onChannelHypeTrainBegin (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchHypeTrainBegin");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.expiryDate = data.expiryDate;
        trigger.parameters.goal = data.goal;
        trigger.parameters.id = data.id;
        trigger.parameters.lastContribution = data.lastContribution;
        trigger.parameters.level = data.level;
        trigger.parameters.progress = data.progress;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.topContributors = data.topContributors;
        trigger.parameters.total = data.total;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelHypeTrainBegin", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelHypeTrainEnd
// ============================================================================
function onChannelHypeTrainEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchHypeTrainEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.cooldownEndDate = data.cooldownEndDate;
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.id = data.id;
        trigger.parameters.level = data.level;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.topContributors = data.topContributors;
        trigger.parameters.total = data.total;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelHypeTrainEnd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelHypeTrainProgress
// ============================================================================
function onChannelHypeTrainProgress (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchHypeTrainProgress");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.expiryDate = data.expiryDate;
        trigger.parameters.goal = data.goal;
        trigger.parameters.id = data.id;
        trigger.parameters.lastContribution = data.lastContribution;
        trigger.parameters.level = data.level;
        trigger.parameters.progress = data.progress;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.topContributors = data.topContributors;
        trigger.parameters.total = data.total;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelHypeTrainProgress", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelModeratorAdd
// ============================================================================
function onChannelModeratorAdd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchModAdded");
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelModeratorAdd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelModeratorRemove
// ============================================================================
function onChannelModeratorRemove (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchModRemoved");
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelModeratorRemove", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelPollBegin
// ============================================================================
function onChannelPollBegin (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPollBegin");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.bitsPerVote = data.bitsPerVote;
        trigger.parameters.channelPointsPerVote = data.channelPointsPerVote;
        trigger.parameters.choices = data.choices;
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.id = data.id;
        trigger.parameters.isBitsVotingEnabled = data.isBitsVotingEnabled;
        trigger.parameters.isChannelPointsVotingEnabled = data.isChannelPointsVotingEnabled;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPollBegin", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelPollEnd
// ============================================================================
function onChannelPollEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPollEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.bitsPerVote = data.bitsPerVote;
        trigger.parameters.channelPointsPerVote = data.channelPointsPerVote;
        trigger.parameters.choices = data.choices;
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.id = data.id;
        trigger.parameters.isBitsVotingEnabled = data.isBitsVotingEnabled;
        trigger.parameters.isChannelPointsVotingEnabled = data.isChannelPointsVotingEnabled;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.startDate = data.status;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPollEnd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelPollProgress
// ============================================================================
function onChannelPollProgress (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPollProgress");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.bitsPerVote = data.bitsPerVote;
        trigger.parameters.channelPointsPerVote = data.channelPointsPerVote;
        trigger.parameters.choices = ""
        data.choices.forEach(function (choice, index)
        {
            if (index > 0)
                trigger.parameters.choices += " - "
            trigger.parameters.choices += choice.title + " " + choice.totalVotes
        })
        trigger.parameters.endDate = data.endDate;
        trigger.parameters.id = data.id;
        trigger.parameters.isBitsVotingEnabled = data.isBitsVotingEnabled;
        trigger.parameters.isChannelPointsVotingEnabled = data.isChannelPointsVotingEnabled;
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPollProgress", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: createPredictionString
// ============================================================================
function createPredictionString (data)
{
    let outcomeString = ""
    let topPredictionString = ""
    let userCount = "0"
    let chPoints = "0"

    data.outcomes.forEach(function (outcome, index)
    {
        if (index > 0)
            outcomeString += " - "
        if (outcome.users != undefined)
            userCount = outcome.users
        if (outcome.totalChannelPoints != undefined)
            chPoints = outcome.totalChannelPoints

        outcomeString += "id:" + outcome.id + " "
        outcomeString += "title:" + outcome.title + " "
        outcomeString += "userCount:" + userCount + " "
        outcomeString += "chPoints:" + chPoints + " "
        outcomeString += "color:" + outcome.color
        if (outcome.topPredictors == [])
        {
            outcome.topPredictors.forEach(function (name, i)
            {
                if (i > 0)
                    topPredictionString += " "
                topPredictionString += name
            })
        }

    })
    return { outcome: outcomeString, preds: topPredictionString }
}
// ============================================================================
//                           FUNCTION: onChannelPredictionBegin
// ============================================================================
function onChannelPredictionBegin (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPredictionBegin");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.id = data.id;
        trigger.parameters.lockDate = data.lockDate;
        let results = createPredictionString(data)
        trigger.parameters.outcomes = results.outcome
        trigger.parameters.predictions = results.preds
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPredictionBegin", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelPredictionEnd
// ============================================================================
function onChannelPredictionEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPredictionEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.id = data.id;
        trigger.parameters.endDate = data.endDate;
        let results = createPredictionString(data)
        trigger.parameters.outcomes = results.outcome
        trigger.parameters.predictions = results.preds
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        trigger.parameters.winningOutcome = data.winningOutcome;
        trigger.parameters.winningOutcomeId = data.winningOutcomeId;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPredictionEnd", "ERROR", err.message);
    }
}// ============================================================================
//                           FUNCTION: onChannelPollProgress
// ============================================================================
function onChannelPredictionLock (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPredictionLock");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.id = data.id;
        trigger.parameters.lockDate = data.lockDate;
        let results = createPredictionString(data)
        trigger.parameters.outcomes = results.outcome
        trigger.parameters.predictions = results.preds
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPredictionLock", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelPredictionProgress
// ============================================================================
function onChannelPredictionProgress (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchPredictionProgress");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.id = data.id;
        trigger.parameters.lockDate = data.lockDate;
        let results = createPredictionString(data)
        trigger.parameters.outcomes = results.outcome
        trigger.parameters.predictions = results.preds
        trigger.parameters.startDate = data.startDate;
        trigger.parameters.title = data.title;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelPredictionProgress", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRaidFrom
// ============================================================================
function onChannelRaidFrom (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRaidFrom");
        trigger.parameters.streamer = data.raidedBroadcasterDisplayName;
        trigger.parameters.raider = data.raidingBroadcasterDisplayName;
        trigger.parameters.viewers = data.viewers;
        console.log("twitch.raidfrom received", data)
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRaidFrom", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRaidTo
// ============================================================================
function onChannelRaidTo (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRaidTo");
        trigger.parameters.streamer = data.raidingBroadcasterDisplayName;
        trigger.parameters.raiding = data.raidedBroadcasterDisplayName;
        trigger.parameters.viewers = data.viewers;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRaidTo", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRedemptionAdd
// ============================================================================
function onChannelRedemptionAdd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRedemptionAdd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.id = data.rewardId;
        trigger.parameters.message = data.input;
        trigger.parameters.cost = data.rewardCost;
        trigger.parameters.rewardId = data.rewardId;
        trigger.parameters.prompt = data.rewardPrompt;
        trigger.parameters.title = data.rewardTitle;
        trigger.parameters.status = data.status;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRedemptionAdd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRedemptionUpdate
// ============================================================================
function onChannelRedemptionUpdate (data)
{
    try
    {

        let trigger = findTriggerByMessageType("trigger_TwitchRedemptionUpdate");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.message = data.input;
        trigger.parameters.cost = data.rewardCost;
        trigger.parameters.id = data.rewardId;
        trigger.parameters.prompt = data.rewardPrompt;
        trigger.parameters.title = data.rewardTitle;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRedemptionUpdate", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRewardAdd
// ============================================================================
function onChannelRewardAdd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRewardAdd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.autoApproved = data.autoApproved;
        trigger.parameters.bgColor = data.backgroundColor;
        trigger.parameters.expiryDate = data.cooldownExpiryDate;
        trigger.parameters.cost = data.cost;
        trigger.parameters.cooldown = data.globalCooldown;
        trigger.parameters.id = data.id;
        trigger.parameters.enabled = data.isEnabled;
        trigger.parameters.inStock = data.isInStock;
        trigger.parameters.paused = data.isPaused;
        trigger.parameters.maxPerStream = data.maxRedemptionsPerStream;
        trigger.parameters.maxPerUserPerStream = data.maxRedemptionsPerUserPerStream;
        trigger.parameters.prompt = data.prompt;
        trigger.parameters.redemptionsThisStream = data.redemptionsThisStream;
        trigger.parameters.title = data.title;
        trigger.parameters.inputRequired = data.userInputRequired;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRewardAdd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRewardRemove
// ============================================================================
function onChannelRewardRemove (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRewardRemove");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.autoApproved = data.autoApproved;
        trigger.parameters.bgColor = data.backgroundColor;
        trigger.parameters.expiryDate = data.cooldownExpiryDate;
        trigger.parameters.cost = data.cost;
        trigger.parameters.cooldown = data.globalCooldown;
        trigger.parameters.id = data.id;
        trigger.parameters.enabled = data.isEnabled;
        trigger.parameters.inStock = data.isInStock;
        trigger.parameters.paused = data.isPaused;
        trigger.parameters.maxPerStream = data.maxRedemptionsPerStream;
        trigger.parameters.maxPerUserPerStream = data.maxRedemptionsPerUserPerStream;
        trigger.parameters.prompt = data.prompt;
        trigger.parameters.redemptionsThisStream = data.redemptionsThisStream;
        trigger.parameters.title = data.title;
        trigger.parameters.inputRequired = data.userInputRequired;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRewardRemove", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelRewardUpdate
// ============================================================================
function onChannelRewardUpdate (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchRewardUpdate");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.autoApproved = data.autoApproved;
        trigger.parameters.bgColor = data.backgroundColor;
        trigger.parameters.expiryDate = data.cooldownExpiryDate;
        trigger.parameters.cost = data.cost;
        trigger.parameters.cooldown = data.globalCooldown;
        trigger.parameters.id = data.id;
        trigger.parameters.enabled = data.isEnabled;
        trigger.parameters.inStock = data.isInStock;
        trigger.parameters.paused = data.isPaused;
        trigger.parameters.maxPerStream = data.maxRedemptionsPerStream;
        trigger.parameters.maxPerUserPerStream = data.maxRedemptionsPerUserPerStream;
        trigger.parameters.prompt = data.prompt;
        trigger.parameters.redemptionsThisStream = data.redemptionsThisStream;
        trigger.parameters.title = data.title;
        trigger.parameters.inputRequired = data.userInputRequired;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelRewardUpdate", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelShieldModeBegin
// ============================================================================
function onChannelShieldModeBegin (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchShieldModeBegin");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.moderator = data.moderatorDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelShieldModeBegin", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelShieldModeEnd
// ============================================================================
function onChannelShieldModeEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchShieldModeEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.moderator = data.moderatorDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelShieldModeEnd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelShoutoutCreate
// ============================================================================
function onChannelShoutoutCreate (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchShoutoutCreate");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.cooldownDate = data.cooldownEndDate;
        trigger.parameters.moderator = data.moderatorDisplayName;
        trigger.parameters.targetName = data.shoutedOutBroadcasterDisplayName;
        trigger.parameters.targetCooldown = data.targetCooldownEndDate;
        trigger.parameters.viewerCount = data.viewerCount;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelShoutoutCreate", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelShoutoutReceive
// ============================================================================
function onChannelShoutoutReceive (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchShoutoutReceive");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.shouterName = data.shoutingOutBroadcasterDisplayName;
        trigger.parameters.viewerCount = data.viewerCount;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelShoutoutReceive", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelSubscription
// ============================================================================
function onChannelSubscription (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchSubscription");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.isGift = data.isGift;
        trigger.parameters.tier = data.tier;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelSubscription", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelSubscriptionEnd
// ============================================================================
function onChannelSubscriptionEnd (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchSubscriptionEnd");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.isGift = data.isGift;
        trigger.parameters.tier = data.tier;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelSubscriptionEnd", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelSubscriptionGift
// ============================================================================
function onChannelSubscriptionGift (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchSubscriptionGift");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.amount = data.amount;
        trigger.parameters.cumulativeAmount = data.cumulativeAmount;
        trigger.parameters.isGift = data.isGift;
        trigger.parameters.gifter = data.gifterDisplayName;
        trigger.parameters.anon = data.isAnonymous;
        trigger.parameters.tier = data.tier;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelSubscriptionGift", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelSubscriptionMessage
// ============================================================================
function onChannelSubscriptionMessage (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchSubscriptionMessage");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.cumulativeMonths = data.cumulativeMonths;
        trigger.parameters.durationMonths = data.durationMonths;
        trigger.parameters.emoteOffsets = data.emoteOffsets;
        trigger.parameters.message = data.messageText;
        trigger.parameters.streakMonths = data.streakMonths;
        trigger.parameters.tier = data.tier;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelSubscriptionMessage", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelUnban
// ============================================================================
function onChannelUnban (data)
{
    try
    {
        let trigger = findTriggerByMessageType("trigger_TwitchUserUnBanned");
        trigger.parameters.streamer = data.broadcasterDisplayName;
        trigger.parameters.moderator = data.moderatorDisplayName;
        trigger.parameters.user = data.userDisplayName;
        sendTrigger(trigger)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelUnban", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onChannelUpdate
// ============================================================================
async function onChannelUpdate (data)
{
    try
    {
        if (localConf.channelData.title != data.streamTitle)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchTitleChanged");
            trigger.parameters.title = data.streamTitle;
            sendTrigger(trigger)
        }
        if (localConf.channelData.gameId != data.categoryId)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchGamedChanged");
            data.getGame().then((game) =>
            {
                let trigger = findTriggerByMessageType("trigger_TwitchGamedChanged");
                trigger.parameters = {
                    triggerId: "twitchUpdate",
                    gameId: game.id,
                    name: game.name,
                    imageURL: game.boxArtUrl
                }
                sendTrigger(trigger)
            })
        }
        if (localConf.channelData.id != data.broadcasterId)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchStreamIdChanged");
            trigger.parameters.id = data.broadcasterId;
            sendTrigger(trigger)
        }
        if (localConf.channelData.language != data.streamLanguage)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchStreamLanguageChanged");
            trigger.parameters.language = data.streamLanguage;
            sendTrigger(trigger)
        }

        if (localConf.channelData.name != data.broadcasterName)
        {
            let trigger = findTriggerByMessageType("trigger_TwitchStreamerNameChanged");
            trigger.parameters.name = data.broadcasterName;
            localConf.streamerId = data.getBroadcaster().id
            sendTrigger(trigger)
        }
        // update our local data to the new config. Note that this callback has a different structure to 
        // this function call so can't just assign it.
        localConf.channelData = await localConf.apiClient.channels.getChannelInfoById(localConf.streamerId)
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onChannelUpdate", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onStreamStarted
// ============================================================================
function onStreamOnline (data)
{
    try
    {
        sendTrigger(findTriggerByMessageType("trigger_TwitchStreamStarted"))
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onStreamStarted", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: onStreamStopped
// ============================================================================
function onStreamOffline (data)
{
    try
    {
        sendTrigger(findTriggerByMessageType("trigger_TwitchStreamEnded"))
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.onStreamOffline", "ERROR", err.message);
    }
}
// ===========================================================================
//                           FUNCTION: sendTrigger
// ===========================================================================
function sendTrigger (trigger)
{
    sr_api.sendMessage(parentLocalConfig.DataCenterSocket,
        sr_api.ServerPacket(
            'ChannelData',
            parentServerConfig.extensionname,
            sr_api.ExtensionPacket(
                trigger.messagetype,
                parentServerConfig.extensionname,
                trigger,
                parentServerConfig.channel,
                ''),
            parentServerConfig.channel,
            ''
        )
    );
    if (localConf.triggerCAllback)
        localConf.triggerCAllback(trigger)
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < localConf.tAndAs.triggers.length; i++)
    {
        if (localConf.tAndAs.triggers[i].messagetype.toLowerCase() == messagetype.toLowerCase())
            return localConf.tAndAs.triggers[i];
    }
    logger.err(parentLocalConfig.SYSTEM_LOGGING_TAG + parentServerConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
export { startEventSub, removeSubs, init } 