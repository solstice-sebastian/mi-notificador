import express from 'express';
import fs from 'fs';

// setup server
const app = express();

// const options = {
//   extensions: ['html', 'js', 'css'],
//   index: false,
// };

app.get('/', (req, res) => {
  // app.use(express.static('public', options));
  fs.readFile('public/index.html', (err, data) => {
    if (err) {
      console.log(`err:`, err);
    } else {
      res.contentType('html');
      res.send(data);
    }
  });
});

// start server
app.listen(3000);
