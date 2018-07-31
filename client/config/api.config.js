'use strict';
const isProdMode = Object.is(process.env.NODE_ENV, 'production');

module.exports = {
    baseUrl: isProdMode ? 'http://kmall.kaiyouservices.com/api/' : 'api/'
};
