const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const monitorController = require('../controllers/monitorController');

// Rota para informações do sistema (requer autenticação)
router.get('/system', auth, monitorController.getSystemStatus);

// Rota para logs (requer autenticação)
router.get('/logs', auth, monitorController.getLogs);

module.exports = router;