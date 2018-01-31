import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';

// import fs from 'fs';

// setup server
const app = express();
app.use(serveStatic('public'));

const setHeaders = (res, path) => {
  console.log(`res:`, res);
  const mimeType = serveStatic.mime.lookup(path);
  res.set('mime', 'application/js');
  // if ()
}

const options = {
  extensions: ['html', 'js', 'css'],
  index: 'index.html',
  setHeaders,
};

app.use(express.static('public', options));

app.get('/test', (req, res) => {
  res.send('success');
});

// start server
app.listen(3000);
