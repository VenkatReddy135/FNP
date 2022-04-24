import axios from "axios";
import { checkTokenExpiry, getRefreshToken } from "./refreshTokenManager";

const unUnauthorizedCodes = [401, 403];
axios.defaults.withCredentials = true;
const authProvider = {
  login: async ({ userName, password }) => {
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("password", password);
    formData.append("grant_type", "password");
    try {
      const url = `${window.REACT_APP_API_HOST}/oauth/token`;
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.status >= 200 && response?.status < 300) {
        const { refreshToken, expires } = response.data;
        localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
        localStorage.setItem("expiry", JSON.stringify(expires));
      } else {
        return null;
      }
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.errors[0]?.message);
    }
  },
  checkError: (error) => {
    const { status } = error?.response || 401;
    if (unUnauthorizedCodes.includes(status)) {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiry");
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: async () => {
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
    const checkToken = checkTokenExpiry();
    if (refreshToken && checkToken) {
      const result = await getRefreshToken();
      if (result && result.status >= 200 && result.status < 300) {
        return Promise.resolve(result.data.token);
      }
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiry");
    localStorage.removeItem("partyId");
    try {
      const url = `${window.REACT_APP_API_HOST}/oauth/logout`;
      const response = axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });
      if (response) {
        return Promise.resolve();
      }
      return Promise.resolve();
    } catch (error) {
      throw new Error(error?.response?.data?.errors[0]?.message);
    }
  },
  forgotPassword: async ({ userName }) => {
    try {
      const response = await axios.post(`${window.REACT_APP_API_HOST}/iam/v1/forgot-password`, {
        loginName: userName,
      });
      if (response?.status >= 200 || response?.status < 300) {
        return response?.data;
      }
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.errors[0]?.message);
    }
  },
  resetPassword: async (requestObj) => {
    try {
      const url = `${window.REACT_APP_API_HOST}/iam/v1/reset-password`;
      const response = await axios.post(url, requestObj, {
        headers: { "X-site-type": "BB" },
      });
      if (response?.status >= 200 || response?.status < 300) {
        return response?.data;
      }
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.errors[0]?.message);
    }
  },
};

export default authProvider;
