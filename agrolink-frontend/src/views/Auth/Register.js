import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
    // Estado actualizado: Cambiamos 'edad' por 'fechaNacimiento'
    const [formData, setFormData] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        fechaNacimiento: '', // Ahora almacenará la fecha completa (AAAA-MM-DD)
        password: '',
        confirmPassword: '',
        rol: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleSelect = (selectedRole) => {
        setFormData({
            ...formData,
            rol: selectedRole
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, verifícalas.");
            return;
        }

        if (!formData.rol) {
            alert("Por favor, selecciona si deseas ser Agricultor o Comprador.");
            return;
        }

        console.log("Datos optimizados para Spring Boot DTO:", formData);
        alert("Formulario validado con éxito. ¡Listo para enviar al backend!");
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 20px' // Más espacio en los bordes de la pantalla
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '45px', // Más aire interno en la tarjeta
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', // Sombra más suave y moderna
                width: '100%',
                maxWidth: '580px'
            }}>

                {/* Encabezado */}
                <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '10px', fontFamily: 'var(--font-titles)', fontSize: '2.2rem' }}>
                    Crea tu Cuenta en AgroLink
                </h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '35px', fontSize: '1.05rem' }}>
                    Únete al mercado de futuros agrícolas más transparente.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Fila: Nombre (Aumentamos marginBottom a 25px para separar las secciones) */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Nombre</label>
                        <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                    </div>

                    {/* Fila: Apellidos */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Apellido Paterno</label>
                            <input type="text" name="apellidoPaterno" required value={formData.apellidoPaterno} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Apellido Materno</label>
                            <input type="text" name="apellidoMaterno" required value={formData.apellidoMaterno} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* Fila: Email y Fecha de Nacimiento (Calendario Integrado) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px', marginBottom: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>
                        <div>
                            {/* CAMBIO CLAVE: Usamos type="date" para habilitar el selector de año, mes y día */}
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Fecha de Nacimiento</label>
                            <input type="date" name="fechaNacimiento" required value={formData.fechaNacimiento} onChange={handleChange} style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit' }} />
                        </div>
                    </div>

                    {/* Fila: Contraseñas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Contraseña</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#333' }}>Confirmar Contraseña</label>
                            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>
                    </div>

                    {/* SECTOR: SELECCIÓN DE ROL */}
                    <div style={{ marginBottom: '35px' }}>
                        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', color: '#333', fontSize: '1.05rem' }}>¿Cuál será tu rol en la plataforma?</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                            <button type="button" onClick={() => handleRoleSelect('FARMER')} style={{
                                padding: '18px 15px',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                border: formData.rol === 'FARMER' ? '2px solid var(--color-primary)' : '1px solid #ccc',
                                backgroundColor: formData.rol === 'FARMER' ? '#E8F5E9' : 'white',
                                color: formData.rol === 'FARMER' ? 'var(--color-primary)' : '#555',
                                transition: 'all 0.2s ease',
                                boxShadow: formData.rol === 'FARMER' ? '0 4px 8px rgba(46,125,50,0.15)' : 'none'
                            }}>
                                🌾 Soy Agricultor <br />
                                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px', color: formData.rol === 'FARMER' ? 'var(--color-primary)' : '#777' }}>Quiero publicar mis cultivos</span>
                            </button>

                            <button type="button" onClick={() => handleRoleSelect('BUYER')} style={{
                                padding: '18px 15px',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                border: formData.rol === 'BUYER' ? '2px solid var(--color-secondary)' : '1px solid #ccc',
                                backgroundColor: formData.rol === 'BUYER' ? '#FFF3E0' : 'white',
                                color: formData.rol === 'BUYER' ? 'var(--color-secondary)' : '#555',
                                transition: 'all 0.2s ease',
                                boxShadow: formData.rol === 'BUYER' ? '0 4px 8px rgba(255,152,0,0.15)' : 'none'
                            }}>
                                🛒 Soy Comprador <br />
                                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block', marginTop: '6px', color: formData.rol === 'BUYER' ? 'var(--color-secondary)' : '#777' }}>Quiero comprar de antemano</span>
                            </button>

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
                        Registrarse
                    </button>

                    {/* Enlace para volver */}
                    <p style={{ textAlign: 'center', margin: 0, color: '#666', fontSize: '0.95rem' }}>
                        ¿Ya tienes una cuenta? <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>Inicia Sesión</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Register;