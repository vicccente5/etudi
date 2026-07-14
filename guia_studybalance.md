# Guía Completa de StudyBalance 🚀

¡Bienvenido a la guía oficial de tu proyecto **StudyBalance**! Este documento está diseñado para ayudarte a entender exactamente cómo funciona tu aplicación por dentro, cómo se estructuran los archivos y qué conceptos clave de programación se utilizaron para construirla.

---

## 1. El "Stack" Tecnológico (Las herramientas que usamos)
Tu aplicación está construida con las tecnologías más modernas del desarrollo web:
- **React:** La librería principal. Nos permite crear "componentes" (pedazos de interfaz como botones, tarjetas o formularios) que se actualizan automáticamente cuando los datos cambian.
- **Vite:** Es el motor que arranca tu proyecto súper rápido y empaqueta los archivos para que el navegador los entienda.
- **React Router DOM:** Es la herramienta que usamos para poder navegar entre la página "Académica", "Bienestar" y "Juego" sin que la página web entera se tenga que recargar.
- **CSS Puro:** Toda la magia visual y animaciones se hicieron a mano, sin librerías de estilos externas, garantizando que el diseño sea ligero y 100% personalizado.

---

## 2. Estructura de Carpetas 📁
Si entras a la carpeta `src/` (Source/Fuente), verás que el código está organizado de manera modular:

```text
src/
 ├── assets/          # Archivos estáticos (CSS general)
 │    ├── App.css     # Estilos específicos de componentes (Grillas, botones, animaciones)
 │    └── index.css   # Variables de color (Tema oscuro/claro) y reseteos básicos
 │
 ├── components/      # Pedazos de interfaz reutilizables
 │    ├── Academico/  # Componentes exclusivos de la vista de estudios
 │    ├── Bienestar/  # Componentes exclusivos de la vista de salud mental
 │    └── UI/         # Componentes globales de interfaz (Barra de navegación, Footer)
 │
 ├── pages/           # Vistas principales de la aplicación (Páginas completas)
 │    ├── PaginaAcademica.jsx
 │    ├── PaginaBienestar.jsx
 │    └── Juego.jsx
 │
 ├── App.jsx          # El cerebro de la aplicación
 └── main.jsx         # La puerta de entrada principal
```

---

## 3. ¿Cómo fluye la aplicación? 🌊

### El Punto de Partida: `main.jsx`
Cuando abres tu aplicación en el navegador, el primer archivo de React que se ejecuta es `main.jsx`. 
Su única responsabilidad es buscar en tu archivo `index.html` un elemento vacío llamado `<div id="root"></div>` e inyectar toda tu aplicación React dentro de él. Además, envuelve a la aplicación con el `BrowserRouter`, dándole los "poderes" para manejar rutas o URLs (como `/` o `/bienestar`).

### El Cerebro: `App.jsx`
Este es el archivo más importante. Aquí es donde vive la "memoria" global de la aplicación.
Si declaráramos el temporizador Pomodoro dentro de la `PaginaAcademica`, al cambiar a `PaginaBienestar`, ese componente se destruiría y el reloj se reiniciaría. Por eso, **elevamos los estados** a `App.jsx`.
En `App.jsx` se manejan:
- La lista global de tareas.
- El historial global de estados de ánimo.
- El reloj temporizador.
- La lógica de guardar en la memoria del navegador (`localStorage`).
- El enrutador (`<Routes>`) que decide qué página mostrar dependiendo de la URL.

---

## 4. Conceptos Clave de React Utilizados 🧠

A lo largo del código verás ciertas funciones especiales de React llamadas **Hooks**. Estas son las más importantes:

### `useState` (Variables que actualizan la pantalla)
En React normal, si cambias una variable `let x = 5`, la pantalla no se entera. Si usas `useState`, React está atento: cada vez que el valor cambia, React re-dibuja automáticamente esa parte de la pantalla.
*Ejemplo:* Lo usamos para saber si el menú de configuración está abierto o cerrado en el `Navbar`, o para saber qué cartas se han volteado en el `Juego.jsx`.

### `useEffect` (Efectos secundarios automáticos)
Sirve para decirle a React: *"Cuando pase X cosa, ejecuta esta función en segundo plano"*.
*Ejemplo:* Lo usamos intensivamente en `App.jsx` para decirle a la aplicación: *"Cada vez que el usuario agregue una tarea nueva, guarda silenciosamente el arreglo completo de tareas en el LocalStorage del navegador"*. 
También lo usamos en el `Juego.jsx` para vigilar si el usuario levantó dos cartas y hacer la comprobación de si son iguales.

### `useNavigate` (Navegación mágica)
Lo usamos para teletransportar al usuario de una pantalla a otra usando código.
*Ejemplo:* Cuando el temporizador de descanso llega a 0 en `App.jsx`, usamos `navigate('/')` para sacar al usuario del minijuego de forma forzada y devolverlo a sus estudios.

---

