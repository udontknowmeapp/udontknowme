import path from 'path';
import config from 'config';
import express from 'express';
import url from 'url';

const APP_PORT = config.get('server.port');

let app = express();
app.use('/assets', express.static(__dirname + '/build/assets'));
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(APP_PORT, () => {
  console.log('\nIt\'s alive! On port ...\n');
  console.log(`----------\n|  ${APP_PORT}  |\n----------\n       || \n(\\__/) || \n(•ㅅ•) || \n/ 　 づ\n\n`);
});
