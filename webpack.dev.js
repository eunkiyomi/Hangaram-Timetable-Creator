const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.',
    disableHostCheck: true,
    host: '0.0.0.0',
    inline: false,
    hot: false
  }
});
