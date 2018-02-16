(() => {
  const hideable = ({ elem, isHiddenClass = 'is-hidden' }) => {
    const mixin = {
      show() {
        elem.classList.remove(isHiddenClass);
        return this;
      },

      hide() {
        elem.classList.add(isHiddenClass);
        return this;
      },
    };

    return mixin;
  };

  const Mixins = () => ({ hideable });

  window.Mixins = Mixins;
})();
