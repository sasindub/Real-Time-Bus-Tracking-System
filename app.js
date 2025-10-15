import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import routeRoutes from './src/routes/route.routes.js';
import busRoutes from './src/routes/bus.routes.js';
import tripRoutes from './src/routes/trip.routes.js';

// Import middlewares
import requestStdoutLogger from './src/middlewares/requestStdoutLogger.middleware.js';
import errorStdoutLogger from './src/middlewares/errorStdoutLogger.middleware.js';
import errorHandler from './src/middlewares/error.middleware.js';

const app = express();

// Middleware setup
app.use(requestStdoutLogger);
app.use(errorStdoutLogger);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => res.json({ message: 'NTC Bus Tracker API running' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/trips', tripRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
