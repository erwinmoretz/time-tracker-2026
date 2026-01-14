import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, addMonths, subMonths, parseISO, isValid } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, List, Grid } from 'lucide-react';
import { GlassCard, NeonButton, ShadowButton } from '@/components/ui/Uiverse';
import { VisualToggle } from '@/components/ui/VisualToggle';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { isHoliday, isWeekend, getHolidayName } from '@/utils/holidays';
import { useTimeStore } from '@/store/timeStore';
import { cn } from '@/lib/utils';
import DailyEntryForm from '@/components/DailyEntryForm';

const MonthPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { getEntry } = useTimeStore();

    // Initialize current month from URL or default to today
    const [currentDate, setCurrentDate] = useState(() => {
        const dateParam = searchParams.get('date');
        if (dateParam && isValid(parseISO(dateParam))) {
            return parseISO(dateParam);
        }
        return new Date();
    });

    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [selectedDate, setSelectedDate] = useState(null); // For Modal

    // Sync URL
    useEffect(() => {
        setSearchParams({ date: format(currentDate, 'yyyy-MM-dd') });
    }, [currentDate, setSearchParams]);

    const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

    const startDay = startOfMonth(currentDate);
    const endDay = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDay, end: endDay });
    const startDayOfWeek = (getDay(startDay) + 6) % 7;
    const emptyDays = Array(startDayOfWeek).fill(null);

    const closeModal = () => setSelectedDate(null);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative pb-20">
            {/* Header / Config */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <ShadowButton onClick={handlePrevMonth} size="sm" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
                        <ChevronLeft className="h-6 w-6" />
                    </ShadowButton>

                    <h2 className="text-3xl font-bold tracking-tight text-white uppercase tracking-widest min-w-[200px] text-center drop-shadow-md">
                        {format(currentDate, 'MMMM yyyy', { locale: de })}
                    </h2>

                    <ShadowButton onClick={handleNextMonth} size="sm" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
                        <ChevronRight className="h-6 w-6" />
                    </ShadowButton>

                    <ShadowButton onClick={() => setCurrentDate(new Date())} size="sm" className="ml-4">
                        Heute
                    </ShadowButton>
                </div>

                <div className="flex bg-transparent gap-4">
                    <VisualToggle
                        icon={Grid}
                        label="Kalender"
                        checked={viewMode === 'grid'}
                        onChange={() => setViewMode('grid')}
                        name="viewMode"
                    />
                    <VisualToggle
                        icon={List}
                        label="Liste"
                        checked={viewMode === 'list'}
                        onChange={() => setViewMode('list')}
                        name="viewMode"
                    />
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <GlassCard className="p-6">
                    <div className="grid grid-cols-7 gap-1 text-sm text-center mb-4 border-b border-white/10 pb-4">
                        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                            <div key={d} className="text-primary font-bold uppercase tracking-widest">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                        {days.map(date => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const entry = getEntry(dateStr);
                            const isHol = isHoliday(dateStr);
                            const holName = getHolidayName(dateStr);
                            const isWknd = isWeekend(date);

                            let bgClass = "bg-secondary/20 hover:bg-white/10 text-muted-foreground";
                            if (isToday(date)) bgClass = "bg-primary text-white shadow-glow border-primary scale-105 z-10";
                            else if (entry) {
                                if (entry.type === 'work') bgClass = "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30";
                                else if (entry.type === 'vacation') bgClass = "bg-sky-500/20 text-sky-200 border border-sky-500/30";
                                else if (entry.type === 'sick') bgClass = "bg-rose-500/20 text-rose-200 border border-rose-500/30";
                            }
                            else if (isHol) bgClass = "bg-red-500/10 text-red-300 border border-red-500/20";

                            const tooltipContent = (
                                <div className="text-center space-y-1">
                                    <div className="font-bold">{format(date, 'dd.MM.yyyy')}</div>
                                    {isHol && <div className="text-red-400 font-bold">{holName}</div>}
                                    {entry ? (
                                        <>
                                            <div className="uppercase text-[10px] tracking-widest text-primary">{entry.type}</div>
                                            {entry.start && <div>{entry.start} - {entry.end}</div>}
                                            {entry.comment && <div className="italic opacity-70 max-w-[150px] truncate">{entry.comment}</div>}
                                        </>
                                    ) : (
                                        <div className="opacity-50">Kein Eintrag</div>
                                    )}
                                </div>
                            );

                            return (
                                <Tooltip key={dateStr} content={tooltipContent} className="w-full">
                                    <div
                                        onClick={() => setSelectedDate(date)}
                                        className={cn(
                                            "aspect-square rounded-xl p-2 cursor-pointer transition-all hover:scale-105 border border-transparent flex flex-col justify-between group",
                                            bgClass
                                        )}
                                    >
                                        <span className="font-bold group-hover:scale-110 transition-transform">{format(date, 'd')}</span>
                                        {entry && (
                                            <div className="text-[10px] truncate font-mono opacity-80 group-hover:opacity-100">
                                                {entry.start}-{entry.end}
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                </GlassCard>
            ) : (
                <div className="space-y-2">
                    {days.map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const entry = getEntry(dateStr);
                        const isHol = isHoliday(dateStr);
                        const isWknd = isWeekend(date);
                        const dayName = format(date, 'EEEE', { locale: de });
                        const holName = getHolidayName(dateStr);

                        if (isWknd && !entry) return null; // Optional: Hide empty weekends in list? Or keep them. User didn't specify. Keeping for completeness.

                        return (
                            <GlassCard
                                key={dateStr}
                                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                                onClick={() => setSelectedDate(date)} // Enable editing from list too
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 text-center font-bold text-lg", isWknd || isHol ? "text-red-400" : "text-white")}>
                                        {format(date, 'dd')}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{dayName} {holName && <span className="text-red-400 text-xs ml-2">({holName})</span>}</div>
                                        <div className="text-xs text-muted-foreground">{format(date, 'MMMM yyyy', { locale: de })}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {entry ? (
                                        <>
                                            <div className="px-3 py-1 rounded-full bg-secondary text-xs uppercase font-bold tracking-wider border border-white/10">
                                                {entry.type}
                                            </div>
                                            <div className="text-sm font-mono text-primary">
                                                {entry.start} - {entry.end}
                                            </div>
                                            <div className="hidden md:block text-xs text-muted-foreground w-32 truncate text-right">
                                                {entry.comment}
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">--:--</span>
                                    )}
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

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
                                onComplete={() => {/* Optional reload? Store updates automatically */ }}
                            />
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthPage;
