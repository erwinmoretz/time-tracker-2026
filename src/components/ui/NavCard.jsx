import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavCard = ({ href, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(href) && href !== '/' || location.pathname === href;

    return (
        <Link to={href} className="group relative">
            <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                "text-[hsl(var(--muted-foreground))]",
                "hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--card))]",
                isActive && "text-[hsl(var(--foreground))] bg-[hsl(var(--card))]"
            )}>
                <Icon className="w-4 h-4" />
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    isActive && "text-[hsl(var(--foreground))]"
                )}>
                    {label}
                </span>
            </div>
            {/* Active underline indicator */}
            <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[hsl(var(--primary))] rounded-full transition-all duration-200",
                isActive ? "w-6" : "w-0"
            )} />
        </Link>
    );
};

