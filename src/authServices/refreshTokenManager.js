import axios from "axios";

axios.defaults.withCredentials = true;
/**
 * Function to check if the token is expired
 *
 * @returns {boolean} status wether the token is expired or not
 */
export const checkTokenExpiry = () => {
  const expires = localStorage.getItem("expiry");
  const date = new Date();
  if (expires > date.getTime()) {
    return false;
  }
  return true;
};

/**
 * Function to fetch refresh token
 *
 * @returns {Promise} call back which returns the refresh token response
 */
export const getRefreshToken = async () => {
  const formData = new FormData();
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  formData.append("grant_type", "refresh_token");
  formData.append("refresh_token", refreshToken);
  try {
    const url = `${window.REACT_APP_API_HOST}/oauth/token`;
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response?.status >= 200 && response?.status < 300) {
      const { expires } = response?.data;
      localStorage.setItem("expiry", JSON.stringify(expires));
      return response;
    }
    return null;
  } catch (error) {
    throw new Error(error?.response?.data?.errors[0]?.message);
  }
};
