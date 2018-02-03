(() => {
  const { buildTable, emptyElems, listenForEnter } = window.Utils();
  const { componentHandler } = window;

  const checkStatus = async () => {
    fetch('health').then((res) => {
      console.log(res.ok ? 'success' : 'error');
    });
  };
  checkStatus();

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const alertsContainer = document.getElementById('alerts');
  const exchangeInput = document.getElementById('exchange');
  const symbolInput = document.getElementById('symbol');

  const elemsToEmpty = [alertsContainer];

  const alertMap = {
    id: 'alert_id',

    symbol: {
      id: 'mkt_name',
      text: 'Symbol',
      classList: ['mdl-data-table__cell--non-numeric', 'symbol'],
    },

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

  const getExchange = () => {
    const exchange = exchangeInput.value;
    return exchange;
  };

  const getSymbol = () => {
    const symbol = symbolInput.value;
    return symbol;
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
      .then((alerts) => {
        // const table = new MaterialDataTable(buildTable(alertMap, alerts));
        // componentHandler.upgradeElement(table.element_, 'MaterialDataTable');
        const table = buildTable(alertMap, alerts);
        table.classList.add(
          ...[
            'mdl-data-table',
            'mdl-js-data-table',
            'mdl-data-table--selectable',
            'mdl-shadow--2dp',
          ]
        );

        componentHandler.upgradeElement(table);
        alertsContainer.appendChild(table);
      })
      .catch((err) => console.log(`err:`, err));

  const getAlertsButton = document.getElementById('get-alerts');

  const getAlertsClick = () => {
    emptyElems(elemsToEmpty);
    getAlerts();
  };

  getAlertsButton.addEventListener('click', getAlertsClick);
  listenForEnter(symbolInput, getAlertsClick);
  listenForEnter(exchangeInput, getAlertsClick);

  // during dev
  // getAlertsButton.click();
})();
