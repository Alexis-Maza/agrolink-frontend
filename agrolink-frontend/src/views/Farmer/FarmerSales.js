import React from 'react';

function FarmerSales() {
    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px' }}>
                Mis Ventas
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Monitorea las preventas adquiridas por los compradores.
            </p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>Aquí aparecerá el historial y estado de tus ventas.</p>
            </div>
        </div>
    );
}

export default FarmerSales;
