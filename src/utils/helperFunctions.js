/**
 * Function modifyArray use to move array element form one index to other
 *
 * @param {Array}array array to modify
 * @param {string}element string which needs to move from one index to other
 * @param {number}toIndex number index at which element has to move
 * @returns {Array}array
 */
export default function modifyArray(array, element, toIndex) {
  for (let i = 0; i < array.length; i += 1) {
    const hasValue = Object.values(array[i]).includes(element);
    if (hasValue) {
      if (toIndex !== i) {
        const slicedElement = array.splice(i, 1);
        array.splice(toIndex, 0, slicedElement[0]);
      }
      break;
    }
  }
  return array;
}

/**
 * Function removeExtraSpaces used to remove extra spaces from string.
 *
 * @param {string} value string value as input
 * @returns {string} updated string with proper spaces.
 */
export function removeExtraSpaces(value) {
  return value.toString().replace(/\s+/g, " ").trim();
}

/**
 * Function processFieldValue to send value as array or string
 *
 * @description to be used for advance search
 * @param {string} operator field operator
 * @param {string} value field operator
 *
 * @returns {string} value
 */
export const processFieldValue = (operator, value) => {
  const operatorName = operator ? operator?.trim() : "";
  const fieldValue = value ? value?.trim() : "";
  if (operatorName !== "In" && operatorName !== "NotIn") {
    return fieldValue;
  }
  return fieldValue.split(",");
};

/**
 * Function generateUniqueId to send value as array or string
 *
 * @description to be used for unique key value
 * @param {string} salt field operator
 *
 * @returns {string} value
 */
export const generateUniqueId = (salt = "") => {
  return `id-${new Date().getTime()}-${salt}`;
};
