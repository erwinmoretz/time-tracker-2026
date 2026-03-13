import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/Card';
import { GlassCard } from '@/components/ui/Uiverse';
import { useTimeStore } from '@/store/timeStore';
import { cn } from '@/lib/utils';
import { Clock, Briefcase, Calendar, TrendingUp, Stethoscope, Download, FileJson } from 'lucide-react';
import { exportCSV, exportJSON } from '@/utils/export';

const OverviewPage = () => {
    const { getStats, targetPT, entries } = useTimeStore();
    const stats = getStats();

    const progressPercent = Math.min(100, Math.max(0, (stats.totalPT / targetPT) * 100));
    const isOverTarget = stats.totalPT >= targetPT;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Auswertung</h2>
                    <p className="text-muted-foreground font-medium">Dein Status für 2026</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => exportCSV(entries)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        CSV Export
                    </button>
                    <button
                        onClick={() => exportJSON(entries)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                        <FileJson className="w-4 h-4" />
                        JSON Backup
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Arbeitsstunden</CardTitle>
                        <Clock className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(35,237,237,0.5)]" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">{stats.workHours.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Netto Arbeitszeit</p>
                    </div>
                </GlassCard>

                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Arbeit PT</CardTitle>
                        <Briefcase className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">{stats.workPT.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Personentage (Arbeit)</p>
                    </div>
                </GlassCard>

                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-sky-400/80 uppercase tracking-widest">Urlaub / Krank</CardTitle>
                        <Stethoscope className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">
                            {stats.vacationDays}<span className="text-sky-400">/</span>{stats.sickDays}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{stats.specialPT} PT gesamt</p>
                    </div>
                </GlassCard>

                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Genutzte PT</CardTitle>
                        <Calendar className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">{stats.totalPT.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Von {targetPT} PT</p>
                    </div>
                </GlassCard>

                <GlassCard className={cn(
                    "hover:scale-[1.02] transition-transform duration-300",
                    stats.remainingPT < 0 ? "border-red-500/50 bg-red-950/20" : ""
                )}>
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className={cn("text-sm font-medium uppercase tracking-widest", stats.remainingPT < 0 ? "text-red-400" : "text-emerald-400")}>
                            Verbleibend
                        </CardTitle>
                        <TrendingUp className={cn("h-5 w-5", stats.remainingPT < 0 ? "text-red-500" : "text-emerald-400")} />
                    </div>
                    <div>
                        <div className={cn("text-3xl font-bold tracking-tight", stats.remainingPT < 0 ? "text-red-400" : "text-white")}>
                            {stats.remainingPT.toFixed(2)}
                        </div>
                        <p className={cn("text-xs font-medium mt-1", stats.remainingPT < 0 ? "text-red-500" : "text-emerald-500")}>
                            Personentage
                        </p>
                    </div>
                </GlassCard>
            </div>

            {/* Vertragsfortschritt */}
            <GlassCard className="mt-8">
                <div className="bg-transparent border-b border-white/5 pb-4 mb-4">
                    <CardTitle className="text-lg text-white">Vertragsfortschritt</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {stats.totalPT.toFixed(2)} von {targetPT} Personentagen ({progressPercent.toFixed(1)}%)
                    </CardDescription>
                </div>
                <div>
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                        <div className="absolute inset-0 bg-primary/5" />
                        <div
                            className={cn(
                                "h-full transition-all duration-1000 ease-out rounded-r-full relative z-10",
                                isOverTarget
                                    ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                                    : "bg-primary shadow-[0_0_20px_rgba(35,237,237,0.5)]"
                            )}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="mt-3 flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span>0%</span>
                        <span className="text-primary">{progressPercent.toFixed(1)}%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Aufschlüsselung */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                        <div className="text-emerald-400 font-bold text-lg">{stats.workPT.toFixed(1)}</div>
                        <div className="text-muted-foreground uppercase tracking-widest">Arbeit PT</div>
                    </div>
                    <div>
                        <div className="text-sky-400 font-bold text-lg">{stats.vacationDays}</div>
                        <div className="text-muted-foreground uppercase tracking-widest">Urlaubstage</div>
                    </div>
                    <div>
                        <div className="text-rose-400 font-bold text-lg">{stats.sickDays}</div>
                        <div className="text-muted-foreground uppercase tracking-widest">Krankheitstage</div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default OverviewPage;
