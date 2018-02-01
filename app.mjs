import express from 'express';
import keys from './private/keys.mjs';
import getAlerts from './modules/getAlerts.mjs';
import bodyParser from 'body-parser';

const { apiKey, apiSecret } = keys;

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
  'X-API-SECRET': apiSecret,
};

// setup server
const app = express();

// for static front end
app.use(express.static('public'));

// middleware
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send();
});

app.post('/getAlerts', (req, res) => {
  getAlerts(headers, req.params).then((alerts) => {
    res.send(alerts);
  });
});

// start server
app.listen(3000);
