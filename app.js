const express = require('express');
const bodyParser = require('body-parser');
const keys = require('./private/keys.js');
const getAlerts = require('./modules/getAlerts.js');
const deleteAlert = require('./modules/deleteAlert.js');
const addAlert = require('./modules/addAlert.js');

// dev
const fs = require('fs');
const fetch = require('node-fetch');

const { apiKey, apiSecret } = keys;

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
  'X-API-SECRET': apiSecret,
};

// setup server
const app = express();

// for static front end
app.use(express.static('common'));
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

app.post('/deleteAlerts', (req, res) => {
  const { alertIds } = req.body;
  const promises = alertIds.map((alertId) => deleteAlert({ headers, alertId }));
  const result = Promise.all(promises).catch((err) => res.send(err));
  res.send(result);
});

app.post('/addAlert', (req, res) => {
  const { price, symbol, exchange, note } = req.body;
  addAlert({ headers, price, symbol, exchange, note })
    .then((alert) => {
      res.send(alert);
    })
    .catch((err) => {
      console.log(`err:`, err);
    });
});

// start server
app.listen(3000);

// dev
const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/data';
const body = JSON.stringify({
  exchange_code: 'GDAX',
  exchange_market: 'BTC/USD',
  type: 'history',
});

fetch(endpoint, { method, headers, body })
  .then((response) => response.json())
  .then(({ data }) => {
    fs.writeFile('btc.json', JSON.stringify(data), (err) => {
      if (err) {
        console.log(`err:`, err);
        throw err;
      }
    });
  })
  .catch((err) => err);
