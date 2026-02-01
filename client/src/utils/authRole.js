import { getAccessToken } from "./token";

// Decode JWT safely
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.log("error" , error)
    return null;
  }
};

// Get user role from token
export const getUserRole = () => {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role || null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};