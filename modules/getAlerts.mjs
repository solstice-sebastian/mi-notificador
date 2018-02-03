import fetch from 'node-fetch';
import utils from './utils.mjs';

const { isEmpty } = utils;

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/alerts';

const filter = ({ data, options }) => {
  let alerts;
  const { exchange, symbol, type } = options;
  if (type === 'history') {
    alerts = data.alert_history;
  } else {
    alerts = data.open_alerts;
  }

  return alerts
    .filter((alert) => (exchange ? alert.exch_name === exchange : true))
    .filter((alert) => (symbol ? alert.mkt_name === symbol : true));
};

/**
 * get alerts with optional filter of exch name and symbol
 *
 * api response contains these keys
 * "exch_name": "Poloniex"
 * "mkt_name": "BTC/ETH"
 *
 * @param {Header} headers headers for fetch request
 * @param {String} options.exchange exchange name
 * @param {String} options.symbol symbol/ticker name
 * @param {String} options.type=open open|history
 */
const getAlerts = (headers, options = {}) =>
  fetch(endpoint, { method, headers })
    .then((response) => response.json())
    .then(({ data }) => {
      return filter({ data, options });
    })
    .catch((err) => err);

export default getAlerts;
