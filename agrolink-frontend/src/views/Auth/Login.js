import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        // Interceptar login si es un Subadministrador local
        const subData = localStorage.getItem('agrolink_admin_subadmins');
        let localSubadmin = null;
        if (subData) {
            try {
                const subadmins = JSON.parse(subData);
                localSubadmin = subadmins.find(s => s.correo === formData.email && s.clave === formData.password);
            } catch (err) {
                console.error("Error al buscar subadmin local", err);
            }
        }

        if (localSubadmin) {
            if (localSubadmin.estado !== 'Activo') {
                setError('Esta cuenta de subadministrador está suspendida o inactiva.');
                setIsLoggingIn(false);
                return;
            }
            localStorage.setItem('token', `mock-subadmin-token-${localSubadmin.id}`);
            localStorage.setItem('userRole', 'SUBADMIN');
            localStorage.setItem('loggedSubadmin', JSON.stringify(localSubadmin));
            setIsLoggingIn(false);
            navigate('/admin');
            return;
        }

        try {
            const data = await login(formData.email, formData.password);

            // Decodificar el token para obtener el rol
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const rol = payload.rol;
            localStorage.setItem('userRole', rol);
            localStorage.removeItem('loggedSubadmin'); // Limpiar sesión anterior de subadmin

            // Redirigir según rol
            if (rol === 'ADMIN') {
                navigate('/admin');
            } else if (rol === 'AGRICULTOR') {
                navigate('/farmer');
            } else {
                navigate('/buyer');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* BARRA DE NAVEGACIÓN SUPERIOR */}
            <header className="auth-header">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="AgroLink Logo" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                    <span style={{
                        fontFamily: 'var(--font-titles)',
                        fontSize: '1.35rem',
                        fontWeight: 'bold',
                        color: 'var(--color-primary)',
                        letterSpacing: '0.5px'
                    }}>
                        Agro<span style={{ color: 'var(--color-secondary)' }}>Link</span>
                    </span>
                </Link>

                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button 
                        className="auth-back-btn"
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E8F5E9';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <span>🏠</span> <span className="btn-text">Volver a Inicio</span>
                    </button>
                </Link>
            </header>

            {/* CONTENEDOR DEL FORMULARIO CENTRAL */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
                <div className="auth-card" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px' }}>

                    <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>Bienvenido de Nuevo</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem' }}>Ingresa a tu cuenta para continuar.</p>

                    {error && (
                        <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    name="password" 
                                    required 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#777',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoggingIn} style={{ width: '100%', padding: '15px', backgroundColor: isLoggingIn ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: isLoggingIn ? 'default' : 'pointer', marginBottom: '25px' }}>
                            {isLoggingIn ? '⏳ Verificando credenciales...' : 'Iniciar Sesión'}
                        </button>

                        <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                            ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;