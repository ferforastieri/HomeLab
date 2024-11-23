const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    moveFile
} = require('../controllers/fileController');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/files');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // Limite de 100MB
});

// Rotas
router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/list', auth, listFiles);
router.get('/download/:id', auth, downloadFile);
router.delete('/:id', auth, deleteFile);
router.post('/move', auth, moveFile);

module.exports = router;
