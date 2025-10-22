/* eslint-disable no-console */
/**
 * Professional Logger Utility for Chat Application
 *
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - Log grouping with collapsible groups
 * - Individual module/function flags
 * - Centralized configuration
 * - Performance tracking
 * - Production-safe logging
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Module flags for granular control
export const MODULE_FLAGS = {
  // Core modules
  AUTH: 'auth',
  CHAT: 'chat',
  FRIENDS: 'friends',
  MESSAGES: 'messages',
  FIREBASE: 'firebase',
  UI: 'ui',

  // Specific functions
  ADD_FRIEND: 'addFriend',
  REMOVE_FRIEND: 'removeFriend',
  GET_FRIENDS: 'getFriends',
  GET_CHATS: 'getChats',
  GET_USERS: 'getUsers',
  MESSAGE_SEND: 'messageSend',
  MESSAGE_RECEIVE: 'messageReceive',

  // Performance tracking
  PERFORMANCE: 'performance',
  API_CALLS: 'apiCalls',
  RENDER: 'render',
};

// Default configuration
const DEFAULT_CONFIG = {
  // Global log level (set to LOG_LEVELS.NONE for production)
  globalLevel: LOG_LEVELS.DEBUG,

  // Individual module flags (true = enabled, false = disabled)
  modules: {
    [MODULE_FLAGS.AUTH]: true,
    [MODULE_FLAGS.CHAT]: true,
    [MODULE_FLAGS.FRIENDS]: true,
    [MODULE_FLAGS.MESSAGES]: true,
    [MODULE_FLAGS.FIREBASE]: true,
    [MODULE_FLAGS.UI]: true,
    [MODULE_FLAGS.ADD_FRIEND]: true,
    [MODULE_FLAGS.REMOVE_FRIEND]: true,
    [MODULE_FLAGS.GET_FRIENDS]: true,
    [MODULE_FLAGS.GET_CHATS]: true,
    [MODULE_FLAGS.GET_USERS]: true,
    [MODULE_FLAGS.MESSAGE_SEND]: true,
    [MODULE_FLAGS.MESSAGE_RECEIVE]: true,
    [MODULE_FLAGS.PERFORMANCE]: true,
    [MODULE_FLAGS.API_CALLS]: true,
    [MODULE_FLAGS.RENDER]: true,
  },

  // Enable/disable log grouping
  enableGrouping: true,

  // Enable/disable performance tracking
  enablePerformance: true,

  // Enable/disable timestamps
  enableTimestamps: true,

  // Enable/disable colors (for better console readability)
  enableColors: true,
};

// Color codes for console output
const COLORS = {
  DEBUG: '#888888',
  INFO: '#2196F3',
  WARN: '#FF9800',
  ERROR: '#F44336',
  GROUP: '#9C27B0',
  PERFORMANCE: '#4CAF50',
  RESET: '#000000',
};

class Logger {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.performanceMarks = new Map();
    this.groupStack = [];
  }

  /**
   * Check if logging is enabled for a specific module and level
   */
  shouldLog(module, level) {
    // Check global level first
    if (level < this.config.globalLevel) {
      return false;
    }

    // Check module-specific flag
    if (module && !this.config.modules[module]) {
      return false;
    }

    return true;
  }

  /**
   * Format log message with timestamp and module info
   */
  formatMessage(module, level, message, ...args) {
    const timestamp = this.config.enableTimestamps
      ? `[${new Date().toISOString().substr(11, 12)}]`
      : '';

    const moduleInfo = module ? `[${module}]` : '';
    const levelInfo = `[${level}]`;

    return {
      prefix: `${timestamp}${moduleInfo}${levelInfo}`,
      message,
      args,
    };
  }

  /**
   * Apply colors to console output
   */
  applyColors(level, text) {
    if (!this.config.enableColors) return text;

    return `%c${text}`;
  }

  /**
   * Core logging method
   */
  log(level, module, message, ...args) {
    if (!this.shouldLog(module, level)) return;

    const formatted = this.formatMessage(module, level, message, ...args);
    const coloredPrefix = this.applyColors(level, formatted.prefix);

    console.log(
      coloredPrefix,
      COLORS[level],
      formatted.message,
      ...formatted.args
    );
  }

  /**
   * Debug level logging
   */
  debug(module, message, ...args) {
    this.log(LOG_LEVELS.DEBUG, module, message, ...args);
  }

  /**
   * Info level logging
   */
  info(module, message, ...args) {
    this.log(LOG_LEVELS.INFO, module, message, ...args);
  }

  /**
   * Warning level logging
   */
  warn(module, message, ...args) {
    this.log(LOG_LEVELS.WARN, module, message, ...args);
  }

  /**
   * Error level logging
   */
  error(module, message, ...args) {
    this.log(LOG_LEVELS.ERROR, module, message, ...args);
  }

  /**
   * Start a log group
   */
  group(module, groupName, ...args) {
    if (
      !this.shouldLog(module, LOG_LEVELS.DEBUG) ||
      !this.config.enableGrouping
    )
      return;

    const formatted = this.formatMessage(module, 'GROUP', groupName, ...args);
    const coloredPrefix = this.applyColors('GROUP', formatted.prefix);

    console.group(
      coloredPrefix,
      COLORS.GROUP,
      formatted.message,
      ...formatted.args
    );
    this.groupStack.push(groupName);
  }

  /**
   * End a log group
   */
  groupEnd() {
    if (!this.config.enableGrouping || this.groupStack.length === 0) return;

    console.groupEnd();
    this.groupStack.pop();
  }

  /**
   * End all log groups
   */
  groupEndAll() {
    while (this.groupStack.length > 0) {
      this.groupEnd();
    }
  }

  /**
   * Log grouped information
   */
  groupLog(module, groupName, logFn) {
    this.group(module, groupName);
    try {
      logFn();
    } finally {
      this.groupEnd();
    }
  }

  /**
   * Performance tracking - start timing
   */
  timeStart(module, label) {
    if (
      !this.shouldLog(module, LOG_LEVELS.DEBUG) ||
      !this.config.enablePerformance
    )
      return;

    const key = `${module}-${label}`;
    this.performanceMarks.set(key, performance.now());
    this.debug(module, `⏱️ Starting timer: ${label}`);
  }

  /**
   * Performance tracking - end timing
   */
  timeEnd(module, label) {
    if (
      !this.shouldLog(module, LOG_LEVELS.DEBUG) ||
      !this.config.enablePerformance
    )
      return;

    const key = `${module}-${label}`;
    const startTime = this.performanceMarks.get(key);

    if (startTime !== undefined) {
      const duration = performance.now() - startTime;
      this.performanceMarks.delete(key);
      this.info(module, `⏱️ Timer ended: ${label} - ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Log API call information
   */
  apiCall(module, method, url, status, duration) {
    if (!this.shouldLog(MODULE_FLAGS.API_CALLS, LOG_LEVELS.INFO)) return;

    const statusColor =
      status >= 200 && status < 300 ? COLORS.PERFORMANCE : COLORS.ERROR;
    // const statusText = this.applyColors('INFO', `[${status}]`);

    // Create colored status indicator
    const coloredStatus = `%c[${status}]`;

    this.info(
      MODULE_FLAGS.API_CALLS,
      `${method} ${url} ${coloredStatus} ${duration}ms`,
      statusColor,
      { method, url, status, duration }
    );
  }

  /**
   * Log Firebase operations
   */
  firebase(operation, collection, docId, success, error = null) {
    const module = MODULE_FLAGS.FIREBASE;

    if (success) {
      this.info(module, `🔥 Firebase ${operation}: ${collection}/${docId}`);
    } else {
      this.error(
        module,
        `🔥 Firebase ${operation} failed: ${collection}/${docId}`,
        error
      );
    }
  }

  /**
   * Log user actions
   */
  userAction(module, action, details = {}) {
    this.info(module, `👤 User action: ${action}`, details);
  }

  /**
   * Log state changes
   */
  stateChange(module, stateName, oldValue, newValue) {
    this.debug(module, `🔄 State changed: ${stateName}`, {
      oldValue,
      newValue,
    });
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Enable/disable specific module
   */
  setModuleEnabled(module, enabled) {
    this.config.modules[module] = enabled;
  }

  /**
   * Set global log level
   */
  setGlobalLevel(level) {
    this.config.globalLevel = level;
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Reset to default configuration
   */
  reset() {
    this.config = { ...DEFAULT_CONFIG };
    this.performanceMarks.clear();
    this.groupEndAll();
  }
}

// Create and export singleton instance
export const logger = new Logger();

// Export convenience methods for common use cases
export const log = {
  // Quick access methods
  debug: (module, message, ...args) => logger.debug(module, message, ...args),
  info: (module, message, ...args) => logger.info(module, message, ...args),
  warn: (module, message, ...args) => logger.warn(module, message, ...args),
  error: (module, message, ...args) => logger.error(module, message, ...args),

  // Grouping methods
  group: (module, groupName, ...args) =>
    logger.group(module, groupName, ...args),
  groupEnd: () => logger.groupEnd(),
  groupEndAll: () => logger.groupEndAll(),
  groupLog: (module, groupName, logFn) =>
    logger.groupLog(module, groupName, logFn),

  // Performance methods
  timeStart: (module, label) => logger.timeStart(module, label),
  timeEnd: (module, label) => logger.timeEnd(module, label),

  // Specialized methods
  firebase: (operation, collection, docId, success, error) =>
    logger.firebase(operation, collection, docId, success, error),
  apiCall: (module, method, url, status, duration) =>
    logger.apiCall(module, method, url, status, duration),
  userAction: (module, action, details) =>
    logger.userAction(module, action, details),
  stateChange: (module, stateName, oldValue, newValue) =>
    logger.stateChange(module, stateName, oldValue, newValue),

  // Configuration methods
  setModuleEnabled: (module, enabled) =>
    logger.setModuleEnabled(module, enabled),
  setGlobalLevel: level => logger.setGlobalLevel(level),
  updateConfig: config => logger.updateConfig(config),
  getConfig: () => logger.getConfig(),
  reset: () => logger.reset(),
};

// Export the logger instance and module flags for direct access
export default logger;
