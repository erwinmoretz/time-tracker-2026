import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export const Tooltip = ({ content, children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10 // 10px above
        });
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <div
            className={cn("relative inline-block", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible && createPortal(
                <div
                    className="fixed z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-2 bg-[#131517]/90 backdrop-blur-md border border-primary/30 text-xs text-white rounded-xl shadow-[0_0_15px_rgba(35,237,237,0.3)] animate-in fade-in zoom-in-95 duration-200"
                    style={{ left: position.x, top: position.y }}
                >
                    {content}
                    {/* Tiny arrow at bottom */}
                    <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-[#131517] border-r border-b border-primary/30 transform -translate-x-1/2 rotate-45"></div>
                </div>,
                document.body
            )}
        </div>
    );
};
