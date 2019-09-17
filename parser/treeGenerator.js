const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const reader = require('./reader');

const [interpreter, script, sourceName] = process.argv
const rootFolder = `menu`;

function getPath(name, basePath = __dirname) {
    return path.join(basePath, name);
}
function crateDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true})
    }
}

function createMenuEntry(name, entry, basePath) {
    const menuPath = getPath(name, basePath);
        crateDir(menuPath);
        _.forEach(entry, (subEntry, name) => createMenu(subEntry, name, menuPath))
}

function createPoseFile(name, entry, basePath) {
    const filePath = getPath(`${name}.json`, basePath);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(entry))
    }
}

function createSyncPoseFile(name, entry, basePath) {
    const filePath = getPath(`${name}.json`, basePath);
    var fileContent = {};
    if (fs.existsSync(filePath)) {
        var file = fs.readFileSync(filePath).toString();
        fileContent = JSON.parse(file);
    }

    if (_.isEmpty(fileContent)) {
        fileContent.a = entry;
    } else {
        fileContent.b = entry;
        fileContent.type = 'sync';
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent))
}


function createMenu(entry, name, basePath = rootPath) {    
    if (entry.type === 'menu') {
        createMenuEntry(name, entry, basePath)
    }

    if (entry.type === 'pose') {
        createPoseFile(name, entry, basePath)
    }

    if (entry.type === 'sync') {
        createSyncPoseFile(name, entry, basePath)
    }
}

const rootPath = getPath(rootFolder);
crateDir(rootPath);
const source = fs.readFileSync(sourceName).toString();
const lines = source.split('\n');
const output = reader.notecardToJson(lines);

_.forEach(output, (entry, name) => createMenu(entry, name));
