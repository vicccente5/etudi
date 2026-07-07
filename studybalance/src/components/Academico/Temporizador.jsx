import { useState, useEffect } from 'react';

const Temporizador = () => {
  const [modo, setModo] = useState('trabajo'); 
  const [tiempo, setTiempo] = useState(25 * 60); 
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (activo && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo(t => t - 1);
      }, 1000);
    } else if (tiempo === 0) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
      
      if (modo === 'trabajo') {
        setModo('descanso');
        setTiempo(5 * 60);
      } else {
        setModo('trabajo');
        setTiempo(25 * 60);
      }
      setActivo(false);
    }
    return () => clearInterval(intervalo);
  }, [activo, tiempo, modo]);

  const toggle = () => setActivo(!activo);
  
  const reiniciar = () => {
    setActivo(false);
    setTiempo(modo === 'trabajo' ? 25 * 60 : 5 * 60);
  };

  const cambiarModo = (nuevoModo) => {
    setActivo(false);
    setModo(nuevoModo);
    setTiempo(nuevoModo === 'trabajo' ? 25 * 60 : 5 * 60);
  };

  const minutos = Math.floor(tiempo / 60).toString().padStart(2, '0');
  const segundos = (tiempo % 60).toString().padStart(2, '0');

  return (
    <div className="temporizador card">
      <h3>Pomodoro</h3>
      <div className="modos-pomodoro">
        <button className={modo === 'trabajo' ? 'activo' : ''} onClick={() => cambiarModo('trabajo')}>Trabajo</button>
        <button className={modo === 'descanso' ? 'activo' : ''} onClick={() => cambiarModo('descanso')}>Descanso</button>
      </div>
      <div className="tiempo-display">
        {minutos}:{segundos}
      </div>
      <div className="temporizador-actions">
        <button onClick={toggle} className="btn-primary">{activo ? 'Pausar' : 'Iniciar'}</button>
        <button onClick={reiniciar} className="btn-secondary">Reiniciar</button>
      </div>
    </div>
  );
};
export default Temporizador;
