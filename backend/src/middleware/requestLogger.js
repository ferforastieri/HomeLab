const { logger } = require('../services/logService');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Logging após a resposta ser enviada
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userIP: req.ip,
            userAgent: req.get('user-agent')
        });
    });

    next();
};

module.exports = requestLogger;