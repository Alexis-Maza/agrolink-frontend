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
import EmailVerification from './views/Auth/EmailVerification';
import ForgotPassword from './views/Auth/ForgotPassword';
import VerifyResetToken from './views/Auth/VerifyResetToken';
import ResetPassword from './views/Auth/ResetPassword';

function App() {
  return (
    <Router>
      {/* Definición de las rutas del proyecto */}
      <Routes>
        {/* Ruta de la Landing Page Pública */}
        <Route path="/" element={<PublicHome />} />

        {/* Rutas de Autenticación */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-token" element={<VerifyResetToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas de los paneles privados */}
        <Route path="/admin/*" element={<AdminHome />} />
        <Route path="/farmer/*" element={<FarmerHome />} />
        
        {/* AQUÍ ESTÁ EL CAMBIO: Se agregó el /* al final de /buyer */}
        <Route path="/buyer/*" element={<BuyerHome />} />
      </Routes>
    </Router>
  );
}

export default App;