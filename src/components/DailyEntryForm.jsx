import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { GlowingInput } from '@/components/ui/Uiverse';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { isWeekend, getHolidayName } from '@/utils/holidays';
import useDailyForm, { TYPE_OPTIONS } from '@/hooks/useDailyForm';

const DailyEntryForm = ({ date, onComplete }) => {
    const {
        formData,
        currentEntry,
        statusMessage,
        error,
        handleChange,
        handleTypeChange,
        handleSave,
        handleDelete,
        addActivity,
        updateActivity,
        removeActivity,
        preview,
    } = useDailyForm(date);

    const [newActivityLabel, setNewActivityLabel] = useState('');

    const dateStr = format(date, 'yyyy-MM-dd');
    const isWknd = isWeekend(date);
    const holidayName = getHolidayName(dateStr);

    const onSave = () => {
        if (handleSave() && onComplete) onComplete();
    };

    const onDelete = () => {
        handleDelete();
        if (onComplete) setTimeout(onComplete, 1000);
    };

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
                {TYPE_OPTIONS.map((option) => (
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

            {/* Time Inputs — nur bei Arbeit relevant */}
            {formData.type === 'work' && (
                <>
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
                                min="0"
                            />
                        </div>
                        <div className="flex items-end">
                            <div className={cn(
                                "w-full h-12 rounded-lg flex items-center justify-center text-lg font-semibold transition-all",
                                preview
                                    ? "bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/.3)]"
                                    : "bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                            )}>
                                {preview || "--"}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Tätigkeitsliste */}
            <div className="space-y-2">
                <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Tätigkeiten</Label>

                {formData.activities.length > 0 && (
                    <div className="space-y-1.5">
                        {formData.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-2">
                                <GlowingInput
                                    value={activity.label}
                                    onChange={(e) => updateActivity(activity.id, { label: e.target.value })}
                                    placeholder="Tätigkeit beschreiben..."
                                    className="flex-1 text-sm h-9"
                                />
                                <GlowingInput
                                    type="number"
                                    value={activity.hours}
                                    onChange={(e) => updateActivity(activity.id, { hours: e.target.value })}
                                    placeholder="h"
                                    min="0"
                                    step="0.5"
                                    className="w-16 text-sm h-9 text-center"
                                />
                                <button
                                    onClick={() => removeActivity(activity.id)}
                                    className="text-[hsl(var(--destructive))] hover:opacity-70 transition-opacity p-1"
                                    aria-label="Tätigkeit entfernen"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <GlowingInput
                        value={newActivityLabel}
                        onChange={(e) => setNewActivityLabel(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newActivityLabel.trim()) {
                                addActivity({ label: newActivityLabel.trim(), hours: '' });
                                setNewActivityLabel('');
                            }
                        }}
                        placeholder="Neue Tätigkeit (Enter)"
                        className="flex-1 text-sm h-9"
                    />
                    <button
                        onClick={() => {
                            if (newActivityLabel.trim()) {
                                addActivity({ label: newActivityLabel.trim(), hours: '' });
                                setNewActivityLabel('');
                            }
                        }}
                        className="px-3 h-9 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Kommentar */}
            <div className="space-y-1.5">
                <Label className="text-xs text-[hsl(var(--muted-foreground))] ml-1">Notiz</Label>
                <GlowingInput
                    name="comment"
                    placeholder="Allgemeine Notiz..."
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            {/* Validierungsfehler */}
            {error && (
                <p className="text-xs text-red-400 text-center font-medium">{error}</p>
            )}

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between">
                <button
                    onClick={onDelete}
                    disabled={!currentEntry}
                    className="text-[hsl(var(--destructive))] text-sm font-medium hover:opacity-70 transition-opacity disabled:opacity-30"
                >
                    Löschen
                </button>

                <button
                    onClick={onSave}
                    className="px-6 py-2.5 rounded-lg font-medium text-sm bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity"
                >
                    {statusMessage || "Speichern"}
                </button>
            </div>
        </div>
    );
};

export default DailyEntryForm;
