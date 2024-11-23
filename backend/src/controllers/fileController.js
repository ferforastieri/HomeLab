const File = require('../models/File');
const path = require('path');
const fs = require('fs').promises;

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado' });
        }

        const file = new File({
            name: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            type: req.file.mimetype,
            userId: req.user.userId,
            folderId: req.body.folderId || null
        });

        await file.save();
        res.status(201).json(file);
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        res.status(500).json({ message: 'Erro ao fazer upload do arquivo' });
    }
};

const listFiles = async (req, res) => {
    try {
        const files = await File.find({ 
            userId: req.user.userId,
            folderId: req.query.folderId || null
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar arquivos' });
    }
};

const downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        res.download(file.path, file.originalName);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao baixar arquivo' });
    }
};

const deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        await fs.unlink(file.path);
        await file.remove();

        res.json({ message: 'Arquivo deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar arquivo' });
    }
};

const moveFile = async (req, res) => {
    try {
        const { fileId, newFolderId } = req.body;
        const file = await File.findOne({
            _id: fileId,
            userId: req.user.userId
        });

        if (!file) {
            return res.status(404).json({ message: 'Arquivo não encontrado' });
        }

        file.folderId = newFolderId;
        await file.save();

        res.json(file);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao mover arquivo' });
    }
};

module.exports = {
    uploadFile,
    listFiles,
    downloadFile,
    deleteFile,
    moveFile
};
