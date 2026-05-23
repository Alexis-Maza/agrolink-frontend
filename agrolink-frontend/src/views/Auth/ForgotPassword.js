import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authService';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSending(true);

        try {
            await forgotPassword(email);
            localStorage.setItem('agrolink_reset_email', email);
            navigate('/verify-reset-token');
        } catch (err) {
            setError('No encontramos una cuenta con ese correo.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
            <div style={{ backgroundColor: 'white', padding: '45px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px' }}>

                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>Recuperar Contraseña</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem', lineHeight: '1.5' }}>Ingresa tu correo para recibir un código de verificación.</p>

                {error && (
                    <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} disabled={isSending} />
                    </div>

                    <button type="submit" disabled={isSending} style={{ width: '100%', padding: '15px', backgroundColor: isSending ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: isSending ? 'default' : 'pointer', marginBottom: '25px' }}>
                        {isSending ? '⏳ Enviando código...' : '📧 Enviar Código de Verificación'}
                    </button>

                    <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                        Volver a <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Iniciar Sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;