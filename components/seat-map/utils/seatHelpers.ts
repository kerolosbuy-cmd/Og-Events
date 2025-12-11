/**
 * Utility functions for seat-related operations
 * Pure functions with no side effects for better testability
 */

import { Seat, Category } from '../types';
import { COLORS, OPACITY, SEAT_SIZE } from '../constants';

/**
 * Calculate the fill color for a seat based on its status and selection state
 */
export function calculateSeatColor(
  seat: Seat,
  isSelected: boolean,
  categories: Record<string, Category>
): string {
  // Booked seats are always grey
  if (seat.status === 'booked') {
    return COLORS.BOOKED + OPACITY.BOOKED;
  }

  // Hold and pending_approval seats have no fill
  if (seat.status === 'hold' || seat.status === 'pending_approval') {
    return COLORS.TRANSPARENT;
  }

  const categoryColor = categories[seat.category]?.color || COLORS.BLACK;

  // Selected seats use a lighter version of the category color
  if (isSelected) {
    return categoryColor + OPACITY.SELECTED;
  }

  // Default: full category color
  return categoryColor;
}

/**
 * Calculate the border color for a seat
 */
export function calculateSeatBorderColor(
  seat: Seat,
  isSelected: boolean,
  categories: Record<string, Category>
): string {
  if (seat.status === 'booked') {
    return COLORS.BOOKED_BORDER;
  }

  if (seat.status === 'hold' || seat.status === 'pending_approval') {
    return COLORS.TRANSPARENT;
  }

  if (isSelected) {
    return categories[seat.category]?.color || COLORS.BLACK;
  }

  return COLORS.TRANSPARENT;
}

/**
 * Calculate the radius for a seat based on its status
 */
export function calculateSeatRadius(seat: Seat): number {
  if (seat.status === 'booked') {
    return seat.radius * SEAT_SIZE.BOOKED;
  }
  return seat.radius * SEAT_SIZE.NORMAL;
}

/**
 * Check if a seat is available for selection
 */
export function isSeatAvailable(seat: Seat): boolean {
  return seat.status === 'available';
}

/**
 * Check if a seat is clickable
 */
export function isSeatClickable(seat: Seat): boolean {
  return seat.status === 'available';
}

/**
 * Format seat label for display
 */
export function formatSeatLabel(rowNumber: string, seatNumber: string, category: string): string {
  return `Row: ${rowNumber} Seat: ${seatNumber} (${category})`;
}

/**
 * Get the price for a seat by category
 */
export function getSeatPrice(category: string, categories: Record<string, Category>): number {
  return categories[category]?.price || 0;
}

/**
 * Calculate total price for an array of seats
 */
export function calculateTotalPrice(seats: Seat[], categories: Record<string, Category>): number {
  return seats.reduce((sum, seat) => sum + getSeatPrice(seat.category, categories), 0);
}

/**
 * Get cursor style for a seat based on its status
 */
export function getSeatCursor(seat: Seat): 'pointer' | 'not-allowed' | 'default' {
  if (seat.status === 'available') return 'pointer';
  if (seat.status === 'booked' || seat.status === 'hold' || seat.status === 'pending_approval')
    return 'not-allowed';
  return 'default';
}

/**
 * Check if a seat should show its number
 */
export function shouldShowSeatNumber(seat: Seat, isSelected: boolean): boolean {
  return (
    !isSelected &&
    seat.status !== 'booked' &&
    seat.status !== 'hold' &&
    seat.status !== 'pending_approval'
  );
}

/**
 * Check if a seat should show a checkmark
 */
export function shouldShowCheckmark(isSelected: boolean): boolean {
  return isSelected;
}

/**
 * Check if a seat should show hold status animation
 */
export function shouldShowHoldStatus(seat: Seat): boolean {
  return seat.status === 'hold' || seat.status === 'pending_approval';
}

/**
 * Validate seat selection limit
 */
export function canSelectMoreSeats(currentSelectionCount: number, maxSeats: number): boolean {
  return currentSelectionCount < maxSeats;
}

/**
 * Find a zone name by row ID
 */
export function findZoneNameByRowId(
  zones: Array<{ id: string; name: string; rows: Array<{ id: string }> }>,
  rowId: string
): string {
  for (const zone of zones) {
    const row = zone.rows.find(r => r.id === rowId);
    if (row) return zone.name;
  }
  return 'Unknown Zone';
}

/**
 * Find a row number by row ID
 */
export function findRowNumberByRowId(
  zones: Array<{ rows: Array<{ id: string; row_number: string }> }>,
  rowId: string
): string {
  for (const zone of zones) {
    const row = zone.rows.find(r => r.id === rowId);
    if (row) return row.row_number;
  }
  return '?';
}
