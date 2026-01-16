import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Clock, BarChart, CalendarDays } from 'lucide-react';
import { NavCard } from '@/components/ui/NavCard';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { href: '/month', label: 'Monat', icon: Clock },
        { href: '/week', label: 'Woche', icon: CalendarDays },
        { href: '/year', label: 'Jahr', icon: Calendar },
        { href: '/overview', label: 'Stats', icon: BarChart },
    ];

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] font-sans text-[hsl(var(--foreground))] flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <div className="container mx-auto max-w-5xl px-4 flex h-14 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-base">TimeTracker</span>
                    </div>
                    <nav className="flex items-center space-x-1">
                        {navItems.map((item) => (
                            <NavCard key={item.href} {...item} />
                        ))}
                    </nav>
                </div>
            </header>
            <main className="container mx-auto max-w-5xl px-4 py-6 flex-1">
                {children}
            </main>
        </div>
    );
};

export default Layout;

