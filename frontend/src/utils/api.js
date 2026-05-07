const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export const API_BASE = `${API_URL}/api`;

export const getAuthToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = getAuthToken();
  return token
    ? { Authorization: `Bearer ${token}`, ...extraHeaders }
    : extraHeaders;
};
