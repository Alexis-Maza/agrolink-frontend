import React, { useState, useEffect } from "react";
import {
  listarAgricultores,
  obtenerEstadisticasAgricultores,
  exportarAgricultoresExcel,
} from "../../api/Adminagricultorservice";

function AdminFarmers() {
  const [agricultores, setAgricultores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgr, setSelectedAgr] = useState(null);
  const [formEdit, setFormEdit] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    estado: "Activo",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const lista = await listarAgricultores();
      setAgricultores(lista);
    };
    cargarDatos();
  }, []);

  // Calculados directamente del estado, sin useState adicionales
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset();
    const hoyLocal = new Date(hoy.getTime() - offset * 60 * 1000);
    return hoyLocal.toISOString().split("T")[0];
  };

  const totalAgricultores = agricultores.length;
  const registradosHoy = agricultores.filter(
    (a) => a.fechaRegistro === obtenerFechaHoy()
  ).length;

  const abrirModal = (agr) => {
    setSelectedAgr(agr);
    setFormEdit({
      nombre: agr.nombre || "",
      apellidoPaterno: agr.apellidoPaterno || "",
      apellidoMaterno: agr.apellidoMaterno || "",
      estado: agr.estado || "Activo",
    });
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedAgr(null);
  };

  // Actualiza solo en el estado local (sin localStorage)
  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    if (
      !formEdit.nombre.trim() ||
      !formEdit.apellidoPaterno.trim() ||
      !formEdit.apellidoMaterno.trim()
    ) {
      alert("Todos los campos de nombres y apellidos son obligatorios.");
      return;
    }

    const datosActualizados = agricultores.map((a) =>
      a.id === selectedAgr.id
        ? {
            ...a,
            nombre: formEdit.nombre.trim(),
            apellidoPaterno: formEdit.apellidoPaterno.trim(),
            apellidoMaterno: formEdit.apellidoMaterno.trim(),
            estado: formEdit.estado,
          }
        : a
    );

    setAgricultores(datosActualizados);
    cerrarModal();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Gestión de Agricultores</h1>
        <span className="admin-badge">Control de Productores</span>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total de Agricultores
          </h3>
          <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: "var(--color-primary)" }}>
            {totalAgricultores}
          </p>
        </div>
        <div className="admin-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Registrados el Día de Hoy
          </h3>
          <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: "var(--color-success)" }}>
            {registradosHoy}
          </p>
        </div>
      </div>

      <div className="admin-table-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ margin: 0 }}>Listado de Agricultores</h2>
          <button
            onClick={() => exportarAgricultoresExcel(agricultores)}
            className="admin-btn"
            style={{ backgroundColor: "#10B981", display: "inline-flex", alignItems: "center", gap: "8px" }}
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
            {agricultores.map((a) => (
              <tr key={a.id}>
                <td data-label="ID">{a.id}</td>
                <td data-label="Nombre" style={{ fontWeight: "600" }}>{a.nombre}</td>
                <td data-label="Apellido Paterno">{a.apellidoPaterno}</td>
                <td data-label="Apellido Materno">{a.apellidoMaterno}</td>
                <td data-label="Correo Electrónico" style={{ color: "var(--color-text-secondary)" }}>{a.correo}</td>
                <td data-label="Estado">
                  <span className={`status-badge ${a.estado === "Activo" ? "active" : "inactive"}`}>
                    {a.estado}
                  </span>
                </td>
                <td data-label="Acciones" className="admin-actions-cell">
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "0.8rem" }}
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

      {modalOpen && selectedAgr && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-container" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Editar Agricultor: {selectedAgr.correo}</h3>
              <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
            </header>

            <form onSubmit={handleGuardarEdicion} style={{ padding: "24px" }}>
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
              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="submit" className="admin-btn admin-btn-success" style={{ flex: 1 }}>Guardar Cambios</button>
                <button type="button" className="admin-btn admin-btn-danger" style={{ flex: 1 }} onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFarmers;