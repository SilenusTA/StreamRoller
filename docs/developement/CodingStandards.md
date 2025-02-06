# StreamRoller Coding Standards

## Table of Contents

- [StreamRoller Coding Standards](#streamroller-coding-standards)
  - [Table of Contents](#table-of-contents)
  - [Contacts: (For questions, suggestions etc.)](#contacts-for-questions-suggestions-etc)
  - [Standards/FAQ's](#standardsfaqs)
  - [Basic FAQ's](#basic-faqs)

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

```
if (server_packet.type === "ConfigFile")
{
    // breakdown the version number to major/minor numbers
    let ConfigSubVersions = server_packet.data.__version__.split('.')
    let defaultSubVersions = default_serverConfig.__version__.split('.')
    
    // check it is our config
    if (server_packet.data && server_packet.data.extensionname
        && server_packet.data.extensionname === serverConfig.extensionname)
    {
        if (server_packet.data == "")
        {
            // server data is empty, possibly the first run of the code so just default it
            serverConfig = structuredClone(default_serverConfig);
            SaveConfigToServer();
        }
        else if (ConfigSubVersions[0] != defaultSubVersions[0])
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
