import pool from './config/database.js';

async function listUsers() {
  let client;
  try {
    console.log('👥 Listing all users...\n');
    client = await pool.connect();
    
    const result = await client.query('SELECT id, email, nombre, apellido FROM public.usuario ORDER BY id');
    
    if (result.rows.length === 0) {
      console.log('❌ No users found');
    } else {
      console.log(`📊 Found ${result.rows.length} users:\n`);
      
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.nombre} ${user.apellido}\n`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    process.exit(0);
  }
}

listUsers();
