// src/data/mockFarmerData.js

const today = new Date();
const dateGerminacion = new Date(today); dateGerminacion.setDate(today.getDate() - 10);
const dateCrecimiento = new Date(today); dateCrecimiento.setDate(today.getDate() - 40);
const dateCosechado = new Date(today); dateCosechado.setDate(today.getDate() - 150);

export const initialCrops = [
    {
        id: 'C-001',
        nombre: 'Maíz Amarillo Duro',
        variedad: 'INIA 619',
        lote: 'LOTE-MZD-2025',
        hectareas: '5',
        fechaSiembra: dateGerminacion.toISOString().split('T')[0],
        etapas: { germinacion: 15, crecimiento: 40, floracion: 20, maduracion: 25 },
        cantidadTotal: '15 Toneladas',
        cantidadDisponible: '15 Toneladas',
        precio: '1.80',
        minimoVenta: '1000 Kg',
        imagen: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        incidencia: false
    },
    {
        id: 'C-002',
        nombre: 'Café Arábica Caturra',
        variedad: 'Caturra',
        lote: 'LOTE-CAF-2025',
        hectareas: '2.5',
        fechaSiembra: dateCrecimiento.toISOString().split('T')[0],
        etapas: { germinacion: 20, crecimiento: 60, floracion: 30, maduracion: 30 },
        cantidadTotal: '800 Kg',
        cantidadDisponible: '800 Kg',
        precio: '15.00',
        minimoVenta: '50 Kg',
        imagen: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        incidencia: true // Modificamos uno a true para que haya una alerta
    },
    {
        id: 'C-003',
        nombre: 'Cacao Fino de Aroma',
        variedad: 'CCN-51',
        lote: 'LOTE-CAC-2025',
        hectareas: '4',
        fechaSiembra: dateCosechado.toISOString().split('T')[0],
        etapas: { germinacion: 10, crecimiento: 30, floracion: 20, maduracion: 20 },
        cantidadTotal: '3 Toneladas',
        cantidadDisponible: '1.5 Toneladas',
        precio: '18.50',
        minimoVenta: '500 Kg',
        imagen: 'https://images.unsplash.com/photo-1623517112001-f25ec1d318e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        incidencia: false
    }
];

export const initialSales = [
    { 
        id: 'V-1001', producto: 'Café Arábica - Grano Verde', comprador: 'Carlos Gómez', empresa: 'BioCafé SAC',
        cantidad: '500', unidad: 'Kg', costo: 'S/ 2,500.00', fechaCompra: '12/10/2025', fechaEntrega: '15/01/2026',
        lote: 'L-2025-A', loteParcial: 'LP-01', estado: 'Pendiente de Cosecha', metodoPago: 'Transferencia (50% Adelanto)', direccionEntrega: 'Almacén Principal BioCafé, Lima'
    },
    { 
        id: 'V-1002', producto: 'Cacao Fino de Aroma', comprador: 'Laura Pérez', empresa: 'Chocolates Andinos',
        cantidad: '2', unidad: 'Toneladas', costo: 'S/ 5,800.00', fechaCompra: '05/11/2025', fechaEntrega: '20/02/2026',
        lote: 'L-2025-C', loteParcial: 'LP-03', estado: 'En Tránsito', metodoPago: 'Carta de Crédito', direccionEntrega: 'Puerto del Callao, Zona 4'
    },
    { 
        id: 'V-1003', producto: 'Maíz Morado Orgánico', comprador: 'Jorge Ramírez', empresa: 'IncaFoods EIRL',
        cantidad: '800', unidad: 'Kg', costo: 'S/ 1,200.00', fechaCompra: '20/09/2025', fechaEntrega: '10/12/2025',
        lote: 'L-2025-M', loteParcial: 'LP-01', estado: 'Entregado', metodoPago: 'Transferencia 100%', direccionEntrega: 'Planta Procesadora IncaFoods, Arequipa'
    },
    { 
        id: 'V-1004', producto: 'Café Robusta', comprador: 'Ana Torres', empresa: 'Cafetalera Sur',
        cantidad: '1.5', unidad: 'Toneladas', costo: 'S/ 6,000.00', fechaCompra: '02/10/2025', fechaEntrega: '05/03/2026',
        lote: 'L-2025-R', loteParcial: 'LP-02', estado: 'Pendiente de Cosecha', metodoPago: 'Transferencia (30% Adelanto)', direccionEntrega: 'Almacén Cafetalera Sur, Cusco'
    },
    { 
        id: 'V-1005', producto: 'Mango Kent (Exportación)', comprador: 'Luis Silva', empresa: 'Frutas Globales',
        cantidad: '5', unidad: 'Toneladas', costo: 'S/ 15,000.00', fechaCompra: '15/08/2025', fechaEntrega: '30/11/2025',
        lote: 'L-2025-MK', loteParcial: 'LP-05', estado: 'Entregado', metodoPago: 'Pago a 30 días', direccionEntrega: 'Planta de Empaque Piura'
    }
];

export const initialProfile = {
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'Gómez',
    email: 'juan.perez@example.com',
    fechaNacimiento: '1985-05-15',
    descripcion: '',
    ubicacion: '',
    documentoIdentidad: '',
    hectareas: '',
    experiencia: '',
    certificaciones: [], // Array para guardar las certificaciones habilitadas
    certificacionesFotos: {} // Objeto para guardar fotos de certificados
};
