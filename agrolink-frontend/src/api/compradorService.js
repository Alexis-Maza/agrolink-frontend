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

export const obtenerCatalogo = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.region) params.append('region', filtros.region);
    if (filtros.precioMax) params.append('precioMax', filtros.precioMax);
    if (filtros.productoId) params.append('productoId', filtros.productoId);
    const response = await api.get(`/public/catalogo?${params.toString()}`);
    return response.data;
};

export const crearPedido = async (pedidoData) => {
    const response = await api.post('/comprador/pedidos/masivo', pedidoData);
    return response.data;
};

export const obtenerMisCompras = async () => {
    const response = await api.get('/comprador/pedidos');
    return response.data;
};

export const exportarComprasExcel = async () => {
    const response = await api.get('/reportes/mis-compras/excel', {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mis_compras.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
