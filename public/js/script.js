(() => {
  const { emptyElems, listenForEnter } = window.Utils();
  const { buildMDLTable } = window.MDLHelpers();

  const checkStatus = async () => {
    fetch('health').then((res) => {
      console.log(res.ok ? 'success' : 'error');
    });
  };
  checkStatus();

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  let model = []; // the data for the table

  const cacheModel = (data) => {
    model = data;
  };

  const getModel = () => model;

  const alertsContainer = document.getElementById('alerts');
  const exchangeInput = document.getElementById('exchange');
  const symbolInput = document.getElementById('symbol');
  const getAlertsButton = document.getElementById('get-alerts');

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
        cacheModel(alerts);
        buildMDLTable({ model: alerts, map: alertMap, container: alertsContainer });
      })
      .catch((err) => console.log(`err:`, err));

  const getAlertsClick = () => {
    emptyElems(elemsToEmpty);
    getAlerts();
  };

  const filterSymbol = () => {
    const symbol = getSymbol();
    const filtered = getModel().filter((record) => {
      const key = alertMap.symbol.id;
      return record[key].toLowerCase().includes(symbol.toLowerCase());
    });
    emptyElems(elemsToEmpty);
    buildMDLTable({ model: filtered, map: alertMap, container: alertsContainer });
  };

  /**
   * event listeners
   */
  getAlertsButton.addEventListener('click', getAlertsClick);
  listenForEnter(symbolInput, getAlertsClick);
  listenForEnter(exchangeInput, getAlertsClick);

  symbolInput.addEventListener('keyup', filterSymbol);
  // exchangeInput.addEventListener('keypress', filterExchange);

  // during dev
  // getAlertsButton.click();
})();
