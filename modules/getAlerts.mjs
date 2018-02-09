import fetch from 'node-fetch';

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

  const filtered = alerts
    .filter(
      (alert) =>
        exchange
          ? alert.exch_name.toLowerCase().includes(exchange.toLowerCase()) ||
            alert.exch_code.toLowerCase().includes(exchange.toLowerCase())
          : true
    )
    .filter(
      (alert) => (symbol ? alert.mkt_name.toLowerCase().includes(symbol.toLowerCase()) : true)
    );

  return filtered;
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
const getAlerts = ({ headers, options = {} }) =>
  fetch(endpoint, { method, headers })
    .then((response) => response.json())
    .then(({ data }) => filter({ data, options }))
    .catch((err) => err);

export default getAlerts;
