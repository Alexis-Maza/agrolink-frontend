import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* Importamos las vistas principales */
import PublicHome from './views/Public/PublicHome';
import AdminHome from './views/Admin/AdminHome';
import FarmerHome from './views/Farmer/FarmerHome';
import BuyerHome from './views/Buyer/BuyerHome';

/* Vista de Autenticación */
import Register from './views/Auth/Register';

function App() {
  return (
    <Router>
      {/* Barra de navegación temporal de desarrollo.
        Mantiene el acceso rápido a los paneles mientras trabajamos.
      */}
      <nav style={{ padding: '16px', background: '#e0e0e0', display: 'flex', gap: '15px' }}>
        <Link to="/">Inicio Público</Link>
        <Link to="/register">Registro</Link>
        <Link to="/admin">Panel Admin</Link>
        <Link to="/farmer">Panel Farmer</Link>
        <Link to="/buyer">Panel Buyer</Link>
      </nav>

      {/* Definición de las rutas del proyecto */}
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Ruta de la Landing Page Pública */}
          <Route path="/" element={<PublicHome />} />

          {/* NUEVA RUTA ACTIVA: Formulario de registro multi-rol */}
          <Route path="/register" element={<Register />} />

          {/* Rutas de los paneles privados */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/farmer" element={<FarmerHome />} />
          <Route path="/buyer" element={<BuyerHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;