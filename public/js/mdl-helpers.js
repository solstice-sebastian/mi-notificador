(() => {
  const IS_SELECTED_CLASS = 'is-selected';
  if (window.componentHandler === 'undefined') {
    throw new Error('missing MDL dependencies for MDLHelpers');
  }

  const { buildTable } = window.Utils();
  const { componentHandler } = window;

  /**
   * builds a table and adds required info to build a mdl-data-table
   */
  const buildMDLTable = ({ model, map, container }) => {
    const table = buildTable(map, model);
    table.classList.add(
      ...['mdl-data-table', 'mdl-js-data-table', 'mdl-data-table--selectable', 'mdl-shadow--2dp']
    );

    componentHandler.upgradeElement(table);
    container.appendChild(table);
  };

  const getSelectedRows = ({ table }) => {
    if (!table || typeof table !== 'object' || table instanceof Element === false) {
      throw new Error('getSelectedRows expects a table element');
    }
    return Array.from(table.rows).filter((row) => row.classList.contains(IS_SELECTED_CLASS));
  };

  window.MDLHelpers = () => ({ buildMDLTable, getSelectedRows });
})();
