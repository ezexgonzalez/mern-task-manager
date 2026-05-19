# MERN Task Manager

Aplicacion full stack MERN para gestionar tareas personales con autenticacion, rutas protegidas y una interfaz responsive en dark mode.

El proyecto permite registrarse, iniciar sesion, crear tareas, editarlas, eliminarlas, filtrarlas y visualizar un resumen del estado general. Esta pensado como proyecto de portfolio para mostrar un flujo completo entre frontend, API REST y base de datos.

## Demo

Demo URL: pendiente de agregar.

## Screenshots

Pendiente de agregar capturas del proyecto:

- Landing / login
- Dashboard con tareas
- Modal de edicion
- Vista mobile

## Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Zustand
- React Hook Form
- Yup
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Que permite hacer

- Registrarse e iniciar sesion.
- Mantener una sesion autenticada con JWT.
- Proteger rutas privadas en frontend y backend.
- Crear, listar, editar y eliminar tareas.
- Asociar cada tarea al usuario autenticado.
- Organizar tareas por estado, prioridad y fecha limite.
- Buscar tareas por titulo o descripcion.
- Ordenar tareas por relevancia, fecha reciente, fecha limite o prioridad.
- Ver estadisticas generales del tablero.

## Features actuales

- Autenticacion con registro y login.
- Persistencia de sesion mediante token en `localStorage`.
- Verificacion de token al cargar la app.
- Redireccion automatica ante sesion expirada o token invalido.
- Rutas publicas y privadas con React Router.
- API protegida con middleware JWT.
- CRUD completo de tareas.
- Validaciones basicas en frontend y backend.
- Filtros por estado, prioridad y fecha.
- Busqueda con debounce.
- Ordenamiento por relevancia, fecha reciente, fecha limite y prioridad.
- Estadisticas de tareas totales, pendientes, en progreso, completadas, vencidas y proximas.
- Fechas limite y prioridades por tarea.
- UI optimista al crear/actualizar tareas.
- Eliminacion con toast y accion de deshacer.
- Skeleton loading, estados vacios y mensajes de error.
- Interfaz responsive con estilo dark/glass.

## Instalacion local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd mern-task-manager
```

### 2. Configurar el backend

```bash
cd server
npm install
```

Crear un archivo `.env` dentro de `server`:

```env
PORT=5000
MONGO_URI=tu_conexion_de_mongodb
JWT_SECRET=tu_clave_secreta
CORS_ORIGINS=http://localhost:5173
```

Levantar el servidor:

```bash
npm run dev
```

La API queda disponible en:

```text
http://localhost:5000
```

### 3. Configurar el frontend

En otra terminal:

```bash
cd client
npm install
```

Crear un archivo `.env` dentro de `client`:

```env
VITE_API_URL=http://localhost:5000/api
```

Levantar el cliente:

```bash
npm run dev
```

La app queda disponible normalmente en:

```text
http://localhost:5173
```

## Variables de entorno

### Server

| Variable | Descripcion |
| --- | --- |
| `PORT` | Puerto donde corre Express. Por defecto usa `5000`. |
| `MONGO_URI` | URL de conexion a MongoDB. |
| `JWT_SECRET` | Clave usada para firmar y verificar tokens JWT. |
| `CORS_ORIGINS` | Lista de origenes permitidos, separados por coma. Ejemplo: `http://localhost:5173,https://tu-demo.vercel.app`. |

### Client

| Variable | Descripcion |
| --- | --- |
| `VITE_API_URL` | URL base de la API. Ejemplo: `http://localhost:5000/api`. |

## Scripts disponibles

### Server

```bash
npm run dev
npm start
```

- `dev`: ejecuta el backend con `nodemon`.
- `start`: ejecuta el backend con Node.

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev`: levanta Vite en modo desarrollo.
- `build`: genera el build de produccion.
- `lint`: ejecuta ESLint.
- `preview`: previsualiza el build de Vite.

## Estructura del proyecto

```text
mern-task-manager/
|-- client/
|   |-- public/
|   `-- src/
|       |-- components/
|       |-- components/layout/
|       |-- components/task/
|       |-- constants/
|       |-- hooks/
|       |-- pages/
|       |-- router/
|       |-- services/
|       |-- store/
|       `-- utils/
`-- server/
    |-- config/
    |-- controllers/
    |-- middlewares/
    |-- models/
    `-- routes/
```

## Decisiones tecnicas destacables

- Separacion entre frontend y backend para mantener responsabilidades claras.
- API REST protegida con JWT en header `Authorization: Bearer <token>`.
- Estado global de autenticacion con Zustand.
- Interceptor de Axios para agregar token y manejar respuestas `401`.
- Hooks propios para separar logica de tareas, filtros, toasts y undo delete.
- Validacion de formularios con React Hook Form y Yup.
- Validaciones de backend en modelos y controladores para reducir errores esperables.
- Ownership de tareas: cada usuario solo accede a sus propias tareas.
- UI optimista en operaciones de tareas para mejorar la sensacion de velocidad.

## Futuras mejoras realistas

- Agregar tests basicos de backend para auth y CRUD de tareas.
- Agregar `.env.example` para client y server.
- Mejorar accesibilidad de menus, modal y controles custom.
- Agregar middleware global de errores en Express.
- Agregar paginacion o carga incremental si la lista de tareas crece mucho.
- Revisar estrategia de sesion para produccion, por ejemplo cookies httpOnly.
- Agregar screenshots reales y URL de demo desplegada.

## Autor

Desarrollado por Ezequiel Gonzalez.
