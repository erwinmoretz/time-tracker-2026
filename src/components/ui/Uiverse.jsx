import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- Neon Button ---
// Based on Cyberpunk/Neon aesthetics.
// High contrast border, glow on hover.
export const NeonButton = ({ children, className, onClick, active, ...props }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative group px-6 py-2 bg-transparent overflow-hidden rounded-full transition-all duration-300",
                "border border-primary text-primary hover:text-primary-foreground",
                "hover:shadow-[0_0_20px_rgba(35,237,237,0.4)]", // Sherpa 400 Glow
                active && "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(35,237,237,0.6)] font-bold",
                className
            )}
            {...props}
        >
            <span className={cn(
                "absolute inset-0 w-0 bg-primary transition-all duration-[250ms] ease-out group-hover:w-full",
                active && "w-full"
            )}></span>
            <span className="relative z-10 tracking-wide uppercase text-xs">{children}</span>
        </button>
    );
};

// --- Glass Card ---
// Premium frosted glass effect for Dark Mode.
// Matches 'Create budgets' card style: potential gradient or dark feel.
export const GlassCard = ({ children, className }) => {
    return (
        <div className={cn(
            "relative bg-[#131517] backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl overflow-hidden", // Deep dark background
            "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
            "after:absolute after:-top-20 after:-right-20 after:w-40 after:h-40 after:bg-primary/20 after:blur-[60px] after:rounded-full after:pointer-events-none", // Ambient glow
            className
        )}>
            {children}
        </div>
    );
};

// --- Fancy Toggle Switch ---
// Smooth, animated switch.
export const ToggleSwitch = ({ checked, onChange, label }) => {
    return (
        <label className="flex items-center cursor-pointer gap-3">
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
                <div className={cn(
                    "w-12 h-7 bg-secondary rounded-full border border-input shadow-inner transition-colors duration-300",
                    checked && "bg-primary border-primary"
                )}></div>
                <div className={cn(
                    "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300",
                    checked && "translate-x-5"
                )}></div>
            </div>
            {label && <span className="font-medium text-sm text-foreground select-none">{label}</span>}
        </label>
    );
};

// --- Glowing Input ---
// An input that glows when focused.
export const GlowingInput = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn(
                "flex h-12 w-full rounded-xl border border-input bg-secondary/50 px-4 py-2 text-sm text-foreground shadow-sm transition-all duration-300",
                "placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(21,83,93,0.3)]",
                className
            )}
            {...props}
        />
    );
});
GlowingInput.displayName = "GlowingInput";

// --- Shadow Button ---
// Animated glowing button.
export const ShadowButton = ({ children, onClick, className, size = "md" }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "border-none text-white rounded-[7px] font-bold uppercase transition-all duration-500",
                "bg-primary shadow-[0_0_25px_rgba(35,237,237,0.6)]",
                "hover:shadow-[0_0_5px_rgba(35,237,237,1),0_0_25px_rgba(35,237,237,1),0_0_50px_rgba(35,237,237,1),0_0_100px_rgba(35,237,237,1)]",
                size === "sm" ? "py-2 px-4 text-xs tracking-[2px]" : "py-[10px] px-[20px] text-[17px] tracking-[4px]",
                className
            )}
        >
            {children}
        </button>
    );
};
