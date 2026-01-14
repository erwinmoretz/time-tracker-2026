import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, eachMonthOfInterval, endOfYear, startOfYear, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { de } from 'date-fns/locale';
import { GlassCard } from '@/components/ui/Uiverse';
import { useTimeStore } from '@/store/timeStore';

const YearPage = () => {
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
        <GlassCard className="h-full flex flex-col p-4 bg-secondary/10 border-white/5 pointer-events-none"> 
           {/* pointer-events-none on card to let parent div handle click */}
            <div className="font-bold text-center text-primary mb-4 uppercase tracking-widest text-sm border-b border-white/5 pb-2">
                {format(month, 'MMMM', { locale: de })}
            </div>
            <div className="grid grid-cols-7 gap-1 text-[8px] text-center mb-1">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                    <div key={d} className="text-muted-foreground font-bold">{d}</div>
                ))}
                
                 {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map(date => {
                   const isWork = getEntry(format(date, 'yyyy-MM-dd'));
                   return (
                        <div key={date.toString()} className={`aspect-square rounded-sm ${isWork ? 'bg-primary/50' : 'bg-white/5'}`} />
                   ) 
                })}
            </div>
        </GlassCard>
    );
};

export default YearPage;
