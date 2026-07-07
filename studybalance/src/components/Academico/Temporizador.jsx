import { useState, useEffect } from 'react';

const Temporizador = ({ 
  modo, tiempo, activo, toggle, reiniciar, cambiarModo,
  configTrabajo, configDescanso, actualizarConfiguracion
}) => {
  // Estados temporales locales para los inputs del formulario
  const [inputTrabajo, setInputTrabajo] = useState(configTrabajo);
  const [inputDescanso, setInputDescanso] = useState(configDescanso);
  const [errorConfig, setErrorConfig] = useState('');

  // Sincronizamos los inputs si la configuración principal cambia (ej. al inicio)
  useEffect(() => {
    setInputTrabajo(configTrabajo);
    setInputDescanso(configDescanso);
  }, [configTrabajo, configDescanso]);

  // Manejamos el guardado de la nueva configuración
  const handleGuardarConfig = (e) => {
    e.preventDefault();
    const t = Number(inputTrabajo);
    const d = Number(inputDescanso);

    // Validaciones estrictas
    if (!t || !d) {
      setErrorConfig('Los campos no pueden estar vacíos.');
      return;
    }
    if (t <= 0 || d <= 0) {
      setErrorConfig('Los tiempos deben ser mayores a cero.');
      return;
    }
    if (t > 120 || d > 60) {
      setErrorConfig('Tiempos muy altos (Máx. 120 min trabajo, 60 min descanso).');
      return;
    }

    // Limpiamos errores y ejecutamos la función padre para guardar
    setErrorConfig('');
    actualizarConfiguracion(t, d);
  };

  const minutos = Math.floor(tiempo / 60).toString().padStart(2, '0');
  const segundos = (tiempo % 60).toString().padStart(2, '0');

  return (
    <div className="temporizador card">
      <h3>Temporizador</h3>
      
      {/* Formulario de Configuración de Minutos */}
      <form onSubmit={handleGuardarConfig} className="temporizador-config">
        <div className="config-inputs">
          <div className="form-group-mini">
            <label>Trabajo (min)</label>
            <input 
              type="number" 
              value={inputTrabajo} 
              onChange={(e) => setInputTrabajo(e.target.value)}
              disabled={activo}
            />
          </div>
          <div className="form-group-mini">
            <label>Descanso (min)</label>
            <input 
              type="number" 
              value={inputDescanso} 
              onChange={(e) => setInputDescanso(e.target.value)}
              disabled={activo}
            />
          </div>
        </div>
        
        {/* Mensaje de error (si existe) */}
        {errorConfig && <div className="error-text" style={{marginBottom: '8px'}}>{errorConfig}</div>}
        
        {/* El botón se bloquea si el temporizador está corriendo para prevenir bugs */}
        <button type="submit" className="btn-secondary btn-sm" disabled={activo} style={{width: '100%', marginBottom: '16px'}}>
          Guardar Configuración
        </button>
      </form>

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
