(() => {
  const hideable = ({ elem, isHiddenClass = 'is-hidden' }) => {
    let isHidden = elem.classList.contains(isHiddenClass);
    const _elem = elem;
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
    _elem.show = extensions.show;
    _elem.hide = extensions.hide;
    _elem.toggle = extensions.toggle;
    return _elem;
  };

  const Mixins = () => ({ hideable });
  window.Mixins = Mixins;
})();
