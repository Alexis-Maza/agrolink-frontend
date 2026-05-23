import api from './axiosConfig';

export const actualizarDatosPersonales = async (datos) => {
    const response = await api.put('/agricultor/datos-personales', datos);
    return response.data;
};

export const cambiarPassword = async (datos) => {
    const response = await api.put('/agricultor/cambiar-password', datos);
    return response.data;
};

export const actualizarPerfilAgricola = async (datos) => {
    const response = await api.put('/agricultor/perfil-agricola', datos);
    return response.data;
};

export const obtenerPerfil = async () => {
    const response = await api.get('/agricultor/perfil');
    return response.data;
};