const express = require('express');
const { 
  register, 
  login, 
  logout, 
  getProfile 
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireSelfOrAdmin } = require('../middlewares/role.middleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// User management routes (admin only)
// router.get('/users', authenticateToken, requireAdmin, getAllUsers);
// router.get('/users/:id', authenticateToken, requireAdmin, getUserById);
// router.put('/users/:id', authenticateToken, requireSelfOrAdmin, updateUser);
// router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;
