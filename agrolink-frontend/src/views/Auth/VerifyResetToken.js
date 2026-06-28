import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authService';

function VerifyResetToken() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('agrolink_reset_email');
        if (savedEmail) setEmail(savedEmail);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (token.length !== 6) {
            setError('Por favor ingresa un código de 6 dígitos válido.');
            return;
        }
        // Guardar token para usarlo en ResetPassword
        localStorage.setItem('agrolink_reset_token', token);
        navigate('/reset-password');
    };

    const handleResendToken = async () => {
        setIsResending(true);
        try {
            await forgotPassword(email);
            alert('Se ha reenviado un nuevo código a tu correo.');
        } catch (err) {
            alert('Error al reenviar el código.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-mini">

                <button type="button" onClick={() => navigate('/forgot-password')} style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>⬅</button>

                <div style={{ width: '80px', height: '80px', backgroundColor: '#FFF3E0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', fontSize: '2.5rem' }}>🔑</div>
                <h2 className="auth-title" style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>Verifica el Token</h2>
                <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '30px', lineHeight: '1.6' }}>
                    Hemos enviado un código a:<br />
                    <strong style={{ color: 'var(--color-secondary)' }}>{email}</strong>
                </p>

                {error && (
                    <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '30px' }}>
                        <input type="text" maxLength="6" value={token} onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))} placeholder="000000" className="auth-input-token auth-input-token-secondary" required disabled={isValidating} />
                    </div>

                    <button type="submit" disabled={isValidating} style={{ width: '100%', padding: '16px', backgroundColor: isValidating ? '#ccc' : 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: isValidating ? 'default' : 'pointer', marginBottom: '25px' }}>
                        {isValidating ? '⏳ Validando token...' : '🔑 Verificar Token'}
                    </button>
                </form>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>¿No recibiste el token?</p>
                    <button type="button" onClick={handleResendToken} disabled={isResending} style={{ backgroundColor: 'transparent', border: 'none', color: isResending ? '#aaa' : 'var(--color-primary)', fontWeight: 'bold', cursor: isResending ? 'default' : 'pointer', fontSize: '1rem', textDecoration: 'underline' }}>
                        {isResending ? 'Enviando...' : 'Reenviar nuevo token'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyResetToken;