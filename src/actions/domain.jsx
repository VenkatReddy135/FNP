export const SET_TAG_VALUE = "SET_TAG_VALUE";
export const GET_TAG_LIST_SUCCESS = "GET_TAG_LIST_SUCCESS";

/**
 * Action type for set value of the selected tag in the state
 *
 * @name setTagValue
 * @param {object} payload contains tag name to save
 * @returns {object} to set tag.
 */
export function setTagValue(payload) {
  return { type: SET_TAG_VALUE, payload };
}

/**
 * Action type for get list of tags success after API response
 *
 * @name getTagListSuccess
 * @param {object} payload contains list data
 * @returns {object} to set list data.
 */
export function getTagListSuccess(payload) {
  return { type: GET_TAG_LIST_SUCCESS, payload };
}
