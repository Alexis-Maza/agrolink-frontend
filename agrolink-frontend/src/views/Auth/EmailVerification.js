import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailVerification() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('usuario@ejemplo.com');
    const [token, setToken] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Obtener correo pendiente de verificación
        const pendingUserStr = localStorage.getItem('agrolink_pending_user');
        if (pendingUserStr) {
            try {
                const pendingUser = JSON.parse(pendingUserStr);
                if (pendingUser.email) {
                    setEmail(pendingUser.email);
                }
            } catch (e) {
                console.error("Error al leer agrolink_pending_user", e);
            }
        }
    }, []);

    const handleTokenSubmit = (e) => {
        e.preventDefault();

        if (token.length !== 6) {
            alert("Por favor ingresa un código válido de 6 dígitos.");
            return;
        }

        setIsValidating(true);

        // Simulamos validación con retardo estético
        setTimeout(() => {
            setIsValidating(false);
            setIsSuccess(true);

            // Guardar usuario en la lista de registrados
            const pendingUserStr = localStorage.getItem('agrolink_pending_user');
            if (pendingUserStr) {
                try {
                    const pendingUser = JSON.parse(pendingUserStr);
                    const registeredUsers = JSON.parse(localStorage.getItem('agrolink_users') || '[]');
                    
                    // Evitar duplicados
                    const filteredUsers = registeredUsers.filter(u => u.email.toLowerCase() !== pendingUser.email.toLowerCase());
                    filteredUsers.push(pendingUser);
                    
                    localStorage.setItem('agrolink_users', JSON.stringify(filteredUsers));
                    localStorage.removeItem('agrolink_pending_user'); // Limpiar pendiente
                } catch (err) {
                    console.error("Error al procesar el usuario registrado", err);
                }
            }

            // Notificación y redirección limpia recargando la página
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        }, 1800);
    };

    const handleResendCode = () => {
        setIsResending(true);
        setTimeout(() => {
            setIsResending(false);
            alert("¡Se ha enviado un nuevo código de activación a tu correo electrónico!");
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
                maxWidth: '500px',
                textAlign: 'center',
                position: 'relative',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                
                {/* Botón para volver al registro */}
                {!isSuccess && (
                    <button 
                        type="button" 
                        onClick={() => navigate('/register')} 
                        style={{
                            position: 'absolute', top: '20px', left: '20px',
                            background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer'
                        }}
                        title="Volver"
                    >
                        ⬅
                    </button>
                )}

                {/* Vista de éxito */}
                {isSuccess ? (
                    <div style={{ animation: 'scaleUp 0.4s ease-out' }}>
                        <div style={{
                            width: '90px', height: '90px', backgroundColor: '#E8F5E9', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px auto',
                            fontSize: '3rem', color: 'var(--color-primary)'
                        }}>
                            ✔️
                        </div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                            ¡Cuenta Activada!
                        </h2>
                        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px' }}>
                            Tu correo ha sido validado correctamente. 
                        </p>
                        <p style={{ color: '#888', fontSize: '0.95rem' }}>
                            Redirigiéndote a iniciar sesión...
                        </p>
                    </div>
                ) : (
                    <>
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
                        <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '30px', lineHeight: '1.6' }}>
                            Ingresa el código de 6 dígitos enviado a:<br />
                            <strong style={{ color: 'var(--color-secondary)' }}>{email}</strong>
                        </p>

                        <form onSubmit={handleTokenSubmit}>
                            <div style={{ marginBottom: '30px' }}>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    style={{ 
                                        width: '220px', padding: '15px', borderRadius: 'var(--radius-md)', 
                                        border: '2px solid var(--color-primary)', fontSize: '2.2rem', textAlign: 'center',
                                        letterSpacing: '6px', fontWeight: 'bold', color: 'var(--color-text)', outline: 'none'
                                    }} 
                                    required
                                    disabled={isValidating}
                                />
                            </div>

                            <button type="submit" disabled={isValidating} style={{
                                width: '100%', padding: '16px', backgroundColor: isValidating ? '#ccc' : 'var(--color-primary)', 
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
                    </>
                )}

            </div>
        </div>
    );
}

export default EmailVerification;
