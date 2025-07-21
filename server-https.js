import https from 'https';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';

const { createServer } = https;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Ready on https://0.0.0.0:3000');
  });
});
