const Calendario = ({ tareas }) => {
  const tareasPendientes = tareas.filter(t => !t.completada);
  
  const agrupadas = tareasPendientes.reduce((acc, tarea) => {
    if (!acc[tarea.fecha]) acc[tarea.fecha] = [];
    acc[tarea.fecha].push(tarea);
    return acc;
  }, {});

  const fechas = Object.keys(agrupadas).sort((a, b) => new Date(a) - new Date(b));

  if (fechas.length === 0) {
    return <div className="card text-center" style={{marginTop: '1rem', color: 'var(--color-text-light)'}}>No hay tareas próximas para el calendario.</div>;
  }

  return (
    <div className="calendario-simplificado card" style={{marginTop: '1rem'}}>
      <h3>Calendario Próximo</h3>
      <div className="fechas-grid">
        {fechas.map(fecha => (
          <div key={fecha} className="fecha-columna">
            <h4 className="fecha-titulo">{fecha}</h4>
            <ul className="fecha-tareas">
              {agrupadas[fecha].map(t => (
                <li key={t.id} className={`badge-tarea prioridad-${t.prioridad}`}>
                  {t.nombre}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Calendario;
