const fs = require('fs');
const path = require('path');

const animations = {}

module.exports = function(sourceName) {
    function readDirToMenu(directory, destination, basePath) {
        return directory.reduce((result, entry) => {
            if (entry.isDirectory()) {
                destination[entry.name] = {type: 'menu'};
                const dirPath = path.join(basePath, entry.name)
                const dirContent = fs.readdirSync(dirPath, {withFileTypes: true});
                destination[entry.name] = readDirToMenu(dirContent, destination[entry.name], dirPath);
            }
    
            if (entry.isFile()) {
                const filepath = path.join(basePath, entry.name);
                const fileContent = fs.readFileSync(filepath).toString();
                destination[entry.name.replace('.json', '')] = JSON.parse(fileContent);
                animations[entry.name.replace('.json', '')] = JSON.parse(fileContent);
            }
    
            return result;
        }, destination);
    }
    
    const mainEntryes = fs.readdirSync(sourceName, {withFileTypes: true});
    const menu = readDirToMenu(mainEntryes, {}, sourceName);

    return {menu, animations};
}