import crypto from 'crypto';

const SERVICE = process.env.SERVICE_NAME || 'ntc-bus-tracker';
const ENV = process.env.NODE_ENV || 'development';

function now() {
  return new Date().toISOString();
}

function log(level, message, meta) {
  const payload = {
    ts: now(),
    level,
    service: SERVICE,
    env: ENV,
    message,
    ...meta,
  };
  const line = JSON.stringify(payload);
  if (level === 'error') return console.error(line);
  if (level === 'warn') return console.warn(line);
  return console.log(line);
}

export const createRequestId = () => crypto.randomUUID?.() || crypto.randomBytes(12).toString('hex');

const stdoutLogger = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  child: (childMeta = {}) => ({
    info: (message, meta) => log('info', message, { ...childMeta, ...meta }),
    warn: (message, meta) => log('warn', message, { ...childMeta, ...meta }),
    error: (message, meta) => log('error', message, { ...childMeta, ...meta }),
  }),
};

export default stdoutLogger;
