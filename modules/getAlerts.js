const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/alerts';

/**
 * get alerts with optional filter of exch name and symbol
 *
 * api response contains these keys
 * "exch_name": "Poloniex"
 * "mkt_name": "BTC/ETH"
 *
 * @param {String} exchangeCode
 * @param {String} symbol
 */
const getAlerts = ({ exchangeCode = null, symbol = null, headers = null }) => {
  if ((exchangeCode !== null && symbol === null) || (exchangeCode === null && symbol !== null)) {
    throw new Error(`filtering requires both 'exchangeCode' && 'symbol'`);
  }

  return fetch(endpoint, { method, headers })
    .then(({ data }) => {
      if (exchangeCode !== null && symbol !== null) {
        return data.open_alerts.find(
          (alert) => alert.exch_name === exchangeCode && alert.mkt_name === symbol
        );
      }
      return data.open_alerts;
    })
    .catch((err) => {
      console.log(`err:`, err);
    });
};

export default getAlerts;
