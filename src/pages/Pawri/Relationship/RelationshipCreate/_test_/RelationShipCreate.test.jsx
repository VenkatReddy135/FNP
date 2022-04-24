/* eslint-disable no-undef */
import { requiredValidation } from "../../../../../utils/validationFunction";

const isRequired = ["Stephen", "roy", ["1", "2", "3"]];
const isNotRequired = ["", "", []];

describe("requiredValidation", () => {
  it("should not pass empty string", () => {
    isNotRequired.forEach((arg) => {
      const result = requiredValidation("required")(arg);
      expect(result !== undefined).toBe(true);
    });
  });

  it("should pass names that does not contain empty string", () => {
    isRequired.forEach((arg) => {
      const result = requiredValidation("required")(arg);
      expect(result === undefined).toBe(true);
    });
  });
});
