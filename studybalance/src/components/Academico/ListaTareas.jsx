import TareaItem from './TareaItem';

// ListaTareas recibe el arreglo de tareas y se encarga de mostrarlas en orden
const ListaTareas = ({ tareas, onToggle, onEliminar, onEditar }) => {
  // Si el arreglo está vacío o no existe, mostramos un mensaje amigable
  if (!tareas || tareas.length === 0) {
    return <div className="card lista-vacia">No hay tareas pendientes. ¡Buen trabajo!</div>;
  }

  // Ordenamos las tareas para que la experiencia de usuario sea mejor:
  // 1. Las tareas sin completar van arriba, las completadas abajo.
  // 2. Si dos tareas tienen el mismo estado, ordenamos por fecha (la más próxima primero).
  const tareasOrdenadas = [...tareas].sort((a, b) => {
    if (a.completada === b.completada) {
      return new Date(a.fecha) - new Date(b.fecha);
    }
    return a.completada ? 1 : -1;
  });

  return (
    <div className="lista-tareas">
      {/* Recorremos el arreglo ordenado y renderizamos un TareaItem por cada una */}
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
