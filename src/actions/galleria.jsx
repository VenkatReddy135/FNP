export const SET_URL_VALUE = "SET_URL_VALUE";

/**
 * Action type for set value of the selected url in the state
 *
 * @name setUrlValue
 * @param {object} payload contains url name to save
 * @returns {object} to set url.
 */
export function setUrlValue(payload) {
  return { type: SET_URL_VALUE, payload };
}
