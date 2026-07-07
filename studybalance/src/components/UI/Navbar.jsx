import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // LÓGICA DE ESTADOS
  // Controla la visibilidad del menú flotante de configuración
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Inicializamos el tema desde localStorage para que persista. 
  // Si no hay nada guardado, usamos 'light' por defecto.
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('studybalance_tema') || 'light';
  });

  // Inicializamos el idioma desde localStorage. 
  // Si no hay nada guardado, usamos 'es' por defecto.
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('studybalance_idioma') || 'es';
  });

  // LÓGICA DE EFECTOS (Persistencia)
  // Cada vez que cambia el estado "tema", lo guardamos en localStorage 
  // y aplicamos/removemos la clase '.dark-mode' al elemento raíz del HTML.
  useEffect(() => {
    localStorage.setItem('studybalance_tema', tema);
    if (tema === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [tema]);

  // Cada vez que cambia el estado "idioma", lo guardamos en localStorage.
  // (La lógica real de traducción se puede conectar a este estado luego).
  useEffect(() => {
    localStorage.setItem('studybalance_idioma', idioma);
  }, [idioma]);

  // Función sencilla para abrir/cerrar el menú
  const toggleMenu = () => {
    setMenuAbierto(prev => !prev);
  };

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
          
          {/* El menú flotante solo se renderiza si menuAbierto es true */}
          {menuAbierto && (
            <div className="menu-flotante">
              <div className="menu-opcion">
                <label>Tema visual</label>
                <select value={tema} onChange={(e) => setTema(e.target.value)}>
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Oscuro</option>
                </select>
              </div>
              
              <div className="menu-opcion">
                <label>Idioma</label>
                <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
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
