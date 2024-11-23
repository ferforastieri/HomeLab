const winston = require('winston');
const path = require('path');

// Configuração do Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Logs de erro em arquivo separado
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/error.log'), 
            level: 'error' 
        }),
        // Todos os logs
        new winston.transports.File({ 
            filename: path.join(__dirname, '../../logs/combined.log')
        }),
        // Logs no console em desenvolvimento
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Monitoramento de uso de sistema
const systemStats = {
    async getStats() {
        const os = require('os');
        return {
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: os.totalmem() - os.freemem()
            },
            cpu: os.loadavg(),
            uptime: os.uptime(),
            platform: os.platform(),
            hostname: os.hostname()
        };
    }
};

module.exports = {
    logger,
    systemStats
};