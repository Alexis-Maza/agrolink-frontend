import api from './axiosConfig';

// ─── ESTADÍSTICAS ─────────────────────────────────────────────

export const obtenerEstadisticasCompradores = async () => {
    const response = await api.get('/api/admin/compradores/estadisticas');
    return response.data; // { total, registradosHoy }
};

// ─── LISTADO ──────────────────────────────────────────────────

export const listarCompradores = async () => {
    const response = await api.get('/api/admin/compradores');
    return response.data.map(c => ({
        id: c.id,
        nombre: c.nombres,
        apellidoPaterno: c.apellidoPaterno,
        apellidoMaterno: c.apellidoMaterno,
        correo: c.email,
        estado: c.verificado ? 'Activo' : 'Inactivo',
        fechaRegistro: c.fechaRegistro ? c.fechaRegistro.split('T')[0] : ''
    }));
};

// ─── ACCIONES ─────────────────────────────────────────────────

export const toggleEstadoComprador = async (idUsuario) => {
    await api.patch(`/api/admin/usuarios/${idUsuario}/toggle-estado`);
};

export const eliminarComprador = async (idUsuario) => {
    await api.delete(`/api/admin/usuarios/${idUsuario}`);
};

// ─── EXPORTAR A EXCEL (CSV) ───────────────────────────────────

export const exportarCompradoresExcel = (compradores) => {
    const headers = ["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Correo", "Estado", "Fecha Registro"];
    const rows = compradores.map(c => [
        c.id, c.nombre, c.apellidoPaterno, c.apellidoMaterno,
        c.correo, c.estado, c.fechaRegistro
    ]);
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