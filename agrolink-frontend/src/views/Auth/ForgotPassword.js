import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) return;

        setIsSending(true);

        // Simulamos envío de token al correo
        setTimeout(() => {
            setIsSending(false);
            
            // Guardamos el email para mostrarlo en la siguiente vista
            localStorage.setItem('agrolink_reset_email', email);
            
            alert("Se ha enviado un token de restablecimiento a tu correo electrónico.");
            navigate('/verify-reset-token');
        }, 1500);
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
                maxWidth: '480px',
                animation: 'fadeIn 0.5s ease-out'
            }}>

                {/* Título */}
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                    Recuperar Contraseña
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem', lineHeight: '1.5' }}>
                    Ingresa el correo electrónico asociado a tu cuenta para recibir un código de verificación.
                </p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo de correo */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="correo@ejemplo.com"
                            style={{ 
                                width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                                border: '1px solid #ccc', fontSize: '1rem', outline: 'none'
                            }} 
                            disabled={isSending}
                        />
                    </div>

                    {/* Botón de envío */}
                    <button type="submit" disabled={isSending} style={{
                        width: '100%', padding: '15px', backgroundColor: isSending ? '#ccc' : 'var(--color-primary)', 
                        color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', 
                        cursor: isSending ? 'default' : 'pointer', boxShadow: isSending ? 'none' : '0 4px 10px rgba(46, 125, 50, 0.2)', 
                        marginBottom: '25px', transition: '0.2s'
                    }}>
                        {isSending ? '⏳ Enviando código...' : '📧 Enviar Código de Verificación'}
                    </button>

                    {/* Enlace para volver */}
                    <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                        Volver a <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Iniciar Sesión</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
