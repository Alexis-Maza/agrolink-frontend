import api from './axiosConfig';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const register = async (datos) => {
    const response = await api.post('/auth/register', datos);
    return response.data;
};

export const verifyEmail = async (email, codigo) => {
    const response = await api.post('/auth/verify-email', { email, codigo });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loggedSubadmin');
    window.location.href = '/login';
};