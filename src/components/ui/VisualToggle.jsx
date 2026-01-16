import React from 'react';
import { cn } from '@/lib/utils';

export const VisualToggle = ({ icon: Icon, label, checked, onChange, name }) => {
    return (
        <label className="cursor-pointer relative group">
            <input
                type="radio"
                name={name}
                checked={checked}
                onChange={onChange}
                className="hidden peer"
            />
            <div className={cn(
                "flex flex-col items-center justify-center w-20 h-20 bg-[hsl(var(--card))] rounded-xl p-3 border border-[hsl(var(--border))] transition-all duration-200",
                "hover:border-[hsl(var(--primary))]",
                "peer-checked:border-[hsl(var(--primary))] peer-checked:bg-[hsl(var(--primary)/.1)]"
            )}>
                <Icon className={cn(
                    "w-5 h-5 mb-2 transition-colors",
                    checked ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]"
                )} />

                <p className={cn(
                    "font-medium text-[10px] uppercase tracking-wider transition-colors",
                    checked ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
                )}>
                    {label}
                </p>
            </div>
        </label>
    );
};

