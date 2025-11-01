const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  (config) => {
    config.entry = config.entry.replace(/index\.js$/, 'index.jsx');

    return config;
  }
);