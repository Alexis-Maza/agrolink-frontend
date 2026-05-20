import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor verifícalas.");
            return;
        }

        setIsUpdating(true);

        // Simulamos guardado en el backend
        setTimeout(() => {
            setIsUpdating(false);
            setIsSuccess(true);

            // Limpiamos los datos del proceso de restablecimiento
            localStorage.removeItem('agrolink_reset_email');
            localStorage.removeItem('agrolink_reset_token_validated');

            // Redirigir a inicio de sesión tras 2.5 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        }, 1800);
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
                textAlign: 'center',
                animation: 'fadeIn 0.5s ease-out'
            }}>

                {isSuccess ? (
                    <div style={{ animation: 'scaleUp 0.4s ease-out' }}>
                        <div style={{
                            width: '90px', height: '90px', backgroundColor: '#E8F5E9', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px auto',
                            fontSize: '3rem', color: 'var(--color-primary)'
                        }}>
                            🎉
                        </div>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '15px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                            ¡Actualización con Éxito!
                        </h2>
                        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px' }}>
                            Tu contraseña ha sido restablecida correctamente.
                        </p>
                        <p style={{ color: '#888', fontSize: '0.95rem' }}>
                            Redirigiéndote a la pantalla de inicio de sesión...
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                            Nueva Contraseña
                        </h2>
                        <p style={{ color: '#666', marginBottom: '35px', fontSize: '1.05rem', lineHeight: '1.5' }}>
                            Ingresa tu nueva contraseña y confírmala para actualizar tu acceso.
                        </p>

                        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                            
                            {/* Nueva Contraseña */}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Mínimo 6 caracteres"
                                    style={{ 
                                        width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                                        border: '1px solid #ccc', fontSize: '1rem', outline: 'none'
                                    }} 
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div style={{ marginBottom: '35px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Confirmar Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder="Repite la contraseña"
                                    style={{ 
                                        width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', 
                                        border: '1px solid #ccc', fontSize: '1rem', outline: 'none'
                                    }} 
                                    disabled={isUpdating}
                                />
                            </div>

                            {/* Botón de envío */}
                            <button type="submit" disabled={isUpdating} style={{
                                width: '100%', padding: '15px', backgroundColor: isUpdating ? '#ccc' : 'var(--color-primary)', 
                                color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 'bold', 
                                cursor: isUpdating ? 'default' : 'pointer', boxShadow: isUpdating ? 'none' : '0 4px 10px rgba(46, 125, 50, 0.2)', 
                                marginBottom: '15px', transition: '0.2s', textAlign: 'center'
                            }}>
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
