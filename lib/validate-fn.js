/**
 * return true if not valid
 */
export const validateFn = {
  REQUIRED: function (value) {
    return !value || (isNaN(value) && value.trim().length === 0);
  },
  SIZE: function (size) {
    return function (value) {
      return value && value.length !== size;
    };
  },
  MIN: function (size) {
    return function (value) {
      return value && value.length < size;
    };
  },
  MAX: function (size) {
    return function (value) {
      return value && value.length > size;
    };
  },
  REGEX: function (regexObj) {
    return function (value) {
      return value && !regexObj.test(value);
    };
  },
  LT: function (num) {
    // less than
    return function (value) {
      const _n = Number(value);
      return isNaN(_n) ? true : _n < num;
    };
  },
  GT: function (num) {
    // greater than
    return function (value) {
      const _n = Number(value);
      return isNaN(_n) ? true : _n > num;
    };
  },
};
