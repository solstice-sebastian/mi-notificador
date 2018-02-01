(() => {
  const checkStatus = async () => {
    fetch('health').then((res) => {
      console.log(res.ok ? 'success' : 'error');
    });
  };
  checkStatus();

  const getAlertsButton = document.getElementById('get-alerts');

  const getAlerts = () => {
    // const exchange = 'BNC';
    fetch('getAlerts', {
      method: 'POST',
      body: JSON.stringify({
        exchange: 'GDAX',
        symbol: 'BTC/USD',
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
})();
