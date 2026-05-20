import React from 'react';
import { initialCatalog, initialOrders, initialNotifications } from '../../data/mockBuyerData';

function BuyerDashboard() {
    const activeOrdersCount = initialOrders.filter(o => o.estado !== 'Entregado').length;
    const unreadNotifications = initialNotifications.filter(n => !n.leida).length;

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: '0 0 5px 0', fontSize: '2rem' }}>Inicio</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', margin: '0 0 30px 0' }}>Resumen de tu actividad comercial.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid var(--color-primary)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#666' }}>Productos Disponibles</h3>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold' }}>{initialCatalog.length}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid var(--color-secondary)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#666' }}>Pedidos Activos</h3>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold' }}>{activeOrdersCount}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #d32f2f' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#666' }}>Alertas Nuevas</h3>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: '#d32f2f' }}>{unreadNotifications}</p>
                </div>
            </div>

            <h3 style={{ color: 'var(--color-text)', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Productos Recientes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {initialCatalog.map(crop => (
                    <div key={crop.id} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', transition: 'transform 0.2s', position: 'relative' }}>
                        {/* IMAGEN MEJORADA EN DASHBOARD */}
                        <div style={{ height: '180px', backgroundImage: `url(${crop.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px 15px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Lote: {crop.lote}</span>
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: 'var(--color-text)' }}>{crop.nombre}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666', fontSize: '0.95rem' }}>{crop.cantidadDisponible}</span>
                                <p style={{ margin: 0, color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {crop.precio} / Kg</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerDashboard;