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
      id: 'operator_text',
      text: 'Trigger',
      classList: ['mdl-data-table__cell--non-numeric', 'trigger'],
    },
    note: {
      id: 'alert_note',
      text: 'Notes',
      classList: ['mdl-data-table__cell--non-numeric', 'note'],
    },
    price: {
      id: 'price',
      text: 'Price',
      classList: ['price'],
    },
  };

  const getAlertsButton = document.getElementById('get-alerts');
  let alertsTable = document.getElementById('alerts-table');

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

  const buildAlertTable = (alerts) => {
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
    // clear out placeholders
    thead.innerHTML = '';
    theaders.forEach((th) => {
      thead.appendChild(th);
    });

    const tbody = alertsTable.querySelector('tbody');
    // clear out placeholders
    tbody.innerHTML = '';
    alerts.forEach((alert) => {
      const row = document.createElement('tr');
      row.setAttribute('data-alert-id', alert.alert_id);

      Object.keys(apiMap).forEach((key) => {
        const cell = document.createElement('td');
        cell.classList.add(...apiMap[key].classList);
        cell.innerText = alert[apiMap[key].id];
        row.appendChild(cell);
      });
      tbody.append(row);
    });

    // make rows selectable
    alertsTable = new window.MaterialDataTable(alertsTable);
  };

  const getAlerts = () =>
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
      .then(buildAlertTable)
      .catch((err) => console.log(`err:`, err));

  getAlertsButton.addEventListener('click', getAlerts);

  // during dev
  getAlertsButton.click();
})();
