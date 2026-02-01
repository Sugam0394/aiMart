 import api from "../axios";

// GET Tool Owner Settings

// 🔹 Get logged-in user profile
export const getMyProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// 🔹 Update logged-in user profile
export const updateMyProfile = async (profileData) => {
  const response = await api.put("/profileUpdate", profileData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};