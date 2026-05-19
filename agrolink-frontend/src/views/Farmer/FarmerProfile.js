import React from 'react';

function FarmerProfile() {
    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px' }}>
                Mi Perfil
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Actualiza tu información personal y datos de la finca.
            </p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>Formulario de edición de perfil próximamente.</p>
            </div>
        </div>
    );
}

export default FarmerProfile;
