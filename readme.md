# StudyBalance — Plan de Desarrollo Front-End

> Actúa como un Desarrollador Front-End Senior experto en React.

---

## 1. Descripción del Proyecto

**StudyBalance** es una plataforma web diseñada para ayudar a los estudiantes a equilibrar sus responsabilidades académicas con el cuidado de su salud mental.

**ODS relacionados:**
- ODS 3: Salud y bienestar
- ODS 4: Educación de calidad
- ODS 10: Reducción de la desigualdad

---

## 2. Stack Tecnológico

| Tecnología        | Uso                                          |
|-------------------|----------------------------------------------|
| React 18 + Vite   | Framework principal y bundler                |
| Node.js           | Entorno de ejecución                         |
| JavaScript (JSX)  | Lógica de componentes                        |
| CSS puro          | Estilos sin frameworks externos              |
| LocalStorage API  | Persistencia de datos en el navegador        |
| react-router-dom v6 | Navegación entre módulos (SPA)             |

> **Nota técnica:** Se usa `react-router-dom v6` para la navegación entre el módulo académico
> y el de bienestar. Es obligatorio para mantener URLs limpias y un historial de navegación correcto.

---

## 3. Arquitectura General

- **Componentes funcionales** exclusivamente (sin clases).
- **Hooks nativos**: `useState`, `useEffect`, `useCallback`, `useMemo`.
- **Persistencia Directa**: La lectura y escritura en LocalStorage se manejará directamente en el componente raíz (`App.jsx`) utilizando `useState` (con inicialización perezosa) y `useEffect`.
- El estado global de `tareas` y `registrosAnimo` vive en `App.jsx` y se pasa como **props**
  a los componentes hijos.
- Las funciones CRUD se definen en `App.jsx` y se memorizan con `useCallback` antes de pasarlas
  como props, para evitar re-renders innecesarios en los componentes hijos.

---

## 4. Estructura de Carpetas

```
studybalance/
└── src/
    ├── assets/
    │   ├── App.css                    # Estilos globales de la aplicación
    │   └── index.css                  # Reset CSS y variables de diseño (colores, fuentes)
    │
    ├── components/
    │   ├── Academico/
    │   │   ├── FormularioTarea.jsx    # Formulario para crear/editar tareas (recibe tareaEnEdicion)
    │   │   ├── ListaTareas.jsx        # Contenedor que renderiza la lista
    │   │   ├── TareaItem.jsx          # Ítem individual de tarea
    │   │   ├── Calendario.jsx         # Vista de tareas agrupadas por fecha (sin librerías externas)
    │   │   └── Temporizador.jsx       # Temporizador Pomodoro de estudio
    │   │
    │   ├── Bienestar/
    │   │   ├── RegistroAnimo.jsx          # Formulario de registro diario de ánimo
    │   │   ├── HistorialEmocional.jsx     # Lista de registros de ánimo previos
    │   │   ├── EjerciciosRelajacion.jsx   # Tarjetas de ejercicios de respiración/mindfulness
    │   │   └── ContenidoSaludMental.jsx   # Artículos/recursos educativos
    │   │
    │   └── UI/
    │       ├── Navbar.jsx             # Barra de navegación principal con links a rutas
    │       └── Footer.jsx             # Pie de página con info ODS
    │
    ├── pages/
    │   ├── PaginaAcademica.jsx        # Página que agrupa los componentes académicos
    │   └── PaginaBienestar.jsx        # Página que agrupa los componentes de bienestar
    │
    ├── App.jsx                        # Componente raíz: estado global, rutas, lógica CRUD
    └── main.jsx                       # Punto de entrada: monta <App /> con <BrowserRouter>
```

---

## 5. Esquemas de Datos (Modelos)

Todos los datos se persisten en LocalStorage como **JSON strings**.
Estos son los modelos exactos que deben usarse:

### 5.1 Tarea (Módulo Académico)

```js
{
  id: string,           // crypto.randomUUID() — identificador único e inmutable
  nombre: string,       // Nombre descriptivo de la tarea (obligatorio)
  fecha: string,        // Fecha límite en formato "YYYY-MM-DD" (obligatorio)
  materia: string,      // Materia o asignatura (opcional, puede ser "")
  prioridad: string,    // "alta" | "media" | "baja" (default: "media")
  completada: boolean,  // false por defecto, se invierte con toggleCompletada
  creadoEn: string,     // new Date().toISOString() al momento de crear
}
```

