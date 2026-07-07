// Calendario agrupa las tareas pendientes por fecha para mostrar una vista resumida de lo que viene
const Calendario = ({ tareas }) => {
  // Solo nos interesan las tareas que aún no se han completado
  const tareasPendientes = tareas.filter(t => !t.completada);
  
  // Usamos reduce para transformar el arreglo de tareas en un objeto o "diccionario" 
  // donde la clave es la fecha (ej. "2023-10-15") y el valor es un arreglo de las tareas de ese día.
  const agrupadas = tareasPendientes.reduce((acc, tarea) => {
    if (!acc[tarea.fecha]) acc[tarea.fecha] = [];
    acc[tarea.fecha].push(tarea);
    return acc; // Acumulador final
  }, {});

  // Extraemos solo las fechas del diccionario y las ordenamos cronológicamente (de más antigua a más reciente)
  const fechas = Object.keys(agrupadas).sort((a, b) => new Date(a) - new Date(b));

  // Si no hay fechas futuras, mostramos un mensaje vacío
  if (fechas.length === 0) {
    return <div className="card text-center" style={{marginTop: '1rem', color: 'var(--color-text-light)'}}>No hay tareas próximas para el calendario.</div>;
  }

  return (
    <div className="calendario-simplificado card" style={{marginTop: '1rem'}}>
      <h3>Calendario Próximo</h3>
      <div className="fechas-grid">
        {/* Recorremos cada fecha ordenada y mostramos su grupo de tareas */}
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
