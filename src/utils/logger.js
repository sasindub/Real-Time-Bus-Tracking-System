const levels = ['trace','debug','info','warn','error'];

function time() {
  return new Date().toISOString();
}

function base(meta = {}) {
  return {
    ts: time(),
    ...meta,
  };
}

function log(level, message, meta) {
  const payload = { level, message, ...base(meta) };
  // Keep console transport simple for now; structured JSON
  const line = JSON.stringify(payload);
  if (level === 'error') return console.error(line);
  if (level === 'warn') return console.warn(line);
  return console.log(line);
}

const logger = {
  trace: (message, meta) => log('trace', message, meta),
  debug: (message, meta) => log('debug', message, meta),
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  child: (childMeta = {}) => ({
    trace: (message, meta) => log('trace', message, { ...childMeta, ...meta }),
    debug: (message, meta) => log('debug', message, { ...childMeta, ...meta }),
    info: (message, meta) => log('info', message, { ...childMeta, ...meta }),
    warn: (message, meta) => log('warn', message, { ...childMeta, ...meta }),
    error: (message, meta) => log('error', message, { ...childMeta, ...meta }),
  }),
};

export default logger;


