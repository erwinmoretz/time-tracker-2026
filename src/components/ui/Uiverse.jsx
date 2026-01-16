import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- Minimal Button ---
// Clean, simple button with subtle hover state
export const NeonButton = ({ children, className, onClick, active, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative px-5 py-2.5 rounded-lg transition-all duration-200",
                "border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]",
                "hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]",
                "hover:bg-[hsl(var(--primary)/.05)]",
                active && "bg-[hsl(var(--primary))] text-white border-transparent font-medium",
                className
            )}
            {...props}
        >
            <span className="relative z-10 text-xs font-medium tracking-wide">{children}</span>
        </button>
    );
};

// --- Clean Card ---
// Minimal card with subtle border, no glows
export const GlassCard = ({ children, className }) => {
    return (
        <div className={cn(
            "bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5",
            "transition-colors duration-200",
            className
        )}>
            {children}
        </div>
    );
};

// --- Toggle Switch ---
// Clean, iOS-style toggle
export const ToggleSwitch = ({ checked, onChange, label }) => {
    return (
        <label className="flex items-center cursor-pointer gap-3">
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
                <div className={cn(
                    "w-11 h-6 bg-[hsl(var(--muted))] rounded-full transition-colors duration-200",
                    checked && "bg-[hsl(var(--primary))]"
                )}></div>
                <div className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
                    checked && "translate-x-5"
                )}></div>
            </div>
            {label && <span className="font-medium text-sm text-[hsl(var(--foreground))] select-none">{label}</span>}
        </label>
    );
};

// --- Clean Input ---
// Minimal input with subtle focus state
export const GlowingInput = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-12 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm text-[hsl(var(--foreground))]",
                "placeholder:text-[hsl(var(--muted-foreground))]",
                "focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]",
                "transition-all duration-200",
                className
            )}
            {...props}
        />
    );
});
GlowingInput.displayName = "GlowingInput";

// --- Minimal Button ---
// Clean button with subtle styling
export const ShadowButton = ({ children, onClick, className, size = "md" }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "text-[hsl(var(--muted-foreground))] rounded-lg font-medium transition-all duration-200",
                "border border-[hsl(var(--border))] bg-transparent",
                "hover:bg-[hsl(var(--card-hover))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground)/.2)]",
                size === "sm" ? "py-2 px-3 text-xs" : "py-2.5 px-4 text-sm",
                className
            )}
        >
            {children}
        </button>
    );
};

// --- Primary Button ---
// Solid blue button for main actions
export const PrimaryButton = ({ children, onClick, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                "bg-[hsl(var(--primary))] text-white",
                "hover:bg-[hsl(var(--primary-muted))]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
            {children}
        </button>
    );
};

