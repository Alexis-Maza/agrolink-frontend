import React, { useState, useRef } from 'react';

function FarmerProfile() {
    const fileInputRef = useRef(null);

    // Simulamos datos pre-cargados del usuario
    const [profileData, setProfileData] = useState({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
        email: 'juan.perez@example.com',
        fechaNacimiento: '1985-05-15',
        descripcion: '',
        ubicacion: '',
        documentoIdentidad: '',
        hectareas: '',
        experiencia: '',
        certificaciones: [] // Array para guardar las certificaciones
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [nuevaCertificacion, setNuevaCertificacion] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // --- Manejo de Certificaciones ---
    const agregarCertificacion = (e) => {
        e.preventDefault();
        if (nuevaCertificacion.trim() !== '') {
            setProfileData({
                ...profileData,
                certificaciones: [...profileData.certificaciones, nuevaCertificacion.trim()]
            });
            setNuevaCertificacion('');
        }
    };

    const eliminarCertificacion = (index) => {
        const nuevasCertificaciones = profileData.certificaciones.filter((_, i) => i !== index);
        setProfileData({
            ...profileData,
            certificaciones: nuevasCertificaciones
        });
    };
    // ---------------------------------

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        console.log("Datos de perfil actualizados:", profileData);
        alert("¡Perfil actualizado correctamente!");
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert("Las nuevas contraseñas no coinciden.");
            return;
        }
        console.log("Solicitud de cambio de contraseña enviada");
        alert("Contraseña actualizada correctamente.");
    };

    // Generar iniciales para el avatar por defecto
    const iniciales = `${profileData.nombre.charAt(0)}${profileData.apellidoPaterno.charAt(0)}`.toUpperCase();

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-titles)', marginBottom: '10px', fontSize: '2rem' }}>
                Mi Perfil
            </h2>
            <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
                Administra los detalles de tu cuenta y la información visible para los compradores.
            </p>

            {/* Layout de 2 columnas responsivo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', width: '100%' }}>

                {/* COLUMNA 1: CUENTA Y SEGURIDAD (Datos de registro y contraseña unidos) */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--color-text)', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Cuenta y Seguridad</h3>

                    {/* Encabezado con Avatar interactivo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div style={{
                            width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 'bold',
                            backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid #E8F5E9'
                        }}>
                            {!avatarPreview && iniciales}
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '1.4rem' }}>{profileData.nombre} {profileData.apellidoPaterno}</h3>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
                            <button type="button" onClick={handleAvatarClick} style={{
                                backgroundColor: '#E8F5E9', border: '1px solid var(--color-primary)', color: 'var(--color-primary)',
                                padding: '8px 15px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', transition: '0.2s'
                            }}>
                                📷 Elegir Imagen
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} style={{ flex: 1 }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Nombre</label>
                            <input type="text" name="nombre" required value={profileData.nombre} onChange={handleProfileChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Apellido Paterno</label>
                                <input type="text" name="apellidoPaterno" required value={profileData.apellidoPaterno} onChange={handleProfileChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Apellido Materno</label>
                                <input type="text" name="apellidoMaterno" required value={profileData.apellidoMaterno} onChange={handleProfileChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Correo Electrónico</label>
                                <input type="email" name="email" disabled value={profileData.email} style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', backgroundColor: '#f9f9f9', color: '#888', fontSize: '1rem', cursor: 'not-allowed' }} title="No modificable" />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Fecha de Nacimiento</label>
                                <input type="date" name="fechaNacimiento" disabled value={profileData.fechaNacimiento} style={{ width: '100%', padding: '11px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0', backgroundColor: '#f9f9f9', color: '#888', fontSize: '1rem', fontFamily: 'inherit', cursor: 'not-allowed' }} title="No modificable" />
                            </div>
                        </div>

                        <button type="submit" style={{
                            backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '14px', borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)', width: '100%', marginBottom: '40px'
                        }}>
                            Guardar Datos Personales
                        </button>
                    </form>

                    {/* Subsección de contraseña dentro de la misma tarjeta */}
                    <div style={{ borderTop: '2px dashed #eee', paddingTop: '20px' }}>
                        <h4 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.1rem' }}>Modificar Contraseña</h4>
                        <form onSubmit={handlePasswordSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Contraseña Actual</label>
                                <input type="password" name="currentPassword" required value={passwordData.currentPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Nueva Contraseña</label>
                                    <input type="password" name="newPassword" required value={passwordData.newPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Confirmar Nueva</label>
                                    <input type="password" name="confirmNewPassword" required value={passwordData.confirmNewPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
                                </div>
                            </div>
                            <button type="submit" style={{
                                backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '14px',
                                borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', width: '100%',
                                boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)'
                            }}>
                                Actualizar Contraseña
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA 2: PERFIL PROFESIONAL (Datos agrícolas nuevos) */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: 'var(--color-text)', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Perfil Agrícola</h3>

                    <form onSubmit={handleProfileSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Acerca de mí (Máx. 500 caracteres)</label>
                            <textarea name="descripcion" maxLength="500" rows="5" value={profileData.descripcion} onChange={handleProfileChange} placeholder="Escribe algo sobre tu experiencia y pasión por el cultivo..." style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }} />
                            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#777', marginTop: '5px' }}>{profileData.descripcion.length} / 500</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>DNI o RUC</label>
                                <input type="text" name="documentoIdentidad" value={profileData.documentoIdentidad} onChange={handleProfileChange} placeholder="Documento de identidad" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Ubicación del terreno</label>
                                <input type="text" name="ubicacion" value={profileData.ubicacion} onChange={handleProfileChange} placeholder="Ej. Piura, Perú" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Hectáreas Totales</label>
                                <input type="number" name="hectareas" value={profileData.hectareas} onChange={handleProfileChange} placeholder="Ej. 50" min="0" step="0.1" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Años de Experiencia</label>
                                <input type="number" name="experiencia" value={profileData.experiencia} onChange={handleProfileChange} placeholder="Ej. 10" min="0" style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                            </div>
                        </div>

                        {/* SECCIÓN DE CERTIFICACIONES */}
                        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#F4F7F5', borderRadius: 'var(--radius-md)', border: '1px solid #e0e0e0' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>Mis Certificaciones (Ej. Orgánico, Global GAP)</label>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <input type="text" value={nuevaCertificacion} onChange={(e) => setNuevaCertificacion(e.target.value)} placeholder="Añade una certificación..." style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '1rem' }} />
                                <button onClick={agregarCertificacion} style={{ backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', padding: '0 20px', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer' }}>
                                    + Agregar
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '35px' }}>
                                {profileData.certificaciones.length === 0 ? (
                                    <span style={{ color: '#888', fontSize: '0.9rem', fontStyle: 'italic', alignSelf: 'center' }}>Aún no has agregado certificaciones.</span>
                                ) : (
                                    profileData.certificaciones.map((cert, index) => (
                                        <div key={index} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white',
                                            border: '1px solid var(--color-primary)', padding: '6px 12px', borderRadius: '20px',
                                            color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            {cert}
                                            <button type="button" onClick={() => eliminarCertificacion(index)} style={{
                                                background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer',
                                                fontSize: '1.2rem', lineHeight: '1', padding: '0 0 2px 0', marginLeft: '4px'
                                            }}>
                                                &times;
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <button type="submit" style={{
                            backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '15px', borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)', width: '100%'
                        }}>
                            Guardar Perfil Agrícola
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default FarmerProfile;
