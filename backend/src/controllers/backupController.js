const BackupService = require('../services/backupService');
const schedule = require('node-schedule');

class BackupController {
    constructor() {
        // Agendar backup diário às 3h da manhã
        schedule.scheduleJob('0 3 * * *', this.scheduleBackup.bind(this));
    }

    async scheduleBackup() {
        try {
            console.log('Iniciando backup agendado...');
            const backupPath = await BackupService.createBackup();
            console.log(`Backup criado com sucesso: ${backupPath}`);
        } catch (error) {
            console.error('Erro no backup agendado:', error);
        }
    }

    async createBackup(req, res) {
        try {
            const backupPath = await BackupService.createBackup();
            res.json({ 
                message: 'Backup criado com sucesso',
                path: backupPath
            });
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            res.status(500).json({ message: 'Erro ao criar backup' });
        }
    }

    async restoreBackup(req, res) {
        try {
            const { backupPath } = req.body;
            await BackupService.restoreBackup(backupPath);
            res.json({ message: 'Backup restaurado com sucesso' });
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            res.status(500).json({ message: 'Erro ao restaurar backup' });
        }
    }

    async listBackups(req, res) {
        try {
            const backups = await BackupService.listBackups();
            res.json(backups);
        } catch (error) {
            console.error('Erro ao listar backups:', error);
            res.status(500).json({ message: 'Erro ao listar backups' });
        }
    }
}

module.exports = new BackupController();