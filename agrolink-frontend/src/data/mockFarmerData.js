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
    },
    {
        id: 'C-004',
        nombre: 'Mango Kent',
        variedad: 'Kent de Exportación',
        lote: 'L-004',
        hectareas: '8',
        fechaSiembra: '2025-06-15',
        etapas: { germinacion: 10, crecimiento: 50, floracion: 30, maduracion: 30 },
        cantidadTotal: '10 Toneladas',
        cantidadDisponible: '5 Toneladas',
        precio: '3.20',
        minimoVenta: '200 Kg',
        imagen: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-005',
        nombre: 'Quinua Blanca',
        variedad: 'Blanca de Junín',
        lote: 'L-005',
        hectareas: '3',
        fechaSiembra: '2025-08-10',
        etapas: { germinacion: 15, crecimiento: 45, floracion: 20, maduracion: 40 },
        cantidadTotal: '1.5 Toneladas',
        cantidadDisponible: '1 Tonelada',
        precio: '8.50',
        minimoVenta: '100 Kg',
        imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-006',
        nombre: 'Espárrago Verde',
        variedad: 'UC 157',
        lote: 'L-006',
        hectareas: '6',
        fechaSiembra: '2025-07-20',
        etapas: { germinacion: 20, crecimiento: 60, floracion: 0, maduracion: 40 },
        cantidadTotal: '4 Toneladas',
        cantidadDisponible: '4 Toneladas',
        precio: '12.00',
        minimoVenta: '150 Kg',
        imagen: 'https://images.unsplash.com/photo-1515276427842-f85802d514a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-007',
        nombre: 'Palta Hass',
        variedad: 'Hass Export',
        lote: 'L-007',
        hectareas: '10',
        fechaSiembra: '2025-04-05',
        etapas: { germinacion: 0, crecimiento: 60, floracion: 40, maduracion: 80 },
        cantidadTotal: '12 Toneladas',
        cantidadDisponible: '8 Toneladas',
        precio: '7.50',
        minimoVenta: '500 Kg',
        imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-008',
        nombre: 'Cebolla Roja',
        variedad: 'Arequipeña',
        lote: 'L-008',
        hectareas: '4',
        fechaSiembra: '2025-09-20',
        etapas: { germinacion: 15, crecimiento: 45, floracion: 0, maduracion: 30 },
        cantidadTotal: '6 Toneladas',
        cantidadDisponible: '6 Toneladas',
        precio: '2.10',
        minimoVenta: '300 Kg',
        imagen: 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-009',
        nombre: 'Tomate',
        variedad: 'Río Grande',
        lote: 'L-009',
        hectareas: '2',
        fechaSiembra: '2025-05-10',
        etapas: { germinacion: 10, crecimiento: 50, floracion: 10, maduracion: 30 },
        cantidadTotal: '5 Toneladas',
        cantidadDisponible: '2 Toneladas',
        precio: '1.50',
        minimoVenta: '100 Kg',
        imagen: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-010',
        nombre: 'Limón Sutil',
        variedad: 'Sutil Extra',
        lote: 'L-010',
        hectareas: '6',
        fechaSiembra: '2025-08-01',
        etapas: { germinacion: 15, crecimiento: 35, floracion: 20, maduracion: 30 },
        cantidadTotal: '4 Toneladas',
        cantidadDisponible: '4 Toneladas',
        precio: '4.50',
        minimoVenta: '200 Kg',
        imagen: 'https://images.unsplash.com/photo-1590502593747-42a996133562?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-011',
        nombre: 'Jengibre (Kión)',
        variedad: 'Amarillo Mejorado',
        lote: 'L-011',
        hectareas: '4',
        fechaSiembra: '2025-04-12',
        etapas: { germinacion: 30, crecimiento: 90, floracion: 10, maduracion: 50 },
        cantidadTotal: '2.5 Toneladas',
        cantidadDisponible: '2.5 Toneladas',
        precio: '14.20',
        minimoVenta: '50 Kg',
        imagen: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-012',
        nombre: 'Uva Red Globe',
        variedad: 'Red Globe',
        lote: 'L-012',
        hectareas: '11',
        fechaSiembra: '2025-09-05',
        etapas: { germinacion: 10, crecimiento: 40, floracion: 30, maduracion: 20 },
        cantidadTotal: '9 Toneladas',
        cantidadDisponible: '9 Toneladas',
        precio: '7.80',
        minimoVenta: '500 Kg',
        imagen: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-013',
        nombre: 'Plátano Orgánico',
        variedad: 'Cavendish',
        lote: 'L-013',
        hectareas: '8',
        fechaSiembra: '2025-07-30',
        etapas: { germinacion: 15, crecimiento: 50, floracion: 20, maduracion: 15 },
        cantidadTotal: '7 Toneladas',
        cantidadDisponible: '6.2 Toneladas',
        precio: '3.50',
        minimoVenta: '150 Kg',
        imagen: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-014',
        nombre: 'Alcachofa',
        variedad: 'Imperial Star',
        lote: 'L-014',
        hectareas: '5',
        fechaSiembra: '2025-08-10',
        etapas: { germinacion: 12, crecimiento: 48, floracion: 15, maduracion: 25 },
        cantidadTotal: '3 Toneladas',
        cantidadDisponible: '3 Toneladas',
        precio: '6.90',
        minimoVenta: '100 Kg',
        imagen: 'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    },
    {
        id: 'C-015',
        nombre: 'Granada Wonder',
        variedad: 'Wonderful',
        lote: 'L-015',
        hectareas: '9',
        fechaSiembra: '2025-09-12',
        etapas: { germinacion: 15, crecimiento: 40, floracion: 25, maduracion: 20 },
        cantidadTotal: '6.5 Toneladas',
        cantidadDisponible: '5.8 Toneladas',
        precio: '8.20',
        minimoVenta: '300 Kg',
        imagen: 'https://images.unsplash.com/photo-1582284540020-8c444f4007ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        incidencia: false
    }
];

