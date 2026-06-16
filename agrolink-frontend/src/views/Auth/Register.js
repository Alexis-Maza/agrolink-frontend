import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authService';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombres: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRoleSelect = (selectedRole) => setFormData({ ...formData, rol: selectedRole });

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (!formData.rol) {
            setError('Por favor selecciona si eres Agricultor o Comprador.');
            return;
        }

        setLoading(true);
        try {
            await register({
                nombres: formData.nombres,
                apellidoPaterno: formData.apellidoPaterno,
                apellidoMaterno: formData.apellidoMaterno,
                email: formData.email,
                password: formData.password,
                rol: formData.rol
            });

            // Guardar email para usarlo en la verificación
            localStorage.setItem('agrolink_pending_email', formData.email);
            navigate('/verify-email');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
        } finally {
            setLoading(false);
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
                <div style={{ backgroundColor: 'white', padding: '45px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '580px' }}>

                    <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>Crea tu Cuenta en AgroLink</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem' }}>Únete al mercado de futuros agrícolas más transparente.</p>

                    {error && (
                        <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegisterSubmit}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Nombre</label>
                            <input type="text" name="nombres" required value={formData.nombres} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Apellido Paterno</label>
                                <input type="text" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Apellido Materno</label>
                                <input type="text" name="apellidoMaterno" required value={formData.apellidoMaterno} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                                <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Confirmar Contraseña</label>
                                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '35px' }}>
                            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: '1.05rem' }}>¿Cuál será tu rol en la plataforma?</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <button type="button" onClick={() => handleRoleSelect('AGRICULTOR')} style={{ padding: '18px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', border: formData.rol === 'AGRICULTOR' ? '2px solid var(--color-primary)' : '1px solid #ccc', backgroundColor: formData.rol === 'AGRICULTOR' ? '#E8F5E9' : 'white', color: formData.rol === 'AGRICULTOR' ? 'var(--color-primary)' : '#555', transition: 'all 0.2s ease' }}>
                                    🌾 Soy Agricultor<br />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>Quiero publicar mis cultivos</span>
                                </button>
                                <button type="button" onClick={() => handleRoleSelect('COMPRADOR')} style={{ padding: '18px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', border: formData.rol === 'COMPRADOR' ? '2px solid var(--color-secondary)' : '1px solid #ccc', backgroundColor: formData.rol === 'COMPRADOR' ? '#FFF3E0' : 'white', color: formData.rol === 'COMPRADOR' ? 'var(--color-secondary)' : '#555', transition: 'all 0.2s ease' }}>
                                    🛒 Soy Comprador<br />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px' }}>Quiero comprar de antemano</span>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: loading ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'default' : 'pointer', marginBottom: '25px' }}>
                            {loading ? '⏳ Registrando...' : 'Registrarse'}
                        </button>

                        <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Inicia Sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;