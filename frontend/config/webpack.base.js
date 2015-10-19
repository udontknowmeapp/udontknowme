var path                = require('path');
var config              = require('config');
var webpack             = require('webpack');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

var configPlugin = new webpack.DefinePlugin({
  DEPLOY: JSON.stringify(config.get('deploy')),
  SERVER_URI: JSON.stringify(config.get('socket.url')),
  'process.env': {
    NODE_ENV: JSON.stringify(config.get('env'))
  }
});

module.exports = {
  cache: true,
  output: {
    path: config.get('webpack.output.path'),
    publicPath: '/assets/',
    filename: 'app.[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.(jpe?g|png|gif|svg|ico|pdf)$/i,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    configPlugin,
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      env: config.get('env'),
      filename: config.get('webpack.output.htmlPath'),
      template: 'src/templates/index.html'
    }),
  ]
}
