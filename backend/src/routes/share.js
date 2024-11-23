const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createShare,
    createPublicLink,
    removeShare,
    disablePublicLink
} = require('../controllers/shareController');

router.post('/', auth, createShare);
router.post('/public-link', auth, createPublicLink);
router.delete('/', auth, removeShare);
router.delete('/public-link/:shareId', auth, disablePublicLink);

module.exports = router;