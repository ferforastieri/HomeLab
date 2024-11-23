const Folder = require('../models/Folder');
const File = require('../models/File');
const path = require('path');
const fs = require('fs').promises;

const createFolder = async (req, res) => {
    try {
        const { name, parentFolderId } = req.body;
        
        // Verificar pasta pai se fornecida
        let parentPath = '';
        if (parentFolderId) {
            const parentFolder = await Folder.findOne({
                _id: parentFolderId,
                userId: req.user.userId
            });
            if (!parentFolder) {
                return res.status(404).json({ message: 'Pasta pai não encontrada' });
            }
            parentPath = parentFolder.path;
        }

        // Criar caminho da nova pasta
        const folderPath = path.join(parentPath, name);
        
        // Criar pasta física
        const physicalPath = path.join(__dirname, '../../storage/folders', folderPath);
        await fs.mkdir(physicalPath, { recursive: true });

        // Criar registro da pasta
        const folder = new Folder({
            name,
            userId: req.user.userId,
            parentFolder: parentFolderId,
            path: folderPath
        });

        await folder.save();
        res.status(201).json(folder);
    } catch (error) {
        console.error('Erro ao criar pasta:', error);
        res.status(500).json({ message: 'Erro ao criar pasta' });
    }
};

const listFolderContents = async (req, res) => {
    try {
        const { folderId } = req.params;
        
        // Buscar conteúdo da pasta
        const [folders, files] = await Promise.all([
            Folder.find({
                userId: req.user.userId,
                parentFolder: folderId || null
            }),
            File.find({
                userId: req.user.userId,
                folderId: folderId || null
            })
        ]);

        res.json({
            folders,
            files
        });
    } catch (error) {
        console.error('Erro ao listar conteúdo:', error);
        res.status(500).json({ message: 'Erro ao listar conteúdo da pasta' });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const folder = await Folder.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!folder) {
            return res.status(404).json({ message: 'Pasta não encontrada' });
        }

        // Deletar arquivos da pasta
        const files = await File.find({ folderId: folder._id });
        for (const file of files) {
            await fs.unlink(file.path);
            await file.remove();
        }

        // Deletar subpastas recursivamente
        const deleteSubFolders = async (parentId) => {
            const subFolders = await Folder.find({ parentFolder: parentId });
            for (const subFolder of subFolders) {
                await deleteSubFolders(subFolder._id);
                await fs.rmdir(path.join(__dirname, '../../storage/folders', subFolder.path));
                await subFolder.remove();
            }
        };

        await deleteSubFolders(folder._id);

        // Deletar pasta física
        await fs.rmdir(path.join(__dirname, '../../storage/folders', folder.path));
        await folder.remove();

        res.json({ message: 'Pasta deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar pasta:', error);
        res.status(500).json({ message: 'Erro ao deletar pasta' });
    }
};

module.exports = {
    createFolder,
    listFolderContents,
    deleteFolder
};