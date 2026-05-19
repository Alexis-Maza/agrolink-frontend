import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Importamos las sub-vistas
import FarmerDashboard from './FarmerDashboard';
import FarmerProducts from './FarmerProducts';
import FarmerSales from './FarmerSales';
import FarmerProfile from './FarmerProfile';

function FarmerHome() {
    const location = useLocation();

    // Función auxiliar para determinar si un enlace está activo
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Estilo común para los enlaces del menú lateral
    const linkStyle = (path) => ({
        display: 'block',
        padding: '15px 20px',
        color: isActive(path) ? 'var(--color-primary)' : '#555',
        textDecoration: 'none',
        fontWeight: isActive(path) ? 'bold' : 'normal',
        backgroundColor: isActive(path) ? '#E8F5E9' : 'transparent',
        borderLeft: isActive(path) ? '4px solid var(--color-primary)' : '4px solid transparent',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            
            {/* BARRA LATERAL (Sidebar) */}
            <nav style={{
                width: '250px',
                backgroundColor: 'white',
                boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', margin: 0, fontSize: '1.5rem' }}>
                        Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span>
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem', margin: '5px 0 0 0' }}>Panel Agricultor</p>
                </div>

                <div style={{ flex: 1, padding: '20px 0' }}>
                    <Link to="/farmer" style={linkStyle('/farmer')}>🏠 Inicio</Link>
                    <Link to="/farmer/products" style={linkStyle('/farmer/products')}>🌾 Mis Cultivos</Link>
                    <Link to="/farmer/sales" style={linkStyle('/farmer/sales')}>💰 Mis Ventas</Link>
                    <Link to="/farmer/profile" style={linkStyle('/farmer/profile')}>👤 Mi Perfil</Link>
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
                    <Link to="/" style={{ color: '#dc3545', textDecoration: 'none', fontWeight: 'bold' }}>🚪 Cerrar Sesión</Link>
                </div>
            </nav>

            {/* ÁREA PRINCIPAL (Contenido dinámico) */}
            <main style={{ flex: 1, padding: '40px' }}>
                <Routes>
                    <Route path="/" element={<FarmerDashboard />} />
                    <Route path="products" element={<FarmerProducts />} />
                    <Route path="sales" element={<FarmerSales />} />
                    <Route path="profile" element={<FarmerProfile />} />
                </Routes>
            </main>

        </div>
    );
}

export default FarmerHome;