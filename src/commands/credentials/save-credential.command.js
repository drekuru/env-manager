/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const { DateTime } = require('luxon');
const Utils = require('../../utils');

/**
 * @description Saves the credentials to the config file
 * @param {Object} creds - The credentials to save
 * @param {String=} location - The location to save the credentials under
 * @param {String=} type - The type of credentials to save
 * @returns {Promise<void>}
 */
module.exports = async function saveCredential(creds, location, type) {
    if (!location) return;
    // save under the current date if no location is provided
    location = typeof location === 'string' ? location : DateTime.now().toSeconds().toFixed(0);

    // check for existing credentials in the config file under this name
    const exists = CredentialManager.exists(location);

    if (exists) {
        // if they exist, ask the user if they want to overwrite
        const ui = Utils.createInterface();
        const overwrite = await ui.question('Would you like to overwrite the existing credentials? (y/n)\n: ');
        ui.close();

        if (Utils.isYes(overwrite)) {
            console.log(chalk.redBright('Overwriting existing credentials', location));
        } else {
            return;
        }
    }

    CredentialManager.saveCredentials(creds, location, type);
};
