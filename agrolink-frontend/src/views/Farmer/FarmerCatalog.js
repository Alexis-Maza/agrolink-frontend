import React, { useState } from 'react';
import { initialCrops } from '../../data/mockFarmerData';

function FarmerCatalog() {
    // 1. Datos simulados (Mock Data) de productos/cultivos importados
    const [cropsData] = useState(initialCrops);

    // 2. Estados para el buscador y el modal
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [exportStatus, setExportStatus] = useState('idle'); // 'idle', 'exporting', 'success'
    const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'downloading', 'success'

    // 3. Filtrar datos según el buscador (por nombre o variedad)
    const filteredCrops = cropsData.filter(crop => 
        crop.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        crop.lote.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 4. Función con feedback visual para exportar
    const handleExport = () => {
        if (exportStatus !== 'idle') return;
        setExportStatus('exporting');
        
        // Simulamos el tiempo de generación del archivo Excel
        setTimeout(() => {
            setExportStatus('success');
            setTimeout(() => setExportStatus('idle'), 3000);
        }, 1500);
    };

    // 5. Función con feedback visual para descargar ficha
    const handleDownload = () => {
        if (downloadStatus !== 'idle') return;
        setDownloadStatus('downloading');
        
        // Simulamos el proceso de descarga del PDF
        setTimeout(() => {
            setDownloadStatus('success');
            setTimeout(() => setDownloadStatus('idle'), 3000);
        }, 1500);
    };

    // Función auxiliar para formatear la fecha
    const formatDate = (dateStr) => {
        if (!dateStr) return '---';
        const parts = dateStr.split('-');
        if(parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    return (
        <div style={{ position: 'relative' }}>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>
                Catálogo Histórico de Productos
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Historial completo de todos los productos y cultivos que has registrado en la plataforma.
            </p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                
                {/* BARRA SUPERIOR: Buscador y Botón de Exportar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                    
                    {/* Buscador */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre de producto o lote..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                width: '100%', 
                                maxWidth: '400px',
                                padding: '12px 15px', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid #ccc', 
                                fontSize: '1rem' 
                            }} 
                        />
                    </div>

                    {/* Botón Exportar */}
                    <button onClick={handleExport} disabled={exportStatus !== 'idle'} style={{
                        backgroundColor: exportStatus === 'success' ? '#D4EDDA' : '#E8F5E9',
                        color: exportStatus === 'success' ? '#155724' : 'var(--color-primary)',
                        border: `1px solid ${exportStatus === 'success' ? '#c3e6cb' : 'var(--color-primary)'}`,
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        cursor: exportStatus !== 'idle' ? 'default' : 'pointer',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: exportStatus === 'idle' ? '0 2px 4px rgba(46,125,50,0.1)' : 'none'
                    }}>
                        {exportStatus === 'idle' && '📊 Exportar catálogo'}
                        {exportStatus === 'exporting' && '⏳ Generando Excel...'}
                        {exportStatus === 'success' && '✅ Excel Descargado'}
                    </button>
                </div>

                {/* TABLA DE PRODUCTOS */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>ID</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Producto</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Variedad</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Lote</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Cantidad Total</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCrops.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                        No se encontraron productos que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredCrops.map((crop) => (
                                    <tr key={crop.id} style={{ borderBottom: '1px solid #eee', transition: '0.2s' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{crop.id}</td>
                                        <td style={{ padding: '15px', color: '#333' }}>
                                            {crop.nombre}
                                            {crop.incidencia && <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#d32f2f' }}>⚠️</span>}
                                        </td>
                                        <td style={{ padding: '15px', color: '#555' }}>{crop.variedad || 'N/A'}</td>
                                        <td style={{ padding: '15px', color: '#555' }}>{crop.lote}</td>
                                        <td style={{ padding: '15px', color: '#555' }}>{crop.cantidadTotal}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => setSelectedCrop(crop)}
                                                style={{
                                                    backgroundColor: 'var(--color-primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 15px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                Ver más detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* MODAL FLOTANTE (Se muestra solo si hay un cultivo seleccionado) */}
            {selectedCrop && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '40px',
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        {/* Botón de cerrar modal */}
                        <button 
                            onClick={() => setSelectedCrop(null)}
                            style={{
                                position: 'absolute', top: '15px', right: '20px',
                                background: 'transparent', border: 'none',
                                fontSize: '1.8rem', color: '#888', cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        
                        <div style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {selectedCrop.imagen && (
                                <img src={selectedCrop.imagen} alt={selectedCrop.nombre} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} />
                            )}
                            <div>
                                <h3 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.8rem' }}>
                                    {selectedCrop.nombre}
                                </h3>
                                <span style={{ color: '#777', fontSize: '1rem', fontWeight: 'bold' }}>ID: {selectedCrop.id}</span>
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            
                            {/* Columna Izquierda: Info Básica y Producción */}
                            <div>
                                <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '15px' }}>Información Básica</h4>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Variedad:</strong> <span style={{ color: '#333' }}>{selectedCrop.variedad || 'N/A'}</span></p>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Código de Lote:</strong> <span style={{ color: '#333' }}>{selectedCrop.lote}</span></p>

                                <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '15px', marginTop: '25px' }}>Producción y Cosecha</h4>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Área Sembrada:</strong> <span style={{ color: '#333' }}>{selectedCrop.hectareas} Hectáreas</span></p>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Cantidad Total Estimada:</strong> <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{selectedCrop.cantidadTotal}</span></p>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Cantidad Disponible:</strong> <span style={{ color: '#333' }}>{selectedCrop.cantidadDisponible}</span></p>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Fecha de Siembra:</strong> <span style={{ color: '#333' }}>{formatDate(selectedCrop.fechaSiembra)}</span></p>
                            </div>

                            {/* Columna Derecha: Comercialización y Etapas */}
                            <div>
                                <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '15px' }}>Comercialización</h4>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Precio Base Unitario:</strong> <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '1.2rem' }}>S/ {selectedCrop.precio}</span></p>
                                <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Venta Mínima Permitida:</strong> <span style={{ color: '#333' }}>{selectedCrop.minimoVenta}</span></p>

                                <h4 style={{ color: 'var(--color-secondary)', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '15px', marginTop: '25px' }}>Ciclo de Vida (Días)</h4>
                                <div style={{ backgroundColor: '#F8F9FA', padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid #eee' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                                        <div><strong style={{ color: '#666' }}>Germinación:</strong> {selectedCrop.etapas?.germinacion || 0}</div>
                                        <div><strong style={{ color: '#666' }}>Crecimiento:</strong> {selectedCrop.etapas?.crecimiento || 0}</div>
                                        <div><strong style={{ color: '#666' }}>Floración:</strong> {selectedCrop.etapas?.floracion || 0}</div>
                                        <div><strong style={{ color: '#666' }}>Maduración:</strong> {selectedCrop.etapas?.maduracion || 0}</div>
                                    </div>
                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                        Total: {
                                            (parseInt(selectedCrop.etapas?.germinacion) || 0) + 
                                            (parseInt(selectedCrop.etapas?.crecimiento) || 0) + 
                                            (parseInt(selectedCrop.etapas?.floracion) || 0) + 
                                            (parseInt(selectedCrop.etapas?.maduracion) || 0)
                                        } días
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alerta si hay incidencia */}
                        {selectedCrop.incidencia && (
                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#FFEBEE', border: '1px solid #ffcdd2', borderRadius: 'var(--radius-md)', color: '#d32f2f', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>⚠️</span>
                                Este producto tiene una incidencia reportada (clima, plaga, u otro problema).
                            </div>
                        )}

                        {/* Botones de acción del Modal */}
                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button onClick={handleDownload} disabled={downloadStatus !== 'idle'} style={{
                                backgroundColor: downloadStatus === 'success' ? '#D4EDDA' : 'transparent',
                                color: downloadStatus === 'success' ? '#155724' : 'var(--color-primary)',
                                border: `1px solid ${downloadStatus === 'success' ? '#c3e6cb' : 'var(--color-primary)'}`,
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-md)',
                                cursor: downloadStatus !== 'idle' ? 'default' : 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}>
                                {downloadStatus === 'idle' && '📥 Descargar Ficha Técnica'}
                                {downloadStatus === 'downloading' && '⏳ Descargando...'}
                                {downloadStatus === 'success' && '✅ Ficha Descargada'}
                            </button>
                            <button onClick={() => setSelectedCrop(null)} style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
                            }}>
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
