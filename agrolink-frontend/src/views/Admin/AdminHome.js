import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';
import AdminProfile from './AdminProfile';
import { logout } from '../../api/authService';

function AdminHome() {
    const location = useLocation();

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
        <div
            className="theme-admin"
            style={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "var(--color-bg)",
            }}
        >
            {/* BARRA LATERAL (Sidebar) */}
            <nav
                style={{
                    width: "250px",
                    backgroundColor: "white",
                    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    zIndex: 10,
                }}
            >
                {/* Logo y cabecera del panel */}
                <div
                    style={{
                        padding: "30px 20px",
                        textAlign: "center",
                        borderBottom: "1px solid #eee",
                    }}
                >
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
                    <p style={{ color: "#888", fontSize: "0.9rem", margin: "5px 0 0 0" }}>
                        Panel Administrador
                    </p>
                </div>

                {/* Enlaces de Navegación */}
                <div style={{ flex: 1, padding: "20px 0" }}>
                    <Link to="/admin/productos" style={linkStyle("/admin/productos")}>
                        📦 Productos
                    </Link>
                    <Link to="/admin/usuarios" style={linkStyle("/admin/usuarios")}>
                        👥 Usuarios
                    </Link>
                    <Link to="/admin/perfil" style={linkStyle("/admin/perfil")}>
                        👤 Mi Perfil
                    </Link>
                </div>

                {/* Footer del Sidebar con botón de cerrar sesión */}
                <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
                    <Link
                        to="/"
                        onClick={logout}
                        style={{
                            color: "#dc3545",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        🚪 Cerrar Sesión
                    </Link>
                </div>
            </nav>

            {/* ÁREA PRINCIPAL (Contenido dinámico derecho) */}
            <main style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
                <Routes>
                    {/* Redirección automática de /admin a /admin/productos */}
                    <Route path="/" element={<Navigate to="productos" replace />} />
                    <Route path="productos" element={<AdminProducts />} />
                    <Route path="usuarios" element={<AdminUsers />} />
                    <Route path="perfil" element={<AdminProfile />} />
                </Routes>
            </main>
        </div>
    );
}

export default AdminHome;