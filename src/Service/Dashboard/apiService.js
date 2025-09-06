// src/services/apiService.js
import axios from "axios";
const token = localStorage.getItem("token");
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; 

export const apiService = {
  get: async () => {
    const response = await axios.get(`${API_BASE_URL}${"/api/project/my-projects"}`, {
      headers: { "x-auth-token": `Bearer ${token}` },
    });
    return response.data;
  },

  post: async (url, data) => {
    const response = await axios.post(`${API_BASE_URL}${url}`, data, {
      headers: { "x-auth-token": `Bearer ${token}` },
    });
console.log()
    return response.data;
  },
};
