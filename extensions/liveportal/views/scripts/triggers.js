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
sr_api, serverConfig, DataCenterSocket, localConfig, refreshDarkMode ,$, livePortalVolatileData, serverData, SaveDataToServer,updateMacroButtonsDisplay
*/

// ============================================================================
//                           FUNCTION: initTriggersAndActions
// ============================================================================
function initTriggersAndActions (extension_list)
{
    initMacroList()
    updateMacroList();
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
//                           received triggers/actions from extension
// ============================================================================
function receivedTrigger (triggers)
{
    localConfig.triggersAndActions.descriptions[triggers.extensionname] = triggers.description;
    if (triggers.triggers && triggers.triggers.length > 0)
        localConfig.triggersAndActions.triggers[triggers.extensionname] = triggers.triggers;
    if (triggers.actions && triggers.actions.length > 0)
    {
        localConfig.triggersAndActions.actions[triggers.extensionname] = triggers.actions;
        localConfig.triggersAndActions.actions[triggers.extensionname]["paused"] = false;
    }
    // update the page with the new triggeroptions
    PopulateGroupNamesDropdown();
    addTriggerEntries();
    addActionEntries();
    PopulateTriggersTable();
}

// ============================================================================
//                  FUNCTION: addTriggerEntries
//            Loads first dropdown to chose extension for trigger         
// ============================================================================
function addTriggerEntries ()
{
    // clear the existing page data
    let TriggersExtensionChoser = document.getElementById("triggerExtensionChoser")
    let triggerextensionnames = ""
    let triggers = localConfig.triggersAndActions.triggers;
    if (Object.keys(triggers).length > 0)
    {
        for (var key in triggers)
        {
            if (triggers[key].length > 0)
            {
                if (triggerextensionnames == "")
                {
                    triggerextensionnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + " selected>" + key + "</option>";
                    TriggersExtensionChoser.title = key
                }
                else
                    triggerextensionnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + ">" + key + "</option>";
            }
        }
        TriggersExtensionChoser.innerHTML = triggerextensionnames;
        triggersLoadTriggers(0)
        TriggersExtensionChoser.dispatchEvent(new Event('change'))
    }
}
// ============================================================================
// Webpage callback to load correct extension triggers
// ============================================================================

// ============================================================================
//                           FUNCTION: triggersLoadTriggers
//                      loads trigger names into the dropdown.
// ============================================================================
function triggersLoadTriggers (name)
{
    if (name === "")
        return;
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
        triggerextensionparameters += "<div class='d-flex form-row align-items-center'>"
        triggerextensionparameters += "<label class='form-label px-2 align-middle text-right col-md-6' for=" + triggername + "_" + key + ">" + key + "</label>"
        triggerextensionparameters += "<input type='text' class='form-control  col-md-6' name='" + triggername + "_" + key + "' id='" + triggername + "_" + key + "' placeholder='" + key + "' value=''>"
        // add the matcher dropdown to each variable name
        triggerextensionparameters += "<select id='triggerExtensionTriggerParametersMatcher_" + key + "' class='selectpicker btn btn-secondary' data-style='btn-danger' title = '' value='1' name='triggerExtensionTriggerParametersMatcher_" + key + "'>"
        triggerextensionparameters += "<div class='form-group'><option data='1' class='form-control' value='1'>Exact Match</option>";
        triggerextensionparameters += "<option data='Anywhere' class='form-control' value='2'>Anywhere</option>";
        triggerextensionparameters += "<option data='Start of line' class='form-control' value='3'>Start of line</option></div>";
        triggerextensionparameters += "</select>"

        triggerextensionparameters += "</div>"
    }
    TriggerExtensionTriggerParameters.innerHTML = triggerextensionparameters;

}

