const fs = require('fs');
const path = require('path');

const readWhole = (fileName) => {
    try {
        return fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8').split(/\r?\n/);
    } catch (err) {
        console.error(err);
    }
}

const readSection = (fileName, readType, typeName) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');

        const lines = data.split(/\r?\n/);

        let isReading = false;
        let allLines = [];  

        lines.forEach((line) => {
            if(line == `//${readType} ${typeName}`) {
                isReading = !isReading;
                if(isReading == false) {
                    allLines.push(line);
                }
            }
            if(isReading == true) {
                allLines.push(line);
            }
        })
        return allLines;
    } catch (err) {
        console.error(err);
    }
}

const insertAfter = (fileName, readType, typeName, insertable) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');

        let lines = data.split(/\r?\n/);
        
        let selectLinesIndex = [];
        let lineCount = 0;

        lines.forEach((line, index) => {
            if(line == `//${readType} ${typeName}`) {
                selectLinesIndex.push(index);
            }
        })
        lineCount = selectLinesIndex[1] - selectLinesIndex[0] + 1;
        for (let x = 0; x < lineCount; x++) {
            delete lines[selectLinesIndex[0] + x ];
        }
        lines = lines.filter(e => e);

        for (let x = 0; x < insertable.length; x++) {
            lines.splice(selectLinesIndex[0] + x, 0, insertable[x]);
        }
        let finalString = lines.join('\r\n');
        fs.writeFileSync(path.resolve(__dirname, fileName), finalString)
        return;
    } catch (err) {
        console.error(err);
    }

}

const insertNewApi = (fileName, collectioName, insertable) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');

        let lines = data.split(/\r?\n/);

        let selectLinesIndex = [];
        let isReading = false;

        lines.forEach((line, index) => {
            word = line.split(" ");
            if(line == `//COLLECTION ${collectioName}`) {
                isReading = !isReading;
            }
            if(isReading == true && word[0] == "//API") {
                selectLinesIndex[0] = index + 1;
            }
            else if(isReading == true) {
                selectLinesIndex[0] = index;
            }
        })
        for(let x = 0; x < insertable.length; x++) {
            lines.splice(selectLinesIndex[0] + x, 0, insertable[x]);
        }
        lines = lines.filter(e => e);
        let finalString = lines.join('\r\n');
        fs.writeFileSync(path.resolve(__dirname, fileName), finalString)
        return; 
    } catch (err) {
        console.error(err);
    }
}

const getNames = (fileName, readType) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');

        let lines = data.split(/\r?\n/);

        let selectLines = [];
        let word = [];

        lines.forEach((line) => {
            word = line.split(" ");
            if(word[0] == `//${readType}`) {
                selectLines.push(word[1]);
            }
        })
        let finalSelection = [...new Set(selectLines)]
        return finalSelection
    } catch (err) {
        console.error(err);
    }
}

const addCollection = (fileName, collectionName, type, apiColName) => {
    try {
        const data = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8');

        let lines = data.split(/\r?\n/);

        let selectLinesIndex = [];
        let isReading = false;

        lines.forEach((line, index) => {
            word = line.split(" ");
            if(word[0] == `//${type}` && type != "API") {
                selectLinesIndex[0] = index + 1;
            }
            else {
                if(line == `//COLLECTION ${apiColName}`) {
                    isReading = !isReading;
                }
                if(word[0] == `//${type}` && isReading == true) {
                    selectLinesIndex[0] = index + 1;
                }
                else if(isReading == true) {
                    selectLinesIndex[0] = index + 1;
                } 
            }
        })
        let newCollection = `//${type} ${collectionName}`;

        for(let x = 0; x < 2; x++) {
            lines.splice(selectLinesIndex[0] + x, 0, newCollection);
        }
        lines = lines.filter(e => e);
        let finalString = lines.join('\r\n');
        fs.writeFileSync(path.resolve(__dirname, fileName), finalString)
        return;
    } catch (err) {

    }
}

module.exports = {
    readWhole,
    readSection,
    insertAfter,
    insertNewApi,
    getNames,
    addCollection
}