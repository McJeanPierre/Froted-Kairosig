import React from "react";
import { Link } from "react-router-dom";  // Importa Link
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
          <div className="navbarlogo">
            <img src="/LOGO.png" alt="Logo" className="logo-img" />
          </div>
          <ul className="navbar-links">
            <li><a href="#Inicio">INICIO</a></li>
            <li><a href="#planes" onClick={() => scrollToSection('pricing-section')}>PLANES</a></li>
            <li><a href="#Contacto" onClick={() => scrollToSection('contact')}>CONTACTO</a></li>
          </ul>
          {/* Cambiar el botón de Comprar a usar Link para ir a /asientos */}
          <Link to="/asientos">
            <button className="buy-button-navbar">COMPRAR ENTRADAS</button>
          </Link>
        </nav>
    );
}
const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

export default Navbar;
