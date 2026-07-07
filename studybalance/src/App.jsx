import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'
import PaginaAcademica from './pages/PaginaAcademica'
import PaginaBienestar from './pages/PaginaBienestar'

function App() {
  // 1. Inicialización perezosa para tareas
  const [tareas, setTareas] = useState(() => {
    const guardado = localStorage.getItem('studybalance_tareas')
    return guardado ? JSON.parse(guardado) : []
  })

  // 2. Inicialización perezosa para registros de ánimo
  const [registrosAnimo, setRegistrosAnimo] = useState(() => {
    const guardado = localStorage.getItem('studybalance_animos')
    return guardado ? JSON.parse(guardado) : []
  })

  // 3. Sincronización con LocalStorage para tareas
  useEffect(() => {
    localStorage.setItem('studybalance_tareas', JSON.stringify(tareas))
  }, [tareas])

  // 4. Sincronización con LocalStorage para registros de ánimo
  useEffect(() => {
    localStorage.setItem('studybalance_animos', JSON.stringify(registrosAnimo))
  }, [registrosAnimo])

  // --- CRUD TAREAS ---
  const agregarTarea = useCallback((nuevaTarea) => {
    const tarea = {
      ...nuevaTarea,
      id: crypto.randomUUID(),
      completada: false,
      creadoEn: new Date().toISOString()
    }
    setTareas(prev => [...prev, tarea])
  }, [])

  const editarTarea = useCallback((id, camposModificados) => {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, ...camposModificados } : t))
  }, [])

  const toggleCompletada = useCallback((id) => {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t))
  }, [])

  const eliminarTarea = useCallback((id) => {
    setTareas(prev => prev.filter(t => t.id !== id))
  }, [])

  // --- CRUD ÁNIMO ---
  const agregarRegistroAnimo = useCallback((nuevoRegistro) => {
    const registro = {
      ...nuevoRegistro,
      id: crypto.randomUUID(),
      fecha: new Date().toISOString().split('T')[0],
      creadoEn: new Date().toISOString()
    }
    setRegistrosAnimo(prev => [...prev, registro])
  }, [])

  const eliminarRegistroAnimo = useCallback((id) => {
    setRegistrosAnimo(prev => prev.filter(r => r.id !== id))
  }, [])

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <PaginaAcademica 
              tareas={tareas}
              agregarTarea={agregarTarea}
              editarTarea={editarTarea}
              toggleCompletada={toggleCompletada}
              eliminarTarea={eliminarTarea}
            />
          } />
          <Route path="/bienestar" element={
            <PaginaBienestar 
              registrosAnimo={registrosAnimo}
              agregarRegistroAnimo={agregarRegistroAnimo}
              eliminarRegistroAnimo={eliminarRegistroAnimo}
            />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
