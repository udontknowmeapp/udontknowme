import config from 'config';
import express from 'express';
import proxy from 'proxy-middleware';
import request from 'request';
import url from 'url';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import WebpackDevConfig from './config/webpack.development';

const APP_PORT = config.get('server.port');
const WEBPACK_PORT = config.get('webpackServer.port');

// B) App server
let app = express();
app.use('/assets', proxy(url.parse(`http://localhost:${WEBPACK_PORT}/assets`)));
app.use('*', (req, res) => {
  request.get(`http://localhost:${WEBPACK_PORT}/assets/index.html`).pipe(res);
});

app.listen(APP_PORT, () => {
  console.log('\nIt\'s alive! On port ...\n');
  console.log(`----------\n|  ${APP_PORT}  |\n----------\n       || \n(\\__/) || \n(•ㅅ•) || \n/ 　 づ\n\n`);
});

// C) Webpack
let devServer = new WebpackDevServer(webpack(WebpackDevConfig), {
  hot: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  publicPath: `http://localhost:${WEBPACK_PORT}/assets`,
  stats: {
    colors: true
  }
});

devServer.listen(WEBPACK_PORT, () => console.log(
  `I'll be watching you, on port: ${WEBPACK_PORT}\n\n`
));
