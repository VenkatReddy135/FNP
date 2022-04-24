import {
  isAlphaNumeric,
  isValidEmail,
  isLetter,
  isStringNumber,
  passwordValidation,
  checkForDot,
} from "../validationFunction";

/*
 * test cases for validation functions isAlphaNumeric
 */
const isAlphaNumericName = ["Robert1", "john1", "2James", "sam", "JOY", "12345"];
const isNotAlphaNumericName = ["!Peter_", ".Charlie", " Ramsay"];

describe("isAlphaNumeric", () => {
  it("should not pass names that contain character other than number and alphabets", () => {
    isNotAlphaNumericName.forEach((arg) => {
      const result = isAlphaNumeric(arg);
      expect(result).toBe(false);
    });
  });

  it("should pass names that contain number and alphabets", () => {
    isAlphaNumericName.forEach((arg) => {
      const result = isAlphaNumeric(arg);
      expect(result).toBe(true);
    });
  });
});

/*
 * test cases for validation functions checkForDot
 */
const isNotDot = ["abc", "abc"];
const isDot = ["abc.", ".abc"];

describe("nameContainsDotInTwoWords", () => {
  it("should not pass if name contains dot not between two word", () => {
    isNotDot.forEach((arg) => {
      const result = checkForDot(arg);
      expect(result).toBe(false);
    });
  });

  it("should pass if name contain dot between two words", () => {
    isDot.forEach((arg) => {
      const result = checkForDot(arg);
      expect(result).toBe(true);
    });
  });
});

/*
 * test cases for validation functions isLetter
 */
const lettersOnly = ["Jack Smith", "Robert"];
const nonLetters = ["123", "123Joy", "Joy123"];

describe("alphabets Validation", () => {
  it("should not pass when string does contains letters only", () => {
    nonLetters.forEach((arg) => {
      const result = isLetter(arg);
      expect(result).toBe(false);
    });
  });

  it("should pass valid when string contains letters only", () => {
    lettersOnly.forEach((arg) => {
      const result = isLetter(arg);
      expect(result).toBe(true);
    });
  });
});

/*
 * test cases for email validation
 */
const inValidEmails = ["abc@gmailcom", "abc.@gmailcom", "abc@.gmail"];
const validEmails = ["abc@gmail.com", "abc@g.com"];

describe("emailValidation", () => {
  it("should not pass invalid email Id's", () => {
    inValidEmails.forEach((arg) => {
      const result = isValidEmail(arg);
      expect(result).toBe(false);
    });
  });

  it("should pass valid email Id's", () => {
    validEmails.forEach((arg) => {
      const result = isValidEmail(arg);
      expect(result).toBe(true);
    });
  });
});

/*
 * test cases for validation functions isStringNumber
 */
const inValidNumericString = ["YourName123", "!@#$%&*", "!@Sa1234560!", ""];
const numericString = "1234567890";

describe("Validate String consist of only Numbers", () => {
  it("Validate for alpha-numerics, special-chars,Random String, Empty String", () => {
    inValidNumericString.forEach((arg) => {
      const result = isStringNumber(arg);
      expect(result).toBe(false);
    });
  });

  it("Validate for only numbers", () => {
    const result = isStringNumber(numericString);
    expect(result).toBe(true);
  });
});

/*
 * test cases for validation functions passwordValidation
 */
const validPassword = "Pass@123";
const inValidCharLengthPassword = "Pass@1";
const inValidSpecialCharPassword = "Pass1234";
const inValidNumericPassword = "Pass@Pass";
const inValidUpperCasePassword = "pass@123";
const inValidLowerCasePassword = "PASS@123";
const emptyPassword = "";
const passObj = { number: true, lowerCase: true, upperCase: true, charLength: true, specialChar: true };
const invalidCharLengthObj = { number: true, lowerCase: true, upperCase: true, charLength: false, specialChar: true };
const invalidSpecialCharObj = { number: true, lowerCase: true, upperCase: true, charLength: true, specialChar: false };
const invalidNumericObj = { number: false, lowerCase: true, upperCase: true, charLength: true, specialChar: true };
const invalidUpperCaseObj = { number: true, lowerCase: true, upperCase: false, charLength: true, specialChar: true };
const invalidLowerCaseObj = { number: true, lowerCase: false, upperCase: true, charLength: true, specialChar: true };
const emptyPasswordObj = { number: false, lowerCase: false, upperCase: false, charLength: false, specialChar: false };

describe("Validate various Password Requirements", () => {
  it("Validate for Valid passwords", () => {
    const result = passwordValidation(validPassword);
    expect(result).toStrictEqual(passObj);
  });

  it("Validate Password has not Min Length of 8", () => {
    const result = passwordValidation(inValidCharLengthPassword);
    expect(result).toStrictEqual(invalidCharLengthObj);
  });

  it("Validate Password has no Special Characters", () => {
    const result = passwordValidation(inValidSpecialCharPassword);
    expect(result).toStrictEqual(invalidSpecialCharObj);
  });

  it("Validate Password has no Numeric value", () => {
    const result = passwordValidation(inValidNumericPassword);
    expect(result).toStrictEqual(invalidNumericObj);
  });

  it("Validate Password has no UpperCase value", () => {
    const result = passwordValidation(inValidUpperCasePassword);
    expect(result).toStrictEqual(invalidUpperCaseObj);
  });

  it("Validate Password has no LowerCase value", () => {
    const result = passwordValidation(inValidLowerCasePassword);
    expect(result).toStrictEqual(invalidLowerCaseObj);
  });

  it("Validate Empty Password", () => {
    const result = passwordValidation(emptyPassword);
    expect(result).toStrictEqual(emptyPasswordObj);
  });
});
