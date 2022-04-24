import axios from "axios";
import authProvider from "../authServices/authProvider";
import dataProvider from "./dataProvider";

axios.defaults.withCredentials = true;
const baseUrl = `${window.REACT_APP_API_HOST}`;
/**
 * General method to call api with header and other params
 *
 * @param {string} url base url
 * @param {string} method request type
 * @param {object} parameters query params
 * @param {object} data query data
 * @param {object} headersParam request headers
 * @returns {Function} callback function to call api
 */
const httpClient = async (url, method, parameters, data, headersParam) => {
  let headers;
  let params;
  if (parameters) {
    params = { ...parameters };
  }
  let extraHeaders = {};
  if (params && params.extraHeaders) {
    extraHeaders = params.extraHeaders;
    delete params.extraHeaders;
  }
  await authProvider.checkAuth();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (headersParam) {
    headers = {
      ...headersParam,
      "X-timezone": timezone,
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      "X-timezone": timezone,
      ...extraHeaders,
    };
  }
  return axios({
    url,
    method,
    headers,
    params,
    data,
  });
};

const customDataProvider = dataProvider(baseUrl, httpClient);

export { httpClient, customDataProvider };
