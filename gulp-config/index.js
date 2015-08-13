'use strict';
var pkg = require('../package.json');
var config = {
    clean: [ 'coverage' ],
    eslint: [ 'lib/**/*.js', 'test/**/*.js', 'gulp-config/**/*.js', 'index.js', 'make.js', 'gulpfile.js' ],
    mocha: [ 'test/**/*.spec.js'],
    src: ['lib/**/*.js', 'index.js'],
    doc: {
        src: ['lib/promise.js', 'lib/enhance.js'],
        out: 'API.md'
    }
};

module.exports = config;
