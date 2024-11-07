import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function PanelAdmin() {
  const { isAuthenticated, login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [asientos, setAsientos] = useState([]);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [nombreComprador, setNombreComprador] = useState('');
  const [cedulaComprador, setCedulaComprador] = useState('');
  const [imagenComprobante, setImagenComprobante] = useState(null);

  // Cargar los asientos desde el backend al montar el componente
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/asientos');
        setAsientos(response.data);
      } catch (error) {
        console.error('Error al cargar los asientos:', error);
      }
    };

    fetchSeats();
  }, []);

  const manejarInicioSesion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email: nombreUsuario,
        contraseña: contraseña
      });
      if (response.data.success) {
        login();
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('Error en el inicio de sesión');
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
        setImagenComprobante(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarCambios = async () => {
    if (asientoSeleccionado) {
      try {
        // Actualizar el estado del asiento en el backend
        await axios.put(`http://localhost:5000/api/asientos/${asientoSeleccionado.asiento_id}`, {
          disponible: !nombreComprador, // Si hay un comprador, el asiento se marca como no disponible
        });

        // Actualizar el estado localmente después de la actualización exitosa
        const asientosActualizados = asientos.map(asiento =>
          asiento.asiento_id === asientoSeleccionado.asiento_id
            ? {
                ...asiento,
                disponible: !nombreComprador,
                comprador: nombreComprador || null,
                cedula: cedulaComprador || null,
                comprobante: imagenComprobante
              }
            : asiento
        );

        setAsientos(asientosActualizados);
        setAsientoSeleccionado(null);
        setNombreComprador('');
        setCedulaComprador('');
        setImagenComprobante(null);
      } catch (error) {
        console.error('Error al actualizar el asiento:', error);
        alert('Hubo un problema al guardar los cambios.');
      }
    }
  };

  const marcarComoDisponible = async () => {
    if (asientoSeleccionado) {
      try {
        // Marca el asiento como disponible en el backend
        await axios.put(`http://localhost:5000/api/asientos/${asientoSeleccionado.asiento_id}`, {
          disponible: true
        });

        // Actualiza el estado localmente después de la actualización exitosa
        const asientosActualizados = asientos.map(asiento =>
          asiento.asiento_id === asientoSeleccionado.asiento_id
            ? { ...asiento, disponible: true, comprador: null, cedula: null, comprobante: null }
            : asiento
        );

        setAsientos(asientosActualizados);
        setAsientoSeleccionado(null);
        setNombreComprador('');
        setCedulaComprador('');
        setImagenComprobante(null);
        alert('Asiento marcado como disponible nuevamente.');
      } catch (error) {
        console.error('Error al marcar el asiento como disponible:', error);
        alert('Hubo un problema al actualizar la disponibilidad del asiento.');
      }
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
              placeholder="Correo Electrónico"
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
                    key={asiento.asiento_id}
                    onClick={() => manejarClicAsiento(asiento)}
                    className={`seat ${
                      !asiento.disponible
                        ? 'seat-occupied'
                        : asiento.asiento_id === asientoSeleccionado?.asiento_id
                        ? 'seat-selected'
                        : 'seat-available'
                    }`}
                  >
                    {asiento.asiento_numero}
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
              <h2>Asiento {asientoSeleccionado.asiento_numero}</h2>
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
              <button onClick={marcarComoDisponible} className="marcar-disponible">Marcar como Disponible</button>
            </>
          ) : (
            <p>Seleccione un asiento para ver los detalles</p>
          )}
        </div>
      </div>
    </div>
  );
}
