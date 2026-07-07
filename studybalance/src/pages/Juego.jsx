import { useState, useEffect } from 'react';

// Array inicial de emojis temáticos de videojuegos como pediste
const EMOJIS = ['🐉', '🧟', '🧱', '🤖', '👾', '🚀', '💎', '🍄'];

// Función utilitaria para crear un mazo nuevo y barajar las cartas aleatoriamente
const mezclarCartas = () => {
  // Duplicamos los emojis para tener pares (16 cartas en total)
  // sort() con Math.random() nos permite desordenar el arreglo al azar
  const mazo = [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      // Estados individuales de cada carta:
      // volteada: true si el usuario la acaba de tocar y la está viendo
      // resuelta: true si ya encontró su pareja idéntica
      volteada: false,
      resuelta: false
    }));
  return mazo;
};

const Juego = () => {
  // --- ESTADOS DEL JUEGO ---
  // Guarda el arreglo con todas las cartas de la mesa y sus estados actuales
  const [cartas, setCartas] = useState(mezclarCartas());
  
  // Guarda las cartas específicas que el usuario ha volteado en su turno actual (máximo 2 a la vez)
  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  
  // Bloqueo de clics: true cuando estamos esperando que se oculten las cartas que no coincidieron.
  // Es la clave para evitar que el usuario toque una tercera carta y rompa la lógica.
  const [bloqueo, setBloqueo] = useState(false);

  // --- LÓGICA CENTRAL DEL JUEGO (COMPARACIÓN AUTOMÁTICA) ---
  // Este useEffect "escucha" o se dispara cada vez que el arreglo de 'cartasVolteadas' cambia de tamaño.
  useEffect(() => {
    // Solo nos interesa evaluar cuando el usuario ya levantó exactamente 2 cartas
    if (cartasVolteadas.length === 2) {
      // 1. Bloqueamos el tablero inmediatamente para que el usuario no pueda seguir tocando más cartas
      setBloqueo(true);
      
      const [carta1, carta2] = cartasVolteadas;

      // 2. Verificamos si los emojis de ambas cartas son iguales (es un par)
      if (carta1.emoji === carta2.emoji) {
        // ¡Coincidencia! Actualizamos el mazo marcando ambas cartas como 'resueltas' de forma permanente
        setCartas(prevCartas => 
          prevCartas.map(carta => {
            if (carta.emoji === carta1.emoji) {
              return { ...carta, resuelta: true };
            }
            return carta; // Las demás quedan intactas
          })
        );
        // Limpiamos el registro del turno actual y quitamos el bloqueo para seguir jugando
        setCartasVolteadas([]);
        setBloqueo(false);
      } else {
        // No hay coincidencia. Le damos al usuario 1 segundo (1000 ms) para que memorice las cartas
        setTimeout(() => {
          // Des-volteamos (ocultamos) solo las dos cartas que se equivocó
          setCartas(prevCartas => 
            prevCartas.map(carta => {
              if (carta.id === carta1.id || carta.id === carta2.id) {
                return { ...carta, volteada: false };
              }
              return carta;
            })
          );
          // Limpiamos la selección y quitamos el bloqueo
          setCartasVolteadas([]);
          setBloqueo(false);
        }, 1000); // 1000 milisegundos de espera
      }
    }
  }, [cartasVolteadas]);

  // --- MANEJO DE CLICS DE USUARIO ---
  const manejarClickCarta = (cartaSeleccionada) => {
    // Validación de seguridad: 
    // Ignoramos el clic si:
    // 1. El tablero está bloqueado (esperando que 2 cartas incorrectas se den vuelta)
    // 2. La carta ya está volteada (el usuario le hizo doble clic)
    // 3. La carta ya está resuelta (ya es parte de un par descubierto)
    if (bloqueo || cartaSeleccionada.volteada || cartaSeleccionada.resuelta) {
      return;
    }

    // Actualizamos el mazo principal para que la carta seleccionada aparezca como 'volteada'
    setCartas(prevCartas => 
      prevCartas.map(carta => 
        carta.id === cartaSeleccionada.id ? { ...carta, volteada: true } : carta
      )
    );

    // Agregamos esta carta al historial de este turno para que el useEffect la evalúe
    setCartasVolteadas(prev => [...prev, cartaSeleccionada]);
  };

  // --- REINICIAR EL JUEGO ---
  const reiniciarJuego = () => {
    // Volvemos a barajar desde cero y limpiamos todo
    setCartas(mezclarCartas());
    setCartasVolteadas([]);
    setBloqueo(false);
  };

  return (
    <div className="juego-container">
      <h2>🎮 Memorice Geek</h2>
      <p>Encuentra las parejas y relaja tu mente antes de que termine el descanso.</p>
      
      {/* Contenedor de la grilla de cartas */}
      <div className="grilla-cartas">
        {cartas.map(carta => (
          <div 
            key={carta.id} 
            // Añadimos la clase CSS 'flipped' si la carta está volteada temporalmente o resuelta permanentemente
            className={`carta ${carta.volteada || carta.resuelta ? 'flipped' : ''}`}
            onClick={() => manejarClickCarta(carta)}
          >
            {/* carta-inner es el div que hace la animación de giro 3D */}
            <div className="carta-inner">
              {/* Parte trasera (la que se ve inicialmente con el símbolo '?') */}
              <div className="carta-back">❓</div>
              {/* Parte delantera (la que muestra el emoji al girar) */}
              <div className="carta-front">{carta.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para reiniciar por si el usuario termina rápido o se aburre */}
      <button onClick={reiniciarJuego} className="btn-secondary btn-reiniciar-juego">
        🔄 Reiniciar Tablero
      </button>
    </div>
  );
};

export default Juego;
