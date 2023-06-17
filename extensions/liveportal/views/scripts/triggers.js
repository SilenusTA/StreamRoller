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
SaveConfigToServer
sr_api, serverConfig, DataCenterSocket, localConfig, refreshDarkMode ,$, livePortalData
*/

// ============================================================================
//                           FUNCTION: receivedTrigger
// ============================================================================
function initiTriggersAndActions (extension_list)
{
    // request triggers and actions from all the current extenssions we have
    extension_list.forEach(ext =>
    {
        sr_api.sendMessage(
            DataCenterSocket,
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
    localConfig.triggersAndActions.descriptions[triggers.extensionname] = triggers.description;
    if (triggers.triggers)
        localConfig.triggersAndActions.triggers[triggers.extensionname] = triggers.triggers;
    if (triggers.actions)
        localConfig.triggersAndActions.actions[triggers.extensionname] = triggers.actions;
    // update the page with the new triggeroptions
    addTriggersWidgetLarge();
    addActionsWidgetLarge();
    PopulateTriggersTable();
}

// ============================================================================
//                  FUNCTION: addTriggersWidgetLarge
//            Loads first dropdown to chose extension for trigger         
// ============================================================================
function addTriggersWidgetLarge ()
{
    // clear the existing page data
    let TriggersExtensionChoser = document.getElementById("triggerExtensionChoser")
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";
    let triggerextensionnames = ""
    let triggers = localConfig.triggersAndActions.triggers;

    for (var key in triggers)
    {
        if (triggerextensionnames == "")
        {
            triggerextensionnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + " selected>" + key + "</option>";
            TriggersExtensionChoser.title = key
        }
        else
            triggerextensionnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + ">" + key + "</option>";
    }
    TriggersExtensionChoser.innerHTML = triggerextensionnames;
    triggersLoadTriggers(key)
    TriggersExtensionChoser.dispatchEvent(new Event('change'))
}
// ============================================================================
// Webpage callback to load correct extension triggers
// ============================================================================

// ============================================================================
//                           FUNCTION: triggersLoadTriggers
// ============================================================================
function triggersLoadTriggers (name)
{
    let TriggerExtensionTriggers = document.getElementById("triggerExtensionTriggers")
    let selectedTrigger = localConfig.triggersAndActions.triggers[name]
    let triggerextensiontriggers = ""
    // set the title of the calling dropdown

    document.getElementById("triggerExtensionChoserLabel").innerHTML = localConfig.triggersAndActions.descriptions[name];
    document.getElementById("triggerExtensionChoser").title = name

    for (var key in selectedTrigger)
    {
        if (triggerextensiontriggers == "")
        {
            triggerextensiontriggers += "<div class='form-group'><option data='" + selectedTrigger[key].messagetype + "' class='form-control' value='" + key + "' selected>" + selectedTrigger[key].displaytitle + "</option></div>";
            TriggerExtensionTriggers.title = selectedTrigger[key].description
        }
        else
            triggerextensiontriggers += "<div class='form-group'><option data='" + selectedTrigger[key].messagetype + "' class='form-control' value='" + key + "'>" + selectedTrigger[key].displaytitle + "</option></div>";

    }
    TriggerExtensionTriggers.innerHTML = triggerextensiontriggers;
    triggersLoadParameters(0)
}
// ============================================================================
//                           FUNCTION: triggersLoadParameters
// ============================================================================
function triggersLoadParameters (id)
{
    let extensionname = document.getElementById("triggerExtensionChoser").value;
    let TriggerExtensionTriggerParameters = document.getElementById("triggerExtensionTriggerParameters")
    let params = localConfig.triggersAndActions.triggers[extensionname][id].parameters
    let triggername = localConfig.triggersAndActions.triggers[extensionname][id].name;
    let triggerextensionparameters = ""
    TriggerExtensionTriggerParameters.title = localConfig.triggersAndActions.triggers[extensionname][id].description
    // set the title of the calling dropdown
    document.getElementById("triggerExtensionTriggers").title = localConfig.triggersAndActions.triggers[extensionname][id].description
    document.getElementById("triggerExtensionChoserChannel").value = localConfig.triggersAndActions.triggers[extensionname][id].channel;
    document.getElementById("triggerExtensionChoserTriggerName").value = localConfig.triggersAndActions.triggers[extensionname][id].name;

    for (var key in params)
    {
        triggerextensionparameters += "<input type='text' name='" + triggername + "_" + key + "' class='form-control' id='" + key + "' placeholder='" + key + "' value=''>"
    }
    TriggerExtensionTriggerParameters.innerHTML = triggerextensionparameters;

}

// ============================================================================
//                  FUNCTION: addActionWidgetLarge
//            Loads first dropdown to chose extension for action         
// ============================================================================
function addActionsWidgetLarge ()
{
    // clear the existing page data
    //let Mainpage = document.getElementById("ActionPageContent");
    let ActionExtensionChoser = document.getElementById("actionExtensionChoser")
    // Mainpage.innerHTML = "<h1>Action and Alerts</h1><p>This page allows you to control the action for events 
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";
    let actionextensionnames = ""
    let action = localConfig.triggersAndActions.actions;

    for (var key in action)
    {
        if (actionextensionnames == "")
        {
            actionextensionnames += "<option name='" + key + "' class=' btn btn-secondary ' value=" + key + " selected>" + key + "</option>";
            ActionExtensionChoser.title = key
        }
        else
            actionextensionnames += "<option name='" + key + "' class=' btn btn-secondary ' value=" + key + ">" + key + "</option>";
    }
    ActionExtensionChoser.innerHTML = actionextensionnames;
    actionLoadAction(key)
    ActionExtensionChoser.dispatchEvent(new Event('change'))
}
// ============================================================================
// Webpage callback to load correct extension action
// ============================================================================

// ============================================================================
//                           FUNCTION: actionLoadAction
// ============================================================================
function actionLoadAction (name)
{
    let ActionExtensionAction = document.getElementById("actionExtensionAction")
    let selectedAction = localConfig.triggersAndActions.actions[name]
    let actionextensionaction = ""

    document.getElementById("actionExtensionChoserLabel").innerHTML = localConfig.triggersAndActions.descriptions[name]
    document.getElementById("actionExtensionChoser").title = name

    for (var key in selectedAction)
    {
        if (actionextensionaction == "")
        {
            actionextensionaction += "<div class='form-group'><option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "' selected>" + selectedAction[key].displaytitle + "</option></div>";
            ActionExtensionAction.title = selectedAction[key].description
        }
        else
            actionextensionaction += "<div class='form-group'><option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "'>" + selectedAction[key].displaytitle + "</option></div>";

    }
    ActionExtensionAction.innerHTML = actionextensionaction;
    actionLoadParameters(0)
    return true;
}
// ============================================================================
//                           FUNCTION: actionLoadParameters
// ============================================================================
function actionLoadParameters (id)
{
    let extensionname = document.getElementById("actionExtensionChoser").value;
    let ActionExtensionActionParameters = document.getElementById("actionExtensionActionParameters")
    let params = localConfig.triggersAndActions.actions[extensionname][id].parameters
    let actionname = localConfig.triggersAndActions.actions[extensionname][id].name;
    let actionextensionparameters = ""
    ActionExtensionActionParameters.title = localConfig.triggersAndActions.actions[extensionname][id].description
    // set the title of the calling dropdown
    document.getElementById("actionExtensionAction").title = localConfig.triggersAndActions.actions[extensionname][id].displaytitle
    document.getElementById("actionExtensionChoserChannel").value = localConfig.triggersAndActions.actions[extensionname][id].channel;
    document.getElementById("actionExtensionChoserActionName").value = localConfig.triggersAndActions.actions[extensionname][id].name;
    for (var key in params)
    {
        actionextensionparameters += "<input type='text' name='" + actionname + "_" + key + "' class='form-control' id='" + key + "' placeholder='" + key + "' value=''>"
    }
    ActionExtensionActionParameters.innerHTML = actionextensionparameters;

}
// ============================================================================
//                           FUNCTION: createTriggerAction
//                           called when form submitted
// ============================================================================
function createTriggerAction (e)
{
    let SingleEvent = {
        trigger:
        {
            name: document.getElementById("triggerExtensionChoserTriggerName").value,
            extension: document.getElementById("triggerExtensionChoser").value,
            channel: document.getElementById("triggerExtensionChoserChannel").value,
            type: $("#triggerExtensionTriggers option:selected").attr('data'),
            data: []

        },
        quailfier: {},
        action:
        {
            name: document.getElementById("actionExtensionChoserActionName").value,
            extension: document.getElementById("actionExtensionChoser").value,
            channel: document.getElementById("actionExtensionChoserChannel").value,
            type: $("#actionExtensionAction option:selected").attr('data'),
            data: []
        }

    }
    let fieldsAsArray = $(e).serializeArray();
    var fieldsAsObject = fieldsAsArray.reduce((obj, item) => (obj[item.name] = item.value, obj), {});

    //fieldsAsObject.forEach((entry) =>
    for (const entry in fieldsAsObject) 
    {
        if (entry.indexOf(SingleEvent.trigger.name + "_") == 0)
        {
            let varname = entry.replace(SingleEvent.trigger.name + "_", "");
            let tmpobj = {};
            tmpobj[varname] = fieldsAsObject[entry];
            SingleEvent.trigger.data.push(tmpobj);
        }
        if (entry.indexOf(SingleEvent.action.name + "_") == 0)
        {
            let varname = entry.replace(SingleEvent.action.name + "_", "");
            let tmpobj = {};
            tmpobj[varname] = fieldsAsObject[entry];
            SingleEvent.action.data.push(tmpobj);
        }
    }
    // add this action to the list
    if (checkTriggerIsValid(SingleEvent))
        serverConfig.AllTriggersAndActions.push(SingleEvent);

    SaveConfigToServer();
    PopulateTriggersTable();
    return false;

}
// ============================================================================
//                       FUNCTION: checkTriggerIsValid
//                  check we have the channels and extensions required
// ============================================================================
function checkTriggerIsValid (trigger)
{
    //check we have the extensions and the channels to listen to
    if (!Object.hasOwn(livePortalData.extensions, trigger.trigger.extension))
        alert("Couldn't find extension", trigger.trigger.extension)
    if (!Object.hasOwn(livePortalData.extensions, trigger.action.extension))
        alert("Couldn't find extension", trigger.action.extension)
    if (!livePortalData.channellist.includes(trigger.trigger.channel))
        alert("Couldn't find channel", trigger.trigger.channel)
    if (!livePortalData.channellist.includes(trigger.action.channel))
        alert("Couldn't find channel", trigger.action.channel)
    return true;
}
// ============================================================================
//                          FUNCTION: CheckTriggers
//          This will receive all channel mesage to check against triggers
// ============================================================================
function CheckTriggers (data)
{
    serverConfig.AllTriggersAndActions.forEach((entry) =>
    {

        if (data.dest_channel === entry.trigger.channel
            && data.from === entry.trigger.extension
            && data.type === entry.trigger.type
        )
        {
            // we have the correct extension, channel and message type
            // lets check the variables to see if those are a match

            entry.trigger.data.forEach((param) =>
            {
                for (var i in param)
                {
                    // we have amtched the trigger
                    if (param[i] === "" || data.data[i].toLowerCase() === param[i].toLowerCase())
                        TriggerAction(entry.action)
                }
            })
        }

    })
}
// ============================================================================
//                          FUNCTION: TriggerAction
//                          Triggers an action 
// ============================================================================
function TriggerAction (action)
{
    let params;
    for (var i in action.data)
    {
        params = { ...params, ...action.data[i] }
    }
    // all actions are handled through the SR socket interface
    sr_api.sendMessage(DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                action.type,
                serverConfig.extensionname,
                params,
                "",
                action.extension),
            "",
            action.extension
        ),
    );
}
// ============================================================================
//                          FUNCTION: TriggerAction
//                          Triggers an action 
// ============================================================================
function PopulateTriggersTable ()
{
    let table = document.getElementById("TriggersAndActionsTable")
    let TandAs = serverConfig.AllTriggersAndActions

    let tablerows = "<tbody>";
    // tablerows += "<div col-md-1'>"
    // tablerows += "<div placeholder='" + TandAs[i].trigger.extension + "'>" + TandAs[i].trigger.extension + "</div>"

    for (let i = 0; i < TandAs.length; i++) 
    {
        tablerows += "<tr>"
        tablerows += "<td scope='row'>" + i + "</td>"
        tablerows += "<td scope='row' role='button' onclick='delteTriggerAction(" + i + ")'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg ></td > "
        // TRIGGERS
        tablerows += "<td>" + TandAs[i].trigger.extension + "</td>"
        tablerows += "<td>" + TandAs[i].trigger.type + "</td>"
        tablerows += "<td>"
        let morethanoneentry = false
        for (let j = 0; j < TandAs[i].trigger.data.length; j++) 
        {
            if (morethanoneentry)
                tablerows += ", ";
            morethanoneentry = true;

            // we have amtched the trigger
            for (let item in TandAs[i].trigger.data[j])
                //tablerows += TandAs[i].trigger.data[j] + " "
                tablerows += item + " = " + TandAs[i].trigger.data[j][item];
        }
        tablerows += "</td>"

        // ACTIONS
        tablerows += "<td>" + TandAs[i].action.extension + "</td>"
        tablerows += "<td>" + TandAs[i].action.type + "</td>"
        tablerows += "<td>"
        morethanoneentry = false
        for (let j = 0; j < TandAs[i].action.data.length; j++) 
        {
            if (morethanoneentry)
                tablerows += ", ";
            morethanoneentry = true;
            // we have amtched the action
            for (let item in TandAs[i].action.data[j])
                //tablerows += TandAs[i].action.data[j] + " "
                tablerows += item + " = " + TandAs[i].action.data[j][item];
        }
        tablerows += "</td>"





        tablerows += "</tr >"




    }
    // tablerows += "</div>";
    tablerows += "</tbody>";
    table.innerHTML = tablerows
}

function delteTriggerAction (id)
{
    serverConfig.AllTriggersAndActions.splice(id, 1)
    SaveConfigToServer();
    PopulateTriggersTable();
}