const { PathManager } = require('../../config');
const { execSync } = require('child_process');

/**
 * @description Opens up VSCode to edit the config file
 * This entire edit function hinges on the assumption that user uses vscode and has `code .` command setup
 * In the future we can change this to support more generic approach
 */
module.exports = async function editConfig() {
    execSync(`code ${PathManager.CONFIG_JSON}`);
};
