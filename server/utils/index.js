const { readFile, writeFile } = require("fs");

const readJSON = (addr, cb) =>
    readFile(addr, (err, data) => {
        cb(err, JSON.parse(data.toString()));
    });

const writeJSON = (addr, data, cb) => {
    writeFile(addr, JSON.stringify(data), (err) => cb(err));
}

module.exports = {
    readJSON,
    writeJSON
}