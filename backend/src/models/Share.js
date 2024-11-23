const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'resourceType'
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['File', 'Folder']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        email: String,
        permission: {
            type: String,
            enum: ['view', 'edit'],
            default: 'view'
        }
    }],
    publicLink: {
        enabled: {
            type: Boolean,
            default: false
        },
        token: String,
        expiresAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Share', shareSchema);