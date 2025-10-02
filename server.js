import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes
import authRoutes from './src/routes/auth.routes.js';
import routeRoutes from './src/routes/route.routes.js';
import busRoutes from './src/routes/bus.routes.js';
import tripRoutes from './src/routes/trip.routes.js';

import requestStdoutLogger from './src/middlewares/requestStdoutLogger.middleware.js';



import errorStdoutLogger from './src/middlewares/errorStdoutLogger.middleware.js';


const app = express();
connectDB();

app.use(requestStdoutLogger);
app.use(errorStdoutLogger);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ message: 'NTC Bus Tracker API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/trips', tripRoutes);

// error handler simple
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
