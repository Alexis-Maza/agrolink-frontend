import React from 'react';
import { initialCrops, initialSales } from '../../data/mockFarmerData';

// Función para calcular la etapa actual del cultivo
const calculateCurrentStage = (fechaSiembraStr, etapasObj) => {
    if (!fechaSiembraStr || !etapasObj) return { stage: 'Sin Iniciar', progress: 0 };
    
    const start = new Date(fechaSiembraStr);
    start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysElapsed = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    
    const g = parseInt(etapasObj.germinacion || 0, 10);
    const c = parseInt(etapasObj.crecimiento || 0, 10);
    const f = parseInt(etapasObj.floracion || 0, 10);
    const m = parseInt(etapasObj.maduracion || 0, 10);
    const totalDays = g + c + f + m;
    
    if (daysElapsed < 0) return { stage: 'Programado', progress: 0 };
    if (daysElapsed >= totalDays) return { stage: 'Cosechado / Disponible', progress: 100 };
    
    const progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
    
    let currentStage = '';
    if (daysElapsed < g) currentStage = 'Germinación';
    else if (daysElapsed < g + c) currentStage = 'Crecimiento Vegetativo';
    else if (daysElapsed < g + c + f) currentStage = 'Floración';
    else currentStage = 'Maduración';
    
    return { stage: currentStage, progress };
};

function FarmerDashboard() {
    // Cálculos de métricas
    const totalCrops = initialCrops.length;
    
    const pendingSalesCount = initialSales.filter(s => s.estado !== 'Entregado').length;
    
    // Sumar costos (ej: "S/ 2,500.00" -> 2500)
    const estimatedRevenue = initialSales.reduce((acc, sale) => {
        const costValue = parseFloat(sale.costo.replace(/[^0-9.-]+/g, ''));
        return acc + (isNaN(costValue) ? 0 : costValue);
    }, 0);
    
    const alertsCount = initialCrops.filter(c => c.incidencia).length;

    // Obtener los 3 cultivos más recientes o todos
    const recentCrops = [...initialCrops].slice(0, 3);
    
    // Obtener las 3 ventas más recientes
    const recentSales = [...initialSales].slice(0, 3);

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
                {/* Tarjeta 1: Cultivos */}
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
                
                {/* Tarjeta 3: Ingresos */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '5px solid #81C784' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Ingresos Estimados</h3>
                        <span style={{ fontSize: '1.5rem' }}>💰</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
                        S/ {estimatedRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Tarjeta 4: Alertas */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `5px solid ${alertsCount > 0 ? '#d32f2f' : '#ccc'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#666' }}>Alertas (Incidencias)</h3>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 'bold', color: alertsCount > 0 ? '#d32f2f' : '#666' }}>{alertsCount}</p>
                </div>
            </div>

            {/* SECCIONES DE DETALLE (Grid 2 columnas) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                
                {/* Estado de Cultivos */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.3rem' }}>Progreso de Cultivos</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {recentCrops.map(crop => {
                            const stageData = calculateCurrentStage(crop.fechaSiembra, crop.etapas);
                            return (
                                <div key={crop.id} style={{ padding: '15px', backgroundColor: crop.incidencia ? '#FFEBEE' : '#F8F9FA', borderRadius: 'var(--radius-md)', border: crop.incidencia ? '1px solid #ffcdd2' : '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong style={{ color: 'var(--color-text)' }}>{crop.nombre}</strong>
                                        <span style={{ fontSize: '0.85rem', color: crop.incidencia ? '#d32f2f' : 'var(--color-secondary)', fontWeight: 'bold' }}>
                                            {crop.incidencia ? '⚠️ Incidencia' : stageData.stage}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${stageData.progress}%`, height: '100%', backgroundColor: crop.incidencia ? '#d32f2f' : 'var(--color-primary)' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Últimas Ventas */}
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.3rem' }}>Ventas Recientes</h3>
                    </div>

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
                                        <td style={{ padding: '12px 5px', borderBottom: '1px solid #eee', color: '#333', fontSize: '0.95rem' }}>{sale.producto}</td>
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
                </div>

            </div>
        </div>
    );
}

export default FarmerDashboard;
