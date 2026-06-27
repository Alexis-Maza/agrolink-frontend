import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, register } from '../../api/authService';

function EmailVerification() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const pendingEmail = localStorage.getItem('agrolink_pending_email');
        if (pendingEmail) setEmail(pendingEmail);
    }, []);

    const handleTokenSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (codigo.length !== 6) {
            setError('Por favor ingresa un código válido de 6 dígitos.');
            return;
        }

        setIsValidating(true);
        try {
            await verifyEmail(email, codigo);
            localStorage.removeItem('agrolink_pending_email');
            setIsSuccess(true);

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError('Código incorrecto. Intenta de nuevo.');
        } finally {
            setIsValidating(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            // Necesitamos reenviar el código → llamar a forgot-password no aplica aquí
            // Por ahora mostramos mensaje informativo
            alert('Por favor vuelve a registrarte para obtener un nuevo código.');
            navigate('/register');
        } catch (err) {
            alert('Error al reenviar el código.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card auth-card-mini">

                {!isSuccess && (
                    <button type="button" onClick={() => navigate('/register')} style={{ position: 'absolute', top: '20px', left: '20px', background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>⬅</button>
                )}

                {isSuccess ? (
                    <div>
                        <div style={{ width: '90px', height: '90px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px auto', fontSize: '3rem' }}>✔️</div>
                        <h2 className="auth-title" style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>¡Cuenta Activada!</h2>
                        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px' }}>Tu correo ha sido validado correctamente.</p>
                        <p style={{ color: '#888', fontSize: '0.95rem' }}>Redirigiéndote a iniciar sesión...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', fontSize: '2.5rem' }}>✉️</div>
                        <h2 className="auth-title" style={{ color: 'var(--color-primary)', marginBottom: '15px' }}>Verifica tu Correo</h2>
                        <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '30px', lineHeight: '1.6' }}>
                            Ingresa el código de 6 dígitos enviado a:<br />
                            <strong style={{ color: 'var(--color-secondary)' }}>{email}</strong>
                        </p>

                        {error && (
                            <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleTokenSubmit}>
                            <div style={{ marginBottom: '30px' }}>
                                <input type="text" maxLength="6" value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/[^0-9]/g, ''))} placeholder="000000" className="auth-input-token" required disabled={isValidating} />
                            </div>

                            <button type="submit" disabled={isValidating} style={{ width: '100%', padding: '16px', backgroundColor: isValidating ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: isValidating ? 'default' : 'pointer', marginBottom: '25px' }}>
                                {isValidating ? '⏳ Validando código...' : '✅ Activar Cuenta'}
                            </button>
                        </form>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '10px' }}>¿No recibiste el correo?</p>
                            <button type="button" onClick={handleResendCode} disabled={isResending} style={{ backgroundColor: 'transparent', border: 'none', color: isResending ? '#aaa' : 'var(--color-secondary)', fontWeight: 'bold', cursor: isResending ? 'default' : 'pointer', fontSize: '1rem', textDecoration: 'underline' }}>
                                {isResending ? 'Enviando...' : 'Reenviar nuevo código'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmailVerification;