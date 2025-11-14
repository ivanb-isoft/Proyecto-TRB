# Proyecto TRB - Sistema de Gestión de Horas

Sistema de gestión de horas desarrollado con React + Vite y backend en Node.js con PostgreSQL.

## Características

- **Autenticación**: Login con validación contra base de datos PostgreSQL
- **Gestión de Horas**: Carga y seguimiento de horas trabajadas
- **Navegación**: Sistema de navegación con menú lateral
- **Responsive**: Interfaz adaptable a diferentes dispositivos

## Tecnologías

### Frontend
- React 19.2.0
- Vite 7.2.2
- CSS3 con diseño moderno

### Backend
- Node.js con Express
- PostgreSQL
- bcrypt para hash de contraseñas
- CORS habilitado

## Configuración de la Base de Datos

### Estructura de la tabla usuario
```sql
CREATE TABLE public.usuario (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### Insertar usuario de prueba
```sql
-- Primero generar el hash de la contraseña usando el script del servidor
-- node server/utils/hashPassword.js "tu_contraseña"

INSERT INTO public.usuario (email, nombre, apellido, password) 
VALUES ('usuario@ejemplo.com', 'Juan', 'Pérez', '$2b$10$hash_generado_aqui');
```

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto-TRB
```

### 2. Configurar el Frontend
```bash
npm install
```

### 3. Configurar el Backend
```bash
cd server
npm install
```

### 4. Configurar variables de entorno
Crear archivo `.env` en la carpeta `server/`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyecto_trb
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
PORT=3001
NODE_ENV=development
```

### 5. Generar hash de contraseña
```bash
cd server
node utils/hashPassword.js "tu_contraseña"
```

## Ejecución

### Desarrollo
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

### Producción
```bash
# Frontend
npm run build
npm run preview

# Backend
cd server
npm start
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }
  ```

## Estructura del Proyecto

```
Proyecto-TRB/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── Home.jsx
│   │   └── Timesheet.jsx
│   ├── services/
│   │   └── authService.js
│   └── App.jsx
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── auth.js
│   ├── utils/
│   │   └── hashPassword.js
│   └── server.js
└── README.md
```
