const _ = require('lodash');
const loadMenu = require('./loadMenu');
const sitterMenu = require('./sitterMenu');
const header = `◆MTYPE 1
◆
`;
const nl = '◆\n';

const [interpreter, script, sourceName, howMany = 1] = process.argv;
const count = parseInt(howMany);
// console .log({interpreter, script, sourceName, count})
function getSitter(counter) {
    return `◆SITTER ${counter}|\n`;
}
const { menu, animations } = loadMenu(sourceName);

function getSittersMenus(limit) {
    var arr = Array(limit).fill(1);

    const sitters = arr.map((value, index) => {
        return getSitter(index) + sitterMenu(menu, animations, index + 1)
    });

    return sitters.join(nl);
}

var notecard = header + getSittersMenus(count);
console.log(notecard);