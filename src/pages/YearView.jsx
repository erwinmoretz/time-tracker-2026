import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, eachMonthOfInterval, endOfYear, startOfYear } from 'date-fns';
import { useTimeStore } from '@/store/timeStore';
import MonthGrid from '@/components/ui/MonthGrid';

const YearView = () => {
    const navigate = useNavigate();
    const { getEntry } = useTimeStore();
    const yearStart = startOfYear(new Date(2026, 0, 1));
    const yearEnd = endOfYear(new Date(2026, 0, 1));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const handleMonthClick = (monthDate) => {
        navigate(`/month?date=${format(monthDate, 'yyyy-MM-dd')}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Jahresübersicht 2026
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {months.map(month => (
                    <div
                        key={month.toString()}
                        onClick={() => handleMonthClick(month)}
                        className="cursor-pointer transition-transform hover:scale-105"
                    >
                        <MonthGrid
                            month={month}
                            getEntry={getEntry}
                            size="sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YearView;
