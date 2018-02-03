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

  const apiMap = {
    trigger: {
      text: 'Trigger',
      key: 'operator_text',
      classList: ['mdl-data-table__cell--non-numeric', 'trigger'],
      id: 'operator-text',
    },
    note: {
      text: 'Notes',
      key: 'alert_note',
      classList: ['mdl-data-table__cell--non-numeric', 'note'],
      id: 'alert-note',
    },
    price: {
      text: 'Price',
      key: 'alert_price',
      classList: ['trigger'],
      id: 'alert-price',
    },
  };

  const getAlertsButton = document.getElementById('get-alerts');
  const alertsTable = document.getElementById('alerts-table');

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

  const displayAlerts = (alerts) => {
    // build header row
    // build the table
    const theaders = Object.keys(apiMap).map((key) => {
      const cell = document.createElement('th');
      cell.classList.add(...apiMap[key].classList);
      cell.innerText = apiMap[key].text;
      return cell;
    });
    // add to thead
    const thead = alertsTable.querySelector('thead tr');
    theaders.forEach((th) => {
      thead.appendChild(th);
    });

    // const rows = alerts.map((alert, i) => {
    //   let rowTag = 'tr';
    //   let cellTag = 'td';
    //   if (i === 0) {
    //     // header row
    //     rowTag = 'th';
    //   }
    //   const row = document.createElement('tr');
    //   // trigger
    //   const cells = Object.keys.map((key) => {
    //     const cell = document.createElement('td');
    //     cell.classList.add(apiMap[key].classList.join(' '));
    //     cell.innerText = apiMap[key].key
    //   })
    //   row.appendChild();
    //   row.appendChild(document.createElement('td').classList.add(apiMap.notes.id));
    //   row.appendChild(document.createElement('td').classList.add(apiMap.price.id));
    // });
  };

  const getAlerts = () => {
    return fetch('getAlerts', {
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
      .then(displayAlerts)
      .catch((err) => console.log(`err:`, err));
  };

  getAlertsButton.addEventListener('click', getAlerts);

  // during dev
  getAlertsButton.click();
})();
