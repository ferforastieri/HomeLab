const Share = require('../models/Share');
const User = require('../models/User');
const File = require('../models/File');
const Folder = require('../models/Folder');
const crypto = require('crypto');

const createShare = async (req, res) => {
    try {
        const { resourceId, resourceType, emails, permission } = req.body;

        // Verificar se o recurso existe
        let resource;
        if (resourceType === 'File') {
            resource = await File.findOne({ _id: resourceId, userId: req.user.userId });
        } else {
            resource = await Folder.findOne({ _id: resourceId, userId: req.user.userId });
        }

        if (!resource) {
            return res.status(404).json({ message: 'Recurso não encontrado' });
        }

        // Buscar ou criar compartilhamento
        let share = await Share.findOne({ resourceId, resourceType });
        
        if (!share) {
            share = new Share({
                resourceId,
                resourceType,
                ownerId: req.user.userId,
                sharedWith: []
            });
        }

        // Adicionar novos compartilhamentos
        for (const email of emails) {
            const user = await User.findOne({ email });
            
            const shareEntry = {
                email,
                permission,
                userId: user ? user._id : null
            };

            // Evitar duplicatas
            const existingIndex = share.sharedWith.findIndex(s => s.email === email);
            if (existingIndex >= 0) {
                share.sharedWith[existingIndex] = shareEntry;
            } else {
                share.sharedWith.push(shareEntry);
            }
        }

        await share.save();
        res.json(share);
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
        res.status(500).json({ message: 'Erro ao compartilhar recurso' });
    }
};

const createPublicLink = async (req, res) => {
    try {
        const { resourceId, resourceType, expiresIn } = req.body;

        let share = await Share.findOne({ resourceId, resourceType });
        
        if (!share) {
            share = new Share({
                resourceId,
                resourceType,
                ownerId: req.user.userId
            });
        }

        // Gerar token único
        const token = crypto.randomBytes(32).toString('hex');
        
        share.publicLink = {
            enabled: true,
            token,
            expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : null
        };

        await share.save();
        
        const publicUrl = `${process.env.APP_URL}/share/${token}`;
        res.json({ url: publicUrl, share });
    } catch (error) {
        console.error('Erro ao criar link público:', error);
        res.status(500).json({ message: 'Erro ao criar link público' });
    }
};

const removeShare = async (req, res) => {
    try {
        const { shareId, email } = req.body;

        const share = await Share.findOne({
            _id: shareId,
            ownerId: req.user.userId
        });

        if (!share) {
            return res.status(404).json({ message: 'Compartilhamento não encontrado' });
        }

        share.sharedWith = share.sharedWith.filter(s => s.email !== email);
        await share.save();

        res.json(share);
    } catch (error) {
        console.error('Erro ao remover compartilhamento:', error);
        res.status(500).json({ message: 'Erro ao remover compartilhamento' });
    }
};

const disablePublicLink = async (req, res) => {
    try {
        const { shareId } = req.params;

        const share = await Share.findOne({
            _id: shareId,
            ownerId: req.user.userId
        });

        if (!share) {
            return res.status(404).json({ message: 'Compartilhamento não encontrado' });
        }

        share.publicLink.enabled = false;
        await share.save();

        res.json(share);
    } catch (error) {
        console.error('Erro ao desabilitar link público:', error);
        res.status(500).json({ message: 'Erro ao desabilitar link público' });
    }
};

module.exports = {
    createShare,
    createPublicLink,
    removeShare,
    disablePublicLink
};