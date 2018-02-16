(() => {
  const hideable = ({ elem, isHiddenClass = 'is-hidden' }) => {
    let isHidden = elem.classList.contains(isHiddenClass);
    const extensions = {
      show() {
        this.classList.remove(isHiddenClass);
        isHidden = false;
        return this;
      },

      hide() {
        this.classList.add(isHiddenClass);
        isHidden = true;
        return this;
      },

      toggle() {
        if (isHidden) {
          this.show();
        } else {
          this.hide();
        }
        return this;
      },
    };
    return Object.assign(elem, extensions);
  };

  const Mixins = () => ({ hideable });
  window.Mixins = Mixins;
})();
