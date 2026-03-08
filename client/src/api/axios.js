import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/token';



 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
 

 api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

 
    if (originalRequest.url?.includes('/refreshToken')) {
      return Promise.reject(error); 
    }

 
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

     // ✅ FIX: Added Retry Logic with exponential backoff (Audit Problem #3)
      const attemptRefresh = async (retries = 2) => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/refreshToken`, {}, { withCredentials: true });
          const newAccessToken = res.data?.data?.accessToken;
          
          if (!newAccessToken) throw new Error("No token");

          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } catch (err) {
          if (retries > 0) {
            const delay = (3 - retries) * 2000; // 2s, then 4s delay
            await new Promise(r => setTimeout(r, delay));
            return attemptRefresh(retries - 1);
          }
          
          // Final Failure
          processQueue(err, null);
          clearAccessToken();
          localStorage.removeItem("user");

          // ✅ FIX: Corrected Case-Sensitive Path
          import('../app/store').then(({ default: store }) => {
            store.dispatch({ type: 'auth/logout' });
          });
          
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      };

      return attemptRefresh();
    }
    return Promise.reject(error);
  }
);


export default api