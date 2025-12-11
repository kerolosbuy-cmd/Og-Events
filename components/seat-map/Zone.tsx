import React from 'react';
import Row from './Row';
import {
  Zone as ZoneType,
  Category as CategoryType,
  Seat as SeatType,
  Area as AreaType,
} from './types';

/**
 * Props for the Zone component
 */
interface ZoneProps {
  /** Zone data containing rows and areas */
  zone: ZoneType;
  /** Seat categories with color and price information */
  categories: Record<string, CategoryType>;
  /** Array of currently selected seat IDs */
  selectedSeats: SeatType[];
  /** Callback function triggered when a seat is clicked */
  onSeatClick: (seat: SeatType) => void;
}

/**
 * Renders an area (e.g., stage) within a zone
 * @param area The area to render
 * @returns JSX element representing the area
 */
const Area: React.FC<{ area: AreaType }> = ({ area }) => {
  const transform = `translate(${area.position_x}, ${area.position_y}) rotate(${area.rotation})`;
  const textX = area.width / 2;
  const textY = area.height / 2;

  return (
    <g key={area.id} transform={transform} className="zone-area">
      <rect
        width={area.width}
        height={area.height}
        fill={area.fill_color}
        stroke="black"
        className="area-rect"
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        className="area-text"
      >
        {area.text_content}
      </text>
    </g>
  );
};

/**
 * Zone component that renders rows and areas (like stage) in a theater zone
 *
 * @param {ZoneProps} props - Component props
 * @returns {JSX.Element} SVG group element containing rows and areas
 */
const Zone: React.FC<ZoneProps> = ({ zone, categories, selectedSeats, onSeatClick }) => {
  return (
    <g
      key={zone.id}
      transform={`translate(${zone.position_x}, ${zone.position_y})`}
      className="seat-zone"
      data-zone-name={zone.name}
    >
      {/* Render areas (e.g., stage) */}
      {zone.areas && zone.areas.map(area => <Area key={area.id} area={area} />)}

      {/* Render rows of seats */}
      {zone.rows.map(row => (
        <Row
          key={row.id}
          row={row}
          categories={categories}
          selectedSeats={selectedSeats}
          onSeatClick={onSeatClick}
        />
      ))}
    </g>
  );
};

// Optimize component with memo to prevent unnecessary re-renders
export default React.memo(Zone);
