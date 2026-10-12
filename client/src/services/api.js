import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const donationService = {
    getAll: (year) => api.get(`/donations?year=${year}`),
    create: (data) => api.post('/donations', data)
};

export const expenseService = {
    getAll: (year) => api.get(`/expenses?year=${year}`),
    create: (data) => api.post('/expenses', data)
};

export const sevaService = {
    getAll: (year) => api.get(`/seva?year=${year}`),
    create: (data) => api.post('/seva', data)
};

export const attendanceService = {
    getAll: (year) => api.get(`/attendance?year=${year}`),
    create: (data) => api.post('/attendance', data),
    update: (id, data) => api.patch(`/attendance/${id}`, data)
};

export const yearService = {
    getAll: () => api.get('/years'),
    create: (year) => api.post('/years', { year })
};

export default api;
