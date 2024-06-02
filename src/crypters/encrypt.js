/* eslint-disable no-console */

const chalk = require('chalk');
const crypto = require('crypto');

/**
 * @description Encrypts data using the provided key, iv and algorithm or if only key is provided, it assumes that we should encrypt with the passed key as a password.
 * @param {String} data - The data to be encrypted.
 * @param {String} key - The key to be used for encryption. Or the password to be used for encryption.
 * @param {String=} iv - The iv to be used for encryption.
 * @param {Object} options
 * @param {Boolean=} options.verbose - Whether to log verbose output
 * @param {String=} options.algorithm - The algorithm to be used for encryption.
 * @returns {String} The encrypted data.
 * // TODO: rewrite this ho to be more dynamic and support more algorithms and encryption modes
 */
module.exports = function encrypt(data, key, iv, { verbose = false, algorithm = 'aes-256-cbc' } = {}) {
    if (!key) {
        console.log(chalk.red('No key provided for encryption.'));
        process.exit(1);
    }

    const keyBuf = Buffer.from(key, 'hex');

    if (!iv) {
        algorithm = 'aes-256-ecb';
        verbose && console.log(chalk.yellow('Using Password encryption.'));

        const cipher = crypto.createCipheriv(algorithm, keyBuf, null);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    } else {
        verbose && console.log(chalk.yellow('Using Key/IV encryption.'));

        const ivBuffer = Buffer.from(iv || '', 'hex');
        const cipher = crypto.createCipheriv(algorithm, keyBuf, ivBuffer);
        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }
};
