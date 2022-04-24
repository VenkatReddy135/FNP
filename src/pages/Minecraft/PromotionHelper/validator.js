import { get, toNumber } from "lodash";
import { useState } from "react";
/**
 * @function required checks whether field is required or not
 * @param {string} fieldName  field name of the form
 * @returns {boolean} returns field is valid or not
 */
const required = (fieldName) => (formValues) => !!get(formValues, fieldName);

/**
 * @function noEmptyArray checks whether array field has value or not
 * @param {string} fieldName field name of the form
 * @returns {number} returns 0 or some length
 */
const noEmptyArray = (fieldName) => (formValues) => !!get(formValues, fieldName).length;

/**
 * @function checkForAutoCodeValidity checks if auto code configuration is valid or not
 * @param {string} fieldName  field name of the form
 * @returns {boolean} returns field is valid or not
 */
const checkForAutoCodeValidity = (fieldName) => (formValues) => {
  const dependencies = ["noOfCodes", "fromDate", "thruDate", "lengthOfCode", "codeStartsWith"];

  if (dependencies.find((item) => !!formValues[fieldName][0][item])) {
    return !!formValues[fieldName].reduce((acc, curr) => acc && curr.isValid, true);
  }

  return true;
};

/**
 * @function checkForNoNullEntry checks if object entry in array has any null property.
 * @param {string} fieldName  field name of the form
 * @param {object} dependencies contains entries to check validaiton against.
 * @returns {boolean} returns field is valid or not
 */
const checkForNoNullEntry = (fieldName, dependencies) => (formValues) => {
  return formValues[fieldName].reduce((prev, curr) => {
    let flag = true;
    let arr;
    if (dependencies) {
      arr = dependencies.values.map((value) => curr[value]);
    } else {
      arr = Object.values(curr);
    }
    arr.forEach((currentValue) => {
      if (Array.isArray(currentValue)) {
        if (currentValue.length === 0) {
          flag = false;
        } else {
          currentValue.forEach((item) => {
            if (!item) {
              flag = false;
            }
          });
        }
      } else if (!currentValue) {
        flag = false;
      }
    });

    return prev && flag;
  }, true);
};

/**
 * @function checkForCouponRequired checks if object entry in array has any null property.
 * @param {string} fieldName  field name of the form
 * @returns {boolean} returns field is valid or not
 */
const checkForCouponRequired = (fieldName) => (formValues) => {
  const dependencies = ["noOfCodes", "fromDate", "thruDate", "lengthOfCode"];
  if (formValues[fieldName]) {
    return (
      checkForNoNullEntry("autoCodeConfigs", { values: dependencies })(formValues) ||
      noEmptyArray("manualCodes")(formValues) ||
      (formValues.autoCodes && noEmptyArray("autoCodes")(formValues))
    );
  }
  return true;
};

/**
 * @function numberInputValidation provide onKeyDown functionality for number input validation.
 * @param {object} e event.
 * @param {number} length max character length.
 * @param {object} conditions data for isDecimalAllowed and isZeroAllowed condition.
 *
 */
const numberInputValidation = (e, length, conditions) => {
  const keyInput = e.key.length === 1 ? e.key : "";
  const inputValue = e.target.value + keyInput;
  const regex = /^\d*\.?\d*$/;
  const allowKey = [8, 46, 37, 38, 39, 40];

  if (e.ctrlKey || allowKey.includes(e.keyCode)) return;

  if (
    (conditions.isDecimalAllowed && e.key === "." && e.target.value.length === length - 1) ||
    (!conditions.isDecimalAllowed && e.key === ".") ||
    (e.keyCode !== 8 && e.keyCode !== 46 && e.target.value.length >= length) ||
    (!conditions.isZeroAllowed && e.target.value === "" && e.key === "0") ||
    !regex.test(inputValue)
  ) {
    e.preventDefault();
  }
};

/**
 * @function useMaxNumberInputValidation custom hook to restrict value that is more than max number provided.
 * @param {number} maxNumber maximum allowed number.
 * @param {number} maxLength max number character before decimal.
 * @returns {Array} an array with single function to handle restriction.
 *
 */
const useMaxNumberInputValidation = (maxNumber, maxLength) => {
  const [validationCheck, setValidationCheck] = useState(true);

  /**
   * @function maxNumberInputValidator provide onKeyDown functionality for max number validation.
   * @param {object} e event.
   */
  const maxNumberInputValidator = (e) => {
    if (
      (e.target.value && validationCheck && e.target.value + e.key > maxNumber) ||
      (toNumber(e.target.value) === maxNumber && e.key === ".")
    ) {
      e.preventDefault();
    }
    if (
      (e.target.value.length === maxLength - 1 && e.key === ".") ||
      (e.target.value.length === maxLength + 1 && e.target.value[maxLength - 1] === "." && e.keyCode === 8)
    ) {
      setValidationCheck(false);
    } else setValidationCheck(true);
  };

  return [maxNumberInputValidator];
};

export default {
  required,
  noEmptyArray,
  checkForAutoCodeValidity,
  checkForCouponRequired,
  checkForNoNullEntry,
  numberInputValidation,
  useMaxNumberInputValidation,
};
