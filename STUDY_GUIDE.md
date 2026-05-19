# Study Guide - MERN Task Manager

Guia para estudiar y explicar el proyecto en entrevistas tecnicas. El objetivo no es vender la app, sino entender como esta construida, que decisiones toma y que mejoras tendria sentido hacer despues.

## 1. Resumen general

MERN Task Manager es una aplicacion full stack para gestionar tareas personales.

Permite:

- Registrar usuarios e iniciar sesion.
- Proteger rutas privadas con autenticacion JWT.
- Crear, listar, editar y eliminar tareas.
- Asociar cada tarea al usuario autenticado.
- Filtrar, buscar, ordenar y ver estadisticas de tareas.
- Manejar sesion expirada desde el frontend.
- Mostrar una UI responsive con estados de carga, toasts y undo delete.

El proyecto esta separado en dos partes:

- `client`: frontend en React con Vite.
- `server`: API REST en Express conectada a MongoDB con Mongoose.

## 2. Arquitectura client/server

### Client

El frontend vive en `client/src`.

Capas principales:

- `pages`: pantallas como `Home`, `Login`, `Register`, `Dashboard`.
- `router`: rutas publicas, privadas y manejo de sesion.
- `components`: UI reutilizable.
- `components/task`: piezas internas de las tarjetas y controles de tareas.
- `hooks`: logica reutilizable de tareas, filtros, toasts y undo delete.
- `services`: llamadas HTTP con Axios.
- `store`: estado global de autenticacion con Zustand.
- `utils`: helpers para errores, fechas y estadisticas.
- `constants`: opciones de estados, prioridades y badges.

### Server

El backend vive en `server`.

Capas principales:

- `index.js`: configura Express, CORS, JSON, conexion a MongoDB y rutas.
- `routes`: define endpoints de auth y tareas.
- `controllers`: contiene la logica de cada endpoint.
- `models`: schemas de Mongoose para `User` y `Task`.
- `middlewares`: middleware `authRequired` para proteger endpoints.
- `config`: conexion a MongoDB.

## 3. Flujo completo de autenticacion

### Register

Archivo principal: `server/controllers/auth.controller.js`.

1. El usuario completa nombre, email, password y confirmacion.
2. El frontend valida con React Hook Form + Yup.
3. `authService.registerUser` envia un `POST /api/auth/register`.
4. El backend valida que los campos existan y sean strings.
5. Normaliza el email con `trim().toLowerCase()`.
6. Verifica si ya existe un usuario con ese email.
7. Hashea la contrasena con `bcryptjs`.
8. Guarda el usuario en MongoDB.
9. Responde con mensaje de exito.

El registro no inicia sesion automaticamente. Despues del registro, el frontend redirige al login.

### Login

1. El usuario ingresa email y password.
2. `authService.loginUser` envia `POST /api/auth/login`.
3. El backend valida campos.
4. Busca el usuario por email normalizado.
5. Compara password con `bcrypt.compare`.
6. Si el usuario no existe o la password no coincide, responde `401` con un mensaje unico.
7. Si todo esta bien, genera un JWT con `id`, `email` y `name`.
8. Devuelve `token` y `user`.
9. El frontend guarda el token usando `useAuthStore.login`.

### JWT

El JWT se firma en backend con `JWT_SECRET` y expira en 7 dias.

Contiene:

- `id`: id del usuario.
- `email`: email del usuario.
- `name`: nombre del usuario.

El backend verifica este token en rutas protegidas con el middleware `authRequired`.

### localStorage

El token se guarda en `localStorage` desde `useAuthStore`.

Ventaja:

- Es simple para una app de portfolio.
- Facilita persistir sesion al recargar la pagina.

Desventaja:

- Es vulnerable si la app sufre XSS.
- En produccion, una alternativa mas segura suele ser usar cookies `httpOnly`, `secure` y `sameSite`.

### Axios interceptor

Archivo: `client/src/services/api.js`.

Hay dos interceptores:

- Request interceptor: lee `token` desde `localStorage` y agrega `Authorization: Bearer <token>`.
- Response interceptor: si recibe `401` y habia token, elimina el token y dispara el evento global `auth:unauthorized`.

Esto centraliza la autenticacion de requests y evita repetir headers en cada servicio.

### PrivateRoute

Archivo: `client/src/router/PrivateRoute.jsx`.

Protege rutas que requieren usuario autenticado.

Logica:

- Si `loading` esta activo, muestra `Loader`.
- Si no hay autenticacion, redirige a `/login`.
- Si hay autenticacion, renderiza la ruta privada con `Outlet`.

