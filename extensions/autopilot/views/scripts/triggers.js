// es-lint globals to stop red highlights
/*
global 
SaveConfigToServer
sr_api, serverConfig, localConfig, refreshDarkMode ,$, livePortalVolatileData, updateMacroButtonsDisplay
*/
let processingTextAnimation_handle = [];

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

    // request triggers and actions from all the current extensions we have
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
    fulltriggerslist.triggers = sortByKey(fulltriggerslist.triggers)
    fulltriggerslist.actions = sortByKey(fulltriggerslist.actions)
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
            triggerextensiontriggers += "<option data='" + selectedTrigger[key].messagetype + "' class='form-control' value='" + key + "' selected>" + selectedTrigger[key].displaytitle + "</option>";
            TriggerExtensionTriggers.title = selectedTrigger[key].description
        }
        else
        {
            triggerextensiontriggers += "<option data='" + selectedTrigger[key].messagetype + "' class='form-control' value='" + key + "'>" + selectedTrigger[key].displaytitle + "</option>";
        }
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
            triggerextensionparameters += "<div class='col-7'>"
            triggerextensionparameters += "<input type='text' class='form-control' name='" + triggername + "_" + key + "' id='" + triggername + "_" + key + "' placeholder='" + key + "' value=''>"
            triggerextensionparameters += "</div>"
            triggerextensionparameters += "<div class='col-3'>"
            // add the matcher dropdown to each variable name
            triggerextensionparameters += "<select id='triggerExtensionTriggerParametersMatcher_" + key + "' class='selectpicker btn btn-secondary' data-style='btn-danger' title = '' value='1' name='triggerExtensionTriggerParametersMatcher_" + key + "' style='max-width: 100%'>"
            triggerextensionparameters += "<option data='Exact Match' class='form-control' value='1'>Exact Match</option>";
            triggerextensionparameters += "<option data='Anywhere' class='form-control' value='2'>Anywhere</option>";
            triggerextensionparameters += "<option data='Start of line' class='form-control' value='3'>Start of line</option>";
            triggerextensionparameters += "<option data='Doesn't Match' class='form-control' value='4'>Doesn't match</option>";
            triggerextensionparameters += "<option data='Specific word' class='form-control' value='5'>Match a specific whole word</option>";
            triggerextensionparameters += "</select>"
            triggerextensionparameters += "</div>"
            triggerextensionparameters += "</div>"
        }
        // cooldown timer
        triggerextensionparameters += "<div class='row'>"

        triggerextensionparameters += "<div class='col-2'>"
        triggerextensionparameters += "<div class='d-flex form-row align-items-center'>"
        triggerextensionparameters += "<label class='form-label px-2 align-middle text-right' for=" + triggername + "_cooldown>cooldown</label>"
        triggerextensionparameters += "</div>"
        triggerextensionparameters += "</div>"

        triggerextensionparameters += "<div class='col-3'>"
        triggerextensionparameters += "<div class='input-group'>"
        triggerextensionparameters += "<input type='text' class='form-control' name='" + triggername + "_cooldown' id='" + triggername + "__cooldown' placeholder='cooldown' value='0'>seconds"
        triggerextensionparameters += "</div>"
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
    let temparray = []
    let tempobject = {}

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
                actionextensionaction += "<option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "' selected>" + selectedAction[key].displaytitle + "</option>";
                ActionExtensionAction.title = selectedAction[key].description
            }
            else
            {
                actionextensionaction += "<option data='" + selectedAction[key].messagetype + "' class='form-control' value='" + key + "'>" + selectedAction[key].displaytitle + "</option>";
            }
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
    }
    updateServerPairingsList()
    //populateTriggersTable();
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
    //populateMacroDisplay()

    return false;
}

