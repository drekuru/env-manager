const azureWebAppsTransformer = require('./mappers/azure-web-apps.mapper');
const jsonTransformer = require('./mappers/json.mapper');
const FORMATS = require('./formats.list');

/**
 * @description Selects transformer based on the format provided
 * @param {String} inputFormat - The format of the file being transformed
 * @param {String} outputFormat - The format to transform the file to
 * @returns {Function} - The transformer function for the given format
 * // TODO - we can make this more dynamic
 */
module.exports = function transformerFactory(inputFormat, outputFormat) {
    if (!inputFormat || !outputFormat) {
        throw new Error('No input or output format provided');
    }

    switch (inputFormat) {
        case FORMATS.ENV:
            switch (outputFormat) {
                case FORMATS.AZURE_WEB_APP:
                    return azureWebAppsTransformer.fromENVtoAzure;
                case FORMATS.JSON:
                    return jsonTransformer.exportFromEnv;
            }
        case FORMATS.AZURE_WEB_APP:
            switch (outputFormat) {
                case FORMATS.ENV:
                    return azureWebAppsTransformer.fromAzureToENV;
            }
        case FORMATS.JSON:
            switch (outputFormat) {
                case FORMATS.ENV:
                    return jsonTransformer.importToEnv;
            }
    }

    throw new Error(`No transformer found for ${inputFormat} to ${outputFormat}`);
};
