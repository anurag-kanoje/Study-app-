const crypto = require('crypto');

// Generate JWT Secret (64 bytes = 512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Generate Encryption Key (32 bytes = 256 bits for AES-256)
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('Generated Keys:');
console.log('----------------');
console.log('JWT_SECRET=' + jwtSecret);
console.log('ENCRYPTION_KEY=' + encryptionKey);
console.log('\nAdd these to your .env file'); 