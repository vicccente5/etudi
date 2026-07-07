import RegistroAnimo from '../components/Bienestar/RegistroAnimo';
import HistorialEmocional from '../components/Bienestar/HistorialEmocional';
import EjerciciosRelajacion from '../components/Bienestar/EjerciciosRelajacion';
import ContenidoSaludMental from '../components/Bienestar/ContenidoSaludMental';

const PaginaBienestar = ({ registrosAnimo, agregarRegistroAnimo, eliminarRegistroAnimo }) => {
  
  const ultimosRegistros = [...registrosAnimo]
    .sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn))
    .slice(0, 7);
  
  const promedioEnergia = ultimosRegistros.length > 0 
    ? (ultimosRegistros.reduce((acc, r) => acc + r.energia, 0) / ultimosRegistros.length).toFixed(1)
    : 0;

  const conteoAnimos = ultimosRegistros.reduce((acc, r) => {
    acc[r.animo] = (acc[r.animo] || 0) + 1;
    return acc;
  }, {});
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

      <div className="grid-bienestar">
        <aside className="columna-lateral">
          <RegistroAnimo onAgregarRegistro={agregarRegistroAnimo} />
          <EjerciciosRelajacion />
        </aside>

        <section className="columna-principal">
          <HistorialEmocional 
            registros={registrosAnimo} 
            onEliminar={eliminarRegistroAnimo} 
          />
          <ContenidoSaludMental />
        </section>
      </div>
    </div>
  );
};
export default PaginaBienestar;
