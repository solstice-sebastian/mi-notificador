// import fetch from 'node-fetch';
const fetch = require('node-fetch');

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/exchanges';

let _exchanges = [];
let _headers = null;

const get = () =>
  fetch(endpoint, { method, headers: _headers })
    .then((response) => response.json())
    .then(({ data }) => {
      _exchanges = data;
      return _exchanges;
    })
    .catch((err) => err);

const codeForInput = ({ input, exchanges = [] }) => {
  if (exchanges === undefined || Array.isArray(exchanges) === false) {
    throw new Error(`codeForInput expected list of exchanges. Received '${exchanges}' instead`);
  }

  let code;

  exchanges.forEach((exchange) => {
    if (exchange.exch_name === input || exchange.exch_code === input) {
      code = exchange.exch_code;
      return code;
    }
    return null;
  });

  if (code === undefined) {
    throw new Error(`No exchange found for '${input}'`);
  }

  return code;
};

const getCode = ({ input }) => {
  if (_exchanges.length === 0) {
    return get().then(({ data }) => codeForInput({ input, exchanges: data }));
  }
  return Promise.resolve(codeForInput({ input, exchanges: _exchanges }));
};

const init = ({ headers }) => {
  if (headers === undefined) {
    throw new Error(`{ headers } is required to init`);
  }
  _headers = headers;
  return { getCode, get };
};

const Exchanges = { init };

// export default Exchanges;
module.exports = Exchanges;
