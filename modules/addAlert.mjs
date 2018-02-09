import fetch from 'node-fetch';
import Exchanges from './exchanges.mjs';

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/addAlert';

/**
 * delete alert based on its id
 *
 * @param {Header} headers headers for fetch request
 * @param {String} alertId
 */
const addAlert = ({ headers, price, symbol, exchange, note }) => {
  const exch = Exchanges.init({ headers });
  return exch.getCode({ input: exchange }).then((code) => {
    const body = {
      exch_code: code,
      market_name: symbol,
      alert_price: price,
      alert_note: note,
    };

    console.log(`body`, JSON.stringify(body));

    return fetch(endpoint, {
      method,
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .catch((err) => err);
  });
};

export default addAlert;
