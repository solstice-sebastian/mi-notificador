(() => {
  const checkStatus = async () => {
    fetch('health').then((res) => {
      console.log(res.ok ? 'success' : 'error');
    });
  };
  checkStatus();

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const getAlertsButton = document.getElementById('get-alerts');

  const getExchange = () => {
    const exchangeInput = document.getElementById('exchange');
    const exchange = exchangeInput.innerText.trim();
    return exchange;
  };

  const getSymbol = () => {
    const symbolInput = document.getElementById('symbol');
    const symbol = symbolInput.innerText.trim();
    return symbol;
  };

  const getAlerts = () => {
    fetch('getAlerts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        exchange: getExchange(),
        symbol: getSymbol(),
      }),
    })
      .then((res) => {
        if (res.ok === true) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((json) => {
        console.log(`json:`, json);
        console.log('jsonString', JSON.stringify(json));
      })
      .catch((err) => console.log(`err:`, err));
  };

  getAlertsButton.addEventListener('click', getAlerts);

  // during dev
  // getAlertsButton.click();
})();
