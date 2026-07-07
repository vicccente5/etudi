import { useState, useEffect } from 'react';

const FormularioTarea = ({ onAgregarTarea, onEditarTarea, tareaEnEdicion, onCancelarEdicion }) => {
  const estadoInicial = { nombre: '', fecha: '', materia: '', prioridad: 'media' };
  const [campos, setCampos] = useState(estadoInicial);
  const [errores, setErrores] = useState({ nombre: '', fecha: '' });

  useEffect(() => {
    if (tareaEnEdicion) {
      setCampos({
        nombre: tareaEnEdicion.nombre,
        fecha: tareaEnEdicion.fecha,
        materia: tareaEnEdicion.materia || '',
        prioridad: tareaEnEdicion.prioridad
      });
      setErrores({ nombre: '', fecha: '' });
    } else {
      setCampos(estadoInicial);
    }
  }, [tareaEnEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formValido = true;
    let nuevosErrores = { nombre: '', fecha: '' };

    if (!campos.nombre.trim() || campos.nombre.length < 3 || campos.nombre.length > 100) {
      nuevosErrores.nombre = 'El nombre debe tener entre 3 y 100 caracteres.';
      formValido = false;
    }

    if (!campos.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria.';
      formValido = false;
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaIngresada = new Date(campos.fecha + 'T00:00:00'); 
      if (fechaIngresada < hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy.';
        formValido = false;
      }
    }

    if (!formValido) {
      setErrores(nuevosErrores);
      return;
    }

    if (tareaEnEdicion) {
      onEditarTarea(tareaEnEdicion.id, campos);
      onCancelarEdicion();
    } else {
      onAgregarTarea(campos);
    }
    
    setCampos(estadoInicial);
  };

  return (
    <div className="card formulario-tarea">
      <h3>{tareaEnEdicion ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la tarea *</label>
          <input type="text" name="nombre" value={campos.nombre} onChange={handleChange} />
          {errores.nombre && <span className="error-text">{errores.nombre}</span>}
        </div>
        
        <div className="form-group">
          <label>Fecha límite *</label>
          <input type="date" name="fecha" value={campos.fecha} onChange={handleChange} />
          {errores.fecha && <span className="error-text">{errores.fecha}</span>}
        </div>

        <div className="form-group">
          <label>Materia (Opcional)</label>
          <input type="text" name="materia" value={campos.materia} onChange={handleChange} maxLength={80} />
        </div>

        <div className="form-group">
          <label>Prioridad</label>
          <select name="prioridad" value={campos.prioridad} onChange={handleChange}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

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
