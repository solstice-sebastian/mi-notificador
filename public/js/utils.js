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

const Utils = () => ({ buildTable });

window.Utils = Utils;
