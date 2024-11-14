import React from "react";
import { Link } from "react-router-dom"; // Importa Link
import "./Navbar.css";
import { useAuth } from './AuthContext'; // Importa el AuthContext
import Swal from "sweetalert2";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Usa el AuthContext

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que deseas cerrar sesión?",
      text: "Tu sesión actual se cerrará y tendrás que iniciar sesión nuevamente para acceder.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Cerrado!",
          text: "Has cerrado sesión exitosamente.",
          icon: "success"
        }).then(() => {
          logout(); // Llama a la función logout del contexto de autenticación
        });
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
          // Si está autenticado, solo mostrar "Cerrar Sesión"
          <li className="navbar-item">
            <button className="logout-button" onClick={handleLogout}>CERRAR SESIÓN</button>
          </li>
        )}
      </ul>
      {/* Mostrar el botón de "Comprar Entradas" solo si no está autenticado */}
      {!isAuthenticated && (
        <Link to="/asientos">
          <button className="buy-button-navbar navbar-item">COMPRAR ENTRADAS</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;