export const initialSales = [
    { 
        id: 'V-1001', producto: 'Café Arábica Caturra', comprador: 'Carlos Gómez', empresa: 'BioCafé SAC',
        cantidad: '500', unidad: 'Kg', costo: 'S/ 7,500.00', fechaCompra: '12/10/2025', fechaEntrega: '15/01/2026',
        lote: 'LOTE-CAF-2025', loteParcial: 'LOTE-CAF-2025-P1', estado: 'Pendiente de Cosecha', metodoPago: 'Transferencia (50% Adelanto)', direccionEntrega: 'Almacén Principal BioCafé, Lima'
    },
    { 
        id: 'V-1002', producto: 'Cacao Fino de Aroma', comprador: 'Laura Pérez', empresa: 'Chocolates Andinos',
        cantidad: '2', unidad: 'Toneladas', costo: 'S/ 37,000.00', fechaCompra: '05/11/2025', fechaEntrega: '20/02/2026',
        lote: 'LOTE-CAC-2025', loteParcial: 'LOTE-CAC-2025-P1', estado: 'En Tránsito', metodoPago: 'Carta de Crédito', direccionEntrega: 'Puerto del Callao, Zona 4'
    },
    { 
        id: 'V-1003', producto: 'Maíz Amarillo Duro', comprador: 'Jorge Ramírez', empresa: 'IncaFoods EIRL',
        cantidad: '800', unidad: 'Kg', costo: 'S/ 1,440.00', fechaCompra: '20/09/2025', fechaEntrega: '10/12/2025',
        lote: 'LOTE-MZD-2025', loteParcial: 'LOTE-MZD-2025-P1', estado: 'Entregado', metodoPago: 'Transferencia 100%', direccionEntrega: 'Planta Procesadora IncaFoods, Arequipa'
    },
    { 
        id: 'V-1004', producto: 'Café Arábica Caturra', comprador: 'Ana Torres', empresa: 'Cafetalera Sur',
        cantidad: '1.5', unidad: 'Toneladas', costo: 'S/ 22,500.00', fechaCompra: '02/10/2025', fechaEntrega: '05/03/2026',
        lote: 'LOTE-CAF-2025', loteParcial: 'LOTE-CAF-2025-P2', estado: 'Pendiente de Cosecha', metodoPago: 'Transferencia (30% Adelanto)', direccionEntrega: 'Almacén Cafetalera Sur, Cusco'
    },
    { 
        id: 'V-1005', producto: 'Maíz Amarillo Duro', comprador: 'Luis Silva', empresa: 'Frutas Globales',
        cantidad: '5', unidad: 'Toneladas', costo: 'S/ 9,000.00', fechaCompra: '15/08/2025', fechaEntrega: '30/11/2025',
        lote: 'LOTE-MZD-2025', loteParcial: 'LOTE-MZD-2025-P2', estado: 'Entregado', metodoPago: 'Pago a 30 días', direccionEntrega: 'Planta de Empaque Piura'
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
