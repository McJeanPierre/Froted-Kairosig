import React from "react";
import { Link } from "react-router-dom"; // Importa Link
import "./Navbar.css";
import { useAuth } from './AuthContext'; // Importa el AuthContext

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Usa el AuthContext

  return (
    <nav className="navbar">
      <div className="navbarlogo">
        <img src="/LOGO.png" alt="Logo" className="logo-img" />
      </div>
      <ul className="navbar-links">
        {!isAuthenticated ? (
          <>
            <li><a href="#Inicio">INICIO</a></li>
            <li><a href="#planes" onClick={() => scrollToSection('pricing-section')}>PLANES</a></li>
            <li><a href="#Contacto" onClick={() => scrollToSection('contact')}>CONTACTO</a></li>
          </>
        ) : (
          // Si está autenticado, solo mostrar "Cerrar Sesión"
          <li>
            <button className="logout-button" onClick={logout}>CERRAR SESIÓN</button>
          </li>
        )}
      </ul>
      {/* Mostrar el botón de "Comprar Entradas" solo si no está autenticado */}
      {!isAuthenticated && (
        <Link to="/asientos">
          <button className="buy-button-navbar">COMPRAR ENTRADAS</button>
        </Link>
      )}
    </nav>
  );
};

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default Navbar;
