import React, { useState, useEffect } from 'react';
import { obtenerDashboard, obtenerVentasAgricultor } from '../../api/agricultorDashboardService';

function FarmerDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const [dashData, ventasData] = await Promise.all([
                    obtenerDashboard(),
                    obtenerVentasAgricultor()
                ]);
                setDashboard(dashData);
                setVentas(ventasData);
            } catch (err) {
                console.error('Error cargando dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '80px', fontSize: '1.2rem', color: '#888' }}>
            ⏳ Cargando dashboard...
        </div>
    );

    const totalCrops = dashboard?.resumen_cultivos?.activos || 0;
    const pendingSalesCount = ventas.filter(s => s.estado !== 'Entregado').length;
    const estimatedRevenue = parseFloat(dashboard?.ventas_mes_actual_pen || 0);
    const volumenDisponible = parseFloat(dashboard?.volumen_total_disponible_kg || 0);
    const recentSales = ventas.slice(0, 3);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: '0 0 5px 0', fontSize: '2rem' }}>
                        Inicio
                    </h2>
                    <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>
                        Resumen general de tu actividad y métricas clave.
                    </p>
                </div>
            </div>

            {/* TARJETAS DE KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                
                {/* Tarjeta 1: Cultivos Activos */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Cultivos Activos</h3>
                        <span style={{ fontSize: '1.5rem' }}>🌾</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{totalCrops}</p>
                </div>

                {/* Tarjeta 2: Ventas en Proceso */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid var(--color-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Ventas en Proceso</h3>
                        <span style={{ fontSize: '1.5rem' }}>🚚</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{pendingSalesCount}</p>
                </div>

                {/* Tarjeta 3: Ventas del Mes */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #81C784' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Ventas del Mes</h3>
                        <span style={{ fontSize: '1.5rem' }}>💰</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        S/ {estimatedRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Tarjeta 4: Volumen Disponible */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #42A5F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Volumen Disponible</h3>
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        {volumenDisponible.toLocaleString('es-PE')} Kg
                    </p>
                </div>
            </div>

            {/* RESUMEN DE ESTADOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '30px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-primary)', fontSize: '1.3rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        Estado de Cultivos
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#E8F5E9', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ color: '#2E7D32', fontWeight: '600' }}>🌱 Activos</span>
                            <strong style={{ fontSize: '1.4rem', color: '#2E7D32' }}>{dashboard?.resumen_cultivos?.activos || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#FFF3E0', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ color: '#E65100', fontWeight: '600' }}>🌿 En Maduración</span>
                            <strong style={{ fontSize: '1.4rem', color: '#E65100' }}>{dashboard?.resumen_cultivos?.en_maduracion || 0}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#E3F2FD', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ color: '#1565C0', fontWeight: '600' }}>✅ Listos para vender</span>
                            <strong style={{ fontSize: '1.4rem', color: '#1565C0' }}>{dashboard?.resumen_cultivos?.por_cosechar || 0}</strong>
                        </div>
                    </div>
                </div>

                {/* Ventas Recientes */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--color-primary)', fontSize: '1.3rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        Ventas Recientes
                    </h3>
                    {recentSales.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay ventas registradas aún.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '10px 5px', color: '#888', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>Producto</th>
                                        <th style={{ padding: '10px 5px', color: '#888', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>Comprador</th>
                                        <th style={{ padding: '10px 5px', color: '#888', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSales.map(sale => (
                                        <tr key={sale.id}>
                                            <td style={{ padding: '12px 5px', borderBottom: '1px solid #eee', color: '#333', fontSize: '0.95rem' }}>{sale.nombreProducto} {sale.producto}</td>
                                            <td style={{ padding: '12px 5px', borderBottom: '1px solid #eee', color: '#555', fontSize: '0.95rem' }}>{sale.comprador}</td>
                                            <td style={{ padding: '12px 5px', borderBottom: '1px solid #eee' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                                                    backgroundColor: sale.estado === 'Entregado' ? '#D4EDDA' : (sale.estado === 'En Tránsito' ? '#E1F5FE' : '#FFF3E0'),
                                                    color: sale.estado === 'Entregado' ? '#155724' : (sale.estado === 'En Tránsito' ? '#0277BD' : '#E65100')
                                                }}>
                                                    {sale.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FarmerDashboard;