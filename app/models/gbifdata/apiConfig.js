'use strict';

// TODO Use absolute path?
var baseConfig = require('../../../config/config');

var baseUrl = baseConfig.dataApi;
// TODO Establish URL concatenation policy.
var apiConfig = {
    base: {
        url: baseUrl
    },
    dataset: {
        url: baseUrl + 'dataset/'
    },
    occurrence: {
        url: baseUrl + 'occurrence/'
    },
    publisher: {
        url: baseUrl + 'organization/'
    },
    installation: {
        url: baseUrl + 'installation/'
    }
};

module.exports = Object.freeze(apiConfig);