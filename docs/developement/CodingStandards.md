# StreamRoller Coding Standards

## Table of Contents

- [StreamRoller Coding Standards](#streamroller-coding-standards)
  - [Table of Contents](#table-of-contents)
  - [Contacts: (For questions, suggestions etc.)](#contacts-for-questions-suggestions-etc)
  - [Standards/FAQ's](#standardsfaqs)
  - [Basic FAQ's](#basic-faqs)
  - [Triggers and Actions](#triggers-and-actions)
    - [Mandatory Trigger/Action Top level definition](#mandatory-triggeraction-top-level-definition)
    - [Mandatory Trigger/Action fields](#mandatory-triggeraction-fields)
    - [Example single Trigger/action with parameters](#example-single-triggeraction-with-parameters)
    - [Example trigger/action template](#example-triggeraction-template)

## Contacts: (For questions, suggestions etc.)

- [Discord, (streamroller-stuff channel)](https://discord.gg/EyJy8brZ6R).
- [twitch.tv/OldDepressedGamer](https://twitch.tv/OldDepressedGamer).

## Standards/FAQ's

This file is for notes on standard features/coding styles expected when expanding StreamRoller. If you are writing/editing an addon and need to know the style/feature set you should use then this is the place to check. If you have a question not answered in here then please let me know and I'll add it.
This is an ongoing file and a lot of standards in here might not be in all codefiles currently due to standards being updated after they have been written

## Basic FAQ's

- **Config Files**: Version numbers
  
  Config files versions are used to cause the files to be updated to defaults when a major change occurs. This causes the user some issues as it means they will lose all their settings (in the case of triggers and actions this can be a big headache). For this reason you should always try to use minor updates where possible and combine major updates into one update.
  The Version numbers in config files should be 2 numbers (1.2).
  - Major Versions(1)
    These are for when an indication of a big update in features have occurred.
  - Minor Versions(2)
    If a change doesn't affect the users configs and it isn't a major version then use a subversion number in the config files to update them. This will cause a merge of the users settings over the top of the new config. This is mainly useful when adding new variables (that arn't mandatory in the code)
  
Note that to handle version numbers the following procedures should be followed.

When loading a saved config from the server, you should always check the version number in it against the default version. If changed determine if ...

- major version number change, reset to defaults and let the user know via a console.log message (still need to add an error trigger message so it can be displayed on the live portal etc).
- minor version number change, users saved file should be loaded over the top of the default one (this means modifying the version number after merging). This will keep the users settings but also keep the new variables added. Always save immediately after merging the files.

```javascript
if (server_packet.type === "ConfigFile")
{
    // breakdown the version number to major/minor numbers
    
    // check it is our config
    if (server_packet.data && server_packet.data.extensionname
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
        
        if (ConfigSubVersions[0] != defaultSubVersions[0])
        {
            // Major version number change. Replace config with defaults
            // perform a deep clone overwriting our server config.
            serverConfig = structuredClone(default_serverConfig);
            // notify the user their config has been updated.
            console.log("\x1b[31m" + serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__ + ". Your settings may have changed" + "\x1b[0m");
            SaveConfigToServer();
        }
        else if (ConfigSubVersions[1] != defaultSubVersions[1])
        {
            // Minor version number change. Overwrite config with defaults
            // perform a merge replacing any values we currently have and keeping the new variables
            serverConfig = { ...default_serverConfig, ...server_packet.data};
            // update the version number to the current default number
            serverConfig.__version__ = default_serverConfig.__version__;
            console.log(serverConfig.extensionname + " ConfigFile Updated", "The config file has been Updated to the latest version v" + default_serverConfig.__version__);
            SaveConfigToServer();
        }
        else
        {
            // no version number changed so we can just saved file
            serverConfig = structuredClone(server_packet.data);
        }
        ...
    }
}
```

## Triggers and Actions

Triggers and actions should be defined as below.

Some fields are mandatory, some are optional, the top level variables are a streamroller scoped spec, the parameters are defined in the extension that creates this trigger.

Note that any changes to the triggers can cause the user to lose their saved data. if you are only adding fields
that (if missing) won't break the code then only update the minor version number (ie 1.x), this will cause the users date to be merged in so you might receive triggers/actions with these fields missing.

If the change needs all triggers/actions to have the new data then update the major **version number** (ie x.2). This will cause the user
to lose any data they might have setup (ie autopilot pairings get deleted) so try and avoid this where possible (or group these changes into a release cycle).

### Mandatory Trigger/Action Top level definition

The variable name "triggersandactions" is mandatory as this is extracted in the automatic documentation we use for StreamRoller

- extensionname: is the name of the extension that these trigger/actions belong to
- description: used to describe this extensions purpose
- version: used to avoid issues with old definitions breaking code, changing this can wipe users settings so change with caution
- channel: the default broadcast channel for this extension
- triggers: array of triggers provided by this extension
- actions: array of actions provided by this extension

```javascript
const triggersandactions =
{
    extensionname: serverConfig.extensionname,
    description: "Twitch handles messages to and from twitch",
    version: "0.1",
    channel: serverConfig.channel,
    triggers: [],
    actions: []
}
        
```

### Mandatory Trigger/Action fields

Triggers and actions both have the same mandatory fieldsparameters field to define your data

- name: internal name, should not be used for user displa
- messagetype: should always start with either "trigger_" or "action_" as this is how code will detect what message type it is
- triggerActionRef: used as a reference as to the source of this trigger, if triggered as a result of a "action_..." message then this field should be copied though. This allows the user to specify a name for an action and then filter out triggers based on this name.
- displaytitle: This is what will be displayed to the user as the title of this trigger/action.
- description: Used to describe what this trigger/action is from/does
- parameters: the data for this trigger, defined by the extension.

```javascript
triggers: [
    {
        name:"",
        triggerActionRef:""
        messagetype:""
        displaytitle:""
        description:""
        parameters:{...}
    },
    ...
    ]
```

### Example single Trigger/action with parameters

This example is a single element in the trigger array

If you want popup descriptions for a specific field add a "_UIDescription" variable to add extra info. This variable is optional but highly recommended for describing to the user what this field contains

### Example trigger/action template

```javascript
...
triggers: 
[
    {
        // name of this action, should only be used to internal checks if needed. Ideally use the messagetype
        name: "RedemptionAdd",
        // Title used to display to the user, should be descriptive of what this trigger does
        displaytitle: "Chat Points Redeemed",
        description: "A user used channel points for a redemption (id and rewardID appear to be the same number)",
        messagetype: "trigger_TwitchRedemptionAdd",
        parameters: 
        {
            title: "",
            title_UIDescription:"",
            cost: "",
            cost_UIDescription:"",
            prompt: "",
            prompt_UIDescription:"",
            user: "",
            user_UIDescription:"",
            streamer: "",
            streamer_UIDescription:"",
            id: "",
            id_UIDescription:"",
            message: "",
            message_UIDescription:"",
            rewardId: "",
            rewardId_UIDescription:"",
            status: "",
            status_UIDescription:"",
            triggerActionRef:"",
            triggerActionRef_UIDescription:""
        }
    },
    ...
]
```
