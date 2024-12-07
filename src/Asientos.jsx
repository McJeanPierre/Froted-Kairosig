import React, { useState, useEffect } from 'react';
import './Asientos.css';
import axios from 'axios';

export default function SeatMap() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [clientData, setClientData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: ''
  });

  // Cargar los asientos desde el backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/asientos');
        setSeats(response.data);
      } catch (error) {
        console.error('Error al cargar los asientos:', error);
      }
    };

    fetchSeats();
  }, []);

  const handleSeatClick = (seatId) => {
    if (selectedSeat === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatId);
      setShowPaymentOptions(false); // Ocultar opciones de pago hasta confirmar selección
    }
  };

  const confirmSeatSelection = () => {
    if (selectedSeat) {
      setIsClientModalVisible(true); // Mostrar modal de cliente
    }
  };

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleConfirmClientData = () => {
    setIsClientModalVisible(false); // Cerrar modal de cliente
    setShowPaymentOptions(true); // Mostrar opciones de pago después de confirmar datos
  };

  const handleDepositPayment = () => {
    window.open("https://wa.me/593958617565?text=Hola%20me%20interesa%20comprar%20un%20asiento%20en%20Kariosig", "_blank");
    setSelectedSeat(null); // Desselecciona el asiento después de redirigir a WhatsApp
    setShowPaymentOptions(false); // Ocultar las opciones de pago
  };

  const importHotmart = () => {
    // Cargar el script y estilo de Hotmart de forma dinámica
    const script = document.createElement('script');
    script.src = 'https://static.hotmart.com/checkout/widget.min.js';
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
    document.head.appendChild(link);
  };

  const handleHotmartPayment = async () => {
    if (selectedSeat) {
      importHotmart(); // Cargar los scripts solo cuando el usuario hace clic en el pago

      // Generar la URL de pago con los parámetros dinámicos: ID de asiento y datos del cliente
      const productoId = 'P96599423R'; // Reemplázalo con el ID de tu producto en Hotmart
      const hotmartUrl = `https://pay.hotmart.com/${productoId}?checkoutMode=2&custom_id=${selectedSeat}&name=${clientData.nombre}&email=${clientData.email}`;

      // Redirigir al usuario al enlace de pago de Hotmart en una nueva pestaña
      window.open(hotmartUrl, '_blank');
    }
  };

  return (  
    <div className="seat-map-container">
      <h1 className="seat-map-title">Mapa de Asientos del Congreso</h1>
      <div className="seat-map">
        <div className="seat-grid-container">
          {[0, 1].map((side) => (
            <div key={side} className="seat-grid">
              {seats.slice(side * 150, (side + 1) * 150).map((seat) => (
                <button
                  key={seat.asiento_id}
                  onClick={() => handleSeatClick(seat.asiento_id)}
                  disabled={!seat.disponible}
                  className={`seat ${
                    !seat.disponible
                      ? 'seat-occupied'
                      : seat.asiento_id === selectedSeat
                      ? 'seat-selected'
                      : 'seat-available'
                  }`}
                >
                  {seat.asiento_numero}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="stage"></div>
      </div>
      <div className="selection-controls">
        {selectedSeat ? (
          <>
            <p className="select-seat-message">
              {selectedSeat
              ? `Has seleccionado el asiento ${seats.find(seat => seat.asiento_id === selectedSeat)?.asiento_numero}`
              : 'Selecciona un asiento'}
            </p>
            <button
              onClick={confirmSeatSelection}
              disabled={!selectedSeat}
              className="confirm-button"
            >
              Confirmar Selección
            </button>
          </>
        ) : (
          <p className="select-seat-message">Selecciona un asiento</p>
        )}
      </div>

      {isClientModalVisible && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <h3>Ingrese sus datos</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={clientData.nombre}
              onChange={handleClientInputChange}
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={clientData.apellido}
              onChange={handleClientInputChange}
            />
            <input
              type="text"
              name="cedula"
              placeholder="Cédula"
              value={clientData.cedula}
              onChange={handleClientInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={clientData.email}
              onChange={handleClientInputChange}
            />
            <button onClick={handleConfirmClientData} className="confirm-client-button">
              Confirmar Datos
            </button>
            <button onClick={() => setIsClientModalVisible(false)} className="close-modal-button">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showPaymentOptions && (
        <div className="payment-options">
          <h3>Elige el método de pago:</h3>
          <button
            onClick={handleDepositPayment}
            className="deposit-button"
          >
            Depósito Bancario
          </button>
          <button
            onClick={handleHotmartPayment}
            className="hotmart-button"
          >
            Pagar con Hotmart
          </button>
        </div>
      )}

      {paymentConfirmed && (
        <div className="payment-confirmation-modal">
          <h3>¡Pago Confirmado!</h3>
          <p>Gracias por tu compra. El asiento ha sido reservado.</p>
          <button onClick={() => setPaymentConfirmed(false)} className="close-confirmation-button">
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
