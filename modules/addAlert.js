// request(
//   {
//     method: 'POST',
//     url: 'https://api.coinigy.com/api/v1/addAlert',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-API-KEY': '',
//       'X-API-SECRET': '',
//     },
//     body: {
//       exch_code: 'GDAX',
//       market_name: 'BTC/USD',
//       alert_price: 750.01,
//       alert_note: 'This is an optional message',
//     },
//   },
//   (error, response, body) => {
//     console.log('Status:', response.statusCode);
//     console.log('Headers:', JSON.stringify(response.headers));
//     console.log('Response:', body);
//   }
// );

const addAlert = ({ exchangeCode, symbol, price, text }) => {
  const method = 'POST';
  const endpoint = 'https://api.coinigy.com/api/v1/addAlert';

};

export default addAlert;
