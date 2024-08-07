const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const authenticateToken = require('../middleware/authenticateToken');
router.post('/', authenticateToken, projectController.addProject);
router.get('/all', authenticateToken, projectController.getProjects);
router.get('/:id', authenticateToken, projectController.getProject);
router.put('/:id', authenticateToken, projectController.updateProject);
router.delete('/:id', authenticateToken,projectController.deleteProject);
module.exports = router;
