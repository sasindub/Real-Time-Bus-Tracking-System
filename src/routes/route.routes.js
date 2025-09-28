import express from 'express';
import { createRoute, listRoutes, getRoute } from '../controllers/routes.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = express.Router();

router.get('/', listRoutes);
router.get('/:id', getRoute);
router.post('/', authenticate, authorize(['admin','operator']), createRoute);

export default router;
