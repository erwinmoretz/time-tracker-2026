import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInMinutes, parse, format } from 'date-fns';

/**
 * @typedef {Object} TimeEntry
 * @property {string} date - ISO date string (YYYY-MM-DD)
 * @property {string} start - HH:mm
 * @property {string} end - HH:mm
 * @property {number} breakMinutes - duration in minutes
 * @property {string} type - 'work' | 'vacation' | 'sick' | 'flex'
 * @property {string} comment
 */

/**
 * @typedef {Object} TimeStore
 * @property {Record<string, TimeEntry>} entries
 * @property {number} targetPT - Total Personentage target
 * @property {number} hoursPerPT - Hours per Personentag (usually 8 or 7.8, let's assume 8 for now or configurable)
 * @property {Function} addEntry - (entry: TimeEntry) => void
 * @property {Function} removeEntry - (date: string) => void
 * @property {Function} getEntry - (date: string) => TimeEntry | undefined
 * @property {Function} getStats - () => { workedHours: number, workedPT: number, remainingPT: number }
 */

const calculateHours = (start, end, breakMinutes) => {
    if (!start || !end) return 0;
    const startDate = parse(start, 'HH:mm', new Date());
    const endDate = parse(end, 'HH:mm', new Date());
    let diff = differenceInMinutes(endDate, startDate);
    diff -= (breakMinutes || 0);
    return Math.max(0, diff / 60);
};

export const useTimeStore = create(
    persist(
        (set, get) => ({
            entries: {},
            targetPT: 214.5,
            hoursPerPT: 8, // Standard, but can be updated

            addEntry: (entry) => set((state) => ({
                entries: { ...state.entries, [entry.date]: entry }
            })),

            removeEntry: (date) => set((state) => {
                const newEntries = { ...state.entries };
                delete newEntries[date];
                return { entries: newEntries };
            }),

            getEntry: (date) => get().entries[date],

            getStats: () => {
                const { entries, targetPT, hoursPerPT } = get();
                let totalHours = 0;
                let usedPT = 0;

                Object.values(entries).forEach(entry => {
                    if (entry.type === 'work') {
                        totalHours += calculateHours(entry.start, entry.end, entry.breakMinutes);
                        // PT calculation logic: is it strictly by hours or by day? 
                        // Usually 1 work day = 1 PT if worked > X? 
                        // For now, let's treat it as hours / hoursPerPT for precision, or 1 day = 1 PT.
                        // Re-reading user request: "insgesamt geleistete Stunden und Personentage (PT)".
                        // Often PT is 8h. Let's accumulate hours and divide by 8 for "Calculated PT" 
                        // OR count days. Let's do hours/8 for now as a decimal.

                    } else if (['vacation', 'sick'].includes(entry.type)) {
                        // These usually count as PT taken/paid?
                        // Let's assume they count as 1 PT.
                        usedPT += 1;
                        totalHours += hoursPerPT;
                    }
                });

                // Add calculated PT from work hours
                // If the contract says 214.5 PT, usually that covers the whole year including vacation?
                // Let's separate "Worked PT" from "Taken PT"?
                // User asked: "insgesamt geleistete Stunden und Personentage (PT) im Vergleich zum Vertrag (214,5 PT)"
                // I will calculate PT purely based on hours / 8 + special days.

                // Revised logic: 
                // Work entries -> hours / 8
                // Non-work entries (vacation/sick) -> 1 PT (8h)

                const workHours = Object.values(entries)
                    .filter(e => e.type === 'work')
                    .reduce((acc, e) => acc + calculateHours(e.start, e.end, e.breakMinutes), 0);

                usedPT += (workHours / hoursPerPT);

                return {
                    workedHours: totalHours + workHours, // Total "paid" hours? No, "geleistete" usually means real work.
                    // Let's return specific buckets
                    realWorkHours: workHours,
                    totalPT: usedPT,
                    remainingPT: targetPT - usedPT
                };
            }
        }),
        {
            name: 'time-tracker-2026-storage',
        }
    )
);
