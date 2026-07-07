const TareaItem = ({ tarea, onToggle, onEliminar, onEditar }) => {
  return (
    <div className={`tarea-item ${tarea.completada ? 'completada' : ''}`}>
      <div className="tarea-content">
        <input 
          type="checkbox" 
          checked={tarea.completada} 
          onChange={() => onToggle(tarea.id)} 
        />
        <div className="tarea-info">
          <h4>{tarea.nombre}</h4>
          <div className="tarea-meta">
            <span className="fecha">📅 {tarea.fecha}</span>
            {tarea.materia && <span className="materia">📚 {tarea.materia}</span>}
            <span className={`badge prioridad-${tarea.prioridad}`}>
              {tarea.prioridad}
            </span>
          </div>
        </div>
      </div>
      <div className="tarea-actions">
        <button onClick={() => onEditar(tarea)} aria-label="Editar" className="btn-icon">✏️</button>
        <button onClick={() => onEliminar(tarea.id)} aria-label="Eliminar" className="btn-icon">🗑️</button>
      </div>
    </div>
  );
};
export default TareaItem;
