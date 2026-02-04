const express = require('express');
const router = express.Router();
const uniqueCodeController = require('../controllers/uniqueCodeController');

// Routes for unique code management
router.post('/create', uniqueCodeController.createUniqueCode);
router.get('/all', uniqueCodeController.getAllUniqueCodes);
router.delete('/delete/:id', uniqueCodeController.deleteUniqueCode);
router.post('/verify', uniqueCodeController.verifyUniqueCode);
router.patch('/toggle/:id', uniqueCodeController.toggleCodeStatus);

module.exports = router;
