import { useNotify, useQueryWithStore, useTranslate } from "react-admin";
import { onSuccess, onFailure } from "./HelperFunctions";

/**
 * @function useCustomQueryWithStore
 * @param {string} type is method to call on the Data Provider.
 * @param {string} resource request URL for the API call
 * @param {Function} handleSuccess is passed to the function
 * @param {object} object is passed to the function
 * @param {Function} object.handleBadRequest is passed to the function
 * @param {Function} object.handleFailure is passed to the function
 * @param {boolean} object.enabled is passed to the function
 * @param {object} object.payload is passed to the function
 * @returns {object} loading, data, error, loaded etc.
 */
const useCustomQueryWithStore = (
  type,
  resource,
  handleSuccess,
  { handleBadRequest, handleFailure, enabled = true, payload = {} } = {},
) => {
  const notify = useNotify();
  const translate = useTranslate();

  return useQueryWithStore(
    {
      type,
      resource,
      payload,
    },
    {
      enabled,
      onSuccess: (response) => {
        onSuccess({ response, notify, translate, handleSuccess, handleBadRequest });
      },
      onFailure: (error) => {
        onFailure({ error, notify, translate, handleFailure });
      },
    },
  );
};

export default useCustomQueryWithStore;
