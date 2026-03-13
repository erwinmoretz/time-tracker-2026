import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInMinutes, parse } from 'date-fns';

/**
 * @typedef {Object} TimeEntry
 * @property {string} date          - ISO-Datum (YYYY-MM-DD)
 * @property {string} start         - HH:mm
 * @property {string} end           - HH:mm
 * @property {number} breakMinutes  - Pause in Minuten
 * @property {'work'|'vacation'|'sick'|'flex'} type
 * @property {string} comment
 * @property {Array}  activities    - Tätigkeitsliste (optional)
 */

/**
 * Netto-Arbeitszeit eines Eintrags in Stunden.
 * Gibt 0 zurück wenn Start oder Ende fehlen.
 */
const entryNetHours = (entry) => {
    if (!entry.start || !entry.end) return 0;
    const startDate = parse(entry.start, 'HH:mm', new Date());
    const endDate   = parse(entry.end,   'HH:mm', new Date());
    const diff = differenceInMinutes(endDate, startDate) - (entry.breakMinutes || 0);
    return Math.max(0, diff / 60);
};

export const useTimeStore = create(
    persist(
        (set, get) => ({
            entries:    {},
            targetPT:   214.5,
            hoursPerPT: 8,

            addEntry: (entry) => set((state) => ({
                entries: { ...state.entries, [entry.date]: entry }
            })),

            removeEntry: (date) => set((state) => {
                const newEntries = { ...state.entries };
                delete newEntries[date];
                return { entries: newEntries };
            }),

            getEntry: (date) => get().entries[date],

            /**
             * Einheitliche Statistik-Berechnung.
             *
             * Regeln:
             *  - work:     Nettostunden / hoursPerPT → PT (Dezimalwert)
             *  - vacation: immer 1 PT pro Tag (= 1 bezahlter Abwesenheitstag)
             *  - sick:     immer 1 PT pro Tag
             *  - flex:     0 PT (Gleitzeitausgleich, kein Vertragsfortschritt)
             *
             * Zurückgegebene Felder:
             *  - workHours:       Nur echte Arbeitszeit (Typ "work")
             *  - workPT:          workHours / hoursPerPT
             *  - vacationDays:    Anzahl Urlaubstage
             *  - sickDays:        Anzahl Krankheitstage
             *  - specialPT:       vacationDays + sickDays (je 1 PT)
             *  - totalPT:         workPT + specialPT
             *  - remainingPT:     targetPT - totalPT
             */
            getStats: () => {
                const { entries, targetPT, hoursPerPT } = get();
                const allEntries = Object.values(entries);

                const workEntries     = allEntries.filter(e => e.type === 'work');
                const vacationEntries = allEntries.filter(e => e.type === 'vacation');
                const sickEntries     = allEntries.filter(e => e.type === 'sick');

                const workHours     = workEntries.reduce((sum, e) => sum + entryNetHours(e), 0);
                const workPT        = workHours / hoursPerPT;
                const vacationDays  = vacationEntries.length;
                const sickDays      = sickEntries.length;
                const specialPT     = vacationDays + sickDays;
                const totalPT       = workPT + specialPT;
                const remainingPT   = targetPT - totalPT;

                return {
                    workHours,
                    workPT,
                    vacationDays,
                    sickDays,
                    specialPT,
                    totalPT,
                    remainingPT,
                };
            },
        }),
        {
            name: 'time-tracker-2026-storage',
        }
    )
);
