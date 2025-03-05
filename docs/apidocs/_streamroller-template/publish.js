const doop = require("jsdoc/util/doop");
const env = require("jsdoc/env");
const fs = require("jsdoc/fs");
const helper = require("jsdoc/util/templateHelper");
const logger = require("jsdoc/util/logger");
const path = require("jsdoc/path");
const { taffy } = require("@jsdoc/salty");
const template = require("jsdoc/template");
const util = require("util");
const readme = require("jsdoc/readme");

const htmlsafe = helper.htmlsafe;
const linkto = helper.linkto;
const resolveAuthorLinks = helper.resolveAuthorLinks;
const hasOwnProp = Object.prototype.hasOwnProperty;
let data;
let view;
let extensionRootPaths = [];

let outdir = path.normalize(env.opts.destination);
//################################################
//#################### find ######################
//################################################
function find (spec)
{
    return helper.find(data, spec);
}
//################################################
//############### tutoriallink ###################
//################################################
function tutoriallink (tutorial)
{
    return helper.toTutorial(tutorial, null, {
        tag: "em",
        classname: "disabled",
        prefix: "Tutorial: ",
    });
}
//################################################
//########### getAncestorLinks ###################
//################################################
function getAncestorLinks (doclet)
{
    return helper.getAncestorLinks(data, doclet);
}
//################################################
//################ hashToLink ####################
//################################################
function hashToLink (doclet, hash)
{
    let url;

    if (!/^(#.+)/.test(hash))
    {
        return hash;
    }
    url = helper.createLink(doclet);
    url = url.replace(/(#.+|$)/, hash);
    return `<a href="${url}">${hash}</a>`;
}
//################################################
//############ needsSignature ####################
//################################################
function needsSignature ({ kind, type, meta })
{
    let needsSig = false;
    // function and class definitions always get a signature
    if (kind === "function" || kind === "class")
        needsSig = true;
    // typedefs that contain functions get a signature, too
    else if (kind === "typedef" && type && type.names && type.names.length)
    {
        for (let i = 0, l = type.names.length; i < l; i++)
        {
            if (type.names[i].toLowerCase() === "function")
            {
                needsSig = true;
                break;
            }
        }
    }
    // and namespaces that are functions get a signature (but finding them is a
    // bit messy)
    else if (
        kind === "namespace" &&
        meta &&
        meta.code &&
        meta.code.type &&
        meta.code.type.match(/[Ff]unction/)
    )
    {
        needsSig = true;
    }

    return needsSig;
}
//################################################
//######### getSignatureAttributes ###############
//################################################
function getSignatureAttributes ({ optional, nullable })
{
    const attributes = [];
    if (optional)
        attributes.push("opt");
    if (nullable === true)
        attributes.push("nullable");
    else if (nullable === false)
        attributes.push("non-null");
    return attributes;
}
//################################################
//############### updateItemName #################
function updateItemName (item)
{
    const attributes = getSignatureAttributes(item);
    let itemName = item.name || "";
    if (item.variable)
        itemName = `&hellip;${itemName}`;
    if (attributes && attributes.length)
    {
        itemName = util.format(
            '%s<span class="signature-attributes">%s</span>',
            itemName,
            attributes.join(", ")
        );
    }
    return itemName;
}
//################################################
//############# addParamAttributes################
//################################################
function addParamAttributes (params)
{
    return params
        .filter(({ name }) => name && !name.includes("."))
        .map(updateItemName);
}
//################################################
//############ buildItemTypeStrings ##############
//################################################
function buildItemTypeStrings (item)
{
    const types = [];
    if (item && item.type && item.type.names)
    {
        item.type.names.forEach((name) =>
        {
            types.push(linkto(name, htmlsafe(name)));
        });
    }
    return types;
}
//################################################
//############# buildAttribsString ###############
//################################################
function buildAttribsString (attribs)
{
    let attribsString = "";
    if (attribs && attribs.length)
        attribsString = htmlsafe(util.format("(%s) ", attribs.join(", ")));

    return attribsString;
}
//################################################
//########### addNonParamAttributes ##############
//################################################
function addNonParamAttributes (items)
{
    let types = [];
    items.forEach((item) =>
    {
        types = types.concat(buildItemTypeStrings(item));
    });
    return types;
}
//################################################
//############## addSignatureParams ##############
//################################################
function addSignatureParams (f)
{
    const params = f.params ? addParamAttributes(f.params) : [];
    f.signature = util.format("%s(%s)", f.signature || "", params.join(", "));
}
//################################################
//############# addSignatureReturns ##############
//################################################
function addSignatureReturns (f)
{
    const attribs = [];
    let attribsString = "";
    let returnTypes = [];
    let returnTypesString = "";
    const source = f.yields || f.returns;
    // jam all the return-type attributes into an array. this could create odd results (for example,
    // if there are both nullable and non-nullable return types), but let's assume that most people
    // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
    if (source)
    {
        source.forEach((item) =>
        {
            helper.getAttribs(item).forEach((attrib) =>
            {
                if (!attribs.includes(attrib))
                {
                    attribs.push(attrib);
                }
            });
        });
        attribsString = buildAttribsString(attribs);
    }
    if (source)
        returnTypes = addNonParamAttributes(source);
    if (returnTypes.length)
    {
        returnTypesString = util.format(
            " &rarr; %s{%s}",
            attribsString,
            returnTypes.join("|")
        );
    }

    f.signature = `<span class="signature">${f.signature || ""
        }</span><span class="type-signature">${returnTypesString}</span>`;
}
//################################################
//############## addSignatureTypes ###############
//################################################
function addSignatureTypes (f)
{
    const types = f.type ? buildItemTypeStrings(f) : [];
    f.signature = `${f.signature || ""}<span class="type-signature">${types.length ? ` :${types.join("|")}` : ""
        }</span>`;
}
//################################################
//################# addAttribs ###################
//################################################
function addAttribs (f)
{
    let attribs = helper.getAttribs(f);
    // remove the attributes (return value in brackets)
    // if it is of scope "extension" as this isn't really 
    // what we expect (we are displaying on the extension page)
    // Ideally we should be using something other than scope but
    // can't be arsed to change it now. mabe a TBD
    if (attribs.includes("extension"))
    {
        attribs = attribs.filter(function (item)
        {
            return item !== "extension"
        })

    }
    const attribsString = buildAttribsString(attribs);
    if (attribsString != "")
    {
        f.attribs = util.format(
            '<span class="type-signature">%s</span>',
            attribsString
        );
    }

}
//################################################
//############### shortenPaths ###################
//################################################
function shortenPaths (files, commonPrefix)
{
    Object.keys(files).forEach((file) =>
    {
        files[file].shortened = files[file].resolved
            .replace(commonPrefix, "")
            // always use forward slashes
            .replace(/\\/g, "/");
    });
    return files;
}
//################################################
//############# getPathFromDoclet ################
//################################################
function getPathFromDoclet ({ meta })
{
    if (!meta)
        return null;
    return meta.path && meta.path !== "null"
        ? path.join(meta.path, meta.filename)
        : meta.filename;
}
//################################################
//################# generate #####################
//################################################
function generate (title, docs, filename, resolveLinks)
{
    let docData;
    let html;
    let outpath;
    resolveLinks = resolveLinks !== false;
    //if (title == "StreamRoller")
    docData = {
        env: env,
        title: title,
        docs: docs,
    };
    outpath = path.join(outdir, filename);
    html = view.render("container.tmpl", docData);
    if (resolveLinks)
        html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>
    fs.writeFileSync(outpath, html, "utf8");
}
//###########################################################
//################# generateSourceFiles #####################
//###########################################################
function generateSourceFiles (sourceFiles, encoding = "utf8")
{
    Object.keys(sourceFiles).forEach((file) =>
    {
        let source;
        // links are keyed to the shortened path in each doclet's `meta.shortpath` property
        const sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened);
        helper.registerLink(sourceFiles[file].shortened, sourceOutfile);
        try
        {
            source = {
                kind: "source", code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding)),
            };
        } catch (e)
        {
            logger.error("Error while generating source file %s: %s", file, e.message);
        }
        generate(`Source: ${sourceFiles[file].shortened}`, [source], sourceOutfile, false);
    });
}
//###########################################################
//################# attachModuleSymbols #####################
//###########################################################
/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
 * check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
 */
function attachModuleSymbols (doclets, modules)
{
    const symbols = {};
    // build a lookup table
    doclets.forEach((symbol) =>
    {
        symbols[symbol.longname] = symbols[symbol.longname] || [];
        symbols[symbol.longname].push(symbol);
    });

    modules.forEach((module) =>
    {
        if (symbols[module.longname])
        {
            module.modules = symbols[module.longname]
                // Only show symbols that have a description. Make an exception for classes, because
                // we want to show the constructor-signature heading no matter what.
                .filter(
                    ({ description, kind }) =>
                        description || kind === "class"
                )
                .map(symbol =>
                {
                    // get a deep clone of the object
                    symbol = doop(symbol);
                    if (symbol.kind === "class" || symbol.kind === "function")
                        symbol.name = `${symbol.name.replace("module:", '(require("')}"))`;

                    return symbol;
                });
        }
    });
}
//######################################################
//################# buildMemberNav #####################
//######################################################
function buildMemberNav (items, itemHeading, itemsSeen, linktoFn)
{
    let nav = "";
    if (items.length)
    {
        let itemsNav = "";
        items.forEach((item) =>
        {
            let displayName;
            // extension items will go into the extension pages
            // so skip them here and only show the extensions themselves
            if (itemHeading == "Extensions" && item.extensionname == undefined)
                return "";
            if (!hasOwnProp.call(item, "longname"))
                itemsNav += `<li>${linktoFn("", item.name)}</li>`;
            else if (!hasOwnProp.call(itemsSeen, item.longname))
            {
                if (env.conf.templates.default.useLongnameInNav)
                    displayName = item.longname;
                else
                    displayName = item.name;
                itemsNav += `<li>${linktoFn(
                    item.longname,
                    displayName.replace(/\b(module|event|extension):/g, "")
                )}</li>`;
                itemsSeen[item.longname] = true;
            }
        });
        if (itemsNav !== "")
            nav += `<h3>${itemHeading}</h3><ul>${itemsNav}</ul>`;
    }
    return nav;
}
//######################################################
//################# linktoTutorial #####################
//######################################################
function linktoTutorial (longName, name)
{
    return tutoriallink(name);
}
//######################################################
//################# linktoExternal #####################
//######################################################
function linktoExternal (longName, name)
{
    return linkto(longName, name.replace(/(^"|"$)/g, ""));
}
//######################################################
//#################### buildNav ########################
//######################################################
/**
 * Create the navigation sidebar.
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.extensions
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @param {array<object>} members.interfaces
 * @return {string} The HTML for the navigation sidebar.
 */
function buildNav (members)
{
    let globalNav;
    let nav = '<h2><a href="index.html">StreamRoller</a></h2>';
    const seen = {};
    const seenTutorials = {};
    let extensionDoclets = members.extensions.filter(
        (doclet) => doclet.kind == "extension"
    );

    // build the extensions menu with only extensions listed in it
    nav += buildMemberNav(extensionDoclets, "Extensions", seen, linkto);
    nav += buildMemberNav(members.modules.filter(removeextensionmemebers), "Modules", {}, linkto);
    nav += buildMemberNav(members.externals.filter(removeextensionmemebers), "Externals", seen, linktoExternal);
    nav += buildMemberNav(members.namespaces.filter(removeextensionmemebers), "Namespaces", seen, linkto);
    nav += buildMemberNav(members.classes.filter(removeextensionmemebers), "Classes", seen, linkto);
    nav += buildMemberNav(members.interfaces.filter(removeextensionmemebers), "Interfaces", seen, linkto);
    nav += buildMemberNav(members.events.filter(removeextensionmemebers), "Events", seen, linkto);
    nav += buildMemberNav(members.mixins.filter(removeextensionmemebers), "Mixins", seen, linkto);
    nav += buildMemberNav(
        members.tutorials,
        "Tutorials",
        seenTutorials,
        linktoTutorial
    );
    // Checkfor global pages
    if (members.globals.length)
    {
        globalNav = "";
        members.globals.filter(removeextensionmemebers).forEach(({ kind, longname, name, extensionname }) =>
        {
            if (kind !== "typedef" && !hasOwnProp.call(seen, longname))
            {
                globalNav += `<li>${linkto(longname, name)}</li>`;
            }
            seen[longname] = true;
        });

        if (!globalNav)
            nav += `<h3>${linkto("global", "Global")}</h3>`;
        else
            nav += `<h3>Global</h3><ul>${globalNav}</ul>`;
    }

    return nav;
}
//######################################################
//############ removeextensionmemebers #################
//######################################################
// removes extensions from the list
function removeextensionmemebers (d)
{
    if (d.kind == "extension")
        return true
    else if (d.extensionname == undefined)
        return true
    else
        return false
}
//######################################################
//#################### publish #########################
//######################################################
/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = (taffyData, opts, tutorials) =>
{
    let classes;
    let conf;
    let externals;
    let files;
    let fromDir;
    let globalUrl;
    let indexUrl;
    let interfaces;
    let members;
    let mixins;
    let modules;
    let namespaces;
    let extensions;
    let outputSourceFiles;
    let packageInfo;
    let packages;
    const sourceFilePaths = [];
    let sourceFiles = {};
    let staticFileFilter;
    let staticFilePaths;
    let staticFiles;
    let staticFileScanner;
    let templatePath;

    data = taffyData;
    conf = env.conf.templates || {};
    conf.default = conf.default || {};

    templatePath = path.normalize(opts.template);
    view = new template.Template(path.join(templatePath, "tmpl"));

    // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
    // doesn't try to hand them out later
    indexUrl = helper.getUniqueFilename("index");
    // don't call registerLink() on this one! 'index' is also a valid longname

    globalUrl = helper.getUniqueFilename("global");
    helper.registerLink("global", globalUrl);

    // set up templating
    view.layout = conf.default.layoutFile
        ? path.getResourcePath(
            path.dirname(conf.default.layoutFile),
            path.basename(conf.default.layoutFile)
        )
        : "layout.tmpl";
    // set up tutorials for helper
    helper.setTutorials(tutorials);

    data = helper.prune(data);
    data.sort("longname, version, since");
    helper.addEventListeners(data);
    // add doclet extensions list for extension files
    data = add_doclet_extensions_for_StreamRoller(data);

    // create sourefile list sourceFilePaths
    data().each((doclet) =>
    {
        let sourcePath;
        doclet.attribs = '';
        if (doclet.examples)
        {
            doclet.examples = doclet.examples.map((example) =>
            {
                let caption;
                let code;
                if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i))
                {
                    caption = RegExp.$1;
                    code = RegExp.$3;
                }
                return { caption: caption || "", code: code || example, };
            });
        }
        if (doclet.see)
        {
            doclet.see.forEach((seeItem, i) =>
            {
                doclet.see[i] = hashToLink(doclet, seeItem);
            });
        }

        // build a list of source files
        if (doclet.meta)
        {
            sourcePath = getPathFromDoclet(doclet);
            sourceFiles[sourcePath] = {
                resolved: sourcePath,
                shortened: null,
            };
            if (!sourceFilePaths.includes(sourcePath))
                sourceFilePaths.push(sourcePath);
        }
    });

    // update outdir if necessary, then create outdir
    packageInfo = (find({ kind: "package" }) || [])[0];
    if (packageInfo && packageInfo.name)
    {
        outdir = path.join(outdir, packageInfo.name, packageInfo.version || "");
    }
    // create output directory if it doesn't exist
    fs.mkPath(outdir);

    // copy the template's static files to outdir
    fromDir = path.join(templatePath, "static");
    staticFiles = fs.ls(fromDir, 3);

    staticFiles.forEach((fileName) =>
    {
        const toDir = fs.toDir(fileName.replace(fromDir, outdir));
        fs.mkPath(toDir);
        fs.copyFileSync(fileName, toDir);
    });

    // copy user-specified static files to outdir
    if (conf.default.staticFiles)
    {
        // The canonical property name is `include`. We accept `paths` for backwards compatibility
        // with a bug in JSDoc 3.2.x.
        staticFilePaths =
            conf.default.staticFiles.include || conf.default.staticFiles.paths || [];
        staticFileFilter = new (require("jsdoc/src/filter").Filter)(
            conf.default.staticFiles
        );
        staticFileScanner = new (require("jsdoc/src/scanner").Scanner)();

        staticFilePaths.forEach((filePath) =>
        {
            let extraStaticFiles;
            filePath = path.resolve(env.pwd, filePath);
            extraStaticFiles = staticFileScanner.scan(
                [filePath],
                10,
                staticFileFilter
            );
            extraStaticFiles.forEach((fileName) =>
            {
                const sourcePath = fs.toDir(filePath);
                const toDir = fs.toDir(fileName.replace(sourcePath, outdir));
                fs.mkPath(toDir);
                fs.copyFileSync(fileName, toDir);
            });
        });
    }
    if (sourceFilePaths.length)
        sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));

    // create the webpage links including the bookmake part '#'
    data().each((doclet) =>
    {
        let docletPath;
        let url = helper.createLink(doclet);
        // for extensions we need to create our own links 
        // (JSDoc will create the link incorrectly as it doesn't know what an extension is)
        if (doclet.extensionname)
            url = doclet.extensionname + "_extension.html#" + doclet.name;
        helper.registerLink(doclet.longname, url);
        // add a shortened version of the full path
        if (doclet.meta)
        {
            docletPath = getPathFromDoclet(doclet);
            docletPath = sourceFiles[docletPath].shortened;
            if (docletPath)
            {
                doclet.meta.shortpath = docletPath;
            }
        }
    });

    // setup id's add id's
    // create the id's used to link to files
    data().each((doclet) =>
    {

        const url = helper.longnameToUrl[doclet.longname];
        if (url.includes("#"))
            doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
        else
            doclet.id = doclet.name;
        if (needsSignature(doclet))
        {
            addSignatureParams(doclet);
            addSignatureReturns(doclet);
            addAttribs(doclet);
        }
    });

    // do this after the urls have all been generated
    // adding attributes to the signature
    data().each((doclet) =>
    {
        doclet.ancestors = getAncestorLinks(doclet);
        if (doclet.kind === "member")
        {
            addSignatureTypes(doclet);
            addAttribs(doclet);
        }
        if (doclet.extensionname)
        {
            addSignatureTypes(doclet);
            addAttribs(doclet);
        }
        if (doclet.kind === "constant")
        {
            addSignatureTypes(doclet);
            addAttribs(doclet);
            doclet.kind = "member";
        }
    });

    members = helper.getMembers(data);
    members.tutorials = tutorials.children;

    // add the extensions here as it will be needed below.
    members = add_members_extensions_for_StreamRoller(data, members);
    // output pretty-printed source files by default
    outputSourceFiles = conf.default && conf.default.outputSourceFiles !== false;

    // add template helpers
    view.find = find;
    view.linkto = linkto;
    view.resolveAuthorLinks = resolveAuthorLinks;
    view.tutoriallink = tutoriallink;
    view.htmlsafe = htmlsafe;
    view.outputSourceFiles = outputSourceFiles;

    view.nav = buildNav(members);
    // build modules symbols (for some reasons just adds ")) to the end of hte name?!?! )
    attachModuleSymbols(find({ longname: { left: "module:" } }), members.modules);

    // Build the left hand side nav bar Extensions sections with links to pages
    attachModuleSymbols(
        find({ longname: { left: "extension:" } }),
        members.extensions
    );

    // generate the pretty-printed source files first so other pages can link to them
    if (outputSourceFiles)
        generateSourceFiles(sourceFiles, opts.encoding);


    // gerate global page
    if (members.globals.length)
        generate("Global", [{ kind: "globalobj" }], globalUrl);

    files = find({ kind: "file" });
    packages = find({ kind: "package" });
    generate("StreamRoller",
        packages.concat([
            {
                kind: "mainpage",
                readme: opts.readme,
                longname: opts.mainpagetitle ? opts.mainpagetitle : "StreamRoller",
            },
        ]).concat(files),
        indexUrl
    );

    extensions = taffy(members.extensions);
    classes = taffy(members.classes);
    modules = taffy(members.modules);
    namespaces = taffy(members.namespaces);
    mixins = taffy(members.mixins);
    externals = taffy(members.externals);
    interfaces = taffy(members.interfaces);

    // create a page for each extension
    for (let i = 0; i < extensionRootPaths.length; i++)
    {
        let extUrl = helper.getUniqueFilename(extensionRootPaths[i].name + "\\extension");
        helper.registerLink(extensionRootPaths[i].name, extUrl);
        extUrl = helper.longnameToUrl[extensionRootPaths[i].name]

        // build the nav bar extensions list. only add one link for each extension.
        const loop_extension = helper.find(extensions, { extensionname: extensionRootPaths[i].name });

        // move the extension tag to start of the array so we can use the first ele
        // for the title of the page and add the readme.md from the extensions root
        for (let j = 0; j < loop_extension.length; j++)
        {
            if (loop_extension[j].kind == "extension")
            {
                //let readme = helper.htmlsafe(fs.readFileSync(extensionRootPaths[i].rootPath + "\\readme.md"))
                let readMarkdown;
                try
                {
                    readMarkdown = new readme(extensionRootPaths[i].rootPath + "/README.md")
                }
                catch (e)
                {
                    console.log("No readme found for extension", extensionRootPaths[i].rootPath)
                }
                if (readMarkdown != undefined)
                    loop_extension[j].readme = readMarkdown.html;
                arraymove(loop_extension, j, 0)
            }
        }
        //add link back to home to the page      
        view.nav = '<h2><a href="index.html">StreamRoller Extension</a></h2>' + buildMemberNav(loop_extension, extensionRootPaths[i].name, {}, linkto);
        //generate the extension page
        generate(
            extensionRootPaths[i].name,
            loop_extension,
            extUrl
        );
    }

    // looping all tags in the codebase
    Object.keys(helper.longnameToUrl).forEach((longname) =>
    {
        // extensions added in another place so skip them here
        const myClasses = helper.find(classes, { longname: longname });
        const myExternals = helper.find(externals, { longname: longname });
        const myInterfaces = helper.find(interfaces, { longname: longname });
        const myMixins = helper.find(mixins, { longname: longname });
        const myModules = helper.find(modules, { longname: longname });
        const myNamespaces = helper.find(namespaces, { longname: longname });

        if (myModules.length)
            generate(
                `Module: ${myModules[0].name}`,
                myModules,
                helper.longnameToUrl[longname]
            );
        if (myClasses.length)
            generate(
                `Class: ${myClasses[0].name}`,
                myClasses,
                helper.longnameToUrl[longname]
            );
        if (myNamespaces.length)
            generate(
                `Namespace: ${myNamespaces[0].name}`,
                myNamespaces,
                helper.longnameToUrl[longname]
            );
        if (myMixins.length)
            generate(
                `Mixin: ${myMixins[0].name}`,
                myMixins,
                helper.longnameToUrl[longname]
            );
        if (myExternals.length)
            generate(
                `External: ${myExternals[0].name}`,
                myExternals,
                helper.longnameToUrl[longname]
            );
        if (myInterfaces.length)
            generate(
                `Interface: ${myInterfaces[0].name}`,
                myInterfaces,
                helper.longnameToUrl[longname]
            );

    });

    // TODO: move the tutorial functions to templateHelper.js
    function generateTutorial (title, tutorial, filename)
    {
        const tutorialData = {
            title: title,
            header: tutorial.title,
            content: tutorial.parse(),
            children: tutorial.children,
        };
        const tutorialPath = path.join(outdir, filename);

        let html = view.render("tutorial.tmpl", tutorialData);

        // yes, you can use {@link} in tutorials too!
        html = helper.resolveLinks(html); // turn {@link foo} into <a href="foodoc.html">foo</a>

        fs.writeFileSync(tutorialPath, html, "utf8");
    }

    // tutorials can have only one parent so there is no risk for loops
    function saveChildren ({ children })
    {
        children.forEach((child) =>
        {
            generateTutorial(
                `Tutorial: ${child.title}`,
                child,
                helper.tutorialToUrl(child.name)
            );
            saveChildren(child);
        });
    }
    saveChildren(tutorials);
};