### PublicRoute

Archivo: `client/src/router/PublicRoute.jsx`.

Evita que un usuario autenticado entre a rutas como login o register.

Logica:

- Si `loading` esta activo, muestra `Loader`.
- Si el usuario esta autenticado, redirige a `/dashboard`.
- Si no esta autenticado, deja ver la ruta publica.

### AuthSessionHandler

Archivo: `client/src/router/AuthSessionHandler.jsx`.

Escucha el evento global `auth:unauthorized`.

Cuando ocurre:

1. Ejecuta `logout`.
2. Borra el estado autenticado.
3. Redirige a `/login`.
4. Pasa `state: { sessionExpired: true }`.

El login usa ese state para mostrar un mensaje de sesion expirada.

### Sesion expirada

Cuando el token expira o es invalido:

1. El backend responde `401`.
2. Axios interceptor detecta el `401`.
3. Borra el token.
4. Dispara `auth:unauthorized`.
5. `AuthSessionHandler` redirige al login.
6. `LoginForm` muestra el mensaje de sesion expirada.

## 4. Flujo completo de tareas

### Creacion

Archivos principales:

- `TaskFormWrapper`
- `TaskForm`
- `useTasks`
- `taskService`
- `task.controller.js`

Flujo:

1. El usuario escribe el titulo y abre el formulario.
2. `TaskForm` valida campos con Yup.
3. `useTasks.createTask` crea una tarea temporal optimista en UI.
4. `taskService.createTask` envia `POST /api/tasks`.
5. Axios agrega el token.
6. Backend valida el token con `authRequired`.
7. `createTask` valida datos basicos.
8. Crea la tarea asociada a `req.user.id`.
9. El frontend reemplaza la tarea temporal por la real.

### Listado

1. `useTasks` ejecuta `fetchTasks` al montar.
2. `taskService.getTasks` llama `GET /api/tasks`.
3. Backend usa `req.user.id`.
4. Busca solo tareas del usuario: `Task.find({ user: userId })`.
5. Ordena por `createdAt: -1`.
6. Devuelve el array de tareas.

### Edicion

1. El usuario abre el menu de una tarjeta y elige editar.
2. `TaskEditModal` renderiza `TaskForm` con datos iniciales.
3. Al guardar, `useTasks.updateTask` actualiza la UI de forma optimista.
4. `taskService.updateTask` envia `PUT /api/tasks/:id`.
5. Backend valida ObjectId, datos y ownership.
6. Actualiza solo los campos enviados.
7. Si falla, el frontend restaura el estado previo.

### Eliminacion

La eliminacion usa undo delete.

1. El usuario elige eliminar.
2. `useUndoDelete` guarda la tarea en una referencia.
3. La tarea se elimina localmente de la UI.
4. Se muestra un toast con accion "Deshacer".
5. Si el usuario deshace, se restaura la tarea localmente.
6. Si el timer termina, se llama al backend con `DELETE /api/tasks/:id`.
7. Backend valida token, ObjectId y ownership.
8. Elimina la tarea con `deleteOne`.

### Ownership por usuario

Cada tarea tiene un campo `user` que referencia al usuario dueno.

En backend:

- `getTasks` lista solo tareas del usuario autenticado.
- `getTaskById`, `updateTask` y `deleteTask` verifican que `task.user.toString() === req.user.id`.
- Si otro usuario intenta acceder, el backend responde `403`.

Esto evita que un usuario pueda leer, editar o borrar tareas ajenas aunque conozca el id.

## 5. Filtros, busqueda, ordenamiento y estadisticas

Archivo principal: `client/src/hooks/useTaskFilters.js`.

### Filtros

La app filtra en frontend sobre el array de tareas ya cargado.

Filtros actuales:

- Estado: todas, pendientes, en progreso, completadas.
- Prioridad: todas, alta, media, baja.
- Fecha: todas, vencidas, hoy, proximas, sin fecha.
- Mostrar/ocultar completadas.

Los filtros se guardan en `localStorage` para mantener preferencias del usuario.

### Busqueda

La busqueda filtra por:

- `title`
- `description`

Usa un debounce de 250 ms para no recalcular en cada tecla inmediatamente.

### Ordenamiento

Opciones:

- `smart`: ordena por estado y luego por fecha de actualizacion/creacion.
- `recent`: tareas mas recientes primero.
- `dueDate`: fecha limite mas cercana primero.
- `priority`: alta, media, baja.

### Estadisticas

Archivo: `client/src/utils/taskStats.js`.

Calcula:

