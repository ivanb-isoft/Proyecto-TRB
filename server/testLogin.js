import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('🧪 Testing login endpoint...');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@intersoft.com',
        password: 'admin123' // Updated password
      })
    });
    
    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', data);
    
    if (!response.ok) {
      console.log('❌ Login failed as expected (wrong password or other issue)');
    } else {
      console.log('✅ Login successful!');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
}

testLogin();
