// Este arreglo contiene los artículos de salud mental que le mostramos al usuario.
// En un sistema real, esto podría venir de una base de datos o una API externa.
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

// ContenidoSaludMental es un componente puramente visual (presentacional).
// No maneja estados ni lógica compleja, solo renderiza la lista de recursos.
const ContenidoSaludMental = () => {
  return (
    <div className="salud-mental card">
      <h3>Consejos de Bienestar</h3>
      <ul className="recursos-lista">
        {/* Recorremos el arreglo de recursos y generamos un elemento de lista (li) para cada uno */}
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
