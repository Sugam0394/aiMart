const ACCESS_TOKEN_KEY = "accessToken";

// Set accessToken
export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// Get accessToken
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Clear accessToken
export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
