import fetch from 'node-fetch';

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/addAlert';

/**
 * delete alert based on its id
 *
 * @param {Header} headers headers for fetch request
 * @param {String} alertId
 */
const addAlert = ({ headers, price, symbol, exchange, note }) => {
  const body = {
    exch_name: exchange,
    mkt_name: symbol,
    alert_price: price,
    alert_note: note,
  };

  return fetch(endpoint, {
    method,
    headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => err);
};

export default addAlert;
