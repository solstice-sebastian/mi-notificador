const isEmpty = (x = {}) =>
  x === null ||
  x === undefined ||
  x === false ||
  x === '' ||
  x === [] ||
  Object.keys(x).length === 0;

const utils = {
  isEmpty,
};
export default utils;
