import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    
    // Controla si estamos en el paso 1 (Formulario) o paso 2 (Verificación de Token)
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        fechaNacimiento: '',
        password: '',
        confirmPassword: '',
        rol: ''
    });

    // Estados para el paso 2 (Token)
    const [token, setToken] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleSelect = (selectedRole) => {
        setFormData({
            ...formData,
            rol: selectedRole
        });
    };

    // Al enviar el formulario (Paso 1)
    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, verifícalas.");
            return;
        }

        if (!formData.rol) {
            alert("Por favor, selecciona si deseas ser Agricultor o Comprador.");
            return;
        }

        // Simulamos envío al backend y pasamos al paso 2
        setStep(2);
    };

    // Al validar el código de 6 dígitos (Paso 2)
    const handleTokenSubmit = (e) => {
        e.preventDefault();
        
        if (token.length !== 6) {
            alert("Por favor ingresa un código válido de 6 dígitos.");
            return;
        }

        setIsValidating(true);

        // Simulamos el tiempo de validación con el backend
        setTimeout(() => {
            setIsValidating(false);
            
            // Guardar autenticación ficticia en localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', formData.rol);
            
            // Lógica de redirección basada en el rol
            if (formData.rol === 'FARMER') {
                navigate('/farmer');
            } else if (formData.rol === 'BUYER') {
                const savedCart = JSON.parse(localStorage.getItem('agrolink_cart') || '[]');
                if (savedCart.length > 0) {
                    navigate('/buyer/cart');
                } else {
                    navigate('/buyer');
                }
            }
        }, 1500);
    };

    // Simular el reenvío del código
    const handleResendCode = () => {
        setIsResending(true);
        // Simulamos delay de red
        setTimeout(() => {
            setIsResending(false);
            alert("¡Se ha enviado un nuevo código a tu correo electrónico!");
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '45px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '580px',
                position: 'relative'
            }}>

                {/* --- PASO 1: FORMULARIO DE REGISTRO --- */}
                {step === 1 && (
                    <>
                        <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                            Crea tu Cuenta en AgroLink
                        </h2>
                        <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem' }}>
                            Únete al mercado de futuros agrícolas más transparente.
                        </p>

                        <form onSubmit={handleRegisterSubmit}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Nombre</label>
                                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', marginBottom: '25px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Fecha de Nacimiento</label>
                                    <input type="date" name="fechaNacimiento" required value={formData.fechaNacimiento} onChange={handleChange} style={{ width: '100%', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit' }} />
                                </div>
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

                                    <button type="button" onClick={() => handleRoleSelect('FARMER')} style={{
                                        padding: '18px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                                        border: formData.rol === 'FARMER' ? '2px solid var(--color-primary)' : '1px solid #ccc',
                                        backgroundColor: formData.rol === 'FARMER' ? '#E8F5E9' : 'white',
                                        color: formData.rol === 'FARMER' ? 'var(--color-primary)' : '#555',
                                        transition: 'all 0.2s ease', boxShadow: formData.rol === 'FARMER' ? '0 4px 8px rgba(46,125,50,0.15)' : 'none'
                                    }}>
                                        🌾 Soy Agricultor <br />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px', color: formData.rol === 'FARMER' ? 'var(--color-primary)' : '#777' }}>Quiero publicar mis cultivos</span>
                                    </button>

                                    <button type="button" onClick={() => handleRoleSelect('BUYER')} style={{
                                        padding: '18px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                                        border: formData.rol === 'BUYER' ? '2px solid var(--color-secondary)' : '1px solid #ccc',
                                        backgroundColor: formData.rol === 'BUYER' ? '#FFF3E0' : 'white',
                                        color: formData.rol === 'BUYER' ? 'var(--color-secondary)' : '#555',
                                        transition: 'all 0.2s ease', boxShadow: formData.rol === 'BUYER' ? '0 4px 8px rgba(255,152,0,0.15)' : 'none'
                                    }}>
                                        🛒 Soy Comprador <br />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px', color: formData.rol === 'BUYER' ? 'var(--color-secondary)' : '#777' }}>Quiero comprar de antemano</span>
                                    </button>

                                </div>
                            </div>

                            <button type="submit" style={{
                                width: '100%', padding: '15px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none',
                                borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)', marginBottom: '25px', transition: 'background-color 0.2s'
                            }}>
                                Registrarse
                            </button>

                            <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                                ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Inicia Sesión</Link>
                            </p>
                        </form>
                    </>
                )}

                {/* --- PASO 2: VERIFICACIÓN DE TOKEN --- */}
                {step === 2 && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
                        <div style={{
                            width: '80px', height: '80px', backgroundColor: '#E8F5E9', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto',
                            fontSize: '2.5rem'
                        }}>
                            ✉️
                        </div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px', fontFamily: 'var(--font-titles)', fontSize: '2rem' }}>
                            Verifica tu Correo
                        </h2>
                        <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px', lineHeight: '1.6' }}>
                            Hemos enviado un código de 6 dígitos a <strong>{formData.email}</strong>. 
                            <br />Por favor, introdúcelo abajo para activar tu cuenta.
                        </p>

                        <form onSubmit={handleTokenSubmit}>
                            <div style={{ marginBottom: '30px' }}>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))} // Solo números
                                    placeholder="000000"
                                    style={{ 
                                        width: '200px', padding: '15px', borderRadius: 'var(--radius-md)', 
                                        border: '2px solid var(--color-primary)', fontSize: '2rem', textAlign: 'center',
                                        letterSpacing: '5px', fontWeight: 'bold', color: 'var(--color-text)', outline: 'none'
                                    }} 
                                    required
                                />
                            </div>

                            <button type="submit" disabled={isValidating} style={{
                                width: '100%', padding: '15px', backgroundColor: isValidating ? '#ccc' : 'var(--color-primary)', 
                                color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', 
                                fontWeight: 'bold', cursor: isValidating ? 'default' : 'pointer',
                                boxShadow: isValidating ? 'none' : '0 4px 10px rgba(46, 125, 50, 0.2)', marginBottom: '25px', transition: '0.2s'
                            }}>
                                {isValidating ? '⏳ Validando código...' : '✅ Activar Cuenta'}
                            </button>
                        </form>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>¿No recibiste el correo?</p>
                            <button 
                                type="button" 
                                onClick={handleResendCode} 
                                disabled={isResending}
                                style={{
                                    backgroundColor: 'transparent', border: 'none', color: isResending ? '#aaa' : 'var(--color-secondary)',
                                    fontWeight: 'bold', cursor: isResending ? 'default' : 'pointer', fontSize: '1rem', textDecoration: 'underline'
                                }}
                            >
                                {isResending ? 'Enviando...' : 'Reenviar nuevo código'}
                            </button>
                        </div>
                        
                        {/* Botón para volver al paso 1 en caso de error de email */}
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            style={{
                                position: 'absolute', top: '20px', left: '20px',
                                background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer'
                            }}
                            title="Volver"
                        >
                            ⬅
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Register;