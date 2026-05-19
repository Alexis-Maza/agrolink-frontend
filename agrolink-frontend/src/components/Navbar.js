import React from 'react';
import { Link } from 'react-router-dom'; // Importación vital para la navegación interna

function Navbar() {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px',
            backgroundColor: 'var(--color-surface)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>

            {/* LOGO (A la izquierda) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Icono SVG Moderno: Hoja + Conexión Tecnológica */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="var(--color-primary)" />
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 14.11 4.81 16.03 6.13 17.47L17.47 6.13C16.03 4.81 14.11 4 12 4Z" fill="#81C784" />
                </svg>
                <span style={{
                    fontFamily: 'var(--font-titles)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    letterSpacing: '0.5px'
                }}>
                    Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span>
                </span>
            </div>

            {/* ENLACES CENTRALES (Anclas para desplazamiento suave) */}
            <div style={{ display: 'flex', gap: '30px' }}>
                <a href="#about" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: '500', fontSize: '1rem' }}>Nosotros</a>
                <a href="#mission" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: '500', fontSize: '1rem' }}>Misión</a>
                <a href="#vision" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: '500', fontSize: '1rem' }}>Visión</a>
            </div>

            {/* BOTONES DE ACCIÓN (A la derecha) */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

                {/* Enlace al login */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--color-text)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}>
                        Iniciar Sesión
                    </button>
                </Link>

                {/* ENLACE ACTIVO: Te redirige al formulario de registro */}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <button style={{
                        backgroundColor: 'var(--color-secondary)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 22px',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px rgba(255, 152, 0, 0.3)'
                    }}>
                        Registrarse
                    </button>
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;