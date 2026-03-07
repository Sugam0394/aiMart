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

      try {
        // Token refresh call
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token received");

        // Sync State
        setAccessToken(newAccessToken);
        api.defaults.headers.common.Authorization = "Bearer " + newAccessToken;
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        
        // Final Cleanup
        clearAccessToken();
        localStorage.removeItem("user");

        // 2. ✅ FIX: Redux store ko directly update karo taaki UI turant update ho
        import('../App/store').then(({ default: store }) => {
          store.dispatch({ type: 'auth/logout' }); 
        });
        
        // Notify components/Redux to logout
        window.dispatchEvent(new CustomEvent('tokenExpired'));
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api