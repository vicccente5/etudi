// Arreglo estático con ejercicios de relajación rápidos
const ejercicios = [
  {
    titulo: 'Respiración 4-7-8',
    descripcion: 'Inhala por 4 segundos, mantén el aire por 7 segundos y exhala lentamente por 8 segundos. Repite 4 veces.',
    emoji: '🌬️'
  },
  {
    titulo: 'Relajación Muscular',
    descripcion: 'Tensa los músculos de tus pies por 5 segundos y relájalos. Sube por tu cuerpo hasta llegar a la cabeza.',
    emoji: '🧘'
  },
  {
    titulo: 'Visualización',
    descripcion: 'Cierra los ojos e imagina un lugar tranquilo. Presta atención a los detalles: sonidos, olores, colores.',
    emoji: '🏞️'
  }
];

// EjerciciosRelajacion es un componente estático que muestra tarjetas informativas
const EjerciciosRelajacion = () => {
  return (
    <div className="ejercicios-relajacion card">
      <h3>Ejercicios Rápidos</h3>
      <div className="ejercicios-grid">
        {/* Mapeamos cada ejercicio para crear una tarjeta visual con su emoji, título y descripción */}
        {ejercicios.map((ej, idx) => (
          <div key={idx} className="ejercicio-card">
            <div className="ejercicio-icon">{ej.emoji}</div>
            <h4>{ej.titulo}</h4>
            <p>{ej.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EjerciciosRelajacion;
