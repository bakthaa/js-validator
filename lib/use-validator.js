const useValidator = (function () {
  const validateArg = function (arg) {
    if (!Array.isArray(arg)) {
      throw new Error("rules must be an array!");
    }
    arg.forEach((ele) => {
      if (!ele.fn || !ele.errorText) {
        throw new Error("function or errorText not specified in any of rules!");
      }
    });
  };
  return function (rules = []) {
    validateArg(rules);
    const validateFn = function (value) {
      const result = rules.find((validator) => validator.fn(value));
      return result
        ? { valid: false, errorText: result.errorText }
        : { valid: true };
    };
    return {
      validate: (value) => validateFn(value),
    };
  };
})();

export default useValidator;
