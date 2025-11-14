import pool from './config/database.js';

async function checkSchema() {
  let client;
  try {
    console.log('🔍 Checking database schema...');
    client = await pool.connect();
    
    // Check current database and schema
    const dbInfo = await client.query('SELECT current_database(), current_schema()');
    console.log('📊 Database:', dbInfo.rows[0].current_database);
    console.log('📁 Current schema:', dbInfo.rows[0].current_schema);
    
    // List all schemas
    const schemas = await client.query('SELECT schema_name FROM information_schema.schemata ORDER BY schema_name');
    console.log('📂 Available schemas:', schemas.rows.map(row => row.schema_name));
    
    // Check if public schema exists
    const publicExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = 'public'
      )
    `);
    console.log('✅ Public schema exists:', publicExists.rows[0].exists);
    
    // List tables in public schema
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('📋 Tables in public schema:', tables.rows.map(row => row.table_name));
    
    // Check usuario table specifically
    const usuarioExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuario'
      )
    `);
    
    if (usuarioExists.rows[0].exists) {
      console.log('✅ Table public.usuario exists');
      
      // Check table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'usuario' 
        ORDER BY ordinal_position
      `);
      console.log('📝 Table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check data
      const userData = await client.query('SELECT id, email, nombre, apellido FROM public.usuario LIMIT 5');
      console.log('👥 Sample users:');
      userData.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.nombre} ${user.apellido}`);
      });
      
    } else {
      console.log('❌ Table public.usuario does NOT exist');
      console.log('📝 Need to create the usuario table');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
    console.error('Full error:', error);
  } finally {
    if (client) {
      client.release();
    }
    process.exit(0);
  }
}

checkSchema();
