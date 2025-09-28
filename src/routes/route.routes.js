const express = require('express');
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
} = require('../controllers/routes.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole, requirePermission } = require('../middlewares/role.middleware');

const router = express.Router();

// Public routes (read-only for routes)
router.get('/', getAllRoutes);
router.get('/:id', getRouteById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  createRoute
);

router.put('/:id', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  updateRoute
);

router.delete('/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  deleteRoute
);

// Additional route-specific endpoints
// router.get('/:id/buses', authenticateToken, getRouteBuses);
// router.get('/:id/trips', authenticateToken, getRouteTrips);
// router.get('/:id/stats', authenticateToken, getRouteStats);

module.exports = router;
