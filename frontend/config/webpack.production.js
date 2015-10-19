var webpack           = require('webpack');
var merge             = require('webpack-config-merger');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var baseConfig        = require('./webpack.base.js');
var config            = require('config');
var patterns          = require('css-patterns');
var path              = require('path');

module.exports = merge(baseConfig, {
  entry: {
    application: ['./src/js/index.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          stage: 0
        },
        exclude: [/node_modules/, /config/]
      },
      {
        test: /\.?css$/,
        loader: ExtractTextPlugin.extract(
          'css!autoprefixer?browsers=last 3 versions!sass?outputStyle=compressed&includePaths[]=' + path.resolve(patterns.includePaths[0])
        )
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin("app.scss", "app.[contenthash].css")
  ]
});
