import React, { useState } from 'react';
import { eachMonthOfInterval, endOfYear, startOfYear } from 'date-fns';
import { useTimeStore } from '@/store/timeStore';
import MonthGrid from '@/components/ui/MonthGrid';
import ModalOverlay from '@/components/ui/ModalOverlay';
import DailyEntryForm from '@/components/DailyEntryForm';

const CalendarPage = () => {
    const { getEntry } = useTimeStore();
    const yearStart = startOfYear(new Date(2026, 0, 1));
    const yearEnd = endOfYear(new Date(2026, 0, 1));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    const [selectedDate, setSelectedDate] = useState(null);

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
                        getEntry={getEntry}
                        onDayClick={setSelectedDate}
                        size="md"
                    />
                ))}
            </div>

            {selectedDate && (
                <ModalOverlay onClose={() => setSelectedDate(null)}>
                    <DailyEntryForm date={selectedDate} onComplete={() => setSelectedDate(null)} />
                </ModalOverlay>
            )}
        </div>
    );
};

export default CalendarPage;
