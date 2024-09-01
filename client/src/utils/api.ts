import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export default api;


export const getToken = () => localStorage.getItem("jwtToken");

export const setToken = (token: string) => localStorage.setItem("jwtToken", token);

export const removeToken = () => localStorage.removeItem("jwtToken");

export const isAuthenticated = () => !!getToken();
