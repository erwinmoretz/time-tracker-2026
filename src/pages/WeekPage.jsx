import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, parseISO, isValid, getWeek, getYear } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { GlassCard, ShadowButton, NeonButton } from '@/components/ui/Uiverse';
import { Tooltip } from '@/components/ui/Tooltip';
import { isHoliday, isWeekend, getHolidayName } from '@/utils/holidays';
import { useTimeStore } from '@/store/timeStore';
import { cn } from '@/lib/utils';
import DailyEntryForm from '@/components/DailyEntryForm';
import { X } from 'lucide-react';

const WEEKLY_LIMIT_HOURS = 39;

const WeekPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { getEntry, entries, hoursPerPT } = useTimeStore();

    // Initialize current week from URL or default to today
    const [currentDate, setCurrentDate] = useState(() => {
        const dateParam = searchParams.get('date');
        if (dateParam && isValid(parseISO(dateParam))) {
            return parseISO(dateParam);
        }
        return new Date();
    });

    const [selectedDate, setSelectedDate] = useState(null);

    // Calculate week days (Monday to Sunday, German week start)
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const weekNumber = getWeek(currentDate, { weekStartsOn: 1 });
    const year = getYear(currentDate);

    // Sync URL
    useEffect(() => {
        setSearchParams({ date: format(currentDate, 'yyyy-MM-dd') });
    }, [currentDate, setSearchParams]);

    const handlePrevWeek = () => setCurrentDate(prev => subWeeks(prev, 1));
    const handleNextWeek = () => setCurrentDate(prev => addWeeks(prev, 1));

    // Calculate weekly statistics
    const calculateWeekStats = () => {
        let totalMinutes = 0;
        let workDays = 0;
        let overtimeMinutes = 0;
        const dailyHours = [];

        weekDays.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const entry = getEntry(dateStr);

            if (entry && entry.type === 'work' && entry.start && entry.end) {
                const [sh, sm] = entry.start.split(':').map(Number);
                const [eh, em] = entry.end.split(':').map(Number);
                let diff = (eh * 60 + em) - (sh * 60 + sm) - (Number(entry.breakMinutes) || 0);
                if (diff < 0) diff = 0;
                totalMinutes += diff;
                workDays++;
                dailyHours.push({ date, hours: diff / 60 });
            } else {
                dailyHours.push({ date, hours: 0 });
            }
        });

        const totalHours = totalMinutes / 60;
        const limitMinutes = WEEKLY_LIMIT_HOURS * 60;

        if (totalMinutes > limitMinutes) {
            overtimeMinutes = totalMinutes - limitMinutes;
        }

        return {
            totalHours,
            totalMinutes,
            workDays,
            overtimeHours: overtimeMinutes / 60,
            overtimeMinutes,
            isOvertime: totalMinutes > limitMinutes,
            percentOfLimit: Math.min(100, (totalHours / WEEKLY_LIMIT_HOURS) * 100),
            dailyHours
        };
    };

    const stats = calculateWeekStats();
    const closeModal = () => setSelectedDate(null);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative pb-20">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <ShadowButton onClick={handlePrevWeek} size="sm" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
                        <ChevronLeft className="h-6 w-6" />
                    </ShadowButton>

                    <div className="text-center min-w-[280px]">
                        <h2 className="text-3xl font-bold tracking-tight text-white uppercase tracking-widest drop-shadow-md">
                            KW {weekNumber}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {format(weekStart, 'dd.MM.')} - {format(weekEnd, 'dd.MM.yyyy', { locale: de })}
                        </p>
                    </div>

                    <ShadowButton onClick={handleNextWeek} size="sm" className="rounded-full w-12 h-12 flex items-center justify-center p-0">
                        <ChevronRight className="h-6 w-6" />
                    </ShadowButton>

                    <ShadowButton onClick={() => setCurrentDate(new Date())} size="sm" className="ml-4">
                        Diese Woche
                    </ShadowButton>
                </div>
            </div>

            {/* Weekly Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className={cn(
                    "p-4 hover:scale-[1.02] transition-transform duration-300",
                    stats.isOvertime && "border-amber-500/50 bg-amber-950/20"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-primary/80 font-bold">Wochenstunden</span>
                        <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className={cn(
                        "text-3xl font-bold tracking-tight",
                        stats.isOvertime ? "text-amber-400" : "text-white"
                    )}>
                        {stats.totalHours.toFixed(1)}h
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">von {WEEKLY_LIMIT_HOURS}h Limit</p>
                </GlassCard>

                <GlassCard className={cn(
                    "p-4 hover:scale-[1.02] transition-transform duration-300",
                    stats.isOvertime && "border-red-500/50 bg-red-950/20"
                )}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={cn(
                            "text-xs uppercase tracking-widest font-bold",
                            stats.isOvertime ? "text-red-400" : "text-emerald-400"
                        )}>
                            {stats.isOvertime ? "Überstunden" : "Im Limit"}
                        </span>
                        {stats.isOvertime ? (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                        ) : (
                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                        )}
                    </div>
                    <div className={cn(
                        "text-3xl font-bold tracking-tight",
                        stats.isOvertime ? "text-red-400" : "text-emerald-400"
                    )}>
                        {stats.isOvertime ? `+${stats.overtimeHours.toFixed(1)}h` : `${(WEEKLY_LIMIT_HOURS - stats.totalHours).toFixed(1)}h`}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.isOvertime ? "Mehraufwand" : "noch verfügbar"}
                    </p>
                </GlassCard>

                <GlassCard className="p-4 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-primary/80 font-bold">Arbeitstage</span>
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-white">
                        {stats.workDays}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">von 5 Tagen</p>
                </GlassCard>

                <GlassCard className="p-4 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase tracking-widest text-primary/80 font-bold">Ø pro Tag</span>
                        <Clock className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-white">
                        {stats.workDays > 0 ? (stats.totalHours / stats.workDays).toFixed(1) : '0'}h
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Durchschnitt</p>
                </GlassCard>
            </div>

            {/* Progress Bar */}
            <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Wochenfortschritt</span>
                    <span className={cn(
                        "text-sm font-bold",
                        stats.isOvertime ? "text-red-400" : "text-primary"
                    )}>
                        {stats.percentOfLimit.toFixed(0)}%
                    </span>
                </div>
                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    {/* Regular hours bar */}
                    <div
                        className={cn(
                            "h-full transition-all duration-700 ease-out relative z-10",
                            stats.isOvertime
                                ? "bg-gradient-to-r from-primary to-amber-500"
                                : "bg-primary shadow-[0_0_20px_rgba(35,237,237,0.5)]"
                        )}
                        style={{ width: `${Math.min(100, stats.percentOfLimit)}%` }}
                    />
                    {/* Overtime indicator */}
                    {stats.isOvertime && (
                        <div
                            className="absolute top-0 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse z-20"
                            style={{
                                left: '100%',
                                width: `${((stats.overtimeHours / WEEKLY_LIMIT_HOURS) * 100)}%`,
                                maxWidth: '20%'
                            }}
                        />
                    )}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium">
                    <span>0h</span>
                    <span className="text-primary">{WEEKLY_LIMIT_HOURS}h Limit</span>
                </div>
            </GlassCard>

            {/* Daily Breakdown */}
            <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">Tagesübersicht</h3>
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(date => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const entry = getEntry(dateStr);
                        const isHol = isHoliday(dateStr);
                        const holName = getHolidayName(dateStr);
                        const isWknd = isWeekend(date);
                        const dayData = stats.dailyHours.find(d => format(d.date, 'yyyy-MM-dd') === dateStr);
                        const hours = dayData?.hours || 0;

                        let bgClass = "bg-secondary/20 hover:bg-white/10";
                        let textClass = "text-muted-foreground";

                        if (entry) {
                            if (entry.type === 'work') {
                                bgClass = "bg-emerald-500/20 border border-emerald-500/30";
                                textClass = "text-emerald-200";
                            } else if (entry.type === 'vacation') {
                                bgClass = "bg-sky-500/20 border border-sky-500/30";
                                textClass = "text-sky-200";
                            } else if (entry.type === 'sick') {
                                bgClass = "bg-rose-500/20 border border-rose-500/30";
                                textClass = "text-rose-200";
                            }
                        } else if (isHol) {
                            bgClass = "bg-red-500/10 border border-red-500/20";
                            textClass = "text-red-300";
                        } else if (isWknd) {
                            bgClass = "bg-secondary/10";
                            textClass = "text-muted-foreground/50";
                        }

                        const tooltipContent = (
                            <div className="text-center space-y-1">
                                <div className="font-bold">{format(date, 'EEEE, dd.MM.', { locale: de })}</div>
                                {isHol && <div className="text-red-400 font-bold">{holName}</div>}
                                {entry ? (
                                    <>
                                        <div className="uppercase text-[10px] tracking-widest text-primary">{entry.type}</div>
                                        {entry.start && <div>{entry.start} - {entry.end}</div>}
                                        <div className="text-lg font-bold text-primary">{hours.toFixed(1)}h</div>
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
                                        "rounded-xl p-3 cursor-pointer transition-all hover:scale-105 flex flex-col items-center gap-2 group",
                                        bgClass
                                    )}
                                >
                                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                                        {format(date, 'EEE', { locale: de })}
                                    </span>
                                    <span className={cn("text-2xl font-bold group-hover:scale-110 transition-transform", textClass)}>
                                        {format(date, 'd')}
                                    </span>
                                    {entry && entry.type === 'work' && (
                                        <div className="text-sm font-mono font-bold text-primary">
                                            {hours.toFixed(1)}h
                                        </div>
                                    )}
                                    {entry && entry.type !== 'work' && (
                                        <div className="text-[10px] uppercase tracking-widest opacity-70">
                                            {entry.type === 'vacation' ? 'Urlaub' : entry.type === 'sick' ? 'Krank' : entry.type}
                                        </div>
                                    )}
                                    {!entry && !isWknd && !isHol && (
                                        <div className="text-xs text-muted-foreground/50">--</div>
                                    )}
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            </GlassCard>

            {/* Overtime Warning Banner */}
            {stats.isOvertime && (
                <GlassCard className="p-4 border-red-500/50 bg-red-950/20">
                    <div className="flex items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-red-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-400 uppercase tracking-widest text-sm">Überstunden erkannt</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                Diese Woche wurden <span className="text-red-400 font-bold">{stats.overtimeHours.toFixed(1)} Stunden</span> über dem 39h-Limit gearbeitet.
                                Diese Stunden werden als Mehraufwand gewertet.
                            </p>
                        </div>
                    </div>
                </GlassCard>
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
                                onComplete={() => { }}
                            />
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeekPage;
