const { parse, populate } = require('dotenv');

function exportFromEnv(vars) {
    return {
        transformedData: parse(vars),
        extension: 'json'
    };
}

function importToEnv(vars) {
    return {
        transformedData: populate(vars),
        extension: 'env'
    };
}

module.exports = {
    exportFromEnv,
    importToEnv
};
