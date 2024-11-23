const Share = require('../models/Share');

const checkSharedAccess = async (req, res, next) => {
    try {
        const { resourceId } = req.params;
        const userId = req.user.userId;

        // Verificar se o usuário tem acesso compartilhado
        const share = await Share.findOne({
            resourceId,
            'sharedWith.userId': userId
        });

        if (!share) {
            return res.status(403).json({ message: 'Acesso não autorizado' });
        }

        // Adicionar informações de permissão ao request
        const userShare = share.sharedWith.find(s => s.userId.toString() === userId.toString());
        req.sharePermission = userShare.permission;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar acesso compartilhado' });
    }
};

module.exports = checkSharedAccess;