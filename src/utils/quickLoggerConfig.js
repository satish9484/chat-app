/**
 * Quick Logger Configuration
 *
 * Modify these settings to control logging behavior:
 * - Set ENABLE_LOGGING to false to disable all logs
 * - Set individual module flags to true/false
 * - Change LOG_LEVEL to control verbosity
 */

import { LOG_LEVELS, MODULE_FLAGS } from './logger';

// Quick configuration - modify these values as needed
export const QUICK_CONFIG = {
  // Set to false to disable all logging
  ENABLE_LOGGING: true,

  // Set log level (DEBUG, INFO, WARN, ERROR, NONE)
  LOG_LEVEL: LOG_LEVELS.DEBUG,

  // Individual module flags - set to true to enable, false to disable
  MODULES: {
    // Core modules
    [MODULE_FLAGS.AUTH]: false,
    [MODULE_FLAGS.CHAT]: false,
    [MODULE_FLAGS.FRIENDS]: false,
    [MODULE_FLAGS.MESSAGES]: false,
    [MODULE_FLAGS.FIREBASE]: false,
    [MODULE_FLAGS.UI]: true,

    // Specific functions
    [MODULE_FLAGS.ADD_FRIEND]: false, // Enable/disable friend addition logs
    [MODULE_FLAGS.REMOVE_FRIEND]: false, // Enable/disable friend removal logs
    [MODULE_FLAGS.GET_FRIENDS]: false, // Enable/disable get friends logs
    [MODULE_FLAGS.GET_CHATS]: false, // Enable/disable get chats logs
    [MODULE_FLAGS.GET_USERS]: false, // Enable/disable get users logs
    [MODULE_FLAGS.MESSAGE_SEND]: false, // Enable/disable message send logs
    [MODULE_FLAGS.MESSAGE_RECEIVE]: false, // Enable/disable message receive logs

    // Performance tracking
    [MODULE_FLAGS.PERFORMANCE]: true, // Enable/disable performance logs
    [MODULE_FLAGS.API_CALLS]: true, // Enable/disable API call logs
    [MODULE_FLAGS.RENDER]: false, // Enable/disable render logs (usually disabled)
  },

  // Additional settings
  ENABLE_GROUPING: true, // Enable collapsible log groups
  ENABLE_PERFORMANCE: true, // Enable performance tracking
  ENABLE_TIMESTAMPS: true, // Enable timestamps in logs
  ENABLE_COLORS: true, // Enable colored console output
};

// Helper function to get configuration
export const getQuickConfig = () => {
  if (!QUICK_CONFIG.ENABLE_LOGGING) {
    return {
      globalLevel: LOG_LEVELS.NONE,
      modules: Object.keys(QUICK_CONFIG.MODULES).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      enableGrouping: false,
      enablePerformance: false,
      enableTimestamps: false,
      enableColors: false,
    };
  }

  return {
    globalLevel: QUICK_CONFIG.LOG_LEVEL,
    modules: QUICK_CONFIG.MODULES,
    enableGrouping: QUICK_CONFIG.ENABLE_GROUPING,
    enablePerformance: QUICK_CONFIG.ENABLE_PERFORMANCE,
    enableTimestamps: QUICK_CONFIG.ENABLE_TIMESTAMPS,
    enableColors: QUICK_CONFIG.ENABLE_COLORS,
  };
};
