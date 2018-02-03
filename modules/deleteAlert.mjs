import fetch from 'node-fetch';

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/deleteAlert';

/**
 * get alerts with optional filter of exch name and symbol
 *
 * api response contains these keys
 * "exch_name": "Poloniex"
 * "mkt_name": "BTC/ETH"
 *
 * @param {Header} headers headers for fetch request
 * @param {String} alertId
 */
const deleteAlert = ({ headers, alertId }) => {
  const body = {
    alert_id: alertId,
  };

  return fetch(endpoint, { method, headers, body })
    .then((response) => response.json())
    .catch((err) => err);
};

export default deleteAlert;
