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
                "flex flex-col items-center justify-center w-24 h-24 bg-gradient-to-b from-card to-secondary rounded-2xl p-3 shadow-xl border-2 border-transparent transition-all duration-300 ease-in-out",
                "hover:border-primary/50 hover:shadow-primary/20",
                "peer-checked:border-primary peer-checked:from-primary/10 peer-checked:to-card peer-checked:translate-y-[-0.5rem] peer-checked:shadow-[0_0_20px_rgba(35,237,237,0.2)]"
            )}>
                <div className={cn(
                    "w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border-2 border-white/10 transition-all duration-300 mb-2",
                    "group-hover:border-primary/50 group-hover:bg-primary/10",
                    "peer-checked:border-primary peer-checked:bg-primary/20"
                )}>
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary peer-checked:text-primary transition-colors" />
                </div>

                <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-primary peer-checked:text-primary transition-colors">
                    {label}
                </p>

                <div className="h-0.5 w-0 bg-primary rounded-full mt-2 transition-all duration-300 group-hover:w-full peer-checked:w-full" />
            </div>
        </label>
    );
};
