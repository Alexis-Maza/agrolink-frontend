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

    // Genera y descarga la boleta como archivo HTML
    const handleDownloadBoleta = (order) => {
        const buyerProfile = (() => {
            const saved = localStorage.getItem('agrolink_buyer_profile');
            if (saved) {
                try { return JSON.parse(saved); } catch(e) {}
            }
            return { nombre: 'Carlos', apellidoPaterno: 'Ramírez', apellidoMaterno: 'González', documentoIdentidad: '20123456789', tipoComprador: 'Empresa Exportadora' };
        })();

        const productosHTML = order.productos.map((prod, idx) => {
            const det = prod.detallesProducto;
            const etapasHTML = det && det.etapas ? Object.entries(det.etapas).map(([k, v]) => `<span style="margin-right:10px; background:#E8F5E9; color:#2E7D32; padding:3px 8px; border-radius:4px; font-size:0.8rem;"><b>${k}:</b> ${v}%</span>`).join('') : '—';
            const certsHTML = det && det.certificaciones && det.certificaciones.length > 0 ? det.certificaciones.map(c => `<span style="margin:2px; background:#f0f4ff; color:#3c6bc4; padding:3px 8px; border-radius:4px; font-size:0.78rem; display:inline-block;">🛡️ ${c}</span>`).join('') : '—';

            return `
            <div style="border:1px solid #ddd; border-radius:8px; margin-bottom:24px; overflow:hidden; page-break-inside:avoid;">
                <div style="background:#2E7D32; color:white; padding:12px 18px; display:flex; align-items:center; gap:14px;">
                    <img src="${prod.imagen}" alt="${prod.nombre}" style="width:52px;height:52px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,255,255,0.4)"/>
                    <div>
                        <div style="font-size:1.15rem;font-weight:bold;">${prod.nombre}</div>
                        <div style="font-size:0.85rem;opacity:0.9;">Agricultor: ${prod.agricultor}</div>
                    </div>
                </div>
                <div style="padding:16px 18px;">
                    <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
                        <tr style="background:#f5f5f5;">
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;width:180px;">Lote Principal</td>
                            <td style="padding:8px 10px;font-size:0.9rem;">${prod.lote || '—'}</td>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;width:180px;">Lote Parcial</td>
                            <td style="padding:8px 10px;font-size:0.9rem;color:#2E7D32;font-weight:bold;">${prod.loteParcial}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;">Cantidad Comprada</td>
                            <td style="padding:8px 10px;font-size:0.9rem;">${prod.cantidad}</td>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;">Precio Unitario</td>
                            <td style="padding:8px 10px;font-size:0.9rem;">S/ ${prod.precio ? parseFloat(prod.precio).toFixed(2) : '—'} / Kg</td>
                        </tr>
                        <tr style="background:#f5f5f5;">
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;">Monto Total</td>
                            <td style="padding:8px 10px;font-size:0.9rem;font-weight:bold;">S/ ${prod.montoTotal ? parseFloat(prod.montoTotal).toFixed(2) : '—'}</td>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;">Método de Pago</td>
                            <td style="padding:8px 10px;font-size:0.9rem;">${prod.metodoPago || order.metodoPago}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#2E7D32;">Adelanto Pagado (${prod.adelanto}%)</td>
                            <td style="padding:8px 10px;font-size:0.9rem;color:#2E7D32;font-weight:bold;">${prod.montoAdelanto}</td>
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#c0392b;">Saldo Contraentrega</td>
                            <td style="padding:8px 10px;font-size:0.9rem;color:#c0392b;font-weight:bold;">${prod.montoPendiente}</td>
                        </tr>
                        <tr style="background:#f5f5f5;">
                            <td style="padding:8px 10px;font-weight:bold;font-size:0.85rem;color:#555;">Dirección de Entrega</td>
                            <td colspan="3" style="padding:8px 10px;font-size:0.9rem;">📍 ${prod.direccionEntrega}</td>
                        </tr>
                    </table>

                    ${det ? `
                    <div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:6px;padding:14px;margin-top:8px;">
                        <div style="font-weight:bold;font-size:0.9rem;color:#333;margin-bottom:10px;border-bottom:1px solid #ddd;padding-bottom:6px;">🌱 Detalles del Cultivo al Momento de la Compra</div>
                        <table style="width:100%;border-collapse:collapse;margin-bottom:10px;">
                            <tr>
                                <td style="padding:6px 8px;font-size:0.82rem;color:#666;width:180px;font-weight:bold;">Variedad</td>
                                <td style="padding:6px 8px;font-size:0.85rem;">${det.variedad}</td>
                                <td style="padding:6px 8px;font-size:0.82rem;color:#666;width:180px;font-weight:bold;">Hectáreas Sembradas</td>
                                <td style="padding:6px 8px;font-size:0.85rem;">${det.hectareas} Ha</td>
                            </tr>
                            <tr style="background:#f5f5f5;">
                                <td style="padding:6px 8px;font-size:0.82rem;color:#666;font-weight:bold;">Fecha de Siembra</td>
                                <td style="padding:6px 8px;font-size:0.85rem;">${det.fechaSiembra ? new Date(det.fechaSiembra).toLocaleDateString('es-PE') : '—'}</td>
                                <td style="padding:6px 8px;font-size:0.82rem;color:#666;font-weight:bold;">Total Lote Declarado</td>
                                <td style="padding:6px 8px;font-size:0.85rem;">${det.cantidadTotal}</td>
                            </tr>
                            ${det.incidencia ? `<tr><td colspan="4" style="padding:6px 8px;font-size:0.82rem;color:#c0392b;font-weight:bold;">⚠️ Incidencia al momento de compra: ${det.incidencia}</td></tr>` : ''}
                        </table>
                        <div style="margin-bottom:6px;"><span style="font-size:0.82rem;color:#666;font-weight:bold;">Etapas del Cultivo: </span>${etapasHTML}</div>
                        <div><span style="font-size:0.82rem;color:#666;font-weight:bold;">Certificaciones: </span><br/>${certsHTML}</div>
                    </div>` : ''}
                </div>
            </div>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8"/>
    <title>Boleta de Venta - AgroLink - ${order.id}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; color: #333; background: #f0f2f0; }
        .page { max-width: 820px; margin: 30px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        @media print {
            body { background: white; }
            .page { margin: 0; box-shadow: none; border-radius: 0; }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>
<div class="page">
    <!-- Cabecera -->
    <div style="background:linear-gradient(135deg,#2E7D32,#43A047);color:white;padding:30px 36px;display:flex;justify-content:space-between;align-items:center;">
        <div>
            <div style="font-size:1.8rem;font-weight:700;letter-spacing:-0.5px;">🌿 AgroLink</div>
            <div style="font-size:0.9rem;opacity:0.85;margin-top:4px;">Plataforma Premium de Preventa de Cultivos</div>
        </div>
        <div style="text-align:right;">
            <div style="font-size:1.05rem;font-weight:700;">BOLETA DE VENTA</div>
            <div style="font-size:1.5rem;font-weight:700;color:#A5D6A7;">${order.id}</div>
            <div style="font-size:0.85rem;opacity:0.8;">Fecha: ${order.fecha}</div>
        </div>
    </div>

    <div style="padding:28px 36px;">
        <!-- Info de la Orden -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;padding:18px;background:#f8f8f8;border-radius:8px;border:1px solid #e5e5e5;">
            <div>
                <div style="font-weight:bold;font-size:0.8rem;color:#888;text-transform:uppercase;margin-bottom:4px;">Comprador</div>
                <div style="font-size:1rem;font-weight:600;">${buyerProfile.nombre} ${buyerProfile.apellidoPaterno} ${buyerProfile.apellidoMaterno}</div>
                <div style="font-size:0.85rem;color:#666;">${buyerProfile.tipoComprador} — RUC: ${buyerProfile.documentoIdentidad}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-weight:bold;font-size:0.8rem;color:#888;text-transform:uppercase;margin-bottom:4px;">Estado del Pedido</div>
                <div style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:0.9rem;font-weight:bold;background:${order.estado === 'Entregado' ? '#D4EDDA' : order.estado === 'Cancelado' ? '#FFEBEE' : '#FFF3E0'};color:${order.estado === 'Entregado' ? '#155724' : order.estado === 'Cancelado' ? '#d32f2f' : '#E65100'};">${order.estado}</div>
                <div style="font-size:0.85rem;color:#666;margin-top:6px;">Entrega Estimada: ${order.fechaEntregaEstimada}</div>
            </div>
        </div>

        <div style="font-size:1.05rem;font-weight:700;color:#2E7D32;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #E8F5E9;">📦 Productos Comprados</div>
        ${productosHTML}

        <!-- Totales -->
        <div style="background:#1B5E20;color:white;border-radius:8px;padding:20px 24px;margin-top:10px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.95rem;opacity:0.85;">
                <span>Total del Pedido:</span>
                <strong style="font-size:1.05rem;">${order.total}</strong>
            </div>
            <div style="font-size:0.78rem;opacity:0.65;border-top:1px solid rgba(255,255,255,0.2);padding-top:10px;margin-top:4px;text-align:center;">
                Documento generado por AgroLink · ${new Date().toLocaleString('es-PE')}
            </div>
        </div>
    </div>
</div>
<div class="no-print" style="text-align:center;margin:20px 0;">
    <button onclick="window.print()" style="background:#2E7D32;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;">🖨️ Imprimir / Guardar como PDF</button>
</div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Boleta-AgroLink-${order.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                                <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                    <button onClick={() => setSelectedOrder(order)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Ver Detalle</button>
                                    <button onClick={() => handleDownloadBoleta(order)} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>📄 Boleta</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', fontSize: '1.8rem', cursor: 'pointer' }}>&times;</button>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                            <h3 style={{ color: 'var(--color-primary)' }}>Detalle Pedido: {selectedOrder.id}</h3>
                            <button onClick={() => handleDownloadBoleta(selectedOrder)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📄 Descargar Boleta de Venta
                            </button>
                        </div>
                        
                        {/* INFORMACIÓN DE LA ORDEN */}
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
                            <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid #eee', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                                {/* Cabecera del producto */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px', borderBottom: '1px solid #f0f0f0' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <img src={prod.imagen} alt={prod.nombre} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-text)', fontSize: '1.1rem' }}>{prod.nombre}</h4>
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>🌱 Agricultor: <strong>{prod.agricultor}</strong></span><br/>
                                            <span style={{ fontSize: '0.85rem', color: '#888' }}>Lote Principal: <strong>{prod.lote || '—'}</strong> | Lote Parcial: <strong style={{ color: 'var(--color-primary)' }}>{prod.loteParcial}</strong></span><br/>
                                            <span style={{ fontSize: '0.85rem', color: '#555', marginTop: '3px', display: 'inline-block' }}>📍 Destino: <strong style={{ color: 'var(--color-text)' }}>{prod.direccionEntrega || 'Almacén Av. Industrial 1250, Callao'}</strong></span>
                                        </div>
                                    </div>
                                    {prod.adelanto > 0 && selectedOrder.estado !== 'Cancelado' && (
                                        <button onClick={() => handleCancelProduct(selectedOrder.id, prod.cultivoId)} style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', border: '1px solid #ffcdd2', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>❌ Cancelar y Reembolsar</button>
                                    )}
                                </div>

                                {/* Resumen financiero */}
                                <div style={{ backgroundColor: '#F8F9FA', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
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

                                {/* Detalles del Producto (Snapshot) */}
                                {prod.detallesProducto && (
                                    <div style={{ padding: '16px 18px', borderTop: '1px solid #f0f0f0', backgroundColor: '#FAFAFA' }}>
                                        <h5 style={{ margin: '0 0 12px 0', color: 'var(--color-text)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            🌱 <span>Detalles del Cultivo al Momento de la Compra</span>
                                            <span style={{ fontSize: '0.72rem', backgroundColor: '#E8F5E9', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 'normal' }}>Instantánea</span>
                                        </h5>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                                            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '6px', padding: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Variedad</span>
                                                <strong style={{ fontSize: '0.95rem' }}>{prod.detallesProducto.variedad}</strong>
                                            </div>
                                            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '6px', padding: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Hectáreas</span>
                                                <strong style={{ fontSize: '0.95rem' }}>{prod.detallesProducto.hectareas} Ha</strong>
                                            </div>
                                            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '6px', padding: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Fecha de Siembra</span>
                                                <strong style={{ fontSize: '0.95rem' }}>{prod.detallesProducto.fechaSiembra ? new Date(prod.detallesProducto.fechaSiembra).toLocaleDateString('es-PE') : '—'}</strong>
                                            </div>
                                            <div style={{ backgroundColor: 'white', border: '1px solid #eee', borderRadius: '6px', padding: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#888', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Lote</span>
                                                <strong style={{ fontSize: '0.95rem' }}>{prod.detallesProducto.cantidadTotal}</strong>
                                            </div>
                                        </div>

                                        {/* Etapas */}
                                        {prod.detallesProducto.etapas && Object.keys(prod.detallesProducto.etapas).length > 0 && (
                                            <div style={{ marginBottom: '12px' }}>
                                                <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Etapas del Cultivo</span>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {Object.entries(prod.detallesProducto.etapas).map(([etapa, pct]) => (
                                                        <div key={etapa} style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '5px', padding: '6px 10px', textAlign: 'center', minWidth: '80px' }}>
                                                            <span style={{ textTransform: 'capitalize', fontSize: '0.72rem', color: '#777', display: 'block' }}>{etapa}</span>
                                                            <strong style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>{pct}%</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Certificaciones */}
                                        {prod.detallesProducto.certificaciones && prod.detallesProducto.certificaciones.length > 0 && (
                                            <div>
                                                <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Certificaciones</span>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    {prod.detallesProducto.certificaciones.map((cert, ci) => (
                                                        <span key={ci} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px' }}>🛡️ {cert}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {prod.detallesProducto.incidencia && (
                                            <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: '5px', color: '#d32f2f', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                ⚠️ Incidencia registrada al comprar: {prod.detallesProducto.incidencia}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => handleDownloadBoleta(selectedOrder)} style={{ backgroundColor: '#E8F5E9', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📄 Descargar Boleta de Venta
                            </button>
                            <button onClick={() => setSelectedOrder(null)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px 25px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(46,125,50,0.2)' }}>Cerrar Detalle</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyerPurchases;