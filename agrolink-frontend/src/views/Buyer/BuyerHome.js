import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import BuyerCatalog from './BuyerCatalog';
import BuyerCart from './BuyerCart';
import BuyerPurchases from './BuyerPurchases';
import BuyerNotifications from './BuyerNotifications';
import BuyerProfile from './BuyerProfile';

function BuyerHome() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    // Estado global para ocultar productos ya añadidos al carrito
    const [acquiredIds, setAcquiredIds] = useState([]);

    const addAcquiredId = (id) => {
        if (!acquiredIds.includes(id)) {
            setAcquiredIds([...acquiredIds, id]);
        }
    };

    const linkStyle = (path) => ({
        display: 'block', padding: '15px 20px',
        color: isActive(path) ? 'var(--color-primary)' : '#555',
        textDecoration: 'none', fontWeight: isActive(path) ? 'bold' : 'normal',
        backgroundColor: isActive(path) ? '#E8F5E9' : 'transparent',
        borderLeft: isActive(path) ? '4px solid var(--color-primary)' : '4px solid transparent',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <nav style={{ width: '250px', backgroundColor: 'white', boxShadow: '2px 0 5px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
                <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: 0, fontSize: '1.5rem' }}>Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span></h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Panel Comprador</p>
                </div>
                <div style={{ flex: 1, padding: '20px 0' }}>
                    <Link to="/buyer" style={linkStyle('/buyer')}>🌿 Catálogo</Link>
                    <Link to="/buyer/cart" style={linkStyle('/buyer/cart')}>🛒 Mi Carrito</Link>
                    <Link to="/buyer/purchases" style={linkStyle('/buyer/purchases')}>📦 Mis Compras</Link>
                    <Link to="/buyer/notifications" style={linkStyle('/buyer/notifications')}>🔔 Notificaciones</Link>
                    <Link to="/buyer/profile" style={linkStyle('/buyer/profile')}>👤 Mi Perfil</Link>
                </div>
                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    <Link to="/" onClick={() => { localStorage.removeItem('isAuthenticated'); localStorage.removeItem('userRole'); }} style={{ color: '#dc3545', textDecoration: 'none', fontWeight: 'bold' }}>🚪 Cerrar Sesión</Link>
                </div>
            </nav>

            <main style={{ flex: 1, padding: '40px' }}>
                <Routes>
                    <Route path="/" element={<BuyerCatalog acquiredIds={acquiredIds} onAddToCart={addAcquiredId} />} />
                    <Route path="catalog" element={<BuyerCatalog acquiredIds={acquiredIds} onAddToCart={addAcquiredId} />} />
                    <Route path="cart" element={<BuyerCart />} />
                    <Route path="purchases" element={<BuyerPurchases />} />
                    <Route path="notifications" element={<BuyerNotifications />} />
                    <Route path="profile" element={<BuyerProfile />} />
                </Routes>
            </main>
        </div>
    );
}

export default BuyerHome;