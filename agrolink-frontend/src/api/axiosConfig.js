import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor request: agrega el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor response: solo redirige al login si es 401 (token inválido/expirado)
// El 403 es "sin permiso" pero el token puede seguir siendo válido
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ Error interceptado:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;