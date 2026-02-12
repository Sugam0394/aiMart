 import api from "../axios";

// GET Tool Owner Settings

// 🔹 Get logged-in user profile
 // 🔹 Get logged-in user profile
export const getMyProfile = async () => {
  try {
    const response = await api.get("/profile");
    // FIX: 'res' ko 'response' karo
    // alert("Mobile Data: " + JSON.stringify(response.data)); 
    return response.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    throw error;
  }
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