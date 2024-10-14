import React from 'react';
import './Agenda.css';

const agendaItems = [
  { time: "08:00 AM - 09:00 AM", activity: "REGISTRO Y BIENVENIDA" },
  { time: "09:00 AM - 9:30 AM", activity: "Host", description: "Apertura Congreso Reinvention" },
  { time: "09:30 AM - 10:45 AM", activity: "Matt Klein", description: "What are the trending trends? - ¿Cuáles son las tendencias en tendencia?", subdescription: "Un META análisis de cientos de pronósticos" },
  { time: "10:45 AM - 11:30 AM", activity: "COFFE BREAK" },
  { time: "11:30 AM- 12:30 AM", activity: "Fabio Seidi", description: "Cómo el talento humano y las nuevas tecnologías revolucionarán la industria creativa" },
  { time: "12:30 AM- 13:30 PM", activity: "Afdhel Aziz", description: "Reinventing Growth - Reinventando el crecimiento" },
  { time: "13:30 PM - 15:00 PM", activity: "FREE LUNCH" },
  { time: "15:00 AM- 16:00 PM", activity: "Lucas Chávez-Alcorta", description: "Innovar desde el nuevo talento:", subdescription: "El poder oculto de la sub B." },
  { time: "16:00 AM- 17:00 AM", activity: "Ryan Patel", description: "Mindset global y estratégico", subdescription: "Construyendo éxito en un panorama empresarial de rápida evolución" },
  { time: "17:00 PM - 17:45 PM", activity: "COFFE BREAK" },
  { time: "17:45 AM- 18:45 PM", activity: "Taryn Southern", description: "Human & AI Collaboration - La colaboración entre los humanos y la Inteligencia Artificial" },
  { time: "18:45 AM- 19:00 PM", activity: "HOST", description: "Cierre del evento" },
  { time: "19:00 PM - 20:30 PM", activity: "VIP NETWORKING Cocktail" },
];

const Agenda = () => {
  return (
    <div className="agenda">
      <h1>AGENDA</h1>
      <p className="subtitle">Las conferencias en inglés contarán con traducción simultánea.</p>
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
  );
};

export default Agenda;