// ============================================================================
//                  FUNCTION: addActionEntries
//            Loads first dropdown to chose extension for action         
// ============================================================================
function addActionEntries ()
{
    // clear the existing page data
    //let Mainpage = document.getElementById("ActionPageContent");
    let ActionExtensionChoser = document.getElementById("actionExtensionChoser")
    // Mainpage.innerHTML = "<h1>Action and Alerts</h1><p>This page allows you to control the action for events 
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";
    let actionextensionnames = ""
    let action = localConfig.triggersAndActions.actions;
    if (Object.keys(action).length > 0)
    {
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
        if (key != "paused")
        {
            if (actionextensionaction == "")
            {
                actionextensionaction += "<div class='form-group'><option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "' selected>" + selectedAction[key].displaytitle + "</option></div>";
                ActionExtensionAction.title = selectedAction[key].description
            }
            else
                actionextensionaction += "<div class='form-group'><option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "'>" + selectedAction[key].displaytitle + "</option></div>";
        }
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
    // set the title of the calling dropdown
    document.getElementById("actionExtensionAction").title = localConfig.triggersAndActions.actions[extensionname][id].description
    document.getElementById("actionExtensionChoserChannel").value = localConfig.triggersAndActions.actions[extensionname][id].channel;
    document.getElementById("actionExtensionChoserActionName").value = localConfig.triggersAndActions.actions[extensionname][id].name;
    for (var key in params)
    {
        actionextensionparameters += "<div class='d-flex form-row align-items-center'>"
        actionextensionparameters += "<label class='form-label px-2 align-middle' for=" + actionname + "_" + key + ">" + key + "</label>"
        actionextensionparameters += "<input type='text' class='form-control' name='" + actionname + "_" + key + "' id='" + actionname + "_" + key + "' placeholder='" + key + "' value='' title='" + key + "'>"
        actionextensionparameters += "</div>"
    }
    ActionExtensionActionParameters.innerHTML = actionextensionparameters;

}
// ============================================================================
//                FUNCTION: PopulateGroupNamesDropdown
//                  populates the group dropdown
// ============================================================================
function PopulateGroupNamesDropdown ()
{
    // clear the existing page data
    let GroupChoser = document.getElementById("triggerExtensionGroupName")
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";
    let groupnames = ""
    for (var key in serverData.AllTriggersAndActions)
    {
        if (groupnames == "")
        {
            groupnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + " selected>" + key + "</option>";
            GroupChoser.title = key
        }
        else
            groupnames += "<option name='" + key + "' class='btn btn-secondary' value=" + key + ">" + key + "</option>";
    }
    GroupChoser.innerHTML = groupnames;
}
// end create trigger form

// ============================================================================
//                           FUNCTION: createTriggerAction
//                           called when form submitted
// ============================================================================
function createTriggerAction (e)
{
    let groupname = document.getElementById("triggerExtensionGroupName").value
    let extname = document.getElementById("triggerExtensionChoser").value
    let channel = document.getElementById("triggerExtensionChoserChannel").value
    //for macros we need to fudge a few items
    if (document.getElementById("triggerExtensionChoser").value == "MACROS")
    {
        groupname = "MACROS"
        extname = serverConfig.extensionname
        channel = serverConfig.channel
    }
    let SingleEvent = {
        trigger:
        {
            name: document.getElementById("triggerExtensionChoserTriggerName").value,
            extension: extname,
            channel: channel,
            type: $("#triggerExtensionTriggers option:selected").attr('data'),
            data: []

        },
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
            tmpobj["MATCHER_" + varname] = document.getElementById("triggerExtensionTriggerParametersMatcher_" + varname).value;
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
    if (checkTriggerIsValid(SingleEvent) && groupname != "")
    {
        if (!serverData.AllTriggersAndActions[groupname])
            alert("group doesn't exist", groupname)
        else
            serverData.AllTriggersAndActions[groupname].list.push(SingleEvent);
    }

    SaveDataToServer();
    PopulateTriggersTable();
    return false;
}

// ============================================================================
//                           FUNCTION: createMacro
//                         called from create macro button
// ============================================================================
function createMacro (e)
{
    let macroname = document.getElementById("macroName").value
    let macrodescription = document.getElementById("macroDescription").value
    let macrocolor = document.getElementById("macroColor").value
    if (macroname == "")
    {
        alert("Macro name empty")
        return false;
    }
    if (typeof (serverData.macros) == "undefined")
        serverData.macros = []
    for (let i = 0; i < serverData.macros.length; i++)
    {
        if (serverData.macros[i].name == macroname)
        {
            // was going to overwrite here but we really need an 'edit' function so you don't have to retype everything
            //const response = confirm("MacroName Exists, Overwrite?");
            //if (!response)
            //return false
            alert("Macro already exists")
            return false
        }
    }

    let SingleTrigger =
    {
        name: macroname,
        channel: serverConfig.channel,
        description: macrodescription,
        displaytitle: macroname,
        messagetype: "trigger_" + macroname,
        color: macrocolor
    }

    serverData.macros.push(SingleTrigger)
    sortByKey(serverData.macros, "name")
    updateMacroList();
    SaveDataToServer();
    //PopulateGroupNamesDropdown();
    addTriggerEntries();
    return false;
}

// ============================================================================
//                           FUNCTION: deleteMacro
//                       called from delete macro button
// ============================================================================
function deleteMacro (e)
{
    let macroname = document.getElementById("macroName").value
    let deleted = false
    for (let i = 0; i < serverData.macros.length; i++)
    {
        if (serverData.macros[i].name == macroname)
        {
            serverData.macros.splice(i)
            deleted = true
            sortByKey(serverData.macros, "name")
            SaveDataToServer()
            updateMacroList()
            addTriggerEntries()

        }
    }
    if (!deleted)
        alert("Macro doesn't exist")
    return false;
}
// ============================================================================
//                           FUNCTION: initMacroList
//         called on first load to create our vitual "Macro" extension
//         also adds any user defined macros created in the past
// ============================================================================
function initMacroList ()
{
    // check if the groups list is available (saves the user having to create it)
    if (typeof (serverData.AllTriggersAndActions["MACROS"]) == "undefined")
        addNewTriggerGroup("MACROS")

    // check if we have the triggers MACROS virtual'extension' as we need to fake this if not
    // as we don't get triggers sent from an extension
    if (typeof (localConfig.triggersAndActions.triggers["MACROS"]) == "undefined")
    {
        localConfig.triggersAndActions.triggers["MACROS"] = []
        localConfig.triggersAndActions.descriptions["MACROS"] = "Macro functions to be applied to buttons etc"
    }
    // load our saved macros into the list (as macros are virtual triggers based on a virtual extension called "MACROS" we need to add them somewhere)
    localConfig.triggersAndActions.triggers["MACROS"] = serverData.macros
}
// ============================================================================
//                           FUNCTION: updateMacroList
//                        used to update macros dropdown
// ============================================================================
function updateMacroList ()
{
    updateMacroButtonsDisplay()
}
// ============================================================================
//                       FUNCTION: checkTriggerIsValid
//                  check we have the channels and extensions required
// ============================================================================
function checkTriggerIsValid (trigger)
{
    //check we have the extensions and the channels to listen to
    if (!Object.hasOwn(livePortalVolatileData.extensions, trigger.trigger.extension))
        alert("Couldn't find extension", trigger.trigger.extension)
    if (!livePortalVolatileData.channellist.includes(trigger.trigger.channel))
        alert("Couldn't find channel", trigger.trigger.channel)
    if (!Object.hasOwn(livePortalVolatileData.extensions, trigger.action.extension))
        alert("Couldn't find extension", trigger.action.extension)
    if (!livePortalVolatileData.channellist.includes(trigger.action.channel))
        alert("Couldn't find channel", trigger.action.channel)
    return true;
}
// ============================================================================
//                          FUNCTION: CheckTriggers
//          This will receive all channel mesage to check against triggers
// ============================================================================
function CheckTriggers (event)
{
    //loop through our trigger groups
    for (var group in serverData.AllTriggersAndActions)
    {
        // loop through our saved triggers and actions
        serverData.AllTriggersAndActions[group].list.forEach((entry) =>
        {
            //check if the event fields match the trigger fields we have set for this entry
            if (event.dest_channel === entry.trigger.channel
                && event.from === entry.trigger.extension
                && event.type === entry.trigger.type
            )
            {
                // if parameters are entered we need to check that they all match
                // before we trigger the action (ie if one fails to match then we must ignore this trigger)
                // IE ALL CHECKS BELOW SHOULD BE FOR FAILURES TO MATCH
                let match = true
                // we have the correct extension, channel and message type
                // lets check the variables to see if those are a match
                entry.trigger.data.forEach((param) =>
                {
                    for (var i in param)
                    {
                        try
                        {
                            // don't check the MATCHER variables as these are used to determine how to perform the match (Start of line etc)
                            if (i.indexOf("MATCHER_") != 0)
                            {
                                // see if we have a MATCHER object (have to check in case someone has old software before we add this field)
                                let searchtype = param["MATCHER_" + i]
                                if (typeof event.data.parameters[i] == "string")// && typeof param[i] === "string")
                                {
                                    switch (searchtype)
                                    {
                                        case "2"://doesn't match anywhere
                                            if (param[i] != "" && event.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) == -1)
                                                match = false;
                                            break;
                                        case "3"://match start of line only
                                            if (param[i] != "" && event.data.parameters[i].toLowerCase().indexOf(param[i].toLowerCase()) != 0)
                                                match = false;
                                            break;
                                        default:
                                            // check for exact match
                                            if (param[i] != "" && event.data.parameters[i].toLowerCase() != param[i].toLowerCase())
                                                match = false;
                                    }
                                }
                                //check non string types for not matching
                                else if (param[i] != "" && event.data.parameters[i] != param[i])
                                    match = false;
                            }
                        }
                        catch (err)
                        {
                            console.log(event)
                            console.log("CheckTriggers error", err)
                            match = false;
                        }
                        if (!match)
                            break;
                    }

                })
                if (match)
                    TriggerAction(entry.action, event)
            }
        })
    }
}
// ============================================================================
//                          FUNCTION: TriggerAction
//                          Triggers an action 
// ============================================================================
function TriggerAction (action, triggerparams)
{
    if (action.paused)
        return
    // regular expression to test if input is a mathmatical equasion
    const re = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
    let params = {}
    // store the trigger params in the actrion in case the extension has use for them
    params.triggerparams = triggerparams.data
    // loop through each action field
    for (var i in action.data)
    {
        //loop through each action field name
        for (const property in action.data[i])
        {
            // store the undmodifed field data
            let tempAction = action.data[i][property]
            // *************************
            // check for user variables
            // *************************
            // check if we have %%var%% in the field
            let nextVarIndex = action.data[i][property].indexOf("%%")
            // loop through all %%vars%%
            while (nextVarIndex > -1)
            {
                let endVarIndex = tempAction.indexOf("%%", nextVarIndex + 2)
                // we have a user variable
                if (endVarIndex > -1)
                {
                    // get the full variable
                    let sourceVar = tempAction.substr(nextVarIndex + 2, endVarIndex - (nextVarIndex + 2))

                    // check if we have a word option
                    if (sourceVar.indexOf(":") > -1)
                    {
                        // get the position of the :
                        let stringIndex = sourceVar.indexOf(":")
                        // get the number the user entered after the : (minus one as non programmers don't count from 0 :P)
                        let wordNumber = (sourceVar.substr(stringIndex + 1)) - 1
                        // get the trigger field
                        let sourceData = triggerparams.data.parameters[tempAction.substr(nextVarIndex + 2, stringIndex)]
                        // split the data into an array so we can index the work the user wants
                        const sourceArray = sourceData.split(" ");
                        // replace the user vars with the data requested
                        tempAction = tempAction.replace("%%" + sourceVar + "%%", sourceArray[wordNumber])
                    }
                    else
                    {
                        tempAction = tempAction.replace("%%" + sourceVar + "%%", triggerparams.data.parameters[sourceVar])
                    }
                }
                if (typeof tempAction == "string")
                    nextVarIndex = tempAction.indexOf("%%", nextVarIndex + 2)
                else
                    nextVarIndex = -1;

            }
            // is this a mathmatical expression
            if (re.test(tempAction))
            {
                tempAction = eval(tempAction).toString()
            }
            params[property] = tempAction
        }
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
//                          FUNCTION: PopulateTriggersTable
//                          Triggers an action 
// ============================================================================
function PopulateTriggersTable ()
{
    let table = document.getElementById("TriggersAndActionsTable")
    table.innerHTML = "";
    let TandAs = serverData.AllTriggersAndActions
    let tablerows = ""
    for (let g in TandAs)
    {
        let group = serverData.AllTriggersAndActions[g]
        let list = group.list

        // group name and trigger-action count
        tablerows += "<div><span class='fs-4'>Group(" + list.length + "): " + g + " </span>"
        // delete group button
        tablerows += " <a class='btn btn-secondary' href='javascript:DeleteTriggerGroup(\"" + g + "\");'role = 'button' style='padding:0px' title='Delete Group'>"
        tablerows += "<img src='/liveportal/images/trash.png' width='40px' /></a>"

        // play button
        tablerows += " <a class='btn btn-secondary' href='javascript:unPauseGroupButton(\"" + g + "\");'role = 'button' style='padding:0px' title='Unpause group'>"
        tablerows += "<img src='/liveportal/images/play.png' width='40px' /></a>"
        // pause button
        tablerows += " <a class='btn btn-secondary' href='javascript:pauseGroupButton(\"" + g + "\");'role = 'button' style='padding:0px' title='Pause group'>"
        tablerows += "<img src='/liveportal/images/pause.png' width='40px' /></a>"

        // show hide button
        tablerows += " <a class='btn btn-secondary' href='javascript:ShowHideTriggerGroup(\"" + g + "\");' role = 'button' style='padding:0px' title='Show/Hide Group'>"
        if (group.show)
            tablerows += "<img src='/liveportal/images/hide.png' width='40px' /></a>"
        else
            tablerows += "<img src='/liveportal/images/show.png' width='40px' /></a>";

        // group table
        if (group.show)
            tablerows += "</div><tbody id='" + g + "_TriggerGroupDisplay'style='display: block;'>";
        else
            tablerows += "</div><tbody id='" + g + "_TriggerGroupDisplay'style='display: none;'>";

        // table data
        for (let i = 0; i < list.length; i++) 
        {
            tablerows += "<tr>"
            tablerows += "<td scope='row'>" + i + "</td>"
            tablerows += "<td scope='row' role='button' onclick='delteTriggerAction(\"" + g + "\"," + i + ")'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg ></td > "
            // TRIGGERS
            tablerows += "<td>" + list[i].trigger.extension + "</td>"
            tablerows += "<td>" + list[i].trigger.type.replace("trigger_", "").replace("_get", "") + "</td>"
            tablerows += "<td>"
            let morethanoneentry = false
            for (let j = 0; j < list[i].trigger.data.length; j++) 
            {
                if (morethanoneentry)
                    tablerows += ", ";
                morethanoneentry = true;

                for (let item in list[i].trigger.data[j])
                {
                    let symbol = ""

                    if (item.indexOf("MATCHER_") != 0)
                    {
                        //don't show the matcher fields on screen
                        let searchtype = 1;
                        //get the matcher object if there is one
                        let temp = list[i].trigger.data.find((o) => typeof (o["MATCHER_" + item]) != "undefined")
                        // if we have a matcher object get the value so we can change the symbol on screen (=/^/* for exact, startswith, anywhere)
                        if (temp)
                            searchtype = temp["MATCHER_" + item]
                        switch (searchtype)
                        {
                            case "1":
                                symbol = "="
                                break;
                            case "2":
                                symbol = "*"
                                break;
                            case "3":
                                symbol = "^"
                                break;
                            default:
                                symbol = "="
                        }
                        tablerows += item + " " + symbol + " " + list[i].trigger.data[j][item];
                    }
                }
            }
            tablerows += "</td>"

            // ACTIONS
            tablerows += "<td>" + list[i].action.extension + "</td>"
            tablerows += "<td>" + list[i].action.type.replace("action_", "") + "</td>"
            tablerows += "<td>"
            morethanoneentry = false
            for (let j = 0; j < list[i].action.data.length; j++) 
            {
                if (morethanoneentry)
                    tablerows += ", ";
                morethanoneentry = true;
                // we have amtched the action
                for (let item in list[i].action.data[j])
                    tablerows += item + " = " + list[i].action.data[j][item];
            }
            tablerows += "</td>"
            if (serverData.AllTriggersAndActions[g].list[i].action.paused)
            {
                // play button
                tablerows += "<td><a class='btn btn-secondary' href='javascript:pauseActionButton(\"" + g + "\"," + i + ");'role = 'button' style='padding:0px' title='Unpause action'>"
                tablerows += "<img src='/liveportal/images/play.png' width='30px' /></a></td>"
            }
            else
            {
                // pause button
                tablerows += "<td><a class='btn btn-secondary' href='javascript:pauseActionButton(\"" + g + "\"," + i + ");'role = 'button' style='padding:0px' title='Pause action'>"
                tablerows += "<img src='/liveportal/images/pause.png' width='30px' /></a></td>"
            }

            tablerows += "<td><a class='btn btn-secondary' href='javascript:triggerActionButton(\"" + g + "\"," + i + ");'role = 'button' style='padding:0px' title='Run action'>"
            tablerows += "<img src='/liveportal/images/run.png' width='30px' /></a></td>"

            tablerows += "</tr >"
        }
        // tablerows += "</div>";
        tablerows += "</tbody>";
    }
    // new group option
    tablerows += "<form><div class='form-group d-flex py-2'><div class='col-xs-1'>"
    tablerows += "New Group name :<input type='text' id='triggergroupcreatename' style='width: 200px;' onkeypress='return /[0-9a-zA-Z]/i.test(event.key)'></div>"
    tablerows += "<a class='btn btn-success' href = 'javascript:createNewTriggerGroup();' role = 'button'> Create</a></form>"
    table.innerHTML = tablerows
    PopulateGroupNamesDropdown();
}

// ============================================================================
//                          FUNCTION: ShowHideTriggerGroup
//                          callback for show/hide button
// ============================================================================
function ShowHideTriggerGroup (name)
{
    let group = document.getElementById(name + "_TriggerGroupDisplay")
    serverData.AllTriggersAndActions[name].show = !serverData.AllTriggersAndActions[name].show;
    if (serverData.AllTriggersAndActions[name].show)
        group.style.display = "block"
    else
        group.style.display = "none"
    SaveDataToServer()
    PopulateTriggersTable()
}
// ============================================================================
//                          FUNCTION: DeleteTriggerGroup
//                          callback for show/hide button
// ============================================================================
function DeleteTriggerGroup (name)
{
    if (serverData.AllTriggersAndActions[name])
    {
        if (serverData.AllTriggersAndActions[name].list.length > 0)
            alert("Group: not empty")
        else
            delete serverData.AllTriggersAndActions[name]
    }
    else
        alert("can't find group")
    PopulateTriggersTable()
    PopulateGroupNamesDropdown();
    SaveDataToServer()
}
// ============================================================================
//                          FUNCTION: createNewTriggerGroup
//                          Create new trigger group
// ============================================================================
function createNewTriggerGroup ()
{
    addNewTriggerGroup(document.getElementById("triggergroupcreatename").value)
}
// ============================================================================
//                          FUNCTION: addNewTriggerGroup
//                          Create new trigger group
// ============================================================================
function addNewTriggerGroup (groupname)
{
    serverData.AllTriggersAndActions[groupname] = { show: true, list: [] }
    SaveDataToServer()
    PopulateTriggersTable()
    PopulateGroupNamesDropdown()
}

// ============================================================================
//                          FUNCTION: delteTriggerAction
//                          delete a trigger entry
// ============================================================================
function delteTriggerAction (group, id)
{
    serverData.AllTriggersAndActions[group].list.splice(id, 1)
    SaveDataToServer();
    PopulateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseActionButton
//              button to pause a trigger-action
// ============================================================================
function pauseActionButton (group, id)
{
    serverData.AllTriggersAndActions[group].list[id].action.paused = !(serverData.AllTriggersAndActions[group].list[id].action.paused)
    SaveDataToServer()
    PopulateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseGroupButton
//              button to pause all trigger-actions in a group
// ============================================================================
function pauseGroupButton (group)
{
    serverData.AllTriggersAndActions[group].list.forEach(element =>
    {
        element.action.paused = true;
    });

    SaveDataToServer()
    PopulateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseGroupButton
//              button to pause all trigger-actions in a group
// ============================================================================
function unPauseGroupButton (group)
{
    serverData.AllTriggersAndActions[group].list.forEach(element =>
    {
        element.action.paused = false;
    });

    SaveDataToServer()
    PopulateTriggersTable();
}
// ============================================================================
//                     FUNCTION: triggerActionButton
//              button on the page for users to test the actions
// ============================================================================
function triggerActionButton (group, id)
{
    let action = serverData.AllTriggersAndActions[group].list[id].action
    //let params = { ...action.data }
    let params = {}
    for (var i in action.data)
    {
        for (const property in action.data[i])
            params[property] = action.data[i][property]
    }
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
//                     FUNCTION: sortByKey
//              sorts an array of objects based on a key
// ============================================================================
function sortByKey (array, key)
{
    return array.sort(function (a, b)
    {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}