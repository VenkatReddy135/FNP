/* eslint-disable no-use-before-define */
import { INITIAL_INTERVAL, INTERVAL_DELAY, SUCCESS, IN_PROGRESS, TIMEOUT } from "../config/GlobalConfig";
import { onSuccess, onFailure } from "./CustomHooks";

let intervalTimer = null;
let timeoutTimer = null;

/**
 * @function usePolling to handle polling
 * @param {object} config is passed to the function
 * @param {Function} config.notify for notify config
 * @param {Function} config.mutate for mutate config
 * @param {Function} config.translate for translate config
 * @param {string} config.url for url config
 * @param {Function} config.setLoader for setLoader config
 * @param {Function} config.pollingTimeout for pollingTimeout config
 * @param {Function} config.successMessage for successMessage config
 * @param {Function} config.onPollingSuccess for success callback
 * @param {Function} config.onPollingFailure for failure callback
 * @param {Function} config.onPollingTimeout for failure callback
 * @param {Function} config.intervalDelay for interval  Delay
 * @returns {object} object for config
 */
const pollingService = ({
  url,
  notify,
  mutate,
  translate,
  setLoader,
  successMessage,
  onPollingTimeout,
  pollingTimeout = 20000,
  onPollingSuccess = () => {},
  onPollingFailure = () => {},
  intervalDelay = INTERVAL_DELAY,
}) => {
  const initialURL = window.location.href;

  /**
   * @function stopPolling stop polling
   */
  const stopPolling = () => {
    setLoader(false);
    clearTimeout(intervalTimer);
    clearTimeout(timeoutTimer);
  };

  /**
   * @function handleBadRequest to handle errors from status APi
   * @param {object} res response from API
   */
  const handleBadRequest = (res) => {
    stopPolling();
    notify(res.data?.errors[0]?.message, "error", TIMEOUT);
    onPollingFailure();
  };

  /**
   * @function handleStatusSuccess This function will handle Success on Update
   * @param {object} res response from API
   */
  const handleStatusSuccess = (res) => {
    const { status, id, message } = res?.data || {};
    const resourceId = `${url}/${id}`;
    if (status === SUCCESS) {
      onPollingSuccess(res);
      notify(message || successMessage);
      setImmediate(() => {
        stopPolling();
      });
    } else if (status === IN_PROGRESS) {
      intervalTimer = setTimeout(() => {
        const currentURL = window.location.href;
        if (initialURL === currentURL) {
          getStatus(resourceId);
        } else {
          stopPolling();
        }
      }, intervalDelay);
    } else {
      stopPolling();
      let errorList = [];
      if (typeof res?.data?.errors === "string") {
        const parsedList = JSON.parse(res?.data?.errors);
        errorList = parsedList?.map((error) => error.message);
      } else {
        errorList = res?.data?.errors?.map((error) => error.message);
      }
      notify(errorList.join(","), "error", TIMEOUT);
      onPollingFailure();
    }
  };

  /**
   * function to fetch status
   *
   * @param {string} resource resource Url with id to fetch the status
   */
  const getStatus = (resource) => {
    mutate(
      {
        type: "getData",
        resource,
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleStatusSuccess, handleBadRequest });
        },
        onFailure: (error) => {
          stopPolling();
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @function handlePollingSuccess to handle success
   * @param {string} id from API
   */
  const handlePollingSuccess = (id) => {
    const getPartyIdResource = `${url}/${id}`;
    setLoader(true);
    setTimeout(() => {
      getStatus(getPartyIdResource);
    }, INITIAL_INTERVAL);

    // after some time polling will stop automatically irrespective to status
    timeoutTimer = setTimeout(() => {
      stopPolling();
      if (onPollingTimeout) {
        onPollingTimeout();
      }
      notify(translate("response_timeout"), "info", TIMEOUT);
    }, [pollingTimeout]);
  };

  return {
    handlePollingSuccess,
    stopPolling,
  };
};

export default pollingService;