**Clave en LocalStorage:** `"studybalance_tareas"`

### 5.2 Registro de Ánimo (Módulo de Bienestar)

```js
{
  id: string,           // crypto.randomUUID() — identificador único e inmutable
  fecha: string,        // Fecha del registro "YYYY-MM-DD" (automática, del día actual)
  animo: string,        // "feliz" | "tranquilo" | "estresado" | "triste" | "ansioso"
  energia: number,      // Nivel de energía del 1 al 5 (slider o botones)
  nota: string,         // Texto libre del diario emocional (opcional, max 500 chars)
  creadoEn: string,     // new Date().toISOString() al momento de guardar
}
```

**Clave en LocalStorage:** `"studybalance_animos"`

---

## 6. Persistencia de Datos con LocalStorage

La persistencia se manejará directamente en el componente raíz (`App.jsx`) utilizando los hooks estándar de React (`useState` y `useEffect`), sin recurrir a archivos externos ni custom hooks.

**Comportamiento esperado en `App.jsx`:**
1. **Inicialización perezosa (Lazy initialization):** Al declarar los estados de `tareas` y `registrosAnimo`, se pasará una función a `useState`. Esta función intentará leer el valor de LocalStorage (`studybalance_tareas` y `studybalance_animos`).
2. Si el valor existe en LocalStorage, lo parsea con `JSON.parse` y lo usa como estado inicial.
3. Si no existe o falla el parseo (dato corrupto), se inicializa con un array vacío `[]`.
4. **Sincronización:** Se utilizarán hooks `useEffect` (uno para tareas y otro para ánimos) que escuchen los cambios en dichos estados. Cada vez que el estado cambie, el `useEffect` lo serializará con `JSON.stringify` y lo guardará.

**Uso sugerido en App.jsx:**
```js
const [tareas, setTareas] = useState(() => {
  const guardado = localStorage.getItem("studybalance_tareas");
  return guardado ? JSON.parse(guardado) : [];
});

useEffect(() => {
  localStorage.setItem("studybalance_tareas", JSON.stringify(tareas));
}, [tareas]);
// (Repetir lógica idéntica para registrosAnimo)
```

---

## 7. Definición Completa de CRUDs

### 7.1 CRUD de Tareas

Todas las funciones se definen en `App.jsx` con `useCallback` y se pasan como props.

| Operación | Función            | Descripción                                                              |
|-----------|--------------------|--------------------------------------------------------------------------|
| Create    | `agregarTarea`     | Valida campos, genera `id` con `crypto.randomUUID()`, agrega al array    |
| Read      | `tareas` (estado)  | El array se pasa como prop a `ListaTareas.jsx`                           |
| Update    | `editarTarea`      | Recibe `id` + campos modificados, reemplaza el objeto en el array        |
| Update    | `toggleCompletada` | Recibe `id`, invierte el boolean `completada` de esa tarea               |
| Delete    | `eliminarTarea`    | Filtra el array excluyendo el objeto con ese `id`                        |

> **Nota sobre Edición:** Para editar, `PaginaAcademica.jsx` mantendrá un estado local `tareaEnEdicion`. Cuando se haga clic en "Editar" en un `TareaItem`, se actualizará este estado, y `FormularioTarea` se pre-llenará con esos datos. Al guardar, se llama a `editarTarea` y se limpia el estado.

### 7.2 CRUD de Registros de Ánimo

| Operación | Función                 | Descripción                                                           |
|-----------|-------------------------|-----------------------------------------------------------------------|
| Create    | `agregarRegistroAnimo`  | Valida que se haya seleccionado ánimo y energía, guarda con fecha auto|
| Read      | `registrosAnimo`        | El array se pasa como prop a `HistorialEmocional.jsx`                 |
| Delete    | `eliminarRegistroAnimo` | Filtra el array excluyendo el registro con ese `id`                   |

> **Decisión de diseño:** No se implementa Update en registros de ánimo.
> Cada día genera un nuevo registro (no se edita el pasado), lo cual mantiene la integridad
> del historial emocional. Si el usuario quiere corregir, elimina y vuelve a crear.

---

## 8. Validaciones de Formularios

