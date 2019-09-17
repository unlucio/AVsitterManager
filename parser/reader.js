const _ = require('lodash');

function getTopMenuName(str) {
    return str.split('◆TOMENU ')[1];
}

function getMenuName(str) {
    return str.split('◆MENU ')[1];
}

function getPose(str, type = 'pose') {
    const pose = str.split('◆POSE ')[1] || str.split('◆SYNC ')[1];
    const [name, anim] = pose.split('|');
    return {name, anim, type};
}

function parsePosition(str) {
    str = str.replace('◆{', '');
    const [name, coordinates] = str.split('}');

    return {name, coordinates};
}

function setPosePosition(menuDefinition, {name, coordinates}) {
    _.forEach(menuDefinition, (entry, entryName) => {
        if (entry.type !== 'menu' && entry.name === name) {
            entry.coordinates = coordinates;
        }

        if (entry.type === 'menu') {
            const newEntry =  setPosePosition(entry, {name, coordinates});
            menuDefinition[entryName] = newEntry;
        }
    })

    return menuDefinition;
}

function notecardToJson(lines) {
    var currentMenuPath = [];

    return lines.reduce((result, line, index) => {

        if (line.includes('◆{')) {
            const position = parsePosition(line);
            result = setPosePosition(result, position);
        }

        if (line.includes('◆MENU')) {
            const currentMenu = getMenuName(line);
            const entry = _.get(result, `${currentMenuPath.join('.')}.${currentMenu}`, {})
            if (entry.type !== 'menu') {
                currentMenuPath = [];
            }

            currentMenuPath.push(currentMenu);
        }

        if (line.includes('◆POSE')) {
            const pose = getPose(line);
            const path = `${currentMenuPath.join('.')}.${pose.name}`
            _.set(result, path, pose);
        }

        if (line.includes('◆SYNC')) {
            const pose = getPose(line, 'sync');
            const path = `${currentMenuPath.join('.')}.${pose.name}`
            _.set(result, path, pose);
        }

        if (line.includes('◆TOMENU')) {
            const menuName = getTopMenuName(line);
            if ( currentMenuPath.length < 1) {
                result[menuName] = result[menuName] || {type: 'menu'};
            } else {
                const path = `${currentMenuPath.join('.')}.${menuName}`;
                const value = _.get(result, path, {type: 'menu'});
                _.set(result, path, value);
            }
        }

        return result;
    }, {});
}

module.exports = {
    notecardToJson
}