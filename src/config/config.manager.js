const PathManager = require('./path.manager');
const fs = require('fs');
/**
 * @typedef {Object} PasswordCredential
 * @property {String} type - the type of credential - password
 * @property {String} password
 * @property {String=} workingDirectory - The ABSOLUTE path to the working directory the credential is for
 * @property {String=} algorithm - The algorithm to use for encryption
 */

/**
 * @typedef {Object} KeyCredential
 * @property {String} type - the type of credential - key
 * @property {String} key - encryption key
 * @property {String} iv - the initialization vector
 * @property {String=} workingDirectory - The ABSOLUTE path to the working directory the credential is for
 * @property {String=} algorithm - The algorithm to use for encryption
 */

/**
 * @typedef {PasswordCredential|KeyCredential} Credential
 */

/**
 * @typedef {Object} Config
 * @property {String} activeCredential - The name of the environment
 * @property {String} workingDirectory - The ABSOLUTE path to the working directory
 * @property {Record<string,Credential>} credentials - The credentials object
 */

const emptyConfig = {
    activeCredential: null,
    credentials: {}
};

/**
 * @description Class that manages loading in credentials and other values from the config file
 * @class ContextManager
 */
class ConfigManager {
    /**
     * @description Holds the config object
     * @type {Config}
     */
    static #config;

    /**
     * @description Getter for the config object
     * @returns {Config} The config object
     */
    static get config() {
        if (!this.#config) {
            this.#config = this.#load();
        }

        return this.#config;
    }

    /**
     * @description Method that loads in the credentials from the credentials file
     * @returns {Config} The config object
     */
    static #load() {
        return require(PathManager.CONFIG_JSON);
    }

    /**
     * @description Overwrites the current config with the provided config
     * @param {Config} config - The new config object
     * @returns {void}
     */
    static updateConfig(config) {
        fs.writeFileSync(PathManager.CONFIG_JSON, JSON.stringify(config, null, 4));
    }

    /**
     * @description Sets up the config file with the default values
     * @returns {void}
     */
    static setup() {
        this.updateConfig(emptyConfig);
    }
}

module.exports = ConfigManager;
