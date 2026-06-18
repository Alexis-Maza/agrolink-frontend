import React, { useState, useRef, useEffect } from "react";
import {
  obtenerPerfil,
  actualizarDatosPersonales,
  actualizarPerfilAgricola,
  cambiarPassword,
} from "../../api/agricultorService";

const CERTIFICACIONES_DISPONIBLES = [
  "Certificación de Buenas Prácticas Agrícolas",
  "Certificación Orgánica Nacional",
  "Certificación de Comercio Justo",
  "Certificación de Agricultura Familiar",
  "Certificación GlobalG.A.P",
];

function FarmerProfile() {
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [certificaciones, setCertificaciones] = useState([]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // ← Cargar datos del backend al montar el componente
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await obtenerPerfil();
        setProfileData(data);
        // ← Cargar la foto guardada en BD
        if (data.fotoPerfil) {
          setAvatarPreview(data.fotoPerfil);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarPerfil();
  }, []);

  const handleProfileChange = (e) => {
    let value = e.target.value;
    if (["nombres", "apellidoPaterno", "apellidoMaterno"].includes(e.target.name)) {
      value = value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]/g, "");
    } else if (e.target.name === "dniRuc") {
      value = value.replace(/[^0-9]/g, "");
    }
    setProfileData({ ...profileData, [e.target.name]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordMsg({ type: "", text: "" });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCertToggle = (cert) => {
    const isEnabled = certificaciones.includes(cert);
    if (isEnabled) {
      setCertificaciones(certificaciones.filter((c) => c !== cert));
    } else {
      setCertificaciones([...certificaciones, cert]);
    }
  };

  // ← Guarda datos personales en el backend
  const handleDatosPersonalesSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatosPersonales({
        nombres: profileData.nombres,
        apellidoPaterno: profileData.apellidoPaterno,
        apellidoMaterno: profileData.apellidoMaterno,
        edad: profileData.edad,
        fotoPerfil: avatarPreview || profileData.fotoPerfil,
      });
      alert("Datos personales actualizados correctamente");
    } catch (error) {
      alert("Error al actualizar los datos personales");
    }
  };

  // ← Guarda perfil agrícola en el backend
  const handlePerfilAgricolaSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarPerfilAgricola({
        descripcion: profileData.descripcion,
        dniRuc: profileData.dniRuc,
        ubicacion: profileData.ubicacion,
        hectareasTotales: profileData.hectareasTotales,
        anosExperiencia: profileData.anosExperiencia,
        certificaciones: certificaciones.join(", "), // ← convierte array a string
      });
      alert("Perfil agrícola actualizado correctamente");
    } catch (error) {
      alert("Error al actualizar el perfil agrícola");
    }
  };

  // ← Cambia contraseña en el backend
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMsg({
        type: "error",
        text: "Las nuevas contraseñas no coinciden.",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({
        type: "error",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    try {
      await cambiarPassword({
        passwordActual: passwordData.currentPassword,
        nuevaPassword: passwordData.newPassword,
        confirmarPassword: passwordData.confirmNewPassword,
      });
      setPasswordMsg({
        type: "success",
        text: "¡Contraseña actualizada correctamente!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    } catch (error) {
      setPasswordMsg({
        type: "error",
        text: "La contraseña actual es incorrecta.",
      });
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!profileData) return <p>Error cargando el perfil.</p>;

  const iniciales =
    `${profileData.nombres?.charAt(0) || ""}${profileData.apellidoPaterno?.charAt(0) || ""}`.toUpperCase();

  return (
    <div style={{ width: "100%" }}>
      <h2
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-titles)",
          marginBottom: "10px",
          fontSize: "2rem",
        }}
      >
        Mi Perfil
      </h2>
      <p style={{ color: "#555", fontSize: "1.1rem", marginBottom: "30px" }}>
        Administra los detalles de tu cuenta y la información visible para los
        compradores.
      </p>

      <div className="farmer-profile-grid-cols">
        {/* COLUMNA 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {/* TARJETA 1: DATOS PERSONALES */}
          <div className="farmer-profile-card">
            <h3
              style={{
                color: "var(--color-text)",
                marginBottom: "20px",
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Cuenta y Datos Personales
            </h3>

            <div className="farmer-profile-avatar-row">
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  backgroundImage: avatarPreview
                    ? `url(${avatarPreview})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "3px solid #E8F5E9",
                }}
              >
                {!avatarPreview && iniciales}
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    color: "var(--color-text)",
                    fontSize: "1.4rem",
                  }}
                >
                  {profileData.nombres} {profileData.apellidoPaterno}
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    backgroundColor: "#E8F5E9",
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-primary)",
                    padding: "8px 15px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  📷 Elegir Imagen
                </button>
              </div>
            </div>

            <form onSubmit={handleDatosPersonalesSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombres"
                  required
                  value={profileData.nombres || ""}
                  onChange={handleProfileChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="farmer-profile-row-grid">
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    required
                    value={profileData.apellidoPaterno || ""}
                    onChange={handleProfileChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    required
                    value={profileData.apellidoMaterno || ""}
                    onChange={handleProfileChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              </div>
              <div className="farmer-profile-row-grid" style={{ marginBottom: "30px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email || ""}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#f9f9f9",
                      color: "#888",
                      fontSize: "1rem",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  width: "100%",
                  boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
                }}
              >
                Guardar Datos Personales
              </button>
            </form>
          </div>

          {/* TARJETA 2: CONTRASEÑA */}
          <div className="farmer-profile-card">
            <h3
              style={{
                color: "var(--color-text)",
                marginBottom: "20px",
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Seguridad y Contraseña
            </h3>

            {passwordMsg.text && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "15px",
                  backgroundColor:
                    passwordMsg.type === "error" ? "#FFEBEE" : "#E8F5E9",
                  color: passwordMsg.type === "error" ? "#d32f2f" : "#2E7D32",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Contraseña Actual
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    required
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      paddingRight: "48px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #ccc",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    {showCurrentPassword ? (
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
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Nueva Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      paddingRight: "48px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #ccc",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    {showNewPassword ? (
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
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Confirmar Nueva Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      paddingRight: "48px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid #ccc",
                      fontSize: "0.95rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
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
                    {showConfirmNewPassword ? (
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
              <button
                type="submit"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  width: "100%",
                  boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
                }}
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA 2: PERFIL AGRÍCOLA */}
        <div className="farmer-profile-card">
          <h3
            style={{
              color: "var(--color-text)",
              marginBottom: "20px",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Perfil Agrícola
          </h3>

          <form onSubmit={handlePerfilAgricolaSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Acerca de mí (Máx. 500 caracteres)
              </label>
              <textarea
                name="descripcion"
                maxLength="500"
                rows="5"
                value={profileData.descripcion || ""}
                onChange={handleProfileChange}
                placeholder="Escribe algo sobre tu experiencia..."
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.85rem",
                  color: "#777",
                  marginTop: "5px",
                }}
              >
                {(profileData.descripcion || "").length} / 500
              </div>
            </div>

            <div className="farmer-profile-row-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  DNI o RUC
                </label>
                <input
                  type="text"
                  name="dniRuc"
                  value={profileData.dniRuc || ""}
                  onChange={handleProfileChange}
                  placeholder="Documento de identidad"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Ubicación del terreno
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={profileData.ubicacion || ""}
                  onChange={handleProfileChange}
                  placeholder="Ej. Piura, Perú"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div className="farmer-profile-row-grid" style={{ marginBottom: "30px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Hectáreas Totales
                </label>
                <input
                  type="number"
                  name="hectareasTotales"
                  value={profileData.hectareasTotales || ""}
                  onChange={handleProfileChange}
                  placeholder="Ej. 50"
                  min="0"
                  step="0.1"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Años de Experiencia
                </label>
                <input
                  type="number"
                  name="anosExperiencia"
                  value={profileData.anosExperiencia || ""}
                  onChange={handleProfileChange}
                  placeholder="Ej. 10"
                  min="0"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            {/* CERTIFICACIONES */}
            <div
              style={{
                marginBottom: "30px",
                padding: "20px",
                backgroundColor: "#F4F7F5",
                borderRadius: "var(--radius-md)",
                border: "1px solid #e0e0e0",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "1.05rem",
                }}
              >
                Certificaciones Oficiales
              </label>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                Habilita las certificaciones vigentes con las que cuentas.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {CERTIFICACIONES_DISPONIBLES.map((cert, index) => {
                  const isEnabled = certificaciones.includes(cert);
                  return (
                    <div
                      key={index}
                      style={{
                        padding: "15px",
                        backgroundColor: "white",
                        borderRadius: "var(--radius-md)",
                        border: isEnabled
                          ? "1.5px solid var(--color-primary)"
                          : "1px solid #ddd",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                          fontWeight: "500",
                          color: isEnabled ? "var(--color-primary)" : "#555",
                          fontSize: "0.95rem",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleCertToggle(cert)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "var(--color-primary)",
                          }}
                        />
                        {cert}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                border: "none",
                padding: "15px",
                borderRadius: "var(--radius-md)",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1.1rem",
                width: "100%",
                boxShadow: "0 4px 6px rgba(46, 125, 50, 0.2)",
              }}
            >
              Guardar Perfil Agrícola
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FarmerProfile;
