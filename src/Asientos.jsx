import React, { useState, useEffect } from 'react';
import './Asientos.css';

export default function SeatMap() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(true);

  useEffect(() => {
    const loadSeatsFromStorage = () => {
      const savedSeats = localStorage.getItem('seats');
      if (savedSeats) {
        setSeats(JSON.parse(savedSeats));
      } else {
        const initialSeats = Array.from({ length: 300 }, (_, index) => ({
          id: index + 1,
          ocupado: false, // Cambiado para coincidir con PanelAdmin
          comprador: null, 
          cedula: null, 
          comprobante: null,
        }));
        setSeats(initialSeats);
        localStorage.setItem('seats', JSON.stringify(initialSeats));
      }
    };

    loadSeatsFromStorage();

    const handleStorageChange = () => {
      const savedSeats = localStorage.getItem('seats');
      if (savedSeats) {
        setSeats(JSON.parse(savedSeats));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const syncSeats = (updatedSeats) => {
    localStorage.setItem('seats', JSON.stringify(updatedSeats));
    setSeats(updatedSeats); // Asegurarse de que el estado se actualice inmediatamente
  };

  const handleSeatClick = (seatId) => {
    if (!isSelectionEnabled) {
      assignRandomSeat();
      return;
    }

    if (selectedSeat === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatId);
    }
  };

  const confirmSeatSelection = () => {
    if (selectedSeat) {
      const updatedSeats = seats.map(seat => 
        seat.id === selectedSeat ? { ...seat, ocupado: true } : seat // Usar 'ocupado'
      );
      syncSeats(updatedSeats); // Actualizar en localStorage y en el estado
      setSelectedSeat(null);
    }
  };

  const assignRandomSeat = () => {
    const availableSeats = seats.filter(seat => !seat.ocupado); // Usar 'ocupado'
    if (availableSeats.length > 0) {
      const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
      const updatedSeats = seats.map(seat => 
        seat.id === randomSeat.id ? { ...seat, ocupado: true } : seat // Usar 'ocupado'
      );
      syncSeats(updatedSeats); // Sincronizar entre componentes
    } else {
      alert('Lo siento, no hay asientos disponibles.');
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
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id)}
                  disabled={seat.ocupado} // Usar 'ocupado'
                  className={`seat ${
                    seat.ocupado // Usar 'ocupado'
                      ? 'seat-occupied'
                      : seat.id === selectedSeat
                      ? 'seat-selected'
                      : 'seat-available'
                  }`}
                >
                  {seat.id}
                </button>
              ))}
            </div>
          ))} 
        </div>
        <div className="stage"></div>
      </div>
      <div className="selection-controls">
        {isSelectionEnabled ? (
          <>
            <p>
              {selectedSeat
                ? `Has seleccionado el asiento ${selectedSeat}`
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
          <button
            onClick={assignRandomSeat}
            className="random-button"
          >
            Asignar Asiento Aleatorio
          </button>
        )}
      </div>
    </div>
  );
}
