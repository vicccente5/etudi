import { useState, useEffect } from 'react';

// FormularioTarea es el componente encargado de crear y editar tareas.
// Recibe funciones del componente padre (App.jsx -> PaginaAcademica.jsx) para modificar el estado global.
const FormularioTarea = ({ onAgregarTarea, onEditarTarea, tareaEnEdicion, onCancelarEdicion }) => {
  // Definimos la estructura inicial vacía para limpiar el formulario
  const estadoInicial = { nombre: '', fecha: '', materia: '', prioridad: 'media' };
  
  // Estado local para guardar lo que el usuario escribe en los inputs
  const [campos, setCampos] = useState(estadoInicial);
  // Estado local para mostrar mensajes de error debajo de los inputs
  const [errores, setErrores] = useState({ nombre: '', fecha: '' });

  // Este useEffect vigila la prop 'tareaEnEdicion'. 
  // Si el usuario hace clic en "Editar" en una tarea, este efecto rellena los campos del formulario con los datos de esa tarea.
  useEffect(() => {
    if (tareaEnEdicion) {
      setCampos({
        nombre: tareaEnEdicion.nombre,
        fecha: tareaEnEdicion.fecha,
        materia: tareaEnEdicion.materia || '',
        prioridad: tareaEnEdicion.prioridad
      });
      setErrores({ nombre: '', fecha: '' }); // Limpiamos errores previos al editar
    } else {
      setCampos(estadoInicial); // Si se cancela la edición, volvemos a vacío
    }
  }, [tareaEnEdicion]);

  // Función genérica que se ejecuta cada vez que el usuario teclea en cualquier input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos solo el campo que está siendo modificado
    setCampos(prev => ({ ...prev, [name]: value }));
    // Si había un error en ese campo, lo borramos para que desaparezca el mensaje rojo
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  // Función que se ejecuta al presionar "Agregar Tarea" o "Guardar Cambios"
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
    let formValido = true;
    let nuevosErrores = { nombre: '', fecha: '' };

    // Validación 1: El nombre no puede estar vacío, ni ser muy corto, ni exageradamente largo
    if (!campos.nombre.trim() || campos.nombre.length < 3 || campos.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre debe tener entre 3 y 100 caracteres.';
      formValido = false;
    }

    // Validación 2: La fecha es obligatoria y no puede estar en el pasado
    if (!campos.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria.';
      formValido = false;
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Ignoramos la hora para comparar solo el día exacto
      const fechaIngresada = new Date(campos.fecha + 'T00:00:00'); 
      if (fechaIngresada < hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy.';
        formValido = false;
      }
    }

    // Si encontramos algún error, detenemos el proceso y mostramos los mensajes
    if (!formValido) {
      setErrores(nuevosErrores);
      return;
    }

    // Si todo está correcto, decidimos si estamos editando o creando
    if (tareaEnEdicion) {
      onEditarTarea(tareaEnEdicion.id, campos);
      onCancelarEdicion(); // Salimos del "modo edición"
    } else {
      onAgregarTarea(campos);
    }
    
    // Limpiamos el formulario para la siguiente tarea
    setCampos(estadoInicial);
  };

  return (
    <div className="card formulario-tarea">
      <h3>{tareaEnEdicion ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Campo Nombre */}
        <div className="form-group">
          <label>Nombre de la tarea *</label>
          <input type="text" name="nombre" value={campos.nombre} onChange={handleChange} />
          {errores.nombre && <span className="error-text">{errores.nombre}</span>}
        </div>
        
        {/* Campo Fecha */}
        <div className="form-group">
          <label>Fecha límite *</label>
          <input type="date" name="fecha" value={campos.fecha} onChange={handleChange} />
          {errores.fecha && <span className="error-text">{errores.fecha}</span>}
        </div>

        {/* Campo Materia */}
        <div className="form-group">
          <label>Materia (Opcional)</label>
          <input type="text" name="materia" value={campos.materia} onChange={handleChange} maxLength={80} />
        </div>

        {/* Campo Select Prioridad */}
        <div className="form-group">
          <label>Prioridad</label>
          <select name="prioridad" value={campos.prioridad} onChange={handleChange}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {tareaEnEdicion ? 'Guardar Cambios' : 'Agregar Tarea'}
          </button>
          {tareaEnEdicion && (
            <button type="button" className="btn-secondary" onClick={onCancelarEdicion}>
              Cancelar
            </button>
          )}
        </div>
        
      </form>
    </div>
  );
};
export default FormularioTarea;
