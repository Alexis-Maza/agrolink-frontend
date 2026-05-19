import React, { useState } from 'react';

function BuyerCart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, cultivoId: 'CULT-001', nombre: 'Palta Hass', lote: 'L-001', cantidad: '500', precio: 8.50, loteParcial: 'LP-001A', adelanto: 30, montoTotal: 4250.00, seleccionado: true, imagen: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
        { id: 2, cultivoId: 'CULT-002', nombre: 'Mandarina', lote: 'L-002', cantidad: '1000', precio: 3.20, loteParcial: 'LP-002A', adelanto: 50, montoTotal: 3200.00, seleccionado: false, imagen: 'https://images.unsplash.com/photo-1582281298055-e25b84a1e0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }
    ]);

    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentSummary, setPaymentSummary] = useState(null);

    const toggleSelection = (id) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, seleccionado: !item.seleccionado } : item));
    };

    const itemsSeleccionados = cartItems.filter(i => i.seleccionado);
    const totalPagar = itemsSeleccionados.reduce((acc, curr) => acc + curr.montoTotal, 0);
    const totalAdelanto = itemsSeleccionados.reduce((acc, curr) => acc + (curr.montoTotal * (curr.adelanto / 100)), 0);

    const handleGenerateOrder = () => {
        if(itemsSeleccionados.length === 0) { alert("Selecciona al menos un producto"); return; }
        
        const newOrderId = `PED-${Date.now().toString().slice(-4)}`;
        const summary = {
            id: newOrderId,
            items: itemsSeleccionados,
            total: totalPagar,
            adelanto: totalAdelanto,
            contraEntrega: totalPagar - totalAdelanto
        };

        setPaymentSummary(summary);
        setPaymentModal(true);
        setCartItems(cartItems.filter(item => !item.seleccionado));
    };

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Mi Carrito</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Selecciona los productos para generar tu pedido y proceder al pago.</p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🛒</span>
                        <p style={{ color: '#888', fontSize: '1.1rem' }}>Tu carrito está vacío. Ve al catálogo y añade productos.</p>
                    </div>
                ) : (
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee', backgroundColor: item.seleccionado ? '#F4F7F5' : 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input type="checkbox" checked={item.seleccionado} onChange={() => toggleSelection(item.id)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    {/* IMAGEN AÑADIDA AQUÍ */}
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)' }}>{item.nombre}</h4>
                                        <span style={{ fontSize: '0.9rem', color: '#777' }}>Lote Principal: {item.lote} | Mi Lote: {item.loteParcial}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.1rem' }}>S/ {item.montoTotal.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#555' }}>{item.cantidad} Kg @ S/ {item.precio} | Adelanto: {item.adelanto}%</div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '30px', backgroundColor: '#E8F5E9', padding: '25px', borderRadius: 'var(--radius-md)', border: '1px solid #c8e6c9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Productos Seleccionados:</strong>
                                <span>{itemsSeleccionados.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Total del Pedido:</strong>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-text)' }}>S/ {totalPagar.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2E7D32' }}>
                                <strong>Adelanto Requerido Ahora:</strong>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {totalAdelanto.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleGenerateOrder} disabled={itemsSeleccionados.length === 0} style={{ backgroundColor: itemsSeleccionados.length === 0 ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', padding: '14px 40px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: itemsSeleccionados.length === 0 ? 'not-allowed' : 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)' }}>
                                Proceder al Pago
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL DE PAGO EXITOSO */}
            {paymentModal && paymentSummary && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '500px', textAlign: 'center', position: 'relative' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: 'var(--color-primary)', margin: '0 0 10px 0' }}>¡Pago Procesado!</h2>
                        <p style={{ color: '#555', margin: '0 0 25px 0' }}>Tu orden ha sido registrada exitosamente.</p>
                        
                        <div style={{ backgroundColor: '#F8F9FA', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '20px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' }}>
                                <strong>N° de Orden:</strong>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{paymentSummary.id}</span>
                            </div>
                            
                            {paymentSummary.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#555', marginBottom: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
                                    {/* IMAGEN EN EL MODAL DE PAGO */}
                                    <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{item.nombre}</span> <br/>
                                        <span>{item.cantidad} Kg - S/ {item.montoTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#2E7D32' }}>
                                    <span>Adelanto Cobrado:</span>
                                    <strong>S/ {paymentSummary.adelanto.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d32f2f' }}>
                                    <span>Pago Contra Entrega:</span>
                                    <strong>S/ {paymentSummary.contraEntrega.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setPaymentModal(false)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', width: '100%' }}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerCart;