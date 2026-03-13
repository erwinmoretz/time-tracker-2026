import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from '@/components/ui/Uiverse';

/**
 * Zentrales Modal-Overlay für die gesamte App.
 *
 * Props:
 *  - onClose: () => void   — Wird beim Klick auf X oder Escape aufgerufen
 *  - children: ReactNode   — Inhalt des Modals
 */
const ModalOverlay = ({ onClose, children }) => {
    // ESC-Taste schließt das Modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-md">
                <button
                    onClick={onClose}
                    aria-label="Schließen"
                    className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
                <GlassCard className="border-primary/30 shadow-[0_0_50px_rgba(21,83,93,0.3)]">
                    {children}
                </GlassCard>
            </div>
        </div>
    );
};

export default ModalOverlay;
