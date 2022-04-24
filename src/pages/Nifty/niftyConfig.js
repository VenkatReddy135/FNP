import { get, isEmpty } from "lodash";

export const OPERATOR_LIST = [
  { id: "Equals", name: "Equals" },
  { id: "Not Equal", name: "Not Equals" },
  { id: "In", name: "In" },
  { id: "Not In", name: "Not In" },
  { id: "Like", name: "Like" },
  { id: "Not Like", name: "Not Like" },
  { id: "Contains", name: "Contains" },
];

export const PP_CALCULATION_METHODS = [
  { id: "MODE", name: "Mode" },
  { id: "MIN", name: "Min" },
  { id: "MAX", name: "Max" },
  { id: "AVERAGE", name: "Average" },
];

export const DEFAULT_CONTAINS_OPERATOR = "Contains";
export const DEFAULT_EQUALS_OPERATOR = "Equals";
export const DEFAULT_IN_OPERATOR = "In";

export const SINGLE_TIER_TYPE = "singleTier";

export const NIFTY_PAGE_TYPE = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
};

export const configCodeRegex = /^[a-z0-9_]*$/;
export const priceRuleNameRegex = /^[a-zA-Z0-9]*$/;
export const overrideTypeRegex = /^[-+]?\d+(\d+)?$/;

const decimalNumExp = /^\d+(\.\d+)(,\d+(\.\d+))*$/;
const validInputExp = /^\d+(.\d{0,2})?(,\d+(?:-\d+)?)?(,\d+(.\d{0,2})?)*$/;
const wholeNumExp = /^\d+(?:-\d+)?(,\d+(?:-\d+)?)*$/;

/**
 * @function dateRangeValidation function to validate whether 'To Date' is greater than selected 'From Date'
 * @param {string} min contains the minimum date that can be selected in 'Through Date' input
 * @param {string} message error message that gets displayed when selected 'To Date' is less than the 'From Date' value
 * @param {string} key key of field to get data from object
 * @returns {string} validation message
 */
export const dateRangeValidation = (min, message, key) => (value) => {
  const toValue = value;
  const fromValue = min.getState().values[key] || "";
  return fromValue > toValue ? message : undefined;
};

/**
 * @function filterReducer to reduce object keys
 * @param {object} userInputs user input data object
 * @param {Array} filterFields fields to filter our from object
 * @returns {object} returns error message
 */
export const filterReducer = (userInputs, filterFields) => {
  return Object.entries(userInputs).reduce((accumulator, field) => {
    if (filterFields.includes(field[0]) && !isEmpty(String(field[1]))) {
      const currentOperator = `${field[0]}Operator`;
      return { ...accumulator, [field[0]]: field[1], [currentOperator]: userInputs[currentOperator] };
    }
    return { ...accumulator };
  }, {});
};

/**
 * @function validateCeilingPrice to validate ceiling Amount
 * @param {string} message validation message
 * @returns {string} returns error message
 */
export const validateCeilingPrice = (message) => (value) => {
  let errorMessage = message;
  if (validInputExp.test(value)) {
    const array = value.split(",");
    if (array[0] % 1 === 0) {
      errorMessage = wholeNumExp.test(value) ? "" : message;
    } else {
      errorMessage = decimalNumExp.test(value) ? "" : message;
    }
  }
  return errorMessage;
};

/**
 * @function getUniqId function to get uniq id
 *
 * @returns {number} returns uniq id
 */
export const getUniqId = () => parseFloat(`${Date.now()}${Math.floor(Math.random() * 100 + 1)}`);

/**
 * @function rangeValidate function to validate whether 'To Range' is greater than selected 'From Range'
 * @param {string} min contains the minimum value that can be selected in 'Through' input
 * @param {string} message error message that gets displayed when selected 'To' is less than the 'From' value
 * @param {string} key key of field to get value from object
 * @returns {string} validation message
 */
export const rangeValidate = (min, message, key) => (value) => {
  let errorMessage;
  if (value) {
    const toValue = value;
    const fromValue = get(min.getState().values, key);
    errorMessage = fromValue > toValue ? message : undefined;
  }
  return errorMessage;
};

/**
 * @function positiveValidate function to validate value if positive
 * @param {string} message error message that gets displayed
 * @returns {string} validation message
 */
export const positiveValidate = (message) => (value) => {
  return value < 0 ? message : undefined;
};

export const INITIAL_SHIPPING_CONFIG = {
  configId: getUniqId(),
  fromOperator: DEFAULT_CONTAINS_OPERATOR,
  toOperator: DEFAULT_CONTAINS_OPERATOR,
  fromRange: "",
  toRange: "",
  rate: "",
  status: true,
};

export const SEARCH_STATE_MUTATORS = {
  setFieldValue: (args, state, utils) => {
    utils.changeValue(state, args[0], () => args[1]);
  },
};

/**
 * Function to reset field value from form
 *
 * @function resetFieldBySource function to reset field value based on source
 * @param {string} source source of field to reset
 * @param {string} operatorSource source of operator
 * @param {string} operator operator to compare
 * @param {object} form form object
 * @param {formData} formData formData with updated values
 */
export const resetFieldBySource = (source, operatorSource, form, formData, operator = DEFAULT_IN_OPERATOR) => {
  form?.mutators?.setFieldValue(source, formData[operatorSource] === operator ? [] : "");
};

/**
 * Function to check component whether multi select or single select
 *
 * @function isMultiSelection function to reset field value based on source
 * @param {string} sourceValue source of field to reset
 * @param {string} operator operator to compare
 * @returns {boolean} returns if multi select or not
 */
export const isMultiSelection = (sourceValue, operator = DEFAULT_IN_OPERATOR) => {
  return sourceValue === operator;
};
