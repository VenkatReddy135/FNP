import get from "lodash/get";
import { STORAGE_KEY } from "../config/GlobalConfig";
// Very basic storage helper
// values are stored in browser localStorage

/**
 * Funciton to return local storage key value
 *
 * @returns {object} returns a object
 */
const getRootValue = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    return undefined;
  }
};

/**
 * Set a value in local storage
 *
 * @param {number} value - The value to store
 * @returns {undefined} - Not returning a value
 */
const setRootValue = (value) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const LocalStorage = {
  /**
   * Set a value in local storage
   *
   * @param {string} key - The value to store
   * @returns {object} - returning an object
   */
  get(key) {
    return get(getRootValue(), key);
  },
  /**
   * Set a value in local storage
   *
   * @param {string} key - The string to store
   * @param {string} value - The string to store
   */
  set(key, value) {
    const oldValue = getRootValue();
    setRootValue({
      ...oldValue,
      [key]: value,
    });
  },
};

export default LocalStorage;
