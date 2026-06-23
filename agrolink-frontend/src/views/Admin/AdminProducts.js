import React, { useState, useEffect, useCallback } from 'react';
import { 
    listarProductosAdmin, 
    crearProducto, 
    actualizarProducto,
    eliminarProducto,
    crearVariedad, 
    actualizarVariedad,
    eliminarVariedad
} from '../../api/Adminproductoservice';

function AdminProducts() {
    const [productos, setProductos] = useState([]);
    
    const [formProd, setFormProd] = useState({ nombre: '', descripcion: '' });
    const [formVar, setFormVar] = useState({ productoId: '', nombre: '' });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);

    const [isEditingProd, setIsEditingProd] = useState(false);
    const [editProdFields, setEditProdFields] = useState({ nombre: '', descripcion: '' });

    const [editingVarId, setEditingVarId] = useState(null);
    const [editVarName, setEditVarName] = useState('');

    const [msgProd, setMsgProd] = useState({ type: '', text: '' });
    const [msgVar, setMsgVar] = useState({ type: '', text: '' });

    // Sin dependencias: no produce loop
    const cargarProductos = useCallback(async () => {
        try {
            const data = await listarProductosAdmin();
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }, []);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // Sincroniza selectedProd cuando cambia la lista (para reflejar ediciones en el modal)
    useEffect(() => {
        if (selectedProd) {
            const actualizado = productos.find(p => p.id === selectedProd.id);
            if (actualizado) setSelectedProd(actualizado);
        }
    }, [productos]);

    // --- CREAR PRODUCTO ---
    const handleCrearProducto = async (e) => {
        e.preventDefault();
        if (!formProd.nombre.trim()) {
            setMsgProd({ type: 'error', text: 'El nombre es obligatorio.' });
            return;
        }
        try {
            await crearProducto({ nombre: formProd.nombre, descripcion: formProd.descripcion });
            setFormProd({ nombre: '', descripcion: '' });
            setMsgProd({ type: 'success', text: '¡Producto creado con éxito!' });
            cargarProductos();
            setTimeout(() => setMsgProd({ type: '', text: '' }), 3000);
        } catch (error) {
            setMsgProd({ type: 'error', text: 'Error al crear el producto.' });
        }
    };

    // --- CREAR VARIANTE ---
    const handleCrearVariedad = async (e) => {
        e.preventDefault();
        if (!formVar.productoId) {
            setMsgVar({ type: 'error', text: 'Debe seleccionar un producto.' });
            return;
        }
        if (!formVar.nombre.trim()) {
            setMsgVar({ type: 'error', text: 'El nombre de la variante es obligatorio.' });
            return;
        }
        try {
            await crearVariedad(formVar.productoId, { nombre: formVar.nombre });
            setFormVar({ productoId: '', nombre: '' });
            setMsgVar({ type: 'success', text: '¡Variante agregada con éxito!' });
            cargarProductos();
            setTimeout(() => setMsgVar({ type: '', text: '' }), 3000);
        } catch (error) {
            setMsgVar({ type: 'error', text: 'Error al crear la variante.' });
        }
    };

    // --- MODAL ---
    const abrirModal = (producto) => {
        setSelectedProd(producto);
        setEditProdFields({ nombre: producto.nombre, descripcion: producto.descripcion });
        setIsEditingProd(false);
        setEditingVarId(null);
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setSelectedProd(null);
        setIsEditingProd(false);
        setEditingVarId(null);
    };

    // --- EDITAR PRODUCTO ---
    const handleGuardarProducto = async () => {
        if (!editProdFields.nombre.trim()) {
            alert('El nombre del producto no puede estar vacío');
            return;
        }
        try {
            await actualizarProducto(selectedProd.id, {
                nombre: editProdFields.nombre,
                descripcion: editProdFields.descripcion
            });
            setIsEditingProd(false);
            cargarProductos();
        } catch (error) {
            alert('Error al actualizar el producto');
        }
    };

    // --- CAMBIAR ESTADO (activo/inactivo) ---
    // El servicio de actualizarProducto solo acepta nombre y descripcion,
    // así que el toggle de estado se maneja optimísticamente en local
    const handleCambiarEstado = async (nuevoEstado) => {
        try {
            await actualizarProducto(selectedProd.id, {
                nombre: selectedProd.nombre,
                descripcion: selectedProd.descripcion,
                activo: nuevoEstado
            });
            cargarProductos();
        } catch (error) {
            alert('Error al cambiar el estado del producto');
        }
    };

    // --- ELIMINAR PRODUCTO ---
    const handleEliminarProducto = async () => {
        if (!window.confirm(`¿Seguro que deseas eliminar "${selectedProd.nombre}"? Esta acción no se puede deshacer.`)) return;
        try {
            await eliminarProducto(selectedProd.id);
            cerrarModal();
            cargarProductos();
        } catch (error) {
            alert('Error al eliminar el producto');
        }
    };

    // --- EDITAR VARIANTE ---
    const iniciarEdicionVariante = (variedad) => {
        setEditingVarId(variedad.id);
        setEditVarName(variedad.nombreProductosVariedad);
    };

    const handleGuardarVariedad = async (variedadId) => {
        if (!editVarName.trim()) {
            alert('El nombre de la variante no puede estar vacío');
            return;
        }
        try {
            await actualizarVariedad(selectedProd.id, variedadId, editVarName);
            setEditingVarId(null);
            cargarProductos();
        } catch (error) {
            alert('Error al actualizar la variante');
        }
    };

    // --- ELIMINAR VARIANTE ---
    const handleEliminarVariedad = async (variedadId, nombreVariedad) => {
        if (!window.confirm(`¿Eliminar la variante "${nombreVariedad}"?`)) return;
        try {
            await eliminarVariedad(variedadId);
            cargarProductos();
        } catch (error) {
            alert('Error al eliminar la variante');
        }
    };

    const productosActivos = productos.filter(p => p.activo);

    return (
        <div>
            <div className="admin-header">
                <h1>Gestión de Productos</h1>
                <span className="admin-badge">Productos y Variantes</span>
            </div>

            {/* Grid de Creación */}
            <div className="admin-creation-grid">
                {/* Crear Producto */}
                <div className="admin-card">
                    <h2>Crear Producto</h2>
                    <form onSubmit={handleCrearProducto}>
                        <div className="admin-form-group">
                            <label htmlFor="prod-nombre">Nombre del Producto</label>
                            <input
                                id="prod-nombre"
                                type="text"
                                className="admin-input"
                                placeholder="Ej. Zanahoria, Fresa"
                                value={formProd.nombre}
                                onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="prod-desc">Descripción</label>
                            <textarea
                                id="prod-desc"
                                className="admin-textarea"
                                placeholder="Añade una descripción sobre el producto"
                                value={formProd.descripcion}
                                onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="admin-btn">+ Crear Producto</button>
                        {msgProd.text && (
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                color: msgProd.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                {msgProd.text}
                            </div>
                        )}
                    </form>
                </div>

                {/* Crear Variante */}
                <div className="admin-card">
                    <h2>Crear Variante (Variedad)</h2>
                    <form onSubmit={handleCrearVariedad}>
                        <div className="admin-form-group">
                            <label htmlFor="var-producto">Producto Asociado</label>
                            <select
                                id="var-producto"
                                className="admin-select"
                                value={formVar.productoId}
                                onChange={(e) => setFormVar({ ...formVar, productoId: e.target.value })}
                            >
                                <option value="">Seleccione un producto...</option>
                                {productosActivos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="var-nombre">Nombre de la Variante</label>
                            <input
                                id="var-nombre"
                                type="text"
                                className="admin-input"
                                placeholder="Ej. Orgánica, Calibre Extra"
                                value={formVar.nombre}
                                onChange={(e) => setFormVar({ ...formVar, nombre: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="admin-btn admin-btn-secondary">+ Agregar Variante</button>
                        {msgVar.text && (
                            <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                color: msgVar.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)' }}>
                                {msgVar.text}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Tabla */}
            <div className="admin-table-container">
                <h2>Listado de Productos Registrados</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Cantidad Variantes</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td style={{ fontWeight: '600' }}>{p.nombre}</td>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{p.descripcion || 'Sin descripción'}</td>
                                <td>
                                    <span style={{ backgroundColor: '#ECEFF1', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                                        {p.variedades ? p.variedades.length : 0}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${p.activo ? 'active' : 'inactive'}`}>
                                        {p.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <button className="details-btn" title="Más detalles" onClick={() => abrirModal(p)}>
                                        🔍
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Split View */}
            {modalOpen && selectedProd && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h3>Detalles: {selectedProd.nombre}</h3>
                            <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
                        </header>

                        <div className="modal-split-body">
                            {/* Columna Izquierda: Datos del Producto */}
                            <div className="modal-col-left">
                                <div>
                                    <h4>Datos del Producto</h4>
                                    <div className="admin-form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={editProdFields.nombre}
                                            disabled={!isEditingProd}
                                            onChange={(e) => setEditProdFields({ ...editProdFields, nombre: e.target.value })}
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            className="admin-textarea"
                                            value={editProdFields.descripcion}
                                            disabled={!isEditingProd}
                                            onChange={(e) => setEditProdFields({ ...editProdFields, descripcion: e.target.value })}
                                        />
                                    </div>
                                    {isEditingProd ? (
                                        <button className="admin-btn admin-btn-success" style={{ width: '100%' }}
                                            onClick={handleGuardarProducto}>
                                            Guardar Cambios
                                        </button>
                                    ) : (
                                        <button className="admin-btn" style={{ width: '100%', backgroundColor: 'var(--color-primary)' }}
                                            onClick={() => setIsEditingProd(true)}>
                                            Editar Datos
                                        </button>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="product-status-actions" style={{ marginTop: '24px' }}>
                                    <span>Estado del Producto en Plataforma</span>
                                    <div className="status-buttons-row">
                                        <button
                                            className="admin-btn admin-btn-success"
                                            disabled={selectedProd.activo}
                                            style={{ opacity: selectedProd.activo ? 0.5 : 1 }}
                                            onClick={() => handleCambiarEstado(true)}
                                        >
                                            Activar
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-danger"
                                            disabled={!selectedProd.activo}
                                            style={{ opacity: !selectedProd.activo ? 0.5 : 1 }}
                                            onClick={() => handleCambiarEstado(false)}
                                        >
                                            Desactivar
                                        </button>
                                    </div>
                                </div>

                                {/* Eliminar Producto */}
                                <div style={{ marginTop: '16px' }}>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        style={{ width: '100%' }}
                                        onClick={handleEliminarProducto}
                                    >
                                        🗑️ Eliminar Producto
                                    </button>
                                </div>
                            </div>

                            {/* Columna Derecha: Variantes */}
                            <div className="modal-col-right" style={{ justifyContent: 'flex-start' }}>
                                <h4>Variantes del Producto</h4>
                                {selectedProd.variedades && selectedProd.variedades.length > 0 ? (
                                    <ul className="variants-list">
                                        {selectedProd.variedades.map(v => (
                                            <li key={v.id} className="variant-item">
                                                <input
                                                    type="text"
                                                    value={editingVarId === v.id ? editVarName : v.nombreProductosVariedad}
                                                    disabled={editingVarId !== v.id}
                                                    onChange={(e) => setEditVarName(e.target.value)}
                                                />
                                                {editingVarId === v.id ? (
                                                    <button
                                                        className="admin-btn admin-btn-success"
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => handleGuardarVariedad(v.id)}
                                                    >
                                                        Guardar
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="admin-btn"
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#78909C' }}
                                                        onClick={() => iniciarEdicionVariante(v)}
                                                    >
                                                        Editar
                                                    </button>
                                                )}
                                                <button
                                                    className="admin-btn admin-btn-danger"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                    onClick={() => handleEliminarVariedad(v.id, v.nombreProductosVariedad)}
                                                >
                                                    🗑️
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                        Este producto aún no cuenta con variantes registradas.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;