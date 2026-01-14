import React, { useState } from 'react';
import { format, eachMonthOfInterval, endOfYear, startOfYear, eachDayOfInterval, startOfMonth, endOfMonth, getDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/Uiverse';
import { isHoliday, isWeekend } from '@/utils/holidays';
import { useTimeStore } from '@/store/timeStore';
import { cn } from '@/lib/utils';
import DailyEntryForm from '@/components/DailyEntryForm';
import { X } from 'lucide-react';

const CalendarPage = () => {
    const { getEntry } = useTimeStore();
    const yearStart = startOfYear(new Date(2026, 0, 1));
    const yearEnd = endOfYear(new Date(2026, 0, 1));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    // Modal State
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDayClick = (date) => {
        setSelectedDate(date);
    };

    const closeModal = () => {
        setSelectedDate(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Jahresüberblick 2026
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {months.map(month => (
                    <MonthGrid
                        key={month.toString()}
                        month={month}
                        onDayClick={handleDayClick}
                        getEntry={getEntry}
                    />
                ))}
            </div>

            {/* Modal Overlay */}
            {selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md">
                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <GlassCard className="border-primary/30 shadow-[0_0_50px_rgba(21,83,93,0.3)]">
                            <DailyEntryForm
                                date={selectedDate}
                                onComplete={() => {/* Optional: close modal automatically? stick to manual close for now to let user see feedback */ }}
                            />
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
    );
};

const MonthGrid = ({ month, onDayClick, getEntry }) => {
    const startDay = startOfMonth(month);
    const endDay = endOfMonth(month);
    const days = eachDayOfInterval({ start: startDay, end: endDay });
    const startDayOfWeek = (getDay(startDay) + 6) % 7;
    const emptyDays = Array(startDayOfWeek).fill(null);

    return (
        <GlassCard className="h-full flex flex-col p-4 bg-secondary/10 border-white/5">
            <div className="font-bold text-center text-primary mb-4 uppercase tracking-widest text-sm border-b border-white/5 pb-2">
                {format(month, 'MMMM', { locale: de })}
            </div>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                    <div key={d} className="text-muted-foreground font-bold">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center content-start">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isWknd = isWeekend(date);
                    const isHol = isHoliday(dateStr);
                    const entry = getEntry(dateStr);

                    let bgClass = "bg-secondary/30 text-muted-foreground hover:bg-white/10 hover:text-white";

                    if (isToday(date)) {
                        bgClass = "bg-primary text-white shadow-[0_0_10px_rgba(21,83,93,0.8)] font-bold scale-110 z-10";
                    } else if (isHol) {
                        bgClass = "bg-red-900/30 text-red-200 border border-red-900/50";
                    } else if (entry) {
                        if (entry.type === 'work') bgClass = "bg-emerald-900/40 text-emerald-200 border border-emerald-800/50 shadow-[0_0_5px_rgba(16,185,129,0.2)]";
                        else if (entry.type === 'vacation') bgClass = "bg-sky-900/40 text-sky-200 border border-sky-800/50";
                        else if (entry.type === 'sick') bgClass = "bg-rose-900/40 text-rose-200 border border-rose-800/50";
                        else bgClass = "bg-amber-900/40 text-amber-200 border border-amber-800/50";
                    } else if (isWknd) {
                        bgClass = "opacity-30";
                    }

                    return (
                        <div
                            key={dateStr}
                            onClick={() => onDayClick(date)}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded transition-all duration-200 cursor-pointer",
                                bgClass
                            )}
                            title={entry ? `${entry.type}` : format(date, 'dd.MM.yyyy')}
                        >
                            {format(date, 'd')}
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
};

export default CalendarPage;
