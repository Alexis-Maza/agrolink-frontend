import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoggingIn(true);

        // Simulamos el tiempo de validación con el backend
        setTimeout(() => {
            setIsLoggingIn(false);
            
            // Buscar usuario registrado en localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('agrolink_users') || '[]');
            const foundUser = registeredUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
            
            let role = 'BUYER'; // Rol por defecto

            if (foundUser) {
                role = foundUser.rol;
            } else {
                // Fallback inteligente para demo sin selector
                const emailLower = formData.email.toLowerCase();
                if (emailLower.includes('farmer') || emailLower.includes('agricultor') || emailLower.includes('pedro') || emailLower.includes('maria') || emailLower.includes('juan')) {
                    role = 'FARMER';
                } else if (emailLower.includes('admin')) {
                    role = 'ADMIN';
                }
            }

            // Guardar autenticación ficticia en localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', role);
            
            // Lógica de redirección basada en el rol
            if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'FARMER') {
                navigate('/farmer');
            } else {
                const savedCart = JSON.parse(localStorage.getItem('agrolink_cart') || '[]');
                if (savedCart.length > 0) {
                    navigate('/buyer/cart');
                } else {
                    navigate('/buyer');
                }
            }
        }, 1200);
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
                maxWidth: '480px'
            }}>

                {/* Encabezado */}
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                    Bienvenido de Nuevo
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem' }}>
                    Ingresa a tu cuenta para continuar.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Fila: Email */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                    </div>

                    {/* Fila: Contraseña */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</Link>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <button type="submit" disabled={isLoggingIn} style={{
                        width: '100%', padding: '15px', backgroundColor: isLoggingIn ? '#ccc' : 'var(--color-primary)', 
                        color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', 
                        cursor: isLoggingIn ? 'default' : 'pointer', boxShadow: isLoggingIn ? 'none' : '0 4px 10px rgba(46, 125, 50, 0.2)', 
                        marginBottom: '25px', transition: '0.2s'
                    }}>
                        {isLoggingIn ? '⏳ Verificando credenciales...' : 'Iniciar Sesión'}
                    </button>

                    {/* Enlace para ir a registro */}
                    <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                        ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Login;
