const _ = require('lodash');
const sc = '◆';

function genrateToMenuEntries(target) {
    return _.reduce(target, (result, value, name) => {
        if (value.type === 'menu') {
            result += `${sc}TOMENU ${name}\n`;
        }

        return result;
    }, '');
}

function generateSubMenu(target, pick) {
    var subMenusEntries = ''
    var subMenues =  _.reduce(target, (result, value, name) => {
        if (value.type === 'menu') {
            result += `${sc}TOMENU ${name}\n`;
            subMenusEntries += generateMenuEntryes({[name]: value}, pick);
        }
        return result;
    }, '');

    return subMenues + subMenusEntries;
}

function generateMenuEntryes(target, pick, str = '') {
    _.forEach(target, (value, name) => {
        str += `${sc}MENU ${name}\n`;
        str += generatePoseEntries(value);
        str += generateSyncEntries(value, pick);
        str += generateSubMenu(value, pick);
    });

    return str;
}

function generatePoseEntries(target) {
    return _.reduce(target, (result, value, name) => {
        if (value.type === 'pose') {
            result += `${sc}POSE ${name}|${value.anim}\n`;
        }
        return result;
    },'');
}

function generateSyncEntries(target, pick) {
    return _.reduce(target, (result, value, name) => {
        if (value.type === 'sync') {
            const pose = value[pick]
            result += `${sc}SYNC ${name}|${pose.anim}\n`;
        }
        return result;
    },'');
}

function generateAnimationPosition(list, pick) {
    return _.reduce(list, (result, value, name) => {
        if (value.type === 'sync') {
            value = value[pick];
        }

        result += `${sc}{${name}}${value.coordinates}\n`;
        return result;
    }, '');
}

module.exports = function (menu, animations, sequence) {
    const pick = (sequence % 2 > 0) ? 'a' : 'b';
    var notecard = genrateToMenuEntries(menu);
    notecard += generateMenuEntryes(menu, pick);

    notecard += generateAnimationPosition(animations, pick);

    return notecard;
}