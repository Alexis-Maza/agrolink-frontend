import React from 'react';

function FarmerDashboard() {
    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '20px' }}>
                Inicio
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Resumen de tu actividad agrícola.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {/* Tarjeta 1 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--color-primary)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>Cultivos Activos</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>3</p>
                </div>
                {/* Tarjeta 2 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--color-secondary)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>Ventas en Proceso</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>12</p>
                </div>
                {/* Tarjeta 3 */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #81C784' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#666' }}>Ingresos Estimados</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>$4,500</p>
                </div>
            </div>
        </div>
    );
}

export default FarmerDashboard;
