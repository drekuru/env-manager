/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const { ConfigManager } = require('../../config');
const fs = require('fs');
const Utils = require('../../utils');

/**
 * @description - Sets the working path for the relevant credentials
 * @param {String=} credential - The name of the credential
 * @param {Object} options - The options object
 * @param {String} options.path - The path to set as the working path
 * @param {Boolean} options.useWorkingDirectory - Whether to use the working directory, if set to true, path is ignored
 * @param {Boolean} options.verbose - Whether to log the output
 * @returns {Promise<void>}
*/
module.exports = async function setWorkingPath(
    credential,
    options = {
        path: undefined,
        useWorkingDirectory: false,
        verbose: true
    }
)
{
    // if not provided, use the active credential
    const credentialName = credential || ConfigManager.config.activeCredential;

    // if no credential name is provided, throw an error
    if (!credentialName)
    {
        console.error(chalk.red('No credential name provided and no active credential set'));
        return;
    }

    // get the credential
    const credentialToWorkWith = CredentialManager.getCredential(credentialName);

    // if the credential doesn't exist, throw an error
    if (!credentialToWorkWith)
    {
        console.error(chalk.red(`Credential ${credentialName} does not exist`));
        return;
    }

    let pathToUse;

    if (options.useWorkingDirectory === true)
    {
        pathToUse = process.cwd();
    }
    else if (options.path)
    {
        pathToUse = Utils.getFilePath(options.path);
    }

    if (!pathToUse)
    {
        console.error(chalk.red('No path provided'));
        return;
    }

    // validate the path
    if (!fs.existsSync(pathToUse))
    {
        console.error(chalk.red(`Path ${pathToUse} does not exist`));
        return;
    }

    // set the working path
    credentialToWorkWith.workingDirectory = pathToUse;

    // update the config
    CredentialManager.updateCredentials(credentialName, credentialToWorkWith);

    options.verbose && console.log(
        chalk.green('Working path for'),
        chalk.bold.yellow(credentialName),
        chalk.green('set to'),
        chalk.bold.yellow(pathToUse)
    );
};
