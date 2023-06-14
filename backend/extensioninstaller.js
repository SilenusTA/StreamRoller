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
import fs from "fs";
import child_process from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const path = dirname(fileURLToPath(import.meta.url));
const root = process.cwd() + "/../extensions";
npm_install_recursive(root);
//npm_install_recursive(root + "/datahandlers");

function npm_install_recursive (folder)
{
    console.log(folder);
    for (let subfolder of subfolders(folder))
    {
        const has_package_json = fs.existsSync(subfolder + '/package.json')

        // Since this script is intended to be run as a "preinstall" command,
        // skip the root folder, because it will be `npm install`ed in the end.
        if (has_package_json)
        {
            console.log('===================================================================')
            console.log(`Performing "npm install" inside `, subfolder)
            console.log('===================================================================')

            npm_install(subfolder)
        }
    }
}

function npm_install (where)
{
    child_process.execSync('npm install', { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders (folder)
{
    return fs.readdirSync(folder)
        .filter(subfolder => fs.statSync(folder + "/" + subfolder).isDirectory())
        .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
        .map(subfolder => (folder + "/" + subfolder))
} 