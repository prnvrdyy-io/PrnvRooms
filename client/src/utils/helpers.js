/**
 * General-purpose utility functions.
 * Keep functions pure and side-effect free.
 */

/**
 * Format a Date object or ISO string to a readable time string
 * @param {string|Date} date
 * @returns {string} e.g. "2:34 PM"
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a Date to a short date string
 * @param {string|Date} date
 * @returns {string} e.g. "Jul 2, 2026"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Generate a random avatar color from the user's name
 * Deterministic — same name always produces same color.
 * @param {string} name
 * @returns {string} HSL color string
 */
export const getAvatarColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

/**
 * Get initials from a full name
 * @param {string} name
 * @returns {string} e.g. "AC" from "Alex Chen"
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Truncate a string to a max length with ellipsis
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (str, maxLen = 40) => {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
};

/**
 * Format file size in human-readable form
 * @param {number} bytes
 * @returns {string} e.g. "1.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
