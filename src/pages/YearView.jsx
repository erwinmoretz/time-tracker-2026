import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, eachMonthOfInterval, endOfYear, startOfYear, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/Uiverse';
import { useTimeStore } from '@/store/timeStore';
import { isHoliday, isWeekend } from '@/utils/holidays';

const YearView = () => {
    const navigate = useNavigate();
    const { getEntry } = useTimeStore();
    const yearStart = startOfYear(new Date(2026, 0, 1));
    const yearEnd = endOfYear(new Date(2026, 0, 1));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const handleMonthClick = (monthDate) => {
        // Navigate to Month Page set to this month
        navigate(`/month?date=${format(monthDate, 'yyyy-MM-dd')}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Jahresübersicht 2026
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {months.map(month => (
                    <div key={month.toString()} onClick={() => handleMonthClick(month)} className="cursor-pointer transition-transform hover:scale-105">
                        <MonthGrid
                            month={month}
                            getEntry={getEntry}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const MonthGrid = ({ month, getEntry }) => {
    const startDay = startOfMonth(month);
    const endDay = endOfMonth(month);
    const days = eachDayOfInterval({ start: startDay, end: endDay });
    const startDayOfWeek = (getDay(startDay) + 6) % 7;
    const emptyDays = Array(startDayOfWeek).fill(null);

    return (
        <GlassCard className="h-full flex flex-col p-3 bg-secondary/10 border-white/5 pointer-events-none hover:bg-white/5 transition-colors">
            {/* pointer-events-none on card to let parent div handle click */}
            <div className="font-bold text-center text-primary mb-2 uppercase tracking-widest text-xs border-b border-white/5 pb-1">
                {format(month, 'MMMM', { locale: de })}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[8px] text-center mb-1">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                    <div key={d} className="text-muted-foreground font-bold opacity-70">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const entry = getEntry(dateStr);
                    const isHol = isHoliday(dateStr);
                    const isWknd = isWeekend(date);

                    let bgClass = "bg-secondary/30 text-muted-foreground"; // Default

                    if (isHol) {
                        bgClass = "bg-red-500/20 text-red-300";
                    } else if (entry) {
                        if (entry.type === 'work') bgClass = "bg-emerald-500/30 text-emerald-200 border border-emerald-500/20";
                        else if (entry.type === 'vacation') bgClass = "bg-sky-500/30 text-sky-200 border border-sky-500/20";
                        else if (entry.type === 'sick') bgClass = "bg-rose-500/30 text-rose-200 border border-rose-500/20";
                        else bgClass = "bg-amber-500/30 text-amber-200";
                    } else if (isWknd) {
                        bgClass = "opacity-20";
                    }

                    return (
                        <div
                            key={dateStr}
                            className={`aspect-square rounded-[2px] flex items-center justify-center text-[8px] font-medium ${bgClass}`}
                        >
                            {format(date, 'd')}
                        </div>
                    )
                })}
            </div>
        </GlassCard>
    );
};

export default YearView;
