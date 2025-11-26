# Task Manager · Liquid Glass UI

Aplicación **full stack MERN** para gestionar tareas de forma simple y elegante, con un diseño **dark mode + liquid glass** inspirado en interfaces modernas (Apple / Telegram).

Permite:
- Crear, editar y eliminar tareas.
- Asignar estado a cada tarea (Pendiente, En progreso, Completada).
- Proteger el acceso con autenticación basada en **JWT**.
- Disfrutar de una experiencia de usuario fluida, con animaciones suaves y UI consistente.

---

## ✨ Características principales

- 🔐 **Autenticación JWT**
  - Registro de usuario con email, contraseña y nombre.
  - Login seguro.
  - Protección de rutas en el frontend.
  - Persistencia de sesión mediante token.

- ✅ **Gestión de tareas (CRUD completo)**
  - Crear nuevas tareas desde un input tipo “¿Alguna idea nueva?”.
  - Editar una tarea en un modal tipo glass.
  - Eliminar tareas con confirmación visual vía toast.
  - Estados de tarea:
    - `pending`
    - `in-progress`
    - `completed`

- 🧊 **Diseño Liquid Glass / Dark Mode**
  - Tarjetas con fondo blur, bordes suaves y sombras profundas.
  - Gradientes sutiles en el fondo.
  - Botones principales con highlight verde (success).
  - Animaciones con framer-motion en:
    - Drawer de creación de tareas.
    - Modal de edición.
    - Menús flotantes.

- 📱 **UX cuidada**
  - Formularios con validación en tiempo real.
  - Mensajes de error claros (frontend + backend).
  - Toasts de éxito al crear / actualizar / eliminar.
  - Manejo de estados de carga (skeleton al cargar tareas).
  - Layout responsivo y centrado en todas las pantallas.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- **React** (Vite)
- **React Router DOM**
- **Tailwind CSS** (con paleta custom dark + glass)
- **React Hook Form** + **Yup** (validación de formularios)
- **Axios** (consumo de API)
- **Framer Motion** (animaciones)
- **Lucide React** (íconos)
- **Zustand** (gestión de estado de autenticación)

### Backend

- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT (jsonwebtoken)** (autenticación)
- **bcryptjs** (hash de contraseñas)
- **dotenv** (variables de entorno)
- **cors** (configuración de CORS para el frontend)

---

## 🧩 Arquitectura general

- Arquitectura **MERN** clásica:
  - Frontend en React (Vite) consumiendo una API REST.
  - Backend en Express exponiendo endpoints protegidos.
  - Base de datos en MongoDB Atlas.

- Estructura lógica:
  - `User`:
    - `name`
    - `email`
    - `password (hashed)`
  - `Task`:
    - `title`
    - `description`
    - `status` (`pending`, `in-progress`, `completed`)
    - `color`
    - `user` (referencia al usuario dueño de la tarea)
    - `timestamps`

- Flujo de autenticación:
  1. El usuario se registra o inicia sesión.
  2. El backend genera un **JWT** con la info del usuario.
  3. El token se guarda en el frontend.
  4. Cada request protegida envía el token en los headers.
  5. El backend valida el token antes de acceder a las rutas privadas.

---

## 📂 Estructura básica del proyecto

(Ejemplo simplificado)

``bash
root
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── services/
│   └── ...
└── server/              # Backend (Express)
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middlewares/
    └── index.js

## ⚙️ Variables de entorno

### Backend (`server/.env`)

``env
PORT=5000
MONGO_URI=tu_conexion_de_mongo_atlas
JWT_SECRET=tu_clave_super_secreta
CLIENT_URL=http://localhost:5173


### Frontend (client/.env)
VITE_API_URL=http://localhost:5000/api


🚀 Scripts disponibles
Backend

Desde la carpeta server:

# Desarrollo
npm run dev


El backend corre con nodemon y recarga automáticamente.

Frontend

Desde la carpeta client:

# Desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview

▶️ Cómo correr el proyecto localmente

Clonar el repositorio:

git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo


# Instalar dependencias del backend:

cd server
npm install


# Configurar el archivo .env del backend (Mongo, JWT, etc.).

# Levantar el backend:

npm run dev


En otra terminal, instalar dependencias del frontend:

cd ../client
npm install


Configurar el .env del frontend (VITE_API_URL apuntando al backend).

# Levantar el frontend:

npm run dev


Abrir en el navegador:

http://localhost:5173

🌱 Roadmap / mejoras futuras

Filtros por estado (ver solo pendientes, en progreso, completadas).

Botón rápido para marcar tareas como completadas desde la tarjeta.

Manejo avanzado de errores (token expirado, problemas de red, etc.).

Soporte multi-idioma.

Tema claro / oscuro con toggle.

Estadísticas simples (número de tareas por estado).

🧑‍💻 Autor

Desarrollado por Ezequiel Gonzalez
Full Stack Developer (MERN)