## 5. Explicación de los Módulos Principales 🧩

### A. Sección Académica (`pages/PaginaAcademica.jsx`)
Es un "Dashboard" que junta varios componentes pequeños:
- **`FormularioTarea.jsx`**: Un formulario con validaciones estrictas (fechas, texto vacío) que avisa a `App.jsx` cuando hay que crear una nueva tarea.
- **`ListaTareas.jsx` y `TareaItem.jsx`**: Ordenan matemáticamente las tareas pendientes (por fecha más cercana) y permiten marcarlas como completadas.
- **`Temporizador.jsx`**: La interfaz visual del método Pomodoro. Lee la configuración del usuario y se comunica con `App.jsx` para arrancar o pausar el tiempo.

### B. Sección Bienestar (`pages/PaginaBienestar.jsx`)
Un centro de descanso mental:
- **`RegistroAnimo.jsx`**: Un componente interactivo donde seleccionas emojis y un nivel de energía. Al guardar, crea un objeto de registro con fecha y hora.
- **`HistorialEmocional.jsx`**: Lee todos los registros guardados y los lista ordenados de más nuevo a más antiguo.
- **Métricas Matemáticas**: Dentro del archivo principal de esta página se hace un cálculo para encontrar el "estado de ánimo más frecuente" y el promedio de energía de los últimos 7 días utilizando funciones nativas de JavaScript (`reduce` y `.sort`).

### C. El Minijuego (`pages/Juego.jsx`)
Un componente de "Memorice" autocontenido.
Utiliza **animaciones 3D por CSS** (`transform: rotateY`) para girar las cartas. Por detrás, controla fuertemente a través de un estado llamado `bloqueo` que el usuario no pueda hacer trampa ni dar clic a más de dos cartas a la vez.

---

## 6. Persistencia de Datos (LocalStorage) 💾
¿Te has preguntado por qué no pierdes tus tareas al recargar la página?
No usamos una base de datos compleja. Usamos el `localStorage` del navegador.
Al inicializar los estados en `App.jsx` (por ejemplo, las tareas), le pasamos una función que va a buscar la clave secreta `studybalance_tareas`. Si encuentra texto ahí, lo convierte de vuelta a un arreglo de JavaScript usando `JSON.parse()`. Cada vez que agregas una tarea, la volvemos a convertir a texto con `JSON.stringify()` y la guardamos. Es una base de datos local y privada en tu propio navegador.

---

## 7. Integración de API Externa (El Clima) ⛅
Una de las funcionalidades más interesantes del proyecto es cómo nos comunicamos con el mundo exterior utilizando una **API** (Interfaz de Programación de Aplicaciones). 

### ¿Qué es Open-Meteo?
En nuestro archivo `WidgetClima.jsx`, utilizamos la API gratuita **Open-Meteo**. Esta es una herramienta de código abierto que recopila información de las grandes agencias meteorológicas del mundo. La elegimos porque, a diferencia de otras, **no requiere registrarse ni utilizar una clave secreta (API Key)**. Es llegar y consultar.

### ¿Cómo funciona el código paso a paso?
1. **Ubicación (`navigator.geolocation`)**:
   Antes de pedir el clima, usamos una función nativa que hace que tu navegador te pida permiso para conocer tu ubicación. Si aceptas, nos entrega tus coordenadas (Latitud y Longitud). Si rechazas, programamos un "Plan B" silencioso que carga el clima de Santiago de Chile por defecto.
2. **Petición a la API (`fetch`)**:
   Usamos la función `fetch()` de JavaScript para "llamar" a los servidores de Open-Meteo. Le pasamos tus coordenadas en la URL. La API responde inmediatamente entregándonos la temperatura y un código numérico del estado del tiempo.
3. **Traducción del Código (`interpretarClima`)**:
   La Organización Meteorológica Mundial usa números (ej. `0` es Despejado, `61` es Lluvia). Nuestra función `interpretarClima` lee ese número y, mediante condicionales `if`, lo convierte en el Emoji correcto, el texto en español, y la frase sugerida para que el usuario sepa qué hacer en su descanso Pomodoro.

---

## 8. Análisis de Líneas de Código Clave 🔍
Para entender mejor la aplicación, aquí tienes un desglose de las piezas de código más importantes y complejas del proyecto:

### A. La "Inicialización Perezosa" (Lazy Initialization) del Estado
**Archivo:** `App.jsx`
```javascript
const [tareas, setTareas] = useState(() => {
  const guardado = localStorage.getItem('studybalance_tareas');
  return guardado ? JSON.parse(guardado) : [];
});
```
**¿Qué hace?** En lugar de pasarle a `useState` un valor directo como `[]`, le pasamos una función `() => { ... }`. Esto se llama inicialización perezosa. Le dice a React: "Solo ejecuta este código pesado (leer del disco duro con `localStorage`) la primera vez que la página carga". Si no lo hiciéramos así, React leería el disco duro en cada pequeño re-render (cada vez que el reloj avanza un segundo), lo que haría que la página se quedara pegada.

