const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authenticateToken = require('../middleware/authenticateToken');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads')); 
    },
    filename: (req, file, cb) => {
        const date = Date.now();
        const fileExtension = path.extname(file.originalname);
        const fileName = `${date}${fileExtension}`;
        cb(null, fileName); 
    }
    
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('cvUpload'), fileController.uploadFile);
router.get('/', authenticateToken,fileController.getAllFiles);
router.delete('/:filename', authenticateToken,fileController.removeFile);

router.put('/', authenticateToken,fileController.editFile);
module.exports = router;
