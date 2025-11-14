import fetch from 'node-fetch';

async function testRegister() {
  try {
    console.log('🧪 Testing register endpoint...');
    
    const testUser = {
      email: 'test@registro.com',
      password: 'test123456',
      nombre: 'Usuario',
      apellido: 'Prueba'
    };
    
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('👤 New user created:');
      console.log(`   - ID: ${data.user.id}`);
      console.log(`   - Email: ${data.user.email}`);
      console.log(`   - Name: ${data.user.nombre} ${data.user.apellido}`);
      
      // Test login with new user
      console.log('\n🔐 Testing login with new user...');
      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login with new user successful!');
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
      
    } else {
      console.log('❌ Registration failed:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing register:', error.message);
  }
}

testRegister();