// ============================================================================
//                           FUNCTION: deleteMacro
//                       called from delete macro button
// ============================================================================
function deleteMacro (e)
{
    let macroname = document.getElementById("macroName").value

    if (!window.confirm("Delete " + macroname + "?"))
        return;
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
        //addTriggerEntries()
        //populateMacroDisplay()
    }

    return false;
}
// ============================================================================
//                           FUNCTION: populateMacroDisplay
// ============================================================================
function populateMacroDisplay ()
{
    if (usertriggerslist.macrotriggers == undefined || usertriggerslist.macrotriggers.length == 0)
        return;
    let element = document.getElementById("existing_macro_list")
    let tempstring = ""
    for (let i = 0; i < usertriggerslist.macrotriggers.triggers.length; i++)
    {
        let color = "#999999"
        let macroName = usertriggerslist.macrotriggers.triggers[i].name
        let macroDescription = usertriggerslist.macrotriggers.triggers[i].description
        let iconName = usertriggerslist.macrotriggers.triggers[i].image
        let backgroundcolor = "#222255"
        if (typeof (usertriggerslist.macrotriggers.triggers[i].color) != "undefined" && usertriggerslist.macrotriggers.triggers[i].color != "")
            color = usertriggerslist.macrotriggers.triggers[i].color
        if (typeof (usertriggerslist.macrotriggers.triggers[i].backgroundcolor) != "undefined" && usertriggerslist.macrotriggers.triggers[i].backgroundcolor != "")
            backgroundcolor = usertriggerslist.macrotriggers.triggers[i].backgroundcolor
        if (typeof (usertriggerslist.macrotriggers.triggers[i].image) != "undefined" && usertriggerslist.macrotriggers.triggers[i].image != "")
        {
            tempstring += "<div class='deckiconslot'>"
            tempstring += "<img class='deckicon' src='/autopilot/images/deckicons/" + iconName + "' alt = '" + macroName + ": " + macroDescription + "' onclick='triggerMacroButton(\"macros\",\"" + macroName + "\");' title='" + macroName + ": " + macroDescription + "'>"
            tempstring += "</div>"
        }
        else
        {
            tempstring += "<div class='deckiconslot'>"
            tempstring += "<div class='nodeckicon' style='color:" + color + "; background-color:" + backgroundcolor + ";' alt='" + macroName + "' onclick='javascript:triggerMacroButton(\"macros\",\"" + macroName + "\");'  title='" + macroName + ": " + macroDescription + "'>" + macroName + "</div> "
            tempstring += "</div>"
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
    // create hide all groups button
    let AllGroupsHidden = localStorage.getItem("AllGroupsHidden") == "true"

    var group_actions = document.createElement("div")
    group_actions.id = "AllGroupsHiddenButtons"
    if (AllGroupsHidden)
    {
        btn = createAnchorButton('btn btn-secondary', "javascript:ToggleAllGroups();", 'Show/Hide All Groups', '/autopilot/images/show.png')
        group_actions.innerHTML = "Show all groups"
    }
    else
    {
        btn = createAnchorButton('btn btn-secondary', "javascript:ToggleAllGroups();", 'Show/Hide All Groups', '/autopilot/images/hide.png')
        group_actions.innerHTML = "Hide all groups"
    }
    btn.id = "AllGroupsHiddenButtonImage"

    group_actions.appendChild(btn)
    group_actions.appendChild(document.createElement("hr"))

    table.appendChild(group_actions)


    for (let g in usertriggerslist.groups)
    {
        let group = usertriggerslist.groups[g].name
        var group_div = document.createElement("div")
        let group_id = group + "_" + g
        let span = document.createElement("span")
        group_div.appendChild(span)
        span.classList = 'fs-4'
        span.innerHTML = "Group(" + itemCounter(usertriggerslist.pairings, "group", group) + "): " + group

        // delete group button
        var btn = createAnchorButton('btn btn-secondary', "javascript:DeleteTriggerGroup('" + group + "');", 'Delete ' + group_id + '_Group', '/autopilot/images/trash.png')
        group_div.appendChild(btn)
        // play button
        btn = createAnchorButton('btn btn-secondary', "javascript:unPauseGroupButton('" + group + "');", 'Unpause  ' + group_id + '_Group', '/autopilot/images/play.png')
        group_div.appendChild(btn)
        // pause button
        btn = createAnchorButton('btn btn-secondary', "javascript:pauseGroupButton('" + group + "');", 'Pause  ' + group_id + '_Group', '/autopilot/images/pause.png')
        group_div.appendChild(btn)
        // show hide button
        if (AllGroupsHidden || localStorage.getItem(group + "visible") == "false")
            btn = createAnchorButton('btn btn-secondary', "javascript:ShowHideTriggerGroup('" + group + "');", 'Show/Hide ' + group_id + '_Group', '/autopilot/images/show.png')
        else
            btn = createAnchorButton('btn btn-secondary', "javascript:ShowHideTriggerGroup('" + group + "');", 'Show/Hide ' + group_id + '_Group', '/autopilot/images/hide.png')
        group_div.appendChild(btn)
        table.appendChild(group_div)

        // group body
        let tbody = document.createElement("tbody")
        tbody.id = group + "_TriggerGroupDisplay"
        tbody.style.width = "100%"

        table.appendChild(tbody)

        if (AllGroupsHidden || localStorage.getItem(group + "visible") == "false")
            tbody.style.display = "none"
        else
            tbody.style.display = "table"

        // inset title for trigger column
        let triggertitlerow = tbody.insertRow()
        let titlecell = triggertitlerow.insertCell()
        titlecell.classList = "text-center"
        titlecell.innerHTML = "<h3>Triggers</h3>"
        titlecell = triggertitlerow.insertCell()
        titlecell.classList = "text-center"
        titlecell.innerHTML = "<h3>Actions</h3>"

        // table data
        for (let i = 0; i < usertriggerslist.pairings.length; i++) 
        {
            if (usertriggerslist.pairings[i].group == group)
            {
                //triggers/actions row
                let tr = tbody.insertRow()
                //split row into triggers and action cells
                let triggerdatacell = tr.insertCell()
                triggerdatacell.style.width = "50%"
                let triggersdatacelltable = document.createElement("table")
                triggerdatacell.appendChild(triggersdatacelltable)
                let triggerdatacellrow = triggersdatacelltable.insertRow()


                let actiondatacell = tr.insertCell()
                actiondatacell.style.width = "50%"
                let actiondatacelltable = document.createElement("table")
                actiondatacell.appendChild(actiondatacelltable)
                let actiondatacellrow = actiondatacelltable.insertRow()
                actiondatacellrow.style.borderLeftWidth = "1px";
                if (usertriggerslist.pairings[i].action.paused)
                    tr.style.color = "#ffffff6b"

                // TRIGGERS
                let td = triggerdatacellrow.insertCell()
                td.innerHTML = i
                //tablerows += "<td scope='row'>" + i + "</td>"
                td = triggerdatacellrow.insertCell()
                // td.scope = 'row'
                td.role = 'button'
                td.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg >"
                td.onclick = function () { delteTriggerAction(group, i); }

                td = triggerdatacellrow.insertCell()
                td.innerHTML = usertriggerslist.pairings[i].trigger.extension
                td = triggerdatacellrow.insertCell()
                td.innerHTML = usertriggerslist.pairings[i].trigger.messagetype.replace("trigger_", "").replace("_get", "")
                td = triggerdatacellrow.insertCell()
                let morethanoneentry = false
                for (let j = 0; j < usertriggerslist.pairings[i].trigger.data.length; j++) 
                {
                    if (morethanoneentry)
                        //tablerows += ", ";
                        td.innerHTML += ", "
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
                                case "4":
                                    symbol = "!"
                                    break;
                                case "5":
                                    symbol = "#"
                                    break;
                                default:
                                    symbol = "="
                            }
                            td.innerHTML += item + " " + symbol + " " + usertriggerslist.pairings[i].trigger.data[j][item];
                        }
                    }
                }

                // ACTIONS
                td = actiondatacellrow.insertCell()
                td.innerHTML = usertriggerslist.pairings[i].action.extension

                td = actiondatacellrow.insertCell()
                td.innerHTML = usertriggerslist.pairings[i].action.messagetype.replace("action_", "")

                td = actiondatacellrow.insertCell()
                morethanoneentry = false
                for (let j = 0; j < usertriggerslist.pairings[i].action.data.length; j++) 
                {
                    if (morethanoneentry)
                        td.innerHTML += ", ";
                    //tablerows += ", ";
                    morethanoneentry = true;
                    // we have amtched the action
                    for (let item in usertriggerslist.pairings[i].action.data[j])
                        td.innerHTML += item + " = " + usertriggerslist.pairings[i].action.data[j][item];
                }
                td = actiondatacellrow.insertCell()
                if (usertriggerslist.pairings[i].action.paused)
                    td.appendChild(createAnchorButton('btn btn-secondary', "javascript:pauseActionButton('" + i + "');", 'Unpause' + i + ' action', '/autopilot/images/play.png', "20px"))
                else
                    td.appendChild(createAnchorButton('btn btn-secondary', "javascript:pauseActionButton('" + i + "');", 'Pause' + i + ' action', '/autopilot/images/pause.png', "20px"))
                // edit button
                td = actiondatacellrow.insertCell()
                td.appendChild(createAnchorButton('btn btn-secondary', "javascript:EditPairingButton(this,'" + group + "','" + i + "');", 'Edit ' + i, '/autopilot/images/edit.png', "20px"))
                // run button
                td = actiondatacellrow.insertCell()
                td.appendChild(createAnchorButton('btn btn-secondary', "javascript:triggerActionButton('" + group + "','" + i + "');", 'Run ' + i + 'action', '/autopilot/images/run.png', "20px"))
            }
        }
    }
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
//                          FUNCTION: ToggleAllGroups
//                          callback for all groups button
// ============================================================================
function ToggleAllGroups ()
{
    // invert the value (toggle button)
    if (localStorage.getItem("AllGroupsHidden") == "true")
        localStorage.setItem("AllGroupsHidden", "false")
    else
        localStorage.setItem("AllGroupsHidden", "true")
    populateTriggersTable()
}
// ============================================================================
//                          FUNCTION: DeleteTriggerGroup
//                          callback for show/hide button
// ============================================================================
function DeleteTriggerGroup (name)
{
    if (!window.confirm("Delete " + name + "?"))
        return;

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
    //populateTriggersTable()
    //populateGroupNamesDropdown();
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
    //populateTriggersTable()
    //populateGroupNamesDropdown()
}

