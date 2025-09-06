import axios from "axios";


export const customerService = {
    getAll: (page, limit) => axios.get(`/api/customers?page=${page}&limit=${limit}`),
    create: (data) => axios.post(`/api/customer`, data),
    update: (id, data) => axios.put(`/api/customer/${id}`, data),
    delete: (id) => axios.delete(`/api/customer/${id}`),
  };