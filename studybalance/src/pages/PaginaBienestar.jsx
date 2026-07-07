// Importamos los componentes que conforman la sección de Bienestar
import RegistroAnimo from '../components/Bienestar/RegistroAnimo';
import HistorialEmocional from '../components/Bienestar/HistorialEmocional';
import EjerciciosRelajacion from '../components/Bienestar/EjerciciosRelajacion';
import ContenidoSaludMental from '../components/Bienestar/ContenidoSaludMental';

// PaginaBienestar es la vista donde el usuario registra su ánimo y consume recursos de relajación.
const PaginaBienestar = ({ registrosAnimo, agregarRegistroAnimo, eliminarRegistroAnimo }) => {
  
  // Obtenemos los últimos 7 registros de ánimo, ordenados de más reciente a más antiguo
  // para calcular métricas de la semana reciente.
  const ultimosRegistros = [...registrosAnimo]
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
    .slice(0, 7);
  
  // Calculamos el promedio de energía basándonos solo en los últimos 7 días
  const promedioEnergia = ultimosRegistros.length > 0 
    ? (ultimosRegistros.reduce((acc, r) => acc + r.energia, 0) / ultimosRegistros.length).toFixed(1)
    : 0;

  // Creamos un diccionario (objeto) que cuenta cuántas veces se repite cada emoción
  const conteoAnimos = ultimosRegistros.reduce((acc, r) => {
    acc[r.animo] = (acc[r.animo] || 0) + 1;
    return acc;
  }, {});
  
  // Recorremos el diccionario para encontrar cuál fue el ánimo que más se repitió
  let animoFrecuente = 'N/A';
  let maxConteo = 0;
  for (const [animo, conteo] of Object.entries(conteoAnimos)) {
    if (conteo > maxConteo) {
      maxConteo = conteo;
      animoFrecuente = animo;
    }
  }

  return (
    <div className="pagina-bienestar">
      <header className="page-header">
        <h1>Centro de Bienestar</h1>
        <div className="estadisticas-rapidas">
          <span className="badge stat">Promedio Energía (7 días): {promedioEnergia}</span>
          <span className="badge stat">Ánimo Frecuente: {animoFrecuente}</span>
        </div>
      </header>

      <div className="layout-bienestar-centrado">
        <section className="bienestar-principal-ancho">
          <RegistroAnimo onAgregarRegistro={agregarRegistroAnimo} />
          <HistorialEmocional 
            registros={registrosAnimo} 
            onEliminar={eliminarRegistroAnimo} 
          />
        </section>

        <section className="bienestar-recursos-inferior">
          <EjerciciosRelajacion />
          <ContenidoSaludMental />
        </section>
      </div>
    </div>
  );
};
export default PaginaBienestar;
