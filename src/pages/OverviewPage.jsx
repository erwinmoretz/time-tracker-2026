import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { GlassCard } from '@/components/ui/Uiverse';
import { useTimeStore } from '@/store/timeStore';
import { cn } from '@/lib/utils';
import { Clock, Briefcase, Calendar, TrendingUp } from 'lucide-react';

const OverviewPage = () => {
    const { getStats, targetPT } = useTimeStore();
    const stats = getStats();

    // Apple-style progress bar
    const progressPercent = Math.min(100, Math.max(0, (stats.totalPT / targetPT) * 100));

    // Progress bar coloring
    const isOverTarget = stats.totalPT >= targetPT;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Auswertung</h2>
                <p className="text-muted-foreground font-medium">Dein Status für 2026</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Arbeitsstunden</CardTitle>
                        <Clock className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(35,237,237,0.5)]" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">{stats.realWorkHours.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Reine Arbeitszeit</p>
                    </div>
                </GlassCard>
                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Gesamt</CardTitle>
                        <Calendar className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(35,237,237,0.5)]" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight text-white">{stats.workedHours.toFixed(1)}</div>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Inkl. Urlaub/Krank</p>
                    </div>
                </GlassCard>
                <GlassCard className="hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary/80 uppercase tracking-widest">Genutzte PT</CardTitle>
                        <Briefcase className="h-5 w-5 text-orange-400" />
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

            <GlassCard className="mt-8">
                <div className="bg-transparent border-b border-white/5 pb-4 mb-4">
                    <CardTitle className="text-lg text-white">Vertragsfortschritt</CardTitle>
                    <CardDescription className="text-muted-foreground">Fortschritt bezogen auf {targetPT} Personentage.</CardDescription>
                </div>
                <div>
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden shadow-inner border border-white/5 relative">
                        {/* Background glowing line */}
                        <div className="absolute inset-0 bg-primary/5"></div>
                        <div
                            className={cn("h-full transition-all duration-1000 ease-out rounded-r-full shadow-[0_0_20px_rgba(35,237,237,0.5)] relative z-10", isOverTarget ? "bg-green-500" : "bg-primary")}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="mt-3 flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span>0%</span>
                        <span className="text-primary">{progressPercent.toFixed(1)}%</span>
                        <span>100%</span>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default OverviewPage;
