import api from './axiosConfig';

// ─── PRODUCTOS ────────────────────────────────────────────────

export const listarProductosAdmin = async () => {
    const response = await api.get('/api/admin/productos');
    return response.data;
};

export const crearProducto = async (datos) => {
    const response = await api.post('/api/admin/productos', {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    });
    return response.data;
};

export const actualizarProducto = async (id, datos) => {
    const response = await api.put(`/api/admin/productos/${id}`, {
        nombre: datos.nombre,
        descripcion: datos.descripcion
    });
    return response.data;
};

export const eliminarProducto = async (id) => {
    await api.delete(`/api/admin/productos/${id}`);
};

// ─── VARIANTES ────────────────────────────────────────────────

export const crearVariedad = async (productoId, datos) => {
    const response = await api.post('/api/admin/productos/variantes', {
        idProducto: productoId,
        nombreProductosVariedad: datos.nombre
    });
    return response.data;
};

export const actualizarVariedad = async (productoId, variedadId, nuevoNombre) => {
    const response = await api.put(`/api/admin/productos/variantes/${variedadId}`, {
        idProducto: productoId,
        nombreProductosVariedad: nuevoNombre
    });
    return response.data;
};

export const eliminarVariedad = async (variedadId) => {
    await api.delete(`/api/admin/productos/variantes/${variedadId}`);
};

export const toggleEstadoVariedad = async (variedadId) => {
    const response = await api.patch(`/api/admin/productos/variantes/${variedadId}/toggle-estado`);
    return response.data;
};