import { useState, useEffect } from 'react';

// Diccionario para interpretar los códigos de clima de la OMM (Organización Meteorológica Mundial)
// Open-Meteo devuelve un número que representa el clima actual
const interpretarClima = (codigo) => {
  // Códigos de despejado o parcialmente nublado
  if (codigo === 0 || codigo === 1 || codigo === 2) {
    return {
      emoji: '☀️',
      texto: 'Despejado',
      sugerencia: '¡Es un buen día para dar una vuelta en tu descanso de 5 minutos!'
    };
  }
  // Códigos de mayormente nublado o neblina
  if (codigo === 3 || codigo === 45 || codigo === 48) {
    return {
      emoji: '☁️',
      texto: 'Nublado',
      sugerencia: 'Día nublado, ideal para encender una luz cálida y concentrarse al máximo.'
    };
  }
  // Códigos de lluvia, llovizna o tormenta
  if ((codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 99)) {
    return {
      emoji: '🌧️',
      texto: 'Lluvia',
      sugerencia: 'Mejor quédate adentro con un tecito, está lloviendo.'
    };
  }
  // Códigos de nieve
  if (codigo >= 71 && codigo <= 77) {
    return {
      emoji: '❄️',
      texto: 'Nieve',
      sugerencia: '¡Hace mucho frío! Un buen café es tu mejor aliado hoy.'
    };
  }
  
  // Por defecto si el código no coincide
  return {
    emoji: '🌤️',
    texto: 'Variable',
    sugerencia: 'Tómate un buen descanso cuando termines este Pomodoro.'
  };
};

const WidgetClima = () => {
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener el clima pasándole latitud y longitud a Open-Meteo
    const obtenerClima = async (lat, lon) => {
      try {
        const respuesta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!respuesta.ok) throw new Error('Error al obtener el clima');
        
        const datos = await respuesta.json();
        const info = interpretarClima(datos.current_weather.weathercode);
        
        setClima({
          temperatura: Math.round(datos.current_weather.temperature),
          ...info
        });
      } catch (err) {
        setError('No se pudo cargar el clima.');
      } finally {
        setCargando(false);
      }
    };

    // Intentamos obtener la ubicación del usuario
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Si el usuario acepta, usamos sus coordenadas
          obtenerClima(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Si el usuario deniega el permiso o hay un error, usamos Santiago de Chile por defecto
          console.warn("Permiso de ubicación denegado o no disponible. Usando ubicación por defecto.");
          obtenerClima(-33.4569, -70.6483);
        }
      );
    } else {
      // Si el navegador no soporta geolocalización, usamos Santiago por defecto
      obtenerClima(-33.4569, -70.6483);
    }
  }, []);

  if (cargando) {
    return <div className="widget-clima cargando">Cargando clima... ⏳</div>;
  }

  if (error) {
    return null; // Si falla rotundamente, simplemente no mostramos nada para no arruinar la UI
  }

  return (
    <div className="widget-clima card">
      <div className="clima-header">
        <span className="clima-emoji">{clima.emoji}</span>
        <div className="clima-info">
          <span className="clima-temp">{clima.temperatura}°C</span>
          <span className="clima-desc">{clima.texto}</span>
        </div>
      </div>
      <p className="clima-sugerencia">{clima.sugerencia}</p>
    </div>
  );
};

export default WidgetClima;
