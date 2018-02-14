// import fetch from 'node-fetch';
const fetch = require('node-fetch');

const method = 'POST';
const endpoint = 'https://api.coinigy.com/api/v1/deleteAlert';

/**
 * delete alert based on its id
 *
 * @param {Header} headers headers for fetch request
 * @param {String} alertId
 */
const deleteAlert = ({ headers, alertId }) => {
  const body = {
    alert_id: alertId,
  };

  return fetch(endpoint, {
    method,
    headers,
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .catch((err) => err);
};

// export default deleteAlert;
module.exports = deleteAlert;
