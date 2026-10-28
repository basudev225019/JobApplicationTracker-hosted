import axios from 'axios';

// relative url - works on vercel (same domain) and locally through the vite proxy
const api = axios.create({
  baseURL: '/api/applications',
});

export default api;
