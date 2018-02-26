const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.',
    disableHostCheck: true,
    host: '0.0.0.0',
    inline: false,
    hot: false
  }
});
