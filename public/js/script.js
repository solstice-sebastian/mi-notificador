(() => {
  const { emptyElems, createRouter } = window.BrowserUtils();
  const { promiseFactoryQueue } = window.Utils();
  const { buildMDLTable, getSelectedRows, createSpinner, createDialog } = window.MDLHelpers();

  const IS_DEV = window.location.origin.includes('localhost');

  const API_WAIT_TIME = 1000 * 1.5; // 1.5 seconds
  const STATUS_SUCCESS = 200;
  // const STATUS_RATE_EXCEEDED = 500;

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

  const links = Array.from(document.querySelectorAll('.router-link'));
  const router = createRouter({ links });
  router.goTo({ id: 'home' });

  // const profiler = window.Profiler();

  const alertsContainer = document.getElementById('alerts');

  // inputs
  const exchangeInput = document.getElementById('exchange');
  const symbolInput = document.getElementById('symbol');
  const targetInput = document.getElementById('target');

  // buttons
  const addAlertsButton = document.getElementById('add-alerts');
  const getAlertsButton = document.getElementById('get-alerts');
  const deleteAlertsButton = document.getElementById('delete-alerts');

  // toggles
  const bigEvensToggle = document.getElementById('big-evens');
  const fibRangeToggle = document.getElementById('fib-range');

  const spinnerContainer = document.getElementById('spinner-container');
  const spinner = createSpinner({ container: spinnerContainer });
  spinnerContainer.appendChild(spinner);
  const dialog = createDialog();

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

  const getTarget = () => {
    const target = targetInput.value;
    return target;
  };

  const getPriceOptions = () => ({
    isBigEvensChecked: bigEvensToggle.checked,
    isFibRangeChecked: fibRangeToggle.checked,
  });

  // TODO: get from user input
  // const getFibMods = () => {
  //   return [-0.08, -0.05, -0.03, -0.01, 1, 0.08, 0.05, 0.03, 0.01];
  // };

  const getFibMods = () => [-0.08, -0.05, -0.03, -0.01, 0, 0.01, 0.03, 0.05, 0.08];
  // const getFibMods = () => [-0.01, 0, 0.01];
  const getNotes = () =>
    getFibMods().map((mod) => {
      if (mod > 0) {
        return `${mod * 100}% UP from: ${getTarget()}`;
      }
      return `${mod * 100}% DOWN from: ${getTarget()}`;
    });

  const getPrices = () => {
    const target = +getTarget();
    const prices = [target];
    const { isBigEvensChecked, isFibRangeChecked } = getPriceOptions();

    if (isFibRangeChecked) {
      const fibMods = getFibMods();
      const fibPrices = fibMods.map((fibMod) => {
        if (fibMod < 0) {
          const diff = target * Math.abs(fibMod);
          const result = target - diff;
          return Math.abs(result) > 1 ? result.toFixed(2) : result.toFixed(8);
        }
        const diff = target * fibMod;
        const result = target + diff;
        return Math.abs(result) > 1 ? result.toFixed(2) : result.toFixed(8);
      });
      prices.push(...fibPrices);
    }

    if (isBigEvensChecked) {
      // needs to handle whole and fractional
      // i.e. 120 && 0.00120044
      if (target > 1) {
        // whole numbers
        // get 10s place
        // const
      }
    }
  };

  const filterAlerts = (model) => {
    if (Array.isArray(model) === false) {
      throw new Error(`filterAlerts expected Array but received '${typeof model}' instead`);
    }
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

  const displayEmptyResponse = () => {
    spinner.hide();
    alertsContainer.innerHTML = `<p class="empty-response">No alerts...</p>`;
  };

  const update = (model = getModel()) => {
    if (model !== undefined && model.length !== 0) {
      emptyElems(elemsToEmpty);
      const filtered = filterAlerts(model);
      buildMDLTable({ model: filtered, map: alertMap, container: alertsContainer }).then(() =>
        spinner.hide()
      );
      return model;
    } else if (model.length === 0) {
      displayEmptyResponse();
    } else if (model && model.errno !== undefined) {
      throw new Error(`Error: ${model.reason}`);
    }
    return null;
  };

  const getAlerts = () => {
    spinner.show();
    emptyElems(elemsToEmpty);
    return fetch('getAlerts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        exchange: getExchange(),
        symbol: getSymbol(),
      }),
    })
      .then((res) => {
        if (res.status === STATUS_SUCCESS) {
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
    spinner.show();
    const selectedRows = getSelectedRows({
      table: document.querySelector('#alerts table'),
    });
    emptyElems(elemsToEmpty);
    const selectedAlertIds = selectedRows.map((row) => row.getAttribute('data-record-id'));
    // split into lists of <= 5
    const listOfLists = selectedAlertIds.reduce(
      (acc, curr) => {
        const lastList = acc[acc.length - 1];
        if (lastList.length < 6) {
          // add to lastList
          lastList.push(curr);
        } else {
          // start new list
          acc.push([curr]);
        }
        return acc;
      },
      [[]]
    );

    const factories = listOfLists.map((alertIds) => () =>
      new Promise((res) => {
        fetch('deleteAlerts', {
          method: 'POST',
          headers,
          body: JSON.stringify({ alertIds }),
        }).then(() => res());
      })
    );
    const queue = promiseFactoryQueue(factories);
    queue
      .run(API_WAIT_TIME / factories.length)
      .then(getAlerts)
      .catch((err) => console.log(`err:`, err));
  };

  /**
   * add single alert
   * @return promise that resolves once the alert has been successfully added
   */
  const addAlert = ({ exchange, symbol, price, note }) =>
    fetch('addAlert', {
      method: 'POST',
      headers,
      body: JSON.stringify({ exchange, symbol, price, note }),
    });

  const addAlerts = () => {
    if (getExchange() === '' || getSymbol() === '' || getTarget() === '') {
      return dialog.display({
        title: 'Error',
        content: 'All fields are required to add alerts',
      });
    }

    spinner.show();
    emptyElems(elemsToEmpty);
    const exchange = getExchange();
    const symbol = getSymbol();
    const prices = getPrices();
    const notes = getNotes();
    const factories = prices.map((price, i) => () =>
      addAlert({
        headers,
        price,
        symbol,
        exchange,
        note: notes[i],
      })
    );
    const queue = promiseFactoryQueue(factories);
    return queue
      .run(API_WAIT_TIME / factories.length)
      .then((results) => {
        // get errors
        const errors = results.filter((result) => result.err_msg !== undefined);
        if (errors.length !== 0) {
          dialog.display({
            title: `${errors.length} Errors :(`,
            content: `${errors.map((error) => error.err_msg).join('\n')}`,
          });
        }
      })
      .then(getAlerts)
      .catch((error) => {
        console.log(`error:`, error);
      });
  };

  /**
   * event listeners
   */
  getAlertsButton.addEventListener('click', getAlerts);
  addAlertsButton.addEventListener('click', addAlerts);
  deleteAlertsButton.addEventListener('click', deleteSelected);

  symbolInput.addEventListener('keyup', () => update());
  exchangeInput.addEventListener('keyup', () => update());

  /**
   * dev helpers
   */
  if (IS_DEV === true) {
    router.goTo({ id: 'creating' });
    symbolInput.value = 'OMG/BTC';
    exchangeInput.value = 'Binance';
    targetInput.value = 0.000068;

    // runLater(getAlerts, 50);
  }
})();
