const path = require('path');
/**
 * Path can be file, relative path, or absolute path
 * If its absolute path we ignore any path settings in the credentials
 * If its a file or relative path and the credentials have a working directory we use that
 * If its a file or relative path and the credentials do not have a working directory we use the current working directory
 * @description Get the full path of a file
 * @param {String} fileName
 * @param {String=} pathPrefix
 * @returns {String}
 */
module.exports = function getFilePath(fileName, pathPrefix)
{
    const isAbsolutePath = path.isAbsolute(fileName);

    if (isAbsolutePath)
    {
        return fileName;
    }

    // if pathPrefix is not provided, use the current working directory
    const basePath = pathPrefix || process.cwd();

    return path.join(basePath, fileName);
};
