// TareaItem es el componente visual de una sola tarea. Recibe el objeto tarea y las funciones de acción.
const TareaItem = ({ tarea, onToggle, onEliminar, onEditar }) => {
  return (
    // Agregamos condicionalmente la clase 'completada' para tachar el texto o ponerlo gris si ya se hizo
    <div className={`tarea-item ${tarea.completada ? 'completada' : ''}`}>
      <div className="tarea-content">
        
        {/* Checkbox para marcar/desmarcar la tarea */}
        <input 
          type="checkbox" 
          checked={tarea.completada} 
          onChange={() => onToggle(tarea.id)} 
        />
        
        <div className="tarea-info">
          <h4>{tarea.nombre}</h4>
          
          {/* Metadatos: mostramos fecha, materia (si existe) y un badge coloreado según la prioridad */}
          <div className="tarea-meta">
            <span className="fecha">📅 {tarea.fecha}</span>
            {/* Renderizado condicional: solo muestra el span de la materia si la tarea tiene una definida */}
            {tarea.materia && <span className="materia">📚 {tarea.materia}</span>}
            
            <span className={`badge prioridad-${tarea.prioridad}`}>
              {tarea.prioridad}
            </span>
          </div>
          
        </div>
      </div>
      
      {/* Botonera de acciones a la derecha */}
      <div className="tarea-actions">
        <button onClick={() => onEditar(tarea)} aria-label="Editar" className="btn-icon">✏️</button>
        <button onClick={() => onEliminar(tarea.id)} aria-label="Eliminar" className="btn-icon">🗑️</button>
      </div>
    </div>
  );
};
export default TareaItem;
