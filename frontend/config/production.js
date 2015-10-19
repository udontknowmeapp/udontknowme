var path = require('path');

module.exports = {
  env: (process.env.NODE_ENV || 'development'),
  deploy: (process.env.DEPLOY || 'static'),
  webpack: {
    output: {
      path: path.join(__dirname, '../build/assets'),
      htmlPath: '../index.html'
    }
  },
  socket: {
    url: (process.env.HEROKU_URL || 'ws://localhost:8000/play'),
    port: (process.env.SOCKET_PORT || '')
  }
};
