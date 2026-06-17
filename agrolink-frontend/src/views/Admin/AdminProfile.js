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
    const [formSuper, setFormSuper] = useState({ nombre: '', correo: '' });
    const [formClaveSuper, setFormClaveSuper] = useState({ actual: '', nueva: '', confirmar: '' });
    const [showPass, setShowPass] = useState({ actual: false, nueva: false, confirmar: false });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    
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
        const role = localStorage.getItem('userRole');
        
        // Cargar Subadmins (siempre necesario para listado de equipo y para actualizar datos del subadmin)
        let loadedSubadmins = [];
        const subData = localStorage.getItem(LOCAL_STORAGE_SUBADMINS_KEY);
        if (subData) {
            try {
                loadedSubadmins = JSON.parse(subData);
                setSubadmins(loadedSubadmins);
            } catch (e) {
                console.error("Error al parsear Subadmins", e);
            }
        } else {
            localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(subadminsIniciales));
            setSubadmins(subadminsIniciales);
            loadedSubadmins = subadminsIniciales;
        }

        if (role === 'SUBADMIN') {
            const loggedSub = localStorage.getItem('loggedSubadmin');
            if (loggedSub) {
                try {
                    const parsed = JSON.parse(loggedSub);
                    // Buscar la versión más fresca en la lista
                    const freshSub = loadedSubadmins.find(s => s.id === parsed.id) || parsed;
                    const profileData = {
                        id: freshSub.id,
                        nombre: freshSub.nombre,
                        correo: freshSub.correo,
                        clave: freshSub.clave,
                        miembroDesde: freshSub.fechaRegistro || 'Junio, 2026',
                        isSubadmin: true
                    };
                    setSuperPerfil(profileData);
                    setFormSuper({ nombre: freshSub.nombre, correo: freshSub.correo });
                } catch (e) {
                    console.error("Error al parsear loggedSubadmin", e);
                }
            }
        } else {
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

        const role = localStorage.getItem('userRole');

        if (role === 'SUBADMIN') {
            // Actualizar datos del subadmin en la lista de subadmins
            const actualizados = subadmins.map(s => {
                if (s.id === superPerfil.id) {
                    return {
                        ...s,
                        correo: formSuper.correo.trim()
                    };
                }
                return s;
            });
            localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(actualizados));
            setSubadmins(actualizados);

            // Actualizar loggedSubadmin session
            const freshSub = actualizados.find(s => s.id === superPerfil.id);
            localStorage.setItem('loggedSubadmin', JSON.stringify(freshSub));

            setSuperPerfil({
                ...superPerfil,
                correo: freshSub.correo
            });
        } else {
            // Superadmin normal
            const actualizado = {
                ...superPerfil,
                nombre: formSuper.nombre.trim(),
                correo: formSuper.correo.trim()
            };
            localStorage.setItem(LOCAL_STORAGE_SUPER_KEY, JSON.stringify(actualizado));
            setSuperPerfil(actualizado);
        }

        setIsEditingEmail(false);
        setMsgSuper({ type: 'success', text: '¡Datos actualizados con éxito!' });
        setTimeout(() => setMsgSuper({ type: '', text: '' }), 3000);
    };

    // Cambiar contraseña
    // Requisitos dinámicos de contraseña
    const tieneMinLongitud = formClaveSuper.nueva.length >= 8;
    const tieneNumero = /[0-9]/.test(formClaveSuper.nueva);
    const tieneMayuscula = /[A-Z]/.test(formClaveSuper.nueva);
    const tieneCaracterEspecial = /[^A-Za-z0-9]/.test(formClaveSuper.nueva);

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

        if (!tieneMinLongitud || !tieneNumero || !tieneMayuscula || !tieneCaracterEspecial) {
            setMsgClave({ type: 'error', text: 'La nueva contraseña debe cumplir con todos los requisitos de seguridad.' });
            return;
        }

        if (formClaveSuper.nueva !== formClaveSuper.confirmar) {
            setMsgClave({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }

        const role = localStorage.getItem('userRole');

        if (role === 'SUBADMIN') {
            // Actualizar contraseña del subadmin en la lista
            const actualizados = subadmins.map(s => {
                if (s.id === superPerfil.id) {
                    return {
                        ...s,
                        clave: formClaveSuper.nueva
                    };
                }
                return s;
            });
            localStorage.setItem(LOCAL_STORAGE_SUBADMINS_KEY, JSON.stringify(actualizados));
            setSubadmins(actualizados);

            // Actualizar loggedSubadmin session
            const freshSub = actualizados.find(s => s.id === superPerfil.id);
            localStorage.setItem('loggedSubadmin', JSON.stringify(freshSub));

            setSuperPerfil({
                ...superPerfil,
                clave: freshSub.clave
            });
        } else {
            // Superadmin normal
            const actualizado = {
                ...superPerfil,
                clave: formClaveSuper.nueva
            };
            localStorage.setItem(LOCAL_STORAGE_SUPER_KEY, JSON.stringify(actualizado));
            setSuperPerfil(actualizado);
        }

        setFormClaveSuper({ actual: '', nueva: '', confirmar: '' });
        setIsEditingPassword(false);
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
                <span className="admin-badge">
                    {superPerfil.isSubadmin ? 'Subadministrador' : 'Super Administrador'}
                </span>
            </div>

            {/* Pestañas de Navegación (Tabs) - Solo para Superadmin */}
            {!superPerfil.isSubadmin && (
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
                    <button style={tabStyle('mis-datos')} onClick={() => setActiveTab('mis-datos')}>
                        👤 Mis Datos
                    </button>
                    <button style={tabStyle('equipo')} onClick={() => setActiveTab('equipo')}>
                        👥 Equipo de Administradores
                    </button>
                </div>
            )}

            {/* CONTENIDO DE TABS */}
            {activeTab === 'mis-datos' || superPerfil.isSubadmin ? (
                /* PESTAÑA: MIS DATOS */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Tarjeta de Detalles Fijos (Diseño Horizontal) */}
                    <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', padding: '24px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            backgroundColor: 'var(--color-primary)', 
                            color: '#FFFFFF',
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {superPerfil.nombre.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>{superPerfil.nombre}</h3>
                            <p style={{ margin: '0 0 12px 0', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{superPerfil.correo}</p>
                            
                            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                                <div>
                                    <strong style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginRight: '6px' }}>RANGO DEL SISTEMA:</strong>
                                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                        {superPerfil.isSubadmin ? 'SUBADMINISTRADOR' : 'SUPERADMINISTRADOR'}
                                    </span>
                                </div>
                                <div>
                                    <strong style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginRight: '6px' }}>MIEMBRO DESDE:</strong>
                                    <span style={{ fontWeight: 600 }}>{superPerfil.miembroDesde}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario 1: Datos Personales (Ancho completo) */}
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
                                    disabled={true}
                                    style={{ backgroundColor: '#F5F5F5', cursor: 'not-allowed' }}
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
                                    disabled={!isEditingEmail}
                                    style={!isEditingEmail ? { backgroundColor: '#F5F5F5', cursor: 'not-allowed' } : {}}
                                    onChange={(e) => setFormSuper({ ...formSuper, correo: e.target.value })}
                                    required
                                />
                            </div>
                            
                            {isEditingEmail ? (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                                        Guardar Cambios
                                    </button>
                                    <button 
                                        type="button" 
                                        className="admin-btn admin-btn-danger" 
                                        style={{ flex: 1 }} 
                                        onClick={() => {
                                            setFormSuper({ ...formSuper, correo: superPerfil.correo });
                                            setIsEditingEmail(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    className="admin-btn" 
                                    style={{ width: '100%', backgroundColor: 'var(--color-primary)' }}
                                    onClick={() => setIsEditingEmail(true)}
                                >
                                    Editar Correo
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

                    {/* Formulario 2: Cambiar Contraseña (Ancho completo con Toggles y Recomendaciones) */}
                    <div className="admin-card">
                        <h2>Seguridad y Contraseña</h2>
                        <form onSubmit={handleCambiarClaveSuper}>
                            
                            {/* Clave Actual */}
                            <div className="admin-form-group">
                                <label htmlFor="pass-actual">Contraseña Actual</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        id="pass-actual"
                                        type={showPass.actual ? "text" : "password"} 
                                        className="admin-input" 
                                        placeholder="Escribe tu clave actual"
                                        value={formClaveSuper.actual}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, actual: e.target.value })}
                                        disabled={!isEditingPassword}
                                        style={!isEditingPassword ? { paddingRight: '48px', backgroundColor: '#F5F5F5', cursor: 'not-allowed' } : { paddingRight: '48px' }}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass({ ...showPass, actual: !showPass.actual })}
                                        disabled={!isEditingPassword}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: !isEditingPassword ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#777',
                                            opacity: !isEditingPassword ? 0.4 : 1,
                                            padding: '6px',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.2s',
                                            zIndex: 2
                                        }}
                                        onMouseEnter={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
                                        onMouseLeave={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        {showPass.actual ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Nueva Clave */}
                            <div className="admin-form-group">
                                <label htmlFor="pass-nueva">Nueva Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        id="pass-nueva"
                                        type={showPass.nueva ? "text" : "password"} 
                                        className="admin-input" 
                                        placeholder="Escribe tu nueva clave"
                                        value={formClaveSuper.nueva}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, nueva: e.target.value })}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
                                        disabled={!isEditingPassword}
                                        style={!isEditingPassword ? { paddingRight: '48px', backgroundColor: '#F5F5F5', cursor: 'not-allowed' } : { paddingRight: '48px' }}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass({ ...showPass, nueva: !showPass.nueva })}
                                        disabled={!isEditingPassword}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: !isEditingPassword ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#777',
                                            opacity: !isEditingPassword ? 0.4 : 1,
                                            padding: '6px',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.2s',
                                            zIndex: 2
                                        }}
                                        onMouseEnter={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
                                        onMouseLeave={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        {showPass.nueva ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>

                                    {/* Checklist de Recomendaciones dinámicas flotante */}
                                    {(isPasswordFocused || formClaveSuper.nueva.length > 0) && !(tieneMinLongitud && tieneNumero && tieneMayuscula && tieneCaracterEspecial) && (
                                        <div style={{ 
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            marginTop: '6px', 
                                            padding: '12px 14px', 
                                            backgroundColor: 'white', 
                                            borderRadius: '8px', 
                                            border: '1px solid var(--color-border)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            zIndex: 10,
                                            fontSize: '0.82rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px'
                                        }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
                                                Requisitos de seguridad de la contraseña:
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tieneMinLongitud ? '#2E7D32' : '#777', fontWeight: tieneMinLongitud ? 'bold' : 'normal' }}>
                                                <span>{tieneMinLongitud ? '✅' : '⚪'}</span> Mínimo 8 caracteres
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tieneNumero ? '#2E7D32' : '#777', fontWeight: tieneNumero ? 'bold' : 'normal' }}>
                                                <span>{tieneNumero ? '✅' : '⚪'}</span> Al menos un número (0-9)
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tieneMayuscula ? '#2E7D32' : '#777', fontWeight: tieneMayuscula ? 'bold' : 'normal' }}>
                                                <span>{tieneMayuscula ? '✅' : '⚪'}</span> Al menos una letra mayúscula (A-Z)
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: tieneCaracterEspecial ? '#2E7D32' : '#777', fontWeight: tieneCaracterEspecial ? 'bold' : 'normal' }}>
                                                <span>{tieneCaracterEspecial ? '✅' : '⚪'}</span> Al menos un carácter especial (ej. !@#$%^&*)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Confirmar Nueva Clave */}
                            <div className="admin-form-group">
                                <label htmlFor="pass-confirmar">Confirmar Nueva Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        id="pass-confirmar"
                                        type={showPass.confirmar ? "text" : "password"} 
                                        className="admin-input" 
                                        placeholder="Repite tu nueva clave"
                                        value={formClaveSuper.confirmar}
                                        onChange={(e) => setFormClaveSuper({ ...formClaveSuper, confirmar: e.target.value })}
                                        disabled={!isEditingPassword}
                                        style={!isEditingPassword ? { paddingRight: '48px', backgroundColor: '#F5F5F5', cursor: 'not-allowed' } : { paddingRight: '48px' }}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPass({ ...showPass, confirmar: !showPass.confirmar })}
                                        disabled={!isEditingPassword}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: !isEditingPassword ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#777',
                                            opacity: !isEditingPassword ? 0.4 : 1,
                                            padding: '6px',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.2s',
                                            zIndex: 2
                                        }}
                                        onMouseEnter={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'; }}
                                        onMouseLeave={(e) => { if (isEditingPassword) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        {showPass.confirmar ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formClaveSuper.confirmar && (
                                    <div style={{
                                        marginTop: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        color: formClaveSuper.nueva === formClaveSuper.confirmar ? '#2E7D32' : '#d32f2f',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span>{formClaveSuper.nueva === formClaveSuper.confirmar ? '🟢 Las contraseñas coinciden' : '🔴 Las contraseñas no coinciden'}</span>
                                    </div>
                                )}
                            </div>

                            {isEditingPassword ? (
                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>
                                        Guardar Contraseña
                                    </button>
                                    <button 
                                        type="button" 
                                        className="admin-btn admin-btn-danger" 
                                        style={{ flex: 1 }} 
                                        onClick={() => {
                                            setFormClaveSuper({ actual: '', nueva: '', confirmar: '' });
                                            setIsEditingPassword(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    className="admin-btn" 
                                    style={{ width: '100%', marginTop: '8px', backgroundColor: 'var(--color-primary)' }}
                                    onClick={() => setIsEditingPassword(true)}
                                >
                                    Cambiar Contraseña
                                </button>
                            )}

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
