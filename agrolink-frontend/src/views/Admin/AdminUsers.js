import React from 'react';

function AdminUsers() {
    // Datos mock rápidos para poblar el skeleton y dar idea de la estructura
    const usuariosEjemplo = [
        { id: 1, nombre: 'Juan Pérez', correo: 'juan.perez@example.com', rol: 'AGRICULTOR', estado: 'Activo' },
        { id: 2, nombre: 'María López', correo: 'maria.lopez@example.com', rol: 'COMPRADOR', estado: 'Activo' },
        { id: 3, nombre: 'Carlos Gómez', correo: 'carlos.admin@example.com', rol: 'ADMINISTRADOR', estado: 'Activo' },
        { id: 4, nombre: 'Pedro Torres', correo: 'pedro.torres@example.com', rol: 'AGRICULTOR', estado: 'Bloqueado' }
    ];

    return (
        <div>
            {/* Cabecera */}
            <div className="admin-header">
                <h1>Gestión de Usuarios</h1>
                <span className="admin-badge">Control de Cuentas</span>
            </div>

            {/* Fichas Informativas Estructuradas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Usuarios</h3>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>24</p>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Agricultores</h3>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-success)' }}>14</p>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Compradores</h3>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-info)' }}>9</p>
                </div>
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Administradores</h3>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#607D8B' }}>1</p>
                </div>
            </div>

            {/* Grid Principal: Formulario y Tabla */}
            <div className="admin-creation-grid">
                
                {/* Formulario (Estructurado) */}
                <div className="admin-card">
                    <h2>Registrar Usuario</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="admin-form-group">
                            <label>Nombre Completo</label>
                            <input type="text" className="admin-input" placeholder="Nombre y Apellidos" disabled />
                        </div>
                        <div className="admin-form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" className="admin-input" placeholder="correo@ejemplo.com" disabled />
                        </div>
                        <div className="admin-form-group">
                            <label>Rol de Usuario</label>
                            <select className="admin-select" disabled>
                                <option>Seleccione un rol...</option>
                                <option>AGRICULTOR</option>
                                <option>COMPRADOR</option>
                                <option>ADMINISTRADOR</option>
                            </select>
                        </div>
                        <button className="admin-btn" style={{ opacity: 0.7 }} disabled>
                            Crear Usuario (Borrador)
                        </button>
                    </form>
                </div>

                {/* Tabla de Usuarios (Estructurada) */}
                <div className="admin-table-container" style={{ margin: 0 }}>
                    <h2>Listado de Cuentas</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosEjemplo.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td style={{ fontWeight: '600' }}>{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td>
                                        <span style={{ 
                                            backgroundColor: '#CFD8DC', 
                                            padding: '2px 6px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: '#37474F'
                                        }}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.estado === 'Activo' ? 'active' : 'inactive'}`}>
                                            {u.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-btn" style={{ padding: '4px 8px', fontSize: '0.75rem' }} disabled>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default AdminUsers;
