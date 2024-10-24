import React, { useState, useEffect } from 'react';
import './Asientos.css';

export default function SeatMap() {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [confirmedSeats, setConfirmedSeats] = useState([]);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(true);

  // Cargar el estado de los asientos desde el localStorage
  useEffect(() => {
    const loadSeatsFromStorage = () => {
      const savedSeats = localStorage.getItem('seats');
      const savedConfirmedSeats = localStorage.getItem('confirmedSeats');

      if (savedSeats && savedConfirmedSeats) {
        setSeats(JSON.parse(savedSeats));
        setConfirmedSeats(JSON.parse(savedConfirmedSeats));
      } else {
        // Inicializa los asientos si no hay nada en localStorage
        const initialSeats = Array.from({ length: 300 }, (_, index) => ({
          id: index + 1,
          isOccupied: false,
        }));
        setSeats(initialSeats);
      }
    };

    loadSeatsFromStorage();

    // Añadir un listener para detectar cambios en el localStorage
    const handleStorageChange = () => {
      loadSeatsFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Guardar el estado de los asientos y confirmaciones en el localStorage
  useEffect(() => {
    if (seats.length > 0) {
      localStorage.setItem('seats', JSON.stringify(seats));
    }
    if (confirmedSeats.length > 0) {
      localStorage.setItem('confirmedSeats', JSON.stringify(confirmedSeats));
    }
  }, [seats, confirmedSeats]);

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
      setConfirmedSeats([...confirmedSeats, selectedSeat]);
      setSeats(seats.map(seat => 
        seat.id === selectedSeat ? { ...seat, isOccupied: true } : seat
      ));
      setSelectedSeat(null);

      if (confirmedSeats.length + 1 >= 20) {
        setIsSelectionEnabled(false);
      }
    }
  };

  const assignRandomSeat = () => {
    const availableSeats = seats.filter(seat => !seat.isOccupied);
    if (availableSeats.length > 0) {
      const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
      setConfirmedSeats([...confirmedSeats, randomSeat.id]);
      setSeats(seats.map(seat => 
        seat.id === randomSeat.id ? { ...seat, isOccupied: true } : seat
      ));
    } else {
      alert('Lo siento, no hay asientos disponibles.');
    }
  };

  return (
    <div className="seat-map-container">
      <h1 className="seat-map-title">Mapa de Asientos del Congreso</h1>
      <p className="seat-map-info">
        {isSelectionEnabled
          ? `Selecciona tu asiento (${20 - confirmedSeats.length} selecciones restantes)`
          : 'Asignación aleatoria de asientos activada'}
      </p>
      <div className="seat-map">
        <div className="seat-grid-container">
          {[0, 1].map((side) => (
            <div key={side} className="seat-grid">
              {seats.slice(side * 150, (side + 1) * 150).map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id)}
                  disabled={seat.isOccupied}
                  className={`seat ${
                    seat.isOccupied
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
