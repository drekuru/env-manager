/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const { ConfigManager } = require('../../config');
const fs = require('fs');

/**
 * @description - Sets the working path for the relevant credentials
 * @param {Object} options - The options object
 * @param {string} options.credential - The name of the credential
 * @param {string} options.path - The path to set as the working path
 * @param {boolean} options.useWorkingDirectory - Whether to use the working directory, if set to true, path is ignored
 */
module.exports = async function setWorkingPath(
    options = {
        credential: undefined,
        path: undefined,
        useWorkingDirectory: false
    }
) {
    // if not provided, use the active credential
    const credentialName = options.credential || ConfigManager.config.activeCredential;

    // if no credential name is provided, throw an error
    if (!credentialName) {
        console.error(chalk.red('No credential name provided and no active credential set'));
        return;
    }

    // get the credential
    const credential = CredentialManager.getCredential(credentialName);

    // if the credential doesn't exist, throw an error
    if (!credential) {
        console.error(chalk.red(`Credential ${credentialName} does not exist`));
        return;
    }

    const path = (options.useWorkingDirectory === true && process.cwd()) || options.path;

    if (!path) {
        console.error(chalk.red('No path provided'));
        return;
    }

    // validate the path
    if (!fs.existsSync(path)) {
        console.error(chalk.red(`Path ${path} does not exist`));
        return;
    }

    // set the working path
    credential.workingDirectory = path;

    // update the config
    CredentialManager.updateCredentials(credentialName, credential);

    console.log(
        chalk.green('Working path for'),
        chalk.bold.yellow(credentialName),
        chalk.green('set to'),
        chalk.bold.yellow(path)
    );
};
