import express from 'express';
import keys from './private/keys.mjs';
import getAlerts from './modules/getAlerts.mjs';

const { apiKey, apiSecret } = keys;

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
  'X-API-SECRET': apiSecret,
};

// setup server
const app = express();

app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.send();
});

app.get('/getAlerts', (req, res) => {
  res.send(getAlerts(req.params, headers));
});

// start server
app.listen(3000);
