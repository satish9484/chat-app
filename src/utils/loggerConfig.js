/**
 * Logger Configuration for Chat Application
 *
 * This file contains all logging configuration settings.
 * Modify these settings to control logging behavior across the application.
 */

import { LOG_LEVELS, MODULE_FLAGS } from './logger';

// Production configuration (minimal logging)
export const PRODUCTION_CONFIG = {
  globalLevel: LOG_LEVELS.ERROR, // Only show errors in production
  modules: {
    [MODULE_FLAGS.AUTH]: false,
    [MODULE_FLAGS.CHAT]: false,
    [MODULE_FLAGS.FRIENDS]: false,
    [MODULE_FLAGS.MESSAGES]: false,
    [MODULE_FLAGS.FIREBASE]: false,
    [MODULE_FLAGS.UI]: false,
    [MODULE_FLAGS.ADD_FRIEND]: false,
    [MODULE_FLAGS.REMOVE_FRIEND]: false,
    [MODULE_FLAGS.GET_FRIENDS]: false,
    [MODULE_FLAGS.GET_CHATS]: false,
    [MODULE_FLAGS.GET_USERS]: false,
    [MODULE_FLAGS.MESSAGE_SEND]: false,
    [MODULE_FLAGS.MESSAGE_RECEIVE]: false,
    [MODULE_FLAGS.PERFORMANCE]: false,
    [MODULE_FLAGS.API_CALLS]: false,
    [MODULE_FLAGS.RENDER]: false,
  },
  enableGrouping: false,
  enablePerformance: false,
  enableTimestamps: false,
  enableColors: false,
};

// Development configuration (full logging)
export const DEVELOPMENT_CONFIG = {
  globalLevel: LOG_LEVELS.DEBUG, // Show all logs in development
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
  enableGrouping: true,
  enablePerformance: true,
  enableTimestamps: true,
  enableColors: true,
};

// Testing configuration (focused logging)
export const TESTING_CONFIG = {
  globalLevel: LOG_LEVELS.INFO,
  modules: {
    [MODULE_FLAGS.AUTH]: true,
    [MODULE_FLAGS.CHAT]: false,
    [MODULE_FLAGS.FRIENDS]: true,
    [MODULE_FLAGS.MESSAGES]: false,
    [MODULE_FLAGS.FIREBASE]: true,
    [MODULE_FLAGS.UI]: false,
    [MODULE_FLAGS.ADD_FRIEND]: true,
    [MODULE_FLAGS.REMOVE_FRIEND]: true,
    [MODULE_FLAGS.GET_FRIENDS]: true,
    [MODULE_FLAGS.GET_CHATS]: false,
    [MODULE_FLAGS.GET_USERS]: false,
    [MODULE_FLAGS.MESSAGE_SEND]: false,
    [MODULE_FLAGS.MESSAGE_RECEIVE]: false,
    [MODULE_FLAGS.PERFORMANCE]: true,
    [MODULE_FLAGS.API_CALLS]: true,
    [MODULE_FLAGS.RENDER]: false,
  },
  enableGrouping: true,
  enablePerformance: true,
  enableTimestamps: true,
  enableColors: true,
};

// Debug configuration (maximum logging for troubleshooting)
export const DEBUG_CONFIG = {
  globalLevel: LOG_LEVELS.DEBUG,
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
  enableGrouping: true,
  enablePerformance: true,
  enableTimestamps: true,
  enableColors: true,
};

// Determine current environment and return appropriate config
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return PRODUCTION_CONFIG;
    case 'test':
      return TESTING_CONFIG;
    case 'development':
    default:
      return DEVELOPMENT_CONFIG;
  }
};

// Export the current configuration
export const CURRENT_CONFIG = getCurrentConfig();