//################################################
//###add_doclet_extensions_for_StreamRoller######
//################################################
function add_doclet_extensions_for_StreamRoller (data)
{
    //check for @extension tags name and store the root folder and name
    data().each((doclet) =>
    {
        // all files in/below this folder are considered part of this extension
        if (doclet.kind == "extension")
            extensionRootPaths.push({
                name: doclet.name,
                rootPath: doclet.meta.path,
            });
    });
    data().each((doclet) =>
    {
        let extNameAndFolder;
        if (doclet.meta)
        {
            extNameAndFolder = extensionRootPaths.find(
                (e) =>
                {                    // is it an exact match?
                    if (doclet.meta.path == e.rootPath)
                        return true;
                    //check for partial match
                    else if (doclet.meta.path.indexOf(e.rootPath + "\\") == 0)
                        return true;
                    else
                        return false;
                    //return doclet.meta.path.indexOf(e.rootPath) == 0
                }
            );
        }
        if (extNameAndFolder)
        {
            let extensionPrefix = extNameAndFolder.name + ":"
            let newlongname = doclet.longname;
            // only modify longname if it hasn't been set yet
            if (doclet.longname.indexOf(extensionPrefix) != 0)
                newlongname = extensionPrefix + doclet.longname;
            doclet.longname = newlongname;
            doclet.extensionname = extNameAndFolder.name;
        }
    });
    return data;
}
//################################################
//###add_members_extensions_for_StreamRoller######
//################################################
function add_members_extensions_for_StreamRoller (data, members)
{
    //no idea how to get extensions tag data in so we are hacking it in here
    if (!members.extensions) members.extensions = [];

    data().each((doclet) =>
    {
        let extNameAndFolder;
        if (doclet.meta)
            extNameAndFolder = extensionRootPaths.find(
                (e) => doclet.meta.path.indexOf(e.rootPath) == 0
            );
        if (extNameAndFolder)
            members.extensions.push(structuredClone(doclet));
    });
    return members;
}
//################################################
//#################arraymove######################
//################################################
function arraymove (arr, fromIndex, toIndex)
{
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}