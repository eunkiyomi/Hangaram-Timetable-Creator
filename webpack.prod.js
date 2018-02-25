const path = require('path');
const merge = require('webpack-merge');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const common = require('./webpack.common.js');
module.exports = merge(common, {
  output: {
    path: path.resolve(__dirname, 'production/dist')
  },
  plugins: [
    new MinifyPlugin()
  ]
});
