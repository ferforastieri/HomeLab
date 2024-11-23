const crypto = require('crypto');

console.log('Gerando chaves de segurança...\n');

const encryptionKey = crypto.randomBytes(32).toString('hex');
const jwtSecret = crypto.randomBytes(64).toString('hex');
const cookieSecret = crypto.randomBytes(32).toString('hex');

console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`COOKIE_SECRET=${cookieSecret}`);