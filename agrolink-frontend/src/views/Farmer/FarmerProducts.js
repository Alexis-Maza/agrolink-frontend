import React from 'react';

function FarmerProducts() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: '0 0 10px 0' }}>
                        Mis Productos
                    </h2>
                    <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>
                        Gestiona tus cultivos y reporta avances.
                    </p>
                </div>
                <button style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(255,152,0,0.2)'
                }}>
                    + Registrar Cultivo
                </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>Aquí aparecerá la lista de tus cultivos registrados.</p>
            </div>
        </div>
    );
}

export default FarmerProducts;
