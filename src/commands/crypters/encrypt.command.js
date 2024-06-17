/* eslint-disable no-console */

const chalk = require('chalk');
const path = require('path');
const { CredentialManager } = require('../../credentials');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const Crypters = require('../../crypters');
const Utils = require('../../utils');

/**
 * @description Encrypts a file using the current active credentials
 * If filename contains /, it will be treated as an absolute path
 * If filename does not contain /, it will be treated as an actual filename
 * This is relatively acceptable assumption since most systems do not allow / in filenames
 * @param {String} filename
 * @param {Object} options
 * @param {Boolean} options.verbose - Whether to log verbose output
 * @returns {Promise<void>}
 */
module.exports = async function encrypt(filename, options = { verbose: false }) {
    const activeCreds = CredentialManager.getActiveCredentials();

    if (!activeCreds) {
        console.log(chalk.red('No active credentials found'));
        return;
    }

    const pathToFile = Utils.getFilePath(filename, activeCreds.workingDirectory);

    // check if the file exists
    if (!existsSync(pathToFile)) {
        console.log(chalk.red(`File at path ${pathToFile} does not exist`));
        return;
    }

    // otherwise we can read the file and encrypt it
    const data = readFileSync(pathToFile, 'utf8');

    // encrypt the data
    const encrypted = Crypters.encrypt(
        data,
        activeCreds.key || activeCreds.password,
        activeCreds.iv,
        activeCreds.algorithm
    );

    // save at same place with .enc extension
    const justFileName = path.parse(pathToFile).name;

    // save the file
    const pathToSaveAt = path.join(pathToFile, '..', `${justFileName}.enc`);
    writeFileSync(pathToSaveAt, encrypted, {
        encoding: 'utf8',
        flag: 'w'
    });

    options.verbose && console.log(chalk.green(`File encrypted and saved at ${pathToSaveAt}`));
};
