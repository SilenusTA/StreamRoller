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
import { EventSubWsListener } from '@twurple/eventsub-ws';
import * as logger from "../../../backend/data_center/modules/logger.js";
import sr_api from "../../../backend/data_center/public/streamroller-message-api.cjs";

const localConf = {
    apiEventSub: null,
    eventSubs: [],
    triggersandactions: null,
    channelData: null
}
let parentLocalConfig = null
let parentServerConfig = null

// ============================================================================
//                           FUNCTION: Init
// ============================================================================
function init (LocalConfig, ServerConfig, tAndAs)
{
    parentLocalConfig = LocalConfig;
    parentServerConfig = ServerConfig;
    localConf.triggersandactions = tAndAs
}
// ============================================================================
//                           FUNCTION: startEventSub
// ============================================================================
function startEventSub (streamerId, apiClient, channelData)
{
    try
    {
        localConf.channelData = channelData;

        // get fields from https://twurple.js.org/reference/api/classes/HelixChannel.html

        //connect to the event sub listener and start it
        localConf.apiEventSub = new EventSubWsListener({ apiClient: apiClient });
        localConf.apiEventSub.start();

        // register our listeners
        localConf.eventSubs["onStreamStarted"] =
            localConf.apiEventSub.onStreamOnline(streamerId, onStreamStarted)
        localConf.eventSubs["onStreamStopped"] =
            localConf.apiEventSub.onStreamOffline(streamerId, onStreamStopped);
        localConf.eventSubs["onChannelUpdate"] =
            localConf.apiEventSub.onChannelUpdate(streamerId, onChannelUpdate);
        localConf.eventSubs["onChannelModeratorAdd"] =
            localConf.apiEventSub.onChannelModeratorAdd(streamerId, onChannelModeratorAdd);
        localConf.eventSubs["onChannelModeratorRemove"] =
            localConf.apiEventSub.onChannelModeratorRemove(streamerId, onChannelModeratorRemove);
        localConf.eventSubs["onChannelRedemptionAdd"] =
            localConf.apiEventSub.onChannelRedemptionAdd(streamerId, onChannelRedemptionAdd);
    }
    catch (err)
    {
        logger.err("[EXTENSIONS]twitch.eventsub.connectEventSubWs", "ERROR", err.message);
    }
}
// ============================================================================
//                           FUNCTION: stopEventSub
// ============================================================================
function stopEventSub ()
{
    // loop object
    let keys = Object.keys(localConf.eventSubs)
    keys.forEach(element =>
    {
        localConf.eventSubs[element].stop()
    });
}
// ============================================================================
//                           FUNCTION: onStreamStarted
// ============================================================================
function onStreamStarted (data)
{
    sendTrigger(findTriggerByMessageType("trigger_TwitchStreamStarted"))
}
// ============================================================================
//                           FUNCTION: onStreamStopped
// ============================================================================
function onStreamStopped (data)
{
    sendTrigger(findTriggerByMessageType("trigger_TwitchStreamEnded"))
}
// ============================================================================
//                           FUNCTION: onChannelUpdate
// ============================================================================
function onChannelUpdate (data)
{
    if (localConf.channelData.gameId != data.categoryId)
    {
        localConf.channelData.gameId = data.categoryId
        let trigger = findTriggerByMessageType("trigger_TwitchGamedIdChanged");
        trigger.parameters.gameId = data.categoryId;
        sendTrigger(trigger)
    }
    if (localConf.channelData.gameName != data.categoryName)
    {
        let trigger = findTriggerByMessageType("trigger_TwitchGamedNameChanged");
        trigger.parameters.name = data.categoryName;
        sendTrigger(trigger)
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
        sendTrigger(trigger)
    }
    if (localConf.channelData.title != data.streamTitle)
    {
        let trigger = findTriggerByMessageType("trigger_TwitchTitleChanged");
        trigger.parameters.title = data.streamTitle;
        sendTrigger(trigger)
    }
}
// ============================================================================
//                           FUNCTION: onChannelModeratorAdd
// ============================================================================
function onChannelModeratorAdd (data)
{
    let trigger = findTriggerByMessageType("trigger_TwitchModAdded");
    trigger.parameters.user = data.userDisplayName;
    sendTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: onChannelModeratorRemove
// ============================================================================
function onChannelModeratorRemove (data)
{
    let trigger = findTriggerByMessageType("trigger_TwitchModRemoved");
    trigger.parameters.user = data.userDisplayName;
    sendTrigger(trigger)
}
// ============================================================================
//                           FUNCTION: onChannelModeratorRemove
// ============================================================================
function onChannelRedemptionAdd (data)
{
    let trigger = findTriggerByMessageType("trigger_TwitchChannelRedemption");
    trigger.parameters.stream = data.broadcasterDisplayName;
    trigger.parameters.message = data.input;
    trigger.parameters.cost = data.rewardCost;
    trigger.parameters.id = data.rewardId;
    trigger.parameters.prompt = data.rewardPrompt;
    trigger.parameters.title = data.rewardTitle;
    trigger.parameters.user = data.userDisplayName;
    sendTrigger(trigger)
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
}
// ============================================================================
//                           FUNCTION: findTriggerByMessageType
// ============================================================================
function findTriggerByMessageType (messagetype)
{
    for (let i = 0; i < localConf.triggersandactions.triggers.length; i++)
    {
        if (localConf.triggersandactions.triggers[i].messagetype.toLowerCase().indexOf(messagetype.toLowerCase()) > -1)
            return localConf.triggersandactions.triggers[i];
    }
    logger.err(parentLocalConfig.SYSTEM_LOGGING_TAG + parentServerConfig.extensionname +
        ".findTriggerByMessageType", "failed to find action", messagetype);
}
export { startEventSub, stopEventSub, init } 