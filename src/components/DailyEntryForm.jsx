import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Save, Trash2, Clock, Briefcase, Palmtree, Thermometer, ArrowRight } from 'lucide-react';
import { useTimeStore } from '@/store/timeStore';
import { GlowingInput } from '@/components/ui/Uiverse';
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
        <div className="space-y-5 p-5">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                    {format(date, 'dd. MMMM yyyy', { locale: de })}
                </h3>
                <p className={cn(
                    "text-sm text-[hsl(var(--muted-foreground))] mt-1",
                    (isWknd || holidayName) && "text-amber-500"
                )}>
                    {holidayName ? holidayName : format(date, 'EEEE', { locale: de })}
                </p>
            </div>

            {/* Type Selection */}
            <div className="flex gap-2 justify-center">
                {typeOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleTypeChange(option.id)}
                        className={cn(
                            "flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all duration-200",
                            formData.type === option.id
                                ? "bg-[hsl(var(--primary))] text-white border-transparent"
                                : "bg-transparent border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
                        )}
                    >
                        <option.icon className="w-4 h-4 mx-auto mb-1" />
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <div className="space-y-1.5">
                    <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Start</Label>
                    <GlowingInput
                        name="start"
                        type="time"
                        value={formData.start}
                        onChange={handleChange}
                        className="text-center text-lg h-14 font-mono"
                    />
                </div>
                <div className="pb-4 text-[hsl(var(--muted-foreground))]">
                    <ArrowRight className="w-4 h-4" />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Ende</Label>
                    <GlowingInput
                        name="end"
                        type="time"
                        value={formData.end}
                        onChange={handleChange}
                        className="text-center text-lg h-14 font-mono"
                    />
                </div>
            </div>

            {/* Break & Preview */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Pause (min)</Label>
                    <GlowingInput
                        name="breakMinutes"
                        type="number"
                        placeholder="30"
                        value={formData.breakMinutes}
                        onChange={handleChange}
                        className="text-center"
                    />
                </div>
                <div className="flex items-end">
                    <div className={cn(
                        "w-full h-12 rounded-lg flex items-center justify-center text-lg font-semibold transition-all",
                        calculatePreview()
                            ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/.3)]"
                            : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                    )}>
                        {calculatePreview() || "--"}
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
                <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Notiz</Label>
                <GlowingInput
                    name="comment"
                    placeholder="Tätigkeit..."
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between">
                <button
                    onClick={handleDelete}
                    disabled={!currentEntry}
                    className="text-[hsl(var(--destructive))] text-sm font-medium hover:opacity-70 transition-opacity disabled:opacity-30"
                >
                    Löschen
                </button>

                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-lg font-medium text-sm bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity"
                >
                    {statusMessage || "Speichern"}
                </button>
            </div>
        </div>
    );
};

export default DailyEntryForm;

