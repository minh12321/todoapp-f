import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;


export const gettkpjid = (id) => {
  return axiosInstance.get(`${API}/api/projects/${id}/tasks`, { withCredentials: true });
};

export const createtk = (data) => {
  return axiosInstance.post(`${API}/api/tasks`, data, { withCredentials: true });
};

export const gettkid = (id) => {
  return axiosInstance.get(`${API}/api/tasks/${id}`, { withCredentials: true });
};

export const fixtk = (id, data) => {
  return axiosInstance.put(`${API}/api/tasks/${id}`, data, { withCredentials: true });
};


export const deletetk = (id) => {
  return axiosInstance.delete(`${API}/api/tasks/${id}`, { withCredentials: true });
};