### B. El Efecto Secundario (Sincronización)
**Archivo:** `App.jsx`
```javascript
useEffect(() => {
  localStorage.setItem('studybalance_tareas', JSON.stringify(tareas));
}, [tareas]);
```
**¿Qué hace?** `useEffect` siempre recibe dos cosas: una función y un arreglo de dependencias `[tareas]`. Esto significa: "React, mantente vigilando el estado `tareas`. Cada vez que agregue, edite o borre una tarea, ejecuta esta función automáticamente y guarda la nueva lista convertida a texto (`JSON.stringify`) en el navegador". Es la magia que mantiene tus datos a salvo sin tener que apretar un botón de "Guardar".

### C. El Motor del Reloj Pomodoro
**Archivo:** `App.jsx`
```javascript
useEffect(() => {
  let intervalo = null;
  if (timerActivo && timerTiempo > 0) {
    intervalo = setInterval(() => {
      setTimerTiempo(t => t - 1);
    }, 1000);
  } else if (timerTiempo === 0) {
    // Lógica cuando el reloj termina...
  }
  return () => clearInterval(intervalo);
}, [timerActivo, timerTiempo]);
```
**¿Qué hace?** Este es el corazón del temporizador. Si el reloj está `timerActivo` y queda tiempo, usamos la función nativa de JavaScript `setInterval` para restarle 1 al `timerTiempo` cada 1000 milisegundos (1 segundo). 
La parte más crítica es el `return () => clearInterval(intervalo);`. Esto es la función de "limpieza" (cleanup) de React. Si no limpiamos el intervalo anterior antes de crear uno nuevo, los intervalos se duplicarían, y el reloj empezaría a saltar de 2 en 2, luego de 3 en 3 segundos, volviéndose loco.

### D. La Prevención de Trampas en el Minijuego
**Archivo:** `Juego.jsx`
```javascript
const manejarClickCarta = (cartaSeleccionada) => {
  if (bloqueo || cartaSeleccionada.volteada || cartaSeleccionada.resuelta) return;
  // ... lógica para voltear la carta ...
};
```
**¿Qué hace?** Esta es una cláusula de guarda (guard clause). Antes de ejecutar cualquier lógica de juego, verificamos tres cosas: 
1. ¿La mesa está bloqueada (`bloqueo === true`) porque el usuario ya levantó 2 cartas incorrectas y estamos esperando el segundo de penalización?
2. ¿La carta ya fue levantada en este turno?
3. ¿La carta ya fue resuelta en turnos anteriores?
Si cualquiera de estas condiciones se cumple, la función hace un `return` temprano (se detiene instantáneamente y no hace nada), evitando errores fatales en el juego.

---

## 9. Cuestionario de Estudio 📝
¡Pon a prueba lo que has aprendido! Intenta responder estas preguntas con tus propias palabras basándote en el código del proyecto. Te ayudará a afianzar los conceptos antes de cualquier evaluación.

1. **Sobre Estados:** ¿Cuál es la diferencia entre declarar una variable normal con `let` (como `let contador = 0`) y declarar un estado con `useState` en React? ¿Qué pasa visualmente en la pantalla cuando modificas cada uno?
2. **Sobre Persistencia:** ¿Por qué necesitamos usar obligatoriamente `JSON.stringify()` antes de guardar las tareas en el `localStorage`, y `JSON.parse()` al sacarlas?
3. **Sobre Efectos:** Si a un `useEffect` le pasamos un arreglo vacío de dependencias (`[]`) al final de su declaración, ¿cuántas veces se ejecutará su código interno a lo largo de la vida del componente?
4. **Sobre Arquitectura:** ¿Por qué decidimos "subir" la lógica del Temporizador y de las Tareas al archivo `App.jsx` en lugar de dejarlas aisladas dentro de `PaginaAcademica.jsx`? ¿Qué problema grave resolvió esto cuando queríamos navegar a la vista de Bienestar?
5. **Sobre Arrays y Renderizado:** En el componente `Calendario.jsx` o en `HistorialEmocional.jsx`, utilizamos intensivamente la función `.map()` dentro del `return`. ¿Para qué sirve exactamente esta función cuando estamos trabajando con React?
6. **Sobre el Reloj:** ¿Qué pasaría visualmente con nuestro temporizador Pomodoro si borramos la línea `return () => clearInterval(intervalo);` dentro de su `useEffect` y apretamos "Iniciar" y "Pausar" varias veces?
7. **Sobre Lógica de UI:** En `Navbar.jsx`, ¿qué hace la línea `document.documentElement.classList.add('dark-mode')` y cómo se comunica ese fragmento de JavaScript con el archivo `index.css` para volver toda la pantalla oscura?

¡Mucho éxito con tu estudio! Tienes entre manos una aplicación web robusta, modular y construida con excelentes prácticas arquitectónicas.
