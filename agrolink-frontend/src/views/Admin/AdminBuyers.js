import React, { useState, useEffect } from 'react';
import {
    listarCompradores,
    toggleEstadoComprador,
    eliminarComprador,
    exportarCompradoresExcel,
} from '../../api/Admincompradorservice';

function AdminBuyers() {
    const [compradores, setCompradores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBuy, setSelectedBuy] = useState(null);
    const [formEdit, setFormEdit] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        estado: 'Activo'
    });

    useEffect(() => {
        const cargarDatos = async () => {
            const lista = await listarCompradores();
            setCompradores(lista);
        };
        cargarDatos();
    }, []);

    // Calculados directo del estado
    const obtenerFechaHoy = () => {
        const hoy = new Date();
        const offset = hoy.getTimezoneOffset();
        const hoyLocal = new Date(hoy.getTime() - offset * 60 * 1000);
        return hoyLocal.toISOString().split('T')[0];
    };

    const totalCompradores = compradores.length;
    const registradosHoy = compradores.filter(b => b.fechaRegistro === obtenerFechaHoy()).length;

    // --- MODAL ---
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

    const cerrarModal = () => {
        setModalOpen(false);
        setSelectedBuy(null);
    };

    // Guarda solo en estado local (edición de nombre/apellidos)
    const handleGuardarEdicion = (e) => {
        e.preventDefault();
        if (!formEdit.nombre.trim() || !formEdit.apellidoPaterno.trim() || !formEdit.apellidoMaterno.trim()) {
            alert("Todos los campos de nombres y apellidos son obligatorios.");
            return;
        }
        setCompradores(prev =>
            prev.map(b =>
                b.id === selectedBuy.id
                    ? {
                        ...b,
                        nombre: formEdit.nombre.trim(),
                        apellidoPaterno: formEdit.apellidoPaterno.trim(),
                        apellidoMaterno: formEdit.apellidoMaterno.trim(),
                        estado: formEdit.estado
                    }
                    : b
            )
        );
        cerrarModal();
    };

    // Toggle Activo/Inactivo llamando al backend
    const handleToggleEstado = async (b) => {
        try {
            await toggleEstadoComprador(b.id);
            setCompradores(prev =>
                prev.map(c =>
                    c.id === b.id
                        ? { ...c, estado: c.estado === 'Activo' ? 'Inactivo' : 'Activo' }
                        : c
                )
            );
        } catch (error) {
            alert("Error al cambiar el estado del comprador.");
            console.error(error);
        }
    };

    // Eliminar comprador llamando al backend
    const handleEliminar = async (b) => {
        if (!window.confirm(`¿Seguro que deseas eliminar a ${b.nombre}?`)) return;
        try {
            await eliminarComprador(b.id);
            setCompradores(prev => prev.filter(c => c.id !== b.id));
        } catch (error) {
            alert("Error al eliminar el comprador.");
            console.error(error);
        }
    };

    return (
        <div>
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

            {/* Tabla */}
            <div className="admin-table-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h2 style={{ margin: 0 }}>Listado de Compradores</h2>
                    <button
                        onClick={() => exportarCompradoresExcel(compradores)}
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
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="admin-btn admin-btn-secondary"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        onClick={() => abrirModal(b)}
                                    >
                                        Editar ✏️
                                    </button>
                                    <button
                                        className="admin-btn"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#F59E0B' }}
                                        onClick={() => handleToggleEstado(b)}
                                    >
                                        {b.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        onClick={() => handleEliminar(b)}
                                    >
                                        Eliminar 🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edición */}
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
                                <input id="edit-nombre" type="text" className="admin-input" value={formEdit.nombre}
                                    onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })} required />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-paterno">Apellido Paterno</label>
                                <input id="edit-paterno" type="text" className="admin-input" value={formEdit.apellidoPaterno}
                                    onChange={(e) => setFormEdit({ ...formEdit, apellidoPaterno: e.target.value })} required />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-materno">Apellido Materno</label>
                                <input id="edit-materno" type="text" className="admin-input" value={formEdit.apellidoMaterno}
                                    onChange={(e) => setFormEdit({ ...formEdit, apellidoMaterno: e.target.value })} required />
                            </div>
                            <div className="admin-form-group">
                                <label htmlFor="edit-estado">Estado de Cuenta</label>
                                <select id="edit-estado" className="admin-select" value={formEdit.estado}
                                    onChange={(e) => setFormEdit({ ...formEdit, estado: e.target.value })}>
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