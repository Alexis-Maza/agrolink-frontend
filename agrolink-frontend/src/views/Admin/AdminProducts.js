import React, { useState, useEffect, useCallback } from "react";
import {
  listarProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  crearVariedad,
  actualizarVariedad,
  toggleEstadoVariedad, // ← agregado, eliminarVariedad ya no se usa
} from "../../api/Adminproductoservice";

function AdminProducts() {
  const [productos, setProductos] = useState([]);

  const [formProd, setFormProd] = useState({ nombre: "", descripcion: "" });
  const [formVar, setFormVar] = useState({ productoId: "", nombre: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);

  const [isEditingProd, setIsEditingProd] = useState(false);
  const [editProdFields, setEditProdFields] = useState({ nombre: "", descripcion: "" });

  const [editingVarId, setEditingVarId] = useState(null);
  const [editVarName, setEditVarName] = useState("");

  const [msgProd, setMsgProd] = useState({ type: "", text: "" });
  const [msgVar, setMsgVar] = useState({ type: "", text: "" });

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

  useEffect(() => {
    if (selectedProd) {
      const actualizado = productos.find((p) => p.id === selectedProd.id);
      if (actualizado) setSelectedProd(actualizado);
    }
  }, [productos]);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    if (!formProd.nombre.trim()) {
      setMsgProd({ type: "error", text: "El nombre es obligatorio." });
      return;
    }
    try {
      await crearProducto({ nombre: formProd.nombre, descripcion: formProd.descripcion });
      setFormProd({ nombre: "", descripcion: "" });
      setMsgProd({ type: "success", text: "¡Producto creado con éxito!" });
      cargarProductos();
      setTimeout(() => setMsgProd({ type: "", text: "" }), 3000);
    } catch (error) {
      setMsgProd({ type: "error", text: "Error al crear el producto." });
    }
  };

  const handleCrearVariedad = async (e) => {
    e.preventDefault();
    if (!formVar.productoId) {
      setMsgVar({ type: "error", text: "Debe seleccionar un producto." });
      return;
    }
    if (!formVar.nombre.trim()) {
      setMsgVar({ type: "error", text: "El nombre de la variante es obligatorio." });
      return;
    }
    try {
      await crearVariedad(formVar.productoId, { nombre: formVar.nombre });
      setFormVar({ productoId: "", nombre: "" });
      setMsgVar({ type: "success", text: "¡Variante agregada con éxito!" });
      cargarProductos();
      setTimeout(() => setMsgVar({ type: "", text: "" }), 3000);
    } catch (error) {
      setMsgVar({ type: "error", text: "Error al crear la variante." });
    }
  };

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

  const handleGuardarProducto = async () => {
    if (!editProdFields.nombre.trim()) {
      alert("El nombre del producto no puede estar vacío");
      return;
    }
    try {
      await actualizarProducto(selectedProd.id, {
        nombre: editProdFields.nombre,
        descripcion: editProdFields.descripcion,
      });
      setIsEditingProd(false);
      cargarProductos();
    } catch (error) {
      alert("Error al actualizar el producto");
    }
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      await actualizarProducto(selectedProd.id, {
        nombre: selectedProd.nombre,
        descripcion: selectedProd.descripcion,
        activo: nuevoEstado,
      });
      cargarProductos();
    } catch (error) {
      alert("Error al cambiar el estado del producto");
    }
  };

  const handleEliminarProducto = async () => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${selectedProd.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarProducto(selectedProd.id);
      cerrarModal();
      cargarProductos();
    } catch (error) {
      alert("Error al eliminar el producto");
    }
  };

  const iniciarEdicionVariante = (variedad) => {
    setEditingVarId(variedad.id);
    setEditVarName(variedad.nombreProductosVariedad);
  };

  const handleGuardarVariedad = async (variedadId) => {
    if (!editVarName.trim()) {
      alert("El nombre de la variante no puede estar vacío");
      return;
    }
    try {
      await actualizarVariedad(selectedProd.id, variedadId, editVarName);
      setEditingVarId(null);
      cargarProductos();
    } catch (error) {
      alert("Error al actualizar la variante");
    }
  };

  // ← reemplaza handleEliminarVariedad por esto
  const handleToggleVariedad = async (v) => {
    const accion = v.activo ? "desactivar" : "activar";
    if (!window.confirm(`¿Seguro que deseas ${accion} la variante "${v.nombreProductosVariedad}"?`)) return;
    try {
      await toggleEstadoVariedad(v.id);
      cargarProductos();
    } catch (error) {
      alert("Error al cambiar el estado de la variante");
    }
  };

  const productosActivos = productos.filter((p) => p.activo);

  return (
    <div>
      <div className="admin-header">
        <h1>Gestión de Productos</h1>
        <span className="admin-badge">Productos y Variantes</span>
      </div>

      <div className="admin-creation-grid">
        <div className="admin-card">
          <h2>Crear Producto</h2>
          <form onSubmit={handleCrearProducto}>
            <div className="admin-form-group">
              <label htmlFor="prod-nombre">Nombre del Producto</label>
              <input id="prod-nombre" type="text" className="admin-input"
                placeholder="Ej. Zanahoria, Fresa" value={formProd.nombre}
                onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="prod-desc">Descripción</label>
              <textarea id="prod-desc" className="admin-textarea"
                placeholder="Añade una descripción sobre el producto" value={formProd.descripcion}
                onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })} />
            </div>
            <button type="submit" className="admin-btn">+ Crear Producto</button>
            {msgProd.text && (
              <div style={{ marginTop: "12px", fontSize: "0.85rem", fontWeight: "bold",
                color: msgProd.type === "error" ? "var(--color-danger)" : "var(--color-success)" }}>
                {msgProd.text}
              </div>
            )}
          </form>
        </div>

        <div className="admin-card">
          <h2>Crear Variante (Variedad)</h2>
          <form onSubmit={handleCrearVariedad}>
            <div className="admin-form-group">
              <label htmlFor="var-producto">Producto Asociado</label>
              <select id="var-producto" className="admin-select" value={formVar.productoId}
                onChange={(e) => setFormVar({ ...formVar, productoId: e.target.value })}>
                <option value="">Seleccione un producto...</option>
                {productosActivos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="var-nombre">Nombre de la Variante</label>
              <input id="var-nombre" type="text" className="admin-input"
                placeholder="Ej. Orgánica, Calibre Extra" value={formVar.nombre}
                onChange={(e) => setFormVar({ ...formVar, nombre: e.target.value })} />
            </div>
            <button type="submit" className="admin-btn admin-btn-secondary">+ Agregar Variante</button>
            {msgVar.text && (
              <div style={{ marginTop: "12px", fontSize: "0.85rem", fontWeight: "bold",
                color: msgVar.type === "error" ? "var(--color-danger)" : "var(--color-success)" }}>
                {msgVar.text}
              </div>
            )}
          </form>
        </div>
      </div>

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
            {productos.map((p) => (
              <tr key={p.id}>
                <td data-label="ID">{p.id}</td>
                <td data-label="Nombre" style={{ fontWeight: "600" }}>{p.nombre}</td>
                <td data-label="Descripción" style={{ color: "var(--color-text-secondary)" }}>{p.descripcion || "Sin descripción"}</td>
                <td data-label="Cantidad Variantes">
                  <span style={{ backgroundColor: "#ECEFF1", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                    {p.variedades ? p.variedades.length : 0}
                  </span>
                </td>
                <td data-label="Estado">
                  <span className={`status-badge ${p.activo ? "active" : "inactive"}`}>
                    {p.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td data-label="Acciones">
                  <button className="details-btn" title="Más detalles" onClick={() => abrirModal(p)}>
                    🔍 Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedProd && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Detalles: {selectedProd.nombre}</h3>
              <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
            </header>

            <div className="modal-split-body">
              <div className="modal-col-left">
                <div>
                  <h4>Datos del Producto</h4>
                  <div className="admin-form-group">
                    <label>Nombre</label>
                    <input type="text" className="admin-input" value={editProdFields.nombre}
                      disabled={!isEditingProd}
                      onChange={(e) => setEditProdFields({ ...editProdFields, nombre: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label>Descripción</label>
                    <textarea className="admin-textarea" value={editProdFields.descripcion}
                      disabled={!isEditingProd}
                      onChange={(e) => setEditProdFields({ ...editProdFields, descripcion: e.target.value })} />
                  </div>
                  {isEditingProd ? (
                    <button className="admin-btn admin-btn-success" style={{ width: "100%" }}
                      onClick={handleGuardarProducto}>
                      Guardar Cambios
                    </button>
                  ) : (
                    <button className="admin-btn" style={{ width: "100%", backgroundColor: "var(--color-primary)" }}
                      onClick={() => setIsEditingProd(true)}>
                      Editar Datos
                    </button>
                  )}
                </div>

                <div className="product-status-actions" style={{ marginTop: "24px" }}>
                  <span>Estado del Producto en Plataforma</span>
                  <div className="status-buttons-row">
                    <button className="admin-btn admin-btn-success"
                      disabled={selectedProd.activo} style={{ opacity: selectedProd.activo ? 0.5 : 1 }}
                      onClick={() => handleCambiarEstado(true)}>
                      Activar
                    </button>
                    <button className="admin-btn admin-btn-danger"
                      disabled={!selectedProd.activo} style={{ opacity: !selectedProd.activo ? 0.5 : 1 }}
                      onClick={() => handleCambiarEstado(false)}>
                      Desactivar
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <button className="admin-btn admin-btn-danger" style={{ width: "100%" }}
                    onClick={handleEliminarProducto}>
                    🗑️ Eliminar Producto
                  </button>
                </div>
              </div>

              {/* Columna Derecha: Variantes */}
              <div className="modal-col-right" style={{ justifyContent: "flex-start" }}>
                <h4>Variantes del Producto</h4>
                {selectedProd.variedades && selectedProd.variedades.length > 0 ? (
                  <ul className="variants-list">
                    {selectedProd.variedades.map((v) => (
                      <li key={v.id} className="variant-item">
                        <input
                          type="text"
                          value={editingVarId === v.id ? editVarName : v.nombreProductosVariedad}
                          disabled={editingVarId !== v.id}
                          onChange={(e) => setEditVarName(e.target.value)}
                        />
                        {editingVarId === v.id ? (
                          <button className="admin-btn admin-btn-success"
                            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                            onClick={() => handleGuardarVariedad(v.id)}>
                            Guardar
                          </button>
                        ) : (
                          <button className="admin-btn"
                            style={{ padding: "6px 12px", fontSize: "0.8rem", backgroundColor: "#78909C" }}
                            onClick={() => iniciarEdicionVariante(v)}>
                            Editar
                          </button>
                        )}
                        {/* ← reemplaza el botón 🗑️ por este toggle */}
                        <button
                          className={`admin-btn ${v.activo ? "admin-btn-danger" : "admin-btn-success"}`}
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                          onClick={() => handleToggleVariedad(v)}
                        >
                          {v.activo ? "Desactivar" : "Activar"}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
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