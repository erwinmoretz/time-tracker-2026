import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Clock, BarChart } from 'lucide-react';
import { NavCard } from '@/components/ui/NavCard';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { href: '/month', label: 'Monatsansicht', icon: Clock },
        { href: '/year', label: 'Jahresplanung', icon: Calendar },
        { href: '/overview', label: 'Auswertung', icon: BarChart },
    ];

    return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto max-w-6xl px-6 flex h-14 items-center">
                    <div className="mr-8 flex items-center space-x-2">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="font-bold inline-block tracking-tight">TimeTracker 2026</span>
                    </div>
                    <nav className="flex items-center space-x-2">
                        {navItems.map((item) => (
                            <NavCard key={item.href} {...item} />
                        ))}
                    </nav>
                </div>
            </header>
            <main className="container mx-auto max-w-6xl px-6 py-8 flex-1">
                {children}
            </main>
        </div>
    );
};

export default Layout;
