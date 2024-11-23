const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const authValidation = {
    register: [
        body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Senha deve ter no mínimo 6 caracteres')
            .matches(/\d/)
            .withMessage('Senha deve conter pelo menos um número')
            .matches(/[A-Z]/)
            .withMessage('Senha deve conter pelo menos uma letra maiúscula'),
        validate
    ],
    
    login: [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('Senha é obrigatória'),
        validate
    ]
};

const fileValidation = {
    upload: [
        body('folderId')
            .optional()
            .isMongoId()
            .withMessage('ID de pasta inválido'),
        validate
    ]
};

module.exports = {
    authValidation,
    fileValidation
};