import React, { useState, useEffect } from 'react';
import './PricesControl.css';
import { useAuth } from './AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 

export default function PricesControl() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    normalPrice: '',
    launchPrice: '',
    specialPrice: '',
  });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPrices();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPrices((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    const result = await Swal.fire({
      title: "¿Deseas guardar los cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `No guardar`
    });

    if (result.isConfirmed) {
      try {
        console.log('Datos a enviar:', { 
          Precio_normal: prices.normalPrice, 
          Precio_Lanzamiento: prices.launchPrice, 
          Precio_Especial: prices.specialPrice 
        });
        const response = await api.put('/prices/1', { 
          Precio_normal: prices.normalPrice, 
          Precio_Lanzamiento: prices.launchPrice, 
          Precio_Especial: prices.specialPrice 
        });
        if (response.status === 200) {
          Swal.fire("¡Guardado!", "", "success");
        } else {
          Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
        }
      } catch (error) {
        console.error('Error al guardar los precios:', error);
        Swal.fire('Error', 'No se pudieron guardar los cambios.', 'error');
      }
    } else if (result.isDenied) {
      Swal.fire("Los cambios no se han guardado", "", "info");
    }
  };

  if (loading || authLoading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se verifica la autenticación
  }

  if (!isAuthenticated) {
    return null; // No renderizar nada si no está autenticado
  }

  return (
    <div className="admin-panel">
      <h1>Panel de Control - Modificación de Precios</h1>

      <div className="prices-section">
        <h2>Gestión de Precios</h2>
        <label>
          Precio Normal:
          <input
            type="number"
            name="normalPrice"
            value={prices.normalPrice}
            onChange={handlePriceChange}
          />
        </label>
        <label>
          Precio de Lanzamiento:
          <input
            type="number"
            name="launchPrice"
            value={prices.launchPrice}
            onChange={handlePriceChange}
          />
        </label>
        <label>
          Precio Especial:
          <input
            type="number"
            name="specialPrice"
            value={prices.specialPrice}
            onChange={handlePriceChange}
          />
        </label>
        <button onClick={guardarCambios} className="save-button">Guardar Cambios</button>
      </div>
    </div>
  );
}