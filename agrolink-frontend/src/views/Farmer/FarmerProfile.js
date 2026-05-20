import React, { useState, useRef } from 'react';
import { initialProfile } from '../../data/mockFarmerData';

const CERTIFICACIONES_DISPONIBLES = [
    'Certificación de Buenas Prácticas Agrícolas',
    'Certificación Orgánica Nacional',
    'Certificación de Comercio Justo',
    'Certificación de Agricultura Familiar',
    'Certificación GlobalG.A.P'
];

function FarmerProfile() {
    const fileInputRef = useRef(null);

    // Importamos los datos de localStorage o los pre-cargados
    const [profileData, setProfileData] = useState(() => {
        const saved = localStorage.getItem('agrolink_farmer_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return {
                    ...initialProfile,
                    ...parsed,
                    certificaciones: parsed.certificaciones || [],
                    certificacionesFotos: parsed.certificacionesFotos || {}
                };
            } catch (e) {
                console.error("Error al parsear agrolink_farmer_profile", e);
            }
        }
        return initialProfile;
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

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
    const handleCertToggle = (cert) => {
        const isEnabled = profileData.certificaciones.includes(cert);
        let nuevasCerts = [];
        let nuevasFotos = { ...profileData.certificacionesFotos };

        if (isEnabled) {
            nuevasCerts = profileData.certificaciones.filter(c => c !== cert);
            delete nuevasFotos[cert];
        } else {
            nuevasCerts = [...profileData.certificaciones, cert];
        }

        setProfileData({
            ...profileData,
            certificaciones: nuevasCerts,
            certificacionesFotos: nuevasFotos
        });
    };

    const handleCertPhotoChange = (cert, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    certificacionesFotos: {
                        ...prev.certificacionesFotos,
                        [cert]: reader.result
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCertPhotoRemove = (cert) => {
        const nuevasFotos = { ...profileData.certificacionesFotos };
        delete nuevasFotos[cert];
        setProfileData({
            ...profileData,
            certificacionesFotos: nuevasFotos
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
        localStorage.setItem('agrolink_farmer_profile', JSON.stringify(profileData));
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px', width: '100%', alignItems: 'start' }}>

                {/* COLUMNA 1: CUENTA Y SEGURIDAD (Dividida en dos tarjetas independientes) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* TARJETA 1: DATOS PERSONALES */}
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: 'var(--color-text)', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Cuenta y Datos Personales</h3>

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

                        <form onSubmit={handleProfileSubmit}>
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
                                fontWeight: 'bold', cursor: 'pointer', fontSize: '1.05rem', boxShadow: '0 4px 6px rgba(46, 125, 50, 0.2)', width: '100%'
                            }}>
                                Guardar Datos Personales
                            </button>
                        </form>
                    </div>

                    {/* TARJETA 2: SEGURIDAD (CONTRASEÑA) */}
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ color: 'var(--color-text)', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Seguridad y Contraseña</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Contraseña Actual</label>
                                <input type="password" name="currentPassword" required value={passwordData.currentPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Nueva Contraseña</label>
                                <input type="password" name="newPassword" required value={passwordData.newPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Confirmar Nueva Contraseña</label>
                                <input type="password" name="confirmNewPassword" required value={passwordData.confirmNewPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ccc', fontSize: '0.95rem' }} />
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

                {/* COLUMNA 2: PERFIL PROFESIONAL */}
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
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333', fontSize: '1.05rem' }}>
                                Certificaciones Oficiales
                            </label>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                                Habilita las certificaciones vigentes con las que cuentas y sube la foto de tu certificado para la verificación de los compradores.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {CERTIFICACIONES_DISPONIBLES.map((cert, index) => {
                                    const isEnabled = profileData.certificaciones.includes(cert);
                                    const foto = profileData.certificacionesFotos && profileData.certificacionesFotos[cert];

                                    return (
                                        <div key={index} style={{
                                            padding: '15px',
                                            backgroundColor: 'white',
                                            borderRadius: 'var(--radius-md)',
                                            border: isEnabled ? '1.5px solid var(--color-primary)' : '1px solid #ddd',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            {/* Fila del Título y Checkbox */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', color: isEnabled ? 'var(--color-primary)' : '#555', fontSize: '0.95rem' }}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isEnabled} 
                                                        onChange={() => handleCertToggle(cert)} 
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                                    />
                                                    {cert}
                                                </label>
                                                {isEnabled && (
                                                    <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '10px', backgroundColor: '#E8F5E9', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                                        Habilitada
                                                    </span>
                                                )}
                                            </div>

                                            {/* Fila de subida de fotos (si está habilitado) */}
                                            {isEnabled && (
                                                <div style={{
                                                    paddingTop: '10px',
                                                    borderTop: '1px dashed #eee',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '15px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {foto ? (
                                                        <>
                                                            <div style={{ position: 'relative' }}>
                                                                <img 
                                                                    src={foto} 
                                                                    alt="Certificado" 
                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid #ccc' }} 
                                                                />
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => handleCertPhotoRemove(cert)} 
                                                                    style={{
                                                                        position: 'absolute', top: '-6px', right: '-6px',
                                                                        backgroundColor: '#dc3545', color: 'white', border: 'none',
                                                                        borderRadius: '50%', width: '20px', height: '20px',
                                                                        cursor: 'pointer', fontSize: '10px', fontWeight: 'bold',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                                    }}
                                                                    title="Eliminar Foto"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                            <span style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: 'bold' }}>
                                                                ¡Foto subida con éxito!
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                id={`file-cert-${index}`} 
                                                                onChange={(e) => handleCertPhotoChange(cert, e)} 
                                                                style={{ display: 'none' }}
                                                            />
                                                            <label 
                                                                htmlFor={`file-cert-${index}`}
                                                                style={{
                                                                    backgroundColor: '#E8F5E9',
                                                                    border: '1px solid var(--color-primary)',
                                                                    color: 'var(--color-primary)',
                                                                    padding: '8px 16px',
                                                                    borderRadius: 'var(--radius-md)',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.85rem',
                                                                    fontWeight: 'bold',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    transition: '0.2s'
                                                                }}
                                                            >
                                                                📷 Subir Foto de Certificado
                                                            </label>
                                                            <span style={{ fontSize: '0.8rem', color: '#777', fontStyle: 'italic' }}>
                                                                Requiere formato de imagen (JPG, PNG)
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
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
