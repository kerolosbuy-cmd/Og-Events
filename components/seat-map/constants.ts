/**
 * Constants for the Seat Map Application
 * Centralizes all configuration values, magic numbers, and theme-related constants
 */

// ============================================================================
// SEAT SELECTION
// ============================================================================

/** Maximum number of seats a user can select in a single booking */
export const MAX_SEATS_PER_BOOKING = 7;

/** Minimum number of seats required for a booking */
export const MIN_SEATS_PER_BOOKING = 1;

// ============================================================================
// SEAT STATUS
// ============================================================================

export const SEAT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  RESERVED: 'reserved',
  HOLD: 'hold',
} as const;

export type SeatStatus = (typeof SEAT_STATUS)[keyof typeof SEAT_STATUS];

// ============================================================================
// COLORS & OPACITY
// ============================================================================

/** Opacity values for different seat states */
export const OPACITY = {
  SELECTED: '3d', // ~24% opacity for selected seats
  BOOKED: '7f', // ~50% opacity for booked seats
  DISABLED: '80', // 50% opacity for disabled elements
  FULL: 'ff', // 100% opacity
};

/** Default colors for seat states */
export const COLORS = {
  BOOKED: '#7F7F7F',
  BOOKED_BORDER: '#e0e0e0',
  TRANSPARENT: 'transparent',
  WHITE: '#ffffff',
  BLACK: '#000000',
};

// ============================================================================
// SIZING
// ============================================================================

/** Seat radius multipliers for different states */
export const SEAT_SIZE = {
  NORMAL: 1.0,
  BOOKED: 0.5, // Booked seats are smaller
  CHECKMARK_SCALE: 0.4,
  TEXT_SCALE: 0.8,
  ICON_SCALE: 0.15,
};

// ============================================================================
// ANIMATIONS
// ============================================================================

/** Animation durations in milliseconds */
export const ANIMATION_DURATION = {
  NOTIFICATION_AUTO_CLOSE: 5000,
  MAP_CENTER_DELAY: 100,
  THEME_TRANSITION: 300,
  HOLD_ROTATION: 3000,
  HOLD_PULSE: 2000,
};

// ============================================================================
// MAP VIEWER
// ============================================================================

/** Viewer configuration */
export const VIEWER_CONFIG = {
  /** Minimum zoom scale factor */
  MIN_SCALE: 0.1,
  /** Map fit padding (percentage of viewport to leave as padding) */
  FIT_PADDING: 0.95,
  /** Maximum zoom scale factor */
  MAX_SCALE: 5.0,
};

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const Z_INDEX = {
  BASE: 0,
  CONTROLS: 10,
  BOOKING_PANEL: 20,
  NOTIFICATION: 50,
  MODAL: 100,
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
};

// ============================================================================
// LAYOUT
// ============================================================================

export const LAYOUT = {
  /** Padding around floating panels (in pixels) */
  PANEL_PADDING: 16,
  /** Width of the legend panel */
  LEGEND_WIDTH: 330,
  /** Width of the booking form panel */
  BOOKING_FORM_WIDTH: 288,
  /** Max height for scrollable seat list */
  SEAT_LIST_MAX_HEIGHT: 192,
};

// ============================================================================
// VALIDATION
// ============================================================================

/** Email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Phone validation regex (basic international format) */
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  MAX_SEATS_EXCEEDED: `You can only book up to ${MAX_SEATS_PER_BOOKING} seats.`,
  MIN_SEATS_REQUIRED: `Please select at least ${MIN_SEATS_PER_BOOKING} seat.`,
  REQUIRED_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SEAT_UNAVAILABLE: 'One or more seats are no longer available.',
  SYSTEM_ERROR: 'System error. Please try again later.',
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  BOOKING_SUCCESS: 'Booking successful! Your seats have been reserved.',
  SEATS_UPDATED: 'Seat availability updated.',
};

// ============================================================================
// THEME
// ============================================================================

export const THEME = {
  DARK: {
    BACKGROUND: 'rgb(0 0 0 / 0.6)',
    BORDER: 'rgba(255, 255, 255, 0.1)',
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#d1d5db',
    TEXT_TERTIARY: '#9ca3af',
  },
  LIGHT: {
    BACKGROUND: 'rgb(255 255 255 / 0.6)',
    BORDER: 'rgba(0, 0, 0, 0.1)',
    TEXT_PRIMARY: '#1f2937',
    TEXT_SECONDARY: '#4b5563',
    TEXT_TERTIARY: '#6b7280',
  },
  BACKDROP_BLUR: 'blur(24px)',
};

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  THEME_PREFERENCE: 'seatmap_theme_preference',
  LAST_BOOKING: 'seatmap_last_booking',
};
