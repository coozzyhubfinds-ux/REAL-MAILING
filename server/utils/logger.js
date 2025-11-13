const formatMessage = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();
  return { level, timestamp, message, ...context };
};

export const logInfo = (message, context) => {
  console.log(formatMessage('info', message, context));
};

export const logWarn = (message, context) => {
  console.warn(formatMessage('warn', message, context));
};

export const logError = (message, context) => {
  console.error(formatMessage('error', message, context));
};

export default {
  info: logInfo,
  warn: logWarn,
  error: logError
};

