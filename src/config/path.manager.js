/* eslint-disable no-console */

const Chalk = require('chalk');
const path = require('path');
const fs = require('fs');

/**
 * @description The PathManager class handles the configuration of the env manager
 * It supports tracking state, by saving credentials, and env files
 */
class PathManager {
    /**
     * @description The path to user's home directory
     * @type {string}
     * @private
     */
    static #USER_HOME = process.env.USERPROFILE || process.env.HOME;

    /**
     * @description The path to .config folder in user's home directory
     * @type {string}
     * @private
     */
    static #CONFIG_PATH = path.join(PathManager.#USER_HOME, '.config');

    /**
     * @description The path to the env manager folder in .config folder
     * @type {string}
     * @private
     */
    static #ENV_MANAGER_PATH = path.join(PathManager.#CONFIG_PATH, 'env-manager');

    /**
     * @description The path to env files in .config folder
     * @type {string}
     * @private
     */
    static #ENV_PATH = path.join(PathManager.#ENV_MANAGER_PATH, 'envs');

    /**
     * @description The path to the credentials folder in .config folder
     * @type {string}
     * @private
     */
    static #CREDENTIALS_PATH = path.join(PathManager.#ENV_MANAGER_PATH, 'credentials');

    /**
     * @description The path to the config file that tracks the current environment
     * @type {string}
     * @private
     */
    static #CONFIG_JSON = path.join(PathManager.#ENV_MANAGER_PATH, 'config.json');

    static USER_HOME() {
        return this.#USER_HOME;
    }

    static get CONFIG_PATH() {
        return this.validatePath(this.#CONFIG_PATH);
    }

    static get ENV_MANAGER_PATH() {
        return this.validatePath(this.#ENV_MANAGER_PATH);
    }

    static get ENV_PATH() {
        return this.validatePath(this.#ENV_PATH);
    }

    static get CREDENTIALS_PATH() {
        return this.validatePath(this.#CREDENTIALS_PATH);
    }

    static get CONFIG_JSON() {
        return this.validatePath(this.#CONFIG_JSON);
    }

    /**
     * @description Validates a given path - used internally to check if the env manager is setup
     * @param {String} pathToCheck
     * @returns {String}
     */
    static validatePath(pathToCheck) {
        if (!fs.existsSync(pathToCheck)) {
            console.log(Chalk.red('Env Manager is not setup, please run `emg setup`'));
            process.exit(1);
        }

        return pathToCheck;
    }

    /**
     * @description Sets up the env manager by creating the necessary folders and files
     * @param {Object} options
     * @param {Boolean} options.verbose - If true, prints out the steps taken to setup the env manager
     * @returns {void}
     */
    static setup(options = { verbose: false }) {
        function createFolder(pathToCreateAt, successMessage) {
            if (!fs.existsSync(pathToCreateAt)) {
                fs.mkdirSync(pathToCreateAt);
                options.verbose && console.log(Chalk.green(successMessage, '@'), Chalk.yellowBright(pathToCreateAt));
            }
        }

        createFolder(PathManager.#CONFIG_PATH, 'Created .config folder');
        createFolder(PathManager.#ENV_MANAGER_PATH, 'Created env-manager folder');
        createFolder(PathManager.#ENV_PATH, 'Created envs folder');
        createFolder(PathManager.#CREDENTIALS_PATH, 'Created credentials folder');

        if (!fs.existsSync(PathManager.#CONFIG_JSON)) {
            fs.writeFileSync(PathManager.#CONFIG_JSON, '');
            options.verbose &&
                console.log(Chalk.green('Created config.json', '@'), Chalk.yellowBright(PathManager.#CONFIG_JSON));
        }

        options.verbose && console.log(Chalk.green('Env Manager setup complete'));
    }

    /**
     * @description "Uninstalls" the env manager by removing the necessary folders and files
     * @returns {void}
     */
    static teardown() {
        fs.rmSync(PathManager.ENV_MANAGER_PATH, { recursive: true, force: true });
    }
}

module.exports = PathManager;
