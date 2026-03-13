import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, addDays, parseISO, isValid } from 'date-fns';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Trash2, Clock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { isWeekend, getHolidayName } from '@/utils/holidays';
import { cn } from '@/lib/utils';
import useDailyForm, { TYPE_OPTIONS } from '@/hooks/useDailyForm';

const DailyPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [date, setDate] = useState(() => {
        const dateParam = searchParams.get('date');
        if (dateParam && isValid(parseISO(dateParam))) return parseISO(dateParam);
        return new Date();
    });

    const {
        formData,
        currentEntry,
        statusMessage,
        error,
        handleChange,
        handleTypeChange,
        handleSave,
        handleDelete,
        preview,
    } = useDailyForm(date);

    const dateStr = format(date, 'yyyy-MM-dd');
    const holidayName = getHolidayName(dateStr);
    const isWknd = isWeekend(date);

    // URL synchron halten
    React.useEffect(() => {
        setSearchParams({ date: dateStr });
    }, [dateStr, setSearchParams]);

    const navigateDay = (amount) => setDate(prev => addDays(prev, amount));

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 mb-20">
            {/* Header / Date Navigation */}
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" size="icon" onClick={() => navigateDay(-1)} className="rounded-full shadow-sm hover:shadow-md transition-all">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{format(date, 'dd.MM.yyyy')}</h2>
                    <p className={cn("text-muted-foreground font-medium mt-1 uppercase text-sm tracking-wide", (isWknd || holidayName) && "text-amber-600")}>
                        {holidayName ? holidayName : format(date, 'EEEE')}
                    </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => navigateDay(1)} className="rounded-full shadow-sm hover:shadow-md transition-all">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Erfassung</CardTitle>
                    <CardDescription>Wähle deine Tätigkeit und Zeiten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Typ-Auswahl */}
                    <div className="bg-secondary p-1 rounded-xl flex gap-1 border border-border">
                        {TYPE_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleTypeChange(option.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center p-3 rounded-lg text-sm font-semibold transition-all duration-200",
                                    formData.type === option.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <option.icon className="h-4 w-4 mr-2" />
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Zeitfelder — nur bei Arbeit */}
                    {formData.type === 'work' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                                <div className="space-y-2">
                                    <Label htmlFor="start" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Start</Label>
                                    <Input
                                        id="start"
                                        name="start"
                                        type="time"
                                        className="h-14 text-2xl font-normal bg-secondary border border-border rounded-xl px-4 text-center focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white"
                                        value={formData.start}
                                        onChange={handleChange}
                                    />
                                </div>
                                <ArrowRight className="text-muted-foreground/30 hidden md:block w-8 h-8" />
                                <div className="space-y-2">
                                    <Label htmlFor="end" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Ende</Label>
                                    <Input
                                        id="end"
                                        name="end"
                                        type="time"
                                        className="h-14 text-2xl font-normal bg-secondary border border-border rounded-xl px-4 text-center focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white"
                                        value={formData.end}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="breakMinutes" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Pause (Min)</Label>
                                    <Input
                                        id="breakMinutes"
                                        name="breakMinutes"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        className="h-12 bg-secondary border border-border rounded-xl px-4 text-center focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white"
                                        value={formData.breakMinutes}
                                        onChange={handleChange}
                                    />
                                </div>
                                {preview && (
                                    <div className="flex flex-col justify-end pb-1">
                                        <div className="h-12 flex items-center justify-center gap-2 bg-primary/20 text-primary-foreground rounded-xl font-bold border border-primary/30">
                                            <Clock className="h-4 w-4" />
                                            {preview}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="comment" className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Kommentar</Label>
                        <Input
                            id="comment"
                            name="comment"
                            placeholder="Zusätzliche Notizen..."
                            className="h-12 bg-secondary border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 text-white"
                            value={formData.comment}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Validierungsfehler */}
                    {error && (
                        <p className="text-sm text-red-400 font-medium">{error}</p>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between p-8 pt-0">
                    <Button variant="ghost" onClick={handleDelete} disabled={!currentEntry} className="text-destructive font-medium hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="mr-2 h-4 w-4" /> Löschen
                    </Button>
                    <div className="flex items-center gap-4">
                        {statusMessage && (
                            <span className="text-sm text-green-500 font-bold animate-in fade-in">
                                {statusMessage}
                            </span>
                        )}
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8 h-10 shadow-lg shadow-blue-900/20 transition-transform active:scale-95">
                            <Save className="mr-2 h-4 w-4" /> Speichern
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default DailyPage;