Todos los mensajes de error deben mostrarse **bajo el campo inválido** en el JSX.
**No usar `alert()`** ni `confirm()` del navegador.

### FormularioTarea.jsx — Estado de errores sugerido:
```js
const [errores, setErrores] = useState({ nombre: "", fecha: "" });
```

| Campo      | Regla                                                              |
|------------|--------------------------------------------------------------------|
| `nombre`   | Obligatorio, mínimo 3 caracteres, máximo 100                       |
| `fecha`    | Obligatoria, no puede ser una fecha anterior a hoy                 |
| `materia`  | Opcional, máximo 80 caracteres                                     |
| `prioridad`| Tiene valor por defecto `"media"`, no necesita validación extra    |

### RegistroAnimo.jsx — Estado de errores sugerido:
```js
const [errores, setErrores] = useState({ animo: "", energia: "" });
```

| Campo     | Regla                                                               |
|-----------|---------------------------------------------------------------------|
| `animo`   | Obligatorio, debe ser uno de los 5 valores válidos                  |
| `energia` | Obligatorio, debe estar entre 1 y 5                                 |
| `nota`    | Opcional, máximo 500 caracteres (mostrar contador en tiempo real)   |

---

## 9. Navegación entre Módulos (`react-router-dom v6`)

Las rutas se definen dentro de `App.jsx` usando `<Routes>` y `<Route>`.
`main.jsx` envuelve `<App />` en `<BrowserRouter>`.

| Ruta          | Componente de Página    | Descripción                         |
|---------------|-------------------------|-------------------------------------|
| `/`           | `PaginaAcademica.jsx`   | Vista por defecto al entrar a la app|
| `/bienestar`  | `PaginaBienestar.jsx`   | Módulo emocional completo           |

`Navbar.jsx` usará `<NavLink>` para aplicar una clase CSS `activo` a la ruta activa.

---

## 10. Fases de Desarrollo (Paso a Paso)

### Fase 1: Configuración del Proyecto

1. Inicializar con Vite: `npm create vite@latest studybalance -- --template react`
2. Instalar dependencias: `npm install react-router-dom`
3. Limpiar archivos de Vite por defecto (borrar `App.css` de Vite, `logo.svg`, etc.)
4. Crear la estructura de carpetas completa (sección 4).
5. Configurar `src/main.jsx`: envolver `<App />` en `<BrowserRouter>`.
6. Configurar `src/App.jsx`:
   - Importar `useState`, `useEffect`, `useCallback`
   - Definir `tareas` y `registrosAnimo` con `useState` (inicializando desde LocalStorage de forma perezosa)
   - Configurar `useEffect` para sincronizar los cambios de estado hacia LocalStorage
   - Definir todas las funciones CRUD con `useCallback`
   - Definir rutas con `<Routes>` y `<Route>`
7. Crear `src/assets/index.css`: variables CSS globales (colores, tipografía, espaciados).

### Fase 2: UI Base — Navbar y Footer

1. Crear `Navbar.jsx` con `<NavLink>` a rutas `/` y `/bienestar`, logo y nombre de la app.
2. Crear `Footer.jsx` con información de los ODS y créditos del proyecto.
3. Aplicar estilos base en `App.css` (layout principal con flexbox, altura mínima 100vh).

### Fase 3: Módulo Académico (CRUD de Tareas)

1. Crear `FormularioTarea.jsx`:
   - `useState` para cada campo: `nombre`, `fecha`, `materia`, `prioridad`.
   - `useState` para objeto `errores`.
   - Recibe prop opcional `tareaEnEdicion`. Si existe, inicializa los campos con sus valores usando `useEffect`.
   - Al hacer submit: validar → llamar prop `onAgregarTarea` o `onEditarTarea` según corresponda → resetear.

2. Crear `TareaItem.jsx`:
   - Props: `tarea`, `onToggle`, `onEliminar`, `onEditar`.
   - Muestra: nombre, fecha, materia, badge de prioridad con color, checkbox de completada.
   - Botones: "Eliminar" y "Editar" (el botón Editar llamará a `onEditar(tarea)`).

3. Crear `ListaTareas.jsx`:
   - Props: `tareas`, `onToggle`, `onEliminar`, `onEditar`.
   - Ordena: pendientes primero, luego completadas; dentro de cada grupo por fecha.
   - Muestra mensaje vacío amigable si no hay tareas.
   - Renderiza `<TareaItem>` por cada tarea.

