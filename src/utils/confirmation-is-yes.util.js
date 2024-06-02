/**
 * @description Checks if the input is a yes
 * @param {String|undefined} input
 * @returns {Boolean}
 */
module.exports = function isYes(input) {
    return ['y', 'yes'].includes(input?.toLowerCase());
};
