import fetch from 'node-fetch';
import utils from './utils.mjs';

const { isEmpty } = utils;

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/alerts';

/**
 * get alerts with optional filter of exch name and symbol
 *
 * api response contains these keys
 * "exch_name": "Poloniex"
 * "mkt_name": "BTC/ETH"
 *
 * @param {String} exchange
 * @param {String} symbol
 */
const getAlerts = (headers, options = {}) => {
  const { exchange, symbol } = options;
  if (
    (exchange !== undefined && symbol === undefined) ||
    (exchange === undefined && symbol !== undefined)
  ) {
    throw new Error(`filtering requires both 'exchange' && 'symbol' options`);
  }

  return fetch(endpoint, { method, headers })
    .then((response) => response.json())
    .then(({ data }) => {
      if (isEmpty(exchange) === false && isEmpty(symbol) === false) {
        return data.open_alerts.filter(
          (alert) => alert.exch_name === exchange && alert.mkt_name === symbol
        );
      }
      return data.open_alerts;
    })
    .catch((err) => err);
};

export default getAlerts;
