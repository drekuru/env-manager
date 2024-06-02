/* eslint-disable no-console */

const chalk = require('chalk');
const path = require('path');
const { CredentialManager } = require('../../credentials');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const Util = require('../../utils');
const TransformerFactory = require('../../env-transformers');

/**
 * @description Handles exporting an ENV file into a different format
 * @param {String} filename
 * @param {Object} options
 * @param {String=} options.destination - The destination to export the file to - defaults to the same directory
 * @param {String} options.outputFormat - The format to export the file to, like azure function apps, just json, etc
 * @param {String=} options.inputFormat - The format of the file being exported - defaults to whatever the file extension is
 * @param {Boolean=} options.useActiveCredentialsDirectory - If true, uses the working directory of the active credentials instead of the current directory - defaults to false
 */
module.exports = async function transformFile(
    filename,
    options = {
        destination: undefined,
        outputFormat: undefined,
        useActiveCredentialsDirectory: false,
        inputFormat: undefined
    }
) {
    if (!options.outputFormat) {
        console.log(chalk.red('No format specified'));
        return;
    }

    // determine the input format
    const inputFormat = options.inputFormat || Util.getFileExtension(filename);

    if (!inputFormat) {
        console.log(chalk.red('No input format specified'));
        return;
    }

    let contextDir = process.cwd();
    if (options.useActiveCredentialsDirectory === true) {
        const activeCreds = CredentialManager.getActiveCredentials();

        if (!activeCreds) {
            console.log(chalk.red('No active credentials found'));
            return;
        } else if (!activeCreds.workingDirectory) {
            console.log(chalk.red('No working directory found tied to active credentials'));
            return;
        }

        contextDir = activeCreds.workingDirectory;
    }

    const filePath = Util.getFilePath(filename, contextDir);

    const fileExists = existsSync(filePath);

    if (!fileExists) {
        console.log(chalk.red(`The file ${filename} does not exist @ ${filePath}`));
        return;
    }

    // select mapping based on input and output format
    const transformer = TransformerFactory.produce(inputFormat, options.outputFormat);

    const fileData = readFileSync(filePath, 'utf8');

    const { transformedData, extension } = transformer(fileData);

    const nameWithOutExtension = filename.split('.').slice(0, -1).join('.');

    const destination = options.destination || contextDir;
    const destinationPath = path.join(destination, `${nameWithOutExtension}.${extension}`);

    writeFileSync(destinationPath, transformedData);
};
