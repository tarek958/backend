const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authenticateToken = require('../middleware/authenticateToken');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/var/www/html/uploads/')); 
    },
    
    
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('cvUpload'), fileController.uploadFile);
router.get('/', authenticateToken,fileController.getAllFiles);

router.delete('/:id', authenticateToken,fileController.removeFile);
router.get('/:id',authenticateToken, fileController.getFileById);
router.put('/', authenticateToken,fileController.editFile);
module.exports = router;