- Total.
- Pendientes.
- En progreso.
- Completadas.
- Vencidas.
- Proximas.

`TaskStats` muestra esos datos en tarjetas compactas.

## 6. Manejo de errores frontend/backend

### Backend

Patrones actuales:

- `400`: datos invalidos o campos faltantes.
- `401`: auth invalida o token faltante/expirado.
- `403`: usuario sin permiso sobre una tarea.
- `404`: tarea inexistente.
- `500`: errores inesperados.

Auth:

- Login invalido usa mensaje unico para no filtrar si fallo email o password.
- Register no devuelve el error crudo al frontend.

Tareas:

- Valida ObjectId antes de `findById`.
- Convierte `ValidationError` y `CastError` de Mongoose en `400`.
- Evita `CastError 500` para rutas `/api/tasks/:id`.

### Frontend

Patrones actuales:

- Servicios en `services` capturan mensajes de backend.
- `getErrorMessage` normaliza errores para mostrar mensajes.
- `useTasks` guarda `error` para errores de listado.
- Formularios muestran errores de validacion y errores de servidor.
- Axios interceptor maneja `401` de forma global.
- Toasts muestran feedback de update/delete.
- Skeletons cubren estados de carga.

## 7. Componentes y hooks importantes

### useAuthStore

Archivo: `client/src/store/useAuthStore.js`.

Responsabilidades:

- Guardar `user`, `isAuthenticated` y `loading`.
- Verificar token con `checkAuth`.
- Guardar token y usuario con `login`.
- Borrar token y estado con `logout`.

### useTasks

Archivo: `client/src/hooks/useTasks.js`.

Responsabilidades:

- Cargar tareas.
- Crear tareas con UI optimista.
- Actualizar tareas con rollback si falla.
- Eliminar/restaurar localmente para soportar undo delete.
- Enviar eliminacion definitiva al backend.

### useTaskFilters

Archivo: `client/src/hooks/useTaskFilters.js`.

Responsabilidades:

- Guardar estado de filtros, busqueda y orden.
- Persistir filtros en `localStorage`.
- Calcular tareas visibles.
- Calcular contadores y estadisticas.
- Resetear filtros activos.

### useUndoDelete

Archivo: `client/src/hooks/useUndoDelete.js`.

Responsabilidades:

- Eliminar una tarea localmente.
- Mostrar toast con accion de deshacer.
- Restaurar si el usuario cancela.
- Confirmar delete en servidor cuando termina el timer.
- Confirmar delete pendiente si el hook se desmonta.

### TaskControls

Archivo: `client/src/components/TaskControls.jsx`.

Responsabilidades:

- Renderizar busqueda.
- Renderizar chips de estado.
- Mostrar/ocultar completadas.
- Renderizar filtros avanzados de prioridad, fecha y orden.
- Resetear filtros.

### TaskStats

Archivo: `client/src/components/TaskStats.jsx`.

Responsabilidades:

- Mostrar resumen numerico del tablero.
- Mostrar total, pendientes, en progreso, completadas, vencidas y proximas.

### TaskCard

Archivo: `client/src/components/TaskCard.jsx`.

Responsabilidades:

- Mostrar titulo, descripcion, prioridad y fecha limite.
- Mostrar estado visual.
- Abrir menu de acciones.
- Permitir completar/reabrir, editar o eliminar.
- Deshabilitar acciones mientras la tarea esta pendiente de creacion.

### TaskForm

Archivo: `client/src/components/TaskForm.jsx`.

Responsabilidades:

- Crear o editar tareas.
- Validar formulario con Yup.
- Manejar estado de submit.
- Seleccionar estado, prioridad y fecha limite.
- Reutilizarse en drawer de creacion y modal de edicion.

## 8. Decisiones tecnicas

### Por que JWT

JWT permite que el backend sea stateless: no necesita guardar sesiones en memoria. Cada request lleva su token y el servidor lo verifica con `JWT_SECRET`.

Para este proyecto es una opcion simple y comun en APIs REST.

### Por que rutas protegidas

Hay dos niveles de proteccion:

- Frontend: evita que un usuario no autenticado vea `/dashboard`.
- Backend: protege realmente los datos con `authRequired`.

La proteccion importante es la del backend. La del frontend mejora UX, pero no reemplaza la seguridad de la API.

### Por que filtros en frontend

Las tareas se cargan todas para el usuario y luego se filtran localmente.

Ventajas:

- UI rapida.
- Menos requests al cambiar filtros.
- Logica simple para una app personal.

Tradeoff:

