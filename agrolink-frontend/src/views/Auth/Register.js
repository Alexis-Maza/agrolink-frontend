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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;
        if (['nombres', 'apellidoPaterno', 'apellidoMaterno'].includes(e.target.name)) {
            // Permitir solo letras españolas, ñ/Ñ y espacios.
            value = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]/g, '');
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleRoleSelect = (selectedRole) => setFormData({ ...formData, rol: selectedRole });

    // Validaciones de contraseña derivadas del estado
    const password = formData.password;
    const hasLetter = /[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9ñÑáéíóúÁÉÍÓÚüÜ]/.test(password);
    const hasMinLength = password.length >= 8;
    const isPasswordValid = hasLetter && hasNumber && hasSpecial && hasMinLength;

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('La contraseña no cumple con los requisitos mínimos de seguridad.');
            return;
        }

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
                <div className="auth-card" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '580px' }}>

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

                        <div className="auth-form-grid" style={{ marginBottom: '25px' }}>
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

                        <div className="auth-form-grid" style={{ marginBottom: '35px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        name="password" 
                                        required 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
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

                                    {/* Requisitos de seguridad de la contraseña flotante */}
                                    {(isPasswordFocused || formData.password.length > 0) && !isPasswordValid && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            marginTop: '6px',
                                            padding: '12px 14px',
                                            backgroundColor: 'white',
                                            border: '1px solid #E0E6E1',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            zIndex: 10,
                                            fontSize: '0.8rem'
                                        }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--color-text)', display: 'block', marginBottom: '6px' }}>
                                                La contraseña debe cumplir con:
                                            </span>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasMinLength ? '#2E7D32' : '#777', fontWeight: hasMinLength ? 'bold' : 'normal' }}>
                                                    <span style={{ fontSize: '0.9rem' }}>{hasMinLength ? '✅' : '⚪'}</span> Mínimo 8 caracteres
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasLetter ? '#2E7D32' : '#777', fontWeight: hasLetter ? 'bold' : 'normal' }}>
                                                    <span style={{ fontSize: '0.9rem' }}>{hasLetter ? '✅' : '⚪'}</span> Al menos una letra
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasNumber ? '#2E7D32' : '#777', fontWeight: hasNumber ? 'bold' : 'normal' }}>
                                                    <span style={{ fontSize: '0.9rem' }}>{hasNumber ? '✅' : '⚪'}</span> Al menos un número
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasSpecial ? '#2E7D32' : '#777', fontWeight: hasSpecial ? 'bold' : 'normal' }}>
                                                    <span style={{ fontSize: '0.9rem' }}>{hasSpecial ? '✅' : '⚪'}</span> Un carácter especial (ej. @$!%*?&)
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Confirmar Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        name="confirmPassword" 
                                        required 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                        style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                        {showConfirmPassword ? (
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
                                {formData.confirmPassword && (
                                    <div style={{
                                        marginTop: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        color: formData.password === formData.confirmPassword ? '#2E7D32' : '#d32f2f',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span>{formData.password === formData.confirmPassword ? '🟢 Las contraseñas coinciden' : '🔴 Las contraseñas no coinciden'}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '35px' }}>
                            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: '1.05rem' }}>¿Cuál será tu rol en la plataforma?</label>
                            <div className="auth-form-grid">
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