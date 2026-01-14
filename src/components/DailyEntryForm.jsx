import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save, Trash2, Clock, Briefcase, Palmtree, Thermometer, ArrowRight } from 'lucide-react';
import { useTimeStore } from '@/store/timeStore';
import { NeonButton, GlowingInput, ToggleSwitch } from '@/components/ui/Uiverse';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { isWeekend, getHolidayName } from '@/utils/holidays';

const DailyEntryForm = ({ date, onComplete }) => {
    const { getEntry, addEntry, removeEntry } = useTimeStore();
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentEntry = getEntry(dateStr);

    // Form State
    const [formData, setFormData] = useState({
        start: '',
        end: '',
        breakMinutes: '',
        type: 'work',
        comment: ''
    });
    const [statusMessage, setStatusMessage] = useState('');

    // Load data
    useEffect(() => {
        if (currentEntry) {
            setFormData({
                start: currentEntry.start || '',
                end: currentEntry.end || '',
                breakMinutes: currentEntry.breakMinutes || '',
                type: currentEntry.type || 'work',
                comment: currentEntry.comment || ''
            });
        } else {
            setFormData({
                start: '',
                end: '',
                breakMinutes: '',
                type: 'work',
                comment: ''
            });
        }
    }, [dateStr, currentEntry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (newType) => {
        setFormData(prev => ({ ...prev, type: newType }));
    };

    const handleSave = () => {
        addEntry({
            date: dateStr,
            start: formData.start,
            end: formData.end,
            breakMinutes: Number(formData.breakMinutes) || 0,
            type: formData.type,
            comment: formData.comment
        });
        setStatusMessage('Gespeichert!');
        setTimeout(() => {
            setStatusMessage('');
            if (onComplete) onComplete();
        }, 1000);
    };

    const handleDelete = () => {
        removeEntry(dateStr);
        setStatusMessage('Gelöscht.');
        setTimeout(() => {
            setStatusMessage('');
            if (onComplete) onComplete();
        }, 1000);
    };

    const calculatePreview = () => {
        if (!formData.start || !formData.end) return null;
        const [sh, sm] = formData.start.split(':').map(Number);
        const [eh, em] = formData.end.split(':').map(Number);
        let diff = (eh * 60 + em) - (sh * 60 + sm) - (Number(formData.breakMinutes) || 0);
        if (diff < 0) diff = 0;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return `${hours}h ${minutes}m`;
    };

    const typeOptions = [
        { id: 'work', label: 'Arbeit', icon: Briefcase },
        { id: 'vacation', label: 'Urlaub', icon: Palmtree },
        { id: 'sick', label: 'Krank', icon: Thermometer },
        { id: 'flex', label: 'Gleitzeit', icon: Clock },
    ];

    const isWknd = isWeekend(date);
    const holidayName = getHolidayName(dateStr);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">{format(date, 'dd.MM.yyyy')}</h3>
                <p className={cn("text-muted-foreground font-medium uppercase text-xs tracking-widest", (isWknd || holidayName) && "text-amber-500")}>
                    {holidayName ? holidayName : format(date, 'EEEE')}
                </p>
            </div>

            {/* Type Selection */}
            <div className="flex flex-wrap gap-2 justify-center">
                {typeOptions.map((option) => (
                    <NeonButton
                        key={option.id}
                        active={formData.type === option.id}
                        onClick={() => handleTypeChange(option.id)}
                        className="flex-1 min-w-[80px] px-2 py-3 text-[10px]"
                    >
                        <option.icon className="w-5 h-5 mx-auto mb-1.5" />
                        {option.label}
                    </NeonButton>
                ))}
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-end">
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-primary/70 ml-1 tracking-widest">Start</Label>
                    <GlowingInput
                        name="start"
                        type="time"
                        value={formData.start}
                        onChange={handleChange}
                        className="text-center text-xl h-16 bg-black/40 border-primary/20 text-white font-mono"
                    />
                </div>
                <div className="pb-5 text-primary/50">
                    <ArrowRight className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-primary/70 ml-1 tracking-widest">Ende</Label>
                    <GlowingInput
                        name="end"
                        type="time"
                        value={formData.end}
                        onChange={handleChange}
                        className="text-center text-xl h-16 bg-black/40 border-primary/20 text-white font-mono"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Pause</Label>
                    <GlowingInput
                        name="breakMinutes"
                        type="number"
                        placeholder="0"
                        value={formData.breakMinutes}
                        onChange={handleChange}
                        className="text-center"
                    />
                </div>
                <div className="flex items-end pb-1">
                    <div className={cn(
                        "w-full h-12 rounded-xl flex items-center justify-center gap-2 border font-bold transition-all",
                        calculatePreview() ? "border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(21,83,93,0.2)]" : "border-border bg-secondary/30 text-muted-foreground"
                    )}>
                        {calculatePreview() || "--"}
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-xs uppercase font-bold text-muted-foreground ml-1">Notiz</Label>
                <GlowingInput
                    name="comment"
                    placeholder="Tätigkeit..."
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            <div className="pt-4 flex items-center justify-between">
                <button
                    onClick={handleDelete}
                    disabled={!currentEntry}
                    className="text-destructive text-sm font-medium hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-destructive"
                >
                    Eintrag löschen
                </button>

                <NeonButton onClick={handleSave} className="px-8 shadow-lg">
                    {statusMessage || "Speichern"}
                </NeonButton>
            </div>
        </div>
    );
};

export default DailyEntryForm;
