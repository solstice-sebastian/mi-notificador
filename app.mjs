import express from 'express';

// setup server
const app = express();

app.use(express.static('public'));

app.get('/test', (req, res) => {
  res.send('success');
});

// start server
app.listen(3000);
