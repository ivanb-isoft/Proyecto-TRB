import bcrypt from 'bcrypt';

async function generateMultipleHashes() {
  const passwords = [
    'usuario123',
    'admin456',
    'test789',
    'password123',
    'micontraseña'
  ];
  
  console.log('🔐 Generating password hashes...\n');
  
  for (const password of passwords) {
    try {
      const hash = await bcrypt.hash(password, 10);
      console.log(`Password: ${password}`);
      console.log(`Hash: ${hash}`);
      console.log('---');
    } catch (error) {
      console.error(`Error hashing ${password}:`, error.message);
    }
  }
}

// If you want to hash a specific password, pass it as argument
const customPassword = process.argv[2];
if (customPassword) {
  bcrypt.hash(customPassword, 10).then(hash => {
    console.log(`Password: ${customPassword}`);
    console.log(`Hash: ${hash}`);
  });
} else {
  generateMultipleHashes();
}
