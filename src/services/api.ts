import axios from 'axios';
const token = localStorage.getItem("token")
const instance = axios.create({
  baseURL: "http://10.10.10.12:8000/",
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `token ${token}`
  },
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.data.error.statusCode === 401) {
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
