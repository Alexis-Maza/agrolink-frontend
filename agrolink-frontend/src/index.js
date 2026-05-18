import React from 'react';
import ReactDOM from 'react-dom/client';

/* Importación del diseño base (Afecta a todo el sitio y a Public) */
import './styles/theme.css';

/* Importación de las variaciones de estilo para cada rol */
import './styles/public.css';
import './styles/admin.css';
import './styles/farmer.css';
import './styles/buyer.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
