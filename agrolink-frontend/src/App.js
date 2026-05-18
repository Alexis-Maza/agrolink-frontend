import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

/* Importamos las vistas (Home) que creaste en el paso anterior */
import PublicHome from './views/Public/PublicHome';
import AdminHome from './views/Admin/AdminHome';
import FarmerHome from './views/Farmer/FarmerHome';
import BuyerHome from './views/Buyer/BuyerHome';

function App() {
  return (
    <Router>
      {/* Barra de navegación temporal para que puedas probar 
        fácilmente que los estilos cambian al dar clic.
      */}
      <nav style={{ padding: '16px', background: '#e0e0e0', display: 'flex', gap: '15px' }}>
        <Link to="/">Inicio Público</Link>
        <Link to="/admin">Panel Admin</Link>
        <Link to="/farmer">Panel Farmer</Link>
        <Link to="/buyer">Panel Buyer</Link>
      </nav>

      {/* Definición de las rutas del proyecto */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/farmer" element={<FarmerHome />} />
          <Route path="/buyer" element={<BuyerHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;