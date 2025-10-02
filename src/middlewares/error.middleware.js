import ApiError from '../utils/ApiError.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
};

export const errorHandler = (err, req, res, next) => {
  const isOperational = err instanceof ApiError;
  const statusCode = isOperational ? err.statusCode : 500;

  const response = {
    message: isOperational ? err.message : 'Internal server error',
  };

  if (isOperational && err.details !== undefined) response.details = err.details;

  if (!isOperational) {
    // Log unexpected errors; keep original server.js logger intact
    console.error(err);
  }

  res.status(statusCode).json(response);
};

export default errorHandler;


