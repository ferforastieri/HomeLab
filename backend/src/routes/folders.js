const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createFolder,
    listFolderContents,
    deleteFolder
} = require('../controllers/folderController');

router.post('/', auth, createFolder);
router.get('/:folderId?', auth, listFolderContents);
router.delete('/:id', auth, deleteFolder);

module.exports = router;