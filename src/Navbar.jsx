import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from './AuthContext';
import Swal from "sweetalert2";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire("Sesión cerrada", "Has cerrado sesión exitosamente.", "success");
      }
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/LOGO.png" alt="Logo" className="logo-img" />
        </Link>
      </div>
      <ul className="navbar-links">
        {!isAuthenticated ? (
          <>
            <li className="navbar-item">
              <Link to="/" onClick={() => scrollToSection('Inicio')}>INICIO</Link>
            </li>
            <li className="navbar-item">
              <Link to="/" onClick={() => scrollToSection('pricing-section')}>PLANES</Link>
            </li>
            <li className="navbar-item">
              <Link to="/" onClick={() => scrollToSection('contact')}>CONTACTO</Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <Link to="/paneladmin">
                <button className="admin-button">PANEL ADMIN</button>
              </Link>
            </li>
            <li className="navbar-item">
              <button className="logout-button" onClick={handleLogout}>CERRAR SESIÓN</button>
            </li>
          </>
        )}
      </ul>
      {!isAuthenticated && (
        <Link to="/asientos">
          <button className="buy-button-navbar navbar-item">COMPRAR ENTRADAS</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;