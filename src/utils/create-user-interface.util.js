const readline = require('node:readline/promises');

module.exports = function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
};
