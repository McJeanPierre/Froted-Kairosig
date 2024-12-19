import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PricingSection from './PricingSection';
import Asientos from './Asientos';
import Locacion from './Locacion';
import Agenda from './Agenda';
import Navbar from './Navbar';
import PanelAdmin from './PanelAdmin';
import NotFound from './NotFound';
import { AuthProvider } from './AuthContext'; // Importar AuthProvider

function App() {
  return (
    <AuthProvider> {/* Envolver toda la app con AuthProvider */}
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas normales con Navbar */}
            <Route path="/" element={<><Navbar /><HomePage /></>} />
            <Route path="/pricing" element={<><Navbar /><PricingSection /></>} />
            <Route path="/asientos" element={<><Navbar /><Asientos /></>} />
            <Route path="/locacion" element={<><Navbar /><Locacion /></>} />
            <Route path="/agenda" element={<><Navbar /><Agenda /></>} />
            <Route path="/paneladmin" element={<><Navbar /><PanelAdmin /></>} />
            
            {/* Ruta para la página de error */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;