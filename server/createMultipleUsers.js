import pool from './config/database.js';
import bcrypt from 'bcrypt';

const usuarios = [
  { email: 'admin@intersoft.com', password: 'admin123', nombre: 'Admin', apellido: 'Sistema' },
  { email: 'juan.perez@intersoft.com', password: 'juan2024', nombre: 'Juan', apellido: 'Pérez' },
  { email: 'maria.gonzalez@intersoft.com', password: 'maria456', nombre: 'María', apellido: 'González' },
  { email: 'carlos.rodriguez@intersoft.com', password: 'carlos789', nombre: 'Carlos', apellido: 'Rodríguez' },
  { email: 'ana.martinez@intersoft.com', password: 'ana321', nombre: 'Ana', apellido: 'Martínez' }
];

async function createMultipleUsers() {
  let client;
  try {
    console.log('👥 Creating multiple users...\n');
    client = await pool.connect();
    
    for (const usuario of usuarios) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(usuario.password, 10);
        
        // Insert user
        const result = await client.query(
          'INSERT INTO public.usuario (email, nombre, apellido, password) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, apellido',
          [usuario.email, usuario.nombre, usuario.apellido, hashedPassword]
        );
        
        console.log(`✅ Created: ${result.rows[0].nombre} ${result.rows[0].apellido}`);
        console.log(`   Email: ${result.rows[0].email}`);
        console.log(`   Password: ${usuario.password}`);
        console.log(`   ID: ${result.rows[0].id}\n`);
        
      } catch (error) {
        if (error.code === '23505') {
          console.log(`⚠️  User ${usuario.email} already exists\n`);
        } else {
          console.error(`❌ Error creating ${usuario.email}:`, error.message);
        }
      }
    }
    
    console.log('🎉 Process completed!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    process.exit(0);
  }
}

createMultipleUsers();
