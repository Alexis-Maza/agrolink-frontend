import React, { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'agrolink_admin_compradores';

const datosIniciales = [
    { id: 1, nombre: 'Pedro', apellidoPaterno: 'Alarcón', apellidoMaterno: 'Soto', correo: 'pedro.alarcon@example.com', estado: 'Activo', fechaRegistro: '2026-06-17' },
    { id: 2, nombre: 'Lucía', apellidoPaterno: 'Vargas', apellidoMaterno: 'Rojas', correo: 'lucia.vargas@example.com', estado: 'Activo', fechaRegistro: '2026-06-16' },
    { id: 3, nombre: 'Miguel', apellidoPaterno: 'Chávez', apellidoMaterno: 'Flores', correo: 'miguel.chavez@example.com', estado: 'Inactivo', fechaRegistro: '2026-06-17' },
    { id: 4, nombre: 'Elena', apellidoPaterno: 'Salazar', apellidoMaterno: 'Castillo', correo: 'elena.salazar@example.com', estado: 'Activo', fechaRegistro: '2026-06-15' }
];

function AdminBuyers() {
    // --- ESTADOS ---
    const [compradores, setCompradores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBuy, setSelectedBuy] = useState(null);

    // Formulario de Edición en Modal
    const [formEdit, setFormEdit] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        estado: 'Activo'
    });

    // --- CARGAR / INICIALIZAR DATOS ---
    const inicializarDatos = useCallback(() => {
        const guardados = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (guardados) {
            try {
                setCompradores(JSON.parse(guardados));
            } catch (e) {
                console.error("Error al parsear compradores de localStorage", e);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosIniciales));
                setCompradores(datosIniciales);
            }
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosIniciales));
            setCompradores(datosIniciales);
        }
    }, []);

    useEffect(() => {
        inicializarDatos();
    }, [inicializarDatos]);

    // --- OBTENER FECHA LOCAL YYYY-MM-DD ---
    const obtenerFechaHoy = () => {
        const hoy = new Date();
        const offset = hoy.getTimezoneOffset();
        const hoyLocal = new Date(hoy.getTime() - (offset * 60 * 1000));
        return hoyLocal.toISOString().split('T')[0];
    };

    // --- CÁLCULO DE MÉTRICAS ---
    const totalCompradores = compradores.length;
    const registradosHoy = compradores.filter(b => b.fechaRegistro === obtenerFechaHoy()).length;

    // --- EVENTOS ---
    
    // Abrir Modal de Edición
    const abrirModal = (buy) => {
        setSelectedBuy(buy);
        setFormEdit({
            nombre: buy.nombre || '',
            apellidoPaterno: buy.apellidoPaterno || '',
            apellidoMaterno: buy.apellidoMaterno || '',
            estado: buy.estado || 'Activo'
        });
        setModalOpen(true);
    };

    // Cerrar Modal
    const cerrarModal = () => {
        setModalOpen(false);
        setSelectedBuy(null);
    };

    // Guardar Cambios en localStorage
    const handleGuardarEdicion = (e) => {
        e.preventDefault();
        if (!formEdit.nombre.trim() || !formEdit.apellidoPaterno.trim() || !formEdit.apellidoMaterno.trim()) {
            alert("Todos los campos de nombres y apellidos son obligatorios.");
            return;
        }

        const datosActualizados = compradores.map(b => {
            if (b.id === selectedBuy.id) {
                return {
                    ...b,
                    nombre: formEdit.nombre.trim(),
                    apellidoPaterno: formEdit.apellidoPaterno.trim(),
                    apellidoMaterno: formEdit.apellidoMaterno.trim(),
                    estado: formEdit.estado
                };
            }
            return b;
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosActualizados));
        setCompradores(datosActualizados);
        cerrarModal();
    };

    // Exportar Compradores a un archivo CSV compatible con Excel
    const exportarAExcel = () => {
        const headers = ["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Correo", "Estado", "Fecha Registro"];
        const rows = compradores.map(b => [
            b.id,
            b.nombre,
            b.apellidoPaterno,
            b.apellidoMaterno,
            b.correo,
            b.estado,
            b.fechaRegistro
        ]);

        // Usamos delimitador punto y coma (;) y UTF-8 BOM para soporte total de acentos en Excel en español
        const csvContent = "\uFEFF" 
            + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_compradores.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Cabecera */}
            <div className="admin-header">
                <h1>Gestión de Compradores</h1>
                <span className="admin-badge">Control de Clientes</span>
            </div>

            {/* Fichas Estadísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Total de Compradores
                    </h3>
                    <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {totalCompradores}
                    </p>
                </div>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Registrados el Día de Hoy
                    </h3>
                    <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>
                        {registradosHoy}
                    </p>
                </div>
            </div>

            {/* Tabla de Compradores */}
            <div className="admin-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ margin: 0 }}>Listado de Compradores</h2>
                    <button 
                        onClick={exportarAExcel} 
                        className="admin-btn" 
                        style={{ backgroundColor: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        📥 Exportar a Excel
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Correo Electrónico</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compradores.map(b => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td style={{ fontWeight: '600' }}>{b.nombre}</td>
                                <td>{b.apellidoPaterno}</td>
                                <td>{b.apellidoMaterno}</td>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{b.correo}</td>
                                <td>
                                    <span className={`status-badge ${b.estado === 'Activo' ? 'active' : 'inactive'}`}>
                                        {b.estado}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="admin-btn admin-btn-secondary" 
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        onClick={() => abrirModal(b)}
                                    >
                                        Editar ✏️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición Flotante */}
            {modalOpen && selectedBuy && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Editar Comprador: {selectedBuy.correo}</h3>
                            <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
                        </header>

                        <form onSubmit={handleGuardarEdicion} style={{ padding: '24px' }}>
                            <div className="admin-form-group">
                                <label htmlFor="edit-nombre">Nombre</label>
                                <input 
                                    id="edit-nombre"
                                    type="text" 
                                    className="admin-input" 
                                    value={formEdit.nombre}
                                    onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="edit-paterno">Apellido Paterno</label>
                                <input 
                                    id="edit-paterno"
                                    type="text" 
                                    className="admin-input" 
                                    value={formEdit.apellidoPaterno}
                                    onChange={(e) => setFormEdit({ ...formEdit, apellidoPaterno: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="edit-materno">Apellido Materno</label>
                                <input 
                                    id="edit-materno"
                                    type="text" 
                                    className="admin-input" 
                                    value={formEdit.apellidoMaterno}
                                    onChange={(e) => setFormEdit({ ...formEdit, apellidoMaterno: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="edit-estado">Estado de Cuenta</label>
                                <select 
                                    id="edit-estado"
                                    className="admin-select"
                                    value={formEdit.estado}
                                    onChange={(e) => setFormEdit({ ...formEdit, estado: e.target.value })}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
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

export default AdminBuyers;
