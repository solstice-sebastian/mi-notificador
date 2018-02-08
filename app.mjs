import express from 'express';
import bodyParser from 'body-parser';
import keys from './private/keys.mjs';
import getAlerts from './modules/getAlerts.mjs';
import deleteAlert from './modules/deleteAlert.mjs';
import addAlert from './modules/addAlert.mjs';

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
  getAlerts({ headers, options: req.body })
    .then((alerts) => {
      res.send(alerts);
    })
    .catch((err) => res.send(err));
});

app.post('/deleteAlert', (req, res) => {
  const { alertId } = req.body;
  deleteAlert({ headers, alertId })
    .then((alerts) => {
      res.send(alerts);
    })
    .catch((err) => res.send(err));
});

app.post('/deleteAlerts', (req, res) => {
  const { alertIds } = req.body;
  const promises = alertIds.map((alertId) => deleteAlert({ headers, alertId }));
  const result = Promise.all(promises).catch((err) => res.send(err));
  res.send(result);
});

app.post('/addAlerts', (req, res) => {
  const { prices, symbol, exchange, note } = req.body;
  const promises = prices.map((price) => addAlert({ headers, price, symbol, exchange, note }));
  const result = Promise.all(promises).catch((err) => res.send(err));
  res.send(result);
});

// start server
app.listen(3000);
