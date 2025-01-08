import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';
import './PricingSection.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
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
  const [prices, setPrices] = useState({
    normalPrice: '',
    launchPrice: '',
    specialPrice: '',
  });
  const [priceVisibility, setPriceVisibility] = useState({
    showNormalPrice: true,
    showLaunchPrice: true,
    showSpecialPrice: true,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.get('/prices/1'); // Asumiendo que solo hay un registro de precios
        if (response.data) {
          setPrices({
            normalPrice: response.data.Precio_normal,
            launchPrice: response.data.Precio_Lanzamiento,
            specialPrice: response.data.Precio_Especial,
          });
        } else {
          console.error('Estructura de datos inesperada:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar los precios:', error);
      }
    };

    const fetchPriceVisibility = async () => {
      try {
        const response = await api.get('/price-visibility');
        setPriceVisibility(response.data);
      } catch (error) {
        console.error('Error al cargar la visibilidad de los precios:', error);
      }
    };

    fetchPrices();
    fetchPriceVisibility();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVisibilityChange = async (type) => {
    const updatedVisibility = {
      ...priceVisibility,
      [type]: !priceVisibility[type],
    };

    try {
      const response = await api.put('/price-visibility', updatedVisibility);
      setPriceVisibility(response.data.priceVisibility);
    } catch (error) {
      console.error('Error al actualizar la visibilidad de los precios:', error);
    }
  };

  return (
    <div className="pricing-container">
      {isAuthenticated && (
        <div className="admin-controls">
          <label>
            <input
              type="checkbox"
              checked={priceVisibility.showNormalPrice}
              onChange={() => handleVisibilityChange('showNormalPrice')}
            />
            Mostrar Precio Normal
          </label>
          <label>
            <input
              type="checkbox"
              checked={priceVisibility.showLaunchPrice}
              onChange={() => handleVisibilityChange('showLaunchPrice')}
            />
            Mostrar Precio de Lanzamiento
          </label>
          <label>
            <input
              type="checkbox"
              checked={priceVisibility.showSpecialPrice}
              onChange={() => handleVisibilityChange('showSpecialPrice')}
            />
            Mostrar Precio Especial
          </label>
        </div>
      )}

      <div className="pricing-card">
        <div className="pricing-header">
          {priceVisibility.showNormalPrice && (
            <p className="normal-price">Precio normal <span className="bold">{prices.normalPrice} USD</span></p>
          )}
          {priceVisibility.showLaunchPrice && (
            <>
              <p className="launch-price-text">Precio de lanzamiento</p>
              <h2 className="launch-price">HOY {prices.launchPrice} USD</h2>
            </>
          )}
          {priceVisibility.showSpecialPrice && (
            <p className="special-price">Precio especial <span className="bold">{prices.specialPrice} USD</span></p>
          )}
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