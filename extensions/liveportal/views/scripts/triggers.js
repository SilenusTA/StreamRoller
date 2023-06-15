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
// es-lint globals to stop red highlights
/*
global 
sr_api, serverConfig, DataCenterSocket, localConfig, refreshDarkMode ,$
*/

// ============================================================================
//                           FUNCTION: receivedTrigger
// ============================================================================
function initiTriggersAndActions (extension_list)
{
    console.log("initiTriggersAndActions")
    extension_list.forEach(ext =>
    {
        sr_api.sendMessage(DataCenterSocket,
            sr_api.ServerPacket(
                "ExtensionMessage",
                serverConfig.extensionname,
                sr_api.ExtensionPacket(
                    "SendTriggerAndActions",
                    serverConfig.extensionname,
                    "",
                    "",
                    ext
                ),
                "",
                ext
            ));
    }
    )
}
// ============================================================================
//                           FUNCTION: receivedTrigger
// ============================================================================
function receivedTrigger (triggers)
{
    console.log("receivedTrigger")
    /*for (var key in triggers)
    {
        localConfig.initiTriggersAndActions[trigger.extensionname].push(key);
    }*/
    localConfig.triggersAndActions.triggers[triggers.extensionname] = triggers.triggers;
    localConfig.triggersAndActions.actions[triggers.extensionname] = triggers.actions;
    console.log("Triggers", localConfig.triggersAndActions)

    // update the page with the new triggeroptions
    addTriggersWidgetLarge()
}

// ============================================================================
//                  FUNCTION: addTriggersWidgetLarge
//            Loads first dropdown to chose extension for trigger         
// ============================================================================
function addTriggersWidgetLarge ()
{
    // clear the existing page data
    //let Mainpage = document.getElementById("TriggersPageContent");
    let TriggersExtensionChoser = document.getElementById("triggerExtensionChoser")
    // Mainpage.innerHTML = "<h1>Triggers and Alerts</h1><p>This page allows you to control the triggers for events 
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";

    let triggerextensionnames = ""
    let triggers = localConfig.triggersAndActions.triggers;

    for (var key in triggers)
    {
        if (triggerextensionnames == "")
            triggerextensionnames += "<option value=" + key + ">" + key + "</option>";
        else
            triggerextensionnames += "<option value=" + key + ">" + key + "</option>";
    }
    TriggersExtensionChoser.innerHTML = triggerextensionnames;
}
// ============================================================================
// Webpage callback to load correct extension triggers and actions
// ============================================================================

// ============================================================================
//                           FUNCTION: triggersLoadptions
// ============================================================================
function triggersLoadTriggers (name)
{
    console.log("triggersLoadptions", name)
    let TriggersExtensionChoser = document.getElementById("triggerExtensionTriggers")
    let selectedTrigger = localConfig.triggersAndActions.triggers[name]
    let triggerextensionnames = ""
    console.log("selectedTrigger", selectedTrigger)
    for (var key in selectedTrigger)
    {
        console.log("key", key)
        if (triggerextensionnames == "")
            triggerextensionnames += "<option value=" + key + " selected>" + key + "</option>";
        else
            triggerextensionnames += "<option value=" + key + ">" + key + "</option>";
    }
    TriggersExtensionChoser.innerHTML = triggerextensionnames;

}