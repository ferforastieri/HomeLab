const crypto = require('crypto');

class CryptoService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            iv: iv.toString('hex'),
            encrypted: encrypted,
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encrypted, iv, authTag) {
        const decipher = crypto.createDecipheriv(
            this.algorithm, 
            this.key, 
            Buffer.from(iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }
}

module.exports = new CryptoService();