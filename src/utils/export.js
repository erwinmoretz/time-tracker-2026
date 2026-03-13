/**
 * Exportiert alle Zeiteinträge als CSV-Datei (Excel-kompatibel, Semikolon-getrennt).
 * @param {Record<string, TimeEntry>} entries
 */
export const exportCSV = (entries) => {
    const rows = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date));

    const header = ['Datum', 'Typ', 'Start', 'Ende', 'Pause (min)', 'Netto (h)', 'Kommentar'];

    const dataRows = rows.map(e => {
        let netHours = '';
        if (e.start && e.end) {
            const [sh, sm] = e.start.split(':').map(Number);
            const [eh, em] = e.end.split(':').map(Number);
            const diff = (eh * 60 + em) - (sh * 60 + sm) - (Number(e.breakMinutes) || 0);
            netHours = Math.max(0, diff / 60).toFixed(2).replace('.', ',');
        }
        return [
            e.date,
            e.type,
            e.start || '',
            e.end || '',
            e.breakMinutes || '0',
            netHours,
            (e.comment || '').replace(/;/g, ','), // Semikolons im Kommentar escapen
        ];
    });

    const csvContent = [header, ...dataRows]
        .map(row => row.join(';'))
        .join('\r\n');

    // BOM für Excel-Kompatibilität (UTF-8)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `zeiterfassung-2026-${today()}.csv`);
};

/**
 * Exportiert alle Einträge als JSON-Datei (Backup).
 * @param {Record<string, TimeEntry>} entries
 */
export const exportJSON = (entries) => {
    const payload = {
        exportedAt: new Date().toISOString(),
        year: 2026,
        entries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    triggerDownload(blob, `zeiterfassung-2026-backup-${today()}.json`);
};

const today = () => new Date().toISOString().slice(0, 10);

const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
