import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de las vistas del proyecto
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Especialidades from './pages/Especialidades.jsx';
import CasosExito from './pages/CasosExito.jsx';
import Blog from './pages/Blog.jsx';

// Importación de estilos globales (Tailwind CSS)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Landing Page de la clínica en Piura */}
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="/casos-de-exito" element={<CasosExito />} />
        <Route path="/blog" element={<Blog />} />
        
        {/* Rutas Privadas y de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);