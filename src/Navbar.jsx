import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importa Link
import "./Navbar.css";
import { useAuth } from './AuthContext'; // Importa el AuthContext
import Swal from "sweetalert2";

const Navbar = () => {
  const { logout } = useAuth(); // Usa el AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado local para autenticación

  useEffect(() => {
    // Verifica si el token existe en el localStorage al cargar el componente
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Actualiza el estado según si el token existe
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      window.location.reload(); // Recarga la página para reflejar cambios en el Navbar
    }
  };

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
        localStorage.removeItem('token'); // Eliminar el token de localStorage
        setIsAuthenticated(false); // Cambiar el estado de autenticación
        logout();
        Swal.fire("Sesión cerrada", "Has cerrado sesión exitosamente.", "success").then(() => {
          window.location.reload(); // Recarga la página para garantizar que todos los estados se reinicien
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
          // Si está autenticado, mostrar "Panel de Admin" y "Cerrar Sesión"
          <>
            <li className="navbar-item">
              <Link to="/paneladmin">PANEL ADMIN</Link>
            </li>
            <li className="navbar-item">
              <button className="logout-button" onClick={handleLogout}>CERRAR SESIÓN</button>
            </li>
          </>
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
