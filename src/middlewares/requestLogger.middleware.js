import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  const { method, originalUrl } = req;
  const reqMeta = {
    method,
    path: originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  };

  logger.info('request:start', reqMeta);

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    const resMeta = {
      ...reqMeta,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      contentLength: res.get('content-length') || undefined,
    };
    logger.info('request:finish', resMeta);
  });

  res.on('close', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    logger.warn('request:aborted', {
      ...reqMeta,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });

  next();
};

export default requestLogger;


