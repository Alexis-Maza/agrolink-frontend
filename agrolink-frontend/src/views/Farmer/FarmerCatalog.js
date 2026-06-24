import React, { useState, useEffect } from 'react';
import { obtenerCatalogo } from '../../api/agricultorService';

const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const estadoBadge = (estado) => {
    if (!estado) return { bg: '#f5f5f5', color: '#888' };
    const e = estado.toLowerCase();
    if (e.includes('listo') || e.includes('cosech'))
        return { bg: '#e8f5e9', color: '#2E7D32' };
    if (e.includes('crecimiento'))
        return { bg: '#fff8e1', color: '#F57F17' };
    return { bg: '#e3f2fd', color: '#1565C0' };
};

function FarmerCatalog() {
    const [catalogo, setCatalogo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCultivo, setSelectedCultivo] = useState(null);

    useEffect(() => {
        cargarCatalogo();
    }, []);

    const cargarCatalogo = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await obtenerCatalogo();
            setCatalogo(data);
        } catch {
            setError('No se pudo cargar el catálogo. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    // Aplanar productos > variedades > cultivos en una lista de filas para la tabla
    const filas = catalogo.flatMap(producto =>
        producto.variedades.flatMap(variedad =>
            variedad.cultivos.map(cultivo => ({
                ...cultivo,
                nombreProducto: producto.nombreProducto,
                nombreVariedad: variedad.nombreVariedad,
            }))
        )
    );

    const filasFiltradas = filas.filter(f =>
        f.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.nombreVariedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.lote || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading)
        return (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                ⏳ Cargando catálogo...
            </div>
        );

    if (error)
        return (
            <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>
                <button onClick={cargarCatalogo} style={{
                    marginTop: '15px', padding: '10px 20px',
                    backgroundColor: 'var(--color-primary)', color: 'white',
                    border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 'bold'
                }}>
                    🔄 Reintentar
                </button>
            </div>
        );

    return (
        <div style={{ position: 'relative' }}>
            <h2 style={{
                color: 'var(--color-primary)', fontFamily: 'var(--font-titles)',
                marginBottom: '10px', fontSize: '2rem'
            }}>
                Catálogo Histórico de Productos
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Historial completo de todos tus cultivos registrados en la plataforma.
            </p>

            <div className="farmer-catalog-card">

                {/* BARRA SUPERIOR */}
                <div className="farmer-catalog-actions-bar">
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por producto, variedad o lote..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', maxWidth: '400px',
                                padding: '12px 15px', borderRadius: 'var(--radius-md)',
                                border: '1px solid #ccc', fontSize: '1rem'
                            }}
                        />
                    </div>
                    <span style={{ color: '#888', fontSize: '0.95rem', alignSelf: 'center' }}>
                        {filasFiltradas.length} cultivo(s) encontrado(s)
                    </span>
                </div>

                {/* TABLA */}
                <div className="farmer-catalog-table-wrapper">
                    <table className="farmer-catalog-table">
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                {['ID', 'Producto', 'Variedad', 'Lote', 'Estado', 'Cant. Estimada', 'Disponible', 'Acciones'].map(h => (
                                    <th key={h} style={{ color: '#555', fontWeight: 'bold' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filasFiltradas.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{
                                        padding: '30px', textAlign: 'center', color: '#888'
                                    }}>
                                        No se encontraron cultivos.
                                    </td>
                                </tr>
                            ) : (
                                filasFiltradas.map((fila) => {
                                    const { bg, color } = estadoBadge(fila.estadoCultivo);
                                    return (
                                        <tr key={fila.id} style={{
                                            borderBottom: '1px solid #eee', transition: '0.2s'
                                        }}>
                                            <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                                #{fila.id}
                                            </td>
                                            <td style={{ color: '#333', fontWeight: '500' }}>
                                                {fila.nombreProducto}
                                            </td>
                                            <td style={{ color: '#555' }}>{fila.nombreVariedad}</td>
                                            <td style={{ color: '#555' }}>{fila.lote || '---'}</td>
                                            <td>
                                                <span style={{
                                                    backgroundColor: bg, color,
                                                    padding: '3px 10px', borderRadius: '20px',
                                                    fontSize: '0.8rem', fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {fila.estadoCultivo || '---'}
                                                </span>
                                            </td>
                                            <td style={{ color: '#555' }}>
                                                {fila.cantidadEstimada} {fila.unidad}
                                            </td>
                                            <td style={{
                                                color: fila.cantidadDisponible > 0
                                                    ? 'var(--color-primary)' : '#d32f2f',
                                                fontWeight: 'bold'
                                            }}>
                                                {fila.cantidadDisponible} {fila.unidad}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setSelectedCultivo(fila)}
                                                    style={{
                                                        backgroundColor: 'var(--color-primary)',
                                                        color: 'white', border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        cursor: 'pointer', fontWeight: 'bold',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    Ver detalle
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE DETALLE */}
            {selectedCultivo && (
                <div className="farmer-modal-overlay">
                    <div className="farmer-catalog-modal">
                        <button
                            onClick={() => setSelectedCultivo(null)}
                            style={{
                                position: 'absolute', top: '15px', right: '20px',
                                background: 'transparent', border: 'none',
                                fontSize: '1.8rem', color: '#888', cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>

                        <div className="farmer-catalog-modal-header">
                            <div style={{
                                width: '70px', height: '70px', borderRadius: '50%',
                                backgroundColor: '#e8f5e9', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', flexShrink: 0
                            }}>
                                🌿
                            </div>
                            <div>
                                <h3 style={{
                                    color: 'var(--color-primary)', margin: '0 0 4px 0',
                                    fontSize: '1.8rem'
                                }}>
                                    {selectedCultivo.nombreProducto}
                                </h3>
                                <span style={{ color: '#777', fontSize: '1rem' }}>
                                    Variedad: <strong>{selectedCultivo.nombreVariedad}</strong>
                                    &nbsp;·&nbsp; ID Cultivo: <strong>#{selectedCultivo.id}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="farmer-catalog-modal-grid">
                            {/* COLUMNA IZQUIERDA */}
                            <div>
                                <h4 style={{
                                    color: 'var(--color-secondary)',
                                    borderBottom: '1px dashed #ccc',
                                    paddingBottom: '5px', marginBottom: '15px'
                                }}>
                                    Información Básica
                                </h4>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Código de Lote:</strong>{' '}
                                    <span style={{ color: '#333' }}>{selectedCultivo.lote || '---'}</span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Estado:</strong>{' '}
                                    <span style={{
                                        ...estadoBadge(selectedCultivo.estadoCultivo),
                                        padding: '2px 10px', borderRadius: '20px',
                                        fontSize: '0.85rem', fontWeight: 'bold'
                                    }}>
                                        {selectedCultivo.estadoCultivo || '---'}
                                    </span>
                                </p>

                                <h4 style={{
                                    color: 'var(--color-secondary)',
                                    borderBottom: '1px dashed #ccc',
                                    paddingBottom: '5px', marginBottom: '15px', marginTop: '25px'
                                }}>
                                    Producción y Cosecha
                                </h4>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Área Sembrada:</strong>{' '}
                                    <span style={{ color: '#333' }}>{selectedCultivo.areaSembrada} ha</span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Cantidad Estimada:</strong>{' '}
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        {selectedCultivo.cantidadEstimada} {selectedCultivo.unidad}
                                    </span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Cantidad Disponible:</strong>{' '}
                                    <span style={{
                                        color: selectedCultivo.cantidadDisponible > 0
                                            ? 'var(--color-primary)' : '#d32f2f',
                                        fontWeight: 'bold'
                                    }}>
                                        {selectedCultivo.cantidadDisponible} {selectedCultivo.unidad}
                                    </span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Fecha de Siembra:</strong>{' '}
                                    <span style={{ color: '#333' }}>{formatDate(selectedCultivo.fechaSiembra)}</span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Cosecha Estimada:</strong>{' '}
                                    <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                        {formatDate(selectedCultivo.fechaCosechaEstimada)}
                                    </span>
                                </p>
                            </div>

                            {/* COLUMNA DERECHA */}
                            <div>
                                <h4 style={{
                                    color: 'var(--color-secondary)',
                                    borderBottom: '1px dashed #ccc',
                                    paddingBottom: '5px', marginBottom: '15px'
                                }}>
                                    Comercialización
                                </h4>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Precio por Kg:</strong>{' '}
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        S/ {selectedCultivo.precio?.toFixed(2)}
                                    </span>
                                </p>
                                <p style={{ margin: '0 0 10px 0' }}>
                                    <strong style={{ color: '#555' }}>Valor Total del Lote:</strong>{' '}
                                    <span style={{ color: '#2E7D32', fontWeight: 'bold' }}>
                                        S/ {(
                                            (selectedCultivo.precio || 0) *
                                            (selectedCultivo.cantidadEstimada || 0)
                                        ).toLocaleString('es-PE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </span>
                                </p>

                                <h4 style={{
                                    color: 'var(--color-secondary)',
                                    borderBottom: '1px dashed #ccc',
                                    paddingBottom: '5px', marginBottom: '15px', marginTop: '25px'
                                }}>
                                    Ciclo de Vida
                                </h4>
                                <div style={{
                                    backgroundColor: '#F8F9FA', padding: '15px',
                                    borderRadius: 'var(--radius-sm)', border: '1px solid #eee'
                                }}>
                                    <div className="farmer-catalog-lifecycle-grid">
                                        <div>
                                            <strong style={{ color: '#666' }}>Siembra:</strong>{' '}
                                            {formatDate(selectedCultivo.fechaSiembra)}
                                        </div>
                                        <div>
                                            <strong style={{ color: '#666' }}>Cosecha est.:</strong>{' '}
                                            {formatDate(selectedCultivo.fechaCosechaEstimada)}
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '10px', paddingTop: '10px',
                                        borderTop: '1px solid #ddd',
                                        fontSize: '0.9rem', color: '#666'
                                    }}>
                                        Área: <strong>{selectedCultivo.areaSembrada} ha</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="farmer-catalog-modal-actions">
                            <button
                                onClick={() => setSelectedCultivo(null)}
                                style={{
                                    backgroundColor: 'var(--color-primary)', color: 'white',
                                    border: 'none', padding: '10px 20px',
                                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FarmerCatalog;