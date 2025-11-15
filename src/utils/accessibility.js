/**
 * Accessibility Utilities
 * Helper functions for improving accessibility across the application
 */

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Trap focus within a modal or dialog
 * @param {HTMLElement} element - Container element
 */
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTab = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTab);
  
  return () => {
    element.removeEventListener('keydown', handleTab);
  };
};

/**
 * Handle escape key to close modals
 * @param {Function} callback - Function to call on escape
 */
export const useEscapeKey = (callback) => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  };

  document.addEventListener('keydown', handleEscape);
  
  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
};

/**
 * Get ARIA label for status badges
 * @param {string} status - Status value
 * @returns {string} - Descriptive label
 */
export const getStatusAriaLabel = (status) => {
  const labels = {
    active: 'Status: Active',
    canceled: 'Status: Canceled',
    past_due: 'Status: Past Due',
    trialing: 'Status: Trialing',
    paid: 'Status: Paid',
    open: 'Status: Open',
    void: 'Status: Void',
    draft: 'Status: Draft',
    critical: 'Severity: Critical',
    high: 'Severity: High',
    medium: 'Severity: Medium',
    low: 'Severity: Low',
  };
  
  return labels[status] || `Status: ${status}`;
};

/**
 * Get ARIA label for severity
 * @param {string} severity - Severity level
 * @returns {string} - Descriptive label
 */
export const getSeverityAriaLabel = (severity) => {
  const labels = {
    critical: 'Critical severity - Immediate action required',
    high: 'High severity - Prompt attention needed',
    medium: 'Medium severity - Should be addressed',
    low: 'Low severity - Minor issue',
    info: 'Informational - No action required',
  };
  
  return labels[severity] || severity;
};

/**
 * Format date for screen readers
 * @param {string} date - ISO date string
 * @returns {string} - Formatted readable date
 */
export const formatDateForScreenReader = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers dark mode
 * @returns {boolean}
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Set page title for screen readers
 * @param {string} title - Page title
 */
export const setPageTitle = (title) => {
  document.title = `${title} - MyESI Security Platform`;
  announceToScreenReader(`Navigated to ${title} page`);
};

/**
 * Create skip link for keyboard navigation
 * @param {string} targetId - ID of main content
 */
export const createSkipLink = (targetId) => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  });
  
  return skipLink;
};

export default {
  announceToScreenReader,
  trapFocus,
  useEscapeKey,
  getStatusAriaLabel,
  getSeverityAriaLabel,
  formatDateForScreenReader,
  prefersReducedMotion,
  prefersDarkMode,
  setPageTitle,
  createSkipLink,
};
