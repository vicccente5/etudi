// Objeto diccionario para mapear rápidamente el texto del estado de ánimo a su emoji correspondiente
const mapAnimoEmoji = {
  feliz: '😊',
  tranquilo: '😌',
  estresado: '😫',
  triste: '😢',
  ansioso: '😰'
};

// HistorialEmocional muestra la lista de todos los registros que el usuario ha guardado
// Recibe el historial completo (registros) y la función para borrar uno específico (onEliminar)
const HistorialEmocional = ({ registros, onEliminar }) => {
  
  // Si el arreglo está vacío o no existe, mostramos un estado vacío (Empty State) amigable
  if (!registros || registros.length === 0) {
    return (
      <div className="card historial-vacio text-center">
        <p>Aún no hay registros. ¡Tómate un momento para registrar cómo te sientes hoy!</p>
      </div>
    );
  }

  // Ordenamos los registros para que los más nuevos aparezcan siempre arriba
  // Restamos la fecha 'a' de la fecha 'b' para un orden descendente
  const registrosOrdenados = [...registros].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  return (
    <div className="historial-emocional">
      <h3>Tu Historial Emocional</h3>
      <div className="registros-grid">
        
        {/* Iteramos sobre los registros ordenados */}
        {registrosOrdenados.map(registro => (
          <div key={registro.id} className="card registro-item">
            
            {/* Cabecera del registro: contiene la fecha, el puntaje de energía y el botón de eliminar */}
            <div className="registro-header">
              <div className="registro-meta">
                <span className="registro-fecha">{registro.fecha}</span>
                <span className="registro-energia">Energía: {registro.energia}/5</span>
              </div>
              {/* Botón de eliminación. Llama a la función padre pasándole el ID único de este registro */}
              <button onClick={() => onEliminar(registro.id)} className="btn-icon" aria-label="Eliminar" title="Eliminar">🗑️</button>
            </div>
            
            {/* Cuerpo del registro: muestra el emoji gigante, el nombre de la emoción y las notas si existen */}
            <div className="registro-body">
              <div className="registro-animo-display">
                {/* Buscamos el emoji en el diccionario. Si por algún motivo no existe, usamos 🤔 por defecto */}
                <span className="emoji-grande">{mapAnimoEmoji[registro.animo] || '🤔'}</span>
                <span className="animo-texto">{registro.animo}</span>
              </div>
              
              {/* Renderizado condicional: solo muestra la sección de notas si el usuario escribió algo */}
              {registro.nota && (
                <div className="registro-nota">
                  <p>{registro.nota}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};
export default HistorialEmocional;
