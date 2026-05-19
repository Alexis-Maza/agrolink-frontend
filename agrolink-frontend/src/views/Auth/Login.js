import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos de inicio de sesión:", formData);
        alert("¡Inicio de sesión exitoso!");
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
                borderRadius: 'var(--radius-md)',
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
                    <div style={{ marginBottom: '35px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                        <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <a href="#" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '15px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)',
                        marginBottom: '25px',
                        transition: 'background-color 0.2s'
                    }}>
                        Iniciar Sesión
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
