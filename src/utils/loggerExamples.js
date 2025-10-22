/**
 * Example Usage of Professional Logger System
 *
 * This file demonstrates how to use the new logging system in your components.
 * Copy these patterns to update your existing code.
 */

import { log, LOG_LEVELS, MODULE_FLAGS } from '../utils/logger';

// Example 1: Basic logging with module flags
export const exampleBasicLogging = () => {
  // Debug level logging (only shows when module is enabled)
  log.debug(MODULE_FLAGS.FRIENDS, 'Loading friends list');

  // Info level logging
  log.info(MODULE_FLAGS.FRIENDS, 'Friend added successfully');

  // Warning level logging
  log.warn(MODULE_FLAGS.FRIENDS, 'Friend already exists');

  // Error level logging
  const error = new Error('Failed to add friend');
  log.error(MODULE_FLAGS.FRIENDS, 'Failed to add friend', error);
};

// Example 2: Log grouping for better organization
export const exampleGroupedLogging = () => {
  log.groupLog(MODULE_FLAGS.ADD_FRIEND, '👥 Adding Friend Process', () => {
    log.debug(MODULE_FLAGS.ADD_FRIEND, 'Step 1: Validating user data');
    log.debug(MODULE_FLAGS.ADD_FRIEND, 'Step 2: Checking if friend exists');
    log.debug(MODULE_FLAGS.ADD_FRIEND, 'Step 3: Adding to database');
    log.info(MODULE_FLAGS.ADD_FRIEND, 'Step 4: Success!');
  });
};

// Example 3: Performance tracking
export const examplePerformanceTracking = async () => {
  // Mock function for demonstration
  const loadFriendsFromDatabase = async () => {
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return ['friend1', 'friend2', 'friend3'];
  };

  log.timeStart(MODULE_FLAGS.GET_FRIENDS, 'loadFriends');

  try {
    // Your async operation here
    await loadFriendsFromDatabase();
    log.info(MODULE_FLAGS.GET_FRIENDS, 'Friends loaded successfully');
  } catch (error) {
    log.error(MODULE_FLAGS.GET_FRIENDS, 'Failed to load friends', error);
  } finally {
    log.timeEnd(MODULE_FLAGS.GET_FRIENDS, 'loadFriends');
  }
};

// Example 4: Firebase operations
export const exampleFirebaseLogging = async () => {
  // Mock data for demonstration
  const friendData = {
    id: 'friend123',
    name: 'John Doe',
    email: 'john@example.com',
  };
  const friendId = friendData.id;

  // Mock function for demonstration
  const addFriendToDatabase = async data => {
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 50));
    if (Math.random() > 0.1) {
      // 90% success rate for demo
      return data;
    }
    throw new Error('Database connection failed');
  };

  try {
    await addFriendToDatabase(friendData);
    log.firebase('CREATE', 'friends', friendId, true);
  } catch (error) {
    log.firebase('CREATE', 'friends', friendId, false, error);
  }
};

// Example 5: User actions
export const exampleUserActionLogging = () => {
  log.userAction(MODULE_FLAGS.ADD_FRIEND, 'Add Friend Button Clicked', {
    targetUser: 'John Doe',
    timestamp: new Date().toISOString(),
  });
};

// Example 6: State changes
export const exampleStateChangeLogging = (oldFriends, newFriends) => {
  log.stateChange(MODULE_FLAGS.FRIENDS, 'friendsList', oldFriends, newFriends);
};

// Example 7: API calls
export const exampleApiCallLogging = () => {
  const startTime = performance.now();

  fetch('/api/friends').then(response => {
    const duration = performance.now() - startTime;
    log.apiCall(
      MODULE_FLAGS.API_CALLS,
      'GET',
      '/api/friends',
      response.status,
      duration
    );
  });
};

// Example 8: Conditional logging based on module flags
export const exampleConditionalLogging = () => {
  // This will only log if MODULE_FLAGS.RENDER is enabled
  log.debug(MODULE_FLAGS.RENDER, 'Component re-rendered');

  // This will only log if MODULE_FLAGS.PERFORMANCE is enabled
  log.info(MODULE_FLAGS.PERFORMANCE, 'Performance metrics collected');
};

// Example 9: Updating existing console.log statements
export const exampleUpdatingOldLogs = () => {
  // Mock user data for demonstration
  const user = {
    displayName: 'John Doe',
    email: 'john@example.com',
  };
  const error = new Error('Failed to add friend');

  // OLD WAY:
  // console.log('Adding friend:', user.displayName);
  // console.error('Error adding friend:', error);

  // NEW WAY:
  log.debug(MODULE_FLAGS.ADD_FRIEND, 'Adding friend:', user.displayName);
  log.error(MODULE_FLAGS.ADD_FRIEND, 'Error adding friend:', error);
};

// Example 10: Configuration management
export const exampleConfigurationManagement = () => {
  // Enable specific module
  log.setModuleEnabled(MODULE_FLAGS.ADD_FRIEND, true);

  // Disable specific module
  log.setModuleEnabled(MODULE_FLAGS.RENDER, false);

  // Set global log level
  log.setGlobalLevel(LOG_LEVELS.INFO);

  // Update multiple settings
  log.updateConfig({
    enableGrouping: true,
    enablePerformance: true,
    enableColors: true,
  });
};
