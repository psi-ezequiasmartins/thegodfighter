/**
 * src/services/api.js
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';
export const SERVER_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

// Resolve caminhos relativos (ex: /uploads/xxx.jpg) para a URL completa do backend
export function resolveImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SERVER_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

const api = axios.create({
  baseURL: API_BASE_URL
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