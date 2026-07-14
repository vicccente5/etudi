import { useState } from 'react';
// Importamos los submódulos que componen el dashboard académico
import FormularioTarea from '../components/Academico/FormularioTarea';
import ListaTareas from '../components/Academico/ListaTareas';
import Calendario from '../components/Academico/Calendario';
import Temporizador from '../components/Academico/Temporizador';
import WidgetClima from '../components/Academico/WidgetClima';

// PaginaAcademica actúa como el contenedor o "Layout" principal de la sección de estudios.
// Recibe como props las funciones y estados globales desde App.jsx
const PaginaAcademica = ({ 
  tareas, agregarTarea, editarTarea, toggleCompletada, eliminarTarea,
  timerModo, timerTiempo, timerActivo, toggleTimer, reiniciarTimer, cambiarModoTimer,
  configTrabajo, configDescanso, actualizarConfiguracionTimer
}) => {
  // Estado local para saber si estamos creando una tarea nueva (null) o editando una existente (objeto tarea)
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);

  // Cálculos rápidos para mostrar las estadísticas en la cabecera
  const totalTareas = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pendientes = totalTareas - completadas;
  
  // Determinamos cuál es la tarea "próxima" a vencer ordenando las no completadas por fecha
  const tareasOrdenadasFecha = [...tareas].filter(t => !t.completada).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
  const proxima = tareasOrdenadasFecha.length > 0 ? tareasOrdenadasFecha[0] : null;

  return (
    <div className="pagina-academica">
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1>Dashboard Académico</h1>
          <div className="estadisticas-rapidas">
            <span className="badge stat">Totales: {totalTareas}</span>
            <span className="badge stat completadas">Completadas: {completadas}</span>
            <span className="badge stat pendientes">Pendientes: {pendientes}</span>
            {proxima && <span className="badge stat urgente">Próxima: {proxima.nombre} ({proxima.fecha})</span>}
          </div>
        </div>
        <WidgetClima />
      </header>

      <div className="grid-academico">
        <section className="columna-principal">
          <FormularioTarea 
            onAgregarTarea={agregarTarea}
            onEditarTarea={editarTarea}
            tareaEnEdicion={tareaEnEdicion}
            onCancelarEdicion={() => setTareaEnEdicion(null)}
          />
          <Temporizador 
            modo={timerModo}
            tiempo={timerTiempo}
            activo={timerActivo}
            toggle={toggleTimer}
            reiniciar={reiniciarTimer}
            cambiarModo={cambiarModoTimer}
            configTrabajo={configTrabajo}
            configDescanso={configDescanso}
            actualizarConfiguracion={actualizarConfiguracionTimer}
          />
        </section>
        
        <aside className="columna-lateral">
          <ListaTareas 
            tareas={tareas}
            onToggle={toggleCompletada}
            onEliminar={eliminarTarea}
            onEditar={(tarea) => setTareaEnEdicion(tarea)}
          />
          <Calendario tareas={tareas} />
        </aside>
      </div>
    </div>
  );
};
export default PaginaAcademica;
