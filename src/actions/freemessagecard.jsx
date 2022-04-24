export const SET_OCCASION_DATA = "SET_OCCASION_DATA";

/**
 * Action type for set data of the selected occasion in the state
 *
 * @name setOccasionData
 * @param {object} payload contains occasion object to save
 * @returns {object} to set occasion data.
 */
export function setOccasionData(payload) {
  return { type: SET_OCCASION_DATA, payload };
}
