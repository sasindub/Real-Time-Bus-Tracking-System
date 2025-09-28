import express from 'express';
import { createBus, listBuses, getBus, postLocation, getBusLocations } from '../controllers/buses.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = express.Router();

router.get('/', listBuses); // public
router.get('/:id', getBus);
router.post('/', authenticate, authorize(['admin','operator']), createBus); // add bus
router.post('/:id/location', authenticate, authorize(['operator','admin']), postLocation); // push location
router.get('/:id/locations', getBusLocations);

export default router;
