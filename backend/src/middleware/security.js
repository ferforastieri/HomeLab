const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
});

// Limiter específico para login
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 tentativas
    message: 'Muitas tentativas de login, tente novamente em 1 hora'
});

const securityMiddleware = {
    // Helmet ajuda a proteger o app de várias vulnerabilidades conhecidas
    helmet: helmet(),
    
    // Rate limiting
    limiter,
    loginLimiter,
    
    // Sanitização de dados
    mongoSanitize: mongoSanitize(),
    
    // Proteção contra XSS
    xss: xss(),
    
    // Proteção contra poluição de parâmetros HTTP
    hpp: hpp(),
    
    // CORS configurado
    corsOptions: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
};

module.exports = securityMiddleware;