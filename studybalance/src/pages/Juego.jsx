const Juego = () => {
  return (
    <div className="card text-center" style={{ margin: '2rem auto', maxWidth: '600px', padding: '3rem 2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>🎮 Zona de Recompensa</h2>
      <div style={{ margin: '3rem 0', fontSize: '1.5rem', color: 'var(--color-text-light)', border: '2px dashed var(--color-border)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        Acá va el juego...
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
        ¡Disfruta tu descanso! Cuando el tiempo del temporizador llegue a cero, serás devuelto automáticamente a tus tareas.
      </p>
    </div>
  );
};

export default Juego;
