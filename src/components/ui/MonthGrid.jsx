import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/Uiverse';
import { cn } from '@/lib/utils';
import { getDayClasses } from '@/utils/entryColors';

/**
 * Einheitliche Monatsraster-Komponente für Jahres- und Kalenderansicht.
 *
 * Props:
 *  - month: Date             — Beliebiger Tag des darzustellenden Monats
 *  - getEntry: (dateStr) => entry | undefined
 *  - onDayClick?: (date: Date) => void  — Falls gesetzt, sind Tage klickbar
 *  - size: 'sm' | 'md'      — 'sm' für kompakte Jahresansicht, 'md' für Kalender
 *  - className?: string
 */
const MonthGrid = ({ month, getEntry, onDayClick, size = 'md', className }) => {
    const startDay = startOfMonth(month);
    const endDay = endOfMonth(month);
    const days = eachDayOfInterval({ start: startDay, end: endDay });
    const startDayOfWeek = (getDay(startDay) + 6) % 7;
    const emptyDays = Array(startDayOfWeek).fill(null);

    const isSm = size === 'sm';
    const clickable = typeof onDayClick === 'function';

    return (
        <GlassCard
            className={cn(
                'h-full flex flex-col bg-secondary/10 border-white/5',
                isSm ? 'p-3' : 'p-4',
                clickable ? '' : 'pointer-events-none',
                className
            )}
        >
            {/* Monatsname */}
            <div className={cn(
                'font-bold text-center text-primary uppercase tracking-widest border-b border-white/5',
                isSm ? 'text-[10px] mb-2 pb-1' : 'text-sm mb-4 pb-2'
            )}>
                {format(month, 'MMMM', { locale: de })}
            </div>

            {/* Wochentage-Header */}
            <div className={cn(
                'grid grid-cols-7 text-center mb-1',
                isSm ? 'gap-0.5 text-[8px]' : 'gap-1 text-[10px]'
            )}>
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                    <div key={d} className="text-muted-foreground font-bold opacity-70">{d}</div>
                ))}
            </div>

            {/* Tage */}
            <div className={cn('grid grid-cols-7', isSm ? 'gap-0.5' : 'gap-1 text-xs text-center content-start')}>
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}

                {days.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const entry = getEntry(dateStr);
                    const dayClasses = getDayClasses(entry, date, dateStr, size);

                    return (
                        <div
                            key={dateStr}
                            onClick={clickable ? () => onDayClick(date) : undefined}
                            className={cn(
                                'aspect-square flex items-center justify-center rounded transition-all duration-200',
                                isSm ? 'text-[8px] font-medium rounded-[2px]' : 'cursor-pointer',
                                dayClasses
                            )}
                            title={entry ? entry.type : format(date, 'dd.MM.yyyy')}
                        >
                            {format(date, 'd')}
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};

export default MonthGrid;
