# Conexión a Base de Datos PostgreSQL - Proyecto TRB

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Configuración del Backend](#configuración-del-backend)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [Sistema de Registro de Usuarios](#sistema-de-registro-de-usuarios)
6. [Gestión de Usuarios](#gestión-de-usuarios)
7. [Seguridad con Hash](#seguridad-con-hash)
8. [Scripts de Utilidad](#scripts-de-utilidad)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Configuración Inicial

### Requisitos
- PostgreSQL ejecutándose en puerto 5433
- Node.js con Express
- Base de datos: `exp_trb`

### Variables de Entorno
Archivo: `server/.env`
```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=exp_trb
DB_USER=postgres
DB_PASSWORD=postgres1

# Server Configuration
PORT=3001
NODE_ENV=development
```

**⚠️ Importante:** Usar `127.0.0.1` en lugar de `localhost` para evitar problemas con IPv6.

---

## 🗄️ Estructura de la Base de Datos

### Esquema: `public`

#### Tabla: `usuario`
```sql
CREATE TABLE public.usuario (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

#### Campos:
- **id**: Identificador único autoincremental
- **email**: Email único del usuario (usado para login)
- **nombre**: Nombre del usuario
- **apellido**: Apellido del usuario
- **password**: Contraseña hasheada con bcrypt

---

## ⚙️ Configuración del Backend

### Dependencias
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Conexión a PostgreSQL
Archivo: `server/config/database.js`
```javascript
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'proyecto_trb',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default pool;
```

### Servidor Express
Archivo: `server/server.js`
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## 🔐 Sistema de Autenticación

### Controlador de Autenticación
Archivo: `server/controllers/authController.js`
```javascript
import bcrypt from 'bcrypt';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Query user from database
    const query = 'SELECT id, email, nombre, apellido, password FROM public.usuario WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### Frontend - Servicio de Autenticación
Archivo: `src/services/authService.js`
```javascript
const API_BASE_URL = 'http://localhost:3001/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté ejecutándose.');
      }
      throw error;
    }
  }
};
```

---

## 📝 Sistema de Registro de Usuarios

### Endpoint de Registro
**POST** `/api/auth/register`

#### Controlador de Registro
Archivo: `server/controllers/authController.js`
```javascript
export const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body;

    // Validate input
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM public.usuario WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO public.usuario (email, nombre, apellido, password) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, apellido',
      [email, nombre, apellido, hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
```

### Frontend - Componente de Registro
Archivo: `src/components/RegisterForm.jsx`

#### Características del Formulario:
- **Campos**: Nombre, Apellido, Email, Contraseña, Confirmar Contraseña
- **Validaciones en tiempo real**:
  - Todos los campos requeridos
  - Formato de email válido
  - Contraseña mínimo 6 caracteres
  - Coincidencia de contraseñas
  - Nombres y apellidos mínimo 2 caracteres

#### Validaciones Frontend:
```javascript
const validateForm = () => {
  const { email, password, confirmPassword, nombre, apellido } = formData

  if (!email.trim() || !password.trim() || !nombre.trim() || !apellido.trim()) {
    setError('Todos los campos son requeridos.')
    return false
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    setError('Por favor, ingrese un email válido.')
    return false
  }

  // Validate password length
  if (password.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres.')
    return false
  }

  // Validate password confirmation
  if (password !== confirmPassword) {
    setError('Las contraseñas no coinciden.')
    return false
  }

  return true
}
```

### Servicio de Registro
Archivo: `src/services/authService.js`
```javascript
async register(email, password, nombre, apellido) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, nombre, apellido }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el registro');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se pudo conectar con el servidor. Verifique que el servidor esté ejecutándose.');
    }
    throw error;
  }
}
```

### Navegación entre Login y Registro
- **Desde Login**: Enlace "¿No tienes cuenta? Regístrate"
- **Desde Registro**: Botón "← Volver al Login"
- **Flujo**: Registro exitoso → Mensaje de confirmación → Redirección a Login

### Request/Response del Registro

#### Request:
```json
POST /api/auth/register
{
  "email": "nuevo@usuario.com",
  "password": "micontraseña123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

#### Response (Éxito):
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 5,
    "email": "nuevo@usuario.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

#### Response (Error):
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

## 👥 Gestión de Usuarios

### Usuario de Prueba
- **Email**: `admin@intersoft.com`
- **Contraseña**: `admin123`
- **Nombre**: Admin Usuario

### Crear Nuevos Usuarios
Usar el script: `server/createUser.js`
```bash
cd server
node createUser.js email@ejemplo.com contraseña123 Juan Pérez
```

### Inserción Manual
```sql
-- 1. Generar hash de contraseña
-- node server/utils/hashPassword.js "mi_contraseña"

-- 2. Insertar usuario
INSERT INTO public.usuario (email, nombre, apellido, password) 
VALUES ('nuevo@email.com', 'Nombre', 'Apellido', '$2b$10$hash_generado_aqui');
```

---

## 🛡️ Seguridad con Hash

### ¿Por qué usar Hash?

#### ❌ Problemas con contraseñas en texto plano:
- Cualquiera con acceso a la BD ve las contraseñas
- Administradores pueden ver contraseñas
- Backups contienen contraseñas legibles
- Si hackean la BD, tienen todas las contraseñas

#### ✅ Ventajas del Hash (bcrypt):
- **Irreversible**: No se puede "des-hashear"
- **Único**: Misma contraseña = diferentes hashes
- **Salt**: Protege contra ataques de diccionario
- **Lento**: Dificulta ataques de fuerza bruta

### Ejemplo de Hash
```bash
Password: admin123
Hash: $2b$10$lW5ZdI5in/F7kMU1YhZBUupIRT7hbDgA0W53mKVNyK6hlHkdUk2bu
```

### ⚠️ Solo contraseñas necesitan hash
```sql
-- ✅ Contraseñas - HASH requerido
password VARCHAR(255) -- "$2b$10$abc123..."

-- ✅ Otros datos - texto normal
nombre VARCHAR(100)    -- "Juan Pérez"
email VARCHAR(255)     -- "user@test.com"
fecha DATE            -- 2025-11-13
```

---

## 🔧 Scripts de Utilidad

### 1. Generar Hash de Contraseña
Archivo: `server/utils/hashPassword.js`
```bash
cd server
node utils/hashPassword.js "mi_contraseña"
```

### 2. Crear Usuario Completo
Archivo: `server/createUser.js`
```bash
cd server
node createUser.js email@test.com pass123 Juan Pérez
```

### 3. Crear Múltiples Usuarios de Ejemplo
Archivo: `server/createMultipleUsers.js`
```bash
cd server
node createMultipleUsers.js
```

### 4. Listar Todos los Usuarios
Archivo: `server/listUsers.js`
```bash
cd server
node listUsers.js
```

### 5. Probar Endpoint de Registro
Archivo: `server/testRegister.js`
```bash
cd server
node testRegister.js
```

### 6. Verificar Conexión a BD
Archivo: `server/testConnection.js`
```bash
cd server
node testConnection.js
```

### 7. Verificar Esquema
Archivo: `server/checkSchema.js`
```bash
cd server
node checkSchema.js
```

### 8. Probar Login
Archivo: `server/testLogin.js`
```bash
cd server
node testLogin.js
```

### 9. Actualizar Contraseña
Archivo: `server/updatePassword.js`
```bash
cd server
node updatePassword.js
```

### 10. Generar Múltiples Hashes
Archivo: `server/generateHashes.js`
```bash
cd server
node generateHashes.js "contraseña_específica"
# o para generar varios ejemplos:
node generateHashes.js
```

---

## 🚨 Solución de Problemas

### Error: "ECONNREFUSED ::1:5433"
**Causa**: Problema con IPv6
**Solución**: Cambiar `DB_HOST=localhost` por `DB_HOST=127.0.0.1`

### Error: "Credenciales inválidas"
**Causa**: Contraseña no hasheada o hash incorrecto
**Solución**: 
1. Generar hash: `node utils/hashPassword.js "contraseña"`
2. Actualizar en BD o usar script `updatePassword.js`

### Error: "No se pudo conectar con el servidor"
**Causa**: Backend no ejecutándose
**Solución**:
1. `cd server`
2. `npm install`
3. `npm run dev`

### Error: "Table 'usuario' does not exist"
**Causa**: Tabla no creada
**Solución**: Ejecutar SQL de creación de tabla

---

## 📊 URLs y Puertos

- **Frontend React**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5433
- **Health Check**: http://localhost:3001/api/health
- **Login Endpoint**: POST http://localhost:3001/api/auth/login

---

## 🎯 Endpoints API

### POST /api/auth/login
**Request:**
```json
{
  "email": "admin@intersoft.com",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "admin@intersoft.com",
    "nombre": "Admin",
    "apellido": "Usuario"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### POST /api/auth/register
**Request:**
```json
{
  "email": "nuevo@usuario.com",
  "password": "micontraseña123",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 5,
    "email": "nuevo@usuario.com",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Todos los campos son requeridos"
}
```

**Response (Error - 409):**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

### GET /api/health
**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### GET /api/clientes
Devuelve el listado completo de clientes desde la tabla `public.cliente`.

**SQL base utilizada:**
```sql
SELECT
  clienteid,
  clientenombre,
  clienteactivo,
  clientefechaalta,
  clientefechabaja
FROM public.cliente
ORDER BY clienteid;
```

**Respuesta (éxito):**
```json
{
  "success": true,
  "data": [
    {
      "clienteid": 1,
      "clientenombre": "Cliente Demo",
      "clienteactivo": true,
      "clientefechaalta": "2025-11-01",
      "clientefechabaja": null
    }
  ]
}
```

---

## ⏱️ Pantalla de Carga de Horas (Timesheet)

### Campo de Horas (columna "Hs.")

En la grilla de la pantalla de **carga de horas**, el campo de horas se maneja con un `input` de texto que acepta el formato `HH:MM`.

- **Componente**: `src/components/Timesheet.jsx`
- **Campo**: Columna `Hs.` de la tabla de entradas

#### Comportamiento del campo

- **Formato aceptado**: `HH:MM` (horas:minutos), con un máximo de 5 caracteres.
- **Mientras el usuario escribe (`onChange`)**:
  - Se limpian los caracteres no válidos y solo se permiten dígitos y `:`.
  - El valor se guarda tal cual lo va tipeando el usuario (`HH`, `HH:`, `HH:M`, `HH:MM`, etc.).
  - No se bloquea el ingreso de la parte de minutos.
- **Al salir del campo (`onBlur`)**:
  - Si solo hay parte de horas (`HH` o `HH:`), se deja únicamente la parte de horas sin forzar minutos.
  - Si hay parte de minutos:
    - Si las horas son **24**, los minutos se fuerzan siempre a `00`.
    - Si los minutos son **mayores que 59**, se normalizan automáticamente a `00`.
    - Si los minutos son válidos, se formatean a 2 dígitos (por ejemplo, `5` → `05`).
  - El valor final se guarda en formato `HH:MM`.

#### Fragmento relevante (simplificado)

```javascript
<input
  type="text"
  inputMode="numeric"
  pattern="^([01]\d|2[0-3]):[0-5]\d$"
  maxLength={5}
  value={entry.hours}
  onChange={(event) => {
    const rawValue = event.target.value.replace(/[^0-9:]/g, '')
    handleEntryChange(entry.id, 'hours', rawValue)
  }}
  onBlur={(event) => {
    const rawValue = event.target.value.replace(/[^0-9:]/g, '')
    if (!rawValue) return

    const [rawHours = '', rawMinutes = ''] = rawValue.split(':')
    if (!rawMinutes) {
      handleEntryChange(entry.id, 'hours', rawHours)
      return
    }

    let hours = rawHours
    let minutes = rawMinutes
    const minutesNumber = Number.parseInt(minutes, 10)

    if (Number.isNaN(minutesNumber) || minutesNumber > 59) {
      minutes = '00'
    } else {
      minutes = minutesNumber.toString()
    }

    minutes = minutes.padStart(2, '0').slice(0, 2)
    const normalizedValue = `${hours}:${minutes}`
    handleEntryChange(entry.id, 'hours', normalizedValue)
  }}
  placeholder="00:00"
/>
```

Con esta lógica, el sistema garantiza que la parte de **minutos nunca supere 59** y, en caso de hacerlo, se establece automáticamente en `00` al perder el foco del campo.

---

## 🚀 Comandos de Ejecución

### Desarrollo
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Instalación
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

---

## ✅ Checklist de Verificación

### Base de Datos
- [ ] PostgreSQL ejecutándose en puerto 5433
- [ ] Base de datos `exp_trb` creada
- [ ] Tabla `public.usuario` creada con campos correctos
- [ ] Usuario de prueba insertado con hash

### Backend
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Dependencias del servidor instaladas (`npm install`)
- [ ] Backend ejecutándose en puerto 3001
- [ ] Endpoint `/api/health` respondiendo
- [ ] Endpoint `/api/auth/login` funcionando
- [ ] Endpoint `/api/auth/register` funcionando

### Frontend
- [ ] Dependencias del frontend instaladas
- [ ] Frontend ejecutándose en puerto 5173
- [ ] LoginForm funcionando correctamente
- [ ] RegisterForm funcionando correctamente
- [ ] Navegación entre login y registro operativa

### Funcionalidades
- [ ] Login con credenciales válidas exitoso
- [ ] Registro de nuevos usuarios exitoso
- [ ] Validaciones de formulario funcionando
- [ ] Mensajes de error y éxito mostrándose
- [ ] Hash de contraseñas automático
- [ ] Redirección después del login
- [ ] Navegación en la aplicación operativa

### Módulo de Clientes
- [ ] Tabla `public.cliente` creada (clienteid, clientenombre, clienteactivo, clientefechaalta, clientefechabaja)
- [ ] Endpoint `GET /api/clientes` configurado en el backend
- [ ] Servicio `clienteService.getClientes()` funcionando en el frontend
- [ ] Pantalla **Clientes** visible desde el menú lateral y cargando la grilla de clientes

### Scripts de Utilidad
- [ ] `testConnection.js` - Conexión a BD exitosa
- [ ] `testLogin.js` - Login API funcionando
- [ ] `testRegister.js` - Registro API funcionando
- [ ] `listUsers.js` - Listado de usuarios
- [ ] `createUser.js` - Creación manual de usuarios

---

## 🎉 Resumen de Funcionalidades Implementadas

### ✅ **Sistema Completo de Autenticación**
- **Login**: Validación contra PostgreSQL con hash de contraseñas
- **Registro**: Interfaz web para crear nuevas cuentas de usuario
- **Navegación**: Transición fluida entre login y registro
- **Validaciones**: Robustas en frontend y backend

### ✅ **Gestión de Usuarios**
- **Creación**: Desde interfaz web o scripts de consola
- **Validación**: Email único, contraseñas seguras, campos requeridos
- **Listado**: Scripts para ver usuarios registrados
- **Testing**: Herramientas para probar funcionalidades

### ✅ **Seguridad Implementada**
- **Hash bcrypt**: Contraseñas nunca almacenadas en texto plano
- **Validación de duplicados**: Prevención de emails repetidos
- **Sanitización**: Validación de formato de email y longitud de contraseña
- **Manejo de errores**: Respuestas estructuradas y seguras

### ✅ **Interfaz de Usuario**
- **Responsive**: Funciona en desktop y móvil
- **UX optimizada**: Estados de carga, mensajes claros
- **Diseño consistente**: Integrado con el sistema existente
- **Accesibilidad**: Labels apropiados y navegación por teclado

### ✅ **Scripts de Utilidad**

### ✅ **Módulo de Clientes**
- Lectura de la tabla `public.cliente` desde PostgreSQL
- Endpoint REST `GET /api/clientes` documentado y operativo
- Servicio de frontend `clienteService` para consumir los datos
- Pantalla **Clientes** integrada en la navegación (menú lateral) mostrando la grilla con todos los clientes
- **10 scripts diferentes** para gestión y testing
- **Creación masiva** de usuarios de ejemplo
- **Testing automatizado** de endpoints
- **Verificación** de conexiones y esquemas

#### 📌 Comandos y Objetos utilizados para acceder a `public.cliente`

- **SQL principal (backend)**  
  Archivo: `server/controllers/clienteController.js`  
  ```javascript
  const query = `
    SELECT
      clienteid,
      clientenombre,
      clienteactivo,
      clientefechaalta,
      clientefechabaja
    FROM public.cliente
    ORDER BY clienteid
  `;
  const result = await pool.query(query);
  ```

- **Ruta/objeto de Express que expone la tabla cliente**  
  Archivo: `server/routes/cliente.js`  
  ```javascript
  import express from 'express';
  import { getClientes } from '../controllers/clienteController.js';

  const router = express.Router();

  // GET /api/clientes
  router.get('/', getClientes);

  export default router;
  ```

- **Registro de la ruta en el servidor**  
  Archivo: `server/server.js`  
  ```javascript
  import clienteRoutes from './routes/cliente.js';

  // ...
  app.use('/api/clientes', clienteRoutes);
  ```

- **Comando/servicio que consume la API en el frontend**  
  Archivo: `src/services/clienteService.js`  
  ```javascript
  const API_BASE_URL = 'http://localhost:3001/api';

  export const clienteService = {
    async getClientes() {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      const data = await response.json();
      // ...manejo de errores
      return data;
    },
  };
  ```

- **Objeto/pantalla que muestra la grilla de clientes**  
  Archivo: `src/components/Clientes.jsx`  
  ```javascript
  import { clienteService } from '../services/clienteService';

  useEffect(() => {
    const fetchClientes = async () => {
      const result = await clienteService.getClientes();
      setClientes(result.data || []);
    };

    fetchClientes();
  }, []);
  ```

---

**Documento actualizado el 14 de Noviembre de 2025**
**Proyecto TRB - Sistema de Gestión de Horas con Registro de Usuarios y Módulo de Clientes**
