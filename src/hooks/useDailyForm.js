import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Briefcase, Palmtree, Thermometer, Clock } from 'lucide-react';
import { useTimeStore } from '@/store/timeStore';

export const TYPE_OPTIONS = [
    { id: 'work',     label: 'Arbeit',    icon: Briefcase },
    { id: 'vacation', label: 'Urlaub',    icon: Palmtree },
    { id: 'sick',     label: 'Krank',     icon: Thermometer },
    { id: 'flex',     label: 'Gleitzeit', icon: Clock },
];

const EMPTY_FORM = {
    start: '',
    end: '',
    breakMinutes: '',
    type: 'work',
    comment: '',
    activities: [],
};

/**
 * Berechnet die Nettoarbeitszeit aus Start, Ende und Pause.
 * Gibt "Xh Ym"-String zurück oder null wenn unvollständig / ungültig.
 */
export const calculatePreview = ({ start, end, breakMinutes }) => {
    if (!start || !end) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diff = (eh * 60 + em) - (sh * 60 + sm) - (Number(breakMinutes) || 0);
    if (diff <= 0) return null;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

/**
 * Validiert die Formulardaten. Gibt null zurück wenn alles OK,
 * sonst einen Fehlertext.
 */
export const validateForm = ({ start, end, breakMinutes, type }) => {
    if (type === 'work') {
        if (!start) return 'Startzeit fehlt.';
        if (!end)   return 'Endzeit fehlt.';
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin   = eh * 60 + em;
        if (endMin <= startMin) return 'Endzeit muss nach der Startzeit liegen.';
        const netMinutes = endMin - startMin - (Number(breakMinutes) || 0);
        if (netMinutes <= 0) return 'Nach Abzug der Pause verbleibt keine Arbeitszeit.';
        if (Number(breakMinutes) < 0) return 'Pausenzeit darf nicht negativ sein.';
    }
    return null;
};

/**
 * Zentraler Hook für das Tagesformular – genutzt von DailyPage und DailyEntryForm.
 *
 * @param {Date} date  — Das gewählte Datum
 */
const useDailyForm = (date) => {
    const { getEntry, addEntry, removeEntry } = useTimeStore();
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentEntry = getEntry(dateStr);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState(null);

    // Formular mit gespeicherten Daten befüllen (reagiert auf Datums- und Entry-Änderungen).
    useEffect(() => {
        setFormData(currentEntry ? {
            start:        currentEntry.start        || '',
            end:          currentEntry.end          || '',
            breakMinutes: currentEntry.breakMinutes || '',
            type:         currentEntry.type         || 'work',
            comment:      currentEntry.comment      || '',
            activities:   currentEntry.activities   || [],
        } : EMPTY_FORM);
    }, [dateStr, currentEntry]);

    // Status und Fehler beim Datumswechsel zurücksetzen
    useEffect(() => {
        setStatusMessage('');
        setError(null);
    }, [dateStr]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleTypeChange = (newType) => {
        setFormData(prev => ({ ...prev, type: newType }));
        setError(null);
    };

    const handleSave = () => {
        const validationError = validateForm(formData);
        if (validationError) {
            setError(validationError);
            return false;
        }

        addEntry({
            date:         dateStr,
            start:        formData.start,
            end:          formData.end,
            breakMinutes: Number(formData.breakMinutes) || 0,
            type:         formData.type,
            comment:      formData.comment,
            activities:   formData.activities,
        });
        setStatusMessage('Gespeichert!');
        setTimeout(() => setStatusMessage(''), 2000);
        return true;
    };

    const handleDelete = () => {
        removeEntry(dateStr);
        setFormData(EMPTY_FORM);
        setStatusMessage('Gelöscht.');
        setTimeout(() => setStatusMessage(''), 2000);
    };

    // Tätigkeiten verwalten
    const addActivity = (activity) => {
        setFormData(prev => ({
            ...prev,
            activities: [...prev.activities, { id: Date.now(), ...activity }]
        }));
    };

    const updateActivity = (id, updates) => {
        setFormData(prev => ({
            ...prev,
            activities: prev.activities.map(a => a.id === id ? { ...a, ...updates } : a)
        }));
    };

    const removeActivity = (id) => {
        setFormData(prev => ({
            ...prev,
            activities: prev.activities.filter(a => a.id !== id)
        }));
    };

    return {
        dateStr,
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
        preview: calculatePreview(formData),
    };
};

export default useDailyForm;
