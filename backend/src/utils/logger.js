export const logger = {
  info: (...args) => console.log('ℹ️ [INFO]', ...args),
  warn: (...args) => console.warn('⚠️ [WARN]', ...args),
  error: (...args) => console.error('❌ [ERROR]', ...args),
  audit: (action, details) => console.log(`🔒 [AUDIT] [${action}]`, JSON.stringify(details))
};
