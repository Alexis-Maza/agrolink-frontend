import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const data = await login(formData.email, formData.password);

            // Decodificar el token para obtener el rol
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const rol = payload.rol;
            localStorage.setItem('userRole', rol);

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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
            <div style={{ backgroundColor: 'white', padding: '45px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px' }}>

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
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
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
    );
}

export default Login;