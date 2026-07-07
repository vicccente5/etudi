const mapAnimoEmoji = {
  feliz: '😊',
  tranquilo: '😌',
  estresado: '😫',
  triste: '😢',
  ansioso: '😰'
};

const HistorialEmocional = ({ registros, onEliminar }) => {
  if (!registros || registros.length === 0) {
    return (
      <div className="card historial-vacio text-center">
        <p>Aún no hay registros. ¡Tómate un momento para registrar cómo te sientes hoy!</p>
      </div>
    );
  }

  const registrosOrdenados = [...registros].sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));

  return (
    <div className="historial-emocional">
      <h3>Tu Historial Emocional</h3>
      <div className="registros-grid">
        {registrosOrdenados.map(registro => (
          <div key={registro.id} className="card registro-item">
            <div className="registro-header">
              <div className="registro-meta">
                <span className="registro-fecha">{registro.fecha}</span>
                <span className="registro-energia">Energía: {registro.energia}/5</span>
              </div>
              <button onClick={() => onEliminar(registro.id)} className="btn-icon" aria-label="Eliminar" title="Eliminar">🗑️</button>
            </div>
            <div className="registro-body">
              <div className="registro-animo-display">
                <span className="emoji-grande">{mapAnimoEmoji[registro.animo] || '🤔'}</span>
                <span className="animo-texto">{registro.animo}</span>
              </div>
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
