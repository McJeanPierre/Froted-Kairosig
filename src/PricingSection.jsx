import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';
import './PricingSection.css';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const targetDate = new Date('2025-04-26T00:00:00'); // Fecha específica

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pricing-container">
      <div className="pricing-card">
        <div className="pricing-header">
          <p className="normal-price">Precio normal <span className="bold">97 USD</span></p>
          <p className="launch-price-text">Precio de lanzamiento</p>
          <h2 className="launch-price">HOY 47 USD</h2>
          <div className="price-underline"></div>
        </div>

        <ul className="feature-list">
          {[
            'Incluye zona de café',
            'Descuentos exclusivos',
            'Espacio para Networking',
            'Acceso exclusivo al evento',
            'Mas de 8 horas de conferencia',
            'Comunidad exclusiva de emprendedores'
          ].map((item, index) => (
            <li key={index}>
              <svg className="checkmark" viewBox="0 0 18 18">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <div className="countdown">
          <p>Solo faltan:</p>
          <div className="countdown-timer">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="countdown-item">
                <span>{value.toString().padStart(2, '0')}</span>
                <p>{key === 'days' ? 'Días' : key === 'hours' ? 'Horas' : key === 'minutes' ? 'Minutos' : 'Segundos'}</p>
              </div>
            ))}
          </div>
        </div>

        <Link to="/asientos">      
          <button className="buy-button">
          Comprar entradas a precio de lanzamiento
        </button>
        </Link>

        <p className="limited-spots">Cupos limitados</p>

        <div className="payment-methods">
          <img src="/paypal.png" alt="PayPal" className="payment-icon" />
          <img src="/mastercard.png" alt="Mastercard" className="payment-icon" />
          <img src="/visacard.png" alt="Visa" className="payment-icon" />
          <img src="/americancard.png" alt="American Express" className="payment-icon" />
          <img src="/discovercard.jpg" alt="Discover" className="payment-icon" />
        </div>
      </div>

      <div className="chat-section">
        <a href="https://wa.me/+593958617565" target="_blank" rel="noopener noreferrer">
          <img src="/whatsapp.png" alt="Whatsapp" className="chat-icon" />
        </a>
        <div>
          <h3>¡Chatea con nosotros!</h3>
          <p>
            Comunícate a nuestro WhatsApp y uno de nuestros asesores<br />
            te brindará toda la información con respecto a este evento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;