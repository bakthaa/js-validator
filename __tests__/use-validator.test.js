import { useValidator, validateFn } from "../lib";
const rules = [
  {
    fn: validateFn.REQUIRED,
    errorText: "Input is required",
  },
  {
    fn: validateFn.SIZE(9),
    errorText: "Please enter a valid 9 character.",
  },
  {
    fn: validateFn.REGEX(/^[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{3}$/),
    errorText: "Please enter a valid format.",
  },
];
const validator = useValidator(rules);
describe("useValidator", () => {
  test("Error", () => {
    expect(() => useValidator("sdfhis")).toThrow("rules must be an array!");
    expect(() => useValidator({})).toThrow("rules must be an array!");
    expect(() => useValidator(346346)).toThrow("rules must be an array!");
    expect(() => useValidator([{}])).toThrow(
      "function or errorText not specified in any of rules!"
    );
    expect(() => useValidator([{ fn: () => true }])).toThrow(
      "function or errorText not specified in any of rules!"
    );
    expect(() => useValidator([{ errorText: "Required!" }])).toThrow(
      "function or errorText not specified in any of rules!"
    );
    expect(() =>
      useValidator([
        {
          fn: () => {},
          errorText: "Input is required",
        },
        {
          errorText: "Required!",
        },
      ])
    ).toThrow("function or errorText not specified in any of rules!");
  });

  test("Invalid", () => {
    expect(validator.validate("")).toEqual({
      valid: false,
      errorText: "Input is required",
    });
    expect(validator.validate(undefined)).toEqual({
      valid: false,
      errorText: "Input is required",
    });
    expect(validator.validate(null)).toEqual({
      valid: false,
      errorText: "Input is required",
    });
    expect(validator.validate("dfgd")).toEqual({
      valid: false,
      errorText: "Please enter a valid 9 character.",
    });
    expect(validator.validate(123)).toEqual({
      valid: false,
      errorText: "Please enter a valid 9 character.",
    });
    expect(validator.validate("dgijoidd6")).toEqual({
      valid: false,
      errorText: "Please enter a valid format.",
    });
  });

  test("Valid", () => {
    expect(validator.validate("52weew123")).toEqual({
      valid: true,
    });
  });
});
