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
  const [apellidoComprador, setApellidoComprador] = useState('');
  const [cedulaComprador, setCedulaComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);

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
    setNombreComprador(asiento.cliente_nombre || '');
    setApellidoComprador(asiento.cliente_apellido || '');
    setCedulaComprador(asiento.cliente_cedula || '');
    setEmailComprador(asiento.cliente_email || '');
    setMetodoPago(asiento.metodo_pago || ''); // Mostrar el método de pago
    setQrCode(asiento.codigo_qr ? asiento.codigo_qr : null);
    setImagenComprobante(asiento.imagen || null); // Cargar la imagen desde la base de datos
  };
  

  const manejarCargaImagen = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenComprobante(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, suba un archivo de imagen válido.');
      setImagenComprobante(null);
    }
  };


  const guardarCambios = async () => {
    if (asientoSeleccionado) {
      try {
        const response = await axios.put(`http://localhost:5000/api/asientos/${asientoSeleccionado.asiento_id}`, {
          disponible: false,
          nombre: nombreComprador,
          apellido: apellidoComprador,
          cedula: cedulaComprador,
          email: emailComprador,
          imagen: imagenComprobante,  // Cambia 'comprobante' a 'imagen'
          metodo_pago: "Deposito"
        });
  
        const updatedAsiento = response.data;
  
        // Recargar la lista de asientos desde el servidor para asegurar que todos los datos están actualizados
        const responseAsientos = await axios.get('http://localhost:5000/api/asientos');
        setAsientos(responseAsientos.data);
  
        // Actualizar el asiento seleccionado con los datos más recientes
        setAsientoSeleccionado(updatedAsiento);
  
        setQrCode(updatedAsiento.codigo_qr);
        alert('Datos actualizados, QR generado y comprobante de depósito guardado.');
      } catch (error) {
        console.error('Error al actualizar el asiento:', error);
        alert('Hubo un problema al guardar los cambios.');
      }
    }
  };
  

const marcarComoDisponible = async () => {
  if (asientoSeleccionado) {
    try {
      const response = await axios.put(`http://localhost:5000/api/asientos/${asientoSeleccionado.asiento_id}/disponible`);
      
      const updatedAsiento = response.data;

      // Actualizar la lista de asientos para reflejar el cambio de disponibilidad en el estado general
      setAsientos(prevAsientos =>
        prevAsientos.map(asiento =>
          asiento.asiento_id === updatedAsiento.asiento_id
            ? { ...asiento, disponible: true, cliente_nombre: '', cliente_apellido: '', cliente_cedula: '', cliente_email: '', metodo_pago: '', imagen: null }
            : asiento
        )
      );

      // Limpia el formulario y el asiento seleccionado
      setAsientoSeleccionado(null);
      setNombreComprador('');
      setApellidoComprador('');
      setCedulaComprador('');
      setEmailComprador('');
      setMetodoPago('');
      setQrCode(null);
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
              <input type="text" placeholder="Nombre del Comprador" value={nombreComprador} onChange={(e) => setNombreComprador(e.target.value)} />
              <input type="text" placeholder="Apellido del Comprador" value={apellidoComprador} onChange={(e) => setApellidoComprador(e.target.value)} />
              <input type="text" placeholder="Cédula del Comprador" value={cedulaComprador} onChange={(e) => setCedulaComprador(e.target.value)} />
              <input type="email" placeholder="Correo Electrónico del Comprador" value={emailComprador} onChange={(e) => setEmailComprador(e.target.value)} />
              <input type="text" placeholder="Método de Pago" value={metodoPago} disabled />
              <div className="file-input">
                <input type="file" accept="image/*" onChange={manejarCargaImagen} id="comprobante" />
                <label htmlFor="comprobante">Seleccionar archivo</label>
                <span>{imagenComprobante ? 'Archivo seleccionado' : 'Ningún archivo seleccionado'}</span>
              </div>
              {imagenComprobante && (
                <div className="imagen-preview">
                  <img src={imagenComprobante} alt="Comprobante seleccionado" />
                </div>
              )}
              {qrCode && (
                <div className="qr-code">
                  <h3>Código QR:</h3>
                  <img src={qrCode} alt="Código QR del Asiento" />
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
