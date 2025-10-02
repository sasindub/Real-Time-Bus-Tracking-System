import stdoutLogger, { createRequestId } from '../utils/stdoutLogger.js';

const requestStdoutLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  const requestId = req.headers['x-request-id'] || createRequestId();
  req.requestId = requestId;

  const { method, originalUrl } = req;
  const base = {
    requestId,
    method,
    path: originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  stdoutLogger.info('request:start', base);

  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    stdoutLogger.info('request:finish', {
      ...base,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      contentLength: res.get('content-length') || undefined,
    });
  });

  res.on('close', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    stdoutLogger.warn('request:aborted', {
      ...base,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });

  next();
};

export default requestStdoutLogger;


