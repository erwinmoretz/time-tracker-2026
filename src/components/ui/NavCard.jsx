import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavCard = ({ href, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(href) && href !== '/' || location.pathname === href;

    return (
        <Link to={href} className="group relative">
            <div className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-transparent transition-all duration-300 ease-in-out cursor-pointer",
                "bg-gradient-to-b from-transparent to-transparent", // Default transparent
                "hover:border-primary/30 hover:bg-white/5 hover:-translate-y-1",
                isActive && "border-primary bg-gradient-to-b from-primary/10 to-card shadow-[0_0_20px_rgba(35,237,237,0.2)] -translate-y-1"
            )}>
                <div className={cn(
                    "p-2 rounded-lg bg-white/5 border border-white/10 transition-colors",
                    isActive && "bg-primary/20 border-primary text-primary",
                    "group-hover:text-primary group-hover:border-primary/50"
                )}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className={cn(
                        "text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors",
                        isActive && "text-primary",
                        "group-hover:text-primary"
                    )}>
                        {label}
                    </span>
                    <div className={cn(
                        "h-0.5 bg-primary rounded-full mt-1 transition-all duration-300 w-0",
                        (isActive || "group-hover:w-full") // Hover animation handled by group-hover
                    )}
                        style={{ width: isActive ? '100%' : undefined }}
                    />
                </div>
            </div>
        </Link>
    );
};
