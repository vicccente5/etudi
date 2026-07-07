const recursos = [
  {
    titulo: 'La importancia de las pausas',
    descripcion: 'Estudiar por periodos largos sin descanso reduce la retención. Las pausas cortas ayudan a tu cerebro a procesar la información.',
    enlace: '#'
  },
  {
    titulo: 'Cómo lidiar con la ansiedad',
    descripcion: 'Identificar los síntomas de la ansiedad es el primer paso. Si sientes que te sobrepasa, no dudes en hablar con un profesional.',
    enlace: '#'
  },
  {
    titulo: 'Higiene del sueño',
    descripcion: 'Dormir 7-8 horas es crucial para la memoria. Evita pantallas antes de dormir y mantén un horario regular.',
    enlace: '#'
  }
];

const ContenidoSaludMental = () => {
  return (
    <div className="salud-mental card">
      <h3>Consejos de Bienestar</h3>
      <ul className="recursos-lista">
        {recursos.map((rec, idx) => (
          <li key={idx} className="recurso-item">
            <h4>{rec.titulo}</h4>
            <p>{rec.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ContenidoSaludMental;
