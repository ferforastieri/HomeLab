const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Apenas administradores podem gerenciar backups
router.post('/create', auth, adminAuth, backupController.createBackup);
router.post('/restore', auth, adminAuth, backupController.restoreBackup);
router.get('/list', auth, adminAuth, backupController.listBackups);

module.exports = router;