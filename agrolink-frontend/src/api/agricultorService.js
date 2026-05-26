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

export const listarCultivos = async () => {
    const response = await api.get('/cultivos');
    return response.data;
};

export const registrarCultivo = async (datos) => {
    const response = await api.post('/cultivos', datos);
    return response.data;
};

export const actualizarCultivo = async (id, datos) => {
    const response = await api.put(`/cultivos/${id}`, datos);
    return response.data;
};

export const eliminarCultivo = async (id) => {
    const response = await api.delete(`/cultivos/${id}`);
    return response.data;
};

export const actualizarEtapasCultivo = async (id, datos) => {
    const response = await api.post(`/cultivos/${id}/etapas`, datos);
    return response.data;
};

export const listarProductos = async () => {
    const response = await api.get('/productos');
    return response.data;
};

export const listarVariedadesPorProducto = async (idProducto) => {
    const response = await api.get(`/productos/${idProducto}/variedades`);
    return response.data;
};

export const registrarMerma = async (idCultivo, datos) => {
    const response = await api.post(`/cultivos/${idCultivo}/merma`, datos);
    return response.data;
};