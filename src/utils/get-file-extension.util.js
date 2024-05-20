const fs = require('fs');

module.exports = function getFileExtension(filename) {
    return filename.split('.').pop();
};