// ============================================================================
//                          FUNCTION: delteTriggerAction
//                          delete a trigger entry
// ============================================================================
function delteTriggerAction (group, id)
{
    if (!window.confirm("Delete?"))
        return;
    if (usertriggerslist.pairings[id].group == group)
        usertriggerslist.pairings.splice(id, 1)
    updateServerPairingsList();
    //populateTriggersTable();
}
// ============================================================================
//                     FUNCTION: pauseActionButton
//              button to pause a trigger-action
// ============================================================================
function pauseActionButton (id)
{
    usertriggerslist.pairings[id].action.paused = !(usertriggerslist.pairings[id].action.paused)
    updateServerPairingsList()
    //populateTriggersTable();
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
    //populateTriggersTable();
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
    //populateTriggersTable();
}

// ============================================================================
//                     FUNCTION: triggerMacroButton
//              button on the page for users to test the actions
// ============================================================================
function triggerMacroButton (group, name)
{
    for (var i in usertriggerslist.pairings)
    {
        if (usertriggerslist.pairings[i].trigger.extension == group &&
            usertriggerslist.pairings[i].trigger.name == name)
        {
            let params = {}
            for (var j in usertriggerslist.pairings[i].action.data)
            {
                for (const property in usertriggerslist.pairings[i].action.data[j])
                    params[property] = usertriggerslist.pairings[i].action.data[j][property]
            }
            sr_api.sendMessage(localConfig.DataCenterSocket,
                sr_api.ServerPacket("ExtensionMessage",
                    serverConfig.extensionname,
                    sr_api.ExtensionPacket(
                        usertriggerslist.pairings[i].action.messagetype,
                        serverConfig.extensionname,
                        params,
                        "",
                        usertriggerslist.pairings[i].action.extension),
                    "",
                    usertriggerslist.pairings[i].action.extension
                ),
            );
        }
    }

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
//                     FUNCTION: EditPairingButton
//              button on the page for users to edit the pairings
// ============================================================================
function EditPairingButton (event, g, i)
{
    $("#editPairingModal").modal("show")
    let editform = document.getElementById("updatePairingEditForm")
    editform.innerHTML = ""
    let pairing = usertriggerslist.pairings[i]
    // Create title
    editform.appendChild(createInputElement('triggerpairingidinputfield', 'triggerpairingid', 'hidden', i))
    // start table
    let table = document.createElement("table")
    let tr = table.insertRow()
    let td = tr.insertCell()
    // group selection box    
    let selectgroup = createSelectGroup("triggerExtensionPairingModalGroupName", "selectpicker btn btn-secondary", "triggerExtensionPairingModalGroupName", "Select new group")
    selectgroup.setAttribute("data-style", "btn-danger")
    for (let i = 0; i < usertriggerslist.groups.length; i++)
    {
        var selectoption = createSelectOption(usertriggerslist.groups[i].name, usertriggerslist.groups[i].name, "btn btn-secondary", usertriggerslist.groups[i].name, usertriggerslist.groups[i].name)
        selectgroup.appendChild(selectoption)
        if (usertriggerslist.groups[i].name == g)
            selectgroup.value = g
    }
    td.appendChild(selectgroup)
    // start trigger table
    tr = table.insertRow().insertCell().outerHTML = "<Th colspan='3'><H3>Trigger</h3></Th>"
    tr = table.insertRow().insertCell().outerHTML = "<Th colspan='3'>" + pairing.trigger.extension + " -> " + pairing.trigger.messagetype.replace("trigger_", "") + "</Th>"

    for (let j = 0; j < pairing.trigger.data.length; j++) 
    {
        tr = table.insertRow()
        for (let item in pairing.trigger.data[j])
        {
            if (item.indexOf("MATCHER_") != 0)
            {
                // add the field name
                tr.insertCell().innerHTML = item
                // add the field value
                tr.insertCell().appendChild(createInputElement("triggerExtensionEditTriggerParameters" + item, "triggerExtensionEditTriggerParameters" + item, "text", pairing.trigger.data[j][item]))
                td = tr.insertCell()
                //start of matcher box div
                var outer_div = document.createElement("div")
                outer_div.classList = 'col-2'
                td.appendChild(outer_div)
                // select group matcher
                var selectmatcher = createSelectGroup("triggerExtensionEditTriggerParametersMATCHER_" + item, "selectpicker btn btn-secondary", "triggerExtensionEditTriggerParametersMATCHER_" + item, "Select match type")
                selectmatcher.setAttribute("data-style", "btn-danger")
                outer_div.appendChild(selectmatcher)
                var matchdiv = document.createElement("div")
                matchdiv.classList = 'form-group'
                outer_div.appendChild(matchdiv)
                // add the options to the matcher group
                var selectoption_1 = createSelectOption("Exact", "Exact", 'form-control', '1', "Exact Match")
                var selectoption_2 = createSelectOption("Anywhere", "Anywhere", 'form-control', '2', "Anywhere")
                var selectoption_3 = createSelectOption("Start of line", "Start of line", 'form-control', '3', "Start of line")
                var selectoption_4 = createSelectOption("Doesn't match", "Doesn't match", 'form-control', '4', "Doesn't match")
                var selectoption_5 = createSelectOption("Specific word", "Match a specific whole word", 'form-control', '5', "Match whole word")
                selectmatcher.appendChild(selectoption_1)
                selectmatcher.appendChild(selectoption_2)
                selectmatcher.appendChild(selectoption_3)
                selectmatcher.appendChild(selectoption_4)
                selectmatcher.appendChild(selectoption_5)
                // set the option to the current matcher type
                let temp = pairing.trigger.data.find((o) => typeof (o["MATCHER_" + item]) != "undefined")
                if (temp)
                    selectmatcher.value = temp["MATCHER_" + item]

            }
        }
    }
    tr = table.insertRow()
    tr.insertCell().innerHTML = "cooldown"
    tr.insertCell().appendChild(createInputElement("triggerExtensionEditTriggerParameterscooldown", "triggerExtensionEditTriggerParameterscooldown", "text", pairing.trigger.cooldown))

    // start action table
    tr = table.insertRow().insertCell().outerHTML = "<Th colspan='3'><H3>Action</h3></Th>"
    tr = table.insertRow().insertCell().outerHTML = "<Th colspan='3'>" + pairing.action.extension + " -> " + pairing.action.messagetype.replace("action_", "") + "</Th>"

    for (let j = 0; j < pairing.action.data.length; j++) 
    {
        tr = table.insertRow()
        for (let item in pairing.action.data[j])
        {
            if (item.indexOf("MATCHER_") != 0)
            {
                // add the field name
                tr.insertCell().innerHTML = item
                // add the field value
                tr.insertCell().appendChild(createInputElement("actionExtensionEditActionParameters" + item, "actionExtensionEditActionParameters" + item, "text", pairing.action.data[j][item]))
                td = tr.insertCell()
                //start of matcher box div
                outer_div = document.createElement("div")
                outer_div.classList = 'col-2'
                td.appendChild(outer_div)
                // select group matcher
                selectmatcher = createSelectGroup("actionExtensionEditActionParametersMATCHER_" + item, "selectpicker btn btn-secondary", "actionExtensionEditActionParametersMATCHER_" + item, "Select match type")
                selectmatcher.setAttribute("data-style", "btn-danger")
                outer_div.appendChild(selectmatcher)
                matchdiv = document.createElement("div")
                matchdiv.classList = 'form-group'
                outer_div.appendChild(matchdiv)
                // add the options to the matcher group
                selectoption_1 = createSelectOption("Exact", "Exact", 'form-control', '1', "Exact Match")
                selectoption_2 = createSelectOption("Anywhere", "Anywhere", 'form-control', '2', "Anywhere")
                selectoption_3 = createSelectOption("Start of line", "Start of line", 'form-control', '3', "Start of line")
                selectoption_4 = createSelectOption("Doesn't match", "Doesn't match", 'form-control', '4', "Doesn't match")
                selectoption_5 = createSelectOption("Any word", "Match a specific whole word", 'form-control', '5', "Match whole word")
                selectmatcher.appendChild(selectoption_1)
                selectmatcher.appendChild(selectoption_2)
                selectmatcher.appendChild(selectoption_3)
                selectmatcher.appendChild(selectoption_4)
                selectmatcher.appendChild(selectoption_5)
                // set the option to the current matcher type
                let temp = pairing.action.data.find((o) => typeof (o["MATCHER_" + item]) != "undefined")
                if (temp)
                    selectmatcher.value = temp["MATCHER_" + item]

            }
        }
    }
    editform.appendChild(table)
}
// ============================================================================
//                     FUNCTION: createInputElement
// ============================================================================
function createInputElement (id, name, type, value)
{
    var i = document.createElement("input");
    i.id = id
    i.type = type
    i.name = name
    i.value = value
    return i
}
// ============================================================================
//                     FUNCTION: createTableElement
// ============================================================================
function createTableElement (id, type, name, value)
{
    var i = document.createElement("table");
    i.type = type
    i.name = name
    i.value = value
    i.id = id
    return i
}
// ============================================================================
//                     FUNCTION: createSelectGroup
// ============================================================================
function createSelectGroup (id, classlist, name, title)
{
    var i = document.createElement("select")
    i.id = id
    i.classList = classlist
    i.name = name
    i.title = title
    return i
}
// ============================================================================
//                     FUNCTION: createSelectOption
// ============================================================================
function createSelectOption (name, data, classList, value, innerHTML)
{
    var i = document.createElement("option")
    i.name = name
    i.data = data
    i.classList = classList
    i.value = value
    i.innerHTML = innerHTML
    return i
}
// ============================================================================
//                     FUNCTION: createSelectOption
// ============================================================================
function createAnchorButton (classList, href, title, image, width = "40px")
{
    //' style='padding:0px' title='Delete Group'>"
    var i = document.createElement("a")
    var j = document.createElement("img")
    i.appendChild(j)
    i.role = "button"
    i.classList = classList
    i.href = href
    i.style.padding = "0px"
    i.title = title
    i.id = title + "_link";

    j.id = title + "_image";
    j.alt = title
    j.src = image
    j.style.width = width

    return i
}
// ============================================================================
//                     FUNCTION: UpdatePairingButton
//              Update the pairing buttons
// ============================================================================
function UpdatePairingButton (event)
{
    let triggerpattern = "triggerExtensionEditTriggerParameters"
    let actionpattern = "actionExtensionEditActionParameters"
    // get the modal data as an array
    let fieldsAsArray = $('#updatePairingEditForm').serializeArray();
    // convert our array of objects into a more usable object
    let fieldsAsObject = fieldsAsArray.reduce((obj, item) => (obj[item.name] = item.value, obj), {});
    let pairingID = fieldsAsObject.triggerpairingid
    if (pairingID == undefined)
        alert("Trigger/Action pair not found")

    for (const [key, value] of Object.entries(fieldsAsObject))
    {
        // we have a trigger variable
        if (key.indexOf(triggerpattern) == 0)
        {
            let field = key.replace(triggerpattern, "")
            for (let i = 0; i < usertriggerslist.pairings[pairingID].trigger.data.length; i++)
            {
                if (usertriggerslist.pairings[pairingID].trigger.data[i][field] != undefined)
                    usertriggerslist.pairings[pairingID].trigger.data[i][field] = value
            }
            if (key.indexOf("triggerExtensionEditTriggerParameterscooldown") == 0)
                usertriggerslist.pairings[pairingID].trigger.cooldown = value

        }
        // we have an action variable
        else if (key.indexOf(actionpattern) == 0)
        {
            let field = key.replace(actionpattern, "")
            for (let i = 0; i < usertriggerslist.pairings[pairingID].action.data.length; i++)
            {
                if (usertriggerslist.pairings[pairingID].action.data[i][field] != undefined)
                    usertriggerslist.pairings[pairingID].action.data[i][field] = value
            }
            //usertriggerslist.pairings[pairingID].action.data[field] = value
        }
        else if (key.indexOf("triggerExtensionPairingModalGroupName") == 0)
        {
            usertriggerslist.pairings[pairingID].group = value;
        }
        else if (key.indexOf("triggerpairingid") == 0)
        {
            //ignore the id as we have already used it
        }
        else
            console.log("Error: Skipping ", "'" + key.indexOf("actionExtensionEditActionParametersprofile") + "'", "'" + key + "'", "=", value)

    }
    $("#editPairingModal").modal("hide")
    updateServerPairingsList();
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
function sortByKey (array)
{

    const ordered = Object.keys(array).sort().reduce(
        (obj, key) =>
        {
            obj[key] = array[key];
            return obj;
        },
        {}
    );
    //console.log(array)
    return ordered;
}
// ============================================================================
//                     FUNCTION: downloadServerDataClicked
// ============================================================================
function downloadServerDataClicked ()
{
    // User has clicked on the download Server Data Button
    try
    {
        RequestServerDataFile();
    }
    catch (err)
    {
        console.log("downloadServerDataClicked Error:", err, err.message)
    }
}
// ============================================================================
//                     FUNCTION: RequestServerDataFile
// ============================================================================
function RequestServerDataFile ()
{
    // request the saved data from the server (callback will go to downloadServerDataFileReceived below)
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "RequestServerDataFile",
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
//                     FUNCTION: downloadServerDataFileReceived
// ============================================================================
function downloadServerDataFileReceived (data)
{
    try
    {   // should only be called via a users request to download the server file after
        // we have received the file from the server
        let fileToDownload = JSON.stringify(data, null, 2);
        var a = document.createElement("a");
        var file = new Blob([fileToDownload], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = "StreamRoller_autopilotBackup_" + getFileNameDateString() + ".json";
        a.click();
    }
    catch (err)
    {
        console.log("downloadServerDataFileReceived Error:", err, err.message)
    }
}
// ============================================================================
//                     FUNCTION: uploadServerDataClicked
// ============================================================================
function uploadServerDataClicked ()
{
    try
    {
        // user has selected a file to upload to the server
        var file = document.getElementById('AutoPilotDatFileUploadElement').files[0];
        if (file)
        {
            var reader = new FileReader();
            reader.readAsText(file, "application/json");
            reader.onload = function (evt)
            {
                let userDataFile = JSON.parse(evt.target.result);
                // some basic sanity checks.
                if (userDataFile && userDataFile != ""
                    && userDataFile.__version__)
                {
                    console.log("userDataFile.__version__", userDataFile.__version__);
                    document.getElementById('AutoPilotDatFileUploadMessage').innerHTML = "Processing";
                    processingAnimation('AutoPilotDatFileUploadMessage');
                    saveUserDataFile(userDataFile)
                }
                else
                {
                    document.getElementById('AutoPilotDatFileUploadMessage').innerHTML = "Error reading file, is it the correct format"
                }
            }
        } else
            document.getElementById('AutoPilotDatFileUploadMessage').innerHTML = "Error reading file, is it the correct format"
    }
    catch (err)
    {
        console.log("uploadServerDataClicked Error:", err, err.message)
    }
}
// ============================================================================
//                     FUNCTION: saveUserDataFile
// ============================================================================
function saveUserDataFile (userDataFile)
{
    // request the saved data from the server (callback will go to downloadServerDataFileReceived below)
    sr_api.sendMessage(
        localConfig.DataCenterSocket,
        sr_api.ServerPacket(
            "ExtensionMessage",
            serverConfig.extensionname,
            sr_api.ExtensionPacket(
                "userRequestSaveDataFile",
                serverConfig.extensionname,
                userDataFile,
                "",
                "autopilot"
            ),
            "",
            "autopilot"
        ));
}
// ============================================================================
//                     FUNCTION: downloadServerDataFileReceivedResponse
// ============================================================================
function downloadServerDataFileReceivedResponse (data)
{
    try
    {
        // clear the animation if we have it running
        if (processingTextAnimation_handle['AutoPilotDatFileUploadMessage'])
        {
            clearInterval(processingTextAnimation_handle['AutoPilotDatFileUploadMessage'])
            processingTextAnimation_handle['AutoPilotDatFileUploadMessage'] = null;
        }
        document.getElementById('AutoPilotDatFileUploadMessage').innerHTML = data.response;
    }
    catch (err)
    {
        console.log("downloadServerDataFileReceivedResponse Error:", err, err.message)
    }
}
// ============================================================================
//                     FUNCTION: processingAnimation
// ============================================================================
function processingAnimation (element)
{
    var count = 0;
    // stop any previous timer we may have had for this element
    if (processingTextAnimation_handle[element])
        clearInterval(processingTextAnimation_handle[element])
    processingTextAnimation_handle[element] = setInterval(function ()
    {
        // stop after 5 minutes if this keeps running
        if (count > 300)
            clearInterval(processingTextAnimation_handle[element]);
        count++;
        var dots = new Array(count % 10).join('.');
        document.getElementById(element).innerHTML = "Processing" + dots;
    }, 1000);
}
// ============================================================================
//                     FUNCTION: getFileNameDateString
// ============================================================================
function getFileNameDateString ()
{
    // returns a suitable date string for appending to a filename
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');
    return `${year}_${month}_${day}-${hours}_${minutes}_${seconds}`
}
