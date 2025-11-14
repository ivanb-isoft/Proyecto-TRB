import pool from './config/database.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Test if database exists
    const result = await client.query('SELECT current_database()');
    console.log('📊 Current database:', result.rows[0].current_database);
    
    // Test if usuario table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuario'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Table "usuario" exists');
      const userCount = await client.query('SELECT COUNT(*) FROM public.usuario');
      console.log('👥 Users in table:', userCount.rows[0].count);
    } else {
      console.log('❌ Table "usuario" does not exist');
      console.log('📝 You need to create the usuario table');
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
