import axios, { isCancel } from "axios";
import get from "lodash/get";

/**
 * Data provider
 *
 * @param {string} url base url
 * @param {*} httpClient callback to make http request with headers and other configuration
 * @returns {Promise} response
 */
const dataProvider = (url, httpClient) => ({
  getList: (resource, parameters) => {
    const params = { ...parameters };
    const baseUrl = `${url}/${resource}`;
    let columnId;
    if (params.filter && params.filter.columnId) {
      columnId = params.filter && params.filter.columnId;
      delete params.filter.columnId;
    }
    const filterParams = {
      page: params.pagination.page - 1,
      size: params.pagination.perPage,
      simpleSearchValue: params.filter.q,
      sortParam: `${params.sort.field}:${params.sort.order}`,
      ...params.filter,
    };
    return httpClient(baseUrl, "GET", filterParams)
      .then((response) => {
        const res = response.data?.data
          ? response.data.data.map((item, idx) => {
              if (columnId) {
                return { ...item, id: get(item, columnId) };
              }
              const { _key, _id, id, ID } = item;
              return { ...item, id: _key || _id || id || ID || idx + 1 };
            })
          : [];
        return {
          data: res,
          total: response.data?.data?.totalPages ? response.data.data.totalPages : response.data.total,
          status: "success",
        };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return { data: [], total: 0 };
        }
        throw error;
      });
  },
  getOne: (resource, data) => {
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "GET", data)
      .then((response) =>
        response.status >= 200 && response.status < 300
          ? { data: { ...response.data, id: response.data.id }, loading: false, status: "success" }
          : { loading: false, data: { id: response.data.id } },
      )
      .catch((error) => {
        if (error.response.status === 400) {
          return { message: error?.response.data?.errors[0].message, data: { id: data.id, ...error.response.data } };
        }
        throw error;
      });
  },
  put: (resource, { id, data }) => {
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "PUT", id, data)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const res = { id, params: response.data.params, ...response.data };
          return response.data
            ? { data: res, status: "success", loading: false }
            : {
                data: { id },
                message: response.data.message,
                loading: false,
              };
        }
        return { loading: false, data: { id: data.id } };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return {
            message: error?.response.data?.errors[0].message,
            data: { id: error.response.data.errorId, ...error.response.data },
          };
        }
        throw error;
      });
  },
  import: (resource, data) => {
    const { config, cancelFileUpload, fileObj } = data;

    const options = {
      ...config,
      cancelToken: cancelFileUpload
        ? new axios.CancelToken((cancel) => {
            cancelFileUpload.current = cancel;
          })
        : null,
    };
    return axios
      .put(resource, fileObj, options)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (isCancel(error)) {
          return error;
        }

        return error.response ? error.response.data : null;
      });
  },
  delete: (resource, params) => {
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "DELETE", params.id)
      .then((response) => {
        return response.status >= 200 && response.status < 300
          ? { data: { id: response.data.successCode, ...response.data }, status: "success", loading: false }
          : { loading: false, data: { id: response.data.successCode } };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return { data: { id: error.response.data.errorId, ...error.response.data } };
        }
        throw error;
      });
  },
  create: (resource, { data }) => {
    const { params, dataObj } = data;
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "POST", params, dataObj)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const res = { id: response.data.id, data: response.data };
          return response.data
            ? { data: res, status: "success", loading: false }
            : {
                data: { id: null },
                message: response.data.message,
                loading: false,
              };
        }
        return { loading: false, data: { id: response.data.id } };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return {
            message: error?.response?.data?.errors[0].message,
            data: { id: error?.response?.data?.errorId, ...error?.response?.data },
          };
        }
        throw error;
      });
  },
  getData: (resource, params) => {
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "GET", params)
      .then((response) =>
        response.status >= 200 && response.status < 300
          ? { ...response, status: "success", loading: false }
          : { loading: false, data: response },
      )
      .catch((error) => {
        if (error.response.status === 400) {
          return { data: { id: error.response.data.errorId, ...error.response.data } };
        }
        throw error;
      });
  },
  getDataWithoutAuth: (resource, params) => {
    const baseUrl = `${url}/${resource}`;
    return axios
      .get(baseUrl, params)
      .then((response) => {
        return response.status >= 200 && response.status < 300
          ? { ...response, status: "success", loading: false }
          : { loading: false, data: response };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return error.response ? error.response.data : null;
        }
        throw error;
      });
  },
  update: (resource, data) => {
    const editObj = data.data;
    const params = data.id;
    const baseUrl = `${url}/${resource}`;
    return httpClient(baseUrl, "PATCH", params, editObj)
      .then((response) => {
        return response.status >= 200 && response.status < 300
          ? { data: { id: response.data.successCode, ...response.data }, loading: false, status: "success" }
          : { loading: false, data: { id: response.data.successCode } };
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return { data: { id: error.response.data.errorId, ...error.response.data } };
        }
        throw error;
      });
  },
});
export default dataProvider;
