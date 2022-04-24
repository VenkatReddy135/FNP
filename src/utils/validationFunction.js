import { regex as raRegex } from "react-admin";
import { DEFAULT_COUNTRY_CODE_ID } from "../pages/Pawri/PartyCreate/CreatePartyConstants";

/**
 * @function isStringNumber to check the given string have Number only
 * @param {string} value of selected field
 * @returns {boolean} as String have Number only
 */
export const isStringNumber = (value) => {
  return value
    ? value
        .split("")
        .map((item) => !Number.isNaN(parseInt(item, 10)))
        .every(Boolean)
    : false;
};

/**
 * @param {string} value to be checked
 * @returns {object} obj of Booleans to check all validation with Boolean Status
 * @function passwordValidation for validating password requirements
 * for number, uppercase, lowerCase, special chars and min-length (8)
 */
export const passwordValidation = (value) => {
  const obj = { number: false, lowerCase: false, upperCase: false, charLength: false, specialChar: false };
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    // number check
    if (code > 47 && code < 58) obj.number = true;
    // upper alpha (A-Z)
    else if (code > 64 && code < 91) obj.upperCase = true;
    // lower alpha (a-z)
    else if (code > 96 && code < 123) obj.lowerCase = true;
    // special characters (!"#$&'())
    else if (
      (code > 32 && code < 47) ||
      (code > 57 && code < 65) ||
      (code > 90 && code < 97) ||
      (code > 122 && code < 127)
    )
      obj.specialChar = true;
    // password length should greater than 8
    if (value.length > 7) obj.charLength = true;
  }
  return obj;
};

/**
 * @function isValidEmail
 * @param {string} email prop is passed to the function
 * @returns {boolean} returns a boolean
 */
export const isValidEmail = (email) => {
  // Check minimum valid length of an Email.
  if (email.length <= 2) {
    return false;
  }
  // If whether email has @ character.
  if (email.indexOf("@") === -1) {
    return false;
  }
  const parts = email.split("@");
  const dot = parts[1].indexOf(".");
  const len = parts[1].length;
  const dotSplits = email.split(".");
  const dotCount = parts[1].split(".").length - 1;
  if (len === 3) {
    return false;
  }
  // Check whether Dot is present, and that too minimum 1 character after @.
  if (dot === -1 || dot < 1 || dotCount > 2) {
    return false;
  }
  // Check whether Dot is not the last character and dots are not repeated.
  for (let i = 0; i < dotSplits.length; i += 1) {
    if (dotSplits[i].length === 0) {
      return false;
    }
  }
  return true;
};

/**
 * @function emailValidation to validate Email
 * @param {string} value prop is passed to the function
 * @returns {boolean} returns a boolean
 */
export const emailValidation = (value) => {
  let validEmail = false;
  if (value && value.includes("@")) {
    const infoPart = value.split("@")[0];
    const validateInfoPart = passwordValidation(
      infoPart && infoPart.includes(".") ? infoPart.replace(/./g, "") : infoPart,
    ).specialChar;
    const domainPart = value.split("@")[1];
    const valDom = passwordValidation(domainPart);
    let validateDomain;
    if (domainPart && (domainPart.includes("-") || domainPart.includes("."))) {
      const replaceHyphen = domainPart && domainPart.replace(/-/g, "");
      const replaceDot = replaceHyphen && replaceHyphen.replace(".", "");
      validateDomain = passwordValidation(replaceDot).specialChar;
    } else validateDomain = valDom.specialChar;
    validEmail = !(!isValidEmail(value) || validateInfoPart || validateDomain);
  }
  return validEmail;
};

/**
 * @function validateEmail function to validate whether email is valid or not
 * @param {string} message error message
 * @returns {string | undefined} error message or undefined
 */
export const validateEmail = (message) => (value) => (value && !emailValidation(value) ? message : undefined);

/**
 * @function isLetter to check if string has letter and space only in between
 * @param { string } string to validate
  @returns { boolean } returns true or false after validation string
 */
export const isLetter = (string) => {
  if (string && (string[0].includes(" ") || string[0].includes("."))) {
    return false;
  }
  const str = string ? string.trim() : "";
  for (let i = 0; i < str.length; i += 1) {
    const key = str.charCodeAt(i);
    if (key > 32 && (key < 65 || key > 90) && (key < 97 || key > 122) && key !== 46) {
      return false;
    }
  }
  return true;
};

