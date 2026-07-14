// Importamos hooks esenciales de React:
// - useState: Para guardar variables que pueden cambiar en el tiempo y actualizar la pantalla visualmente cuando lo hacen.
// - useEffect: Para ejecutar código en segundo plano (como guardar en LocalStorage) automáticamente cuando algo cambia.
// - useCallback: Para memorizar funciones complejas y evitar que se vuelvan a crear en cada renderizado (optimiza el rendimiento).
import { useState, useEffect, useCallback } from 'react'

// Importamos componentes de react-router-dom para habilitar el sistema de navegación entre diferentes vistas
// Agregamos useNavigate para poder redirigir al usuario automáticamente usando código (programáticamente)
import { Routes, Route, useNavigate } from 'react-router-dom'

// Importamos los componentes compartidos (la barra de navegación superior y el pie de página)
import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'

// Importamos las dos pantallas (páginas) principales de nuestra aplicación
import PaginaAcademica from './pages/PaginaAcademica'
import PaginaBienestar from './pages/PaginaBienestar'
// Importamos la nueva vista del Juego (esqueleto)
import Juego from './pages/Juego'

function App() {
  // Obtenemos la función navigate que nos permite cambiar la ruta actual del navegador
  const navigate = useNavigate();
  // --- INICIALIZACIÓN DE ESTADOS ---

  // 1. Estado para almacenar la lista principal de Tareas.
  // Usamos una técnica llamada "inicialización perezosa" pasándole una función a useState en lugar de un valor directo.
  // Esto hace que React solo lea el LocalStorage la primera vez que carga la app, haciendo que el inicio sea mucho más rápido.
  const [tareas, setTareas] = useState(() => {
    const guardado = localStorage.getItem('studybalance_tareas')
    // Si hay datos guardados (en formato texto/JSON), los convertimos a un arreglo real de JavaScript. Si está vacío, iniciamos un arreglo vacío [].
    return guardado ? JSON.parse(guardado) : []
  })

  // 2. Estado para almacenar los registros de Ánimo diarios.
  // Sigue exactamente la misma lógica perezosa de lectura rápida que las tareas.
  const [registrosAnimo, setRegistrosAnimo] = useState(() => {
    const guardado = localStorage.getItem('studybalance_animos')
    return guardado ? JSON.parse(guardado) : []
  })


  // --- EFECTOS DE SINCRONIZACIÓN (PERSISTENCIA DE DATOS) ---

  // 3. Cada vez que el arreglo 'tareas' cambie (ya sea porque se agregó, editó o eliminó una tarea), 
  // este useEffect se da cuenta, se dispara automáticamente, y guarda la nueva lista en el almacenamiento del navegador (LocalStorage).
  useEffect(() => {
    localStorage.setItem('studybalance_tareas', JSON.stringify(tareas))
  }, [tareas])

  // 4. Lo mismo ocurre para los registros de ánimo: si cambia el estado visual, se guarda en la base de datos local como respaldo.
  useEffect(() => {
    localStorage.setItem('studybalance_animos', JSON.stringify(registrosAnimo))
  }, [registrosAnimo])


  // --- FUNCIONES CRUD PARA TAREAS (Crear, Leer, Actualizar, Borrar) ---
  // Nota técnica: Usamos useCallback en todas para asegurar que los componentes hijos (como las listas de tareas) 
  // no se re-rendericen innecesariamente en la pantalla, ahorrando procesador.

  const agregarTarea = useCallback((nuevaTarea) => {
    // Construimos un nuevo objeto de tarea fusionando lo que ingresó el usuario (...nuevaTarea) 
    // e inyectándole internamente un ID único irrompible, estado incompleto por defecto y fecha técnica de creación.
    const tarea = {
      ...nuevaTarea,
      id: crypto.randomUUID(),
      completada: false,
      creadoEn: new Date().toISOString()
    }
    // Usamos el valor previo del estado (prev) para no sobrescribir, sino agregar la nueva tarea al final de la lista
    setTareas(prev => [...prev, tarea])
  }, [])

  const editarTarea = useCallback((id, camposModificados) => {
    // Recorremos (map) todas las tareas buscando la que tenga el ID correcto. 
    // Si coincide, combinamos sus datos antiguos con los camposModificados. Si no es la buscada, la dejamos intacta.
    setTareas(prev => prev.map(t => t.id === id ? { ...t, ...camposModificados } : t))
  }, [])

  const toggleCompletada = useCallback((id) => {
    // Busca la tarea por su ID e invierte lógicamente su estado 'completada' (de verdadero a falso o viceversa)
    setTareas(prev => prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t))
  }, [])

  const eliminarTarea = useCallback((id) => {
    // Filtramos la lista para quedarnos estrictamente con las tareas cuyo ID sea distinto al que queremos destruir
    setTareas(prev => prev.filter(t => t.id !== id))
  }, [])


  // --- FUNCIONES CRUD PARA REGISTROS DE ÁNIMO ---

  const agregarRegistroAnimo = useCallback((nuevoRegistro) => {
    // A cada nuevo registro emocional le agregamos un ID único, una marca de tiempo absoluta (creadoEn)
    // y una fecha corta y legible (YYYY-MM-DD) para facilitar agrupar por días.
    const registro = {
      ...nuevoRegistro,
      id: crypto.randomUUID(),
      fecha: new Date().toISOString().split('T')[0],
      creadoEn: new Date().toISOString()
    }
    setRegistrosAnimo(prev => [...prev, registro])
  }, [])

  const eliminarRegistroAnimo = useCallback((id) => {
    // Igual que con las tareas, filtramos para descartar el registro seleccionado de la lista y la memoria
    setRegistrosAnimo(prev => prev.filter(r => r.id !== id))
  }, [])


  // --- CONFIGURACIÓN DEL TEMPORIZADOR ---
  // Guardamos las preferencias del usuario en LocalStorage (por defecto 25 y 5)
  const [configTrabajo, setConfigTrabajo] = useState(() => {
    const guardado = localStorage.getItem('studybalance_config_trabajo');
    return guardado ? Number(guardado) : 25;
  });

  const [configDescanso, setConfigDescanso] = useState(() => {
    const guardado = localStorage.getItem('studybalance_config_descanso');
    return guardado ? Number(guardado) : 5;
  });

  // Sincronizamos con LocalStorage al cambiar
  useEffect(() => {
    localStorage.setItem('studybalance_config_trabajo', configTrabajo);
  }, [configTrabajo]);

  useEffect(() => {
    localStorage.setItem('studybalance_config_descanso', configDescanso);
  }, [configDescanso]);

  // --- ESTADOS Y LÓGICA DEL TEMPORIZADOR GLOBAL ---
  // Al mover esto a App.jsx, el temporizador sobrevive aunque cambiemos de página.
  const [timerModo, setTimerModo] = useState('trabajo')
  // Inicializamos el tiempo basado en la configuración actual
  const [timerTiempo, setTimerTiempo] = useState(configTrabajo * 60)
  const [timerActivo, setTimerActivo] = useState(false)

  // Estado que controla si el botón del juego aparece en el Navbar o no
  const [juegoDesbloqueado, setJuegoDesbloqueado] = useState(false)

  useEffect(() => {
    let intervalo = null;
    if (timerActivo && timerTiempo > 0) {
      intervalo = setInterval(() => {
        setTimerTiempo(t => t - 1);
      }, 1000);
    } else if (timerTiempo === 0) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => { });

      if (timerModo === 'trabajo') {
        // Al terminar el tiempo de trabajo, desbloqueamos el juego como recompensa
        setJuegoDesbloqueado(true);
        setTimerModo('descanso');
        // Usamos la configuración de descanso personalizada
        setTimerTiempo(configDescanso * 60);
      } else {
        // Al terminar el descanso, bloqueamos el juego de nuevo
        setJuegoDesbloqueado(false);
        setTimerModo('trabajo');
        // Usamos la configuración de trabajo personalizada
        setTimerTiempo(configTrabajo * 60);
        // Expulsamos automáticamente al usuario a la ruta principal
        navigate('/');
      }
      setTimerActivo(false);
    }
    return () => clearInterval(intervalo);
    // Agregamos las configuraciones a las dependencias por buenas prácticas de React
  }, [timerActivo, timerTiempo, timerModo, navigate, configTrabajo, configDescanso]);

  const toggleTimer = useCallback(() => setTimerActivo(prev => !prev), []);

  const reiniciarTimer = useCallback(() => {
    setTimerActivo(false);
    setTimerTiempo(timerModo === 'trabajo' ? configTrabajo * 60 : configDescanso * 60);
  }, [timerModo, configTrabajo, configDescanso]);

  const cambiarModoTimer = useCallback((nuevoModo) => {
    setTimerActivo(false);
    setTimerModo(nuevoModo);
    setTimerTiempo(nuevoModo === 'trabajo' ? configTrabajo * 60 : configDescanso * 60);
  }, [configTrabajo, configDescanso]);

  // Función para que el usuario guarde su configuración y se actualice el reloj inmediatamente
  const actualizarConfiguracionTimer = useCallback((nuevoTrabajo, nuevoDescanso) => {
    setConfigTrabajo(nuevoTrabajo);
    setConfigDescanso(nuevoDescanso);
    setTimerActivo(false);
    setTimerTiempo(timerModo === 'trabajo' ? nuevoTrabajo * 60 : nuevoDescanso * 60);
  }, [timerModo]);


  // --- RENDERIZADO VISUAL DE LA INTERFAZ PRINCIPAL ---
  return (
    <div className="app-container">
      {/* El componente Navbar siempre estará fijo visible en la parte superior, sin importar en qué sub-página estemos */}
      <Navbar
        timerModo={timerModo}
        timerTiempo={timerTiempo}
        timerActivo={timerActivo}
        toggleTimer={toggleTimer}
        juegoDesbloqueado={juegoDesbloqueado}
      />

      {/* main-content es el contenedor dinámico donde se inyectan y alternan las diferentes páginas según el clic del usuario */}
      <main className="main-content">

        {/* El componente Routes es el motor inteligente que lee la URL actual en el navegador y decide qué <Route> habilitar */}
        <Routes>

          {/* Ruta Raíz ("/"): Muestra la PaginaAcademica. Aquí le "inyectamos" o "pasamos" a través de props (propiedades) 
              toda la lista de tareas y las funciones CRUD para que pueda manipular la base de datos central. */}
          <Route path="/" element={
            <PaginaAcademica
              tareas={tareas}
              agregarTarea={agregarTarea}
              editarTarea={editarTarea}
              toggleCompletada={toggleCompletada}
              eliminarTarea={eliminarTarea}
              timerModo={timerModo}
              timerTiempo={timerTiempo}
              timerActivo={timerActivo}
              toggleTimer={toggleTimer}
              reiniciarTimer={reiniciarTimer}
              cambiarModoTimer={cambiarModoTimer}
              configTrabajo={configTrabajo}
              configDescanso={configDescanso}
              actualizarConfiguracionTimer={actualizarConfiguracionTimer}
            />
          } />

          {/* Ruta "/bienestar": Muestra la PaginaBienestar. Igual que arriba, le compartimos únicamente 
              los registros y funciones que necesita, manteniendo el código seguro y aislado. */}
          <Route path="/bienestar" element={
            <PaginaBienestar
              registrosAnimo={registrosAnimo}
              agregarRegistroAnimo={agregarRegistroAnimo}
              eliminarRegistroAnimo={eliminarRegistroAnimo}
            />
          } />

          {/* Ruta "/juego": Muestra el esqueleto del juego. El acceso a este enlace es manejado condicionalmente por el Navbar */}
          <Route path="/juego" element={<Juego />} />

        </Routes>
      </main>

      {/* El Footer siempre estará estático y visible en el fondo absoluto de la página */}
      <Footer />
    </div>
  )
}

// Exportamos el App para que main.jsx lo pueda recoger e incrustar en el HTML
export default App
