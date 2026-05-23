import api from './axiosConfig';

export const actualizarDatosPersonales = async (datos) => {
    const response = await api.put('/comprador/datos-personales', datos);
    return response.data;
};

export const cambiarPassword = async (datos) => {
    const response = await api.put('/comprador/cambiar-password', datos);
    return response.data;
};

export const actualizarPerfilComercial = async (datos) => {
    const response = await api.put('/comprador/perfil-comercial', datos);
    return response.data;
};

export const obtenerPerfil = async () => {
    const response = await api.get('/comprador/perfil');
    return response.data;
};