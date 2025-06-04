const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');

// Route upload single file
router.post('/single', upload.single('file'), handleMulterError, uploadController.uploadFile);

// Route upload multiple files
router.post('/multiple', upload.array('files', 10), handleMulterError, uploadController.uploadMultipleFiles);

// Route get file by filename
router.get('/:filename', uploadController.getFile);

module.exports = router; 