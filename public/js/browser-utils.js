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

  const BrowserUtils = () => ({
    buildTable,
    emptyElems,
    listenForEnter,
    createRouter,
  });

  window.BrowserUtils = BrowserUtils;
})();
