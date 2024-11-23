const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class BackupService {
    constructor() {
        this.backupDir = path.join(__dirname, '../../backups');
        this.storageDir = path.join(__dirname, '../../storage');
        this.dbBackupDir = path.join(__dirname, '../../backups/db');
    }

    async init() {
        try {
            // Criar diretórios se não existirem, ignorar erro se já existirem
            await fs.mkdir(this.backupDir, { recursive: true });
            await fs.mkdir(this.dbBackupDir, { recursive: true });
            console.log('Diretórios de backup inicializados com sucesso');
        } catch (error) {
            // Ignora erro se o diretório já existe
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${timestamp}.zip`;
        const backupPath = path.join(this.backupDir, backupFileName);

        // Criar arquivo zip
        const output = fs.createWriteStream(backupPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Nível máximo de compressão
        });

        archive.pipe(output);

        // Adicionar arquivos ao zip
        archive.directory(this.storageDir, 'storage');

        // Backup do banco de dados MongoDB
        const dbBackupPath = path.join(this.dbBackupDir, `mongodb-${timestamp}`);
        await this.createMongoBackup(dbBackupPath);
        archive.directory(dbBackupPath, 'database');

        await archive.finalize();

        // Limpar backups antigos
        await this.cleanOldBackups();

        return backupPath;
    }

    async createMongoBackup(outputPath) {
        const { MONGODB_URI } = process.env;
        try {
            await execPromise(`mongodump --uri="${MONGODB_URI}" --out="${outputPath}"`);
        } catch (error) {
            console.error('Erro ao criar backup do MongoDB:', error);
            throw error;
        }
    }

    async cleanOldBackups() {
        const MAX_BACKUPS = 5; // Manter apenas os 5 backups mais recentes
        
        const files = await fs.readdir(this.backupDir);
        const backups = files
            .filter(file => file.startsWith('backup-'))
            .map(file => ({
                name: file,
                path: path.join(this.backupDir, file),
                time: fs.stat(path.join(this.backupDir, file)).mtime.getTime()
            }));

        // Ordenar por data e remover os mais antigos
        if (backups.length > MAX_BACKUPS) {
            const oldBackups = backups
                .sort((a, b) => b.time - a.time)
                .slice(MAX_BACKUPS);

            for (const backup of oldBackups) {
                await fs.unlink(backup.path);
            }
        }
    }

    async restoreBackup(backupPath) {
        const extractPath = path.join(__dirname, '../../restore-temp');
        
        // Criar diretório temporário
        await fs.mkdir(extractPath, { recursive: true });

        // Extrair backup
        await this.extractZip(backupPath, extractPath);

        // Restaurar arquivos
        await fs.rm(this.storageDir, { recursive: true, force: true });
        await fs.cp(path.join(extractPath, 'storage'), this.storageDir, { recursive: true });

        // Restaurar banco de dados
        await this.restoreMongoBackup(path.join(extractPath, 'database'));

        // Limpar diretório temporário
        await fs.rm(extractPath, { recursive: true });
    }

    async extractZip(zipPath, outputPath) {
        return new Promise((resolve, reject) => {
            const unzipper = require('unzipper');
            fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: outputPath }))
                .on('error', reject)
                .on('close', resolve);
        });
    }

    async restoreMongoBackup(dbBackupPath) {
        const { MONGODB_URI } = process.env;
        try {
            await execPromise(`mongorestore --uri="${MONGODB_URI}" "${dbBackupPath}"`);
        } catch (error) {
            console.error('Erro ao restaurar backup do MongoDB:', error);
            throw error;
        }
    }
}

module.exports = new BackupService();