import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authService';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsUpdating(true);
        try {
            const token = localStorage.getItem('agrolink_reset_token');
            await resetPassword(token, password);

            localStorage.removeItem('agrolink_reset_email');
            localStorage.removeItem('agrolink_reset_token');

            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError('El código es inválido o expiró. Intenta de nuevo.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
            <div style={{ backgroundColor: 'white', padding: '45px', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px', textAlign: 'center' }}>

                {isSuccess ? (
                    <div>
                        <div style={{ width: '90px', height: '90px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px auto', fontSize: '3rem' }}>🎉</div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>¡Actualización con Éxito!</h2>
                        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px' }}>Tu contraseña ha sido restablecida correctamente.</p>
                        <p style={{ color: '#888', fontSize: '0.95rem' }}>Redirigiéndote a la pantalla de inicio de sesión...</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>Nueva Contraseña</h2>
                        <p style={{ color: '#666', marginBottom: '35px', fontSize: '1.05rem', lineHeight: '1.5' }}>Ingresa tu nueva contraseña para actualizar tu acceso.</p>

                        {error && (
                            <div style={{ backgroundColor: '#FFEBEE', color: '#d32f2f', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Nueva Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Mínimo 6 caracteres" 
                                        style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} 
                                        disabled={isUpdating} 
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
                                </div>
                            </div>
                            <div style={{ marginBottom: '35px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Confirmar Nueva Contraseña</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showConfirmPassword ? 'text' : 'password'} 
                                        required 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Repite la contraseña" 
                                        style={{ width: '100%', padding: '16px', paddingRight: '48px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} 
                                        disabled={isUpdating} 
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
                            </div>
                            <button type="submit" disabled={isUpdating} style={{ width: '100%', padding: '15px', backgroundColor: isUpdating ? '#ccc' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', cursor: isUpdating ? 'default' : 'pointer', marginBottom: '15px' }}>
                                {isUpdating ? '⏳ Guardando...' : '🔄 Actualizar Contraseña'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;