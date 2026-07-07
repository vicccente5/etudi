import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// Navbar es la barra de navegación superior principal. 
// Gestiona el menú de configuración (tema oscuro, idioma) y muestra el mini temporizador en todo momento.
// También maneja la lógica de ruteo visual entre Académico, Bienestar y el Juego (cuando está desbloqueado).
const Navbar = ({ timerModo, timerTiempo, timerActivo, toggleTimer, juegoDesbloqueado }) => {
  // LÓGICA DE ESTADOS
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [tema, setTema] = useState(() => {
    return localStorage.getItem('studybalance_tema') || 'light';
  });

  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('studybalance_idioma') || 'es';
  });

  // LÓGICA DE EFECTOS
  useEffect(() => {
    localStorage.setItem('studybalance_tema', tema);
    if (tema === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [tema]);

  useEffect(() => {
    localStorage.setItem('studybalance_idioma', idioma);
  }, [idioma]);

  const toggleMenu = () => {
    setMenuAbierto(prev => !prev);
  };

  // Formatear el tiempo del temporizador global
  const minutos = Math.floor(timerTiempo / 60).toString().padStart(2, '0');
  const segundos = (timerTiempo % 60).toString().padStart(2, '0');

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>StudyBalance</h2>
      </div>
      <ul className="navbar-links" style={{ alignItems: 'center' }}>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}>
            Académico
          </NavLink>
        </li>
        <li>
          <NavLink to="/bienestar" className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'}>
            Bienestar
          </NavLink>
        </li>

        {/* --- ENLACE AL JUEGO (Secreto) --- */}
        {/* Solo se renderiza si el estado juegoDesbloqueado es verdadero (es decir, si terminaste de estudiar) */}
        {juegoDesbloqueado && (
          <li>
            <NavLink to="/juego" className={({ isActive }) => isActive ? 'nav-link activo' : 'nav-link'} style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
              🎮 Juego
            </NavLink>
          </li>
        )}

        {/* --- MINI TEMPORIZADOR --- */}
        <li className={`mini-temporizador ${timerModo === 'trabajo' ? 'modo-trabajo' : 'modo-descanso'}`}>
          <span className="mini-tiempo">{minutos}:{segundos}</span>
          <button
            className="btn-mini-play"
            onClick={toggleTimer}
            title={timerActivo ? 'Pausar' : 'Iniciar'}
          >
            {timerActivo ? '⏸️' : '▶️'}
          </button>
        </li>

        {/* --- MENÚ DE CONFIGURACIÓN --- */}
        <li className="configuracion-container">
          <button
            className="btn-configuracion"
            onClick={toggleMenu}
            aria-label="Configuración"
            title="Configuración"
          >
            ⚙️
          </button>

          {menuAbierto && (
            <div className="menu-flotante">
              <div className="menu-opcion">
                <label>Tema visual</label>
                <select value={tema} onChange={(e) => setTema(e.target.value)}>
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Oscuro</option>
                </select>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
