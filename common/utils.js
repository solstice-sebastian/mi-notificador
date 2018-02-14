(() => {
  /**
   * helper functions that can be used anywher
   */

  const ENTER_KEY_CODE = 13;

  /**
   * @param  {Object} modelMap = {} contains data for each 'column' in table
   *  modelMap = {
   *    colName: {
   *      id: idForRecords,
   *      text,
   *      classList,
   *    }
   *  }
   * @param  {Array[Object]} data = []
   */
  const buildTable = (modelMap = {}, data = [], elem) => {
    let table;
    let thead;
    let tbody;

    if (elem === undefined || elem.constructor !== HTMLTableElement) {
      table = document.createElement('table');
      thead = document.createElement('thead');
      tbody = document.createElement('tbody');
      table.appendChild(thead);
      table.appendChild(tbody);
    } else {
      table = elem;
      thead = table.querySelector('thead');
      tbody = table.querySelector('tbody');
    }

    // build header row
    const headerRow = document.createElement('tr');
    headerRow.setAttribute('data-id', 'header-row');
    Object.keys(modelMap).forEach((col) => {
      if (col !== 'id') {
        const cell = document.createElement('th');
        cell.classList.add(...modelMap[col].classList);
        cell.innerText = modelMap[col].text;
        headerRow.appendChild(cell);
      }
    });
    thead.appendChild(headerRow);

    // build data rows
    data.forEach((record) => {
      const row = document.createElement('tr');
      row.setAttribute('data-record-id', record[modelMap.id]);
      Object.keys(modelMap).forEach((col) => {
        if (col !== 'id') {
          const cell = document.createElement('td');
          cell.classList.add(...modelMap[col].classList);
          cell.innerText = record[modelMap[col].id];
          row.appendChild(cell);
        }
      });
      tbody.appendChild(row);
    });

    return table;
  };

  const emptyElems = (elems) => {
    if (elems && Array.isArray(elems)) {
      elems.forEach((elem) => {
        if (elem instanceof Element) {
          elem.childNodes.forEach((child) => {
            child.parentNode.removeChild(child);
          });
        } else {
          throw new Error(`emptyElems expects Array[Element]. '${typeof elem}' passed instead`);
        }
      });
    } else {
      throw new Error(`emptyElems expects Array[Element]. '${typeof elems}' passed instead`);
    }
  };

  const listenForEnter = (elem, fn) => {
    elem.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode;
      if (key === ENTER_KEY_CODE) {
        fn(elem);
      }
    });
  };

  const runLater = (fn, wait) =>
    new Promise((res, rej) => {
      window.setTimeout(() => {
        try {
          res(fn());
        } catch (err) {
          rej(err);
        }
      }, wait);
    });

  const resolveLater = (promise, wait) => {
    const later = new Promise((res) => {
      setTimeout(() => {
        res(promise);
      }, wait);
    });
    return later;
  };

  /**
   * @usage elems that have a `.route` class and comma separated list of route ids in `data-route-ids`
   * will be shown/hidden based on a `a.router-link[data-route-id]`
   * @returns router object
   * @method update({ link }) called on click
   * @method goTo({ id })
   */
  const createRouter = ({ links, isActiveClass = 'is-active' }) => {
    if (Array.isArray(links) === false) {
      throw new Error('createRouter expects an array of route elems');
    }
    const router = {
      update({ link }) {
        const routes = document.querySelectorAll('.route');
        routes.forEach((route) => {
          if (route.getAttribute('data-route-ids') === null) {
            throw new Error(`route elems must also contain 'data-route-ids'`);
          }

          // route elems can have a comma separated list of routes to be visible for
          const routeIds = route.getAttribute('data-route-ids').split(',');

          if (routeIds.includes(link.getAttribute('data-route-id'))) {
            route.classList.add(isActiveClass);
            document.body.className = route.getAttribute('data-route-id');
          } else {
            route.classList.remove(isActiveClass);
            document.body.classList.add(route.getAttribute('data-route-id'));
          }
        });
      },

      goTo({ id }) {
        const link = document.querySelector(`.router-link[data-route-id="${id}"]`);
        this.update({ link });
      },
    };

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        router.update({ link: e.target });
      });
    });

    document.addEventListener('DOMContentLoaded', () => {
      if (window.location.hash !== '') {
        const id = window.location.hash.replace('#', '');
        router.goTo({ id });
      }
    });

    return router;
  };

  const isThenable = (obj = {}) => {
    if (typeof obj.then === 'function' && typeof obj.catch === 'function') {
      return true;
    }
    return false;
  };

  /**
   * simple helper object that runs through a queue of promises sequentially
   * doesn't currently handle caught errors
   */
  const promiseQueue = (inputPromises) => {
    const profiler = window.Profiler();
    const promises = [].concat(inputPromises);

    const run = () => {
      profiler.start();
      return promises.reduce(
        (acc, curr) =>
          acc.then((responses) =>
            curr.then((currResult) => {
              const output = [...responses, currResult];
              return output;
            })
          ),
        Promise.resolve([])
      );
    };

    return { run };
  };

  const promiseFactoryQueue = (inputFactories) => {
    const factories = [].concat(inputFactories);
    const results = [];
    const profiler = window.Profiler();

    const run = (wait = 0) => {
      if (profiler.isRunning() === false) {
        profiler.start();
      }
      return new Promise((res) => {
        const _run = () => {
          const next = factories.shift();
          if (next === undefined) {
            profiler.log('last promise');
            return res(results);
          } else if (typeof next !== 'function') {
            throw new Error(
              `promiseQueue#runWithPause expected PromiseFactory but received ${typeof next} instead`
            );
          } else {
            return window.setTimeout(() => {
              next().then((response) => {
                if (response && typeof response.json === 'function') {
                  response.json().then((json) => results.push(json));
                } else {
                  results.push(response);
                }
                _run(wait);
              });
            }, wait);
          }
        };
        _run();
      });
    };

    return { run };
  };

  const isEmpty = (x = {}) =>
    x === null ||
    x === undefined ||
    x === false ||
    x === '' ||
    x === [] ||
    Object.keys(x).length === 0;

  const findSignificantNumbersPlace = (x) => {
    if (x > 1) {
      return 1;
    }
    return 0;
  };

  if (window !== undefined && document !== undefined) {
    window.Utils = () => ({
      buildTable,
      emptyElems,
      listenForEnter,
      createRouter,
      runLater,
      resolveLater,
      isThenable,
      promiseQueue,
      promiseFactoryQueue,
      isEmpty,
      findSignificantNumbersPlace,
    });
  } else if (module !== undefined && module.exports !== undefined) {
    module.exports = {
      runLater,
      resolveLater,
      isThenable,
      promiseQueue,
      promiseFactoryQueue,
      isEmpty,
      findSignificantNumbersPlace,
    };
  }
})();
