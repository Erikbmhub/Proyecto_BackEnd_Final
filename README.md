# 🎬 Movie App — Plataforma de Gestión y Favoritos de Películas

Aplicación web Full-Stack construida con **Node.js**, **Express** y **Pug** que permite a los usuarios registrarse, iniciar sesión (de forma tradicional o mediante **Google OAuth 2.0**), buscar películas a través de la API de **TMDB** con caché en **MongoDB**, gestionar su lista de favoritos y administrar el catálogo y los usuarios según su rol (`user` / `admin`).

---
<img width="420" height="748" alt="{A28ED2F5-09DE-40FC-8F22-56DF3865295A}" src="https://github.com/user-attachments/assets/afdde5fa-4cf7-42ba-86f6-5e1d1555f102" />

<img width="417" height="751" alt="{2AF6055A-ACD8-4015-AD36-6A67FF7BE9B3}" src="https://github.com/user-attachments/assets/6669691a-1c6c-43fe-937b-dc61cc46f799" />

<img width="407" height="743" alt="{0D29C0A0-D2F7-4511-9A61-038D3D55C1C2}" src="https://github.com/user-attachments/assets/f1c94761-befa-4a95-a680-2952d8cc5629" />

<img width="414" height="750" alt="{87D74A95-7704-4EE2-A406-2FD049B28CDA}" src="https://github.com/user-attachments/assets/54bbb340-d49c-496b-a030-08f49e2b8c95" />

<img width="410" height="748" alt="{C7EDA8BB-3029-4573-9517-2FCECD9A25D9}" src="https://github.com/user-attachments/assets/6a044201-852a-48ac-86eb-7792af2e5f20" />

## 🚀 Características Principales

* **Autenticación y Autorización:**
  * Registro e inicio de sesión con contraseña cifrada mediante `bcryptjs` y emisión de **JWT** almacenado en cookies `httpOnly`.
  * Soporte para respuestas tanto de navegador (redirecciones) como peticiones AJAX/`fetch` en formato JSON con validación de errores por campo.
  * Inicio de sesión con **Google OAuth 2.0** (`passport-google-oauth20`) con creación automática de cuenta si el usuario no existe.
  * Control de acceso basado en roles (`user` y `admin`).
* **Arquitectura de Base de Datos Híbrida:**
  * **PostgreSQL (`pg`):** Almacenamiento y gestión de usuarios, credenciales y roles.
  * **MongoDB (`mongoose`):** Almacenamiento del catálogo local de películas y de las listas de favoritos por usuario.
* **Búsqueda e Integración con TMDB:**
  * Portada dinámica con películas destacadas de taquilla.
  * Buscador que consulta primero la base de datos local en MongoDB y, si no encuentra coincidencias, obtiene resultados desde **TMDB** y los persiste localmente.
* **Gestión de Favoritos y Panel de Administración:**
  * Añadir, consultar y eliminar películas favoritas evitando duplicados por usuario (`userId` + `tmdbId`).
  * CRUD de películas en MongoDB y administración de usuarios en PostgreSQL (con borrado en cascada de sus favoritos en MongoDB).

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js
* **Motor de Plantillas y Frontend:** Pug, CSS modular, JavaScript (`fetch`)
* **Bases de Datos:** MongoDB (Mongoose) y PostgreSQL (`pg`)
* **Autenticación y Seguridad:** JSON Web Tokens (`jsonwebtoken`), Passport.js (`passport-google-oauth20`), `bcryptjs`, `express-session`, `cookie-parser`
* **Servicios Externos y Despliegue:** API de TMDB, Vercel

---

## 📂 Estructura del Proyecto

