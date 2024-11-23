const BackupService = require('../services/backupService');

async function initializeBackup() {
    try {
        await BackupService.init();
        console.log('Sistema de backup inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar sistema de backup:', error);
    }
}

module.exports = initializeBackup;