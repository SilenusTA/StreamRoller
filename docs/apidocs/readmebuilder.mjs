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
// keep a list of all triggers actions as they could be pieced together from different files
const allTAs = [
    // extname :
    // [
    //   {triggersString:MDrows[],arrayString:MDrows[]]}
    // ]
]
// possible tags
const readmeTAGs = [
    "ReplaceTAGForTriggersUpdatedDocTime",// time doc was updated
    "ReplaceTAGForTriggers",//list of triggers
    "ReplaceTAGForActions",// list of actions

    // common tags (will be replaced in replaceCommonTags()function)
    "ReplaceTAGForAllTriggersCount",//count of all triggers
    "ReplaceTAGForAllActionsCount",// count of all actions
    "ReplaceTAGForTotalTACount",// count of all triggers+actions
    "ReplaceTAGForTotalTAPossibilities"]// count of triggers*actions
// keep a count of all triggers/actions
const counters = {
    AllTriggersCount: 0,
    AllActionsCount: 0,
    TotalTACount: 0,
    TotalTAPossibilities: 0

}
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
}
/*
// ============================================================================
//                           dynamicImport
// ============================================================================
async function dynamicImport (filename, modulefile = true)
{
    if (filename.endsWith(".mjs") || filename.endsWith(".js"))
    {
        try
        {
            return await import(pathToFileURL(filename).href);
        } catch (e)
        {
            console.log("Failed to import as ESM, trying CommonJS...", e);
        }
    }

    // Fallback to CommonJS using createRequire
    const require = createRequire(import.meta.url);
    console.log("loading CJS File")
    console.log(filename)
    return require(filename);
}
*/
// ============================================================================
//                           parseFileForTriggers
// ============================================================================
async function parseFileForTriggers (file)
{
    let testFile = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })

    if (testFile.indexOf("triggersandactions =") != -1)
    {
        // we have a trigger/actions variable in this file

        // import the file as javascript so we can read the exports
        await import(pathToFileURL(file).href)
            //await dynamicImport(file)
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

    if (!allTAs[trigger.extensionname])
        allTAs[trigger.extensionname] = []
    // build trigger strings up
    if (trigger.triggers)
    {
        if (!allTAs[trigger.extensionname].triggers)
            allTAs[trigger.extensionname].triggers = []
        for (const tr of trigger.triggers)
            allTAs[trigger.extensionname].triggers.push(createTableRow(tr))
        counters.AllTriggersCount += trigger.triggers.length
        counters.TotalTACount += trigger.triggers.length
    }
    // build actions strings up
    if (trigger.actions)
    {
        if (!allTAs[trigger.extensionname].actions)
            allTAs[trigger.extensionname].actions = []
        for (const ar of trigger.actions)
            allTAs[trigger.extensionname].actions.push(createTableRow(ar))
        counters.AllActionsCount += trigger.actions.length
        counters.TotalTACount += trigger.actions.length
    }
    //re-calculate possibilities
    counters.TotalTAPossibilities = counters.AllActionsCount * counters.AllTriggersCount
}
// ============================================================================
//                           createReadmeFiles
// ============================================================================
function createReadmeFiles ()
{
    //loop each extension
    for (var ext of Object.keys(allTAs)) 
    {

        let allExtTriggers = "";
        let allExtActions = "";
        // loop each set of triggers
        if (allTAs[ext].triggers)
        {
            for (const tr of allTAs[ext].triggers)
                allExtTriggers += tr
        }
        // loop each set of actions
        if (allTAs[ext].actions)
        {
            for (const ar of allTAs[ext].actions)
                allExtActions += ar
        }

        let partFileName = extRoot + ext + "/README.part";
        // only update if we have a README.part file and it has tags to update
        try
        {
            let partFile = fs.readFileSync(partFileName, { encoding: 'utf8', flag: 'r' })
            if (partFile && readmeTAGs.some(v => 
            {
                partFile.includes(v)

            }))
            {
                if (partFile && partFile != "")
                {
                    let datestamp = new Date().toUTCString();
                    partFile = partFile.replace("ReplaceTAGForTriggersUpdatedDocTime", "\n\nTriggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.\n\nTable last updated: *" + datestamp + "*");
                    partFile = partFile.replace("ReplaceTAGForTriggers", header + "\n" + hdivider + "\n" + allExtTriggers)
                    partFile = partFile.replace("ReplaceTAGForActions", header + "\n" + hdivider + "\n" + allExtActions)
                    //replace any of the common tags (ie trigger counts etc)
                    replaceCommonTags(partFile);
                    const filename = extRoot + ext + "/README.md";
                    fs.writeFileSync(filename, partFile, {
                        encoding: "utf8"
                    })
                    filesUpdated.push(filename)
                }
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
// ============================================================================
//                           writefileslist
// ============================================================================
function writefileslist ()
{
    filesUpdated.forEach((f) =>
    {
        console.log("files written", f)
        fs.writeFileSync("filelist.txt", filesUpdated.join('\n'), {
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
// ============================================================================
//                           parseManualFiles
// ============================================================================
async function parseManualFiles ()
{
    let folder = __dirname + "\\handParsedTriggers"
    const files = fs.readdirSync(folder, { withFileTypes: true });
    for (const file of files)
    {
        console.log(folder + "\\" + file.name)
        let tempTriggerActions = fs.readFileSync(folder + "\\" + file.name, 'utf8', function (err, data)
        {
            if (err) 
            {
                console.log("Error loading manual trigger/action file", JSON.stringify(err.null, 2))
                return null
            }
            else
                return (data);
        });

        if (tempTriggerActions)
        {
            tempTriggerActions = JSON.parse(tempTriggerActions)
            manualParseTrigger(tempTriggerActions);
        }
    }
    //create the manual files
    createAllTriggerReadme();
}
// ============================================================================
//                           parseTrigger
// ============================================================================
/**
 * Parse a manually loaded extension trigger variable
 * @param {object} extTAvar 
 * @returns 
 */
function manualParseTrigger (extTAvar)
{
    if (!extTAvar.extensionname)
        return;
    console.log("\x1b[1m\x1b[32mFound Manual triggers for:", extTAvar.extensionname, "\x1b[0m")

    if (!allTAs[extTAvar.extensionname])
        allTAs[extTAvar.extensionname] = []

    // build trigger strings up
    if (extTAvar.triggers)
    {
        if (!allTAs[extTAvar.extensionname].triggers)
            allTAs[extTAvar.extensionname].triggers = []
        for (const t of extTAvar.triggers)
            allTAs[extTAvar.extensionname].triggers.push(createTableRow(t))
        counters.AllTriggersCount += extTAvar.triggers.length
        counters.TotalTACount += extTAvar.triggers.length
    }
    // build actions string up
    if (extTAvar.actions)
    {
        if (!allTAs[extTAvar.extensionname].actions)
            allTAs[extTAvar.extensionname].actions = []
        for (const t of extTAvar.actions)
            allTAs[extTAvar.extensionname].actions.push(createTableRow(t))
        counters.AllActionsCount += extTAvar.actions.length
        counters.TotalTACount += extTAvar.actions.length
    }
    //re-calculate possibilities
    counters.TotalTAPossibilities = counters.AllActionsCount * counters.AllTriggersCount
}
// ============================================================================
//                           createAllTriggerReadme
// ============================================================================
function createAllTriggerReadme ()
{
    // A bit long winded way of doing this but it makes it so much easier to read :P
    // embedded replacement strings (ie 'ReplaceTAGForAllActionsCount') will be updated after building the page
    let TOCHead = "# All Triggers currently in Streamroller\n\n"
    TOCHead += "## Overview\n\n"
    TOCHead += "### Current count (ReplaceTAGForTotalTACount)\n\n"
    TOCHead += "```Triggers: ReplaceTAGForAllTriggersCount / Actions: ReplaceTAGForAllActionsCount```\n\n"
    TOCHead += "Contents\n\n"
    TOCHead += "- [All Triggers currently in Streamroller](#all-triggers-currently-in-streamroller)\n"
    TOCHead += "  - [Overview](#overview)\n"
    TOCHead += "    - [Current count](#current-count)\n"
    TOCHead += "  - [Description](#description)\n"
    TOCHead += "  - [Triggers/Actions](#triggersactions)\n"
    let TOCTriggersList = ""
    let Body = "## Description\n\n"
    Body += "Triggers and actions below are updated when the automatic document generation system is run and only contain triggers actions relating to this specific extension.\n"
    Body += "Some triggers and action have to be manually parsed as they are dynamic (ie the thousands that are generated for MSFS2020)\n\n"
    Body += `Table last updated: *${new Date().toUTCString()}*`
    Body += "## Extensions\n\n"

    // need to build up the page, we want each extensions to have a triggers and an actions table, each with a header. Plus the description block at the top of each pair of tables
    for (var ext of Object.keys(allTAs)) 
    {

        let allExtTriggers = "";
        let allExtActions = "";
        TOCTriggersList += `    - [${ext}](#${ext})\n`

        // collate the rows for each table
        if (allTAs[ext].triggers)
        {
            for (const tr of allTAs[ext].triggers)
                allExtTriggers += tr
        }
        if (allTAs[ext].actions)
        {
            for (const ar of allTAs[ext].actions)
                allExtActions += ar
        }
        Body += `## ${ext}\n\n`
        Body += "### Triggers\n\n"
        Body += `${header}\n${hdivider}\n${allExtTriggers}`
        Body += "### Actions\n\n"
        Body += `${header}\n${hdivider}\n${allExtActions}`
    }

    let fileString = TOCHead + TOCTriggersList + Body
    fileString = replaceCommonTags(fileString)
    const filename = __dirname + "/../../README_All_TRIGGERS.md"
    fs.writeFileSync(filename, fileString, { encoding: "utf8" })
    filesUpdated.push(filename)
}
// ============================================================================
//                           replaceCommonTags
// ============================================================================
/**
 * Replaces and of the common tags in the string provided
 * @param {string} readme 
 * @returns readme updated with tag values
 */
function replaceCommonTags (readme)
{
    readme = readme.replaceAll("ReplaceTAGForAllTriggersCount", numberWithCommas(counters.AllTriggersCount))
    readme = readme.replaceAll("ReplaceTAGForAllActionsCount", numberWithCommas(counters.AllActionsCount))
    readme = readme.replaceAll("ReplaceTAGForTotalTACount", numberWithCommas(counters.TotalTACount))
    readme = readme.replaceAll("ReplaceTAGForTotalTAPossibilities", numberWithCommas(counters.TotalTAPossibilities))
    return readme
}
// ============================================================================
//                           createTableRow
// ============================================================================
function createTableRow (ele)
{
    return `| ${ele.name} | ${ele.messagetype} | ${ele.description} |\n`
}
// ============================================================================
//                           createTableRow
// ============================================================================
function updateRootReadme ()
{
    // read part file
    let readmePartFileString = fs.readFileSync(__dirname + "/../../README.part", 'utf8')

    // update placeholders
    /*let replacementString = "Current user configurable Trigger / Action available: ```" + numberWithCommas(counters.TotalTACount) + " ```\n\n"
    replacementString += "No. of possible combinations for a single trigger->action ```" + numberWithCommas(counters.TotalTAPossibilities) + " ```\n\n"
    replacementString += "No. of possible chained commands ```infinite```"
    readmePartFileString = readmePartFileString.replace("ReplaceTAGForTotalTACount", replacementString)*/
    readmePartFileString = replaceCommonTags(readmePartFileString);
    // write README.md file
    const filename = __dirname + "/../../README.md"
    fs.writeFileSync(__dirname + "/../../README.md", readmePartFileString, { encoding: "utf8" })
    filesUpdated.push(filename)
}
// ============================================================================
//                           numberWithCommas
// ============================================================================
function numberWithCommas (x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// parse the js files in the project
await parseExtensions()
// parse the manual files from handParsedTriggers folder
await parseManualFiles()
// Update the root file for the repo
updateRootReadme()
// write the filelist.text of files we have changed so they can be checked in.
writefileslist()
// log some interesting stats :P
console.log("All Triggers count", counters.AllTriggersCount)
console.log("All ACtions count", counters.AllActionsCount)
