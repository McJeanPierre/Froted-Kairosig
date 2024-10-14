import React from "react";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
          <div className="navbarlogo">
            <img src="/LOGO.png" alt="Logo" className="logo-img" />
          </div>
          <ul className="navbar-links">
            <li><a href="#Inicio">INICIO</a></li>
            <li><a href="#planes" onClick={() => scrollToSection('pricing-section')}>PlANES</a></li>
            <li><a href="#Contacto" onClick={() => scrollToSection('contact')}>CONTACTO</a></li>
          </ul>
          <button className="buy-button-navbar"><a href="#Comprar">COMPRAR ENTRADAS</a></button>

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