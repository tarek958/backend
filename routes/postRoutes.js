const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

const auth = require('../middleware/auth');
const authenticateToken = require('../middleware/authenticateToken');
router.post('/add/', authenticateToken, postController.createPost);
router.get('/all',authenticateToken, postController.getAllPosts);
router.get('/:id',authenticateToken, postController.getPostById);
router.get('/uuid/:uuid',authenticateToken, postController.getPostByUiId);
router.put('/:id', authenticateToken,postController.updatePostById);
router.delete('/:id', authenticateToken,postController.deletePostById);

module.exports = router;
