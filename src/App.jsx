import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PricingSection from './PricingSection';
import Asientos from './Asientos';
import Locacion from './Locacion';
import Agenda from './Agenda';
import Navbar from './Navbar';
import PanelAdmin from './PanelAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar solo aquí */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingSection />} />
          <Route path="/asientos" element={<Asientos />} />
          <Route path="/locacion" element={<Locacion />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/paneladmin" element={<PanelAdmin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
