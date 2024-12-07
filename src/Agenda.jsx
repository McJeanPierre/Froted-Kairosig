import React from 'react';
import './Agenda.css';

const agendaItems = [
  { time: "08:00 AM - 08:45 AM", activity: "REGISTRO", description: "Recepción de participantes y entrega de material del congreso."},
  { time: "08:45 AM - 9:00 AM", activity: "BIENVENIDA", description: "Palabras de bienvenida por parte del Gerente  de KAIROSIG S.A.S." },
  { time: "09:00 AM - 09:45 AM", activity: "CONFERENCIA MAGISTRAL", description: "La Revolución de la IA en la Industria Alimentaria Ponente", 
    subdescription: "[Nombre del Ponente], [Título/Posición]." },
  { time: "09:45 AM - 10:30 AM", activity: "Aplicaciones Actuales", 
    description: "Futuras de la IA en la Producción Alimentaria Panelistas: [Nombres y Títulos].Moderador: [Nombre del Moderador].",},
  { time: "10:30 AM- 11:15 AM", activity: " Coffee Break y Networking"},
  { time: "11:15 AM- 12:00 PM", activity: "APLICACACIONES Actuales", description: "Futuras de la IA en la Producción Alimentaria Panelistas: [Nombres y Títulos]. Moderador: [Nombre del Moderador]."},
  { time: "12:00 PM - 14:00 PM", activity: "ALMUERZO Y NETWORKING" },
  { time: "14:00 AM- 14:45 PM", activity: "Innovación en la Automatización", description: "Procesos Alimentarios Panelistas: [Nombres y Títulos]." },
  { time: "14:45 AM- 15:30 AM", activity: "IA para el Control", description: "Control de Calidad y Seguridad Alimentaria Panelistas: [Nombres y Títulos]."},
  { time: "15:30 PM - 16:15 PM", activity: "OPTIMIZACIÓN", description: "De la Cadena de Suministro CON IA Panelistas: [Nombres y Títulos]."},
  { time: "16:15 AM- 16:45 PM", activity: "Reconocimiento a los auspicinates del evento", },
  { time: "16:45 AM- 17:00 PM", activity: "CLAUSURA", description: "Palabras de cierre por parte del CEO de KAIROSIG S.A.S." },
  { time: "20:00 PM", activity: "CENA DE CLAUSURA" },
];

const Agenda = () => {
  return (
      <section className="agenda-container">
        <div className="agenda">
        <h1>CRONOGRAMA</h1>
        <p className="subtitle">Gronograma del evento presencial</p>
        <div className="agenda-grid">
          {agendaItems.map((item, index) => (
            <div key={index} className="agenda-item">
              <div className="time">{item.time}</div>
              <div className="activity">
                <strong>{item.activity}</strong>
                {item.description && <p className="description">{item.description}</p>}
                {item.subdescription && <p className="subdescription">{item.subdescription}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    
  );
};

export default Agenda;