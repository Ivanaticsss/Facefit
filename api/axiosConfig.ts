import axios from 'axios';
import { Alert } from 'react-native';

const port = '3000';

// Replace with YOUR computer's local network IP (not "localhost").
// Windows: `ipconfig` -> IPv4 Address
// Mac/Linux: `ifconfig` -> inet under en0/wlan0
// Your phone and computer must be on the same Wi-Fi network.
const myIP = '192.168.96.142';

const baseURL = `http://${myIP}:${port}/api`;

const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (!error.response) {
      Alert.alert(
        'Network Error',
        "Can't connect to the server. Please check your network connection or ensure the server is running."
      );
    }
    return Promise.reject(error);
  }
);

export default api;
