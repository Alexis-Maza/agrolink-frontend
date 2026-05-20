import React, { useState } from 'react';
import { initialOrders } from '../../data/mockBuyerData';

function BuyerPurchases() {
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('agrolink_orders');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error reading orders from localStorage", e);
            }
        }
        localStorage.setItem('agrolink_orders', JSON.stringify(initialOrders));
        return initialOrders;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [exportStatus, setExportStatus] = useState('idle');

    const filteredOrders = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || (o.productos && o.productos.length > 0 && o.productos[0].nombre.toLowerCase().includes(searchTerm.toLowerCase())));

    const handleExport = () => {
        if (exportStatus !== 'idle') return;
        setExportStatus('exporting');
        setTimeout(() => { setExportStatus('success'); setTimeout(() => setExportStatus('idle'), 3000); }, 1500);
    };

    const handleCancelProduct = (orderId, productId) => {
        if(window.confirm("¿Cancelar este producto y solicitar reembolso del adelanto?")) {
            const updated = orders.map(o => {
                if(o.id === orderId) {
                    const updatedProducts = o.productos.filter(p => p.cultivoId !== productId);
                    if(updatedProducts.length === 0) return { ...o, estado: 'Cancelado', productos: [] };
                    return { ...o, productos: updatedProducts };
                }
                return o;
            });
            setOrders(updated);
            localStorage.setItem('agrolink_orders', JSON.stringify(updated));
            if(selectedOrder && selectedOrder.id === orderId) {
                const updOrder = updated.find(o => o.id === orderId);
                setSelectedOrder(updOrder);
            }
        }
    };

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Mis Compras</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Historial de pedidos, pagos y cancelaciones.</p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                    <input type="text" placeholder="Buscar por N° de pedido o producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', maxWidth: '400px', padding: '12px 15px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                    <button onClick={handleExport} disabled={exportStatus !== 'idle'} style={{ backgroundColor: exportStatus === 'success' ? '#D4EDDA' : '#E8F5E9', color: exportStatus === 'success' ? '#155724' : 'var(--color-primary)', border: `1px solid ${exportStatus === 'success' ? '#c3e6cb' : 'var(--color-primary)'}`, padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: exportStatus !== 'idle' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {exportStatus === 'idle' && '📊 Exportar registro'}{exportStatus === 'exporting' && '⏳ Generando Excel...'}{exportStatus === 'success' && '✅ Excel Descargado'}
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead><tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}><th style={{ padding: '15px', color: '#555' }}>N° Pedido</th><th style={{ padding: '15px', color: '#555' }}>Fecha</th><th style={{ padding: '15px', color: '#555' }}>Estado</th><th style={{ padding: '15px', color: '#555' }}>Total</th><th style={{ padding: '15px', color: '#555', textAlign: 'center' }}>Acciones</th></tr></thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{order.id}</td>
                                <td style={{ padding: '15px', color: '#555' }}>{order.fecha}</td>
                                <td style={{ padding: '15px' }}><span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: order.estado === 'Entregado' ? '#D4EDDA' : order.estado === 'Cancelado' ? '#FFEBEE' : '#FFF3E0', color: order.estado === 'Entregado' ? '#155724' : order.estado === 'Cancelado' ? '#d32f2f' : '#E65100' }}>{order.estado}</span></td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{order.total}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}><button onClick={() => setSelectedOrder(order)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>Ver Detalle</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>&times;</button>
                        
                        <h3 style={{ color: 'var(--color-primary)', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Detalle Pedido: {selectedOrder.id}</h3>
                        
                        {/* SECCIÓN NUEVA: INFORMACIÓN DE LA ORDEN */}
                        <div style={{ backgroundColor: '#F4F7F5', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', marginBottom: '25px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-text)', fontSize: '1.1rem', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>📋 Información de la Orden</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555' }}>📅 Fecha de Compra: <br/><strong style={{color: '#333', fontSize: '1rem'}}>{selectedOrder.fecha}</strong></p>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555' }}>🚚 Entrega Estimada: <br/><strong style={{color: 'var(--color-secondary)', fontSize: '1rem'}}>{selectedOrder.fechaEntregaEstimada}</strong></p>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#555' }}>💳 Método de Pago: <br/><strong style={{color: '#333', fontSize: '1rem'}}>{selectedOrder.metodoPago}</strong></p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>📍 Dirección Entrega: <br/><strong style={{color: '#333', fontSize: '1rem'}}>{selectedOrder.direccionEntrega}</strong></p>
                                </div>
                            </div>
                        </div>

                        {selectedOrder.productos.length === 0 ? <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>Todos los productos de esta orden han sido cancelados.</p> : null}

                        <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>📦 Productos en la Orden</h4>

                        {selectedOrder.productos.map((prod, idx) => (
                            <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #eee', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <img src={prod.imagen} alt={prod.nombre} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>{prod.nombre}</h4>
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>🌱 Agricultor: <strong>{prod.agricultor}</strong></span><br/>
                                            <span style={{ fontSize: '0.85rem', color: '#888' }}>Código Lote: {prod.loteParcial}</span>
                                        </div>
                                    </div>
                                    {prod.adelanto > 0 && selectedOrder.estado !== 'Cancelado' && (
                                        <button onClick={() => handleCancelProduct(selectedOrder.id, prod.cultivoId)} style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', border: '1px solid #ffcdd2', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>❌ Cancelar y Reembolsar</button>
                                    )}
                                </div>
                                
                                <div style={{ backgroundColor: '#F8F9FA', padding: '15px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#555', display: 'block' }}>Cantidad</span>
                                        <strong style={{ color: '#333' }}>{prod.cantidad}</strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#2E7D32', display: 'block' }}>Adelanto Pagado ({prod.adelanto}%)</span>
                                        <strong style={{ color: '#2E7D32' }}>{prod.montoAdelanto}</strong>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: '#d32f2f', display: 'block' }}>Pendiente de Pago</span>
                                        <strong style={{ color: '#d32f2f' }}>{prod.montoPendiente}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setSelectedOrder(null)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(46,125,50,0.2)' }}>Cerrar Detalle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerPurchases;