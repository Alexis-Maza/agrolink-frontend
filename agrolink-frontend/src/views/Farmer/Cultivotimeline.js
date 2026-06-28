import React, { useState, useEffect } from 'react';
import { obtenerHistorialCultivo } from '../../api/agricultorService';

const formatDate = (dateStr) => {
    if (!dateStr) return 'Presente';
    const parts = dateStr.toString().split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const getEstadoConfig = (estado) => {
    if (!estado) return { color: '#888', bg: '#f5f5f5', icon: '⏳' };
    const e = estado.toLowerCase();
    if (e.includes('listo') || e.includes('cosech'))
        return { color: '#2E7D32', bg: '#E8F5E9', icon: '✅' };
    if (e.includes('crecimiento'))
        return { color: '#F57F17', bg: '#FFF8E1', icon: '🌿' };
    return { color: '#1565C0', bg: '#E3F2FD', icon: '🌱' };
};

function CultivoTimeline({ cultivoId, cultivoNombre }) {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cultivoId) return;
        const cargar = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await obtenerHistorialCultivo(cultivoId);
                setHistorial(data);
            } catch (err) {
                setError('No se pudo cargar el historial.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [cultivoId]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
            ⏳ Cargando historial...
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#d32f2f' }}>
            {error}
        </div>
    );

    if (historial.length === 0) return (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
            No hay historial registrado para este cultivo.
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-titles)',
                margin: '0 0 25px 0',
                fontSize: '1.3rem',
                borderBottom: '2px solid #eee',
                paddingBottom: '10px'
            }}>
                📅 Línea de Tiempo — {cultivoNombre}
            </h3>

            <div style={{ position: 'relative' }}>
                {/* Línea vertical */}
                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '10px',
                    bottom: '10px',
                    width: '3px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {historial.map((etapa, index) => {
                        const config = getEstadoConfig(etapa.estadoCultivo);
                        const esActual = etapa.fechaFin === null;

                        return (
                            <div key={etapa.id} style={{
                                display: 'flex',
                                gap: '20px',
                                alignItems: 'flex-start',
                                position: 'relative'
                            }}>
                                {/* Círculo en la línea */}
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    backgroundColor: config.bg,
                                    border: `3px solid ${config.color}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                    zIndex: 1,
                                    boxShadow: esActual ? `0 0 0 4px ${config.bg}` : 'none'
                                }}>
                                    {config.icon}
                                </div>

                                {/* Contenido */}
                                <div style={{
                                    flex: 1,
                                    backgroundColor: esActual ? config.bg : 'white',
                                    border: `1px solid ${esActual ? config.color : '#eee'}`,
                                    borderRadius: 'var(--radius-md)',
                                    padding: '15px 20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                        flexWrap: 'wrap',
                                        gap: '8px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                backgroundColor: config.bg,
                                                color: config.color,
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                border: `1px solid ${config.color}`
                                            }}>
                                                {etapa.estadoCultivo || 'Sin estado'}
                                            </span>
                                            {esActual && (
                                                <span style={{
                                                    backgroundColor: '#E8F5E9',
                                                    color: '#2E7D32',
                                                    padding: '3px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    🟢 Etapa actual
                                                </span>
                                            )}
                                            {etapa.alertaRetraso && (
                                                <span style={{
                                                    backgroundColor: '#FFEBEE',
                                                    color: '#d32f2f',
                                                    padding: '3px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ⚠️ Retraso
                                                </span>
                                            )}
                                        </div>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            color: '#888',
                                            fontWeight: '500'
                                        }}>
                                            Etapa #{index + 1}
                                        </span>
                                    </div>

                                    {/* Fechas */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                        gap: '10px',
                                        marginBottom: '10px'
                                    }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>
                                                Inicio
                                            </span>
                                            <strong style={{ color: '#333', fontSize: '0.95rem' }}>
                                                📅 {formatDate(etapa.fechaInicio)}
                                            </strong>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>
                                                Fin
                                            </span>
                                            <strong style={{ color: esActual ? config.color : '#333', fontSize: '0.95rem' }}>
                                                📅 {formatDate(etapa.fechaFin)}
                                            </strong>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>
                                                Días transcurridos
                                            </span>
                                            <strong style={{ color: '#333', fontSize: '0.95rem' }}>
                                                ⏱️ {etapa.diasTranscurridos} días
                                            </strong>
                                        </div>
                                        {etapa.diasDuracionEstimada && (
                                            <div>
                                                <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>
                                                    Días estimados
                                                </span>
                                                <strong style={{ color: '#333', fontSize: '0.95rem' }}>
                                                    🎯 {etapa.diasDuracionEstimada} días
                                                </strong>
                                            </div>
                                        )}
                                    </div>

                                    {/* Alerta de retraso */}
                                    {etapa.alertaRetraso && etapa.porcentajeRetraso !== null && (
                                        <div style={{
                                            backgroundColor: '#FFEBEE',
                                            border: '1px solid #ffcdd2',
                                            borderRadius: '5px',
                                            padding: '8px 12px',
                                            fontSize: '0.85rem',
                                            color: '#d32f2f',
                                            fontWeight: 'bold'
                                        }}>
                                            ⚠️ Esta etapa lleva un retraso del {etapa.porcentajeRetraso?.toFixed(1)}% sobre lo estimado.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CultivoTimeline;