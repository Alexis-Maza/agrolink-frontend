import React from 'react';

function AdminProfile() {
    return (
        <div>
            {/* Cabecera */}
            <div className="admin-header">
                <h1>Mi Perfil</h1>
                <span className="admin-badge">Configuración de Cuenta</span>
            </div>

            {/* Layout de Perfil */}
            <div className="admin-creation-grid">
                
                {/* Lado Izquierdo: Información General */}
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h2>Detalles de Cuenta</h2>
                        <div style={{ textAlign: 'center', margin: '24px 0' }}>
                            <div style={{ 
                                width: '90px', 
                                height: '90px', 
                                borderRadius: '50%', 
                                backgroundColor: 'var(--color-primary)', 
                                color: '#FFFFFF',
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto'
                            }}>
                                A
                            </div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>Administrador AgroLink</h3>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>carlos.admin@example.com</p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Rol del Sistema:</span>
                                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>ADMINISTRADOR</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Miembro desde:</span>
                                <span>Junio, 2026</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Última Sesión:</span>
                                <span>Hoy, 07:11 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Formularios de Edición (Skeletons) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Editar Información */}
                    <div className="admin-card">
                        <h2>Actualizar Información</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="admin-form-group">
                                <label>Nombre Completo</label>
                                <input type="text" className="admin-input" defaultValue="Administrador AgroLink" disabled />
                            </div>
                            <div className="admin-form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" className="admin-input" defaultValue="carlos.admin@example.com" disabled />
                            </div>
                            <button className="admin-btn" style={{ opacity: 0.7 }} disabled>
                                Guardar Información (Borrador)
                            </button>
                        </form>
                    </div>

                    {/* Cambiar Contraseña */}
                    <div className="admin-card">
                        <h2>Cambiar Contraseña</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="admin-form-group">
                                <label>Contraseña Actual</label>
                                <input type="password" className="admin-input" placeholder="••••••••" disabled />
                            </div>
                            <div className="admin-form-group">
                                <label>Nueva Contraseña</label>
                                <input type="password" className="admin-input" placeholder="Mínimo 8 caracteres" disabled />
                            </div>
                            <button className="admin-btn admin-btn-secondary" style={{ opacity: 0.7 }} disabled>
                                Actualizar Contraseña (Borrador)
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdminProfile;
