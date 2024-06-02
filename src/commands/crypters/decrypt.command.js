/* eslint-disable no-console */

const chalk = require('chalk');
const path = require('path');
const { CredentialManager } = require('../../credentials');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const Crypters = require('../../crypters');
const Utils = require('../../utils');
/**
 * @description Decrypts a file using the current active credentials
 * If filename contains /, it will be treated as an absolute path
 * If filename does not contain /, it will be treated as an actual filename
 * @param {String} filename
 * @param {Object} options
 * @param {Boolean} options.verbose - Whether to log verbose output
 * @param {String=} options.key - The key/password to use for decryption
 * @param {String=} options.iv - The iv to use for decryption
 * @returns {Promise<void>}
 */
module.exports = async function decrypt(
    filename,
    options = { verbose: false, key: undefined, iv: undefined, algorithm: undefined }
) {
    let context;

    if (options.key) {
        context = {
            key: options.key,
            iv: options.iv,
            algorithm: options.algorithm
        };
    } else {
        const activeCreds = CredentialManager.getActiveCredentials();

        if (!activeCreds) {
            console.log(chalk.red('No active credentials found'));
            return;
        }

        context = {
            key: activeCreds.key || activeCreds.password,
            iv: activeCreds.iv,
            algorithm: activeCreds.algorithm,
            workingDirectory: activeCreds.workingDirectory
        };
    }

    const pathToFile = Utils.getFilePath(filename, context.workingDirectory);

    // check if the file exists
    if (!existsSync(pathToFile)) {
        console.log(chalk.red(`File at path ${pathToFile} does not exist`));
        return;
    }

    // otherwise we can read the file and encrypt it
    const data = readFileSync(pathToFile, 'utf8');

    // decrypt the data
    const decrypted = Crypters.decrypt(data, context);

    const justFileName = path.parse(pathToFile).name;

    // save the file
    const pathToSaveAt = path.join(pathToFile, '..', `${justFileName}.env`);
    writeFileSync(pathToSaveAt, decrypted, {
        encoding: 'utf8',
        flag: 'w'
    });

    options.verbose && console.log(chalk.green(`File decrypted and saved at ${pathToSaveAt}`));
};
