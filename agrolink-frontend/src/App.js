import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* Importamos las vistas principales */
import PublicHome from './views/Public/PublicHome';
import AdminHome from './views/Admin/AdminHome';
import FarmerHome from './views/Farmer/FarmerHome';
import BuyerHome from './views/Buyer/BuyerHome';

/* Vista de Autenticación */
import Register from './views/Auth/Register';
import Login from './views/Auth/Login';

function App() {
  return (
    <Router>


      {/* Definición de las rutas del proyecto */}
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Ruta de la Landing Page Pública */}
          <Route path="/" element={<PublicHome />} />

          {/* NUEVA RUTA ACTIVA: Formulario de registro multi-rol */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas de los paneles privados */}
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/farmer/*" element={<FarmerHome />} />
          <Route path="/buyer" element={<BuyerHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;