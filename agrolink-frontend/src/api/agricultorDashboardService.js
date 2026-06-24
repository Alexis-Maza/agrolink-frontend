import api from './axiosConfig';
 
export const obtenerDashboard = async () => {
    const response = await api.get('/agricultor/dashboard');
    return response.data;
};
 
export const obtenerVentasAgricultor = async () => {
    const response = await api.get('/agricultor/ventas');
    return response.data;
};