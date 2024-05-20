module.exports = {
    saveCredential: require('./credentials/save-credential.command'),
    generateCredentials: require('./credentials/generate-credentials.command'),
    listCredentials: require('./credentials/list-credentials.command'),
    removeCredential: require('./credentials/remove-credential.command'),
    setActiveCredential: require('./credentials/set-active-credential.command'),
    getActiveCredential: require('./credentials/get-active-credential.command'),
    setup: require('./config/setup.command'),
    reset: require('./config/reset.command'),
    editConfig: require('./config/edit-config.command'),
    encrypt: require('./crypters/encrypt.command'),
    decrypt: require('./crypters/decrypt.command'),
    setWorkingPath: require('./credentials/set-working-path.command'),
    transform: require('./transform/transform.command')
};
