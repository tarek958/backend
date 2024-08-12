const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authenticateToken = require('../middleware/authenticateToken');
router.post('/signup', userController.registerUser);
router.post('/create-user', userController.addUser);
router.post('/signin', userController.loginUser);
router.get('/profile', auth, userController.getUserProfile);
router.get('/all', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.get('/role',auth, userController.getUserRole);
router.post('/forgot-password',userController.forgotPassword)
router.post('/reset-password', userController.confirmReset)

router.get('/chart-data', authenticateToken, userController.chartUser)
router.get('/confirm/:token', userController.confirmEmail);
router.get('/user-stats', authenticateToken, async (req, res) => {
    try {
      const role = req.user.role;
      const companyId = req.user.company;
  
      let totalUsersCount;
  
      if (role === 'admin') {
        totalUsersCount = await User.countDocuments();
      } else if (role === 'agent') {
        totalUsersCount = await User.countDocuments({ company: companyId });
      } else {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      res.json({ totalUsersCount });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



module.exports = router;
