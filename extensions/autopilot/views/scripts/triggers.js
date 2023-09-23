// es-lint globals to stop red highlights
/*
global 
SaveConfigToServer
sr_api, serverConfig, localConfig, refreshDarkMode ,$, livePortalVolatileData, serverData, SaveDataToServer,updateMacroButtonsDisplay
*/
// data from extensions
let fulltriggerslist = {
    triggers: [],
    actions: [],
}
let extensionlist = []

// our data, ie saved trigger pairings etc
let usertriggerslist = {
    pairings: [], // the trigger action pairs set
    macrotriggers: [], // user defined macros
    groups: [{ name: "Default" }] //user defined groups
}

// this will hold macros we create as for our dummy triggers
let triggersandactions =
{
    triggers: [],
    actions: []
}
//helper functions 
//count number of times something appears in an array
const itemCounter = (value, field, index) =>
{
    return value.filter((x) => x[field] == index).length;
};

// ============================================================================
//                           FUNCTION: initTriggersAndActions
// ============================================================================
function initTriggersAndActions (extension_list)
{
    // get some defaults from local storage (if set)
    if (!localStorage.getItem("selectedgroup"))
        localStorage.setItem("selectedgroup", usertriggerslist.groups[0].name)

    // request triggers and actions from all the current extenssions we have
    extension_list.forEach(ext =>
    {
        sr_api.sendMessage(
            localConfig.DataCenterSocket,
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
    })
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "RequestUserTriggers",
                serverConfig.extensionname,
                "",
                "",
                "autopilot"
            ),
            "",
            "autopilot"
        ));


}
// ============================================================================
//                           FUNCTION: receivedTrigger
//                           received triggers/actions from extension
// ============================================================================
function receivedTrigger (extensiontriggers)
{
    if (extensionlist[extensiontriggers.extensionname] == undefined)
    {
        extensionlist[extensiontriggers.extensionname] =
        {
            channel: extensiontriggers.channel,
            description: extensiontriggers.description
        }
    }
    if (extensiontriggers.triggers && extensiontriggers.triggers.length > 0)
        fulltriggerslist.triggers[extensiontriggers.extensionname] = extensiontriggers.triggers
    if (extensiontriggers.actions && extensiontriggers.actions.length > 0)
        fulltriggerslist.actions[extensiontriggers.extensionname] = extensiontriggers.actions

    // update the page with the new triggeroptions
    populateGroupNamesDropdown();
    addTriggerEntries();
    addActionEntries();
    populateTriggersTable();
    populateMacroDisplay()
}