- Si un usuario tiene miles de tareas, convendria mover filtros/paginacion al backend.

### Por que componentes reutilizables

Separar piezas como `TaskForm`, `TaskCard`, `TaskStats` y `TaskControls` ayuda a:

- Reducir duplicacion.
- Separar responsabilidades.
- Facilitar cambios visuales o funcionales.
- Reutilizar `TaskForm` tanto para crear como para editar.

### localStorage vs cookies httpOnly

`localStorage`:

- Simple de implementar.
- Facil de usar con Axios.
- Practico para portfolio.
- Riesgo: si hay XSS, el token puede ser leido por JavaScript.

Cookies `httpOnly`:

- Mas seguras contra robo directo via JavaScript.
- Requieren configurar `credentials`, CORS, `sameSite`, `secure` y proteccion CSRF segun el caso.
- Son una mejora razonable para una version mas cercana a produccion.

## 9. Preguntas de entrevista con respuestas breves

### Como proteges las rutas?

En frontend uso `PrivateRoute` para redirigir si no hay sesion. En backend uso `authRequired`, que valida el JWT del header `Authorization`. La seguridad real esta en backend.

### Que contiene el JWT?

Contiene `id`, `email` y `name` del usuario. El `id` se usa para asociar y consultar tareas del usuario autenticado.

### Como evitas que un usuario edite tareas de otro?

Cada tarea guarda el campo `user`. Antes de leer, editar o eliminar por id, el backend compara `task.user` con `req.user.id`. Si no coinciden, responde `403`.

### Que pasa si el token expira?

La API responde `401`. El interceptor de Axios borra el token y dispara `auth:unauthorized`. `AuthSessionHandler` hace logout y redirige al login con un mensaje de sesion expirada.

### Por que usaste filtros en frontend?

Porque para una app personal el volumen de datos esperado es bajo o moderado. Filtrar en frontend hace la UI mas rapida y evita requests por cada cambio. Si creciera, moveria filtros y paginacion al backend.

### Como manejas errores de API?

Backend devuelve codigos adecuados: `400`, `401`, `403`, `404`, `500`. Frontend captura mensajes desde servicios, usa `getErrorMessage`, muestra errores en formularios o dashboard y maneja `401` globalmente.

### Que es optimistic UI en este proyecto?

Al crear o actualizar tareas, la UI refleja el cambio antes de que el servidor responda. Si falla, se revierte o se muestra error. Mejora la sensacion de velocidad.

### Como funciona undo delete?

Primero se borra la tarea localmente y se muestra un toast con "Deshacer". Si el usuario no deshace, se envia el delete real al servidor despues de un timer.

### Que validaciones agregaste en backend?

Validacion de tipos antes de `trim`, `ObjectId` invalido como `400`, enums/defaults para tareas, limites de titulo/descripcion, dueDate valido y errores de Mongoose como `400`.

### Que deuda tecnica reconoces?

Algunos componentes son grandes, como `TaskControls` y formularios de auth. Tambien faltan tests automatizados, middleware global de errores y `.env.example`.

## 10. Que mejoraria en una version futura

- Tests de backend para auth y CRUD.
- Tests de componentes o flujos principales en frontend.
- `.env.example` para client y server.
- Middleware global de errores en Express.
- Mejor accesibilidad en menus custom, modal y selects.
- Paginacion o filtros server-side si crece la cantidad de tareas.
- Cookies `httpOnly` para una sesion mas segura.
- Refresh token si se busca una experiencia de sesion mas robusta.
- Capturas reales y demo desplegada.
- Refactor de componentes grandes en piezas mas pequenas.

## 11. Checklist para explicar el proyecto en 2 minutos

1. Es una app MERN de gestion de tareas con auth y dashboard privado.
2. El frontend esta en React/Vite y consume una API REST con Axios.
3. El backend esta en Express, usa MongoDB/Mongoose y protege rutas con JWT.
4. El usuario se registra, inicia sesion y recibe un token.
5. El token se guarda en `localStorage` y Axios lo manda en cada request.
6. `PrivateRoute` protege el dashboard y el backend valida el token con `authRequired`.
7. Las tareas pertenecen a un usuario mediante el campo `user`.
8. El backend verifica ownership antes de leer, editar o eliminar por id.
9. El dashboard permite CRUD, filtros, busqueda, ordenamiento y estadisticas.
10. La UI usa hooks propios para separar auth, tareas, filtros y undo delete.
11. Los errores esperables usan codigos HTTP claros.
12. Como mejora futura agregaria tests, mejor accesibilidad y cookies `httpOnly`.
