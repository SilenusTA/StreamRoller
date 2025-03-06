/**
 *      StreamRoller Copyright 2023 "SilenusTA https://www.twitch.tv/olddepressedgamer"
 * 
 *      StreamRoller is an all in one streaming solution designed to give a single
 *      'second monitor' control page and allow easy integration for configuring
 *      content (ie. tweets linked to chat, overlays triggered by messages, hue lights
 *      controlled by donations etc)
 * 
 *      This program is free software: you can redistribute it and/or modify
 *      it under the terms of the GNU Affero General Public License as published
 *      by the Free Software Foundation, either version 3 of the License, or
 *      (at your option) any later version.
 * 
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU Affero General Public License for more details.
 * 
 *      You should have received a copy of the GNU Affero General Public License
 *      along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import * as fs from "fs";
import path from 'path';
import { fileURLToPath, pathToFileURL } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extRoot = __dirname + "/../../extensions/";
const DEBUG = false;
// keeps a list of all triggers actions as they could be pieced together from different files
const allTAs = [
    // extname :
    // [
    //   {triggersString,arrayString}
    // ]
]
const filesUpdated = [];
const header = "| name | trigger | description |"
const hdivider = "| --- | --- | --- |"
// ============================================================================
//                           parseExtensions
// ============================================================================
async function parseExtensions ()
{
    for (const file of readAllFiles(extRoot))
        await parseFileForTriggers(file)
    createReadmeFiles();
    writefileslist()
}
// ============================================================================
//                           parseFileForTriggers
// ============================================================================
async function parseFileForTriggers (file)
{
    // we parse them twice. This is due to a bug where we can't import html, ejs files
    // by only parsing files that create the variable name then we only raise errors
    // on files we need to process and not every file that has parsing errors.
    let testFile = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })

    if (testFile.indexOf("triggersandactions =") != -1)
    {    // import the file as javascript so we can read the exports

        await import(pathToFileURL(file).href)
            .then((x) =>
            {
                //if we have a triggersandactions export then process it.
                if (x.triggersandactions)
                    parseTrigger(x.triggersandactions, file);
                else
                    console.log("\x1b[1m\x1b[33mMissing exported 'triggersandactions' for:", file, "\x1b[0m")
            })
            .catch((err) =>
            {
                // some html files will throw an error due to needing the dom
                // need to figure out how to handle this corretly to avoid
                // errors here and be able to parse the files for triggers
                console.log("error parsing file", file)
                console.log("Error:", err)

            })
    }
}
// ============================================================================
//                           parseTrigger
// ============================================================================
function parseTrigger (trigger, filename)
{
    if (!trigger.extensionname)
        return;
    console.log("\x1b[1m\x1b[32mfound triggers for:", trigger.extensionname, "in", filename, "\x1b[0m")
    let readmeTriggerStringReplacement = ""
    let readmeActionStringReplacement = ""

    let hbody = ""

    // build trigger/actions strings up
    if (trigger.triggers)
    {
        //console.log("trigger.triggers", JSON.stringify(trigger.triggers, null, 2))
        for (const t of trigger.triggers)
            hbody += `| ${t.name} | ${t.messagetype} | ${t.description} |\n`
        if (trigger.triggers.length > 0)
            readmeTriggerStringReplacement += hbody
    }
    hbody = ""
    if (trigger.actions)
    {
        for (const a of trigger.actions)
            hbody += `| ${a.name} | ${a.messagetype} | ${a.description} |\n`
        if (trigger.actions.length > 0)
            readmeActionStringReplacement += hbody
    }
    // if we have anything to process ...
    if (trigger.actions && trigger.actions.length > 0 || trigger.triggers && trigger.triggers.length > 0)
    {
        // create new slot if we don't have one already
        if (!allTAs[trigger.extensionname])
            allTAs[trigger.extensionname] = []
        allTAs[trigger.extensionname].push(
            { triggers: readmeTriggerStringReplacement, actions: readmeActionStringReplacement }
        )
    }
}
// ============================================================================
//                           createReadmeFiles
// ============================================================================
function createReadmeFiles ()
{
    //console.log("createReadmeFiles", allTAs)
    //loop each extension
    for (var ext of Object.keys(allTAs)) 
    {
        let allExtTriggers = "";
        let allExtActions = "";

        // loop each set of results
        for (const r of allTAs[ext])
        {
            allExtTriggers += r.triggers
            allExtActions += r.actions
        }

        let partFileName = extRoot + ext + "/README.part";
        // only update if we have a README.part file and it has tags to update
        if (partFileName
            && (partFileName.indexOf("ReplaceTAGForTriggersUpdatedDocTime" != -1)
                || partFileName.indexOf("ReplaceTAGForTriggers" != -1)
                || partFileName.indexOf("ReplaceTAGForActions" != -1)))
        {
            try
            {
                let partFile = fs.readFileSync(partFileName, { encoding: 'utf8', flag: 'r' })
                if (partFile && partFile != "")
                {
                    let datestamp = new Date().toUTCString();
                    partFile = partFile.replace("ReplaceTAGForTriggersUpdatedDocTime", "\n\nTriggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.\n\nTable last updated: *" + datestamp + "*");
                    partFile = partFile.replace("ReplaceTAGForTriggers", header + "\n" + hdivider + "\n" + allExtTriggers)
                    partFile = partFile.replace("ReplaceTAGForActions", header + "\n" + hdivider + "\n" + allExtActions)
                    const filename = extRoot + ext + "/README.md";
                    fs.writeFileSync(filename, partFile, {
                        encoding: "utf8"
                    })
                    filesUpdated.push(filename)
                }
            }
            catch (err)
            {
                if (err.code === 'ENOENT')
                {
                    console.log("\x1b[1m\x1b[31mMissing exported README.part for:", partFileName, "\x1b[0m")
                } else
                {
                    throw err;
                }
            }
        }
    }
}
function writefileslist ()
{
    filesUpdated.forEach((f) =>
    {
        console.log("files written", f)
        fs.writeFileSync("filelist.json", filesUpdated.join('\n'), {
            encoding: "utf8"
        })
    })
}
// ============================================================================
//                           readAllFiles
// ============================================================================
function* readAllFiles (dir)
{
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const excludeDirs = ['node_modules']
    const excludeFilenamesContaining = ["~~"]
    const includeExtensions = ['.js', '.cjs', '.mjs']//, '.ejs', 'html']
    for (const file of files)
    {
        if (file.isDirectory()
            && !excludeDirs.some(v => file.name.includes(v))
            && !excludeFilenamesContaining.some(v => file.name.includes(v)))
        {
            yield* readAllFiles(path.join(dir, file.name));
        } else
        {
            if (includeExtensions.some(v => file.name.endsWith(v))
            )
                yield path.join(dir, file.name);
        }
    }
}
await parseExtensions()