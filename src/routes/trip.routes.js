import express from 'express';
import { createTrip, listTrips, getTrip, updateTripStatus } from '../controllers/trips.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = express.Router();

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', authenticate, authorize(['admin','operator']), createTrip);
router.patch('/:id/status', authenticate, authorize(['admin','operator']), updateTripStatus);

export default router;
