const fs = require('fs');
const fetch = require('node-fetch');
const Config = require('./private/config.js');

const { apiKey, apiSecret } = Config();

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
  'X-API-SECRET': apiSecret,
};

const method = 'POST';
// const endpoint = 'https://api.coinigy.com/api/v1/data';
// const endpoint = 'https://api.coinigy.com/api/v1/ticker';
const endpoint = 'https://www.coinigy.com/getjson/get_market_data_singleMarket/GDAX/BTC/USD';

// const body = JSON.stringify({
//   exchange_code: 'GDAX',
//   exchange_market: 'BTC/USD',
//   type: 'history',
// });

const filename = 'btc.json';

// fs.writeFileSync('btc.json', '[]', 'utf8');

const addToFile = (curr) => {
  // get previous `data`
  console.log(`curr:`, curr[0].timestamp);
  const fd = fs.readFileSync(filename, 'utf8');
  const prev = JSON.parse(fd);
  const agg = prev.concat(curr);

  fs.writeFileSync(filename, JSON.stringify(agg), (err) => {
    console.log('wrote to file', curr.pop().timestamp);
    if (err) {
      console.log(`err:`, err);
      throw err;
    }
  });
};

const poll = () =>
  fetch(endpoint, { method, headers })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return addToFile(json.data);
    })
    .then(() => {
      setTimeout(poll, 2000);
    })
    .catch((err) => err);

poll();
