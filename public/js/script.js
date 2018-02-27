(() => {
  const { emptyElems } = window.BrowserUtils();
  const { promiseFactoryQueue } = window.Utils();
  const { buildMDLTable, getSelectedRows, createSpinner, createDialog } = window.MDLHelpers();
  const { hideable } = window.Mixins();

  const IS_DEV = window.location.origin.includes('localhost');

  const API_WAIT_TIME = 1000 * 1.5; // 1.5 seconds
  const STATUS_SUCCESS = 200;

  const PRICE_TYPE_DYNAMIC = 'dynamic';
  const PRICE_TYPE_FIBONACCI = 'fibonacci';
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

  class Price {
    constructor(amount, type = PRICE_TYPE_FIBONACCI) {
      this.amount = +amount;
      this.type = type;
    }
  }

  const cacheModel = (data) => {
    _model = data;
  };

  const getModel = () => _model;

  const dynamicRangeRow = hideable({ elem: document.getElementById('dynamic-range-row') });

  // const profiler = window.Profiler();

  const alertsContainer = document.getElementById('alerts');

  // inputs
  const exchangeInput = document.getElementById('exchange');
  const symbolInput = document.getElementById('symbol');
  const targetInput = document.getElementById('target');
  const modAmountInput = document.getElementById('mod-amount');
  const modNumberInput = document.getElementById('mod-number');

  // buttons
  const addAlertsButton = document.getElementById('add-alerts');
  const getAlertsButton = document.getElementById('get-alerts');
  const deleteAlertsButton = document.getElementById('delete-alerts');

  // toggles
  const dynamicRangeToggle = document.getElementById('dynamic-range');
  const fibRangeToggle = document.getElementById('fib-range');
  const plusMinusToggle = document.getElementById('plus-minus');

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

  const getExchange = () => exchangeInput.value.toUpperCase();
  const getSymbol = () => symbolInput.value.toUpperCase();
  const getTarget = () => +targetInput.value;
  const getModNumber = () => +modNumberInput.value;
  const getModAmount = () => +modAmountInput.value;

  const getPriceOptions = () => ({
    isDynamicRangeChecked: dynamicRangeToggle.checked,
    isFibRangeChecked: fibRangeToggle.checked,
  });

  const getPercent = (amount, target) => Math.round(Math.abs((amount - target) / target * 100));

  const getFibMods = () => [-0.08, -0.05, -0.03, -0.01, 0.01, 0.03, 0.05, 0.08];
  const getNotes = (prices) =>
    prices.map(({ amount, type }) => {
      const target = getTarget();
      // fibonacci prices
      if (amount === target) {
        return `Price at target: ${target}`;
      } else if (type === PRICE_TYPE_FIBONACCI) {
        if (amount > target) {
          return `${getPercent(amount, target)}% UP from: ${target}`;
        }
        return `${getPercent(amount, target)}% DOWN from: ${target}`;
      } else if (amount > target) {
        // dynamic prices
        return `${amount - target} UP from: ${target}`;
      } else {
        return `${target - amount} DOWN from: ${target}`;
      }
    });

  const getFibPrices = (target) => {
    const fibMods = getFibMods();
    return fibMods
      .map((fibMod) => {
        if (fibMod < 0) {
          const diff = target * Math.abs(fibMod);
          const result = target - diff;
          return Math.abs(result) > 1 ? result.toFixed(2) : result.toFixed(8);
        }
        const diff = target * fibMod;
        const result = target + diff;
        return Math.abs(result) > 1 ? result.toFixed(2) : result.toFixed(8);
      })
      .map((amount) => new Price(amount, PRICE_TYPE_FIBONACCI));
  };

  const getDynamicPrices = (target) => {
    const prices = [];
    const modAmount = +getModAmount() || 0;
    const modNumber = +getModNumber() || 0;
    const isPlusMinus = plusMinusToggle.checked === true;
    Array.from(Array(modNumber)).forEach((_, i) => {
      const mod = (i + 1) * modAmount;
      prices.push(target + mod);
      if (isPlusMinus) {
        prices.push(target - mod);
      }
      return prices;
    });
    return prices.map((amount) => new Price(amount, PRICE_TYPE_DYNAMIC));
  };

  const getPrices = () => {
    const target = getTarget();
    const prices = [new Price(target)];
    const { isFibRangeChecked, isDynamicRangeChecked } = getPriceOptions();
    if (isFibRangeChecked) {
      prices.push(...getFibPrices(target));
    }
    if (isDynamicRangeChecked) {
      prices.push(...getDynamicPrices(target));
    }
    return prices;
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

  const toggleDynamicRangeInputs = () => {
    dynamicRangeRow.toggle();
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
      .then((results) => {
        console.log(`results:`, results);
      })
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
    const notes = getNotes(prices);
    console.log(`prices:`, prices);
    console.log(`notes:`, notes);
    const factories = prices.map((price, i) => () =>
      addAlert({
        headers,
        price: price.amount,
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

  dynamicRangeToggle.addEventListener('click', toggleDynamicRangeInputs);

  symbolInput.addEventListener('keyup', () => update());
  exchangeInput.addEventListener('keyup', () => update());

  /**
   * dev helpers
   */
  if (IS_DEV === true) {
    symbolInput.value = 'NANO/BTC';
    exchangeInput.value = 'BINA';
    targetInput.value = 0.001374;
    modAmountInput.value = 50;
    modNumberInput.value = 4;
    // dynamicRangeToggle.click();
    // window.setTimeout(() => getAlertsButton.click(), 500);
  }
})();
