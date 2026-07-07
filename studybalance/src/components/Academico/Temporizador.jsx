const Temporizador = ({ modo, tiempo, activo, toggle, reiniciar, cambiarModo }) => {
  const minutos = Math.floor(tiempo / 60).toString().padStart(2, '0');
  const segundos = (tiempo % 60).toString().padStart(2, '0');

  return (
    <div className="temporizador card">
      <h3>Temporizador</h3>
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
