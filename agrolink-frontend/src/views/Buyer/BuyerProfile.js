import React, { useState, useRef, useEffect } from "react";
import {
  obtenerPerfil,
  actualizarDatosPersonales,
  actualizarPerfilComercial,
  cambiarPassword,
} from "../../api/compradorService";

function BuyerProfile() {
  const fileInputRef = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Estados para contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

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

  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

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

  // ← Guarda datos personales en el backend
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatosPersonales({
        nombres: profileData.nombres,
        apellidoPaterno: profileData.apellidoPaterno,
        fotoPerfil: avatarPreview || profileData.fotoPerfil,
      });
      alert("Datos personales actualizados correctamente");
    } catch (error) {
      alert("Error al actualizar los datos");
    }
  };

  // ← Guarda perfil comercial en el backend
  const handlePerfilComercialSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarPerfilComercial({
        dniRuc: profileData.dniRuc,
        tipoComprador: profileData.tipoComprador,
        telefono: profileData.telefono,
        ubicacion: profileData.ubicacion,
        direccionEntrega: profileData.direccionEntrega,
      });
      alert("Perfil comercial actualizado correctamente");
    } catch (error) {
      alert("Error al actualizar el perfil comercial");
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
    } catch (error) {
      setPasswordMsg({
        type: "error",
        text: "La contraseña actual es incorrecta.",
      });
    }
  };

  // Mostrar loading mientras carga
  if (loading) return <p>Cargando perfil...</p>;
  if (!profileData) return <p>Error cargando el perfil.</p>;

  const iniciales =
    `${profileData.nombres?.charAt(0) || ""}${profileData.apellidoPaterno?.charAt(0) || ""}`.toUpperCase();
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "var(--radius-md)",
    border: "1px solid #ccc",
    fontSize: "1rem",
    fontFamily: "inherit",
  };

  return (
    <div>
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
        Administra la información de tu cuenta y datos de facturación.
      </p>

      <div className="buyer-profile-grid">
        {/* COLUMNA 1: CUENTA Y SEGURIDAD */}
        <div
          className="buyer-profile-card"
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              color: "var(--color-text)",
              marginBottom: "20px",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Cuenta y Seguridad
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
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

          <form onSubmit={handleProfileSubmit} style={{ flex: 1 }}>
            <div className="buyer-profile-fields-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
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
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
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
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="buyer-profile-fields-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  disabled
                  value={profileData.email || ""}
                  style={{
                    ...inputStyle,
                    backgroundColor: "#f5f5f5",
                    color: "#777",
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
                marginBottom: "40px",
              }}
            >
              Guardar Datos Personales
            </button>
          </form>

          {/* SECCIÓN DE CONTRASEÑA */}
          <div style={{ borderTop: "2px dashed #eee", paddingTop: "20px" }}>
            <h4
              style={{
                color: "var(--color-text)",
                marginBottom: "15px",
                fontSize: "1.1rem",
              }}
            >
              Modificar Contraseña
            </h4>
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
              <div style={{ marginBottom: "15px" }}>
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
                <input
                  type="password"
                  name="currentPassword"
                  required
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={inputStyle}
                />
              </div>
              <div className="buyer-profile-fields-grid">
                <div>
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
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
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
                    Confirmar Nueva
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    style={inputStyle}
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

        {/* COLUMNA 2: PERFIL COMERCIAL */}
        <div
          className="buyer-profile-card"
          style={{
            backgroundColor: "white",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              color: "var(--color-text)",
              marginBottom: "20px",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Perfil Comercial
          </h3>
          <form onSubmit={handlePerfilComercialSubmit}>
            <div className="buyer-profile-fields-grid">
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  RUC / DNI
                </label>
                <input
                  type="text"
                  name="dniRuc"
                  value={profileData.dniRuc || ""}
                  onChange={handleProfileChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Tipo de Comprador
                </label>
                <input
                  type="text"
                  name="tipoComprador"
                  value={profileData.tipoComprador || ""}
                  onChange={handleProfileChange}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="telefono"
                value={profileData.telefono || ""}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Ubicación
              </label>
              <input
                type="text"
                name="ubicacion"
                value={profileData.ubicacion || ""}
                onChange={handleProfileChange}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Dirección de Entrega Principal
              </label>
              <textarea
                name="direccionEntrega"
                rows="3"
                value={profileData.direccionEntrega || ""}
                onChange={handleProfileChange}
                style={{ ...inputStyle, resize: "vertical" }}
              />
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
              Guardar Perfil Comercial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;
