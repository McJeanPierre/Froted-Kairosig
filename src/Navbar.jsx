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
            <li><a href="#Planes">PLANES</a></li>
            <li><a href="#Contacto">CONTACTO</a></li>
          </ul>
          <button className="buy-button"><a href="#Comprar">COMPRAR ENTRADAS</a></button>

        </nav>
    );
}

export default Navbar;