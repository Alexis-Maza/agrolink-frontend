export const initialBuyerProfile = {
    nombre: 'Carlos',
    apellidoPaterno: 'Ramírez',
    apellidoMaterno: 'González',
    email: 'carlos.ramirez@agroindustria.com',
    fechaNacimiento: '1988-07-22',
    documentoIdentidad: '20123456789',
    tipoComprador: 'Empresa Exportadora',
    ubicacion: 'Lima, Perú',
    telefono: '+51 999 888 777',
    direccionEntrega: 'Almacén Av. Industrial 1250, Callao'
};

export const initialCatalog = [
    { id: 'CULT-001', nombre: 'Palta Hass', variedad: 'Fuerte', lote: 'L-001', hectareas: 10, cantidadTotal: '5 Toneladas', cantidadDisponible: '3.5 Toneladas', precio: 8.50, minimoVenta: '100 Kg', imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', agricultor: 'Juan Pérez', telefonoFarmer: '51999999999', etapas: { germinacion: 10, crecimiento: 40, floracion: 20, maduracion: 30 }, fechaSiembra: '2023-08-15', incidencia: null },
    { id: 'CULT-002', nombre: 'Mandarina', variedad: 'W. Murcott', lote: 'L-002', hectareas: 8, cantidadTotal: '8 Toneladas', cantidadDisponible: '8 Toneladas', precio: 3.20, minimoVenta: '500 Kg', imagen: 'https://images.unsplash.com/photo-1582281298055-e25b84a1e0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', agricultor: 'María Gómez', telefonoFarmer: '51988888888', etapas: { germinacion: 15, crecimiento: 35, floracion: 25, maduracion: 25 }, fechaSiembra: '2023-06-01', incidencia: 'Clima Adverso' },
    { id: 'CULT-003', nombre: 'Arándanos', variedad: 'Biloxi', lote: 'L-003', hectareas: 5, cantidadTotal: '2 Toneladas', cantidadDisponible: '1.5 Toneladas', precio: 15.00, minimoVenta: '50 Kg', imagen: 'https://images.unsplash.com/photo-1498807852205-ffd2a4c40db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', agricultor: 'Pedro Rojas', telefonoFarmer: '51977777777', etapas: { germinacion: 10, crecimiento: 30, floracion: 15, maduracion: 20 }, fechaSiembra: '2023-09-10', incidencia: null }
];

export const initialOrders = [
    { id: 'V-001', fecha: '2023-11-15', estado: 'En Tránsito', productos: [{ cultivoId: 'CULT-001', nombre: 'Palta Hass', imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', cantidad: '500 Kg', loteParcial: 'LP-001A', adelanto: 30, montoAdelanto: 'S/ 1,275.00', montoPendiente: 'S/ 2,975.00' }], total: 'S/ 4,250.00' },
    { id: 'V-002', fecha: '2023-12-02', estado: 'Entregado', productos: [{ cultivoId: 'CULT-003', nombre: 'Arándanos', imagen: 'https://images.unsplash.com/photo-1498807852205-ffd2a4c40db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', cantidad: '100 Kg', loteParcial: 'LP-003A', adelanto: 0, montoAdelanto: 'S/ 0.00', montoPendiente: 'S/ 1,500.00' }], total: 'S/ 1,500.00' },
    { id: 'V-003', fecha: '2024-01-10', estado: 'Pendiente', productos: [{ cultivoId: 'CULT-002', nombre: 'Mandarina', imagen: 'https://images.unsplash.com/photo-1582281298055-e25b84a1e0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', cantidad: '1000 Kg', loteParcial: 'LP-002A', adelanto: 50, montoAdelanto: 'S/ 1,600.00', montoPendiente: 'S/ 1,600.00' }], total: 'S/ 3,200.00' }
];

export const initialNotifications = [
    { id: 1, fecha: '2024-01-15', tipo: 'Incidencia', mensaje: 'El agricultor María Gómez ha reportado "Clima Adverso" en el producto Mandarina (Lote L-002). Tu pedido V-003 podría verse afectado.', leida: false },
    { id: 2, fecha: '2024-01-12', tipo: 'Envío', mensaje: 'Tu pedido V-001 de Palta Hass ha sido marcado como "En Tránsito" por el agricultor.', leida: false },
    { id: 3, fecha: '2023-12-05', tipo: 'Entrega', mensaje: 'Tu pedido V-002 de Arándanos ha sido marcado como "Entregado".', leida: true }
];