// install the dependancies for each of the extensions
import fs from "fs";
import child_process from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const path = dirname(fileURLToPath(import.meta.url));
const root = process.cwd() + "/../extensions";
npm_install_recursive(root);

function npm_install_recursive(folder)
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

function npm_install(where)
{
    child_process.execSync('npm install', { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders(folder)
{
    return fs.readdirSync(folder)
        .filter(subfolder => fs.statSync(folder + "/" + subfolder).isDirectory())
        .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
        .map(subfolder => (folder + "/" + subfolder))
} 