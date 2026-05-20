import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onCartClick }) {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('agrolink_cart') || '[]');
        setCartCount(cart.length);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px',
            backgroundColor: 'var(--color-surface)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>

            {/* LOGO */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <img src="/logo.png" alt="AgroLink Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <span style={{
                    fontFamily: 'var(--font-titles)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    letterSpacing: '0.5px'
                }}>
                    Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span>
                </span>
            </Link>

            {/* ACCIONES Y CARRITO */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

                {/* Botón Carrito */}
                <button onClick={onCartClick} style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--color-text)',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    position: 'relative',
                    padding: '8px 15px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E8F5E9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'none';
                }}>
                    <span>🛒</span>
                    <span>Carrito</span>
                    {cartCount > 0 && (
                        <span style={{
                            backgroundColor: 'var(--color-secondary)',
                            color: 'white',
                            borderRadius: '50%',
                            minWidth: '20px',
                            height: '20px',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '0 4px',
                            boxShadow: '0 2px 4px rgba(255, 152, 0, 0.4)'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Iniciar Sesión */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <button style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--color-text)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text)'}>
                        Iniciar Sesión
                    </button>
                </Link>

                {/* Registrarse */}
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
                        boxShadow: '0 2px 6px rgba(255, 152, 0, 0.3)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                        e.currentTarget.style.transform = 'none';
                    }}>
                        Registrarse
                    </button>
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;