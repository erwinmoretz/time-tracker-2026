import { isWeekend, format, parseISO } from 'date-fns';
export { isWeekend };

export const HOLIDAYS_2026_HESSEN = {
    '2026-01-01': 'Neujahr',
    '2026-04-03': 'Karfreitag',
    '2026-04-06': 'Ostermontag',
    '2026-05-01': 'Tag der Arbeit',
    '2026-05-14': 'Christi Himmelfahrt',
    '2026-05-25': 'Pfingstmontag',
    '2026-06-04': 'Fronleichnam',
    '2026-10-03': 'Tag der Deutschen Einheit',
    '2026-12-25': '1. Weihnachtstag',
    '2026-12-26': '2. Weihnachtstag',
};

export const getHolidayName = (dateStr) => {
    return HOLIDAYS_2026_HESSEN[dateStr] || null;
};

export const isHoliday = (dateStr) => {
    return !!HOLIDAYS_2026_HESSEN[dateStr];
};

export const isWorkDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (isWeekend(date)) return false;
    if (isHoliday(dateStr)) return false;
    return true;
};
