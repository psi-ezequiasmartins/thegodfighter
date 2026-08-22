/**
 * src/services/api.js
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

function getToken() {
  return localStorage.getItem('tgf_token');
}

api.interceptors.request.use(function(config) {
  const token = getToken();
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default api;