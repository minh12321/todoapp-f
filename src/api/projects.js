import axios from "axios";
import axiosInstance from "./axiosInstance";

const API = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

export const pjlist = () => {
  return axiosInstance.get(`${API}/api/projects`, { withCredentials: true });
};

export const createpj = (data) => {
  return axiosInstance.post(`${API}/api/projects`, data, { withCredentials: true });
};

export const getpjid = (id) => {
  return axiosInstance.get(`${API}/api/projects/${id}`, { withCredentials: true });
};

export const getpjuserid = (userId) => {
  return axiosInstance.get(`${API}/api/user/${userId}`, { withCredentials: true });
};

export const fixpj = (id, data) => {
  return axiosInstance.put(`${API}/api/projects/${id}`, data, { withCredentials: true });
};

export const deletepj = (id) => {
  return axiosInstance.delete(`${API}/api/projects/${id}`, { withCredentials: true });
};
