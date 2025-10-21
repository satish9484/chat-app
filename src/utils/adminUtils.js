/**
 * Admin utility functions for checking admin status and managing admin-related logic
 */

// Admin email addresses that have admin privileges
export const ADMIN_EMAILS = [
  'admin@chatapp.com',
  'administrator@chatapp.com',
  'superadmin@chatapp.com',
];

/**
 * Check if a user email has admin privileges
 * @param {string} email - User's email address
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isAdminUser = email => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

/**
 * Get admin-specific welcome message
 * @param {string} displayName - User's display name
 * @param {string} email - User's email address
 * @returns {string} - Welcome message for admin users
 */
export const getAdminWelcomeMessage = (displayName, email) => {
  return `Welcome back, Admin ${displayName || email}!`;
};

/**
 * Get regular user welcome message
 * @param {string} displayName - User's display name
 * @param {string} email - User's email address
 * @returns {string} - Welcome message for regular users
 */
export const getRegularWelcomeMessage = (displayName, email) => {
  return `Welcome back, ${displayName || email}!`;
};

/**
 * Get admin-specific registration message
 * @param {string} displayName - User's display name
 * @returns {string} - Registration success message for admin users
 */
export const getAdminRegistrationMessage = displayName => {
  return `🎉 Welcome Admin ${displayName}! Your admin account has been created successfully.`;
};

/**
 * Get regular user registration message
 * @param {string} displayName - User's display name
 * @returns {string} - Registration success message for regular users
 */
export const getRegularRegistrationMessage = displayName => {
  return `🎉 Welcome ${displayName}! Your account has been created successfully.`;
};

/**
 * Get the appropriate redirect path based on user type
 * @param {string} email - User's email address
 * @returns {string} - Redirect path ('/admin' for admins, '/' for regular users)
 */
export const getRedirectPath = email => {
  return isAdminUser(email) ? '/admin' : '/';
};
