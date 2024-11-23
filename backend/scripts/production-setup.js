const fs = require('fs');
const path = require('path');

// Criar diretórios necessários
const dirs = [
    'logs/pm2',
    'storage/files',
    'storage/folders',
    'backups/db',
    'temp'
];

dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Diretório criado: ${dir}`);
    }
});

// Verificar arquivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'Arquivo .env não encontrado!');
    console.log('Crie o arquivo .env baseado no .env.example');
    process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', 'Setup de produção concluído!');