```text
├── config/
│   ├── db.mongo.js          # Conexión a MongoDB mediante Mongoose
│   └── db.postgres.js       # Pool de conexiones a PostgreSQL
├── auth/
│   └── googleAuth.js        # Estrategia de autenticación con Google OAuth 2.0
├── controllers/
│   ├── auth.controller.js       # Registro, login, logout y respuestas JSON/HTML
│   ├── favorites.controller.js  # CRUD de películas favoritas en MongoDB
│   ├── movies.controller.js     # Búsqueda (MongoDB/TMDB) y CRUD de películas
│   ├── users.controller.js      # Gestión de usuarios en PostgreSQL y limpieza en MongoDB
│   └── web.controller.js        # Renderizado de vistas Pug (públicas, usuario y admin)
├── models/
│   ├── favorite.model.js    # Esquema de favoritos (MongoDB)
│   ├── movie.model.js       # Esquema de películas (MongoDB)
│   └── user.model.js        # Consultas SQL de usuarios (PostgreSQL)
├── routes/
│   ├── auth.routes.js       # Endpoints de autenticación (/api/auth)
│   ├── favorites.routes.js  # Endpoints de favoritos (/api/favorites)
│   ├── movies.routes.js     # Endpoints de películas (/api/movie)
│   ├── users.routes.js      # Endpoints de usuarios (/api/user)
│   └── web.routes.js        # Rutas de vistas web (/)
├── services/
│   └── tmdb.service.js      # Consumo de la API externa de TMDB
├── public/                  # Archivos estáticos (CSS, JS cliente, imágenes)
├── views/                   # Plantillas Pug (auth, user, admin, layouts)
├── app.js                   # Configuración principal de Express y middlewares
└── server.js                # Arranque del servidor tras conectar con MongoDB
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor y Seguridad
PORT=3000
JWT_SECRET=tu_secreto_jwt_super_seguro

# MongoDB
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_bd>

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_datos
DB_USER=usuario_postgres
DB_PASSWORD=password_postgres

# Google OAuth 2.0
CLIENT_ID=tu_google_client_id
CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# API Externa (TMDB)
TMDB_API_KEY=tu_api_key_de_tmdb
```

---

## 💻 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Erikbmhub/Proyecto_BackEnd_Final.git
   cd Proyecto_BackEnd_Final
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Añade tu archivo `.env` siguiendo la plantilla de la sección anterior.

4. **Iniciar la aplicación:**
   ```bash
   npm start
   # O en modo desarrollo si dispones de nodemon:
   npm run dev
   ```
   El servidor esperará a que la conexión con MongoDB esté abierta y quedará escuchando en `http://localhost:3000`.

---

## 🔌 Principales Rutas de la Aplicación

### Vistas Web (`/`)
| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Portada con películas destacadas de taquilla |
| `GET` | `/login` | Formulario de inicio de sesión y acceso con Google |
| `GET` | `/signup` | Formulario de registro de nuevos usuarios |
| `GET` | `/dashboard` | Panel principal del usuario autenticado |
| `GET` | `/search` | Resultados de búsqueda y estado de favoritos |
| `GET` | `/search/:title` | Detalle de una película específica |
| `GET` | `/movies` | Lista de favoritos (`user`) o gestión de catálogo (`admin`) |
| `GET` | `/profile` | Perfil del usuario |
| `GET` | `/users` | Panel de administración de usuarios (`admin`) |

### API REST (`/api`)
| Recurso | Base URL | Operaciones Principales |
| :--- | :--- | :--- |
| **Autenticación** | `/api/auth` | Registro (`POST`), Login (`POST`), Logout (`GET`/`POST`), Google OAuth |
| **Películas** | `/api/movie` | Buscar por título (`GET`), Crear (`POST`), Actualizar (`PUT`), Eliminar (`DELETE`) |
| **Favoritos** | `/api/favorites` | Listar favoritos (`GET`), Guardar favorito (`POST`), Eliminar por `tmdbId` (`DELETE`) |
| **Usuarios** | `/api/user` | Crear usuario (`POST`), Actualizar usuario (`PUT /:id`), Eliminar usuario y sus favoritos (`DELETE /:id`) |

---

## ☁️ Despliegue en Producción (Vercel)

El proyecto está preparado para desplegarse en **Vercel** exportando la instancia de Express desde `app.js`:

1. Asegúrate de configurar todas las variables de entorno del `.env` en el panel de **Environment Variables** de Vercel (actualizando `GOOGLE_CALLBACK_URL` con tu dominio de producción).
2. Permite el acceso de red en **MongoDB Atlas** (`0.0.0.0/0`) para las funciones serverless.
3. Despliega desde la terminal con:
   ```bash
   vercel --prod
   ```
