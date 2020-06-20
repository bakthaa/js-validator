const format = function (format) {
  return function (value) {
    return format.regex.test(value)
      ? value.replace(format.regex, format.fmt)
      : value;
  };
};

export default {
  PHONE: format({
    regex: /^(\d{3})(\d{3})(\d{1,4})$/,
    fmt: "($1) $2-$3",
  }),
  CUSTOM_NUM: format({
    regex: /^([0-9]{2})([a-zA-Z0-9]{4})([a-zA-Z0-9]{3})$/,
    fmt: "$1-$2-$3",
  }),
  CURRENCY: function (value) {
    return Number(value) === 0 ? "" : "$" + Number(value).format(2);
  },
};
