/* eslint-disable no-console */

const chalk = require('chalk');
const crypto = require('crypto');

/**
 * @description Decrypts data using the provided key, iv and algorithm or if only key is provided, it assumes that we should decrypt with the passed key as a password.
 * @param {String} data - The data to be decrypted.
 * @param {Object} options - The options for decryption.
 * @param {Boolean=} options.verbose - Whether to log verbose output
 * @param {String=} options.algorithm - The algorithm to be used for decryption.
 * @param {String} key - The key to be used for decryption. Or the password to be used for decryption.
 * @param {String=} iv - The iv to be used for decryption.
 * @returns {String} The decrypted data.
 *  * // TODO: rewrite this ho to be more dynamic and support more algorithms and encryption modes
 */
module.exports = function decrypt(
    data,
    { verbose = false, algorithm = 'aes-256-cbc', key = undefined, iv = undefined } = {}
) {
    if (!key) {
        console.log(chalk.red('No key provided for decryption.'));
        process.exit(1);
    }

    const keyBuf = Buffer.from(key, 'hex');

    if (!iv) {
        algorithm = 'aes-256-ecb';
        verbose && console.log(chalk.yellow('Using Password decryption.'));

        const decipher = crypto.createDecipheriv(algorithm, keyBuf, null);
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    } else {
        verbose && console.log(chalk.yellow('Using Key/IV decryption.'));

        const ivBuffer = Buffer.from(iv, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, keyBuf, ivBuffer);
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    }
};
