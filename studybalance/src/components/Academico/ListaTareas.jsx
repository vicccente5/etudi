import TareaItem from './TareaItem';

const ListaTareas = ({ tareas, onToggle, onEliminar, onEditar }) => {
  if (!tareas || tareas.length === 0) {
    return <div className="card lista-vacia">No hay tareas pendientes. ¡Buen trabajo!</div>;
  }

  // Ordenar: pendientes primero, luego completadas. Dentro de cada grupo, por fecha ascendente.
  const tareasOrdenadas = [...tareas].sort((a, b) => {
    if (a.completada === b.completada) {
      return new Date(a.fecha) - new Date(b.fecha);
    }
    return a.completada ? 1 : -1;
  });

  return (
    <div className="lista-tareas">
      {tareasOrdenadas.map(tarea => (
        <TareaItem 
          key={tarea.id} 
          tarea={tarea} 
          onToggle={onToggle} 
          onEliminar={onEliminar} 
          onEditar={onEditar} 
        />
      ))}
    </div>
  );
};
export default ListaTareas;
