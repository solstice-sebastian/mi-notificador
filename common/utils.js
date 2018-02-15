(() => {
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

  if (typeof module !== 'undefined' && module.exports !== undefined) {
    module.exports = {
      runLater,
      resolveLater,
      isThenable,
      promiseQueue,
      promiseFactoryQueue,
      isEmpty,
      findSignificantNumbersPlace,
    };
  } else if (window !== undefined && document !== undefined) {
    window.Utils = () => ({
      runLater,
      resolveLater,
      isThenable,
      promiseQueue,
      promiseFactoryQueue,
      isEmpty,
      findSignificantNumbersPlace,
    });
  }
})();