/**
 * @function isAlphaNumeric to check if string accepts only alphabets and numbers
 * @param { string } string to validate
   @returns { boolean } returns true if string is alphanumeric else false
 */
export const isAlphaNumeric = (string) => {
  for (let i = 0; i < string.length; i += 1) {
    const code = string.charCodeAt(i);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123) // lower alpha (a-z)
    ) {
      return false;
    }
  }
  return true;
};

/**
 * @function validateOrgName to check if organization name accepts only alphabets, dot  and numbers
 * @param {string} message message sent by caller
 * @returns {( string | undefined)} returns undefined if string is alphanumeric else error message
 */
export const validateOrgName = (message) => (string) => {
  if (string && (string[0].includes(" ") || string[0].includes("."))) {
    return message;
  }
  const str = string ? string.trim() : "";
  for (let i = 0; i < str.length; i += 1) {
    const key = str.charCodeAt(i);
    if (key > 32 && (key < 65 || key > 90) && (key < 97 || key > 122) && (key < 48 || key > 57) && key !== 46) {
      return message;
    }
  }
  return undefined;
};

/**
 * @function requiredValidation  to check if a field is required or not
 * @param {string} message message sent by caller
 * @returns {string} will return  message or undefined
 */
export const requiredValidation = (message) => (value) =>
  !value || (value && value.length === 0) ? message : undefined;

/**
 * @name required checks length of the input value
 * @param {number} max maximum length allowed for input value
 * @param {string} message custom validation message
 * @returns {string} validation message
 */
export const maxLength = (max, message) => (value) => (value && value.length > max ? message : undefined);
/**
 * @name dateValidation used to check for future dates
 * @param {string} message validation message has to display
 * @returns {string} validation message or undefined
 */
export const dateValidation = (message) => (value) => (value && new Date(value) > new Date() ? message : undefined);
/**
 * @function validateNumber function to validate whether value has only numbers or not
 * @param {string} message error message
 * @returns {(string | undefined)} error message or undefined
 */
export const validateNumber = (message) => (value) => (value && !isStringNumber(value) ? message : undefined);

/**
 *@function validateAlphanumeric function to validate value has letters and numbers only
 * @param {string} message error message
 * @returns {(string | undefined)} error message or undefined
 */
export const validateAlphanumeric = (message) => (value) => (value && !isAlphaNumeric(value) ? message : undefined);

/**
 * @function validateLetter function to validate whether value has only letters or not
 * @param {string} message error message
 * @returns {(string | undefined)} error message or undefined
 */
export const validateLetter = (message) => (value) => (value && !isLetter(value) ? message : undefined);
/**
 * @function validateDomainField function to validate URL
 *
 * @param {string} url entered URL value
 * @param {string} domainId selected domain id
 * @param {string} URLMessage URL error message
 * @param {string} domainMessage domain error message
 * @returns {string} returns the validation result and displays error message
 */
export const validateDomainField = (url, domainId, URLMessage, domainMessage) => {
  // eslint-disable-next-line no-useless-escape
  const expression = /^((https):\/\/)?(?!.*(https))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  const regex = new RegExp(expression);
  if (!url.match(regex)) {
    return URLMessage;
  }
  if (url && !url.includes(domainId.toLowerCase())) {
    return domainMessage;
  }
  return undefined;
};

/**
 * @function validateToDateField function to validate Through date
 *
 * @param {string} fromDateSelected selected from date
 * @param {string} toDate selected to date
 * @param {string} dateErrorMessage date error message
 * @returns {string} returns the validation result and displays error message
 */
export const validateToDateField = (fromDateSelected, toDate, dateErrorMessage) => {
  let error;
  const throughDate = new Date(toDate);
  const fromDate = new Date(fromDateSelected);
  if (throughDate.getTime() <= fromDate.getTime()) {
    error = dateErrorMessage;
  }
  return error;
};

/**
 * To sort array of object by key and value
 *
 * @param {object} data array of attribute data
 * @param {object} key contains filed from data
 * @param {string} type contains filed from data
 * @returns {Array} updated sort fields
 */
export const sortArrayByKey = (data, key, type) => {
  return type === "DESC" ? data.sort((a, b) => b[key] - a[key]) : data.sort((a, b) => a[key] - b[key]);
};

/** @function minValue function to validate whether 'Through Date' is greater than selected 'From Date'
 * @param {string} min contains the minimum date that can be selected in 'Through Date' input
 * @param {string} message error message that gets displayed when selected 'To Date' is less than the 'From Date' value
 * @returns {string} validation message
 */