// ============================================================================
//                  FUNCTION: addTriggerEntries
//            Loads first dropdown to chose extension for trigger         
// ============================================================================
function addTriggerEntries ()
{
    let TriggersExtensionChoser = document.getElementById("triggerExtensionChoser")
    let triggerextensionnames = ""
    let triggers = fulltriggerslist.triggers;
    if (Object.keys(triggers).length > 0)
    {
        for (var trigger in triggers)
        {
            if (triggerextensionnames == "")
            {
                triggerextensionnames += "<option name='" + trigger + "' class='btn btn-secondary' value=" + trigger + " selected>" + trigger + "</option>";
                TriggersExtensionChoser.title = trigger
            }
            else
                triggerextensionnames += "<option name='" + trigger + "' class='btn btn-secondary' value=" + trigger + ">" + trigger + "</option>";

        }

        TriggersExtensionChoser.innerHTML = triggerextensionnames;

        // check if we have stored a trigger extension name previously (adds memory to selected options for user)
        let extensionname = localStorage.getItem("selectedtriggerextension")
        if (extensionname)
        {
            triggersLoadTriggers(extensionname)// just load the first one to start with
            TriggersExtensionChoser.value = extensionname
        }
        else
            triggersLoadTriggers(fulltriggerslist.triggers[0])// just load the first one to start with

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
    if (!Object.keys(extensionlist).includes(name))
    {
        if (extensionlist.length > 0)
            name = Object.keys(extensionlist)[0]
        else
            return
    }
    // store the value so we remember it next time the usr loads the page
    localStorage.setItem("selectedtriggerextension", name)

    let TriggerExtensionTriggers = document.getElementById("triggerExtensionTriggers")
    let selectedTrigger = fulltriggerslist.triggers[name]
    let triggerextensiontriggers = ""
    // set the title of the calling dropdown

    document.getElementById("triggerExtensionChoserLabel").innerHTML = extensionlist[name].description;
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
    // check we have triggers for this extension (macros might not have any by default)
    if (fulltriggerslist.triggers[extensionname] != undefined)
    {
        let params = fulltriggerslist.triggers[extensionname][id].parameters
        let triggername = fulltriggerslist.triggers[extensionname][id].name;
        let triggerextensionparameters = ""
        TriggerExtensionTriggerParameters.title = fulltriggerslist.triggers[extensionname][id].description
        // set the title of the calling dropdown
        document.getElementById("triggerExtensionTriggers").title = fulltriggerslist.triggers[extensionname][id].description
        document.getElementById("triggerExtensionChoserChannel").value = extensionlist[extensionname].channel;
        document.getElementById("triggerExtensionChoserTriggerName").value = fulltriggerslist.triggers[extensionname][id].name;
        for (var key in params)
        {
            // Row
            triggerextensionparameters += "<div class='row'>"
            // Variable name text
            triggerextensionparameters += "<div class='col-2'>"
            triggerextensionparameters += "<div class='d-flex form-row align-items-center'>"
            triggerextensionparameters += "<label class='form-label px-2 align-middle text-right' for=" + triggername + "_" + key + ">" + key + "</label>"
            triggerextensionparameters += "</div>"
            // variable data to match text box
            triggerextensionparameters += "</div>"
            triggerextensionparameters += "<div class='col-8'>"
            triggerextensionparameters += "<input type='text' class='form-control' name='" + triggername + "_" + key + "' id='" + triggername + "_" + key + "' placeholder='" + key + "' value=''>"
            triggerextensionparameters += "</div>"
            triggerextensionparameters += "<div class='col-2'>"
            // add the matcher dropdown to each variable name
            triggerextensionparameters += "<select id='triggerExtensionTriggerParametersMatcher_" + key + "' class='selectpicker btn btn-secondary' data-style='btn-danger' title = '' value='1' name='triggerExtensionTriggerParametersMatcher_" + key + "'>"
            triggerextensionparameters += "<div class='form-group'><option data='1' class='form-control' value='1'>Exact Match</option>";
            triggerextensionparameters += "<option data='Anywhere' class='form-control' value='2'>Anywhere</option>";
            triggerextensionparameters += "<option data='Start of line' class='form-control' value='3'>Start of line</option></div>";
            triggerextensionparameters += "</select>"
            triggerextensionparameters += "</div>"
            triggerextensionparameters += "<div class='w-100'></div>"
            triggerextensionparameters += "</div>"
        }
        // cooldown timer
        triggerextensionparameters += "<div class='row'>"
        triggerextensionparameters += "<div class='col-2'>"
        triggerextensionparameters += "<div class='d-flex form-row align-items-center'>"
        triggerextensionparameters += "<label class='form-label px-2 align-middle text-right' for=" + triggername + "_cooldown>cooldown</label>"
        triggerextensionparameters += "</div>"
        triggerextensionparameters += "</div>"
        triggerextensionparameters += "<div class='col-10'>"
        triggerextensionparameters += "<input type='text' class='form-control' name='" + triggername + "_cooldown' id='" + triggername + "__cooldown' placeholder='cooldown' value='0'>"
        triggerextensionparameters += "</div>"

        TriggerExtensionTriggerParameters.innerHTML = triggerextensionparameters;
    }
}

// ============================================================================
//                  FUNCTION: addActionEntries
//            Loads first dropdown to chose extension for action         
// ============================================================================
function addActionEntries ()
{
    let ActionExtensionChoser = document.getElementById("actionExtensionChoser")
    let actionextensionnames = ""
    let actions = fulltriggerslist.actions;
    if (Object.keys(actions).length > 0)
    {
        for (var action in actions)
        {
            if (actionextensionnames == "")
            {
                actionextensionnames += "<option name='" + action + "' class=' btn btn-secondary ' value=" + action + " selected>" + action + "</option>";
                ActionExtensionChoser.title = action
            }
            else
                actionextensionnames += "<option name='" + action + "' class=' btn btn-secondary ' value=" + action + ">" + action + "</option>";
        }
        ActionExtensionChoser.innerHTML = actionextensionnames;

        // check if we have stored a action extension name previously (adds memory to selected options for user)
        let extensionname = localStorage.getItem("selectedactionextension")
        if (extensionname)
        {
            actionLoadAction(extensionname)
            ActionExtensionChoser.value = extensionname
        }
        else
            actionLoadAction(fulltriggerslist.actions[0])// just load the first one to start with


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
    if (!Object.keys(extensionlist).includes(name))
    {
        if (extensionlist.length > 0)
            name = Object.keys(extensionlist)[0]
        else
            return
    }

    // store the value so we remember it next time the usr loads the page
    localStorage.setItem("selectedactionextension", name)

    let ActionExtensionAction = document.getElementById("actionExtensionAction")
    let selectedAction = fulltriggerslist.actions[name]
    let actionextensionaction = ""

    document.getElementById("actionExtensionChoserLabel").innerHTML = name
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
    let params = fulltriggerslist.actions[extensionname][id].parameters
    let actionname = fulltriggerslist.actions[extensionname][id].name;
    let actionextensionparameters = ""
    // set the title of the calling dropdown
    document.getElementById("actionExtensionAction").title = fulltriggerslist.actions[extensionname][id].description
    document.getElementById("actionExtensionChoserChannel").value = extensionlist[extensionname].channel;
    document.getElementById("actionExtensionChoserActionName").value = fulltriggerslist.actions[extensionname][id].name;
    for (var key in params)
    {
        actionextensionparameters += "<div class='row'>"
        actionextensionparameters += "<div class='col-2'>"
        actionextensionparameters += "<div class='d-flex form-row align-items-center'>"
        actionextensionparameters += "<label class='form-label px-2 align-middle' for=" + actionname + "_" + key + ">" + key + "</label>"
        actionextensionparameters += "</div>"
        actionextensionparameters += "</div>"
        actionextensionparameters += "<div class='col-10'>"
        actionextensionparameters += "<input type='text' class='form-control' name='" + actionname + "_" + key + "' id='" + actionname + "_" + key + "' placeholder='" + key + "' value='' title='" + key + "'>"
        actionextensionparameters += "</div>"
        actionextensionparameters += "</div>"
    }
    ActionExtensionActionParameters.innerHTML = actionextensionparameters;

}
// ============================================================================
//                FUNCTION: populateGroupNamesDropdown
//                  populates the group dropdown
// ============================================================================
function populateGroupNamesDropdown ()
{
    let GroupChoser = document.getElementById("triggerExtensionGroupName")
    // that happen within StreamRoller. Ie you may want to post a chat message when someone donates, or change the hue lights or obs scene depending on chats mood etc.";
    let groupnames = ""
    let selected = ""
    for (let i = 0; i < usertriggerslist.groups.length; i++)
    {
        if (usertriggerslist.groups[i].name == localStorage.getItem("selectedgroup") || groupnames == "")
        {
            selected = " selected"
            GroupChoser.title = usertriggerslist.groups[i].name
        }
        else
            selected = ""
        groupnames += "<option name='" + usertriggerslist.groups[i].name + "' class='btn btn-secondary' value=" + usertriggerslist.groups[i].name + selected + ">" + usertriggerslist.groups[i].name + "</option>";
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

    localStorage.setItem("selectedgroup", groupname)
    let SingleEvent = {
        group: groupname,
        trigger:
        {
            name: document.getElementById("triggerExtensionChoserTriggerName").value,
            extension: extname,
            channel: channel,
            messagetype: $("#triggerExtensionTriggers option:selected").attr('data'),
            data: []

        },
        action:
        {
            name: document.getElementById("actionExtensionChoserActionName").value,
            extension: document.getElementById("actionExtensionChoser").value,
            channel: document.getElementById("actionExtensionChoserChannel").value,
            messagetype: $("#actionExtensionAction option:selected").attr('data'),
            data: []
        }
    }
    let fieldsAsArray = $(e).serializeArray();
    var fieldsAsObject = fieldsAsArray.reduce((obj, item) => (obj[item.name] = item.value, obj), {});

    for (const entry in fieldsAsObject) 
    {
        // entries will be the trigger/action name + "_" variable name
        if (entry.indexOf(SingleEvent.trigger.name + "_") == 0)
        {
            let varname = entry.replace(SingleEvent.trigger.name + "_", "");
            let tmpobj = {};
            // store the matcher if we have one
            if (document.getElementById("triggerExtensionTriggerParametersMatcher_" + varname) != null)
                tmpobj["MATCHER_" + varname] = document.getElementById("triggerExtensionTriggerParametersMatcher_" + varname).value;

            // we store the cd in the trigger area not the data area
            if (varname == "cooldown")
                SingleEvent.trigger.cooldown = fieldsAsObject[entry]
            else
            {
                tmpobj[varname] = fieldsAsObject[entry];
                SingleEvent.trigger.data.push(tmpobj);
            }
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
        if (usertriggerslist.groups.find(x => x.name == groupname) == undefined)
            alert("group doesn't exist", groupname)
        else
            usertriggerslist.pairings.push(SingleEvent)
        //serverData.AllTriggersAndActions[groupname].list.push(SingleEvent);
    }
    updateServerPairingsList()
    populateTriggersTable();
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
    let macrobackgroundcolor = document.getElementById("macroBackgroundColor").value
    let image = document.getElementById("macroimagename").value
    if (macroname == "")
    {
        alert("Macro name empty")
        return false;
    }

    for (let i = 0; i < triggersandactions.triggers.length; i++)
    {
        if (triggersandactions.triggers[i].name == macroname)
        {
            alert("Triggername already already exists")
            return false
        }
    }

    let SingleTrigger =
    {
        name: macroname,
        description: macrodescription,
        displaytitle: macroname,
        extensionname: "autopilot",
        messagetype: "trigger_" + macroname,
        color: macrocolor,
        backgroundcolor: macrobackgroundcolor,
        image: image
    }

    // add these to the our triggers list so we can 
    // display them and send them to ourselves ;)
    triggersandactions.triggers.push(SingleTrigger)
    sortByKey(triggersandactions.triggers, "name")

    // keep a copy of these in our user triggers so we 
    // can load them next time.
    usertriggerslist.macrotriggers = triggersandactions

    //mimic the triggers being sent to us
    receivedTrigger(triggersandactions);
    updateServerPairingsList();
    populateMacroDisplay()

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
    // delete from the currently loaded extension triggers
    for (let i = 0; i < fulltriggerslist.triggers.macros.length; i++)
    {
        if (fulltriggerslist.triggers.macros[i].name == macroname)
        {
            fulltriggerslist.triggers.macros.splice(i, 1)
            deleted = true
            sortByKey(fulltriggerslist.triggers, "name")
            break;
        }
    }
    // delete from our user defined triggers
    for (let i = 0; i < usertriggerslist.macrotriggers.triggers.length; i++)
    {
        if (usertriggerslist.macrotriggers.triggers[i].name == macroname)
        {
            usertriggerslist.macrotriggers.triggers.splice(i, 1)
            deleted = true
            sortByKey(usertriggerslist.macrotriggers.triggers, "name")
            break;
        }
    }
    if (deleted)
    {
        updateServerPairingsList()
        addTriggerEntries()
        populateMacroDisplay()
    }

    return false;
}
function populateMacroDisplay ()
{
    if (usertriggerslist.macrotriggers == undefined)
        return;
    let element = document.getElementById("existing_macro_list")
    let tempstring = ""
    for (let i = 0; i < usertriggerslist.macrotriggers.triggers.length; i++)
    {
        let color = "style='color:#999999'"
        let backgroundcolor = "#222255"
        if (typeof (usertriggerslist.macrotriggers.triggers[i].color) != "undefined" && usertriggerslist.macrotriggers.triggers[i].color != "")
            color = usertriggerslist.macrotriggers.triggers[i].color
        if (typeof (usertriggerslist.macrotriggers.triggers[i].backgroundcolor) != "undefined" && usertriggerslist.macrotriggers.triggers[i].backgroundcolor != "")
            backgroundcolor = usertriggerslist.macrotriggers.triggers[i].backgroundcolor
        if (typeof (usertriggerslist.macrotriggers.triggers[i].image) != "undefined" && usertriggerslist.macrotriggers.triggers[i].image != "")
        {
            tempstring += "<button class='btn btn-default deckicon mx-1 my-1' style='background:url(\"/autopilot/images/deckicons/" + usertriggerslist.macrotriggers.triggers[i].image + "\"') title='" + usertriggerslist.macrotriggers.triggers[i].name + "'></button>"
        }
        else
        {
            tempstring += "<div class='col-2 btn btn-outline-secondary mx-1 my-1 nodeckicon' style='color:#" + color + "; background-color:#" + backgroundcolor + ";' title='" + usertriggerslist.macrotriggers.triggers[i].name + "'>" + usertriggerslist.macrotriggers.triggers[i].name + "</div>"
        }
    }
    element.innerHTML = tempstring
}
// ============================================================================
//                       FUNCTION: checkTriggerIsValid
//                  check we have the channels and extensions required
// ============================================================================
function checkTriggerIsValid (trigger)
{
    //check we have the extensions and the channels to listen to
    //probably need to update these but not sure what to put here yet :P
    /*if (!Object.hasOwn(livePortalVolatileData.extensions, trigger.trigger.extension))
        alert("Couldn't find extension", trigger.trigger.extension)
    if (!livePortalVolatileData.channellist.includes(trigger.trigger.channel))
        alert("Couldn't find channel", trigger.trigger.channel)
    if (!Object.hasOwn(livePortalVolatileData.extensions, trigger.action.extension))
        alert("Couldn't find extension", trigger.action.extension)
    if (!livePortalVolatileData.channellist.includes(trigger.action.channel))
        alert("Couldn't find channel", trigger.action.channel)*/
    return true;
}
// ============================================================================
//                       FUNCTION: populateTriggersTable
//                  Shows the current tirgger pairings on screen 
// ============================================================================
function populateTriggersTable ()
{
    let table = document.getElementById("TriggersAndActionsTable")
    table.innerHTML = "";
    let tablerows = ""
    for (let g in usertriggerslist.groups)
    {
        let group = usertriggerslist.groups[g].name
        // group name and trigger-action count
        tablerows += "<div><span class='fs-4'>Group(" + itemCounter(usertriggerslist.pairings, "group", group) + "): " + group + " </span>"
        // delete group button
        tablerows += " <a class='btn btn-secondary' href='javascript:DeleteTriggerGroup(\"" + group + "\");'role = 'button' style='padding:0px' title='Delete Group'>"
        tablerows += "<img src='/liveportal/images/trash.png' width='40px' /></a>"

        // play button
        tablerows += " <a class='btn btn-secondary' href='javascript:unPauseGroupButton(\"" + group + "\");'role = 'button' style='padding:0px' title='Unpause group'>"
        tablerows += "<img src='/liveportal/images/play.png' width='40px' /></a>"
        // pause button
        tablerows += " <a class='btn btn-secondary' href='javascript:pauseGroupButton(\"" + group + "\");'role = 'button' style='padding:0px' title='Pause group'>"
        tablerows += "<img src='/liveportal/images/pause.png' width='40px' /></a>"

        // show hide button
        tablerows += " <a class='btn btn-secondary' href='javascript:ShowHideTriggerGroup(\"" + group + "\");' role = 'button' style='padding:0px' title='Show/Hide Group'>"
        if (localStorage.getItem(group + "visible") == "false")
            tablerows += "<img src='/liveportal/images/show.png' width='40px' /></a>";
        else
            tablerows += "<img src='/liveportal/images/hide.png' width='40px' /></a>"


        // group table
        if (localStorage.getItem(group + "visible") == "false")
            tablerows += "</div><tbody id='" + group + "_TriggerGroupDisplay'style='display: none;'>";
        else
            tablerows += "</div><tbody id='" + group + "_TriggerGroupDisplay'style='display: block;'>";


        // table data
        for (let i = 0; i < usertriggerslist.pairings.length; i++) 
        {
            if (usertriggerslist.pairings[i].group == group)
            {
                if (usertriggerslist.pairings[i].action.paused)
                    tablerows += "<tr style='color: #ffffff6b;'>"
                else
                    tablerows += "<tr>"
                tablerows += "<td scope='row'>" + i + "</td>"
                tablerows += "<td scope='row' role='button' onclick='delteTriggerAction(\"" + group + "\"," + i + ")'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg ></td > "
                // TRIGGERS
                tablerows += "<td>" + usertriggerslist.pairings[i].trigger.extension + "</td>"
                tablerows += "<td>" + usertriggerslist.pairings[i].trigger.messagetype.replace("trigger_", "").replace("_get", "") + "</td>"
                tablerows += "<td>"
                let morethanoneentry = false
                for (let j = 0; j < usertriggerslist.pairings[i].trigger.data.length; j++) 
                {
                    if (morethanoneentry)
                        tablerows += ", ";
                    morethanoneentry = true;

                    for (let item in usertriggerslist.pairings[i].trigger.data[j])
                    {
                        let symbol = ""

                        if (item.indexOf("MATCHER_") != 0)
                        {
                            //don't show the matcher fields on screen
                            let searchtype = 1;
                            //get the matcher object if there is one
                            let temp = usertriggerslist.pairings[i].trigger.data.find((o) => typeof (o["MATCHER_" + item]) != "undefined")
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
                            tablerows += item + " " + symbol + " " + usertriggerslist.pairings[i].trigger.data[j][item];
                        }
                    }
                }
                tablerows += "</td>"

                // ACTIONS
                tablerows += "<td>" + usertriggerslist.pairings[i].action.extension + "</td>"
                tablerows += "<td>" + usertriggerslist.pairings[i].action.messagetype.replace("action_", "") + "</td>"
                tablerows += "<td>"
                morethanoneentry = false
                for (let j = 0; j < usertriggerslist.pairings[i].action.data.length; j++) 
                {
                    if (morethanoneentry)
                        tablerows += ", ";
                    morethanoneentry = true;
                    // we have amtched the action
                    for (let item in usertriggerslist.pairings[i].action.data[j])
                        tablerows += item + " = " + usertriggerslist.pairings[i].action.data[j][item];
                }
                tablerows += "</td>"
                if (usertriggerslist.pairings[i].action.paused)
                {
                    // play button
                    tablerows += "<td><a class='btn btn-secondary' href='javascript:pauseActionButton(" + i + ");'role = 'button' style='padding:0px' title='Unpause action'>"
                    tablerows += "<img src='/liveportal/images/play.png' width='30px' /></a></td>"
                }
                else
                {
                    // pause button
                    tablerows += "<td><a class='btn btn-secondary' href='javascript:pauseActionButton(" + i + ");'role = 'button' style='padding:0px' title='Pause action'>"
                    tablerows += "<img src='/liveportal/images/pause.png' width='30px' /></a></td>"
                }

                tablerows += "<td><a class='btn btn-secondary' href='javascript:triggerActionButton(\"" + group + "\"," + i + ");'role = 'button' style='padding:0px' title='Run action'>"
                tablerows += "<img src='/liveportal/images/run.png' width='30px' /></a></td>"

                tablerows += "</tr >"
            }
        }
        // tablerows += "</div>";
        tablerows += "</tbody>";
    }

    table.innerHTML = tablerows
    populateGroupNamesDropdown();
}

// ============================================================================
//                          FUNCTION: ShowHideTriggerGroup
//                          callback for show/hide button
// ============================================================================
function ShowHideTriggerGroup (name)
{
    let group = document.getElementById(name + "_TriggerGroupDisplay")
    let visible = localStorage.getItem(name + "visible")
    if (visible == "false")
    {
        localStorage.setItem(name + "visible", "true")
        group.style.display = "none"
    }
    else
    {
        localStorage.setItem(name + "visible", "false")
        group.style.display = "block"
    }

    populateTriggersTable()
}
// ============================================================================
//                          FUNCTION: DeleteTriggerGroup
//                          callback for show/hide button
// ============================================================================
function DeleteTriggerGroup (name)
{

    if (usertriggerslist.groups.find(x => x.name == name) != undefined)
    {
        if (typeof (usertriggerslist.pairings.find(item => item.group === "Default")) != "undefined")
            alert("Group: not empty")
        else if (name == "Default")
            alert("Can't delete the default group")
        else
        {
            for (let i = 0; i < usertriggerslist.groups.length; i++)
            {
                if (usertriggerslist.groups[i].name === name)
                {
                    usertriggerslist.groups.splice(i, 1)
                    break;
                }
            }

        }
    }
    else
        alert("can't find group")
    populateTriggersTable()
    populateGroupNamesDropdown();
    updateServerPairingsList()
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
    if (usertriggerslist.groups.find(x => x.name == groupname) == undefined)
        usertriggerslist.groups.push({ name: groupname, show: true })
    updateServerPairingsList()
    populateTriggersTable()
    populateGroupNamesDropdown()
}

// ============================================================================
//                          FUNCTION: delteTriggerAction
//                          delete a trigger entry
// ============================================================================
function delteTriggerAction (group, id)
{
    if (usertriggerslist.pairings[id].group == group)
        usertriggerslist.pairings.splice(id, 1)
    updateServerPairingsList();
    populateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseActionButton
//              button to pause a trigger-action
// ============================================================================
function pauseActionButton (id)
{
    usertriggerslist.pairings[id].action.paused = !(usertriggerslist.pairings[id].action.paused)
    updateServerPairingsList()
    populateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseGroupButton
//              button to pause all trigger-actions in a group
// ============================================================================
function pauseGroupButton (group)
{
    usertriggerslist.pairings.forEach(element =>
    {
        if (element.group == group)
            element.action.paused = true;
    });

    updateServerPairingsList()
    populateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseGroupButton
//              button to pause all trigger-actions in a group
// ============================================================================
function unPauseGroupButton (group)
{
    usertriggerslist.pairings.forEach(element =>
    {
        if (element.group == group)
            element.action.paused = false;
    });

    updateServerPairingsList()
    populateTriggersTable();
}
// ============================================================================
//                     FUNCTION: triggerActionButton
//              button on the page for users to test the actions
// ============================================================================
function triggerActionButton (group, id)
{
    let action = usertriggerslist.pairings[id].action
    //let params = { ...action.data }
    let params = {}
    for (var i in action.data)
    {
        for (const property in action.data[i])
            params[property] = action.data[i][property]
    }
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                action.messagetype,
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
//                     FUNCTION: updateServerPairingsList
//              update the server with the current pairings
// ============================================================================
function updateServerPairingsList ()
{
    sr_api.sendMessage(localConfig.DataCenterSocket,
        sr_api.ServerPacket("ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "UpdateUserPairings",
                serverConfig.extensionname,
                usertriggerslist,
                "",
                "autopilot"),
            "",
            "autopilot"
        ),
    );
}
// ============================================================================
//                     FUNCTION: receivedUserPairings
// ============================================================================
function receivedUserPairings (data)
{
    if (data != null
        && typeof (data) != "undefined"
        && data != ""
        && Object.keys(data).length != 0)
    {
        usertriggerslist = structuredClone(data);
        triggersandactions = structuredClone(data.macrotriggers)
        receivedTrigger(data.macrotriggers)
        // update the page with the new triggeroptions
        populateGroupNamesDropdown();
        addTriggerEntries();
        addActionEntries();
        populateTriggersTable();
    }
}
// ============================================================================
//                     FUNCTION: setMacroImageTag
//                    click handler for imagepicker
// ============================================================================
function setMacroImageTag (name)
{
    document.getElementById("macroimagename").value = name
    document.getElementById("imageplaceholder").innerHTML = "<img src='/autopilot/images/deckicons/" + name + "'>"
    $("#imagepicker").modal("hide")
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