const { PathManager, ConfigManager } = require('../../config');

/**
 * @description Sets up the env manager by creating the necessary folders and files
 * @param {Object} options
 * @param {Boolean} options.verbose - If true, prints out the steps taken to setup the env manager
 * @returns {void}
 */
module.exports = function setup(options = { verbose: false }) {
    PathManager.setup(options);
    ConfigManager.setup(options);
};
