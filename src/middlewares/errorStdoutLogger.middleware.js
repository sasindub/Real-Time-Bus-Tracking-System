import stdoutLogger from '../utils/stdoutLogger.js';

const errorStdoutLogger = (err, req, res, next) => {
  const requestId = req?.requestId;
  const payload = {
    requestId,
    method: req?.method,
    path: req?.originalUrl,
    statusCode: res?.statusCode,
    errorName: err?.name,
    errorMessage: err?.message,
  };

  // Log stack only in non-production or when explicitly provided
  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    payload.stack = err.stack;
  }

  stdoutLogger.error('request:error', payload);

  next(err);
};

export default errorStdoutLogger;


