import pool from './config/database.js';
import bcrypt from 'bcrypt';

async function updatePassword() {
  let client;
  try {
    console.log('🔐 Updating user password...');
    client = await pool.connect();
    
    const email = 'admin@intersoft.com';
    const newPassword = 'admin123';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('🔒 New hashed password:', hashedPassword);
    
    // Update the password in database
    const result = await client.query(
      'UPDATE public.usuario SET password = $1 WHERE email = $2 RETURNING id, email, nombre, apellido',
      [hashedPassword, email]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Password updated successfully for user:');
      console.log(`   - ID: ${result.rows[0].id}`);
      console.log(`   - Email: ${result.rows[0].email}`);
      console.log(`   - Name: ${result.rows[0].nombre} ${result.rows[0].apellido}`);
      console.log(`   - New password: ${newPassword}`);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    process.exit(0);
  }
}

updatePassword();
