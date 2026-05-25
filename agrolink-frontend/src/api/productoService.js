import api from './axiosConfig';


export const getCatalogoFiltrado = async (filtros) => {
    // filtros puede ser un objeto como: { categoria: 'frutas', minPrecio: 10 }
    const response = await api.get('/public/catalogo', { params: filtros });
    return response.data;
};


export const crearPedido = async (datosPedido) => {
    // datosPedido lleva el ID del producto, cantidad, compradorId, etc.
    const response = await api.post('/pedidos/crear', datosPedido);
    return response.data;
};