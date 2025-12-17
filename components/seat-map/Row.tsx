import React, { useMemo, useCallback } from 'react';
import Seat from './Seat';
import { Row as RowType, Category as CategoryType, Seat as SeatType } from './types';

/**
 * Props for the Row component
 */
interface RowProps {
  /** Row data containing seat information */
  row: RowType;
  /** Seat categories with color and price information */
  categories: Record<string, CategoryType>;
  /** Array of currently selected seat IDs */
  selectedSeats: SeatType[];
  /** Callback function triggered when a seat is clicked */
  onSeatClick: (seat: SeatType) => void;
}

/**
 * Row component that renders a group of seats in a theater row
 *
 * @param {RowProps} props - Component props
 * @returns {JSX.Element} SVG group element containing seats
 */
const Row: React.FC<RowProps> = ({ row, categories, selectedSeats, onSeatClick }) => {
  // Create a Set of selected seat IDs for O(1) lookup performance
  const selectedSeatIds = useMemo(
    () => new Set(selectedSeats.map(seat => seat.id)),
    [selectedSeats]
  );

  // Check if a seat is currently selected
  const isSeatSelected = useCallback(
    (seatId: string): boolean => selectedSeatIds.has(seatId),
    [selectedSeatIds]
  );

  return (
    <g
      key={row.id}
      transform={`translate(${row.position_x}, ${row.position_y})`}
      className="seat-row"
      data-row-number={row.row_number}
    >
      {row.seats.map(seat => (
        <Seat
          key={seat.id}
          seat={seat}
          rowNumber={row.row_number}
          categories={categories}
          isSelected={isSeatSelected(seat.id)}
          onClick={onSeatClick || (() => {})}
        />
      ))}
    </g>
  );
};

// Optimize component with memo to prevent unnecessary re-renders
export default React.memo(Row);
