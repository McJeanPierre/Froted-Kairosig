import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';
import { useAuth } from './AuthContext'; // Importar AuthContext

export default function PanelAdmin() {
  const { isAuthenticated, login } = useAuth(); // Usar AuthContext para manejar la autenticación
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [asientos, setAsientos] = useState([]);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [nombreComprador, setNombreComprador] = useState('');
  const [cedulaComprador, setCedulaComprador] = useState('');
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // Cargar los asientos al montar el componente
  useEffect(() => {
    const loadSeatsFromStorage = () => {
      const asientosGuardados = localStorage.getItem('seats');
      if (asientosGuardados) {
        setAsientos(JSON.parse(asientosGuardados));
      } else {
        const asientosIniciales = Array.from({ length: 300 }, (_, index) => ({
          id: index + 1,
          ocupado: false,
          comprador: null,
          cedula: null,
          comprobante: null
        }));
        setAsientos(asientosIniciales);
        localStorage.setItem('seats', JSON.stringify(asientosIniciales)); // Inicializar asientos en localStorage
      }
    };

    loadSeatsFromStorage();

    const handleStorageChange = () => {
      const asientosGuardados = localStorage.getItem('seats');
      if (asientosGuardados) {
        setAsientos(JSON.parse(asientosGuardados)); // Actualizar el estado si cambian los asientos
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const syncSeats = (updatedSeats) => {
    localStorage.setItem('seats', JSON.stringify(updatedSeats));
    setAsientos(updatedSeats); // Asegurarse de que el estado se actualice inmediatamente
  };

  const manejarInicioSesion = (e) => {
    e.preventDefault();
    if (nombreUsuario === 'Admin' && contraseña === 'Admin') {
      login();
    } else {
      alert('Credenciales inválidas');
    }
  };

  const manejarClicAsiento = (asiento) => {
    setAsientoSeleccionado(asiento);
    setNombreComprador(asiento.comprador || '');
    setCedulaComprador(asiento.cedula || '');
    setImagenComprobante(asiento.comprobante || null);
  };

  const manejarCargaImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenComprobante(reader.result); // Guardar la imagen en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarCambios = () => {
    if (asientoSeleccionado) {
      const asientosActualizados = asientos.map(asiento => 
        asiento.id === asientoSeleccionado.id 
          ? { 
              ...asiento, 
              ocupado: !!nombreComprador, 
              comprador: nombreComprador || null,
              cedula: cedulaComprador || null,
              comprobante: imagenComprobante
            }
          : asiento
      );
      syncSeats(asientosActualizados); // Actualizar en localStorage y en el estado
      setAsientoSeleccionado(null);
      setNombreComprador('');
      setCedulaComprador('');
      setImagenComprobante(null);
    }
  };

  // Si el usuario no está autenticado, mostrar la pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Inicio de Sesión Admin</h2>
          <form onSubmit={manejarInicioSesion}>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1 className="panel-title">Panel de Control - Gestión de Asientos</h1>
      <div className="panel-content">
        <div className="seat-map">
          <div className="seat-grid-container">
            {[0, 1].map((side) => (
              <div key={side} className="seat-grid">
                {asientos.slice(side * 150, (side + 1) * 150).map((asiento) => (
                  <button
                    key={asiento.id}
                    onClick={() => manejarClicAsiento(asiento)}
                    className={`seat ${
                      asiento.ocupado
                        ? 'seat-occupied'
                        : asiento.id === asientoSeleccionado?.id
                        ? 'seat-selected'
                        : 'seat-available'
                    }`}
                  >
                    {asiento.id}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="stage"></div>
        </div>
        <div className="client-form">
          {asientoSeleccionado ? (
            <>
              <h2>Asiento {asientoSeleccionado.id}</h2>
              <input
                type="text"
                placeholder="Nombre del Comprador"
                value={nombreComprador}
                onChange={(e) => setNombreComprador(e.target.value)}
              />
              <input
                type="text"
                placeholder="Cédula del Comprador"
                value={cedulaComprador}
                onChange={(e) => setCedulaComprador(e.target.value)}
              />
              <div className="file-input">
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCargaImagen}
                  id="comprobante"
                />
                <label htmlFor="comprobante">Seleccionar archivo</label>
                <span>{imagenComprobante ? 'Archivo seleccionado' : 'Ningún archivo seleccionado'}</span>
              </div>
              {imagenComprobante && (
                <div className="imagen-preview">
                  <img src={imagenComprobante} alt="Comprobante seleccionado" />
                </div>
              )}
              <button onClick={guardarCambios} className="guardar-cambios">Guardar Cambios</button>
            </>
          ) : (
            <p>Seleccione un asiento para ver los detalles</p>
          )}
        </div>
      </div>
    </div>
  );
}
