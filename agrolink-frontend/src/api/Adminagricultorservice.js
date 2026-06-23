import api from './axiosConfig';

// ─── ESTADÍSTICAS ─────────────────────────────────────────────

export const obtenerEstadisticasAgricultores = async () => {
    const response = await api.get('/api/admin/agricultores/estadisticas');
    return response.data; // { total, registradosHoy }
};

// ─── LISTADO ──────────────────────────────────────────────────

export const listarAgricultores = async () => {
    const response = await api.get('/api/admin/agricultores');
    return response.data.map(a => ({
        id: a.id,
        nombre: a.nombres,
        apellidoPaterno: a.apellidoPaterno,
        apellidoMaterno: a.apellidoMaterno,
        correo: a.email,
        estado: a.verificado ? 'Activo' : 'Inactivo',
        fechaRegistro: a.fechaRegistro ? a.fechaRegistro.split('T')[0] : ''
    }));
};

// ─── ACCIONES ─────────────────────────────────────────────────

export const toggleEstadoAgricultor = async (idUsuario) => {
    await api.patch(`/api/admin/usuarios/${idUsuario}/toggle-estado`);
};

export const eliminarAgricultor = async (idUsuario) => {
    await api.delete(`/api/admin/usuarios/${idUsuario}`);
};

// ─── EXPORTAR A EXCEL (CSV) ───────────────────────────────────

export const exportarAgricultoresExcel = (agricultores) => {
    const headers = ["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Correo", "Estado", "Fecha Registro"];
    const rows = agricultores.map(a => [
        a.id, a.nombre, a.apellidoPaterno, a.apellidoMaterno,
        a.correo, a.estado, a.fechaRegistro
    ]);
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