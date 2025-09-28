const express = require('express');
const {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  updateBusLocation
} = require('../controllers/buses.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole, requireBusAccess } = require('../middlewares/role.middleware');

const router = express.Router();

// Public routes (read-only for buses)
router.get('/', getAllBuses);
router.get('/:id', getBusById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  createBus
);

router.put('/:id', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  updateBus
);

router.delete('/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  deleteBus
);

// Location tracking routes
router.put('/:id/location', 
  authenticateToken, 
  requireBusAccess, 
  updateBusLocation
);

// Additional bus-specific endpoints
// router.get('/:id/trips', authenticateToken, getBusTrips);
// router.get('/:id/location-history', authenticateToken, getBusLocationHistory);
// router.get('/:id/stats', authenticateToken, getBusStats);
// router.get('/nearby', authenticateToken, getNearbyBuses);

module.exports = router;
