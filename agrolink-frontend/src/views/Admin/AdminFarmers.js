import React, { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'agrolink_admin_agricultores';

const datosIniciales = [
    { id: 1, nombre: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'García', correo: 'juan.perez@example.com', estado: 'Activo', fechaRegistro: '2026-06-17' },
    { id: 2, nombre: 'Carlos', apellidoPaterno: 'Mendoza', apellidoMaterno: 'Torres', correo: 'carlos.mendoza@example.com', estado: 'Activo', fechaRegistro: '2026-06-16' },
    { id: 3, nombre: 'Ana', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Díaz', correo: 'ana.ramirez@example.com', estado: 'Inactivo', fechaRegistro: '2026-06-17' },
    { id: 4, nombre: 'Luis', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Ruiz', correo: 'luis.sanchez@example.com', estado: 'Activo', fechaRegistro: '2026-06-15' }
];

function AdminFarmers() {
    // --- ESTADOS ---
    const [agricultores, setAgricultores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAgr, setSelectedAgr] = useState(null);

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
                setAgricultores(JSON.parse(guardados));
            } catch (e) {
                console.error("Error al parsear agricultores de localStorage", e);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosIniciales));
                setAgricultores(datosIniciales);
            }
        } else {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosIniciales));
            setAgricultores(datosIniciales);
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
    const totalAgricultores = agricultores.length;
    const registradosHoy = agricultores.filter(a => a.fechaRegistro === obtenerFechaHoy()).length;

    // --- EVENTOS ---
    
    // Abrir Modal de Edición
    const abrirModal = (agr) => {
        setSelectedAgr(agr);
        setFormEdit({
            nombre: agr.nombre || '',
            apellidoPaterno: agr.apellidoPaterno || '',
            apellidoMaterno: agr.apellidoMaterno || '',
            estado: agr.estado || 'Activo'
        });
        setModalOpen(true);
    };

    // Cerrar Modal
    const cerrarModal = () => {
        setModalOpen(false);
        setSelectedAgr(null);
    };

    // Guardar Cambios en localStorage
    const handleGuardarEdicion = (e) => {
        e.preventDefault();
        if (!formEdit.nombre.trim() || !formEdit.apellidoPaterno.trim() || !formEdit.apellidoMaterno.trim()) {
            alert("Todos los campos de nombres y apellidos son obligatorios.");
            return;
        }

        const datosActualizados = agricultores.map(a => {
            if (a.id === selectedAgr.id) {
                return {
                    ...a,
                    nombre: formEdit.nombre.trim(),
                    apellidoPaterno: formEdit.apellidoPaterno.trim(),
                    apellidoMaterno: formEdit.apellidoMaterno.trim(),
                    estado: formEdit.estado
                };
            }
            return a;
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datosActualizados));
        setAgricultores(datosActualizados);
        cerrarModal();
    };

    // Exportar Agricultores a un archivo CSV compatible con Excel
    const exportarAExcel = () => {
        const headers = ["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Correo", "Estado", "Fecha Registro"];
        const rows = agricultores.map(a => [
            a.id,
            a.nombre,
            a.apellidoPaterno,
            a.apellidoMaterno,
            a.correo,
            a.estado,
            a.fechaRegistro
        ]);

        // Usamos delimitador punto y coma (;) y UTF-8 BOM para soporte total de acentos en Excel en español
        const csvContent = "\uFEFF" 
            + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_agricultores.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Cabecera */}
            <div className="admin-header">
                <h1>Gestión de Agricultores</h1>
                <span className="admin-badge">Control de Productores</span>
            </div>

            {/* Fichas Estadísticas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="admin-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Total de Agricultores
                    </h3>
                    <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {totalAgricultores}
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

            {/* Tabla de Agricultores */}
            <div className="admin-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ margin: 0 }}>Listado de Agricultores</h2>
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
                        {agricultores.map(a => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td style={{ fontWeight: '600' }}>{a.nombre}</td>
                                <td>{a.apellidoPaterno}</td>
                                <td>{a.apellidoMaterno}</td>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{a.correo}</td>
                                <td>
                                    <span className={`status-badge ${a.estado === 'Activo' ? 'active' : 'inactive'}`}>
                                        {a.estado}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="admin-btn admin-btn-secondary" 
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        onClick={() => abrirModal(a)}
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
            {modalOpen && selectedAgr && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Editar Agricultor: {selectedAgr.correo}</h3>
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

export default AdminFarmers;
