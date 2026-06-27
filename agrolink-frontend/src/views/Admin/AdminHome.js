import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminFarmers from './AdminFarmers';
import AdminBuyers from './AdminBuyers';
import AdminProfile from './AdminProfile';
import { logout } from '../../api/authService';

function AdminHome() {
    const location = useLocation();
    const userRole = localStorage.getItem('userRole');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Función auxiliar para determinar si un enlace está activo
    const isActive = (path) => {
        return location.pathname === path || (path === "/admin/productos" && location.pathname === "/admin");
    };

    // Estilo común para los enlaces del menú lateral (alineado con Farmer/Buyer pero usando la paleta del admin)
    const linkStyle = (path) => ({
        display: "block",
        padding: "15px 20px",
        color: isActive(path) ? "var(--color-primary)" : "#555",
        textDecoration: "none",
        fontWeight: isActive(path) ? "bold" : "normal",
        backgroundColor: isActive(path) ? "#E8F0FE" : "transparent", // Fondo azul claro suave
        borderLeft: isActive(path)
            ? "4px solid var(--color-primary)" // Borde azul del administrador
            : "4px solid transparent",
        transition: "all 0.2s",
    });

    return (
        <div className="theme-admin admin-layout">
            {/* BARRA SUPERIOR MÓVIL */}
            <header className="admin-mobile-header">
                <h2 style={{ margin: 0, fontSize: "1.3rem", color: "var(--color-primary)", fontWeight: "bold" }}>
                    Agro<span style={{ color: "var(--color-secondary, #FF9800)" }}>Link</span>
                </h2>
                <button 
                    className="admin-hamburger-btn" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Abrir menú"
                >
                    ☰
                </button>
            </header>

            {/* OVERLAY PARA CERRAR MENÚ EN MÓVIL */}
            {isSidebarOpen && (
                <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* BARRA LATERAL (Sidebar) */}
            <nav className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
                {/* Logo y cabecera del panel */}
                <div className="admin-logo-section" style={{ borderBottom: "1px solid #eee" }}>
                    <h2
                        style={{
                            color: "var(--color-primary)",
                            fontFamily: "var(--font-titles)",
                            margin: 0,
                            fontSize: "1.5rem",
                        }}
                    >
                        Agro<span style={{ color: "var(--color-secondary)" }}>Link</span>
                    </h2>
                    <p style={{ color: "#888", fontSize: "0.9rem", margin: "5px 0 0 0", fontWeight: "600" }}>
                        {userRole === 'SUBADMIN' ? 'Panel Subadministrador' : 'Panel Administrador'}
                    </p>
                </div>

                {/* Enlaces de Navegación */}
                <div style={{ flex: 1, padding: "20px 0" }}>
                    <Link to="/admin/productos" style={linkStyle("/admin/productos")} onClick={() => setIsSidebarOpen(false)}>
                        📦 Productos
                    </Link>
                    <Link to="/admin/agricultores" style={linkStyle("/admin/agricultores")} onClick={() => setIsSidebarOpen(false)}>
                        👨‍🌾 Agricultores
                    </Link>
                    <Link to="/admin/compradores" style={linkStyle("/admin/compradores")} onClick={() => setIsSidebarOpen(false)}>
                        👥 Compradores
                    </Link>
                    <Link to="/admin/perfil" style={linkStyle("/admin/perfil")} onClick={() => setIsSidebarOpen(false)}>
                        👤 Mi Perfil
                    </Link>
                </div>

                {/* Footer del Sidebar con botón de cerrar sesión */}
                <div className="admin-sidebar-footer" style={{ borderTop: "1px solid #eee" }}>
                    <Link
                        to="/"
                        onClick={() => {
                            logout();
                            setIsSidebarOpen(false);
                        }}
                        style={{
                            color: "#dc3545",
                            textDecoration: "none",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        🚪 Cerrar Sesión
                    </Link>
                </div>
            </nav>

            {/* ÁREA PRINCIPAL (Contenido dinámico derecho) */}
            <main className="admin-main">
                <Routes>
                    {/* Redirección automática de /admin a /admin/productos */}
                    <Route path="/" element={<Navigate to="productos" replace />} />
                    <Route path="productos" element={<AdminProducts />} />
                    <Route path="agricultores" element={<AdminFarmers />} />
                    <Route path="compradores" element={<AdminBuyers />} />
                    <Route path="perfil" element={<AdminProfile />} />
                </Routes>
            </main>
        </div>
    );
}

export default AdminHome;