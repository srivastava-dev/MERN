// src/services/dataService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

export const fetchData = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addItem = async (item) => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const editItem = async (item) => {
  const response = await axios.put(`${API_URL}/${item.id}`, item);
  return response.data;
};

export const deleteItem = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
