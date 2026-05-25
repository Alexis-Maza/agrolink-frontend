import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig'; //  Conexión centralizada con tu Backend

function BuyerCart() {
    //  Inicialización del carrito desde localStorage o datos de prueba nativos
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('agrolink_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error reading cart from localStorage", e);
            }
        }
        return [
            { id: 1, idCultivo: 1, cultivoId: 'CULT-001', nombre: 'Palta Hass', lote: 'L-001', cantidad: '500', precio: 8.50, loteParcial: 'LP-001A', metodoPago: 'Transferencia', porcentajeAdelanto: 30, montoTotal: 4250.00, seleccionado: true, imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', agricultor: 'Juan Pérez', direccionEntrega: 'Almacén Av. Industrial 1250, Callao' },
            { id: 2, idCultivo: 2, cultivoId: 'CULT-002', nombre: 'Mandarina', lote: 'L-002', cantidad: '1000', precio: 3.20, loteParcial: 'LP-002A', metodoPago: 'Crédito', porcentajeAdelanto: 50, montoTotal: 3200.00, seleccionado: false, imagen: 'https://images.unsplash.com/photo-1582281298055-e25b84a1e0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', agricultor: 'María Gómez', direccionEntrega: 'Almacén Av. Industrial 1250, Callao' }
        ];
    });

    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [loading, setLoading] = useState(false); //  Estado de carga transaccional

    // 🔄 Sincronizar cambios del carrito con el almacenamiento local
    useEffect(() => {
        localStorage.setItem('agrolink_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    //  Control de selección individual por fila
    const toggleSelection = (id) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, seleccionado: !item.seleccionado } : item));
    };

    //  Cálculos automáticos en tiempo real (Cumple RF-A2-04)
    const itemsSeleccionados = cartItems.filter(i => i.seleccionado);
    const totalPagar = itemsSeleccionados.reduce((acc, curr) => acc + curr.montoTotal, 0);
    const totalAdelanto = itemsSeleccionados.reduce((acc, curr) => acc + (curr.montoTotal * (curr.porcentajeAdelanto / 100)), 0);

    // PROCESAMIENTO TRANSACCIONAL ÚNICO (MAESTRO-DETALLE)
    const handleGenerateOrder = async () => {
        if (itemsSeleccionados.length === 0) { 
            alert("Selecciona al menos un producto"); 
            return; 
        }

        setLoading(true); // Congela el botón para evitar doble envío masivo

        //  Armamos el DTO estructurado para Hibernate
            const pedidoMasivoDTO = {
                idUnidadMedida: 1,
                items: itemsSeleccionados.map(item => ({ 
                cultivoId: item.idCultivo || item.id,
                cantidad: parseFloat(item.cantidad), 
                precioPactado: item.precio,
                porcentajeAdelanto: item.porcentajeAdelanto,
                metodoPago: item.metodoPago,
                direccionEntrega: item.direccionEntrega || 'Almacén Av. Industrial 1250, Callao',
                fechaEntregaEstimada: item.fechaEntregaEstimada || null
            }))
        };
        try {
            //  Petición HTTP única al controlador transaccional del Backend
            const response = await api.post('/public/pedidos/masivo', pedidoMasivoDTO);

            // Determinar datos unificados de cabecera para renderizar la boleta del modal
            const uniqueAddresses = [...new Set(itemsSeleccionados.map(i => i.direccionEntrega || 'Sin especificar'))];
            const headerAddress = uniqueAddresses.length === 1 ? uniqueAddresses[0] : 'Múltiples destinos';

            const defaultDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE');
            const getItemDate = (item) => {
                if (item.fechaEntregaEstimada) {
                    const d = new Date(item.fechaEntregaEstimada);
                    return isNaN(d) ? defaultDate : d.toLocaleDateString('es-PE');
                }
                return defaultDate;
            };

            const uniqueDates = [...new Set(itemsSeleccionados.map(i => getItemDate(i)))];
            const headerDate = uniqueDates.length === 1 ? uniqueDates[0] : 'Múltiples fechas de entrega';

            //  Construimos el resumen final usando el ID real devuelto por PostgreSQL
            const summary = { 
                id: response.data.id ? `PED-${response.data.id}` : `PED-${Date.now().toString().slice(-4)}`, 
                fecha: new Date().toLocaleDateString('es-PE'),
                items: itemsSeleccionados, 
                total: totalPagar, 
                adelanto: totalAdelanto, 
                contraEntrega: totalPagar - totalAdelanto,
                fechaEntregaEstimada: headerDate,
                direccionEntrega: headerAddress
            };

            setPaymentSummary(summary);
            setPaymentModal(true);
            
            //  Limpiamos del estado local únicamente los ítems que ya compramos
            const remainingItems = cartItems.filter(item => !item.seleccionado);
            setCartItems(remainingItems);

        } catch (error) {
            console.error("Error al procesar la preventa masiva:", error);
            alert("No se pudo procesar el pedido: " + (error.response?.data || "Servidor no disponible"));
        } finally {
            setLoading(false); // Libera el botón al terminar todo el circuito
        }
    };

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Mi Carrito</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Selecciona los productos para generar tu pedido y proceder al pago del adelanto.</p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🛒</span>
                        <p style={{ color: '#888', fontSize: '1.1rem' }}>Tu carrito está vacío. Ve al catálogo y añade productos.</p>
                    </div>
                ) : (
                    <div>
                        {/* ITERACIÓN DE CULTIVOS EN EL CARRITO */}
                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee', backgroundColor: item.seleccionado ? '#F4F7F5' : 'white', transition: '0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input type="checkbox" checked={item.seleccionado} onChange={() => toggleSelection(item.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)', fontSize: '1.2rem' }}>{item.nombre}</h4>
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px' }}>🌱 Agricultor: <strong>{item.agricultor}</strong></span>
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px' }}>📦 Lote Origen: {item.lote} | Mi Lote: {item.loteParcial}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'block', fontWeight: 'bold' }}>💳 Pago: {item.metodoPago} | Adelanto: {item.porcentajeAdelanto}%</span>
                                        <span style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginTop: '4px' }}>📍 Entrega: <strong>{item.direccionEntrega || 'Almacén Av. Industrial 1250, Callao'}</strong></span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '5px' }}>S/ {item.montoTotal.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px' }}>{item.cantidad} Kg @ S/ {item.precio.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '10px', display: 'inline-block' }}>
                                        Adelanto: S/ {(item.montoTotal * (item.porcentajeAdelanto / 100)).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* PANEL RESUMEN DE LOS ELEMENTOS SELECCIONADOS */}
                        <div style={{ marginTop: '30px', backgroundColor: '#E8F5E9', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid #c8e6c9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong>Ítems Seleccionados:</strong><span>{itemsSeleccionados.length}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong>Total del Pedido:</strong><span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {totalPagar.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}><strong>A pagar ahora (Adelantos):</strong><span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {totalAdelanto.toFixed(2)}</span></div>
                        </div>

                        {/* BOTÓN DE ACCIÓN CON CONTROL DE DOBLE CLIC */}
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={handleGenerateOrder} 
                                disabled={itemsSeleccionados.length === 0 || loading} 
                                style={{ 
                                    backgroundColor: itemsSeleccionados.length === 0 || loading ? '#ccc' : 'var(--color-primary)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '14px 40px', 
                                    borderRadius: 'var(--radius-md)', 
                                    fontWeight: 'bold', 
                                    cursor: itemsSeleccionados.length === 0 || loading ? 'not-allowed' : 'pointer', 
                                    fontSize: '1.1rem', 
                                    boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)' 
                                }}
                            >
                                {loading ? 'Procesando Transacción...' : 'Proceder al Pago'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 🧾 MODAL CON LA BOLETA DE PREVENTA PROCESADA REAL */}
            {paymentModal && paymentSummary && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '550px', position: 'relative' }}>
                        <div style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '10px' }}>✅</div>
                        <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', margin: '0 0 20px 0' }}>¡Adelanto Procesado!</h2>
                        
                        <div style={{ backgroundColor: '#F8F9FA', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #eee', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '10px', marginBottom: '15px' }}>
                                <div><strong>N° Orden Real:</strong><br/><span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{paymentSummary.id}</span></div>
                                <div style={{textAlign: 'right'}}><strong>Fecha de Compra:</strong><br/><span style={{ color: '#555' }}>{paymentSummary.fecha}</span></div>
                            </div>

                            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.95rem' }}>Productos Asegurados:</h4>
                            {paymentSummary.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#555', marginBottom: '10px', backgroundColor: 'white', padding: '8px', borderRadius: '5px', borderLeft: '3px solid var(--color-primary)' }}>
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '45px', height: '45px', borderRadius: '5px', objectFit: 'cover' }} />
                                    <div style={{flex: 1}}>
                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{item.nombre}</span> ({item.cantidad} Kg)<br/>
                                        <span style={{fontSize: '0.8rem', color: '#777'}}>Agricultor: {item.agricultor}</span>
                                    </div>
                                    <strong style={{color: 'var(--color-secondary)'}}>S/ {item.montoTotal.toFixed(2)}</strong>
                                </div>
                            ))}

                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>Total Pedido:</span><strong>S/ {paymentSummary.total.toFixed(2)}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', marginBottom: '5px' }}><span>Cobrado ahora (Adelantos):</span><strong>S/ {paymentSummary.adelanto.toFixed(2)}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d32f2f' }}><span>Saldo Contraentrega:</span><strong>S/ {paymentSummary.contraEntrega.toFixed(2)}</strong></div>
                            </div>
                        </div>

                        <button onClick={() => setPaymentModal(false)} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>Entendido</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerCart;