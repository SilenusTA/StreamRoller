/**
 * Copyright (C) 2025 "SilenusTA https://www.twitch.tv/olddepressedgamer"
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
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
//////////////////////////////////////////////////////////////////////
////////////////////////////processTag////////////////////////////////
//////////////////////////////////////////////////////////////////////
function processTag (doclet, tag, dictionary)
{
    if (!doclet.extensions)
        doclet.extensions = [];
    var extname = tag.value.name;

    doclet.kind = "extension";
    doclet.name = extname;
    doclet.longname = extname;
    doclet.scope = "extension";
    doclet.description = tag.value.description || '';
    doclet.type = tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : '';
    return doclet;
}
//////////////////////////////////////////////////////////////////////
////////////////////////////defineTags////////////////////////////////
//////////////////////////////////////////////////////////////////////
exports.defineTags = function (dictionary)
{
    // define tags here
    dictionary.defineTag("extension",
        {
            mustHaveValue: true,
            mustNotHaveDescription: false,
            canHaveType: false,
            canHaveName: true,
            needsSignature: true,
            isNamespace: true,
            onTagged: function (doclet, tag)
            {
                doclet = processTag(doclet, tag, dictionary);
            }
        }
    );
};
//////////////////////////////////////////////////////////////////////
////////////////////////////newDoclet/////////////////////////////////
//////////////////////////////////////////////////////////////////////
exports.handlers = {
    newDoclet: function (e)
    {
        if (e.doclet.extensions)
            e.doclet.description = `${e.doclet.description}Some other text for extensions`;
    }
};
