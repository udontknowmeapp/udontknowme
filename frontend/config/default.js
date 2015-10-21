var path = require('path');

module.exports = {
  env: (process.env.NODE_ENV || 'development'),
  deploy: (process.env.NODE_ENV || 'static'),
  webpackServer: {
    port: (process.env.WEBPACK_PORT || 8888)
  },
  server: {
    port: (process.env.PORT || 5000)
  },
  webpack: {
    output: {
      path: path.join(__dirname, '../build/assets'),
      htmlPath: '../index.html'
    }
  }
};
