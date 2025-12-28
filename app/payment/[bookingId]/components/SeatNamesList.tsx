/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';

interface Seat {
    id: string;
    seat_number: string;
    category: string;
    name_on_ticket?: string;
    rows: {
        row_number: string;
        zones: {
            name: string;
        };
    };
}

interface Category {
    name: string;
    color: string;
    price: number;
    isVisible?: boolean;
    templates?: any[];
}

interface SeatNamesListProps {
    seats: Seat[];
    categories: Category[] | Record<string, Category>; // Can be array or object
    seatNames: Record<string, string>;
    onNameChange: (seatId: string, name: string) => void;
    isDarkMode: boolean;
}

export default function SeatNamesList({
    seats,
    categories,
    seatNames,
    onNameChange,
    isDarkMode
}: SeatNamesListProps) {
    const { t, isRTL } = useLanguageContext();
    const inputRefs = React.useRef<Record<string, HTMLInputElement>>({});

    if (!seats || seats.length === 0) {
        return null;
    }

    // Convert categories to a keyed object if it's an array
    const categoriesMap: Record<string, Category> = React.useMemo(() => {
        if (!categories) return {};

        // If categories is already an object, use it directly
        if (!Array.isArray(categories)) {
            return categories as Record<string, Category>;
        }

        // If it's an array, convert to object keyed by name
        return categories.reduce((acc, cat) => {
            acc[cat.name] = cat;
            return acc;
        }, {} as Record<string, Category>);
    }, [categories]);

    // Create category order map for sorting
    const categoryOrderMap: Record<string, number> = React.useMemo(() => {
        if (!categories) return {};

        if (Array.isArray(categories)) {
            return categories.reduce((acc, cat, index) => {
                acc[cat.name] = index;
                return acc;
            }, {} as Record<string, number>);
        }

        return {};
    }, [categories]);

    // Sort seats by: 1) category order, 2) row number, 3) seat number
    const sortedSeats = React.useMemo(() => {
        return [...seats].sort((a, b) => {
            // First, sort by category order from JSON
            const categoryOrderA = categoryOrderMap[a.category] ?? 999;
            const categoryOrderB = categoryOrderMap[b.category] ?? 999;

            if (categoryOrderA !== categoryOrderB) {
                return categoryOrderA - categoryOrderB;
            }

            // Second, sort by row number
            const rowA = parseInt(a.rows.row_number) || 0;
            const rowB = parseInt(b.rows.row_number) || 0;

            if (rowA !== rowB) {
                return rowA - rowB;
            }

            // Third, sort by seat number
            const seatA = parseInt(a.seat_number) || 0;
            const seatB = parseInt(b.seat_number) || 0;

            return seatA - seatB;
        });
    }, [seats, categoryOrderMap]);

    return (
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-white'} rounded-2xl shadow-lg p-4 md:p-6 mb-4 border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            {/* Header: Title Left, Info Right */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-1.5 md:p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <svg className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className={`text-lg md:text-xl font-bold tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('ticketHolderNames')}
                    </h2>
                </div>

                {/* Info Badge */}
                <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border shadow-sm ${isDarkMode
                    ? 'bg-blue-900/20 border-blue-500/30 text-blue-200'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">
                        {t('allNamesRequired')}
                    </span>
                </div>
            </div>

            <div className="space-y-2 md:space-y-3">
                {sortedSeats.map((seat, index) => {
                    const categoryInfo = categoriesMap[seat.category];
                    const categoryColor = categoryInfo?.color || '#808080';
                    const seatIdentifier = `${seat.rows.zones.name}•${seat.rows.row_number}•${seat.seat_number}`;

                    return (
                        <div
                            key={seat.id}
                            className={`group relative p-3 md:p-4 rounded-xl transition-all duration-200 ${isDarkMode
                                ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50'
                                : 'bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-100 border border-gray-200'
                                }`}
                        >
                            {/* First line on mobile: Color indicator and seat identifier */}
                            <div className="flex items-center justify-between md:hidden mb-2">
                                <div className="flex items-center gap-3">
                                    {/* Color Indicator Circle */}
                                    <div className="flex-shrink-0 relative">
                                        <div
                                            className="w-7 h-7 rounded-full shadow-md ring-3 ring-white/20 transition-all duration-200 group-hover:scale-110"
                                            style={{
                                                backgroundColor: categoryColor
                                            }}
                                        />
                                    </div>

                                    {/* Seat Identifier */}
                                    <div className="flex-shrink-0 min-w-0 flex items-center justify-center">
                                        <div className={`font-mono text-base font-bold text-white text-center`}>
                                            {seatIdentifier}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Name Badge */}
                                {categoryInfo?.name && (
                                    <div className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                                        style={{
                                            backgroundColor: `${categoryColor}20`,
                                            color: categoryColor,
                                            border: `1px solid ${categoryColor}40`
                                        }}>
                                        {categoryInfo.name}
                                    </div>
                                )}
                            </div>

                            {/* Desktop layout: Color indicator, seat identifier, and input on same line */}
                            <div className="hidden md:flex items-center gap-4">
                                {/* Color Indicator Circle */}
                                <div className="flex-shrink-0 relative">
                                    <div
                                        className="w-10 h-10 rounded-full shadow-md ring-4 ring-white/20 transition-all duration-200 group-hover:scale-110"
                                        style={{
                                            backgroundColor: categoryColor
                                        }}
                                    />
                                    {categoryInfo?.name && (
                                        <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium shadow-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'
                                            }`}>
                                            {categoryInfo.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Seat Identifier */}
                                <div className="flex-shrink-0 min-w-0">
                                    <div className={`font-mono text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                        }`}>
                                        {seatIdentifier}
                                    </div>
                                    {categoryInfo?.name && (
                                        <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {categoryInfo.name}
                                        </div>
                                    )}
                                </div>

                                {/* Name Input */}
                                <div className="flex-1 min-w-0">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            ref={(el) => { if (el) inputRefs.current[seat.id] = el; }}
                                            value={seatNames[seat.id] || seat.name_on_ticket || ''}
                                            onChange={(e) => onNameChange(seat.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const currentIndex = sortedSeats.findIndex(s => s.id === seat.id);
                                                    const nextSeat = sortedSeats[currentIndex + 1];
                                                    if (nextSeat && inputRefs.current[nextSeat.id]) {
                                                        inputRefs.current[nextSeat.id].focus();
                                                    }
                                                }
                                            }}
                                            placeholder={t('enterName')}
                                            required
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${isDarkMode
                                                ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:bg-gray-800'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-blue-50/30'
                                                } focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isRTL() ? 'text-right pr-10 pl-4' : 'text-left'
                                                }`}
                                            dir={isRTL() ? 'rtl' : 'ltr'}
                                            style={{ fontSize: '16px' }}
                                        />
                                        <svg
                                            className={`absolute ${isRTL() ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                                } pointer-events-none`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile layout: Name input on second line */}
                            <div className="md:hidden">
                                <div className="relative">
                                    <input
                                        type="text"
                                        ref={(el) => { if (el) inputRefs.current[seat.id] = el; }}
                                        value={seatNames[seat.id] || seat.name_on_ticket || ''}
                                        onChange={(e) => onNameChange(seat.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const currentIndex = sortedSeats.findIndex(s => s.id === seat.id);
                                                const nextSeat = sortedSeats[currentIndex + 1];
                                                if (nextSeat && inputRefs.current[nextSeat.id]) {
                                                    inputRefs.current[nextSeat.id].focus();
                                                }
                                            }
                                        }}
                                        placeholder={t('enterName')}
                                        required
                                        className={`w-full pl-8 pr-3 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${isDarkMode
                                            ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:bg-gray-800'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-blue-50/30'
                                            } focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isRTL() ? 'text-right pr-8 pl-3' : 'text-left'
                                            }`}
                                        dir={isRTL() ? 'rtl' : 'ltr'}
                                        style={{ fontSize: '16px' }}
                                    />
                                    <svg
                                        className={`absolute ${isRTL() ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            } pointer-events-none`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
