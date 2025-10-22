/**
 * Viewport Utilities - Professional Adaptive Layout System
 *
 * Handles dynamic viewport height calculation and browser UI adaptation
 * for modern responsive web applications.
 */

// Dynamic viewport height calculation
export const setViewportHeight = () => {
  // Get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;

  // Set the CSS custom property --vh to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // Also set the actual viewport height for fallback
  document.documentElement.style.setProperty(
    '--actual-vh',
    `${window.innerHeight}px`
  );
};

// Initialize viewport handling
export const initViewportHandling = () => {
  // Set initial viewport height
  setViewportHeight();

  // Listen for resize events
  let resizeTimeout;
  const handleResize = () => {
    // Debounce resize events for better performance
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setViewportHeight();
    }, 100);
  };

  // Add event listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    // Delay for orientation change to complete
    setTimeout(setViewportHeight, 500);
  });

  // Handle visual viewport changes (for mobile browsers with dynamic UI)
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleResize);
  }

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleResize);
    }
    clearTimeout(resizeTimeout);
  };
};

// Get current viewport dimensions
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    vh: window.innerHeight * 0.01,
    vw: window.innerWidth * 0.01,
    // Visual viewport (excludes browser UI)
    visualWidth: window.visualViewport?.width || window.innerWidth,
    visualHeight: window.visualViewport?.height || window.innerHeight,
  };
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 767;
};

// Check if device is tablet
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth <= 1023;
};

// Check if device is desktop
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Get device type
export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Handle safe area insets
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);

  return {
    top: computedStyle.getPropertyValue('--safe-area-inset-top') || '0px',
    right: computedStyle.getPropertyValue('--safe-area-inset-right') || '0px',
    bottom: computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: computedStyle.getPropertyValue('--safe-area-inset-left') || '0px',
  };
};

// Prevent zoom on double tap (iOS Safari)
export const preventDoubleTapZoom = () => {
  let lastTouchEnd = 0;

  document.addEventListener(
    'touchend',
    event => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
};

// Initialize all viewport utilities
export const initViewportSystem = () => {
  const cleanupViewport = initViewportHandling();
  preventDoubleTapZoom();

  // Return cleanup function
  return cleanupViewport;
};

// Export default initialization
export default initViewportSystem;
