const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Pegar o token do header
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = auth;
