import bcrypt from 'bcrypt';
import pool from '../config/database.js';

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
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
