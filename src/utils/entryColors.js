import { isHoliday, isWeekend } from '@/utils/holidays';

/**
 * Gibt die CSS-Klasse für einen Tageseintrag zurück.
 * Nutzt die globalen .entry-* Utility-Klassen aus index.css.
 * size: 'sm' (Jahresansicht) | 'md' (Kalenderansicht)
 */
export const getDayClasses = (entry, date, dateStr, size = 'md') => {
    const isHol = isHoliday(dateStr);
    const isWknd = isWeekend(date);

    if (entry) {
        const typeClass = {
            work:     'entry-work',
            vacation: 'entry-vacation',
            sick:     'entry-sick',
            flex:     'entry-flex',
        }[entry.type];
        if (typeClass) return typeClass;
    }
    if (isHol)  return 'entry-holiday';
    if (isWknd) return size === 'sm' ? 'opacity-20' : 'opacity-30';
    return 'bg-secondary/30 text-muted-foreground hover:bg-white/10 hover:text-white';
};
