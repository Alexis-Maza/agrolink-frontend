import React, { useState } from 'react';
import { initialSales } from '../../data/mockFarmerData';

function FarmerSales() {
    // 1. Datos simulados (Mock Data) de ventas importados
    const [salesData] = useState(initialSales);

    // 2. Estados para el buscador y el modal
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [exportStatus, setExportStatus] = useState('idle'); // 'idle', 'exporting', 'success'
    const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'downloading', 'success'

    // 3. Filtrar datos según el buscador (por producto o por empresa)
    const filteredSales = salesData.filter(sale => 
        sale.producto.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sale.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 4. Función con feedback visual para exportar
    const handleExport = () => {
        if (exportStatus !== 'idle') return;
        setExportStatus('exporting');
        
        // Simulamos el tiempo de generación del archivo Excel
        setTimeout(() => {
            setExportStatus('success');
            
            // Volvemos al estado normal después de 3 segundos
            setTimeout(() => setExportStatus('idle'), 3000);
        }, 1500);
    };

    // 5. Función con feedback visual para descargar recibo
    const handleDownload = () => {
        if (downloadStatus !== 'idle') return;
        setDownloadStatus('downloading');
        
        // Simulamos el proceso de descarga del PDF
        setTimeout(() => {
            setDownloadStatus('success');
            setTimeout(() => setDownloadStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div style={{ position: 'relative' }}>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>
                Mis Ventas
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Monitorea el historial y estado de tus ventas o preventas adquiridas.
            </p>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                
                {/* BARRA SUPERIOR: Buscador y Botón de Exportar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                    
                    {/* Buscador */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre de producto o empresa..." 
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
                        {exportStatus === 'idle' && '📊 Exportar registro de ventas'}
                        {exportStatus === 'exporting' && '⏳ Generando Excel...'}
                        {exportStatus === 'success' && '✅ Excel Descargado'}
                    </button>
                </div>

                {/* TABLA DE VENTAS */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>N° de Venta</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Producto</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Comprador</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold' }}>Empresa</th>
                                <th style={{ padding: '15px', color: '#555', fontWeight: 'bold', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                        No se encontraron ventas que coincidan con tu búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr key={sale.id} style={{ borderBottom: '1px solid #eee', transition: '0.2s' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{sale.id}</td>
                                        <td style={{ padding: '15px', color: '#333' }}>{sale.producto}</td>
                                        <td style={{ padding: '15px', color: '#555' }}>{sale.comprador}</td>
                                        <td style={{ padding: '15px', color: '#555' }}>{sale.empresa}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => setSelectedSale(sale)}
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

            {/* MODAL FLOTANTE (Se muestra solo si hay una venta seleccionada) */}
            {selectedSale && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', // Fondo más oscuro para destacar el modal
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
                        maxWidth: '700px', // Hacemos el modal un poco más ancho para que quepa bien la data
                        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                        position: 'relative'
                    }}>
                        {/* Botón de cerrar modal */}
                        <button 
                            onClick={() => setSelectedSale(null)}
                            style={{
                                position: 'absolute', top: '15px', right: '20px',
                                background: 'transparent', border: 'none',
                                fontSize: '1.8rem', color: '#888', cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        
                        <div style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '25px' }}>
                            <h3 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.6rem' }}>
                                Detalle de la Venta: <span style={{ color: 'var(--color-text)' }}>{selectedSale.id}</span>
                            </h3>
                        </div>
                        
                        {/* Grilla para los detalles de la venta */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            
                            {/* Columna Izquierda */}
                            <div>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Producto:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedSale.producto}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Comprador:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedSale.comprador}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Empresa:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedSale.empresa}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Cantidad Acordada:</strong> <br/><span style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{selectedSale.cantidad} {selectedSale.unidad}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Costo Total:</strong> <br/><span style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>{selectedSale.costo}</span></p>
                            </div>

                            {/* Columna Derecha */}
                            <div>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Fecha de Compra:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedSale.fechaCompra}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Fecha de Entrega:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedSale.fechaEntrega}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}><strong style={{ color: '#555' }}>Número de Lote Central:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333', fontWeight: 'bold' }}>{selectedSale.lote}</span></p>
                                <p style={{ margin: '0 0 15px 0' }}>
                                    <strong style={{ color: '#555' }}>Número de Lote Parcial:</strong> <br/>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{selectedSale.loteParcial}</span>
                                    {(() => {
                                        const match = selectedSale.loteParcial?.match(/-P(\d+)$/);
                                        if (match) {
                                            const buyerNum = match[1];
                                            return (
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    marginLeft: '10px', 
                                                    padding: '3px 8px', 
                                                    backgroundColor: '#E8F5E9', 
                                                    color: 'var(--color-primary)', 
                                                    borderRadius: 'var(--radius-sm)', 
                                                    fontSize: '0.8rem', 
                                                    fontWeight: 'bold',
                                                    border: '1px solid var(--color-primary)',
                                                    verticalAlign: 'middle'
                                                }}>
                                                    Parcial N° {buyerNum} (Comprador N° {buyerNum})
                                                </span>
                                            );
                                        }
                                        return null;
                                    })()}
                                </p>
                                
                                {/* ATRIBUTOS ADICIONALES RECOMENDADOS */}
                                <div style={{ backgroundColor: '#F4F7F5', padding: '15px', borderRadius: 'var(--radius-md)', marginTop: '10px' }}>
                                    <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: '#555' }}>Estado de Envío:</strong> <br/>
                                        <span style={{ 
                                            display: 'inline-block', marginTop: '5px', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 'bold',
                                            backgroundColor: selectedSale.estado === 'Entregado' ? '#D4EDDA' : '#FFF3E0',
                                            color: selectedSale.estado === 'Entregado' ? '#155724' : '#FF9800'
                                        }}>
                                            {selectedSale.estado}
                                        </span>
                                    </p>
                                    <p style={{ margin: '0' }}><strong style={{ color: '#555' }}>Método de Pago:</strong> <br/><span style={{ fontSize: '1rem', color: '#333' }}>{selectedSale.metodoPago}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Dirección de Entrega (Ancho Completo) */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            <p style={{ margin: '0' }}><strong style={{ color: '#555' }}>Dirección de Entrega / Puerto:</strong> <br/><span style={{ fontSize: '1.1rem', color: '#333' }}>📍 {selectedSale.direccionEntrega}</span></p>
                        </div>

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
                                {downloadStatus === 'idle' && '📥 Descargar Recibo'}
                                {downloadStatus === 'downloading' && '⏳ Descargando...'}
                                {downloadStatus === 'success' && '✅ Recibo Descargado'}
                            </button>
                            <button onClick={() => setSelectedSale(null)} style={{
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

export default FarmerSales;
