(() => {
  const IS_SELECTED_CLASS = 'is-selected';
  const IS_HIDDEN_CLASS = 'is-hidden';
  const IS_ACTIVE_CLASS = 'is-active';

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
    return Promise.resolve(container.appendChild(table));
  };

  const getSelectedRows = ({ table }) => {
    if (!table || typeof table !== 'object' || table instanceof Element === false) {
      throw new Error('getSelectedRows expects a table element');
    }
    return Array.from(table.rows).filter((row) => row.classList.contains(IS_SELECTED_CLASS));
  };

  const createSpinner = ({ container, classList = [] }) => {
    const spinner = document.createElement('div');
    spinner.container = container;
    spinner.show = () => {
      spinner.container.classList.remove(IS_HIDDEN_CLASS);
      spinner.classList.add(IS_ACTIVE_CLASS);
      return spinner;
    };
    spinner.hide = () => {
      spinner.container.classList.add(IS_HIDDEN_CLASS);
      spinner.classList.remove(IS_ACTIVE_CLASS);
    };

    spinner.classList.add(...['mdl-spinner', 'mdl-js-spinner'].concat(classList));
    return spinner;
  };

  const createDialog = ({ elem = null } = {}) => {
    let dialog;
    if (elem !== null && elem instanceof Element === false) {
      throw new Error('createDialog requires HTMLElement');
    } else if (elem === null) {
      dialog = document.querySelector('dialog');
    } else {
      dialog = elem;
    }

    if (typeof dialog.showModal !== 'function') {
      console.log('requires dialog polyfill');
      // dialogPolyfill.registerDialog(dialog);
    }

    // pieces
    const titleElem = dialog.querySelector('.mdl-dialog__title');
    const contentElem = dialog.querySelector('.mdl-dialog__content');

    // listeners
    dialog.querySelector('.close').addEventListener('click', () => {
      dialog.close();
    });

    // methods
    dialog.display = ({ title, content, classList = [], isModal = true }) => {
      titleElem.innerText = title;
      contentElem.innerText = content;
      dialog.classList.add(...classList);
      if (isModal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
      return dialog;
    };

    dialog.getContent = () => contentElem.innerText;
    dialog.getTitle = () => titleElem.innerText;

    return dialog;
  };

  window.MDLHelpers = () => ({ buildMDLTable, getSelectedRows, createSpinner, createDialog });
})();
