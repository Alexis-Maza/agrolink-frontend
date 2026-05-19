import React, { useState } from 'react';
import { initialNotifications } from '../../data/mockBuyerData';

function BuyerNotifications() {
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, leida: true } : n));
    };

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Notificaciones</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Alertas sobre tus pedidos y problemas en los cultivos adquiridos.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notifications.map(notif => (
                    <div key={notif.id} style={{ 
                        // AQUÍ ESTÁ LA CORRECCIÓN: Si es leída, fondo blanco, si no, verde clarito
                        backgroundColor: notif.leida ? 'white' : '#F4F7F5', 
                        padding: '25px', 
                        borderRadius: 'var(--radius-lg)', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
                        borderLeft: notif.tipo === 'Incidencia' ? '5px solid #d32f2f' : '5px solid var(--color-primary)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        transition: 'background-color 0.3s ease'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: notif.tipo === 'Incidencia' ? '#d32f2f' : 'var(--color-primary)' }}>
                                    {notif.tipo === 'Incidencia' ? '⚠️ Alerta de Incidencia' : '📦 Actualización de Pedido'}
                                </span>
                                <span style={{ fontSize: '0.85rem', color: '#888' }}>{notif.fecha}</span>
                            </div>
                            <p style={{ margin: 0, color: '#555', fontSize: '1rem', lineHeight: '1.5' }}>{notif.mensaje}</p>
                        </div>
                        {!notif.leida && (
                            <button onClick={() => markAsRead(notif.id)} style={{ backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '8px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                Marcar como leída
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerNotifications;