import bcrypt from 'bcrypt';

// Utility script to hash passwords for database insertion
// Usage: node utils/hashPassword.js "your_password"

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

// If running this file directly
if (process.argv[2]) {
  hashPassword(process.argv[2]);
} else {
  console.log('Usage: node utils/hashPassword.js "your_password"');
}

export default hashPassword;
