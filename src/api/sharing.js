import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const shareTask = async (taskId, data) => {
  return axiosInstance.post(`${API}/api/tasks/${taskId}/share`, data);
};

export const getSharedUsers = async (taskId) => {
  return axiosInstance.get(`${API}/api/tasks/${taskId}/shared`);
};
