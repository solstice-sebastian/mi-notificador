const express = require('express');
const bodyParser = require('body-parser');
const getAlerts = require('./modules/getAlerts.js');
const deleteAlert = require('./modules/deleteAlert.js');
const addAlert = require('./modules/addAlert.js');

const environment = process.env.NODE_ENV || 'local';
const Config =
  environment === 'local'
    ? require('./private/config.js')
    : () => ({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
      });

const { apiKey, apiSecret } = Config();

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
app.listen(4242);
