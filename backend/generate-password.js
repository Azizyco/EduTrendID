// ====================================================================
// UTILITY: Generate Password Hash
// ====================================================================
// Script untuk membuat password hash menggunakan bcrypt
// Jalankan dengan: node generate-password.js

const bcrypt = require('bcrypt');

// Password yang ingin di-hash
const password = 'admin123';

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('====================================');
  console.log('Password Hash Generator');
  console.log('====================================');
  console.log(`Original Password: ${password}`);
  console.log(`Hashed Password: ${hash}`);
  console.log('====================================');
  console.log('Gunakan hash ini untuk INSERT INTO users di database');
  console.log('====================================');
});

// CATATAN:
// Hash yang dihasilkan akan berbeda setiap kali script dijalankan
// karena bcrypt menggunakan salt yang random.
// Ini adalah fitur keamanan yang normal.
