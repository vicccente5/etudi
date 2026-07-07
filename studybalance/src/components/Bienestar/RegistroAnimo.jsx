import { useState } from 'react';

const opcionesAnimo = [
  { valor: 'feliz', emoji: '😊', label: 'Feliz' },
  { valor: 'tranquilo', emoji: '😌', label: 'Tranquilo' },
  { valor: 'estresado', emoji: '😫', label: 'Estresado' },
  { valor: 'triste', emoji: '😢', label: 'Triste' },
  { valor: 'ansioso', emoji: '😰', label: 'Ansioso' }
];

const RegistroAnimo = ({ onAgregarRegistro }) => {
  const estadoInicial = { animo: '', energia: 3, nota: '' };
  const [campos, setCampos] = useState(estadoInicial);
  const [errores, setErrores] = useState({ animo: '', energia: '' });

  const handleAnimoClick = (valor) => {
    setCampos(prev => ({ ...prev, animo: valor }));
    if (errores.animo) setErrores(prev => ({ ...prev, animo: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nota' && value.length > 500) return;
    setCampos(prev => ({ ...prev, [name]: name === 'energia' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formValido = true;
    let nuevosErrores = { animo: '', energia: '' };

    if (!campos.animo) {
      nuevosErrores.animo = 'Por favor, selecciona cómo te sientes.';
      formValido = false;
    }

    if (campos.energia < 1 || campos.energia > 5) {
      nuevosErrores.energia = 'El nivel de energía debe estar entre 1 y 5.';
      formValido = false;
    }

    if (!formValido) {
      setErrores(nuevosErrores);
      return;
    }

    onAgregarRegistro(campos);
    setCampos(estadoInicial);
  };

  return (
    <div className="card registro-animo">
      <h3>¿Cómo te sientes hoy?</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group animo-selector">
          <label>Estado de ánimo *</label>
          <div className="animo-botones">
            {opcionesAnimo.map(op => (
              <button 
                key={op.valor}
                type="button"
                className={`btn-animo ${campos.animo === op.valor ? 'seleccionado' : ''}`}
                onClick={() => handleAnimoClick(op.valor)}
                title={op.label}
              >
                <span className="emoji">{op.emoji}</span>
                <span className="label">{op.label}</span>
              </button>
            ))}
          </div>
          {errores.animo && <span className="error-text">{errores.animo}</span>}
        </div>

        <div className="form-group">
          <label>Nivel de energía (1-5) *</label>
          <div className="energia-slider-container">
            <input 
              type="range" 
              name="energia" 
              min="1" max="5" step="1" 
              value={campos.energia} 
              onChange={handleChange}
            />
            <div className="energia-valor">Nivel: {campos.energia}</div>
          </div>
          {errores.energia && <span className="error-text">{errores.energia}</span>}
        </div>

        <div className="form-group">
          <label>Notas de tu diario (Opcional)</label>
          <textarea 
            name="nota" 
            value={campos.nota} 
            onChange={handleChange} 
            rows="3"
            placeholder="¿Por qué te sientes así?"
          ></textarea>
          <div className="contador-caracteres">{campos.nota.length}/500</div>
        </div>

        <button type="submit" className="btn-primary">Guardar Registro</button>
      </form>
    </div>
  );
};
export default RegistroAnimo;
