/* eslint-disable no-console */

const chalk = require('chalk');
const { ConfigManager } = require('../config');
const crypto = require('crypto');

class CredentialManager {
    /**
     * @description Handles getting the active credentials, null if none are active
     * @returns {import('../config/config.manager').Credential|null} The active credentials
     */
    static getActiveCredentials() {
        // we want to keep this .log here - anytime we do operations against the active credentials, we want to know what they are
        console.log(chalk.green(`Active credentials: ${ConfigManager.config.activeCredential}`));
        return CredentialManager.getCredential([ConfigManager.config.activeCredential]);
    }

    /**
     * @description - Gets the credential by name
     * @param {String} name
     * @returns {import('../config/config.manager').Credential | null}
     */
    static getCredential(name) {
        return ConfigManager.config.credentials[name] || null;
    }

    /**
     * @description Checks if a credential exists in the config file
     * @param {String} name
     * @returns {Boolean}
     */
    static exists(name) {
        return !!ConfigManager.config.credentials[name];
    }

    /**
     * @description Saves given credentials to the config file
     * @param {Object} credentials - The credentials to save
     * @param {String} location - The location to save the credentials
     * @param {String} type - The type of credentials to save (password|key)
     * @returns {Promise<void>}
     */
    static async saveCredentials(credentials, name, type) {
        if (!name || !credentials || !type) {
            throw new Error('Failed to save credentials, missing required parameters');
        }

        const config = ConfigManager.config;

        config.credentials[name] = {
            workingDirectory: null,
            type,
            ...credentials
        };

        // update the file
        ConfigManager.updateConfig(config);
    }

    /**
     * @description Updates the credentials in the config file
     * @param {String} name - The name of the credential to update
     * @param {import('../config/config.manager').Credential} credential - The new credentials
     * @returns {void}
     */
    static updateCredentials(name, credential) {
        const config = ConfigManager.config;

        config.credentials[name] = {
            ...config.credentials[name],
            ...credential
        };

        // update the file
        ConfigManager.updateConfig(config);
    }

    /**
     * @description Removes a credential from the config file
     * @param {String} name - The name of the credential to remove
     * @returns {void}
     */
    static removeCredential(name) {
        const config = ConfigManager.config;

        delete config.credentials[name];

        // if the active credential is the one being removed, remove it
        if (config.activeCredential === name) {
            config.activeCredential = null;
        }

        // update the file
        ConfigManager.updateConfig(config);
    }

    /**
     * @description Get list of all credentials
     * @returns {(import('../config/config.manager').Credential & {name: string})[]} The list of credentials
     */
    static listCredentials() {
        return Object.keys(ConfigManager.config.credentials).map((name) => ({
            name,
            ...ConfigManager.config.credentials[name]
        }));
    }

    /**
     * @description Generates a new password
     * @returns {{password: string}} The generated password
     * // TODO: add option to pass in length
     */
    static generatePassword() {
        return { password: crypto.randomBytes(32).toString('hex') };
    }

    /**
     * @description Generates new key and iv
     * @returns {{key: String, iv: String}}
     */
    static generateKeyAndIv() {
        const key = crypto.randomBytes(32).toString('hex');
        const iv = crypto.randomBytes(16).toString('hex');
        return { key, iv };
    }
}

module.exports = CredentialManager;
