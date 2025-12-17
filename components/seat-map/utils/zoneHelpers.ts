
/**
 * Utility functions for zone-related operations
 */

import { Zone, Row, Seat, Category } from '../types';

/**
 * Calculate the bounding rectangle of all seats in a zone
 */
export function calculateZoneBounds(zone: Zone): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  hasSeats: boolean;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Iterate through all rows and seats to find the bounds
  zone.rows.forEach(row => {
    row.seats.forEach(seat => {
      // Account for both the row position and the seat position
      const absoluteSeatX = row.position_x + seat.position_x;
      const absoluteSeatY = row.position_y + seat.position_y;
      
      const seatLeft = absoluteSeatX - seat.radius;
      const seatRight = absoluteSeatX + seat.radius;
      const seatTop = absoluteSeatY - seat.radius;
      const seatBottom = absoluteSeatY + seat.radius;

      minX = Math.min(minX, seatLeft);
      minY = Math.min(minY, seatTop);
      maxX = Math.max(maxX, seatRight);
      maxY = Math.max(maxY, seatBottom);
    });
  });

  // If no seats were found, return a default rectangle with hasSeats flag
  if (minX === Infinity) {
    return {
      minX: 0,
      minY: 0,
      maxX: 100,
      maxY: 100,
      hasSeats: false,
    };
  }

  return { minX, minY, maxX, maxY, hasSeats: true };
}

/**
 * Get the most common seat category in a zone
 */
export function getMostCommonCategory(zone: Zone): string {
  const categoryCount: Record<string, number> = {};

  // Count seats by category
  zone.rows.forEach(row => {
    row.seats.forEach(seat => {
      categoryCount[seat.category] = (categoryCount[seat.category] || 0) + 1;
    });
  });

  // Find the category with the most seats
  let mostCommonCategory = '';
  let maxCount = 0;

  Object.entries(categoryCount).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonCategory = category;
    }
  });

  return mostCommonCategory;
}

/**
 * Get the color for a zone based on the most common seat category
 */
export function getZoneColor(zone: Zone, categories: Record<string, Category>): string {
  const mostCommonCategory = getMostCommonCategory(zone);
  return categories[mostCommonCategory]?.color || '#000000';
}
