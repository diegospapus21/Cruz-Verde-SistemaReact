# Sistema de Asistencias - Cruz Verde

Sistema web para el control de asistencias de voluntarios de la Cruz Verde, con geolocalización y gestión administrativa.

## Tecnologías Utilizadas

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Base de Datos:** MongoDB
- **Autenticación:** JWT (JSON Web Tokens)
- **Geolocalización:** HTML5 Geolocation API

##  Características

### Para Voluntarios:
- Registro de entrada y salida con geolocalización
- Visualización de perfil personal
- Historial de asistencias
- Estadísticas personales

### Para Administradores:
- Dashboard con estadísticas generales
- Gestión de voluntarios (habilitar/deshabilitar)
- Visualización de todas las asistencias
- Generación de reportes mensuales
- Exportación de datos a CSV

##  Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- Git

##  Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/cruz-verde-sistema.git
cd cruz-verde-sistema
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend`:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/cruz_verde
JWT_SECRET=tu_clave_secreta_super_segura_2025
NODE_ENV=development
```

Si usas MongoDB Atlas, cambia `MONGODB_URI` por tu connection string.

### 3. Crear usuario administrador
```bash
npm run seed
```

Credenciales del admin:
- Email: `admin@cruzverde.or`
- Password: `admin23`

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

##  Ejecutar el Proyecto

### Opción 1: Dos terminales separadas

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Opción 2: Usando concurrently (opcional)

Instala concurrently en la raíz:
```bash
npm install concurrently
```

Agrega scripts en `package.json` de la raíz:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\"",
    "backend": "cd backend && npm run dev",
    "frontend": "cd frontend && npm start"
  }
}
```

Luego ejecuta:
```bash
npm run dev
```

##  URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

##  Usuarios de Prueba

### Administrador
- Email: `admin@cruzverde.org`
- Password: `admin123`

### Voluntarios
Puedes registrar nuevos voluntarios desde la pantalla de registro.

##  Estructura del Proyecto
```
cruz-verde-sistema/
├── backend/
│   ├── config/          # Configuración de DB
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware de autenticación
│   ├── .env            # Variables de entorno (NO subir a Git)
│   ├── server.js       # Servidor principal
│   └── seed.js         # Script para crear admin
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes de React
│   │   ├── context/    # Context API
│   │   ├── services/   # Llamadas a la API
│   │   └── App.js      # Componente principal
│   └── package.json
└── README.md
```

 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación mediante JWT
- Tokens con expiración de 30 días
- Validación de permisos por rol
- Variables sensibles en archivo .env

 Despliegue

Backend (Render, Railway, Heroku)
1. Sube el código a GitHub
2. Conecta tu repositorio
3. Configura las variables de entorno
4. Deploy automático

### Frontend (Vercel, Netlify)
1. Conecta tu repositorio
2. Configura la carpeta `frontend`
3. Agrega la URL del backend en las variables de entorno
4. Deploy automático

##  API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar voluntario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual

### Asistencias
- `POST /api/attendance/checkin` - Marcar entrada
- `PUT /api/attendance/checkout/:id` - Marcar salida
- `GET /api/attendance/my` - Mis asistencias
- `GET /api/attendance/active` - Sesión activa

### Admin
- `GET /api/admin/volunteers` - Lista de voluntarios
- `PUT /api/admin/volunteers/:id/toggle` - Habilitar/deshabilitar
- `GET /api/admin/attendances` - Todas las asistencias
- `GET /api/admin/reports` - Generar reportes
- `GET /api/admin/stats` - Estadísticas

## 👥 Autor

Diego Gabriel Hernandez Colorado

##  Licencia

Este proyecto es de código abierto para la Cruz Verde.
```