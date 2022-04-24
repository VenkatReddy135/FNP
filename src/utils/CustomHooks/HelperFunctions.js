import { startCase } from "lodash";

import { TIMEOUT } from "../../config/GlobalConfig";

/**
 * @function onSuccess This function will handle the success scenario
 * @param {object} paramsObj is passed to the function
 * @returns {Function} function
 */
export const onSuccess = (paramsObj) => {
  const { response, notify, translate, handleSuccess, handleBadRequest } = paramsObj;

  if (response.data && response.status === "success") {
    return handleSuccess(response);
  }
  if (response.data && response.data.errors && response.data.errors[0].errorCode && response.data.errors[0].message) {
    const errorMessage = response.data.errors[0].field
      ? `${startCase(response.data.errors[0].field)} : ${response.data.errors[0].message}`
      : `${response.data.errors[0].message}`;

    return typeof handleBadRequest === "function" ? handleBadRequest(response) : notify(errorMessage, "error", TIMEOUT);
  }
  return notify(translate("unknown_error"), "error", TIMEOUT);
};

/**
 * @function notifyError This function will notify the error
 * @param {object} error is passed to the function
 * @param {Function} notify is passed to the function
 * @param {Function} translate is passed to the function
 * @returns {Function} function
 */
const notifyError = (error, notify, translate) => {
  const errorDictionary = {
    403: "forbidden",
    404: "not_found",
    409: "conflict",
    500: "server_error",
    503: "service_unavailable",
  };

  const { status } = error.response;

  return status in errorDictionary
    ? notify(translate(errorDictionary[status]), "error", TIMEOUT)
    : notify(translate("somethingWrong"), "error", TIMEOUT);
};

/**
 * @function onFailure This function will handle the failure scenario
 * @param {object} paramsObj is passed to the function
 * @returns {Function} function
 */
export const onFailure = (paramsObj) => {
  const { error, notify, translate, handleFailure } = paramsObj;

  return typeof handleFailure === "function" ? handleFailure() : notifyError(error, notify, translate);
};
