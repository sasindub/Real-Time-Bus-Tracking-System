const express = require('express');
const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  startTrip,
  completeTrip
} = require('../controllers/trips.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requireRole, requireTripAccess } = require('../middlewares/role.middleware');

const router = express.Router();

// Public routes (read-only for trips)
router.get('/', getAllTrips);
router.get('/:id', getTripById);

// Protected routes
router.post('/', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  createTrip
);

router.put('/:id', 
  authenticateToken, 
  requireRole(['admin', 'moderator']), 
  updateTrip
);

router.delete('/:id', 
  authenticateToken, 
  requireRole(['admin']), 
  deleteTrip
);

// Trip control routes
router.post('/:id/start', 
  authenticateToken, 
  requireRole(['admin', 'moderator', 'driver']), 
  startTrip
);

router.post('/:id/complete', 
  authenticateToken, 
  requireRole(['admin', 'moderator', 'driver']), 
  completeTrip
);

// Additional trip-specific endpoints
// router.get('/:id/tracking', authenticateToken, getTripTracking);
// router.get('/:id/passengers', authenticateToken, getTripPassengers);
// router.get('/:id/stats', authenticateToken, getTripStats);
// router.get('/active', authenticateToken, getActiveTrips);
// router.get('/today', authenticateToken, getTodayTrips);

module.exports = router;
