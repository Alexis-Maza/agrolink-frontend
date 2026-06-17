import React, { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_SUPER_KEY = 'agrolink_admin_perfil_super';
const LOCAL_STORAGE_SUBADMINS_KEY = 'agrolink_admin_subadmins';

const superPerfilInicial = {
    nombre: 'Administrador Superior',
    correo: 'carlos.admin@example.com',
    clave: 'supersecretpassword',
    miembroDesde: 'Junio, 2026'
};

const subadminsIniciales = [
    { id: 101, nombre: 'Alberto Ruiz', correo: 'alberto.ruiz@example.com', estado: 'Activo', clave: 'alberto123', fechaRegistro: '2026-06-16' },
    { id: 102, nombre: 'Sofía Torres', correo: 'sofia.torres@example.com', estado: 'Activo', clave: 'sofia456', fechaRegistro: '2026-06-17' },
    { id: 103, nombre: 'Diego Salas', correo: 'diego.salas@example.com', estado: 'Suspendido', clave: 'diego789', fechaRegistro: '2026-06-15' }
];

function AdminProfile() {
    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState('mis-datos'); // 'mis-datos' | 'equipo'

    // Datos Superadmin (Mi Perfil)
    const [superPerfil, setSuperPerfil] = useState(null);
    const [isEditingSuper, setIsEditingSuper] = useState(false);
    const [formSuper, setFormSuper] = useState({ nombre: '', correo: '' });
    const [formClaveSuper, setFormClaveSuper] = useState({ actual: '', nueva: '', confirmar: '' });
    
    // Lista Subadmins (Mi Equipo)
    const [subadmins, setSubadmins] = useState([]);
    
    // Modales de Subadmins
    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    
    // Formularios Modales
    const [formCrearSub, setFormCrearSub] = useState({ nombre: '', correo: '', clave: '' });
    const [selectedSub, setSelectedSub] = useState(null);
    const [formEditarSub, setFormEditarSub] = useState({ nombre: '', correo: '', clave: '', estado: 'Activo' });

    // Mensajes de Feedback
    const [msgSuper, setMsgSuper] = useState({ type: '', text: '' });
    const [msgClave, setMsgClave] = useState({ type: '', text: '' });

    // --- CARGAR / INICIALIZAR DATOS ---
    const cargarDatos = useCallback(() => {
        // Cargar Superadmin
        const superData = localStorage.getItem(LOCAL_STORAGE_SUPER_KEY);
        if (superData) {
            try {
                const parsed = JSON.parse(superData);
                setSuperPerfil(parsed);
                setFormSuper({ nombre: parsed.nombre, correo: parsed.correo });
            } catch (e) {
                console.error("Error al parsear SuperPerfil", e);
            }
        } else {
            localStorage.setItem(LOCAL_STORAGE_SUPER_KEY, JSON.stringify(superPerfilInicial));
            setSuperPerfil(superPerfilInicial);
            setFormSuper({ nombre: superPerfilInicial.nombre, correo: superPerfilInicial.correo });
        }

        // Cargar Subadmins
        const subData = localStorage.getItem(LOCAL_STORAGE_SUBADMINS_KEY);
        if (subData) {
            try {
                setSubadmins(JSON.parse(subData));
            } catch (e) {
                console.error("Error al parsear Subadmins", e);
            }
        } else {
            localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(subadminsIniciales));
            setSubadmins(subadminsIniciales);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // --- ENLACES ACTIVOS TABS ---
    const tabStyle = (tabId) => ({
        padding: '14px 28px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        borderBottom: activeTab === tabId ? '3px solid var(--color-primary)' : '3px solid transparent',
        color: activeTab === tabId ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        background: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        transition: 'all 0.2s',
        outline: 'none'
    });

    // --- ACCIONES DE PERFIL PROPIO (SUPERADMIN) ---

    // Guardar datos personales
    const handleGuardarDatosSuper = (e) => {
        e.preventDefault();
        if (!formSuper.nombre.trim() || !formSuper.correo.trim()) {
            setMsgSuper({ type: 'error', text: 'Todos los campos son obligatorios.' });
            return;
        }

        const actualizado = {
            ...superPerfil,
            nombre: formSuper.nombre.trim(),
            correo: formSuper.correo.trim()
        };

        localStorage.setItem(LOCAL_STORAGE_SUPER_KEY, JSON.stringify(actualizado));
        setSuperPerfil(actualizado);
        setIsEditingSuper(false);
        setMsgSuper({ type: 'success', text: '¡Datos actualizados con éxito!' });
        setTimeout(() => setMsgSuper({ type: '', text: '' }), 3000);
    };

    // Cambiar contraseña
    const handleCambiarClaveSuper = (e) => {
        e.preventDefault();
        if (!formClaveSuper.actual || !formClaveSuper.nueva || !formClaveSuper.confirmar) {
            setMsgClave({ type: 'error', text: 'Completa todos los campos.' });
            return;
        }

        if (formClaveSuper.actual !== superPerfil.clave) {
            setMsgClave({ type: 'error', text: 'La contraseña actual es incorrecta.' });
            return;
        }

        if (formClaveSuper.nueva.length < 6) {
            setMsgClave({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        if (formClaveSuper.nueva !== formClaveSuper.confirmar) {
            setMsgClave({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }

        const actualizado = {
            ...superPerfil,
            clave: formClaveSuper.nueva
        };

        localStorage.setItem(LOCAL_STORAGE_SUPER_KEY, JSON.stringify(actualizado));
        setSuperPerfil(actualizado);
        setFormClaveSuper({ actual: '', nueva: '', confirmar: '' });
        setMsgClave({ type: 'success', text: '¡Contraseña cambiada exitosamente!' });
        setTimeout(() => setMsgClave({ type: '', text: '' }), 3000);
    };


    // --- ACCIONES DE SUBADMINISTRADORES ---

    // Alternar activación/desactivación
    const handleToggleEstadoSub = (subId) => {
        const actualizados = subadmins.map(s => {
            if (s.id === subId) {
                return {
                    ...s,
                    estado: s.estado === 'Activo' ? 'Suspendido' : 'Activo'
                };
            }
            return s;
        });
        localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(actualizados));
        setSubadmins(actualizados);
    };

    // Registrar nuevo subadmin
    const handleCrearSubadmin = (e) => {
        e.preventDefault();
        if (!formCrearSub.nombre.trim() || !formCrearSub.correo.trim() || !formCrearSub.clave.trim()) {
            alert('Todos los campos son obligatorios para crear una cuenta.');
            return;
        }

        const nuevo = {
            id: Date.now(),
            nombre: formCrearSub.nombre.trim(),
            correo: formCrearSub.correo.trim(),
            clave: formCrearSub.clave.trim(),
            estado: 'Activo',
            fechaRegistro: new Date().toISOString().split('T')[0]
        };

        const actualizados = [...subadmins, nuevo];
        localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(actualizados));
        setSubadmins(actualizados);
        setFormCrearSub({ nombre: '', correo: '', clave: '' });
        setModalCrearOpen(false);
    };

    // Abrir Modal de Edición de Subadmin
    const abrirEditarSub = (sub) => {
        setSelectedSub(sub);
        setFormEditarSub({
            nombre: sub.nombre,
            correo: sub.correo,
            clave: '', // Se deja vacío para indicar que no se cambiará a menos que se escriba algo
            estado: sub.estado
        });
        setModalEditarOpen(true);
    };

    // Cerrar Modal de Edición de Subadmin
    const cerrarModal = () => {
        setModalEditarOpen(false);
        setSelectedSub(null);
    };

    // Guardar Edición de Subadmin
    const handleGuardarEditarSub = (e) => {
        e.preventDefault();
        if (!formEditarSub.nombre.trim() || !formEditarSub.correo.trim()) {
            alert('Nombre y Correo son campos obligatorios.');
            return;
        }

        const actualizados = subadmins.map(s => {
            if (s.id === selectedSub.id) {
                return {
                    ...s,
                    nombre: formEditarSub.nombre.trim(),
                    correo: formEditarSub.correo.trim(),
                    clave: formEditarSub.clave.trim() !== '' ? formEditarSub.clave.trim() : s.clave,
                    estado: formEditarSub.estado
                };
            }
            return s;
        });

        localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(actualizados));
        setSubadmins(actualizados);
        setSelectedSub(null);
        setModalEditarOpen(false);
    };

    // Cálculos del equipo
    const totalSubadmins = subadmins.length;
    const activosSubadmins = subadmins.filter(s => s.estado === 'Activo').length;

    if (!superPerfil) return <div>Cargando datos del perfil...</div>;

    return (
        <div>
            {/* Cabecera */}
            <div className="admin-header">
                <h1>Mi Perfil</h1>
                <span className="admin-badge">Super Administrador</span>
            </div>

            {/* Pestañas de Navegación (Tabs) */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <button style={tabStyle('mis-datos')} onClick={() => setActiveTab('mis-datos')}>
                    👤 Mis Datos
                </button>
                <button style={tabStyle('equipo')} onClick={() => setActiveTab('equipo')}>
                    👥 Equipo de Administradores
                </button>
            </div>

            {/* CONTENIDO DE TABS */}
            {activeTab === 'mis-datos' ? (
                /* PESTAÑA: MIS DATOS */
                <div className="admin-creation-grid">
                    
                    {/* Tarjeta de Detalles Fijos */}
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
                                    {superPerfil.nombre.charAt(0)}
                                </div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem' }}>{superPerfil.nombre}</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{superPerfil.correo}</p>
                            </div>

                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Rango del Sistema:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>SUPERADMINISTRADOR</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Miembro desde:</span>
                                    <span>{superPerfil.miembroDesde}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formularios de Actualización */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Formulario 1: Datos Personales */}
                        <div className="admin-card">
                            <h2>Actualizar Información</h2>
                            <form onSubmit={handleGuardarDatosSuper}>
                                <div className="admin-form-group">
                                    <label htmlFor="super-nombre">Nombre de Administrador</label>
                                    <input 
                                        id="super-nombre"
                                        type="text" 
                                        className="admin-input" 
                                        value={formSuper.nombre}
                                        disabled={!isEditingSuper}
                                        onChange={(e) => setFormSuper({ ...formSuper, nombre: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="super-correo">Correo Electrónico</label>
                                    <input 
                                        id="super-correo"
                                        type="email" 
                                        className="admin-input" 
                                        value={formSuper.correo}
                                        disabled={!isEditingSuper}
                                        onChange={(e) => setFormSuper({ ...formSuper, correo: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                {isEditingSuper ? (
                                    <button type="submit" className="admin-btn admin-btn-success" style={{ width: '100%' }}>
                                        Guardar Información
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="admin-btn" 
                                        style={{ width: '100%', backgroundColor: 'var(--color-primary)' }}
                                        onClick={() => setIsEditingSuper(true)}
                                    >
                                        Editar Información
                                    </button>
                                )}

                                {msgSuper.text && (
                                    <div style={{ 
                                        marginTop: '12px', 
                                        fontSize: '0.85rem', 
                                        color: msgSuper.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}>
                                        {msgSuper.text}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Formulario 2: Cambiar Contraseña */}
                        <div className="admin-card">
                            <h2>Seguridad y Contraseña</h2>
                            <form onSubmit={handleCambiarClaveSuper}>
                                <div className="admin-form-group">
                                    <label htmlFor="pass-actual">Contraseña Actual</label>
                                    <input 
                                        id="pass-actual"
                                        type="password" 
                                        className="admin-input" 
                                        placeholder="Escribe tu clave actual"
                                        value={formClaveSuper.actual}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, actual: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="pass-nueva">Nueva Contraseña</label>
                                    <input 
                                        id="pass-nueva"
                                        type="password" 
                                        className="admin-input" 
                                        placeholder="Mínimo 6 caracteres"
                                        value={formClaveSuper.nueva}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, nueva: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="pass-confirmar">Confirmar Nueva Contraseña</label>
                                    <input 
                                        id="pass-confirmar"
                                        type="password" 
                                        className="admin-input" 
                                        placeholder="Repite tu nueva clave"
                                        value={formClaveSuper.confirmar}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, confirmar: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="admin-btn admin-btn-secondary" style={{ width: '100%' }}>
                                    Actualizar Contraseña
                                </button>

                                {msgClave.text && (
                                    <div style={{ 
                                        marginTop: '12px', 
                                        fontSize: '0.85rem', 
                                        color: msgClave.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }}>
                                        {msgClave.text}
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>

                </div>
            ) : (
                /* PESTAÑA: EQUIPO DE ADMINISTRADORES */
                <div>
                    {/* Estadísticas de Soporte */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div className="admin-card" style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Administradores de Soporte</h3>
                            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{totalSubadmins}</p>
                        </div>
                        <div className="admin-card" style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Cuentas Activas</h3>
                            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>{activosSubadmins}</p>
                        </div>
                    </div>

                    {/* Tabla de Administradores */}
                    <div className="admin-table-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0 }}>Listado del Equipo Técnico</h2>
                            <button 
                                className="admin-btn"
                                onClick={() => setModalCrearOpen(true)}
                            >
                                + Crear Subadministrador
                            </button>
                        </div>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo Electrónico</th>
                                    <th>Estado</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subadmins.map(s => (
                                    <tr key={s.id}>
                                        <td>{s.id}</td>
                                        <td style={{ fontWeight: '600' }}>{s.nombre}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{s.correo}</td>
                                        <td>
                                            <span className={`status-badge ${s.estado === 'Activo' ? 'active' : 'inactive'}`}>
                                                {s.estado}
                                            </span>
                                        </td>
                                        <td>{s.fechaRegistro}</td>
                                        <td style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                className="admin-btn admin-btn-secondary" 
                                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                onClick={() => abrirEditarSub(s)}
                                            >
                                                Editar ✏️
                                            </button>
                                            <button 
                                                className={`admin-btn ${s.estado === 'Activo' ? 'admin-btn-danger' : 'admin-btn-success'}`}
                                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                onClick={() => handleToggleEstadoSub(s.id)}
                                            >
                                                {s.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL 1: CREAR SUBADMINISTRADOR */}
            {modalCrearOpen && (
                <div className="modal-overlay" onClick={() => setModalCrearOpen(false)}>
                    <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Crear Nuevo Subadministrador</h3>
                            <button className="modal-close-btn" onClick={() => setModalCrearOpen(false)}>&times;</button>
                        </header>
                        <form onSubmit={handleCrearSubadmin} style={{ padding: '24px' }}>
                            <div className="admin-form-group">
                                <label htmlFor="new-sub-nombre">Nombre Completo</label>
                                <input 
                                    id="new-sub-nombre"
                                    type="text" 
                                    className="admin-input" 
                                    placeholder="Ej. Alberto Ruiz"
                                    value={formCrearSub.nombre}
                                    onChange={(e) => setFormCrearSub({ ...formCrearSub, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="new-sub-correo">Correo Electrónico</label>
                                <input 
                                    id="new-sub-correo"
                                    type="email" 
                                    className="admin-input" 
                                    placeholder="correo@ejemplo.com"
                                    value={formCrearSub.correo}
                                    onChange={(e) => setFormCrearSub({ ...formCrearSub, correo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="new-sub-pass">Contraseña Temporal</label>
                                <input 
                                    id="new-sub-pass"
                                    type="password" 
                                    className="admin-input" 
                                    placeholder="Mínimo 6 caracteres"
                                    value={formCrearSub.clave}
                                    onChange={(e) => setFormCrearSub({ ...formCrearSub, clave: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                                    Registrar Cuenta
                                </button>
                                <button type="button" className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={() => setModalCrearOpen(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDITAR SUBADMINISTRADOR Y CAMBIAR CLAVE */}
            {modalEditarOpen && selectedSub && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Editar Cuenta: {selectedSub.correo}</h3>
                            <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
                        </header>
                        <form onSubmit={handleGuardarEditarSub} style={{ padding: '24px' }}>
                            <div className="admin-form-group">
                                <label htmlFor="edit-sub-nombre">Nombre Completo</label>
                                <input 
                                    id="edit-sub-nombre"
                                    type="text" 
                                    className="admin-input" 
                                    value={formEditarSub.nombre}
                                    onChange={(e) => setFormEditarSub({ ...formEditarSub, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-sub-correo">Correo Electrónico</label>
                                <input 
                                    id="edit-sub-correo"
                                    type="email" 
                                    className="admin-input" 
                                    value={formEditarSub.correo}
                                    onChange={(e) => setFormEditarSub({ ...formEditarSub, correo: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-sub-pass">Resetear Contraseña</label>
                                <input 
                                    id="edit-sub-pass"
                                    type="password" 
                                    className="admin-input" 
                                    placeholder="Dejar en blanco para no cambiar"
                                    value={formEditarSub.clave}
                                    onChange={(e) => setFormEditarSub({ ...formEditarSub, clave: e.target.value })}
                                />
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                    Escribe una nueva contraseña si el subadmin la olvidó o la dañó.
                                </span>
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-sub-estado">Estado de la Cuenta</label>
                                <select 
                                    id="edit-sub-estado"
                                    className="admin-select"
                                    value={formEditarSub.estado}
                                    onChange={(e) => setFormEditarSub({ ...formEditarSub, estado: e.target.value })}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Suspendido">Suspendido</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                                    Guardar Cambios
                                </button>
                                <button type="button" className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={cerrarModal}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminProfile;
