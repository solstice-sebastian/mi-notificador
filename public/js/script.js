(() => {
  const { emptyElems, listenForEnter, runLater } = window.Utils();
  const { buildMDLTable, getSelectedRows, createSpinner } = window.MDLHelpers();

  const API_WAIT_TIME = 1000 * 1.5; // 1.5 seconds

  const checkStatus = async () => {
    fetch('health').then((res) => {
      console.log(res.ok ? 'success' : 'error');
    });
  };
  checkStatus();

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  let _model = []; // the data for the table

  const cacheModel = (data) => {
    _model = data;
  };

  const getModel = () => _model;

  const alertsContainer = document.getElementById('alerts');
  const exchangeInput = document.getElementById('exchange');
  const symbolInput = document.getElementById('symbol');
  const getAlertsButton = document.getElementById('get-alerts');
  const deleteAlertsButton = document.getElementById('delete-alerts');
  const spinnerContainer = document.getElementById('spinner-container');
  const spinner = createSpinner({ container: spinnerContainer });
  spinnerContainer.appendChild(spinner);

  const elemsToEmpty = [alertsContainer];

  const alertMap = {
    id: 'alert_id',
    symbol: {
      id: 'mkt_name',
      text: 'Symbol',
      classList: ['mdl-data-table__cell--non-numeric', 'symbol'],
    },
    exchange: {
      id: 'exch_name',
      text: 'Exchange',
      classList: ['mdl-data-table__cell--non-numeric', 'exchange'],
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

  const filterAlerts = (model) => {
    const symbol = getSymbol();
    const exchange = getExchange();
    const filtered = model
      .filter((record) => {
        const key = alertMap.symbol.id;
        return record[key].toLowerCase().includes(symbol.toLowerCase());
      })
      .filter(
        (record) =>
          record[alertMap.exchange.id].toLowerCase().includes(exchange.toLowerCase()) ||
          record.exch_code.toLowerCase().includes(exchange.toLowerCase())
      );
    return filtered;
  };

  const update = (model = getModel()) => {
    emptyElems(elemsToEmpty);
    const filtered = filterAlerts(model);
    buildMDLTable({ model: filtered, map: alertMap, container: alertsContainer }).then(() =>
      spinner.hide()
    );
    return model;
  };

  const getAlerts = () => {
    spinner.show();
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
      .then((alerts) => {
        cacheModel(alerts);
        return update(alerts);
      })
      .catch((err) => console.log(`err:`, err));
  };

  const deleteSelected = () => {
    const selectedRows = getSelectedRows({
      table: document.querySelector('#alerts table'),
    });
    const alertIds = selectedRows.map((row) => row.getAttribute('data-record-id'));
    return fetch('deleteAlerts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ alertIds }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response && response.err_msg) {
          return Promise.reject(new Error(response.err_msg));
        }
        return Promise.resolve(runLater(getAlerts, API_WAIT_TIME));
      })
      .catch((err) => console.log(`err:`, err));
  };

  /**
   * event listeners
   */
  getAlertsButton.addEventListener('click', getAlerts);
  listenForEnter(symbolInput, () => update());
  listenForEnter(exchangeInput, () => update());

  symbolInput.addEventListener('keyup', () => update());
  exchangeInput.addEventListener('keyup', () => update());

  deleteAlertsButton.addEventListener('click', deleteSelected);
})();