4. Crear `Calendario.jsx`: vista visual simplificada (usando CSS Grid/Flexbox) de tareas agrupadas por fecha, sin dependencias externas.

5. Crear `Temporizador.jsx` (Pomodoro):
   - `useState` para `minutos`, `segundos`, `activo`, `modo` ("trabajo" | "descanso").
   - `useEffect` con `setInterval` para el conteo, limpiando con `clearInterval` en el cleanup.
   - Botones: Iniciar, Pausar, Reiniciar.

6. Crear `PaginaAcademica.jsx`:
   - Mantiene un estado local `const [tareaEnEdicion, setTareaEnEdicion] = useState(null);`
   - Importa y compone `FormularioTarea`, `ListaTareas`, `Calendario` y `Temporizador`.
   - Pasa `setTareaEnEdicion` como handler a `ListaTareas` (para el botón Editar).

### Fase 4: Módulo de Bienestar (CRUD Emocional)

1. Crear `RegistroAnimo.jsx`:
   - `useState` para: `animo`, `energia`, `nota`, `errores`.
   - `animo`: botones visuales con emoji (no un select tradicional).
   - `energia`: slider o botones del 1 al 5.
   - Al hacer submit: validar → llamar prop `onAgregarRegistro(nuevoRegistro)` → resetear.

2. Crear `HistorialEmocional.jsx`:
   - Props: `registros`, `onEliminar`.
   - Muestra tarjetas con fecha, emoji de ánimo, nivel de energía y nota.
   - Botón "Eliminar" en cada tarjeta.
   - Mensaje motivacional si el historial está vacío.

3. Crear `EjerciciosRelajacion.jsx`:
   - Tarjetas estáticas con 4-6 ejercicios de respiración y mindfulness.

4. Crear `ContenidoSaludMental.jsx`:
   - Tarjetas estáticas con recursos y consejos de salud mental.

5. Crear `PaginaBienestar.jsx`: importa y compone todos los componentes anteriores.

### Fase 5: Estadísticas y Pulido Final

1. Sección de estadísticas en `PaginaAcademica.jsx`:
   - Total de tareas, completadas, pendientes.
   - Tarea más próxima (ordenar por fecha y tomar la primera no completada).

2. Resumen de evolución emocional en `PaginaBienestar.jsx`:
   - Últimos 7 registros: ánimo más frecuente, promedio de energía.

3. Responsive design: media queries en CSS para móvil (punto de quiebre: 768px).

4. Accesibilidad: `aria-label` en botones de ícono, roles semánticos correctos,
   contraste de colores adecuado.

---

## 11. Flujo de Datos (Props Drilling)

```
App.jsx
 ├── tareas, agregarTarea, editarTarea, toggleCompletada, eliminarTarea
 │    └── PaginaAcademica.jsx
 │         ├── FormularioTarea  ← recibe: onAgregarTarea
 │         ├── ListaTareas      ← recibe: tareas, onToggle, onEliminar, onEditar
 │         │    └── TareaItem   ← recibe: tarea, onToggle, onEliminar, onEditar
 │         ├── Calendario       ← recibe: tareas (solo lectura)
 │         └── Temporizador     (sin props, estado totalmente local)
 │
 └── registrosAnimo, agregarRegistroAnimo, eliminarRegistroAnimo
      └── PaginaBienestar.jsx
           ├── RegistroAnimo        ← recibe: onAgregarRegistro
           ├── HistorialEmocional   ← recibe: registros, onEliminar
           ├── EjerciciosRelajacion (sin props, contenido estático)
           └── ContenidoSaludMental (sin props, contenido estático)
```

---

## 12. Contexto del Proyecto (Referencia)

**Problemática:** Necesidad de una herramienta que ayude a los estudiantes a equilibrar
su vida académica con su bienestar emocional, promoviendo educación de calidad y salud mental.

**Funcionalidades principales:**
1. **Organización académica:** Agenda de tareas con prioridades, calendario de evaluaciones
   y temporizador Pomodoro.
2. **Bienestar emocional:** Registro diario de estado de ánimo, diario emocional, ejercicios
   de relajación y contenido educativo sobre salud mental.
3. **Visualización de hábitos:** Estadísticas de estudio y evolución emocional para favorecer
   el autoconocimiento y adopción de hábitos saludables.
