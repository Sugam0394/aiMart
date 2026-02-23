 import api from "../axios";

export const googleLoginApi = async (idToken) => {
  // Try/catch hata diya, ye seedhe error throw karega agar fail hua
  const response = await api.post("/google-login", { idToken });
  return response; 
}; 