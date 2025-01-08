import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';
import { useAuth } from './AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

export default function PanelAdmin() {
  const { isAuthenticated, login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContraseña] = useState('');
  const [asientos, setAsientos] = useState([]);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [nombreComprador, setNombreComprador] = useState('');
  const [apellidoComprador, setApellidoComprador] = useState('');
  const [cedulaComprador, setCedulaComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [imagenComprobante, setImagenComprobante] = useState(null);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await api.get('/asientos');
        setAsientos(response.data);
      } catch (error) {
        console.error('Error al cargar los asientos:', error);
      }
    };

    fetchSeats();
  }, []);

  const manejarInicioSesion = async (e) => {
    e.preventDefault();

    if (!nombreUsuario || !contrasena) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingrese tanto el correo electrónico como la contraseña.",
      });
      return;
    }

    try {
      const response = await api.post('/admin/login', {
        email: nombreUsuario,
        contrasena: contrasena
      });
      if (response.data.success) {
        login(response.data.token);
        Swal.fire({
          title: "¡Bienvenido, Administrador!",
          text: "Inicio de sesión exitoso",
          icon: "success"
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Credenciales inválidas",
        });
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      Swal.fire({
        icon: "error",
        title: "Error al iniciar Sesión",
        text: "Verifica tu correo o contraseña",
      });
    }
  };

  const manejarClicAsiento = (asiento) => {
    setAsientoSeleccionado(asiento);
    setNombreComprador(asiento.cliente_nombre || '');
    setApellidoComprador(asiento.cliente_apellido || '');
    setCedulaComprador(asiento.cliente_cedula || '');
    setEmailComprador(asiento.cliente_email || '');
    setMetodoPago(asiento.metodo_pago || '');
    setQrCode(asiento.codigo_qr ? asiento.codigo_qr : null);
    setImagenComprobante(asiento.imagen || null);
    setCodigoVerificacion(asiento.codigo_verificacion || '');
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
    if (!nombreComprador || !apellidoComprador || !cedulaComprador || !emailComprador || !imagenComprobante) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos obligatorios y seleccione un archivo.',
      });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      });
      return;
    }

    if (asientoSeleccionado) {
      Swal.fire({
        title: "¿Desea guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No guardar`,
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await api.put(
              `/asientos/${asientoSeleccionado.asiento_id}`,
              {
                disponible: false,
                nombre: nombreComprador,
                apellido: apellidoComprador,
                cedula: cedulaComprador,
                email: emailComprador,
                imagen: imagenComprobante,
                metodo_pago: "Deposito"
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const updatedAsiento = response.data;

            const responseAsientos = await api.get('/asientos');
            setAsientos(responseAsientos.data);

            setAsientoSeleccionado(updatedAsiento);
            setQrCode(updatedAsiento.codigo_qr);
            setCodigoVerificacion(updatedAsiento.codigo_verificacion);

            Swal.fire("¡Guardado!", "Datos actualizados, QR generado y comprobante de depósito guardado.", "success");
          } catch (error) {
            console.error('Error al actualizar el asiento:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
              Swal.fire('Error de autenticación', 'Por favor, inicia sesión nuevamente.', 'error');
            } else {
              Swal.fire('Hubo un problema al guardar los cambios.', '', 'error');
            }
          }
        } else if (result.isDenied) {
          Swal.fire("Los cambios no se han guardado", "", "info");
        } else if (result.isDismissed) {
          setNombreComprador('');
          setApellidoComprador('');
          setCedulaComprador('');
          setEmailComprador('');
          setImagenComprobante(null);
          setQrCode(null);
          setAsientoSeleccionado(null);
          setCodigoVerificacion('');
          Swal.fire("Operación cancelada", "Todos los cambios han sido borrados.", "info");
        }
      });
    }
  };

  const marcarComoDisponible = async () => {
    if (asientoSeleccionado) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            title: "Error de autenticación",
            text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            icon: "error"
          });
          return;
        }

        const response = await api.put(
          `/asientos/${asientoSeleccionado.asiento_id}/disponible`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const updatedAsiento = response.data;

        setAsientos(prevAsientos =>
          prevAsientos.map(asiento =>
            asiento.asiento_id === updatedAsiento.asiento_id
              ? { ...asiento, disponible: true, cliente_nombre: '', cliente_apellido: '', cliente_cedula: '', cliente_email: '', metodo_pago: '', imagen: null, codigo_qr: null, codigo_verificacion: '' }
              : asiento
          )
        );

        setAsientoSeleccionado(null);
        setNombreComprador('');
        setApellidoComprador('');
        setCedulaComprador('');
        setEmailComprador('');
        setMetodoPago('');
        setQrCode(null);
        setImagenComprobante(null);
        setCodigoVerificacion('');

        Swal.fire({
          title: "¡Buen trabajo!",
          text: "El asiento se marcó como disponible satisfactoriamente.",
          icon: "success"
        });
      } catch (error) {
        console.error('Error al marcar el asiento como disponible:', error);
        Swal.fire('Hubo un problema al marcar el asiento como disponible.', '', 'error');
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      clearData();
    }
  }, [isAuthenticated]);

  const clearData = () => {
    setNombreUsuario('');
    setContraseña('');
  };

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
              value={contrasena}
              onChange={(e) => setContraseña(e.target.value)}
            />
            <button className='incio'>Iniciar Sesión</button>
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
            <div className="seat-grid">
              {asientos.slice(0, 150).map((asiento) => (
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
            <div className="seat-grid">
              {asientos.slice(150, 300).map((asiento) => (
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
          </div>
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
              <input type="text" placeholder="Código de Verificación" value={codigoVerificacion} disabled />
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
              <button onClick={marcarComoDisponible} className="marcar-disponible-btn">Marcar como Disponible</button>
            </>
          ) : (
            <p>Seleccione un asiento para ver los detalles</p>
          )}
        </div>
      </div>
    </div>
  );
}