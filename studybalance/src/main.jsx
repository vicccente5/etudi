// Importaciones principales de la librería React para construir interfaces
import React from 'react'

// ReactDOM se usa para conectar nuestra aplicación React con el archivo HTML real (el DOM del navegador)
import ReactDOM from 'react-dom/client'

// BrowserRouter es una herramienta que nos permite manejar múltiples "páginas" o rutas (ej. / y /bienestar) 
// cambiando el contenido de la pantalla sin necesidad de recargar el navegador entero
import { BrowserRouter } from 'react-router-dom'

// Importamos App, que es el componente principal o "raíz" donde vive y se orquesta toda la lógica de nuestra aplicación
import App from './App.jsx'

// Importamos los estilos globales. Aquí definimos variables de color, fuentes y el modo oscuro
import './assets/index.css'

// Importamos los estilos específicos para organizar la estructura de las grillas, botones, tarjetas, etc.
import './assets/App.css'

// Seleccionamos el elemento <div> con id="root" que existe estáticamente en nuestro archivo index.html
// y le indicamos a React que "dibuje" (renderice) toda nuestra aplicación dinámica dentro de él
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode es una herramienta estricta para desarrolladores. Ayuda a detectar posibles errores ocultos
  // ejecutando los componentes dos veces en modo desarrollo. No afecta al producto final en producción.
  <React.StrictMode>
    {/* BrowserRouter envuelve a toda la app para que cualquier componente adentro pueda usar enlaces (links) y entender las URLs */}
    <BrowserRouter>
      {/* Nuestra aplicación real, que contiene los estados, las tareas y las vistas */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
