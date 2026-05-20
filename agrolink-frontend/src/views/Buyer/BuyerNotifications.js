import React, { useState, useEffect } from 'react';
import { initialNotifications } from '../../data/mockBuyerData';

function BuyerNotifications() {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('agrolink_notifications');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error loading notifications from localStorage", e);
            }
        }
        return initialNotifications;
    });

    const [activeTab, setActiveTab] = useState('new'); // 'new' | 'read'

    useEffect(() => {
        localStorage.setItem('agrolink_notifications', JSON.stringify(notifications));
        window.dispatchEvent(new Event('notificationsUpdated'));
    }, [notifications]);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    };

    const newNotifications = notifications.filter(n => !n.leida);
    const readNotifications = notifications.filter(n => n.leida);
    const displayedNotifications = activeTab === 'new' ? newNotifications : readNotifications;

    return (
        <div>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>Notificaciones</h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>Alertas sobre tus pedidos y problemas en los cultivos adquiridos.</p>

            {/* PESTAÑAS (TABS) */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
                <button 
                    onClick={() => setActiveTab('new')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'new' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        color: activeTab === 'new' ? 'var(--color-primary)' : '#666',
                        padding: '8px 16px',
                        fontSize: '1.05rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        marginBottom: '-15px'
                    }}
                >
                    Nuevas 
                    <span style={{ 
                        backgroundColor: newNotifications.length > 0 ? '#d32f2f' : '#ccc', 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}>
                        {newNotifications.length}
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('read')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'read' ? '3px solid var(--color-primary)' : '3px solid transparent',
                        color: activeTab === 'read' ? 'var(--color-primary)' : '#666',
                        padding: '8px 16px',
                        fontSize: '1.05rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        marginBottom: '-15px'
                    }}
                >
                    Leídas
                    <span style={{ 
                        backgroundColor: '#777', 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        fontWeight: 'bold'
                    }}>
                        {readNotifications.length}
                    </span>
                </button>
            </div>

            {/* LISTA DE NOTIFICACIONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {displayedNotifications.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '50px 20px', 
                        backgroundColor: 'white', 
                        borderRadius: 'var(--radius-lg)', 
                        border: '1px solid #eee',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                    }}>
                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>
                            {activeTab === 'new' ? '🍃' : '📁'}
                        </span>
                        <p style={{ color: '#888', fontSize: '1.1rem', margin: 0 }}>
                            {activeTab === 'new' 
                                ? '¡Todo al día! No tienes notificaciones nuevas.' 
                                : 'No tienes notificaciones leídas archivadas.'}
                        </p>
                    </div>
                ) : (
                    displayedNotifications.map(notif => (
                        <div key={notif.id} style={{ 
                            backgroundColor: 'white', 
                            padding: '25px', 
                            borderRadius: 'var(--radius-lg)', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)', 
                            borderLeft: notif.tipo === 'Incidencia' ? '5px solid #d32f2f' : '5px solid var(--color-primary)', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
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
                                <button 
                                    onClick={() => markAsRead(notif.id)} 
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        border: '1.5px solid var(--color-primary)', 
                                        color: 'var(--color-primary)', 
                                        padding: '8px 16px', 
                                        borderRadius: 'var(--radius-md)', 
                                        cursor: 'pointer', 
                                        fontWeight: 'bold', 
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'var(--color-primary)';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = 'var(--color-primary)';
                                    }}
                                >
                                    Marcar como leída
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default BuyerNotifications;