import React, { useState } from 'react';
import { crearPedido } from '../../api/compradorService';

function BuyerCart() {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('agrolink_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error reading cart from localStorage", e);
            }
        }
        return [];
    });

    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        localStorage.setItem('agrolink_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const toggleSelection = (id) =>
        setCartItems(cartItems.map(item => item.id === id ? { ...item, seleccionado: !item.seleccionado } : item));

    const handleEliminar = (id) =>
        setCartItems(cartItems.filter(item => item.id !== id));

    const itemsSeleccionados = cartItems.filter(i => i.seleccionado);
    const totalPagar = itemsSeleccionados.reduce((acc, curr) => acc + curr.montoTotal, 0);
    const totalAdelanto = itemsSeleccionados.reduce((acc, curr) => acc + (curr.montoTotal * (curr.porcentajeAdelanto / 100)), 0);

    const handleGenerateOrder = async () => {
        if (itemsSeleccionados.length === 0) {
            alert("Selecciona al menos un producto.");
            return;
        }

        setLoading(true);
        setError(null);

        // Armar el DTO que espera el backend
        const pedidoPayload = {
            items: itemsSeleccionados.map(item => ({
                cultivoId: item.idCultivo || item.cultivoId,
                cantidad: parseFloat(item.cantidad),
                precioPactado: parseFloat(item.precio),
                direccionEntrega: item.direccionEntrega || 'Almacén Av. Industrial 1250, Callao'
            }))
        };

        try {
            const respuesta = await crearPedido(pedidoPayload);

            // Construir resumen para el modal de confirmación
            const defaultDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PE');
            const getItemDate = (item) => {
                if (item.fechaEntregaEstimada) {
                    const d = new Date(item.fechaEntregaEstimada);
                    return isNaN(d) ? defaultDate : d.toLocaleDateString('es-PE');
                }
                return defaultDate;
            };

            const uniqueAddresses = [...new Set(itemsSeleccionados.map(i => i.direccionEntrega || 'Sin especificar'))];
            const headerAddress = uniqueAddresses.length === 1 ? uniqueAddresses[0] : 'Múltiples destinos (ver en lista de productos)';

            const uniqueDates = [...new Set(itemsSeleccionados.map(i => getItemDate(i)))];
            const headerDate = uniqueDates.length === 1 ? uniqueDates[0] : 'Múltiples fechas de entrega';

            const summary = {
                id: respuesta.id || respuesta.pedidoId || `PED-${Date.now().toString().slice(-4)}`,
                fecha: new Date().toLocaleDateString('es-PE'),
                fechaEntregaEstimada: headerDate,
                items: itemsSeleccionados,
                total: totalPagar,
                adelanto: totalAdelanto,
                contraEntrega: totalPagar - totalAdelanto
            };

            // Guardar en localStorage para BuyerPurchases
            const savedOrders = JSON.parse(localStorage.getItem('agrolink_orders') || '[]');
            const newOrder = {
                id: summary.id,
                fecha: summary.fecha,
                fechaEntregaEstimada: headerDate,
                estado: 'Pendiente',
                metodoPago: itemsSeleccionados[0].metodoPago,
                direccionEntrega: headerAddress,
                productos: itemsSeleccionados.map(item => ({
                    cultivoId: item.idCultivo || item.cultivoId,
                    nombre: item.nombre,
                    imagen: item.imagen,
                    cantidad: `${item.cantidad} Kg`,
                    loteParcial: item.loteParcial || `LP-${Math.floor(Math.random() * 1000)}`,
                    agricultor: item.agricultor,
                    adelanto: item.porcentajeAdelanto,
                    precio: item.precio,
                    montoTotal: item.montoTotal,
                    montoAdelanto: `S/ ${(item.montoTotal * (item.porcentajeAdelanto / 100)).toFixed(2)}`,
                    montoPendiente: `S/ ${(item.montoTotal * ((100 - item.porcentajeAdelanto) / 100)).toFixed(2)}`,
                    direccionEntrega: item.direccionEntrega || 'Almacén Av. Industrial 1250, Callao',
                    fechaEntregaEstimada: getItemDate(item),
                    metodoPago: item.metodoPago,
                    detallesProducto: item.detallesProducto || null
                })),
                total: `S/ ${totalPagar.toFixed(2)}`
            };
            localStorage.setItem('agrolink_orders', JSON.stringify([newOrder, ...savedOrders]));

            // Quitar del carrito los items procesados
            setCartItems(cartItems.filter(item => !item.seleccionado));
            setPaymentSummary(summary);
            setPaymentModal(true);

        } catch (err) {
            console.error('Error al crear pedido:', err);
            setError('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Mi Carrito</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Selecciona los productos para generar tu pedido y proceder al pago del adelanto.</p>

            {error && (
                <div style={{ backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', padding: '15px', marginBottom: '20px', color: '#d32f2f', fontWeight: 'bold' }}>
                    ⚠️ {error}
                </div>
            )}

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🛒</span>
                        <p style={{ color: '#888', fontSize: '1.1rem' }}>Tu carrito está vacío. Ve al catálogo y añade productos.</p>
                    </div>
                ) : (
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee', backgroundColor: item.seleccionado ? '#F4F7F5' : 'white', transition: '0.2s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input type="checkbox" checked={item.seleccionado} onChange={() => toggleSelection(item.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    <img
                                        src={item.imagen || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600'}
                                        alt={item.nombre}
                                        style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                                    />
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)', fontSize: '1.2rem' }}>{item.nombre}</h4>
                                        {item.agricultor && (
                                            <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px' }}>🌱 Agricultor: <strong>{item.agricultor}</strong></span>
                                        )}
                                        <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px' }}>📦 Lote: {item.lote}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'block', fontWeight: 'bold' }}>💳 Pago: {item.metodoPago} | Adelanto: {item.porcentajeAdelanto}%</span>
                                        <span style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginTop: '4px' }}>📍 Entrega: <strong>{item.direccionEntrega || 'Almacén Av. Industrial 1250, Callao'}</strong></span>
                                        <button
                                            onClick={() => handleEliminar(item.id)}
                                            style={{ marginTop: '8px', background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', padding: 0 }}
                                        >
                                            🗑 Eliminar
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '5px' }}>S/ {item.montoTotal.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px' }}>{item.cantidad} Kg @ S/ {item.precio}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '10px', display: 'inline-block' }}>
                                        Adelanto: S/ {(item.montoTotal * (item.porcentajeAdelanto / 100)).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '30px', backgroundColor: '#E8F5E9', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid #c8e6c9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong>Ítems Seleccionados:</strong><span>{itemsSeleccionados.length}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><strong>Total del Pedido:</strong><span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {totalPagar.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}><strong>A pagar ahora (Adelantos):</strong><span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {totalAdelanto.toFixed(2)}</span></div>
                        </div>

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
                                {loading ? '⏳ Procesando...' : 'Proceder al Pago'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL CONFIRMACIÓN */}
            {paymentModal && paymentSummary && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '550px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '10px' }}>✅</div>
                        <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', margin: '0 0 20px 0' }}>¡Pedido Generado!</h2>

                        <div style={{ backgroundColor: '#F8F9FA', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #eee', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '10px', marginBottom: '15px' }}>
                                <div><strong>N° Orden:</strong><br /><span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{paymentSummary.id}</span></div>
                                <div style={{ textAlign: 'right' }}><strong>Fecha de Compra:</strong><br /><span style={{ color: '#555' }}>{paymentSummary.fecha}</span></div>
                            </div>

                            <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '0.95rem' }}>Productos Asegurados:</h4>
                            {paymentSummary.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#555', marginBottom: '10px', backgroundColor: 'white', padding: '8px', borderRadius: '5px', borderLeft: '3px solid var(--color-primary)' }}>
                                    <img src={item.imagen || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600'} alt={item.nombre} style={{ width: '45px', height: '45px', borderRadius: '5px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{item.nombre}</span> ({item.cantidad} Kg)<br />
                                        {item.agricultor && <span style={{ fontSize: '0.8rem', color: '#777' }}>Agricultor: {item.agricultor}</span>}
                                    </div>
                                    <strong style={{ color: 'var(--color-secondary)' }}>S/ {item.montoTotal.toFixed(2)}</strong>
                                </div>
                            ))}

                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>Total Pedido:</span><strong>S/ {paymentSummary.total.toFixed(2)}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32', marginBottom: '5px' }}><span>Cobrado ahora (Adelantos):</span><strong>S/ {paymentSummary.adelanto.toFixed(2)}</strong></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d32f2f' }}><span>Saldo Contraentrega:</span><strong>S/ {paymentSummary.contraEntrega.toFixed(2)}</strong></div>
                            </div>
                        </div>

                        <button
                            onClick={() => setPaymentModal(false)}
                            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerCart;