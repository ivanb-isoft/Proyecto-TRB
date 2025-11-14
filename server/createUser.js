import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function createUser(email, password, nombre, apellido) {
  let client;
  try {
    console.log('👤 Creating new user...');
    client = await pool.connect();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔒 Password hashed successfully');
    
    // Insert new user
    const result = await client.query(
      'INSERT INTO public.usuario (email, nombre, apellido, password) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, apellido',
      [email, nombre, apellido, hashedPassword]
    );
    
    console.log('✅ User created successfully:');
    console.log(`   - ID: ${result.rows[0].id}`);
    console.log(`   - Email: ${result.rows[0].email}`);
    console.log(`   - Name: ${result.rows[0].nombre} ${result.rows[0].apellido}`);
    console.log(`   - Password: ${password}`);
    console.log(`   - Hash: ${hashedPassword}`);
    
  } catch (error) {
    if (error.code === '23505') {
      console.error('❌ Error: Email already exists');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  } finally {
    if (client) {
      client.release();
    }
    process.exit(0);
  }
}

// Usage examples:
// node createUser.js email@ejemplo.com contraseña123 Juan Pérez
// node createUser.js usuario@test.com pass456 María González

const args = process.argv.slice(2);
if (args.length !== 4) {
  console.log('Usage: node createUser.js <email> <password> <nombre> <apellido>');
  console.log('Example: node createUser.js juan@test.com mipass123 Juan Pérez');
  process.exit(1);
}

const [email, password, nombre, apellido] = args;
createUser(email, password, nombre, apellido);