export const minValue = (min, message) => (value) => (value && value < min ? message : undefined);

/**
 * @function minimumNumber function to validate whether value is greater than minimum value
 * @param {string} min contains the minimum number input
 * @param {string} message error message that gets displayed
 * @returns {string} validation message
 */
export const minimumNumber = (min, message) => (value) =>
  parseInt(value, 10) < parseInt(min, 10) ? message : undefined;

/**
 * @function maximumNumber function to validate whether value is less than maximum value
 * @param {string} max contains the maximum number input
 * @param {string} message error message that gets displayed
 * @returns {string} validation message
 */
export const maximumNumber = (max, message) => (value) =>
  parseInt(value, 10) > parseInt(max, 10) ? message : undefined;

/**
 * @function handleInvalidCharsInNumberInput for number input to avoid typing invalid chars
 * @param {Event} event prop is passed to the function
 */
export const handleInvalidCharsInNumberInput = (event) => {
  const inValidChars = ["e", "E", "+", "-"];
  if (inValidChars.includes(event.key)) {
    event.preventDefault();
  }
};

/**
 * @function phoneNoValidation This function will validate phone number
 * @param {string} countryCode is passed to the function
 * @param {string} message is passed to the function
 * @returns {(string | undefined)} returns message or undefine
 */
export const phoneNoValidation = (countryCode, message) => (value) => {
  const len = typeof value === "number" ? value && value.toString().length : value && value.length;
  if (
    (value && countryCode === DEFAULT_COUNTRY_CODE_ID && len !== 10) ||
    (value && countryCode !== DEFAULT_COUNTRY_CODE_ID && len > 15)
  ) {
    return message;
  }
  return undefined;
};

/**
 * @param {string} code charCode to be checked
 * @returns {object} obj of Booleans to check all validation with Boolean Status
 * @function isSpecialChar to validate the charCode is special char
 */
export const isSpecialChar = (code) => {
  return (code > 32 && code < 47) || (code > 57 && code < 65) || (code > 90 && code < 97) || (code > 122 && code < 127);
};

/**
 * @param {string} code charCode to be checked
 * @returns {object} obj of Booleans to check all validation with Boolean Status
 * @function isLowerCase to validate the charCode is Lower Case
 */
export const isLowerCase = (code) => {
  return code > 96 && code < 123;
};

/**
 * @param {string} code charCode to be checked
 * @returns {object} obj of Booleans to check all validation with Boolean Status
 * @function isSpecialChar to validate the charCode is special char
 */
export const isUpperCase = (code) => {
  return code > 64 && code < 91;
};

/**
 * @param {string} code charCode to be checked
 * @returns {object} obj of Booleans to check all validation with Boolean Status
 * @function isNumber to validate the Char code is Number
 */
export const isNumber = (code) => {
  return code > 47 && code < 58;
};

/**
 * @function urlValidtorForTextfield function to return a validator function
 * @description only to be used with React-admin Textfield & pass in validate props array
 * @param {string} errorMessage message to be shown on error
 * @returns {Function} returns a funtion to be passed in validator array
 */
export const urlValidtorForTextfield = (errorMessage) => {
  return raRegex(
    // eslint-disable-next-line no-useless-escape
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    errorMessage,
  );
};
/**
 * @function specialCharacterCheck to check if field contains special character other than .,@,-,_
 * @param {string} message message sent by caller
 * @returns {( string | undefined)} returns undefined or string
 */
export const specialCharacterCheck = (message) => (string) => {
  if (string && (string[0].includes(" ") || string[0].includes("."))) {
    return message;
  }
  const str = string ? string.trim() : "";
  for (let i = 0; i < str.length; i += 1) {
    const key = str.charCodeAt(i);
    if (
      key >= 32 &&
      (key < 65 || key > 90) &&
      (key < 97 || key > 122) &&
      (key < 48 || key > 57) &&
      key !== 46 &&
      key !== 64 &&
      key !== 95 &&
      key !== 45
    ) {
      return message;
    }
  }
  return undefined;
};

/**
 * @function handleInvalidNumberLength for number input length to prevent going to infinity
 * @param {object} event prop is passed to the function
 * @param {number} max maximum number optional
 */
export const handleInvalidNumberLength = (event, max = 999999999999) => {
  handleInvalidCharsInNumberInput(event);
  const { value } = event.target;
  if (event.code !== "Backspace" && parseInt(value, 10) > max) {
    event.preventDefault();
  }
};
