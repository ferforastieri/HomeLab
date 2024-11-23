const express = require('express');
const router = express.Router();
const { getSystemInfo } = require('../controllers/systemController');

router.get('/info', getSystemInfo);

module.exports = router;