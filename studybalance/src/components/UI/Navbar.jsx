import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>StudyBalance</h2>
      </div>
      <ul className="navbar-links">
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
      </ul>
    </nav>
  );
};

export default Navbar;
